import { db, type Booking } from "@speedy-van/db";
import {
  generateBookingReference,
  type CreateBookingInput,
  calculateRefund,
  poundsToPence,
} from "@speedy-van/shared";
import bcrypt from "bcryptjs";
import { stripe } from "../lib/stripe";
import { calculatePriceForSlot } from "./pricing.service";
import { recordStatusChange, createTrackingEvent } from "./tracking.service";
import { publishToJobBoard } from "./job.service";
import { notifyNewBooking } from "./notification.service";
import { sendBookingConfirmation, sendBookingCancelled } from "./email.service";

const PRICE_TOLERANCE_GBP = 1.0;

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
  // 1. Verify price server-side
  const scheduledDate = new Date(input.selectedDate);
  const serverPrice = await calculatePriceForSlot(
    {
      serviceType: input.serviceSlug,
      serviceVariant: input.serviceVariant,
      distanceMiles: input.distanceMiles,
      pickupFloor: input.pickupFloor,
      pickupHasLift: input.pickupHasLift,
      dropoffFloor: input.dropoffFloor,
      dropoffHasLift: input.dropoffHasLift,
      helpersCount: input.helpersCount,
      needsPacking: input.needsPacking,
      needsAssembly: input.needsAssembly,
      pickupLat: input.pickupLat,
      pickupLng: input.pickupLng,
    },
    scheduledDate,
    input.selectedTimeSlot,
  );

  if (Math.abs(serverPrice - input.clientTotal) > PRICE_TOLERANCE_GBP) {
    const err = new Error(
      `Price changed: server=${serverPrice.toFixed(2)} client=${input.clientTotal.toFixed(2)}`,
    );
    err.name = "PriceChangedError";
    throw err;
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
      price: serverPrice,
      totalPrice: serverPrice,
      status: "PENDING",
      items: {
        create: input.selectedItems.map((it) => ({
          name: it.name,
          quantity: it.quantity,
        })),
      },
    },
  });

  // 5. Stripe PaymentIntent
  let clientSecret: string | null = null;
  if (stripe) {
    const intent = await stripe.paymentIntents.create({
      amount: poundsToPence(serverPrice),
      currency: "gbp",
      metadata: { bookingId: booking.id, reference: booking.reference },
      automatic_payment_methods: { enabled: true },
    });
    clientSecret = intent.client_secret;
    await db.booking.update({
      where: { id: booking.id },
      data: { stripePaymentId: intent.id },
    });
  }

  return { booking, clientSecret };
}

export async function confirmBooking(
  bookingId: string,
  paymentIntentId: string,
): Promise<Booking> {
  // Verify payment
  if (stripe) {
    const intent = await stripe.paymentIntents.retrieve(paymentIntentId);
    if (intent.status !== "succeeded") {
      const err = new Error(`PaymentIntent not succeeded: ${intent.status}`);
      err.name = "PaymentNotSucceeded";
      throw err;
    }
  }

  const booking = await db.booking.update({
    where: { id: bookingId },
    data: { status: "CONFIRMED", isPaid: true, paidAt: new Date(), stripePaymentId: paymentIntentId },
  });

  await createTrackingEvent({
    bookingId: booking.id,
    type: "system",
    status: "CONFIRMED",
    message: "Payment received",
  });

  // Conversation between customer + admins (idempotent)
  try {
    const existingConversation = await db.conversation.findUnique({
      where: { bookingId: booking.id },
      select: { id: true, participants: { select: { userId: true } } },
    });

    const admins = await db.user.findMany({ where: { role: "ADMIN", isActive: true } });

    // Build deduplicated participant list. Customer takes precedence over ADMIN role
    // if the booking owner happens to also be an admin user.
    const participantMap = new Map<string, "CUSTOMER" | "ADMIN">();
    for (const a of admins) {
      if (a.id) participantMap.set(a.id, "ADMIN");
    }
    if (booking.userId) participantMap.set(booking.userId, "CUSTOMER");

    if (!existingConversation) {
      await db.conversation.create({
        data: {
          bookingId: booking.id,
          participants: {
            create: Array.from(participantMap.entries()).map(([userId, role]) => ({
              userId,
              role,
            })),
          },
        },
      });
    } else {
      const existingUserIds = new Set(existingConversation.participants.map((p) => p.userId));
      const toCreate = Array.from(participantMap.entries())
        .filter(([userId]) => !existingUserIds.has(userId))
        .map(([userId, role]) => ({
          conversationId: existingConversation.id,
          userId,
          role,
        }));
      if (toCreate.length > 0) {
        await db.conversationParticipant.createMany({ data: toCreate, skipDuplicates: true });
      }
    }
  } catch (err) {
    console.error("[booking] conversation setup failed:", err);
  }

  // Auto-publish to job board
  await publishToJobBoard(booking.id).catch((err) =>
    console.error("[booking] publishToJobBoard failed:", err),
  );

  await sendBookingConfirmation({
    customerEmail: booking.customerEmail,
    customerName: booking.customerName,
    reference: booking.reference,
    serviceName: booking.serviceName,
    scheduledAt: booking.scheduledAt,
    totalPrice: booking.totalPrice,
  }).catch(() => {});

  await notifyNewBooking({
    id: booking.id,
    reference: booking.reference,
    customerName: booking.customerName,
    totalPrice: booking.totalPrice,
  }).catch(() => {});

  return booking;
}

export async function cancelBooking(
  bookingId: string,
  options: { reason?: string; actorId?: string; actorRole?: string },
): Promise<{ booking: Booking; refundAmount: number }> {
  const booking = await db.booking.findUnique({ where: { id: bookingId } });
  if (!booking) throw new Error("NOT_FOUND");
  if (booking.status === "CANCELLED") {
    return { booking, refundAmount: booking.refundAmount };
  }

  const refundAmount = booking.isPaid
    ? calculateRefund(booking.scheduledAt, booking.totalPrice)
    : 0;

  // Issue Stripe refund if applicable
  if (refundAmount > 0 && booking.stripePaymentId && stripe) {
    try {
      await stripe.refunds.create({
        payment_intent: booking.stripePaymentId,
        amount: poundsToPence(refundAmount),
      });
    } catch (err) {
      console.error("[booking] Stripe refund failed:", err);
    }
  }

  const previousStatus = booking.status;
  const updated = await db.booking.update({
    where: { id: bookingId },
    data: { status: "CANCELLED", refundAmount },
  });

  // If a job exists, mark cancelled
  await db.driverJob.updateMany({
    where: { bookingId },
    data: { status: "CANCELLED", isPublic: false },
  });

  await recordStatusChange(
    bookingId,
    previousStatus,
    "CANCELLED",
    options.actorId,
    options.actorRole,
    options.reason,
  );

  await sendBookingCancelled(
    { customerEmail: updated.customerEmail, reference: updated.reference },
    refundAmount,
  ).catch(() => {});

  return { booking: updated, refundAmount };
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
