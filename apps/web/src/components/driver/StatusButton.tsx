"use client";

// Next status transitions for sequential driver workflow
export const NEXT_STATUS: Record<string, { next: string; label: string; color: string }> = {
  ACCEPTED: { next: "DRIVER_EN_ROUTE", label: "🚗 Start Driving", color: "bg-indigo-500 hover:bg-indigo-600" },
  DRIVER_EN_ROUTE: { next: "ARRIVED_PICKUP", label: "📍 Arrived at Pickup", color: "bg-orange-500 hover:bg-orange-600" },
  ARRIVED_PICKUP: { next: "LOADING", label: "📦 Start Loading", color: "bg-amber-500 hover:bg-amber-600" },
  LOADING: { next: "IN_TRANSIT", label: "🛣️ On the Road", color: "bg-purple-500 hover:bg-purple-600" },
  IN_TRANSIT: { next: "ARRIVED_DROPOFF", label: "📍 Arrived at Drop-off", color: "bg-pink-500 hover:bg-pink-600" },
  ARRIVED_DROPOFF: { next: "UNLOADING", label: "📦 Start Unloading", color: "bg-rose-500 hover:bg-rose-600" },
  UNLOADING: { next: "COMPLETED", label: "✅ Mark Completed", color: "bg-emerald-500 hover:bg-emerald-600" },
};

interface StatusButtonProps {
  currentStatus: string;
  onUpdate: (nextStatus: string) => void;
  loading?: boolean;
}

export function StatusButton({ currentStatus, onUpdate, loading = false }: StatusButtonProps) {
  const transition = NEXT_STATUS[currentStatus];
  if (!transition) return null;

  return (
    <button
      onClick={() => onUpdate(transition.next)}
      disabled={loading}
      className={`w-full h-14 text-white font-extrabold text-base rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2 ${transition.color}`}
    >
      {loading ? <span className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : transition.label}
    </button>
  );
}
