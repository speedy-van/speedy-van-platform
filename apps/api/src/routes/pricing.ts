import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { PricingCalculateSchema, ok } from "@speedy-van/shared";
import { calculatePrice } from "../services/pricing.service";

const app = new Hono();

app.post("/calculate", zValidator("json", PricingCalculateSchema), async (c) => {
  const input = c.req.valid("json");
  const result = await calculatePrice(input);
  return c.json(ok(result));
});

export default app;
