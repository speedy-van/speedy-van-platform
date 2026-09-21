import { ActivityIndicator, Text, View } from "react-native";
import { colors } from "@/theme/colors";

type LoadingViewProps = {
  label?: string;
};

export function LoadingView({ label = "Loading..." }: LoadingViewProps): JSX.Element {
  return (
    <View className="flex-1 items-center justify-center gap-4 bg-svBackground p-6">
      <View className="h-16 w-16 items-center justify-center rounded-lg bg-white shadow-sm">
        <ActivityIndicator size="large" color={colors.svBrand} />
      </View>
      <Text className="text-sm font-bold text-slate-500">{label}</Text>
    </View>
  );
}
