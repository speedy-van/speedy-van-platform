# Inverness and Aberdeen: city search research

Reviewed: 23 September 2026. Scope: improve `/areas/inverness` and `/areas/aberdeen` as useful organic landing pages. This is research and implementation guidance, not evidence of a deployment or a ranking improvement.

## Decision

Strengthen the two existing city pages, supported by the existing service pages. Keep man and van, man with a van, van and man and van with driver in one coherent intent group. Do not create a separate page for each phrase, postcode or city × service combination.

Both live city pages already have a city H1, service links, access and quote guidance, and a conversion action. Their main opportunity is better help with the decisions that differ by city and job: collection arrangements, property access, parking, crew requirements, student arrival timing and longer journeys. City-specific job evidence would improve credibility if the business can supply genuine material and permission to publish it.

## Method and limits

- Public searches included `man and van Inverness removals` and `man and van Aberdeen removals`; competitor pages were then opened directly. Search-discovered examples are not a location-controlled Google rank report.
- The comparison records what each business publishes, not independent verification of its services, reviews, prices or credentials.
- No search volumes, traffic estimates or numerical ranking targets were available from this research.
- Query phrases below are inferred commercial intents. They are not labelled as queries observed in Speedy Van's Search Console.
- `city-keyword-map.csv` contains 60 deduplicated inferred phrases, 30 per city, mapped to the two existing city URLs and nine existing supporting service/pricing routes. Blank `search_volume` fields mean unavailable data, not zero searches. `mapped_existing_page` records the intended page mapping, not indexing, publication or ranking success.
- Existing public pages demonstrate that enquiries are solicited for both cities. They do not prove a local branch, permanently stationed crew, regular route, specific availability or universal postcode coverage.
- Council and university guidance was retrieved on the review date. Customers and the operator must check current signs and site instructions for the actual move. Do not embed transient fees or event dates in evergreen copy.
- The source checkout may lag the live site. Integrate content narrowly against the confirmed release base and retain newer work.

## Official local sources and safe uses

