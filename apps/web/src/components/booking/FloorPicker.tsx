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
      <label className="block text-sm font-medium text-slate-700 mb-2">{label}</label>
      <div className="flex gap-2 flex-wrap">
        {FLOORS.map((f) => (
          <button
            key={f.value}
            type="button"
            onClick={() => onFloor(f.value)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
              floor === f.value
                ? "bg-primary-400 border-primary-400 text-slate-900"
                : "bg-white border-slate-300 text-slate-700 hover:border-primary-400"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>
      {floor > 0 && (
        <label className="flex items-center gap-2 mt-2 cursor-pointer">
          <input
            type="checkbox"
            checked={hasLift}
            onChange={(e) => onLift(e.target.checked)}
            className="rounded border-slate-300 text-primary-400 focus:ring-primary-400"
          />
          <span className="text-sm text-slate-600">Lift available</span>
        </label>
      )}
    </div>
  );
}
