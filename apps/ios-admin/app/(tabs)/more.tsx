import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import type { ComponentProps } from "react";
import { Pressable, Text, View } from "react-native";
import { useAuth } from "@/auth/AuthContext";
import { ActionButton, HeaderMetric, ScreenHeader, ScreenShell, SectionCard } from "@/components/AppScaffold";
import { colors } from "@/theme/colors";

type IconName = ComponentProps<typeof Ionicons>["name"];

export default function MoreRoute() {
  const router = useRouter();
  const { logout, user } = useAuth();

  return (
    <ScreenShell>
      <ScreenHeader
        title="More"
        subtitle="Admin shortcuts, account context, and secure sign out."
        eyebrow="Workspace"
        icon="grid"
      >
        <View className="flex-row flex-wrap gap-2">
          <HeaderMetric label="Signed in" value={user?.name ?? "Admin"} icon="shield-checkmark" />
          <HeaderMetric label="Role" value={user?.role ?? "Admin"} icon="key" />
        </View>
      </ScreenHeader>
      <View className="gap-4 p-4">
        <SectionCard title="Profile" subtitle={user?.email ?? "Signed in"} icon="person-circle-outline">
          <Text className="text-2xl font-extrabold text-svDark" numberOfLines={1} adjustsFontSizeToFit>
            {user?.name ?? "Admin"}
          </Text>
          <Text className="mt-1 text-sm font-bold text-slate-500">{user?.email ?? "Signed in"}</Text>
        </SectionCard>
        <View className="gap-3">
          <MoreLink icon="analytics-outline" title="Analytics" subtitle="Revenue and demand trends" onPress={() => router.push("/analytics")} />
          <MoreLink icon="pulse-outline" title="Visitors" subtitle="Live website sessions" onPress={() => router.push("/visitors")} />
          <MoreLink icon="images-outline" title="Images" subtitle="Remove, replace, or upload media" onPress={() => router.push("/images")} />
          <MoreLink icon="mail-outline" title="Enquiries" subtitle="European quote requests" onPress={() => router.push("/enquiries")} />
          <MoreLink icon="notifications-outline" title="Notifications" subtitle="Admin alerts and events" onPress={() => router.push("/notifications")} />
        </View>
        <ActionButton label="Logout" icon="log-out-outline" tone="danger" onPress={() => void logout()} />
      </View>
    </ScreenShell>
  );
}

function MoreLink({ icon, title, subtitle, onPress }: { icon: IconName; title: string; subtitle: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} className="flex-row items-center gap-3 rounded-lg border border-svLine bg-white p-4 shadow-sm">
      <View className="h-11 w-11 items-center justify-center rounded-lg bg-svBrandSubtle">
        <Ionicons name={icon} size={21} color={colors.svBrand} />
      </View>
      <View className="flex-1">
        <Text className="text-base font-extrabold text-svDark">{title}</Text>
        <Text className="mt-0.5 text-sm font-bold text-slate-500">{subtitle}</Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color={colors.muted} />
    </Pressable>
  );
}
