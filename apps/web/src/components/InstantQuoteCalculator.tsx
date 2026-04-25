"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { UseMyLocationButton } from "./UseMyLocationButton";
import { haptic } from "@/lib/haptic";

/**
 * Instant quote calculator — lightweight client component.
 * Estimates a price range from postcode + service type + distance bucket.
 * Posts a `quote_estimate` analytics event on each estimate.
 */
type ServiceKey = "man-and-van" | "house-removal" | "office-removal" | "delivery";

const SERVICE_OPTIONS: { key: ServiceKey; label: string; base: number; perMile: number; minHours: number }[] = [
  { key: "man-and-van", label: "Man & Van (single item / small move)", base: 45, perMile: 1.2, minHours: 2 },
  { key: "house-removal", label: "House removal", base: 120, perMile: 1.6, minHours: 3 },
  { key: "office-removal", label: "Office removal", base: 180, perMile: 1.8, minHours: 3 },
  { key: "delivery", label: "Delivery / collection", base: 35, perMile: 1.0, minHours: 1 },
];

const DISTANCE_OPTIONS = [
  { value: 5, label: "Within town (≤5 mi)" },
  { value: 15, label: "Local (5–15 mi)" },
  { value: 35, label: "Regional (15–35 mi)" },
  { value: 75, label: "Long distance (35–75 mi)" },
  { value: 150, label: "Cross-country (75 mi+)" },
];

const UK_POSTCODE_RE = /^([A-Z]{1,2}\d[A-Z\d]?)\s*(\d[A-Z]{2})?$/i;

function track(name: string, payload: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  const w = window as Window & {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  };
  try {
    w.gtag?.("event", name, payload);
  } catch {
    /* ignore */
  }
  try {
    w.dataLayer?.push({ event: name, ...payload });
  } catch {
    /* ignore */
  }
}

export function InstantQuoteCalculator() {
  const [postcode, setPostcode] = useState("");
  const [service, setService] = useState<ServiceKey>("man-and-van");
  const [distance, setDistance] = useState<number>(5);
  const [touched, setTouched] = useState(false);

  const postcodeValid = UK_POSTCODE_RE.test(postcode.trim());
  const showPostcodeError = touched && postcode.length > 0 && !postcodeValid;

  const estimate = useMemo(() => {
    const svc = SERVICE_OPTIONS.find((s) => s.key === service)!;
    const baseCost = svc.base * svc.minHours;
    const distanceCost = Math.max(0, distance - 5) * svc.perMile;
    const subtotal = baseCost + distanceCost;
    const low = Math.round(subtotal);
    const high = Math.round(subtotal * 1.35);
    return { low, high, base: svc.base, label: svc.label };
  }, [service, distance]);

  const handleEstimate = () => {
    setTouched(true);
    if (!postcodeValid) return;
    haptic(10);
    track("quote_estimate", {
      event_category: "engagement",
      service_type: service,
      distance_band: distance,
      postcode_area: postcode.trim().slice(0, 4).toUpperCase(),
      estimate_low: estimate.low,
      estimate_high: estimate.high,
    });
  };

  return (
    <section
      id="instant-quote"
      className="py-16 sm:py-20 bg-slate-50"
      aria-labelledby="instant-quote-heading"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <span className="inline-flex items-center gap-2 rounded-full bg-primary-400/15 px-3 py-1 text-xs font-bold uppercase tracking-wide text-primary-700 ring-1 ring-primary-400/40">
            <span aria-hidden="true">⚡</span> Instant Estimate
          </span>
          <h2
            id="instant-quote-heading"
            className="mt-3 text-2xl sm:text-4xl font-extrabold text-slate-900"
          >
            Get a price in 10 seconds
          </h2>
          <p className="mt-2 text-slate-600 text-sm sm:text-base">
            Just a rough estimate — final price confirmed by call or full quote.
          </p>
        </div>

        <div className="rounded-2xl bg-white shadow-lg ring-1 ring-slate-200 p-5 sm:p-8">
          <div className="grid gap-5 sm:grid-cols-2">
            {/* Postcode */}
            <div className="sm:col-span-2">
              <label htmlFor="iq-postcode" className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5">
                Pickup postcode
              </label>
              <input
                id="iq-postcode"
                type="text"
                inputMode="text"
                autoComplete="postal-code"
                value={postcode}
                onChange={(e) => setPostcode(e.target.value)}
                onBlur={() => setTouched(true)}
                placeholder="e.g. G1 1AA"
                className={`w-full rounded-lg border px-4 py-3 text-base font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-400 ${
                  showPostcodeError ? "border-red-400" : "border-slate-300"
                }`}
                aria-invalid={showPostcodeError ? "true" : "false"}
                aria-describedby={showPostcodeError ? "iq-postcode-error" : undefined}
              />
              <div className="mt-1.5">
                <UseMyLocationButton
                  variant="postcode"
                  onResult={(r) => {
                    if (r.postcode) {
                      setPostcode(r.postcode.toUpperCase());
                      setTouched(true);
                    }
                  }}
                />
              </div>
              {showPostcodeError && (
                <p id="iq-postcode-error" className="mt-1 text-xs text-red-600">
                  Please enter a valid UK postcode.
                </p>
              )}
            </div>

            {/* Service */}
            <div>
              <label htmlFor="iq-service" className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5">
                Service type
              </label>
              <select
                id="iq-service"
                value={service}
                onChange={(e) => setService(e.target.value as ServiceKey)}
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-base font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-400"
              >
                {SERVICE_OPTIONS.map((s) => (
                  <option key={s.key} value={s.key}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Distance */}
            <div>
              <label htmlFor="iq-distance" className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5">
                Distance
              </label>
              <select
                id="iq-distance"
                value={distance}
                onChange={(e) => setDistance(Number(e.target.value))}
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-base font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-400"
              >
                {DISTANCE_OPTIONS.map((d) => (
                  <option key={d.value} value={d.value}>
                    {d.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Estimate result */}
          <div className="mt-6 grid gap-4 sm:grid-cols-[1fr_auto] sm:items-center">
            <div className="rounded-xl bg-slate-900 text-white p-4 sm:p-5">
              <p className="text-xs uppercase tracking-wide text-slate-300 font-semibold">
                Estimated price
              </p>
              <p className="mt-1 text-3xl sm:text-4xl font-extrabold text-primary-400">
                £{estimate.low}
                <span className="text-slate-300 text-lg font-bold"> – </span>
                <span className="text-white">£{estimate.high}</span>
              </p>
              <p className="mt-1 text-xs text-slate-400">
                {estimate.label} · from £{estimate.base}/hr · final price on call
              </p>
            </div>
            <div className="flex flex-col gap-2 sm:items-end">
              <button
                type="button"
                onClick={handleEstimate}
                data-track-event="quote_estimate_click"
                data-track-location="calculator"
                className="cta-pulse inline-flex items-center justify-center gap-2 rounded-lg bg-primary-400 px-6 py-3 font-extrabold text-slate-900 shadow-md hover:bg-primary-500 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2"
              >
                Update estimate
              </button>
              <Link
                href="/book"
                data-track-event="quote_click"
                data-track-location="calculator"
                className="text-sm font-semibold text-slate-700 hover:text-slate-900 underline underline-offset-2"
              >
                Continue to full booking →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
