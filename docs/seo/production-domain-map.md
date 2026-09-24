# Production domain and source map

> Current release, 23 September 2026 at 11:47:14 UTC: surrounding-town and village targeting is published from application commit `f8b90f5dd331285f838f1898c54e605606f2fb69`, exact tested source tree `5ed4c5d8387d81e3bcb19195877c3aac64d30044`, production deployment `JDVA7y9WFvZEDkdocvtmTfXy8zg4` (Ready; fresh production-environment rebuild). Rollback is `BL6r4WMVZ66vtaVXwGoycHNMo1Ht`. API production was freshly verified unchanged at `5woPnYouSe8kAHqwCsp1o5QoxzSg`. See [the surrounding publication record](surrounding-publication-2026-09-23.md) for actual verification and the outstanding 360px/768px browser limitation. Source-only and blocked statements in earlier reports are historical.

> Current release, 23 September 2026 at 10:47:09 UTC: commercial city targeting, moving guides and pricing guidance are published from application commit `9bf77d65066d3b505ffa14eee9e7d3425eb8b6aa`, matching source tree `26d33175c487a936e448b5e7d7ef489fbc5539e2`, production deployment `BL6r4WMVZ66vtaVXwGoycHNMo1Ht`. The previous web deployment `GYD2pB6EKuW3iRStSwR9Du96QrMP` is the rollback point. API production remains `5woPnYouSe8kAHqwCsp1o5QoxzSg`. See [the commercial release record](commercial-release-2026-09-23.md) for source mapping, verification and limitations. Older updates below are historical.

> Release update, 23 September 2026: the city changes are now published from `48fcf7ff73ee4d8e5ba2b97a9f630e24b9e15718`, production deployment `GYD2pB6EKuW3iRStSwR9Du96QrMP` (Ready at 02:21:59 UTC). The earlier local-only and unresolved-production statements below describe the preceding checkpoint. See [the current city release record](city-release-2026-09-23.md) for fresh production mapping, live verification, remaining mobile limits and rollback.

Verified 21 September 2026 through authenticated hosting inspection, repository metadata and live public requests.

| Role | Project | ID | Root / output |
| --- | --- | --- | --- |
| Public web and web admin | `speedy-van-web` | `prj_OkJrabaUpBmsMqNibYZc5cgnIqFg` | `apps/web`; `.next` (corrected during cloud release) |
| Web, driver and iOS API | `speedy-van-api` | `prj_QjawXiV1uA0WAOB0eb7x379ydY3f` | `apps/api`; current-source Vercel Node function |

Primary origin: `https://www.speedyvan.uk`. API origin: `https://api.speedyvan.uk`. Do not release to the stale duplicate `speedy-van-co-uk-web`.

## Source and build

- Repository: `https://github.com/speedy-van/speedy-van-platform`.
- Production web deployment: `5jXbcona28QiqxAyY7S1He4F5P6a`, Ready at 16:13:56 UTC on 21 September 2026. Source: `fix/organic-search-and-booking-2026-09-21`, commit `10c781c49970b3f44c8ee61e4063cb0175c51d71`.
- The coordinated API deployment `3hASzcuv7AutpMFHViDuZe8FL6sa` reached Ready at 16:09:36 UTC from the same source. The current API deployment is `5woPnYouSe8kAHqwCsp1o5QoxzSg`, Ready at 16:27:50 UTC, from `5e5881a27cca0f6a602473c78a25c13369d1afc5`; it adds the tested London calendar-date correction only. See [deployment-2026-09-21.json](deployment-2026-09-21.json) for the release history.
- Previous web deployment and rollback point: `4CnN8XEktZw8716F6iX95EbCfgp3`, whose source metadata associated `seo-production-execution-2026-09-17` with commit `5bcc46c180d62db1b8a211ef4db227fb167cce0a`.
- Implementation base: latest production-branch commit `e43ffc760b57b5d70b655760ee4877f1f759a85a` (ownership documentation; parent is the deployed commit).
- Repair branch: `fix/organic-search-and-booking-2026-09-21`.
- The source metadata identifies the deployment association; it does not independently prove that an uploaded bundle contained no uncommitted files. Inspected live routes and relevant source structure agree.
- Both existing projects were connected to the exact repository after the owner approved its selected-repository access on 21 September 2026. The original production deployments predate this connection. Production branch tracking remains `main`; no branch-tracking or automatic-domain-assignment change was saved.
- Last known good API deployment: `4mQDCapaoV3vtVeHYnbkyEVMQQNC`, uploaded through the CLI on 26 April 2026. The API project originally had an empty root directory because its historical uploads contained only the API artefact. The authorised Git release now uses `apps/api`. Its include-outside-root setting is enabled and its Node version is 24.
- Installed workspace uses npm and `package-lock.json`. This branch uses npm shallow installation to keep React peers local to the web and mobile workspaces. It does not use the older public repository's pnpm layout or `apps/web-v2`.
- Hosting Node version: 24. The historical web install command was `npm install`; the application-root configuration now uses the committed lockfile through `npm --prefix ../.. ci --include=dev`.
- Historical web build command: `npx prisma generate --schema=packages/db/prisma/schema.prisma && npm run build -w packages/db && npm run build -w apps/web`. The first cloud preview failed framework detection with the shallow workspace layout. The corrected project root is `apps/web`, outside-root files remain enabled, and the old dashboard build/output/install overrides have been cleared. `apps/web/vercel.json` now defines the root-aware Prisma/database build followed by the web build and preserves the API rewrite.
- Active framework at the base: Next 14.2.35 / React 18. This branch applies a security-motivated Next 15.5.25 / React 19 web upgrade, retains npm/Tailwind and leaves the mobile application's React 18 dependency contract unchanged.
- The active `apps/web/vercel.json` preserves the `/api/(.*)` rewrite to `https://api.speedyvan.uk/api/$1`. API and browser-only route responsibilities must remain distinct.

