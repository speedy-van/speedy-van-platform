# Verification of the repair branch

> Release update, 23 September 2026: the city changes are now published from `48fcf7ff73ee4d8e5ba2b97a9f630e24b9e15718`, production deployment `GYD2pB6EKuW3iRStSwR9Du96QrMP` (Ready at 02:21:59 UTC). The earlier local-only and unresolved-production statements below describe the preceding checkpoint. See [the current city release record](city-release-2026-09-23.md) for fresh production mapping, live verification, remaining mobile limits and rollback.

Executed 21 September 2026 on `fix/organic-search-and-booking-2026-09-21`, based on `e43ffc760b57b5d70b655760ee4877f1f759a85a`. These results describe the local branch checks. Subsequent cloud preview and production release states are recorded separately below; a successful build is not a completed transaction or ranking result.

## Executed checks

| Check | Result | Scope |
| --- | --- | --- |
| Clean dependency installation | Passed | npm shallow workspace layout; React 19 web and React 18 mobile peers resolved separately |
| `npm ci --dry-run --ignore-scripts --no-audit --no-fund` | Passed | Manifest/lockfile installation consistency |
| `npx prisma generate --schema=packages/db/prisma/schema.prisma` | Passed | Prisma 5.22; code generation only, no database operation |
| `npm run typecheck` | Passed | API, iOS admin, web, config, database and shared packages |
| `npm run typecheck -w apps/web` after adding route type generation | Passed | `next typegen` plus TypeScript; works without previously generated route types |
| `npm run lint` | Passed | API and web; no ESLint errors or warnings. Next reports its separate `next lint` deprecation notice |
| `npm run test:regression` | 100 passed, 0 failed | 19 booking, 13 analytics, 29 payment/API, 13 service-worker/driver, 1 schema, 6 deployment/handler and 19 pricing-configuration/availability/date checks |
| API standalone source build and isolated install | Passed | Current workspace sources bundled; pinned runtime install, Prisma generation and actual handler health checks outside the repository |
| `NEXT_PUBLIC_API_URL=http://127.0.0.1:4000 npm run build` | Passed | Database package, Next 15.5.25 web production build (75 static pages) and API TypeScript build |
| Local production-build HTTP/HTML QA | 428 passed, 0 failed | All 47 sitemap pages plus private, invalid, redirect, method and preview-host probes |
| Public production HTTP/HTML QA | 414 passed, 0 failed | All 47 live sitemap pages plus private and invalid routes; no unresolved transport errors in the completed run |
| Public production host/private-route probes | 18 passed, 0 failed | Legacy/apex HTTPS GET/HEAD, encoded queries, API/method bypass and private headers |
| Public production API probes | 10 passed, 0 failed | Direct/prefixed health, database-backed items and flags, synthetic GBP quotes, invalid input and CORS |
| Public production browser journey | Passed to review | Service CTA, autocomplete, route, item catalogue, date/slot, valid GBP amount and checkout review; no submission |
| Keyword map validation | Passed | 162 unique phrases; five sampled queries, 157 inferred; 16 existing/new hub targets; volumes unavailable |
| `git diff --check` | Passed | Whitespace consistency |

The web build deliberately used a local test API origin. No production booking, database migration, seed, payment, refund or analytics event was triggered. A real preview must be rebuilt with its intended non-production API configuration before interactive checkout testing.

## Reproducible page evidence

[verification-results.json](verification-results.json) records all 428 assertions, initial-HTML titles/H1s/canonicals and timestamp. [url-inventory.csv](url-inventory.csv) lists the exact branch URLs and dispositions. Run the maintained script against a running production build:

```sh
npm run start -w apps/web -- --hostname 127.0.0.1
python scripts/seo-local-qa.py --base-url http://127.0.0.1:3002
```

For the initial local checks, the server and HTTP checker were launched as child processes of one runner because each command environment has an isolated loopback network. A normal local machine can use two terminals. Cloud previews and production deployments were subsequently verified as recorded below. The older script's print-only browser checks and expired hard-coded date were replaced with explicit HTTP assertions; old screenshot claims are not carried forward.

Assertions cover:

