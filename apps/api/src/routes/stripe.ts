import { Hono } from "hono";
import { db } from "@speedy-van/db";
import { ok, fail } from "@speedy-van/shared";
import { stripe } from "../lib/stripe";
import { confirmBooking } from "../services/booking.service";
import { recordStatusChange } from "../services/tracking.service";

const app = new Hono();

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

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
        if (bookingId) await confirmBooking(bookingId, pi.id).catch(() => {});
        break;
      }
      case "payment_intent.payment_failed": {
        const pi = event.data.object;
        const bookingId = pi.metadata?.bookingId;
        if (bookingId) {
          const booking = await db.booking.findUnique({ where: { id: bookingId } });
          if (booking) {
            await db.booking.update({
              where: { id: bookingId },
              data: { status: "CANCELLED" },
            });
            await recordStatusChange(
              bookingId,
              booking.status,
              "CANCELLED",
              undefined,
              "SYSTEM",
              "Payment failed",
            );
          }
        }
        break;
      }
      case "charge.refunded": {
        const charge = event.data.object;
        const piId = typeof charge.payment_intent === "string" ? charge.payment_intent : null;
        if (piId) {
          const booking = await db.booking.findFirst({ where: { stripePaymentId: piId } });
          if (booking) {
            await db.booking.update({
              where: { id: booking.id },
              data: { refundAmount: (charge.amount_refunded ?? 0) / 100 },
            });
          }
        }
        break;
      }
      default:
        break;
    }
  } catch (err) {
    console.error(`[stripe] handler error for ${event.type}:`, err);
  }

  return c.json(ok({ received: true }));
});

export default app;
