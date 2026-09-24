import type { Stripe, StripeCardElement } from "@stripe/stripe-js";

export interface BookingPaymentSession {
  bookingId: string;
  bookingRef: string;
  clientSecret: string;
  totalPrice: number;
}

/** The server price and payment session are mandatory; a quote is not a payment. */
export function parseBookingPaymentSession(value: unknown): BookingPaymentSession | null {
  if (!value || typeof value !== "object") return null;
  const session = value as Record<string, unknown>;
  if (typeof session.bookingId !== "string" || !session.bookingId ||
      typeof session.bookingRef !== "string" || !session.bookingRef ||
      typeof session.clientSecret !== "string" || !session.clientSecret ||
      typeof session.totalPrice !== "number" || !Number.isFinite(session.totalPrice) || session.totalPrice <= 0) return null;
  return session as unknown as BookingPaymentSession;
}

/** Release a restored checkout only after its authenticated tracking response confirms payment. */
export function isVerifiedCheckoutRecovery(value: unknown, reference: string, bookingId: string): boolean {
  if (!reference || !value || typeof value !== "object") return false;
  const booking = value as Record<string, unknown>;
  return booking.reference === reference &&
    (!bookingId || booking.bookingId === bookingId) &&
    booking.isPaid === true &&
    typeof booking.status === "string" &&
    ["CONFIRMED", "ASSIGNED", "EN_ROUTE", "ARRIVED", "IN_PROGRESS", "COMPLETED"].includes(booking.status);
}

/** Reuse the same intent on a card retry and confirm only a succeeded payment. */
export async function completeCardPayment(
  session: BookingPaymentSession,
  stripe: Pick<Stripe, "retrievePaymentIntent" | "confirmCardPayment">,
  card: StripeCardElement,
  billingDetails: { name: string; email: string },
  confirmBooking: (bookingId: string, paymentIntentId: string) => Promise<void>,
): Promise<void> {
  const previous = await stripe.retrievePaymentIntent(session.clientSecret);
  if (previous.error || !previous.paymentIntent) {
    throw new Error(previous.error?.message || "We couldn't check your payment. Please retry or contact us before paying again.");
  }
  let paymentIntent = previous.paymentIntent;
  if (paymentIntent.status === "processing") {
    throw new Error("Your payment is still processing. Please contact us before trying another payment.");
  }
  if (paymentIntent.status === "canceled") {
    throw new Error("This payment session is no longer available. Please contact us to check your booking.");
  }
  if (paymentIntent.status !== "succeeded") {
    const result = await stripe.confirmCardPayment(session.clientSecret, {
      payment_method: { card, billing_details: billingDetails },
    });
    if (result.error) throw new Error(result.error.message || "Payment failed. Please check your card details and retry.");
    if (!result.paymentIntent || result.paymentIntent.status !== "succeeded") {
      throw new Error("Your payment has not completed. Please contact us before trying another payment.");
    }
    paymentIntent = result.paymentIntent;
  }
  await confirmBooking(session.bookingId, paymentIntent.id);
}
