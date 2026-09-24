"use client";

import { useEffect } from "react";
import { haptic } from "@/lib/haptic";

interface Props {
  open: boolean;
  serviceName: string;
  onClose: () => void;
}

const PHONE_TEL = "tel:07909032889";
const WHATSAPP_URL = "https://wa.me/447909032889";

export function CallUsPopup({ open, serviceName, onClose }: Props) {
  useEffect(() => {
    if (!open) return;
    haptic([20, 30, 20]);
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = original;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(6px)" }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="callus-title"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md rounded-2xl"
        style={{ background: "#1A1200", boxShadow: "0 0 0 1px rgba(245,158,11,0.20), 0 24px 64px rgba(0,0,0,0.7)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-3 right-3 h-9 w-9 rounded-full text-white/40 hover:bg-white/10 transition-colors flex items-center justify-center"
        >
          ✕
        </button>

        <div className="p-6 sm:p-7 text-center">
          <div
            className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full text-3xl"
            style={{ background: "rgba(245,158,11,0.15)" }}
          >
            📞
          </div>
          <h2 id="callus-title" className="text-xl font-bold text-white">
            Please call us for {serviceName}
          </h2>
          <p className="mt-2 text-sm text-white/55">
            For {serviceName.toLowerCase()} we coordinate your job by phone so we
            can confirm the soonest available van and give you an accurate quote.
          </p>

          <div className="mt-6 grid gap-3">
            <a
              href={PHONE_TEL}
              onClick={() => haptic(10)}
              aria-label="Call us on 07909 032889"
              className="flex justify-center transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 rounded-full"
            >
              <img src="/call-icon.png" alt="Call us" width={64} height={64} />
            </a>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => haptic(10)}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#25D366] px-5 py-3 text-base font-semibold text-white shadow hover:bg-[#1DA851] focus:outline-none focus:ring-2 focus:ring-[#25D366]"
            >
              💬 Chat on WhatsApp
            </a>
            <button
              type="button"
              onClick={onClose}
              className="text-sm font-medium text-white/40 hover:text-white/70 transition-colors"
            >
              Choose a different service
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
