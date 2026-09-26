import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { db } from "@speedy-van/db";
import { ok, fail } from "@speedy-van/shared";
import { randomBytes } from "crypto";

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
});

app.post("/save", zValidator("json", SaveDraftSchema), async (c) => {
  const { payload, email } = c.req.valid("json");
  let key = sessionKey(c);
  if (!key) {
    key = randomBytes(24).toString("hex");
  }

  const expiresAt = new Date(Date.now() + DRAFT_TTL_MS);
  await db.bookingDraft.upsert({
    where: { sessionKey: key },
    create: { sessionKey: key, payload, email, expiresAt },
    update: { payload, email, expiresAt, updatedAt: new Date() },
  });

  c.header(
    "Set-Cookie",
    `${SESSION_COOKIE}=${key}; Path=/; Max-Age=${DRAFT_TTL_MS / 1000}; SameSite=Lax; Secure`,
  );

  return c.json(ok({ sessionKey: key }));
});

app.get("/restore", async (c) => {
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
  const { count } = await db.bookingDraft.deleteMany({ where: { expiresAt: { lt: new Date() } } });
  return c.json(ok({ deleted: count }));
});

export default app;
