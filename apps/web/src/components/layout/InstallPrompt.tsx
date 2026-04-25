"use client";

import { useEffect, useState } from "react";
import { haptic } from "@/lib/haptic";

const DISMISS_KEY = "sv_pwa_install_dismissed_at";
const DISMISS_TTL_MS = 14 * 24 * 60 * 60 * 1000; // 14 days

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
    try {
      const dismissed = Number(localStorage.getItem(DISMISS_KEY) ?? 0);
      if (dismissed && Date.now() - dismissed < DISMISS_TTL_MS) return;
    } catch { /* ignore */ }

    // Already installed?
    if (window.matchMedia?.("(display-mode: standalone)").matches) return;

    const handler = (e: Event) => {
      e.preventDefault();
      setEvt(e as BeforeInstallPromptEvent);
      // Slight delay so we don't interrupt first paint
      window.setTimeout(() => setShow(true), 4000);
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
      className="fixed inset-x-3 bottom-24 md:bottom-6 md:left-auto md:right-6 md:max-w-sm z-40 rounded-2xl bg-slate-900 text-white shadow-xl ring-1 ring-white/10 p-4 flex items-start gap-3 animate-in fade-in slide-in-from-bottom-4 duration-300"
      role="dialog"
      aria-label="Install SpeedyVan"
    >
      <img src="/logo.png" alt="" className="h-10 w-10 rounded-lg object-cover shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold">Install SpeedyVan</p>
        <p className="text-xs text-slate-300 mt-0.5">
          Add to home screen for one-tap booking and instant tracking.
        </p>
        <div className="mt-2.5 flex items-center gap-2">
          <button
            type="button"
            onClick={install}
            className="rounded-lg bg-primary-400 px-3 py-1.5 text-xs font-extrabold text-slate-900 hover:bg-primary-500"
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
