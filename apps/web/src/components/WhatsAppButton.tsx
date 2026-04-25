"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { haptic } from "@/lib/haptic";

const WA_SHORT_LINK = "https://wa.me/message/J6EO772GDPHFO1";
const DEFAULT_MESSAGE = "Hi SpeedyVan, I'd like a quote for a move.";

interface BookingDraft {
  serviceName?: string;
  pickup?: { postcode?: string; address?: string };
  dropoff?: { postcode?: string; address?: string };
  selectedDate?: string;
  clientTotal?: number;
}

function buildContextualMessage(pathname: string | null): string {
  // Pull live booking draft if present
  let draft: BookingDraft | null = null;
  if (typeof window !== "undefined") {
    try {
      const raw = localStorage.getItem("sv_booking_draft_v1");
      if (raw) {
        const parsed = JSON.parse(raw);
        draft = parsed.state ?? null;
      }
    } catch {
      /* ignore */
    }
  }

  const lines: string[] = ["Hi SpeedyVan,"];

  if (pathname?.startsWith("/book") && draft) {
    lines.push("I'm in the middle of a quote and have a quick question:");
    if (draft.serviceName) lines.push(`• Service: ${draft.serviceName}`);
    if (draft.pickup?.postcode) lines.push(`• Pickup: ${draft.pickup.postcode}`);
    if (draft.dropoff?.postcode) lines.push(`• Dropoff: ${draft.dropoff.postcode}`);
    if (draft.selectedDate) lines.push(`• Date: ${draft.selectedDate}`);
    if (draft.clientTotal) lines.push(`• Quoted: £${draft.clientTotal.toFixed(2)}`);
  } else if (pathname?.startsWith("/track")) {
    lines.push("I'd like an update on my booking, please.");
  } else if (pathname?.startsWith("/areas/")) {
    const slug = pathname.split("/").pop() ?? "";
    lines.push(`I'd like a quote for a move in ${slug.replace(/-/g, " ")}.`);
  } else if (pathname?.startsWith("/services/")) {
    const slug = pathname.split("/").pop() ?? "";
    lines.push(`I'd like a quote for ${slug.replace(/-/g, " ")}.`);
  } else {
    lines.push(DEFAULT_MESSAGE);
  }

  return lines.join("\n");
}

function track(name: string) {
  if (typeof window === "undefined") return;
  const w = window as Window & {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  };
  try {
    w.gtag?.("event", name, { event_category: "engagement", channel: "whatsapp" });
  } catch {
    /* ignore */
  }
  try {
    w.dataLayer?.push({ event: name, channel: "whatsapp" });
  } catch {
    /* ignore */
  }
}

/**
 * Floating WhatsApp chat button.
 * Sits bottom-right, lifted on mobile to clear the sticky book bar.
 */
export function WhatsAppButton() {
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const t = window.setTimeout(() => setMounted(true), 1200);
    return () => window.clearTimeout(t);
  }, []);

  // wa.me/message/<code> short links open with the business's pre-set message
  // and don't accept a ?text= override, so we link to the short link directly.
  // The contextual message is still computed for analytics/clipboard fallbacks.
  const contextualMessage = buildContextualMessage(pathname);
  const href = WA_SHORT_LINK;
  void contextualMessage;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => {
        haptic(10);
        track("whatsapp_click");
      }}
      data-track-event="whatsapp_click"
      data-track-location="floating_button"
      aria-label="Chat with us on WhatsApp"
      className={`fixed right-4 z-30 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-xl ring-4 ring-white/40 transition-all duration-500 hover:scale-105 hover:bg-[#1DA851] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2 bottom-24 md:bottom-6 ${
        mounted ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
      }`}
    >
      <svg
        viewBox="0 0 32 32"
        className="h-7 w-7"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M19.11 17.27c-.27-.13-1.6-.79-1.85-.88-.25-.09-.43-.13-.61.13-.18.27-.7.88-.86 1.06-.16.18-.32.2-.59.07-.27-.13-1.13-.42-2.16-1.33-.8-.71-1.34-1.59-1.5-1.86-.16-.27-.02-.42.12-.55.12-.12.27-.32.4-.48.13-.16.18-.27.27-.45.09-.18.05-.34-.02-.48-.07-.13-.61-1.47-.83-2.01-.22-.53-.45-.46-.61-.47h-.52c-.18 0-.48.07-.73.34-.25.27-.96.94-.96 2.29 0 1.35.98 2.66 1.12 2.84.13.18 1.93 2.95 4.68 4.13.65.28 1.16.45 1.56.58.65.21 1.25.18 1.72.11.52-.08 1.6-.65 1.83-1.28.23-.63.23-1.17.16-1.28-.07-.11-.25-.18-.52-.31zM16.04 5.33c-5.91 0-10.71 4.8-10.71 10.71 0 1.89.5 3.74 1.45 5.37l-1.54 5.62 5.76-1.51c1.57.86 3.34 1.31 5.05 1.31 5.91 0 10.71-4.8 10.71-10.71S21.95 5.33 16.04 5.33zm0 19.6c-1.55 0-3.07-.42-4.4-1.21l-.31-.18-3.27.86.87-3.19-.2-.32a8.91 8.91 0 01-1.36-4.74c0-4.93 4.01-8.94 8.94-8.94 4.93 0 8.94 4.01 8.94 8.94 0 4.93-4.01 8.94-8.94 8.94z" />
      </svg>
      <span className="absolute -top-1 -right-1 flex h-3 w-3">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
        <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-white" />
      </span>
    </a>
  );
}
