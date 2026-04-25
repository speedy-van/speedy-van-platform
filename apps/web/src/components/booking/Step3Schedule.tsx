"use client";

import { useState, useEffect, useCallback } from "react";
import { useBooking } from "@/lib/booking-store";
import type { TimeSlot } from "@/lib/booking-store";
import { WeatherChip } from "./WeatherChip";

interface SlotData {
  slot: "morning" | "afternoon" | "evening";
  price: number;
  tier: "green" | "yellow" | "red";
}

interface DayPrice {
  date: string;
  slots: SlotData[];
}

interface PricingResult {
  days: DayPrice[];
  staticLineItems: { label: string; amount: number; type: string }[];
  staticSubtotal: number;
  currency: string;
  symbol: string;
}

const API_BASE =
  process.env.NODE_ENV === "development"
    ? "http://localhost:4000"
    : (process.env.NEXT_PUBLIC_API_URL ?? "https://api.speedy-van.co.uk");

const SLOT_LABELS: Record<string, string> = {
  morning: "Morning",
  afternoon: "Afternoon",
  evening: "Evening",
};

const TIER_COLORS: Record<string, string> = {
  green: "bg-green-100 border-green-400 text-green-800",
  yellow: "bg-amber-100 border-amber-400 text-amber-800",
  red: "bg-red-100 border-red-400 text-red-800",
};

const TIER_SELECTED: Record<string, string> = {
  green: "bg-green-500 border-green-500 text-white",
  yellow: "bg-amber-500 border-amber-500 text-white",
  red: "bg-red-500 border-red-500 text-white",
};

function formatDate(iso: string): { dow: string; day: string; mon: string } {
  const d = new Date(iso + "T12:00:00Z");
  return {
    dow: d.toLocaleDateString("en-GB", { weekday: "short" }),
    day: d.toLocaleDateString("en-GB", { day: "numeric" }),
    mon: d.toLocaleDateString("en-GB", { month: "short" }),
  };
}

