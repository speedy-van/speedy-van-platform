"use client";

import { useBooking } from "@/lib/booking-store";
import { LEGACY_PRIMARY_CTA_ID, STEP_PRIMARY_CTA_ID, stepInfo } from "@/lib/booking-steps";

/**
 * Sticky bottom bar visible inside the multi-step booking flow on mobile.
 * Shows the current calculated total + the next step CTA. The "Continue"
 * action is wired by the current step's primary button. On the payment step
 * it only moves focus to the real pay button, so it never submits payment.
 */
export function LivePriceBar() {
  const { state } = useBooking();

  if (state.step < 2) return null;

  const total = state.clientTotal;
  const current = stepInfo(state.step);

  function continueClick() {
    if (typeof document === "undefined") return;
    const btn =
      (document.getElementById(STEP_PRIMARY_CTA_ID) as HTMLButtonElement | null) ??
      (document.getElementById(LEGACY_PRIMARY_CTA_ID) as HTMLButtonElement | null);
    if (btn) {
      btn.scrollIntoView({ behavior: "smooth", block: "center" });
      window.setTimeout(() => {
        if (current.isPay) {
          btn.focus({ preventScroll: true });
          return;
        }
        btn.click();
      }, 200);
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
            Step {current.number} of {current.total} · {current.label}
          </p>
          <p className="text-base font-extrabold text-stone-950 leading-tight">
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
          className="shrink-0 rounded-lg bg-primary-400 px-4 py-2.5 text-sm font-extrabold text-white hover:bg-primary-500 active:scale-95 transition-all"
        >
          {current.isPay ? "Review & pay" : "Continue"}
          <span className="ml-1" aria-hidden="true">→</span>
        </button>
      </div>
    </div>
  );
}
