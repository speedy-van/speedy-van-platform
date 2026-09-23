# Inverness and Aberdeen implementation

> Release update, 23 September 2026: the city changes are now published from `48fcf7ff73ee4d8e5ba2b97a9f630e24b9e15718`, production deployment `GYD2pB6EKuW3iRStSwR9Du96QrMP` (Ready at 02:21:59 UTC). The earlier local-only and unresolved-production statements below describe the preceding checkpoint. See [the current city release record](city-release-2026-09-23.md) for fresh production mapping, live verification, remaining mobile limits and rollback.

Date: 23 September 2026. Scope: the two existing city landing pages and links to them. This document records the local implementation checkpoint; subsequent authorised GitHub publication and production deployment are recorded in the release update above.

## Source and release boundary

The final implementation is based on `speedy-van/speedy-van-platform`, branch `fix/organic-search-and-booking-2026-09-21`, commit `39fbb443baeedcae67a881b70e22db4f9f7e5bba`. The local review branch is `seo/inverness-aberdeen-current-2026-09-23`.

This is newer than the repository's `main` (`4b29418b0599e1211a8c48799fc5b3c149a3359a`). Initial exploratory work against main was preserved in a separate checkout and superseded. Its Next 14 build, 45-URL sitemap and lint findings are not evidence about this final patch. No unpublished working files were overwritten.

The final branch uses npm, the committed lockfile, Next.js 15.5.25, React 19.2.8 and Tailwind. Existing awaited `params: Promise<{ slug: string }>` and `buildPageMetadata` are preserved. No framework, dependency or package-manager change is part of this city patch. No applicable AGENTS.md was found in the checkout or its workspace ancestors.

The repository's 21 September deployment record identifies web project `speedy-van-web` (`prj_OkJrabaUpBmsMqNibYZc5cgnIqFg`), root `apps/web`, and web deployment `5jXbcona28QiqxAyY7S1He4F5P6a` from `10c781c49970b3f44c8ee61e4063cb0175c51d71`. That is historical evidence. The current connector returned a scope permission error, so the exact presently deployed SHA has not been independently refreshed in this task. The live city copy and routing match the newer branch's structure. Confirm the actual release base before applying the patch. Retain newer changes if the branch has moved.

## Observed Search Console baseline

Authenticated property: `sc-domain:speedyvan.uk`. Observed on 23 September 2026.

| Measure | Inverness | Aberdeen |
| --- | --- | --- |
| Canonical target | `/areas/inverness` | `/areas/aberdeen` |
| Stored indexing state | Discovered – currently not indexed | Discovered – currently not indexed |
| Discovery | Sitemap; referring Fort William page | Sitemap; referring homepage |
| Last recorded crawl | Not available | Not available |
| Live smartphone test | Successful; crawl and indexing allowed | Successful; crawl and indexing allowed |
| Live user canonical | Exact primary city URL | Exact primary city URL |
| Breadcrumb test | One valid item | One valid item |
| Indexing request | Accepted into priority crawl queue | Accepted into priority crawl queue |

Live test times displayed by Search Console: Inverness `23 Sept 2026, 02:03:03`; Aberdeen `23 Sept 2026, 02:06:17`. The UI timezone was not independently established.

The 3-month report exposed only 20 September 2026 as a reporting day. Query regex `inverness|aberdeen` returned 0 clicks, 0 impressions and no query rows. Filtered reports can omit data. This does not establish zero market demand, a lifetime traffic baseline, or a meaningful position of zero. All 60 phrases in `city-keyword-map.csv` are inferred targeting candidates, with unavailable volume left blank. None is presented as an observed city query.

For context, the unfiltered available day contained 5 clicks and 73 impressions across the site. Qualified calls, accepted quotes, completed bookings and revenue by organic city landing page were not available. Do not treat contact clicks as sales. No Google Business Profile changes were made.

The indexing requests refer to the pages published at the time of those requests, before the new city content was released. Their acceptance is not evidence of indexing, selected canonicals or improved rankings. Avoid repeated requests for unchanged pages.

## Changes

- Keep one existing canonical city page per city. No new city × service, postcode, synonym or route pages.
- Add distinct city guides covering eight relevant service intents, access and loading, vehicle/crew assessment, quote scope, three booking steps and four practical FAQs per city.
- Explain Inverness loading arrangements and longer Highland routes; explain Aberdeen shared-stair access and parking-permit limitations using official council guidance. Wider routes and dates remain subject to assessment.
- Link to the seven core service pages plus student moves and the existing pricing guide. The service registry supplies each service URL/name.
- Extend the existing featured-area list with Aberdeen and Inverness, preserving the original ten entries. This adds crawlable links from service pages and the footer; homepage and area-hub discovery remain intact.
- Reuse `buildPageMetadata` and the existing canonical origin. Keep the organisation entity and stable city Service IDs. Describe each targeted city as an area served, not a business address or invented branch.
- Preserve the current dark/amber design, native disclosure controls, booking entry points, images, inventory and payment contracts. No client component, new map, third-party script or dependency is added.
- Update the existing footer analytics regression fixture to load the real area data instead of an obsolete single-export stub. No analytics event or tracking implementation is changed.

