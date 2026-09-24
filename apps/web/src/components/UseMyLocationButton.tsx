"use client";

import { useState } from "react";
import { getLocationUnavailableMessage } from "@/lib/api-base";
import { reverseGeocode, type GeocodeResult } from "@/lib/geocode-client";
import { haptic } from "@/lib/haptic";

interface Props {
  onResult: (r: GeocodeResult) => void;
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
  const unavailableMessage = getLocationUnavailableMessage();

  function detect() {
    if (busy) return;
    const blockedReason = getLocationUnavailableMessage();
    if (blockedReason) {
      setError(blockedReason);
      return;
    }
    setError("");
    setBusy(true);
    haptic(10);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const result = await reverseGeocode(pos.coords.latitude, pos.coords.longitude);
          onResult(result);
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
          setError("Location access was denied. Allow location for this site, then try again.");
        } else if (err.code === err.TIMEOUT) {
          setError("Location lookup timed out. Please try again or type your postcode.");
        } else {
          setError("Could not get your location. Please type your postcode.");
        }
      },
      { enableHighAccuracy: true, timeout: 15_000, maximumAge: 60_000 }
    );
  }

  return (
    <div className="inline-flex flex-col items-start">
      <button
        type="button"
        onClick={detect}
        disabled={busy || Boolean(unavailableMessage)}
        aria-busy={busy}
        data-track-event="use_my_location_click"
        data-track-location={variant}
        className={
          className ||
          "inline-flex items-center gap-1.5 text-xs font-semibold text-amber-600 hover:text-amber-800 disabled:opacity-50 transition-colors"
        }
      >
        <span aria-hidden="true">{busy ? "⏳" : "📍"}</span>
        {label ?? (variant === "address" ? "Use my current location" : "Use my postcode")}
      </button>
      {(error || unavailableMessage) && (
        <p className="mt-1 text-[11px] text-red-600" role="alert">
          {error || unavailableMessage}
        </p>
      )}
    </div>
  );
}
