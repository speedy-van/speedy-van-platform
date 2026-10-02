import { Component, type ErrorInfo, type ReactNode } from "react";
import { Text, View } from "react-native";

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
            The app hit a display error. Close and reopen it, then try again.
          </Text>
        </View>
      );
    }

    return this.props.children;
  }
}
