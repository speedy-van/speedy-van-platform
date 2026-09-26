"use client";

import { useEffect, useState } from "react";
import { useBooking } from "@/lib/booking-store";

const fmt = new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" });

function useCountdown(expiresAt: number) {
  const [remaining, setRemaining] = useState(() => Math.max(0, expiresAt - Date.now()));

  useEffect(() => {
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
  const { state } = useBooking();
  const { mins, secs, expired } = useCountdown(state.quoteExpiresAt);

  if (state.quoteStatus !== "valid" || !state.clientTotal) return null;

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <div
      className="rounded-xl p-4"
      style={{ background: "rgba(16,185,129,0.08)", boxShadow: "0 0 0 1px rgba(16,185,129,0.2)" }}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-emerald-400">Price locked</p>
          <p className="mt-1 text-2xl font-black text-white">{fmt.format(state.clientTotal)}</p>
        </div>
        {state.quoteExpiresAt > 0 && (
          <div className={`text-right ${expired ? "text-red-400" : "text-emerald-400"}`}>
            <p className="text-xs font-semibold uppercase tracking-widest">
              {expired ? "Expired" : "Holds for"}
            </p>
            {!expired && (
              <p className="mt-0.5 font-mono text-lg font-bold">
                {pad(mins)}:{pad(secs)}
              </p>
            )}
          </div>
        )}
      </div>

      {state.priceBreakdown.length > 0 && (
        <div className="mt-4 space-y-1.5 border-t border-emerald-500/20 pt-3">
          {state.priceBreakdown.map((line, i) => (
            <div key={i} className="flex justify-between text-sm">
              <span className="text-amber-100/70">{line.label}</span>
              <span className="font-semibold text-white">{fmt.format(line.amount)}</span>
            </div>
          ))}
        </div>
      )}

      <p className="mt-3 text-xs text-emerald-400/70">
        This price is signed by our server and verified again at checkout. It cannot be altered.
      </p>

      {expired && (
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
