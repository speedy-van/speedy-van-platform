import { Ionicons } from "@expo/vector-icons";
import { Modal, Pressable, Text, View } from "react-native";
import { colors } from "@/theme/colors";

type ConfirmDialogProps = {
  visible: boolean;
  title: string;
  message?: string;
  confirmLabel?: string;
  destructive?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export function ConfirmDialog({
  visible,
  title,
  message = "Are you sure?",
  confirmLabel = "Confirm",
  destructive = true,
  onCancel,
  onConfirm
}: ConfirmDialogProps): JSX.Element {
  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onCancel}>
      <View className="flex-1 items-center justify-center bg-black/50 px-6">
        <View className="w-full max-w-sm rounded-lg bg-white p-5 shadow-lg">
          <View className="mb-4 h-11 w-11 items-center justify-center rounded-lg" style={{ backgroundColor: destructive ? "#FEF2F2" : colors.svBrandSubtle }}>
            <Ionicons name={destructive ? "warning" : "checkmark-circle"} size={22} color={destructive ? colors.svRed : colors.svBrand} />
          </View>
          <Text className="text-xl font-extrabold text-svDark">{title}</Text>
          <Text className="mt-2 text-sm leading-5 text-slate-600">{message}</Text>
          <View className="mt-5 flex-row justify-end gap-3">
            <Pressable onPress={onCancel} className="rounded-lg bg-slate-100 px-4 py-3">
              <Text className="font-bold text-slate-700">Cancel</Text>
            </Pressable>
            <Pressable onPress={onConfirm} className={destructive ? "rounded-lg bg-svRed px-4 py-3" : "rounded-lg bg-svBrand px-4 py-3"}>
              <Text className="font-bold text-white">{confirmLabel}</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
