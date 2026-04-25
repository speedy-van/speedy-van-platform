import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { db } from "@speedy-van/db";
import { ok, fail, paginated } from "@speedy-van/shared";
import { requireAdmin } from "../../middleware/auth";
import { sendEuropeanEnquiryQuote } from "../../services/email.service";

const app = new Hono();
app.use("*", requireAdmin);

const ALLOWED_STATUSES = ["new", "quoted", "accepted", "declined"] as const;

app.get(
  "/",
  zValidator(
    "query",
    z.object({
      q: z.string().optional(),
      status: z.enum(ALLOWED_STATUSES).optional(),
      page: z.coerce.number().int().min(1).default(1),
      limit: z.coerce.number().int().min(1).max(100).default(20),
    }),
  ),
  async (c) => {
    const { q, status, page, limit } = c.req.valid("query");
    const where = {
      ...(status ? { status } : {}),
      ...(q
        ? {
            OR: [
              { customerName: { contains: q, mode: "insensitive" as const } },
              { customerEmail: { contains: q, mode: "insensitive" as const } },
              { customerPhone: { contains: q, mode: "insensitive" as const } },
              { toCountry: { contains: q, mode: "insensitive" as const } },
              { toCity: { contains: q, mode: "insensitive" as const } },
            ],
          }
        : {}),
    };
    const [items, total] = await Promise.all([
      db.europeanEnquiry.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      db.europeanEnquiry.count({ where }),
    ]);
    return c.json(paginated(items, page, limit, total));
  },
);

app.get("/:id", async (c) => {
  const enquiry = await db.europeanEnquiry.findUnique({ where: { id: c.req.param("id") } });
  if (!enquiry) return c.json(fail("Not found", "NOT_FOUND"), 404);
  return c.json(ok(enquiry));
});

app.patch(
  "/:id",
  zValidator(
    "json",
    z.object({
      status: z.enum(ALLOWED_STATUSES).optional(),
      quotedPrice: z.number().min(0).max(1_000_000).optional().nullable(),
      adminNotes: z.string().max(2000).optional().nullable(),
    }),
  ),
  async (c) => {
    const id = c.req.param("id");
    const body = c.req.valid("json");
    const existing = await db.europeanEnquiry.findUnique({ where: { id } });
    if (!existing) return c.json(fail("Not found", "NOT_FOUND"), 404);
    const updated = await db.europeanEnquiry.update({
      where: { id },
      data: {
        ...(body.status !== undefined ? { status: body.status } : {}),
        ...(body.quotedPrice !== undefined ? { quotedPrice: body.quotedPrice } : {}),
        ...(body.adminNotes !== undefined ? { adminNotes: body.adminNotes } : {}),
      },
    });
    return c.json(ok(updated));
  },
);

app.post("/:id/send-quote", async (c) => {
  const id = c.req.param("id");
  const enquiry = await db.europeanEnquiry.findUnique({ where: { id } });
  if (!enquiry) return c.json(fail("Not found", "NOT_FOUND"), 404);
  if (enquiry.quotedPrice == null || enquiry.quotedPrice <= 0) {
    return c.json(fail("Set a quoted price before sending", "NO_QUOTE"), 400);
  }
  try {
    await sendEuropeanEnquiryQuote({
      customerEmail: enquiry.customerEmail,
      customerName: enquiry.customerName,
      toCountry: enquiry.toCountry,
      toCity: enquiry.toCity,
      quotedPrice: enquiry.quotedPrice,
      adminNotes: enquiry.adminNotes,
    });
  } catch (err) {
    console.error("[admin/enquiries] send-quote email failed:", err);
    return c.json(fail("Could not send the quote email", "EMAIL_ERROR"), 500);
  }
  const updated = await db.europeanEnquiry.update({
    where: { id },
    data: { status: "quoted", quoteSentAt: new Date() },
  });
  return c.json(ok(updated));
});

export default app;
