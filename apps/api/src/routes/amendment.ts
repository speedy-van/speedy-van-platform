import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { db } from "@speedy-van/db";
import { ok, fail, poundsToPence } from "@speedy-van/shared";
import { requireRole } from "../middleware/auth";
import { requireStripe } from "../lib/stripe";

const app = new Hono();

const AUTO_CHARGE_THRESHOLD_GBP = 20; // confirmed by operator

const AmendmentSchema = z.object({
  bookingId: z.string().min(1),
  email: z.string().email(),
  changes: z.object({
    selectedDate: z.string().optional(),
    selectedTimeSlot: z.enum(["morning", "afternoon", "evening"]).optional(),
    helpersCount: z.number().int().min(0).max(4).optional(),
    needsPacking: z.boolean().optional(),
    needsAssembly: z.boolean().optional(),
    assemblyType: z.enum(["dismantle", "assemble", "both"]).optional(),
    assemblyQty: z.number().int().min(1).max(50).optional(),
    note: z.string().max(500).optional(),
  }),
  newClientTotal: z.number().nonnegative(),
});

app.post("/request", zValidator("json", AmendmentSchema), async (c) => {
  const input = c.req.valid("json");

  const booking = await db.booking.findFirst({
    where: { id: input.bookingId, customerEmail: input.email },
    select: { id: true, reference: true, status: true, totalPrice: true, customerEmail: true, customerName: true },
  });

  if (!booking) return c.json(fail("Booking not found", "NOT_FOUND"), 404);
  if (!["PENDING", "CONFIRMED", "ASSIGNED"].includes(booking.status)) {
    return c.json(fail("Amendments are not possible for a booking in this state.", "AMENDMENT_NOT_ALLOWED"), 422);
  }

  const priceDelta = input.newClientTotal - Number(booking.totalPrice);
  const requiresApproval = Math.abs(priceDelta) > AUTO_CHARGE_THRESHOLD_GBP;

  if (requiresApproval) {
    // Price change exceeds threshold — queue for admin review
    await db.statusHistory.create({
      data: {
        bookingId: booking.id,
        fromStatus: booking.status,
        toStatus: "AMENDMENT_REQUESTED",
        note: JSON.stringify({
          changes: input.changes,
          priceDelta: priceDelta.toFixed(2),
          newTotal: input.newClientTotal,
        }),
        changedById: null,
      },
    }).catch(() => {/* best-effort */});

    return c.json(ok({
      outcome: "pending_approval",
      message: "Your amendment request has been sent to the team. We will confirm within 2 hours.",
    }));
  }

  // Auto-approve: update booking and charge/refund the difference
  const stripe = requireStripe();

  if (priceDelta > 0) {
    // Additional charge — create a new payment intent
    const intent = await stripe.paymentIntents.create({
      amount: poundsToPence(priceDelta),
      currency: "gbp",
      metadata: { bookingId: booking.id, type: "amendment" },
      automatic_payment_methods: { enabled: true },
    });
    await db.booking.update({
      where: { id: booking.id },
      data: { totalPrice: input.newClientTotal },
    });
    return c.json(ok({ outcome: "additional_charge", clientSecret: intent.client_secret }));
  }

  if (priceDelta < 0) {
    // Refund the difference
    const payments = await stripe.paymentIntents.list({ limit: 10 }).catch(() => ({ data: [] }));
    const intent = payments.data.find((p) => p.metadata.bookingId === booking.id && p.status === "succeeded");
    if (intent) {
      await stripe.refunds.create({
        payment_intent: intent.id,
        amount: poundsToPence(Math.abs(priceDelta)),
      }).catch(() => {/* log in prod */});
    }
    await db.booking.update({
      where: { id: booking.id },
      data: { totalPrice: input.newClientTotal },
    });
  }

  return c.json(ok({ outcome: "approved", newTotal: input.newClientTotal }));
});

// Admin endpoint to approve or reject a pending amendment
app.post("/admin/resolve", requireRole("ADMIN"), zValidator("json", z.object({
  bookingId: z.string(),
  approved: z.boolean(),
})), async (c) => {
  const { bookingId, approved } = c.req.valid("json");
  const booking = await db.booking.findUnique({ where: { id: bookingId } });
  if (!booking) return c.json(fail("Not found", "NOT_FOUND"), 404);

  await db.statusHistory.create({
    data: {
      bookingId,
      fromStatus: "AMENDMENT_REQUESTED",
      toStatus: approved ? "AMENDMENT_APPROVED" : "AMENDMENT_REJECTED",
      note: approved ? "Admin approved amendment" : "Admin rejected amendment",
      changedById: null,
    },
  }).catch(() => {/* best-effort */});

  return c.json(ok({ outcome: approved ? "approved" : "rejected" }));
});

export default app;
