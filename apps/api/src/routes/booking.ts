import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import PDFDocument from "pdfkit";
import { db } from "@speedy-van/db";
import {
  CreateBookingSchema,
  ConfirmBookingSchema,
  CancelBookingSchema,
  ok,
  fail,
} from "@speedy-van/shared";
import {
  createBooking,
  confirmBooking,
  cancelBooking,
  getBookingForTracking,
} from "../services/booking.service";
import { requireAuth } from "../middleware/auth";

const app = new Hono();

app.post("/create", zValidator("json", CreateBookingSchema), async (c) => {
  const input = c.req.valid("json");
  try {
    const { booking, clientSecret } = await createBooking(input);
    return c.json(
      ok({
        bookingId: booking.id,
        bookingRef: booking.reference,
        clientSecret,
        totalPrice: booking.totalPrice,
      }),
      201,
    );
  } catch (err) {
    if (err instanceof Error && err.name === "PriceChangedError") {
      return c.json(fail(err.message, "PRICE_CHANGED"), 422);
    }
    throw err;
  }
});

app.post("/confirm", zValidator("json", ConfirmBookingSchema), async (c) => {
  const { bookingId, stripePaymentIntentId } = c.req.valid("json");
  try {
    const booking = await confirmBooking(bookingId, stripePaymentIntentId);
    return c.json(ok({ success: true, bookingRef: booking.reference }));
  } catch (err) {
    if (err instanceof Error && err.name === "PaymentNotSucceeded") {
      return c.json(fail(err.message, "PAYMENT_NOT_SUCCEEDED"), 400);
    }
    throw err;
  }
});

app.get("/check", zValidator("query", z.object({ email: z.string().email() })), async (c) => {
  const { email } = c.req.valid("query");
  const booking = await db.booking.findFirst({
    where: {
      customerEmail: email,
      status: { in: ["PENDING", "CONFIRMED", "ASSIGNED", "IN_PROGRESS"] },
    },
    orderBy: { createdAt: "desc" },
  });
  return c.json(
    ok({
      hasActiveBooking: Boolean(booking),
      booking: booking
        ? {
            id: booking.id,
            reference: booking.reference,
            status: booking.status,
            scheduledAt: booking.scheduledAt,
          }
        : null,
    }),
  );
});

app.get(
  "/track/:reference",
  zValidator("query", z.object({ email: z.string().email() })),
  async (c) => {
    const reference = c.req.param("reference");
    const { email } = c.req.valid("query");
    try {
      const data = await getBookingForTracking(reference, email);
      return c.json(ok(data));
    } catch {
      return c.json(fail("Booking not found", "NOT_FOUND"), 404);
    }
  },
);

app.post(
  "/track/:reference/cancel",
  zValidator("json", CancelBookingSchema),
  async (c) => {
    const reference = c.req.param("reference");
    const { email, reason } = c.req.valid("json");
    const booking = await db.booking.findUnique({ where: { reference } });
    if (!booking || booking.customerEmail.toLowerCase() !== email.toLowerCase()) {
      return c.json(fail("Booking not found", "NOT_FOUND"), 404);
    }
    const result = await cancelBooking(booking.id, {
      reason,
      actorRole: "CUSTOMER",
      actorId: booking.userId,
    });
    return c.json(ok({ success: true, refundAmount: result.refundAmount }));
  },
);

// Authenticated owner / admin views
app.get("/:id", requireAuth, async (c) => {
  const id = c.req.param("id");
  const userId = c.get("userId") as string;
  const role = c.get("userRole") as string;

  const booking = await db.booking.findUnique({
    where: { id },
    include: {
      items: true,
      trackingEvents: { orderBy: { createdAt: "asc" } },
      statusHistory: { orderBy: { createdAt: "asc" } },
      driver: { include: { user: true } },
    },
  });
  if (!booking) return c.json(fail("Not found", "NOT_FOUND"), 404);
  if (role !== "ADMIN" && booking.userId !== userId) {
    return c.json(fail("Forbidden", "FORBIDDEN"), 403);
  }
  return c.json(ok(booking));
});

