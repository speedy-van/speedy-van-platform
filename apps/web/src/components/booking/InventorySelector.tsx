"use client";

import { useState } from "react";
import { useBooking, type SelectedItem } from "@/lib/booking-store";
import { getBookingServiceOptionForState } from "@/lib/booking-service-options";
import { STEP_PRIMARY_CTA_ID } from "@/lib/booking-steps";
import { ItemPicker } from "./ItemPicker";
import { VanFillMeter } from "./VanFillMeter";
import {
  bedroomCountToPricingVariant,
  type BedroomCount,
  type InventoryMode,
  type InventoryRoom,
} from "@/lib/room-inventory";

export interface InventorySelectorProps {
  onBack?: () => void;
  onContinue?: () => void;
}

function selectedItemCount(items: SelectedItem[]): number {
  return items.reduce((total, item) => total + item.quantity, 0);
}

export function InventorySelector({ onBack, onContinue }: InventorySelectorProps) {
  const { state, dispatch } = useBooking();
  const serviceOption = getBookingServiceOptionForState(state.entryServiceSlug, state.serviceSlug);
  const [error, setError] = useState("");
  const totalItems = selectedItemCount(state.items);

  function handleContinue() {
    if (totalItems <= 0) {
      setError("Please add at least one item so we can price the move accurately.");
      return;
    }
    setError("");
    dispatch({ type: "SET_STEP", step: 4 });
    onContinue?.();
  }

  const cardStyle = { background: "rgba(255,255,255,0.04)", boxShadow: "0 0 0 1px rgba(245,158,11,0.15), 0 8px 32px rgba(0,0,0,0.4)" };

  return (
    <section className="space-y-5">
      {/* ── Header ── */}
      <div>
        <button
          type="button"
          onClick={onBack ?? (() => dispatch({ type: "SET_STEP", step: 2 }))}
          className="hidden"
        >
          <span aria-hidden="true">←</span> Back
        </button>
        <p className="text-xs font-bold uppercase tracking-widest text-amber-400">Step 2 of 4 · Items</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight text-white">
          {serviceOption?.inventoryTitle ?? "Items and help"}
        </h1>
        <p className="mt-2 max-w-2xl text-base leading-7 text-amber-100/55">
          {serviceOption?.inventoryDescription ??
            "Add what is moving, then choose optional help. Paid extras start off until you select them."}
        </p>
      </div>

      {/* ── Service context badge ── */}
      {serviceOption && (
        <div className="flex flex-wrap items-center gap-2 rounded-2xl px-4 py-3" style={{ background: "rgba(245,158,11,0.08)", boxShadow: "0 0 0 1px rgba(245,158,11,0.18)" }}>
          <span className="rounded-full bg-amber-500/20 px-2.5 py-1 text-xs font-bold text-amber-400 ring-1 ring-amber-500/25">
            {serviceOption.pathBadge}
          </span>
          <span className="rounded-full bg-amber-500/20 px-2.5 py-1 text-xs font-bold text-amber-400 ring-1 ring-amber-500/25">
            {serviceOption.scopeBadge}
          </span>
          <p className="w-full text-sm font-medium leading-6 text-amber-100/60">{serviceOption.summaryNote}</p>
        </div>
      )}

      {/* ── Item picker ── */}
      <section className="rounded-2xl p-5" style={cardStyle}>
        <ItemPicker
          items={state.items}
          onChange={(items: SelectedItem[]) => dispatch({ type: "SET_ITEMS", items })}
          serviceSlug={state.serviceSlug}
          entryServiceSlug={state.entryServiceSlug}
          inventoryMode={state.inventoryMode}
          onInventoryModeChange={(mode: InventoryMode) => dispatch({ type: "SET_INVENTORY_MODE", mode })}
          bedroomCount={state.bedroomCount}
          exactBedroomCount={state.exactBedroomCount}
          rooms={state.inventoryRooms}
          onBedroomConfigChange={(
            bedroomCount: BedroomCount | "",
            exactBedroomCount: number,
            rooms: InventoryRoom[],
          ) => {
            dispatch({ type: "SET_BEDROOM_COUNT", bedroomCount, exactBedroomCount });
            dispatch({ type: "SET_INVENTORY_ROOMS", rooms });
            dispatch({ type: "SET_VARIANT", variant: bedroomCountToPricingVariant(bedroomCount) });
          }}
          onRoomsChange={(rooms: InventoryRoom[]) => dispatch({ type: "SET_INVENTORY_ROOMS", rooms })}
        />
      </section>

      {/* ── Van-fill meter (T7) ── */}
      <VanFillMeter items={state.items} serviceSlug={state.serviceSlug} />

      {/* ── Move help ── */}
      <section className="rounded-2xl p-5" style={cardStyle}>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-black text-white">Move help</h2>
            <p className="mt-1 text-sm leading-6 text-amber-100/55">
              Your booking includes a professional driver with loading and unloading assistance. Add extra help only when the job needs more hands.
            </p>
          </div>
          <span className="rounded-full bg-amber-500/15 px-3 py-1 text-xs font-bold text-amber-400 ring-1 ring-amber-500/25">
            Optional
          </span>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <label
            className="flex min-h-[92px] cursor-pointer gap-3 rounded-xl p-4 transition"
            style={state.needsPacking
              ? { background: "rgba(245,158,11,0.12)", boxShadow: "0 0 0 1px rgba(245,158,11,0.35)" }
              : { background: "rgba(255,255,255,0.04)", boxShadow: "0 0 0 1px rgba(255,255,255,0.08)" }}
          >
            <input
              type="checkbox"
              checked={state.needsPacking}
              onChange={(e) => dispatch({ type: "SET_PACKING", value: e.target.checked })}
              className="mt-1 h-5 w-5 rounded border-white/20 bg-white/10 text-amber-500 focus:ring-amber-400"
            />
            <span>
              <span className="block text-sm font-bold text-white">Packing service</span>
              <span className="mt-1 block text-sm leading-5 text-white/55">We pack and wrap your items before loading.</span>
            </span>
          </label>

          <label
            className="flex min-h-[92px] cursor-pointer gap-3 rounded-xl p-4 transition"
            style={state.needsAssembly
              ? { background: "rgba(245,158,11,0.12)", boxShadow: "0 0 0 1px rgba(245,158,11,0.35)" }
              : { background: "rgba(255,255,255,0.04)", boxShadow: "0 0 0 1px rgba(255,255,255,0.08)" }}
          >
            <input
              type="checkbox"
              checked={state.needsAssembly}
              onChange={(e) => dispatch({ type: "SET_ASSEMBLY", value: e.target.checked })}
              className="mt-1 h-5 w-5 rounded border-white/20 bg-white/10 text-amber-500 focus:ring-amber-400"
            />
            <span>
              <span className="block text-sm font-bold text-white">Assembly or disassembly</span>
              <span className="mt-1 block text-sm leading-5 text-white/55">Flat-pack furniture, beds and similar items.</span>
            </span>
          </label>
        </div>

        <div className="mt-5 rounded-xl p-4" style={{ background: "rgba(255,255,255,0.03)", boxShadow: "0 0 0 1px rgba(255,255,255,0.08)" }}>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-white">Extra helpers</h3>
              <p className="mt-1 text-sm text-white/55">
                {state.helpersCount === 0
                  ? "No extra helpers selected."
                  : `${state.helpersCount} extra helper${state.helpersCount > 1 ? "s" : ""} selected.`}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => dispatch({ type: "SET_HELPERS", count: Math.max(0, state.helpersCount - 1) })}
                disabled={state.helpersCount === 0}
                className="flex h-12 w-12 items-center justify-center rounded-xl text-xl font-bold text-white/70 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 disabled:cursor-not-allowed disabled:opacity-30"
                style={{ background: "rgba(255,255,255,0.08)", boxShadow: "0 0 0 1px rgba(255,255,255,0.10)" }}
                aria-label="Remove one extra helper"
              >
                −
              </button>
              <span className="w-8 text-center text-lg font-black text-white" aria-live="polite">
                {state.helpersCount}
              </span>
              <button
                type="button"
                onClick={() => dispatch({ type: "SET_HELPERS", count: Math.min(4, state.helpersCount + 1) })}
                disabled={state.helpersCount >= 4}
                className="flex h-12 w-12 items-center justify-center rounded-xl text-xl font-black text-black transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 disabled:cursor-not-allowed disabled:opacity-40"
                style={{ background: "linear-gradient(135deg, #F59E0B, #EA580C)" }}
                aria-label="Add one extra helper"
              >
                +
              </button>
            </div>
          </div>
        </div>
      </section>

      {error && (
        <p role="alert" className="rounded-xl px-4 py-3 text-sm font-medium text-red-300" style={{ background: "rgba(239,68,68,0.10)", boxShadow: "0 0 0 1px rgba(239,68,68,0.20)" }}>
          {error}
        </p>
      )}

      <button
        id={STEP_PRIMARY_CTA_ID}
        type="button"
        onClick={handleContinue}
        className="hidden"
        style={{ background: "linear-gradient(135deg, #F59E0B 0%, #EA580C 100%)" }}
      >
        Continue to {serviceOption?.inventoryCta ?? "date and time"} →
      </button>
    </section>
  );
}
