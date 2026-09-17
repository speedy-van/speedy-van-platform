# Production Domain Map

Date: 2026-09-17

## Domains Checked

| Domain | Live behavior before deployment | Evidence |
| --- | --- | --- |
| `https://www.speedyvan.uk/` | 200 on Vercel. Same homepage ETag as `.co.uk`. Canonical points to `https://speedyvan.uk` non-www. Raw H1 is empty. | `curl -L -D - https://www.speedyvan.uk/` |
| `https://www.speedy-van.co.uk/` | 200 on Vercel. Not redirected to primary `.uk`. Canonical points to `https://speedyvan.uk` non-www. Raw H1 is empty. | `curl -L -D - https://www.speedy-van.co.uk/` |
| `https://speedyvan.uk/` | 307 to `https://www.speedyvan.uk/`. | `curl -L -D - https://speedyvan.uk/` |
| `https://speedy-van.co.uk/` | 307 to `https://www.speedy-van.co.uk/`; not to primary `.uk`. | `curl -L -D - https://speedy-van.co.uk/` |

## Actual Active Application

The deployed HTML references App Router chunks under:

```text
/_next/static/chunks/app/(site)/page-54eb5fbb8cf62adc.js
/_next/static/chunks/app/(site)/layout-89458193ce3f9884.js
/_next/static/chunks/app/layout-76c527e2134dbd0d.js
```

This matches the local `apps/web` App Router implementation, not `apps/web-v2`.

The local repository checked out at `c:\SpeedyVan` does not contain `apps/web-v2`. The supplied GitHub repository `speedy-van/sv` was fetched as `sv/main`; it contains `apps/web-v2` at commit:

```text
688632f9948c5189438e50f4d1f61f938d1850a4
```

`apps/web-v2/src/lib/site.ts` still declares:

```text
domain: speedy-van.co.uk
url: https://www.speedy-van.co.uk
phone: 01202 129 746
```

That conflicts with the primary-domain decision in this implementation and with the local active `apps/web` configuration.

## Branch And Commit Evidence

Local working branch for this SEO execution:

```text
seo-production-execution-2026-09-17
```

Local base commit before this execution:

```text
6aac1d37658975ae721abd1d6caaec27d66420b6
```

The exact Vercel deployment commit could not be proven from public headers. Vercel CLI is logged in, but the available account does not list the SpeedyVan production project, so deployment metadata and production promotion are not accessible from this environment.

## Primary Domain Decision

Primary indexable hostname:

```text
https://www.speedyvan.uk
```

Secondary hosts to redirect with 308 after deployment:

```text
https://speedyvan.uk/*
https://speedy-van.co.uk/*
https://www.speedy-van.co.uk/*
```

Rollback:

1. Remove `apps/web/src/middleware.ts`.
2. Restore `packages/config/src/site.ts` to the previous canonical domain.
3. Restore static `public/robots.txt` and `public/sitemap*.xml` only if App Router metadata routes are intentionally abandoned.
