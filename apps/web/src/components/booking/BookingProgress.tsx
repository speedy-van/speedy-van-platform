"use client";

import { useBooking } from "@/lib/booking-store";
import { BOOKING_STEPS, stepInfo } from "@/lib/booking-steps";

export function BookingProgress() {
  const { state, dispatch } = useBooking();
  const current = stepInfo(state.step);

  if (state.step === 1) {
    return <p className="text-sm font-bold text-white">Choose your service to start your quote</p>;
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3 md:hidden">
        <p className="text-xs font-black uppercase tracking-[0.08em] text-amber-300">
          Step {current.number} of {current.total}
        </p>
        <p className="text-sm font-bold text-white">{current.label}</p>
      </div>

      <ol className="hidden grid-cols-4 gap-2 md:grid" aria-label="Booking progress">
        {BOOKING_STEPS.map((step) => {
          const complete = state.step > step.step;
          const active = state.step === step.step;
          const content = (
            <>
              <span
                className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-black ${
                  active
                    ? "bg-amber-400 text-black shadow-lg shadow-amber-500/25"
                    : complete
                      ? "bg-amber-500/20 text-amber-300 ring-1 ring-amber-500/40"
                      : "bg-white/10 text-white ring-1 ring-white/20"
                }`}
              >
                {complete ? "✓" : step.number}
              </span>
              <span className={`text-sm font-black ${active ? "text-white" : complete ? "text-amber-300" : "text-white"}`}>
                {step.label}
              </span>
            </>
          );

          return (
            <li key={step.step}>
              {complete ? (
                <button
                  type="button"
                  disabled={state.checkoutLocked}
                  onClick={() => dispatch({ type: "SET_STEP", step: step.step })}
                  className="flex min-h-11 w-full items-center gap-2 rounded-xl px-2 text-left transition hover:bg-amber-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {content}
                  <span className="ml-auto text-xs font-semibold text-amber-400">Edit</span>
                </button>
              ) : (
                <div
                  className={`flex min-h-14 items-center gap-3 rounded-xl px-3 ${
                    active
                      ? "bg-amber-500/10 ring-1 ring-amber-400/70"
                      : "bg-white/[0.03] ring-1 ring-white/10"
                  }`}
                  aria-current={active ? "step" : undefined}
                >
                  {content}
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
