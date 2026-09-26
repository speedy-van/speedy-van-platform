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
