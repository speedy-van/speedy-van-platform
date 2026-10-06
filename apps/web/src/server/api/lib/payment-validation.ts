import type { Booking } from "@speedy-van/db";
import type Stripe from "stripe";
import { poundsToPence } from "@speedy-van/shared";

type PaymentErrorCode =
  | "PAYMENT_NOT_SUCCEEDED"
  | "PAYMENT_MISMATCH"
  | "PAYMENT_UNAVAILABLE"
  | "BOOKING_STATE_CHANGED"
  | "BOOKING_CANCELLATION_NOT_ALLOWED"
  | "REFUND_NOT_COMPLETED"
  | "QUOTE_INVALID"
  | "QUOTE_EXPIRED";

export class PaymentValidationError extends Error {
  constructor(
    public readonly code: PaymentErrorCode,
    message: string,
    public readonly status: 400 | 409 | 422 | 503 = 400,
  ) {
    super(message);
    this.name = "PaymentValidationError";
  }
}

export function assertBookingPayment(
  booking: Pick<Booking, "id" | "reference" | "stripePaymentId" | "totalPrice">,
  intent: Pick<Stripe.PaymentIntent, "id" | "status" | "metadata" | "amount" | "amount_received" | "currency">,
): void {
  if (intent.status !== "succeeded") {
    throw new PaymentValidationError("PAYMENT_NOT_SUCCEEDED", "Payment has not completed.");
  }

  const expectedAmount = poundsToPence(booking.totalPrice);
  if (
    !booking.stripePaymentId ||
    intent.id !== booking.stripePaymentId ||
    intent.metadata.bookingId !== booking.id ||
    intent.metadata.reference !== booking.reference ||
    !Number.isSafeInteger(expectedAmount) ||
    expectedAmount <= 0 ||
    intent.currency !== "gbp" ||
    intent.amount !== expectedAmount ||
    intent.amount_received !== expectedAmount
  ) {
    throw new PaymentValidationError(
      "PAYMENT_MISMATCH",
      "Payment does not match this booking. Please contact support.",
    );
  }
}
