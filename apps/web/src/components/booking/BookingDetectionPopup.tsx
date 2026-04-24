"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const API_BASE =
  process.env.NODE_ENV === "development"
    ? "http://localhost:4000"
    : (process.env.NEXT_PUBLIC_API_URL ?? "https://api.speedy-van.co.uk");

const DISMISSED_KEY = "sv-booking-popup-dismissed";

interface ActiveBooking {
  reference: string;
  status: string;
  scheduledAt: string;
}

const STATUS_LABELS: Record<string, string> = {
  PENDING: "Pending",
  CONFIRMED: "Confirmed",
  ASSIGNED: "Driver assigned",
  IN_PROGRESS: "In progress",
};

export function BookingDetectionPopup() {
  const [booking, setBooking] = useState<ActiveBooking | null>(null);
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState("");

  useEffect(() => {
    const dismissed = sessionStorage.getItem(DISMISSED_KEY);
    if (dismissed) return;

    // Only run on non-booking-flow pages
    const path = window.location.pathname;
    if (
      path.startsWith("/book") ||
      path.startsWith("/admin") ||
      path.startsWith("/driver") ||
      path.startsWith("/track")
    ) {
      return;
    }

    // Check if there is a stored email from a previous booking
    const storedEmail = localStorage.getItem("sv-customer-email");
    if (!storedEmail) return;

    setEmail(storedEmail);

    fetch(`${API_BASE}/booking/check?email=${encodeURIComponent(storedEmail)}`)
      .then((r) => r.json())
      .then((json) => {
        if (json.success && json.data?.hasActiveBooking && json.data.booking) {
          setBooking(json.data.booking);
          setVisible(true);
        }
      })
      .catch(() => {
        // Silently ignore
      });
  }, []);

  function dismiss() {
    sessionStorage.setItem(DISMISSED_KEY, "1");
    setVisible(false);
  }

  if (!visible || !booking) return null;

  return (
    <div className="fixed bottom-20 sm:bottom-6 left-4 right-4 sm:left-auto sm:right-6 z-[9998] sm:max-w-sm animate-slide-up">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-4">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <p className="text-sm font-semibold text-slate-900">You have an active booking</p>
            <p className="text-xs text-slate-500 mt-0.5">
              {booking.reference} &mdash;{" "}
              <span className="text-emerald-600 font-medium">
                {STATUS_LABELS[booking.status] ?? booking.status}
              </span>
            </p>
          </div>
          <button
            onClick={dismiss}
            className="text-slate-400 hover:text-slate-600 transition text-lg leading-none mt-0.5"
            aria-label="Dismiss"
          >
            &times;
          </button>
        </div>
        <div className="flex gap-2">
          <Link
            href={`/track?ref=${booking.reference}`}
            onClick={dismiss}
            className="flex-1 text-center bg-yellow-400 hover:bg-yellow-300 text-slate-900 text-xs font-semibold py-2.5 rounded-xl transition"
          >
            Track booking
          </Link>
          <button
            onClick={dismiss}
            className="flex-1 border border-slate-200 text-slate-600 text-xs font-medium py-2.5 rounded-xl hover:bg-slate-50 transition"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
}
