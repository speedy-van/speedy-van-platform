import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { db, type Prisma } from "@speedy-van/db";
import { ok, fail, paginated } from "@speedy-van/shared";
import { requireAdmin } from "../../middleware/auth";
import { cancelBooking } from "../../services/booking.service";
import {
  recordStatusChange,
  createTrackingEvent,
} from "../../services/tracking.service";
import { calculatePriceForSlot } from "../../services/pricing.service";

const app = new Hono();
app.use("*", requireAdmin);

const DRAFT_ID_PREFIX = "draft_";
const MAX_MERGED_BOOKINGS = 1000;

function isObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function text(source: Record<string, unknown>, key: string): string {
  const value = source[key];
  return typeof value === "string" ? value.trim() : "";
}

function numberValue(source: Record<string, unknown>, key: string): number {
  const value = source[key];
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function optionalNumberValue(source: Record<string, unknown>, key: string): number | null {
  const value = source[key];
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function optionalBooleanValue(source: Record<string, unknown>, key: string): boolean | null {
  const value = source[key];
  return typeof value === "boolean" ? value : null;
}

function draftId(id: string): string | null {
  return id.startsWith(DRAFT_ID_PREFIX) ? id.slice(DRAFT_ID_PREFIX.length) : null;
}

function parseDraftState(payload: string): Record<string, unknown> | null {
  try {
    const parsed = JSON.parse(payload) as unknown;
    if (!isObject(parsed)) return null;
    const state = parsed.state;
    return isObject(state) ? state : null;
  } catch {
    return null;
  }
}

function isBookingReference(value: unknown): value is string {
  return typeof value === "string" && /^SVR-\d{4}-[A-Z2-9]{6}$/.test(value);
}

function addressValue(source: Record<string, unknown>, key: "pickup" | "dropoff"): string {
  const value = source[key];
  if (!isObject(value)) return "";
  return typeof value.address === "string" ? value.address.trim() : "";
}

function postcodeValue(source: Record<string, unknown>, key: "pickup" | "dropoff"): string {
  const value = source[key];
  if (!isObject(value)) return "";
  return typeof value.postcode === "string" ? value.postcode.trim() : "";
}

function coordinateValue(source: Record<string, unknown>, key: "pickup" | "dropoff", coord: "lat" | "lng"): number {
  const value = source[key];
  if (!isObject(value)) return 0;
  const coordinate = value[coord];
  return typeof coordinate === "number" && Number.isFinite(coordinate) ? coordinate : 0;
}

function scheduledDateValue(source: Record<string, unknown>): Date | null {
  const date = text(source, "selectedDate");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return null;
  const parsed = new Date(`${date}T12:00:00Z`);
  return Number.isFinite(parsed.getTime()) ? parsed : null;
}

function draftStage(source: Record<string, unknown>): string {
  const step = numberValue(source, "step");
  if (source.checkoutLocked === true) return "Checkout started";
  if (step >= 5) return "Payment details";
  if (step >= 4) return "Date selected";
  if (step >= 3) return "Items selected";
  if (step >= 2) return "Journey started";
  return "Service selected";
}

function draftItems(source: Record<string, unknown>) {
  const items = source.items;
  if (!Array.isArray(items)) return [];
  return items.flatMap((item, index) => {
    if (!isObject(item)) return [];
    const name = typeof item.name === "string" ? item.name.trim() : "";
    const quantity = typeof item.quantity === "number" && Number.isInteger(item.quantity) ? item.quantity : 0;
    if (!name || quantity <= 0) return [];
    return [{
      id: `draft_item_${index}`,
      name,
      quantity,
    }];
  });
}

function draftFieldAvailability(source: Record<string, unknown>) {
  const pickupAddress = addressValue(source, "pickup");
  const dropoffAddress = addressValue(source, "dropoff");
  return {
    customerName: text(source, "customerName").length > 0,
    customerEmail: text(source, "customerEmail").length > 0,
    customerPhone: text(source, "customerPhone").length > 0,
    pickupAddress: pickupAddress.length > 0,
    pickupPostcode: postcodeValue(source, "pickup").length > 0,
    pickupFloor: optionalNumberValue(source, "pickupFloor") !== null,
    pickupHasLift: optionalBooleanValue(source, "pickupHasLift") !== null,
    pickupPropertyType: text(source, "pickupPropertyType").length > 0,
    pickupCarryMetres: optionalNumberValue(source, "pickupCarryMetres") !== null,
    dropoffAddress: dropoffAddress.length > 0,
    dropoffPostcode: postcodeValue(source, "dropoff").length > 0,
    dropoffFloor: optionalNumberValue(source, "dropoffFloor") !== null,
    dropoffHasLift: optionalBooleanValue(source, "dropoffHasLift") !== null,
    dropoffPropertyType: text(source, "dropoffPropertyType").length > 0,
    dropoffCarryMetres: optionalNumberValue(source, "dropoffCarryMetres") !== null,
    distanceMiles: optionalNumberValue(source, "distanceMiles") !== null,
    hasNarrowAccess: optionalBooleanValue(source, "hasNarrowAccess") !== null,
    hasPermitZone: optionalBooleanValue(source, "hasPermitZone") !== null,
    helpersCount: optionalNumberValue(source, "helpersCount") !== null,
    needsPacking: optionalBooleanValue(source, "needsPacking") !== null,
    needsAssembly: optionalBooleanValue(source, "needsAssembly") !== null,
    assemblyType: text(source, "assemblyType").length > 0,
    assemblyQty: optionalNumberValue(source, "assemblyQty") !== null,
    items: Array.isArray(source.items),
    price: optionalNumberValue(source, "clientTotal") !== null && numberValue(source, "clientTotal") > 0,
    scheduledAt: scheduledDateValue(source) !== null,
    selectedTimeSlot: text(source, "selectedTimeSlot").length > 0,
    paidAt: false,
  };
}

function draftMatchesSearch(source: Record<string, unknown>, q?: string): boolean {
  if (!q) return true;
  const needle = q.trim().toLowerCase();
  if (!needle) return true;
  const haystack = [
    text(source, "bookingRef"),
    text(source, "customerName"),
    text(source, "customerEmail"),
    text(source, "customerPhone"),
    text(source, "serviceName"),
    text(source, "serviceSlug"),
    addressValue(source, "pickup"),
    addressValue(source, "dropoff"),
    postcodeValue(source, "pickup"),
    postcodeValue(source, "dropoff"),
    ...draftItems(source).map((item) => item.name),
  ].join(" ").toLowerCase();
  return haystack.includes(needle);
}

function draftToBookingShape(draft: {
  id: string;
  email: string | null;
  payload: string;
  savedAt: Date;
  updatedAt: Date;
  expiresAt: Date;
}) {
  const state = parseDraftState(draft.payload);
  if (!state || !isBookingReference(state.bookingRef)) return null;
  const scheduledAt = scheduledDateValue(state);
  const totalPrice = numberValue(state, "clientTotal");
  const customerEmail = text(state, "customerEmail") || draft.email || "";
  const customerName = text(state, "customerName") || (customerEmail ? "Customer pending name" : "Customer pending");
  const serviceSlug = text(state, "serviceSlug") || "pending";
  const serviceName = text(state, "serviceName") || "Service pending";
  const pickupFloor = optionalNumberValue(state, "pickupFloor");
  const pickupHasLift = optionalBooleanValue(state, "pickupHasLift");
  const dropoffFloor = optionalNumberValue(state, "dropoffFloor");
  const dropoffHasLift = optionalBooleanValue(state, "dropoffHasLift");
  const helpersCount = optionalNumberValue(state, "helpersCount");
  const needsPacking = optionalBooleanValue(state, "needsPacking");
  const needsAssembly = optionalBooleanValue(state, "needsAssembly");
  const assemblyQty = optionalNumberValue(state, "assemblyQty");

  return {
    id: `${DRAFT_ID_PREFIX}${draft.id}`,
    reference: state.bookingRef,
    customerName,
    customerEmail,
    customerPhone: text(state, "customerPhone"),
    serviceSlug,
    serviceName,
    serviceVariant: text(state, "serviceVariant") || null,
    pickupAddress: addressValue(state, "pickup") || "Pickup pending",
    pickupPostcode: postcodeValue(state, "pickup"),
    pickupLat: coordinateValue(state, "pickup", "lat"),
    pickupLng: coordinateValue(state, "pickup", "lng"),
    pickupFloor,
    pickupHasLift,
    pickupPropertyType: text(state, "pickupPropertyType") || null,
    pickupCarryMetres: optionalNumberValue(state, "pickupCarryMetres"),
    dropoffAddress: addressValue(state, "dropoff") || null,
    dropoffPostcode: postcodeValue(state, "dropoff"),
    dropoffLat: coordinateValue(state, "dropoff", "lat"),
    dropoffLng: coordinateValue(state, "dropoff", "lng"),
    dropoffFloor,
    dropoffHasLift,
    dropoffPropertyType: text(state, "dropoffPropertyType") || null,
    dropoffCarryMetres: optionalNumberValue(state, "dropoffCarryMetres"),
    hasNarrowAccess: optionalBooleanValue(state, "hasNarrowAccess"),
    hasPermitZone: optionalBooleanValue(state, "hasPermitZone"),
    distanceMiles: optionalNumberValue(state, "distanceMiles"),
    scheduledAt,
    scheduledDate: scheduledAt,
    selectedDate: scheduledAt,
    selectedTimeSlot: text(state, "selectedTimeSlot") || null,
    helpersCount,
    needsPacking,
    needsAssembly,
    assemblyType: text(state, "assemblyType") || null,
    assemblyQty,
    price: totalPrice,
    totalPrice,
    isPaid: false,
    paidAt: null,
    refundAmount: 0,
    status: "PENDING",
    notes: null,
    draftMessage: `Customer has not finished checkout. Current stage: ${draftStage(state)}.`,
    createdAt: draft.savedAt,
    updatedAt: draft.updatedAt,
    driver: null,
    items: draftItems(state),
    trackingEvents: [],
    statusHistory: [],
    job: null,
    conversation: null,
    isDraft: true,
    checkoutStage: draftStage(state),
    fieldAvailability: draftFieldAvailability(state),
  };
}

const adminBookingDetailInclude = {
  items: true,
  driver: { include: { user: { select: { name: true, email: true, phone: true } } } },
  trackingEvents: { orderBy: { createdAt: "asc" as const } },
  statusHistory: { orderBy: { createdAt: "asc" as const } },
  job: true,
  conversation: { select: { id: true } },
} satisfies Prisma.BookingInclude;

type AdminBookingDetailRecord = Prisma.BookingGetPayload<{ include: typeof adminBookingDetailInclude }>;

function bookingFieldAvailability(booking: AdminBookingDetailRecord) {
  return {
    customerName: booking.customerName.trim().length > 0,
    customerEmail: booking.customerEmail.trim().length > 0,
    customerPhone: booking.customerPhone.trim().length > 0,
    pickupAddress: booking.pickupAddress.trim().length > 0,
    pickupPostcode: booking.pickupPostcode.trim().length > 0,
    pickupFloor: true,
    pickupHasLift: true,
    pickupPropertyType: false,
    pickupCarryMetres: false,
    dropoffAddress: booking.dropoffAddress.trim().length > 0,
    dropoffPostcode: booking.dropoffPostcode.trim().length > 0,
    dropoffFloor: true,
    dropoffHasLift: true,
    dropoffPropertyType: false,
    dropoffCarryMetres: false,
    distanceMiles: Number.isFinite(booking.distanceMiles),
    hasNarrowAccess: false,
    hasPermitZone: false,
    helpersCount: true,
    needsPacking: true,
    needsAssembly: true,
    assemblyType: booking.needsAssembly ? Boolean(booking.assemblyType) : true,
    assemblyQty: booking.needsAssembly,
    items: true,
    price: Number.isFinite(booking.totalPrice),
    scheduledAt: Number.isFinite(booking.scheduledAt.getTime()),
    selectedTimeSlot: Boolean(booking.selectedTimeSlot),
    paidAt: Boolean(booking.isPaid && booking.paidAt),
  };
}

function bookingToAdminDetailShape(booking: AdminBookingDetailRecord) {
  return {
    id: booking.id,
    reference: booking.reference,
    customerName: booking.customerName,
    customerEmail: booking.customerEmail,
    customerPhone: booking.customerPhone,
    serviceSlug: booking.serviceSlug,
    serviceName: booking.serviceName,
    serviceVariant: booking.serviceVariant,
    pickupAddress: booking.pickupAddress,
    pickupPostcode: booking.pickupPostcode,
    pickupLat: booking.pickupLat,
    pickupLng: booking.pickupLng,
    pickupFloor: booking.pickupFloor,
    pickupHasLift: booking.pickupHasLift,
    pickupPropertyType: null,
    pickupCarryMetres: null,
    dropoffAddress: booking.dropoffAddress,
    dropoffPostcode: booking.dropoffPostcode,
    dropoffLat: booking.dropoffLat,
    dropoffLng: booking.dropoffLng,
    dropoffFloor: booking.dropoffFloor,
    dropoffHasLift: booking.dropoffHasLift,
    dropoffPropertyType: null,
    dropoffCarryMetres: null,
    hasNarrowAccess: null,
    hasPermitZone: null,
    distanceMiles: booking.distanceMiles,
    scheduledAt: booking.scheduledAt,
    scheduledDate: booking.selectedDate ?? booking.scheduledAt,
    selectedDate: booking.selectedDate,
    selectedTimeSlot: booking.selectedTimeSlot,
    timeSlot: booking.selectedTimeSlot,
    helpersCount: booking.helpersCount,
    needsPacking: booking.needsPacking,
    needsAssembly: booking.needsAssembly,
    assemblyType: booking.assemblyType,
    assemblyQty: booking.assemblyQty,
    price: booking.price,
    totalPrice: booking.totalPrice,
    isPaid: booking.isPaid,
    paidAt: booking.paidAt,
    refundAmount: booking.refundAmount,
    stripePaymentId: booking.stripePaymentId,
    status: booking.status,
    notes: booking.notes,
    createdAt: booking.createdAt,
    updatedAt: booking.updatedAt,
    driver: booking.driver
      ? {
          id: booking.driver.id,
          user: {
            name: booking.driver.user.name,
            email: booking.driver.user.email,
            phone: booking.driver.user.phone,
          },
        }
      : null,
    items: booking.items.map((item) => ({
      id: item.id,
      name: item.name,
      quantity: item.quantity,
      createdAt: item.createdAt,
    })),
    trackingEvents: booking.trackingEvents.map((event) => ({
      id: event.id,
      type: event.type,
      status: event.status,
      message: event.message,
      note: event.message,
      createdAt: event.createdAt,
      isInternal: event.isInternal,
    })),
    statusHistory: booking.statusHistory.map((event) => ({
      id: event.id,
      fromStatus: event.fromStatus,
      toStatus: event.toStatus,
      note: event.note,
      createdAt: event.createdAt,
    })),
    job: booking.job
      ? {
          id: booking.job.id,
          status: booking.job.status,
          driverPay: booking.job.driverPay,
          driverPayStatus: booking.job.driverPayStatus,
          driverPayNotes: booking.job.driverPayNotes,
        }
      : null,
    conversation: booking.conversation,
    isDraft: false,
    checkoutStage: null,
    fieldAvailability: bookingFieldAvailability(booking),
  };
}

app.get(
  "/",
  zValidator(
    "query",
    z.object({
      q: z.string().optional(),
      status: z.string().optional(),
      page: z.coerce.number().int().min(1).default(1),
      limit: z.coerce.number().int().min(1).max(100).default(20),
    }),
  ),
  async (c) => {
    const { q, status, page, limit } = c.req.valid("query");
    const includeDrafts = !status || status === "PENDING";
    const where = {
      ...(status ? { status: status as never } : {}),
      ...(q
        ? {
            OR: [
              { reference: { contains: q, mode: "insensitive" as const } },
              { customerEmail: { contains: q, mode: "insensitive" as const } },
              { customerName: { contains: q, mode: "insensitive" as const } },
            ],
          }
        : {}),
    };
    if (includeDrafts) {
      const [bookings, drafts] = await Promise.all([
        db.booking.findMany({
          where,
          take: MAX_MERGED_BOOKINGS,
          orderBy: { createdAt: "desc" },
          include: { driver: { include: { user: { select: { name: true } } } } },
        }),
        db.bookingDraft.findMany({
          where: { expiresAt: { gte: new Date() } },
          take: MAX_MERGED_BOOKINGS,
          orderBy: { updatedAt: "desc" },
        }),
      ]);
      const draftBookings = drafts
        .map(draftToBookingShape)
        .filter((booking): booking is NonNullable<ReturnType<typeof draftToBookingShape>> => Boolean(booking))
        .filter((booking) => draftMatchesSearch(parseDraftState(drafts.find((draft) => `${DRAFT_ID_PREFIX}${draft.id}` === booking.id)?.payload ?? "") ?? {}, q));
      const draftReferences = draftBookings.map((booking) => booking.reference);
      const existingRefs = draftReferences.length
        ? new Set((await db.booking.findMany({
            where: { reference: { in: draftReferences } },
            select: { reference: true },
          })).map((booking) => booking.reference))
        : new Set<string>();
      const combined = [
        ...bookings,
        ...draftBookings.filter((booking) => !existingRefs.has(booking.reference)),
      ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      const start = (page - 1) * limit;
      return c.json(paginated(combined.slice(start, start + limit), page, limit, combined.length));
    }

    const [items, total] = await Promise.all([
      db.booking.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: { driver: { include: { user: { select: { name: true } } } } },
      }),
      db.booking.count({ where }),
    ]);
    return c.json(paginated(items, page, limit, total));
  },
);

app.get("/:id", async (c) => {
  const pendingDraftId = draftId(c.req.param("id"));
  if (pendingDraftId) {
    const draft = await db.bookingDraft.findUnique({ where: { id: pendingDraftId } });
    if (!draft || draft.expiresAt < new Date()) return c.json(fail("Not found", "NOT_FOUND"), 404);
    const booking = draftToBookingShape(draft);
    if (!booking) return c.json(fail("Not found", "NOT_FOUND"), 404);
    return c.json(ok(booking));
  }

  const booking = await db.booking.findUnique({
    where: { id: c.req.param("id") },
    include: adminBookingDetailInclude,
  });
  if (!booking) return c.json(fail("Not found", "NOT_FOUND"), 404);
  return c.json(ok(bookingToAdminDetailShape(booking)));
});

app.patch(
  "/:id/status",
  zValidator(
    "json",
    z.object({
      status: z.enum([
        "PENDING",
        "CONFIRMED",
        "ASSIGNED",
        "IN_PROGRESS",
        "COMPLETED",
        "CANCELLED",
      ]),
      note: z.string().optional(),
    }),
  ),
  async (c) => {
    const id = c.req.param("id");
    if (draftId(id)) return c.json(fail("Draft bookings cannot be changed until checkout is completed.", "DRAFT_BOOKING"), 409);
    const userId = c.get("userId") as string;
    const { status, note } = c.req.valid("json");
    const booking = await db.booking.findUnique({ where: { id } });
    if (!booking) return c.json(fail("Not found", "NOT_FOUND"), 404);
    const updated = await db.booking.update({ where: { id }, data: { status } });
    await recordStatusChange(id, booking.status, status, userId, "ADMIN", note);
    return c.json(ok(updated));
  },
);

app.patch(
  "/:id/edit",
  zValidator(
    "json",
    z
      .object({
        customerName: z.string().optional(),
        customerEmail: z.string().email().optional(),
        customerPhone: z.string().optional(),
        scheduledAt: z.string().datetime().optional(),
        selectedTimeSlot: z.enum(["morning", "afternoon", "evening"]).optional(),
        notes: z.string().optional(),
      })
      .strict(),
  ),
  async (c) => {
    const id = c.req.param("id");
    if (draftId(id)) return c.json(fail("Draft bookings cannot be edited until checkout is completed.", "DRAFT_BOOKING"), 409);
    const data = c.req.valid("json");
    const updated = await db.booking.update({
      where: { id },
      data: {
        ...data,
        ...(data.scheduledAt ? { scheduledAt: new Date(data.scheduledAt) } : {}),
      },
    });
    return c.json(ok(updated));
  },
);

app.post(
  "/:id/assign",
  zValidator("json", z.object({ driverId: z.string() })),
  async (c) => {
    const id = c.req.param("id");
    if (draftId(id)) return c.json(fail("Draft bookings cannot be assigned until checkout is completed.", "DRAFT_BOOKING"), 409);
    const { driverId } = c.req.valid("json");
    const driver = await db.driver.findUnique({ where: { id: driverId } });
    if (!driver) return c.json(fail("Driver not found", "NOT_FOUND"), 404);

    await db.$transaction([
      db.booking.update({ where: { id }, data: { driverId, status: "ASSIGNED" } }),
      db.driverJob.upsert({
        where: { bookingId: id },
        update: { driverId, status: "ACCEPTED", isPublic: false, acceptedAt: new Date() },
        create: { bookingId: id, driverId, status: "ACCEPTED", isPublic: false, acceptedAt: new Date() },
      }),
    ]);
    return c.json(ok({ success: true }));
  },
);

app.post(
  "/:id/cancel",
  zValidator("json", z.object({ reason: z.string().optional() })),
  async (c) => {
    const id = c.req.param("id");
    if (draftId(id)) return c.json(fail("Draft bookings cannot be cancelled until checkout is completed.", "DRAFT_BOOKING"), 409);
    const userId = c.get("userId") as string;
    const { reason } = c.req.valid("json");
    const result = await cancelBooking(id, { reason, actorId: userId, actorRole: "ADMIN" });
    return c.json(ok({ refundAmount: result.refundAmount }));
  },
);

app.post("/:id/recalculate", async (c) => {
  const id = c.req.param("id");
  if (draftId(id)) return c.json(fail("Draft bookings cannot be recalculated until checkout is completed.", "DRAFT_BOOKING"), 409);
  const booking = await db.booking.findUnique({
    where: { id },
    include: {
      items: {
        include: {
          item: { select: { slug: true } },
        },
      },
    },
  });
  if (!booking) return c.json(fail("Not found", "NOT_FOUND"), 404);
  const newPrice = await calculatePriceForSlot(
    {
      serviceType: booking.serviceSlug,
      serviceVariant: booking.serviceVariant ?? undefined,
      distanceMiles: booking.distanceMiles,
      pickupFloor: booking.pickupFloor,
      pickupHasLift: booking.pickupHasLift,
      pickupCarryMetres: 0,
      dropoffFloor: booking.dropoffFloor,
      dropoffHasLift: booking.dropoffHasLift,
      dropoffCarryMetres: 0,
      hasNarrowAccess: false,
      hasPermitZone: false,
      helpersCount: booking.helpersCount,
      needsPacking: booking.needsPacking,
      needsAssembly: booking.needsAssembly,
      selectedItems: booking.items.map((item) => ({
        itemId: item.item?.slug ?? item.itemId ?? undefined,
        name: item.name,
        quantity: item.quantity,
      })),
      pickupLat: booking.pickupLat,
      pickupLng: booking.pickupLng,
    },
    booking.scheduledAt,
    (booking.selectedTimeSlot as "morning" | "afternoon" | "evening") ?? "afternoon",
  );
  return c.json(ok({ oldPrice: booking.price, newPrice }));
});

app.get("/:id/tracking", async (c) => {
  const id = c.req.param("id");
  if (draftId(id)) return c.json(ok({ events: [] }));
  const events = await db.trackingEvent.findMany({
    where: { bookingId: id },
    orderBy: { createdAt: "asc" },
  });
  return c.json(ok({ events }));
});

app.post(
  "/:id/tracking",
  zValidator(
    "json",
    z.object({
      type: z.enum(["status", "location", "note", "system"]).default("note"),
      message: z.string().optional(),
      isInternal: z.boolean().default(true),
      lat: z.number().optional(),
      lng: z.number().optional(),
    }),
  ),
  async (c) => {
    const id = c.req.param("id");
    if (draftId(id)) return c.json(fail("Draft bookings cannot receive tracking notes until checkout is completed.", "DRAFT_BOOKING"), 409);
    const userId = c.get("userId") as string;
    const data = c.req.valid("json");
    const event = await createTrackingEvent({
      bookingId: id,
      type: data.type,
      message: data.message,
      isInternal: data.isInternal,
      lat: data.lat,
      lng: data.lng,
      actorId: userId,
      actorRole: "ADMIN",
    });
    return c.json(ok(event), 201);
  },
);

export default app;
