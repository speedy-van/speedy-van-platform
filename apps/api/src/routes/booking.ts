import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
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
import { PaymentValidationError } from "../lib/payment-validation";
import { invoicePdfResponse } from "../lib/invoice-pdf";

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

// Public invoice PDF, authorised by booking reference and customer email.
app.get(
  "/invoice/:reference",
  zValidator("query", z.object({ email: z.string().email() })),
  async (c) => {
    const reference = c.req.param("reference");
    const { email } = c.req.valid("query");
    try {
      const booking = await db.booking.findUnique({
        where: { reference },
        include: { items: true },
      });
      if (!booking || booking.customerEmail.toLowerCase() !== email.toLowerCase()) {
        return c.json(fail("Not found", "NOT_FOUND"), 404);
      }
      return invoicePdfResponse(booking);
    } catch (err) {
      console.error("[booking] invoice download failed:", err);
      return c.json(fail("Invoice is temporarily unavailable. Please try again.", "INVOICE_UNAVAILABLE"), 503);
    }
  },
);

// Authenticated owner / admin invoice PDF
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

  return invoicePdfResponse(booking);
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
