import { Ionicons } from "@expo/vector-icons";
import Constants from "expo-constants";
import * as Notifications from "expo-notifications";
import { useRouter } from "expo-router";
import type { ComponentProps } from "react";
import { useEffect, useState } from "react";
import { Alert, Pressable, ScrollView, Switch, Text, View } from "react-native";
import { useAuth } from "@/auth/AuthContext";
import { ActionButton, ScreenHeader, ScreenShell } from "@/components/AppScaffold";
import { VisitorHeaderCounter } from "@/components/VisitorHeaderCounter";
import { useVisitors } from "@/hooks/useVisitors";
import { previewNewBookingSound } from "@/notifications/bookingNotifications";
import { useNotificationSettings } from "@/notifications/notificationSettings";
import { colors } from "@/theme/colors";

type IconName = ComponentProps<typeof Ionicons>["name"];

function initials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0] ?? "")
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function visitorsBadge(count: number | null, stale: boolean, loading: boolean, error: string | null): string {
  if (count !== null) return stale ? `${count} stale` : `${count} active`;
  if (loading) return "Loading";
  if (error) return "Unavailable";
  return "";
}

export default function MoreRoute() {
  const router = useRouter();
  const { logout, user, startupPhase } = useAuth();
  const visitors = useVisitors();
  const { settings, update } = useNotificationSettings();
  const displayName = user?.name ?? "Admin";
  const [permissionStatus, setPermissionStatus] = useState("Not checked");
  const visitorRightLabel = visitorsBadge(
    visitors.activeCount,
    visitors.realtime.stale,
    visitors.realtime.isInitialLoading,
    visitors.realtime.error,
  );

  useEffect(() => {
    let cancelled = false;
    void Notifications.getPermissionsAsync()
      .then((permission) => {
        if (!cancelled) setPermissionStatus(permission.status);
      })
      .catch(() => {
        if (!cancelled) setPermissionStatus("Unavailable");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  async function previewSound(): Promise<void> {
    const played = await previewNewBookingSound();
    if (!played) {
      Alert.alert("Notifications unavailable", "Allow notifications in iOS Settings to hear the booking sound preview.");
    } else {
      setPermissionStatus("granted");
    }
  }

  async function signOut(): Promise<void> {
    try {
      await logout();
    } catch {
      Alert.alert("Sign out failed", "Please check the connection and try again.");
    }
  }

  return (
    <ScreenShell>
      <ScreenHeader
        title="More"
        subtitle="Admin tools, account info, and sign out."
        eyebrow="Workspace"
        icon="grid"
        right={<VisitorHeaderCounter />}
      />
      <ScrollView contentContainerClassName="gap-4 p-4 pb-8">
        <View
          className="overflow-hidden rounded-2xl bg-white p-4"
          style={{ borderWidth: 1, borderColor: colors.svLine }}
        >
          <View className="flex-row items-center gap-3">
            <View
              className="h-14 w-14 items-center justify-center rounded-2xl"
              style={{ backgroundColor: `${colors.svBrand}18` }}
            >
              <Text className="text-xl font-extrabold" style={{ color: colors.svBrand }}>
                {initials(displayName)}
              </Text>
            </View>
            <View className="flex-1">
              <Text className="text-lg font-extrabold text-svDark" numberOfLines={1} style={{ letterSpacing: -0.3 }}>
                {displayName}
              </Text>
              <Text className="mt-0.5 text-sm text-slate-500" numberOfLines={1}>
                {user?.email ?? ""}
              </Text>
            </View>
            <View
              className="rounded-full px-2.5 py-1"
              style={{ backgroundColor: `${colors.svGreen}15` }}
            >
              <Text className="text-[11px] font-extrabold" style={{ color: colors.svGreen }}>
                {user?.role ?? "Admin"}
              </Text>
            </View>
          </View>
        </View>
        <View
          className="overflow-hidden rounded-2xl bg-white"
          style={{ borderWidth: 1, borderColor: colors.svLine }}
        >
          <MoreLink icon="analytics-outline" title="Analytics" subtitle="Revenue and demand trends" onPress={() => router.navigate("/analytics")} />
          <MoreLink icon="people-outline" title="Drivers" subtitle="Fleet records and driver actions" onPress={() => router.navigate("/drivers")} />
          <MoreLink icon="briefcase-outline" title="Dispatch" subtitle="Published jobs and driver pay" onPress={() => router.navigate("/jobs")} />
          <MoreLink
            icon="pulse-outline"
            title="Visitors"
            subtitle="Live website sessions"
            rightLabel={visitorRightLabel}
            onPress={() => router.push("/visitors")}
          />
          <MoreLink icon="images-outline" title="Images" subtitle="Manage media assets" onPress={() => router.navigate("/images")} />
          <MoreLink icon="mail-outline" title="Enquiries" subtitle="European and storage quote requests" onPress={() => router.navigate("/enquiries")} />
          <MoreLink icon="notifications-outline" title="Notifications" subtitle="Admin alerts and events" onPress={() => router.navigate("/notifications")} isLast />
        </View>

        <View
          className="overflow-hidden rounded-2xl bg-white p-4"
          style={{ borderWidth: 1, borderColor: colors.svLine }}
        >
          <Text className="text-base font-extrabold text-svDark">Alert Settings</Text>
          <SettingsRow
            icon="volume-high-outline"
            title="Booking sound"
            subtitle="Play the bundled notification chime when supported."
            value={settings.soundEnabled}
            onValueChange={(value) => update({ soundEnabled: value })}
          />
          <SettingsRow
            icon="phone-portrait-outline"
            title="Haptic pulse"
            subtitle="Vibrate briefly for foreground booking alerts."
            value={settings.hapticsEnabled}
            onValueChange={(value) => update({ hapticsEnabled: value })}
          />
          <View className="mt-4 rounded-2xl bg-svSoft p-3">
            <Text className="text-xs font-extrabold uppercase text-slate-400">iOS notification permission</Text>
            <Text className="mt-1 text-sm font-bold text-svDark">{permissionStatus}</Text>
          </View>
          <View className="mt-4">
            <ActionButton label="Preview Sound" icon="play-outline" tone="dark" onPress={() => void previewSound()} />
          </View>
        </View>

        <View
          className="overflow-hidden rounded-2xl bg-white p-4"
          style={{ borderWidth: 1, borderColor: colors.svLine }}
        >
          <Text className="text-base font-extrabold text-svDark">Build Diagnostics</Text>
          <Text className="mt-2 text-xs font-bold text-slate-500">Root: apps/ios-admin</Text>
          <Text className="mt-1 text-xs font-bold text-slate-500">Bundle: co.uk.speedy-van.admin</Text>
          <Text className="mt-1 text-xs font-bold text-slate-500">
            Version: {Constants.expoConfig?.version ?? "unknown"} ({Constants.expoConfig?.ios?.buildNumber ?? "unknown"})
          </Text>
          <Text className="mt-1 text-xs font-bold text-slate-500">Startup: {startupPhase}</Text>
        </View>
        <ActionButton label="Sign Out" icon="log-out-outline" tone="danger" onPress={() => void signOut()} />
      </ScrollView>
    </ScreenShell>
  );
}

function SettingsRow({
  icon,
  title,
  subtitle,
  value,
  onValueChange,
}: {
  icon: IconName;
  title: string;
  subtitle: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
}) {
  return (
    <View className="mt-4 flex-row items-center gap-3">
      <View className="h-10 w-10 items-center justify-center rounded-xl bg-svBrandSubtle">
        <Ionicons name={icon} size={19} color={colors.svBrand} />
      </View>
      <View className="flex-1">
        <Text className="text-sm font-extrabold text-svDark">{title}</Text>
        <Text className="mt-0.5 text-xs text-slate-500">{subtitle}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: "#CBD5E1", true: colors.svBrandBorder }}
        thumbColor={value ? colors.svBrand : "#FFFFFF"}
      />
    </View>
  );
}

function MoreLink({
  icon,
  title,
  subtitle,
  rightLabel,
  onPress,
  isLast = false,
}: {
  icon: IconName;
  title: string;
  subtitle: string;
  rightLabel?: string;
  onPress: () => void;
  isLast?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center gap-3 px-4 py-3.5"
      style={!isLast ? { borderBottomWidth: 1, borderBottomColor: "#F1F5F9" } : undefined}
    >
      <View
        className="h-10 w-10 items-center justify-center rounded-xl"
        style={{ backgroundColor: `${colors.svBrand}14` }}
      >
        <Ionicons name={icon} size={19} color={colors.svBrand} />
      </View>
      <View className="flex-1">
        <Text className="text-[15px] font-extrabold text-svDark">{title}</Text>
        <Text className="mt-0.5 text-xs text-slate-500">{subtitle}</Text>
      </View>
      {rightLabel ? (
        <Text className="text-xs font-extrabold text-svBrandStrong" numberOfLines={1}>
          {rightLabel}
        </Text>
      ) : null}
      <Ionicons name="chevron-forward" size={16} color="#CBD5E1" />
    </Pressable>
  );
}
