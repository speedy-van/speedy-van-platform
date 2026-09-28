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
  green: "Low",
  amber: "Standard",
  red: "Peak",
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
    cardStyle: { background: "rgba(255,255,255,0.075)", borderLeft: "4px solid rgba(16,185,129,0.95)", boxShadow: "0 0 0 1px rgba(16,185,129,0.22)" },
    selectedCardStyle: { background: "rgba(16,185,129,0.18)", borderLeft: "4px solid rgba(16,185,129,1)", boxShadow: "0 0 0 2px rgba(16,185,129,0.72), 0 14px 34px rgba(0,0,0,0.35)" },
    badge: "bg-emerald-500/18 text-emerald-300 ring-1 ring-emerald-500/35",
    price: "text-white",
    dot: "bg-emerald-500",
  },
  amber: {
    cardStyle: { background: "rgba(255,255,255,0.075)", borderLeft: "4px solid rgba(245,158,11,0.95)", boxShadow: "0 0 0 1px rgba(245,158,11,0.22)" },
    selectedCardStyle: { background: "rgba(245,158,11,0.18)", borderLeft: "4px solid rgba(245,158,11,1)", boxShadow: "0 0 0 2px rgba(245,158,11,0.72), 0 14px 34px rgba(0,0,0,0.35)" },
    badge: "bg-amber-500/18 text-amber-300 ring-1 ring-amber-500/35",
    price: "text-white",
    dot: "bg-amber-500",
  },
  red: {
    cardStyle: { background: "rgba(255,255,255,0.075)", borderLeft: "4px solid rgba(239,68,68,0.95)", boxShadow: "0 0 0 1px rgba(239,68,68,0.24)" },
    selectedCardStyle: { background: "rgba(239,68,68,0.18)", borderLeft: "4px solid rgba(239,68,68,1)", boxShadow: "0 0 0 2px rgba(239,68,68,0.72), 0 14px 34px rgba(0,0,0,0.35)" },
    badge: "bg-red-500/18 text-red-300 ring-1 ring-red-500/35",
    price: "text-white",
    dot: "bg-red-500",
  },
};

const PRICING_ERROR_MESSAGE =
  "We couldn't load your quote right now. Please retry, or go back and check your journey details.";

const INITIAL_VISIBLE_DAYS = 5;
const DAYS_PER_LOAD = 5;
const EXTRA_SERVICE_UNIT_PRICE = 10;

type CrewOptionId = "driver" | "helper";
type ExtraServiceKey = "packingItemCount" | "assemblyItemCount" | "dismantlingItemCount";

interface CrewPricingOption {
  id: CrewOptionId;
  title: string;
  shortLabel: string;
  detail: string;
  helpersCount: number;
  pricing: PricingResult;
  cheapest: { day: DayPrice; slot: SlotData };
  fromPrice: number;
  helperAddonAmount: number | null;
}

function hasLiveQuoteMeta(pricing: PricingResult | null | undefined): pricing is PricingResult & {
  quoteToken: string;
  quoteExpiresAt: number;
} {
  return Boolean(
    pricing &&
    typeof pricing.quoteToken === "string" &&
    pricing.quoteToken.length > 0 &&
    typeof pricing.quoteExpiresAt === "number" &&
    pricing.quoteExpiresAt > Date.now(),
  );
}

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

function findHelperAddonAmount(pricing: PricingResult): number | null {
  const helperLine = pricing.staticLineItems.find((item) =>
    item.label.toLowerCase().includes("extra helper"),
  );
  return helperLine && Number.isFinite(helperLine.amount) ? helperLine.amount : null;
}

function buildCrewOption(
  id: CrewOptionId,
  helpersCount: number,
  pricing: PricingResult,
): CrewPricingOption | null {
  const cheapest = findCheapestSlot(pricing.days);
  if (!cheapest) return null;
  return {
    id,
    helpersCount,
    pricing,
    cheapest,
    fromPrice: cheapest.slot.price,
    helperAddonAmount: findHelperAddonAmount(pricing),
    title: id === "driver" ? "Driver only" : "Driver + one helper",
    shortLabel: id === "driver" ? "Driver only" : "With helper",
    detail: id === "driver" ? "Normal price" : "Extra lifting help",
  };
}