See `city-research-2026-09-23.md` for primary sources and competitor observations. Search-discovered competitors are not a controlled local Google rank measurement. No unsupported price, review, branch, insurance or availability claim is added.

## Measurement and 30/60/90-day work

| Period after approved release | Work | Evidence / decision |
| --- | --- | --- |
| First 30 days | Confirm the correct release base, verify both live URLs, then check indexing and selected canonicals. Collect a complete 28-day city page/query baseline. Confirm real dispatch coverage, crew options and quote terms. | First measurable non-brand visibility per city; accepted requests are not the outcome. Record page clicks/impressions and genuinely qualified enquiries separately. |
| Days 31–60 | Obtain consented photographs and factual write-ups from actual jobs in each city. Check the existing Business Profile's eligible service areas and contact consistency. Review queries and enquiry quality; improve answers for real customer gaps. | Measure 28-day city impressions, clicks, organic quote starts, qualified calls and confirmed bookings against the first complete baseline. Set numerical growth targets only when that baseline is credible. |
| Days 61–90 | Improve conversion points supported by data. Explore eligible local business, property and accommodation partnerships. Add a route or supporting page only when actual demand and operating evidence justify it. | Compare like-for-like windows and capacity/profitability. A page earns expansion through useful demand and real service evidence, not keyword count. |

Initial outcome goals are to obtain indexing with the intended canonical, record the first relevant non-brand city impressions/clicks, and establish attributable qualified enquiries. No percentage lift or top-position deadline is supportable from one reporting day. No outreach, paid links, fabricated reviews or new business listings are authorised by this plan.

## Release checklist

- Review the patch against the latest production branch; do not replace whole newer files with the older main snapshot.
- Confirm the current production deployment, project/root and rollback point using an authorised hosting session. Historical project records alone are insufficient.
- Confirm operations can accept the described city enquiries. Verify vehicle/crew choices, charging basis, minimums, packing/assembly and longer-route availability before adding more specific claims.
- Run the documented typecheck, lint, build, regression and HTTP checks against the final integrated tree.
- Review 360px layout, keyboard focus and FAQ disclosure. Test the real quote workflow in an isolated environment, including unavailable dates and failures. Payment/provider and field-performance checks remain separate from content verification.
- Preserve consent-gated measurement. Verify city landing-page attribution to real quote starts/qualified calls and deduplicated confirmed bookings. Do not create internal-link UTM parameters.
- Obtain release approval. This task does not deploy, push or merge.
- After an approved release, verify initial HTML, one brand label in titles, self-canonicals, city Service data, live links, true 404s, sitemap entries and booking navigation. A meaningful published update can be submitted once for recrawling.

## Rollback

Before publication, discard only this task's changes from the isolated review branch if they are rejected; preserve unrelated work. After an approved release, revert this city-specific commit and rebuild through the established deployment process, or restore the exact pre-release web deployment recorded at release time. No database migration, DNS change or payment-contract rollback is needed for this patch. Do not roll production back to the historical September 17 main tree.

## Copilot continuation prompt

```text
Review and integrate the Inverness/Aberdeen city SEO patch on the latest authorised production source of speedy-van/speedy-van-platform. The prepared base is 39fbb443baeedcae67a881b70e22db4f9f7e5bba on fix/organic-search-and-booking-2026-09-21; do not use the older main snapshot or speedy-van/sv. Read applicable AGENTS.md and docs/seo/city-targeting-2026-09-23.md, city-verification-2026-09-23.md and city-independent-qa-2026-09-23.md first.

Preserve the current Next.js 15/React 19/npm/Tailwind app, awaited route params, dark/amber design, images, bedroom/item inventory, booking drafts, pricing, payment, consent and analytics contracts. Reuse buildPageMetadata, absoluteUrl and existing business IDs. Keep /areas/inverness and /areas/aberdeen as the only city targets. Preserve distinct helpful content, eight service links per city, council references, native FAQs and contextual incoming links. Do not invent branches, prices, reviews, insurance or availability.

Run web typecheck, lint, production build, the existing regression suite, scripts/seo-verify-build.py and scripts/verify-city-seo.py against a local production server. Review mobile and booking error states. The accepted Google indexing requests apply to the currently live pages; no new content has been deployed by this patch. Confirm the current deployment SHA and reviewable preview before seeking release approval. Do not deploy, push, merge or change hosting/DNS without explicit authorisation. Report in Arabic; keep code and customer copy in English using UK spelling. Separate technical checks, indexing and measured business outcomes.
```
