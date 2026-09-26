import { db, type Booking } from "@speedy-van/db";
import {
  generateBookingReference,
  type CreateBookingInput,
  calculateRefund,
  poundsToPence,
} from "@speedy-van/shared";
import bcrypt from "bcryptjs";
import { requireStripe } from "../lib/stripe";
import { assertBookingPayment, PaymentValidationError } from "../lib/payment-validation";
import { triggerEvent } from "../lib/pusher";
import { calculatePriceForSlot } from "./pricing.service";
import { sendBookingConfirmation, sendBookingCancelled } from "./email.service";
import { verifyQuoteToken } from "../lib/quote-token";

const PRICE_TOLERANCE_GBP = 1.0;
type PriceChangedCause = "weather" | "config" | "day_rollover" | "other";
const londonBookingDate = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Europe/London",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

function currentLondonBookingDate(now: Date): Date {
  const parts = Object.fromEntries(londonBookingDate.formatToParts(now).map((part) => [part.type, part.value]));
  return new Date(Date.UTC(Number(parts.year), Number(parts.month) - 1, Number(parts.day)));
}

function daysFromLondonToday(date: Date, now = new Date()): number {
  const today = currentLondonBookingDate(now);
  const a = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
  const b = Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate());
  return Math.round((a - b) / 86_400_000);
}

function guessPriceChangedCause(input: CreateBookingInput, scheduledDate: Date): PriceChangedCause {
  const days = daysFromLondonToday(scheduledDate);
  if (!Number.isFinite(days)) return "other";
  if (days >= 0 && days <= 2) return "day_rollover";
  if (input.pickupLat !== undefined && input.pickupLng !== undefined && days >= 0 && days <= 5) return "weather";
  if (days >= 0) return "config";
  return "other";
}

function logPriceChanged(input: CreateBookingInput, scheduledDate: Date, serverPrice: number): void {
  console.warn("[booking] PRICE_CHANGED", {
    event: "PRICE_CHANGED",
    serverTotal: Number(serverPrice.toFixed(2)),
    clientTotal: Number(input.clientTotal.toFixed(2)),
    date: Number.isFinite(scheduledDate.getTime()) ? scheduledDate.toISOString().slice(0, 10) : input.selectedDate,
    slot: input.selectedTimeSlot,
    cause: guessPriceChangedCause(input, scheduledDate),
  });
}

async function findOrCreateCustomer(email: string, name: string, phone: string) {
  const existing = await db.user.findUnique({ where: { email } });
  if (existing) return existing;

  // Guest checkout: create user with random password
  const randomPw = await bcrypt.hash(`guest-${Date.now()}-${Math.random()}`, 10);
  return db.user.create({
    data: { email, name, phone, password: randomPw, role: "CUSTOMER" },
  });
}

