"use client";

import { useState, useEffect } from "react";

const CONSENT_KEY = "sv-cookie-consent";

type ConsentState = "accepted" | "declined" | null;

export function CookieConsent() {
  const [state, setState] = useState<ConsentState>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(CONSENT_KEY) as ConsentState;
    if (saved) {
      setState(saved);
    } else {
      // Slight delay so the page renders first
      const t = setTimeout(() => setVisible(true), 800);
      return () => clearTimeout(t);
    }
  }, []);

  function accept() {
    localStorage.setItem(CONSENT_KEY, "accepted");
    setState("accepted");
    setVisible(false);
  }

  function decline() {
    localStorage.setItem(CONSENT_KEY, "declined");
    setState("declined");
    setVisible(false);
  }

  if (!visible || state !== null) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      className="fixed bottom-0 left-0 right-0 z-[9999] p-4 sm:p-6 animate-slide-up"
    >
      <div className="max-w-3xl mx-auto bg-slate-900 text-white rounded-2xl shadow-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold mb-1">We use cookies</p>
          <p className="text-xs text-slate-300 leading-relaxed">
            We use cookies to improve your experience and analyse how our site is used.
            By clicking &quot;Accept&quot; you agree to our{" "}
            <a href="/privacy" className="underline hover:text-yellow-400 transition">
              Privacy Policy
            </a>
            .
          </p>
        </div>
        <div className="flex gap-2 shrink-0">
          <button
            onClick={decline}
            className="px-4 py-2 text-xs font-medium text-slate-300 border border-slate-600 rounded-xl hover:border-slate-400 hover:text-white transition"
          >
            Decline
          </button>
          <button
            onClick={accept}
            className="px-5 py-2 text-xs font-semibold bg-yellow-400 hover:bg-yellow-300 text-slate-900 rounded-xl transition"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}

export function useCookieConsent(): ConsentState {
  const [state, setState] = useState<ConsentState>(null);
  useEffect(() => {
    const saved = localStorage.getItem(CONSENT_KEY) as ConsentState;
    setState(saved);
  }, []);
  return state;
}
