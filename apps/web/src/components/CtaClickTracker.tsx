"use client";

import { useEffect } from "react";
import { trackAnalyticsEvent, trackMetaEvent } from "@/lib/analytics";

/** Contact clicks express interest; they do not establish a qualified lead. */
export function CtaClickTracker() {
  useEffect(() => {
    const handler = (event: MouseEvent) => {
      if (!(event.target instanceof Element)) return;
      const element = event.target.closest<HTMLElement>("[data-track-event]");
      const eventName = element?.dataset.trackEvent;
      if (!element || !eventName) return;

      const payload = {
        event_category: "engagement",
        event_label: element.dataset.trackLabel || element.getAttribute("aria-label") || element.textContent?.trim().slice(0, 80) || "",
        cta_location: element.dataset.trackLocation || "",
        area_slug: element.dataset.trackArea || "",
        service_slug: element.dataset.trackService || "",
        destination: (element.getAttribute("href") || element.dataset.trackDestination || "").split(/[?#]/)[0],
      };

      trackAnalyticsEvent(eventName, payload);
      if (eventName === "call_click" || eventName === "quote_click") {
        trackMetaEvent(eventName, payload, true);
      }
    };

    document.addEventListener("click", handler, { capture: true });
    return () => document.removeEventListener("click", handler, { capture: true });
  }, []);

  return null;
}
