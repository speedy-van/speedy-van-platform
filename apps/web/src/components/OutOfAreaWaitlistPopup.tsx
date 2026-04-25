"use client";

import { useEffect, useRef, useState } from "react";

const API_BASE =
  process.env.NODE_ENV === "development"
    ? "http://localhost:4000"
    : (process.env.NEXT_PUBLIC_API_URL ?? "https://api.speedyvan.uk");

interface Props {
  open: boolean;
  postcode: string;
  area: string;
  source?: string;
  onClose: () => void;
}

/**
 * Captures email when a customer enters an out-of-area postcode.
 * Submits to POST /waitlist (idempotent on email + postcode).
 */
export function OutOfAreaWaitlistPopup({ open, postcode, area, source, onClose }: Props) {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const inFlight = useRef(false);

  useEffect(() => {
    if (!open) {
      setDone(false);
      setError("");
      setEmail("");
      inFlight.current = false;
      return;
    }
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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (inFlight.current) return; // hard guard against double-click
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    inFlight.current = true;
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE}/waitlist`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, postcode, source: source ?? "postcode-check" }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error ?? "Failed to save");
      }
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      inFlight.current = false;
      setSubmitting(false);
    }
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-900/70 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="waitlist-title"
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
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-amber-100 text-3xl">
            📍
          </div>

          {done ? (
            <>
              <h2 id="waitlist-title" className="text-xl font-bold text-slate-900">
                You&rsquo;re on the list!
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                We&rsquo;ll email you the moment we start covering{" "}
                <span className="font-semibold">{area}</span>. Thanks for your interest in
                SpeedyVan.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="mt-6 inline-flex items-center justify-center rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
              >
                Close
              </button>
            </>
          ) : (
            <>
              <h2 id="waitlist-title" className="text-xl font-bold text-slate-900">
                Sorry, we don&rsquo;t cover {area} yet
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                Drop your email and we&rsquo;ll let you know the moment we expand to{" "}
                <span className="font-semibold">{postcode}</span>. No spam, ever.
              </p>

              <form onSubmit={handleSubmit} className="mt-5 space-y-3 text-left">
                <label htmlFor="waitlist-email" className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Email address
                </label>
                <input
                  id="waitlist-email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                />
                {error && (
                  <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                    {error}
                  </p>
                )}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-yellow-400 px-5 py-3 text-sm font-bold text-slate-900 shadow hover:bg-yellow-300 disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-yellow-500"
                >
                  {submitting ? "Saving…" : "Notify me when you launch"}
                </button>
                <p className="text-[11px] text-slate-400 text-center">
                  By submitting you agree to receive a one-off email from SpeedyVan.
                </p>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
