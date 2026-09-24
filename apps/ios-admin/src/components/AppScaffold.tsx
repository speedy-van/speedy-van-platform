import { Ionicons } from "@expo/vector-icons";
import type { ComponentProps, ReactNode } from "react";
import { Pressable, Text, TextInput, View, type TextInputProps } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "@/theme/colors";

type IconName = ComponentProps<typeof Ionicons>["name"];
type ButtonTone = "brand" | "dark" | "danger" | "muted" | "success";

export function ScreenShell({ children }: { children: ReactNode }): JSX.Element {
  return <SafeAreaView className="flex-1 bg-svBackground">{children}</SafeAreaView>;
}

export function ScreenHeader({
  title,
  subtitle,
  eyebrow,
  icon,
  right,
  children
}: {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  icon: IconName;
  right?: ReactNode;
  children?: ReactNode;
}): JSX.Element {
  return (
    <View className="bg-svDark px-4 pb-5 pt-3">
      <View className="flex-row items-start justify-between gap-4">
        <View className="flex-1 flex-row items-center gap-3">
          <View className="h-12 w-12 items-center justify-center rounded-lg bg-white/10">
            <Ionicons name={icon} size={24} color={colors.svBrand} />
          </View>
          <View className="flex-1">
            {eyebrow ? <Text className="text-xs font-extrabold uppercase tracking-wide text-orange-200">{eyebrow}</Text> : null}
            <Text className="text-2xl font-extrabold text-white" numberOfLines={2} adjustsFontSizeToFit>
              {title}
            </Text>
            {subtitle ? (
              <Text className="mt-1 text-sm leading-5 text-slate-300" numberOfLines={2}>
                {subtitle}
              </Text>
            ) : null}
          </View>
        </View>
        {right ? <View className="shrink-0">{right}</View> : null}
      </View>
      {children ? <View className="mt-4">{children}</View> : null}
    </View>
  );
}

export function HeaderMetric({ label, value, icon }: { label: string; value: string; icon: IconName }): JSX.Element {
  return (
    <View className="min-w-[46%] flex-1 flex-row items-center gap-2 rounded-lg border border-white/10 bg-white/10 px-3 py-2">
      <Ionicons name={icon} size={16} color="#FED7AA" />
      <View className="flex-1">
        <Text className="text-[11px] font-bold uppercase text-slate-300" numberOfLines={1}>
          {label}
        </Text>
        <Text className="text-base font-extrabold text-white" numberOfLines={1} adjustsFontSizeToFit>
          {value}
        </Text>
      </View>
    </View>
  );
}

export function SectionCard({
  title,
  subtitle,
  icon,
  action,
  children
}: {
  title?: string;
  subtitle?: string;
  icon?: IconName;
  action?: ReactNode;
  children: ReactNode;
}): JSX.Element {
  return (
    <View className="rounded-lg border border-svLine bg-white p-4 shadow-sm">
      {title ? (
        <View className="mb-4 flex-row items-start justify-between gap-3">
          <View className="flex-1 flex-row items-center gap-3">
            {icon ? (
              <View className="h-9 w-9 items-center justify-center rounded-lg bg-svBrandSubtle">
                <Ionicons name={icon} size={18} color={colors.svBrand} />
              </View>
            ) : null}
            <View className="flex-1">
              <Text className="text-lg font-extrabold text-svDark" numberOfLines={1}>
                {title}
              </Text>
              {subtitle ? (
                <Text className="mt-0.5 text-sm text-slate-500" numberOfLines={2}>
                  {subtitle}
                </Text>
              ) : null}
            </View>
          </View>
          {action ? <View>{action}</View> : null}
        </View>
      ) : null}
      {children}
    </View>
  );
}

export function InfoRow({
  label,
  value,
  mono = false,
  accent = false
}: {
  label: string;
  value: string;
  mono?: boolean;
  accent?: boolean;
}): JSX.Element {
  return (
    <View className="border-b border-slate-100 py-2 last:border-b-0">
      <Text className="text-xs font-bold uppercase text-slate-400">{label}</Text>
      <Text
        className={
          mono
            ? "mt-1 font-mono text-sm font-extrabold text-svDark"
            : accent
              ? "mt-1 text-lg font-extrabold text-svBrandStrong"
              : "mt-1 text-sm font-bold text-svDark"
        }
        numberOfLines={3}
      >
        {value}
      </Text>
    </View>
  );
}

export function ActionButton({
  label,
  icon,
  onPress,
  disabled = false,
  tone = "brand"
}: {
  label: string;
  icon: IconName;
  onPress: () => void;
  disabled?: boolean;
  tone?: ButtonTone;
}): JSX.Element {
  const toneClass = disabled
    ? "bg-slate-200"
    : tone === "dark"
      ? "bg-svDark"
      : tone === "danger"
        ? "bg-svRed"
        : tone === "success"
          ? "bg-svGreen"
          : tone === "muted"
            ? "bg-slate-100"
            : "bg-svBrand";
  const textClass = disabled || tone === "muted" ? "text-slate-600" : "text-white";

  return (
    <Pressable disabled={disabled} onPress={onPress} className={`flex-row items-center justify-center gap-2 rounded-lg px-4 py-3 ${toneClass}`}>
      <Ionicons name={icon} size={17} color={disabled || tone === "muted" ? colors.muted : "#FFFFFF"} />
      <Text className={`font-extrabold ${textClass}`} numberOfLines={1} adjustsFontSizeToFit>
        {label}
      </Text>
    </Pressable>
  );
}

export function SearchField(props: TextInputProps): JSX.Element {
  return (
    <View className="flex-row items-center gap-2 rounded-lg border border-svLine bg-white px-3 py-2 shadow-sm">
      <Ionicons name="search" size={18} color={colors.muted} />
      <TextInput
        placeholderTextColor="#94A3B8"
        {...props}
        className="min-h-9 flex-1 text-base text-svDark outline-none"
      />
    </View>
  );
}

export function ModalHeader({ title, subtitle, onClose }: { title: string; subtitle?: string; onClose: () => void }): JSX.Element {
  return (
    <View className="border-b border-svLine bg-white px-4 pb-4 pt-5">
      <View className="mx-auto mb-4 h-1 w-12 rounded-full bg-slate-300" />
      <View className="flex-row items-start justify-between gap-4">
        <View className="flex-1">
          <Text className="text-2xl font-extrabold text-svDark" numberOfLines={1} adjustsFontSizeToFit>
            {title}
          </Text>
          {subtitle ? <Text className="mt-1 text-sm text-slate-500">{subtitle}</Text> : null}
        </View>
        <Pressable onPress={onClose} className="h-10 w-10 items-center justify-center rounded-lg bg-slate-100">
          <Ionicons name="close" size={20} color={colors.svDark} />
        </Pressable>
      </View>
    </View>
  );
}
