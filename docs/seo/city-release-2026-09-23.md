# Inverness and Aberdeen production release

Published on 23 September 2026 at 02:21:59 UTC. The owner previously authorised GitHub publication and production deployment. This record supersedes the earlier local-only handover without rewriting its historical test results.

## Verified source and production ownership

| Item | Verified value |
| --- | --- |
| Repository | `speedy-van/speedy-van-platform` |
| Repair branch | `fix/organic-search-and-booking-2026-09-21` |
| Published application commit | `48fcf7ff73ee4d8e5ba2b97a9f630e24b9e15718` |
| Application source package | Local commit `62e7b285438ce371d7cfa96a1d8e59f6b1145e8b`; all 24 changed files match the supplied ZIP byte for byte |
| Matching complete source tree | `e06589d61e09c62f3ad5f891732f84abb1dda8b5` |
| Previous production source / verified parent | `39fbb443baeedcae67a881b70e22db4f9f7e5bba` |
| Web project / root | `speedy-van-web` / `apps/web` |
| Team | `wakaaahmad607-9482s-projects` |
| Preview | `BshdSqPcKEw9h5GApx6RdrQT9nCp`, Ready at 02:18:07 UTC |
| Production | `GYD2pB6EKuW3iRStSwR9Du96QrMP`, Ready at 02:21:59 UTC |
| Primary origin | `https://www.speedyvan.uk` |
| Web rollback deployment | `DN3yLaAbf1LDGaexyTgBfjf6eu8g` |
| API production, freshly checked and unchanged | `5woPnYouSe8kAHqwCsp1o5QoxzSg`, source `5e5881a27cca0f6a602473c78a25c13369d1afc5` |

The authenticated dashboard confirmed the current web source before publication. GitHub received a fast-forward update from that exact parent, with an identical tree to the reviewed local commit. Commit IDs differ because GitHub created a new commit object; the content tree is identical. No newer source was overwritten.

The existing npm workspace configuration was retained. `apps/web/vercel.json` installs with `npm --prefix ../.. ci --include=dev`, then generates the existing Prisma client, builds `packages/db` and builds `apps/web`; output is `.next`. No database migration or seed is part of this command. The current Next.js 15 / React 19 / Tailwind application, lockfile and build settings were preserved.

The dashboard's **Promote to Production** action explicitly rebuilt the reviewed preview source using production environment settings. It did not merely move a preview alias. The public city pages then served the new guides. No API release, DNS change, environment-value edit, branch-tracking change or merge was performed. Production branch tracking remains `main`; this PR remains draft and unmerged. A later main release could replace these branch-promoted changes, so integrate the reviewed repair branch through the normal release process before relying on main automation.

