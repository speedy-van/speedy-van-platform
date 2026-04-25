import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { db } from "@speedy-van/db";
import { ok, fail } from "@speedy-van/shared";
import { requireAdmin } from "../../middleware/auth";

const app = new Hono();
app.use("*", requireAdmin);

// Slugs that the admin UI exposes today.
const KNOWN_SLUGS = ["rubbish-removal", "same-day-delivery"] as const;
type KnownSlug = (typeof KNOWN_SLUGS)[number];

const slugSchema = z.enum(KNOWN_SLUGS);
const modeSchema = z.enum(["popup"]).nullable();

app.get("/", async (c) => {
  const flags = await db.serviceFlag.findMany({
    where: { slug: { in: [...KNOWN_SLUGS] } },
    orderBy: { slug: "asc" },
  });

  // Ensure every known slug has a row, even if the seed hasn't run.
  const bySlug = new Map(flags.map((f) => [f.slug as KnownSlug, f]));
  const items = KNOWN_SLUGS.map((slug) => {
    const existing = bySlug.get(slug);
    return existing
      ? {
          slug: existing.slug,
          enabled: existing.enabled,
          mode: existing.mode,
          updatedAt: existing.updatedAt,
        }
      : { slug, enabled: true, mode: null, updatedAt: null };
  });

  return c.json(ok({ items }));
});

app.put(
  "/:slug",
  zValidator(
    "json",
    z.object({
      enabled: z.boolean(),
      mode: modeSchema.optional(),
    }),
  ),
  async (c) => {
    const slugParam = c.req.param("slug");
    const parsed = slugSchema.safeParse(slugParam);
    if (!parsed.success) {
      return c.json(fail("Unknown service flag", "NOT_FOUND"), 404);
    }
    const slug = parsed.data;
    const { enabled, mode = null } = c.req.valid("json");

    const flag = await db.serviceFlag.upsert({
      where: { slug },
      create: { slug, enabled, mode },
      update: { enabled, mode },
    });

    return c.json(
      ok({ slug: flag.slug, enabled: flag.enabled, mode: flag.mode, updatedAt: flag.updatedAt }),
    );
  },
);

export default app;