export async function createBooking(input: CreateBookingInput): Promise<{
  booking: Booking;
  clientSecret: string | null;
}> {
  // Payment configuration is required before creating a customer or booking.
  const paymentClient = requireStripe();

  // 0. Verify signed quote token (T2) — warn if missing/expired, hard-fail if tampered
  if (input.quoteToken) {
    const tokenResult = verifyQuoteToken(input.quoteToken);
    if (!tokenResult.ok && tokenResult.reason === "invalid") {
      throw new PaymentValidationError("QUOTE_INVALID", "Quote token is invalid. Please refresh your quote.", 422);
    }
    if (!tokenResult.ok && tokenResult.reason === "expired") {
      throw new PaymentValidationError("QUOTE_EXPIRED", "Your quote has expired. Please refresh to get the current price.", 422);
    }
  }

  // 1. Verify price server-side
  const scheduledDate = new Date(input.selectedDate);
  const serverPrice = await calculatePriceForSlot(
    {
      serviceType: input.entryServiceSlug || input.serviceSlug,
      serviceVariant: input.serviceVariant,
      distanceMiles: input.distanceMiles,
      pickupFloor: input.pickupFloor,
      pickupHasLift: input.pickupHasLift,
      dropoffFloor: input.dropoffFloor,
      dropoffHasLift: input.dropoffHasLift,
      pickupCarryMetres: input.pickupCarryMetres ?? 0,
      dropoffCarryMetres: input.dropoffCarryMetres ?? 0,
      hasNarrowAccess: input.hasNarrowAccess ?? false,
      hasPermitZone: input.hasPermitZone ?? false,
      helpersCount: input.helpersCount,
      needsPacking: input.needsPacking,
      needsAssembly: input.needsAssembly,
      selectedItems: input.selectedItems,
      pickupLat: input.pickupLat,
      pickupLng: input.pickupLng,
    },
    scheduledDate,
    input.selectedTimeSlot,
  );

  if (Math.abs(serverPrice - input.clientTotal) > PRICE_TOLERANCE_GBP) {
    logPriceChanged(input, scheduledDate, serverPrice);
    const err = new Error(
      `Price changed: server=${serverPrice.toFixed(2)} client=${input.clientTotal.toFixed(2)}`,
    );
    err.name = "PriceChangedError";
    throw err;
  }

  if (!Number.isFinite(serverPrice) || poundsToPence(serverPrice) <= 0) {
    throw new PaymentValidationError("PAYMENT_UNAVAILABLE", "A payable quote is not available. Please try again.", 503);
  }

  // 2. Find or create customer
  const customer = await findOrCreateCustomer(
    input.customerEmail,
    input.customerName,
    input.customerPhone,
  );

  // 3. Resolve service + a default area (back-compat)
  const service = await db.service.findUnique({ where: { slug: input.serviceSlug } });
  if (!service) throw new Error("NOT_FOUND");
  const area = await db.area.findFirst({ where: { isActive: true } });
  if (!area) throw new Error("NOT_FOUND");

  const submittedItemIds = Array.from(
    new Set(
      input.selectedItems
        .map((item) => item.itemId)
        .filter((itemId): itemId is string => Boolean(itemId)),
    ),
  );
  const catalogItems =
    submittedItemIds.length > 0
      ? await db.item.findMany({
          where: {
            OR: [
              { id: { in: submittedItemIds } },
              { slug: { in: submittedItemIds } },
            ],
          },
          select: { id: true, slug: true },
        })
      : [];
  const catalogItemIdBySubmittedId = new Map<string, string>();
  for (const item of catalogItems) {
    catalogItemIdBySubmittedId.set(item.id, item.id);
    catalogItemIdBySubmittedId.set(item.slug, item.id);
  }

  // 4. Create booking
  const reference = generateBookingReference();
  const booking = await db.booking.create({
    data: {
      reference,
      userId: customer.id,
      customerName: input.customerName,
      customerEmail: input.customerEmail,
      customerPhone: input.customerPhone,
      serviceId: service.id,
      serviceSlug: input.serviceSlug,
      serviceName: input.serviceName,
      serviceVariant: input.serviceVariant,
      areaId: area.id,
      pickupAddress: input.pickupAddress,
      pickupPostcode: input.pickupPostcode,
      pickupLat: input.pickupLat,
      pickupLng: input.pickupLng,
      pickupFloor: input.pickupFloor,
      pickupHasLift: input.pickupHasLift,
      dropoffAddress: input.dropoffAddress,
      dropoffPostcode: input.dropoffPostcode,
      dropoffLat: input.dropoffLat,
      dropoffLng: input.dropoffLng,
      dropoffFloor: input.dropoffFloor,
      dropoffHasLift: input.dropoffHasLift,
      distanceMiles: input.distanceMiles,
      scheduledAt: scheduledDate,
      selectedDate: scheduledDate,
      selectedTimeSlot: input.selectedTimeSlot,
      helpersCount: input.helpersCount,
      needsPacking: input.needsPacking,
      needsAssembly: input.needsAssembly,
      assemblyType: input.assemblyType ?? null,
      assemblyQty: input.assemblyQty ?? 1,
      price: serverPrice,
      totalPrice: serverPrice,
      status: "PENDING",
      items: {
        create: input.selectedItems.map((it) => {
          const resolvedItemId = it.itemId ? catalogItemIdBySubmittedId.get(it.itemId) : undefined;
          const itemName = it.roomName ? `${it.roomName}: ${it.name}` : it.name;
          return {
            ...(resolvedItemId ? { itemId: resolvedItemId } : {}),
            name: itemName,
            quantity: it.quantity,
          };
        }),
      },
    },
  });

  // 5. Stripe PaymentIntent
  const intent = await paymentClient.paymentIntents.create(
    {
      amount: poundsToPence(serverPrice),
      currency: "gbp",
      metadata: { bookingId: booking.id, reference: booking.reference },
      automatic_payment_methods: { enabled: true },
    },
    { idempotencyKey: `booking-payment-${booking.id}` },
  );
  const updatedBooking = await db.booking.update({
    where: { id: booking.id },
    data: { stripePaymentId: intent.id },
  });
  if (!intent.client_secret) {
    throw new PaymentValidationError("PAYMENT_UNAVAILABLE", "Payment could not be started. Please contact support.", 503);
  }

  return { booking: updatedBooking, clientSecret: intent.client_secret };
}

