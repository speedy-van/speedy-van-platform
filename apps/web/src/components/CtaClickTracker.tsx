"use client";

import { useEffect } from "react";

type WindowWithAnalytics = Window & {
  gtag?: (...args: unknown[]) => void;
  fbq?: (...args: unknown[]) => void;
  dataLayer?: unknown[];
};

/**
 * Listens for clicks on any element marked with `data-track-event="..."`
 * and forwards the event to GA4 (gtag), Meta Pixel (fbq), and dataLayer.
 *
 * Currently used for:
 *  - data-track-event="call_click"   (Call Now CTAs)
 *  - data-track-event="quote_click"  (Get Instant Quote CTAs)
 */
export function CtaClickTracker() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const el = target.closest<HTMLElement>("[data-track-event]");
      if (!el) return;

      const eventName = el.dataset.trackEvent;
      if (!eventName) return;

      const label =
        el.dataset.trackLabel ||
        el.getAttribute("aria-label") ||
        el.textContent?.trim().slice(0, 80) ||
        "";
      const location = el.dataset.trackLocation || "";
      const destination =
        el.getAttribute("href") || el.dataset.trackDestination || "";

      const payload: Record<string, unknown> = {
        event_category: "engagement",
        event_label: label,
        cta_location: location,
        destination,
      };

      const w = window as WindowWithAnalytics;

      try {
        w.gtag?.("event", eventName, payload);
      } catch {
        /* ignore */
      }

      try {
        w.dataLayer?.push({ event: eventName, ...payload });
      } catch {
        /* ignore */
      }

      try {
        if (eventName === "call_click" || eventName === "quote_click") {
          w.fbq?.("track", "Lead", { content_name: eventName, ...payload });
        }
      } catch {
        /* ignore */
      }
    };

    document.addEventListener("click", handler, { capture: true });
    return () => document.removeEventListener("click", handler, { capture: true });
  }, []);

  return null;
}
