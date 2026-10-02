import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import type { BookingListItem } from "@/models";
import { loadNotificationSettings } from "@/notifications/notificationSettings";
import { formatDate, formatMoney } from "@/utils/format";

export const NEW_BOOKING_NOTIFICATION_SOUND = "new-booking.wav";
export const NEW_BOOKING_CHANNEL_ID = "new-bookings";

let setupPromise: Promise<boolean> | null = null;
let handlerConfigured = false;

function configureNotificationHandler(): void {
  if (handlerConfigured) return;
  handlerConfigured = true;

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
      priority: Notifications.AndroidNotificationPriority.MAX,
    }),
  });
}

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

export async function ensureNewBookingNotificationSetup(options: { requestIfUndetermined?: boolean } = {}): Promise<boolean> {
  if (Platform.OS === "web") return false;
  configureNotificationHandler();

  const current = await Notifications.getPermissionsAsync();
  if (current.granted) {
    await setupAndroidChannel();
    return true;
  }

  if (!options.requestIfUndetermined) {
    return false;
  }

  if (!setupPromise) {
    setupPromise = (async () => {
      await setupAndroidChannel();

      const requested = await Notifications.requestPermissionsAsync({
        ios: {
          allowAlert: true,
          allowBadge: true,
          allowSound: true,
        },
      });

      return requested.granted;
    })().catch((error) => {
      console.warn("[notifications] setup failed", error);
      setupPromise = null;
      return false;
    });
  }

  return setupPromise;
}

export async function showNewBookingNotification(booking: BookingListItem, userId?: string): Promise<boolean> {
  if (booking.isDraft) return false;
  const settings = await loadNotificationSettings(userId);
  if (!settings.soundEnabled) return false;

  const allowed = await ensureNewBookingNotificationSetup();
  if (!allowed) return false;

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
  return true;
}

export async function previewNewBookingSound(): Promise<boolean> {
  const allowed = await ensureNewBookingNotificationSetup({ requestIfUndetermined: true });
  if (!allowed) return false;

  await Notifications.scheduleNotificationAsync({
    content: {
      title: "SpeedyVan Admin",
      body: "Notification sound preview",
      sound: NEW_BOOKING_NOTIFICATION_SOUND,
      data: {
        preview: true,
      },
      priority: Notifications.AndroidNotificationPriority.DEFAULT,
    },
    trigger: null,
  });
  return true;
}
