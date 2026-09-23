"use client";

import { useState } from "react";
import Link from "next/link";

const API_BASE =
  process.env.NODE_ENV === "development"
    ? "http://localhost:4000"
    : (process.env.NEXT_PUBLIC_API_URL ?? "https://api.speedyvan.uk");

export default function ReviewPage({
  params,
  searchParams,
}: {
  params: { reference: string };
  searchParams: { email?: string };
}) {
  const { reference } = params;
  const emailFromQuery = searchParams.email ?? "";

  const [email, setEmail] = useState(emailFromQuery);
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (rating === 0) {
      setError("Please select a star rating.");
      return;
    }
    if (!comment.trim()) {
      setError("Please write a short review.");
      return;
    }
    setError("");
    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/booking/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reference, email: email.trim(), rating, comment: comment.trim() }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        setError(json.error ?? "Failed to submit review. Please check your email and try again.");
      } else {
        setSuccess(true);
      }
    } catch {
      setError("Unable to reach the server. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center py-12 px-4">
        <div
          className="max-w-md w-full rounded-3xl border border-amber-900/20 p-8 text-center"
          style={{
            background: "rgba(255,255,255,0.04)",
            boxShadow: "0 0 0 1px rgba(245,158,11,0.15), 0 8px 32px rgba(0,0,0,0.4)",
          }}
        >
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-amber-500/15 mb-6">
            <span className="text-3xl">⭐</span>
          </div>
          <h1 className="text-2xl font-black text-white mb-2">Thank you!</h1>
          <p className="text-white/55 mb-8">
            Your review for booking <span className="font-mono font-black text-white">{reference}</span> has been submitted.
            We really appreciate your feedback.
          </p>
          <Link
            href="/"
            className="inline-block font-black text-black py-3 px-8 rounded-xl text-sm transition hover:opacity-90 active:scale-95"
            style={{ background: "linear-gradient(135deg, #F59E0B 0%, #EA580C 100%)" }}
          >
            Back to home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] py-12 px-4">
      <div className="max-w-md mx-auto space-y-6">
        <div className="text-center">
          <Link href="/" className="inline-block mb-5">
            <span className="text-2xl font-extrabold text-white">
              Speedy<span className="text-amber-400">Van</span>
            </span>
          </Link>
          <h1 className="text-2xl font-black text-white">Leave a review</h1>
          <p className="mt-1 text-white/40 text-sm">
            Booking{" "}
            <span className="font-mono font-semibold text-white/70">{reference}</span>
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-amber-900/20 p-6 space-y-5"
          style={{
            background: "rgba(255,255,255,0.04)",
            boxShadow: "0 0 0 1px rgba(245,158,11,0.15), 0 8px 32px rgba(0,0,0,0.4)",
          }}
        >
          {/* Email */}
          {!emailFromQuery && (
            <div>
              <label className="block text-sm font-medium text-white/55 mb-1.5">
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="The email you booked with"
                className="w-full rounded-xl border border-amber-900/20 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder-white/25 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-transparent"
              />
            </div>
          )}

          {/* Stars */}
          <div>
            <label className="block text-sm font-medium text-white/55 mb-2">
              How would you rate your experience?
            </label>
            <div className="flex gap-2" role="group" aria-label="Star rating">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onMouseEnter={() => setHovered(star)}
                  onMouseLeave={() => setHovered(0)}
                  onClick={() => setRating(star)}
                  className="text-3xl transition-transform hover:scale-110 focus:outline-none"
                  aria-label={`${star} star${star !== 1 ? "s" : ""}`}
                >
                  <span className={star <= (hovered || rating) ? "text-amber-400" : "text-white/15"}>
                    ★
                  </span>
                </button>
              ))}
            </div>
            {rating > 0 && (
              <p className="text-xs text-white/40 mt-1">
                {["", "Poor", "Below average", "Average", "Good", "Excellent"][rating]}
              </p>
            )}
          </div>

          {/* Comment */}
          <div>
            <label className="block text-sm font-medium text-white/55 mb-1.5">
              Your review
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              required
              maxLength={2000}
              placeholder="Tell us about your experience — how was the driver, the van, punctuality?"
              className="w-full rounded-xl border border-amber-900/20 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder-white/25 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-transparent resize-none"
            />
            <p className="text-xs text-white/40 text-right mt-1">{comment.length}/2000</p>
          </div>

          {error && (
            <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{error}</p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full font-black text-black py-3 rounded-xl text-sm transition hover:opacity-90 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
            style={{ background: "linear-gradient(135deg, #F59E0B 0%, #EA580C 100%)" }}
          >
            {submitting ? (
              <span className="flex items-center justify-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-black/30 border-t-transparent" />
                Submitting...
              </span>
            ) : "Submit review"}
          </button>
        </form>
      </div>
    </div>
  );
}
