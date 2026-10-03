import { Ionicons } from "@expo/vector-icons";
import { usePathname, useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { AnimatedVisitorCount } from "@/components/AnimatedVisitorCount";
import { useVisitors } from "@/hooks/useVisitors";
import { colors } from "@/theme/colors";

function counterStatus(
  value: number | null,
  isLoading: boolean,
  isRefreshing: boolean,
  stale: boolean,
  error: string | null,
): { label: string; colour: string } {
  if (value === null && isLoading) return { label: "Loading", colour: "#94A3B8" };
  if (value === null && error) return { label: "Unavailable", colour: colors.svWarning };
  if (stale) return { label: "Stale", colour: colors.svWarning };
  if (isRefreshing) return { label: "Updating", colour: colors.svBrandBorder };
  return { label: "Active now", colour: colors.svGreen };
}

export function VisitorHeaderCounter(): JSX.Element {
  const router = useRouter();
  const pathname = usePathname();
  const visitors = useVisitors();
  const value = visitors.activeCount;
  const status = counterStatus(
    value,
    visitors.realtime.isInitialLoading,
    visitors.realtime.isRefreshing,
    visitors.realtime.stale,
    visitors.realtime.error,
  );

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Open visitors"
      hitSlop={8}
      onPress={() => {
        if (pathname !== "/visitors") router.push("/visitors");
      }}
      className="rounded-2xl px-3 py-2"
      style={{
        minWidth: 88,
        backgroundColor: "rgba(255,255,255,0.08)",
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.12)",
      }}
    >
      <View className="flex-row items-center justify-end gap-1.5">
        <Ionicons name="radio" size={14} color={status.colour} />
        <AnimatedVisitorCount
          value={value}
          accessibilityLabel="Active visitors now"
          style={{ color: "#FFFFFF" }}
        />
      </View>
      <Text
        className="mt-0.5 text-right text-[10px] font-extrabold uppercase"
        style={{ color: status.colour, letterSpacing: 0.4 }}
        numberOfLines={1}
      >
        {status.label}
      </Text>
    </Pressable>
  );
}
