// Public enquiry endpoints (no auth required).
// Currently exposes the European Removals quote-request flow.

import { Hono } from "hono";
import { zValidator } from "@/server/api/lib/z-validator";
import { z } from "zod";
import { createHash } from "crypto";
import { db, type Prisma, type StorageEnquiry } from "@speedy-van/db";
import {
  generateStorageEnquiryReference,
  ok,
  fail,
  StorageEnquiryCreateSchema,
  storageCustomerName,
} from "@speedy-van/shared";
import {
  sendEuropeanEnquiryConfirmation,
  sendEuropeanEnquiryAdminAlert,
  sendStorageEnquiryAdminAlert,
  sendStorageEnquiryConfirmation,
} from "../services/email.service";
import { notifyNewEuropeanEnquiry, notifyNewStorageEnquiry } from "../services/notification.service";

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

function canonicalJson(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(canonicalJson).join(",")}]`;
  if (value && typeof value === "object") {
    return `{${Object.entries(value as Record<string, unknown>)
      .filter(([, item]) => item !== undefined)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, item]) => `${JSON.stringify(key)}:${canonicalJson(item)}`)
      .join(",")}}`;
  }
  return JSON.stringify(value);
}

function jsonReady(value: unknown): Prisma.InputJsonValue {
  return JSON.parse(JSON.stringify(value)) as Prisma.InputJsonValue;
}

function hashPayload(value: unknown): string {
  return createHash("sha256").update(canonicalJson(value)).digest("hex");
}

function dateFromIsoDay(value?: string): Date | null {
  if (!value) return null;
  const date = new Date(`${value}T12:00:00.000Z`);
  return Number.isFinite(date.getTime()) ? date : null;
}

async function unusedStorageReference(): Promise<string> {
  const candidates = [
    generateStorageEnquiryReference(),
    generateStorageEnquiryReference(),
    generateStorageEnquiryReference(),
  ];

  for (const reference of candidates) {
    const existing = await db.storageEnquiry.findUnique({ where: { reference }, select: { id: true } });
    if (!existing) return reference;
  }

  return generateStorageEnquiryReference();
}

function storageReceipt(enquiry: Pick<StorageEnquiry, "id" | "reference" | "createdAt">) {
  return {
    success: true,
    enquiryId: enquiry.id,
    reference: enquiry.reference,
    createdAt: enquiry.createdAt.toISOString(),
    message: "Storage enquiry received. We will review it and send a manual quote.",
  };
}

function storageErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message.slice(0, 1000) : "Unknown error";
}

function fireStorageEnquirySideEffects(enquiry: StorageEnquiry): void {
  sendStorageEnquiryConfirmation(enquiry).catch((err) => {
    console.error("[enquiry] storage confirmation email failed:", err);
  });
  sendStorageEnquiryAdminAlert(enquiry).catch((err) => {
    console.error("[enquiry] storage admin email failed:", err);
  });
  notifyNewStorageEnquiry({
    id: enquiry.id,
    reference: enquiry.reference,
    customerName: storageCustomerName({
      firstName: enquiry.firstName,
      lastName: enquiry.lastName,
    }),
    collectionPostcode: enquiry.collectionPostcode,
  })
    .then(() => db.storageEnquiry.update({
      where: { id: enquiry.id },
      data: { notificationStatus: "sent", notificationError: null },
    }))
    .catch((err) => db.storageEnquiry.update({
      where: { id: enquiry.id },
      data: { notificationStatus: "failed", notificationError: storageErrorMessage(err) },
    }).catch(() => {}));
}

app.post("/storage", zValidator("json", StorageEnquiryCreateSchema), async (c) => {
  const input = c.req.valid("json");
  const payloadHash = hashPayload(input);
  const existing = await db.storageEnquiry.findUnique({ where: { idempotencyKey: input.idempotencyKey } });

  if (existing) {
    if (existing.payloadHash !== payloadHash) {
      return c.json(
        fail("This storage enquiry was already submitted with different details. Refresh and try again.", "IDEMPOTENCY_CONFLICT"),
        409,
      );
    }
    return c.json(ok(storageReceipt(existing)));
  }

  let enquiry: StorageEnquiry | null = null;
  for (let attempt = 0; attempt < 4 && !enquiry; attempt += 1) {
    try {
      enquiry = await db.storageEnquiry.create({
        data: {
          reference: await unusedStorageReference(),
          idempotencyKey: input.idempotencyKey,
          payloadHash,
          firstName: input.firstName.trim(),
          lastName: input.lastName?.trim() || null,
          customerEmail: input.email.toLowerCase().trim(),
          customerPhone: input.phone.trim(),
          storageStartKind: input.storageStart.kind,
          storageStartDate: input.storageStart.kind === "known" ? dateFromIsoDay(input.storageStart.date) : null,
          storageDuration: input.storageDuration,
          estimatedUnitSize: input.estimatedUnitSize,
          needsCollectionTransport: input.needsCollectionTransport,
          collectionAddress: input.collectionAddress?.trim() || null,
          collectionPostcode: input.collectionPostcode.trim().toUpperCase(),
          collectionAccess: jsonReady(input.collectionAccess),
          storageFacilityKnown: input.storageFacilityKnown,
          storageFacility: input.storageFacilityKnown && input.storageFacility ? jsonReady(input.storageFacility) : undefined,
          needsReturnTransport: input.needsReturnTransport,
          returnDestinationKnown: input.returnDestinationKnown,
          returnAddress: input.returnAddress?.trim() || null,
          returnPostcode: input.returnPostcode?.trim().toUpperCase() || null,
          returnDateKind: input.returnDate?.kind ?? null,
          returnDate: input.returnDate?.kind === "known" ? dateFromIsoDay(input.returnDate.date) : null,
          itemDescription: input.itemDescription.trim(),
          needsPacking: input.needsPacking,
          needsDismantling: input.needsDismantling,
          notes: input.notes?.trim() || null,
          source: input.source ? jsonReady(input.source) : undefined,
          snapshot: jsonReady(input),
          notificationStatus: "pending",
        },
      });
    } catch (err) {
      const code = typeof err === "object" && err && "code" in err ? (err as { code?: string }).code : "";
      if (code === "P2002") {
        const duplicate = await db.storageEnquiry.findUnique({ where: { idempotencyKey: input.idempotencyKey } });
        if (duplicate && duplicate.payloadHash === payloadHash) {
          return c.json(ok(storageReceipt(duplicate)));
        }
        if (attempt < 3) continue;
      }
      console.error("[enquiry] storage create failed:", err);
      return c.json(fail("Could not save your storage enquiry, please try again.", "DB_ERROR"), 500);
    }
  }

  if (!enquiry) {
    return c.json(fail("Could not save your storage enquiry, please try again.", "DB_ERROR"), 500);
  }

  fireStorageEnquirySideEffects(enquiry);
  return c.json(ok(storageReceipt(enquiry)), 201);
});

export default app;
