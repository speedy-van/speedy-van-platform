# Review, release and rollback

Updated 21 September 2026. The owner authorised and received a production release. The source branch remains open in draft PR #2; no merge was performed. Deployment completion does not mean every external integration or mobile visual gate below has been executed.

## Executed release

- Web: `5jXbcona28QiqxAyY7S1He4F5P6a`, ready at 16:13:56 UTC; API: `3hASzcuv7AutpMFHViDuZe8FL6sa`, ready at 16:09:36 UTC. Both were production-environment rebuilds from commit `10c781c49970b3f44c8ee61e4063cb0175c51d71`. The subsequent API-only London-date fix `5e5881a27cca0f6a602473c78a25c13369d1afc5` is live in `5woPnYouSe8kAHqwCsp1o5QoxzSg`, Ready at 16:27:50 UTC; its immediate rollback is `3hASzcuv7AutpMFHViDuZe8FL6sa`. See [deployment-2026-09-21.json](deployment-2026-09-21.json).
- Public API probes passed for direct/proxied health, database catalogue and service configuration, synthetic quote calculation, validation and primary-origin CORS. The public browser journey passed from service CTA through address selection, inventory, date/slot and review. No booking or payment was submitted.
- Google's live smartphone test fetched the canonical man-and-van page successfully and reported indexing allowed. The indexing request and 47-URL sitemap resubmission were accepted; completed indexing and ranking gains remain unmeasured.
- Production branch tracking still points to `main`. Automatic approval review rejected changing branch/domain-assignment settings; no retry was made. A future `main` push can automatically release different source. Review and integrate this repair branch before using that pipeline.
- Visual checks at 360px/768px, Stripe test-mode/concurrency checks, provider analytics receipt and operational slot windows remain explicit follow-up work. See [verification.md](verification.md) for the full scope.

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

Choose the API input explicitly. For Git, use root `apps/api` with outside-root files enabled. For the historical standalone CLI workflow, first run `npm run build:standalone -w apps/api`, then deploy `apps/api/dist/standalone` to the existing API project with its empty root. This output contains current source bundles, a locked runtime dependency tree and Prisma schema. Never deploy the tracked legacy `_api.js`, and never reuse web assets built with the local test API origin.

1. Record the approved source SHA and last known good web/API deployment IDs. A reviewed branch deployment does not imply a merge.
2. Release API changes to `speedy-van-api` before or alongside the web. Recovery expects the additive `isPaid` tracking field; older APIs fail closed.
3. Release web to `speedy-van-web`, using the verified project ID in `production-domain-map.md`, root `apps/web`, outside-root files enabled and `apps/web/vercel.json`. The old dashboard build/output/install overrides are cleared. Do not use the stale duplicate project. Rebuild from source with production environment variables; never promote a locally compiled test-API bundle.
4. Keep `https://www.speedyvan.uk` as the primary origin. Do not change DNS, payment callback origins or authentication origins as part of this branch.
5. Verify real canonical/OG URLs, 47 sitemap entries, one-hop permanent HTTPS legacy-host redirects, query preservation, API/method bypass, private-route HTTP noindex and real invalid-route 404s.
6. Recheck seven service CTAs and original-slug booking intent. Confirm public content is present in initial HTML.
7. Confirm service-worker update clears old application caches and does not retain booking, tracking, admin or query-bearing responses.
8. Use Search Console URL Inspection after the release. The sitemap is already submitted; update/reinspect it when the two hubs are live. Indexing-request acceptance is not completion.

## Rollback

Rollback triggers include quote/payment regressions, incorrect canonical origins, private content indexing, mixed React-runtime errors, lost inventory or broken API/mobile contracts.

- Use Vercel's rollback action to restore the recorded web `4CnN8XEktZw8716F6iX95EbCfgp3` and API `4mQDCapaoV3vtVeHYnbkyEVMQQNC` deployments if a full repair rollback is required. For an API-only follow-up, prefer its immediately preceding verified deployment recorded in the release JSON. Consider web/API contracts together; avoid mismatched releases.
- Revert the repair commit through a normal reviewable Git revert if a code rollback is required. Do not force-push, reset the owner's local tree or overwrite unrelated commits.
- No schema migration or DNS change is included, so no database rollback is introduced by this branch.
- Preserve actual payment/refund records and reconcile pending events; never delete them to make a test pass.
- If reverting service-worker behaviour, ship a subsequent cache-version change that purges the application cache rather than restoring unsafe private-response caching.
- Re-run the HTTP and offline regression checks on the rollback result and verify production health.

## Paste-ready Copilot handoff

```text
Review and integrate origin/fix/organic-search-and-booking-2026-09-21 from speedy-van/speedy-van-platform. Read applicable AGENTS.md and docs/seo/verification.md, production-domain-map.md and release-checklist.md. Inspect git status and preserve every unpublished local change. Start in a separate worktree; do not reset, clean, force-push, merge automatically or deploy. Compare with the current production branch before integration. Retain the existing design, images, item/room/bedroom inventory and customer/driver/admin/mobile API contracts. Run the documented install, Prisma generation, all workspace type checks, lint, regression tests, production builds and HTTP QA. Complete the 360px browser and Stripe test-mode/Neon integration gates and report actual results. Do not claim guaranteed rankings or that indexing requests mean pages are indexed. Use English with UK spelling in code/content and Arabic when reporting to the owner. Prepare a reviewable integration result and identify any genuine conflict or release blocker.
```
