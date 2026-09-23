const assert = require("node:assert/strict");
const test = require("node:test");
const fs = require("node:fs");
const path = require("node:path");
const { readContent, inventory } = require("./seo-expansion-inventory.cjs");
const { areas, services, localServices, routes, sitemap } = readContent();

test("Expansion registries reference real places and services without duplicate routes", () => {
  assert.equal(new Set(areas.map((entry) => entry.slug)).size, areas.length);
  assert.equal(new Set(sitemap.map((entry) => entry.url)).size, sitemap.length);
  for (const page of localServices) {
    assert.ok(areas.some((area) => area.slug === page.areaSlug && area.schemaType === "City"));
    assert.ok(services.some((service) => service.slug === page.serviceSlug && service.indexable !== false));
    assert.notEqual(page.serviceSlug, "man-and-van", "The area page already serves this intent");
  }
  for (const page of routes) {
    assert.ok(areas.some((area) => area.slug === page.originSlug && area.schemaType === "City"));
    assert.ok(page.slug.startsWith(`${page.originSlug}-to-`));
    assert.ok(page.destination.trim());
  }
  for (const area of areas.slice(32)) {
    assert.equal(area.schemaType, "Place");
    assert.ok(area.nearbyAreas.length);
    assert.ok(area.nearbyAreas.every((slug) => slug !== area.slug && areas.some((other) => other.slug === slug)), `${area.slug}: invalid nearby destination`);
  }
});

test("New guides contain authored planning sections, questions and explicit evidence links", () => {
  const guides = [
    ...areas.slice(32).map((area) => ({ key: area.slug, title: area.headline, description: area.metaDescription, introduction: area.description, sections: area.moveAdvice, faqs: area.faqs })),
    ...localServices.map((page) => ({ ...page, key: `${page.areaSlug}/${page.serviceSlug}` })),
    ...routes.map((page) => ({ ...page, key: page.slug })),
  ];
  assert.equal(new Set(guides.map((page) => page.description)).size, guides.length, "Meta descriptions must not be reused");
  assert.equal(new Set(guides.map((page) => page.introduction)).size, guides.length, "Introductions must not be reused");
  for (const page of guides) {
    assert.ok(page.title.trim() && page.description.trim() && page.introduction.trim(), page.key);
    assert.ok(page.sections?.length >= 3 && page.faqs?.length >= 2, page.key);
    assert.equal(new Set(page.sections.map((section) => section.title)).size, page.sections.length, page.key);
    assert.ok(page.sections.every((section) => section.title.trim() && section.body.trim()), page.key);
    assert.ok(page.faqs.every((faq) => faq.question.trim() && faq.answer.trim()), page.key);
    const sources = page.sections.flatMap((section) => section.source ? [section.source] : []);
    assert.ok(sources.length, `${page.key}: missing evidence`);
    for (const source of sources) assert.ok(source.label.trim() && new URL(source.href).protocol === "https:", page.key);
  }
});

test("The review inventory reflects 250 implemented URLs and separates the 3500-page target", () => {
  const current = inventory();
  assert.equal(current.implementedTotal, 250);
  assert.deepEqual(current.counts, { areas: 160, localServices: 48, routes: 19 });
  assert.equal(current.remainingToResearchAndReview, 3250);
  const recorded = JSON.parse(fs.readFileSync(path.join(__dirname, "../docs/seo/scotland-expansion-inventory-2026-09-23.json"), "utf8"));
  assert.deepEqual(recorded, current, "Regenerate the review inventory after changing registered content");
});
