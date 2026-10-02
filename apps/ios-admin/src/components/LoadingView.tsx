import { ActivityIndicator, Text, View } from "react-native";
import { colors } from "@/theme/colors";

type LoadingViewProps = {
  label?: string;
};

export function LoadingView({ label = "Loading..." }: LoadingViewProps): JSX.Element {
  return (
    <View className="flex-1 items-center justify-center gap-4 bg-svBackground p-6">
      <View
        className="h-20 w-20 items-center justify-center rounded-3xl"
        style={{ backgroundColor: `${colors.svBrand}14` }}
      >
        <ActivityIndicator size="large" color={colors.svBrand} />
      </View>
      <Text className="text-sm font-bold text-slate-500">{label}</Text>
    </View>
  );
}
