import { Ionicons } from "@expo/vector-icons";
import type { ComponentProps } from "react";
import { Text, View } from "react-native";

type IconName = ComponentProps<typeof Ionicons>["name"];

type EmptyStateProps = {
  icon: IconName;
  title: string;
  message: string;
};

export function EmptyState({ icon, title, message }: EmptyStateProps): JSX.Element {
  return (
    <View className="flex-1 items-center justify-center p-8">
      <View className="h-16 w-16 items-center justify-center rounded-lg bg-white shadow-sm">
        <Ionicons name={icon} size={34} color="#F97316" />
      </View>
      <Text className="mt-4 text-lg font-extrabold text-svDark">{title}</Text>
      <Text className="mt-2 max-w-sm text-center text-sm leading-5 text-slate-500">{message}</Text>
    </View>
  );
}
