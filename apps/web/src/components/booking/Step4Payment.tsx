"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import type { FormEvent, ReactNode } from "react";
import { loadStripe } from "@stripe/stripe-js/pure";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { serialiseBookingDraft, useBooking, type SelectedItem, type TimeSlot } from "@/lib/booking-store";
import { STEP_PRIMARY_CTA_ID } from "@/lib/booking-steps";
import { useRouter } from "next/navigation";
import { trackPurchase } from "@/lib/analytics";
import { PriceExplainerLink } from "./PriceExplainerLink";
import { CheckoutRecovery } from "./CheckoutRecovery";
import { completeCardPayment, parseBookingPaymentSession, type BookingPaymentSession } from "./checkout-session";

const STRIPE_PK = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "";
type StripeClientPromise = ReturnType<typeof loadStripe>;
let cachedStripePromise: StripeClientPromise | null = null;

/** Route prefetch may evaluate this module; initialise the SDK only after payment mounts. */
function getStripeClientPromise(): StripeClientPromise | null {
  if (!STRIPE_PK) return null;
  if (!cachedStripePromise) {
    // Elements accepts a null result; keep SDK failures in the existing unavailable state.
    cachedStripePromise = loadStripe(STRIPE_PK, { locale: "en-GB" }).catch(() => null);
  }
  return cachedStripePromise;
}
const API_BASE =
  process.env.NODE_ENV === "development"
    ? "http://localhost:4000"
    : (process.env.NEXT_PUBLIC_API_URL ?? "https://api.speedyvan.uk");

const money = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
});

const BOOKING_ERROR_MESSAGE =
  "We couldn't create your booking right now. Please retry, or contact us if it keeps happening.";

const CARD_STYLE = {
  hidePostalCode: true,
  style: {
    base: {
      fontSize: "16px",
      color: "#FFFFFF",
      fontFamily: "Manrope, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif",
      "::placeholder": { color: "rgba(255,255,255,0.30)" },
      backgroundColor: "transparent",
    },
    invalid: { color: "#f87171" },
  },
};

const SLOT_LABELS: Record<TimeSlot, string> = {
  morning: "Morning",
  afternoon: "Afternoon",
  evening: "Evening",
};

const reviewDate = new Intl.DateTimeFormat("en-GB", {
  weekday: "long",
  day: "numeric",
  month: "long",
  timeZone: "Europe/London",
});

interface CheckoutFormProps {
  onComplete: (bookingRef: string) => void;
  stripePromise: StripeClientPromise | null;
}

function shortAddress(address: string): string {
  return address.length > 92 ? `${address.slice(0, 89)}...` : address;
}

function floorLabel(floor: number, hasLift: boolean): string {
  const level = floor === 0 ? "Ground floor" : `Floor ${floor}`;
  return `${level}, ${hasLift ? "lift available" : "no lift"}`;
}

function formatDate(iso: string): string {
  return reviewDate.format(new Date(`${iso}T12:00:00Z`));
}

function itemKey(item: SelectedItem, index: number): string {
  return item.lineId ?? `${item.name}-${item.roomId ?? "default"}-${index}`;
}

function ReviewSection({
  title,
  editStep,
  children,
}: {
  title: string;
  editStep: 1 | 2 | 3 | 4;
  children: ReactNode;
}) {
  const { state, dispatch } = useBooking();
  const router = useRouter();

  return (
    <section
      className="rounded-2xl p-5"
      style={{ background: "rgba(255,255,255,0.04)", boxShadow: "0 0 0 1px rgba(245,158,11,0.15), 0 8px 32px rgba(0,0,0,0.4)" }}
    >
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-base font-black text-white">{title}</h2>
        <button
          type="button"
          disabled={state.checkoutLocked}
          onClick={() => {
            if (editStep === 1) {
              router.push("/#get-quote");
              return;
            }
            dispatch({ type: "SET_STEP", step: editStep });
          }}
          className="min-h-10 rounded-lg px-3 text-sm font-bold text-amber-400 transition hover:text-amber-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Edit
        </button>
      </div>
      <div className="mt-4 text-sm leading-6 text-white/60">{children}</div>
    </section>
  );
}

