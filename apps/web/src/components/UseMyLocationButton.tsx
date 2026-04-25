"use client";

import { useState } from "react";
import { haptic } from "@/lib/haptic";

const API_BASE =
  process.env.NODE_ENV === "development"
    ? "http://localhost:4000"
    : (process.env["NEXT_PUBLIC_API_URL"] ?? "https://api.speedyvan.uk");

interface ReverseResult {
  address: string;
  postcode: string;
  lat: number;
  lng: number;
}

interface Props {
  onResult: (r: ReverseResult) => void;
  /** What to fill — "postcode" replaces only postcode; "address" replaces full address. */
  variant?: "postcode" | "address";
  className?: string;
  label?: string;
}

/**
 * "Use my location" button. Falls back gracefully when geolocation or reverse
 * geocoding is unavailable.
 */
export function UseMyLocationButton({
  onResult,
  variant = "postcode",
  className = "",
  label,
}: Props) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  if (typeof window !== "undefined" && !("geolocation" in navigator)) {
    return null;
  }

  function detect() {
    if (busy) return;
    setError("");
    setBusy(true);
    haptic(10);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const res = await fetch(
            `${API_BASE}/geocode/reverse?lat=${pos.coords.latitude}&lng=${pos.coords.longitude}`,
            { cache: "no-store" }
          );
          const json = await res.json();
          if (!res.ok || !json.success) {
            throw new Error(json.error ?? "Could not find your address");
          }
          onResult(json.data as ReverseResult);
          haptic(20);
        } catch (err) {
          setError(err instanceof Error ? err.message : "Could not find your address");
        } finally {
          setBusy(false);
        }
      },
      (err) => {
        setBusy(false);
        if (err.code === err.PERMISSION_DENIED) {
          setError("Location access denied");
        } else {
          setError("Could not get your location");
        }
      },
      { enableHighAccuracy: true, timeout: 10_000, maximumAge: 60_000 }
    );
  }

  return (
    <div className="inline-flex flex-col items-start">
      <button
        type="button"
        onClick={detect}
        disabled={busy}
        aria-busy={busy}
        data-track-event="use_my_location_click"
        data-track-location={variant}
        className={
          className ||
          "inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-800 disabled:opacity-50 transition-colors"
        }
      >
        <span aria-hidden="true">{busy ? "⏳" : "📍"}</span>
        {label ?? (variant === "address" ? "Use my current location" : "Use my postcode")}
      </button>
      {error && (
        <p className="mt-1 text-[11px] text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
