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

function createdAtTime(booking: BookingListItem): number {
  const time = new Date(booking.createdAt).getTime();
  return Number.isFinite(time) ? time : 0;
}

function newestBookingTime(bookings: BookingListItem[]): number {
  return Math.max(0, ...bookings.map(createdAtTime));
}

export function useNewBookingNotifications(): void {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const lastSeenRef = useRef<number | null>(null);
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
      lastSeenRef.current = null;
      seenIdsRef.current = new Set();
      return undefined;
    }

    let cancelled = false;

    async function loadLastSeen(): Promise<number | null> {
      if (lastSeenRef.current !== null) return lastSeenRef.current;

      const raw = await AsyncStorage.getItem(LAST_SEEN_BOOKING_CREATED_AT_KEY);
      const parsed = raw ? Number(raw) : 0;
      const value = Number.isFinite(parsed) && parsed > 0 ? parsed : null;
      lastSeenRef.current = value;
      return value;
    }

    async function saveLastSeen(value: number): Promise<void> {
      lastSeenRef.current = value;
      await AsyncStorage.setItem(LAST_SEEN_BOOKING_CREATED_AT_KEY, String(value));
    }

    async function checkForNewBookings(): Promise<void> {
      if (isCheckingRef.current || cancelled) return;
      isCheckingRef.current = true;

      try {
        const response = await apiClient.getPaginated<BookingListItem>(
          endpoints.bookings({ page: 1, limit: POLL_LIMIT })
        );
        if (cancelled) return;

        const bookings = response.data;
        const latestTime = newestBookingTime(bookings);
        const lastSeen = await loadLastSeen();

        if (lastSeen === null) {
          bookings.forEach((booking) => seenIdsRef.current.add(booking.id));
          if (latestTime > 0) await saveLastSeen(latestTime);
          return;
        }

        const newBookings = bookings
          .filter((booking) => createdAtTime(booking) > lastSeen && !seenIdsRef.current.has(booking.id))
          .sort((a, b) => createdAtTime(a) - createdAtTime(b));

        for (const booking of newBookings) {
          if (cancelled) return;
          seenIdsRef.current.add(booking.id);
          await showNewBookingNotification(booking);
        }

        if (latestTime > lastSeen) {
          await saveLastSeen(latestTime);
        }

        if (seenIdsRef.current.size > POLL_LIMIT * 3) {
          seenIdsRef.current = new Set(Array.from(seenIdsRef.current).slice(-POLL_LIMIT));
        }
      } catch {
        // Keep the watcher quiet; regular screens already surface API/auth errors.
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
  }, [isAuthenticated]);
}
