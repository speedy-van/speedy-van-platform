import { Hono } from "hono";
import { zValidator } from "@/server/api/lib/z-validator";
import { z } from "zod";
import { db } from "@speedy-van/db";
import { generateBookingReference, ok } from "@speedy-van/shared";
import { randomBytes } from "crypto";
import { getDatabaseConfigError } from "../lib/database-config";

const app = new Hono();

const DRAFT_TTL_MS = 24 * 60 * 60 * 1000;
const SESSION_COOKIE = "sv_draft_session";
const MAX_PAYLOAD_BYTES = 64_000;

function sessionKey(c: { req: { header: (k: string) => string | undefined } }): string | null {
  const cookie = c.req.header("cookie") ?? "";
  const match = cookie.match(new RegExp(`(?:^|;\\s*)${SESSION_COOKIE}=([^;]+)`));
  return match?.[1] ?? null;
}

const SaveDraftSchema = z.object({
  payload: z.string().max(MAX_PAYLOAD_BYTES),
  email: z.string().email().optional(),
  sessionKey: z.string().min(16).max(128).optional(),
});

function isObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function isBookingReference(value: unknown): value is string {
  return typeof value === "string" && /^SVR-\d{4}-[A-Z2-9]{6}$/.test(value);
}

function useLocalDraftStub(): boolean {
  return process.env.NODE_ENV !== "production" && Boolean(getDatabaseConfigError());
}

async function unusedBookingReference(preferred?: unknown, checkDatabase = true): Promise<string> {
  const candidates = [
    isBookingReference(preferred) ? preferred : undefined,
    generateBookingReference(),
    generateBookingReference(),
    generateBookingReference(),
  ].filter((reference): reference is string => Boolean(reference));

  for (const reference of candidates) {
    if (!checkDatabase) return reference;
    const existing = await db.booking.findUnique({ where: { reference }, select: { id: true } });
    if (!existing) return reference;
  }

  return generateBookingReference();
}

async function payloadWithReference(payload: string, checkDatabase = true): Promise<{ payload: string; reference: string }> {
  const parsed = JSON.parse(payload) as unknown;
  const envelope = isObject(parsed) ? parsed : {};
  const state = isObject(envelope.state) ? envelope.state : {};
  const reference = await unusedBookingReference(state.bookingRef, checkDatabase);
  return {
    payload: JSON.stringify({
      ...envelope,
      state: {
        ...state,
        bookingRef: reference,
      },
    }),
    reference,
  };
}

function secureCookieSuffix(url: string, forwardedProto?: string): string {
  if (forwardedProto === "https") return "; Secure";
  try {
    return new URL(url).protocol === "https:" ? "; Secure" : "";
  } catch {
    return "";
  }
}

app.post("/save", zValidator("json", SaveDraftSchema), async (c) => {
  const { payload, email, sessionKey: bodySessionKey } = c.req.valid("json");
  let key = sessionKey(c) ?? bodySessionKey;
  if (!key) {
    key = randomBytes(24).toString("hex");
  }

  const localOnly = useLocalDraftStub();
  const saved = await payloadWithReference(payload, !localOnly);
  if (localOnly) {
    c.header(
      "Set-Cookie",
      `${SESSION_COOKIE}=${key}; Path=/; Max-Age=${DRAFT_TTL_MS / 1000}; SameSite=Lax${secureCookieSuffix(c.req.url, c.req.header("x-forwarded-proto"))}`,
    );
    return c.json(ok({ sessionKey: key, reference: saved.reference, persisted: false }));
  }

  const expiresAt = new Date(Date.now() + DRAFT_TTL_MS);
  await db.bookingDraft.upsert({
    where: { sessionKey: key },
    create: { sessionKey: key, payload: saved.payload, email, expiresAt },
    update: { payload: saved.payload, email, expiresAt, updatedAt: new Date() },
  });

  c.header(
    "Set-Cookie",
    `${SESSION_COOKIE}=${key}; Path=/; Max-Age=${DRAFT_TTL_MS / 1000}; SameSite=Lax${secureCookieSuffix(c.req.url, c.req.header("x-forwarded-proto"))}`,
  );

  return c.json(ok({ sessionKey: key, reference: saved.reference }));
});

app.get("/restore", async (c) => {
  if (useLocalDraftStub()) return c.json(ok({ draft: null }));
  const key = sessionKey(c);
  if (!key) return c.json(ok({ draft: null }));

  const draft = await db.bookingDraft.findUnique({ where: { sessionKey: key } });
  if (!draft || draft.expiresAt < new Date()) {
    if (draft) await db.bookingDraft.delete({ where: { sessionKey: key } }).catch(() => {});
    return c.json(ok({ draft: null }));
  }

  return c.json(ok({ draft: { payload: draft.payload, savedAt: draft.savedAt.toISOString() } }));
});

// Clean up expired drafts — called by a cron or health endpoint
app.delete("/expired", async (c) => {
  if (useLocalDraftStub()) return c.json(ok({ deleted: 0 }));
  const { count } = await db.bookingDraft.deleteMany({ where: { expiresAt: { lt: new Date() } } });
  return c.json(ok({ deleted: count }));
});

export default app;
