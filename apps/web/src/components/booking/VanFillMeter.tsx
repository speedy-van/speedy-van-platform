"use client";

import { useMemo } from "react";
import {
  computeFillRatio,
  defaultVanTierForService,
  VAN_SPECS,
  UPGRADE_THRESHOLD,
  type VanTier,
} from "@speedy-van/shared";
import type { SelectedItem } from "@/lib/booking-store";

interface Props {
  items: SelectedItem[];
  serviceSlug: string;
  vanTier?: VanTier;
  baseVanTier?: VanTier;
  showWhenEmpty?: boolean;
  compact?: boolean;
}

export function VanFillMeter({ items, serviceSlug, vanTier, baseVanTier, showWhenEmpty = false, compact = false }: Props) {
  const tier = vanTier ?? defaultVanTierForService(serviceSlug);
  const startingTier = baseVanTier ?? defaultVanTierForService(serviceSlug);
  const spec = VAN_SPECS[tier];
  const autoChanged = tier !== startingTier;

  const fillRatio = useMemo(() => {
    const volumeItems = items.map((i) => ({ itemId: i.itemId, name: i.name, quantity: i.quantity }));
    return computeFillRatio(volumeItems, tier);
  }, [items, tier]);

  const startingFillRatio = useMemo(() => {
    const volumeItems = items.map((i) => ({ itemId: i.itemId, name: i.name, quantity: i.quantity }));
    return computeFillRatio(volumeItems, startingTier);
  }, [items, startingTier]);

  const selectedBy = items.length === 0 && showWhenEmpty
    ? "property size"
    : autoChanged
      ? "items"
      : "current load";

  if (items.length === 0 && !showWhenEmpty) return null;

  const pct = Math.min(100, Math.round(fillRatio * 100));
  const startingPct = Math.min(100, Math.round(startingFillRatio * 100));
  const isNearFull = fillRatio >= UPGRADE_THRESHOLD;
  const isFull = fillRatio >= 1;

  const barColor = isFull
    ? "bg-red-500"
    : isNearFull
      ? "bg-amber-500"
      : "bg-emerald-500";

  if (compact) {
    return (
      <div className="mt-3 max-w-2xl rounded-xl border border-amber-500/25 bg-white/6 px-3 py-3">
        <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
          <span className="text-xs font-black uppercase tracking-widest text-amber-400">
            Van size · {spec.label}
          </span>
          <span className="flex items-center gap-2">
            {autoChanged && (
              <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[11px] font-black text-emerald-300 ring-1 ring-emerald-500/25">
                Auto changed
              </span>
            )}
            <span className={`rounded-full px-2 py-0.5 text-[11px] font-black ring-1 ${
              isFull
                ? "bg-red-500/15 text-red-300 ring-red-500/30"
                : isNearFull
                  ? "bg-amber-500/15 text-amber-300 ring-amber-500/30"
                  : "bg-emerald-500/15 text-emerald-300 ring-emerald-500/30"
            }`}>
              {pct}% full
            </span>
          </span>
        </div>
        <div className="h-3 w-full overflow-hidden rounded-full bg-white/10">
          <div
            className={`h-full rounded-full transition-all duration-500 ${barColor}`}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl p-4 ring-1 ring-amber-500/25" style={{ background: "rgba(255,255,255,0.055)", boxShadow: "0 8px 32px rgba(0,0,0,0.36)" }}>
      <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
            Van size
          </span>
          <p className="mt-1 text-lg font-black text-white">{spec.label}</p>
        </div>
        <div className="flex flex-wrap items-center justify-end gap-2">
          {autoChanged && (
            <span className="rounded-full bg-emerald-500/15 px-2.5 py-1 text-xs font-black text-emerald-300 ring-1 ring-emerald-500/25">
              Auto changed
            </span>
          )}
          <span className={`rounded-full px-2.5 py-1 text-xs font-black ring-1 ${
            isFull
              ? "bg-red-500/15 text-red-300 ring-red-500/30"
              : isNearFull
                ? "bg-amber-500/15 text-amber-300 ring-amber-500/30"
                : "bg-emerald-500/15 text-emerald-300 ring-emerald-500/30"
          }`}>
            {pct}% full
          </span>
        </div>
      </div>

      <div className="h-3 w-full overflow-hidden rounded-full bg-white/10">
        <div
          className={`h-full rounded-full transition-all duration-500 ${barColor}`}
          style={{ width: `${pct}%` }}
        />
      </div>

      <div className="mt-3 grid gap-2 text-sm font-semibold text-white sm:grid-cols-2">
        <p>Selected by {selectedBy}.</p>
        {autoChanged ? (
          <p>Previous size was {startingPct}% full.</p>
        ) : isNearFull && !isFull ? (
          <p>Close to the limit. More items may increase size.</p>
        ) : (
          <p>Keep adding items for an accurate quote.</p>
        )}
      </div>

      {isFull && (
        <p className="mt-3 rounded-lg bg-red-500/10 px-3 py-2 text-sm font-bold text-red-300 ring-1 ring-red-500/25">
          This is at the largest listed capacity. Remove items or contact us.
        </p>
      )}
    </div>
  );
}