function crewIdForHelpers(count: number): CrewOptionId {
  return count > 0 ? "helper" : "driver";
}

function extraServiceLabel(key: ExtraServiceKey): string {
  if (key === "packingItemCount") return "Packing";
  if (key === "assemblyItemCount") return "Assembly";
  return "Dismantling";
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
    background: "rgba(245,158,11,0.12)",
    boxShadow: "0 0 0 1px rgba(245,158,11,0.34), 0 16px 44px rgba(0,0,0,0.35)",
  };
  const mutedCard: React.CSSProperties = {
    background: "rgba(255,255,255,0.06)",
    boxShadow: "0 0 0 1px rgba(255,255,255,0.12)",
  };
  const steps = [
    { title: "Route", detail: `${distanceMiles.toFixed(1)} miles` },
    { title: "Items", detail: `${itemCount} item${itemCount === 1 ? "" : "s"} · ${loadVolume} m3` },
    {
      title: "Load",
      detail: bulkyLoad ? "Large inventory" : "Capacity check",
    },
    { title: "Prices", detail: "Live slots" },
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
            <p className="text-xs font-black uppercase tracking-widest text-amber-400">Pricing</p>
            <h2 className="mt-2 text-2xl font-black text-white">Getting available slots</h2>
          </div>
          <span className="rounded-full bg-amber-500 px-3 py-1 text-xs font-black text-black">
            Working
          </span>
        </div>

        <div className="mt-5 grid gap-2 sm:grid-cols-4">
          {steps.map((step, index) => {
            const done = index < activeStep;
            const active = index === activeStep;
            return (
              <div
                key={step.title}
                className={`grid min-h-20 grid-cols-[32px_minmax(0,1fr)] items-center gap-3 rounded-xl px-3 py-2 ${
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
                        : "bg-white/10 text-white"
                  }`}
                >
                  {done ? "✓" : index + 1}
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-black text-white">{step.title}</span>
                  <span className="block truncate text-xs font-bold text-white">{step.detail}</span>
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
  const [crewOptions, setCrewOptions] = useState<CrewPricingOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [visibleDayCount, setVisibleDayCount] = useState(INITIAL_VISIBLE_DAYS);
  const [loadingMore, setLoadingMore] = useState(false);
  const [addonsOpen, setAddonsOpen] = useState(false);
  const [continueWithoutPending, setContinueWithoutPending] = useState(false);
  const [error, setError] = useState("");
  const [validationError, setValidationError] = useState("");
  const requestSeq = useRef(0);
  const pricingAbort = useRef<AbortController | null>(null);
  const loadMoreTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

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
      needsPacking: state.packingItemCount > 0 || state.needsPacking,
      needsAssembly: state.assemblyItemCount > 0 || state.dismantlingItemCount > 0 || state.needsAssembly,
      packingItemCount: state.packingItemCount,
      assemblyItemCount: state.assemblyItemCount,
      dismantlingItemCount: state.dismantlingItemCount,
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
      state.assemblyItemCount,
      state.dismantlingItemCount,
      state.items,
      state.needsAssembly,
      state.needsPacking,
      state.packingItemCount,
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
    setCrewOptions([]);
    setVisibleDayCount(INITIAL_VISIBLE_DAYS);
    setLoadingMore(false);
    setError("");
    dispatch({ type: "SET_PRICE", total: 0 });
    dispatch({ type: "SET_QUOTE_STATUS", status: "loading" });

    try {
      if (!state.serviceSlug || state.distanceMiles <= 0) {
        const nextError = "Please return to the journey step so we can calculate a valid route first.";
        setCrewOptions([]);
        setError(nextError);
        dispatch({ type: "SET_QUOTE_STATUS", status: "failed", error: nextError });
        return;
      }

      const requestedOptions: Array<{ id: CrewOptionId; helpersCount: number }> = [
        { id: "driver", helpersCount: 0 },
        { id: "helper", helpersCount: 1 },
      ];
      const nextOptions: CrewPricingOption[] = [];

      for (const option of requestedOptions) {
        const res = await fetch(`${API_BASE}/pricing/calculate`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          signal: controller.signal,
          body: JSON.stringify({ ...pricingRequest, helpersCount: option.helpersCount }),
        });
        const json = await res.json();
        if (requestId !== requestSeq.current || controller.signal.aborted) return;
        const nextPricing = parsePricingResult(json.data);
        const nextOption = nextPricing ? buildCrewOption(option.id, option.helpersCount, nextPricing) : null;
        if (!res.ok || !json.success || !nextPricing || !nextOption) {
          console.warn("Pricing quote request failed", {
            status: res.status,
            code: json?.code,
            error: json?.error,
            option: option.id,
          });
          const nextError = PRICING_ERROR_MESSAGE;
          setCrewOptions([]);
          setError(nextError);
          dispatch({ type: "SET_QUOTE_STATUS", status: "failed", error: nextError });
          return;
        }

        if (nextPricing.days.length === 0) {
          const nextError = "No dates are available for this move right now. Please retry later or contact us to check availability.";
          setCrewOptions([]);
          setError(nextError);
          dispatch({ type: "SET_QUOTE_STATUS", status: "failed", error: nextError });
          return;
        }
        if (!hasLiveQuoteMeta(nextPricing)) {
          const nextError = "We couldn't lock this quote. Please retry the price.";
          setCrewOptions([]);
          setError(nextError);
          dispatch({ type: "SET_QUOTE_STATUS", status: "failed", error: nextError });
          return;
        }

        nextOptions.push(nextOption);
      }

      const sortedOptions = nextOptions.sort((a, b) => a.fromPrice - b.fromPrice);
      const activeOption =
        sortedOptions.find((option) => option.id === crewIdForHelpers(state.helpersCount)) ??
        sortedOptions[0];
      const activePricing = activeOption?.pricing;
      if (!hasLiveQuoteMeta(activePricing)) {
        const nextError = "We couldn't lock this quote. Please retry the price.";
        setCrewOptions([]);
        setError(nextError);
        dispatch({ type: "SET_QUOTE_STATUS", status: "failed", error: nextError });
        return;
      }

      setCrewOptions(sortedOptions);
      dispatch({
        type: "SET_QUOTE_META",
        quoteToken: activePricing.quoteToken,
        quoteExpiresAt: activePricing.quoteExpiresAt,
        cheapestDay: activePricing.cheapestDay ?? "",
      });
    } catch {
      if (requestId !== requestSeq.current) return;
      const nextError = "We couldn't reach pricing. Please check the connection and retry.";
      setCrewOptions([]);
      setError(nextError);
      dispatch({ type: "SET_QUOTE_STATUS", status: "failed", error: nextError });
    } finally {
      if (requestId === requestSeq.current) setLoading(false);
    }
  }, [dispatch, pricingRequest, state.distanceMiles, state.helpersCount, state.serviceSlug]);

  useEffect(() => {
    void fetchPricing();
    return () => {
      requestSeq.current += 1;
      pricingAbort.current?.abort();
      if (loadMoreTimer.current) clearTimeout(loadMoreTimer.current);
    };
  }, [fetchPricing]);

  useEffect(() => {
    if (state.helpersCount > 1) {
      dispatch({ type: "SET_HELPERS", count: 1 });
    }
  }, [dispatch, state.helpersCount]);

  const selectedCrewId = crewIdForHelpers(state.helpersCount);
  const selectedCrewOption =
    crewOptions.find((option) => option.id === selectedCrewId) ??
    crewOptions[0] ??
    null;
  const pricing = selectedCrewOption?.pricing ?? null;
  const selectedDayData = pricing?.days.find((day) => day.date === state.selectedDate);
  const selectedSlotData = selectedDayData?.slots.find((slot) => slot.slot === state.selectedTimeSlot);
  const priceScale = useMemo(() => (pricing ? buildPriceScale(pricing.days) : []), [pricing]);
  const cheapestSlot = useMemo(() => (pricing ? findCheapestSlot(pricing.days) : null), [pricing]);
  const cheapestSlotKey = cheapestSlot ? `${cheapestSlot.day.date}:${cheapestSlot.slot.slot}` : "";
  const visibleDays = useMemo(
    () => (pricing ? pricing.days.slice(0, visibleDayCount) : []),
    [pricing, visibleDayCount],
  );
  const hasMoreDays = Boolean(pricing && visibleDayCount < pricing.days.length);
  const hasAddons =
    state.packingItemCount > 0 ||
    state.assemblyItemCount > 0 ||
    state.dismantlingItemCount > 0;
  const quoteReadyForPayment = Boolean(
    !loading &&
    !error &&
    pricing &&
    selectedSlotData &&
    hasLiveQuoteMeta(pricing) &&
    state.quoteStatus === "valid" &&
    state.clientTotal > 0,
  );

  useEffect(() => {
    setVisibleDayCount(INITIAL_VISIBLE_DAYS);
    setLoadingMore(false);
  }, [selectedCrewOption?.id]);

  useEffect(() => {
    if (!continueWithoutPending || !quoteReadyForPayment) return;
    setContinueWithoutPending(false);
    setAddonsOpen(false);
    setValidationError("");
    dispatch({ type: "SET_STEP", step: 5 });
    onContinue?.();
  }, [continueWithoutPending, dispatch, onContinue, quoteReadyForPayment]);

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
    if (!hasLiveQuoteMeta(pricing)) {
      setValidationError("Your quote has expired. Refresh the price before continuing.");
      dispatch({ type: "SET_PRICE", total: 0 });
      dispatch({ type: "SET_QUOTE_STATUS", status: "stale", error: "Your quote has expired. Refresh the price before continuing." });
      return;
    }

    dispatch({
      type: "SET_QUOTE_META",
      quoteToken: pricing.quoteToken,
      quoteExpiresAt: pricing.quoteExpiresAt,
      cheapestDay: pricing.cheapestDay ?? "",
    });
    dispatch({ type: "SET_PRICE", total: selectedSlotData.price });
    dispatch({ type: "SET_BREAKDOWN", items: buildBreakdown(pricing, selectedDayData, selectedSlotData.price) });
    dispatch({ type: "SET_QUOTE_STATUS", status: "valid" });
  }, [dispatch, loading, pricing, selectedDayData, selectedSlotData, state.selectedDate, state.selectedTimeSlot]);

  function chooseSlot(option: CrewPricingOption, day: DayPrice, slot: SlotData) {
    setValidationError("");
    if (!hasLiveQuoteMeta(option.pricing)) {
      setValidationError("Your quote has expired. Refresh the price before continuing.");
      dispatch({ type: "SET_PRICE", total: 0 });
      dispatch({ type: "SET_QUOTE_STATUS", status: "stale", error: "Your quote has expired. Refresh the price before continuing." });
      return;
    }
    if (state.helpersCount !== option.helpersCount) {
      dispatch({ type: "SET_HELPERS", count: option.helpersCount });
    }
    dispatch({ type: "SET_DATE", date: day.date });
    dispatch({ type: "SET_SLOT", slot: slot.slot });
    dispatch({
      type: "SET_QUOTE_META",
      quoteToken: option.pricing.quoteToken,
      quoteExpiresAt: option.pricing.quoteExpiresAt,
      cheapestDay: option.pricing.cheapestDay ?? "",
    });
    dispatch({ type: "SET_PRICE", total: slot.price });
    dispatch({ type: "SET_BREAKDOWN", items: buildBreakdown(option.pricing, day, slot.price) });
    dispatch({ type: "SET_QUOTE_STATUS", status: "valid" });
  }

  function viewCrewTimes(option: CrewPricingOption) {
    setValidationError("");
    if (state.helpersCount !== option.helpersCount) {
      dispatch({ type: "SET_HELPERS", count: option.helpersCount });
    }
    setVisibleDayCount(INITIAL_VISIBLE_DAYS);
  }

  function loadMoreDays() {
    if (!pricing || loadingMore) return;
    setLoadingMore(true);
    if (loadMoreTimer.current) clearTimeout(loadMoreTimer.current);
    loadMoreTimer.current = setTimeout(() => {
      setVisibleDayCount((current) => Math.min(current + DAYS_PER_LOAD, pricing.days.length));
      setLoadingMore(false);
      loadMoreTimer.current = null;
    }, 450);
  }

  function scheduleError(): string {
    if (loading) return "Please wait for the updated price before continuing.";
    if (error || !pricing) {
      return "Please load a valid quote before continuing.";
    }
    if (!state.selectedDate || !selectedSlotData) {
      return "Please choose a date and time.";
    }
    if (!state.quoteToken || state.quoteExpiresAt <= 0 || Date.now() >= state.quoteExpiresAt) {
      return "Your quote has expired. Refresh the price before continuing.";
    }
    if (!quoteReadyForPayment) return "Please wait for the updated price before continuing.";
    return "";
  }

  function goToPayment() {
    setValidationError("");
    setAddonsOpen(false);
    dispatch({ type: "SET_STEP", step: 5 });
    onContinue?.();
  }

  function handleContinue() {
    const nextError = scheduleError();
    if (nextError) {
      setValidationError(nextError);
      return;
    }
    setValidationError("");
    setAddonsOpen(true);
  }

  function setExtraServiceCount(key: ExtraServiceKey, count: number) {
    dispatch({
      type: "SET_ADDON_COUNTS",
      packingItemCount: key === "packingItemCount" ? count : state.packingItemCount,
      assemblyItemCount: key === "assemblyItemCount" ? count : state.assemblyItemCount,
      dismantlingItemCount: key === "dismantlingItemCount" ? count : state.dismantlingItemCount,
    });
  }

  function continueWithAddons() {
    const nextError = scheduleError();
    if (nextError) {
      setValidationError(nextError);
      return;
    }
    goToPayment();
  }

  function continueWithoutAddons() {
    if (hasAddons) {
      setContinueWithoutPending(true);
      dispatch({
        type: "SET_ADDON_COUNTS",
        packingItemCount: 0,
        assemblyItemCount: 0,
        dismantlingItemCount: 0,
      });
      return;
    }
    continueWithAddons();
  }

  const cardStyle: React.CSSProperties = {
    background: "rgba(255,255,255,0.075)",
    boxShadow: "0 0 0 1px rgba(245,158,11,0.24), 0 8px 32px rgba(0,0,0,0.42)",
  };

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
        <p className="text-xs font-bold uppercase tracking-widest text-amber-400">Step 3 of 4 · Date</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight text-white">Choose date</h1>
        <div className="mt-4">
          <WeatherChip lat={state.pickup?.lat} lng={state.pickup?.lng} />
        </div>
      </div>

      {loading ? (
        <PricingChecklist distanceMiles={state.distanceMiles} items={state.items} />
      ) : error ? (
        <div className="rounded-2xl p-5 text-sm" style={{ background: "rgba(239,68,68,0.10)", boxShadow: "0 0 0 1px rgba(239,68,68,0.25)" }} role="alert">
          <p className="font-black text-red-400">Quote unavailable</p>
          <p className="mt-1 font-semibold text-red-300">{error}</p>
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
          <section className="space-y-3" aria-label="Crew price options">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-base font-black text-white">Choose crew</h2>
              <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-black text-emerald-300 ring-1 ring-emerald-500/30">
                Cheapest first
              </span>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {crewOptions.map((option) => {
                const selected = selectedCrewOption?.id === option.id;
                const isHelper = option.id === "helper";
                return (
                  <article
                    key={option.id}
                    className="rounded-2xl p-4"
                    style={{
                      background: selected ? "rgba(245,158,11,0.15)" : "rgba(255,255,255,0.075)",
                      boxShadow: selected
                        ? "0 0 0 2px rgba(245,158,11,0.72), 0 16px 40px rgba(0,0,0,0.36)"
                        : "0 0 0 1px rgba(255,255,255,0.14), 0 10px 30px rgba(0,0,0,0.32)",
                    }}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-lg font-black text-white">{option.title}</p>
                        <p className="mt-1 text-xs font-black uppercase tracking-widest text-amber-400">
                          {option.detail}
                        </p>
                      </div>
                      <span
                        className={`rounded-full px-2.5 py-1 text-[11px] font-black ${
                          selected ? "bg-amber-500 text-black" : "bg-white/10 text-white ring-1 ring-white/10"
                        }`}
                      >
                        {selected ? "Active" : option.shortLabel}
                      </span>
                    </div>

                    <div className="mt-4 grid grid-cols-[minmax(0,1fr)_auto] items-end gap-3">
                      <div>
                        <p className="text-xs font-black uppercase tracking-widest text-white/80">From</p>
                        <p className="text-3xl font-black tracking-tight text-white">
                          {money.format(option.fromPrice)}
                        </p>
                        <p className="mt-1 text-sm font-bold text-white">
                          {formatDate(option.cheapest.day.date)} · {SLOT_LABELS[option.cheapest.slot.slot]}
                        </p>
                        <p className="mt-2 text-xs font-bold text-white/85">
                          {isHelper
                            ? option.helperAddonAmount !== null
                              ? `One helper add-on ${money.format(option.helperAddonAmount)}`
                              : "One helper included in this quote"
                            : "Driver loads with you ready at both addresses"}
                        </p>
                      </div>
                      <div className="flex flex-col gap-2">
                        <button
                          type="button"
                          onClick={() => chooseSlot(option, option.cheapest.day, option.cheapest.slot)}
                          className="min-h-11 rounded-xl bg-amber-500 px-4 text-sm font-black text-black transition hover:bg-amber-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
                        >
                          Select best
                        </button>
                        <button
                          type="button"
                          onClick={() => viewCrewTimes(option)}
                          className="min-h-10 rounded-xl bg-white/10 px-4 text-xs font-black text-white ring-1 ring-white/15 transition hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
                        >
                          View times
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>

          {cheapestSlot && (
            <section
              className="rounded-2xl p-5"
              style={{ background: "rgba(245,158,11,0.12)", boxShadow: "0 0 0 1px rgba(245,158,11,0.34), 0 16px 40px rgba(0,0,0,0.35)" }}
              aria-label="Cheapest available price"
            >
              <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-amber-400">Best price</p>
                  <p className="mt-1 text-3xl font-black tracking-tight text-white sm:text-4xl">
                    {money.format(cheapestSlot.slot.price)}
                  </p>
                  <p className="mt-2 text-sm font-bold text-white">
                    {selectedCrewOption?.title} · {formatDate(cheapestSlot.day.date)} · {SLOT_LABELS[cheapestSlot.slot.slot]}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => selectedCrewOption && chooseSlot(selectedCrewOption, cheapestSlot.day, cheapestSlot.slot)}
                  className="min-h-12 rounded-xl bg-amber-500 px-5 text-sm font-black text-black transition hover:bg-amber-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
                >
                  Select
                </button>
              </div>
            </section>
          )}

          <section className="space-y-3" aria-label="Available dates">
            <div className="flex flex-wrap items-end justify-between gap-2">
              <div>
                <h2 className="text-base font-black text-white">Available dates</h2>
                <p className="mt-1 text-xs font-bold text-white/80">
                  Showing {visibleDays.length} of {pricing.days.length} days for {selectedCrewOption?.title}.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {visibleDays.map((day) => {
                const selected = day.date === state.selectedDate;
                const dayMinPrice = Math.min(...day.slots.map((slot) => slot.price));
                const dayPriceBand = getPriceBand(dayMinPrice, priceScale);
                const dayBandStyles = PRICE_BAND_STYLES[dayPriceBand];
                const isCheapestDay = pricing.cheapestDay === day.date;
                return (
                  <article key={day.date}>
                    <div className="rounded-2xl p-3" style={selected ? dayBandStyles.selectedCardStyle : cardStyle}>
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
                              Best
                            </span>
                          )}
                          <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${dayBandStyles.badge}`}>
                            {PRICE_BAND_LABELS[dayPriceBand]}
                          </span>
                        </div>
                      </div>

                      <div className="mt-3 grid gap-2 sm:grid-cols-3">
                        {day.slots.map((slot) => {
                          const slotSelected = selectedSlotData?.slot === slot.slot && state.selectedDate === day.date;
                          const slotPriceBand = getPriceBand(slot.price, priceScale);
                          const slotBandStyles = PRICE_BAND_STYLES[slotPriceBand];
                          const isCheapestSlot = cheapestSlotKey === `${day.date}:${slot.slot}`;
                          return (
                            <button
                              key={slot.slot}
                              type="button"
                              onClick={() => selectedCrewOption && chooseSlot(selectedCrewOption, day, slot)}
                              aria-pressed={slotSelected}
                              className="min-h-[68px] rounded-xl p-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
                              style={slotSelected ? slotBandStyles.selectedCardStyle : slotBandStyles.cardStyle}
                              aria-label={`${formatDate(day.date)}, ${SLOT_LABELS[slot.slot]}, ${money.format(slot.price)}, ${PRICE_BAND_LABELS[slotPriceBand]}${isCheapestSlot ? ", best price" : ""}`}
                            >
                              <span className="flex items-center justify-between gap-3">
                                <span className="min-w-0">
                                  <span className="flex items-center gap-2 text-sm font-black text-white">
                                    <span className={`h-2.5 w-2.5 rounded-full ${slotBandStyles.dot}`} aria-hidden="true" />
                                    {SLOT_LABELS[slot.slot]}
                                  </span>
                                  <span className={`mt-1 inline-flex rounded-full px-2 py-0.5 text-[11px] font-black ${
                                    slotSelected ? "bg-amber-500 text-black" : slotBandStyles.badge
                                  }`}>
                                    {slotSelected ? "Selected" : isCheapestSlot ? "Best" : PRICE_BAND_LABELS[slotPriceBand]}
                                  </span>
                                </span>
                                <span className={`shrink-0 text-lg font-black ${slotBandStyles.price}`}>
                                  {money.format(slot.price)}
                                </span>
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

            {hasMoreDays && (
              <button
                type="button"
                onClick={loadMoreDays}
                disabled={loadingMore}
                className="flex min-h-12 w-full items-center justify-center gap-3 rounded-2xl bg-white/10 px-4 text-sm font-black text-white ring-1 ring-white/15 transition hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 disabled:cursor-wait disabled:opacity-80"
              >
                {loadingMore && (
                  <span
                    className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-amber-400"
                    aria-hidden="true"
                  />
                )}
                {loadingMore ? "Loading more dates" : `Load more dates (${pricing.days.length - visibleDays.length} left)`}
              </button>
            )}
          </section>

          {/* ── Price lock card (T9) ── */}
          {selectedSlotData && <PriceLockCard onRefresh={fetchPricing} refreshing={loading} />}

          {/* ── Selected slot summary ── */}
          {selectedSlotData && (
            <section
              className="rounded-2xl p-4"
              style={{ background: "rgba(245,158,11,0.10)", boxShadow: "0 0 0 1px rgba(245,158,11,0.34), 0 8px 32px rgba(0,0,0,0.35)" }}
              aria-live="polite"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-amber-400">Selected slot</p>
                  <p className="mt-1 text-base font-black text-white">
                    {formatDate(state.selectedDate)} · {SLOT_LABELS[selectedSlotData.slot]}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-black text-white">{money.format(selectedSlotData.price)}</p>
                  <p className="text-xs font-black uppercase tracking-widest text-amber-400">Total</p>
                </div>
              </div>
            </section>
          )}
        </>
      ) : null}

      {addonsOpen && (
        <div
          className="fixed inset-0 z-[80] flex items-end justify-center bg-black/70 p-4 sm:items-center"
          role="dialog"
          aria-modal="true"
          aria-labelledby="extra-services-title"
        >
          <div
            className="w-full max-w-lg rounded-2xl p-5"
            style={{ background: "#0B0903", boxShadow: "0 0 0 1px rgba(245,158,11,0.38), 0 24px 80px rgba(0,0,0,0.65)" }}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-amber-400">Optional help</p>
                <h2 id="extra-services-title" className="mt-1 text-2xl font-black text-white">
                  Add moving services
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setAddonsOpen(false)}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-xl font-black text-white ring-1 ring-white/15 transition hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
                aria-label="Close extra services"
              >
                ×
              </button>
            </div>

            <p className="mt-3 text-sm font-semibold leading-6 text-white/85">
              Each item is {money.format(EXTRA_SERVICE_UNIT_PRICE)}. Your quote updates before payment.
            </p>

            <div className="mt-5 space-y-3">
              {([
                "packingItemCount",
                "assemblyItemCount",
                "dismantlingItemCount",
              ] as const).map((key) => {
                const count = state[key];
                return (
                  <div
                    key={key}
                    className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-2xl p-4"
                    style={{ background: "rgba(255,255,255,0.07)", boxShadow: "0 0 0 1px rgba(255,255,255,0.12)" }}
                  >
                    <div>
                      <p className="text-base font-black text-white">{extraServiceLabel(key)}</p>
                      <p className="mt-1 text-xs font-bold text-amber-300">
                        {money.format(EXTRA_SERVICE_UNIT_PRICE)} per item
                      </p>
                    </div>
                    <div className="grid grid-cols-[44px_44px_44px] items-center rounded-xl bg-black/30 p-1 ring-1 ring-white/10">
                      <button
                        type="button"
                        onClick={() => setExtraServiceCount(key, Math.max(0, count - 1))}
                        disabled={count <= 0}
                        className="flex h-10 items-center justify-center rounded-lg text-xl font-black text-white transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 disabled:cursor-not-allowed disabled:text-white/25"
                        aria-label={`Remove one ${extraServiceLabel(key).toLowerCase()} item`}
                      >
                        −
                      </button>
                      <span className="text-center text-lg font-black text-white" aria-live="polite">
                        {count}
                      </span>
                      <button
                        type="button"
                        onClick={() => setExtraServiceCount(key, count + 1)}
                        className="flex h-10 items-center justify-center rounded-lg bg-amber-500 text-xl font-black text-black transition hover:bg-amber-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
                        aria-label={`Add one ${extraServiceLabel(key).toLowerCase()} item`}
                      >
                        +
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div
              className="mt-5 rounded-2xl p-4"
              style={{ background: "rgba(245,158,11,0.12)", boxShadow: "0 0 0 1px rgba(245,158,11,0.28)" }}
            >
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm font-black uppercase tracking-widest text-amber-300">Current quote</span>
                <span className="text-2xl font-black text-white">
                  {state.clientTotal > 0 ? money.format(state.clientTotal) : "Updating"}
                </span>
              </div>
              {!quoteReadyForPayment && (
                <p className="mt-2 text-sm font-bold text-white/80" role="status">
                  Updating price before checkout...
                </p>
              )}
            </div>

            <div className="mt-5 space-y-3">
              <button
                type="button"
                onClick={continueWithAddons}
                disabled={!quoteReadyForPayment}
                className="flex min-h-12 w-full items-center justify-center rounded-xl bg-amber-500 px-5 text-base font-black text-black transition hover:bg-amber-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 disabled:cursor-wait disabled:opacity-65"
              >
                {quoteReadyForPayment ? "Continue" : "Updating price"}
              </button>
              <button
                type="button"
                onClick={continueWithoutAddons}
                disabled={!quoteReadyForPayment && !hasAddons}
                className="flex min-h-12 w-full items-center justify-center rounded-xl bg-white/10 px-5 text-sm font-black text-white ring-1 ring-white/15 transition hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 disabled:cursor-wait disabled:opacity-65"
              >
                {continueWithoutPending ? "Updating price" : "Continue without"}
              </button>
            </div>
          </div>
        </div>
      )}

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
