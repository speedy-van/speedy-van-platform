# Production domain and source map

Verified 21 September 2026 through authenticated hosting inspection, repository metadata and live public requests.

| Role | Project | ID | Root / output |
| --- | --- | --- | --- |
| Public web and web admin | `speedy-van-web` | `prj_OkJrabaUpBmsMqNibYZc5cgnIqFg` | Repository root; `apps/web/.next` |
| Web, driver and iOS API | `speedy-van-api` | `prj_QjawXiV1uA0WAOB0eb7x379ydY3f` | Separate API project; `apps/api` source |

Primary origin: `https://www.speedyvan.uk`. API origin: `https://api.speedyvan.uk`. Do not release to the stale duplicate `speedy-van-co-uk-web`.

## Source and build

- Repository: `https://github.com/speedy-van/speedy-van-platform`.
- Production deployment: `4CnN8XEktZw8716F6iX95EbCfgp3`, Ready and Current when inspected.
- Deployment source metadata: `seo-production-execution-2026-09-17`, commit `5bcc46c180d62db1b8a211ef4db227fb167cce0a`.
- Implementation base: latest production-branch commit `e43ffc760b57b5d70b655760ee4877f1f759a85a` (ownership documentation; parent is the deployed commit).
- Repair branch: `fix/organic-search-and-booking-2026-09-21`.
- The source metadata identifies the deployment association; it does not independently prove that an uploaded bundle contained no uncommitted files. Inspected live routes and relevant source structure agree.
- Vercel Git auto-deployment was not connected when inspected. Creating the repair branch/PR is not a deployment.
- Installed workspace uses npm and `package-lock.json`. This branch uses npm shallow installation to keep React peers local to the web and mobile workspaces. It does not use the older public repository's pnpm layout or `apps/web-v2`.
- Hosting Node version: 24. Existing install command: `npm install`.
- Verified web build command: `npx prisma generate --schema=packages/db/prisma/schema.prisma && npm run build -w packages/db && npm run build -w apps/web`.
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
