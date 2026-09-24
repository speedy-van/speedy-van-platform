"use client";

import { Suspense, useState, useCallback, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ChatWindow } from "@/components/chat/ChatWindow";

const API_BASE =
  process.env.NODE_ENV === "development"
    ? "http://localhost:4000"
    : (process.env.NEXT_PUBLIC_API_URL ?? "https://api.speedyvan.uk");

const STATUS_LABELS: Record<string, string> = {
  PENDING: "Pending Confirmation",
  CONFIRMED: "Confirmed",
  ASSIGNED: "Driver Assigned",
  EN_ROUTE: "Driver En Route",
  ARRIVED: "Driver Arrived",
  IN_PROGRESS: "Move In Progress",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
};

const STATUS_COLOURS: Record<string, { bg: string; text: string; dot: string }> = {
  PENDING:     { bg: "bg-amber-500/15",  text: "text-amber-400",   dot: "bg-amber-400" },
  CONFIRMED:   { bg: "bg-emerald-500/15", text: "text-emerald-400", dot: "bg-emerald-500" },
  ASSIGNED:    { bg: "bg-purple-500/15",  text: "text-purple-400",  dot: "bg-purple-500" },
  EN_ROUTE:    { bg: "bg-amber-500/15",   text: "text-amber-400",   dot: "bg-amber-500" },
  ARRIVED:     { bg: "bg-orange-500/15",  text: "text-orange-400",  dot: "bg-orange-500" },
  IN_PROGRESS: { bg: "bg-orange-500/15",  text: "text-orange-400",  dot: "bg-orange-400" },
  COMPLETED:   { bg: "bg-green-500/15",   text: "text-green-400",   dot: "bg-green-500" },
  CANCELLED:   { bg: "bg-red-500/15",     text: "text-red-400",     dot: "bg-red-400" },
};

const STATUS_ORDER = [
  "PENDING", "CONFIRMED", "ASSIGNED", "EN_ROUTE",
  "ARRIVED", "IN_PROGRESS", "COMPLETED",
];

interface TrackingEvent {
  type: string;
  status?: string;
  message?: string;
  createdAt: string;
}

interface BookingTrackData {
  reference: string;
  bookingId?: string;
  status: string;
  serviceName: string;
  scheduledAt: string;
  pickupPostcode: string;
  dropoffPostcode: string;
  pickupAddress?: string;
  dropoffAddress?: string;
  driverName?: string;
  driverPhone?: string;
  driverVanSize?: string;
  conversationId?: string;
  canCancel?: boolean;
  events: TrackingEvent[];
  liveLocation?: { lat: number; lng: number; updatedAt: string };
}

export default function TrackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0A0A0A] px-4 py-10 text-center">
          <h1 className="text-2xl font-black text-white">Track your booking</h1>
          <p role="status" className="mt-3 text-white/70">Loading booking form…</p>
        </div>
      }
    >
      <TrackContent />
    </Suspense>
  );
}

