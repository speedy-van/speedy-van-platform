import { Component, type ErrorInfo, type ReactNode } from "react";
import { Pressable, Text, View } from "react-native";
import { colors } from "@/theme/colors";

type AppErrorBoundaryProps = {
  children: ReactNode;
};

type AppErrorBoundaryState = {
  error: Error | null;
};

export class AppErrorBoundary extends Component<AppErrorBoundaryProps, AppErrorBoundaryState> {
  state: AppErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): AppErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error("[app] render crash", error, info.componentStack);
  }

  render(): ReactNode {
    if (this.state.error) {
      return (
        <View className="flex-1 items-center justify-center bg-svBackground px-6">
          <Text className="text-center text-2xl font-extrabold text-svDark">SpeedyVan Admin</Text>
          <Text className="mt-3 text-center text-sm font-bold leading-6 text-slate-600">
            The app hit a display error. This does not catch native launch crashes, but you can retry the app shell.
          </Text>
          <Text className="mt-3 text-center text-xs font-bold text-slate-400">
            {this.state.error.name}: {this.state.error.message.slice(0, 120)}
          </Text>
          <Pressable
            onPress={() => this.setState({ error: null })}
            className="mt-6 rounded-2xl px-5 py-3"
            style={{ backgroundColor: colors.svBrand }}
          >
            <Text className="font-extrabold text-white">Retry</Text>
          </Pressable>
        </View>
      );
    }

    return this.props.children;
  }
}
