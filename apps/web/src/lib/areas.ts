export interface Area {
  slug: string;
  name: string;
  region: string;
  postcode: string;
  headline: string;
  description: string;
  highlights: string[];
  nearbyAreas: string[];
  metaDescription: string;
}

export const AREAS: Area[] = [
  // ── Greater Glasgow ──────────────────────────────────────────────────────
  {
    slug: "glasgow",
    name: "Glasgow",
    region: "Greater Glasgow",
    postcode: "G1–G78",
    headline: "Man and Van in Glasgow",
    description:
      "Glasgow's tenement flats, West End townhouses, and Southside communities are well known to our local team. Friendly, efficient, and always on time.",
    highlights: [
      "West End and Southside coverage",
      "Tenement stairwell experience",
      "Competitive flat-rate pricing",
    ],
    nearbyAreas: ["edinburgh", "paisley", "hamilton", "east-kilbride"],
    metaDescription:
      "Reliable man and van hire in Glasgow. Tenement specialists, West End and Southside coverage. Free instant quote.",
  },
  {
    slug: "glasgow-west-end",
    name: "Glasgow West End",
    region: "Greater Glasgow",
    postcode: "G11, G12, G13, G20",
    headline: "Man and Van in Glasgow West End",
    description:
      "From Byres Road tenements to Hyndland villas, Glasgow's West End is one of the city's most sought-after — and challenging — areas to move in. Our team knows every stairwell and parking restriction.",
    highlights: [
      "Byres Road and Great Western Road coverage",
      "Hyndland and Partick specialists",
      "Student move packages for Glasgow University",
    ],
    nearbyAreas: ["glasgow", "glasgow-southside", "partick", "anniesland"],
    metaDescription:
      "Man and van services in Glasgow West End. Tenement and villa specialists covering Byres Road, Hyndland, and Partick.",
  },
  {
    slug: "glasgow-southside",
    name: "Glasgow Southside",
    region: "Greater Glasgow",
    postcode: "G41, G42, G43, G44, G45",
    headline: "Man and Van in Glasgow Southside",
    description:
      "Shawlands, Pollokshields, Mount Florida — the Southside is a mosaic of vibrant communities. Our team handles everything from ground-floor flats to detached sandstone villas.",
    highlights: [
      "Shawlands and Pollokshields coverage",
      "Sandstone villa move specialists",
      "Weekend availability including Sundays",
    ],
    nearbyAreas: ["glasgow", "east-kilbride", "rutherglen", "hamilton"],
    metaDescription:
      "Expert man and van hire in Glasgow Southside. Shawlands, Pollokshields, and Mount Florida specialists.",
  },
  {
    slug: "paisley",
    name: "Paisley",
    region: "Greater Glasgow",
    postcode: "PA1–PA3",
    headline: "Man and Van in Paisley",
    description:
      "Paisley's mix of tenement flats and modern housing estates makes it one of the busiest areas for our Renfrewshire team. Fast, affordable, and locally trusted.",
    highlights: [
      "Town centre and Foxbar coverage",
      "Close links to Glasgow Airport corridor",
      "Affordable local move rates",
    ],
    nearbyAreas: ["glasgow", "glasgow-west-end", "johnstone", "renfrew"],
    metaDescription:
      "Trusted man and van hire in Paisley. Affordable local removals and deliveries across Renfrewshire.",
  },
  // ── Edinburgh & Lothians ──────────────────────────────────────────────────
  {
    slug: "edinburgh",
    name: "Edinburgh",
    region: "Edinburgh & Lothians",
    postcode: "EH1–EH17",
    headline: "Man and Van in Edinburgh",
    description:
      "From New Town Georgian townhouses to Leith waterfront apartments, Edinburgh's historic architecture requires specialist care. Our Edinburgh team brings the experience and the padding.",
    highlights: [
      "New Town and Old Town specialists",
      "Tenement flat expertise — no lift, no problem",
      "Festival season and all-year availability",
    ],
    nearbyAreas: ["edinburgh-leith", "edinburgh-south", "livingston", "glasgow"],
    metaDescription:
      "Trusted man and van services in Edinburgh. Tenement flat specialists, New Town expertise, and same-day availability.",
  },
  {
    slug: "edinburgh-leith",
    name: "Edinburgh Leith",
    region: "Edinburgh & Lothians",
    postcode: "EH6, EH7",
    headline: "Man and Van in Leith, Edinburgh",
    description:
      "Leith's waterfront regeneration has brought a wave of new residents to its converted warehouses and shore-side flats. Our team navigates the Shore and the Links with ease.",
    highlights: [
      "Waterfront and converted warehouse moves",
      "Shore area parking solutions",
      "Close to Ocean Terminal — IKEA deliveries covered",
    ],
    nearbyAreas: ["edinburgh", "edinburgh-south", "musselburgh", "portobello"],
    metaDescription:
      "Man and van hire in Leith, Edinburgh. Waterfront and converted warehouse specialists. Book online today.",
  },
  {
    slug: "edinburgh-south",
    name: "Edinburgh South",
    region: "Edinburgh & Lothians",
    postcode: "EH9, EH10, EH16",
    headline: "Man and Van in South Edinburgh",
    description:
      "Morningside, Marchmont, Bruntsfield — Edinburgh's southern suburbs are home to some of the city's finest flats and family homes. Our team treats every one with care.",
    highlights: [
      "Morningside and Marchmont coverage",
      "Family home and flat removal specialists",
      "Student move season packages",
    ],
    nearbyAreas: ["edinburgh", "edinburgh-leith", "penicuik", "dalkeith"],
    metaDescription:
      "Expert man and van hire in South Edinburgh. Morningside, Marchmont, and Bruntsfield specialists.",
  },
  {
    slug: "livingston",
    name: "Livingston",
    region: "Edinburgh & Lothians",
    postcode: "EH54",
    headline: "Man and Van in Livingston",
    description:
      "Livingston's new town layout, wide roads, and modern housing estates make for straightforward but busy moving work. Our West Lothian team is reliable and on time.",
    highlights: [
      "New town estate coverage",
      "Easy motorway access across Central Scotland",
      "Competitive rates for local moves",
    ],
    nearbyAreas: ["edinburgh", "falkirk", "bathgate", "linlithgow"],
    metaDescription:
      "Reliable man and van hire in Livingston. West Lothian removals and deliveries. Get a free instant quote.",
  },
  // ── Tayside & Fife ───────────────────────────────────────────────────────
  {
    slug: "dundee",
    name: "Dundee",
    region: "Tayside & Fife",
    postcode: "DD1–DD5",
    headline: "Man and Van in Dundee",
    description:
      "Dundee's waterfront revival, student population, and mix of tenement and modern flats keep our Tayside team busy year-round. Reliable service across every postcode.",
    highlights: [
      "Waterfront and city-centre coverage",
      "University of Dundee and Abertay student moves",
      "Same-day and next-day availability",
    ],
    nearbyAreas: ["perth", "kirkcaldy", "st-andrews", "arbroath"],
    metaDescription:
      "Professional man and van hire in Dundee. Waterfront, city centre, and student move specialists.",
  },
  {
    slug: "perth",
    name: "Perth",
    region: "Tayside & Fife",
    postcode: "PH1, PH2",
    headline: "Man and Van in Perth",
    description:
      "The Fair City's mix of Victorian stone villas, modern estates, and riverside apartments makes for varied and rewarding moving work. Our Perth team is experienced and punctual.",
    highlights: [
      "Riverside and town centre coverage",
      "Cross-Scotland removal routes",
      "Flexible same-day slots available",
    ],
    nearbyAreas: ["dundee", "stirling", "st-andrews", "pitlochry"],
    metaDescription:
      "Man and van services in Perth. Local experts covering the Fair City and surrounding Perthshire areas.",
  },
  {
    slug: "kirkcaldy",
    name: "Kirkcaldy",
    region: "Tayside & Fife",
    postcode: "KY1, KY2",
    headline: "Man and Van in Kirkcaldy",
    description:
      "The Lang Toun's mix of seafront properties, modern housing, and tenement flats are all familiar to our Fife team. Competitive prices, professional service.",
    highlights: [
      "Seafront and town centre coverage",
      "Budget-friendly rates",
      "Quick response for local moves",
    ],
    nearbyAreas: ["dunfermline", "dundee", "st-andrews", "glenrothes"],
    metaDescription:
      "Affordable man and van hire in Kirkcaldy. Fife removals and deliveries. Book online today.",
  },
  {
    slug: "dunfermline",
    name: "Dunfermline",
    region: "Tayside & Fife",
    postcode: "KY11, KY12",
    headline: "Man and Van in Dunfermline",
    description:
      "Dunfermline's historic city centre, Carnegie legacy estates, and modern housing developments across West Fife are all within our service area.",
    highlights: [
      "Town centre and new estates covered",
      "Cross-Forth Bridge routes to Edinburgh",
      "Affordable local removal rates",
    ],
    nearbyAreas: ["kirkcaldy", "edinburgh", "livingston", "alloa"],
    metaDescription:
      "Trusted man and van hire in Dunfermline. West Fife removals and delivery across all postcodes.",
  },
  {
    slug: "st-andrews",
    name: "St Andrews",
    region: "Tayside & Fife",
    postcode: "KY16",
    headline: "Man and Van in St Andrews",
    description:
      "St Andrews' student population, golf tourism, and historic stone properties require a careful, professional approach. Our team handles everything from student moves to fine home relocations.",
    highlights: [
      "University of St Andrews student moves",
      "Historic and stone property care",
      "Golf week and Festival bookings welcome",
    ],
    nearbyAreas: ["dundee", "kirkcaldy", "cupar", "anstruther"],
    metaDescription:
      "Man and van hire in St Andrews. Student moves, historic property specialists, and flexible booking.",
  },
  // ── Grampian ─────────────────────────────────────────────────────────────
  {
    slug: "aberdeen",
    name: "Aberdeen",
    region: "Grampian",
    postcode: "AB10–AB25",
    headline: "Man and Van in Aberdeen",
    description:
      "The Granite City's oil and gas industry drives constant residential movement. From Union Street granite tenements to Cults and Bieldside family homes, our Aberdeen team knows the city inside out.",
    highlights: [
      "Oil and gas industry relocation experience",
      "City centre tenement expertise",
      "North Deeside and Westhill coverage",
    ],
    nearbyAreas: ["inverurie", "stonehaven", "elgin", "banchory"],
    metaDescription:
      "Professional man and van hire in Aberdeen. Granite City specialists covering all AB postcodes. Book today.",
  },
  {
    slug: "inverurie",
    name: "Inverurie",
    region: "Grampian",
    postcode: "AB51",
    headline: "Man and Van in Inverurie",
    description:
      "Inverurie and the Garioch area have grown rapidly as Aberdeen commuter belt towns. Our team covers all the new housing developments and surrounding rural properties with efficiency.",
    highlights: [
      "Commuter belt new-build coverage",
      "Aberdeen city runs every day",
      "Rural property access experience",
    ],
    nearbyAreas: ["aberdeen", "huntly", "oldmeldrum", "kintore"],
    metaDescription:
      "Man and van services in Inverurie and Garioch. Aberdeen commuter belt specialists. Get a free quote.",
  },
  // ── Highlands ─────────────────────────────────────────────────────────────
  {
    slug: "inverness",
    name: "Inverness",
    region: "Highlands",
    postcode: "IV1–IV3",
    headline: "Man and Van in Inverness",
    description:
      "As the capital of the Highlands, Inverness is growing fast. From Crown and Merkinch to Culloden and Balloch, our Highland team covers the whole city and surrounding villages.",
    highlights: [
      "Full city coverage and Highland villages",
      "Long-distance Scotland-wide routes",
      "Rural access experience",
    ],
    nearbyAreas: ["fort-william", "aviemore", "nairn", "dingwall"],
    metaDescription:
      "Trusted man and van hire in Inverness. Highland capital specialists, city and rural coverage. Free quote.",
  },
  {
    slug: "fort-william",
    name: "Fort William",
    region: "Highlands",
    postcode: "PH33",
    headline: "Man and Van in Fort William",
    description:
      "The outdoor capital of the UK is a unique place to move. Our team handles everything from town centre flats to remote rural properties across Lochaber and the Great Glen.",
    highlights: [
      "Lochaber and Great Glen coverage",
      "Remote and rural property access",
      "Long-distance Highland routes",
    ],
    nearbyAreas: ["inverness", "oban", "mallaig", "spean-bridge"],
    metaDescription:
      "Man and van hire in Fort William and Lochaber. Rural and remote access specialists across the Highlands.",
  },
  // ── Central Scotland ──────────────────────────────────────────────────────
  {
    slug: "stirling",
    name: "Stirling",
    region: "Central Scotland",
    postcode: "FK7, FK8, FK9",
    headline: "Man and Van in Stirling",
    description:
      "Stirling's historic castle rock, expanding suburbs, and student population make it a vibrant moving hub at the heart of Scotland. Our Central Scotland team is ideally placed to serve you.",
    highlights: [
      "City centre and castle area expertise",
      "University of Stirling student moves",
      "Central Scotland hub — routes north and south",
    ],
    nearbyAreas: ["falkirk", "alloa", "perth", "glasgow"],
    metaDescription:
      "Reliable man and van hire in Stirling. Central Scotland specialists, student moves, and house removals.",
  },
  {
    slug: "falkirk",
    name: "Falkirk",
    region: "Central Scotland",
    postcode: "FK1, FK2",
    headline: "Man and Van in Falkirk",
    description:
      "Falkirk's Kelpies, Helix Park, and growing residential areas sit at the M9/M80 interchange — perfect for fast moves across Central Scotland. Competitive pricing, reliable team.",
    highlights: [
      "M9/M80 corridor — fast Central Scotland routes",
      "Grangemouth and Bo'ness coverage",
      "Budget-friendly local moves",
    ],
    nearbyAreas: ["stirling", "livingston", "alloa", "glasgow"],
    metaDescription:
      "Affordable man and van hire in Falkirk. Central Scotland removals covering FK postcodes. Book today.",
  },
  {
    slug: "hamilton",
    name: "Hamilton",
    region: "Central Scotland",
    postcode: "ML3",
    headline: "Man and Van in Hamilton",
    description:
      "Hamilton and Lanarkshire are home to our head office. We know every street in Hamilton, Blantyre, and Larkhall — and we deliver the fastest response times in the area.",
    highlights: [
      "Head office in Hamilton — fastest response",
      "Full Lanarkshire coverage",
      "Same-day moves available",
    ],
    nearbyAreas: ["glasgow", "east-kilbride", "motherwell", "strathaven"],
    metaDescription:
      "Man and van hire in Hamilton, Lanarkshire. Local experts with same-day availability. Get a free quote.",
  },
  {
    slug: "east-kilbride",
    name: "East Kilbride",
    region: "Central Scotland",
    postcode: "G74, G75",
    headline: "Man and Van in East Kilbride",
    description:
      "Scotland's first post-war new town has evolved into one of the country's largest towns. Our team navigates EK's road network with ease, covering every village and estate.",
    highlights: [
      "Full East Kilbride coverage",
      "Fast links to Glasgow Southside",
      "New town estate expertise",
    ],
    nearbyAreas: ["glasgow", "hamilton", "glasgow-southside", "strathaven"],
    metaDescription:
      "Trusted man and van hire in East Kilbride. Full EK coverage and fast Glasgow links. Book online today.",
  },
  {
    slug: "motherwell",
    name: "Motherwell",
    region: "Central Scotland",
    postcode: "ML1",
    headline: "Man and Van in Motherwell",
    description:
      "Motherwell and Wishaw are at the heart of North Lanarkshire. Our team covers both towns and surrounding communities with competitive pricing and a friendly approach.",
    highlights: [
      "Motherwell and Wishaw coverage",
      "North Lanarkshire wide service",
      "Affordable rates for local moves",
    ],
    nearbyAreas: ["hamilton", "glasgow", "east-kilbride", "airdrie"],
    metaDescription:
      "Affordable man and van hire in Motherwell. North Lanarkshire removals across all ML postcodes.",
  },
  // ── West Scotland ─────────────────────────────────────────────────────────
  {
    slug: "ayr",
    name: "Ayr",
    region: "West Scotland",
    postcode: "KA7, KA8",
    headline: "Man and Van in Ayr",
    description:
      "Ayr and the Burns Country are well served by our Ayrshire team. From the town centre seafront flats to Alloway's private estates, we handle every move with care.",
    highlights: [
      "Ayr town centre and seafront coverage",
      "Alloway and Prestwick service",
      "Kilmarnock and wider Ayrshire routes",
    ],
    nearbyAreas: ["kilmarnock", "troon", "prestwick", "glasgow"],
    metaDescription:
      "Man and van hire in Ayr and Ayrshire. Seafront, Alloway, and Prestwick specialists. Book your move today.",
  },
  {
    slug: "kilmarnock",
    name: "Kilmarnock",
    region: "West Scotland",
    postcode: "KA1, KA3",
    headline: "Man and Van in Kilmarnock",
    description:
      "Kilmarnock's town centre, Onthank, and the surrounding East Ayrshire villages are all within our service area. Punctual, professional, and great value.",
    highlights: [
      "Town centre and East Ayrshire coverage",
      "Budget-friendly removals",
      "Fast turnaround for local jobs",
    ],
    nearbyAreas: ["ayr", "glasgow", "irvine", "cumnock"],
    metaDescription:
      "Trusted man and van hire in Kilmarnock. East Ayrshire removals and deliveries. Free instant quote.",
  },
  {
    slug: "oban",
    name: "Oban",
    region: "West Scotland",
    postcode: "PA34",
    headline: "Man and Van in Oban",
    description:
      "The Gateway to the Isles requires a team comfortable with scenic but challenging routes. We cover Oban, Argyll, and can arrange ferry-side deliveries for island moves.",
    highlights: [
      "Oban and Argyll coverage",
      "Island and ferry connection experience",
      "Long-distance Highland and island routes",
    ],
    nearbyAreas: ["fort-william", "inveraray", "lochgilphead", "campbeltown"],
    metaDescription:
      "Man and van hire in Oban and Argyll. Island move experience, Highland routes, and ferry-side delivery.",
  },
  // ── Borders & South West ──────────────────────────────────────────────────
  {
    slug: "dumfries",
    name: "Dumfries",
    region: "Borders & South West",
    postcode: "DG1, DG2",
    headline: "Man and Van in Dumfries",
    description:
      "Queen of the South's mix of market town properties, rural estates, and riverside homes make Dumfries a rewarding area to work. Our team covers all of Dumfries and Galloway.",
    highlights: [
      "Dumfries and Galloway wide coverage",
      "Rural and estate property access",
      "Cross-border routes to England available",
    ],
    nearbyAreas: ["carlisle", "ayr", "kilmarnock", "stranraer"],
    metaDescription:
      "Man and van hire in Dumfries and Galloway. Rural specialists, cross-border routes, and local removals.",
  },
  {
    slug: "galashiels",
    name: "Galashiels",
    region: "Borders & South West",
    postcode: "TD1",
    headline: "Man and Van in Galashiels",
    description:
      "The Scottish Borders' largest town and the hub of the Borders Railway corridor. Our team serves Galashiels, Hawick, Jedburgh, and the surrounding towns with the same reliable service.",
    highlights: [
      "Full Scottish Borders coverage",
      "Borders Railway corridor — Edinburgh runs",
      "Rural and market town expertise",
    ],
    nearbyAreas: ["edinburgh", "hawick", "jedburgh", "peebles"],
    metaDescription:
      "Trusted man and van hire in Galashiels and the Scottish Borders. Edinburgh and rural routes covered.",
  },
];

export function getAreaBySlug(slug: string): Area | undefined {
  return AREAS.find((a) => a.slug === slug);
}
