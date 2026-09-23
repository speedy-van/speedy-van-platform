import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";
import { colors } from "@/theme/colors";

type ErrorBannerProps = {
  message: string;
};

export function ErrorBanner({ message }: ErrorBannerProps): JSX.Element {
  return (
    <View className="mx-4 mt-4 flex-row items-start gap-3 rounded-lg border border-red-100 bg-red-50 p-3">
      <View className="h-8 w-8 items-center justify-center rounded-lg bg-white">
        <Ionicons name="warning" size={18} color={colors.svRed} />
      </View>
      <Text className="flex-1 text-sm font-bold leading-5 text-red-700">{message}</Text>
    </View>
  );
}
