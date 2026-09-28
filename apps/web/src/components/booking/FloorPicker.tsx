"use client";

interface FloorPickerProps {
  label: string;
  floor: number;
  hasLift: boolean;
  onFloor: (n: number) => void;
  onLift: (v: boolean) => void;
}

const FLOORS = [
  { value: 0, label: "Ground" },
  { value: 1, label: "1st" },
  { value: 2, label: "2nd" },
  { value: 3, label: "3rd" },
  { value: 4, label: "4th+" },
];

export function FloorPicker({ label, floor, hasLift, onFloor, onLift }: FloorPickerProps) {
  return (
    <div>
      <label className="mb-2 block text-sm font-black text-white">{label}</label>
      <div className="flex gap-2 flex-wrap">
        {FLOORS.map((f) => (
          <button
            key={f.value}
            type="button"
            onClick={() => onFloor(f.value)}
            className={`min-h-10 rounded-xl px-3 text-sm font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 ${
              floor === f.value
                ? "bg-amber-400 text-black ring-1 ring-amber-300"
                : "bg-white/10 text-white ring-1 ring-white/20 hover:bg-white/15 hover:text-white"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>
      {floor > 0 && (
        <label className="mt-3 flex min-h-10 cursor-pointer items-center gap-2">
          <input
            type="checkbox"
            checked={hasLift}
            onChange={(e) => onLift(e.target.checked)}
            className="rounded border-white/20 bg-white/10 text-amber-500 focus:ring-amber-400"
          />
          <span className="text-sm font-semibold text-white">Lift available</span>
        </label>
      )}
    </div>
  );
}
