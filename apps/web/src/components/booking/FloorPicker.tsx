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
      <label className="block text-sm font-medium text-white/60 mb-2">{label}</label>
      <div className="flex gap-2 flex-wrap">
        {FLOORS.map((f) => (
          <button
            key={f.value}
            type="button"
            onClick={() => onFloor(f.value)}
            className={`min-h-10 rounded-xl px-3 text-sm font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 ${
              floor === f.value
                ? "bg-amber-500/25 text-amber-400 ring-1 ring-amber-500/40"
                : "bg-white/5 text-white/50 ring-1 ring-white/10 hover:bg-white/10 hover:text-white/80"
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
          <span className="text-sm text-white/60">Lift available</span>
        </label>
      )}
    </div>
  );
}
