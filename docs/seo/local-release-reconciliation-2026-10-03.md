# Local release reconciliation - 2026-10-03

## Scope

Focused repair for the local-page release mismatch between the live site and the approved local expansion inventory. This release does not deploy another site, add public `/seo` screens, create duplicate landing pages, or merge the booking/API changes from PR #10.

Detailed URL-level evidence is recorded in `docs/seo/local-expansion-inventory-2026-09-28.csv`. The 2026-10-03 evidence columns in that file are appended to the existing inventory rather than replacing it.

## Production evidence before repair

Checked on 2026-10-03 against `https://www.speedyvan.uk`.

| URL | Live status | Canonical | Robots | Decision |
| --- | ---: | --- | --- | --- |
| `/areas/isle-of-skye` | 404 | none | `noindex` | Release approved parent area page |
| `/areas/fort-william/house-removal` | 404 | none | `noindex` | Release approved local-service page |
| `/areas/glasgow/business-removals` | 404 | none | `noindex` | Release approved local-service page |
| `/areas/glasgow/storage-transport` | 404 | none | `noindex` | Release approved local-service page |
| `/areas/glasgow/house-removal` | 200 | `https://www.speedyvan.uk/areas/glasgow/house-removal` | `index, follow` | Retain existing curated page |

Live sitemap parse:

| Category | Count |
| --- | ---: |
| Home | 1 |
| Areas index | 1 |
| Area pages | 160 |
| Services index | 1 |
| Service pages | 13 |
| Local-service pages | 48 |
| Moving routes index | 1 |
| Moving route pages | 19 |
| Guides index | 1 |
| Guide pages | 1 |
| Static pages | 5 |
| Total unique loc values | 251 |

All 251 current live sitemap URLs returned HTTP 200 during the bounded crawl. A bounded public internal-link crawl of 120 pages returned HTTP 200 for every crawled page and found no live inbound links to the four missing destinations before this repair.

## Root causes

- The deployed local-service route consumed `city-service-pages`, so only the existing curated city/service set was routable, linked and included in the sitemap.
- The broader approved inventory existed on the expansion branch as `local-service-pages`, but it was not reconciled into the production-compatible baseline.
- `business-removals` and `storage-transport` were absent from the production service registry, so those slugs could not pass the route service gate.
- `isle-of-skye` and related Highland/Skye localities were absent from the production area registry.
- Local-service CTAs pointed at `/book` without the service query, so deep-linked service intent was not preserved from SEO pages.

## Implemented source decisions

- Route lookup, static params, sitemap, area expansion links, service expansion links and related local-service links now consume `LOCAL_SERVICE_PAGES` from `apps/web/src/lib/content/local-service-pages.ts`.
- `LOCAL_SERVICE_PAGES` deduplicates existing curated city pages, reviewed town pages and approved generated entries from the local expansion inventory. Unknown area/service combinations still 404 through `dynamicParams = false`, `getAreaBySlug`, service indexability and registry membership.
- `business-removals` and `storage-transport` are added as indexable public service slugs while resolving to compatible booking services through booking aliases.
- The homepage H1 is now `Man and Van & Removals Across Scotland`; the immediate service selection and three-step booking message remain directly below it.
- Booking route support is limited to alias and CTA handling in `booking-service-options.ts`; no pricing, payment, Stripe webhook, API route or persisted booking schema was changed.
- Sleat remains deliberately excluded from standalone URL generation and is recorded in the inventory as `deferred-no-standalone-url`.

## Release URLs

Minimum release checks before publication:

| URL | Expected local/preview status | Expected canonical | Expected booking CTA |
| --- | ---: | --- | --- |
| `/` | 200 | `https://www.speedyvan.uk` | service picker visible |
| `/areas/isle-of-skye` | 200 | `https://www.speedyvan.uk/areas/isle-of-skye` | `/book` |
| `/areas/fort-william/house-removal` | 200 | `https://www.speedyvan.uk/areas/fort-william/house-removal` | `/book?service=house-removal` |
| `/areas/glasgow/business-removals` | 200 | `https://www.speedyvan.uk/areas/glasgow/business-removals` | `/book?service=business-removals` |
| `/areas/glasgow/storage-transport` | 200 | `https://www.speedyvan.uk/areas/glasgow/storage-transport` | `/book?service=storage-transport` |
| `/areas/glasgow/house-removal` | 200 | `https://www.speedyvan.uk/areas/glasgow/house-removal` | `/book?service=house-removal` |
| `/areas/not-a-real-place/business-removals` | 404 | none | none |
| `/areas/glasgow/not-real-service` | 404 | none | none |

## Blockers and access notes

- Vercel team discovery returned no teams for the available connector, and no `.vercel/project.json` was present in the worktree. Production project ID, deployment alias metadata, deployed Git SHA, build inputs and separate API deployment SHA are therefore not verified from Vercel.
- Search Console URL Inspection and performance data are not available in this environment.
- Field Core Web Vitals are not available in this environment.
- No production booking, payment, customer message or backend deployment was performed.

## Rollback

Before publication, rollback is simply to drop this focused branch or revert the listed source changes. After publication, roll back by promoting the previous known-good Vercel web deployment for `www.speedyvan.uk` and confirming:

- `/areas/isle-of-skye`
- `/areas/fort-william/house-removal`
- `/areas/glasgow/business-removals`
- `/areas/glasgow/storage-transport`

return to their prior state, then restore the previous branch if the release is not continued. No API or database rollback is expected for this focused release because no API/database changes are included.
