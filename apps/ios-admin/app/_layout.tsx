import "../global.css";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { AuthGate, AuthProvider, useAuth } from "@/auth/AuthContext";
import { AppErrorBoundary } from "@/components/AppErrorBoundary";
import { LoadingView } from "@/components/LoadingView";
import { useNewBookingNotifications } from "@/hooks/useNewBookingNotifications";

export default function RootLayout() {
  return (
    <AppErrorBoundary>
      <AuthProvider>
        <AuthGate>
          <NewBookingNotificationWatcher />
          <RootStack />
        </AuthGate>
        <StatusBar style="dark" />
      </AuthProvider>
    </AppErrorBoundary>
  );
}

function NewBookingNotificationWatcher() {
  useNewBookingNotifications();
  return null;
}

function RootStack() {
  const { status } = useAuth();

  if (status === "loading") return <LoadingView label="Restoring session..." />;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}
