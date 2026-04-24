"use client";

import { useState } from "react";
import { useBooking } from "@/lib/booking-store";
import { AddressSearch } from "./AddressSearch";
import { FloorPicker } from "./FloorPicker";
import { ItemPicker } from "./ItemPicker";
import type { AddressResult, SelectedItem } from "@/lib/booking-store";

const API_BASE =
  process.env.NODE_ENV === "development"
    ? "http://localhost:4000"
    : (process.env.NEXT_PUBLIC_API_URL ?? "https://api.speedy-van.co.uk");

export function Step2Addresses() {
  const { state, dispatch } = useBooking();
  const [error, setError] = useState("");
  const [loadingDistance, setLoadingDistance] = useState(false);

  async function fetchDistance(
    pickup: AddressResult,
    dropoff: AddressResult
  ): Promise<number> {
    try {
      const res = await fetch(`${API_BASE}/geocode/directions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pickupLat: pickup.lat,
          pickupLng: pickup.lng,
          dropoffLat: dropoff.lat,
          dropoffLng: dropoff.lng,
        }),
      });
      const json = await res.json();
      if (json.success && json.data?.distanceMiles) {
        return json.data.distanceMiles as number;
      }
    } catch {
      // Geocoding not available – allow manual distance fallback
    }
    // Straight-line approximation in miles if API unavailable
    const R = 3959;
    const dLat = ((dropoff.lat - pickup.lat) * Math.PI) / 180;
    const dLng = ((dropoff.lng - pickup.lng) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((pickup.lat * Math.PI) / 180) *
        Math.cos((dropoff.lat * Math.PI) / 180) *
        Math.sin(dLng / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  async function handlePickupSelect(addr: AddressResult) {
    dispatch({ type: "SET_PICKUP", value: addr });
    if (state.dropoff && addr.lat !== 0) {
      setLoadingDistance(true);
      const d = await fetchDistance(addr, state.dropoff);
      dispatch({ type: "SET_DISTANCE", value: d });
      setLoadingDistance(false);
    }
  }

  async function handleDropoffSelect(addr: AddressResult) {
    dispatch({ type: "SET_DROPOFF", value: addr });
    if (state.pickup && addr.lat !== 0) {
      setLoadingDistance(true);
      const d = await fetchDistance(state.pickup, addr);
      dispatch({ type: "SET_DISTANCE", value: d });
      setLoadingDistance(false);
    }
  }

  function handleContinue() {
    if (!state.pickup) return setError("Please enter a pickup address.");
    if (!state.dropoff) return setError("Please enter a drop-off address.");
    setError("");
    dispatch({ type: "SET_STEP", step: 3 });
  }

  return (
    <div className="space-y-6">
      <div>
        <button
          type="button"
          onClick={() => dispatch({ type: "SET_STEP", step: 1 })}
          className="text-sm text-slate-500 hover:text-slate-700 flex items-center gap-1 mb-4"
        >
          ← Back
        </button>
        <h1 className="text-2xl font-bold text-slate-900 mb-1">
          {state.serviceName}
        </h1>
        <p className="text-slate-600">Enter your pickup and drop-off details.</p>
      </div>

      {/* Pickup */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
        <h2 className="font-semibold text-slate-800">Pickup location</h2>
        <AddressSearch
          label="Pickup address"
          value={state.pickup}
          onSelect={handlePickupSelect}
          placeholder="e.g. 15 Byres Road, Glasgow"
        />
        <FloorPicker
          label="Pickup floor"
          floor={state.pickupFloor}
          hasLift={state.pickupHasLift}
          onFloor={(n) => dispatch({ type: "SET_PICKUP_FLOOR", value: n })}
          onLift={(v) => dispatch({ type: "SET_PICKUP_LIFT", value: v })}
        />
      </div>

      {/* Drop-off */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
        <h2 className="font-semibold text-slate-800">Drop-off location</h2>
        <AddressSearch
          label="Drop-off address"
          value={state.dropoff}
          onSelect={handleDropoffSelect}
          placeholder="e.g. 47 Princes Street, Edinburgh"
        />
        <FloorPicker
          label="Drop-off floor"
          floor={state.dropoffFloor}
          hasLift={state.dropoffHasLift}
          onFloor={(n) => dispatch({ type: "SET_DROPOFF_FLOOR", value: n })}
          onLift={(v) => dispatch({ type: "SET_DROPOFF_LIFT", value: v })}
        />
      </div>

      {/* Distance indicator */}
      {state.distanceMiles > 0 && (
        <div className="flex items-center gap-2 text-sm text-slate-600 bg-slate-100 rounded-xl px-4 py-2">
          <span>📍</span>
          <span>
            {loadingDistance ? "Calculating distance…" : `Approx. ${state.distanceMiles.toFixed(1)} miles`}
          </span>
        </div>
      )}
      {loadingDistance && state.distanceMiles === 0 && (
        <div className="text-sm text-slate-400">Calculating distance…</div>
      )}

      {/* Items */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5">
        <ItemPicker
          items={state.items}
          onChange={(items: SelectedItem[]) => dispatch({ type: "SET_ITEMS", items })}
        />
      </div>

      {/* Extras */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5">
        <h2 className="font-semibold text-slate-800 mb-3">Add-ons</h2>
        <div className="space-y-3">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={state.needsPacking}
              onChange={(e) => dispatch({ type: "SET_PACKING", value: e.target.checked })}
              className="h-4 w-4 rounded border-slate-300 text-primary-400 focus:ring-primary-400"
            />
            <div>
              <p className="text-sm font-medium text-slate-900">Packing service</p>
              <p className="text-xs text-slate-500">We pack and wrap everything for you</p>
            </div>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={state.needsAssembly}
              onChange={(e) => dispatch({ type: "SET_ASSEMBLY", value: e.target.checked })}
              className="h-4 w-4 rounded border-slate-300 text-primary-400 focus:ring-primary-400"
            />
            <div>
              <p className="text-sm font-medium text-slate-900">Assembly/disassembly</p>
              <p className="text-xs text-slate-500">Flat-pack furniture and bed frames</p>
            </div>
          </label>
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Extra helpers (optional)
          </label>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => dispatch({ type: "SET_HELPERS", count: Math.max(0, state.helpersCount - 1) })}
              disabled={state.helpersCount === 0}
              className="h-8 w-8 rounded-full bg-slate-200 text-slate-700 font-bold hover:bg-slate-300 disabled:opacity-40"
            >
              −
            </button>
            <span className="text-base font-semibold w-8 text-center">{state.helpersCount}</span>
            <button
              type="button"
              onClick={() => dispatch({ type: "SET_HELPERS", count: Math.min(4, state.helpersCount + 1) })}
              disabled={state.helpersCount >= 4}
              className="h-8 w-8 rounded-full bg-slate-900 text-white font-bold hover:bg-slate-700 disabled:opacity-40"
            >
              +
            </button>
            <span className="text-sm text-slate-500">
              {state.helpersCount === 0 ? "None" : `${state.helpersCount} extra helper${state.helpersCount > 1 ? "s" : ""}`}
            </span>
          </div>
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
          {error}
        </p>
      )}

      <button
        type="button"
        onClick={handleContinue}
        className="btn-primary w-full py-3 rounded-xl font-semibold text-sm"
      >
        Continue to Schedule →
      </button>
    </div>
  );
}
