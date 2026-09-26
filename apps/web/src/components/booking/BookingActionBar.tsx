"use client";

import { useEffect, useState } from "react";
import { useBooking } from "@/lib/booking-store";
import { LEGACY_PRIMARY_CTA_ID, STEP_PRIMARY_CTA_ID, stepInfo } from "@/lib/booking-steps";
import { useRouter } from "next/navigation";

const money = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
});

export function BookingActionBar() {
  const { state, dispatch } = useBooking();
  const router = useRouter();
  const [primaryState, setPrimaryState] = useState({ disabled: false, processing: false });
  const current = stepInfo(state.step);

  function primaryButton(): HTMLButtonElement | null {
    return (
      (document.getElementById(STEP_PRIMARY_CTA_ID) as HTMLButtonElement | null) ??
      (document.getElementById(LEGACY_PRIMARY_CTA_ID) as HTMLButtonElement | null)
    );
  }

  useEffect(() => {
    const button = primaryButton();
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
  const backDisabled = state.checkoutLocked || state.step < 2;
  const showPrice = state.clientTotal > 0 && state.quoteStatus === "valid";
  const totalLabel = showPrice
    ? money.format(state.clientTotal)
    : state.quoteStatus === "loading"
      ? "Calculating..."
      : state.quoteStatus === "stale"
        ? "Refresh needed"
        : "Complete steps";
  const stepLabel = state.step === 1
    ? "Choose a service"
    : `Step ${current.number} of ${current.total} - ${current.label}`;

  function clickPrimaryAction() {
    if (disabled) return;
    const button = primaryButton();
    if (!button || button.disabled) return;
    if (current.isPay) {
      button.scrollIntoView({ behavior: "smooth", block: "center" });
      window.setTimeout(() => button.focus({ preventScroll: true }), 200);
      return;
    }
    button.click();
  }

  function clickBackAction() {
    if (backDisabled) return;
    if (state.step === 2) {
      router.push("/#get-quote");
      return;
    }
    const previousStep = state.step === 5 ? 4 : state.step === 4 ? 3 : 2;
    dispatch({ type: "SET_STEP", step: previousStep });
  }

  if (state.step < 2 || state.step > 5) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 overflow-hidden border-t border-amber-900/35 bg-booking-background/95 px-3 py-3 shadow-[0_-10px_36px_rgba(0,0,0,0.55)] backdrop-blur">
      <div className="mx-auto grid max-w-[1160px] gap-3 pb-[env(safe-area-inset-bottom)]">
        <div className="flex items-center justify-between gap-3 sm:hidden">
          <p className="min-w-0 truncate text-[11px] font-black uppercase tracking-widest text-amber-400/65">
            {stepLabel}
          </p>
          <p className="shrink-0 text-right text-base font-black text-white">{totalLabel}</p>
        </div>

        <div className="grid grid-cols-[104px_minmax(0,1fr)] items-center gap-3 sm:grid-cols-[132px_minmax(0,1fr)_190px]">
          <button
            type="button"
            onClick={clickBackAction}
            disabled={backDisabled}
            className="min-h-12 rounded-xl border border-white/12 bg-white/5 px-3 text-sm font-black text-white/75 transition hover:border-amber-500/40 hover:bg-white/8 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 disabled:cursor-not-allowed disabled:opacity-35"
          >
            Back
          </button>

          <div className="hidden min-w-0 rounded-xl bg-white/4 px-4 py-2 ring-1 ring-white/8 sm:block">
            <p className="truncate text-[11px] font-black uppercase tracking-widest text-amber-400/65">
              {stepLabel}
            </p>
            <p className="truncate text-lg font-black text-white">{totalLabel}</p>
          </div>

        <button
          type="button"
          onClick={clickPrimaryAction}
          disabled={disabled}
          className="min-h-12 w-full rounded-xl px-3 text-sm font-black text-black shadow-lg transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-booking-background disabled:cursor-not-allowed disabled:opacity-40"
          style={{ background: "linear-gradient(135deg, #F59E0B 0%, #EA580C 100%)" }}
        >
          {primaryState.processing ? "Processing…" : current.isPay ? "Review & pay" : "Continue"}
        </button>
        </div>
      </div>
    </div>
  );
}
