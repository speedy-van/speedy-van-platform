import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { db } from "@speedy-van/db";
import { ok, fail } from "@speedy-van/shared";
import { requireAdmin } from "../../middleware/auth";

const app = new Hono();
app.use("*", requireAdmin);

function withContentType<T extends { value: string }>(item: T): T & { type: "text" | "json" } {
  const value = item.value.trim();
  const type = (value.startsWith("{") && value.endsWith("}")) || (value.startsWith("[") && value.endsWith("]")) ? "json" : "text";
  return { ...item, type };
}

app.get(
  "/",
  zValidator("query", z.object({ section: z.string().optional() })),
  async (c) => {
    const { section } = c.req.valid("query");
    const items = await db.content.findMany({
      where: section ? { section } : {},
      orderBy: [{ section: "asc" }, { key: "asc" }],
    });
    return c.json(ok({ items: items.map(withContentType) }));
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
    const { section, key, value } = data;
    const item = await db.content.upsert({
      where: { section_key: { section, key } },
      create: { section, key, value },
      update: { value },
    });
    return c.json(ok(withContentType(item)));
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
