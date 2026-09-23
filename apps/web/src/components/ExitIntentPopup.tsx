"use client";

import { trackAnalyticsEvent } from "@/lib/analytics";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";

const SEEN_KEY = "sv_exit_intent_seen";
const PHONE_HREF = "tel:07909032889";

function track(name: string, payload: Record<string, unknown> = {}) {
  trackAnalyticsEvent(name, { event_category: "engagement", ...payload });
}

/** Offer the existing quote and contact routes once per session. */
export function ExitIntentPopup() {
  const [open, setOpen] = useState(false);
  const dialog = useRef<HTMLDivElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    try {
      if (sessionStorage.getItem(SEEN_KEY) === "1") return;
    } catch { /* The current page still limits the prompt to one appearance. */ }

    let triggered = false;
    const trigger = (source: string) => {
      if (triggered) return;
      triggered = true;
      try {
        sessionStorage.setItem(SEEN_KEY, "1");
      } catch { /* Storage is optional for the quote and contact routes. */ }
      setOpen(true);
      track("exit_intent_shown", { source });
    };

    const onMouseOut = (event: MouseEvent) => {
      if (event.clientY <= 0 && !event.relatedTarget) trigger("desktop_top");
    };

    let idleTimer: number | undefined;
    const resetIdle = () => {
      if (idleTimer) window.clearTimeout(idleTimer);
      idleTimer = window.setTimeout(() => trigger("mobile_idle"), 25_000);
    };

    if (window.matchMedia("(pointer: coarse)").matches) {
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

  useEffect(() => {
    if (!open) return;
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    closeButton.current?.focus();
    return () => {
      if (previousFocus?.isConnected) previousFocus.focus();
    };
  }, [open]);

  function close(reason: string) {
    setOpen(false);
    track("exit_intent_close", { reason });
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4"
      onClick={() => close("backdrop")}
    >
      <div
        ref={dialog}
        className="relative max-h-[calc(100dvh-2rem)] w-full max-w-md overflow-y-auto rounded-2xl bg-white shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="exit-intent-title"
        aria-describedby="exit-intent-description"
        onClick={(event) => event.stopPropagation()}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            event.stopPropagation();
            close("escape");
          }
          if (event.key !== "Tab") return;
          const controls = dialog.current?.querySelectorAll<HTMLElement>("a[href], button:not([disabled])");
          if (!controls?.length) return;
          const first = controls[0];
          const last = controls[controls.length - 1];
          if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus();
          } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
          }
        }}
      >
        <button
          ref={closeButton}
          type="button"
          onClick={() => close("close_button")}
          aria-label="Close moving help"
          className="absolute right-2 top-2 inline-flex h-11 w-11 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
        >
          <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M4.5 4.5a1 1 0 011.4 0L10 8.6l4.1-4.1a1 1 0 011.4 1.4L11.4 10l4.1 4.1a1 1 0 01-1.4 1.4L10 11.4l-4.1 4.1a1 1 0 01-1.4-1.4L8.6 10 4.5 5.9a1 1 0 010-1.4z" clipRule="evenodd" />
          </svg>
        </button>

        <div className="px-6 pb-6 pt-14 text-center">
          <h2 id="exit-intent-title" className="text-2xl font-extrabold text-stone-950">
            Need help planning your move?
          </h2>
          <p id="exit-intent-description" className="mt-3 text-sm leading-6 text-slate-600">
            Continue your quote with both addresses, your items and your date. If you need to discuss stairs,
            large furniture or a more complex move, call us before booking.
          </p>

          <Link
            href="/book"
            data-track-event="quote_click"
            data-track-location="exit_intent"
            onClick={() => {
              track("exit_intent_cta", { cta: "book" });
              setOpen(false);
            }}
            className="mt-6 inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-primary-400 px-6 py-3 text-base font-extrabold text-stone-950 shadow-md hover:bg-primary-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
          >
            Continue to your quote
          </Link>

          <a
            href={PHONE_HREF}
            data-track-event="call_click"
            data-track-location="exit_intent"
            onClick={() => track("exit_intent_cta", { cta: "call" })}
            className="mt-3 inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-3 text-sm font-semibold text-stone-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
          >
            <Image src="/call-icon.png" alt="" width={44} height={44} sizes="44px" />
            Call 07909 032889
          </a>

          <p className="mt-3 text-xs leading-5 text-slate-500">
            Your price and availability are confirmed through the booking process.
          </p>
        </div>
      </div>
    </div>
  );
}
