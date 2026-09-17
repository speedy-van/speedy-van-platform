# Verification

Date: 2026-09-17

## Commands

```text
npm run typecheck -w apps/web
npm run build -w apps/web
```

Result:

```text
typecheck passed
build passed
Next.js generated 73 static pages
/robots.txt generated
/sitemap.xml generated
middleware generated
```

## Local Production Server

Built app was started on:

```text
http://localhost:3002
```

Raw HTML verification:

| Check | Result |
| --- | --- |
| Homepage H1 | `Man and Van Services Across Scotland` |
| Homepage canonical | `https://www.speedyvan.uk` |
| JSON-LD in initial HTML | 1 script, includes `LocalBusiness` |
| Invalid service URL | 404 |
| Sitemap URL count | 45 |
| Sitemap contains `.co.uk` | false |
| Sitemap contains non-www `https://speedyvan.uk` | false |
| Sitemap contains `/services/rubbish-removal` | false |
| `.co.uk` host redirect | 308 to `https://www.speedyvan.uk/services/man-and-van` |

Responsive verification:

| Viewport | Screenshot | Result |
| --- | --- | --- |
| 1440x1200 | `.screens/seo-home-desktop-final.png` | H1 visible, no horizontal overflow |
| 360x900 | `.screens/seo-home-mobile-360-final.png` | H1 visible, no horizontal overflow |

The browser MCP was unavailable because the shared browser profile was already in use. Playwright was run via the local npx cache matching installed Chromium.

## Live Production Verification Before Deployment

Live domains still show pre-fix behavior because deployment could not be authorized from the available Vercel account:

| URL | Live status before deployment |
| --- | --- |
| `https://www.speedyvan.uk/` | 200, canonical `https://speedyvan.uk`, raw H1 empty |
| `https://www.speedy-van.co.uk/` | 200, canonical `https://speedyvan.uk`, raw H1 empty |
| `https://speedyvan.uk/` | 307 to `https://www.speedyvan.uk/` |
| `https://speedy-van.co.uk/` | 307 to `https://www.speedy-van.co.uk/` |
| live robots | sitemap points to `https://www.speedy-van.co.uk/sitemap.xml` |

Deployment remains required before live acceptance can be claimed.

## Access Limitations

- Vercel CLI is logged in, but the visible account does not list the SpeedyVan production project.
- GitHub CLI is not authenticated in this environment.
- GA4 properties are not connected through HYPD.
- Search Console is not available as a callable connector in this session.
- Google Ads keyword research and conversion-action metadata were available; GAQL performance queries returned `INVALID_ARGUMENT`.
