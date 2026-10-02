import { Text, View } from "react-native";

type StatusBadgeProps = {
  label: string;
  color: string;
};

export function StatusBadge({ label, color }: StatusBadgeProps): JSX.Element {
  return (
    <View
      className="self-start rounded-full px-2.5 py-1"
      style={{ backgroundColor: `${color}18`, borderWidth: 1, borderColor: `${color}35` }}
    >
      <Text
        className="text-[11px] font-extrabold uppercase"
        style={{ color, letterSpacing: 0.4 }}
        numberOfLines={1}
      >
        {label}
      </Text>
    </View>
  );
}
