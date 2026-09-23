# Surrounding towns and villages: independent source QA

Reviewed: 23 September 2026 at 11:16 UTC. Scope: source and preservation review only. This review did not run a build, browser session, network request, deployment or indexing check.

## Verdict

PASS for the inspected source integration, data relationships and preservation boundary. No demonstrated source defect was found requiring a correction. Runtime, HTTP, keyboard and visual results must come from the lead's separate verification evidence. In particular, this document does not claim that 360px or 768px viewports have been tested.

## Reviewed implementation

| Check | Result | Evidence |
| --- | --- | --- |
| Area catalogue expansion | PASS | Catalogue grows from 27 to 32 entries. Exactly `nairn`, `dingwall`, `westhill`, `stonehaven` and `ellon` are added; no existing entry is removed and no slug is duplicated. |
| Existing area content preservation | PASS | Only the existing `inverness`, `aberdeen` and `inverurie` objects differ from the pre-turn catalogue. The other 24 existing area objects remain value-identical. |
| Locality coverage cards | PASS | `getNearbyAreaGroups` supplies 11 Inverness and 12 Aberdeen localities across three groups per hub. An unknown slug returns an empty array. |
| Canonical destinations | PASS at source | All six optional `areaSlug` destinations resolve to real catalogue entries: Nairn, Dingwall, Ellon, Inverurie, Westhill and Stonehaven. The other 17 cards are visible named sections rather than links to nonexistent pages. |
| Crawlable relationships | PASS at source | `NearbyAreaContent` uses `next/link` for the six canonical area destinations, three existing service pages and plain `/book`. Each new area has valid nearby-area links back to its city hub; area index, static params and sitemap derive from `AREAS`. |
| IDs and React keys | PASS | Generated group, locality, guide-section and section-heading IDs are unique within each hub page. Keys use stable slugs, group IDs and existing stable content values. |
| Server-rendered content | PASS at source | The new renderer and data module have no client directive, effects, event handlers, browser-storage access or asynchronous client data dependency. Locality text is available to the server component render. |
| Accessible structure | PASS at source | A labelled section contains a descriptive heading, labelled navigation, semantic lists and nested headings. New links have explicit visible focus styles. Native `details` and `summary` remain in use; the generic area FAQ summary gains an explicit focus ring. |
| Responsive intent | PASS at source only | Cards start as one column, change to two at `md` and three at `lg`; containers use responsive padding, links wrap and cards have `min-w-0`. The new component introduces no fixed content width. Actual wrapping, overflow and tap behaviour at 360px and 768px are unverified here. |
| Motion | PASS at source | The new booking CTA disables its transition under reduced motion. The new locality section adds no animation or viewport observer. |
| Booking safety | PASS at source | Every new booking destination is exactly `/book`, with no query that could change selected service or overwrite a draft. No booking, inventory, payment or API implementation is modified by this increment. This source result is not a claim of an end-to-end payment test. |
| Geographic schema | PASS at source | `Area.schemaType` is optional and restricted to `City`, `Place` or `AdministrativeArea`. Five new towns and Inverurie explicitly use `Place`; the area service schema and both shared `areaServed` schema builders consume it. These are served places, with no invented office or branch address. |
| Invalid route handling | PRESERVED at source | `AreaPage` still calls `notFound()` for an unknown catalogue slug. Unknown metadata remains `noindex`/`nofollow`. No catch-all route or redirect is added. A genuine HTTP 404 still needs runtime verification. |
| Commercial claims | PASS for the increment | New copy does not claim 2,000 drivers, a seven-minute arrival, fixed savings, a guaranteed slot, local reviews or completed jobs. Owner confirmation supports the coverage statements; individual access, load, crew and date still require confirmation. |

The locality descriptions provide distinct planning details, including seller release windows, extra stops, key handovers, vehicle approaches and destination handling. Each new canonical town page has a distinct introduction, three local planning sections and three FAQs. Existing Inverurie gains three planning sections and three FAQs. Common service and quote sections are reused through the existing route rather than duplicated into new route files.

Geographic and council-policy sources are listed by the content agents. This independent review read those references but did not retrieve them over the network; it does not independently certify their current availability or policy wording. Source-derived sitemap expansion is five additional canonical pages, not evidence that Google has indexed them.

## Preservation evidence

The comparison baseline is `../surrounding-baseline-2026-09-23/baseline.json`, created before this increment. SHA-256 comparison covered 1,137 pre-existing files: 1,132 were unchanged, five changed within the agreed allowlist, and none were missing. No out-of-scope existing application or documentation file had changed at the review snapshot.

The five changed pre-existing files are:

1. `apps/web/src/app/(site)/areas/[slug]/page.tsx`
2. `apps/web/src/components/areas/AreaGuideContent.tsx`
3. `apps/web/src/lib/areas.ts`
4. `apps/web/src/lib/seo/schemas.ts`
5. `scripts/seo-local-qa.py`

The only new application files are:

1. `apps/web/src/components/areas/NearbyAreaContent.tsx`
2. `apps/web/src/lib/nearby-area-guides.ts`

Local HEAD remains `52279359c910b88dda260e935b57e53ceae3c523`; the real Git index hash still matches the pre-turn baseline. Previously unpublished pricing, services, guides, footer, sitemap, booking-related source and release artifacts are preserved. New documentation/evidence may be added by the lead after this snapshot without altering that preservation conclusion.

## Reviewed source hashes

| File | SHA-256 |
| --- | --- |
| `apps/web/src/app/(site)/areas/[slug]/page.tsx` | `7cb265627b9b50648cc2a555862d2979afa46a9774e5d472be8e375371f74c72` |
| `apps/web/src/components/areas/AreaGuideContent.tsx` | `8c0c942fafd5ed78305c0afb4a2ab85b40d1d4ac44977a4cfdc0a3fa2aee2f77` |
| `apps/web/src/components/areas/NearbyAreaContent.tsx` | `1035dbaa8238ea8b5e637b56ab28f0036de279d988e45f77ee9515dfc4c475a8` |
| `apps/web/src/lib/areas.ts` | `1631af5d6ea6a1ef2ed61c5843f8f173e6748c91c5840154c13745a2fde6435c` |
| `apps/web/src/lib/nearby-area-guides.ts` | `4fe67871271524d0355e438f636ec9bf7f3fefbbb091e77fce4aedb1faf4c603` |
| `apps/web/src/lib/seo/schemas.ts` | `7f78501b700e7ff24cb5d1b59c9fbd545dd41124498999e7d6a15d53d193f48b` |
| `scripts/seo-local-qa.py` | `3c7393438495d5d86bf5d107d2650091fc2c907ba77aa11e40a1211d33f0c00f` |

## Remaining verification boundaries

The lead owns TypeScript, lint, production build, meaningful regression checks and the local HTTP assertions. Browser verification should separately establish actual viewport size, horizontal overflow, all relevant FAQ keyboard interactions and `/book` navigation while preserving any existing draft. This independent review does not authorise or attest to an additional deployment, outreach, ranking improvement or indexing outcome.