// Invoice PDF
app.get("/:id/invoice", requireAuth, async (c) => {
  const id = c.req.param("id");
  const userId = c.get("userId") as string;
  const role = c.get("userRole") as string;
  const booking = await db.booking.findUnique({
    where: { id },
    include: { items: true },
  });
  if (!booking) return c.json(fail("Not found", "NOT_FOUND"), 404);
  if (role !== "ADMIN" && booking.userId !== userId) {
    return c.json(fail("Forbidden", "FORBIDDEN"), 403);
  }

  const buffer = await new Promise<Buffer>((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50, size: "A4" });
    const chunks: Buffer[] = [];
    doc.on("data", (chunk: Buffer) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    // ── Header ────────────────────────────────────────────────────────────────
    doc.fontSize(26).font("Helvetica-Bold").fillColor("#0F172A").text("SPEEDY VAN", 50, 50);
    doc.fontSize(9).font("Helvetica").fillColor("#64748b");
    doc.text("1 Barrack Street, Office 2.18, Hamilton ML3 0HS", 50, 82);
    doc.text("support@speedy-van.co.uk  ·  01202 129 746", 50, 93);

    // Invoice label (right)
    doc.fontSize(22).font("Helvetica-Bold").fillColor("#0F172A").text("INVOICE", 400, 50, { align: "right", width: 145 });
    doc.fontSize(9).font("Helvetica").fillColor("#64748b");
    doc.text(`INV-${booking.reference}`, 400, 80, { align: "right", width: 145 });
    doc.text(`Date: ${new Date(booking.createdAt).toLocaleDateString("en-GB")}`, 400, 91, { align: "right", width: 145 });
    doc.text(`Status: ${booking.status}`, 400, 102, { align: "right", width: 145 });

    // Divider
    doc.moveTo(50, 120).lineTo(545, 120).strokeColor("#e2e8f0").lineWidth(1).stroke();

    // ── Bill To ───────────────────────────────────────────────────────────────
    doc.moveDown(1.5);
    doc.fontSize(9).font("Helvetica-Bold").fillColor("#64748b").text("BILL TO", 50, 135);
    doc.fontSize(11).font("Helvetica-Bold").fillColor("#0F172A").text(booking.customerName, 50, 148);
    doc.fontSize(9).font("Helvetica").fillColor("#64748b");
    doc.text(booking.customerEmail, 50, 161);
    if (booking.customerPhone) doc.text(booking.customerPhone, 50, 172);

    // ── Service details ───────────────────────────────────────────────────────
    const detailY = 210;
    doc.moveTo(50, 200).lineTo(545, 200).strokeColor("#e2e8f0").lineWidth(1).stroke();
    doc.fontSize(9).font("Helvetica-Bold").fillColor("#64748b").text("SERVICE DETAILS", 50, detailY);
    doc.fontSize(10).font("Helvetica").fillColor("#0F172A");
    doc.text(
      `${booking.serviceName}${booking.serviceVariant ? ` (${booking.serviceVariant})` : ""}`,
      50,
      detailY + 14,
    );
    doc.fontSize(9).fillColor("#64748b");
    doc.text(`From: ${booking.pickupAddress}`, 50, detailY + 28);
    doc.text(`To:     ${booking.dropoffAddress}`, 50, detailY + 40);
    doc.text(
      `Date: ${new Date(booking.scheduledAt).toLocaleDateString("en-GB")} — ${booking.selectedTimeSlot ?? ""}`,
      50,
      detailY + 52,
    );
    doc.text(`Distance: ${booking.distanceMiles.toFixed(1)} miles`, 50, detailY + 64);

    // ── Items ─────────────────────────────────────────────────────────────────
    if (booking.items.length > 0) {
      const itemsY = detailY + 88;
      doc.moveTo(50, itemsY - 8).lineTo(545, itemsY - 8).strokeColor("#e2e8f0").lineWidth(1).stroke();
      doc.fontSize(9).font("Helvetica-Bold").fillColor("#64748b").text("ITEMS", 50, itemsY);
      let cursor = itemsY + 14;
      for (const item of booking.items.slice(0, 20)) {
        doc.fontSize(9).font("Helvetica").fillColor("#0F172A").text(`${item.name} × ${item.quantity}`, 50, cursor);
        cursor += 13;
      }
    }

    // ── Pricing ───────────────────────────────────────────────────────────────
    const priceY = 430;
    doc.moveTo(50, priceY).lineTo(545, priceY).strokeColor("#e2e8f0").lineWidth(1).stroke();
    doc.fontSize(9).font("Helvetica-Bold").fillColor("#64748b").text("PAYMENT", 50, priceY + 8);
    doc.fontSize(10).font("Helvetica").fillColor("#0F172A");
    doc.text("Subtotal", 350, priceY + 8, { width: 100, align: "right" });
    doc.text(`£${booking.price.toFixed(2)}`, 460, priceY + 8, { width: 85, align: "right" });
    doc.text("Total paid", 350, priceY + 22, { width: 100, align: "right" });
    doc.fontSize(12).font("Helvetica-Bold").fillColor("#0F172A");
    doc.text(`£${booking.totalPrice.toFixed(2)}`, 460, priceY + 20, { width: 85, align: "right" });

    // ── Footer ────────────────────────────────────────────────────────────────
    doc.moveTo(50, 700).lineTo(545, 700).strokeColor("#e2e8f0").lineWidth(1).stroke();
    doc.fontSize(8).font("Helvetica").fillColor("#94a3b8");
    doc.text("Covered by Goods in Transit Insurance.", 50, 710);
    doc.text(
      "Cancellation: Free 48h+ before move  ·  50% refund 24-48h  ·  No refund within 24h",
      50, 722,
    );
    doc.text("Thank you for choosing Speedy Van!", 50, 740, { align: "center", width: 495 });

    doc.end();
  });

  return new Response(buffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="INV-${booking.reference}.pdf"`,
      "Cache-Control": "private, no-store",
    },
  });
});

// Public review submission (auth by reference+email)
app.post(
  "/review",
  zValidator(
    "json",
    z.object({
      reference: z.string().min(1),
      email: z.string().email(),
      rating: z.number().int().min(1).max(5),
      comment: z.string().min(1).max(2000),
    }),
  ),
  async (c) => {
    const { reference, email, rating, comment } = c.req.valid("json");
    const booking = await db.booking.findUnique({
      where: { reference },
      include: { review: true },
    });
    if (!booking || booking.customerEmail.toLowerCase() !== email.toLowerCase()) {
      return c.json(fail("Booking not found", "NOT_FOUND"), 404);
    }
    if (booking.status !== "COMPLETED") {
      return c.json(fail("Booking must be completed before reviewing", "NOT_COMPLETED"), 400);
    }
    if (booking.review) {
      return c.json(fail("Review already submitted", "ALREADY_REVIEWED"), 409);
    }
    const review = await db.review.create({
      data: { bookingId: booking.id, userId: booking.userId, rating, comment },
    });
    return c.json(ok({ review: { id: review.id, rating: review.rating, comment: review.comment } }), 201);
  },
);

export default app;
