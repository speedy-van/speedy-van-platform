import { Hono } from "hono";
import { zValidator } from "@/server/api/lib/z-validator";
import { z } from "zod";
import PDFDocument from "pdfkit";
import { db } from "@speedy-van/db";
import { randomUUID } from "crypto";
import {
  CreateBookingSchema,
  ConfirmBookingSchema,
  generateBookingReference,
  CancelBookingSchema,
  ok,
  fail,
  poundsToPence,
} from "@speedy-van/shared";
import {
  createBooking,
  confirmBooking,
  cancelBooking,
  getBookingForTracking,
} from "../services/booking.service";
import { requireAuth } from "../middleware/auth";
import { PaymentValidationError } from "../lib/payment-validation";
import { getDatabaseConfigError } from "../lib/database-config";
import { requireStripe } from "../lib/stripe";

const app = new Hono();

function useLocalBookingStub(): boolean {
  return process.env.NODE_ENV !== "production" && Boolean(getDatabaseConfigError());
}

async function createLocalBookingPayment(input: z.infer<typeof CreateBookingSchema>) {
  const paymentClient = requireStripe();
  const totalPence = poundsToPence(input.clientTotal);
  if (!Number.isFinite(input.clientTotal) || totalPence <= 0) {
    throw new PaymentValidationError("PAYMENT_UNAVAILABLE", "A payable quote is not available. Please try again.", 503);
  }

  const bookingId = `dev_${randomUUID()}`;
  const reference = input.draftReference || `DEV-${generateBookingReference()}`;
  const intent = await paymentClient.paymentIntents.create(
    {
      amount: totalPence,
      currency: "gbp",
      payment_method_types: ["card"],
      metadata: {
        bookingId,
        reference,
        localDev: "true",
        customerEmail: input.customerEmail,
        serviceSlug: input.serviceSlug,
      },
    },
    { idempotencyKey: `local-booking-payment-${bookingId}` },
  );

  if (!intent.client_secret) {
    throw new PaymentValidationError("PAYMENT_UNAVAILABLE", "Payment could not be started. Please contact support.", 503);
  }

  return {
    bookingId,
    bookingRef: reference,
    clientSecret: intent.client_secret,
    totalPrice: input.clientTotal,
  };
}

async function confirmLocalBookingPayment(bookingId: string, paymentIntentId: string) {
  const paymentClient = requireStripe();
  const intent = await paymentClient.paymentIntents.retrieve(paymentIntentId);
  if (intent.metadata?.bookingId !== bookingId || intent.metadata?.localDev !== "true") {
    throw new PaymentValidationError("BOOKING_STATE_CHANGED", "Booking changed. Please try confirming the payment again.", 409);
  }
  if (intent.status !== "succeeded") {
    throw new PaymentValidationError("PAYMENT_UNAVAILABLE", "Payment has not completed yet. Please retry confirmation.", 503);
  }
  return intent.metadata.reference || `DEV-${generateBookingReference()}`;
}

type InvoiceBooking = {
  reference: string;
  createdAt: Date;
  status: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string | null;
  serviceName: string;
  serviceVariant?: string | null;
  pickupAddress: string;
  dropoffAddress: string;
  scheduledAt: Date;
  selectedTimeSlot?: string | null;
  distanceMiles: number;
  price: number;
  totalPrice: number;
  items: Array<{ name: string; quantity: number }>;
};

function localDevInvoiceBooking(reference: string): InvoiceBooking {
  return {
    reference,
    createdAt: new Date(),
    status: "PAID",
    customerName: "Local test customer",
    customerEmail: "local-test@example.com",
    customerPhone: "07909 032889",
    serviceName: "SpeedyVan local test payment",
    serviceVariant: null,
    pickupAddress: "Local test pickup",
    dropoffAddress: "Local test drop-off",
    scheduledAt: new Date(),
    selectedTimeSlot: "test",
    distanceMiles: 0,
    price: 0,
    totalPrice: 0,
    items: [{ name: "Stripe test payment", quantity: 1 }],
  };
}