- 47 unique canonical-primary sitemap entries: seven static/hub pages, 27 areas and 13 services; no fabricated modification dates, private routes or unsupported waste route.
- Every sitemap page: HTTP 200, one self-canonical, one useful initial-HTML H1, useful description, one brand suffix, page-specific Open Graph URL and indexable metadata/headers.
- Seven core service pages linked from both the homepage and service hub, with crawlable booking links and canonical Service entity IDs.
- All existing areas linked from the area hub; hourly GBP unit specification and stable homepage WebSite entity.
- Real 404/noindex for invalid service, area and arbitrary paths.
- Booking, booking review, login, driver login, tracking and jobs: no inherited public canonical and noindex in both metadata and HTTP headers.
- Three legacy HTTPS hosts: a single 308 for public GET/HEAD preserving encoded path/query; API and mutation-method bypass.
- Preview-host HTTP noindex and correct private-prefix boundaries.

## High-risk behaviour evidence

- Booking tests exercise corrupt/expired drafts, service aliases, inventory preservation, quote invalidation, malformed/empty quote data, currency, payment status, confirmation retry, cancelled booking handling, navigation locks and verified recovery. They do not establish browser rendering.
- Payment tests execute the actual service/route code with mocked persistence and provider calls. They validate intent ownership/amount/currency, transactional first-payment effects, replay, progressed/cancelled states, customer cancellation eligibility, refund failures, current refund reconciliation and real Stripe test-signature verification.
- Analytics tests cover consent changes, cross-tab updates, unavailable storage, query stripping, private-route suppression, one application dispatch, per-provider purchase deduplication and failed provider calls. They do not establish delivery to the configured GA4/Meta accounts.
- Service-worker/driver tests cover cache eligibility, failed/offline responses, exact API paths, authenticated traffic, return-destination restrictions and preserving login/protected-route destinations.
- Schema regression ensures the standalone API deployment copy matches the existing canonical shared schema. The API copy had omitted already-existing service flags, waitlist and European-enquiry models and the enquiry notification enum. Synchronisation fixes client generation; it does not introduce a database migration.
- Deployment regression ensures Vercel rebuilds the current TypeScript through a CommonJS bootstrap rather than deploying the tracked legacy `_api.js`. It also exercises `/api` path normalisation, preserved root routes, encoded queries and unchanged raw Stripe webhook bodies. The isolated standalone artefact served `/health`, `/api/health` and `/api` with HTTP 200; a database-dependent route returned an explicit 503 with no database configured.

## Release preparation follow-up

The owner authorised production deployment after the initial PR was published. Reinspection found that the old API configuration selected a precompiled `_api.js`, so source changes alone would not update the deployed API. The branch now supports a source-based Git build and a reproducible isolated CLI upload. An actual invocation of the official Vercel Node builder exposed extensionless ESM and workspace entry-point problems in a direct TypeScript build. The corrected `vercel-build` hook bundles current API/workspace sources into CommonJS before Vercel traces the runtime dependencies. The emitted Lambda was materialised outside the repository and ran successfully on Node 24: six root/prefixed health checks returned 200, two unconfigured database checks returned the intended 503, and PDF creation worked. Its 53 source hashes, Prisma engines and font assets are recorded in [api-deployment-verification.json](api-deployment-verification.json). This is local platform-builder verification, not a cloud deployment. Live read-only probes confirmed `/health` returned 200 while `/api/health` returned 404 before this repair was deployed.

The existing rollback points are web `4CnN8XEktZw8716F6iX95EbCfgp3` and API `4mQDCapaoV3vtVeHYnbkyEVMQQNC`. Both projects were disconnected from Git during the initial inspection. They were connected after the owner approved repository access. Vercel's Redeploy dialogue explicitly reuses the existing source and therefore does not install this branch. No old-source redeployment was submitted.

Search Console Performance and Page indexing were still processing at 15:06 UTC. [measurement-plan.md](measurement-plan.md) and [measurement-baseline-2026-09-21.json](measurement-baseline-2026-09-21.json) record the separate pre-release search sample and the unavailable account metrics. Performance was rechecked at 15:15 UTC and remained in processing. A release timestamp must be recorded after a verified deployment, not inferred from a GitHub commit.

