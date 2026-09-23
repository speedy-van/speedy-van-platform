# City implementation verification

Final base: `39fbb443baeedcae67a881b70e22db4f9f7e5bba`, repository `speedy-van/speedy-van-platform`. Checked 23 September 2026. Results below were executed on the final city changes, not copied from historical reports.

| Check | Result | Evidence / limit |
| --- | --- | --- |
| Clean initial checkout / existing work preservation | Pass | Isolated worktree on the newer repair branch. Earlier main-based exploration remains separate. |
| npm lockfile installation | Pass | `npm ci --no-audit --no-fund`; no lockfile or dependency edit. |
| Web typecheck | Pass | `npm run typecheck -w apps/web`, including Next route type generation. |
| Full web lint | Pass | `npm run lint -w apps/web`; no warnings or errors. The Next lint deprecation notice is informational; no migration performed. |
| Existing regression suite | Pass: 120/120 | `npm run test:regression`. The initial obsolete footer mock was updated to load real area exports; assertions were retained. Covers existing booking, payment, analytics, pricing, schema and security contracts in the suite. |
| Production web build | Pass | `npm run build -w apps/web`; 75 pages generated. Both city pages are statically rendered. No build/runtime code change was needed. |
| Integrated HTTP/HTML checks | Pass: 498/498 | `city-integrated-http-2026-09-23.json`, generated using `scripts/seo-verify-build.py`. |
| Focused city HTTP checks | Pass: 16 route groups | `city-http-verification-2026-09-23.json`, generated using `scripts/verify-city-seo.py`. Each group includes the assertions in the script; do not call this a separate 16-test unit suite. |
| Keyword map | Pass | 60 unique inferred queries; 30 per city. Two existing canonical targets, nine valid supporting URLs. Volumes unavailable, not fabricated. |
| Independent review | Pass; no blocking code finding | `city-independent-qa-2026-09-23.md`. |
| Patch whitespace | Pass | `git diff --check`. |
| Browser at 360px | Not completed | Cloud browser rejects localhost and file URLs. No alternate browser or policy workaround was attempted. A standalone HTML preview was produced from the verified local build, with CSS/assets embedded and native FAQs preserved. It has not been visually verified in that browser. |
| Real provider payment / database writes | Not exercised | No booking was placed and no payment was taken. Existing offline regressions passed; these do not establish a new provider end-to-end transaction. |
| Field LCP / INP / CLS | Unavailable | No field-performance result or ranking improvement is claimed. No client JavaScript or dependency was added by this change. |
| Current production SHA | Unresolved fresh check | Repository deployment records identify the historical project/release. Current hosting connector lacks access to the recorded team scope. No release action attempted. |

## Verified output

Both `/areas/inverness` and `/areas/aberdeen` return HTTP 200 with one useful H1, one business label in the document title, matching sharing titles, exact primary-domain canonical/Open Graph URLs and no noindex directive. Each has eight crawlable service links, pricing and booking/contact links, four initial-HTML FAQs, valid JSON-LD, a stable city Service ID and the existing organisation ID. No city office address or fabricated offer is added.

Both city links appear on the homepage, relevant service pages and shared footer. The two sitemap entries occur exactly once in the unchanged 47-URL sitemap. Invalid service/area paths return true HTTP 404 with noindex. `/book` remains HTTP 200 and noindex. The integrated harness also exercises public aliases, encoded query preservation, preview/private indexing directives and API host exclusions using read-only GET/HEAD requests. This patch changes no host rule.

The new guides are server components with native disclosure controls. Accessibility source review confirms logical heading levels, unique IDs, visible focus styles, wrapping grids and reduced-motion variants. Source review and 360px preview dimensions do not replace an actual interactive mobile browser check.

## Reproduce

```bash
npm ci --no-audit --no-fund
npm run typecheck -w apps/web
npm run lint -w apps/web
npm run test:regression
npm run build -w apps/web
python3 scripts/seo-verify-build.py --port 3012 --output docs/seo/city-integrated-http-2026-09-23.json
```

For the focused city check, run the local production server with an explicit loopback hostname, then run the checker in the same environment:

```bash
npm run start -w apps/web -- --hostname 127.0.0.1
python3 scripts/verify-city-seo.py --base http://127.0.0.1:3002
```

The managed environment required the server and HTTP client to run in the same command session. The first default-host startup hit a restricted network-interface enumeration call; supplying `--hostname 127.0.0.1` resolved it without an application change. The focused parser counts FAQ disclosures inside main content, independently of the existing mobile navigation disclosure.

Review `city-targeting-2026-09-23.md` for release/rollback steps, the Search Console baseline, 30/60/90-day priorities and the continuation prompt. The live indexing requests were accepted for the current published city URLs. Local checks concern unpublished code. Neither constitutes proof of indexing or rankings.
