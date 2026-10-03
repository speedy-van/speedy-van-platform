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
    <View style={{ backgroundColor: colors.svPanel }} className="px-4 pb-6 pt-4">
      <View className="flex-row items-start justify-between gap-4">
        <View className="flex-1 flex-row items-center gap-3">
          <View
            className="h-12 w-12 items-center justify-center rounded-2xl"
            style={{ backgroundColor: `${colors.svBrand}28` }}
          >
            <Ionicons name={icon} size={24} color={colors.svBrand} />
          </View>
          <View className="flex-1">
            {eyebrow ? (
              <Text
                className="text-[10px] font-extrabold uppercase"
                style={{ color: `${colors.svBrand}B0`, letterSpacing: 1.2 }}
              >
                {eyebrow}
              </Text>
            ) : null}
            <Text
              className="text-2xl font-extrabold text-white"
              numberOfLines={1}
              adjustsFontSizeToFit
              style={{ letterSpacing: -0.3 }}
            >
              {title}
            </Text>
            {subtitle ? (
              <Text className="mt-0.5 text-[13px] leading-5" style={{ color: "#94A3B8" }} numberOfLines={2}>
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
    <View
      className="min-w-[46%] flex-1 flex-row items-center gap-2 rounded-xl px-3 py-2.5"
      style={{ backgroundColor: "rgba(255,255,255,0.08)", borderWidth: 1, borderColor: "rgba(255,255,255,0.1)" }}
    >
      <Ionicons name={icon} size={15} color={colors.svBrand} />
      <View className="flex-1">
        <Text className="text-[10px] font-bold uppercase text-slate-400" style={{ letterSpacing: 0.6 }} numberOfLines={1}>
          {label}
        </Text>
        <Text className="text-sm font-extrabold text-white" numberOfLines={1} adjustsFontSizeToFit>
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
    <View className="overflow-hidden rounded-2xl bg-white p-4" style={{ borderWidth: 1, borderColor: colors.svLine }}>
      {title ? (
        <View className="mb-4 flex-row items-start justify-between gap-3">
          <View className="flex-1 flex-row items-center gap-3">
            {icon ? (
              <View
                className="h-10 w-10 items-center justify-center rounded-xl"
                style={{ backgroundColor: `${colors.svBrand}18` }}
              >
                <Ionicons name={icon} size={19} color={colors.svBrand} />
              </View>
            ) : null}
            <View className="flex-1">
              <Text className="text-base font-extrabold text-svDark" numberOfLines={1} style={{ letterSpacing: -0.2 }}>
                {title}
              </Text>
              {subtitle ? (
                <Text className="mt-0.5 text-xs text-slate-500" numberOfLines={2}>
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
  accent = false,
  numberOfLines = 3,
  selectable = false
}: {
  label: string;
  value: string;
  mono?: boolean;
  accent?: boolean;
  numberOfLines?: number;
  selectable?: boolean;
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
        numberOfLines={numberOfLines}
        selectable={selectable}
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
  const bgColor = disabled
    ? "#E2E8F0"
    : tone === "dark"
      ? colors.svDark
      : tone === "danger"
        ? colors.svRed
        : tone === "success"
          ? colors.svGreen
          : tone === "muted"
            ? "#F1F5F9"
            : colors.svBrand;
  const textColor = disabled || tone === "muted" ? colors.muted : "#FFFFFF";

  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      className="flex-row items-center justify-center gap-2 rounded-2xl px-4 py-3.5"
      style={{ backgroundColor: bgColor }}
    >
      <Ionicons name={icon} size={17} color={textColor} />
      <Text className="font-extrabold" style={{ color: textColor }} numberOfLines={1} adjustsFontSizeToFit>
        {label}
      </Text>
    </Pressable>
  );
}

export function SearchField(props: TextInputProps): JSX.Element {
  return (
    <View
      className="flex-row items-center gap-2 rounded-2xl bg-white px-3 py-2"
      style={{ borderWidth: 1.5, borderColor: colors.svLine }}
    >
      <Ionicons name="search" size={17} color={colors.muted} />
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
      <View className="mx-auto mb-3 h-1 w-10 rounded-full bg-slate-200" />
      <View className="flex-row items-start justify-between gap-4">
        <View className="flex-1">
          <Text className="text-xl font-extrabold text-svDark" numberOfLines={1} adjustsFontSizeToFit style={{ letterSpacing: -0.3 }}>
            {title}
          </Text>
          {subtitle ? <Text className="mt-1 text-xs text-slate-500">{subtitle}</Text> : null}
        </View>
        <Pressable onPress={onClose} className="h-9 w-9 items-center justify-center rounded-xl bg-slate-100">
          <Ionicons name="close" size={18} color={colors.muted} />
        </Pressable>
      </View>
    </View>
  );
}
