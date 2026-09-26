"use client";

import { useBooking } from "@/lib/booking-store";

const fmt = new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" });

const STEP_LABELS: Record<number, string> = {
  2: "Route & access",
  3: "Items",
  4: "Schedule",
  5: "Checkout",
};

export function StickyPriceBar() {
  const { state } = useBooking();

  const showPrice = state.clientTotal > 0 && state.quoteStatus === "valid";
  const showStale = state.quoteStatus === "stale" && state.step < 5;

  if (state.step < 2 || state.step > 5) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-amber-900/30 backdrop-blur-md"
      style={{ background: "rgba(10,7,3,0.92)" }}
    >
      <div className="mx-auto flex max-w-[1160px] items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <div className="flex items-center gap-2 min-w-0">
          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
          <span className="truncate text-sm text-amber-100/60">
            {STEP_LABELS[state.step] ?? "Booking"}
          </span>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {showStale && (
            <span className="hidden text-xs text-amber-400/70 sm:block">
              Quote refreshing…
            </span>
          )}
          {showPrice ? (
            <div className="text-right">
              <span className="block text-xs font-semibold uppercase tracking-widest text-amber-400/60">
                Total
              </span>
              <span className="block text-lg font-black text-white leading-tight">
                {fmt.format(state.clientTotal)}
              </span>
            </div>
          ) : (
            <div className="text-right">
              <span className="block text-xs font-semibold uppercase tracking-widest text-amber-400/60">
                Total
              </span>
              <span className="block text-sm font-semibold text-amber-100/40">
                {state.quoteStatus === "loading" ? "Calculating…" : "Complete steps"}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
