"use client";

import { useEffect, useState } from "react";
import { haptic } from "@/lib/haptic";

const DISMISS_KEY = "sv_pwa_install_dismissed_at";
const DISMISS_TTL_MS = 14 * 24 * 60 * 60 * 1000; // 14 days
const BRAND_LOGO_SRC = "/logo.png?v=amber-20260921-1";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

function track(name: string, payload: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  const w = window as Window & {
    gtag?: (...a: unknown[]) => void;
    dataLayer?: unknown[];
  };
  try { w.gtag?.("event", name, { event_category: "pwa", ...payload }); } catch { /* ignore */ }
  try { w.dataLayer?.push({ event: name, ...payload }); } catch { /* ignore */ }
}

export function InstallPrompt() {
  const [evt, setEvt] = useState<BeforeInstallPromptEvent | null>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const path = window.location.pathname;
    if (path.startsWith("/book") && !path.startsWith("/book/confirmation")) return;

    try {
      const dismissed = Number(localStorage.getItem(DISMISS_KEY) ?? 0);
      if (dismissed && Date.now() - dismissed < DISMISS_TTL_MS) return;
    } catch { /* ignore */ }

    // Already installed?
    if (window.matchMedia?.("(display-mode: standalone)").matches) return;

    const handler = (e: Event) => {
      e.preventDefault();
      setEvt(e as BeforeInstallPromptEvent);
      // Give the landing page room to breathe before showing the install prompt.
      window.setTimeout(() => setShow(true), path === "/" ? 12000 : 5000);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  if (!show || !evt) return null;

  const dismiss = () => {
    setShow(false);
    try { localStorage.setItem(DISMISS_KEY, String(Date.now())); } catch { /* ignore */ }
    track("pwa_install_dismissed");
  };

  const install = async () => {
    haptic(15);
    track("pwa_install_clicked");
    try {
      await evt.prompt();
      const choice = await evt.userChoice;
      track("pwa_install_choice", { outcome: choice.outcome });
    } catch { /* ignore */ }
    setShow(false);
    setEvt(null);
  };

  return (
    <div
      className="fixed inset-x-3 bottom-32 md:bottom-6 md:left-auto md:right-6 md:max-w-sm z-40 rounded-2xl bg-stone-950 text-white shadow-xl ring-1 ring-white/10 p-4 flex items-start gap-3 animate-in fade-in slide-in-from-bottom-4 duration-300"
      role="dialog"
      aria-label="Install SpeedyVan"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={BRAND_LOGO_SRC} alt="" className="h-10 w-10 rounded-lg object-cover shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold">Install SpeedyVan</p>
        <p className="text-xs text-slate-300 mt-0.5">
          Add to home screen for one-tap booking and instant tracking.
        </p>
        <div className="mt-2.5 flex items-center gap-2">
          <button
            type="button"
            onClick={install}
            className="rounded-lg bg-primary-400 px-3 py-1.5 text-xs font-extrabold text-black hover:bg-primary-500"
          >
            Install
          </button>
          <button
            type="button"
            onClick={dismiss}
            className="rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white"
          >
            Not now
          </button>
        </div>
      </div>
      <button
        type="button"
        onClick={dismiss}
        className="text-slate-400 hover:text-white text-lg leading-none"
        aria-label="Close install prompt"
      >
        ×
      </button>
    </div>
  );
}
