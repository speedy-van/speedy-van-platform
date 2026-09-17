"use client";

import { useEffect, useState } from "react";

/**
 * Small helper line under the hero CTA.
 * Rotates practical quote guidance without implying live capacity data.
 */
const POOL = [
  "Photos help us quote bulky items accurately",
  "Access and parking details checked before dispatch",
  "Same-day enquiries reviewed when capacity allows",
  "Call for complex, long-distance, or multi-stop moves",
];

export function LiveAvailability() {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setIdx((i) => (i + 1) % POOL.length);
    }, 4500);
    return () => window.clearInterval(id);
  }, []);

  const line = POOL[idx] ?? "";

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
