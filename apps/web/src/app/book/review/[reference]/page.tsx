"use client";

import { useState } from "react";
import Link from "next/link";

const API_BASE =
  process.env.NODE_ENV === "development"
    ? "http://localhost:4000"
    : (process.env.NEXT_PUBLIC_API_URL ?? "https://api.speedy-van.co.uk");

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
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center py-12 px-4">
        <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200 shadow-sm p-8 text-center">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100 mb-6">
            <span className="text-3xl">⭐</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Thank you!</h1>
          <p className="text-slate-600 mb-8">
            Your review for booking <span className="font-mono font-bold">{reference}</span> has been submitted.
            We really appreciate your feedback.
          </p>
          <Link
            href="/"
            className="inline-block bg-yellow-400 hover:bg-yellow-300 text-slate-900 font-semibold py-3 px-8 rounded-xl text-sm transition"
          >
            Back to home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-md mx-auto space-y-6">
        <div className="text-center">
          <Link href="/" className="inline-block mb-5">
            <span className="text-2xl font-extrabold text-slate-900">
              Speedy<span className="text-yellow-400">Van</span>
            </span>
          </Link>
          <h1 className="text-2xl font-bold text-slate-900">Leave a review</h1>
          <p className="mt-1 text-slate-500 text-sm">
            Booking{" "}
            <span className="font-mono font-semibold text-slate-700">{reference}</span>
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5"
        >
          {/* Email */}
          {!emailFromQuery && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="The email you booked with"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
              />
            </div>
          )}

          {/* Stars */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
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
                  <span className={star <= (hovered || rating) ? "text-yellow-400" : "text-slate-200"}>
                    ★
                  </span>
                </button>
              ))}
            </div>
            {rating > 0 && (
              <p className="text-xs text-slate-400 mt-1">
                {["", "Poor", "Below average", "Average", "Good", "Excellent"][rating]}
              </p>
            )}
          </div>

          {/* Comment */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Your review
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              required
              maxLength={2000}
              placeholder="Tell us about your experience — how was the driver, the van, punctuality?"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent resize-none"
            />
            <p className="text-xs text-slate-400 text-right mt-1">{comment.length}/2000</p>
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-yellow-400 hover:bg-yellow-300 active:scale-95 transition text-slate-900 font-semibold py-3 rounded-xl text-sm disabled:opacity-60"
          >
            {submitting ? (
              <span className="flex items-center justify-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-900 border-t-transparent" />
                Submitting...
              </span>
            ) : "Submit review"}
          </button>
        </form>
      </div>
    </div>
  );
}
