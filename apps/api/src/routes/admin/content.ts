import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { db } from "@speedy-van/db";
import { ok, fail } from "@speedy-van/shared";
import { requireAdmin } from "../../middleware/auth";

const app = new Hono();
app.use("*", requireAdmin);

app.get(
  "/",
  zValidator("query", z.object({ section: z.string().optional() })),
  async (c) => {
    const { section } = c.req.valid("query");
    const items = await db.content.findMany({
      where: section ? { section } : {},
      orderBy: [{ section: "asc" }, { key: "asc" }],
    });
    return c.json(ok({ items }));
  },
);

app.put(
  "/",
  zValidator(
    "json",
    z.object({
      section: z.string().min(1),
      key: z.string().min(1),
      value: z.string(),
      type: z.enum(["text", "html", "markdown", "json"]).default("text"),
    }),
  ),
  async (c) => {
    const data = c.req.valid("json");
    const item = await db.content.upsert({
      where: { section_key: { section: data.section, key: data.key } },
      create: data,
      update: { value: data.value, type: data.type } as never,
    });
    return c.json(ok(item));
  },
);

app.delete("/:id", async (c) => {
  const id = c.req.param("id");
  const exists = await db.content.findUnique({ where: { id } });
  if (!exists) return c.json(fail("Not found", "NOT_FOUND"), 404);
  await db.content.delete({ where: { id } });
  return c.json(ok({ success: true }));
});

export default app;
