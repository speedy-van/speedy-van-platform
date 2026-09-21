# Review, release and rollback

Updated 21 September 2026. This branch is prepared for review and local integration; it does not deploy either application.

## Pull safely

The base is `seo-production-execution-2026-09-17` in `speedy-van/speedy-van-platform`. Do not replace unpublished changes with the older `speedy-van/sv` main branch. Fetch first; use a separate worktree for review:

```sh
git fetch origin fix/organic-search-and-booking-2026-09-21
git worktree add ../organic-search-review -b review/organic-search-2026-09-21 origin/fix/organic-search-and-booking-2026-09-21
```

Run from that worktree:

```sh
npm ci --ignore-scripts
npx prisma generate --schema=packages/db/prisma/schema.prisma
npm run typecheck
npm run lint
npm run test:regression
npm run build
npm run start -w apps/web
```

In a second terminal, run `python scripts/seo-local-qa.py --base-url http://localhost:3002`. For an interactive booking preview, configure the existing public API URL to a test API before building and starting. Never point a test checkout at live Stripe credentials. An isolated web preview without an API deliberately shows unavailable-quote/payment states; it cannot verify a real purchase.

## Required release gates

- Retain the committed npm shallow-install configuration; it separates React 19 web peers from React 18 mobile peers. Do not reuse stale hoisted `node_modules` after switching branches; `npm ci` installs the locked tree.
- Review the dependency lockfile and the Next 15 / React 19 web compatibility changes. Mobile remains on its existing React 18 contract; run its included type check. Do not upgrade the mobile SDK blindly to silence an audit.
- Re-run the recorded automated checks on the actual merge result, including any newer local work. Preserve design, images, item selection, room and bedroom inventory.
- Check the real browser at 360px, 768px and desktop: navigation, all quote steps, recovery, keyboard focus, long validation messages, overflow, no-JavaScript content and reduced motion. Automated HTTP checks do not establish visual accessibility.
- Use a non-production database and Stripe test mode to verify card success, 3-D Secure, decline/retry, duplicate webhook delivery, confirmation-network failure, cancellation and refund reconciliation. No real card charge is required for this gate.
- Ensure webhook subscriptions include `payment_intent.succeeded`, `payment_intent.payment_failed`, `charge.refunded`, `refund.created`, `refund.updated` and `refund.failed`. Retry failed deliveries after remediation.
- Test concurrency against the actual Neon/Prisma adapter: webhook plus browser confirmation must produce one durable payment transition/job/conversation/admin notification.
- A pending or failed refund must not be presented as a completed cancellation/refund. The existing schema has no pending-refund workflow; operations must review these cases. Confirmation email delivery remains best-effort after durable commit.
- Verify the existing phone/email, guide prices, minimum charges, insurance, hours, coverage and specialist capabilities with operations. Do not add unsupported claims to improve keyword coverage.
- In GA4, check browser-history Enhanced Measurement page views to avoid duplication with application routing. Confirm real account receipt and deduplication after consent, withdrawal and reload. Call clicks are not qualified calls or completed bookings.
- Resolve remaining deployment-scope security advisories recorded in `verification.md`; do not treat mobile tooling findings as proof of website exploitation.

## Coordinated release

1. Record the approved merge SHA and last known good web/API deployment IDs.
2. Release API changes to `speedy-van-api` before or alongside the web. Recovery expects the additive `isPaid` tracking field; older APIs fail closed.
3. Release web to `speedy-van-web`, using the verified project ID in `production-domain-map.md`. Do not use the stale duplicate project.
4. Keep `https://www.speedyvan.uk` as the primary origin. Do not change DNS, payment callback origins or authentication origins as part of this branch.
5. Verify real canonical/OG URLs, 47 sitemap entries, one-hop permanent HTTPS legacy-host redirects, query preservation, API/method bypass, private-route HTTP noindex and real invalid-route 404s.
6. Recheck seven service CTAs and original-slug booking intent. Confirm public content is present in initial HTML.
7. Confirm service-worker update clears old application caches and does not retain booking, tracking, admin or query-bearing responses.
8. Use Search Console URL Inspection after the release. The sitemap is already submitted; update/reinspect it when the two hubs are live. Indexing-request acceptance is not completion.

## Rollback

Rollback triggers include quote/payment regressions, incorrect canonical origins, private content indexing, mixed React-runtime errors, lost inventory or broken API/mobile contracts.

- Re-promote the recorded last known good web and API deployments through the normal release workflow. Consider them together for payment/recovery behaviour; avoid mismatched releases.
- Revert the repair commit through a normal reviewable Git revert if a code rollback is required. Do not force-push, reset the owner's local tree or overwrite unrelated commits.
- No schema migration or DNS change is included, so no database rollback is introduced by this branch.
- Preserve actual payment/refund records and reconcile pending events; never delete them to make a test pass.
- If reverting service-worker behaviour, ship a subsequent cache-version change that purges the application cache rather than restoring unsafe private-response caching.
- Re-run the HTTP and offline regression checks on the rollback result and verify production health.

## Paste-ready Copilot handoff

```text
Review and integrate origin/fix/organic-search-and-booking-2026-09-21 from speedy-van/speedy-van-platform. Read applicable AGENTS.md and docs/seo/verification.md, production-domain-map.md and release-checklist.md. Inspect git status and preserve every unpublished local change. Start in a separate worktree; do not reset, clean, force-push, merge automatically or deploy. Compare with the current production branch before integration. Retain the existing design, images, item/room/bedroom inventory and customer/driver/admin/mobile API contracts. Run the documented install, Prisma generation, all workspace type checks, lint, regression tests, production builds and HTTP QA. Complete the 360px browser and Stripe test-mode/Neon integration gates and report actual results. Do not claim guaranteed rankings or that indexing requests mean pages are indexed. Use English with UK spelling in code/content and Arabic when reporting to the owner. Prepare a reviewable integration result and identify any genuine conflict or release blocker.
```
