"use client";

import { useEffect, useState } from "react";

/**
 * Small dynamic urgency line under the hero CTA.
 * Rotates a small pool of plausible "right now" copy lines.
 * Pure client-side; numbers seeded by minute-of-day so it feels live but stable.
 */
const POOL = [
  (n: number) => `${n} vans available right now`,
  (n: number) => `${n} advisors free · answer in <1 min`,
  (n: number) => `${n} bookings in the last hour`,
  (_: number) => `Same-day slots open today`,
];

function seededVanCount(): number {
  if (typeof window === "undefined") return 3;
  // Pseudo-random, stable per minute, between 2 and 7
  const m = Math.floor(Date.now() / 60_000);
  return 2 + (m % 6);
}

export function LiveAvailability() {
  const [idx, setIdx] = useState(0);
  const [n, setN] = useState(3);

  useEffect(() => {
    setN(seededVanCount());
    const id = window.setInterval(() => {
      setIdx((i) => (i + 1) % POOL.length);
      setN(seededVanCount());
    }, 4500);
    return () => window.clearInterval(id);
  }, []);

  const line = POOL[idx]?.(n) ?? "";

  return (
    <div
      className="hero-fade-up hero-fade-up-5 mt-3 inline-flex items-center gap-2 text-xs sm:text-sm text-slate-300"
      role="status"
      aria-live="polite"
    >
      <span className="relative flex h-2 w-2" aria-hidden="true">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
      </span>
      <span className="font-medium">{line}</span>
    </div>
  );
}
