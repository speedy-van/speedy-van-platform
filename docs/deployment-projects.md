# Deployment Project Ownership

Date: 2026-09-21

This file is the source-of-truth map for SpeedyVan production projects. Use it before running any deploy command.

## Live Projects

| Surface | Owner/project | Local app | Deploy command | Production URL |
| --- | --- | --- | --- | --- |
| Public website | Vercel `speedy-van-web` | `apps/web` | `vercel --prod` from repo root | `https://www.speedyvan.uk` |
| Web admin | Vercel `speedy-van-web` | `apps/web/src/app/admin` | Same as public website | `https://www.speedyvan.uk/admin` |
| Web API | Vercel `speedy-van-web` | `apps/web/src/server/api` exposed by `apps/web/src/app/api` | Same as public website | `https://www.speedyvan.uk/api/*` |
| iOS admin | EAS `@ahmadawadalwakai/speedyvan-admin` | `apps/ios-admin` | `eas build --platform ios --profile production` then `eas submit --platform ios --profile production` | TestFlight / App Store Connect app `6812268357` |

The separate backend workspace and separate API Vercel project are retired. The web project now serves API routes under same-origin `/api/*`. If a legacy client still uses an API subdomain, attach that domain to `speedy-van-web` instead of deploying a separate API project.

## Required Links

Root Vercel link:

```json
{"projectId":"prj_OkJrabaUpBmsMqNibYZc5cgnIqFg","orgId":"team_Q9vSLhjMkcmD3pFurpvBUc4R","projectName":"speedy-van-web"}
```

iOS admin link:

```text
Expo owner: ahmadawadalwakai
Expo project: speedyvan-admin
Expo project ID: 24bad6a1-a00e-425a-88fa-c4c9e38208e1
iOS bundle ID: co.uk.speedy-van.admin
App Store Connect app ID: 6812268357
Production API base: https://www.speedyvan.uk/api
```

## Duplicate/Stale Vercel Projects

These projects are not the live production website and should not receive deploys:

| Project | Project ID | Current role |
| --- | --- | --- |
| `speedy-van-co-uk-web` | `prj_03tJLYNkaGYRtFhEnl2rb0Rj7W4Q` | Stale duplicate; no custom production domain |
| `speedy-van-co-uk-web-v2` | unknown | Old duplicate |
| `web` | unknown | Old duplicate |

Do not delete stale projects until their env vars, domains, and deployment history have been checked in Vercel.

## Verification Snapshot

Verified on 2026-09-21:

- `https://www.speedyvan.uk` resolves to Vercel project `speedy-van-web`, deployment `dpl_4CnN8XEktZw8716F6iX95EbCfgp3`.
- The API is now expected at `https://www.speedyvan.uk/api/health`.
- `https://www.speedyvan.uk/robots.txt` and `https://www.speedyvan.uk/sitemap.xml` return HTTP 200.
