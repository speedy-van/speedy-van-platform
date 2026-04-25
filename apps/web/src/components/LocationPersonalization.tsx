"use client";

import { useEffect, useState } from "react";

/**
 * Smart geo-personalization banner.
 * - Tries to map browser timezone to a Scottish city.
 * - Optionally uses geolocation if user grants it.
 * - Shows a small dismissible banner with localized phrasing.
 * Fully optional and dismissible, no UI shift.
 */
const TZ_CITY_MAP: Record<string, string> = {
  "Europe/London": "Scotland",
};

// Lat/lng of major Scottish cities for nearest-match if geolocation granted.
const CITIES: { name: string; lat: number; lng: number; slug: string }[] = [
  { name: "Glasgow", lat: 55.8642, lng: -4.2518, slug: "glasgow" },
  { name: "Edinburgh", lat: 55.9533, lng: -3.1883, slug: "edinburgh" },
  { name: "Dundee", lat: 56.462, lng: -2.9707, slug: "dundee" },
  { name: "Aberdeen", lat: 57.1497, lng: -2.0943, slug: "aberdeen" },
  { name: "Stirling", lat: 56.1165, lng: -3.9369, slug: "stirling" },
  { name: "Inverness", lat: 57.4778, lng: -4.2247, slug: "inverness" },
  { name: "Perth", lat: 56.3964, lng: -3.4378, slug: "perth" },
  { name: "Paisley", lat: 55.8456, lng: -4.4239, slug: "paisley" },
];

function distanceKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const toRad = (v: number) => (v * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const x =
    Math.sin(dLat / 2) ** 2 +
    Math.sin(dLng / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);
  return 2 * R * Math.asin(Math.sqrt(x));
}

function track(name: string, payload: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  const w = window as Window & {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  };
  try {
    w.gtag?.("event", name, { event_category: "personalization", ...payload });
  } catch {
    /* ignore */
  }
  try {
    w.dataLayer?.push({ event: name, ...payload });
  } catch {
    /* ignore */
  }
}

export function LocationPersonalization() {
  const [location, setLocation] = useState<string | null>(null);
  const [slug, setSlug] = useState<string | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      if (sessionStorage.getItem("sv_personalization_dismissed") === "1") {
        setDismissed(true);
        return;
      }
    } catch {
      /* ignore */
    }

    // First pass: timezone-based fallback
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const fallback = TZ_CITY_MAP[tz];
      if (fallback) setLocation(fallback);
    } catch {
      /* ignore */
    }

    // Second pass: precise geolocation if granted (no prompt — only if already allowed)
    if ("permissions" in navigator && navigator.geolocation) {
      navigator.permissions
        .query({ name: "geolocation" as PermissionName })
        .then((status) => {
          if (status.state !== "granted") return;
          navigator.geolocation.getCurrentPosition(
            (pos) => {
              const here = { lat: pos.coords.latitude, lng: pos.coords.longitude };
              const nearest = CITIES.reduce((best, c) =>
                distanceKm(here, c) < distanceKm(here, best) ? c : best,
              );
              setLocation(nearest.name);
              setSlug(nearest.slug);
              track("personalization_match", { city: nearest.name });
            },
            () => undefined,
            { maximumAge: 60_000, timeout: 4000 },
          );
        })
        .catch(() => undefined);
    }
  }, []);

  if (dismissed || !location) return null;

  const title =
    slug && location !== "Scotland"
      ? `Serving ${location} today — same-day slots available`
      : `Serving ${location} — same-day slots available`;
  const href = slug ? `/areas/${slug}` : "/book";

  return (
    <div
      className="bg-slate-900 text-white"
      role="status"
      aria-live="polite"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-center gap-3">
        <span aria-hidden="true" className="text-base">📍</span>
        <p className="flex-1 text-xs sm:text-sm font-medium truncate">
          {title}
        </p>
        <a
          href={href}
          data-track-event="personalization_click"
          data-track-location="top_banner"
          onClick={() => track("personalization_click", { destination: href })}
          className="text-xs sm:text-sm font-bold text-primary-400 hover:text-primary-300 underline underline-offset-2 whitespace-nowrap"
        >
          See local pricing
        </a>
        <button
          type="button"
          onClick={() => {
            setDismissed(true);
            try {
              sessionStorage.setItem("sv_personalization_dismissed", "1");
            } catch {
              /* ignore */
            }
          }}
          aria-label="Dismiss banner"
          className="inline-flex h-6 w-6 items-center justify-center rounded-full text-slate-400 hover:bg-white/10 hover:text-white"
        >
          <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M4.5 4.5a1 1 0 011.4 0L10 8.6l4.1-4.1a1 1 0 111.4 1.4L11.4 10l4.1 4.1a1 1 0 01-1.4 1.4L10 11.4l-4.1 4.1a1 1 0 01-1.4-1.4L8.6 10 4.5 5.9a1 1 0 010-1.4z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  );
}
