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

const STYLE: Record<string, { bg: string; text: string; emoji: string; tip: string }> = {
  rain:        { bg: "bg-blue-50",  text: "text-blue-800",  emoji: "🌧️", tip: "We'll bring covers — small weather surcharge applies." },
  heavy_rain:  { bg: "bg-blue-100", text: "text-blue-900",  emoji: "⛈️", tip: "Heavy rain expected — small weather surcharge applied to keep things dry." },
  snow:        { bg: "bg-cyan-50",  text: "text-cyan-800",  emoji: "❄️", tip: "Snow forecast — extra time and care included." },
  storm:       { bg: "bg-amber-50", text: "text-amber-800", emoji: "🌩️", tip: "Storms forecast — booking will be reviewed for safety on the day." },
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
      className={`inline-flex items-start gap-2 rounded-xl ${style.bg} ${style.text} px-3 py-2 text-xs font-medium`}
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
