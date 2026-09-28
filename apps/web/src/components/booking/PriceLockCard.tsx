"use client";

import { useEffect, useState } from "react";
import { useBooking } from "@/lib/booking-store";

const fmt = new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" });

function isInventoryLine(label: string): boolean {
  return label.toLowerCase().startsWith("inventory ");
}

function useCountdown(expiresAt: number) {
  const [remaining, setRemaining] = useState(() => Math.max(0, expiresAt - Date.now()));

  useEffect(() => {
    setRemaining(Math.max(0, expiresAt - Date.now()));
    if (!expiresAt) return;
    const id = setInterval(() => {
      const left = Math.max(0, expiresAt - Date.now());
      setRemaining(left);
      if (left === 0) clearInterval(id);
    }, 1000);
    return () => clearInterval(id);
  }, [expiresAt]);

  const totalSecs = Math.ceil(remaining / 1000);
  const mins = Math.floor(totalSecs / 60);
  const secs = totalSecs % 60;
  return { mins, secs, expired: remaining === 0 };
}

interface PriceLockCardProps {
  onRefresh?: () => void | Promise<void>;
  refreshing?: boolean;
}

export function PriceLockCard({ onRefresh, refreshing = false }: PriceLockCardProps) {
  const { state, dispatch } = useBooking();
  const { mins, secs, expired } = useCountdown(state.quoteExpiresAt);

  if (state.quoteStatus !== "valid" || !state.clientTotal) return null;

  const pad = (n: number) => String(n).padStart(2, "0");
  const editInventory = () => dispatch({ type: "SET_STEP", step: 3 });
  const hasInventoryLine = state.priceBreakdown.some((line) => isInventoryLine(line.label));
  const hasQuoteExpiry = state.quoteExpiresAt > 0;
  const quoteExpired = !hasQuoteExpiry || expired;

  return (
    <div
      className="rounded-2xl p-4"
      style={{ background: "rgba(16,185,129,0.10)", boxShadow: "0 0 0 1px rgba(16,185,129,0.30), 0 12px 30px rgba(0,0,0,0.30)" }}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-widest text-emerald-300">Price locked</p>
          <p className="mt-1 text-3xl font-black text-white">{fmt.format(state.clientTotal)}</p>
        </div>
        <div className={`text-right ${quoteExpired ? "text-red-400" : "text-emerald-400"}`} aria-live="polite">
          <p className="text-xs font-black uppercase tracking-widest">
            {quoteExpired ? "Expired" : "Held"}
          </p>
          <p className="mt-0.5 font-mono text-lg font-bold">
            {hasQuoteExpiry ? `${pad(mins)}:${pad(secs)}` : "00:00"}
          </p>
        </div>
      </div>

      {state.priceBreakdown.length > 0 && (
        <div className="mt-4 space-y-1.5 border-t border-emerald-500/20 pt-3">
          {state.priceBreakdown.map((line, i) => {
            const lineIsInventory = isInventoryLine(line.label);
            return (
              <div key={i} className="flex items-center justify-between gap-3 text-sm">
                <span className="min-w-0 font-semibold text-white">
                  {line.label}
                  {lineIsInventory && (
                    <button
                      type="button"
                      onClick={editInventory}
                      className="ml-2 inline-flex min-h-7 items-center rounded-lg bg-amber-500 px-2.5 text-[11px] font-black text-black transition hover:bg-amber-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
                    >
                      Edit items
                    </button>
                  )}
                </span>
                <span className="font-semibold text-white">{fmt.format(line.amount)}</span>
              </div>
            );
          })}
          {hasInventoryLine && (
            <p className="text-xs font-semibold text-emerald-200">
              Editing items will refresh the quote before payment.
            </p>
          )}
        </div>
      )}

      {quoteExpired && (
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3 rounded-lg bg-red-500/10 p-3 ring-1 ring-red-500/25">
          <p className="text-xs font-semibold text-red-300">
            Your quote has expired. Refresh the price to continue.
          </p>
          {onRefresh && (
            <button
              type="button"
              onClick={() => void onRefresh()}
              disabled={refreshing}
              className="min-h-10 rounded-lg bg-red-500 px-3 text-xs font-black text-white transition hover:bg-red-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {refreshing ? "Refreshing..." : "Refresh price"}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
