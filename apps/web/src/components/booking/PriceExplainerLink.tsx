"use client";

import { useState } from "react";
import { useBooking } from "@/lib/booking-store";
import { haptic } from "@/lib/haptic";

const money = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
});

export function PriceExplainerLink() {
  const { state } = useBooking();
  const [open, setOpen] = useState(false);
  const items = state.priceBreakdown ?? [];

  if (items.length === 0 || state.clientTotal <= 0) return null;

  function show() {
    haptic(10);
    setOpen(true);
  }

  return (
    <>
      <button
        type="button"
        onClick={show}
        data-track-event="price_explainer_open"
        className="inline-flex items-center gap-1 text-xs font-semibold text-amber-400 hover:text-amber-300 underline-offset-2 hover:underline"
      >
        How is {money.format(state.clientTotal)} calculated?
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
          style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(6px)" }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="price-explainer-title"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl p-6 max-h-[85vh] overflow-y-auto animate-in slide-in-from-bottom duration-300"
            style={{ background: "#1A1200", boxShadow: "0 0 0 1px rgba(245,158,11,0.25), 0 24px 64px rgba(0,0,0,0.7)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <h2 id="price-explainer-title" className="text-lg font-black text-white">
                  How we calculated your price
                </h2>
                <p className="text-xs text-amber-100/50 mt-0.5">
                  These lines come from the current quote response.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="text-white/40 hover:text-white text-2xl leading-none"
              >
                ×
              </button>
            </div>

            <ul className="divide-y divide-white/8">
              {items.map((li, i) => (
                <li key={i} className="flex items-center justify-between py-2.5 text-sm">
                  <span className="text-white/60">{li.label}</span>
                  <span
                    className={`font-mono font-bold ${
                      li.type === "discount" ? "text-emerald-400" : "text-white"
                    }`}
                  >
                    {li.amount === 0 ? "Free" : money.format(li.amount)}
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-4 pt-4 flex items-center justify-between" style={{ borderTop: "2px solid rgba(245,158,11,0.25)" }}>
              <span className="text-sm font-bold text-white/60">Total</span>
              <span className="text-2xl font-black text-amber-400 font-mono">
                {money.format(state.clientTotal)}
              </span>
            </div>

            <p className="mt-4 text-[11px] text-white/35 leading-relaxed">
              Your final payment amount is checked by the server before a booking is created. If the quote changes,
              payment cannot continue until the quote is refreshed.
            </p>

            <button
              type="button"
              onClick={() => setOpen(false)}
              className="mt-4 w-full rounded-xl py-3 text-sm font-black text-black transition hover:brightness-110"
              style={{ background: "linear-gradient(135deg, #F59E0B 0%, #EA580C 100%)" }}
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  );
}