| City | Primary source | Verified fact | Appropriate application |
| --- | --- | --- | --- |
| Inverness | [Highland Council: loading bays](https://www.highland.gov.uk/parking-fines-enforcement/good-parking-guidance/5) | Signs specify operating times and permitted vehicle types. A loading bay is for loading or unloading, not general parking. | Ask for the location of the nearest lawful loading position and any time restriction; link the council guidance. |
| Inverness | [Highland Council: loading restrictions](https://www.highland.gov.uk/parking-fines-enforcement/good-parking-guidance/3) | Kerb markings and adjacent signs can prohibit loading; double kerb markings indicate an all-time prohibition. | Ask customers to flag loading restrictions. Do not advise that a removal van can always stop on yellow lines. |
| Inverness | [UHI Inverness: accommodation](https://www.inverness.uhi.ac.uk/study/accommodation/) | Student residences are on Inverness Campus, with shared living accommodation and studio options. The accommodation team is the source of residence information. | Include a student-move use case and ask for the exact residence, room access and agreed arrival arrangements. Do not imply a university partnership. |
| Aberdeen | [Aberdeen City Council: residential parking permits](https://sites.aberdeencity.gov.uk/Council-Services/roads-parking-and-travel/residential-parking-permits) | A permit does not guarantee a space or override yellow-line and loading-bay restrictions. Controlled zones have permit/payment requirements. | Explain that a resident permit is not a reserved loading space. Ask the customer to check the precise street and any permissions with the council. |
| Aberdeen | [University of Aberdeen: before you arrive](https://www.abdn.ac.uk/accommodation/resident-info/arrival/) | Hillhead has limited parking. The university describes drop-off arrangements for King's Hall and Elphinstone Road, and ties arrival/key collection to accommodation arrangements. | Ask for the residence, key-collection time and current drop-off instructions before choosing a delivery slot; link to the university's current instructions. |

The Aberdeen Council `www` pages returned a JavaScript-only shell through text retrieval. The corresponding official `sites.aberdeencity.gov.uk` residential-permit page exposed the council content. The bus-gate page could not be verified in full through that route. Do not publish blanket bus-gate access advice or rely on historical experimental traffic-order documents as current street permissions.

Suggested original practical copy, subject to normal editorial integration:

> For an Inverness collection, tell us where the van can load and how far items must be carried. Check the signs and any loading restrictions at both addresses. For a campus room or studio, confirm the residence's arrival arrangements and when you will have the keys.

> For an Aberdeen flat or furniture collection, include the floor, lift access, carrying distance and the available loading position. A resident parking permit does not reserve a space. If you are moving into university accommodation, confirm your key-collection time and current drop-off arrangements before choosing a delivery slot.

## Competitor observations

| City and page | Observable strengths | Opportunity for Speedy Van |
| --- | --- | --- |
| Inverness — [Inverness Man and Van](https://www.invernessmanandvan.co.uk/) | Clear service choice, prominent phone contact and a form asking for origin, destination, date and building type. Publishes a business address and separates removals from clearance/disposal. | Make the quote inputs and scope equally clear. Explain collection and delivery of belongings without silently including waste disposal. Publish only verified identity details. |
| Inverness — [Inverness Removals: man and van](https://removalsinverness.com/services/man-and-van-inverness) | Explains when a smaller move suits a man-and-van service. Uses furniture purchases and student rooms as concrete examples and links to related help. | Add a concise service-fit section: single item, small/flat move, full household, business move. Explain that inventory, safe handling and access determine vehicle and crew requirements. Do not copy its cheapest-price, vehicle or assembly claims. |
| Aberdeen — [UrbanMove](https://www.urbanmovelogistics.co.uk/) | Distinct house, office, furniture and student service sections; quote CTA; published review content and an Aberdeen job-media section. | Obtain consented, genuine Speedy Van job photographs and concise case studies with real scope and access details. Avoid stock images presented as local jobs or unsupported review claims. |
| Aberdeen — [A to B Removals: Aberdeen](https://www.atob-removals.co.uk/removals-aberdeen.html) | Explains household, furniture and business use cases, publishes direct contact details and discusses longer-distance/part-load work. | Explain which job details a longer journey needs and how the route is assessed. Do not promise scheduled part loads, guaranteed dates or vehicle sizes without operational evidence. |

These are content and usability observations. They do not establish that any feature causes a particular ranking. Competitor licences, addresses, reviews, prices and route claims must not be transferred to Speedy Van.

## Intent map and page responsibilities

Each row applies to both cities. The existing city URL is the local target; the linked service page explains the service in depth.

| Inferred city query cluster | Existing supporting page | Required customer answer |
| --- | --- | --- |
| man and van, man with a van, van and man, van with driver + city | `/services/man-and-van` | What is being moved, help needed, vehicle/crew assessment and booking steps. Clarify the service without implying self-drive hire. |
| furniture collection, furniture delivery, sofa delivery, single-item transport + city | `/services/furniture-delivery` | Item dimensions, seller collection window, dismantling needs, door/stair access and destination. |
| house removals, full-house move + city | `/services/house-removal` | Full inventory, key times, access at both properties and assessment of extra help. |
| flat removals, apartment removals, studio move + city | `/services/flat-removals` | Floor, lift size/availability, shared stairs, carrying distance and loading access. |
| office removals, business removals, commercial relocation + city | `/services/office-removal` | Inventory, building permissions, loading bay/lift bookings and required handover timing. |
| small moves, student moves + city | `/services/small-moves` and `/services/student-move` | Number of boxes/items, furnished-room contents, key collection and accommodation access. |
| long-distance removals, moving to/from city | `/services/long-distance-removals` | Exact origin/destination, route in miles, full load, preferred date and assessment before confirmation. |
| man and van cost, removals quote, moving price + city | Existing pricing page plus the city quote section | Price inputs, included scope, minimum charges where verified, waiting/parking/extra-stop terms. Avoid a new price landing page. |

City-specific FAQs should answer practical questions, not repeat keywords. Useful Inverness questions include how to describe a longer Highland journey, what a campus-room move needs and how to prepare a furniture collection. Useful Aberdeen questions include what to report for a flat with shared stairs, how to plan a student delivery and which office-access details affect a quote. Existing service pages should carry general service explanations.

## Implementation priorities and verification

1. Make each existing city page a stronger hub: distinctive introduction, service-fit explanations, local access guidance, quote checklist and visible FAQs. Retain the current booking and contact paths.
2. Add crawlable links to both city pages from the service-area hub and relevant service pages. Use natural anchor text. A footer link helps discovery but does not replace contextual links.
3. Reuse the existing business entity and accurate `Service`/`BreadcrumbList` data. Set `areaServed` truthfully. Do not create fictitious city offices or addresses, or promise FAQ/review rich results.
4. Keep content in initial HTML, preserve self-canonicals and true invalid-slug 404s, and verify mobile wrapping, link destinations and CTA behaviour.
5. Obtain genuine local operating evidence and approved case-study material. Explore appropriate property, accommodation or local-business relationships only after confirming eligibility and authorisation; no outreach was sent during this research.
6. Measure each city separately in Search Console and consented conversion reporting. Track clicks, impressions and relevant query/page trends alongside qualified enquiries and confirmed bookings. An indexing request is neither inclusion nor a ranking result.

No application code, hosting configuration, DNS, live content or external outreach was changed by this research workstream.
