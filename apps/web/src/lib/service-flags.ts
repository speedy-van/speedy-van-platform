"use client";

import { useEffect, useState } from "react";

export type ServiceFlagSlug = "rubbish-removal" | "same-day-delivery";
export type ServiceFlagMode = "popup" | null;

export interface ServiceFlag {
  slug: ServiceFlagSlug;
  enabled: boolean;
  mode: ServiceFlagMode;
}

const API_BASE =
  process.env.NODE_ENV === "development"
    ? "http://localhost:4000"
    : (process.env.NEXT_PUBLIC_API_URL ?? "https://api.speedyvan.uk");

const DEFAULT_FLAGS: ServiceFlag[] = [
  { slug: "rubbish-removal", enabled: true, mode: null },
  { slug: "same-day-delivery", enabled: true, mode: "popup" },
];

interface ApiEnvelope {
  success: boolean;
  data?: { items?: ServiceFlag[] };
}

/**
 * Fetches the public service-flags list.
 * Falls back to "all enabled" so a backend hiccup never breaks booking.
 */
export function useServiceFlags(): {
  flags: Map<ServiceFlagSlug, ServiceFlag>;
  ready: boolean;
} {
  const [flags, setFlags] = useState<ServiceFlag[]>(DEFAULT_FLAGS);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/service-flags`, { cache: "no-store" });
        if (!res.ok) throw new Error(String(res.status));
        const body = (await res.json()) as ApiEnvelope;
        if (!cancelled && body.success && body.data?.items?.length) {
          setFlags(body.data.items);
        }
      } catch {
        /* keep defaults */
      } finally {
        if (!cancelled) setReady(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const map = new Map<ServiceFlagSlug, ServiceFlag>();
  for (const f of flags) map.set(f.slug, f);
  return { flags: map, ready };
}
