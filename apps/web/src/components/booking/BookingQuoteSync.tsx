"use client";

import { useEffect, useRef } from "react";
import { useBooking } from "@/lib/booking-store";
import { canRequestBookingQuote, getBookingPricingKey, getBookingPricingRequest } from "@/lib/booking-quote";
import { parsePricingResult } from "./quote-response";

const API_BASE = process.env.NODE_ENV === "development"
  ? "http://localhost:4000"
  : (process.env.NEXT_PUBLIC_API_URL ?? "https://api.speedyvan.uk");

/** One request owner stays mounted when the customer goes Back or edits a previous step. */
export function BookingQuoteSync() {
  const { state, dispatch } = useBooking();
  const sequence = useRef(0);
  const inputKey = getBookingPricingKey(state);
  const requestBody = JSON.stringify(getBookingPricingRequest(state));
  const eligible = !state.checkoutLocked && state.step >= 2 && canRequestBookingQuote(state);
  const shouldFetch = eligible && state.quoteInputKey !== inputKey && state.quoteStatus !== "failed";

  const revision = state.quoteRevision;

  useEffect(() => {
    if (!shouldFetch) return;
    const controller = new AbortController();
    const requestId = `${++sequence.current}`;
    dispatch({ type: "QUOTE_REQUESTED", inputKey, requestId });
    const timer = window.setTimeout(async () => {
      let failureMessage = "We couldn't update your quote. Please retry before continuing.";
      try {
        const response = await fetch(`${API_BASE}/pricing/calculate`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          cache: "no-store",
          signal: controller.signal,
          body: requestBody,
        });
        const json = await response.json();
        if (controller.signal.aborted) return;
        const pricing = parsePricingResult(json.data);
        if (!response.ok || !json.success || !pricing) {
          throw new Error("We couldn't update your quote. Please retry before continuing.");
        }
        if (!pricing.days.length) {
          failureMessage = "No dates are available for this move right now. Please retry later or contact us.";
          throw new Error(failureMessage);
        }
        dispatch({ type: "QUOTE_RECEIVED", inputKey, requestId, pricing });
      } catch {
        if (controller.signal.aborted) return;
        dispatch({ type: "QUOTE_FAILED", inputKey, requestId,
          error: failureMessage });
      }
    }, 250);
    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [dispatch, inputKey, requestBody, revision, shouldFetch]);

  return null;
}
