"use client";

import { useEffect, useMemo, useState } from "react";

const API_BASE =
  process.env.NODE_ENV === "development"
    ? "http://localhost:4000"
    : (process.env.NEXT_PUBLIC_API_URL ?? "https://api.speedyvan.uk");

function isEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export function InvoiceButton({
  reference,
  isLocalDevBooking,
}: {
  reference: string;
  isLocalDevBooking: boolean;
}) {
  const [email, setEmail] = useState("");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setEmail(localStorage.getItem("sv-customer-email") ?? "");
    setHydrated(true);
  }, []);

  const invoiceUrl = useMemo(() => {
    if (!reference) return "";
    if (isLocalDevBooking) return `${API_BASE}/booking/invoice/${encodeURIComponent(reference)}`;
    if (!isEmail(email)) return "";
    return `${API_BASE}/booking/invoice/${encodeURIComponent(reference)}?email=${encodeURIComponent(email.trim())}`;
  }, [email, isLocalDevBooking, reference]);

  if (!reference) return null;

  if (invoiceUrl) {
    return (
      <div className="mt-6 rounded-2xl border border-amber-400/40 bg-amber-400/12 p-5 shadow-[0_18px_48px_rgba(245,158,11,0.10)]">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-amber-300">Receipt and invoice</p>
        <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm font-semibold leading-6 text-white/70">
            Your PDF invoice is ready to view in the browser.
          </p>
          <a
            href={invoiceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-14 shrink-0 items-center justify-center rounded-xl bg-amber-400 px-6 text-base font-black text-black shadow-lg shadow-amber-500/20 transition hover:bg-amber-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
          >
            View invoice PDF
          </a>
        </div>
      </div>
    );
  }

  return (
    <form
      className="mt-6 rounded-2xl border border-amber-400/40 bg-amber-400/12 p-5 shadow-[0_18px_48px_rgba(245,158,11,0.10)]"
      onSubmit={(event) => {
        event.preventDefault();
        if (!invoiceUrl && isEmail(email)) {
          window.open(`${API_BASE}/booking/invoice/${encodeURIComponent(reference)}?email=${encodeURIComponent(email.trim())}`, "_blank", "noopener,noreferrer");
        }
      }}
    >
      <p className="text-xs font-black uppercase tracking-[0.2em] text-amber-300">Receipt and invoice</p>
      <p className="mt-2 text-sm font-semibold leading-6 text-white/70">
        Enter the booking email to open the invoice securely.
      </p>
      <div className="mt-3 grid gap-3 sm:grid-cols-[minmax(0,1fr)_180px]">
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder={hydrated ? "Booking email" : "Loading email..."}
          className="min-h-12 rounded-xl border border-white/12 bg-black/35 px-4 text-sm font-semibold text-white placeholder-white/30 outline-none transition focus:border-amber-400/55 focus:ring-2 focus:ring-amber-400/30"
        />
        <button
          type="submit"
          disabled={!isEmail(email)}
          className="min-h-12 rounded-xl bg-amber-400 px-5 text-sm font-black text-black transition hover:bg-amber-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 disabled:cursor-not-allowed disabled:opacity-45"
        >
          View invoice PDF
        </button>
      </div>
    </form>
  );
}
