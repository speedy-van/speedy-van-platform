"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const STORAGE_KEY = "sv_booking_draft_v1";
const DISMISSED_KEY = "sv_resume_nudge_dismissed_at";
const DISMISS_TTL_MS = 6 * 60 * 60 * 1000; // 6h

interface DraftEnvelope {
  savedAt: number;
  state: {
    serviceName?: string;
    pickup?: { postcode?: string };
    dropoff?: { postcode?: string };
    clientTotal?: number;
    step?: number;
  };
}

/**
 * Bottom-right nudge that appears on the landing page if the customer has an
 * unfinished booking draft (<24h old). One-tap to resume; dismissible.
 */
export function BookingResumeNudge() {
  const pathname = usePathname();
  const [draft, setDraft] = useState<DraftEnvelope | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    // Don't appear on the booking flow itself or admin/driver/track pages.
    if (
      !pathname ||
      pathname.startsWith("/book") ||
      pathname.startsWith("/admin") ||
      pathname.startsWith("/driver") ||
      pathname.startsWith("/track")
    ) {
      return;
    }

    try {
      const dismissedRaw = localStorage.getItem(DISMISSED_KEY);
      if (dismissedRaw) {
        const dismissedAt = Number(dismissedRaw);
        if (Number.isFinite(dismissedAt) && Date.now() - dismissedAt < DISMISS_TTL_MS) {
          return;
        }
      }
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as DraftEnvelope;
      // Only nudge if there's something meaningful captured.
      if (!parsed?.state?.serviceName && !parsed?.state?.pickup?.postcode) return;
      setDraft(parsed);
      const t = window.setTimeout(() => setVisible(true), 1500);
      return () => window.clearTimeout(t);
    } catch {
      /* ignore */
    }
  }, [pathname]);

  function dismiss() {
    try {
      localStorage.setItem(DISMISSED_KEY, String(Date.now()));
    } catch {
      /* ignore */
    }
    setVisible(false);
  }

  if (!draft || !visible) return null;
  const total = draft.state.clientTotal;
  const service = draft.state.serviceName ?? "your move";
  const pc = draft.state.pickup?.postcode;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed left-4 right-4 sm:left-auto sm:right-6 bottom-24 sm:bottom-6 z-40 max-w-sm rounded-2xl bg-white shadow-2xl border border-slate-200 p-4 animate-in slide-in-from-bottom duration-300"
    >
      <button
        type="button"
        onClick={dismiss}
        aria-label="Dismiss"
        className="absolute top-2 right-2 h-7 w-7 rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700"
      >
        ×
      </button>
      <div className="flex items-start gap-3">
        <span className="text-2xl" aria-hidden>
          👋
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-slate-900">Welcome back!</p>
          <p className="text-xs text-slate-600 mt-0.5">
            Pick up where you left off — {service}
            {pc ? ` from ${pc}` : ""}
            {typeof total === "number" && total > 0 ? ` · £${total.toFixed(2)}` : ""}
          </p>
          <Link
            href="/book"
            onClick={() => setVisible(false)}
            className="mt-3 inline-flex items-center justify-center rounded-lg bg-yellow-400 px-3 py-1.5 text-xs font-bold text-slate-900 hover:bg-yellow-300 focus:outline-none focus:ring-2 focus:ring-yellow-500"
          >
            Resume booking →
          </Link>
        </div>
      </div>
    </div>
  );
}
