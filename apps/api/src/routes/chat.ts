import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { db } from "@speedy-van/db";
import { ok, fail, SendMessageSchema } from "@speedy-van/shared";
import { requireAuth } from "../middleware/auth";
import { triggerEvent } from "../lib/pusher";
import { sendNewMessage } from "../services/email.service";
import { notifyChatMessage } from "../services/notification.service";

const app = new Hono();
app.use("*", requireAuth);

async function isParticipant(conversationId: string, userId: string): Promise<boolean> {
  const part = await db.conversationParticipant.findUnique({
    where: { conversationId_userId: { conversationId, userId } },
  });
  return Boolean(part);
}

app.get("/conversations", async (c) => {
  const userId = c.get("userId") as string;
  const conversations = await db.conversation.findMany({
    where: { participants: { some: { userId } } },
    include: {
      booking: {
        select: { id: true, reference: true, serviceName: true, status: true },
      },
      messages: { orderBy: { createdAt: "desc" }, take: 1 },
    },
    orderBy: { updatedAt: "desc" },
  });
  return c.json(ok({ conversations }));
});

app.post(
  "/conversations",
  zValidator("json", z.object({ bookingId: z.string() })),
  async (c) => {
    const userId = c.get("userId") as string;
    const role = c.get("userRole") as string;
    const { bookingId } = c.req.valid("json");

    const booking = await db.booking.findUnique({ where: { id: bookingId } });
    if (!booking) return c.json(fail("Booking not found", "NOT_FOUND"), 404);
    if (role !== "ADMIN" && booking.userId !== userId) {
      return c.json(fail("Forbidden", "FORBIDDEN"), 403);
    }

    const existing = await db.conversation.findUnique({ where: { bookingId } });
    if (existing) return c.json(ok({ conversation: existing }));

    const admins = await db.user.findMany({ where: { role: "ADMIN", isActive: true } });
    const conversation = await db.conversation.create({
      data: {
        bookingId,
        participants: {
          create: [
            { userId: booking.userId, role: "CUSTOMER" },
            ...admins.map((a) => ({ userId: a.id, role: "ADMIN" as const })),
          ],
        },
      },
    });
    return c.json(ok({ conversation }), 201);
  },
);

app.get(
  "/conversations/:id/messages",
  zValidator(
    "query",
    z.object({
      page: z.coerce.number().int().min(1).default(1),
      limit: z.coerce.number().int().min(1).max(100).default(50),
    }),
  ),
  async (c) => {
    const userId = c.get("userId") as string;
    const conversationId = c.req.param("id");
    if (!(await isParticipant(conversationId, userId))) {
      return c.json(fail("Forbidden", "FORBIDDEN"), 403);
    }
    const { page, limit } = c.req.valid("query");
    const [messages, total] = await Promise.all([
      db.message.findMany({
        where: { conversationId },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
        include: { sender: { select: { id: true, name: true, role: true } } },
      }),
      db.message.count({ where: { conversationId } }),
    ]);
    return c.json(
      ok({
        messages: messages.reverse(),
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.max(1, Math.ceil(total / limit)),
        },
      }),
    );
  },
);

app.post(
  "/conversations/:id/messages",
  zValidator("json", SendMessageSchema),
  async (c) => {
    const userId = c.get("userId") as string;
    const conversationId = c.req.param("id");
    if (!(await isParticipant(conversationId, userId))) {
      return c.json(fail("Forbidden", "FORBIDDEN"), 403);
    }
    const { body } = c.req.valid("json");
    const sender = await db.user.findUnique({ where: { id: userId } });
    if (!sender) return c.json(fail("Sender not found", "NOT_FOUND"), 404);

    const message = await db.message.create({
      data: { conversationId, senderId: userId, body },
      include: { sender: { select: { id: true, name: true, role: true } } },
    });
    await db.conversation.update({
      where: { id: conversationId },
      data: { updatedAt: new Date() },
    });

    triggerEvent(`conversation-${conversationId}`, "new-message", message);

    // Notify other participants
    const others = await db.conversationParticipant.findMany({
      where: { conversationId, userId: { not: userId } },
      include: { user: true },
    });
    const conv = await db.conversation.findUnique({
      where: { id: conversationId },
      include: { booking: { select: { reference: true } } },
    });
    if (conv) {
      for (const p of others) {
        await notifyChatMessage(p.userId, conv.booking.reference, sender.name).catch(() => {});
        await sendNewMessage(p.user.email, sender.name, body, conv.booking.reference).catch(() => {});
      }
    }

    return c.json(ok({ message }), 201);
  },
);

