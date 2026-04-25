import { Hono } from "hono";
import { db } from "@speedy-van/db";
import { ok } from "@speedy-van/shared";

const app = new Hono();

const KNOWN_SLUGS = ["rubbish-removal", "same-day-delivery"] as const;

// Public read-only endpoint. The frontend hits this on the booking flow and
// any page that needs to know whether a service is currently available.
app.get("/", async (c) => {
  const flags = await db.serviceFlag.findMany({
    where: { slug: { in: [...KNOWN_SLUGS] } },
  });

  const bySlug = new Map(flags.map((f) => [f.slug, f]));
  const items = KNOWN_SLUGS.map((slug) => {
    const existing = bySlug.get(slug);
    return existing
      ? { slug: existing.slug, enabled: existing.enabled, mode: existing.mode }
      : { slug, enabled: true, mode: null };
  });

  // Cache for a short window — admin updates propagate within ~30s.
  c.header("Cache-Control", "public, max-age=30, stale-while-revalidate=60");
  return c.json(ok({ items }));
});

export default app;
