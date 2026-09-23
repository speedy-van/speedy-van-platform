# Bounded production HTTP verification — 23 September 2026

Result: **PARTIAL: transport timeouts and deadline**. This supplements, and does not overwrite, the earlier interrupted urllib attempt.

The existing49-URL sitemap evidence was used without refetching the sitemap. The run was limited to those49 public canonical pages plus 5 existing invalid-route, booking and robots paths. Each curl GET had an 8-second maximum, redirects disabled, a 10-second subprocess timeout and at most 4 workers. Each completed request was immediately checkpointed. Scheduling stopped at the deadline; total execution was 65.532 seconds. There were no retries or mutations.

## Confirmed

- 40 requests were attempted; 31 completed with HTTP 200 and passed canonical, OpenGraphURL, nonempty title/description, one H1 and indexability checks.
- 42 individual assertions passed across those complete responses.
- `/areas/inverness`: all 6 new section links resolve to unique IDs,4 native FAQs, plain `/book` CTAs, current title/OG/Twitter alignment, local pricing and comparison-guide links.
- `/services/man-and-van` and`/services/house-removal`: current commercial titles match OpenGraph/Twitter and their original booking service query remains present.
- Both new guide pages are live with quote, city and pricing links.
- Expanded pricing content is live, with hourly/fixed guidance, both city sections and 4 FAQs.

## Incomplete

Nine requests exceeded the 8-second bound: homepage (partialHTTP 200 body),`/areas/dunfermline`, `/areas/st-andrews`, `/areas/aberdeen`, `/areas/inverurie`, `/areas/kilmarnock`, `/areas/oban`, `/areas/dumfries`, `/areas/galashiels`. These are transport-incomplete observations, not evidence of incorrect canonical/content or a customer outage. Fourteen remaining planned URLs were not scheduled before the deadline; this includes the remaining service overrides and special 404, booking and robots checks.

No defect was established in a fully received response. No full 49-URL pass is claimed. The root agent's independently recorded production browser checks of both cities, keyboard FAQs and booking navigation remain separate evidence. Browser dimensions, field performance, indexing, rankings and provider payment transactions are outside this run.

Evidence: `evidence/commercial-production-curl-2026-09-23.json`. Source commit expected by the lead: `9bf77d65066d3b505ffa14eee9e7d3425eb8b6aa`; deployment expected: `BL6r4WMVZ66vtaVXwGoycHNMo1Ht`. Hosting provenance was verified by the lead, not inferred from these page GETs.
