"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useBooking } from "@/lib/booking-store";

const API_BASE =
  process.env.NODE_ENV === "development"
    ? "http://localhost:4000"
    : (process.env.NEXT_PUBLIC_API_URL ?? "https://api.speedy-van.co.uk");

export interface UpsellSelection {
  needsPacking: boolean;
  needsAssembly: boolean;
  helpersCount: number;
}

export interface UpsellPanelProps {
  /** Snapshot of upsells already baked into the server-priced clientTotal. */
  initial: UpsellSelection;
  /** The clientTotal already baked in at the time step 4 loaded. Used to restore price when user deselects all upsells. */
  initialPrice: number;
  /** Called whenever the panel is fetching a new server price. */
  onUpdatingChange?: (isUpdating: boolean) => void;
  /** Called when the price is stale because a /pricing/calculate request failed. */
  onPriceErrorChange?: (hasError: boolean) => void;
}

function track(name: string, payload: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  const w = window as Window & {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  };
  try {
    w.gtag?.("event", name, { event_category: "upsell", ...payload });
  } catch {
    /* ignore */
  }
  try {
    w.dataLayer?.push({ event: name, ...payload });
  } catch {
    /* ignore */
  }
}

interface SlotData { slot: string; price: number }
interface DayData { date: string; slots: SlotData[] }

export function UpsellPanel({ initial, initialPrice, onUpdatingChange, onPriceErrorChange }: UpsellPanelProps) {
  const { state, dispatch } = useBooking();
  const [updating, setUpdating] = useState(false);
  const [priceError, setPriceError] = useState("");
  const viewedRef = useRef(false);
  const reqIdRef = useRef(0);

  // Fire upsell_view once on mount
  useEffect(() => {
    if (viewedRef.current) return;
    viewedRef.current = true;
    track("upsell_view", { location: "step4" });
  }, []);

  useEffect(() => {
    onUpdatingChange?.(updating);
  }, [updating, onUpdatingChange]);

  useEffect(() => {
    onPriceErrorChange?.(Boolean(priceError));
  }, [priceError, onPriceErrorChange]);

  // Re-fetch the server price for current date+slot whenever the underlying
  // upsell-affecting state changes from the snapshot.
  const stateKey = useMemo(
    () => `${state.needsPacking ? 1 : 0}|${state.needsAssembly ? 1 : 0}|${state.helpersCount}`,
    [state.needsPacking, state.needsAssembly, state.helpersCount],
  );
  const initialKey = `${initial.needsPacking ? 1 : 0}|${initial.needsAssembly ? 1 : 0}|${initial.helpersCount}`;
  const dirty = stateKey !== initialKey;

  useEffect(() => {
    if (!dirty) {
      // User reverted to the original selection — restore the original price
      dispatch({ type: "SET_PRICE", total: initialPrice });
      return;
    }
    if (!state.selectedDate || !state.selectedTimeSlot) return;
    const myReq = ++reqIdRef.current;
    setUpdating(true);
    setPriceError("");
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/pricing/calculate`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
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
          }),
        });
        const json = await res.json();
        if (myReq !== reqIdRef.current) return; // stale
        if (json?.success && json?.data) {
          const days = json.data.days as DayData[] | undefined;
          const day = days?.find((d) => d.date === state.selectedDate);
          const slot = day?.slots.find((s) => s.slot === state.selectedTimeSlot);
          const newPrice =
            slot?.price ??
            (typeof json.data.staticSubtotal === "number" ? json.data.staticSubtotal : null);
          if (typeof newPrice === "number" && newPrice > 0) {
            dispatch({ type: "SET_PRICE", total: newPrice });
          } else {
            setPriceError("Couldn't update price. Please try again.");
          }
        } else {
          setPriceError("Couldn't update price. Please try again.");
        }
      } catch {
        if (myReq !== reqIdRef.current) return;
        setPriceError("Network error while updating price.");
      } finally {
        if (myReq === reqIdRef.current) setUpdating(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stateKey]);

  function toggle(key: "packing" | "assembly" | "helper") {
    if (key === "packing") {
      const next = !state.needsPacking;
      dispatch({ type: "SET_PACKING", value: next });
      if (next) track("upsell_added", { item: "packing" });
    } else if (key === "assembly") {
      const next = !state.needsAssembly;
      dispatch({ type: "SET_ASSEMBLY", value: next });
      if (next) track("upsell_added", { item: "assembly" });
    } else if (key === "helper") {
      const baseline = initial.helpersCount;
      const next = state.helpersCount > baseline ? baseline : Math.min(4, baseline + 1);
      dispatch({ type: "SET_HELPERS", count: next });
      if (next > baseline) track("upsell_added", { item: "helper" });
    }
  }

  const items: {
    key: "packing" | "assembly" | "helper";
    title: string;
    blurb: string;
    selected: boolean;
    icon: string;
    disabled?: boolean;
  }[] = [
    {
      key: "packing",
      title: "Packing help",
      blurb: "We bring boxes & wrap your items.",
      selected: state.needsPacking,
      icon: "📦",
    },
    {
      key: "assembly",
      title: "Furniture assembly",
      blurb: "Disassemble & rebuild at destination.",
      selected: state.needsAssembly,
      icon: "🔧",
    },
    {
      key: "helper",
      title: "Extra helper",
      blurb: "An extra pair of hands speeds it up.",
      selected: state.helpersCount > initial.helpersCount,
      icon: "🤝",
      disabled: state.helpersCount >= 4 && state.helpersCount === initial.helpersCount,
    },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5">
      <div className="flex items-baseline justify-between mb-1">
        <h2 className="font-semibold text-slate-800">Make your move easier</h2>
        <span className="text-[11px] uppercase tracking-wide font-bold text-primary-600">Optional</span>
      </div>
      <p className="text-xs text-slate-500 mb-3">
        {updating ? "Updating price…" : "Total updates automatically when you add an option."}
      </p>
      <ul className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        {items.map((it) => (
          <li key={it.key}>
            <button
              type="button"
              onClick={() => toggle(it.key)}
              disabled={it.disabled || updating}
              className={`w-full text-left rounded-xl border-2 px-3 py-2.5 transition-all focus:outline-none focus:ring-2 focus:ring-primary-400 ${
                it.selected
                  ? "border-primary-400 bg-primary-50"
                  : "border-slate-200 bg-white hover:border-slate-300"
              } ${it.disabled || updating ? "opacity-60 cursor-not-allowed" : ""}`}
            >
              <div className="flex items-start gap-2.5">
                <span className="text-xl leading-none mt-0.5" aria-hidden="true">
                  {it.icon}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-900 truncate">{it.title}</p>
                  <p className="text-[11px] text-slate-500 leading-tight mt-0.5">{it.blurb}</p>
                </div>
                <span
                  className={`shrink-0 mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                    it.selected
                      ? "border-primary-500 bg-primary-500 text-white"
                      : "border-slate-300 bg-white text-transparent"
                  }`}
                  aria-hidden="true"
                >
                  <svg className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.7 5.3a1 1 0 010 1.4l-7.5 7.5a1 1 0 01-1.4 0L3.3 9.7a1 1 0 011.4-1.4L8.5 12l6.8-6.8a1 1 0 011.4.1z" clipRule="evenodd" />
                  </svg>
                </span>
              </div>
            </button>
          </li>
        ))}
      </ul>
      {priceError && <p className="mt-2 text-xs text-red-600">{priceError}</p>}
    </div>
  );
}
