"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { computeTotalVolumeM3 } from "@speedy-van/shared";
import { useBooking, type PriceLineItem, type SelectedItem, type TimeSlot } from "@/lib/booking-store";
import { STEP_PRIMARY_CTA_ID } from "@/lib/booking-steps";
import { WeatherChip } from "./WeatherChip";
import { parsePricingResult, type DayPrice, type PricingResult, type SlotData } from "./quote-response";
import { PriceLockCard } from "./PriceLockCard";

export interface SchedulePickerProps {
  onBack?: () => void;
  onContinue?: () => void;
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

function buildBreakdown(pricing: PricingResult, day: DayPrice, slotPrice: number): PriceLineItem[] {
  const adjustment = Math.round((slotPrice - pricing.staticSubtotal) * 100) / 100;
  return [
    ...pricing.staticLineItems,
    ...(day.lineItems ?? []),
    ...(Math.abs(adjustment) >= 0.01
      ? [{
          label: adjustment > 0 ? "Date and time adjustment" : "Date and time saving",
          amount: adjustment,
          type: adjustment > 0 ? "surcharge" : "discount",
        }]
      : []),
  ];
}

function findCheapestSlot(days: DayPrice[]): { day: DayPrice; slot: SlotData } | null {
  let cheapest: { day: DayPrice; slot: SlotData } | null = null;
  for (const day of days) {
    for (const slot of day.slots) {
      if (!cheapest || slot.price < cheapest.slot.price) {
        cheapest = { day, slot };
      }
    }
  }
  return cheapest;
}

function formatLoadVolume(items: SelectedItem[]): string {
  const totalVolumeM3 = computeTotalVolumeM3(items);
  return totalVolumeM3 >= 1 ? totalVolumeM3.toFixed(1) : totalVolumeM3.toFixed(2);
}

function PricingChecklist({ distanceMiles, items }: { distanceMiles: number; items: SelectedItem[] }) {
  const [activeStep, setActiveStep] = useState(0);
  const itemCount = items.reduce((total, item) => total + item.quantity, 0);
  const loadVolume = formatLoadVolume(items);
  const totalVolumeM3 = computeTotalVolumeM3(items);
  const bulkyLoad = itemCount > 4 && totalVolumeM3 >= 1;

  useEffect(() => {
    const id = window.setInterval(() => {
      setActiveStep((current) => (current + 1) % 4);
    }, 900);
    return () => window.clearInterval(id);
  }, []);

  const cardStyle: React.CSSProperties = {
    background: "rgba(245,158,11,0.10)",
    boxShadow: "0 0 0 1px rgba(245,158,11,0.28), 0 16px 44px rgba(0,0,0,0.35)",
  };
  const mutedCard: React.CSSProperties = {
    background: "rgba(255,255,255,0.04)",
    boxShadow: "0 0 0 1px rgba(255,255,255,0.08)",
  };
  const steps = [
    { title: "Reading your route", detail: `${distanceMiles.toFixed(1)} miles confirmed` },
    { title: "Checking item volume", detail: `${itemCount} item${itemCount === 1 ? "" : "s"} · ${loadVolume} m3` },
    {
      title: bulkyLoad ? "Matching bulky load pricing" : "Matching van space",
      detail: bulkyLoad ? "Large inventory rules selected" : "Vehicle capacity being checked",
    },
    { title: "Securing live price", detail: "Dates and slots are being priced" },
  ];

  return (
    <section
      className="space-y-4"
      role="status"
      aria-label="Calculating your quote"
      aria-live="polite"
    >
      <div className="rounded-2xl p-5" style={cardStyle}>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-amber-400/75">Calculating your price</p>
            <h2 className="mt-2 text-2xl font-black text-white">Final checks in progress</h2>
          </div>
          <span className="rounded-full bg-amber-500 px-3 py-1 text-xs font-black text-black">
            Working
          </span>
        </div>

        <div className="mt-5 grid gap-2">
          {steps.map((step, index) => {
            const done = index < activeStep;
            const active = index === activeStep;
            return (
              <div
                key={step.title}
                className={`grid min-h-16 grid-cols-[32px_minmax(0,1fr)_auto] items-center gap-3 rounded-xl px-3 py-2 ${
                  active ? "ring-1 ring-amber-500/50" : "ring-1 ring-white/8"
                }`}
                style={active ? { background: "rgba(245,158,11,0.12)" } : mutedCard}
              >
                <span
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-black ${
                    done
                      ? "bg-emerald-500 text-black"
                      : active
                        ? "bg-amber-500 text-black"
                        : "bg-white/8 text-white/45"
                  }`}
                >
                  {done ? "✓" : index + 1}
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-black text-white">{step.title}</span>
                  <span className="block truncate text-xs font-semibold text-amber-100/55">{step.detail}</span>
                </span>
                <span className={`text-[11px] font-black uppercase tracking-widest ${active ? "text-amber-400" : done ? "text-emerald-400" : "text-white/35"}`}>
                  {active ? "Checking" : done ? "Done" : "Queued"}
                </span>
              </div>
            );
          })}
        </div>

        {bulkyLoad && (
          <div className="mt-3 rounded-xl bg-red-500/10 px-3 py-2 text-sm font-bold text-red-300 ring-1 ring-red-500/25">
            Bulky load detected
          </div>
        )}
      </div>

      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="grid grid-cols-[28px_minmax(0,1fr)] gap-3">
            <div className="relative flex justify-center">
              <span className="mt-5 h-3 w-3 rounded-full bg-amber-500/30" />
              {i < 3 && <span className="absolute top-10 h-[calc(100%+12px)] w-px bg-white/10" />}
            </div>
            <div className="rounded-2xl p-4" style={mutedCard}>
              <div className="h-5 w-40 rounded-lg bg-white/10" />
              <div className="mt-4 grid gap-2 sm:grid-cols-3">
                {Array.from({ length: 3 }).map((_, slotIndex) => (
                  <div
                    key={slotIndex}
                    className="h-[86px] rounded-xl bg-white/8"
                  />
                ))}
              </div>
            </div>
          </div>
        ))}
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
  const pricingAbort = useRef<AbortController | null>(null);

  const pricingRequest = useMemo(
    () => ({
      serviceType: state.entryServiceSlug || state.serviceSlug,
      serviceVariant: state.serviceVariant || undefined,
      distanceMiles: state.distanceMiles,
      pickupFloor: state.pickupFloor,
      pickupHasLift: state.pickupHasLift,
      pickupCarryMetres: state.pickupCarryMetres,
      dropoffFloor: state.dropoffFloor,
      dropoffHasLift: state.dropoffHasLift,
      dropoffCarryMetres: state.dropoffCarryMetres,
      hasNarrowAccess: state.hasNarrowAccess,
      hasPermitZone: state.hasPermitZone,
      helpersCount: state.helpersCount,
      needsPacking: state.needsPacking,
      needsAssembly: state.needsAssembly,
      selectedItems: state.items.map((item) => ({
        lineId: item.lineId,
        itemId: item.itemId,
        name: item.name,
        quantity: item.quantity,
        roomId: item.roomId,
        roomName: item.roomName,
      })),
      pickupLat: state.pickup?.lat,
      pickupLng: state.pickup?.lng,
    }),
    [
      state.distanceMiles,
      state.dropoffFloor,
      state.dropoffHasLift,
      state.dropoffCarryMetres,
      state.hasNarrowAccess,
      state.hasPermitZone,
      state.helpersCount,
      state.items,
      state.needsAssembly,
      state.needsPacking,
      state.pickup?.lat,
      state.pickup?.lng,
      state.pickupFloor,
      state.pickupHasLift,
      state.pickupCarryMetres,
      state.entryServiceSlug,
      state.serviceSlug,
      state.serviceVariant,
    ],
  );

  const fetchPricing = useCallback(async () => {
    const requestId = requestSeq.current + 1;
    requestSeq.current = requestId;
    pricingAbort.current?.abort();
    const controller = new AbortController();
    pricingAbort.current = controller;
    setLoading(true);
    setPricing(null);
    setError("");
    dispatch({ type: "SET_PRICE", total: 0 });
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
        signal: controller.signal,
        body: JSON.stringify(pricingRequest),
      });
      const json = await res.json();
      if (requestId !== requestSeq.current || controller.signal.aborted) return;
      const nextPricing = parsePricingResult(json.data);
      if (!res.ok || !json.success || !nextPricing) {
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

      if (nextPricing.days.length === 0) {
        const nextError = "No dates are available for this move right now. Please retry later or contact us to check availability.";
        setError(nextError);
        dispatch({ type: "SET_QUOTE_STATUS", status: "failed", error: nextError });
        return;
      }
      setPricing(nextPricing);
      // Store quote token and cheapest day in booking state (T2, T4)
      if (nextPricing.quoteToken) {
        dispatch({
          type: "SET_QUOTE_META",
          quoteToken: nextPricing.quoteToken,
          quoteExpiresAt: nextPricing.quoteExpiresAt ?? 0,
          cheapestDay: nextPricing.cheapestDay ?? "",
        });
      }
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
    return () => {
      requestSeq.current += 1;
      pricingAbort.current?.abort();
    };
  }, [fetchPricing]);

  const selectedDayData = pricing?.days.find((day) => day.date === state.selectedDate);
  const selectedSlotData = selectedDayData?.slots.find((slot) => slot.slot === state.selectedTimeSlot);
  const priceScale = useMemo(() => (pricing ? buildPriceScale(pricing.days) : []), [pricing]);
  const cheapestSlot = useMemo(() => (pricing ? findCheapestSlot(pricing.days) : null), [pricing]);
  const cheapestSlotKey = cheapestSlot ? `${cheapestSlot.day.date}:${cheapestSlot.slot.slot}` : "";

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

    if (!selectedDayData || !selectedSlotData) {
      setValidationError("Your previous appointment is no longer available. Please choose another slot.");
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
    dispatch({ type: "SET_BREAKDOWN", items: buildBreakdown(pricing, selectedDayData, selectedSlotData.price) });
    dispatch({ type: "SET_QUOTE_STATUS", status: "valid" });
  }, [dispatch, loading, pricing, selectedDayData, selectedSlotData, state.selectedDate, state.selectedTimeSlot]);

  function chooseSlot(day: DayPrice, slot: SlotData) {
    setValidationError("");
    dispatch({ type: "SET_DATE", date: day.date });
    dispatch({ type: "SET_SLOT", slot: slot.slot });
    dispatch({ type: "SET_PRICE", total: slot.price });
    if (pricing) dispatch({ type: "SET_BREAKDOWN", items: buildBreakdown(pricing, day, slot.price) });
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
    if (state.quoteExpiresAt > 0 && Date.now() >= state.quoteExpiresAt) {
      setValidationError("Your quote has expired. Refresh the price before continuing.");
      return;
    }
    setValidationError("");
    dispatch({ type: "SET_STEP", step: 5 });
    onContinue?.();
  }

  const cardStyle: React.CSSProperties = { background: "rgba(255,255,255,0.04)", boxShadow: "0 0 0 1px rgba(245,158,11,0.15), 0 8px 32px rgba(0,0,0,0.4)" };

  return (
    <section className="space-y-6">
      <div>
        <button
          type="button"
          onClick={onBack ?? (() => dispatch({ type: "SET_STEP", step: 3 }))}
          className="hidden"
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
        <PricingChecklist distanceMiles={state.distanceMiles} items={state.items} />
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
          {cheapestSlot && (
            <section
              className="rounded-2xl p-5"
              style={{ background: "rgba(245,158,11,0.10)", boxShadow: "0 0 0 1px rgba(245,158,11,0.30), 0 16px 40px rgba(0,0,0,0.35)" }}
              aria-label="Cheapest available price"
            >
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-amber-400/75">Starts from</p>
                  <p className="mt-1 text-4xl font-black tracking-tight text-white sm:text-5xl">
                    {money.format(cheapestSlot.slot.price)}
                  </p>
                  <p className="mt-2 text-sm font-semibold text-amber-100/60">
                    Cheapest: {formatDate(cheapestSlot.day.date)}, {SLOT_LABELS[cheapestSlot.slot.slot]}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => chooseSlot(cheapestSlot.day, cheapestSlot.slot)}
                  className="min-h-11 rounded-xl bg-amber-500 px-4 text-sm font-black text-black transition hover:bg-amber-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
                >
                  Select cheapest
                </button>
              </div>
            </section>
          )}

          {/* ── Vertical timeline ── */}
          <section className="space-y-4" aria-label="Available date timeline">
            <div>
              <h2 className="text-base font-black text-white">Available dates</h2>
              <p className="text-sm text-amber-100/55">{pricing.days.length}-day booking horizon from current pricing.</p>
            </div>

            <div className="space-y-3">
              {pricing.days.map((day, index) => {
                const selected = day.date === state.selectedDate;
                const dayMinPrice = Math.min(...day.slots.map((slot) => slot.price));
                const dayPriceBand = getPriceBand(dayMinPrice, priceScale);
                const dayBandStyles = PRICE_BAND_STYLES[dayPriceBand];
                const isCheapestDay = pricing.cheapestDay === day.date;
                return (
                  <article key={day.date} className="grid grid-cols-[28px_minmax(0,1fr)] gap-3">
                    <div className="relative flex justify-center">
                      <span
                        className={`mt-6 h-3.5 w-3.5 rounded-full ${selected ? "bg-amber-400" : isCheapestDay ? "bg-emerald-400" : "bg-white/20"}`}
                        aria-hidden="true"
                      />
                      {index < pricing.days.length - 1 && (
                        <span className="absolute top-11 h-[calc(100%+12px)] w-px bg-white/10" aria-hidden="true" />
                      )}
                    </div>

                    <div
                      className="rounded-2xl p-4"
                      style={selected ? dayBandStyles.selectedCardStyle : cardStyle}
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <h3 className="text-base font-black text-white">{formatDate(day.date)}</h3>
                          <p className={`mt-1 text-sm font-black ${dayBandStyles.price}`}>
                            From {money.format(dayMinPrice)}
                          </p>
                        </div>
                        <div className="flex flex-wrap justify-end gap-2">
                          {isCheapestDay && (
                            <span className="rounded-full bg-emerald-500 px-2.5 py-1 text-[11px] font-black text-black">
                              Cheapest day
                            </span>
                          )}
                          <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${dayBandStyles.badge}`}>
                            {PRICE_BAND_LABELS[dayPriceBand]}
                          </span>
                        </div>
                      </div>

                      <div className="mt-4 grid gap-2 sm:grid-cols-3">
                        {day.slots.map((slot) => {
                          const slotSelected = selectedSlotData?.slot === slot.slot && state.selectedDate === day.date;
                          const slotPriceBand = getPriceBand(slot.price, priceScale);
                          const slotBandStyles = PRICE_BAND_STYLES[slotPriceBand];
                          const isCheapestSlot = cheapestSlotKey === `${day.date}:${slot.slot}`;
                          return (
                            <button
                              key={slot.slot}
                              type="button"
                              onClick={() => chooseSlot(day, slot)}
                              aria-pressed={slotSelected}
                              className="min-h-[92px] rounded-xl p-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
                              style={slotSelected ? slotBandStyles.selectedCardStyle : slotBandStyles.cardStyle}
                              aria-label={`${formatDate(day.date)}, ${SLOT_LABELS[slot.slot]}, ${money.format(slot.price)}, ${PRICE_BAND_LABELS[slotPriceBand]}${isCheapestSlot ? ", cheapest slot" : ""}`}
                            >
                              <span className="flex items-center justify-between gap-2">
                                <span className="flex items-center gap-2 text-sm font-black text-white">
                                  <span className={`h-2.5 w-2.5 rounded-full ${slotBandStyles.dot}`} aria-hidden="true" />
                                  {SLOT_LABELS[slot.slot]}
                                </span>
                                {isCheapestSlot && (
                                  <span className="rounded-full bg-emerald-500 px-2 py-0.5 text-[10px] font-black text-black">
                                    Best
                                  </span>
                                )}
                              </span>
                              <span className={`mt-3 block text-xl font-black ${slotBandStyles.price}`}>
                                {money.format(slot.price)}
                              </span>
                              <span className="mt-2 block text-xs font-bold text-white/45">
                                {slotSelected ? "Selected" : PRICE_BAND_LABELS[slotPriceBand]}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>

          {/* ── Price lock card (T9) ── */}
          {selectedSlotData && <PriceLockCard onRefresh={fetchPricing} refreshing={loading} />}

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
        id={STEP_PRIMARY_CTA_ID}
        type="button"
        onClick={handleContinue}
        disabled={loading || Boolean(error) || !pricing}
        className="hidden"
        style={{ background: "linear-gradient(135deg, #F59E0B 0%, #EA580C 100%)" }}
      >
        Continue to review and pay →
      </button>
    </section>
  );
}
