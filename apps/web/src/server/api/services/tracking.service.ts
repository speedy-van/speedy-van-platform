import { db } from "@speedy-van/db";
import { triggerEvent } from "../lib/pusher";

export type TrackingEventInput = {
  bookingId: string;
  type: "status" | "location" | "note" | "system";
  status?: string;
  message?: string;
  lat?: number;
  lng?: number;
  isInternal?: boolean;
  actorId?: string;
  actorRole?: string;
};

export async function createTrackingEvent(params: TrackingEventInput) {
  const event = await db.trackingEvent.create({
    data: {
      bookingId: params.bookingId,
      type: params.type,
      status: params.status,
      message: params.message,
      lat: params.lat,
      lng: params.lng,
      isInternal: params.isInternal ?? false,
      actorId: params.actorId,
      actorRole: params.actorRole,
    },
  });

  if (!event.isInternal) {
    triggerEvent(`booking-${params.bookingId}`, "tracking-event", {
      type: event.type,
      status: event.status,
      message: event.message,
      lat: event.lat,
      lng: event.lng,
      createdAt: event.createdAt,
    });
  }

  return event;
}

export async function recordStatusChange(
  bookingId: string,
  fromStatus: string,
  toStatus: string,
  changedById: string | undefined,
  changedByRole: string | undefined,
  note?: string,
): Promise<void> {
  await db.statusHistory.create({
    data: { bookingId, fromStatus, toStatus, changedById, changedByRole, note },
  });
  await createTrackingEvent({
    bookingId,
    type: "status",
    status: toStatus,
    message: note,
    actorId: changedById,
    actorRole: changedByRole,
  });
}

export async function trackDriverLocation(
  bookingId: string,
  lat: number,
  lng: number,
): Promise<void> {
  await createTrackingEvent({ bookingId, type: "location", lat, lng });
}
