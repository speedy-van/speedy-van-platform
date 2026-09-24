import { Hono, type Context } from "hono";
import { zValidator } from "@hono/zod-validator";
import { PricingCalculateSchema, fail, ok } from "@speedy-van/shared";
import { calculatePrice } from "../services/pricing.service";

const app = new Hono();
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 60;
const pricingRateBuckets = new Map<string, { windowStart: number; count: number }>();

function clientIp(c: Context): string {
  const forwarded = c.req.header("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || c.req.header("cf-connecting-ip") || c.req.header("x-real-ip") || "unknown";
}

async function pricingRateLimit(c: Context, next: () => Promise<void>): Promise<Response | void> {
  const now = Date.now();
  const key = clientIp(c);
  const current = pricingRateBuckets.get(key);
  const bucket = current && now - current.windowStart < RATE_LIMIT_WINDOW_MS
    ? current
    : { windowStart: now, count: 0 };

  bucket.count += 1;
  pricingRateBuckets.set(key, bucket);

  if (bucket.count > RATE_LIMIT_MAX_REQUESTS) {
    c.header("Retry-After", "60");
    return c.json(fail("Too many price requests. Please wait a minute and try again.", "RATE_LIMITED"), 429);
  }

  await next();
}

app.post("/calculate", pricingRateLimit, zValidator("json", PricingCalculateSchema), async (c) => {
  const input = c.req.valid("json");
  const result = await calculatePrice(input);
  return c.json(ok(result));
});

export default app;
