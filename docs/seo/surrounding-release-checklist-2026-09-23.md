# Surrounding towns and villages: release checklist

Prepared: 23 September 2026. This is the tested source candidate; production status belongs in the subsequent release evidence.

The owner confirmed service coverage around Inverness and Aberdeen. The candidate adds 23 useful locality cards to the two existing city hubs, five canonical town pages (Nairn, Dingwall, Westhill, Stonehaven and Ellon), and practical content on the existing Inverurie page. The 69-query map contains inferred natural phrases, not measured demand or search volumes. Fleet size and seven-minute proximity were not independently verified and are not customer promises.

## Completed local gates

- `npm run typecheck -w apps/web`: passed.
- `npm run lint -w apps/web`: passed.
- `npm run test:regression`: 120 passed.
- `npm run build -w apps/web`: passed; build `iFEyPehYIS8xsSd5Rfvg0`.
- `python3 scripts/seo-verify-build.py --port 3012 --output docs/seo/evidence/surrounding-local-http-2026-09-23.json`: 618 assertions passed, no failures or transport errors; all 54 canonical sitemap URLs checked.
- `git diff --check`: passed.
- Independent source review: passed; 1,132 of 1,137 existing files unchanged, five intended existing files modified, none missing. Two application modules are new. The real Git index and local HEAD remain unchanged.

Source review checks layout rules, not rendered mobile behaviour. Actual 360px and 768px browser acceptance remains unavailable in the current browser capability. No mobile pass, measured field performance, provider payment test or Google ranking outcome is claimed.

## Source and contract boundaries

Use the existing npm workspace, Next.js App Router and installed styling. New content is server-rendered and adds no client component, map, dependency, analytics event, database field or API contract. The optional `Area.schemaType` distinguishes town `Place` entities across all existing schema consumers. No town is represented as an office. Unknown area routes retain 404/noindex handling; localities without separate pages remain sections on their city hub. There are no placeholder town links.

All city, locality and town quote actions retain plain `/book`; existing service booking query parameters are unchanged. Booking drafts, item/room/bedroom inventory, price calculation, checkout identity, payment, authentication, tracking and customer/driver/admin contracts remain outside the diff. No live booking or payment should be submitted for verification.

## Publication and rollback

1. Publish the bounded candidate on the existing release branch after verifying the complete Git tree against remote parent `74b5679d5b54ef4594fbbba5db4f5f782e1776ec`. Preserve local unpublished work and use a fast-forward ref update only.
2. Inspect the cloud preview's source commit and Ready state. Check both city locality sections and representative town navigation, native FAQs and `/book` in the browser.
3. Rebuild the verified candidate with the production environment using the existing deployment flow; do not alter DNS, environment variables, automatic branch tracking or API production.
4. Verify the exact production commit, new content and canonical sitemap. Record partial or unavailable checks explicitly.
5. If this increment causes a demonstrated regression, roll the web project back to deployment `BL6r4WMVZ66vtaVXwGoycHNMo1Ht` (application commit `9bf77d65066d3b505ffa14eee9e7d3425eb8b6aa`). Leave API production `5woPnYouSe8kAHqwCsp1o5QoxzSg` unchanged. Revert source changes on the current remote head rather than resetting or force-pushing.

Automatic production tracking still points to `main`; this manual release does not change it. A later `main` production deployment may supersede the manually published branch.

## Copilot continuation prompt

```text
Read docs/seo/surrounding-release-checklist-2026-09-23.md and the latest surrounding-release report/evidence. Preserve every unpublished change. Inspect apps/web/src/lib/nearby-area-guides.ts (NearbyAreaPlace, NearbyAreaGroup, getNearbyAreaGroups), apps/web/src/components/areas/NearbyAreaContent.tsx (NearbyAreaContent; area: Area), apps/web/src/components/areas/AreaGuideContent.tsx (area: Area, guide: AreaGuide), apps/web/src/lib/areas.ts (Area, AREAS, getAreaBySlug; optional schemaType), apps/web/src/app/(site)/areas/[slug]/page.tsx (AreaPage, generateMetadata; params: Promise<{ slug: string }>), and apps/web/src/lib/seo/schemas.ts. Discover existing imports including next/link and the @/lib helpers; keep the installed UI system, server rendering and native details/summary semantics. Verify /areas/inverness, /areas/aberdeen and /areas/{nairn,dingwall,westhill,stonehaven,ellon,inverurie} at actual 360px and 768px: wrapping, horizontal overflow, visible focus, Tab/Enter/Space FAQs, section links, canonical town links and plain /book navigation with the existing draft preserved. Unknown guide data returns empty output and invalid routes remain real 404s. Preserve all loading, empty, error and validation states plus inventory, pricing, checkout and payment contracts; do not submit a booking or payment. Fix only demonstrated defects, then run the documented typecheck/lint/regression/build/HTTP gates. Acceptance requires 23 visible locality sections, six real town destinations, accurate Place schema and 54 canonical sitemap URLs. Report source, browser and mobile results separately in Arabic; no unsupported driver count, ETA or ranking claims. Do not deploy or send outreach without authorisation in the active conversation.
```
