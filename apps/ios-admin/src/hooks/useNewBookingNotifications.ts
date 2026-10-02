import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import { useRouter } from "expo-router";
import { useEffect, useRef } from "react";
import { apiClient } from "@/api/apiClient";
import { endpoints } from "@/api/endpoints";
import { useAuth } from "@/auth/AuthContext";
import type { BookingListItem } from "@/models";
import { showNewBookingNotification } from "@/notifications/bookingNotifications";

const LAST_SEEN_BOOKING_CREATED_AT_KEY = "sv_admin_last_seen_booking_created_at";
const POLL_INTERVAL_MS = 30000;
const POLL_LIMIT = 50;
const MAX_RECONCILE_PAGES = 3;

type BookingCursor = {
  createdAt: number;
  idsAtCreatedAt: string[];
};

function createdAtTime(booking: BookingListItem): number {
  const time = new Date(booking.createdAt).getTime();
  return Number.isFinite(time) ? time : 0;
}

function newestBookingTime(bookings: BookingListItem[]): number {
  return Math.max(0, ...bookings.map(createdAtTime));
}

function isNotifiableBooking(booking: BookingListItem): boolean {
  return booking.isDraft !== true && booking.status !== "CANCELLED";
}

function cursorKey(userId: string | undefined): string {
  return `${LAST_SEEN_BOOKING_CREATED_AT_KEY}_${userId ?? "unknown"}`;
}

function cursorFromBookings(bookings: BookingListItem[]): BookingCursor | null {
  const latestTime = newestBookingTime(bookings);
  if (latestTime <= 0) return null;
  return {
    createdAt: latestTime,
    idsAtCreatedAt: bookings.filter((booking) => createdAtTime(booking) === latestTime).map((booking) => booking.id),
  };
}

function isAfterCursor(booking: BookingListItem, cursor: BookingCursor): boolean {
  const time = createdAtTime(booking);
  if (time > cursor.createdAt) return true;
  if (time < cursor.createdAt) return false;
  return !cursor.idsAtCreatedAt.includes(booking.id);
}

export function useNewBookingNotifications(onNewBooking?: (booking: BookingListItem) => void): void {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const cursorRef = useRef<BookingCursor | null>(null);
  const seenIdsRef = useRef<Set<string>>(new Set());
  const isCheckingRef = useRef(false);

  useEffect(() => {
    if (!isAuthenticated) return undefined;

    const subscription = Notifications.addNotificationResponseReceivedListener((response) => {
      const bookingId = response.notification.request.content.data?.bookingId;
      if (typeof bookingId === "string" && bookingId.length > 0) {
        router.push(`/bookings/${bookingId}`);
      }
    });

    return () => subscription.remove();
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (!isAuthenticated) {
      cursorRef.current = null;
      seenIdsRef.current = new Set();
      return undefined;
    }

    let cancelled = false;

    async function loadCursor(): Promise<BookingCursor | null> {
      if (cursorRef.current !== null) return cursorRef.current;

      try {
        const raw = await AsyncStorage.getItem(cursorKey(user?.id));
        if (!raw) return null;
        const parsed = JSON.parse(raw) as Partial<BookingCursor>;
        const cursor = typeof parsed.createdAt === "number" && Array.isArray(parsed.idsAtCreatedAt)
          ? { createdAt: parsed.createdAt, idsAtCreatedAt: parsed.idsAtCreatedAt.filter((id): id is string => typeof id === "string") }
          : null;
        cursorRef.current = cursor;
        return cursor;
      } catch (error) {
        console.warn("[notifications] cursor restore failed", error);
        return null;
      }
    }

    async function saveCursor(value: BookingCursor): Promise<void> {
      cursorRef.current = value;
      await AsyncStorage.setItem(cursorKey(user?.id), JSON.stringify(value));
    }

    async function fetchRecentBookings(): Promise<BookingListItem[]> {
      const all: BookingListItem[] = [];
      for (let page = 1; page <= MAX_RECONCILE_PAGES; page += 1) {
        const response = await apiClient.getPaginated<BookingListItem>(
          endpoints.bookings({ page, limit: POLL_LIMIT })
        );
        all.push(...response.data);
        if (page * response.pagination.limit >= response.pagination.total) break;
      }
      return all.filter(isNotifiableBooking);
    }

    async function checkForNewBookings(): Promise<void> {
      if (isCheckingRef.current || cancelled) return;
      isCheckingRef.current = true;

      try {
        const bookings = await fetchRecentBookings();
        if (cancelled) return;

        const latestCursor = cursorFromBookings(bookings);
        const cursor = await loadCursor();

        if (cursor === null) {
          bookings.forEach((booking) => seenIdsRef.current.add(booking.id));
          if (latestCursor) await saveCursor(latestCursor);
          return;
        }

        const newBookings = bookings
          .filter((booking) => isAfterCursor(booking, cursor) && !seenIdsRef.current.has(booking.id))
          .sort((a, b) => createdAtTime(a) - createdAtTime(b));

        for (const booking of newBookings) {
          if (cancelled) return;
          seenIdsRef.current.add(booking.id);
          onNewBooking?.(booking);
          const sounded = await showNewBookingNotification(booking, user?.id);
          if (!sounded) {
            console.info("[notifications] visible alert delivered without notification sound", booking.reference);
          }
        }

        if (latestCursor && (latestCursor.createdAt > cursor.createdAt || newBookings.length > 0)) {
          await saveCursor(latestCursor);
        }

        if (seenIdsRef.current.size > POLL_LIMIT * 3) {
          seenIdsRef.current = new Set(Array.from(seenIdsRef.current).slice(-POLL_LIMIT));
        }
      } catch (error) {
        console.warn("[notifications] booking reconciliation failed", error);
      } finally {
        isCheckingRef.current = false;
      }
    }

    void checkForNewBookings();
    const interval = setInterval(() => {
      void checkForNewBookings();
    }, POLL_INTERVAL_MS);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [isAuthenticated, onNewBooking, user?.id]);
}
