# Scotland coverage increment — review record

Date: 23 September 2026. Status: source changes prepared for a GitHub review branch; not merged or promoted to production.

## Business scope

The owner confirmed a Scotland-based driver network and that a move originating in Scotland may end anywhere in Britain. The copy now consistently supports Scottish collections with destinations in Scotland, England and Wales. A specific vehicle, crew, collection slot, delivery window and ferry arrangement still belong to the agreed quote. There is no public live driver counter or promise of immediate local capacity.

## Changes

- Add three original planning sections and three native FAQs to each of the 22 previously generic area pages: 66 sections and 66 questions. Advice links to official council or transport guidance, without hard-coded permit fees or expiry-prone loading hours.
- Retain all 32 area slugs, metadata descriptions and existing richer local content. The Dumfries introduction is intentionally updated to reflect Britain-wide destinations.
- Give all eight Scottish cities an explicit `City` schema type so their own pages and shared service schemas agree. Keep the six existing town `Place` values.
- Improve `/areas` with links to all eight city guides, regional section navigation, and a plain `/book` action for customers whose town or village has no guide. A missing guide is not a service exclusion.
- Align long-distance metadata, hero text, service data, planning guidance and FAQs with Scotland-origin, Britain-wide moves. Update the two city guides and common area quote section accordingly.
- Add a council-by-council expansion inventory covering all 32 Scottish council areas. Existing area pages represent 19 councils; 13 have no dedicated place entry. Proposed towns are a content backlog, not newly published pages or measured search volumes.

No new URLs are introduced: the sitemap retains 54 canonical URLs. No API, database, authentication, driver/admin flow, booking draft, inventory, price value or payment contract changes. The existing npm workspace and installed styling are retained.

## Source and integration

Baseline: `0773a0e2406c8bdcbb76a4457c307a1db1daf81c` on `fix/organic-search-and-booking-2026-09-21`, tree `f107302fbb57c73a41af4e4b17752214ef731053`.

The bounded increment belongs on its own review branch, based on the current repair branch. PR #2 is still a draft targeting `seo-production-execution-2026-09-17`; it is not an integration into `main`. The repository release record says automatic production tracking remains on `main`. Review and integrate that existing release chain before relying on automatic production releases. Do not reset, force-push or change hosting branch settings as part of this content increment.

The live hosting mapping was not independently reverified: the connected hosting request returned a 403 scope-access error. This record relies on the existing repository release evidence for past production status and makes no new deployment claim.

## Verification completed

| Check | Result |
| --- | --- |
| `npm run typecheck -w apps/web` | Passed |
| `npm run lint -w apps/web` | Passed, no lint warnings or errors |
| `npm run test:regression` | 120 passed, zero failed |
| `npm run build -w packages/db` and `npm run build -w apps/web` | Passed |
| `python3 scripts/seo-verify-build.py --port 3012 --output docs/seo/evidence/scotland-local-http-2026-09-23.json` | 618 passed, zero failed; local HTTP and initial HTML |
| Additional production-build HTML inspection | 101 passed: the 22 sets of original advice, three native FAQs each, source links, plain quote links, eight city links and schemas, unique region targets and Britain-wide long-distance wording |
| Independent source preservation review | Passed: existing slugs, metadata, richer advice, numeric prices and booking mappings preserved within the stated scope |
| `git diff --check` | Passed |

The additional HTML inspection parsed the generated `.next/server/app` pages. It is evidence of server-rendered output, not a visual or keyboard-interaction test. Its results are in `evidence/scotland-rendered-content-2026-09-23.json`.

## Outstanding checks

- Actual 360px and 768px browser acceptance remains unverified. The local browser automation daemon exited during startup without diagnostic output, including the diagnostic attempt. Do not infer mobile, keyboard-focus or draft-persistence success from static HTML.
- No fresh Search Console inspection, indexing gain, ranking gain or field Core Web Vitals result is claimed.
- No live booking, payment, driver availability query or customer data mutation was performed.
- No real job photographs, completed-job counts or local reviews were added because publishable records were not supplied in this turn.

## Follow-up

Complete mobile and keyboard checks against the exact reviewed source before release. Use `scotland-coverage-plan-2026-09-23.md` to select the next town batch, supported by original local information and the confirmed Scotland-origin service scope. Existing search/enquiry evidence should guide priorities; absence of search data must not be represented as absence of demand. Keep all unknown routes as real 404s until a useful page is ready.

```text
Read this review record and scotland-coverage-plan-2026-09-23.md. Recheck the remote review branch and preserve unpublished changes. Inspect apps/web/src/lib/areas.ts, area-guides.ts, services.ts, content/service-planning.ts, content/service-search-content.ts, and app/(site)/areas/{page.tsx,[slug]/page.tsx}. Preserve Area, AreaGuide, existing imports, server rendering, async params, native FAQs and plain /book links. Verify all changed area pages plus /areas and /services/long-distance-removals at actual 360px and 768px, including overflow, visible focus, Tab/Enter/Space, regional links and booking drafts. Preserve loading/error/empty states, prices, inventory, payments and all customer/driver/admin contracts. Run the documented checks after any correction. Do not claim Google indexing from build success. Do not merge or deploy without the owner's explicit authorization.
```
