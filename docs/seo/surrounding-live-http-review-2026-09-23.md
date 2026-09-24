# Surrounding areas: bounded production HTTP verification

Result: **PARTIAL_TRANSPORT_OR_DEADLINE**. Checked 2026-09-23T11:48:51.187264+00:00. Expected application commit `f8b90f5dd331285f838f1898c54e605606f2fb69`, deployment `JDVA7y9WFvZEDkdocvtmTfXy8zg4`; hosting ownership and Ready state were independently confirmed by the lead. This HTTP pass does not infer a source commit from page content.

Exactly eight affected area pages, the sitemap and one invalid area route were requested. Four workers, 8-second curl and 10-second subprocess limits, a 40-second total budget, no redirects followed and no retries. Actual elapsed time: 22.456 seconds. No credentials, cookies, booking, API, payment or mutation requests were used.

- Complete responses: 6/10; affected pages with complete HTTP 200: 4/8.
- Assertions passed: 47; demonstrated assertion failures: 0.
- Transport-incomplete responses: 4; unscheduled: 0.

| Route | Result | Received bytes |
| --- | --- | --- |
| /areas/aberdeen | Transport incomplete | 0 |
| /areas/inverness | Transport incomplete | 0 |
| /areas/nairn | Transport incomplete | 0 |
| /areas/dingwall | Transport incomplete | 0 |
| /areas/inverurie | 200 | 127636 |
| /areas/ellon | 200 | 128124 |
| /areas/westhill | 200 | 128582 |
| /areas/stonehaven | 200 | 127824 |
| /sitemap.xml | 200 | 6756 |
| /areas/qa-invalid-surrounding-area | 404 | 36333 |

Complete area responses were checked for exact canonical and Open Graph URLs, one useful H1, title and description, indexing directives, JSON-LD syntax and plain `/book` links. City checks require all 23 locality IDs across both hubs, canonical town links and unique section targets; six town checks require their actual `Place` identity. The sitemap check requires the exact 54 source URLs. The invalid route must return 404 and noindex without an inherited canonical. Checks dependent on incomplete responses remain unverified; a transport timeout is not classified as a content defect or customer outage.

Browser keyboard behaviour, draft state, 360px/768px layout, field performance, indexing and ranking are outside this HTTP evidence. See the lead's separate browser report.

Detailed evidence: `evidence/surrounding-live-http-2026-09-23.json`.

Transport details:

- `/areas/aberdeen`: curl: (28) Operation timed out after 8000 milliseconds with 0 bytes received
- `/areas/inverness`: curl: (28) Operation timed out after 8000 milliseconds with 0 bytes received
- `/areas/nairn`: curl: (28) Operation timed out after 8000 milliseconds with 0 bytes received
- `/areas/dingwall`: curl: (28) Operation timed out after 8001 milliseconds with 0 bytes received
