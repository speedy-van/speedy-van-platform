import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { db } from "@speedy-van/db";
import { fail, ok } from "@speedy-van/shared";
import { requireAdmin } from "../../middleware/auth";

const SERVICE_IMAGE_SECTION = "images.services";
const PUBLIC_SITE_URL = (process.env["PUBLIC_SITE_URL"] ?? "https://www.speedyvan.uk").replace(/\/+$/, "");
const MAX_IMAGE_VALUE_LENGTH = 4_500_000;

const SERVICE_IMAGE_DEFAULTS: Record<string, string> = {
  "man-and-van": "/images/services/man-and-van.jpg",
  "flat-removals": "/images/services/student-move.jpg",
  "small-moves": "/images/services/man-and-van.jpg",
  "storage": "/images/services/storage.jpeg",
  "other": "/images/services/other.jpg",
  "house-removal": "/images/services/house-removal.jpg",
  "long-distance-removals": "/images/services/house-removal.jpg",
  "office-removal": "/images/services/office-removal.jpg",
  "student-move": "/images/services/student-move.jpg",
  "furniture-delivery": "/images/services/furniture-delivery.jpg",
  "ikea-delivery": "/images/services/ikea-delivery.jpg",
  "rubbish-removal": "/images/services/rubbish-removal.jpg",
  "piano-moving": "/images/services/piano-moving.jpg",
  "same-day-delivery": "/images/services/same-day-delivery.jpg",
  "packing-service": "/images/services/packing-service.jpg",
};

type ImageSource = "service" | "item" | "content";

type ImageAsset = {
  id: string;
  source: ImageSource;
  section: string;
  key: string;
  title: string;
  subtitle: string;
  imageUrl: string | null;
  previewUrl: string | null;
  isDefault: boolean;
  updatedAt: string | null;
};

const app = new Hono();
app.use("*", requireAdmin);

