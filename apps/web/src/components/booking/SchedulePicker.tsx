"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useBooking, type PriceLineItem, type TimeSlot } from "@/lib/booking-store";
import { WeatherChip } from "./WeatherChip";

export interface SchedulePickerProps {
  onBack?: () => void;
  onContinue?: () => void;
}

interface SlotData {
  slot: TimeSlot;
  price: number;
  tier: "green" | "yellow" | "red";
}

interface DayPrice {
  date: string;
  slots: SlotData[];
}

interface PricingResult {
  days: DayPrice[];
  staticLineItems: PriceLineItem[];
  staticSubtotal: number;
  currency: string;
  symbol: string;
}

const API_BASE =
  process.env.NODE_ENV === "development"
    ? "http://localhost:4000"
    : (process.env.NEXT_PUBLIC_API_URL ?? "https://api.speedyvan.uk");

const money = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
});

const londonDate = new Intl.DateTimeFormat("en-GB", {
  weekday: "short",
  day: "numeric",
  month: "short",
  timeZone: "Europe/London",
});

const SLOT_LABELS: Record<TimeSlot, string> = {
  morning: "Morning",
  afternoon: "Afternoon",
  evening: "Evening",
};

type PriceBand = "green" | "amber" | "red";

const PRICE_BAND_LABELS: Record<PriceBand, string> = {
  green: "Lower price",
  amber: "Mid price",
  red: "Higher price",
};

const PRICE_BAND_STYLES: Record<
  PriceBand,
  {
    cardStyle: React.CSSProperties;
    selectedCardStyle: React.CSSProperties;
    badge: string;
    price: string;
    dot: string;
  }
> = {
  green: {
    cardStyle: { background: "rgba(16,185,129,0.07)", boxShadow: "0 0 0 1px rgba(16,185,129,0.18)" },
    selectedCardStyle: { background: "rgba(16,185,129,0.15)", boxShadow: "0 0 0 2px rgba(16,185,129,0.45)" },
    badge: "bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/25",
    price: "text-emerald-400",
    dot: "bg-emerald-500",
  },
  amber: {
    cardStyle: { background: "rgba(245,158,11,0.07)", boxShadow: "0 0 0 1px rgba(245,158,11,0.18)" },
    selectedCardStyle: { background: "rgba(245,158,11,0.15)", boxShadow: "0 0 0 2px rgba(245,158,11,0.45)" },
    badge: "bg-amber-500/15 text-amber-400 ring-1 ring-amber-500/25",
    price: "text-amber-400",
    dot: "bg-amber-500",
  },
  red: {
    cardStyle: { background: "rgba(239,68,68,0.07)", boxShadow: "0 0 0 1px rgba(239,68,68,0.18)" },
    selectedCardStyle: { background: "rgba(239,68,68,0.15)", boxShadow: "0 0 0 2px rgba(239,68,68,0.45)" },
    badge: "bg-red-500/15 text-red-400 ring-1 ring-red-500/25",
    price: "text-red-400",
    dot: "bg-red-500",
  },
};

const PRICING_ERROR_MESSAGE =
  "We couldn't load your quote right now. Please retry, or go back and check your journey details.";

function formatDate(iso: string): string {
  return londonDate.format(new Date(`${iso}T12:00:00Z`));
}

function priceToPence(price: number): number {
  return Math.round(price * 100);
}

function buildPriceScale(days: DayPrice[]): number[] {
  return Array.from(
    new Set(days.flatMap((day) => day.slots.map((slot) => priceToPence(slot.price)))),
  ).sort((a, b) => a - b);
}

function getPriceBand(price: number, scale: number[]): PriceBand {
  if (scale.length <= 1) return "green";

  const priceInPence = priceToPence(price);
  const rank = Math.max(0, scale.findIndex((value) => value >= priceInPence));
  const ratio = rank / (scale.length - 1);

  if (ratio <= 1 / 3) return "green";
  if (ratio <= 2 / 3) return "amber";
  return "red";
}