async function renderInvoicePdf(booking: InvoiceBooking): Promise<Buffer> {
  return new Promise<Buffer>((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50, size: "A4" });
    const chunks: Buffer[] = [];
    doc.on("data", (chunk: Buffer) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    // ── Header ────────────────────────────────────────────────────────────────
    doc.fontSize(26).font("Helvetica-Bold").fillColor("#0F172A").text("SPEEDY VAN", 50, 50);
    doc.fontSize(9).font("Helvetica").fillColor("#64748b");
    doc.text("1 Barrack Street, Office 2.18, Hamilton ML3 0HS", 50, 82);
    doc.text("support@speedyvan.uk  ·  +44 7909 032889", 50, 93);

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
      50,
      722,
    );
    doc.text("Thank you for choosing Speedy Van!", 50, 740, { align: "center", width: 495 });

    doc.end();
  });
}

async function invoiceResponse(booking: InvoiceBooking, disposition: "inline" | "attachment" = "inline"): Promise<Response> {
  const buffer = await renderInvoicePdf(booking);
  const body = new Uint8Array(buffer.byteLength);
  body.set(buffer);
  const filename = `INV-${booking.reference}.pdf`;
  return new Response(body.buffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Length": String(buffer.byteLength),
      "Content-Disposition": `${disposition}; filename="${filename}"; filename*=UTF-8''${encodeURIComponent(filename)}`,
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

app.post("/create", zValidator("json", CreateBookingSchema), async (c) => {
  const input = c.req.valid("json");
  try {
    if (useLocalBookingStub()) {
      return c.json(ok(await createLocalBookingPayment(input)), 201);
    }
    const { booking, clientSecret } = await createBooking(input);
    if (input.draftSessionKey) {
      await db.bookingDraft.delete({ where: { sessionKey: input.draftSessionKey } }).catch(() => {});
    }
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
    if (err instanceof PaymentValidationError) {
      return c.json(fail(err.message, err.code), err.status);
    }
    if (err instanceof Error && err.name === "PriceChangedError") {
      return c.json(fail(err.message, "PRICE_CHANGED"), 422);
    }
    throw err;
  }
});

app.post("/confirm", zValidator("json", ConfirmBookingSchema), async (c) => {
  const { bookingId, stripePaymentIntentId } = c.req.valid("json");
  try {
    if (useLocalBookingStub()) {
      return c.json(ok({ success: true, bookingRef: await confirmLocalBookingPayment(bookingId, stripePaymentIntentId) }));
    }
    const booking = await confirmBooking(bookingId, stripePaymentIntentId);
    if (booking.status === "CANCELLED") {
      return c.json(fail("Payment was received, but this booking is cancelled. Please contact support before booking again.", "BOOKING_CANCELLED"), 409);
    }
    return c.json(ok({ success: true, bookingRef: booking.reference }));
  } catch (err) {
    if (err instanceof PaymentValidationError) {
      return c.json(fail(err.message, err.code), err.status);
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
    c.header("Cache-Control", "private, no-store");
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
    try {
      const result = await cancelBooking(booking.id, {
        reason,
        actorRole: "CUSTOMER",
        actorId: booking.userId,
      });
      return c.json(ok({ success: true, refundAmount: result.refundAmount }));
    } catch (err) {
      if (err instanceof PaymentValidationError) {
        return c.json(fail(err.message, err.code), err.status);
      }
      throw err;
    }
  },
);

// Public customer invoice download. Live invoices require reference + booking email.
app.get(
  "/invoice/:reference",
  zValidator("query", z.object({ email: z.string().email().optional(), download: z.string().optional() })),
  async (c) => {
    const reference = c.req.param("reference");
    const { email, download } = c.req.valid("query");
    const disposition = download === "1" ? "attachment" : "inline";

    if (useLocalBookingStub() && reference.startsWith("DEV-")) {
      return invoiceResponse(localDevInvoiceBooking(reference), disposition);
    }

    if (!email) {
      return c.json(fail("Email is required to download this invoice.", "EMAIL_REQUIRED"), 400);
    }

    const booking = await db.booking.findUnique({
      where: { reference },
      include: { items: true },
    });
    if (!booking || booking.customerEmail.toLowerCase() !== email.toLowerCase()) {
      return c.json(fail("Invoice not found", "NOT_FOUND"), 404);
    }

    return invoiceResponse(booking, disposition);
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

  return invoiceResponse(booking, "attachment");
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
