import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import type { BookingListItem } from "@/models";
import { formatDate, formatMoney } from "@/utils/format";

export const NEW_BOOKING_NOTIFICATION_SOUND = "new-booking.mp3";
export const NEW_BOOKING_CHANNEL_ID = "new-bookings";

let setupPromise: Promise<boolean> | null = null;

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    priority: Notifications.AndroidNotificationPriority.MAX,
  }),
});

async function setupAndroidChannel(): Promise<void> {
  if (Platform.OS !== "android") return;

  await Notifications.setNotificationChannelAsync(NEW_BOOKING_CHANNEL_ID, {
    name: "New bookings",
    description: "Alerts when a new SpeedyVan booking arrives.",
    importance: Notifications.AndroidImportance.MAX,
    sound: NEW_BOOKING_NOTIFICATION_SOUND,
    vibrationPattern: [0, 250, 250, 250],
    lightColor: "#F97316",
  });
}

export async function ensureNewBookingNotificationSetup(): Promise<boolean> {
  if (Platform.OS === "web") return false;

  if (!setupPromise) {
    setupPromise = (async () => {
      await setupAndroidChannel();

      const current = await Notifications.getPermissionsAsync();
      const requested = current.granted
        ? current
        : await Notifications.requestPermissionsAsync({
            ios: {
              allowAlert: true,
              allowBadge: true,
              allowSound: true,
            },
          });

      return requested.granted;
    })();
  }

  return setupPromise;
}

export async function showNewBookingNotification(booking: BookingListItem): Promise<void> {
  const allowed = await ensureNewBookingNotificationSetup();
  if (!allowed) return;

  const serviceName = booking.serviceName ?? booking.serviceSlug;
  const date = formatDate(booking.scheduledDate ?? booking.scheduledAt);

  await Notifications.scheduleNotificationAsync({
    content: {
      title: "New booking received",
      subtitle: booking.reference,
      body: `${booking.customerName} - ${serviceName} - ${formatMoney(booking.totalPrice)} - ${date}`,
      sound: NEW_BOOKING_NOTIFICATION_SOUND,
      data: {
        bookingId: booking.id,
        reference: booking.reference,
      },
      interruptionLevel: "timeSensitive",
      priority: Notifications.AndroidNotificationPriority.MAX,
    },
    trigger: null,
  });
}
