"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { MouseEvent } from "react";
import Link from "next/link";
import { FiCheck, FiCopy, FiDownload, FiHome, FiMapPin } from "react-icons/fi";

const API_BASE =
  process.env.NODE_ENV === "development"
    ? "http://localhost:4000"
    : (process.env.NEXT_PUBLIC_API_URL ?? "https://api.speedyvan.uk");
const CONFIRMATION_STORAGE_KEY = "sv_booking_confirmation_v1";

interface ConfirmationSnapshot {
  bookingRef?: unknown;
  customerEmail?: unknown;
}

interface ConfirmationActionsProps {
  reference: string;
}

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function readStoredEmail(reference: string): string {
  try {
    const raw = sessionStorage.getItem(CONFIRMATION_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as ConfirmationSnapshot;
      if (parsed.bookingRef === reference && typeof parsed.customerEmail === "string") {
        return parsed.customerEmail;
      }
    }
  } catch {
    /* Fall through to the older customer email cache. */
  }

  try {
    return localStorage.getItem("sv-customer-email") ?? "";
  } catch {
    return "";
  }
}

export function ConfirmationActions({ reference }: ConfirmationActionsProps) {
  const emailInputRef = useRef<HTMLInputElement | null>(null);
  const [storedEmail, setStoredEmail] = useState("");
  const [manualEmail, setManualEmail] = useState("");
  const [copied, setCopied] = useState(false);
  const [emailRequested, setEmailRequested] = useState(false);
  const [invoiceDownloading, setInvoiceDownloading] = useState(false);
  const [invoiceError, setInvoiceError] = useState("");
  const [invoiceMessage, setInvoiceMessage] = useState("");

  useEffect(() => {
    if (!reference) return;
    const email = readStoredEmail(reference);
    if (email) setStoredEmail(email);
  }, [reference]);

  const invoiceEmail = (storedEmail || manualEmail).trim();
  const canDownloadInvoice = Boolean(reference && isValidEmail(invoiceEmail));
  const invoiceHref = useMemo(() => {
    if (!canDownloadInvoice) return "";
    return `${API_BASE}/booking/invoice/${encodeURIComponent(reference)}?email=${encodeURIComponent(invoiceEmail)}`;
  }, [canDownloadInvoice, invoiceEmail, reference]);

  async function copyReference() {
    if (!reference) return;
    try {
      await navigator.clipboard.writeText(reference);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  async function handleInvoiceDownload(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    setInvoiceError("");
    setInvoiceMessage("");

    if (!canDownloadInvoice || !invoiceHref) {
      setEmailRequested(true);
      window.setTimeout(() => emailInputRef.current?.focus(), 0);
      return;
    }

    const invoiceWindow = window.open("", "_blank");
    if (invoiceWindow) {
      invoiceWindow.document.title = "Preparing invoice";
      invoiceWindow.document.body.style.margin = "0";
      invoiceWindow.document.body.style.background = "#050505";
      invoiceWindow.document.body.style.color = "#ffffff";
      invoiceWindow.document.body.style.fontFamily = "system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif";
      invoiceWindow.document.body.innerHTML = '<p style="padding:24px;font-size:16px;font-weight:700">Preparing invoice...</p>';
    }

    setInvoiceDownloading(true);
    try {
      const response = await fetch(invoiceHref, { cache: "no-store" });
      if (!response.ok) {
        throw new Error("Invoice unavailable");
      }
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      if (invoiceWindow) {
        invoiceWindow.location.href = url;
        invoiceWindow.opener = null;
        setInvoiceMessage("Invoice opened in a new tab.");
        window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
      } else {
        const link = document.createElement("a");
        link.href = url;
        link.download = `INV-${reference}.pdf`;
        document.body.appendChild(link);
        link.click();
        link.remove();
        setInvoiceMessage("Invoice downloaded. Check your browser Downloads.");
        window.setTimeout(() => URL.revokeObjectURL(url), 1000);
      }
    } catch {
      invoiceWindow?.close();
      setInvoiceError("Invoice is not available right now. Please try again or use Track booking.");
    } finally {
      setInvoiceDownloading(false);
    }
  }

  function requestInvoiceEmail(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    setEmailRequested(true);
    window.setTimeout(() => emailInputRef.current?.focus(), 0);
  }

  return (
    <div className="space-y-3">
      {reference && !storedEmail && (
        <div className="rounded-2xl border border-amber-500/20 bg-white/[0.04] p-3">
          <label htmlFor="invoice-email" className="mb-1.5 block text-xs font-black uppercase tracking-widest text-amber-300">
            Email for invoice
          </label>
          <input
            ref={emailInputRef}
            id="invoice-email"
            type="email"
            value={manualEmail}
            onChange={(event) => setManualEmail(event.target.value)}
            placeholder="The email used for this booking"
            className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm font-bold text-white placeholder:text-white/40 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400/25"
          />
          {emailRequested && !canDownloadInvoice && (
            <p className="mt-2 text-xs font-semibold text-amber-200">
              Enter the booking email to open the PDF invoice.
            </p>
          )}
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        {reference && (
          <button
            type="button"
            onClick={canDownloadInvoice ? handleInvoiceDownload : requestInvoiceEmail}
            disabled={invoiceDownloading}
            className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-xl px-4 text-sm font-black transition active:scale-[0.98] ${
              canDownloadInvoice
                ? "bg-gradient-to-r from-amber-400 to-orange-600 text-black hover:brightness-110"
                : "border border-amber-500/25 bg-amber-500/10 text-amber-100 hover:bg-amber-500/20"
            } disabled:cursor-not-allowed disabled:opacity-70`}
          >
            <FiDownload aria-hidden="true" className={`h-5 w-5 ${invoiceDownloading ? "animate-bounce" : ""}`} />
            {invoiceDownloading ? "Preparing invoice" : "Open invoice"}
          </button>
        )}

        {reference && (
          <Link
            href={`/track?ref=${encodeURIComponent(reference)}`}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.06] px-4 text-sm font-black text-white transition hover:border-amber-400/40 hover:bg-white/[0.09] active:scale-[0.98]"
          >
            <FiMapPin aria-hidden="true" className="h-5 w-5" />
            Track booking
          </Link>
        )}

        {reference && (
          <button
            type="button"
            onClick={() => void copyReference()}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.06] px-4 text-sm font-black text-white transition hover:border-amber-400/40 hover:bg-white/[0.09] active:scale-[0.98]"
          >
            {copied ? <FiCheck aria-hidden="true" className="h-5 w-5" /> : <FiCopy aria-hidden="true" className="h-5 w-5" />}
            {copied ? "Copied" : "Copy reference"}
          </button>
        )}

        <Link
          href="/"
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.06] px-4 text-sm font-black text-white transition hover:border-amber-400/40 hover:bg-white/[0.09] active:scale-[0.98]"
        >
          <FiHome aria-hidden="true" className="h-5 w-5" />
          Back home
        </Link>
      </div>

      {invoiceError && (
        <p role="alert" className="rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-200">
          {invoiceError}
        </p>
      )}

      {invoiceMessage && !invoiceError && (
        <p role="status" className="rounded-xl border border-emerald-400/20 bg-emerald-500/10 px-4 py-3 text-sm font-semibold text-emerald-200">
          {invoiceMessage}
        </p>
      )}
    </div>
  );
}
