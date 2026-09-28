"use client";

import { useId } from "react";

import type { PropertyType } from "@/lib/booking-store";

interface PropertyTypeOption {
  value: PropertyType;
  label: string;
  multiFloor: boolean;
}

const PROPERTY_TYPES: PropertyTypeOption[] = [
  { value: "house",    label: "House",    multiFloor: false },
  { value: "flat",     label: "Flat",     multiFloor: true  },
  { value: "bungalow", label: "Bungalow", multiFloor: false },
  { value: "office",   label: "Office",   multiFloor: true  },
  { value: "studio",   label: "Studio",   multiFloor: true  },
];

interface PropertyTypePickerProps {
  value: PropertyType;
  onChange: (type: PropertyType) => void;
}

export function PropertyTypePicker({ value, onChange }: PropertyTypePickerProps) {
  const selectId = useId();

  return (
    <div>
      <label htmlFor={selectId} className="mb-2 block text-sm font-black text-white">
        Property type
      </label>
      <select
        id={selectId}
        value={value}
        onChange={(event) => onChange(event.target.value as PropertyType)}
        className="min-h-14 w-full rounded-xl border border-amber-400/35 bg-white/10 px-4 text-base font-black text-white outline-none transition focus:border-amber-300 focus:ring-2 focus:ring-amber-400/70"
      >
        <option value="" className="bg-zinc-950 text-white">Select property type</option>
        {PROPERTY_TYPES.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-zinc-950 text-white">
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export function isMultiFloorProperty(type: PropertyType): boolean {
  return PROPERTY_TYPES.find((o) => o.value === type)?.multiFloor ?? false;
}
