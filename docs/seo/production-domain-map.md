# Production Domain Map

Date: 2026-09-21

## Primary Host

Primary indexable hostname:

```text
https://www.speedyvan.uk
```

## Live Host Behaviour

| Host tested | Live behaviour observed | Notes |
| --- | --- | --- |
| `https://www.speedyvan.uk/` | 200 on Vercel | Primary public site |
| `https://speedyvan.uk/` | Redirects to `https://www.speedyvan.uk/` | One hop observed |
| `https://www.speedy-van.co.uk/` | Redirects to `https://www.speedyvan.uk/` | One hop observed |
| `https://speedy-van.co.uk/` | Redirects to primary through host normalisation | Two hops observed |
| `http://speedy-van.co.uk/` | Redirects to primary through protocol and host normalisation | Three hops observed |

## Active Application Evidence

Local configuration:

```text
vercel.json buildCommand: npm run build -w apps/web
vercel.json outputDirectory: apps/web/.next
.vercel/project.json projectName: speedy-van-web
.vercel/project.json projectId: prj_OkJrabaUpBmsMqNibYZc5cgnIqFg
```

Live HTML evidence:

```text
/_next/static/chunks/app/(site)/...
```

That matches `apps/web/src/app/(site)`.

`apps/web-v2` is not present in this local workspace, so the active local equivalents are all under `apps/web` or shared packages.

## Vercel Project Ownership

| Role | Vercel project | Project ID | Production domains |
| --- | --- | --- | --- |
| Public website and web admin (`/admin`) | `speedy-van-web` | `prj_OkJrabaUpBmsMqNibYZc5cgnIqFg` | `www.speedyvan.uk`, `speedyvan.uk`, `speedy-van.co.uk`, `www.speedy-van.co.uk` |
| API used by web, driver portal, and iOS admin | `speedy-van-api` | `prj_QjawXiV1uA0WAOB0eb7x379ydY3f` | `api.speedyvan.uk` |

Do not deploy the production website to `speedy-van-co-uk-web`. That project is a stale duplicate and only owns the generated `speedy-van-co-uk-web.vercel.app` hostname.

Latest verified production deployment for `www.speedyvan.uk`:

```text
Vercel project: speedy-van-web
Deployment id: dpl_4CnN8XEktZw8716F6iX95EbCfgp3
Status: Ready
Verified: 2026-09-21
```

## Repository Evidence

| Source | Value | Status |
| --- | --- | --- |
| Local branch | `seo-production-execution-2026-09-17` | confirmed locally |
| Local HEAD | `5bcc46c1 feat: add admin iOS app and production updates` | confirmed locally |
| Public GitHub `main` | `688632f9948c5189438e50f4d1f61f938d1850a4` | confirmed with `git ls-remote` |
| Production deployed commit | unknown | not exposed by public headers and not available through authenticated hosting access |

## Remaining Unknowns

The following could not be proven from public access alone:

- Exact Git commit associated with Vercel's uploaded source bundle.
- Whether public GitHub `main` is intentionally stale or no longer the production source.

## Local Redirect Implementation

Implemented in:

```text
apps/web/src/middleware.ts
```

Local behaviour after fixes:

- `speedyvan.uk`, `speedy-van.co.uk`, and `www.speedy-van.co.uk` redirect with 308 to `https://www.speedyvan.uk`.
- Path and query string are preserved.
- `/api` and `/api/*` are not host-redirected.
- Non-GET/HEAD requests are not host-redirected.

The `/api` and non-GET/HEAD bypass is intentional to preserve pricing, booking, payment and webhook compatibility.

## Rollback Notes

To roll back only the SEO host changes:

1. Revert `apps/web/src/middleware.ts`.
2. Revert `apps/web/src/app/layout.tsx` metadata changes.
3. Revert legal page canonical changes.
4. Keep unpublished unrelated work intact.
