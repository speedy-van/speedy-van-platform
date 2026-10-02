import { ScrollView, Text, Pressable } from "react-native";
import { colors } from "@/theme/colors";

export type FilterChipOption<T extends string> = {
  label: string;
  value: T | null;
};

type FilterChipsProps<T extends string> = {
  options: FilterChipOption<T>[];
  value: T | null;
  onChange: (value: T | null) => void;
};

export function FilterChips<T extends string>({ options, value, onChange }: FilterChipsProps<T>): JSX.Element {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={{ maxHeight: 60, minHeight: 60 }}
      contentContainerStyle={{ alignItems: "center", gap: 8, paddingHorizontal: 16, paddingVertical: 10 }}
    >
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <Pressable
            key={option.label}
            onPress={() => onChange(option.value)}
            className="rounded-full px-4 py-2"
            style={
              selected
                ? { backgroundColor: colors.svBrand }
                : { backgroundColor: "#F8FAFC", borderWidth: 1, borderColor: colors.svLine }
            }
          >
            <Text
              className="text-[13px] font-extrabold"
              style={{ color: selected ? "#FFFFFF" : "#64748B", letterSpacing: 0.1 }}
            >
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}
