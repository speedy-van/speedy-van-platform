"use client";

import { useEffect, useState } from "react";
import { useBooking } from "@/lib/booking-store";

const money = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
});

const ACTION_LABEL: Record<number, string> = {
  2: "Items",
  3: "Date",
  4: "Review",
  5: "Pay",
};

export function BookingActionBar() {
  const { state } = useBooking();
  const [primaryState, setPrimaryState] = useState({ disabled: false, processing: false });

  useEffect(() => {
    const button = document.getElementById("booking-primary-action") as HTMLButtonElement | null;
    if (!button) {
      setPrimaryState({ disabled: true, processing: false });
      return;
    }
    const sync = () => setPrimaryState({ disabled: button.disabled, processing: button.textContent?.includes("Processing") ?? false });
    sync();
    const observer = new MutationObserver(sync);
    observer.observe(button, { attributes: true, attributeFilter: ["disabled"], childList: true, subtree: true, characterData: true });
    return () => observer.disconnect();
  }, [state.step]);
  const totalItems = state.items.reduce((total, item) => total + item.quantity, 0);
  const disabled =
    primaryState.disabled ||
    (state.step === 1 && !state.serviceSlug) ||
    (state.step === 2 && (!state.pickup || !state.dropoff || state.distanceMiles <= 0)) ||
    (state.step === 3 && totalItems <= 0) ||
    (state.step === 4 &&
      (state.quoteStatus !== "valid" || !state.selectedDate || !state.selectedTimeSlot || state.clientTotal <= 0)) ||
    (state.step === 5 && (state.quoteStatus !== "valid" || state.clientTotal <= 0));

  function clickPrimaryAction() {
    if (disabled) return;
    const button = document.getElementById("booking-primary-action") as HTMLButtonElement | null;
    if (!button || button.disabled) return;
    button.click();
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 overflow-hidden border-t border-amber-900/25 bg-booking-background/95 px-4 py-3 shadow-[0_-8px_32px_rgba(0,0,0,0.5)] backdrop-blur lg:hidden">
      <div className="mx-auto grid max-w-[1160px] grid-cols-[minmax(0,1fr)_120px] items-center gap-3 pb-[env(safe-area-inset-bottom)]">
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-bold uppercase tracking-widest text-amber-400/60">
            {state.step === 1 ? "Choose a service" : `Step ${state.step - 1} of 4`}
          </p>
          <p className="truncate text-base font-bold text-white">
            {state.clientTotal > 0 ? money.format(state.clientTotal) : "Quote pending"}
          </p>
        </div>
        <button
          type="button"
          onClick={clickPrimaryAction}
          disabled={disabled}
          className="min-h-12 w-full rounded-xl px-3 text-sm font-black text-black shadow-lg transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-booking-background disabled:cursor-not-allowed disabled:opacity-40"
          style={{ background: "linear-gradient(135deg, #F59E0B 0%, #EA580C 100%)" }}
        >
          {primaryState.processing ? "Processing…" : ACTION_LABEL[state.step] ?? "Continue"}
        </button>
      </div>
    </div>
  );
}
