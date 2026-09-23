import { Hono } from "hono";
import { db } from "@speedy-van/db";
import { ok, fail } from "@speedy-van/shared";
import { stripe } from "../lib/stripe";
import { confirmBooking } from "../services/booking.service";

const app = new Hono();

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

async function reconcileRefunds(paymentIntentId: string): Promise<void> {
  if (!stripe) throw new Error("STRIPE_NOT_CONFIGURED");
  const booking = await db.booking.findFirst({ where: { stripePaymentId: paymentIntentId } });
  if (!booking) return;

  // Events can arrive out of order. Read current refunds instead of overwriting
  // the booking with an old charge snapshot or a pending refund amount.
  let refundedPence = 0;
  for await (const refund of stripe.refunds.list({ payment_intent: paymentIntentId, limit: 100 })) {
    if (refund.status !== "succeeded") continue;
    if (refund.currency !== "gbp") throw new Error("Unexpected booking refund currency");
    refundedPence += refund.amount;
  }
  if (!Number.isSafeInteger(refundedPence) || refundedPence < 0) throw new Error("Invalid refund total");
  const updated = await db.booking.updateMany({
    where: { id: booking.id, stripePaymentId: paymentIntentId, refundAmount: booking.refundAmount },
    data: { refundAmount: refundedPence / 100 },
  });
  if (updated.count === 0) throw new Error("Refund changed concurrently; retry reconciliation");
}

app.post("/webhook", async (c) => {
  if (!stripe || !webhookSecret) {
    return c.json(fail("Stripe not configured", "STRIPE_NOT_CONFIGURED"), 503);
  }

  const sig = c.req.header("stripe-signature");
  if (!sig) return c.json(fail("Missing stripe-signature header", "MISSING_SIG"), 400);

  // Need raw body for signature verification
  const rawBody = await c.req.text();

  let event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
  } catch (err) {
    console.error("[stripe] signature verification failed:", err);
    return c.json(fail("Invalid signature", "INVALID_SIGNATURE"), 400);
  }

  try {
    switch (event.type) {
      case "payment_intent.succeeded": {
        const pi = event.data.object;
        const bookingId = pi.metadata?.bookingId;
        if (bookingId) await confirmBooking(bookingId, pi.id);
        break;
      }
      case "payment_intent.payment_failed": {
        // A failed attempt can be retried on the same intent. A delayed failure
        // event must not cancel a subsequently paid or explicitly cancelled move.
        break;
      }
      case "charge.refunded": {
        const charge = event.data.object;
        const piId = typeof charge.payment_intent === "string" ? charge.payment_intent : charge.payment_intent?.id;
        if (piId) await reconcileRefunds(piId);
        break;
      }
      case "refund.created":
      case "refund.updated":
      case "refund.failed": {
        const refund = event.data.object;
        const piId = typeof refund.payment_intent === "string" ? refund.payment_intent : refund.payment_intent?.id;
        if (piId) await reconcileRefunds(piId);
        break;
      }
      default:
        break;
    }
  } catch (err) {
    console.error(`[stripe] handler error for ${event.type}:`, err);
    return c.json(fail("Payment event could not be processed. Please retry.", "WEBHOOK_PROCESSING_FAILED"), 500);
  }

  return c.json(ok({ received: true }));
});

export default app;
