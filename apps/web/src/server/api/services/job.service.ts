import { db, type DriverJob, Prisma } from "@speedy-van/db";
import { recordStatusChange, createTrackingEvent } from "./tracking.service";
import {
  notifyDriverAssigned,
  notifyJobCompleted,
} from "./notification.service";
import { sendDriverAssigned, sendJobCompleted } from "./email.service";

export async function publishToJobBoard(bookingId: string): Promise<DriverJob> {
  const existing = await db.driverJob.findUnique({ where: { bookingId } });
  if (existing) return existing;

  // Auto-calc driver pay
  const booking = await db.booking.findUnique({ where: { id: bookingId } });
  const [pctRow, minRow] = await Promise.all([
    db.pricingConfig.findUnique({ where: { category_key: { category: "driver", key: "driver_pay_percentage" } } }),
    db.pricingConfig.findUnique({ where: { category_key: { category: "driver", key: "driver_pay_minimum" } } }),
  ]);
  const pct = pctRow?.value ?? 60;
  const min = minRow?.value ?? 25;
  const driverPay = booking ? Math.max(booking.totalPrice * (pct / 100), min) : min;

  return db.driverJob.create({
    data: { bookingId, status: "AVAILABLE", isPublic: true, driverPay },
  });
}

export class JobAlreadyTakenError extends Error {
  constructor() {
    super("Job is no longer available");
    this.name = "JobAlreadyTakenError";
  }
}

export async function acceptJob(jobId: string, driverId: string): Promise<DriverJob> {
  return db.$transaction(async (tx) => {
    const job = await tx.driverJob.findUnique({ where: { id: jobId } });
    if (!job) throw new Error("NOT_FOUND");
    if (job.status !== "AVAILABLE" || !job.isPublic || job.driverId) {
      throw new JobAlreadyTakenError();
    }

    const updated = await tx.driverJob.update({
      where: { id: jobId },
      data: {
        driverId,
        status: "ACCEPTED",
        isPublic: false,
        acceptedAt: new Date(),
      },
    });

    const booking = await tx.booking.update({
      where: { id: job.bookingId },
      data: { driverId, status: "ASSIGNED" },
    });

    // Add driver to conversation
    const conv = await tx.conversation.findUnique({ where: { bookingId: booking.id } });
    if (conv) {
      const driver = await tx.driver.findUnique({
        where: { id: driverId },
        include: { user: true },
      });
      if (driver) {
        await tx.conversationParticipant.upsert({
          where: {
            conversationId_userId: { conversationId: conv.id, userId: driver.userId },
          },
          update: {},
          create: {
            conversationId: conv.id,
            userId: driver.userId,
            role: "DRIVER",
          },
        });
      }
    }

    return updated;
  }).then(async (job) => {
    // Side effects (outside the txn)
    const booking = await db.booking.findUnique({
      where: { id: job.bookingId },
      include: { driver: { include: { user: true } } },
    });
    if (booking && booking.driver) {
      await sendDriverAssigned(
        { customerEmail: booking.customerEmail, reference: booking.reference },
        booking.driver.user.name,
      ).catch(() => {});
      await notifyDriverAssigned(
        { id: booking.id, reference: booking.reference },
        booking.driver.user.name,
      ).catch(() => {});
    }
    return job;
  }).catch((err) => {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      throw new JobAlreadyTakenError();
    }
    throw err;
  });
}

export async function rejectJob(jobId: string, reason: string): Promise<void> {
  await db.driverJob.update({
    where: { id: jobId },
    data: {
      status: "AVAILABLE",
      isPublic: true,
      driverId: null,
      acceptedAt: null,
      rejectionReason: reason,
    },
  });
  const job = await db.driverJob.findUnique({ where: { id: jobId } });
  if (job) {
    await db.booking.update({
      where: { id: job.bookingId },
      data: { driverId: null, status: "CONFIRMED" },
    });
  }
}

export async function updateJobStatus(
  jobId: string,
  newStatus:
    | "DRIVER_EN_ROUTE"
    | "ARRIVED_PICKUP"
    | "LOADING"
    | "IN_TRANSIT"
    | "ARRIVED_DROPOFF"
    | "UNLOADING"
    | "COMPLETED",
  actorId: string,
  note?: string,
): Promise<DriverJob> {
  const job = await db.driverJob.findUnique({ where: { id: jobId } });
  if (!job) throw new Error("NOT_FOUND");

  const updates: Record<string, unknown> = { status: newStatus };
  if (newStatus === "DRIVER_EN_ROUTE" && !job.startedAt) updates.startedAt = new Date();
  if (newStatus === "COMPLETED") updates.completedAt = new Date();

  const updated = await db.driverJob.update({ where: { id: jobId }, data: updates });

  // Mirror to booking
  const bookingStatus =
    newStatus === "COMPLETED" ? "COMPLETED" : "IN_PROGRESS";
  await db.booking.update({
    where: { id: job.bookingId },
    data: { status: bookingStatus },
  });

  await recordStatusChange(
    job.bookingId,
    job.status,
    newStatus,
    actorId,
    "DRIVER",
    note,
  );

  if (newStatus === "COMPLETED") {
    const booking = await db.booking.findUnique({ where: { id: job.bookingId } });
    if (booking) {
      await sendJobCompleted({
        customerEmail: booking.customerEmail,
        reference: booking.reference,
      }).catch(() => {});
      await notifyJobCompleted({
        id: booking.id,
        reference: booking.reference,
      }).catch(() => {});
    }
  } else {
    await createTrackingEvent({
      bookingId: job.bookingId,
      type: "status",
      status: newStatus,
      message: note,
      actorId,
      actorRole: "DRIVER",
    });
  }

  return updated;
}
