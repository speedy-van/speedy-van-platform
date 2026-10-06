import Stripe from "stripe";

const key = process.env.STRIPE_SECRET_KEY;

export const stripe: Stripe | null = key
  ? new Stripe(key, { apiVersion: "2024-12-18.acacia" as Stripe.LatestApiVersion })
  : null;

if (!stripe) {
  console.warn("[stripe] STRIPE_SECRET_KEY is not set. Payment endpoints will return 503.");
}

export function requireStripe(): Stripe {
  if (!stripe) {
    throw new Error("STRIPE_NOT_CONFIGURED");
  }
  return stripe;
}
