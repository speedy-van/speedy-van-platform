import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const baseUrl = (process.argv[2] ?? "http://localhost:3000").replace(/\/$/, "");
const maxJsonLdBytes = 15 * 1024;
const maxOgBytes = 300 * 1024;
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

async function fetchText(path) {
  const response = await fetch(`${baseUrl}${path}`);
  if (!response.ok) {
    throw new Error(`${path} returned HTTP ${response.status}`);
  }
  return response.text();
}

async function fetchBytes(path) {
  const response = await fetch(`${baseUrl}${path}`);
  if (!response.ok) {
    throw new Error(`${path} returned HTTP ${response.status}`);
  }
  const bytes = Buffer.from(await response.arrayBuffer());
  return bytes.length;
}

function robotsContent(html) {
  const meta = html.match(/<meta\s+[^>]*name=["']robots["'][^>]*>/i)?.[0];
  const content = meta?.match(/\scontent=["']([^"']+)["']/i)?.[1];
  if (!content) throw new Error("Missing robots meta tag");
  return content.toLowerCase().replace(/\s+/g, " ").trim();
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function companyNumberFromConfig() {
  const source = fs.readFileSync(path.join(root, "packages/config/src/site.ts"), "utf8");
  const match = source.match(/companyNumber:\s*"([^"]+)"/);
  if (!match) throw new Error("Could not read SITE.legal.companyNumber from config");
  return match[1];
}

function jsonLdScripts(html) {
  return [...html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)]
    .map((match) => match[1].trim());
}

function flattenSchemas(values) {
  return values.flatMap((value) => Array.isArray(value) ? flattenSchemas(value) : [value]);
}

const sitemapXml = await fetchText("/sitemap.xml");
const sitemapLocs = [...sitemapXml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
assert(sitemapLocs.length > 0, "Sitemap has no URLs");
for (const slug of ["thurso", "wick", "mallaig", "isle-of-skye"]) {
  assert(sitemapLocs.some((url) => new URL(url).pathname === `/areas/${slug}`), `Sitemap is missing indexable area /areas/${slug}`);
}
console.log(`sitemap URL count: ${sitemapLocs.length}`);

const glasgowRobots = robotsContent(await fetchText("/areas/glasgow"));
assert(glasgowRobots.includes("index") && !glasgowRobots.includes("noindex") && glasgowRobots.includes("follow"), `/areas/glasgow robots meta was "${glasgowRobots}"`);

const thursoRobots = robotsContent(await fetchText("/areas/thurso"));
assert(thursoRobots.includes("index") && !thursoRobots.includes("noindex") && thursoRobots.includes("follow"), `/areas/thurso robots meta was "${thursoRobots}"`);
console.log(`robots ok: glasgow="${glasgowRobots}", thurso="${thursoRobots}"`);

const homeHtml = await fetchText("/");
const jsonLd = jsonLdScripts(homeHtml);
const combinedJsonLd = jsonLd.join("");
const combinedBytes = Buffer.byteLength(combinedJsonLd, "utf8");
assert(combinedBytes < maxJsonLdBytes, `Homepage JSON-LD is ${(combinedBytes / 1024).toFixed(1)} KB, expected < 15 KB`);

const schemas = flattenSchemas(jsonLd.map((script) => JSON.parse(script)));
const website = schemas.find((schema) => schema?.["@type"] === "WebSite");
assert(website?.name === "SpeedyVan", `WebSite name was ${JSON.stringify(website?.name)}`);

const movingCompany = schemas.find((schema) => schema?.["@type"] === "MovingCompany");
assert(movingCompany?.legalName, "MovingCompany missing legalName");
assert(movingCompany?.identifier?.propertyID === "Companies House", "MovingCompany missing Companies House identifier");
assert(movingCompany?.identifier?.value === companyNumberFromConfig(), `MovingCompany identifier was ${JSON.stringify(movingCompany?.identifier)}`);
console.log(`homepage JSON-LD ok: ${(combinedBytes / 1024).toFixed(1)} KB`);

await fetchBytes("/icon.png");
const ogBytes = await fetchBytes("/og-share.jpg");
assert(ogBytes < maxOgBytes, `og-share.jpg is ${(ogBytes / 1024).toFixed(1)} KB, expected < 300 KB`);
console.log(`assets ok: og-share.jpg ${(ogBytes / 1024).toFixed(1)} KB`);
