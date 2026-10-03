import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { db, type Prisma, type StorageEnquiry } from "@speedy-van/db";
import {
  fail,
  ok,
  paginated,
  STORAGE_ENQUIRY_STATUSES,
  StorageEnquiryAdminPatchSchema,
  StorageEnquirySendQuoteSchema,
} from "@speedy-van/shared";
import { requireAdmin } from "../../middleware/auth";
import { sendStorageEnquiryQuote } from "../../services/email.service";

const app = new Hono();
app.use("*", requireAdmin);

const ALLOWED_STATUS_TRANSITIONS: Record<string, Set<string>> = {
  new: new Set(["new", "under_review", "quoted", "closed"]),
  under_review: new Set(["under_review", "quoted", "closed"]),
  quoted: new Set(["quoted", "under_review", "closed"]),
  closed: new Set(["closed", "under_review"]),
};

export function canTransitionStorageEnquiry(from: string, to: string): boolean {
  return ALLOWED_STATUS_TRANSITIONS[from]?.has(to) ?? false;
}

function storageErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message.slice(0, 1000) : "Unknown error";
}

export function hasStorageQuote(enquiry: Pick<StorageEnquiry, "quotedTransportPrice" | "quotedStoragePrice">): boolean {
  return [enquiry.quotedTransportPrice, enquiry.quotedStoragePrice].some(
    (value) => typeof value === "number" && Number.isFinite(value) && value > 0,
  );
}

function withQuotePatch(
  enquiry: StorageEnquiry,
  patch: Partial<Pick<StorageEnquiry, "quotedTransportPrice" | "quotedStoragePrice" | "quotePeriod" | "quoteNotes">>,
): StorageEnquiry {
  return {
    ...enquiry,
    quotedTransportPrice: patch.quotedTransportPrice !== undefined ? patch.quotedTransportPrice : enquiry.quotedTransportPrice,
    quotedStoragePrice: patch.quotedStoragePrice !== undefined ? patch.quotedStoragePrice : enquiry.quotedStoragePrice,
    quotePeriod: patch.quotePeriod !== undefined ? patch.quotePeriod : enquiry.quotePeriod,
    quoteNotes: patch.quoteNotes !== undefined ? patch.quoteNotes : enquiry.quoteNotes,
  };
}

app.get(
  "/",
  zValidator(
    "query",
    z.object({
      q: z.string().optional(),
      status: z.enum(STORAGE_ENQUIRY_STATUSES).optional(),
      page: z.coerce.number().int().min(1).default(1),
      limit: z.coerce.number().int().min(1).max(100).default(20),
    }),
  ),
  async (c) => {
    const { q, status, page, limit } = c.req.valid("query");
    const where: Prisma.StorageEnquiryWhereInput = {
      ...(status ? { status } : {}),
      ...(q
        ? {
            OR: [
              { reference: { contains: q, mode: "insensitive" as const } },
              { firstName: { contains: q, mode: "insensitive" as const } },
              { lastName: { contains: q, mode: "insensitive" as const } },
              { customerEmail: { contains: q, mode: "insensitive" as const } },
              { customerPhone: { contains: q, mode: "insensitive" as const } },
              { collectionPostcode: { contains: q, mode: "insensitive" as const } },
            ],
          }
        : {}),
    };

    const [items, total] = await Promise.all([
      db.storageEnquiry.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      db.storageEnquiry.count({ where }),
    ]);

    return c.json(paginated(items, page, limit, total));
  },
);

app.get("/:id", async (c) => {
  const enquiry = await db.storageEnquiry.findUnique({ where: { id: c.req.param("id") } });
  if (!enquiry) return c.json(fail("Not found", "NOT_FOUND"), 404);
  return c.json(ok(enquiry));
});

app.patch("/:id", zValidator("json", StorageEnquiryAdminPatchSchema), async (c) => {
  const id = c.req.param("id");
  const body = c.req.valid("json");
  const existing = await db.storageEnquiry.findUnique({ where: { id } });
  if (!existing) return c.json(fail("Not found", "NOT_FOUND"), 404);

  if (body.status && !canTransitionStorageEnquiry(existing.status, body.status)) {
    return c.json(fail(`Cannot move storage enquiry from ${existing.status} to ${body.status}`, "INVALID_STATUS_TRANSITION"), 409);
  }

  const next = withQuotePatch(existing, body);
  if (body.status === "quoted" && !hasStorageQuote(next)) {
    return c.json(fail("Set a storage or transport quote before marking as quoted", "NO_QUOTE"), 400);
  }

  const updated = await db.storageEnquiry.update({
    where: { id },
    data: {
      ...(body.status !== undefined ? { status: body.status } : {}),
      ...(body.quotedTransportPrice !== undefined ? { quotedTransportPrice: body.quotedTransportPrice } : {}),
      ...(body.quotedStoragePrice !== undefined ? { quotedStoragePrice: body.quotedStoragePrice } : {}),
      ...(body.quotePeriod !== undefined ? { quotePeriod: body.quotePeriod } : {}),
      ...(body.quoteNotes !== undefined ? { quoteNotes: body.quoteNotes } : {}),
      ...(body.adminNotes !== undefined ? { adminNotes: body.adminNotes } : {}),
    },
  });

  return c.json(ok(updated));
});

app.post("/:id/send-quote", async (c) => {
  const id = c.req.param("id");
  const parsed = StorageEnquirySendQuoteSchema.safeParse(await c.req.json().catch(() => ({})));
  if (!parsed.success) {
    return c.json(fail("Invalid quote payload", "VALIDATION_ERROR", parsed.error.flatten()), 400);
  }

  const existing = await db.storageEnquiry.findUnique({ where: { id } });
  if (!existing) return c.json(fail("Not found", "NOT_FOUND"), 404);

  const quote = withQuotePatch(existing, parsed.data);
  if (!hasStorageQuote(quote)) {
    return c.json(fail("Set a storage or transport quote before sending", "NO_QUOTE"), 400);
  }

  try {
    await sendStorageEnquiryQuote(quote);
  } catch (err) {
    console.error("[admin/storage-enquiries] send-quote email failed:", err);
    await db.storageEnquiry.update({
      where: { id },
      data: { quoteEmailStatus: "failed", quoteEmailError: storageErrorMessage(err) },
    });
    return c.json(fail("Could not send the quote email", "EMAIL_ERROR"), 500);
  }

  const updated = await db.storageEnquiry.update({
    where: { id },
    data: {
      status: "quoted",
      quotedTransportPrice: quote.quotedTransportPrice,
      quotedStoragePrice: quote.quotedStoragePrice,
      quotePeriod: quote.quotePeriod,
      quoteNotes: quote.quoteNotes,
      quoteSentAt: new Date(),
      quoteEmailStatus: "sent",
      quoteEmailError: null,
    },
  });

  return c.json(ok(updated));
});

export default app;