function TrackContent() {
  const searchParams = useSearchParams();
  const [ref, setRef] = useState(searchParams.get("ref") ?? "");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<BookingTrackData | null>(null);
  const [error, setError] = useState("");
  const [showChat, setShowChat] = useState(false);
  const [cancelModal, setCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [cancelling, setCancelling] = useState(false);
  const [cancelError, setCancelError] = useState("");
  const [cancelSuccess, setCancelSuccess] = useState(false);
  const [arrivalToast, setArrivalToast] = useState<string | null>(null);
  const lastStatusRef = useRef<string | null>(null);

  const lookupBooking = useCallback(async (refVal: string, emailVal: string) => {
    setError("");
    setData(null);
    setLoading(true);
    setCancelSuccess(false);
    try {
      const res = await fetch(
        `${API_BASE}/booking/track/${encodeURIComponent(refVal.trim())}?email=${encodeURIComponent(emailVal.trim())}`,
      );
      const json = await res.json();
      if (!res.ok || !json.success) {
        setError("Booking not found. Please check your reference and email.");
      } else {
        setData(json.data);
      }
    } catch {
      setError("Unable to reach the server. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await lookupBooking(ref, email);
  }

  // Lightweight polling: while a booking is loaded and not in a terminal state,
  // refetch every 30s so customers see status changes without reloading.
  // Also surfaces a "pre-arrival" toast when status becomes EN_ROUTE/ARRIVED.
  useEffect(() => {
    if (!data || ["COMPLETED", "CANCELLED"].includes(data.status)) {
      lastStatusRef.current = data?.status ?? null;
      return;
    }
    // Fire toast on first status transition we observe
    const prev = lastStatusRef.current;
    if (prev && prev !== data.status) {
      if (data.status === "EN_ROUTE") {
        setArrivalToast("🚚 Your driver is on the way! Get your items ready by the door.");
        try { navigator.vibrate?.([20, 40, 20]); } catch { /* ignore */ }
      } else if (data.status === "ARRIVED") {
        setArrivalToast("📍 Your driver has arrived.");
        try { navigator.vibrate?.([20, 40, 20]); } catch { /* ignore */ }
      }
      // Auto-dismiss
      const t = window.setTimeout(() => setArrivalToast(null), 8000);
      lastStatusRef.current = data.status;
      return () => window.clearTimeout(t);
    }
    lastStatusRef.current = data.status;

    const interval = window.setInterval(() => {
      if (document.hidden) return;
      lookupBooking(data.reference, email);
    }, 30_000);
    return () => window.clearInterval(interval);
  }, [data, email, lookupBooking]);

  async function handleCancel() {
    if (!data || !cancelReason.trim()) return;
    setCancelling(true);
    setCancelError("");
    try {
      const res = await fetch(`${API_BASE}/booking/track/${encodeURIComponent(data.reference)}/cancel`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, reason: cancelReason }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        setCancelError(json.error ?? "Failed to cancel booking.");
      } else {
        setCancelSuccess(true);
        setCancelModal(false);
        setData((prev) => prev ? { ...prev, status: "CANCELLED", canCancel: false } : prev);
      }
    } catch {
      setCancelError("Unable to reach the server. Please try again.");
    } finally {
      setCancelling(false);
    }
  }

  const statusColor = data ? (STATUS_COLOURS[data.status] ?? STATUS_COLOURS.PENDING) : null;
  const statusIndex = data ? STATUS_ORDER.indexOf(data.status) : -1;
  const isTerminal = data ? ["COMPLETED", "CANCELLED"].includes(data.status) : false;

  return (
    <div className="min-h-screen bg-[#0A0A0A] py-10 px-4">
      {arrivalToast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed top-4 inset-x-4 sm:left-1/2 sm:-translate-x-1/2 sm:max-w-md z-50 rounded-2xl text-white px-4 py-3 flex items-start gap-3 animate-in slide-in-from-top duration-300"
          style={{
            background: "rgba(255,255,255,0.08)",
            boxShadow: "0 0 0 1px rgba(245,158,11,0.25), 0 8px 32px rgba(0,0,0,0.6)",
            backdropFilter: "blur(16px)",
          }}
        >
          <p className="flex-1 text-sm font-semibold">{arrivalToast}</p>
          <button
            type="button"
            onClick={() => setArrivalToast(null)}
            aria-label="Dismiss"
            className="text-white/40 hover:text-white text-lg leading-none"
          >
            ×
          </button>
        </div>
      )}
      <div className="max-w-xl mx-auto space-y-6">

        {/* Header */}
        <div className="text-center">
          <Link href="/" className="inline-block mb-5">
            <span className="text-2xl font-extrabold text-white">
              Speedy<span className="text-amber-400">Van</span>
            </span>
          </Link>
          <h1 className="text-2xl font-black text-white">Track your booking</h1>
          <p className="mt-1 text-white/40 text-sm">
            Enter your booking reference and email to see live updates.
          </p>
        </div>

        {/* Lookup form */}
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-amber-900/20 p-6 space-y-4"
          style={{
            background: "rgba(255,255,255,0.04)",
            boxShadow: "0 0 0 1px rgba(245,158,11,0.15), 0 8px 32px rgba(0,0,0,0.4)",
          }}
        >
          <div>
            <label className="block text-sm font-medium text-white/55 mb-1.5">
              Booking reference
            </label>
            <input
              type="text"
              value={ref}
              onChange={(e) => setRef(e.target.value)}
              placeholder="SVR-2026-XXXXXX"
              required
              className="w-full rounded-xl border border-amber-900/20 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder-white/25 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-transparent font-mono tracking-widest uppercase"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white/55 mb-1.5">
              Email address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="The email you booked with"
              required
              className="w-full rounded-xl border border-amber-900/20 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder-white/25 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-transparent"
            />
          </div>
          {error && (
            <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{error}</p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full font-black text-black py-3 rounded-xl text-sm transition hover:opacity-90 active:scale-95 disabled:opacity-60"
            style={{ background: "linear-gradient(135deg, #F59E0B 0%, #EA580C 100%)" }}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-black/30 border-t-transparent" />
                Looking up&hellip;
              </span>
            ) : "Track booking"}
          </button>
        </form>

        {/* Cancel success */}
        {cancelSuccess && (
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-3 text-sm text-emerald-400">
            Your booking has been cancelled. A refund will be processed if applicable.
          </div>
        )}

        {/* Result */}
        {data && (
          <div className="space-y-4">

            {/* Status hero */}
            <div className={`rounded-2xl p-5 border border-amber-900/20 ${statusColor?.bg}`}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-1">Reference</p>
                  <p className="text-xl font-black text-white font-mono tracking-widest">{data.reference}</p>
                </div>
                <div className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${statusColor?.text} bg-white/5 border border-white/10`}>
                  <span className={`h-2 w-2 rounded-full ${statusColor?.dot} ${!isTerminal ? "animate-pulse" : ""}`} />
                  {STATUS_LABELS[data.status] ?? data.status}
                </div>
              </div>

              {data.status !== "CANCELLED" && (
                <div className="mt-4">
                  <div className="flex justify-between text-[10px] text-white/40 mb-1">
                    <span>Booked</span>
                    <span>En Route</span>
                    <span>Complete</span>
                  </div>
                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-400 rounded-full transition-all duration-700"
                      style={{ width: `${Math.min(100, ((statusIndex) / (STATUS_ORDER.length - 1)) * 100)}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Details */}
            <div
              className="rounded-2xl border border-amber-900/20 p-5"
              style={{
                background: "rgba(255,255,255,0.04)",
                boxShadow: "0 0 0 1px rgba(245,158,11,0.15), 0 8px 32px rgba(0,0,0,0.4)",
              }}
            >
              <h2 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3">Booking details</h2>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-white/40 text-xs mb-0.5">Service</p>
                  <p className="font-medium text-white">{data.serviceName}</p>
                </div>
                <div>
                  <p className="text-white/40 text-xs mb-0.5">Scheduled</p>
                  <p className="font-medium text-white">
                    {new Date(data.scheduledAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                  </p>
                </div>
                <div>
                  <p className="text-white/40 text-xs mb-0.5">From</p>
                  <p className="font-medium text-white text-xs leading-snug">{data.pickupAddress ?? data.pickupPostcode}</p>
                </div>
                <div>
                  <p className="text-white/40 text-xs mb-0.5">To</p>
                  <p className="font-medium text-white text-xs leading-snug">{data.dropoffAddress ?? data.dropoffPostcode}</p>
                </div>
              </div>
            </div>

            {/* Driver intro card — appears once a driver has been assigned */}
            {data.driverName && ["ASSIGNED", "EN_ROUTE", "ARRIVED", "IN_PROGRESS"].includes(data.status) && (
              <div
                className="rounded-2xl border border-amber-900/20 p-5"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  boxShadow: "0 0 0 1px rgba(245,158,11,0.15), 0 8px 32px rgba(0,0,0,0.4)",
                }}
              >
                <h2 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3">Your driver</h2>
                <div className="flex items-center gap-3">
                  <div
                    aria-hidden="true"
                    className="h-12 w-12 rounded-full bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center text-black font-bold text-lg shadow"
                  >
                    {data.driverName.trim().charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-black text-white truncate">{data.driverName}</p>
                    {data.driverVanSize && (
                      <p className="text-xs text-white/40">
                        Driving a {data.driverVanSize.toLowerCase()} van
                      </p>
                    )}
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  {data.driverPhone && (
                    <a
                      href={`tel:${data.driverPhone}`}
                      className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-500/15 border border-emerald-500/20 text-emerald-400 text-sm font-semibold py-2.5 hover:bg-emerald-500/25 transition"
                    >
                      📞 Call
                    </a>
                  )}
                  <button
                    type="button"
                    onClick={() => setShowChat(true)}
                    className={`inline-flex items-center justify-center gap-1.5 rounded-xl border border-amber-900/20 text-white/70 text-sm font-semibold py-2.5 hover:border-amber-500/30 hover:text-white transition ${data.driverPhone ? "" : "col-span-2"}`}
                    style={{ background: "rgba(255,255,255,0.05)" }}
                  >
                    💬 Message
                  </button>
                </div>
              </div>
            )}

            {/* Pre-arrival checklist */}
            {["CONFIRMED", "ASSIGNED", "EN_ROUTE"].includes(data.status) && (
              <div
                className="rounded-2xl border border-amber-900/20 p-5"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  boxShadow: "0 0 0 1px rgba(245,158,11,0.15), 0 8px 32px rgba(0,0,0,0.4)",
                }}
              >
                <h2 className="text-sm font-black text-white mb-1">
                  ✅ Get ready for your driver
                </h2>
                <p className="text-xs text-white/40 mb-3">
                  A few quick things to make the move smooth.
                </p>
                <ul className="space-y-2 text-sm text-white/55">
                  <li className="flex items-start gap-2">
                    <span aria-hidden="true">📦</span>
                    <span>Box up smaller items and label fragile boxes clearly.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span aria-hidden="true">🚪</span>
                    <span>Make sure the path to the door is clear and accessible.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span aria-hidden="true">🅿️</span>
                    <span>Reserve a parking spot near the entrance if possible.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span aria-hidden="true">📱</span>
                    <span>Keep your phone on — your driver may call when nearby.</span>
                  </li>
                </ul>
              </div>
            )}

            {/* Timeline */}
            {data.events.length > 0 && (
              <div
                className="rounded-2xl border border-amber-900/20 p-5"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  boxShadow: "0 0 0 1px rgba(245,158,11,0.15), 0 8px 32px rgba(0,0,0,0.4)",
                }}
              >
                <h2 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-4">Timeline</h2>
                <ol className="relative border-l-2 border-white/10 space-y-4">
                  {[...data.events].reverse().map((ev, i) => (
                    <li key={i} className="ml-5">
                      <div className={`absolute -left-[9px] mt-1 h-4 w-4 rounded-full border-2 border-[#0A0A0A] ${i === 0 ? "bg-amber-400 ring-2 ring-amber-400/30" : "bg-white/20"}`} />
                      <p className="text-xs text-white/40">
                        {new Date(ev.createdAt).toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                      </p>
                      <p className="text-sm font-medium text-white/70 mt-0.5">
                        {ev.message ?? (ev.status ? STATUS_LABELS[ev.status] ?? ev.status : ev.type)}
                      </p>
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {/* Chat */}
            <div
              className="rounded-2xl border border-amber-900/20 overflow-hidden"
              style={{
                background: "rgba(255,255,255,0.04)",
                boxShadow: "0 0 0 1px rgba(245,158,11,0.15), 0 8px 32px rgba(0,0,0,0.4)",
              }}
            >
              <button
                type="button"
                onClick={() => setShowChat((v) => !v)}
                className="w-full flex items-center justify-between px-5 py-4 hover:bg-white/[0.03] transition"
              >
                <span className="text-sm font-semibold text-white/70">Message our team</span>
                <span className="text-white/40 text-xs">{showChat ? "Hide" : "Show"}</span>
              </button>
              {showChat && (
                <ChatWindow
                  mode="public"
                  bookingRef={data.reference}
                  email={email}
                  title="Chat with Support"
                />
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              {data.status === "COMPLETED" && (
                <Link
                  href={`/book/review/${data.reference}?email=${encodeURIComponent(email)}`}
                  className="flex-1 text-center font-black text-black py-3 rounded-xl text-sm transition hover:opacity-90 active:scale-95"
                  style={{ background: "linear-gradient(135deg, #F59E0B 0%, #EA580C 100%)" }}
                >
                  Leave a review
                </Link>
              )}
              {data.canCancel && (
                <button
                  type="button"
                  onClick={() => setCancelModal(true)}
                  className="flex-1 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 font-semibold py-3 rounded-xl text-sm transition"
                >
                  Cancel booking
                </button>
              )}
            </div>
          </div>
        )}

        <div className="flex justify-center">
          <a href="tel:07909032889" aria-label="Call us on 07909 032889" className="transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 rounded-full">
            <Image src="/call-icon.png" alt="" width={52} height={52} sizes="52px" />
          </a>
        </div>
      </div>

      {/* Cancel modal */}
      {cancelModal && data && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div
            className="w-full max-w-md rounded-2xl p-6 space-y-4 border border-amber-900/20"
            style={{
              background: "rgba(15,15,15,0.95)",
              boxShadow: "0 0 0 1px rgba(245,158,11,0.15), 0 24px 48px rgba(0,0,0,0.6)",
            }}
          >
            <h2 className="text-lg font-black text-white">Cancel booking?</h2>
            <p className="text-sm text-white/55">
              Please tell us why you are cancelling. A refund will be calculated based on our cancellation policy.
            </p>
            <div>
              <label className="block text-sm font-medium text-white/55 mb-1.5">Reason</label>
              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                rows={3}
                className="w-full rounded-xl border border-amber-900/20 bg-white/[0.03] px-3 py-2.5 text-sm text-white placeholder-white/25 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-transparent resize-none"
                placeholder="e.g. Plans changed"
              />
            </div>
            {cancelError && (
              <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{cancelError}</p>
            )}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => { setCancelModal(false); setCancelReason(""); setCancelError(""); }}
                className="flex-1 border border-amber-900/20 text-white/55 py-2.5 rounded-xl text-sm font-medium hover:border-amber-500/30 hover:text-white/80 transition"
                style={{ background: "rgba(255,255,255,0.03)" }}
              >
                Keep booking
              </button>
              <button
                type="button"
                onClick={() => void handleCancel()}
                disabled={!cancelReason.trim() || cancelling}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2.5 rounded-xl text-sm font-semibold disabled:opacity-60 transition"
              >
                {cancelling ? "Cancelling..." : "Confirm cancel"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
