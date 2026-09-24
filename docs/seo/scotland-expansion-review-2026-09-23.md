# Scotland coverage: first 250-page milestone

## Purpose and scope

The owner approved a 3,500-page programme with review milestones at 250, 1,000 and 3,500 pages. The geographic scope is collection addresses in Scotland with destinations throughout Britain. This increment adds useful local planning guides to the existing 54-URL baseline; it does not create 3,500 pages or claim Google has indexed them.

The first unpublished implementation was interrupted by a workspace disconnection. Its files were unavailable when the environment returned. This version was rebuilt from the saved PR #3 commit `f5592cb0b60d1d3c53f256d0c8288b7a60458427` and must be judged using its own verification. The previous unpublished tree `e02aaedad2c8539083a9c71c2af33bc5cd8be57c` is not this source and must not be reported as recovered.

## Registered pages

| Kind | Total in this increment | Change from baseline |
| --- | ---: | ---: |
| Area guides | 160 | +128 |
| City/service guides | 48 | +48 |
| Scotland-origin route guides | 19 | +19 |
| Route hub | 1 | +1 |
| Other existing service, guide and general pages | 22 | 0 |
| **Total sitemap URLs** | **250** | **+196** |

All 32 existing area objects and their canonical URLs are preserved. The new town groups cover Highland, Moray, Aberdeenshire, the three island councils, Argyll and Bute, Angus, Fife, Perth and Kinross, Stirling, Clackmannanshire, Falkirk, the three Lothian councils, Scottish Borders, Dumfries and Galloway, the three Ayrshire councils, both Dunbartonshire councils, East Renfrewshire, Inverclyde, Renfrewshire and both Lanarkshire councils. Together with the four city-only council areas already represented, the directory spans all 32 council areas. This is geographic content coverage, not measured capacity in each council.

The 48 city/service pages are an explicit editorial registry for eight cities and six distinct services. Town pages already address general man-and-van intent; no second city/man-and-van page is generated. The 19 routes all start in Scotland; reverse routes from England or Wales are not implied. The remaining 3,250 pages are unallocated research and review work, not hidden placeholders or unregistered indexable pages.

## Content and evidence

The new pages use original town, service and route guidance, with official council, transport and institutional sources recorded in `docs/seo/evidence/*-sources*.json`. These records distinguish direct page reads from indexed excerpts or retrieval limitations. Planning advice is an editorial application of the cited facts, not evidence that a particular job has already been completed.

The owner-confirmed service direction authorizes this review increment. Measured search demand, local vehicle allocations and job-specific capacity have not been supplied; no such metrics are asserted. The stated 5,576-driver total is not published or divided between towns. No reviews, job photos, local depots, guaranteed availability, fixed transit times or new prices are invented.

Balloch means the Loch Lomond/West Dunbartonshire settlement; Mayfield means Midlothian; Tarbert means Harris. Ferry-dependent journeys require operator and vehicle confirmation. Portree can be reached through Skye's bridge and is not described as necessarily requiring a ferry.

## Implementation boundaries

- Existing Next.js 15 async route params and server rendering are retained.
- Nested local-service `generateStaticParams` returns both `slug` and `service`; the area page is a sibling leaf, not an ancestor generator.
- Unknown or unregistered route combinations must return real 404s with no inherited canonical.
- Only explicit registered guides enter the sitemap. Their parent area/service pages and the route hub provide ordinary crawlable links.
- New quote actions use plain `/book`, leaving existing booking draft behaviour intact. Existing service query links remain unchanged.
- Native `details`/`summary`, section links, wrapping grids and visible focus styles serve keyboard and small-screen use without new client code.
- Booking, pricing, inventory, payments, APIs, database schema, dependencies and customer/driver/admin contracts remain unchanged.

## Verification and release

Verification of this rebuilt version passed: web typecheck and lint, 123 regression tests, the production build, all 250 sitemap paths present in the prerender manifest, and 3,091 local GET/HEAD/initial-HTML assertions. The original 32 area records match their baseline verbatim. Runtime source hashes and the independent review scope are recorded in `docs/seo/evidence/scotland-expansion-verification-2026-09-23.json`; the HTTP evidence records every assertion. Build ID: `5DmDBDMiyzuNcfBM9wQuO`. Previous unpublished test results were not reused.

This increment is for a new draft PR stacked on `fix/scotland-wide-coverage-2026-09-23`. It does not merge the existing release chain, change production tracking or authorize production promotion. The 360px and 768px interactive acceptance checks remain outstanding unless a separate browser evidence record confirms them on this exact source. Local HTTP assertions are not browser, Google indexing, ranking, field-performance or payment-provider evidence.

## Next milestone

Review this first increment's content and mobile behaviour before release. After authorized publication, reconcile sitemap delivery and Search Console indexing separately; review non-brand queries, quote starts and actual fulfilled work before selecting the next 750 pages. Use demonstrated needs to decide between more towns, distinct local service guides, route guides and original cost/planning content. Do not generate a service/place Cartesian product to fill the target.

## Copilot handoff

Preserve the explicit Area, LocalServicePage and MovingRoutePage registries in `apps/web/src/lib/areas.ts` and `apps/web/src/lib/content/`. Review the nested page routes and `MovingContentPage`, `AreaExpansionLinks` and `ServiceExpansionLinks` without introducing client fetching or changing booking contracts. Run the inventory, regression, build and local HTTP checks. Verify 250 sitemap URLs, 160 area guides, 48 registered local-service guides, 19 Scotland-origin routes and one route hub. Check unknown paths, keyboard navigation, native FAQs, visible focus, 360px/768px layouts and plain `/book` navigation. Report unperformed checks honestly. Do not merge or deploy without release authorization.

---

## Integration status update — 2026-09-24 (branch `integration/seo-1000-2026-09-23`, HEAD `ed8ae095`)

This document's "250 sitemap URLs" figure was accurate at `d5a5d5f`. Since then, one URL was added (`/about` in commit `f5572913`). The current verified count is **251**.

| Check | Status |
|---|---|
| 360px and 768px layout (overflow, focus, FAQ, CTA) | **PASS** — verified 2026-09-24, Playwright headless, 5 page types × 2 viewports |
| Booking draft write, navigate, restore | **PASS** — verified 2026-09-24, serviceSlug and step preserved across navigation |
| 68 staged URLs returning genuine 404 | **PASS** — verified HTTP 404 against running production build |
| 251 sitemap `<loc>` entries, 0 staged slugs | **PASS** — verified against live `/sitemap.xml` |
| Production deployment | **Pending** — release authorisation required |
| Google Search Console indexing | **Pending** — no deployment yet |
| Canonical errors check | **Pending** — requires live crawl after deployment |