function BookingReview() {
  const { state } = useBooking();
  const extras = [
    state.needsPacking ? "Packing service" : "",
    state.needsAssembly ? "Assembly or disassembly" : "",
    state.helpersCount > 0 ? `${state.helpersCount} extra helper${state.helpersCount > 1 ? "s" : ""}` : "",
  ].filter(Boolean);

  return (
    <div className="space-y-4">
      <ReviewSection title="Service" editStep={1}>
        <p className="font-bold text-white">{state.serviceName || "Not selected"}</p>
      </ReviewSection>

      <ReviewSection title="Journey and access" editStep={2}>
        <div className="grid gap-3 md:grid-cols-2">
          <div className="rounded-xl p-4" style={{ background: "rgba(245,158,11,0.07)", boxShadow: "0 0 0 1px rgba(245,158,11,0.15)" }}>
            <p className="text-xs font-bold uppercase tracking-widest text-amber-400/70">Pickup</p>
            <p className="mt-1 font-bold text-white">
              {state.pickup ? shortAddress(state.pickup.address) : "Not confirmed"}
            </p>
            <p className="mt-1 text-white/50">{floorLabel(state.pickupFloor, state.pickupHasLift)}</p>
          </div>
          <div className="rounded-xl p-4" style={{ background: "rgba(234,88,12,0.07)", boxShadow: "0 0 0 1px rgba(234,88,12,0.15)" }}>
            <p className="text-xs font-bold uppercase tracking-widest text-orange-400/70">Drop-off</p>
            <p className="mt-1 font-bold text-white">
              {state.dropoff ? shortAddress(state.dropoff.address) : "Not confirmed"}
            </p>
            <p className="mt-1 text-white/50">{floorLabel(state.dropoffFloor, state.dropoffHasLift)}</p>
          </div>
        </div>
        {state.distanceMiles > 0 && (
          <p className="mt-3 font-bold text-amber-400">{state.distanceMiles.toFixed(1)} miles · calculated route</p>
        )}
      </ReviewSection>

      <ReviewSection title="Items and help" editStep={3}>
        {state.items.length > 0 ? (
          <ul className="divide-y divide-white/8 rounded-xl" style={{ boxShadow: "0 0 0 1px rgba(255,255,255,0.08)" }}>
            {state.items.map((item, index) => (
              <li key={itemKey(item, index)} className="flex items-start justify-between gap-3 px-4 py-3">
                <span>
                  <span className="block font-bold text-white">{item.name}</span>
                  {item.roomName && <span className="block text-xs text-white/40">{item.roomName}</span>}
                </span>
                <span className="shrink-0 font-black text-amber-400">×{item.quantity}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-white/40">No items added.</p>
        )}
        <div className="mt-3 rounded-xl p-4" style={{ background: "rgba(255,255,255,0.04)", boxShadow: "0 0 0 1px rgba(255,255,255,0.08)" }}>
          <p className="font-bold text-white">Extras</p>
          {extras.length > 0 ? (
            <ul className="mt-2 space-y-1">
              {extras.map((extra) => (
                <li key={extra} className="text-white/60">{extra}</li>
              ))}
            </ul>
          ) : (
            <p className="mt-1 text-white/40">No extra help selected.</p>
          )}
        </div>
      </ReviewSection>

      <ReviewSection title="Appointment and price" editStep={4}>
        <div
          className="flex flex-wrap items-start justify-between gap-3 rounded-xl p-4"
          style={{ background: "rgba(245,158,11,0.10)", boxShadow: "0 0 0 1px rgba(245,158,11,0.30)" }}
        >
          <div>
            <p className="font-black text-white">
              {state.selectedDate && state.selectedTimeSlot
                ? `${formatDate(state.selectedDate)}, ${SLOT_LABELS[state.selectedTimeSlot]}`
                : "Not selected"}
            </p>
            <p className="mt-1 text-amber-100/55">Final amount is checked again before your booking is created.</p>
          </div>
          <p className="text-2xl font-black text-white">{state.checkoutLocked && !state.clientSecret ? "Check booking status" : money.format(state.clientTotal)}</p>
        </div>
        {state.priceBreakdown.length > 0 && (
          <div className="mt-3">
            <PriceExplainerLink />
          </div>
        )}
      </ReviewSection>
    </div>
  );
}

function CheckoutForm({ onComplete, stripePromise }: CheckoutFormProps) {
  const { state, dispatch } = useBooking();
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const submittingRef = useRef(false);
  const mounted = useRef(true);
  const [paymentUnavailable, setPaymentUnavailable] = useState(!STRIPE_PK);
  const [creationUncertain, setCreationUncertain] = useState(state.checkoutLocked && !state.clientSecret);
  const pendingSession = useRef<BookingPaymentSession | null>(parseBookingPaymentSession({
    bookingId: state.bookingId,
    bookingRef: state.bookingRef,
    clientSecret: state.clientSecret,
    totalPrice: state.clientTotal,
  }));

  useEffect(() => {
    mounted.current = true;
    let active = true;
    if (stripePromise) {
      void stripePromise.then((client) => {
        if (active) setPaymentUnavailable(!client);
      }).catch(() => {
        if (active) setPaymentUnavailable(true);
      });
    }
    return () => { active = false; mounted.current = false; };
  }, [stripePromise]);

  const [name, setName] = useState(state.customerName);
  const [email, setEmail] = useState(state.customerEmail);
  const [phone, setPhone] = useState(state.customerPhone);

  const purchaseTrackedRef = useRef(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    if (submittingRef.current || creationUncertain) return;
    if (!stripe || !elements || paymentUnavailable) {
      return setError("Online payment is unavailable right now. Please contact us to arrange your booking.");
    }
    const card = elements.getElement(CardElement);
    if (!card) return setError("Please wait for the secure payment form to load.");
    if (!state.pickup || !state.dropoff || !state.serviceSlug || state.items.length === 0 || state.distanceMiles <= 0) {
      return setError("Please check your journey and items before payment.");
    }
    if (state.quoteStatus !== "valid" || !state.selectedDate || !state.selectedTimeSlot || state.clientTotal <= 0) {
      return setError("Please choose a valid date and time before payment.");
    }
    if (!name.trim() || !email.trim() || !phone.trim()) {
      return setError("Please fill in all your details.");
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return setError("Please enter a valid email address.");
    }

    if (!/^(?:0|\+44|0044)\d{10}$/.test(phone.replace(/[\s()-]/g, ""))) {
      return setError("Please enter a valid UK phone number.");
    }

    submittingRef.current = true;
    setSubmitting(true);
    if (!pendingSession.current) {
      dispatch({ type: "SET_CUSTOMER", name: name.trim(), email: email.trim(), phone: phone.trim() });
    }
    dispatch({ type: "START_CHECKOUT" });
    try {
      localStorage.setItem("sv_booking_draft_v1", serialiseBookingDraft({
        ...state, checkoutLocked: true, customerName: name.trim(), customerEmail: email.trim(), customerPhone: phone.trim(),
      }));
    } catch { /* The in-memory checkout lock still protects this booking. */ }

    let waitingForCreateResponse = false;
    try {
      let session = pendingSession.current;
      if (!session) {
        waitingForCreateResponse = true;
        const createRes = await fetch(`${API_BASE}/booking/create`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            customerName: name.trim(),
            customerEmail: email.trim(),
            customerPhone: phone.trim(),
            serviceSlug: state.serviceSlug,
            entryServiceSlug: state.entryServiceSlug || undefined,
            serviceName: state.serviceName,
            serviceVariant: state.serviceVariant || undefined,
            pickupAddress: state.pickup!.address,
            pickupPostcode: state.pickup!.postcode,
            pickupLat: state.pickup!.lat,
            pickupLng: state.pickup!.lng,
            pickupFloor: state.pickupFloor,
            pickupHasLift: state.pickupHasLift,
            pickupCarryMetres: state.pickupCarryMetres,
            dropoffAddress: state.dropoff!.address,
            dropoffPostcode: state.dropoff!.postcode,
            dropoffLat: state.dropoff!.lat,
            dropoffLng: state.dropoff!.lng,
            dropoffFloor: state.dropoffFloor,
            dropoffHasLift: state.dropoffHasLift,
            dropoffCarryMetres: state.dropoffCarryMetres,
            hasNarrowAccess: state.hasNarrowAccess,
            hasPermitZone: state.hasPermitZone,
            distanceMiles: state.distanceMiles,
            selectedDate: state.selectedDate,
            selectedTimeSlot: state.selectedTimeSlot,
            helpersCount: state.helpersCount,
            needsPacking: state.needsPacking,
            needsAssembly: state.needsAssembly,
            ...(state.assemblyType ? { assemblyType: state.assemblyType, assemblyQty: state.assemblyQty } : {}),
            selectedItems: state.items,
            clientTotal: state.clientTotal,
            quoteToken: state.quoteToken || undefined,
          }),
        });
        const createJson = await createRes.json();
        if (!createJson || typeof createJson.success !== "boolean") {
          throw new Error("Invalid booking response.");
        }
        waitingForCreateResponse = false;
        if (!createRes.ok || !createJson.success) {
          dispatch({ type: "CHECKOUT_REJECTED" });
          if (createJson?.code === "PRICE_CHANGED") {
            dispatch({ type: "SET_QUOTE_STATUS", status: "stale", error: "Your quote has changed. Please choose your date and time again." });
            throw new Error("Your quote has changed. Please return to Date and time for a fresh price.");
          }
          if (createJson?.code === "QUOTE_EXPIRED") {
            dispatch({ type: "SET_QUOTE_STATUS", status: "stale", error: "Your quote expired. Please pick your date and time again to get a fresh price." });
            throw new Error("Your quote expired. Please go back and choose your date again.");
          }
          throw new Error(BOOKING_ERROR_MESSAGE);
        }
        session = parseBookingPaymentSession(createJson.data);
        if (!session) {
          setCreationUncertain(true);
          throw new Error("We couldn't open a secure payment session. Please contact us to check your booking before trying again.");
        }
        if (!mounted.current) return;
        pendingSession.current = session;
        try {
          localStorage.setItem("sv_booking_draft_v1", serialiseBookingDraft({
            ...state, checkoutLocked: true, bookingId: session.bookingId, bookingRef: session.bookingRef,
            clientSecret: session.clientSecret, clientTotal: session.totalPrice,
            customerName: name.trim(), customerEmail: email.trim(), customerPhone: phone.trim(),
          }));
        } catch { /* Never persist the payment client secret. */ }
        dispatch({ type: "SET_BOOKING", bookingId: session.bookingId, bookingRef: session.bookingRef, clientSecret: session.clientSecret, total: session.totalPrice });
        if (Math.round(session.totalPrice * 100) !== Math.round(state.clientTotal * 100)) {
          throw new Error(`Your confirmed price is now ${money.format(session.totalPrice)}. Review the updated total and select Pay again to continue.`);
        }
      }

      if (!mounted.current) return;
      await completeCardPayment(session, stripe, card, { name: name.trim(), email: email.trim() }, async (bookingId, paymentIntentId) => {
        const confirmRes = await fetch(`${API_BASE}/booking/confirm`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ bookingId, stripePaymentIntentId: paymentIntentId }),
        });
        const confirmJson = await confirmRes.json().catch(() => null);
        if (!confirmRes.ok || !confirmJson?.success) {
          if (confirmJson?.code === "BOOKING_CANCELLED") {
            throw new Error("Payment was received, but this booking is cancelled. Please contact us before booking again.");
          }
          throw new Error("We couldn't confirm your booking. Please retry confirmation or contact us; do not make another payment.");
        }
      });
      const { bookingRef, totalPrice: finalAmount } = session;

      if (!purchaseTrackedRef.current) {
        purchaseTrackedRef.current = true;
        try {
          trackPurchase(bookingRef, finalAmount, state.serviceSlug);
        } catch {
          /* ignore tracking failures */
        }
      }

      try { localStorage.removeItem("sv_booking_draft_v1"); } catch { /* Storage may be unavailable. */ }
      if (mounted.current) onComplete(bookingRef);
      try { localStorage.setItem("sv-customer-email", email.trim()); } catch { /* ignore */ }
    } catch (err) {
      if (!mounted.current) return;
      if (waitingForCreateResponse) {
        setCreationUncertain(true);
        setError("We couldn't check whether your booking was created. Please contact us before trying again.");
      } else {
        setError(err instanceof Error ? err.message : "Something went wrong. Please retry or contact us.");
      }
    } finally {
      submittingRef.current = false;
      if (mounted.current) setSubmitting(false);
    }
  }

  const inputStyle = { background: "rgba(255,255,255,0.05)", boxShadow: "0 0 0 1px rgba(255,255,255,0.10)" };
  const cardStyle = { background: "rgba(255,255,255,0.04)", boxShadow: "0 0 0 1px rgba(245,158,11,0.15), 0 8px 32px rgba(0,0,0,0.4)" };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5"
      noValidate
    >
      {/* ── Your details ── */}
      <div className="rounded-2xl p-5 space-y-4" style={cardStyle}>
        <h2 className="text-base font-black text-white">Your details</h2>
        <div>
          <label htmlFor="booking-customer-name" className="block text-sm font-medium text-white/60 mb-1.5">Full name</label>
          <input
            id="booking-customer-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={submitting || state.checkoutLocked}
            autoComplete="name"
            className="min-h-12 w-full rounded-xl px-4 py-3 text-base text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-amber-400"
            style={inputStyle}
            placeholder="Jane Smith"
          />
        </div>
        <div>
          <label htmlFor="booking-customer-email" className="block text-sm font-medium text-white/60 mb-1.5">Email address</label>
          <input
            id="booking-customer-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={submitting || state.checkoutLocked}
            autoComplete="email"
            inputMode="email"
            className="min-h-12 w-full rounded-xl px-4 py-3 text-base text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-amber-400"
            style={inputStyle}
            placeholder="jane@example.com"
          />
        </div>
        <div>
          <label htmlFor="booking-customer-phone" className="block text-sm font-medium text-white/60 mb-1.5">Phone number</label>
          <input
            id="booking-customer-phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            disabled={submitting || state.checkoutLocked}
            autoComplete="tel-national"
            inputMode="tel"
            className="min-h-12 w-full rounded-xl px-4 py-3 text-base text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-amber-400"
            style={inputStyle}
            placeholder="+44 7700 900000"
          />
        </div>
      </div>

      {/* ── Payment details ── */}
      {!paymentUnavailable && (!stripePromise || !stripe || !elements) ? (
        <div role="status" className="rounded-2xl p-5 text-sm text-amber-100" style={cardStyle}>
          Loading secure payment form…
        </div>
      ) : stripePromise && !paymentUnavailable ? (
        <div className="rounded-2xl p-5" style={cardStyle}>
          <h2 className="text-base font-black text-white mb-3">Payment details</h2>
          <div
            className="rounded-xl px-4 py-3.5"
            style={{ background: "rgba(255,255,255,0.06)", boxShadow: "0 0 0 1px rgba(245,158,11,0.20)" }}
          >
            <CardElement options={CARD_STYLE} />
          </div>
          <p className="text-xs text-white/35 mt-2">Secured by Stripe. We never store your card details.</p>
        </div>
      ) : (
        <div
          className="rounded-2xl p-4 text-sm"
          style={{ background: "rgba(245,158,11,0.08)", boxShadow: "0 0 0 1px rgba(245,158,11,0.20)" }}
        >
          <p className="font-bold text-amber-400">Online payment unavailable</p>
          <p className="mt-1 text-amber-100/60">Please contact us to arrange your booking. No online payment has been confirmed.</p>
        </div>
      )}

      {error && (
        <p role="alert" className="rounded-xl px-4 py-3 text-sm font-medium text-red-300" style={{ background: "rgba(239,68,68,0.10)", boxShadow: "0 0 0 1px rgba(239,68,68,0.20)" }}>
          {error}
        </p>
      )}

      {/* ── Trust signals ── */}
      <ul
        className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 text-[11px] sm:text-xs text-white/35"
        aria-label="Trust signals"
      >
        <li className="flex items-center gap-1"><span className="text-amber-500/70">✓</span> Secure Stripe payment</li>
        <li className="flex items-center gap-1"><span className="text-amber-500/70">✓</span> Final amount checked before booking</li>
        <li className="flex items-center gap-1"><span className="text-amber-500/70">✓</span> Free cancellation up to 48 hours</li>
        <li className="flex items-center gap-1"><span className="text-amber-500/70">✓</span> Partial refunds may apply</li>
      </ul>

      {/* ── Need help ── */}
      <div className="rounded-2xl p-5" style={cardStyle}>
        <h2 className="text-base font-black text-white">Need help?</h2>
        <p className="mt-1 text-sm leading-6 text-amber-100/55">
          Speak to the team before paying if anything in the booking needs checking.
        </p>
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          <a
            href="tel:07909032889"
            aria-label="Call us on 07909 032889"
            className="flex justify-center transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 rounded-full"
          >
            <Image src="/call-icon.png" alt="Call us" width={52} height={52} />
          </a>
          <a
            href="https://wa.me/447909032889"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center justify-center rounded-xl text-sm font-bold text-white/70 ring-1 ring-white/15 transition hover:bg-white/8 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
            style={{ background: "rgba(255,255,255,0.06)" }}
          >
            WhatsApp
          </a>
        </div>
      </div>

      {/* ── Pay CTA ── */}
      <button
        id={STEP_PRIMARY_CTA_ID}
        type="submit"
        disabled={submitting || creationUncertain || paymentUnavailable || !stripe || !elements || state.quoteStatus !== "valid" || state.clientTotal <= 0}
        className="flex min-h-12 w-full items-center justify-center rounded-xl px-5 text-base font-black text-black shadow-lg transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-booking-background disabled:cursor-not-allowed disabled:opacity-40"
        style={{ background: "linear-gradient(135deg, #F59E0B 0%, #EA580C 100%)" }}
      >
        {submitting ? (
          <span className="flex items-center justify-center gap-2">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-black border-t-transparent" />
            Processing...
          </span>
        ) : (
          creationUncertain ? "Check booking status" : `Pay ${money.format(state.clientTotal)} and confirm →`
        )}
      </button>
    </form>
  );
}