function buildBreakdown(pricing: PricingResult, slotPrice: number): PriceLineItem[] {
  const adjustment = Math.round((slotPrice - pricing.staticSubtotal) * 100) / 100;
  return [
    ...pricing.staticLineItems,
    ...(Math.abs(adjustment) >= 0.01
      ? [{
          label: adjustment > 0 ? "Date and time adjustment" : "Date and time saving",
          amount: adjustment,
          type: adjustment > 0 ? "surcharge" : "discount",
        }]
      : []),
  ];
}

function QuoteSkeleton() {
  const skeletonCard: React.CSSProperties = { background: "rgba(255,255,255,0.04)", boxShadow: "0 0 0 1px rgba(245,158,11,0.12)" };
  return (
    <section
      className="space-y-4"
      role="status"
      aria-label="Loading available dates and prices"
      aria-live="polite"
    >
      {/* Date rail skeleton */}
      <div className="rounded-2xl p-4" style={skeletonCard}>
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-5 w-32 animate-pulse rounded-lg bg-white/10" />
            <div className="h-3 w-48 animate-pulse rounded-full bg-white/6" />
          </div>
          <div className="flex gap-2">
            <div className="h-10 w-20 animate-pulse rounded-xl bg-white/8" />
            <div className="h-10 w-14 animate-pulse rounded-xl bg-white/8" />
          </div>
        </div>
        <div className="mt-4 flex gap-2 overflow-hidden">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-[76px] w-28 shrink-0 animate-pulse rounded-xl bg-white/8"
              style={{ animationDelay: `${i * 60}ms` }}
            />
          ))}
        </div>
      </div>

      {/* Slots skeleton */}
      <div className="rounded-2xl p-4" style={skeletonCard}>
        <div className="h-5 w-40 animate-pulse rounded-lg bg-white/10" />
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-[132px] animate-pulse rounded-2xl bg-white/8"
              style={{ animationDelay: `${i * 80}ms` }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export function SchedulePicker({ onBack, onContinue }: SchedulePickerProps) {
  const { state, dispatch } = useBooking();
  const [pricing, setPricing] = useState<PricingResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [validationError, setValidationError] = useState("");
  const requestSeq = useRef(0);
  const datesRailRef = useRef<HTMLDivElement | null>(null);

  const pricingRequest = useMemo(
    () => ({
      serviceType: state.entryServiceSlug || state.serviceSlug,
      serviceVariant: state.serviceVariant || undefined,
      distanceMiles: state.distanceMiles,
      pickupFloor: state.pickupFloor,
      pickupHasLift: state.pickupHasLift,
      dropoffFloor: state.dropoffFloor,
      dropoffHasLift: state.dropoffHasLift,
      helpersCount: state.helpersCount,
      needsPacking: state.needsPacking,
      needsAssembly: state.needsAssembly,
      pickupLat: state.pickup?.lat,
      pickupLng: state.pickup?.lng,
    }),
    [
      state.distanceMiles,
      state.dropoffFloor,
      state.dropoffHasLift,
      state.helpersCount,
      state.needsAssembly,
      state.needsPacking,
      state.pickup?.lat,
      state.pickup?.lng,
      state.pickupFloor,
      state.pickupHasLift,
      state.entryServiceSlug,
      state.serviceSlug,
      state.serviceVariant,
    ],
  );

  const fetchPricing = useCallback(async () => {
    const requestId = requestSeq.current + 1;
    requestSeq.current = requestId;
    setLoading(true);
    setError("");
    dispatch({ type: "SET_QUOTE_STATUS", status: "loading" });

    try {
      if (!state.serviceSlug || state.distanceMiles <= 0) {
        const nextError = "Please return to the journey step so we can calculate a valid route first.";
        setPricing(null);
        setError(nextError);
        dispatch({ type: "SET_QUOTE_STATUS", status: "failed", error: nextError });
        return;
      }

      const res = await fetch(`${API_BASE}/pricing/calculate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pricingRequest),
      });
      const json = await res.json();
      if (requestId !== requestSeq.current) return;
      if (!res.ok || !json.success || !json.data?.days?.length) {
        console.warn("Pricing quote request failed", {
          status: res.status,
          code: json?.code,
          error: json?.error,
        });
        const nextError = PRICING_ERROR_MESSAGE;
        setPricing(null);
        setError(nextError);
        dispatch({ type: "SET_QUOTE_STATUS", status: "failed", error: nextError });
        return;
      }

      setPricing(json.data as PricingResult);
    } catch {
      if (requestId !== requestSeq.current) return;
      const nextError = "We couldn't reach pricing. Please check the connection and retry.";
      setPricing(null);
      setError(nextError);
      dispatch({ type: "SET_QUOTE_STATUS", status: "failed", error: nextError });
    } finally {
      if (requestId === requestSeq.current) setLoading(false);
    }
  }, [dispatch, pricingRequest, state.distanceMiles, state.serviceSlug]);

  useEffect(() => {
    void fetchPricing();
  }, [fetchPricing]);

  const selectedDayData = pricing?.days.find((day) => day.date === state.selectedDate);
  const selectedSlotData = selectedDayData?.slots.find((slot) => slot.slot === state.selectedTimeSlot);
  const priceScale = useMemo(() => (pricing ? buildPriceScale(pricing.days) : []), [pricing]);

  useEffect(() => {
    if (!pricing || loading) return;

    if (!state.selectedDate) {
      dispatch({ type: "SET_PRICE", total: 0 });
      dispatch({ type: "SET_BREAKDOWN", items: pricing.staticLineItems });
      dispatch({ type: "SET_QUOTE_STATUS", status: "incomplete" });
      return;
    }

    if (!state.selectedTimeSlot) {
      dispatch({ type: "SET_PRICE", total: 0 });
      dispatch({ type: "SET_BREAKDOWN", items: pricing.staticLineItems });
      dispatch({ type: "SET_QUOTE_STATUS", status: "incomplete" });
      return;
    }

    if (!selectedSlotData) {
      dispatch({ type: "SET_DATE", date: "" });
      dispatch({ type: "SET_PRICE", total: 0 });
      dispatch({ type: "SET_BREAKDOWN", items: pricing.staticLineItems });
      dispatch({
        type: "SET_QUOTE_STATUS",
        status: "stale",
        error: "Your previous appointment is no longer available. Please choose another slot.",
      });
      return;
    }

    dispatch({ type: "SET_PRICE", total: selectedSlotData.price });
    dispatch({ type: "SET_BREAKDOWN", items: buildBreakdown(pricing, selectedSlotData.price) });
    dispatch({ type: "SET_QUOTE_STATUS", status: "valid" });
  }, [dispatch, loading, pricing, selectedSlotData, state.selectedDate, state.selectedTimeSlot]);

  function chooseSlot(day: DayPrice, slot: SlotData) {
    setValidationError("");
    dispatch({ type: "SET_DATE", date: day.date });
    dispatch({ type: "SET_SLOT", slot: slot.slot });
    dispatch({ type: "SET_PRICE", total: slot.price });
    if (pricing) dispatch({ type: "SET_BREAKDOWN", items: buildBreakdown(pricing, slot.price) });
    dispatch({ type: "SET_QUOTE_STATUS", status: "valid" });
  }

  function handleContinue() {
    if (loading) return;
    if (error || !pricing) {
      setValidationError("Please load a valid quote before continuing.");
      return;
    }
    if (!state.selectedDate || !selectedSlotData) {
      setValidationError("Please choose a date and time.");
      return;
    }
    setValidationError("");
    dispatch({ type: "SET_STEP", step: 5 });
    onContinue?.();
  }

  function scrollDates(direction: "previous" | "next") {
    datesRailRef.current?.scrollBy({
      left: direction === "next" ? 260 : -260,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
    });
  }

  const cardStyle: React.CSSProperties = { background: "rgba(255,255,255,0.04)", boxShadow: "0 0 0 1px rgba(245,158,11,0.15), 0 8px 32px rgba(0,0,0,0.4)" };

  return (
    <section className="space-y-6">
      <div>
        <button
          type="button"
          onClick={onBack ?? (() => dispatch({ type: "SET_STEP", step: 3 }))}
          className="mb-4 inline-flex min-h-10 items-center gap-1.5 rounded-lg px-3 text-sm font-semibold text-amber-400/70 transition hover:text-amber-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
        >
          <span aria-hidden="true">←</span> Back
        </button>
        <p className="text-xs font-bold uppercase tracking-widest text-amber-400">Step 3 of 4 · Date &amp; Time</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight text-white">Date and time</h1>
        <p className="mt-2 max-w-2xl text-base leading-7 text-amber-100/55">
          Choose an available date — prices vary by slot. Your total updates instantly.
        </p>
        <div className="mt-4">
          <WeatherChip lat={state.pickup?.lat} lng={state.pickup?.lng} />
        </div>
      </div>

      {loading ? (
        <QuoteSkeleton />
      ) : error ? (
        <div className="rounded-2xl p-5 text-sm" style={{ background: "rgba(239,68,68,0.10)", boxShadow: "0 0 0 1px rgba(239,68,68,0.25)" }} role="alert">
          <p className="font-black text-red-400">Quote unavailable</p>
          <p className="mt-1 text-red-300/80">{error}</p>
          <button
            type="button"
            onClick={fetchPricing}
            className="mt-4 min-h-11 rounded-xl bg-red-500/20 px-4 text-sm font-bold text-red-300 ring-1 ring-red-500/30 transition hover:bg-red-500/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
          >
            Retry quote
          </button>
        </div>
      ) : pricing ? (
        <>
          {/* ── Date rail ── */}
          <section className="rounded-2xl p-4" style={cardStyle}>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-black text-white">Available dates</h2>
                <p className="text-sm text-amber-100/55">{pricing.days.length}-day booking horizon from current pricing.</p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => scrollDates("previous")}
                  className="min-h-10 rounded-xl px-3 text-sm font-bold text-white/60 transition hover:text-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
                  style={{ background: "rgba(255,255,255,0.07)", boxShadow: "0 0 0 1px rgba(255,255,255,0.10)" }}
                  aria-label="Show previous dates"
                >
                  ← Prev
                </button>
                <button
                  type="button"
                  onClick={() => scrollDates("next")}
                  className="min-h-10 rounded-xl px-3 text-sm font-bold text-white/60 transition hover:text-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
                  style={{ background: "rgba(255,255,255,0.07)", boxShadow: "0 0 0 1px rgba(255,255,255,0.10)" }}
                  aria-label="Show next dates"
                >
                  Next →
                </button>
              </div>
            </div>
            <div ref={datesRailRef} className="mt-4 overflow-x-auto pb-1">
              <div className="flex min-w-max gap-2">
                {pricing.days.map((day) => {
                  const selected = day.date === state.selectedDate;
                  const dayMinPrice = Math.min(...day.slots.map((slot) => slot.price));
                  const priceBand = getPriceBand(dayMinPrice, priceScale);
                  const bandStyles = PRICE_BAND_STYLES[priceBand];
                  return (
                    <button
                      key={day.date}
                      type="button"
                      onClick={() => dispatch({ type: "SET_DATE", date: day.date })}
                      className="min-h-[76px] w-28 rounded-xl px-3 py-2 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
                      style={selected ? bandStyles.selectedCardStyle : bandStyles.cardStyle}
                      aria-pressed={selected}
                      aria-label={`${formatDate(day.date)}, from ${money.format(dayMinPrice)}, ${PRICE_BAND_LABELS[priceBand]}`}
                    >
                      <span className="block text-sm font-bold text-white">{formatDate(day.date)}</span>
                      <span className={`mt-1 block text-xs font-bold ${bandStyles.price}`}>
                        From {money.format(dayMinPrice)}
                      </span>
                      <span className={`mt-2 inline-flex rounded-full px-2 py-0.5 text-[11px] font-bold ${bandStyles.badge}`}>
                        {PRICE_BAND_LABELS[priceBand]}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </section>

          {/* ── Time slots ── */}
          <section className="rounded-2xl p-4" style={cardStyle}>
            <h2 className="text-base font-black text-white">
              {state.selectedDate ? `Slots for ${formatDate(state.selectedDate)}` : "Choose a date to see slots"}
            </h2>
            {selectedDayData ? (
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                {selectedDayData.slots.map((slot) => {
                  const selected = selectedSlotData?.slot === slot.slot;
                  const priceBand = getPriceBand(slot.price, priceScale);
                  const bandStyles = PRICE_BAND_STYLES[priceBand];
                  return (
                    <button
                      key={slot.slot}
                      type="button"
                      onClick={() => chooseSlot(selectedDayData, slot)}
                      aria-pressed={selected}
                      className="min-h-[132px] rounded-2xl p-4 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
                      style={selected ? bandStyles.selectedCardStyle : bandStyles.cardStyle}
                      aria-label={`${SLOT_LABELS[slot.slot]}, ${money.format(slot.price)}, ${PRICE_BAND_LABELS[priceBand]}`}
                    >
                      <span className="flex items-center gap-2 text-base font-black text-white">
                        <span className={`h-2.5 w-2.5 rounded-full ${bandStyles.dot}`} aria-hidden="true" />
                        {SLOT_LABELS[slot.slot]}
                      </span>
                      <span className={`mt-3 inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${bandStyles.badge}`}>
                        {PRICE_BAND_LABELS[priceBand]}
                      </span>
                      <span className={`mt-4 block text-2xl font-black ${bandStyles.price}`}>
                        {money.format(slot.price)}
                      </span>
                      <span className="mt-2 inline-flex rounded-full px-2.5 py-1 text-xs font-bold text-white/50" style={{ background: "rgba(255,255,255,0.08)" }}>
                        {selected ? "✓ Selected" : "Available"}
                      </span>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="mt-4 rounded-xl p-4 text-sm" style={{ background: "rgba(255,255,255,0.03)", boxShadow: "0 0 0 1px rgba(255,255,255,0.08) " }}>
                <p className="text-white/40">No date selected yet — choose a date above.</p>
              </div>
            )}
          </section>

          {/* ── Selected slot summary ── */}
          {selectedSlotData && (
            <section
              className="rounded-2xl p-4"
              style={{ background: "rgba(245,158,11,0.08)", boxShadow: "0 0 0 1px rgba(245,158,11,0.30), 0 8px 32px rgba(0,0,0,0.35)" }}
              aria-live="polite"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-black text-white">
                    {formatDate(state.selectedDate)}, {SLOT_LABELS[selectedSlotData.slot]}
                  </p>
                  <p className="mt-1 text-sm text-amber-100/60">
                    Base subtotal {money.format(pricing.staticSubtotal)}
                    {Math.abs(selectedSlotData.price - pricing.staticSubtotal) >= 0.01
                      ? `, time adjustment ${money.format(selectedSlotData.price - pricing.staticSubtotal)}`
                      : " · no time adjustment"}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-black text-white">{money.format(selectedSlotData.price)}</p>
                  <p className="text-xs font-bold uppercase tracking-widest text-amber-400/70">Payable total</p>
                </div>
              </div>
            </section>
          )}
        </>
      ) : null}

      {validationError && (
        <p role="alert" className="rounded-xl px-4 py-3 text-sm font-medium text-red-300" style={{ background: "rgba(239,68,68,0.10)", boxShadow: "0 0 0 1px rgba(239,68,68,0.20)" }}>
          {validationError}
        </p>
      )}

      <button
        id="booking-primary-action"
        type="button"
        onClick={handleContinue}
        disabled={loading || Boolean(error) || !pricing}
        className="hidden min-h-12 w-full items-center justify-center rounded-xl px-5 text-base font-black text-black shadow-lg transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-booking-background disabled:cursor-not-allowed disabled:opacity-40 lg:flex"
        style={{ background: "linear-gradient(135deg, #F59E0B 0%, #EA580C 100%)" }}
      >
        Continue to review and pay →
      </button>
    </section>
  );
}
