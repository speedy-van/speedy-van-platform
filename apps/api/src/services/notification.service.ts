import { db } from "@speedy-van/db";
import type { NotificationType } from "@speedy-van/db";

async function notifyAllAdmins(
  type: NotificationType,
  title: string,
  body: string,
  link?: string,
  metadata?: Record<string, unknown>,
): Promise<void> {
  const admins = await db.user.findMany({ where: { role: "ADMIN", isActive: true } });
  if (admins.length === 0) return;
  await db.notification.createMany({
    data: admins.map((a) => ({
      userId: a.id,
      type,
      title,
      body,
      link,
      metadata: metadata as never,
    })),
  });
}

export async function notifyNewBooking(booking: {
  id: string;
  reference: string;
  customerName: string;
  totalPrice: number;
}): Promise<void> {
  await notifyAllAdmins(
    "NEW_BOOKING",
    `New booking: ${booking.reference}`,
    `${booking.customerName} booked for £${booking.totalPrice.toFixed(2)}`,
    `/admin/bookings/${booking.id}`,
    { bookingId: booking.id },
  );
}

export async function notifyHighTraffic(count: number): Promise<void> {
  await notifyAllAdmins(
    "HIGH_TRAFFIC",
    "High visitor traffic",
    `${count} active visitors right now`,
    "/admin/visitors",
  );
}

export async function notifyDriverAssigned(
  booking: { id: string; reference: string },
  driverName: string,
): Promise<void> {
  await notifyAllAdmins(
    "DRIVER_ASSIGNED",
    `Driver assigned: ${booking.reference}`,
    `${driverName} accepted the job`,
    `/admin/bookings/${booking.id}`,
  );
}

export async function notifyJobCompleted(booking: {
  id: string;
  reference: string;
}): Promise<void> {
  await notifyAllAdmins(
    "JOB_COMPLETED",
    `Job completed: ${booking.reference}`,
    `Booking ${booking.reference} has been completed`,
    `/admin/bookings/${booking.id}`,
  );
}

export async function notifyChatMessage(
  recipientId: string,
  bookingRef: string,
  senderName: string,
): Promise<void> {
  await db.notification.create({
    data: {
      userId: recipientId,
      type: "CHAT_MESSAGE",
      title: `New message from ${senderName}`,
      body: `Booking ${bookingRef}`,
      link: `/chat?ref=${bookingRef}`,
    },
  });
}

export async function notifyNewEuropeanEnquiry(enquiry: {
  id: string;
  customerName: string;
  toCountry: string;
}): Promise<void> {
  await notifyAllAdmins(
    "EUROPEAN_ENQUIRY",
    `🇪🇺 New European enquiry: Scotland → ${enquiry.toCountry}`,
    `${enquiry.customerName} requested a European removals quote`,
    `/admin/enquiries`,
    { enquiryId: enquiry.id },
  );
}
