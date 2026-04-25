"use client";

import { useState } from "react";
import Link from "next/link";
import { haptic } from "@/lib/haptic";

const WA_SHORT_LINK = "https://wa.me/message/J6EO772GDPHFO1";

interface WhatsAppPhotoQuoteButtonProps {
  serviceName?: string;
  className?: string;
}

function track(service?: string) {
  if (typeof window === "undefined") return;
  const w = window as Window & {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  };
  try {
    w.gtag?.("event", "whatsapp_photo_quote_click", {
      event_category: "engagement",
      channel: "whatsapp",
      service: service ?? "unknown",
    });
  } catch {
    /* ignore */
  }
  try {
    w.dataLayer?.push({ event: "whatsapp_photo_quote_click", service });
  } catch {
    /* ignore */
  }
}

/**
 * A dedicated "📷 Get a photo quote on WhatsApp" button with a brief
 * instruction to send photos of their items + postcodes. Works alongside
 * (not replacing) the floating WhatsAppButton.
 */
export function WhatsAppPhotoQuoteButton({
  serviceName,
  className = "",
}: WhatsAppPhotoQuoteButtonProps) {
  const [copied, setCopied] = useState(false);

  const template = [
    "Hi SpeedyVan! 👋",
    "",
    `I'd like a photo quote${serviceName ? ` for ${serviceName}` : ""}.`,
    "",
    "📸 Please see attached photos of my items.",
    "📍 Collection postcode: ",
    "📍 Delivery postcode: ",
    "📅 Preferred date: ",
    "",
    "Thanks!",
  ].join("\n");

  async function handleClick() {
    haptic(10);
    track(serviceName);
    // Try to copy the template to clipboard so the user can paste it
    try {
      await navigator.clipboard.writeText(template);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 3000);
    } catch {
      // Clipboard not available — user can still type manually in WhatsApp
    }
  }

  return (
    <div className={`rounded-xl bg-[#d8f5e1] border border-[#a7e6c0] p-3 ${className}`}>
      <p className="text-xs text-[#1a5c31] font-medium mb-2.5 leading-snug">
        <span aria-hidden="true">📷</span>{" "}
        <strong>Photo quote:</strong> Open WhatsApp → send photos of your items + postcodes for a custom price in minutes.
      </p>
      <a
        href={WA_SHORT_LINK}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleClick}
        className="inline-flex items-center gap-2 rounded-lg bg-[#25D366] px-4 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-[#1ebe5d] transition-colors focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:ring-offset-2 w-full justify-center"
      >
        {/* WhatsApp SVG icon */}
        <svg
          className="w-5 h-5 shrink-0"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
          <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.122 1.526 5.854L.057 23.882l6.156-1.614A11.946 11.946 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.894a9.875 9.875 0 0 1-5.028-1.371l-.359-.212-3.733.977.998-3.644-.234-.374A9.868 9.868 0 0 1 2.1 12C2.1 6.537 6.537 2.1 12 2.1S21.9 6.537 21.9 12 17.463 21.9 12 21.9z" />
        </svg>
        {copied ? "Template copied! Opening WhatsApp…" : "Get a photo quote on WhatsApp"}
      </a>
    </div>
  );
}