export function Step3Schedule() {
  const { state, dispatch } = useBooking();
  const [pricing, setPricing] = useState<PricingResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchPricing = useCallback(async () => {
    setLoading(true);
    try {
      const body = {
        serviceType: state.serviceSlug,
        serviceVariant: state.serviceVariant || undefined,
        distanceMiles: state.distanceMiles || 1,
        pickupFloor: state.pickupFloor,
        pickupHasLift: state.pickupHasLift,
        dropoffFloor: state.dropoffFloor,
        dropoffHasLift: state.dropoffHasLift,
        helpersCount: state.helpersCount,
        needsPacking: state.needsPacking,
        needsAssembly: state.needsAssembly,
        pickupLat: state.pickup?.lat,
        pickupLng: state.pickup?.lng,
      };
      const res = await fetch(`${API_BASE}/pricing/calculate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = await res.json();
      if (json.success && json.data) {
        setPricing(json.data as PricingResult);
        dispatch({ type: "SET_BREAKDOWN", items: (json.data.staticLineItems ?? []) as { label: string; amount: number; type: string }[] });
        // Pre-select cheapest slot if none selected
        if (!state.selectedDate && json.data.days?.length > 0) {
          const firstDay = json.data.days[0];
          dispatch({ type: "SET_DATE", date: firstDay.date });
          const cheapest = [...firstDay.slots].sort((a: SlotData, b: SlotData) => a.price - b.price)[0];
          if (cheapest) dispatch({ type: "SET_SLOT", slot: cheapest.slot });
        }
      }
    } catch {
      // pricing unavailable - use zero prices
    } finally {
      setLoading(false);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { fetchPricing(); }, [fetchPricing]);

  // Derive current price from selection
  const selectedDayData = pricing?.days.find((d) => d.date === state.selectedDate);
  const selectedSlotData = selectedDayData?.slots.find((s) => s.slot === state.selectedTimeSlot);
  const currentPrice = selectedSlotData?.price ?? pricing?.staticSubtotal ?? 0;

  // Keep clientTotal in sync as the user changes day/slot so the live price
  // bar and price-drop toast both react instantly.
  useEffect(() => {
    if (currentPrice > 0 && currentPrice !== state.clientTotal) {
      dispatch({ type: "SET_PRICE", total: currentPrice });
    }
  }, [currentPrice, state.clientTotal, dispatch]);

  function handleContinue() {
    if (!state.selectedDate) return setError("Please select a date.");
    setError("");
    dispatch({ type: "SET_PRICE", total: currentPrice });
    dispatch({ type: "SET_STEP", step: 4 });
  }

  return (
    <div className="space-y-6">
      <div>
        <button
          type="button"
          onClick={() => dispatch({ type: "SET_STEP", step: 2 })}
          className="text-sm text-slate-500 hover:text-slate-700 flex items-center gap-1 mb-4"
        >
          ← Back
        </button>
        <h1 className="text-2xl font-bold text-slate-900 mb-1">Choose a date & time</h1>
        <p className="text-slate-600 text-sm">Prices vary by date — green is cheapest, red is peak.</p>
        <div className="mt-3">
          <WeatherChip lat={state.pickup?.lat} lng={state.pickup?.lng} />
        </div>
      </div>

      {/* Price breakdown */}
      {pricing && !loading && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <h2 className="font-semibold text-slate-800 mb-3">What's included</h2>
          <div className="space-y-1.5">
            {pricing.staticLineItems.map((li, i) => (
              <div key={i} className="flex justify-between text-sm">
                <span className="text-slate-600">{li.label}</span>
                <span className="font-medium text-slate-900">
                  {li.amount === 0 ? "Free" : `£${li.amount.toFixed(2)}`}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-400 border-t-transparent" />
          <span className="ml-3 text-slate-500 text-sm">Loading prices…</span>
        </div>
      ) : (
        <>
          {/* Tier legend */}
          <div className="flex items-center gap-4 text-xs text-slate-600">
            <div className="flex items-center gap-1"><span className="h-3 w-3 rounded-sm bg-green-400 inline-block" /> Cheapest</div>
            <div className="flex items-center gap-1"><span className="h-3 w-3 rounded-sm bg-amber-400 inline-block" /> Standard</div>
            <div className="flex items-center gap-1"><span className="h-3 w-3 rounded-sm bg-red-400 inline-block" /> Peak</div>
          </div>

          {/* Calendar grid */}
          <div className="overflow-x-auto -mx-4 px-4">
            <div className="flex gap-2 pb-2 min-w-max">
              {(pricing?.days ?? []).map((day) => {
                const { dow, day: dayNum, mon } = formatDate(day.date);
                const isSelectedDay = day.date === state.selectedDate;
                return (
                  <div
                    key={day.date}
                    className={`rounded-xl border-2 overflow-hidden transition-all min-w-[90px] ${
                      isSelectedDay ? "border-slate-900 shadow-md" : "border-slate-200"
                    }`}
                  >
                    {/* Date header */}
                    <div
                      className={`text-center py-2 px-2 ${
                        isSelectedDay ? "bg-slate-900 text-white" : "bg-slate-50"
                      }`}
                    >
                      <p className="text-xs font-medium uppercase">{dow}</p>
                      <p className="text-lg font-bold leading-none">{dayNum}</p>
                      <p className="text-xs">{mon}</p>
                    </div>

                    {/* Slot buttons */}
                    <div className="p-1.5 space-y-1">
                      {day.slots.map((slot) => {
                        const isSelected = isSelectedDay && slot.slot === state.selectedTimeSlot;
                        const colors = isSelected ? TIER_SELECTED[slot.tier] : TIER_COLORS[slot.tier];
                        return (
                          <button
                            key={slot.slot}
                            type="button"
                            onClick={() => {
                              dispatch({ type: "SET_DATE", date: day.date });
                              dispatch({ type: "SET_SLOT", slot: slot.slot as TimeSlot });
                            }}
                            className={`w-full rounded-lg border text-center py-1.5 px-1 transition-colors ${colors}`}
                          >
                            <p className="text-[10px] font-medium">{SLOT_LABELS[slot.slot]}</p>
                            <p className="text-xs font-bold">£{slot.price.toFixed(0)}</p>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}

      {/* Selected summary */}
      {state.selectedDate && !loading && (
        <div className="bg-primary-50 border border-primary-400 rounded-2xl p-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-900">
              {new Date(state.selectedDate + "T12:00:00Z").toLocaleDateString("en-GB", {
                weekday: "long", day: "numeric", month: "long",
              })}
            </p>
            <p className="text-xs text-slate-600">{SLOT_LABELS[state.selectedTimeSlot]} slot</p>
          </div>
          <div className="text-right">
            <p className="text-xl font-bold text-slate-900">£{currentPrice.toFixed(2)}</p>
            <p className="text-xs text-slate-500">total</p>
          </div>
        </div>
      )}

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
          {error}
        </p>
      )}

      <button
        type="button"
        onClick={handleContinue}
        disabled={!state.selectedDate || loading}
        className="btn-primary w-full py-3 rounded-xl font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Continue to Payment →
      </button>
    </div>
  );
}