- [Production deployment](https://vercel.com/wakaaahmad607-9482s-projects/speedy-van-web/GYD2pB6EKuW3iRStSwR9Du96QrMP)
- [Reviewed preview](https://speedy-van-5vamak4fi-wakaaahmad607-9482s-projects.vercel.app/areas/inverness)
- [Published application commit](https://github.com/speedy-van/speedy-van-platform/commit/48fcf7ff73ee4d8e5ba2b97a9f630e24b9e15718)
- [Open PR](https://github.com/speedy-van/speedy-van-platform/pull/2)

## Changes and verification

The six application files provide distinct city guides, eight service links and four FAQs per city, contextual incoming links, and existing quote entry points. They preserve the original ten featured areas and add the two cities. Both independent source reviewers found no blocking application defect or unsupported city-office, crew, price, insurance, review or availability claim. No booking, pricing, payment, API, inventory, consent or analytics contract changed in this increment.

| Evidence | Result and scope |
| --- | --- |
| Supplied local package | Recorded typecheck, lint, production build, 120 regression tests and 498 local HTTP assertions passed on the matching content tree. These are local results, not new live transaction tests. |
| Cloud builds | Preview and production builds both completed successfully from `48fcf7f`. |
| Focused public HTTP check | All 16 route groups passed against `https://www.speedyvan.uk`; started at 02:22:13 UTC. See `city-live-http-2026-09-23.json`. |
| City initial HTML | HTTP 200, useful H1, one canonical, matching social titles, a single brand suffix and no HTML/HTTP noindex. Eight service links plus quote/contact/pricing links are inside main content. |
| Structured data | Both city Service entities retain stable IDs and the existing organisation reference, with City service areas and correct BreadcrumbList targets. No fabricated offers or office address. |
| Discovery | Both city links occur within the main content of all eight checked service pages, and on the homepage. Both city sitemap entries occur once in the unchanged 47-URL sitemap. Robots allows city crawling. This check does not claim all 47 URLs were crawled again. |
| Invalid/private routes | Invalid area and service paths returned real HTTP 404 with noindex; `/book` returned HTTP 200 with noindex. |
| Preview browser | Both city pages rendered at a measured 1348px viewport without horizontal overflow. FAQ mouse and Enter-key disclosure worked. Both quote buttons opened `/book`, where the empty service-selection state rendered and Continue remained disabled. |
| Public browser | Both new guides rendered on their canonical URLs. FAQ mouse and keyboard disclosure worked. Both city quote buttons opened `/book`, rendering the existing draft's journey screen. No draft fields, addresses or inventory were edited. |
| Console sample | The public browser returned 12 extension-origin error entries and no application warning/error entries in that sample. This is not a claim that no runtime error can occur. |
| Actual 360px / 768px interaction | Still unverified. The advertised browser capabilities expose no viewport/device emulation. Desktop evidence and responsive source review do not establish this result. |
| Payment and conversions | No booking, payment or notification was submitted. No provider end-to-end or confirmed-conversion gain is claimed. |
| Search and field performance | No post-release indexing, ranking, traffic or field Core Web Vitals gain has been established. |

The checker was tightened after independent review: footer links can no longer satisfy city/service contextual-link assertions. Its explicit `--production` mode permits only the primary HTTPS origin; local mode remains restricted to localhost and redirects are not followed. The reviewer verified 16 local route groups, a footer-only negative example, origin restrictions and redirect refusal. The lead then ran the enhanced checker on production.

A dashboard screenshot was captured and visually inspected, but its documented shared-file copy did not become available in the workspace after the five-second poll. The screenshot cannot be attached; the deployment URL and machine-readable release record provide the saved release references.

## Reproduce the bounded live check

```bash
python3 scripts/verify-city-seo.py --production
```

This command performs read-only GET requests to 16 route groups on the primary origin. It never submits a quote, booking, payment, email or analytics conversion. For a local built server, retain `--base http://127.0.0.1:3002` without `--production`.

## Release checklist and rollback

- [x] Reconcile current production, branch parent and package content.
- [x] Preserve unpublished local content and verify the complete Git tree.
- [x] Independent content and application review.
- [x] Successful cloud preview and production rebuilds.
- [x] Preview and public desktop FAQ / quote-entry checks.
- [x] Public metadata, contextual links, schema, robots, sitemap and invalid-route checks.
- [x] Confirm the production API deployment is unchanged.
- [ ] Complete real 360px and 768px visual/keyboard checks in an environment with viewport controls.
- [ ] Complete any real provider payment testing separately in an isolated test environment.
- [ ] Confirm indexing and selected canonicals, then measure meaningful city query and conversion data.

If a release regression requires rollback, use the existing web project's Instant Rollback action to restore **`DN3yLaAbf1LDGaexyTgBfjf6eu8g`**, whose source is `39fbb443baeedcae67a881b70e22db4f9f7e5bba`. Check that the selected rollback belongs to the web project and primary domains, then verify the public city and booking pages. Leave the API release unchanged. Do not choose the older initial repair deployment `5jXbcona...`, which would also remove later booking-draft improvements. A source rollback should revert the city application commit while preserving later documentation and unrelated work; never force-reset a branch with newer changes. No rollback was executed.

## Search outcomes and growth follow-up

The earlier Search Console requests were accepted for the then-published pages. Their stored state was **Discovered – currently not indexed**; this release does not change that recorded fact into a successful indexing result. Requests were not repeated during publication.

Use the existing 60 inferred phrases as a measurement map, not 60 independent pages or observed search-volume data. The first targets are indexing with the intended canonical, relevant non-brand city impressions/clicks, and attributable qualified enquiries. No numerical growth or ranking deadline is justified by the available one-day baseline.

- **First 30 days:** check both URL indexing states and selected canonicals; collect a complete 28-day city page/query baseline and verify enquiry attribution. Confirm operational coverage and terms before adding stronger claims.
- **Days 31–60:** add approved evidence from real city jobs, check eligible Business Profile service areas, and improve content using observed queries and customer questions. Compare qualified enquiries and genuine confirmed bookings separately from contact clicks.
- **Days 61–90:** improve conversion steps based on measured behaviour and assess relevant local partnerships. Create an additional route page only where genuine demand and operational evidence support useful distinct content.

## Copilot handoff

```text
Work on the existing repository and read applicable AGENTS.md and docs/seo/city-release-2026-09-23.md first. Preserve every local unpublished change. Fetch the latest fix/organic-search-and-booking-2026-09-21 branch into an isolated worktree if necessary; do not replace it with older main. The city application release is 48fcf7ff73ee4d8e5ba2b97a9f630e24b9e15718, tree e06589d61e09c62f3ad5f891732f84abb1dda8b5, production deployment GYD2pB6EKuW3iRStSwR9Du96QrMP. Later documentation/checker commits do not imply another application release.

Verify /areas/inverness and /areas/aberdeen at actual 360px and 768px viewports. Use the installed npm workspaces, Next.js 15, React 19 and Tailwind. Inspect apps/web/src/app/(site)/areas/[slug]/page.tsx (AreaPage and generateMetadata, params: Promise<{ slug: string }>), apps/web/src/components/areas/AreaGuideContent.tsx (AreaGuideContentProps: area: Area; guide: AreaGuide), apps/web/src/lib/area-guides.ts (AreaGuide and getAreaGuide), and apps/web/src/lib/areas.ts (FEATURED_AREAS). Incoming links are in apps/web/src/app/(site)/services/[slug]/page.tsx and apps/web/src/components/layout/Footer.tsx. Keep buildPageMetadata and existing canonical/entity helpers.

Check FAQ keyboard operation, focus, wrapping, contrast, reduced motion and quote navigation. City CTAs intentionally enter /book; preserve existing drafts and do not invent a city query parameter or prefilled address. Preserve booking/pricing/payment/API/consent contracts and item/room/bedroom inventory. Do not submit a real booking or payment during UI verification.

If a concrete code defect is found, fix only the affected files and run the relevant existing regression checks plus npm run typecheck -w apps/web, npm run lint -w apps/web and npm run build -w apps/web. Use scripts/verify-city-seo.py against a local production server; its explicit --production option runs only the bounded primary-origin GET check. Keep observed search outcomes separate from inferred phrases and accepted indexing requests. Report changes, evidence and any remaining limits in Arabic; use English UK spelling in code and customer content. Do not promise rankings or silently merge/redeploy a different source.
```
