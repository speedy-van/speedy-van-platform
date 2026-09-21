# Production domain and source map

Verified 21 September 2026 through authenticated hosting inspection, repository metadata and live public requests.

| Role | Project | ID | Root / output |
| --- | --- | --- | --- |
| Public web and web admin | `speedy-van-web` | `prj_OkJrabaUpBmsMqNibYZc5cgnIqFg` | `apps/web`; `.next` (corrected during cloud release) |
| Web, driver and iOS API | `speedy-van-api` | `prj_QjawXiV1uA0WAOB0eb7x379ydY3f` | `apps/api`; current-source Vercel Node function |

Primary origin: `https://www.speedyvan.uk`. API origin: `https://api.speedyvan.uk`. Do not release to the stale duplicate `speedy-van-co-uk-web`.

## Source and build

- Repository: `https://github.com/speedy-van/speedy-van-platform`.
- Production deployment: `4CnN8XEktZw8716F6iX95EbCfgp3`, Ready and Current when inspected.
- Deployment source metadata: `seo-production-execution-2026-09-17`, commit `5bcc46c180d62db1b8a211ef4db227fb167cce0a`.
- Implementation base: latest production-branch commit `e43ffc760b57b5d70b655760ee4877f1f759a85a` (ownership documentation; parent is the deployed commit).
- Repair branch: `fix/organic-search-and-booking-2026-09-21`.
- The source metadata identifies the deployment association; it does not independently prove that an uploaded bundle contained no uncommitted files. Inspected live routes and relevant source structure agree.
- Both existing projects were connected to the exact repository after the owner approved its selected-repository access on 21 September 2026. The original production deployments predate this connection. Production branch tracking remains `main`; no branch-tracking or automatic-domain-assignment change was saved.
- Last known good API deployment: `4mQDCapaoV3vtVeHYnbkyEVMQQNC`, uploaded through the CLI on 26 April 2026. The API project originally had an empty root directory because its historical uploads contained only the API artefact. The authorised Git release now uses `apps/api`. Its include-outside-root setting is enabled and its Node version is 24.
- Installed workspace uses npm and `package-lock.json`. This branch uses npm shallow installation to keep React peers local to the web and mobile workspaces. It does not use the older public repository's pnpm layout or `apps/web-v2`.
- Hosting Node version: 24. The historical web install command was `npm install`; the application-root configuration now uses the committed lockfile through `npm --prefix ../.. ci --include=dev`.
- Historical web build command: `npx prisma generate --schema=packages/db/prisma/schema.prisma && npm run build -w packages/db && npm run build -w apps/web`. The first cloud preview failed framework detection with the shallow workspace layout. The corrected project root is `apps/web`, outside-root files remain enabled, and the old dashboard build/output/install overrides have been cleared. `apps/web/vercel.json` now defines the root-aware Prisma/database build followed by the web build and preserves the API rewrite.
- Active framework at the base: Next 14.2.35 / React 18. This branch applies a security-motivated Next 15.5.25 / React 19 web upgrade, retains npm/Tailwind and leaves the mobile application's React 18 dependency contract unchanged.
- Root `vercel.json` rewrites `/api/(.*)` to `https://api.speedyvan.uk/api/$1`. API and browser-only route responsibilities must remain distinct.

## Host behaviour

| HTTPS host | Intended public GET/HEAD response | Ownership |
| --- | --- | --- |
| `www.speedyvan.uk` | Serve primary canonical page | Production web project |
| `speedyvan.uk` | One 308 to the same primary path/query | Web project plus middleware |
| `speedy-van.co.uk` | One 308 to the same primary path/query | Web project plus middleware |
| `www.speedy-van.co.uk` | One 308 to the same primary path/query | Web project plus middleware |

Earlier in this session, two apex hosting redirect rules were replaced with production-project attachment, allowing the existing middleware to return the permanent path-preserving redirect. Twenty live checks passed then. This branch does not change hosting or DNS. An HTTP request can still receive an additional platform HTTP-to-HTTPS hop.

`/api`, `/api/*` and non-GET/HEAD requests bypass hostname redirection. This preserves API, booking, payment, auth callbacks, webhooks and mobile contracts. Private HTML and `.vercel.app` previews receive HTTP noindex independently. Noindex is not authentication.

## Canonical configuration

`packages/config/src/site.ts` supplies `SITE.url`; `apps/web/src/lib/seo/constants.ts` supplies `absoluteUrl`. Public metadata, schema and the single App Router sitemap generator use this origin. `apps/web/src/app/robots.ts` publishes the same sitemap. No preview/localhost origin is added to the sitemap.

The standalone API Prisma schema is synchronised with the existing canonical schema in `packages/db/prisma/schema.prisma`. A regression check prevents future drift. No database model was invented and no migration, push or seed was run.

## Release dependency

The API project needs its own release for payment validation, cancellation and webhook changes. Releasing only the web does not install the backend safeguards. Preview verification requires non-production API/database/Stripe credentials configured through the existing deployment workflow; no production secrets are stored in this branch.

The old API `vercel.json` selected the tracked precompiled `_api.js`; it did not rebuild the changed TypeScript source. This is repaired with a small CommonJS bootstrap and a `vercel-build` hook that regenerates Prisma and bundles the current TypeScript/workspace source. The official builder and emitted Node 24 Lambda were exercised locally; direct unbundled TypeScript proved unsuitable for the existing workspace module configuration. For a Git deployment, set the API project root to `apps/api` and retain include-outside-root so the workspace packages and root lockfile are available. For the existing standalone upload workflow, run `npm run build:standalone -w apps/api`, deploy its isolated output to the existing API project, and retain the empty project root. Do not mix these two root configurations. The standalone build records source hashes and does not read the old bundle.

The request adapter now accepts both original root routes and the web rewrite's `/api/*` routes, preserving queries, methods and raw webhook bytes. Before release, live `/health` was HTTP 200 and `/api/health` was HTTP 404. Production `DATABASE_URL`, `NEXTAUTH_SECRET`, `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET` entries were present in the authenticated settings; their values were not revealed or copied.
