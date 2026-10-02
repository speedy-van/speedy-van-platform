import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { createContext, useCallback, useContext, useMemo, useRef, useState, type PropsWithChildren } from "react";
import { Modal, Pressable, Text, Vibration, View } from "react-native";
import type { BookingListItem } from "@/models";
import { useNotificationSettings } from "@/notifications/notificationSettings";
import { colors } from "@/theme/colors";
import { formatDate, formatMoney } from "@/utils/format";

type BookingAlertContextValue = {
  enqueueBookingAlert: (booking: BookingListItem) => void;
  clearBookingAlert: (bookingId: string) => void;
};

const BookingAlertContext = createContext<BookingAlertContextValue | null>(null);
const MAX_QUEUE_SIZE = 10;

function bookingSummary(booking: BookingListItem): string {
  const pickup = booking.pickupAddress || "Pickup TBC";
  const dropoff = booking.dropoffAddress || "Drop-off TBC";
  return `${pickup} -> ${dropoff}`;
}

export function BookingAlertProvider({ children }: PropsWithChildren): JSX.Element {
  const router = useRouter();
  const { settings } = useNotificationSettings();
  const [queue, setQueue] = useState<BookingListItem[]>([]);
  const [isNavigating, setIsNavigating] = useState(false);
  const seenIdsRef = useRef<Set<string>>(new Set());
  const active = queue[0] ?? null;

  const dismissActive = useCallback(() => {
    setQueue((current) => current.slice(1));
    setIsNavigating(false);
  }, []);

  const navigateToBooking = useCallback(() => {
    if (!active || isNavigating) return;
    setIsNavigating(true);
    const bookingId = active.id;
    dismissActive();
    router.push(`/bookings/${bookingId}`);
  }, [active, dismissActive, isNavigating, router]);

  const enqueueBookingAlert = useCallback((booking: BookingListItem) => {
    if (booking.isDraft) return;
    if (seenIdsRef.current.has(booking.id)) return;
    seenIdsRef.current.add(booking.id);

    setQueue((current) => {
      if (current.some((item) => item.id === booking.id)) return current;
      return [...current, booking].slice(-MAX_QUEUE_SIZE);
    });

    if (settings.hapticsEnabled) {
      Vibration.vibrate(140);
    }
  }, [settings.hapticsEnabled]);

  const clearBookingAlert = useCallback((bookingId: string) => {
    setQueue((current) => current.filter((booking) => booking.id !== bookingId));
  }, []);

  const value = useMemo<BookingAlertContextValue>(
    () => ({ enqueueBookingAlert, clearBookingAlert }),
    [clearBookingAlert, enqueueBookingAlert]
  );

  return (
    <BookingAlertContext.Provider value={value}>
      {children}
      <Modal
        visible={active !== null}
        animationType="slide"
        transparent
        onRequestClose={dismissActive}
        accessibilityViewIsModal
      >
        <View className="flex-1 justify-end bg-black/30">
          <View className="rounded-t-3xl bg-white px-5 pb-8 pt-4">
            <View className="mx-auto mb-4 h-1 w-12 rounded-full bg-slate-200" />
            {active ? (
              <>
                <View className="flex-row items-start gap-3">
                  <View className="h-12 w-12 items-center justify-center rounded-2xl bg-svBrandSubtle">
                    <Ionicons name="notifications" size={24} color={colors.svBrand} />
                  </View>
                  <View className="flex-1">
                    <Text className="text-xs font-extrabold uppercase text-slate-500">New booking</Text>
                    <Text className="mt-1 text-xl font-extrabold text-svDark" numberOfLines={1}>
                      {active.reference}
                    </Text>
                    <Text className="mt-1 text-sm font-bold text-slate-600" numberOfLines={1}>
                      {active.serviceName ?? active.serviceSlug}
                    </Text>
                  </View>
                  <Pressable onPress={dismissActive} className="h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
                    <Ionicons name="close" size={18} color={colors.muted} />
                  </Pressable>
                </View>

                <View className="mt-4 gap-3 rounded-2xl bg-svSoft p-4">
                  <AlertInfo label="Route" value={bookingSummary(active)} />
                  <AlertInfo label="Scheduled" value={`${formatDate(active.scheduledDate ?? active.scheduledAt)} - ${active.timeSlot ?? active.selectedTimeSlot ?? "Time TBC"}`} />
                  <AlertInfo label="Quoted" value={formatMoney(active.totalPrice ?? active.price)} />
                  <AlertInfo label="Payment / status" value={active.status} />
                </View>

                {queue.length > 1 ? (
                  <Text className="mt-3 text-center text-xs font-bold text-slate-500">
                    {queue.length - 1} more alert{queue.length > 2 ? "s" : ""} queued
                  </Text>
                ) : null}

                <View className="mt-5 gap-3">
                  <Pressable
                    disabled={isNavigating}
                    onPress={navigateToBooking}
                    className="flex-row items-center justify-center gap-2 rounded-2xl bg-svBrand px-4 py-4"
                  >
                    <Ionicons name="open-outline" size={18} color="#FFFFFF" />
                    <Text className="text-base font-extrabold text-white">View booking</Text>
                  </Pressable>
                  <Pressable
                    disabled={isNavigating}
                    onPress={navigateToBooking}
                    className="flex-row items-center justify-center gap-2 rounded-2xl bg-svDark px-4 py-4"
                  >
                    <Ionicons name="person-add-outline" size={18} color="#FFFFFF" />
                    <Text className="text-base font-extrabold text-white">Assign driver</Text>
                  </Pressable>
                  <Pressable onPress={dismissActive} className="items-center rounded-2xl bg-slate-100 px-4 py-4">
                    <Text className="text-base font-extrabold text-slate-600">Dismiss</Text>
                  </Pressable>
                </View>
              </>
            ) : null}
          </View>
        </View>
      </Modal>
    </BookingAlertContext.Provider>
  );
}

function AlertInfo({ label, value }: { label: string; value: string }): JSX.Element {
  return (
    <View>
      <Text className="text-[11px] font-extrabold uppercase text-slate-400">{label}</Text>
      <Text className="mt-0.5 text-sm font-bold text-svDark" numberOfLines={2}>
        {value}
      </Text>
    </View>
  );
}

export function useBookingAlerts(): BookingAlertContextValue {
  const context = useContext(BookingAlertContext);
  if (!context) {
    throw new Error("useBookingAlerts must be used inside BookingAlertProvider");
  }
  return context;
}
