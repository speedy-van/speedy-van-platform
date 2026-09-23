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
  moveAdvice?: {
    title: string;
    body: string;
    source?: { label: string; href: string };
  }[];
  faqs?: { question: string; answer: string }[];
}

export const AREAS: Area[] = [
  // Greater Glasgow
  {
    slug: "glasgow",
    name: "Glasgow",
    region: "Greater Glasgow",
    postcode: "G1–G78",
    headline: "Man and Van in Glasgow",
    description:
      "Arrange a man and van, flat removal or furniture delivery in Glasgow with a quote based on your items and both addresses. For a tenement move in the West End or Southside, tell us about the close, floor, stair turns and where a van can load. Larger house and office moves need the complete inventory and access details before the plan is confirmed.",
    highlights: [
      "Tenement and shared-stair access planning",
      "Furniture collections and smaller moves",
      "Home and office removal enquiries"
    ],
    nearbyAreas: ["glasgow-west-end", "glasgow-southside", "paisley", "hamilton"],
    metaDescription:
      "Man and van in Glasgow for flat moves, furniture collection and home removals. Share your items, stairs, parking and both addresses for a tailored quote.",
    moveAdvice: [
      {
        title: "Tenement stairs and close entrances",
        body: "For a West End or Southside flat, include the floor, number of stair flights and the tightest turn between the room and the street. Send photos of large furniture beside doorways or landings if access is uncertain. A two-person lift and a one-person load need different plans."
      },
      {
        title: "Parking near the collection address",
        body: "Check the signs and loading restrictions at each property before choosing a time. If a bay needs to be reserved or a restriction affects the move, discuss the arrangements with the relevant council or building manager in advance. Do not assume a resident permit provides permission for a removal van."
      },
      {
        title: "Cross-city and onward moves",
        body: "Give the delivery address as well as the collection postcode. A local furniture run, a move between the West End and Southside, and a Glasgow-to-Edinburgh journey require different route and timing plans. Include key handovers and additional stops in the quote."
      },
      {
        title: "Student rooms and shared homes",
        body: "Separate the belongings being moved from your housemates' items. Halls or managed flats may have designated entrances, lift reservations or time slots. Confirm those arrangements and label the boxes before collection."
      }
    ],
    faqs: [
      {
        question: "Can you quote a Glasgow tenement move without a lift?",
        answer: "Yes. Include the floor at both addresses, photos of tight turns and the largest item dimensions. The crew and handling must be suitable for the stairs; no item should be assumed to fit without checking."
      },
      {
        question: "Is a short Glasgow move always a small job?",
        answer: "No. A short drive can still involve a full furniture load, several flights of stairs or a long carry from the loading space. The quote takes those details into account alongside the route."
      },
      {
        question: "Can you collect furniture from a Glasgow seller?",
        answer: "Furniture collection can be quoted using the seller's address, item dimensions, destination and agreed collection window. Confirm the item is paid for and ready to release, and check it fits the delivery access."
      },
      {
        question: "Do you offer moves from Glasgow to Edinburgh?",
        answer: "You can request a quote for a Scottish intercity move. Include the complete inventory and access at both properties; the collection date, route and delivery arrangements need confirmation before booking."
      }
    ]
  },
  {
    slug: "glasgow-west-end",
    name: "Glasgow West End",
    region: "Greater Glasgow",
    postcode: "G11, G12, G13, G20",
    headline: "Man and Van in Glasgow West End",
    description:
      "Moving furniture through a West End tenement needs a clear route from the room to the van. For collections around Byres Road, Hyndland or Partick, include stair turns, entry arrangements and loading access. Student rooms and larger homes can need different vehicles and crew, even on the same street.",
    highlights: [
      "Tenement furniture and flat moves",
      "Student rooms and shared homes",
      "Stairs and loading details included in the quote"
    ],
    nearbyAreas: ["glasgow", "glasgow-southside", "partick", "anniesland"],
    metaDescription: "Man and van in Glasgow West End for furniture, student rooms and flat moves. Plan stair access, parking and collections around your item list."
  },
  {
    slug: "glasgow-southside",
    name: "Glasgow Southside",
    region: "Greater Glasgow",
    postcode: "G41, G42, G43, G44, G45",
    headline: "Man and Van in Glasgow Southside",
    description:
      "Request a quote for furniture, flat or house moves in Glasgow Southside, around Shawlands, Pollokshields and Mount Florida. Provide the full addresses and item list, and describe shared stairs, garden paths or any long carry between the door and a loading space.",
    highlights: [
      "Flat and house removal enquiries",
      "Furniture collection and delivery",
      "Crew planned around items and access"
    ],
    nearbyAreas: ["glasgow", "east-kilbride", "rutherglen", "hamilton"],
    metaDescription: "Man and van and removals in Glasgow Southside. Request a quote for flat moves, furniture collections and house moves using your addresses and inventory."
  },
  {
    slug: "paisley",
    name: "Paisley",
    region: "Greater Glasgow",
    postcode: "PA1–PA3",
    headline: "Man and Van in Paisley",
    description:
      "Plan a Paisley move around the furniture, boxes and access at each property. A tenement flat, a house and a storage collection can have different loading needs. For a local journey or a route towards Glasgow, include every stop and the time access will be available.",
    highlights: [
      "Local and Glasgow-linked route enquiries",
      "Flats, homes and storage collections",
      "Loading and parking details reviewed"
    ],
    nearbyAreas: ["glasgow", "glasgow-west-end", "johnstone", "renfrew"],
    metaDescription: "Man and van in Paisley for flat moves, furniture delivery and home removals. Include both addresses, access and your item list when requesting a quote."
  },
  // Edinburgh & Lothians
  {
    slug: "edinburgh",
    name: "Edinburgh",
    region: "Edinburgh & Lothians",
    postcode: "EH1–EH17",
    headline: "Man and Van in Edinburgh",
    description:
      "Plan an Edinburgh move with the stairs, parking and building access included from the start. A New Town flat, an Old Town address or a Leith apartment can need a different loading plan even with the same furniture. Request man and van, house removals or furniture delivery using both addresses, your inventory and the dates that work for you.",
    highlights: [
      "Flat, studio and tenement move planning",
      "Furniture collections and home removals",
      "Parking and building access considered"
    ],
    nearbyAreas: ["edinburgh-leith", "edinburgh-south", "livingston", "glasgow"],
    metaDescription:
      "Man and van and removals in Edinburgh for flats, houses and furniture. Plan stairs, lifts and parking, then request a quote for your items and route.",
    moveAdvice: [
      {
        title: "Shared stairs, basements and large furniture",
        body: "For an Old Town or New Town property, describe the route from each room to the street. Basement steps, half-landings and narrow entrance doors can affect a sofa or wardrobe even when the van has enough space. Include floor numbers and useful access photos."
      },
      {
        title: "Parking for a removal van",
        body: "Edinburgh Council distinguishes between parking dispensations and suspended parking bays. A dispensation may be needed for longer loading on a single yellow line, while reserving a bay uses a different application. Check the council's current conditions, notice periods and charges before agreeing the move time.",
        source: {
          label: "Edinburgh Council parking dispensations and suspensions",
          href: "https://www.edinburgh.gov.uk/parking-spaces/dispensations-suspensions"
        }
      },
      {
        title: "Leith apartments and managed buildings",
        body: "If a building has a concierge, service lift or loading entrance, check the moving arrangements in advance. Tell us the lift dimensions, any booking window and whether the van must use a different entrance from residents."
      },
      {
        title: "Dates, keys and collection windows",
        body: "Give your key handover time and any restrictions from the landlord, halls or storage facility. During busy city events or student move periods, check access and the available date before making dependent arrangements."
      }
    ],
    faqs: [
      {
        question: "Can you move an Edinburgh flat with stairs?",
        answer: "Stair access can be included in the assessment. Give the floor, number of flights, narrow turns and largest items at both properties so the crew and handling requirements are understood before confirmation."
      },
      {
        question: "Who arranges parking for an Edinburgh removal?",
        answer: "Discuss parking with the team before booking and agree who will make any required application. A parking space or council permission is not automatically included in a removal quote."
      },
      {
        question: "Can I book a small Edinburgh student move?",
        answer: "Request a quote for your boxes, suitcases and any furniture. Include the halls or flat address, collection window, floor and destination. Different room sizes and access arrangements can require different quotes."
      },
      {
        question: "Can you quote a house removal as well as man and van?",
        answer: "Yes. Provide the furniture and boxes from every room, plus garage or storage items, and describe the access at both addresses. Larger loads, packing or dismantling should be included in the enquiry from the start."
      }
    ]
  },
  {
    slug: "edinburgh-leith",
    name: "Edinburgh Leith",
    region: "Edinburgh & Lothians",
    postcode: "EH6, EH7",
    headline: "Man and Van in Leith, Edinburgh",
    description:
      "For a move in Leith, check whether the collection uses a shared stair, a lift or a managed loading entrance. Tell us about the building rules and the size of the largest furniture before requesting a man and van or removal quote. Include any retailer or private-seller collection as a separate stop.",
    highlights: [
      "Flats and shared-stair access",
      "Furniture and private-seller collections",
      "Loading entrances and lift limits checked"
    ],
    nearbyAreas: ["edinburgh", "edinburgh-south", "musselburgh", "portobello"],
    metaDescription: "Man and van in Leith, Edinburgh, for flat moves and furniture collections. Request a quote with your item list, lift or stair details and both addresses."
  },
  {
    slug: "edinburgh-south",
    name: "Edinburgh South",
    region: "Edinburgh & Lothians",
    postcode: "EH9, EH10, EH16",
    headline: "Man and Van in South Edinburgh",
    description:
      "Moving from a room, flat or family home in South Edinburgh starts with a complete item list. For addresses around Morningside, Marchmont or Bruntsfield, describe the stairs, entry system and loading point. If housemates have different destinations, list each stop before asking for a quote.",
    highlights: [
      "Shared flats and student rooms",
      "Furniture and family-home moves",
      "Collection and destination access planning"
    ],
    nearbyAreas: ["edinburgh", "edinburgh-leith", "penicuik", "dalkeith"],
    metaDescription: "Man and van in South Edinburgh for student rooms, flats and home moves. Share your furniture, boxes, stairs and destination for a tailored quote."
  },
  {
    slug: "livingston",
    name: "Livingston",
    region: "Edinburgh & Lothians",
    postcode: "EH54",
    headline: "Man and Van in Livingston",
    description:
      "For Livingston collections and deliveries, give the actual loading entrance as well as the postal address. Estate roads, parking courts and paths can affect the distance from the van to the door. Include your full furniture list when requesting a local move or a route elsewhere in Scotland.",
    highlights: [
      "Home and furniture moving enquiries",
      "Parking courts and access routes considered",
      "Local and intercity quotes"
    ],
    nearbyAreas: ["edinburgh", "falkirk", "bathgate", "linlithgow"],
    metaDescription: "Man and van in Livingston for home moves and furniture delivery. Request a quote based on the items, route, parking and access at both properties."
  },
  // Tayside & Fife
  {
    slug: "dundee",
    name: "Dundee",
    region: "Tayside & Fife",
    postcode: "DD1–DD5",
    headline: "Man and Van in Dundee",
    description:
      "Request a Dundee moving quote for a student room, flat, furniture collection or larger home. Include the floor and lift access at both addresses, together with any halls check-in slot or storage opening time. The inventory and access determine the van and crew required.",
    highlights: [
      "Student and shared-flat moves",
      "Furniture and home removal enquiries",
      "Halls and storage access times considered"
    ],
    nearbyAreas: ["perth", "kirkcaldy", "st-andrews", "arbroath"],
    metaDescription: "Man and van in Dundee for student rooms, flat moves and furniture delivery. Share your inventory, dates and access details to check your options."
  },
  {
    slug: "perth",
    name: "Perth",
    region: "Tayside & Fife",
    postcode: "PH1, PH2",
    headline: "Man and Van in Perth",
    description:
      "For a Perth move, list the furniture and boxes and explain how the van can reach each property. A town-centre flat and a property outside town may need different loading arrangements. Include any narrow approach, stairs or long carry so the route can be assessed before booking.",
    highlights: [
      "Furniture and household moves",
      "Town and surrounding-route enquiries",
      "Vehicle access reviewed before confirmation"
    ],
    nearbyAreas: ["dundee", "stirling", "st-andrews", "pitlochry"],
    metaDescription: "Man and van in Perth for furniture collections, flat moves and home removals. Get a quote using your item list, route and loading access."
  },
  {
    slug: "kirkcaldy",
    name: "Kirkcaldy",
    region: "Tayside & Fife",
    postcode: "KY1, KY2",
    headline: "Man and Van in Kirkcaldy",
    description:
      "Arrange a quote for a Kirkcaldy collection or move using both addresses and the items you need transported. For flats, include the floor and shared-stair access; for houses, include paths and the nearest legal loading space. Storage and private-seller collections need agreed handover times.",
    highlights: [
      "Flat and house moving enquiries",
      "Storage and furniture collections",
      "Access and handover times considered"
    ],
    nearbyAreas: ["dunfermline", "dundee", "st-andrews", "glenrothes"],
    metaDescription: "Man and van in Kirkcaldy for furniture, flat and house moves. Request a quote with your inventory, collection and delivery details."
  },
  {
    slug: "dunfermline",
    name: "Dunfermline",
    region: "Tayside & Fife",
    postcode: "KY11, KY12",
    headline: "Man and Van in Dunfermline",
    description:
      "Plan a Dunfermline removal around the full inventory and access at each address. If the destination is across the Forth or elsewhere in Scotland, include the delivery time and any extra stop in the enquiry. Furniture size, stairs and loading distance help determine the handling required.",
    highlights: [
      "Local and longer-route enquiries",
      "Furniture and household moves",
      "Collection and delivery planned together"
    ],
    nearbyAreas: ["kirkcaldy", "edinburgh", "livingston", "alloa"],
    metaDescription: "Man and van in Dunfermline for furniture delivery and household moves. Share your route, item list and access requirements for a quote."
  },
  {
    slug: "st-andrews",
    name: "St Andrews",
    region: "Tayside & Fife",
    postcode: "KY16",
    headline: "Man and Van in St Andrews",
    description:
      "For a St Andrews student or household move, include all boxes and furniture and check when both properties can be accessed. Halls, shared flats and storage facilities may have collection windows or loading rules. Put those details in the enquiry so the move can be planned around them.",
    highlights: [
      "Student rooms and shared flats",
      "Furniture and household collections",
      "Check-in and collection times considered"
    ],
    nearbyAreas: ["dundee", "kirkcaldy", "cupar", "anstruther"],
    metaDescription: "Man and van in St Andrews for student rooms, shared flats and furniture moves. Request a quote based on your items, dates and access."
  },
  // Grampian
  {
    slug: "aberdeen",
    name: "Aberdeen",
    region: "Grampian",
    postcode: "AB10–AB25",
    headline: "Man and Van & Removals in Aberdeen",
    description:
      "Moving a flat, a family home or furniture in Aberdeen? Request a quote with your collection and delivery addresses, item list and preferred date. Include shared stairs, lift access and any loading restrictions so the vehicle, crew and time allowance can be assessed before you book.",
    highlights: [
      "House, flat and student moves",
      "Furniture collection and delivery",
      "Access and route checked before booking",
    ],
    nearbyAreas: ["inverurie", "stonehaven", "elgin", "banchory"],
    metaDescription:
      "Request an Aberdeen man and van or removals quote for flats, houses, furniture and office moves. Share your load, route and access details before booking.",
  },
  {
    slug: "inverurie",
    name: "Inverurie",
    region: "Grampian",
    postcode: "AB51",
    headline: "Man and Van in Inverurie",
    description:
      "For an Inverurie collection or removal, tell us about the approach to the property, parking and any turning space. A route towards Aberdeen or another town needs the complete item list and delivery details. Rural access and extra stops should be discussed before a booking is confirmed.",
    highlights: [
      "Furniture and household moving enquiries",
      "Aberdeen-linked routes by quote",
      "Property approach and turning space reviewed"
    ],
    nearbyAreas: ["aberdeen", "huntly", "oldmeldrum", "kintore"],
    metaDescription: "Man and van enquiries in Inverurie for furniture and home moves. Share both addresses, the load and vehicle access details for a route-based quote."
  },
  // Highlands
  {
    slug: "inverness",
    name: "Inverness",
    region: "Highlands",
    postcode: "IV1–IV3",
    headline: "Man and Van & Removals in Inverness",
    description:
      "Plan an Inverness move around your load, both properties and the full journey. Request a quote for a small move, furniture delivery or a home removal, with details of stairs, carrying distance and van access. Longer Highland routes and your preferred date need confirmation before booking.",
    highlights: [
      "Home, flat and furniture moves",
      "Longer Highland routes assessed individually",
      "Vehicle access and delivery timing checked",
    ],
    nearbyAreas: ["fort-william", "aviemore", "nairn", "dingwall"],
    metaDescription:
      "Request an Inverness man and van or removals quote for homes, flats and furniture. Check access, crew needs and longer Highland routes before booking.",
  },
  {
    slug: "fort-william",
    name: "Fort William",
    region: "Highlands",
    postcode: "PH33",
    headline: "Man and Van in Fort William",
    description:
      "For Fort William and surrounding-route enquiries, provide both full addresses and describe access from the road to each door. Narrow approaches, turning space and loading distance can affect the vehicle and crew needed. Longer or remote journeys need route confirmation before booking.",
    highlights: [
      "Furniture and home moving enquiries",
      "Longer journeys assessed before booking",
      "Approach roads and loading space considered"
    ],
    nearbyAreas: ["inverness", "oban", "mallaig", "spean-bridge"],
    metaDescription: "Man and van enquiries in Fort William for furniture and home moves. Share your route, inventory and vehicle access to check suitability and availability."
  },
  // Central Scotland
  {
    slug: "stirling",
    name: "Stirling",
    region: "Central Scotland",
    postcode: "FK7, FK8, FK9",
    headline: "Man and Van in Stirling",
    description:
      "Request a Stirling quote for a student room, flat, furniture collection or household move. Include floors, lift availability and the nearest loading point, together with any key handover or halls access window. For a route outside the city, add the full destination address.",
    highlights: [
      "Student rooms and flat moves",
      "Household and furniture enquiries",
      "Local and intercity route planning"
    ],
    nearbyAreas: ["falkirk", "alloa", "perth", "glasgow"],
    metaDescription: "Man and van in Stirling for student moves, furniture and home removals. Request a quote using both addresses, your inventory and access requirements."
  },
  {
    slug: "falkirk",
    name: "Falkirk",
    region: "Central Scotland",
    postcode: "FK1, FK2",
    headline: "Man and Van in Falkirk",
    description:
      "For a Falkirk removal or furniture collection, share the complete item list and both addresses. A short journey can still need extra loading time if stairs, parking or a long path are involved. Include those details and any onward stop when asking for your quote.",
    highlights: [
      "Furniture collections and small moves",
      "House and flat removal enquiries",
      "Route and loading details reviewed"
    ],
    nearbyAreas: ["stirling", "livingston", "alloa", "glasgow"],
    metaDescription: "Man and van in Falkirk for furniture collections, flat moves and home removals. Check your options using the full route, inventory and access details."
  },
  {
    slug: "hamilton",
    name: "Hamilton",
    region: "Central Scotland",
    postcode: "ML3",
    headline: "Man and Van in Hamilton",
    description:
      "Arrange a quote for a Hamilton furniture collection, flat move or house removal. List everything being moved and explain the loading access, stairs and parking at both addresses. For a route elsewhere in Lanarkshire or beyond, provide the full destination and your preferred date.",
    highlights: [
      "Hamilton and Lanarkshire route enquiries",
      "Furniture, flats and home moves",
      "Inventory and access-based quotes"
    ],
    nearbyAreas: ["glasgow", "east-kilbride", "motherwell", "strathaven"],
    metaDescription: "Man and van in Hamilton for furniture delivery, flat moves and house removals. Request a quote with your addresses, dates and item list."
  },
  {
    slug: "east-kilbride",
    name: "East Kilbride",
    region: "Central Scotland",
    postcode: "G74, G75",
    headline: "Man and Van in East Kilbride",
    description:
      "For an East Kilbride move, give the entrance and nearest loading point as well as the address. Parking courts, paths, steps and building lifts can change the carrying distance. Include all furniture and boxes so the van and crew can be assessed for your route.",
    highlights: [
      "Flat and home moving enquiries",
      "Furniture collection and delivery",
      "Parking courts and carrying distances considered"
    ],
    nearbyAreas: ["glasgow", "hamilton", "glasgow-southside", "strathaven"],
    metaDescription: "Man and van in East Kilbride for furniture, flat and household moves. Request a quote based on your inventory, route and loading access."
  },
  {
    slug: "motherwell",
    name: "Motherwell",
    region: "Central Scotland",
    postcode: "ML1",
    headline: "Man and Van in Motherwell",
    description:
      "Request a Motherwell moving quote with the full collection and delivery addresses, furniture list and box estimate. Include steps, shared stairs, lifts and any restrictions on parking. If the move also involves storage or another collection, add it before the route is quoted.",
    highlights: [
      "Furniture and household moving enquiries",
      "Flat moves and storage transfers",
      "Extra stops included in route planning"
    ],
    nearbyAreas: ["hamilton", "glasgow", "east-kilbride", "airdrie"],
    metaDescription: "Man and van in Motherwell for furniture collections and home moves. Share your item list, addresses and access details for a tailored quote."
  },
  // West Scotland
  {
    slug: "ayr",
    name: "Ayr",
    region: "West Scotland",
    postcode: "KA7, KA8",
    headline: "Man and Van in Ayr",
    description:
      "For an Ayr furniture collection or home move, describe the rooms, items and access at both properties. Include stairs and the distance to a suitable loading point. If the journey involves another Ayrshire town or a longer Scottish route, provide every address before confirmation.",
    highlights: [
      "Furniture and household removal enquiries",
      "Ayrshire-linked routes by quote",
      "Stairs and loading access considered"
    ],
    nearbyAreas: ["kilmarnock", "troon", "prestwick", "glasgow"],
    metaDescription: "Man and van in Ayr for furniture delivery and household moves. Request a quote with your items, both addresses and access requirements."
  },
  {
    slug: "kilmarnock",
    name: "Kilmarnock",
    region: "West Scotland",
    postcode: "KA1, KA3",
    headline: "Man and Van in Kilmarnock",
    description:
      "Plan a Kilmarnock move using the actual furniture, boxes and route you need. Tell us about shared stairs, tight doorways and where the van can load at each address. For collections from a seller or storage unit, confirm when the goods will be ready for release.",
    highlights: [
      "Small moves and household enquiries",
      "Furniture and storage collections",
      "Collection times and access reviewed"
    ],
    nearbyAreas: ["ayr", "glasgow", "irvine", "cumnock"],
    metaDescription: "Man and van in Kilmarnock for small moves, furniture and household removals. Share the item list, route and access details to request a quote."
  },
  {
    slug: "oban",
    name: "Oban",
    region: "West Scotland",
    postcode: "PA34",
    headline: "Man and Van in Oban",
    description:
      "For an Oban removal enquiry, provide the exact collection and delivery addresses, inventory and vehicle access details. Confirm longer journeys with the team before booking. If a route involves an island or ferry, mention it at the enquiry stage so suitability and availability can be checked separately.",
    highlights: [
      "Furniture and household move enquiries",
      "Longer routes assessed before confirmation",
      "Ferry-dependent enquiries reviewed separately"
    ],
    nearbyAreas: ["fort-william", "inveraray", "lochgilphead", "campbeltown"],
    metaDescription: "Man and van enquiries in Oban for furniture and household moves. Confirm your route, access and any ferry requirement before booking."
  },
  // Borders & South West
  {
    slug: "dumfries",
    name: "Dumfries",
    region: "Borders & South West",
    postcode: "DG1, DG2",
    headline: "Man and Van in Dumfries",
    description:
      "For a Dumfries move, describe both property access routes along with the load. Include narrow approaches, turning space, steps and any long carry from the van. Routes outside Scotland need separate confirmation; provide both full postcodes when making the enquiry.",
    highlights: [
      "Household and furniture moving enquiries",
      "Rural access details considered",
      "Longer routes confirmed before booking"
    ],
    nearbyAreas: ["carlisle", "ayr", "kilmarnock", "stranraer"],
    metaDescription: "Man and van enquiries in Dumfries for furniture and home moves. Request a quote using the full route, inventory and property access details."
  },
  {
    slug: "galashiels",
    name: "Galashiels",
    region: "Borders & South West",
    postcode: "TD1",
    headline: "Man and Van in Galashiels",
    description:
      "Request a Galashiels moving quote with the full item list, addresses and preferred date. Explain shared stairs, parking, access from the road and any extra stop. For a journey towards Edinburgh or another Borders town, include destination access and handover arrangements.",
    highlights: [
      "Furniture, flat and household enquiries",
      "Borders and Edinburgh-linked routes by quote",
      "Destination access and timings considered"
    ],
    nearbyAreas: ["edinburgh", "hawick", "jedburgh", "peebles"],
    metaDescription: "Man and van in Galashiels for furniture and household moves. Share your route, load and access details to check options for your preferred date."
  }
];

export function getAreaBySlug(slug: string): Area | undefined {
  return AREAS.find((area) => area.slug === slug);
}

export const FEATURED_AREAS = AREAS.filter(
  (area, index) => index < 10 || ["aberdeen", "inverness"].includes(area.slug)
);
