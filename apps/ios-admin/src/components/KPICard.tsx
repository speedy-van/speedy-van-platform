import { Ionicons } from "@expo/vector-icons";
import type { ComponentProps } from "react";
import { Text, View } from "react-native";
import { colors } from "@/theme/colors";

type IconName = ComponentProps<typeof Ionicons>["name"];

type KPICardProps = {
  title: string;
  value: string;
  icon: IconName;
  color?: string;
};

export function KPICard({ title, value, icon, color = colors.svBrand }: KPICardProps): JSX.Element {
  return (
    <View className="min-h-36 flex-1 overflow-hidden rounded-lg border border-svLine bg-white p-4 shadow-sm">
      <View className="absolute left-0 top-0 h-full w-1" style={{ backgroundColor: color }} />
      <View className="mb-4 flex-row items-center justify-between">
        <View className="h-10 w-10 items-center justify-center rounded-lg" style={{ backgroundColor: `${color}18` }}>
          <Ionicons name={icon} size={21} color={color} />
        </View>
      </View>
      <Text className="text-3xl font-extrabold text-svDark" numberOfLines={1} adjustsFontSizeToFit>
        {value}
      </Text>
      <Text className="mt-2 text-xs font-extrabold uppercase text-slate-500" numberOfLines={2}>
        {title}
      </Text>
    </View>
  );
}
