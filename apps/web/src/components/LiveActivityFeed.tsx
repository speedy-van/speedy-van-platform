"use client";

import { useEffect, useState } from "react";

/**
 * Live activity indicator — small bottom-left toast.
 * Cycles through realistic-looking messages to build social proof.
 * Lightweight: no network calls, pure client-side rotation.
 */
const MESSAGES: { text: string; icon: string }[] = [
  { text: "Sarah just booked a move in Glasgow", icon: "📦" },
  { text: "2 bookings in the last hour", icon: "🔥" },
  { text: "Driver available near Edinburgh", icon: "🚐" },
  { text: "James got a quote for Aberdeen", icon: "💬" },
  { text: "Same-day slot opened in Dundee", icon: "⚡" },
  { text: "5-star review from Rachel · Stirling", icon: "⭐" },
  { text: "3 vans on the road right now", icon: "🛣️" },
];

export function LiveActivityFeed() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem("sv_live_dismissed") === "1") {
      setDismissed(true);
      return;
    }
    const showTimer = window.setTimeout(() => setVisible(true), 4000);
    const rotateTimer = window.setInterval(() => {
      setIndex((i) => (i + 1) % MESSAGES.length);
    }, 7000);
    return () => {
      window.clearTimeout(showTimer);
      window.clearInterval(rotateTimer);
    };
  }, []);

  if (dismissed) return null;

  const msg = MESSAGES[index];

  return (
    <div
      className={`fixed left-3 z-30 max-w-[18rem] transition-all duration-500 bottom-24 md:bottom-6 ${
        visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0 pointer-events-none"
      }`}
      role="status"
      aria-live="polite"
    >
      <div className="flex items-center gap-2 rounded-full bg-white shadow-lg ring-1 ring-slate-200 pl-3 pr-2 py-2">
        <span className="relative flex h-2.5 w-2.5 shrink-0">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
        </span>
        <span aria-hidden="true" className="text-base">
          {msg.icon}
        </span>
        <p className="text-xs font-medium text-slate-800 leading-tight truncate">
          {msg.text}
        </p>
        <button
          type="button"
          onClick={() => {
            setDismissed(true);
            try {
              sessionStorage.setItem("sv_live_dismissed", "1");
            } catch {
              /* ignore */
            }
          }}
          aria-label="Dismiss notification"
          className="ml-1 inline-flex h-6 w-6 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700"
        >
          <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M4.5 4.5a1 1 0 011.4 0L10 8.6l4.1-4.1a1 1 0 111.4 1.4L11.4 10l4.1 4.1a1 1 0 01-1.4 1.4L10 11.4l-4.1 4.1a1 1 0 01-1.4-1.4L8.6 10 4.5 5.9a1 1 0 010-1.4z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  );
}
