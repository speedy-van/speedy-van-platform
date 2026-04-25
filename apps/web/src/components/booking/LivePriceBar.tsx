"use client";

import { useBooking } from "@/lib/booking-store";

/**
 * Sticky bottom bar visible inside the multi-step booking flow on mobile.
 * Shows the current calculated total + the next step CTA. The "Continue"
 * action is wired by listening for a click on the visible primary button
 * inside each step (we just scroll it into view + click it via id).
 *
 * Each step's primary button is identified by id="step-primary-cta".
 */
export function LivePriceBar() {
  const { state } = useBooking();

  const total = state.clientTotal;
  const stepLabel: Record<number, string> = {
    1: "Pick a service",
    2: "Add details",
    3: "Choose a time",
    4: "Pay & confirm",
  };

  function continueClick() {
    if (typeof document === "undefined") return;
    const btn = document.getElementById("step-primary-cta") as HTMLButtonElement | null;
    if (btn) {
      btn.scrollIntoView({ behavior: "smooth", block: "center" });
      // Slight delay so the smooth scroll lands before submit
      window.setTimeout(() => btn.click(), 200);
    }
  }

  return (
    <div
      className="fixed bottom-0 inset-x-0 z-30 md:hidden bg-white border-t border-slate-200 shadow-[0_-4px_18px_rgba(0,0,0,0.08)]"
      role="complementary"
      aria-label="Booking progress and price"
    >
      <div className="flex items-center gap-3 px-4 py-2.5">
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500 leading-tight">
            Step {state.step} of 4 · {stepLabel[state.step] ?? ""}
          </p>
          <p className="text-base font-extrabold text-slate-900 leading-tight">
            {total > 0 ? (
              <>
                <span className="text-primary-600">£{total.toFixed(2)}</span>
                <span className="ml-1 text-xs font-medium text-slate-500">total</span>
              </>
            ) : (
              <span className="text-slate-700">Building your quote…</span>
            )}
          </p>
        </div>
        <button
          type="button"
          onClick={continueClick}
          className="shrink-0 rounded-lg bg-primary-400 px-4 py-2.5 text-sm font-extrabold text-slate-900 hover:bg-primary-500 active:scale-95 transition-all"
        >
          {state.step === 4 ? "Pay" : "Continue"}
          <span className="ml-1" aria-hidden="true">→</span>
        </button>
      </div>
    </div>
  );
}
