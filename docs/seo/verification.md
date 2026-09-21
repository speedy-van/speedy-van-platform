# Verification of the repair branch

Executed 21 September 2026 on `fix/organic-search-and-booking-2026-09-21`, based on `e43ffc760b57b5d70b655760ee4877f1f759a85a`. These results describe this branch; no web/API deployment was performed for this implementation.

## Executed checks

| Check | Result | Scope |
| --- | --- | --- |
| Clean dependency installation | Passed | npm shallow workspace layout; React 19 web and React 18 mobile peers resolved separately |
| `npm ci --dry-run --ignore-scripts --no-audit --no-fund` | Passed | Manifest/lockfile installation consistency |
| `npx prisma generate --schema=packages/db/prisma/schema.prisma` | Passed | Prisma 5.22; code generation only, no database operation |
| `npm run typecheck` | Passed | API, iOS admin, web, config, database and shared packages |
| `npm run typecheck -w apps/web` after adding route type generation | Passed | `next typegen` plus TypeScript; works without previously generated route types |
| `npm run lint` | Passed | API and web; no ESLint errors or warnings. Next reports its separate `next lint` deprecation notice |
| `npm run test:regression` | 81 passed, 0 failed | 19 booking, 13 analytics, 29 payment/API, 13 service-worker/driver, 1 schema and 6 deployment/handler checks |
| API standalone source build and isolated install | Passed | Current workspace sources bundled; pinned runtime install, Prisma generation and actual handler health checks outside the repository |
| `NEXT_PUBLIC_API_URL=http://127.0.0.1:4000 npm run build` | Passed | Database package, Next 15.5.25 web production build (75 static pages) and API TypeScript build |
| Production preview HTTP/HTML QA | 428 passed, 0 failed | All 47 sitemap pages plus private, invalid, redirect, method and preview-host probes |
| Keyword map validation | Passed | 162 unique phrases; five sampled queries, 157 inferred; 16 existing/new hub targets; volumes unavailable |
| `git diff --check` | Passed | Whitespace consistency |

The web build deliberately used a local test API origin. No production booking, database migration, seed, payment, refund or analytics event was triggered. A real preview must be rebuilt with its intended non-production API configuration before interactive checkout testing.

## Reproducible page evidence

[verification-results.json](verification-results.json) records all 428 assertions, initial-HTML titles/H1s/canonicals and timestamp. [url-inventory.csv](url-inventory.csv) lists the exact branch URLs and dispositions. Run the maintained script against a running production build:

```sh
npm run start -w apps/web -- --hostname 127.0.0.1
python scripts/seo-local-qa.py --base-url http://127.0.0.1:3002
```

Here the server and HTTP checker were launched as child processes of one local runner because each command environment has an isolated loopback network. No public preview was deployed. A normal local machine can use two terminals. The older script's print-only browser checks and expired hard-coded date were replaced with explicit HTTP assertions; old screenshot claims are not carried forward.

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

The existing rollback points are web `4CnN8XEktZw8716F6iX95EbCfgp3` and API `4mQDCapaoV3vtVeHYnbkyEVMQQNC`. Both projects were still disconnected from Git during inspection. Vercel's Redeploy dialogue explicitly reuses the existing source and therefore does not install this branch. No old-source redeployment was submitted.

Search Console Performance and Page indexing were still processing at 15:06 UTC. [measurement-plan.md](measurement-plan.md) and [measurement-baseline-2026-09-21.json](measurement-baseline-2026-09-21.json) record the separate pre-release search sample and the unavailable account metrics. Performance was rechecked at 15:15 UTC and remained in processing. A release timestamp must be recorded after a verified deployment, not inferred from a GitHub commit.

The Vercel plugin was connected during the release attempt, but this session did not expose its callable deployment tools. The dashboard remains authenticated; connecting the disconnected Git source reached GitHub Mobile two-factor verification, whose request timed out. Authentication completion remains the release blocker. No new deployment, DNS change or old-source redeployment was submitted.

## Dependency findings and compatibility

The original production dependency audit reported 41 findings, including four critical. Security updates include Next 15.5.25, React/React DOM 19.2.8 for the web, NextAuth 4.24.15, Hono 4.13.8 or compatible later 4.x, the 1.x Node adapter fix, and PostCSS 8.5.28. The unused competing sitemap package was removed. The lockfile was rebuilt to isolate web/mobile React peers without a mobile SDK migration; npm and the existing UI libraries remain in use.

Current `npm audit --omit=dev --workspace apps/web --workspace apps/api --json`: **0 findings**. This is the dependency advisory result for that selected scope, not proof that the application has no security defects.

Current all-workspace production audit: **25 findings: 14 moderate, 10 high, one critical**, confined to the retained mobile/Expo dependency tree. The critical finding is its `tar` dependency. npm proposes an Expo 57 major upgrade; that mobile release requires its own native build/device verification and was not forced into the website repair. See [dependency-audit.json](dependency-audit.json) for package paths and suggested fixes. Keep this outstanding work visible; do not report the whole repository as vulnerability-free.

Primary references: [Next image-optimisation advisory](https://github.com/vercel/next.js/security/advisories/GHSA-2xp9-vwfh-vxw4), [Next 15 compatibility guide](https://nextjs.org/docs/app/guides/upgrading/version-15), [NextAuth advisory](https://github.com/nextauthjs/next-auth/security/advisories/GHSA-x445-f3h2-j279), [npm installation strategies](https://docs.npmjs.com/cli/v11/commands/npm-install/#install-strategy).

## Release gates not executed here

- **Visual/mobile browser QA:** the authenticated cloud browser rejected the local preview origin with `ERR_BLOCKED_BY_CLIENT`. No bypass or substitute standalone browser was used. Check 360px/768px/desktop, no-JavaScript presentation, keyboard focus, overflow and reduced motion before release. Source fixes and HTTP checks do not certify WCAG AA.
- **Real integration:** no Stripe test-mode payment or actual Neon transaction/concurrency test was run. Verify success, 3-D Secure, decline, retries, webhook replay, recovery, cancellation/refund and dependent admin/driver/mobile flows in a non-production environment. API and web must be released together in the documented order.
- **External services:** configured analytics receipt, GA4 Enhanced Measurement settings, notification/email delivery and managed Google Business Profile ownership remain unverified.
- **Operational claims:** existing prices, minima, insurance, hours, capacity, specialist equipment and wider/ferry coverage need business confirmation.
- **Performance:** no field p75 LCP/INP/CLS measurement is available and no Lighthouse score is presented as field INP. Targets remain LCP <2.5s, INP <200ms and CLS <0.1.
- **Search outcomes:** Search Console performance was processing. Accepted sitemap/indexing requests are not completed indexing, and neither this build nor these test counts prove ranking gains.

Use [release-checklist.md](release-checklist.md) for local integration, coordinated release, rollback and the Copilot handoff prompt.
