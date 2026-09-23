# SEO Audit Evidence

Date: 2026-09-19

## 2026-09-21 Production Update

The production website is now verified on Vercel project `speedy-van-web` (`prj_OkJrabaUpBmsMqNibYZc5cgnIqFg`), not the stale duplicate `speedy-van-co-uk-web`.

Current live project map is maintained in `docs/deployment-projects.md`.

## Starting Constraints

- `AGENTS.md` was checked first as requested. No project `AGENTS.md` exists in `c:\SpeedyVan`; the only match was inside `node_modules/recharts` and was not applicable.
- The working tree already contained many unpublished changes across web, API, assets, admin and iOS files. They were preserved; no reset, checkout or revert was used.
- No deployment or live hosting change was made.

## Checkpoint

| Item | Value |
| --- | --- |
| Current branch | `seo-production-execution-2026-09-17` |
| Local HEAD | `ce37317993e7b967a8eb09a4f49bb8d6c3e31b3b` |
| Public GitHub `main` checked with `git ls-remote` | `688632f9948c5189438e50f4d1f61f938d1850a4` |
| Active app conclusion | `apps/web` is the active local equivalent and inferred production app |
| Preview | `http://localhost:3002` |
| Deployment | Not performed |

## Production Application Proof

Active production-serving app is `apps/web`, not `apps/web-v2`.

Evidence:

- Root `vercel.json` builds `apps/web` and outputs `apps/web/.next`.
- `.vercel/project.json` now identifies project `speedy-van-web` with project id `prj_OkJrabaUpBmsMqNibYZc5cgnIqFg`.
- The local workspace does not contain `apps/web-v2`.
- Live HTML on `https://www.speedyvan.uk/` references App Router chunks under `/_next/static/chunks/app/(site)/...`, matching `apps/web/src/app/(site)`.
- Public headers do not expose the exact deployed commit. Production commit and deployment branch remain unverified.

## Verified Active Equivalents

| Requested path | Active local equivalent | Verified symbols and contracts |
| --- | --- | --- |
| `apps/web/src/lib/seo.ts` | `apps/web/src/lib/seo/constants.ts` and `apps/web/src/lib/seo/schemas.ts` | `SITE_URL`, `absoluteUrl`, JSON-LD builders |
| `apps/web-v2/src/lib/site.ts` | `packages/config/src/site.ts` | `SITE.url` is `https://www.speedyvan.uk` |
| `apps/web-v2/src/lib/services-data.ts` | `apps/web/src/lib/services.ts` | `SERVICES`, `getServiceBySlug`, `getBookableService`; no `getService` in active app |
| `apps/web-v2/src/lib/areas-data.ts` | `apps/web/src/lib/areas.ts` | `AREAS`, `getAreaBySlug`; no `getArea` in active app |
| `apps/web-v2/src/app/layout.tsx` | `apps/web/src/app/layout.tsx` | `RootLayout`, `Metadata`, `Viewport` from `next` |
| `apps/web-v2/src/app/robots.ts` | `apps/web/src/app/robots.ts` | `MetadataRoute` from `next` |
| `apps/web-v2/src/app/sitemap.ts` | `apps/web/src/app/sitemap.ts` | `MetadataRoute` from `next` |
| `apps/web-v2/src/app/services/[slug]/page.tsx` | `apps/web/src/app/(site)/services/[slug]/page.tsx` | `Metadata` from `next`; `notFound` from `next/navigation`; `Props = { params: { slug: string } }` |
| `apps/web-v2/src/app/areas/[slug]/page.tsx` | `apps/web/src/app/(site)/areas/[slug]/page.tsx` | `Metadata` from `next`; `notFound` from `next/navigation`; `Props = { params: { slug: string } }` |

No active `buildMetadata` helper exists in `apps/web`; metadata is built in each App Router page plus `layout.tsx`.

## Shared Contracts Found

- Booking state and persistence: `apps/web/src/lib/booking-store.tsx`.
- Service prefill: `apps/web/src/components/booking/SearchParamsInitializer.tsx` reads `?service=`.
- Booking steps: `Step1Service`, `Step2Addresses`, `Step3Schedule`, `Step4Payment`.
- Pricing: browser requests `/pricing/calculate`; local development API base is `http://localhost:4000`.
- Payment and booking: `/booking/create`, `/booking/confirm`, Stripe Elements, and `trackPurchase`.
- Coverage and postcode UX: `apps/web/src/components/PostcodeCheck.tsx`.
- Consent and analytics: `CookieConsent`, `AnalyticsPixels`, `trackPurchase`.

No new hook or shared contract was invented.

## Business Facts Ledger

