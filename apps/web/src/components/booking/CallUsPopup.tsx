"use client";

import { useEffect } from "react";
import { haptic } from "@/lib/haptic";

interface Props {
  open: boolean;
  serviceName: string;
  onClose: () => void;
}

const PHONE_DISPLAY = "01202 129746";
const PHONE_TEL = "tel:01202129746";
const WHATSAPP_URL = "https://wa.me/message/J6EO772GDPHFO1";

/**
 * Modal shown when the admin has set a service to "popup" mode
 * (e.g. Same-day delivery → please call us to arrange).
 */
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
      className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-900/70 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="callus-title"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-3 right-3 h-9 w-9 rounded-full text-slate-500 hover:bg-slate-100"
        >
          ✕
        </button>

        <div className="p-6 sm:p-7 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-yellow-100 text-3xl">
            📞
          </div>
          <h2 id="callus-title" className="text-xl font-bold text-slate-900">
            Please call us for {serviceName}
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            For {serviceName.toLowerCase()} we coordinate your job by phone so we
            can confirm the soonest available van and give you an accurate quote.
          </p>

          <div className="mt-6 grid gap-3">
            <a
              href={PHONE_TEL}
              onClick={() => haptic(10)}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-yellow-400 px-5 py-3 text-base font-bold text-slate-900 shadow hover:bg-yellow-300 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            >
              📞 Call {PHONE_DISPLAY}
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
              className="text-sm font-medium text-slate-500 hover:text-slate-700"
            >
              Choose a different service
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
