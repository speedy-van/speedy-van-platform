// Public enquiry endpoints (no auth required).
// Currently exposes the European Removals quote-request flow.

import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { db } from "@speedy-van/db";
import { ok, fail } from "@speedy-van/shared";
import { sendEuropeanEnquiryConfirmation, sendEuropeanEnquiryAdminAlert } from "../services/email.service";
import { notifyNewEuropeanEnquiry } from "../services/notification.service";

const app = new Hono();

export const EUROPEAN_COUNTRIES = [
  "France",
  "Germany",
  "Spain",
  "Netherlands",
  "Ireland",
  "Belgium",
  "Italy",
  "Portugal",
  "Austria",
  "Switzerland",
  "Poland",
  "Czech Republic",
  "Denmark",
  "Sweden",
  "Norway",
  "Finland",
  "Greece",
  "Hungary",
  "Romania",
  "Croatia",
] as const;

const PHONE_RE = /^[+()\-\s\d]{7,20}$/;

const EuropeanEnquirySchema = z
  .object({
    customerName: z.string().min(2).max(120),
    customerEmail: z.string().email().max(255),
    customerPhone: z.string().regex(PHONE_RE, "Invalid phone number"),
    fromAddress: z.string().min(2).max(255),
    propertyType: z.enum(["Studio", "Flat", "House", "Office", "Storage Unit"]),
    bedrooms: z.coerce.number().int().min(0).max(20).default(1),
    toCountry: z.enum(EUROPEAN_COUNTRIES),
    toCity: z.string().min(2).max(120),
    preferredDate: z
      .string()
      .datetime({ offset: true })
      .or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/))
      .optional()
      .nullable(),
    flexibleDate: z.boolean().default(false),
    flexibleMonth: z.string().max(32).optional().nullable(),
    needsPacking: z.boolean().default(false),
    needsStorage: z.boolean().default(false),
    notes: z.string().max(2000).optional().nullable(),
  })
  .refine((d) => d.flexibleDate || !!d.preferredDate, {
    message: "Either preferredDate or flexibleDate must be provided",
    path: ["preferredDate"],
  });

app.post("/european", zValidator("json", EuropeanEnquirySchema), async (c) => {
  const input = c.req.valid("json");

  let enquiry;
  try {
    enquiry = await db.europeanEnquiry.create({
      data: {
        customerName: input.customerName.trim(),
        customerEmail: input.customerEmail.toLowerCase().trim(),
        customerPhone: input.customerPhone.trim(),
        fromAddress: input.fromAddress.trim(),
        propertyType: input.propertyType,
        bedrooms: ["Office", "Storage Unit"].includes(input.propertyType) ? 0 : input.bedrooms,
        toCountry: input.toCountry,
        toCity: input.toCity.trim(),
        preferredDate: input.preferredDate ? new Date(input.preferredDate) : null,
        flexibleDate: input.flexibleDate,
        flexibleMonth: input.flexibleDate ? input.flexibleMonth ?? null : null,
        needsPacking: input.needsPacking,
        needsStorage: input.needsStorage,
        notes: input.notes?.trim() || null,
      },
    });
  } catch (err) {
    console.error("[enquiry] european create failed:", err);
    return c.json(fail("Could not save your enquiry, please try again.", "DB_ERROR"), 500);
  }

  // Fire-and-forget side-effects (never block the response).
  Promise.allSettled([
    sendEuropeanEnquiryConfirmation(enquiry),
    sendEuropeanEnquiryAdminAlert(enquiry),
    notifyNewEuropeanEnquiry({
      id: enquiry.id,
      customerName: enquiry.customerName,
      toCountry: enquiry.toCountry,
    }),
  ]).catch(() => {});

  return c.json(
    ok({
      success: true,
      enquiryId: enquiry.id,
      message: "Quote request received. We'll respond within 24 hours.",
    }),
    201,
  );
});

export default app;