export async function confirmBooking(
  bookingId: string,
  paymentIntentId: string,
): Promise<Booking> {
  const paymentClient = requireStripe();
  const initialBooking = await db.booking.findUnique({ where: { id: bookingId } });
  if (!initialBooking) throw new Error("NOT_FOUND");
  const intent = await paymentClient.paymentIntents.retrieve(paymentIntentId);
  assertBookingPayment(initialBooking, intent);

  // The conditional update serialises the browser confirmation and webhook.
  // Keep all durable first-payment effects in the same transaction so a retry
  // can finish safely after a database error, without publishing duplicate jobs.
  const result = await db.$transaction(async (tx) => {
    const current = await tx.booking.findUnique({ where: { id: bookingId } });
    if (!current) throw new Error("NOT_FOUND");
    assertBookingPayment(current, intent);
    if (current.isPaid) return { booking: current, event: null };

    const status = current.status === "PENDING" ? "CONFIRMED" : current.status;
    const updated = await tx.booking.updateMany({
      where: {
        id: bookingId,
        isPaid: false,
        status: current.status,
        stripePaymentId: intent.id,
        totalPrice: current.totalPrice,
      },
      data: { status, isPaid: true, paidAt: new Date() },
    });
    const booking = await tx.booking.findUnique({ where: { id: bookingId } });
    if (!booking) throw new Error("NOT_FOUND");
    if (updated.count === 0) {
      assertBookingPayment(booking, intent);
      if (booking.isPaid) return { booking, event: null };
      throw new PaymentValidationError("BOOKING_STATE_CHANGED", "Booking changed. Please try confirming the payment again.", 409);
    }

    const cancelled = status === "CANCELLED";
    const event = await tx.trackingEvent.create({
      data: {
        bookingId,
        type: "system",
        status,
        message: cancelled ? "Payment received after cancellation. Payment and refund review required." : "Payment received",
        isInternal: cancelled,
      },
    });
    if (current.status !== status) {
      await tx.statusHistory.create({
        data: { bookingId, fromStatus: current.status, toStatus: status, changedByRole: "SYSTEM", note: "Payment received" },
      });
    }

    const admins = await tx.user.findMany({ where: { role: "ADMIN", isActive: true } });
    if (!cancelled) {
      const conversation = await tx.conversation.upsert({
        where: { bookingId },
        update: {},
        create: { bookingId },
      });
      const participants = new Map<string, "CUSTOMER" | "ADMIN">();
      for (const admin of admins) participants.set(admin.id, "ADMIN");
      participants.set(booking.userId, "CUSTOMER");
      await tx.conversationParticipant.createMany({
        data: Array.from(participants, ([userId, role]) => ({ conversationId: conversation.id, userId, role })),
        skipDuplicates: true,
      });

      if (status === "CONFIRMED") {
        const [percentage, minimum] = await Promise.all([
          tx.pricingConfig.findUnique({ where: { category_key: { category: "driver", key: "driver_pay_percentage" } } }),
          tx.pricingConfig.findUnique({ where: { category_key: { category: "driver", key: "driver_pay_minimum" } } }),
        ]);
        const driverPay = Math.max(booking.totalPrice * ((percentage?.value ?? 60) / 100), minimum?.value ?? 25);
        await tx.driverJob.upsert({
          where: { bookingId },
          update: {},
          create: { bookingId, status: "AVAILABLE", isPublic: true, driverPay },
        });
      }
    }

    if (admins.length > 0) {
      const formattedPrice = new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" }).format(booking.totalPrice);
      await tx.notification.createMany({
        data: admins.map((admin) => ({
          userId: admin.id,
          type: cancelled ? "GENERIC" as const : "NEW_BOOKING" as const,
          title: cancelled ? `Payment review required: ${booking.reference}` : `New payment: ${booking.reference}`,
          body: cancelled
            ? `${formattedPrice} received for a cancelled booking. Review the payment and any refund before contacting the customer.`
            : `${booking.customerName} paid ${formattedPrice}.`,
          link: `/admin/bookings/${booking.id}`,
          metadata: { bookingId, paymentIntentId: intent.id },
        })),
      });
    }
    return { booking, event };
  });

  if (result.event && !result.event.isInternal) {
    triggerEvent(`booking-${bookingId}`, "tracking-event", {
      type: result.event.type,
      status: result.event.status,
      message: result.event.message,
      lat: result.event.lat,
      lng: result.event.lng,
      createdAt: result.event.createdAt,
    });
    await sendBookingConfirmation({
      customerEmail: result.booking.customerEmail,
      customerName: result.booking.customerName,
      reference: result.booking.reference,
      serviceName: result.booking.serviceName,
      scheduledAt: result.booking.scheduledAt,
      totalPrice: result.booking.totalPrice,
      helpersCount: result.booking.helpersCount,
      needsPacking: result.booking.needsPacking,
      needsAssembly: result.booking.needsAssembly,
      assemblyType: result.booking.assemblyType ?? undefined,
      assemblyQty: result.booking.assemblyQty ?? 1,
    }).catch((err) => console.error("[booking] confirmation email failed:", err));
  }
  return result.booking;
}

