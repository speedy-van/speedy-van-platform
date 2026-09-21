"use client";

import type { PropertyType } from "@/lib/booking-store";

interface PropertyTypeOption {
  value: PropertyType;
  label: string;
  icon: string;
  multiFloor: boolean;
}

const PROPERTY_TYPES: PropertyTypeOption[] = [
  { value: "house",    label: "House",    icon: "🏠", multiFloor: false },
  { value: "flat",     label: "Flat",     icon: "🏢", multiFloor: true  },
  { value: "bungalow", label: "Bungalow", icon: "🏡", multiFloor: false },
  { value: "office",   label: "Office",   icon: "🏗️", multiFloor: true  },
  { value: "studio",   label: "Studio",   icon: "🛋️", multiFloor: false },
];

interface PropertyTypePickerProps {
  value: PropertyType;
  onChange: (type: PropertyType) => void;
}

export function PropertyTypePicker({ value, onChange }: PropertyTypePickerProps) {
  return (
    <div>
      <p className="mb-2 text-sm font-medium text-white/60">Property type</p>
      <div className="flex flex-wrap gap-2">
        {PROPERTY_TYPES.map((opt) => {
          const active = value === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange(active ? "" : opt.value)}
              className={`flex min-h-10 items-center gap-1.5 rounded-xl px-3 text-sm font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 ${
                active
                  ? "bg-amber-500/25 text-amber-400 ring-1 ring-amber-500/40"
                  : "bg-white/5 text-white/50 ring-1 ring-white/10 hover:bg-white/10 hover:text-white/80"
              }`}
            >
              <span aria-hidden="true">{opt.icon}</span>
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function isMultiFloorProperty(type: PropertyType): boolean {
  return PROPERTY_TYPES.find((o) => o.value === type)?.multiFloor ?? false;
}
