"use client";

import { getApiBaseUrl } from "@/lib/api-base";
import { useEffect, useRef, useState } from "react";
import { useBooking } from "@/lib/booking-store";
import { isReleasableCheckoutRecovery, isVerifiedCheckoutRecovery } from "./checkout-session";

const API_BASE = getApiBaseUrl();

/** Resolve a restored checkout through the existing reference-and-email tracking check. */
export function CheckoutRecovery() {
  const { state, dispatch } = useBooking();
  const restoredAttempt = useRef(state.checkoutLocked && !state.clientSecret);
  const [retry, setRetry] = useState(0);
  const [loading, setLoading] = useState(false);
  const [abandoning, setAbandoning] = useState(false);
  const [checkedBooking, setCheckedBooking] = useState<unknown>(null);
  const [missingBookingChecked, setMissingBookingChecked] = useState(false);
  const [message, setMessage] = useState("");
  const [abandonError, setAbandonError] = useState("");
  const needsRecovery = restoredAttempt.current && state.checkoutLocked && !state.clientSecret;
  const canCheck = needsRecovery && Boolean(state.bookingRef && state.customerEmail);
  const verified = isVerifiedCheckoutRecovery(checkedBooking, state.bookingRef, state.bookingId);
  const releasable = isReleasableCheckoutRecovery(checkedBooking, state.bookingRef, state.bookingId);
  const canReleaseMissingBooking = missingBookingChecked && !checkedBooking;

  useEffect(() => {
    if (!canCheck) return;
    const controller = new AbortController();
    setLoading(true);
    setCheckedBooking(null);
    setMissingBookingChecked(false);
    setMessage("");

    async function checkBooking() {
      try {
        const response = await fetch(
          `${API_BASE}/booking/track/${encodeURIComponent(state.bookingRef)}?email=${encodeURIComponent(state.customerEmail.trim())}&recovery=1`,
          { signal: controller.signal, cache: "no-store" },
        );
        const payload = await response.json();
        if (controller.signal.aborted) return;
        if (payload?.success && payload.data?.found === false) {
          if (!state.bookingId && !state.clientSecret) {
            dispatch({ type: "RELEASE_MISSING_CHECKOUT" });
            return;
          }
          setMissingBookingChecked(true);
          setMessage("No booking was found for this interrupted checkout. Unlock your quote to continue.");
          return;
        }
        if (!response.ok || !payload?.success) {
          if (payload?.code === "NOT_FOUND") {
            if (!state.bookingId && !state.clientSecret) {
              dispatch({ type: "RELEASE_MISSING_CHECKOUT" });
              return;
            }
            setMissingBookingChecked(true);
            setMessage("No booking was found for this interrupted checkout. Unlock your quote to continue.");
            return;
          }
          setMessage("We couldn't verify this booking. Please retry or contact us with your booking reference.");
          return;
        }
        if (isVerifiedCheckoutRecovery(payload.data, state.bookingRef, state.bookingId)) {
          setCheckedBooking(payload.data);
          return;
        }
        if (isReleasableCheckoutRecovery(payload.data, state.bookingRef, state.bookingId)) {
          setCheckedBooking(payload.data);
          setMessage(payload.data?.status === "CANCELLED"
            ? "This unpaid checkout was already cancelled. You can continue with a fresh quote."
            : "This checkout has not been paid. Cancel the interrupted attempt to unlock your quote and continue.");
          return;
        }
        setMessage(payload.data?.reference === state.bookingRef && payload.data?.status === "CANCELLED"
          ? "This booking is cancelled. Please contact us to check any payment or refund before booking again."
          : "We have not verified a completed payment for this checkout. Please wait and check again, or contact us before making another payment.");
      } catch {
        if (!controller.signal.aborted) setMessage("We couldn't reach booking support. Please check your connection and retry, or call us.");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }
    void checkBooking();
    return () => controller.abort();
  }, [canCheck, dispatch, retry, state.bookingId, state.bookingRef, state.clientSecret, state.customerEmail]);

  if (!needsRecovery) return null;

  function startAnotherQuote() {
    if (!isVerifiedCheckoutRecovery(checkedBooking, state.bookingRef, state.bookingId)) return;
    try { localStorage.removeItem("sv_booking_draft_v1"); } catch { /* The verified state can still be cleared in memory. */ }
    dispatch({ type: "CHECKOUT_COMPLETE" });
  }

  async function releaseInterruptedCheckout() {
    const canReleaseCheckedBooking = isReleasableCheckoutRecovery(checkedBooking, state.bookingRef, state.bookingId);
    if ((!canReleaseCheckedBooking && !canReleaseMissingBooking) || abandoning) return;
    setAbandoning(true);
    setAbandonError("");
    try {
      const booking = checkedBooking as Record<string, unknown>;
      if (canReleaseCheckedBooking && booking.status === "PENDING") {
        const response = await fetch(`${API_BASE}/booking/track/${encodeURIComponent(state.bookingRef)}/cancel`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          cache: "no-store",
          body: JSON.stringify({
            email: state.customerEmail.trim(),
            reason: "Customer restarted an interrupted unpaid checkout.",
          }),
        });
        const payload = await response.json().catch(() => null);
        if (!response.ok || !payload?.success) {
          throw new Error("Unable to cancel the interrupted checkout.");
        }
      }
      dispatch({ type: "ABANDON_CHECKOUT" });
    } catch {
      setAbandonError("We couldn't unlock this checkout safely. Please call us before trying another payment.");
    } finally {
      setAbandoning(false);
    }
  }

  return (
    <section className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm leading-6 text-amber-100" aria-live="polite">
      <h2 className="font-bold text-white">{verified ? "Your existing booking is confirmed and paid" : "Check your previous checkout"}</h2>
      {loading ? (
        <p role="status" className="mt-2">Checking your booking and payment status…</p>
      ) : verified ? (
        <>
          <p className="mt-2">No further payment is needed for booking {state.bookingRef}. You can view it or start a separate quote.</p>
          <div className="mt-3 flex flex-wrap gap-3">
            <a href={`/track?ref=${encodeURIComponent(state.bookingRef)}`} className="inline-flex min-h-11 items-center rounded-xl border border-amber-400/40 px-4 font-bold underline">View existing booking</a>
            <button type="button" onClick={startAnotherQuote} className="min-h-11 rounded-xl bg-amber-400 px-4 font-bold text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">Start another quote</button>
          </div>
        </>
      ) : canCheck ? (
        <>
          {message && <p className="mt-2" role="status">{message}</p>}
          {abandonError && <p className="mt-2 text-red-200" role="alert">{abandonError}</p>}
          <div className="mt-3 flex flex-wrap gap-3">
            {(releasable || canReleaseMissingBooking) && (
              <button type="button" disabled={abandoning} onClick={releaseInterruptedCheckout} className="min-h-11 rounded-xl bg-amber-400 px-4 font-bold text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white disabled:opacity-40">
                {abandoning ? "Unlocking..." : "Cancel interrupted checkout and continue"}
              </button>
            )}
            <button type="button" disabled={loading || abandoning} onClick={() => setRetry((value) => value + 1)} className="min-h-11 rounded-xl border border-amber-400/40 px-4 font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white disabled:opacity-40">Check status again</button>
          </div>
        </>
      ) : (
        <p className="mt-2">We do not have a booking reference to verify this attempt. Please call us before starting another booking or payment.</p>
      )}
    </section>
  );
}
