"use client";

import { useState, useRef, useEffect, useCallback, FormEvent } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useBooking } from "@/lib/booking-store";
import { useRouter } from "next/navigation";
import { trackPurchase } from "@/lib/analytics";
import { UpsellPanel, type UpsellSelection } from "./UpsellPanel";
import { PriceExplainerLink } from "./PriceExplainerLink";

const STRIPE_PK = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "";
const stripePromise = STRIPE_PK ? loadStripe(STRIPE_PK, { locale: "en-GB" }) : null;
const API_BASE =
  process.env.NODE_ENV === "development"
    ? "http://localhost:4000"
    : (process.env.NEXT_PUBLIC_API_URL ?? "https://api.speedy-van.co.uk");

const CARD_STYLE = {
  hidePostalCode: true,
  style: {
    base: {
      fontSize: "15px",
      color: "#0f172a",
      fontFamily: "system-ui, sans-serif",
      "::placeholder": { color: "#94a3b8" },
    },
    invalid: { color: "#ef4444" },
  },
};

function BookingSummary() {
  const { state } = useBooking();
  const date = state.selectedDate
    ? new Date(state.selectedDate + "T12:00:00Z").toLocaleDateString("en-GB", {
        weekday: "long",
        day: "numeric",
        month: "long",
      })
    : "";
  const slotLabel =
    { morning: "Morning", afternoon: "Afternoon", evening: "Evening" }[state.selectedTimeSlot] || "";

  return (
    <div className="bg-slate-50 rounded-2xl border border-slate-200 p-4 space-y-2 text-sm">
      <h3 className="font-semibold text-slate-800">Order summary</h3>
      <div className="flex justify-between">
        <span className="text-slate-600">Service</span>
        <span className="font-medium text-slate-900">{state.serviceName}</span>
      </div>
      {state.pickup && (
        <div className="flex justify-between gap-4">
          <span className="text-slate-600 shrink-0">From</span>
          <span className="font-medium text-slate-900 text-right truncate">{state.pickup.address}</span>
        </div>
      )}
      {state.dropoff && (
        <div className="flex justify-between gap-4">
          <span className="text-slate-600 shrink-0">To</span>
          <span className="font-medium text-slate-900 text-right truncate">{state.dropoff.address}</span>
        </div>
      )}
      {date && (
        <div className="flex justify-between">
          <span className="text-slate-600">Date</span>
          <span className="font-medium text-slate-900">
            {date}, {slotLabel}
          </span>
        </div>
      )}
      <div className="border-t border-slate-200 pt-2 flex justify-between font-bold text-base">
        <span>Total</span>
        <span>£{state.clientTotal.toFixed(2)}</span>
      </div>
      <div className="pt-1">
        <PriceExplainerLink />
      </div>
    </div>
  );
}

interface CheckoutFormProps {
  onComplete: (bookingRef: string) => void;
}

