"use client";

import { useEffect, useState } from "react";

const API_BASE =
  process.env.NODE_ENV === "development"
    ? "http://localhost:4000"
    : (process.env["NEXT_PUBLIC_API_URL"] ?? "https://api.speedyvan.uk");

interface Forecast {
  available: boolean;
  condition: "clear" | "rain" | "heavy_rain" | "snow" | "storm" | null;
  description: string | null;
  iconUrl: string | null;
}

interface Props {
  lat?: number;
  lng?: number;
}

const STYLE: Record<string, { bg: string; ring: string; text: string; emoji: string; tip: string }> = {
  rain:        { bg: "rgba(245,158,11,0.12)",  ring: "rgba(245,158,11,0.25)",  text: "text-amber-300",  emoji: "🌧️", tip: "We'll bring covers — small weather surcharge applies." },
  heavy_rain:  { bg: "rgba(234,88,12,0.16)",   ring: "rgba(234,88,12,0.32)",   text: "text-orange-200", emoji: "⛈️", tip: "Heavy rain expected — small weather surcharge applied to keep things dry." },
  snow:        { bg: "rgba(255,255,255,0.10)",  ring: "rgba(255,255,255,0.22)",  text: "text-white",      emoji: "❄️", tip: "Snow forecast — extra time and care included." },
  storm:       { bg: "rgba(239,68,68,0.12)",   ring: "rgba(239,68,68,0.25)",   text: "text-red-300",    emoji: "🌩️", tip: "Storms forecast — booking will be reviewed for safety on the day." },
};

/**
 * Friendly weather warning chip. Hides itself when no API key is configured
 * server-side or when the day is clear.
 */
export function WeatherChip({ lat, lng }: Props) {
  const [data, setData] = useState<Forecast | null>(null);

  useEffect(() => {
    if (typeof lat !== "number" || typeof lng !== "number") return;
    const ctrl = new AbortController();
    fetch(`${API_BASE}/weather/forecast?lat=${lat}&lng=${lng}`, { signal: ctrl.signal, cache: "no-store" })
      .then((r) => r.json())
      .then((j) => {
        if (j?.success) setData(j.data as Forecast);
      })
      .catch(() => undefined);
    return () => ctrl.abort();
  }, [lat, lng]);

  if (!data?.available || !data.condition || data.condition === "clear") return null;
  const style = STYLE[data.condition];
  if (!style) return null;

  return (
    <div
      className={`inline-flex items-start gap-2 rounded-xl ${style.text} px-3 py-2 text-xs font-medium`}
      style={{ background: style.bg, boxShadow: `0 0 0 1px ${style.ring}` }}
      role="status"
    >
      <span aria-hidden="true" className="text-base leading-none">{style.emoji}</span>
      <div>
        <p className="font-semibold capitalize">{data.description ?? data.condition}</p>
        <p className="opacity-80">{style.tip}</p>
      </div>
    </div>
  );
}
