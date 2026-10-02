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
    <View className="flex-1 overflow-hidden rounded-2xl p-4" style={{ backgroundColor: `${color}12`, minHeight: 120 }}>
      <View className="flex-row items-start justify-between">
        <View
          className="h-11 w-11 items-center justify-center rounded-xl"
          style={{ backgroundColor: `${color}22` }}
        >
          <Ionicons name={icon} size={22} color={color} />
        </View>
        <View className="h-2 w-2 rounded-full" style={{ backgroundColor: `${color}50`, marginTop: 4 }} />
      </View>
      <Text
        className="mt-3 text-3xl font-extrabold text-svDark"
        numberOfLines={1}
        adjustsFontSizeToFit
        style={{ letterSpacing: -0.5 }}
      >
        {value}
      </Text>
      <Text className="mt-1 text-xs font-extrabold uppercase" style={{ color: `${color}CC`, letterSpacing: 0.5 }} numberOfLines={1}>
        {title}
      </Text>
    </View>
  );
}
