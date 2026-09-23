# Verification

Date: 2026-09-19

## Local Private Preview

Preview URL:

```text
http://localhost:3002
```

Current preview process:

```text
PID 43764
```

This is local only. Nothing was deployed.

## Commands Run

```text
npm run typecheck -w apps/web
npm run build -w apps/web
npm run lint -w apps/web
python scripts/seo-local-qa.py
git ls-remote https://github.com/speedy-van/sv.git refs/heads/main
```

Results:

| Command | Result |
| --- | --- |
| `npm run typecheck -w apps/web` | Passed |
| `npm run build -w apps/web` | Passed; 73 static pages generated |
| `npm run lint -w apps/web` | Passed with no ESLint warnings or errors after lint-only cleanup |
| `python scripts/seo-local-qa.py` | Passed |
| `git ls-remote ... refs/heads/main` | Confirmed public `main` at `688632f9948c5189438e50f4d1f61f938d1850a4` |

The first build attempt during the session failed with `EPERM` because an existing `next start` process was holding `.next/trace`. That process was stopped and the build then passed.

## Lint Cleanup

`next lint` is now clean. The cleanup removed unused imports/state, converted type-only imports, stabilised the driver job fetch callback dependency and kept existing image behaviour where switching to `next/image` would have risked changing dynamic proof-image handling.

## Browser Tooling

The in-app Browser skill was attempted but the Node REPL bridge failed with:

```text
sandboxCwd must use the file URI scheme
```

Independent QA was therefore run with installed Python Playwright 1.62.0.

## Local Metadata Checks

| Path | Status | Title | Canonical | Robots |
| --- | --- | --- | --- | --- |
| `/` | 200 | `SpeedyVan | Man and Van, Removals & Delivery Across Scotland` | `https://www.speedyvan.uk` | `index, follow` |
| `/privacy` | 200 | `Privacy Policy | SpeedyVan` | `https://www.speedyvan.uk/privacy` | `index, follow` |
| `/terms` | 200 | `Terms & Conditions | SpeedyVan` | `https://www.speedyvan.uk/terms` | `index, follow` |
| `/cookies` | 200 | `Cookie Policy | SpeedyVan` | `https://www.speedyvan.uk/cookies` | `index, follow` |
| `/services/man-and-van` | 200 | `Man and Van | SpeedyVan` | `https://www.speedyvan.uk/services/man-and-van` | `index, follow` |
| `/services/house-removal` | 200 | `House Removals | SpeedyVan` | `https://www.speedyvan.uk/services/house-removal` | `index, follow` |
| `/areas/glasgow` | 200 | `Man and Van in Glasgow | SpeedyVan` | `https://www.speedyvan.uk/areas/glasgow` | `index, follow` |
| `/areas/edinburgh` | 200 | `Man and Van in Edinburgh | SpeedyVan` | `https://www.speedyvan.uk/areas/edinburgh` | `index, follow` |
| `/book` | 200 | `Book Your Van | SpeedyVan` | none | `noindex, nofollow` |
| `/auth/login` | 200 | `Sign In | SpeedyVan` | none | `noindex, nofollow` |
| `/services/not-a-real-service` | 404 | default not-found title | none | `noindex` |
| `/areas/not-a-real-area` | 404 | default not-found title | none | `noindex` |

## Sitemap And Robots

Local `http://localhost:3002/sitemap.xml`:

| Check | Result |
| --- | --- |
| URL count | 45 |
| URLs on `https://www.speedyvan.uk` | 45 |
| Contains `speedy-van.co.uk` | 0 |
| Contains `rubbish-removal` | 0 |

Local `robots.txt`:

```text
User-Agent: *
Allow: /
Disallow: /admin/
Disallow: /driver/
Disallow: /auth/
Disallow: /api/

Sitemap: https://www.speedyvan.uk/sitemap.xml
```

## Redirect Checks

| Local request | Result |
| --- | --- |
| `Host: speedy-van.co.uk` `/services/man-and-van?utm_source=test` | 308 to `https://www.speedyvan.uk/services/man-and-van?utm_source=test` |
| `Host: speedy-van.co.uk` `/api/health` | No redirect; 404 from app |
| `POST Host: speedy-van.co.uk` `/services/man-and-van` | No redirect; 405 from app |
| `Host: www.speedyvan.uk` `/services/man-and-van` | 200 |

## Playwright QA

Script:

```text
python scripts/seo-local-qa.py
```

Key passing checks:

- Home desktop and mobile: no horizontal overflow.
- Service page: `Plan Your Man and Van` present.
- Service page: leaked internal SEO phrases absent.
- Service booking CTA points to `/book?service=man-and-van`.
- Glasgow area page: practical move advice present.
- Glasgow area page: booking CTA present.
- `/book?service=man-and-van`: prefilled service advances to details.
- Empty address validation shows `Please enter a pickup address.`
- Postcode invalid state works.
- Out-of-coverage state works.
- Pricing failure state shows `Quote unavailable` and `Retry quote`.
- Repeated payment submit guard: submit button shows `Processing...`, is disabled, and only one `/booking/create` request is observed.
- Payment failure state shows the server error message.

Screenshots written to `.screens/`:

```text
seo-home-desktop-2026-09-19.png
seo-home-mobile-2026-09-19.png
seo-service-man-and-van-desktop-2026-09-19.png
seo-area-glasgow-mobile-2026-09-19.png
seo-book-validation-2026-09-19.png
seo-book-payment-failure-2026-09-19.png
```

## Unverified

- Live deployment of these local fixes.
- Search Console validation.
- GA4 funnel impact.
- Google organic rankings.
- Local-pack ranking.
- Google Business Profile state.
- Field Core Web Vitals.
- Payment return from a real provider session; no live charge was created.

## Performance And Measurement Notes

- No performance code was changed.
- Mobile QA at 390px and desktop QA at 1366px found no horizontal overflow on tested pages.
- Field Core Web Vitals were unavailable; no p75 LCP, INP or CLS claim is made.
- Existing consent and purchase tracking contracts were inspected, not replaced.
- Analytics events were not duplicated or newly introduced.
