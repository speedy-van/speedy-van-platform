"use client";

import { useEffect, useState } from "react";
import { haptic } from "@/lib/haptic";

export function BackToTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 640);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      type="button"
      aria-label="Back to top"
      tabIndex={visible ? 0 : -1}
      aria-hidden={!visible}
      onClick={() => {
        const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (!reducedMotion) haptic(8);
        document.getElementById("main-content")?.focus({ preventScroll: true });
        window.scrollTo({ top: 0, behavior: reducedMotion ? "instant" : "smooth" });
      }}
      className={`fixed right-4 z-30 flex h-12 w-12 items-center justify-center rounded-full text-2xl font-black text-black shadow-2xl transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black bottom-40 md:bottom-24 md:right-6 ${
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"
      }`}
      style={{
        background: "linear-gradient(135deg, #F59E0B 0%, #EA580C 100%)",
        boxShadow: "0 12px 32px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.18)",
      }}
    >
      ↑
    </button>
  );
}
