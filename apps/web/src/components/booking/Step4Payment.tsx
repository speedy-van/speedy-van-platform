"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import Image from "next/image";
import type { FormEvent, ReactNode } from "react";
import { loadStripe } from "@stripe/stripe-js/pure";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { FaWhatsapp } from "react-icons/fa";
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
const CONFIRMATION_STORAGE_KEY = "sv_booking_confirmation_v1";

const money = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
});

const BOOKING_ERROR_MESSAGE =
  "We couldn't create your booking right now. Please retry, or contact us if it keeps happening.";

interface ApiFailure {
  success?: boolean;
  error?: unknown;
  code?: unknown;
}

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

const EMAIL_DOMAINS = [
  "gmail.com",
  "outlook.com",
  "hotmail.com",
  "icloud.com",
  "yahoo.com",
  "yahoo.co.uk",
  "live.co.uk",
  "hotmail.co.uk",
  "outlook.co.uk",
  "btinternet.com",
  "virginmedia.com",
  "ntlworld.com",
  "blueyonder.co.uk",
  "talktalk.net",
  "sky.com",
  "aol.com",
  "msn.com",
  "proton.me",
] as const;

interface EmailDomainSuggestion {
  value: string;
  domain: string;
  localPart: string;
  isCorrection: boolean;
}

const EMAIL_DOMAIN_CORRECTIONS: Record<string, (typeof EMAIL_DOMAINS)[number]> = {
  "gamil": "gmail.com",
  "gamil.com": "gmail.com",
  "gmial": "gmail.com",
  "gmial.com": "gmail.com",
  "gmai": "gmail.com",
  "gmail.co": "gmail.com",
  "hotmai": "hotmail.com",
  "hotmial": "hotmail.com",
  "hotmial.com": "hotmail.com",
  "outlok": "outlook.com",
  "outlok.com": "outlook.com",
  "outloo": "outlook.com",
  "icloud.co": "icloud.com",
  "yaho": "yahoo.com",
  "yaho.com": "yahoo.com",
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

function bookingCreateErrorMessage(response: ApiFailure | null | undefined): string {
  const code = typeof response?.code === "string" ? response.code : "";
  const apiError = typeof response?.error === "string" ? response.error : "";

  if (code === "PRICE_CHANGED") {
    return "Your quote has changed. Please return to Date and time for a fresh price.";
  }
  if (code === "QUOTE_EXPIRED") {
    return "Your quote expired. Please go back and choose your date again.";
  }
  if (code === "QUOTE_INVALID") {
    return "Your quote could not be verified. Please refresh the price and try again.";
  }
  if (code === "PRICING_CONFIG_UNAVAILABLE") {
    return "Prices could not be loaded right now. Please try again shortly.";
  }
  if (code === "SELECTED_SLOT_UNAVAILABLE") {
    return "That date or time is no longer available. Please choose another slot.";
  }
  if (code === "STRIPE_NOT_CONFIGURED" || code === "PAYMENT_UNAVAILABLE") {
    return "Online payment could not be started right now. Please contact us to arrange the booking.";
  }
  if (code === "VALIDATION_ERROR") {
    return "Some booking details are missing or invalid. Please review the previous steps.";
  }

  if (apiError && (process.env.NODE_ENV === "development" || code !== "INTERNAL_ERROR")) {
    return apiError;
  }

  return BOOKING_ERROR_MESSAGE;
}

function rememberBookingConfirmation(session: BookingPaymentSession, email: string) {
  try {
    sessionStorage.setItem(
      CONFIRMATION_STORAGE_KEY,
      JSON.stringify({
        bookingId: session.bookingId,
        bookingRef: session.bookingRef,
        customerEmail: email,
        totalPrice: session.totalPrice,
        savedAt: new Date().toISOString(),
      }),
    );
  } catch {
    /* Confirmation page can still ask for the booking email. */
  }
}

function buildEmailDomainSuggestions(value: string): EmailDomainSuggestion[] {
  const trimmed = value.trim();
  const atIndex = trimmed.indexOf("@");
  if (atIndex <= 0 || atIndex !== trimmed.lastIndexOf("@")) return [];

  const localPart = trimmed.slice(0, atIndex);
  const domainPart = trimmed.slice(atIndex + 1).toLowerCase().replace(/\s+/g, "");
  if (!localPart || localPart.includes(" ") || domainPart.includes(" ")) return [];

  const correctedDomain = EMAIL_DOMAIN_CORRECTIONS[domainPart];
  const matches = [...EMAIL_DOMAINS]
    .filter((domain) => {
      if (!domainPart) return true;
      return domain === correctedDomain || domain.startsWith(domainPart) || domain.includes(domainPart);
    })
    .sort((a, b) => {
      const aCorrection = a === correctedDomain ? 0 : 1;
      const bCorrection = b === correctedDomain ? 0 : 1;
      const aStarts = !domainPart || a.startsWith(domainPart) ? 0 : 1;
      const bStarts = !domainPart || b.startsWith(domainPart) ? 0 : 1;
      return aCorrection - bCorrection || aStarts - bStarts || a.localeCompare(b);
    });

  return matches
    .map((domain) => ({
      domain,
      localPart,
      value: `${localPart}@${domain}`,
      isCorrection: Boolean(domainPart && correctedDomain === domain && domainPart !== domain),
    }))
    .filter((suggestion) => suggestion.value.toLowerCase() !== trimmed.toLowerCase())
    .slice(0, 5);
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
      className="rounded-2xl p-4"
      style={{ background: "rgba(255,255,255,0.07)", boxShadow: "0 0 0 1px rgba(245,158,11,0.24), 0 8px 32px rgba(0,0,0,0.42)" }}
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
          className="min-h-9 rounded-lg bg-amber-500 px-3 text-xs font-black text-black transition hover:bg-amber-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Edit
        </button>
      </div>
      <div className="mt-3 text-sm leading-6 text-white">{children}</div>
    </section>
  );
}

