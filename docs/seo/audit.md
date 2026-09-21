# Organic search and conversion repair

Evidence date: 21 September 2026. Implementation branch: `fix/organic-search-and-booking-2026-09-21`.

## What is preventing discovery

The site is not wholly absent from Google. In the inspected UK mobile third-party sample, the brand query returned the apex homepage at position 1. The domain was absent from the first 10 results for `man and van`, `man and van Glasgow` and `furniture delivery Glasgow`, and the first nine for `house removals Edinburgh`. These are individual samples, not universal positions or Search Console averages.

Initial authenticated Search Console inspection of the primary hostname found:

| Priority page | Inspected state | Last crawl |
| --- | --- | --- |
| `/services/man-and-van` | URL unknown to Google | Not available |
| `/services/house-removal` | Discovered, currently not indexed | Not available |
| `/services/furniture-delivery` | Discovered, currently not indexed | Not available |
| `/services/office-removal` | Discovered, currently not indexed | Not available |

The equivalent apex URLs were also unknown in that inspection. Glasgow and other service pages had indexed results in earlier inspections. The primary sitemap was accepted with 45 discovered URLs. Six indexing requests had been accepted earlier in the session; acceptance is not indexing completion. Search Console performance was still processing, so no reliable click, impression, CTR or organic-booking baseline is claimed. No manual action or security warning was shown in the inspected account.

This supports two distinct findings: some important landing pages are not indexed, and the sampled generic queries do not show the site prominently. It does not establish a penalty, a specific backlink deficit or a guaranteed reason Google has not selected each page. Adding a Search Console property alone does not produce rankings.

After the production release, the canonical `/services/man-and-van` inspection showed **Discovered - currently not indexed**, with no prior crawl recorded. Google's smartphone live test at 16:18:01 UTC fetched the page successfully, allowed crawling and indexing, and read the correct www canonical. The changed page's indexing request was accepted. The resubmitted sitemap now serves 47 URLs; Search Console still displayed its earlier processed count of 45. Neither observation establishes completed indexing. Full evidence: [search-console-release-2026-09-21.json](search-console-release-2026-09-21.json).

## Production ownership

See [production-domain-map.md](production-domain-map.md). The active repository is `speedy-van/speedy-van-platform`, with `apps/web` serving the website and `apps/api` serving the separate API. The older `speedy-van/sv` snapshot is not the implementation base. No applicable tracked `AGENTS.md` was found. A clean isolated checkout preserved unpublished work on the owner's computer.

## Revalidation of earlier observations

| Earlier observation | Current classification | Evidence or action |
| --- | --- | --- |
| Old www domain permanently redirects to primary www | Already correct | Live public-page path/query checks |
| Two apex HTTPS roots use temporary 307 redirects | Already fixed earlier in this session | Hosting ownership corrected; existing middleware now supplies one 308 for tested public paths |
| Primary sitemap contains 45 useful HTTP 200 pages | Already correct before this release | The released service and area hubs bring the live sitemap to 47 URLs |
| Legal pages canonicalise to old host | Already fixed on live site | Current live canonical inspection; this branch additionally fixes page-specific social metadata |
| Brand suffix duplicated in titles | Already fixed on live site | Current titles; local assertions check one suffix |
| Customer copy exposes SEO commentary | Already fixed on live site | Current service HTML; content in this branch is practical service guidance |
| Unknown service/area slugs return real 404 | Already correct | Kept and covered by local HTTP assertions |
| Localhost/old-origin sitemap and `/booking/track` generator | Source-only in obsolete snapshot | Not defects attributed to the active live application; active generator and unused dependency reviewed |
| `/book/review/*` inherits indexable metadata | Source defect in active checkout | Booking layout and private-route HTTP noindex coverage added |
| Consent changes do not update all analytics consumers | Source defect in active checkout | Reactive consent and one shared event dispatcher implemented |
| Validated payment can be confused with another booking | Source defect in active checkout | Exact intent/booking/reference/amount/currency binding and transactional confirmation added |
| API deployment selects a stale precompiled bundle | Source deployment defect | Build current TypeScript or the reproducible standalone artefact; no longer select tracked `_api.js` |
| API host `/api/health` returns 404 while `/health` returns 200 | Fixed and verified live | Both routes now return 200; database-backed catalogue, service flags and pricing probes also passed |

## Implemented on this branch

- Two server-rendered hubs, `/services` and `/areas`, link the existing 12 indexable domestic services and 27 areas; no mass postcode or city/service pages.
- Seven core services have distinct suitability, crew, access, preparation, exclusions, pricing basis, booking steps and relevant links. Flat/small-move CTAs preserve room-inventory intent.
- Glasgow and Edinburgh guidance covers tenements, stairs, lifts, loading, parking and route planning. No invented jobs, branches, testimonials or local fleet claims.
- Public metadata aligns canonical, Open Graph and Twitter values. WebSite, MovingCompany, Service and BreadcrumbList identifiers remain stable; hourly prices state their unit.
- Booking, review, tracking, jobs, auth and driver paths receive noindex protection. Robots permits crawlers to read HTML noindex; API restrictions and authentication remain separate.
- Direct booking entry is usable; corrupt drafts, expired quotes, empty dates and unavailable prices fail safely. Existing bedroom, room and item inventory is preserved.
- Checkout prevents duplicate submission, validates the server quote, reuses live payment sessions, requires backend confirmation and protects unresolved checkout from editing/reload-driven new payments.
- API confirmation validates payment ownership and amount, deduplicates durable effects, preserves progressed/cancelled states and exposes retryable webhook failures. Cancellation does not falsely report an unsuccessful refund.
- Optional analytics respects consent changes; clicks are not recorded as qualified leads. Purchase events are validated and deduplicated per provider.
- Public content remains visible without JavaScript. Navigation, skip link, reduced motion, footer contrast and local image optimisation were improved without replacing the design.
- Service-worker caching excludes private/query-bearing/error responses. Driver return destinations are restricted to supported local routes.
- Web/API security dependency updates are included. See [verification.md](verification.md) for actual audit results and remaining mobile-package work.

The web and API changes were released from commit `10c781c49970b3f44c8ee61e4063cb0175c51d71` on 21 September 2026. Actual deployment IDs, timestamps, subsequent API updates and scoped live evidence are recorded in [deployment-2026-09-21.json](deployment-2026-09-21.json). Payment unit checks do not establish a completed real transaction.

## Business evidence limits

Existing site configuration supplies phone, email, social links, services, area names and guide prices. Their presence in source is not independent operational verification. Existing price amounts are preserved; final quotes come from the server. Minimum charges, insurance limits, hours, individual-date capacity, specialist equipment and ferry/non-Scottish routes still need operational evidence before stronger claims are published.

The authenticated business-profile surface opened a create-profile flow; ownership of an existing managed Google Business Profile was not established. No profile, branch, review or office was invented. No outreach or paid ranking links were used.

## Acceptance and outcomes

[verification.md](verification.md) records executed checks and unavailable checks. [release-checklist.md](release-checklist.md) covers coordinated web/API release and rollback. [growth-plan.md](growth-plan.md) separates 30/60/90-day work from measured outcomes. No code change, sitemap submission, indexing request or technical score guarantees first place.