function CheckoutForm({ onComplete }: CheckoutFormProps) {
  const { state, dispatch } = useBooking();
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Customer fields
  const [name, setName] = useState(state.customerName);
  const [email, setEmail] = useState(state.customerEmail);
  const [phone, setPhone] = useState(state.customerPhone);

  // Snapshot of upsells already baked into clientTotal at Step 3
  const initialUpsellsRef = useRef<UpsellSelection>({
    needsPacking: state.needsPacking,
    needsAssembly: state.needsAssembly,
    helpersCount: state.helpersCount,
  });
  // Original price before any upsell changes — used to restore when user deselects
  const initialPriceRef = useRef<number>(state.clientTotal);
  const [pricingUpdating, setPricingUpdating] = useState(false);
  const [pricingError, setPricingError] = useState(false);

  // Guard against duplicate purchase events
  const purchaseTrackedRef = useRef(false);

  // ─── Inactivity helper (25s no input → bottom sheet with Call / WhatsApp) ───
  const [showHelper, setShowHelper] = useState(false);
  const helperDismissedRef = useRef(false);
  const inactivityTimerRef = useRef<number | null>(null);

  const resetInactivityTimer = useCallback(() => {
    if (helperDismissedRef.current || submitting) return;
    if (inactivityTimerRef.current) {
      window.clearTimeout(inactivityTimerRef.current);
    }
    inactivityTimerRef.current = window.setTimeout(() => {
      setShowHelper(true);
    }, 25_000);
  }, [submitting]);

  useEffect(() => {
    // Re-check session-scoped dismissal so a re-mount doesn't re-trigger.
    try {
      if (sessionStorage.getItem("sv_pay_helper_dismissed") === "1") {
        helperDismissedRef.current = true;
        return;
      }
    } catch {
      /* ignore */
    }
    resetInactivityTimer();
    return () => {
      if (inactivityTimerRef.current) window.clearTimeout(inactivityTimerRef.current);
    };
  }, [resetInactivityTimer]);

  function dismissHelper() {
    helperDismissedRef.current = true;
    try {
      sessionStorage.setItem("sv_pay_helper_dismissed", "1");
    } catch {
      /* ignore */
    }
    setShowHelper(false);
    if (inactivityTimerRef.current) {
      window.clearTimeout(inactivityTimerRef.current);
      inactivityTimerRef.current = null;
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    if (pricingUpdating) {
      return setError("Please wait — we're updating your price.");
    }
    if (pricingError) {
      return setError("We couldn't update your price. Please toggle an option to retry.");
    }
    if (!name.trim() || !email.trim() || !phone.trim()) {
      return setError("Please fill in all your details.");
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return setError("Please enter a valid email address.");
    }

    setSubmitting(true);

    try {
      // 1. Create booking → get clientSecret + bookingId
      const createRes = await fetch(`${API_BASE}/booking/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: name.trim(),
          customerEmail: email.trim(),
          customerPhone: phone.trim(),
          serviceSlug: state.serviceSlug,
          serviceName: state.serviceName,
          serviceVariant: state.serviceVariant || undefined,
          pickupAddress: state.pickup!.address,
          pickupPostcode: state.pickup!.postcode,
          pickupLat: state.pickup!.lat,
          pickupLng: state.pickup!.lng,
          pickupFloor: state.pickupFloor,
          pickupHasLift: state.pickupHasLift,
          dropoffAddress: state.dropoff!.address,
          dropoffPostcode: state.dropoff!.postcode,
          dropoffLat: state.dropoff!.lat,
          dropoffLng: state.dropoff!.lng,
          dropoffFloor: state.dropoffFloor,
          dropoffHasLift: state.dropoffHasLift,
          distanceMiles: state.distanceMiles,
          selectedDate: state.selectedDate,
          selectedTimeSlot: state.selectedTimeSlot,
          helpersCount: state.helpersCount,
          needsPacking: state.needsPacking,
          needsAssembly: state.needsAssembly,
          selectedItems: state.items,
          clientTotal: state.clientTotal,
        }),
      });

      const createJson = await createRes.json();
      if (!createJson.success) {
        throw new Error(createJson.error || "Failed to create booking.");
      }

      const { bookingId, bookingRef, clientSecret, totalPrice } = createJson.data as {
        bookingId: string;
        bookingRef: string;
        clientSecret: string | null;
        totalPrice: number;
      };

      // Server is the source of truth for the paid amount.
      const finalAmount = typeof totalPrice === "number" ? totalPrice : state.clientTotal;
      dispatch({ type: "SET_BOOKING", bookingId, bookingRef, clientSecret: clientSecret || "", total: finalAmount });
      dispatch({ type: "SET_CUSTOMER", name, email, phone });

      // 2. Confirm payment with Stripe if we have a clientSecret
      if (clientSecret && stripe && elements) {
        const cardEl = elements.getElement(CardElement);
        if (!cardEl) throw new Error("Card element not found.");

        const { error: stripeErr, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
          payment_method: { card: cardEl, billing_details: { name, email } },
        });

        if (stripeErr) {
          throw new Error(stripeErr.message || "Payment failed.");
        }

        // 3. Confirm booking on server
        const confirmRes = await fetch(`${API_BASE}/booking/confirm`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            bookingId,
            stripePaymentIntentId: paymentIntent!.id,
          }),
        });
        const confirmJson = await confirmRes.json();
        if (!confirmJson.success) {
          throw new Error(confirmJson.error || "Failed to confirm booking.");
        }
      }

      // Fire purchase conversion (GA4 + Meta Pixel) exactly once with the
      // server-confirmed paid amount.
      if (!purchaseTrackedRef.current) {
        purchaseTrackedRef.current = true;
        try {
          trackPurchase(bookingRef, finalAmount, state.serviceSlug);
        } catch {
          /* ignore tracking failures */
        }
      }

      onComplete(bookingRef);
      // Store email for booking detection popup
      try { localStorage.setItem("sv-customer-email", email.trim()); } catch { /* ignore */ }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5"
      noValidate
      onKeyDown={resetInactivityTimer}
      onFocusCapture={resetInactivityTimer}
      onPointerDown={resetInactivityTimer}
    >
      {/* Upsell panel */}
      <UpsellPanel
        initial={initialUpsellsRef.current}
        initialPrice={initialPriceRef.current}
        onUpdatingChange={setPricingUpdating}
        onPriceErrorChange={setPricingError}
      />

      {/* Customer details */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
        <h2 className="font-semibold text-slate-800">Your details</h2>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Full name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoComplete="name"
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent"
            placeholder="Jane Smith"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Email address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            inputMode="email"
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent"
            placeholder="jane@example.com"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Phone number</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            autoComplete="tel-national"
            inputMode="tel"
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent"
            placeholder="+44 7700 900000"
          />
        </div>
      </div>

      {/* Stripe card */}
      {stripePromise ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <h2 className="font-semibold text-slate-800 mb-3">Payment details</h2>
          <div className="rounded-xl border border-slate-300 px-4 py-3.5">
            <CardElement options={CARD_STYLE} />
          </div>
          <p className="text-xs text-slate-400 mt-2 flex items-center gap-1">
            🔒 Secured by Stripe — we never store your card details
          </p>
        </div>
      ) : (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-sm text-amber-800">
          Payment processing is not configured. Your booking will be created and you can pay later.
        </div>
      )}

      {error && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
          {error}
        </div>
      )}

      {/* Trust strip */}
      <ul
        className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 text-[11px] sm:text-xs text-slate-500"
        aria-label="Trust signals"
      >
        <li className="inline-flex items-center gap-1"><span aria-hidden="true">🔒</span> Secure Stripe payment</li>
        <li className="inline-flex items-center gap-1"><span aria-hidden="true">🛡️</span> Fully insured</li>
        <li className="inline-flex items-center gap-1"><span aria-hidden="true">↩️</span> Free cancellation up to 24h</li>
        <li className="inline-flex items-center gap-1"><span aria-hidden="true">⭐</span> 4.9/5 from 1,000+ moves</li>
      </ul>

      <button
        type="submit"
        disabled={submitting || pricingUpdating || pricingError || (!stripe && !!stripePromise)}
        className="btn-primary w-full py-3.5 rounded-xl font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {submitting ? (
          <span className="flex items-center justify-center gap-2">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-900 border-t-transparent" />
            Processing…
          </span>
        ) : pricingUpdating ? (
          "Updating price…"
        ) : (
          `Pay £${state.clientTotal.toFixed(2)} & Confirm Booking`
        )}
      </button>

      {/* Inactivity helper bottom sheet */}
      {showHelper && (
        <div
          className="fixed inset-x-0 bottom-0 z-50 px-3 pb-3 sm:flex sm:justify-center sm:items-end"
          role="dialog"
          aria-labelledby="pay-helper-title"
        >
          <div className="mx-auto w-full max-w-md rounded-2xl bg-white shadow-2xl border border-slate-200 p-4 animate-in slide-in-from-bottom duration-300">
            <div className="flex items-start gap-3">
              <span className="text-2xl" aria-hidden>
                💬
              </span>
              <div className="flex-1 min-w-0">
                <p id="pay-helper-title" className="text-sm font-bold text-slate-900">
                  Need help with payment?
                </p>
                <p className="text-xs text-slate-600 mt-0.5">
                  Our team is here to help — just one tap away.
                </p>
              </div>
              <button
                type="button"
                onClick={dismissHelper}
                aria-label="Dismiss"
                className="-mt-1 -mr-1 h-8 w-8 rounded-full text-slate-400 hover:bg-slate-100"
              >
                ×
              </button>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <a
                href="tel:01202129746"
                onClick={dismissHelper}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 text-white text-sm font-semibold py-3 hover:bg-slate-800"
              >
                📞 Call us
              </a>
              <a
                href="https://wa.me/message/J6EO772GDPHFO1"
                target="_blank"
                rel="noopener noreferrer"
                onClick={dismissHelper}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 text-white text-sm font-semibold py-3 hover:bg-emerald-600"
              >
                💬 WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}
    </form>
  );
}

export function Step4Payment() {
  const { state, dispatch } = useBooking();
  const router = useRouter();

  function handleComplete(bookingRef: string) {
    dispatch({ type: "RESET" });
    router.push(`/book/confirmation?ref=${bookingRef}`);
  }

  const content = (
    <div className="space-y-6">
      <div>
        <button
          type="button"
          onClick={() => {
            dispatch({ type: "RESET_UPSELLS" });
            dispatch({ type: "SET_STEP", step: 3 });
          }}
          className="text-sm text-slate-500 hover:text-slate-700 flex items-center gap-1 mb-4"
        >
          ← Back
        </button>
        <h1 className="text-2xl font-bold text-slate-900 mb-1">Almost there!</h1>
        <p className="text-slate-600">Review your booking and complete payment.</p>
      </div>

      <BookingSummary />

      <CheckoutForm onComplete={handleComplete} />
    </div>
  );

  if (stripePromise) {
    return (
      <Elements stripe={stripePromise}>
        {content}
      </Elements>
    );
  }

  return content;
}