Both applications were promoted through the dashboard's **fresh production-environment rebuild** of the exact preview source. This did not merge the repair branch. Automatic approval review rejected a separate production-branch/automatic-domain-assignment setting change; the unsaved form was restored and no retry was made. Production tracking still points to `main`, so a future push to that branch can trigger a different automatic production release. Integrate the repair through normal review before relying on that pipeline; do not assume this manual release changed branch tracking.

## Host behaviour

| HTTPS host | Intended public GET/HEAD response | Ownership |
| --- | --- | --- |
| `www.speedyvan.uk` | Serve primary canonical page | Production web project |
| `speedyvan.uk` | One 308 to the same primary path/query | Web project plus middleware |
| `speedy-van.co.uk` | One 308 to the same primary path/query | Web project plus middleware |
| `www.speedy-van.co.uk` | One 308 to the same primary path/query | Web project plus middleware |

Earlier in this session, two apex hosting redirect rules were replaced with production-project attachment, allowing the existing middleware to return the permanent path-preserving redirect. Twenty live checks passed then. No DNS records were changed during the source release; project root/build settings were corrected as described above. An HTTP request can still receive an additional platform HTTP-to-HTTPS hop.

After the source release, 18 new live host/private-route checks passed: the three HTTPS aliases preserve paths and encoded queries in one 308 hop; API and POST probes bypass that redirect. `/admin` has HTTP noindex; the nonexistent `/driver` root correctly returns 404 with noindex, while actual driver routes remain separate. See [redirect-live-verification-2026-09-21.json](redirect-live-verification-2026-09-21.json).

`/api`, `/api/*` and non-GET/HEAD requests bypass hostname redirection. This preserves API, booking, payment, auth callbacks, webhooks and mobile contracts. Private HTML and `.vercel.app` previews receive HTTP noindex independently. Noindex is not authentication.

## Canonical configuration

`packages/config/src/site.ts` supplies `SITE.url`; `apps/web/src/lib/seo/constants.ts` supplies `absoluteUrl`. Public metadata, schema and the single App Router sitemap generator use this origin. `apps/web/src/app/robots.ts` publishes the same sitemap. No preview/localhost origin is added to the sitemap.

The standalone API Prisma schema is synchronised with the existing canonical schema in `packages/db/prisma/schema.prisma`. A regression check prevents future drift. No database model was invented and no migration, push or seed was run.

## Release dependency

The API project needs its own release for payment validation, cancellation and webhook changes. Releasing only the web does not install the backend safeguards. Preview verification requires non-production API/database/Stripe credentials configured through the existing deployment workflow; no production secrets are stored in this branch.

The old API `vercel.json` selected the tracked precompiled `_api.js`; it did not rebuild the changed TypeScript source. This is repaired with a small CommonJS bootstrap and a `vercel-build` hook that regenerates Prisma and bundles the current TypeScript/workspace source. The official builder and emitted Node 24 Lambda were exercised locally; direct unbundled TypeScript proved unsuitable for the existing workspace module configuration. For a Git deployment, set the API project root to `apps/api` and retain include-outside-root so the workspace packages and root lockfile are available. For the existing standalone upload workflow, run `npm run build:standalone -w apps/api`, deploy its isolated output to the existing API project, and retain the empty project root. Do not mix these two root configurations. The standalone build records source hashes and does not read the old bundle.

The request adapter now accepts both original root routes and the web rewrite's `/api/*` routes, preserving queries, methods and raw webhook bytes. Before release, live `/health` was HTTP 200 and `/api/health` was HTTP 404. Production `DATABASE_URL`, `NEXTAUTH_SECRET`, `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET` entries were present in the authenticated settings; their values were not revealed or copied.


## Inverness and Aberdeen follow-up — 23 September 2026

City follow-up source: the local patch uses repair-branch head `39fbb443baeedcae67a881b70e22db4f9f7e5bba`, not the older main tree. The connector was unavailable during the initial checkpoint. The subsequent authenticated dashboard check confirmed that exact production base. The city changes are now published as `48fcf7ff73ee4d8e5ba2b97a9f630e24b9e15718`, production deployment `GYD2pB6EKuW3iRStSwR9Du96QrMP`; the API remains unchanged. See [city-release-2026-09-23.md](city-release-2026-09-23.md) for current ownership, build settings and rollback.