| Fact or claim | Source checked | Confidence | Status used in local changes | Review need |
| --- | --- | --- | --- | --- |
| Primary public host is `https://www.speedyvan.uk` | Live homepage, robots, sitemap, local config | High | Used for canonical, sitemap and redirect targets | Recheck after deployment |
| Business phone `07909 032889` | Existing site config and visible site contact surfaces | Medium | Preserved; not changed | Owner should verify before release |
| Contact email `hello@speedyvan.uk` | Existing site config and footer | Medium | Preserved; not changed | Owner should verify before release |
| Service area is Scotland-wide with key cities | Existing `AREAS`, live sitemap and visible content | Medium | Preserved; area pages strengthened | Verify actual operational coverage boundaries |
| Goods-in-transit cover exists | Existing public copy | Medium | Kept as a trust statement without expanding limits | Owner should confirm policy and limits |
| £50,000 insurance statement | Existing public copy | Low | Removed/softened where touched | Needs written evidence before reuse |
| Same-day availability | Existing marketing copy | Medium | Kept conditional: when capacity allows | Verify operational cut-off and capacity rules |
| From-prices | Existing service/pricing data and quote flow | Medium | Explained as guide/starting prices, not guaranteed final quote | Reconcile with pricing authority before release |
| Google Business Profile details | Not accessible in this environment | Unavailable | No live GBP changes made | GBP owner access required |
| Search Console indexation/canonical state | Not accessible in this environment | Unavailable | Not claimed | Search Console access required |
| GA4 organic funnel outcomes | HYPD returned no GA4 account summaries | Unavailable | Not claimed | GA4 access required |

## Live Findings

These are live observations from 2026-09-19 before deployment of the local fixes:

- `https://www.speedyvan.uk/` returns 200 on Vercel and is the primary public site.
- Old hosts redirect to the primary host, but hop counts vary by scheme and host.
- Live root canonical is already `https://www.speedyvan.uk`.
- Live `robots.txt` points to `https://www.speedyvan.uk/sitemap.xml` and disallows `/admin/`, `/driver/`, `/auth/`, and `/api/`.
- Live sitemap has 45 URLs, all on `https://www.speedyvan.uk`, and excludes `rubbish-removal`.
- Live legal pages `/privacy`, `/terms`, and `/cookies` still expose stale `https://speedy-van.co.uk/...` canonicals.
- Live service and legal titles duplicate the brand suffix in places, for example `Man and Van | SpeedyVan | SpeedyVan Scotland`.
- Live `/book` and `/auth/login` are `noindex,nofollow` but inherit a homepage canonical.
- Live invalid service and area URLs return 404 and noindex but also inherit default homepage-like metadata.
- Live `Man and Van` copy still contains internal SEO wording such as `one strong service page` and `synonyms`.
- Live area pages use generic geography copy for key cities where local practical proof is needed.

## External Demand Evidence

HYPD Google Ads access was available for account `2427152166` in GBP and Europe/London timezone.

Highest-volume UK query demand observed:

- `man with a van`: 18,100 monthly searches.
- `man and van`: 9,900.
- `van and man`: 9,900.
- `same day delivery`: 9,900.
- `house removals`: 3,600.
- `man and van glasgow`: 1,900.
- `furniture collection`: 1,900.

GA4 was unavailable through HYPD (`accountSummaries: []`). Search Console was not available as a callable connector. SERP samples from HYPD are third-party snapshots, not official Google ranking proof.

## Prioritised Local Fixes

1. Canonical consistency:
   - Removed root layout canonical inheritance.
   - Forced legal canonicals through `absoluteUrl(...)`.
   - Normalised title templates to avoid duplicate brand suffixes.

2. Non-indexable flow protection:
   - `/book`, `/auth/login`, `/book/confirmation`, `/track`, and `/jobs` keep noindex intent without inheriting homepage canonical.

3. Service detail content:
   - Removed visible internal SEO commentary from `Man and Van`.
   - Added practical planning content to service detail pages.
   - Added related-service decision links without changing booking mappings.

4. Area proof:
   - Added practical move advice for Glasgow and Edinburgh.
   - Added online booking CTAs to area detail pages while preserving phone and email paths.

5. Structured data:
   - Changed local business and service provider type to `MovingCompany`.
   - Changed `areaServed` entries from `City` to `AdministrativeArea` to avoid mislabelling towns and neighbourhoods.

6. Redirect safety:
   - Host redirects now bypass `/api` and non-GET/HEAD requests locally to avoid breaking API, pricing, booking, payment or future webhook flows.

7. Payment safety:
   - Added a synchronous repeated-submit guard in `Step4Payment` with `useRef`, while keeping the existing disabled UI and error handling.

## Compatibility Notes

- Customer booking state was preserved: no reducer action names, storage key, or draft shape were changed.
- Pricing payload shape was preserved.
- Payment endpoints and Stripe handling were preserved.
- Driver and admin routes were not functionally changed by SEO work.
- Middleware now avoids redirecting `/api` and non-GET/HEAD requests.
- SEO-only service pages still map to existing bookable services through `getBookableService`.

## Local Fixes vs Ranking Outcomes

Local fixes are verified in the production build and local private preview. They are not deployed.

Unverified outcomes:

- Google rankings.
- Search Console canonical state after deployment.
- Organic traffic or conversion lift.
- GBP/local-pack visibility.
- GA4 funnel metrics.

Those require deployment plus external measurement access.
