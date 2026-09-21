import { ScrollView, Text, Pressable } from "react-native";

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
      style={{ maxHeight: 64, minHeight: 64 }}
      contentContainerStyle={{ alignItems: "center", gap: 8, paddingHorizontal: 16, paddingVertical: 12 }}
    >
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <Pressable
            key={option.label}
            onPress={() => onChange(option.value)}
            className={
              selected
                ? "rounded-lg border border-svBrand bg-svBrand px-4 py-2 shadow-sm"
                : "rounded-lg border border-svLine bg-white px-4 py-2"
            }
          >
            <Text className={selected ? "text-sm font-extrabold text-white" : "text-sm font-extrabold text-slate-600"}>
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}
