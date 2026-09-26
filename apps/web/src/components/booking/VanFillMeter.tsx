"use client";

import { useMemo } from "react";
import {
  computeFillRatio,
  suggestVanUpgrade,
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
}

export function VanFillMeter({ items, serviceSlug, vanTier }: Props) {
  const tier = vanTier ?? defaultVanTierForService(serviceSlug);
  const spec = VAN_SPECS[tier];

  const { fillRatio, suggestedUpgrade } = useMemo(() => {
    const volumeItems = items.map((i) => ({ itemId: i.itemId, quantity: i.quantity }));
    return {
      fillRatio: computeFillRatio(volumeItems, tier),
      suggestedUpgrade: suggestVanUpgrade(volumeItems, tier),
    };
  }, [items, tier]);

  if (items.length === 0) return null;

  const pct = Math.min(100, Math.round(fillRatio * 100));
  const isNearFull = fillRatio >= UPGRADE_THRESHOLD;
  const isFull = fillRatio >= 1;

  const barColor = isFull
    ? "bg-red-500"
    : isNearFull
      ? "bg-amber-500"
      : "bg-emerald-500";

  return (
    <div className="rounded-xl p-4 ring-1 ring-white/10" style={{ background: "rgba(255,255,255,0.04)" }}>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-widest text-amber-400/70">
          {spec.label}
        </span>
        <span className={`text-sm font-bold ${isFull ? "text-red-400" : isNearFull ? "text-amber-400" : "text-emerald-400"}`}>
          {pct}% full
        </span>
      </div>

      <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/10">
        <div
          className={`h-full rounded-full transition-all duration-500 ${barColor}`}
          style={{ width: `${pct}%` }}
        />
      </div>

      {suggestedUpgrade && (
        <div className="mt-3 rounded-lg bg-amber-500/10 px-3 py-2.5 ring-1 ring-amber-500/25">
          <p className="text-sm font-semibold text-amber-300">
            Your load is nearly full — upgrade to a {VAN_SPECS[suggestedUpgrade].label}?
          </p>
          <p className="mt-0.5 text-xs text-amber-100/55">
            The price difference will show in your quote. Nobody finds out on the day.
          </p>
        </div>
      )}

      {isFull && !suggestedUpgrade && (
        <p className="mt-2 text-xs font-semibold text-red-400">
          Your items may not fit in this van. Please remove some items or contact us.
        </p>
      )}
    </div>
  );
}
