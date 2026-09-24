"use client";

import { useBooking } from "@/lib/booking-store";

export interface BookingProgressStep {
  number: 1 | 2 | 3 | 4 | 5;
  label: string;
}

export const BOOKING_STEPS: BookingProgressStep[] = [
  { number: 2, label: "Journey" },
  { number: 3, label: "Items" },
  { number: 4, label: "Date" },
  { number: 5, label: "Pay" },
];

export function BookingProgress() {
  const { state, dispatch } = useBooking();
  const current = BOOKING_STEPS.find((step) => step.number === state.step) ?? BOOKING_STEPS[0]!;

  if (state.step === 1) {
    return <p className="text-sm font-bold text-white">Choose your service to start your quote</p>;
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3 md:hidden">
        <p className="text-xs font-bold uppercase tracking-[0.08em] text-amber-400/60">
          Step {state.step - 1} of {BOOKING_STEPS.length}
        </p>
        <p className="text-sm font-bold text-white">{current.label}</p>
      </div>

      <ol className="hidden grid-cols-4 gap-2 md:grid" aria-label="Booking progress">
        {BOOKING_STEPS.map((step) => {
          const complete = state.step > step.number;
          const active = state.step === step.number;
          const content = (
            <>
              <span
                className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
                  active
                    ? "bg-amber-500 text-black"
                    : complete
                      ? "bg-amber-500/20 text-amber-400 ring-1 ring-amber-500/30"
                      : "bg-white/8 text-white/30"
                }`}
              >
                {complete ? "✓" : step.number - 1}
              </span>
              <span className={`text-sm font-bold ${active ? "text-white" : complete ? "text-amber-400/80" : "text-white/30"}`}>
                {step.label}
              </span>
            </>
          );

          return (
            <li key={step.number}>
              {complete ? (
                <button
                  type="button"
                  disabled={state.checkoutLocked}
                  onClick={() => dispatch({ type: "SET_STEP", step: step.number })}
                  className="flex min-h-11 w-full items-center gap-2 rounded-xl px-2 text-left transition hover:bg-amber-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {content}
                  <span className="ml-auto text-xs font-semibold text-amber-400">Edit</span>
                </button>
              ) : (
                <div
                  className={`flex min-h-11 items-center gap-2 rounded-xl px-2 ${
                    active ? "bg-white/5 ring-1 ring-amber-500/25" : ""
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