GitHub authentication and the approved selected-repository access were completed. Both existing Vercel projects are now Git-connected. The connector credential cannot access the required team, so the authorised authenticated dashboard was used. API preview `FC1aEQSyBp9dsTn2bWS9Hmchw1Ka` from `bd9b9945329de45be8356d39c215b84b61e47b57` reached Ready and its build log confirms bundling current source. Web preview `5vfwWqDtJMM7NqtqyWKk6qcbNZ9k` failed because the repository-root build could not detect the workspace-local Next dependency. The web root is now `apps/web`, API root is `apps/api`, outside-root access remains enabled, and application-specific build configuration repairs this mismatch. Direct browser access to the API preview was rejected with `ERR_BLOCKED_BY_CLIENT`; no bypass was attempted. These observations are preview/build evidence, not a production release claim.

Automatic approval review rejected saving a production-branch/automatic-domain-assignment settings change. The unsaved form was restored; production tracking remains `main`. The release instead uses the supported preview-to-production dashboard workflow, which rebuilds with production environment variables according to the [current platform documentation](https://vercel.com/docs/deployments/promoting-a-deployment). No DNS change was made.

Integrated QA also identified and repaired two pricing fallbacks: a failed configuration read must return an unavailable response rather than default prices, and a missing date/time slot must fail rather than return a static subtotal. The shared error envelope remains unchanged; configured read failure uses HTTP 503 and unavailable slots use HTTP 409. Tests exercise the actual pricing and error-handling code without live database or payment operations.

## Verified production release

The source at `10c781c49970b3f44c8ee61e4063cb0175c51d71` was rebuilt with production environment variables through the authenticated Vercel dashboard. API deployment `3hASzcuv7AutpMFHViDuZe8FL6sa` reached Ready at 16:09:36 UTC and web deployment `5jXbcona28QiqxAyY7S1He4F5P6a` at 16:13:56 UTC on 21 September 2026. Both public hostnames were then checked. This was a branch release; draft PR #2 remains unmerged. See [deployment-2026-09-21.json](deployment-2026-09-21.json) for the full history, including the API date-boundary follow-up.

- [live-verification-2026-09-21.json](live-verification-2026-09-21.json): 414 assertions passed on the actual primary hostname. All 47 sitemap pages return HTTP 200, have one correct canonical and brand suffix, useful initial HTML, page-specific social metadata and no accidental noindex. Private/invalid-route and internal-link assertions passed. The first sequential attempt ended in an outbound proxy connection timeout without producing a report. The maintained checker now uses at most four concurrent page requests and one retry for transport failures; the completed run has no unresolved transport errors. This does not measure page-load performance.
- [redirect-live-verification-2026-09-21.json](redirect-live-verification-2026-09-21.json): all 18 assertions passed. The initial checker wrongly expected a page at `/driver`; source inspection confirmed that root does not exist. Its observed 404/noindex is correct, and the corrected expectation is recorded openly in the evidence.
- [api-live-verification-2026-09-21.json](api-live-verification-2026-09-21.json): ten read-only/non-persistent checks passed, including successful database-backed catalogue/configuration and price calculation. These establish connectivity and response contracts, not actual transaction concurrency or payment success.
- [booking-live-verification-2026-09-21.json](booking-live-verification-2026-09-21.json): service CTA preserved Man and Van intent; empty addresses blocked progress; public Glasgow location suggestions resolved a 0.6-mile route; one Small Box Set produced a server quote for 24 September, afternoon, of £45.00; review preserved all choices. Contact fields, Stripe frame and pay button rendered. No customer details, card, payment or booking were submitted. Optional consent was declined. The sampled console contained only browser-extension metadata errors, with no application warning/error entries.
- [search-console-release-2026-09-21.json](search-console-release-2026-09-21.json): Google's live smartphone test fetched the canonical man-and-van page successfully and reported crawl/indexing allowed. Its index snapshot remained **Discovered - currently not indexed**. The changed-page indexing request and updated sitemap submission were accepted. Search Console still displayed its earlier 45 discovered pages, while the live sitemap contains 47; neither is an indexed-page count.

Final booking QA also reproduced a UTC/London boundary defect: at 00:30 BST the server calendar began on yesterday. The follow-up derives London's civil date and uses it consistently for the calendar, urgency and weekend/month arithmetic. Seven new actual-function tests cover midnight, cached configuration, month/year rollover, GMT and both DST transitions; the full regression suite now has 100 passing tests. The API-only follow-up `5e5881a27cca0f6a602473c78a25c13369d1afc5` was rebuilt as production deployment `5woPnYouSe8kAHqwCsp1o5QoxzSg`, Ready at 16:27:50 UTC. The web remains on its verified release. All ten API probes passed again after this follow-up, including the current London calendar date; see [api-london-live-verification-2026-09-21.json](api-london-live-verification-2026-09-21.json). The production clock was not altered to reproduce midnight. No slot names, response fields, business hours or capacity rules changed. Exact same-day slot cutoffs remain an operational dependency because no time windows or minimum-notice rules exist in the inspected configuration.

## Dependency findings and compatibility

The original production dependency audit reported 41 findings, including four critical. Security updates include Next 15.5.25, React/React DOM 19.2.8 for the web, NextAuth 4.24.15, Hono 4.13.8 or compatible later 4.x, the 1.x Node adapter fix, and PostCSS 8.5.28. The unused competing sitemap package was removed. The lockfile was rebuilt to isolate web/mobile React peers without a mobile SDK migration; npm and the existing UI libraries remain in use.

Current `npm audit --omit=dev --workspace apps/web --workspace apps/api --json`: **0 findings**. This is the dependency advisory result for that selected scope, not proof that the application has no security defects.

Current all-workspace production audit: **25 findings: 14 moderate, 10 high, one critical**, confined to the retained mobile/Expo dependency tree. The critical finding is its `tar` dependency. npm proposes an Expo 57 major upgrade; that mobile release requires its own native build/device verification and was not forced into the website repair. See [dependency-audit.json](dependency-audit.json) for package paths and suggested fixes. Keep this outstanding work visible; do not report the whole repository as vulnerability-free.

Primary references: [Next image-optimisation advisory](https://github.com/vercel/next.js/security/advisories/GHSA-2xp9-vwfh-vxw4), [Next 15 compatibility guide](https://nextjs.org/docs/app/guides/upgrading/version-15), [NextAuth advisory](https://github.com/nextauthjs/next-auth/security/advisories/GHSA-x445-f3h2-j279), [npm installation strategies](https://docs.npmjs.com/cli/v11/commands/npm-install/#install-strategy).

## Release gates not executed here

- **Visual/mobile browser QA:** desktop cloud preview and production booking review were verified. The local/API preview restriction was not bypassed. The available browser interface did not expose viewport emulation; 360px/768px, assistive-technology, complete keyboard/overflow and reduced-motion checks remain unexecuted. Useful initial HTML was verified, but source/HTTP checks do not certify WCAG AA.
- **Real integration:** no Stripe test-mode payment or actual Neon transaction/concurrency test was run. Verify success, 3-D Secure, decline, retries, webhook replay, recovery, cancellation/refund and dependent admin/driver/mobile flows in a non-production environment. API and web must be released together in the documented order.
- **External services:** configured analytics receipt, GA4 Enhanced Measurement settings, notification/email delivery and managed Google Business Profile ownership remain unverified.
- **Operational claims:** existing prices, minima, insurance, hours, capacity, specialist equipment and wider/ferry coverage need business confirmation. Define morning/afternoon/evening windows and minimum notice before adding same-day elapsed-slot filtering; do not infer hours from UI greetings.
- **Performance:** no field p75 LCP/INP/CLS measurement is available and no Lighthouse score is presented as field INP. Targets remain LCP <2.5s, INP <200ms and CLS <0.1.
- **Search outcomes:** Search Console performance was processing. Accepted sitemap/indexing requests are not completed indexing, and neither this build nor these test counts prove ranking gains.

Use [release-checklist.md](release-checklist.md) for local integration, coordinated release, rollback and the Copilot handoff prompt.


## Inverness and Aberdeen follow-up — 23 September 2026

Current city-patch evidence is recorded separately in [city-verification-2026-09-23.md](city-verification-2026-09-23.md): typecheck, lint, build, 120 regressions and 498 integrated HTTP checks passed. Interactive mobile visual and provider-payment checks are not claimed.
