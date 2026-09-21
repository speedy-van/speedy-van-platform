# SEO Release Checklist

Date: 2026-09-19

## Before Deploy

- Confirm the release branch includes only intended SEO and payment-guard changes.
- Review all unpublished non-SEO changes already present in the workspace before merging.
- Confirm deployment target is the Vercel project `speedy-van-co-uk-web`.
- Confirm production app is `apps/web`.
- Confirm whether public GitHub `main` being at `688632f9948c5189438e50f4d1f61f938d1850a4` is expected, or identify the private production source.
- Run `npm run typecheck -w apps/web`.
- Run `npm run build -w apps/web`.
- Run `python scripts/seo-local-qa.py` against a local or private preview.
- Record preview URL and commit SHA in the release notes.

## Deploy

- Do not change live hosting from this handover alone.
- Deploy only through the normal controlled Vercel workflow.
- Do not create a second public site for `.co.uk`.
- Preserve the primary hostname `https://www.speedyvan.uk`.

## Immediate Post-Deploy Checks

Check these live URLs:

- `https://www.speedyvan.uk/`
- `https://www.speedyvan.uk/privacy`
- `https://www.speedyvan.uk/terms`
- `https://www.speedyvan.uk/cookies`
- `https://www.speedyvan.uk/services/man-and-van`
- `https://www.speedyvan.uk/services/house-removal`
- `https://www.speedyvan.uk/areas/glasgow`
- `https://www.speedyvan.uk/areas/edinburgh`
- `https://www.speedyvan.uk/book`
- `https://www.speedyvan.uk/auth/login`
- `https://www.speedyvan.uk/robots.txt`
- `https://www.speedyvan.uk/sitemap.xml`

Acceptance:

- Public indexable pages have one self-canonical on `https://www.speedyvan.uk`.
- `/book` and `/auth/login` are `noindex,nofollow` and have no homepage canonical.
- Sitemap has 45 URLs and no `.co.uk` URLs.
- `robots.txt` points to `https://www.speedyvan.uk/sitemap.xml`.
- Old hosts redirect to the primary host for GET/HEAD public pages.
- `/api` and non-GET/HEAD requests are not broken by redirects.
- Man and Van page no longer exposes internal SEO commentary.
- Glasgow and Edinburgh area pages show practical local move advice.

## Search Console

- Submit `https://www.speedyvan.uk/sitemap.xml`.
- Inspect the homepage canonical.
- Inspect `/privacy`, `/terms`, and `/cookies`.
- Inspect `/services/man-and-van`, `/services/house-removal`, `/areas/glasgow`, and `/areas/edinburgh`.
- Request indexing only after the live canonical is correct.

## Analytics

- Confirm GA4 or equivalent analytics access.
- Confirm booking-start events from service and area pages.
- Confirm payment success tracking is not duplicated.
- Confirm failed pricing and failed booking states are observable.

## Rollback Triggers

Rollback or hotfix if:

- Primary pages canonicalise to `.co.uk`.
- `/book` or `/auth/login` become indexable.
- Booking pricing or payment requests fail due to redirect changes.
- Old-host API requests are redirected unexpectedly.
- Sitemap contains wrong domains or removed service URLs.

## Ranking Claims

Do not claim ranking improvements, traffic growth, or conversion uplift until Search Console and analytics data prove them after deployment.
