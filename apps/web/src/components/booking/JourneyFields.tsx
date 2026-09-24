"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useBooking } from "@/lib/booking-store";
import { getBookingServiceOptionForState } from "@/lib/booking-service-options";
import { fetchDrivingRoute, type DrivingRouteResult } from "@/lib/geocode-client";
import { AddressSearch } from "./AddressSearch";
import { FloorPicker } from "./FloorPicker";
import { PropertyTypePicker, isMultiFloorProperty } from "./PropertyTypePicker";
import { RouteMap } from "./RouteMap";
import type { AddressResult } from "@/lib/booking-store";

export interface JourneyFieldsProps {
  onBack?: () => void;
  onContinue?: () => void;
}

function hasUsableCoordinates(point: AddressResult | null): point is AddressResult {
  return Boolean(point && Number.isFinite(point.lat) && Math.abs(point.lat) <= 90 && Number.isFinite(point.lng) && Math.abs(point.lng) <= 180 && (point.lat !== 0 || point.lng !== 0));
}

export function JourneyFields({ onBack, onContinue }: JourneyFieldsProps) {
  const router = useRouter();
  const { state, dispatch } = useBooking();
  const serviceOption = getBookingServiceOptionForState(state.entryServiceSlug, state.serviceSlug);
  const [error, setError] = useState("");
  const [loadingDistance, setLoadingDistance] = useState(false);
  const [route, setRoute] = useState<DrivingRouteResult | null>(null);
  const [routeError, setRouteError] = useState("");
  const [routeRetryToken, setRouteRetryToken] = useState(0);
  const hasRouteInputs = hasUsableCoordinates(state.pickup) && hasUsableCoordinates(state.dropoff);

  useEffect(() => {
    if (!hasRouteInputs) {
      setRoute(null);
      setRouteError("");
      setLoadingDistance(false);
      return;
    }

    let cancelled = false;
    setLoadingDistance(true);
    setRouteError("");
    setRoute(null);
    dispatch({ type: "SET_DISTANCE", value: 0 });

    async function loadRoute() {
      if (!state.pickup || !state.dropoff) return;

      try {
        const nextRoute = await fetchDrivingRoute(state.pickup, state.dropoff);
        if (cancelled) return;
        if (nextRoute) {
          setRoute(nextRoute);
          dispatch({ type: "SET_DISTANCE", value: nextRoute.distanceMiles });
          return;
        }
      } catch {
        // Keep customer inputs, but never price a route we could not calculate.
      }

      if (cancelled) return;
      setRouteError("We couldn't calculate a driving route for these addresses. Please retry or choose confirmed addresses again.");
    }

    void loadRoute().finally(() => {
      if (!cancelled) setLoadingDistance(false);
    });

    return () => {
      cancelled = true;
    };
  }, [dispatch, hasRouteInputs, routeRetryToken, state.dropoff, state.pickup]);

  function handleContinue() {
    if (!state.pickup) {
      setError("Please choose a confirmed pickup address.");
      return;
    }
    if (!state.dropoff) {
      setError("Please choose a confirmed drop-off address.");
      return;
    }
    if (loadingDistance) {
      setError("Please wait while we calculate the route.");
      return;
    }
    if (routeError || state.distanceMiles <= 0) {
      setError("Please retry route calculation before continuing.");
      return;
    }
    setError("");
    dispatch({ type: "SET_STEP", step: 3 });
    onContinue?.();
  }

  return (
    <section className="space-y-5">
      {/* ── Header ── */}
      <div>
        <button
          type="button"
          onClick={onBack ?? (() => router.push("/#get-quote"))}
          className="mb-4 inline-flex min-h-10 items-center gap-1.5 rounded-lg px-3 text-sm font-semibold text-amber-400/70 transition hover:text-amber-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
        >
          <span aria-hidden="true">←</span> Back
        </button>
        <p className="text-xs font-bold uppercase tracking-widest text-amber-400">Step 1 of 4 · Journey</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight text-white">
          {serviceOption?.journeyTitle ?? "Plan the journey"}
        </h1>
        <p className="mt-2 max-w-2xl text-base leading-7 text-amber-100/55">
          {serviceOption?.journeyDescription ??
            "Confirm both addresses so we can calculate mileage and keep the quote tied to the exact route."}
        </p>
      </div>

      {/* ── Address cards ── */}
      <div className="grid gap-4 lg:grid-cols-2">
        <section
          className="rounded-2xl p-5"
          style={{ background: "rgba(255,255,255,0.04)", boxShadow: "0 0 0 1px rgba(245,158,11,0.15), 0 8px 32px rgba(0,0,0,0.4)" }}
        >
          <div className="mb-4 flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-500/20 text-xs font-black text-amber-400">A</span>
            <h2 className="text-base font-black text-white">{serviceOption?.pickupTitle ?? "Pickup"}</h2>
          </div>
          <div className="space-y-5">
            <AddressSearch
              label="Pickup address"
              value={state.pickup}
              onSelect={(addr) => dispatch({ type: "SET_PICKUP", value: addr })}
              onClear={() => dispatch({ type: "CLEAR_PICKUP" })}
              placeholder={serviceOption?.pickupPlaceholder ?? "e.g. 15 Byres Road, Glasgow"}
            />
            <PropertyTypePicker
              value={state.pickupPropertyType}
              onChange={(t) => dispatch({ type: "SET_PICKUP_PROPERTY_TYPE", value: t })}
            />
            {isMultiFloorProperty(state.pickupPropertyType) && (
              <FloorPicker
                label="Pickup floor"
                floor={state.pickupFloor}
                hasLift={state.pickupHasLift}
                onFloor={(n) => dispatch({ type: "SET_PICKUP_FLOOR", value: n })}
                onLift={(v) => dispatch({ type: "SET_PICKUP_LIFT", value: v })}
              />
            )}
          </div>
        </section>

        <section
          className="rounded-2xl p-5"
          style={{ background: "rgba(255,255,255,0.04)", boxShadow: "0 0 0 1px rgba(245,158,11,0.15), 0 8px 32px rgba(0,0,0,0.4)" }}
        >
          <div className="mb-4 flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-orange-500/20 text-xs font-black text-orange-400">B</span>
            <h2 className="text-base font-black text-white">{serviceOption?.dropoffTitle ?? "Delivery"}</h2>
          </div>
          <div className="space-y-5">
            <AddressSearch
              label="Drop-off address"
              value={state.dropoff}
              onSelect={(addr) => dispatch({ type: "SET_DROPOFF", value: addr })}
              onClear={() => dispatch({ type: "CLEAR_DROPOFF" })}
              placeholder={serviceOption?.dropoffPlaceholder ?? "e.g. 47 Princes Street, Edinburgh"}
            />
            <PropertyTypePicker
              value={state.dropoffPropertyType}
              onChange={(t) => dispatch({ type: "SET_DROPOFF_PROPERTY_TYPE", value: t })}
            />
            {isMultiFloorProperty(state.dropoffPropertyType) && (
              <FloorPicker
                label="Drop-off floor"
                floor={state.dropoffFloor}
                hasLift={state.dropoffHasLift}
                onFloor={(n) => dispatch({ type: "SET_DROPOFF_FLOOR", value: n })}
                onLift={(v) => dispatch({ type: "SET_DROPOFF_LIFT", value: v })}
              />
            )}
          </div>
        </section>
      </div>

      {/* ── Route status ── */}
      {!hasRouteInputs ? (
        <div
          className="rounded-2xl px-5 py-4 text-sm"
          style={{ background: "rgba(255,255,255,0.03)", boxShadow: "0 0 0 1px rgba(245,158,11,0.10)" }}
        >
          <p className="font-bold text-white/60">Route pending</p>
          <p className="mt-1 text-white/40">Choose confirmed pickup and drop-off addresses to see mileage and route details.</p>
        </div>
      ) : routeError ? (
        <div
          className="rounded-2xl px-5 py-4 text-sm"
          style={{ background: "rgba(239,68,68,0.08)", boxShadow: "0 0 0 1px rgba(239,68,68,0.25)" }}
          role="alert"
        >
          <p className="font-black text-red-400">Route unavailable</p>
          <p className="mt-1 text-red-300/80">{routeError}</p>
          <button
            type="button"
            onClick={() => setRouteRetryToken((value) => value + 1)}
            className="mt-4 min-h-10 rounded-xl bg-red-500/20 px-4 text-sm font-bold text-red-300 ring-1 ring-red-500/30 transition hover:bg-red-500/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
          >
            Retry route
          </button>
        </div>
      ) : (
        <section
          className="rounded-2xl p-5"
          style={{ background: "rgba(245,158,11,0.06)", boxShadow: "0 0 0 1px rgba(245,158,11,0.20), 0 8px 32px rgba(0,0,0,0.35)" }}
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-black text-white">{route ? "Route confirmed" : "Calculating route"}</h2>
              <p className="mt-0.5 text-sm text-amber-300/80">
                {loadingDistance
                  ? "Calculating distance..."
                  : route
                    ? `${route.distanceMiles.toFixed(1)} miles${route?.durationMinutes ? ` · ~${Math.round(route.durationMinutes)} min drive` : ""}`
                    : "Waiting for route"}
              </p>
            </div>
            {route && (
              <span className="rounded-full bg-amber-500/15 px-3 py-1 text-xs font-bold text-amber-400 ring-1 ring-amber-500/25">
                {route.distanceMiles.toFixed(1)} mi
              </span>
            )}
          </div>
          <details className="group mt-4">
            <summary className="flex min-h-10 cursor-pointer list-none items-center justify-between rounded-xl bg-white/5 px-4 text-sm font-bold text-white/70 ring-1 ring-white/10 transition hover:bg-white/8 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400">
              <span>View route map</span>
              <span className="transition group-open:rotate-180" aria-hidden="true">⌄</span>
            </summary>
            <div className="mt-3 overflow-hidden rounded-xl">
              <RouteMap
                pickup={state.pickup}
                dropoff={state.dropoff}
                routeGeometry={route?.routeGeometry}
                distanceMiles={route?.distanceMiles ?? state.distanceMiles}
                durationMinutes={route?.durationMinutes}
                loading={loadingDistance}
              />
            </div>
          </details>
        </section>
      )}

      {error && (
        <p id="journey-error" role="alert" className="rounded-xl px-4 py-3 text-sm font-medium text-red-300" style={{ background: "rgba(239,68,68,0.10)", boxShadow: "0 0 0 1px rgba(239,68,68,0.20)" }}>
          {error}
        </p>
      )}

      <button
        id="booking-primary-action"
        type="button"
        onClick={handleContinue}
        disabled={loadingDistance || Boolean(routeError) || state.distanceMiles <= 0}
        className="hidden min-h-12 w-full items-center justify-center rounded-xl px-5 text-base font-black text-black shadow-lg transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-booking-background disabled:cursor-not-allowed disabled:opacity-40 lg:flex"
        style={{ background: "linear-gradient(135deg, #F59E0B 0%, #EA580C 100%)" }}
      >
        Continue to {serviceOption?.inventoryTitle.toLowerCase() ?? "items"} →
      </button>
    </section>
  );
}