app.post("/conversations/:id/read", async (c) => {
  const userId = c.get("userId") as string;
  const conversationId = c.req.param("id");
  if (!(await isParticipant(conversationId, userId))) {
    return c.json(fail("Forbidden", "FORBIDDEN"), 403);
  }
  await db.conversationParticipant.update({
    where: { conversationId_userId: { conversationId, userId } },
    data: { lastReadAt: new Date() },
  });
  return c.json(ok({ success: true }));
});

export default app;

// ─── Public booking-messages (auth via reference+email) ───────────────────────
export const bookingMessagesApp = new Hono();

const BookingMsgSchema = z.object({
  bookingRef: z.string().min(1),
  email: z.string().email(),
  content: z.string().min(1).max(4000),
});

async function getOrCreateConversationForBooking(
  bookingId: string,
  customerId: string,
): Promise<string> {
  const existing = await db.conversation.findUnique({ where: { bookingId } });
  if (existing) return existing.id;

  const admins = await db.user.findMany({ where: { role: "ADMIN", isActive: true } });
  const created = await db.conversation.create({
    data: {
      bookingId,
      participants: {
        create: [
          { userId: customerId, role: "CUSTOMER" },
          ...admins.map((a) => ({ userId: a.id, role: "ADMIN" as const })),
        ],
      },
    },
  });
  return created.id;
}

// GET /chat/booking-messages/:ref?email=xxx
bookingMessagesApp.get(
  "/booking-messages/:ref",
  zValidator("query", z.object({ email: z.string().email() })),
  async (c) => {
    const reference = c.req.param("ref");
    const { email } = c.req.valid("query");

    const booking = await db.booking.findUnique({ where: { reference } });
    if (!booking || booking.customerEmail.toLowerCase() !== email.toLowerCase()) {
      return c.json(fail("Not found", "NOT_FOUND"), 404);
    }

    const conversation = await db.conversation.findUnique({
      where: { bookingId: booking.id },
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
          include: { sender: { select: { id: true, name: true, role: true } } },
        },
      },
    });

    if (!conversation) {
      return c.json(ok({ messages: [], conversationId: null }));
    }

    return c.json(
      ok({
        conversationId: conversation.id,
        messages: conversation.messages.map((m) => ({
          id: m.id,
          body: m.body,
          createdAt: m.createdAt.toISOString(),
          sender: m.sender,
        })),
      }),
    );
  },
);

// POST /chat/booking-messages
bookingMessagesApp.post(
  "/booking-messages",
  zValidator("json", BookingMsgSchema),
  async (c) => {
    const { bookingRef, email, content } = c.req.valid("json");

    const booking = await db.booking.findUnique({ where: { reference: bookingRef } });
    if (!booking || booking.customerEmail.toLowerCase() !== email.toLowerCase()) {
      return c.json(fail("Not found", "NOT_FOUND"), 404);
    }

    const conversationId = await getOrCreateConversationForBooking(booking.id, booking.userId);

    const message = await db.message.create({
      data: {
        conversationId,
        senderId: booking.userId,
        body: content.trim(),
      },
      include: { sender: { select: { id: true, name: true, role: true } } },
    });

    // Notify admins via Pusher + email
    const admins = await db.user.findMany({ where: { role: "ADMIN", isActive: true } });

    triggerEvent(`conversation-${conversationId}`, "new-message", {
      id: message.id,
      body: message.body,
      createdAt: message.createdAt.toISOString(),
      sender: message.sender,
    });

    await Promise.all(
      admins.map((admin) =>
        sendNewMessage(admin.email, booking.customerName, content, bookingRef),
      ),
    );

    return c.json(
      ok({
        message: {
          id: message.id,
          body: message.body,
          createdAt: message.createdAt.toISOString(),
          sender: message.sender,
        },
        conversationId,
      }),
      201,
    );
  },
);
