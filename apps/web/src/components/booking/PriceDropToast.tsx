"use client";

import { useEffect, useRef, useState } from "react";
import { useBooking } from "@/lib/booking-store";

interface PriceChange {
  from: number;
  to: number;
  direction: "drop" | "rise";
}

export function PriceDropToast() {
  const { state } = useBooking();
  const previousRef = useRef<number | null>(null);
  const timerRef = useRef<number | null>(null);
  const [change, setChange] = useState<PriceChange | null>(null);

  useEffect(() => {
    const current = state.clientTotal;
    if (current <= 0) return;

    const prev = previousRef.current;
    previousRef.current = current;

    if (prev === null || Math.abs(current - prev) < 0.5) return;

    if (timerRef.current) window.clearTimeout(timerRef.current);

    setChange({
      from: prev,
      to: current,
      direction: current < prev ? "drop" : "rise",
    });

    timerRef.current = window.setTimeout(() => setChange(null), 5000);
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, [state.clientTotal]);

  if (!change) return null;

  const diff = Math.abs(change.from - change.to);
  const isDrop = change.direction === "drop";

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed top-20 sm:top-24 right-4 sm:right-6 z-50 w-72 animate-fade-in"
    >
      <div className={`relative rounded-2xl shadow-xl border overflow-hidden ${
        isDrop
          ? "bg-white border-emerald-200"
          : "bg-white border-slate-200"
      }`}>
        {/* Accent bar */}
        <div className={`absolute inset-y-0 left-0 w-1 rounded-l-2xl ${isDrop ? "bg-emerald-500" : "bg-primary-400"}`} />

        <div className="pl-4 pr-3 py-3 flex items-center gap-3">
          {/* Icon */}
          <div className={`shrink-0 flex h-9 w-9 items-center justify-center rounded-xl text-lg ${
            isDrop ? "bg-emerald-50 text-emerald-600" : "bg-primary-50 text-primary-600"
          }`}>
            {isDrop ? "↓" : "↑"}
          </div>

          {/* Text */}
          <div className="flex-1 min-w-0">
            <p className={`text-sm font-bold leading-snug ${isDrop ? "text-emerald-800" : "text-slate-900"}`}>
              {isDrop ? `You saved £${diff.toFixed(2)}` : `£${diff.toFixed(2)} added`}
            </p>
            <p className="text-xs text-slate-500 mt-0.5">
              New total: <span className="font-semibold text-slate-700">£{change.to.toFixed(2)}</span>
            </p>
          </div>

          {/* Dismiss */}
          <button
            type="button"
            onClick={() => setChange(null)}
            aria-label="Dismiss"
            className="shrink-0 flex h-7 w-7 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors text-base leading-none"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  );
}