function titleFromSlug(slug: string): string {
  return slug
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function previewUrl(imageUrl: string | null | undefined): string | null {
  const value = imageUrl?.trim();
  if (!value) return null;
  if (value.startsWith("data:") || value.startsWith("http://") || value.startsWith("https://")) return value;
  if (value.startsWith("/")) return `${PUBLIC_SITE_URL}${value}`;
  return value;
}

function matchesQuery(asset: ImageAsset, query: string): boolean {
  if (!query) return true;
  const haystack = `${asset.section} ${asset.key} ${asset.title} ${asset.subtitle} ${asset.imageUrl ?? ""}`.toLowerCase();
  return haystack.includes(query);
}

function isContentImageCandidate(item: { section: string; key: string; value: string }): boolean {
  const section = item.section.toLowerCase();
  const key = item.key.toLowerCase();
  const value = item.value.trim().toLowerCase();

  return (
    section.includes("image") ||
    key.includes("image") ||
    key.includes("logo") ||
    value.startsWith("/images/") ||
    value.startsWith("data:image") ||
    value.startsWith("http://") ||
    value.startsWith("https://")
  );
}

function asAsset(asset: Omit<ImageAsset, "previewUrl">): ImageAsset {
  return { ...asset, previewUrl: previewUrl(asset.imageUrl) };
}

async function serviceImageAssets(): Promise<ImageAsset[]> {
  const [services, overrides] = await Promise.all([
    db.service.findMany({
      select: { slug: true, name: true, description: true },
      orderBy: { name: "asc" },
    }),
    db.content.findMany({
      where: { section: SERVICE_IMAGE_SECTION },
      select: { key: true, value: true, updatedAt: true },
    }),
  ]);

  const serviceMeta = new Map(services.map((service) => [service.slug, service]));
  const overrideMap = new Map(overrides.map((item) => [item.key, item]));
  const slugs = Array.from(new Set([...Object.keys(SERVICE_IMAGE_DEFAULTS), ...services.map((service) => service.slug)])).sort();

  return slugs.map((slug) => {
    const override = overrideMap.get(slug);
    const imageUrl = override ? override.value.trim() || null : SERVICE_IMAGE_DEFAULTS[slug] ?? null;
    const service = serviceMeta.get(slug);

    return asAsset({
      id: slug,
      source: "service",
      section: "Services",
      key: slug,
      title: service?.name ?? titleFromSlug(slug),
      subtitle: service?.description ?? "Public service image",
      imageUrl,
      isDefault: override === undefined,
      updatedAt: override?.updatedAt.toISOString() ?? null,
    });
  });
}

async function itemImageAssets(): Promise<ImageAsset[]> {
  const items = await db.item.findMany({
    orderBy: [{ category: { sortOrder: "asc" } }, { sortOrder: "asc" }, { name: "asc" }],
    select: {
      id: true,
      slug: true,
      name: true,
      imagePath: true,
      updatedAt: true,
      category: { select: { name: true } },
    },
  });

  return items.map((item) =>
    asAsset({
      id: item.id,
      source: "item",
      section: item.category.name,
      key: item.slug,
      title: item.name,
      subtitle: "Item catalogue image",
      imageUrl: item.imagePath?.trim() || null,
      isDefault: false,
      updatedAt: item.updatedAt.toISOString(),
    }),
  );
}

async function contentImageAssets(): Promise<ImageAsset[]> {
  const items = await db.content.findMany({
    orderBy: [{ section: "asc" }, { key: "asc" }],
  });

  return items.filter(isContentImageCandidate).map((item) =>
    asAsset({
      id: item.id,
      source: "content",
      section: item.section,
      key: item.key,
      title: titleFromSlug(item.key.replace(/_/g, "-")),
      subtitle: "CMS image reference",
      imageUrl: item.value.trim() || null,
      isDefault: false,
      updatedAt: item.updatedAt.toISOString(),
    }),
  );
}

app.get(
  "/",
  zValidator(
    "query",
    z.object({
      source: z.enum(["service", "item", "content"]).optional(),
      q: z.string().optional(),
    }),
  ),
  async (c) => {
    const { source, q } = c.req.valid("query");
    const query = q?.trim().toLowerCase() ?? "";
    const collections: ImageAsset[][] = [];

    if (!source || source === "service") collections.push(await serviceImageAssets());
    if (!source || source === "item") collections.push(await itemImageAssets());
    if (!source || source === "content") collections.push(await contentImageAssets());

    const items = collections.flat().filter((asset) => matchesQuery(asset, query));
    return c.json(ok({ items }));
  },
);

app.patch(
  "/:source/:id",
  zValidator("param", z.object({ source: z.enum(["service", "item", "content"]), id: z.string().min(1) })),
  zValidator("json", z.object({ imageUrl: z.string().max(MAX_IMAGE_VALUE_LENGTH).nullable() })),
  async (c) => {
    const { source, id } = c.req.valid("param");
    const { imageUrl } = c.req.valid("json");
    const value = imageUrl?.trim() ?? null;

    if (source === "service") {
      const item = await db.content.upsert({
        where: { section_key: { section: SERVICE_IMAGE_SECTION, key: id } },
        create: { section: SERVICE_IMAGE_SECTION, key: id, value: value ?? "" },
        update: { value: value ?? "" },
      });
      return c.json(ok({ id, source, imageUrl: item.value.trim() || null, previewUrl: previewUrl(item.value) }));
    }

    if (source === "item") {
      const exists = await db.item.findUnique({ where: { id } });
      if (!exists) return c.json(fail("Image target not found", "NOT_FOUND"), 404);

      const item = await db.item.update({
        where: { id },
        data: { imagePath: value },
        select: { id: true, imagePath: true },
      });
      return c.json(ok({ id: item.id, source, imageUrl: item.imagePath, previewUrl: previewUrl(item.imagePath) }));
    }

    const exists = await db.content.findUnique({ where: { id } });
    if (!exists) return c.json(fail("Image target not found", "NOT_FOUND"), 404);

    const item = await db.content.update({
      where: { id },
      data: { value: value ?? "" },
      select: { id: true, value: true },
    });
    return c.json(ok({ id: item.id, source, imageUrl: item.value.trim() || null, previewUrl: previewUrl(item.value) }));
  },
);

app.delete(
  "/:source/:id",
  zValidator("param", z.object({ source: z.enum(["service", "item", "content"]), id: z.string().min(1) })),
  async (c) => {
    const { source, id } = c.req.valid("param");

    if (source === "service") {
      await db.content.upsert({
        where: { section_key: { section: SERVICE_IMAGE_SECTION, key: id } },
        create: { section: SERVICE_IMAGE_SECTION, key: id, value: "" },
        update: { value: "" },
      });
      return c.json(ok({ id, source, imageUrl: null, previewUrl: null }));
    }

    if (source === "item") {
      const exists = await db.item.findUnique({ where: { id } });
      if (!exists) return c.json(fail("Image target not found", "NOT_FOUND"), 404);
      await db.item.update({ where: { id }, data: { imagePath: null } });
      return c.json(ok({ id, source, imageUrl: null, previewUrl: null }));
    }

    const exists = await db.content.findUnique({ where: { id } });
    if (!exists) return c.json(fail("Image target not found", "NOT_FOUND"), 404);
    await db.content.update({ where: { id }, data: { value: "" } });
    return c.json(ok({ id, source, imageUrl: null, previewUrl: null }));
  },
);

export default app;
