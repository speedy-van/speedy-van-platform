import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { db } from "@speedy-van/db";
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
  const booking = await db.booking.findUnique({
    where: { id: c.req.param("id") },
    include: {
      items: true,
      driver: { include: { user: true } },
      trackingEvents: { orderBy: { createdAt: "asc" } },
      statusHistory: { orderBy: { createdAt: "asc" } },
      job: true,
      conversation: { select: { id: true } },
    },
  });
  if (!booking) return c.json(fail("Not found", "NOT_FOUND"), 404);
  return c.json(ok(booking));
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
    const userId = c.get("userId") as string;
    const { reason } = c.req.valid("json");
    const result = await cancelBooking(id, { reason, actorId: userId, actorRole: "ADMIN" });
    return c.json(ok({ refundAmount: result.refundAmount }));
  },
);

app.post("/:id/recalculate", async (c) => {
  const id = c.req.param("id");
  const booking = await db.booking.findUnique({ where: { id } });
  if (!booking) return c.json(fail("Not found", "NOT_FOUND"), 404);
  const newPrice = await calculatePriceForSlot(
    {
      serviceType: booking.serviceSlug,
      serviceVariant: booking.serviceVariant ?? undefined,
      distanceMiles: booking.distanceMiles,
      pickupFloor: booking.pickupFloor,
      pickupHasLift: booking.pickupHasLift,
      dropoffFloor: booking.dropoffFloor,
      dropoffHasLift: booking.dropoffHasLift,
      helpersCount: booking.helpersCount,
      needsPacking: booking.needsPacking,
      needsAssembly: booking.needsAssembly,
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
