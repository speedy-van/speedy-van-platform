"use client";

import { useState } from "react";
import { useBooking } from "@/lib/booking-store";
import { haptic } from "@/lib/haptic";

/**
 * "Why £X?" link + modal showing the line-item breakdown of the current quote.
 * Pulls from booking-store (populated in Step 3).
 */
export function PriceExplainerLink() {
  const { state } = useBooking();
  const [open, setOpen] = useState(false);
  const items = state.priceBreakdown ?? [];

  if (items.length === 0) return null;

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
        className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800 underline-offset-2 hover:underline"
      >
        <span aria-hidden="true">💡</span> Why £{state.clientTotal.toFixed(2)}?
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/60 p-0 sm:p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="price-explainer-title"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl p-6 max-h-[85vh] overflow-y-auto animate-in slide-in-from-bottom duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <h2 id="price-explainer-title" className="text-lg font-extrabold text-slate-900">
                  How we calculated your price
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Transparent, fixed pricing — no surprises on the day.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="text-slate-400 hover:text-slate-700 text-2xl leading-none"
              >
                ×
              </button>
            </div>

            <ul className="divide-y divide-slate-100">
              {items.map((li, i) => (
                <li key={i} className="flex items-center justify-between py-2.5 text-sm">
                  <span className="text-slate-700 flex items-center gap-1.5">
                    {li.type === "discount" && <span aria-hidden="true">🎉</span>}
                    {li.type === "surcharge" && <span aria-hidden="true">⚡</span>}
                    {li.type === "addon" && <span aria-hidden="true">➕</span>}
                    {li.type === "base" && <span aria-hidden="true">🚚</span>}
                    {li.label}
                  </span>
                  <span
                    className={`font-mono font-semibold ${
                      li.type === "discount" ? "text-emerald-600" : "text-slate-900"
                    }`}
                  >
                    {li.amount === 0 ? "Free" : `£${li.amount.toFixed(2)}`}
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-4 pt-4 border-t-2 border-slate-200 flex items-center justify-between">
              <span className="text-sm font-bold text-slate-700">Total</span>
              <span className="text-2xl font-extrabold text-primary-600 font-mono">
                £{state.clientTotal.toFixed(2)}
              </span>
            </div>

            <p className="mt-4 text-[11px] text-slate-500 leading-relaxed">
              Includes fully insured transport, professional driver, and standard fuel.
              VAT included where applicable.
            </p>

            <button
              type="button"
              onClick={() => setOpen(false)}
              className="mt-4 w-full rounded-xl bg-slate-900 text-white py-3 text-sm font-bold hover:bg-slate-800"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  );
}
