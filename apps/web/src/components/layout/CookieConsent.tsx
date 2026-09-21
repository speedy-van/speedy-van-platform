"use client";

import { useState, useEffect, useRef, useSyncExternalStore } from "react";
import type { CSSProperties } from "react";
import {
  COOKIE_SETTINGS_EVENT,
  getCookieConsent,
  setCookieConsent,
  subscribeCookieConsent,
} from "@/lib/analytics";
import type { ConsentState } from "@/lib/analytics";

export function CookieConsent() {
  const consent = useCookieConsent();
  const [visible, setVisible] = useState(false);
  const declineButton = useRef<HTMLButtonElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const showSettings = () => {
      returnFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      setVisible(true);
    };
    window.addEventListener(COOKIE_SETTINGS_EVENT, showSettings);
    return () => window.removeEventListener(COOKIE_SETTINGS_EVENT, showSettings);
  }, []);

  useEffect(() => {
    if (consent !== null) return;
    const timer = setTimeout(() => setVisible(true), 800);
    return () => clearTimeout(timer);
  }, [consent]);

  useEffect(() => {
    // Opening settings is intentional; the first-visit banner does not take focus.
    if (visible && returnFocus.current) declineButton.current?.focus();
  }, [visible]);

  function close() {
    setVisible(false);
    returnFocus.current?.focus();
    returnFocus.current = null;
  }

  function choose(state: "accepted" | "declined") {
    setCookieConsent(state);
    close();
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-labelledby="cookie-consent-title"
      aria-describedby="cookie-consent-description"
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          event.stopPropagation();
          close();
        }
      }}
      className="fixed bottom-0 left-0 right-0 z-[9999] p-4 sm:p-6 motion-safe:animate-slide-up"
    >
      <div className="max-w-3xl mx-auto bg-stone-950 text-white rounded-2xl shadow-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex-1 min-w-0">
          <p id="cookie-consent-title" className="text-sm font-semibold mb-1">Your cookie choices</p>
          <p id="cookie-consent-description" className="text-xs text-slate-300 leading-relaxed">
            Essential cookies keep your booking working. With your permission, we also use
            analytics and marketing cookies to measure visits and advertising.
            You can decline these or change your choice using Cookie settings in the footer. Read our{" "}
            <a href="/cookies" className="underline hover:text-primary-400 transition">Cookie Policy</a>.
          </p>
        </div>
        <div className="flex gap-2 shrink-0">
          <button
            ref={declineButton}
            type="button"
            onClick={() => choose("declined")}
            className="min-h-11 px-4 py-2 text-xs font-medium text-slate-200 border border-slate-500 rounded-xl hover:border-slate-300 hover:text-white transition"
          >
            Decline optional
          </button>
          <button
            type="button"
            onClick={() => choose("accepted")}
            className="min-h-11 px-5 py-2 text-xs font-semibold bg-primary-400 hover:bg-primary-500 active:bg-primary-600 text-stone-950 rounded-xl transition"
          >
            Accept optional
          </button>
        </div>
      </div>
    </div>
  );
}

export function CookieSettingsButton({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <button
      type="button"
      className={className}
      style={style}
      onClick={() => window.dispatchEvent(new Event(COOKIE_SETTINGS_EVENT))}
    >
      Cookie settings
    </button>
  );
}

export function useCookieConsent(): ConsentState {
  return useSyncExternalStore(subscribeCookieConsent, getCookieConsent, () => null);
}