export async function cancelBooking(
  bookingId: string,
  options: { reason?: string; actorId?: string; actorRole?: string },
): Promise<{ booking: Booking; refundAmount: number }> {
  const result = await db.$transaction(async (tx) => {
    const booking = await tx.booking.findUnique({ where: { id: bookingId } });
    if (!booking) throw new Error("NOT_FOUND");
    if (booking.status === "CANCELLED") return { booking, event: null };
    if (options.actorRole === "CUSTOMER" && booking.status !== "PENDING" && booking.status !== "CONFIRMED") {
      throw new PaymentValidationError("BOOKING_CANCELLATION_NOT_ALLOWED", "This move can no longer be cancelled online. Please contact support.", 409);
    }

    // Lock the same booking row as confirmation before issuing any refund.
    const claimed = await tx.booking.updateMany({
      where: {
        id: bookingId,
        status: booking.status,
        isPaid: booking.isPaid,
        stripePaymentId: booking.stripePaymentId,
        totalPrice: booking.totalPrice,
        refundAmount: booking.refundAmount,
      },
      data: { status: "CANCELLED" },
    });
    if (claimed.count === 0) {
      throw new PaymentValidationError("BOOKING_STATE_CHANGED", "Booking changed. Please review it before cancelling again.", 409);
    }

    const refundableTotal = booking.isPaid ? calculateRefund(booking.scheduledAt, booking.totalPrice) : 0;
    const remainingPence = Math.max(0, poundsToPence(refundableTotal) - poundsToPence(booking.refundAmount));
    let refundAmount = booking.refundAmount;
    if (remainingPence > 0) {
      const paymentClient = requireStripe();
      if (!booking.stripePaymentId) {
        throw new PaymentValidationError("REFUND_NOT_COMPLETED", "The payment could not be identified. Please contact support to cancel.", 409);
      }
      let refund = await paymentClient.refunds.create(
        {
          payment_intent: booking.stripePaymentId,
          amount: remainingPence,
          metadata: { bookingId, reason: "booking_cancellation" },
        },
        { idempotencyKey: `booking-cancellation-${bookingId}`, timeout: 8000, maxNetworkRetries: 0 },
      );
      // A repeated idempotent request can return the original pending response.
      if (refund.status !== "succeeded") {
        refund = await paymentClient.refunds.retrieve(refund.id, {}, { timeout: 8000, maxNetworkRetries: 0 });
      }
      if (refund.status !== "succeeded" || refund.amount !== remainingPence || refund.currency !== "gbp") {
        throw new PaymentValidationError(
          "REFUND_NOT_COMPLETED",
          "Cancellation could not be completed because the refund has not succeeded. Please contact support before trying again.",
          409,
        );
      }
      refundAmount = (poundsToPence(booking.refundAmount) + refund.amount) / 100;
    }

    const updated = await tx.booking.update({ where: { id: bookingId }, data: { refundAmount } });
    await tx.driverJob.updateMany({ where: { bookingId }, data: { status: "CANCELLED", isPublic: false } });
    await tx.statusHistory.create({
      data: {
        bookingId,
        fromStatus: booking.status,
        toStatus: "CANCELLED",
        changedById: options.actorId,
        changedByRole: options.actorRole,
        note: options.reason,
      },
    });
    const event = await tx.trackingEvent.create({
      data: {
        bookingId,
        type: "status",
        status: "CANCELLED",
        message: options.reason,
        actorId: options.actorId,
        actorRole: options.actorRole,
      },
    });
    return { booking: updated, event };
  }, { timeout: 20000 });

  if (result.event) {
    triggerEvent(`booking-${bookingId}`, "tracking-event", {
      type: result.event.type,
      status: result.event.status,
      message: result.event.message,
      lat: result.event.lat,
      lng: result.event.lng,
      createdAt: result.event.createdAt,
    });
    await sendBookingCancelled(
      { customerEmail: result.booking.customerEmail, reference: result.booking.reference },
      result.booking.refundAmount,
    ).catch((err) => console.error("[booking] cancellation email failed:", err));
  }
  return { booking: result.booking, refundAmount: result.booking.refundAmount };
}