export function Step4Payment() {
  const { state, dispatch } = useBooking();
  const router = useRouter();
  const [stripePromise, setStripePromise] = useState<StripeClientPromise | null>(null);

  useEffect(() => {
    setStripePromise(getStripeClientPromise());
  }, []);

  function handleComplete(bookingRef: string) {
    dispatch({ type: "CHECKOUT_COMPLETE" });
    try { localStorage.removeItem("sv_booking_draft_v1"); } catch { /* Storage may be unavailable. */ }
    router.push(`/book/confirmation?ref=${encodeURIComponent(bookingRef)}`);
  }

  const content = (
    <div className="space-y-6">
      <div>
        <button
          type="button"
          disabled={state.checkoutLocked}
          onClick={() => dispatch({ type: "SET_STEP", step: 4 })}
          className="hidden"
        >
          <span aria-hidden="true">←</span> Back
        </button>
        <p className="text-xs font-bold uppercase tracking-widest text-amber-400">Step 4 of 4 · Review &amp; Pay</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight text-white">Review and pay</h1>
        <p className="mt-2 max-w-2xl text-base leading-7 text-amber-100/55">
          Check the summary, enter your details, then pay the exact amount shown.
        </p>
      </div>

      {state.checkoutLocked && (
        <div role="status" className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm leading-6 text-amber-100">
          <p className="font-bold text-white">Check this booking before starting another payment</p>
          <p className="mt-1">
            {state.clientSecret
              ? "Your booking details are saved for this payment. If a payment attempt fails, use the same payment form to retry. If payment has already succeeded, the retry only checks its confirmation."
              : "This checkout needs confirmation before starting another booking or payment. Wait for the current attempt, or contact us if it cannot finish."}
          </p>
          {state.bookingRef && <p className="mt-2">Booking reference: <strong>{state.bookingRef}</strong></p>}
          <p className="mt-2"><a href="tel:07909032889" className="font-bold underline">Call us to check your booking</a></p>
          {state.bookingRef && <p className="mt-2"><a href={`/track?ref=${encodeURIComponent(state.bookingRef)}`} className="font-bold underline">Check booking status</a></p>}
        </div>
      )}

      <CheckoutRecovery />
      <BookingReview />
      <CheckoutForm onComplete={handleComplete} stripePromise={stripePromise} />
    </div>
  );

  return <Elements stripe={stripePromise}>{content}</Elements>;
}
