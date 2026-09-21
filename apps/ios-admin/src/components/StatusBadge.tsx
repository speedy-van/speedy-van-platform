import { Text, View } from "react-native";

type StatusBadgeProps = {
  label: string;
  color: string;
};

export function StatusBadge({ label, color }: StatusBadgeProps): JSX.Element {
  return (
    <View className="self-start rounded-lg border px-2.5 py-1" style={{ backgroundColor: `${color}14`, borderColor: `${color}40` }}>
      <Text className="text-xs font-extrabold uppercase" style={{ color }} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}
