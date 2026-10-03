import "../global.css";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useCallback } from "react";
import { BookingAlertProvider, useBookingAlerts } from "@/alerts/BookingAlertProvider";
import { AuthGate, AuthProvider, useAuth } from "@/auth/AuthContext";
import { AppErrorBoundary } from "@/components/AppErrorBoundary";
import { LoadingView } from "@/components/LoadingView";
import { useNewBookingNotifications } from "@/hooks/useNewBookingNotifications";
import type { BookingListItem } from "@/models";
import { VisitorsProvider } from "@/visitors/VisitorsProvider";

export default function RootLayout() {
  return (
    <AppErrorBoundary>
      <AuthProvider>
        <AuthGate>
          <BookingAlertProvider>
            <VisitorsProvider>
              <NewBookingNotificationWatcher />
              <RootStack />
            </VisitorsProvider>
          </BookingAlertProvider>
        </AuthGate>
        <StatusBar style="dark" />
      </AuthProvider>
    </AppErrorBoundary>
  );
}

function NewBookingNotificationWatcher() {
  const { enqueueBookingAlert } = useBookingAlerts();
  const onNewBooking = useCallback((booking: BookingListItem) => {
    enqueueBookingAlert(booking);
  }, [enqueueBookingAlert]);

  useNewBookingNotifications(onNewBooking);
  return null;
}

function RootStack() {
  const { status } = useAuth();

  if (status === "loading") return <LoadingView label="Restoring session..." />;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="visitors" />
    </Stack>
  );
}
