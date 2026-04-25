import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { db } from "@speedy-van/db";
import { ok, fail } from "@speedy-van/shared";

const app = new Hono();

const POSTCODE_RE = /^([A-Z]{1,2}\d[A-Z\d]?)\s*(\d[A-Z]{2})?$/i;

app.post(
  "/",
  zValidator(
    "json",
    z.object({
      email: z.string().email().max(255),
      postcode: z.string().min(2).max(10).regex(POSTCODE_RE, "Invalid UK postcode"),
      source: z.string().max(64).optional(),
    }),
  ),
  async (c) => {
    const { email, postcode, source } = c.req.valid("json");
    const cleanPostcode = postcode.trim().toUpperCase();
    const area = cleanPostcode.match(/^([A-Z]{1,2})/)?.[1] ?? null;

    try {
      await db.waitlistEntry.upsert({
        where: { email_postcode: { email: email.toLowerCase(), postcode: cleanPostcode } },
        create: { email: email.toLowerCase(), postcode: cleanPostcode, area, source: source ?? null },
        update: {},
      });
    } catch (err) {
      // Don't leak DB errors to the customer; record-and-fall-through.
      console.error("[waitlist] insert failed", err);
      return c.json(fail("Could not save your details, please try again later.", "DB_ERROR"), 500);
    }

    return c.json(ok({ saved: true }));
  },
);

export default app;