export async function getBookingForTracking(reference: string, email: string) {
  const booking = await db.booking.findUnique({
    where: { reference },
    include: {
      driver: { include: { user: true } },
      trackingEvents: {
        where: { isInternal: false },
        orderBy: { createdAt: "asc" },
      },
      conversation: { select: { id: true } },
    },
  });
  if (!booking || booking.customerEmail.toLowerCase() !== email.toLowerCase()) {
    throw new Error("NOT_FOUND");
  }
  const lastLocation = [...booking.trackingEvents]
    .reverse()
    .find((e) => e.type === "location" && e.lat !== null && e.lng !== null);

  return {
    reference: booking.reference,
    bookingId: booking.id,
    status: booking.status,
    isPaid: booking.isPaid,
    serviceName: booking.serviceName,
    scheduledAt: booking.scheduledAt.toISOString(),
    pickupPostcode: booking.pickupPostcode,
    dropoffPostcode: booking.dropoffPostcode,
    pickupAddress: booking.pickupAddress,
    dropoffAddress: booking.dropoffAddress,
    driverName: booking.driver?.user.name,
    driverPhone: booking.driver?.user.phone ?? undefined,
    driverVanSize: booking.driver?.vanSize ?? undefined,
    conversationId: booking.conversation?.id ?? undefined,
    canCancel: ["PENDING", "CONFIRMED"].includes(booking.status),
    events: booking.trackingEvents.map((e) => ({
      type: e.type,
      status: e.status ?? undefined,
      message: e.message ?? undefined,
      createdAt: e.createdAt.toISOString(),
    })),
    liveLocation: lastLocation
      ? {
          lat: lastLocation.lat!,
          lng: lastLocation.lng!,
          updatedAt: lastLocation.createdAt.toISOString(),
        }
      : undefined,
  };
}