function BookingReview() {
  const { state } = useBooking();
  const extras = [
    state.packingItemCount > 0 ? `Packing ×${state.packingItemCount}` : "",
    state.assemblyItemCount > 0 ? `Assembly ×${state.assemblyItemCount}` : "",
    state.dismantlingItemCount > 0 ? `Dismantling ×${state.dismantlingItemCount}` : "",
    state.helpersCount > 0 ? `${state.helpersCount} extra helper${state.helpersCount > 1 ? "s" : ""}` : "",
  ].filter(Boolean);

  return (
    <div className="space-y-3">
      <ReviewSection title="Service" editStep={1}>
        <p className="font-bold text-white">{state.serviceName || "Not selected"}</p>
      </ReviewSection>

      <ReviewSection title="Journey and access" editStep={2}>
        <div className="grid gap-3 md:grid-cols-2">
          <div className="rounded-xl p-4" style={{ background: "rgba(245,158,11,0.12)", boxShadow: "0 0 0 1px rgba(245,158,11,0.28)" }}>
            <p className="text-xs font-black uppercase tracking-widest text-amber-300">Pickup</p>
            <p className="mt-1 font-bold text-white">
              {state.pickup ? shortAddress(state.pickup.address) : "Not confirmed"}
            </p>
            <p className="mt-1 font-semibold text-white">{floorLabel(state.pickupFloor, state.pickupHasLift)}</p>
          </div>
          <div className="rounded-xl p-4" style={{ background: "rgba(234,88,12,0.12)", boxShadow: "0 0 0 1px rgba(234,88,12,0.30)" }}>
            <p className="text-xs font-black uppercase tracking-widest text-orange-300">Drop-off</p>
            <p className="mt-1 font-bold text-white">
              {state.dropoff ? shortAddress(state.dropoff.address) : "Not confirmed"}
            </p>
            <p className="mt-1 font-semibold text-white">{floorLabel(state.dropoffFloor, state.dropoffHasLift)}</p>
          </div>
        </div>
        {state.distanceMiles > 0 && (
          <p className="mt-3 font-bold text-amber-300">{state.distanceMiles.toFixed(1)} miles</p>
        )}
      </ReviewSection>

      <ReviewSection title="Items" editStep={3}>
        {state.items.length > 0 ? (
          <ul className="divide-y divide-white/8 rounded-xl" style={{ boxShadow: "0 0 0 1px rgba(255,255,255,0.08)" }}>
            {state.items.map((item, index) => (
              <li key={itemKey(item, index)} className="flex items-start justify-between gap-3 px-4 py-3">
                <span>
                  <span className="block font-bold text-white">{item.name}</span>
                  {item.roomName && <span className="block text-xs font-semibold text-white">{item.roomName}</span>}
                </span>
                <span className="shrink-0 font-black text-amber-400">×{item.quantity}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="font-semibold text-white">No items added.</p>
        )}
        {extras.length > 0 && (
          <div className="mt-3 rounded-xl p-4" style={{ background: "rgba(255,255,255,0.06)", boxShadow: "0 0 0 1px rgba(255,255,255,0.12)" }}>
            <p className="font-bold text-white">Extras</p>
            <ul className="mt-2 space-y-1">
              {extras.map((extra) => (
                <li key={extra} className="font-semibold text-white">{extra}</li>
              ))}
            </ul>
          </div>
        )}
      </ReviewSection>

      <ReviewSection title="Date and price" editStep={4}>
        <div
          className="rounded-xl p-4"
          style={{ background: "rgba(245,158,11,0.16)", boxShadow: "0 0 0 1px rgba(245,158,11,0.42), 0 12px 30px rgba(0,0,0,0.30)" }}
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-amber-300">Total to pay</p>
              <p className="mt-1 text-3xl font-black text-white">
                {state.checkoutLocked && !state.clientSecret ? "Check status" : money.format(state.clientTotal)}
              </p>
            </div>
            <span className="rounded-full bg-emerald-500 px-3 py-1 text-xs font-black text-black">Locked</span>
          </div>
          <p className="mt-3 font-bold text-white">
              {state.selectedDate && state.selectedTimeSlot
                ? `${formatDate(state.selectedDate)}, ${SLOT_LABELS[state.selectedTimeSlot]}`
                : "Not selected"}
          </p>
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
  const hasQuoteLock = state.quoteStatus === "valid" && Boolean(state.quoteToken) && state.quoteExpiresAt > 0;
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
  const emailDomainSuggestions = useMemo(() => buildEmailDomainSuggestions(email), [email]);
  const [emailSuggestionIndex, setEmailSuggestionIndex] = useState(0);
  const [emailSuggestionsOpen, setEmailSuggestionsOpen] = useState(false);

  const purchaseTrackedRef = useRef(false);

  useEffect(() => {
    setEmailSuggestionIndex(0);
  }, [emailDomainSuggestions]);

  function acceptEmailSuggestion(index = emailSuggestionIndex) {
    const suggestion = emailDomainSuggestions[index] ?? emailDomainSuggestions[0];
    if (!suggestion) return;
    setEmail(suggestion.value);
    setEmailSuggestionIndex(0);
    setEmailSuggestionsOpen(false);
  }

  const canShowEmailSuggestions =
    emailSuggestionsOpen && emailDomainSuggestions.length > 0 && !state.checkoutLocked && !submitting;

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
    if (!hasQuoteLock || !state.selectedDate || !state.selectedTimeSlot || state.clientTotal <= 0) {
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
            packingItemCount: state.packingItemCount,
            assemblyItemCount: state.assemblyItemCount,
            dismantlingItemCount: state.dismantlingItemCount,
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
          }
          if (createJson?.code === "QUOTE_EXPIRED") {
            dispatch({ type: "SET_QUOTE_STATUS", status: "stale", error: "Your quote expired. Please pick your date and time again to get a fresh price." });
          }
          throw new Error(bookingCreateErrorMessage(createJson));
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

      rememberBookingConfirmation(session, email.trim());
      try { localStorage.setItem("sv-customer-email", email.trim()); } catch { /* ignore */ }
      try { localStorage.removeItem("sv_booking_draft_v1"); } catch { /* Storage may be unavailable. */ }
      if (mounted.current) onComplete(bookingRef);
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

  const inputStyle = { background: "rgba(255,255,255,0.08)", boxShadow: "0 0 0 1px rgba(245,158,11,0.24)" };
  const cardStyle = { background: "rgba(255,255,255,0.07)", boxShadow: "0 0 0 1px rgba(245,158,11,0.24), 0 8px 32px rgba(0,0,0,0.42)" };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5"
      noValidate
    >
      {/* ── Your details ── */}
      <div className="rounded-2xl p-5 space-y-4" style={cardStyle}>
        <h2 className="text-base font-black text-white">Contact details</h2>
        <div>
          <label htmlFor="booking-customer-name" className="mb-1.5 block text-sm font-black text-white">Full name</label>
          <input
            id="booking-customer-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={submitting || state.checkoutLocked}
            autoComplete="name"
            className="min-h-12 w-full rounded-xl px-4 py-3 text-base font-semibold text-white placeholder-white/45 focus:outline-none focus:ring-2 focus:ring-amber-400"
            style={inputStyle}
            placeholder="Jane Smith"
          />
        </div>
        <div>
          <label htmlFor="booking-customer-email" className="mb-1.5 block text-sm font-black text-white">Email</label>
          <div className="relative">
            <input
              id="booking-customer-email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setEmailSuggestionsOpen(true);
              }}
              onFocus={() => {
                if (emailDomainSuggestions.length > 0) setEmailSuggestionsOpen(true);
              }}
              onKeyDown={(e) => {
                if (emailDomainSuggestions.length === 0) return;
                if (e.key === "Escape") {
                  setEmailSuggestionsOpen(false);
                  return;
                }
                if (e.key === "ArrowDown") {
                  e.preventDefault();
                  setEmailSuggestionsOpen(true);
                  setEmailSuggestionIndex((index) => (index + 1) % emailDomainSuggestions.length);
                  return;
                }
                if (e.key === "ArrowUp") {
                  e.preventDefault();
                  setEmailSuggestionsOpen(true);
                  setEmailSuggestionIndex((index) => (index - 1 + emailDomainSuggestions.length) % emailDomainSuggestions.length);
                  return;
                }
                if ((e.key === "ArrowRight" || e.key === "Enter") && emailSuggestionsOpen) {
                  e.preventDefault();
                  acceptEmailSuggestion();
                }
              }}
              required
              disabled={submitting || state.checkoutLocked}
              autoComplete="email"
              inputMode="email"
              role="combobox"
              aria-autocomplete="list"
              aria-expanded={canShowEmailSuggestions}
              aria-controls="booking-email-domain-suggestions"
              className="min-h-12 w-full rounded-xl px-4 py-3 text-base font-semibold text-white placeholder-white/45 focus:outline-none focus:ring-2 focus:ring-amber-400"
              style={inputStyle}
              placeholder="jane@example.com"
            />
            {canShowEmailSuggestions && (
              <div
                id="booking-email-domain-suggestions"
                role="listbox"
                className="absolute left-0 right-0 top-full z-30 mt-2 overflow-hidden rounded-xl border border-amber-400/35 bg-[#171207] shadow-2xl shadow-black/55"
                aria-label="Email suggestions"
              >
                {emailDomainSuggestions.map((suggestion, index) => (
                  <button
                    key={suggestion.value}
                    type="button"
                    role="option"
                    aria-selected={index === emailSuggestionIndex}
                    onMouseDown={(event) => {
                      event.preventDefault();
                      acceptEmailSuggestion(index);
                    }}
                    className={`flex min-h-11 w-full items-center justify-between gap-3 px-4 text-left text-sm font-black transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 ${
                      index === emailSuggestionIndex
                        ? "bg-amber-500 text-black"
                        : "bg-transparent text-white hover:bg-white/10"
                    }`}
                  >
                    <span className="min-w-0 truncate">
                      <span className={index === emailSuggestionIndex ? "text-black/65" : "text-white/50"}>
                        {suggestion.localPart}@
                      </span>
                      {suggestion.domain}
                    </span>
                    {suggestion.isCorrection && (
                      <span className={`shrink-0 rounded-full px-2 py-1 text-[10px] uppercase tracking-wide ${
                        index === emailSuggestionIndex ? "bg-black/15 text-black" : "bg-amber-400/15 text-amber-200"
                      }`}>
                        fix
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
          </div>
        <div>
          <label htmlFor="booking-customer-phone" className="mb-1.5 block text-sm font-black text-white">Phone</label>
          <input
            id="booking-customer-phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            disabled={submitting || state.checkoutLocked}
            autoComplete="tel-national"
            inputMode="tel"
            className="min-h-12 w-full rounded-xl px-4 py-3 text-base font-semibold text-white placeholder-white/45 focus:outline-none focus:ring-2 focus:ring-amber-400"
            style={inputStyle}
            placeholder="+44 7700 900000"
          />
        </div>
      </div>

      {/* ── Payment details ── */}
      {!paymentUnavailable && (!stripePromise || !stripe || !elements) ? (
        <div role="status" className="rounded-2xl p-5 text-sm font-bold text-white" style={cardStyle}>
          Loading secure payment form…
        </div>
      ) : stripePromise && !paymentUnavailable ? (
        <div className="rounded-2xl p-5" style={cardStyle}>
          <h2 className="mb-3 text-base font-black text-white">Card payment</h2>
          <div
            className="rounded-xl px-4 py-3.5"
            style={{ background: "rgba(255,255,255,0.09)", boxShadow: "0 0 0 1px rgba(245,158,11,0.32)" }}
          >
            <CardElement options={CARD_STYLE} />
          </div>
          <p className="mt-2 text-xs font-semibold text-white">Secure Stripe payment.</p>
        </div>
      ) : (
        <div
          className="rounded-2xl p-4 text-sm"
          style={{ background: "rgba(245,158,11,0.08)", boxShadow: "0 0 0 1px rgba(245,158,11,0.20)" }}
        >
          <p className="font-black text-amber-300">Online payment unavailable</p>
          <p className="mt-1 font-semibold text-white">Contact us to arrange the booking.</p>
        </div>
      )}

      {error && (
        <p role="alert" className="rounded-xl px-4 py-3 text-sm font-medium text-red-300" style={{ background: "rgba(239,68,68,0.10)", boxShadow: "0 0 0 1px rgba(239,68,68,0.20)" }}>
          {error}
        </p>
      )}

      {/* ── Need help ── */}
      <div className="rounded-2xl p-5" style={cardStyle}>
        <h2 className="text-base font-black text-white">Need help?</h2>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          <a
            href="tel:07909032889"
            aria-label="Call us on 07909 032889"
            className="inline-flex min-h-11 items-center justify-center rounded-xl bg-white/8 px-4 text-sm font-black text-white ring-1 ring-white/15 transition hover:bg-white/12 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
          >
            <Image src="/call-icon.png" alt="" width={28} height={28} className="mr-2" />
            Call
          </a>
          <a
            href="https://wa.me/447909032889"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat with us on WhatsApp"
            className="inline-flex h-12 w-12 items-center justify-center justify-self-center rounded-full bg-[#25D366] text-2xl text-white shadow-lg shadow-black/30 ring-1 ring-white/15 transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
          >
            <FaWhatsapp aria-hidden="true" />
          </a>
        </div>
      </div>

      {/* The fixed action bar owns the visible payment CTA. */}
      <button
        id={STEP_PRIMARY_CTA_ID}
        type="submit"
        disabled={submitting || creationUncertain || paymentUnavailable || !stripe || !elements || !hasQuoteLock || state.clientTotal <= 0}
        className="sr-only"
        aria-hidden="true"
        tabIndex={-1}
      >
        {submitting ? "Processing..." : "Pay"}
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
        <p className="text-xs font-bold uppercase tracking-widest text-amber-400">Step 4 of 4 · Pay</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight text-white">Pay</h1>
      </div>

      {state.checkoutLocked && (
        <div role="status" className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm font-semibold leading-6 text-white">
          <p className="font-bold text-white">Check this booking before starting another payment</p>
          <p className="mt-1">
            {state.clientSecret
              ? "Use this payment form to finish or retry the same booking."
              : "Wait for the current attempt, or contact us to check it."}
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
