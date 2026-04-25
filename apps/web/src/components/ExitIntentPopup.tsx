"use client";

import { useEffect, useState, FormEvent } from "react";
import Link from "next/link";

const SEEN_KEY = "sv_exit_intent_seen";
const LOCK_KEY = "sv_quote_locked";
const PHONE_HREF = "tel:01202129746";

interface LockedQuote {
  email: string;
  expiresAt: number;
}

function track(name: string, payload: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  const w = window as Window & {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  };
  try {
    w.gtag?.("event", name, { event_category: "engagement", ...payload });
  } catch {
    /* ignore */
  }
  try {
    w.dataLayer?.push({ event: name, ...payload });
  } catch {
    /* ignore */
  }
}

/**
 * Exit-intent popup with a real offer:
 * "Lock today's price for 24 hours" — captures email locally so the user can
 * resume later at the same indicative price.
 *
 * Triggers on:
 *  - Desktop: pointer leaves the top of the viewport
 *  - Mobile: 25 s of inactivity
 * Shown once per session.
 */
export function ExitIntentPopup() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      if (sessionStorage.getItem(SEEN_KEY) === "1") return;
      // If the user already locked a (non-expired) price this session, don't nag
      const raw = localStorage.getItem(LOCK_KEY);
      if (raw) {
        try {
          const parsed = JSON.parse(raw) as LockedQuote;
          if (parsed?.expiresAt && parsed.expiresAt > Date.now()) return;
        } catch {
          /* ignore parse errors */
        }
      }
    } catch {
      /* ignore */
    }

    let triggered = false;
    const trigger = (source: string) => {
      if (triggered) return;
      triggered = true;
      try {
        sessionStorage.setItem(SEEN_KEY, "1");
      } catch {
        /* ignore */
      }
      setOpen(true);
      track("exit_intent_shown", { source });
    };

    const onMouseOut = (e: MouseEvent) => {
      if (e.clientY <= 0 && !e.relatedTarget) trigger("desktop_top");
    };

    let idleTimer: number | undefined;
    const resetIdle = () => {
      if (idleTimer) window.clearTimeout(idleTimer);
      idleTimer = window.setTimeout(() => trigger("mobile_idle"), 25_000);
    };

    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    if (isTouch) {
      resetIdle();
      window.addEventListener("scroll", resetIdle, { passive: true });
      window.addEventListener("touchstart", resetIdle, { passive: true });
    } else {
      document.addEventListener("mouseout", onMouseOut);
    }

    return () => {
      document.removeEventListener("mouseout", onMouseOut);
      window.removeEventListener("scroll", resetIdle);
      window.removeEventListener("touchstart", resetIdle);
      if (idleTimer) window.clearTimeout(idleTimer);
    };
  }, []);

  if (!open) return null;

  const close = (reason: string) => {
    setOpen(false);
    track("exit_intent_close", { reason });
  };

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    const value = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return setError("Please enter a valid email address.");
    }
    try {
      const payload: LockedQuote = {
        email: value,
        expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
      };
      localStorage.setItem(LOCK_KEY, JSON.stringify(payload));
      // Reuse existing key so other components (BookingDetectionPopup) can read it
      localStorage.setItem("sv-customer-email", value);
    } catch {
      /* ignore storage errors */
    }
    setSubmitted(true);
    track("exit_intent_email_captured", { offer: "lock_price_24h" });
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/70 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="exit-intent-title"
      onClick={() => close("backdrop")}
    >
      <div
        className="relative w-full max-w-md rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={() => close("close_button")}
          aria-label="Close offer"
          className="absolute top-3 right-3 inline-flex h-9 w-9 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700"
        >
          <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M4.5 4.5a1 1 0 011.4 0L10 8.6l4.1-4.1a1 1 0 111.4 1.4L11.4 10l4.1 4.1a1 1 0 01-1.4 1.4L10 11.4l-4.1 4.1a1 1 0 01-1.4-1.4L8.6 10 4.5 5.9a1 1 0 010-1.4z" clipRule="evenodd" />
          </svg>
        </button>

        {!submitted ? (
          <div className="px-6 pt-8 pb-6 text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-400/15 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-primary-700 ring-1 ring-primary-400/40">
              <span aria-hidden="true">🔒</span> Limited offer
            </span>
            <h2 id="exit-intent-title" className="mt-3 text-2xl font-extrabold text-slate-900">
              Lock today&apos;s price for 24 hours
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Prices change daily based on demand. Drop your email and we&apos;ll
              hold today&apos;s rate for your move — no obligation, no spam.
            </p>

            <form onSubmit={onSubmit} className="mt-5 space-y-2.5" noValidate>
              <input
                type="email"
                inputMode="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent"
              />
              {error && <p className="text-xs text-red-600 text-left">{error}</p>}
              <button
                type="submit"
                className="cta-pulse inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary-400 px-6 py-3 text-base font-extrabold text-slate-900 shadow-md hover:bg-primary-500 transition-colors"
              >
                Lock my price for 24 hrs
              </button>
            </form>

            <div className="mt-3 flex items-center gap-2">
              <span className="h-px flex-1 bg-slate-200" aria-hidden="true" />
              <span className="text-[11px] text-slate-400 uppercase tracking-wider">or</span>
              <span className="h-px flex-1 bg-slate-200" aria-hidden="true" />
            </div>

            <a
              href={PHONE_HREF}
              data-track-event="call_click"
              data-track-location="exit_intent"
              onClick={() => track("exit_intent_cta", { cta: "call" })}
              className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Call now · 01202 129746
            </a>

            <p className="mt-3 text-[11px] text-slate-400">
              We only use your email to send your locked-price quote. No marketing.
            </p>
          </div>
        ) : (
          <div className="px-6 pt-8 pb-6 text-center">
            <div className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 mb-4">
              <svg className="h-7 w-7 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 id="exit-intent-title" className="text-2xl font-extrabold text-slate-900">
              Price locked for 24 hours
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              We&apos;ve saved your rate. Continue your booking now to secure it.
            </p>
            <Link
              href="/book"
              data-track-event="quote_click"
              data-track-location="exit_intent_locked"
              onClick={() => {
                track("exit_intent_cta", { cta: "book_after_lock" });
                setOpen(false);
              }}
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary-400 px-6 py-3 text-base font-extrabold text-slate-900 shadow-md hover:bg-primary-500 transition-colors"
            >
              Continue to booking
            </Link>
            <button
              type="button"
              onClick={() => close("after_lock")}
              className="mt-2 text-xs text-slate-500 hover:text-slate-700"
            >
              I&apos;ll come back later
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
