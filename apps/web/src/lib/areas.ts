import { EXPANSION_TOWNS_1 } from "@/lib/content/scotland-towns-1";
import { EXPANSION_TOWNS_2 } from "@/lib/content/scotland-towns-2";
import { EXPANSION_TOWNS_3 } from "@/lib/content/scotland-towns-3";
import { EXPANSION_TOWNS_4 } from "@/lib/content/scotland-towns-4";

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
  schemaType?: "City" | "Place" | "AdministrativeArea";
  moveAdvice?: {
    title: string;
    body: string;
    source?: { label: string; href: string };
  }[];
  faqs?: { question: string; answer: string }[];
}

const EXISTING_AREAS: Area[] = [
  // Greater Glasgow
  {
    slug: "glasgow",
    schemaType: "City",
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
    metaDescription: "Man and van in Glasgow West End for furniture, student rooms and flat moves. Plan stair access, parking and collections around your item list.",
    moveAdvice: [
      {
        "title": "A loading point for a West End close",
        "body": "For a collection around Byres Road, Hyndland or Partick, identify the close entrance and a lawful loading position separately. A space across a junction can mean a different carrying route from one outside the door. Check current street signs and discuss any parking arrangements before confirming the move; leave bus stops, cycle routes and pedestrian access clear.",
        "source": {
          "label": "Glasgow City Council parking services report",
          "href": "https://onlineservices.glasgow.gov.uk/CouncillorsandCommittees/viewSelectedDocument.asp?c=P62AFQDNNT0GT10GNT"
        }
      },
      {
        "title": "Measure the turn as well as the doorway",
        "body": "A West End sofa collection needs the route through the flat, communal stair and close checked before the item is carried out. Measure the tightest landing and any half-landing, not just the front door. Tell us whether feet or sections can be removed, and include photos where the turning space is difficult to describe. Dismantling must be agreed in the quote."
      },
      {
        "title": "Student belongings leaving a shared flat",
        "body": "For a student move from the West End, mark the furniture and boxes that belong to you and include any storage stop. If you are returning to a home in England or Wales, give that full address with its access and receiving arrangements. Agree collection around your tenancy handover; the long-distance delivery window is confirmed with the complete load."
      }
    ],
    faqs: [
      {
        "question": "What do you need to quote a West End tenement sofa move?",
        "answer": "Send the sofa dimensions, both addresses, floor numbers and pictures of any narrow stair turn. Mention removable feet or separate sections. We need to assess the whole carrying route and lifting help; an item fitting through the flat door does not establish that it will clear the communal stair."
      },
      {
        "question": "Can my West End student move include a storage collection?",
        "answer": "Yes. Add the storage address, unit access arrangements and opening window to the enquiry. List which items are already stored and which leave the flat so the vehicle can be planned around the combined load and the stops can be quoted together."
      },
      {
        "question": "Can I move from Glasgow West End to England or Wales?",
        "answer": "Yes, moves originating in Scotland can go to destinations across Britain. Provide the complete delivery postcode, inventory and date, including stairs or booking requirements at the destination. The vehicle, collection slot and delivery arrangements are agreed for your particular move."
      }
    ]
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
    metaDescription: "Man and van and removals in Glasgow Southside. Request a quote for flat moves, furniture collections and house moves using your addresses and inventory.",
    moveAdvice: [
      {
        "title": "Approaching a Southside loading entrance",
        "body": "For a Shawlands, Pollokshields or Mount Florida collection, send the entrance location rather than relying on the nearest main-road landmark. The council's parking report identifies bus-lane enforcement on Pollokshaws Road; the loading plan should follow current signs and a permitted approach. Tell us if the entrance is reached from another street, and check any private lane access with the property manager.",
        "source": {
          "label": "Glasgow City Council parking and bus-lane information",
          "href": "https://onlineservices.glasgow.gov.uk/CouncillorsandCommittees/viewSelectedDocument.asp?c=P62AFQDNNT0GT10GNT"
        }
      },
      {
        "title": "From a shared close or garden path to the van",
        "body": "Describe the Southside property's full exit route: a flat may involve a communal stair, while a house may involve garden steps or a narrow gate. For a bulky wardrobe or dining table, give the narrowest clearance and any change in level. Keep shared doors and paths accessible, and agree who will provide entry while the crew is carrying items."
      },
      {
        "title": "A household move with more than one collection",
        "body": "If your Southside move combines belongings from a second household or storage, label each group in the inventory and give every stop before requesting a price. For a delivery elsewhere in Scotland, England or Wales, include when the new property becomes accessible. The collection order and load plan need to work with both the contents and the key handovers."
      }
    ],
    faqs: [
      {
        "question": "Can you quote a Southside move with garden steps or a long path?",
        "answer": "Yes. Describe the steps, gate width, path surface and distance from the entrance to the loading point. Include the largest items and access at the delivery address. These details help establish the handling and crew needed before the move is confirmed."
      },
      {
        "question": "Can you combine collections in Shawlands and another area?",
        "answer": "Include both collection addresses in one enquiry, with a separate item list and access window for each. State whether everything goes to one destination. The route and vehicle need to be assessed for the combined load rather than treating the additional stop as an unplanned extra."
      },
      {
        "question": "Do you take Southside house moves to destinations outside Scotland?",
        "answer": "Yes. A move can start in Glasgow Southside and finish anywhere in Britain, including England and Wales. Share the destination, preferred date, complete inventory and any key-release constraints so collection and delivery can be arranged together."
      }
    ]
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
    metaDescription: "Man and van in Paisley for flat moves, furniture delivery and home removals. Include both addresses, access and your item list when requesting a quote.",
    moveAdvice: [
      {
        "title": "Town-centre parking and the actual loading street",
        "body": "For a central Paisley flat or business, check the street outside the loading entrance rather than choosing a nearby public car park as the collection point. Renfrewshire Council publishes controlled-zone, waiting and loading information and a separate dispensation process. Explain the expected carrying distance and agree who will check any necessary permission; a customer parking ticket is not a reserved loading space.",
        "source": {
          "label": "Renfrewshire Council parking and loading information",
          "href": "https://www.renfrewshire.gov.uk/parking-roads-and-transport/parking"
        }
      },
      {
        "title": "Furniture ready for release from a Paisley seller",
        "body": "Before arranging a shop or private-seller collection in Paisley, confirm the item is paid for, available to release and at the stated entrance. Ask whether it is assembled, packaged or upstairs. A photograph of a table on display does not establish its transport size; provide measurements and include chairs, leaves or other separate pieces in the list."
      },
      {
        "title": "Connecting a Paisley home with storage or another city",
        "body": "For a Paisley-to-Glasgow move, describe the destination close or lift as carefully as the collection property. If some belongings go to storage, separate them in the inventory and provide the facility's access window. Longer moves from Paisley to England or Wales are also available by quote; identify what must arrive together before agreeing the loading and delivery plan."
      }
    ],
    faqs: [
      {
        "question": "Can you collect furniture from a Paisley shop or private seller?",
        "answer": "Yes. Provide the seller's exact collection address, release contact and agreed time window, plus the furniture dimensions and destination. Check whether the item will be ready at ground level or needs carrying from another floor, and request any dismantling as part of the quote."
      },
      {
        "question": "What if I cannot load directly outside my Paisley flat?",
        "answer": "Identify the nearest suitable loading position and describe the route from it to the flat. Include any stairs or crossing points. Check the council's restrictions for that street, then discuss the carrying distance and any permissions before confirming the collection."
      },
      {
        "question": "Can a Paisley move deliver some items to storage and the rest to a home?",
        "answer": "Yes. List the items for each destination and give both delivery addresses, opening windows and access details. Packing and labels should distinguish the two loads. The quote and vehicle plan need to include both stops from the outset."
      }
    ]
  },
  // Edinburgh & Lothians
  {
    slug: "edinburgh",
    schemaType: "City",
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
    metaDescription: "Man and van in Leith, Edinburgh, for flat moves and furniture collections. Request a quote with your item list, lift or stair details and both addresses.",
    moveAdvice: [
      {
        "title": "Leith Walk: choose the loading point first",
        "body": "For a Leith Walk collection, describe the signed loading space and the walking route to the building entrance. The tram corridor means the street frontage alone is not a sufficient loading plan. If the move needs a parking dispensation or a bay suspension, check the council's current requirements and agree who will arrange it before confirming the collection.",
        "source": {
          "label": "Edinburgh Council parking dispensations and suspensions",
          "href": "https://www.edinburgh.gov.uk/parking-spaces/dispensations-suspensions"
        }
      },
      {
        "title": "From a shared stair to a waterfront apartment",
        "body": "A move between a Leith tenement and a managed apartment needs two separate access descriptions. At the collection, measure stair turns and the shared entrance; at the destination, ask about lift dimensions, the unloading entrance and any booked access window. Include the distance between the van and each door when requesting furniture delivery or a full flat removal."
      },
      {
        "title": "Seller collections around the Shore",
        "body": "If you are collecting a sofa, table or wardrobe near the Shore, confirm the precise entrance with the seller rather than relying on a business name or map pin. Ask whether the item will be dismantled and ready to release. Photograph bulky pieces and check the receiving doorway before arranging collection, especially when the delivery is to an upper-floor flat."
      }
    ],
    faqs: [
      {
        "question": "Can a removal van stop directly outside my Leith Walk flat?",
        "answer": "That depends on the actual loading location and restrictions. Share the address and nearby signs, then agree a suitable loading point. If permission or a reserved bay is needed, it must be confirmed with the council before the move; an address on Leith Walk does not guarantee doorstep access."
      },
      {
        "question": "Can you move from a Leith tenement into a building with a lift?",
        "answer": "Yes. Give the collection floor, stair measurements and largest furniture dimensions, plus the destination lift size and any management booking arrangements. The lifting plan must work at both properties."
      },
      {
        "question": "Can you collect furniture in Leith and deliver outside Edinburgh?",
        "answer": "Yes. Collections originating in Leith can be quoted for destinations across Britain. Include the full delivery postcode, seller's release window and destination access so the journey, vehicle and crew are confirmed together."
      }
    ]
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
    metaDescription: "Man and van in South Edinburgh for student rooms, flats and home moves. Share your furniture, boxes, stairs and destination for a tailored quote.",
    moveAdvice: [
      {
        "title": "Marchmont and Bruntsfield flat access",
        "body": "For a shared flat in Marchmont or Bruntsfield, list only the belongings leaving with you and identify any furniture that must pass a tight landing. Include basement steps or the actual floor, not just the flat number. A bed frame prepared in advance can need a different handling plan from an assembled wardrobe, so state which items need dismantling quoted."
      },
      {
        "title": "Morningside parking and longer loading",
        "body": "For a Morningside home move, check the intended loading location before choosing the time. Edinburgh Council treats a parking dispensation and a suspended bay as separate arrangements. Identify whether you need permission for the loading task or a space reserved, then check the current application requirements and agree responsibility for any permission and cost.",
        "source": {
          "label": "Edinburgh Council loading permissions and bay suspensions",
          "href": "https://www.edinburgh.gov.uk/parking-spaces/dispensations-suspensions"
        }
      },
      {
        "title": "Shared-house moves with several destinations",
        "body": "When housemates leave a South Edinburgh property for different homes, organise the inventory by destination before requesting a quote. Put each address and key handover in order, and label boxes clearly. A storage drop followed by delivery to another city needs to be included in the original enquiry so the loading order and complete route can be planned."
      }
    ],
    faqs: [
      {
        "question": "Can I book just my room in a Marchmont shared flat?",
        "answer": "Yes. List your furniture, boxes and suitcases separately from your housemates' possessions. Give the floor, stair access and exact destination, and say which items will already be dismantled."
      },
      {
        "question": "Does a resident parking permit reserve space for my South Edinburgh move?",
        "answer": "Do not rely on it to reserve a loading space. Check the actual bay and discuss any required suspension or dispensation with Edinburgh Council. Agree the arrangements before the van and collection time are confirmed."
      },
      {
        "question": "Can a South Edinburgh removal include a storage stop?",
        "answer": "Yes, include the storage address, opening or appointment time and the items to be left there. Label those separately from anything travelling to the final home so the route and handling can be quoted accurately."
      }
    ]
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
    metaDescription: "Man and van in Livingston for home moves and furniture delivery. Request a quote based on the items, route, parking and access at both properties.",
    moveAdvice: [
      {
        "title": "Dedridge and Craigshill: road access versus the front door",
        "body": "For an address reached from a parking court or footpath in Dedridge or Craigshill, show where a van can actually stop and how furniture reaches the door. Include steps, gates and the carrying distance. West Lothian Council lists road closures and parking suspensions separately from other roadworks, so check the collection street again close to the move date.",
        "source": {
          "label": "West Lothian Council road closures and traffic disruptions",
          "href": "https://www.westlothian.gov.uk/article/32704/Current-Road-Closures-Diversions-and-Traffic-Disruptions"
        }
      },
      {
        "title": "Almondvale furniture collections",
        "body": "When arranging a furniture pickup from an Almondvale retailer or business, ask for its goods collection entrance, release reference and agreed time window. The customer entrance may not be where a bulky order is handed over. Include every package and its dimensions, and confirm whether the delivery is to a ground-floor room or needs stairs or a lift."
      },
      {
        "title": "A Livingston home move with an onward journey",
        "body": "For a move from Livingston to Edinburgh, Glasgow or further across Britain, plan the destination access before fixing a departure time. Include garage contents, garden furniture and any additional West Lothian collection in the inventory. Tell us when keys will be available at the new home so the quote covers the complete journey and unloading arrangements."
      }
    ],
    faqs: [
      {
        "question": "My Livingston front door is on a footpath. What information do you need?",
        "answer": "Give the nearest vehicle access point and the approximate carry to the door, including steps or gates. A photo or clear entrance description helps distinguish the postal address from the place the van can load."
      },
      {
        "question": "Can you collect a large retail order in Livingston?",
        "answer": "Yes. Confirm the order is paid for and ready to release, then provide the goods collection entrance, reference, package list and agreed collection window. Check destination access for the largest package before booking."
      },
      {
        "question": "Can you combine a Livingston house move with another collection?",
        "answer": "Yes, include the extra address and its items from the start. The quote and loading order need to account for every stop, with the availability of the vehicle and crew confirmed for your chosen date."
      }
    ]
  },
  // Tayside & Fife
  {
    slug: "dundee",
    schemaType: "City",
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
    metaDescription: "Man and van in Dundee for student rooms, flat moves and furniture delivery. Share your inventory, dates and access details to check your options.",
    moveAdvice: [
      {
        "title": "City-centre loading needs its own check",
        "body": "For a Dundee city-centre flat or business, identify the loading space and any restriction affecting the work. Dundee Council has a parking dispensation process, but permission is not a blanket exemption from loading restrictions or the Low Emission Zone. Check the particular location with the council and give the team both addresses before the vehicle and collection window are agreed.",
        "source": {
          "label": "Dundee City Council parking dispensation guidance",
          "href": "https://www.dundeecity.gov.uk/parking-information/parking-dispensation"
        }
      },
      {
        "title": "Student rooms: separate collection and check-in times",
        "body": "For a Dundee student move, distinguish the time you must leave your old room from the time you can enter the new one. Give the hall or flat name, block, floor and reception arrangements, plus a realistic box count. If a storage stop is needed between tenancies, include its opening hours and say which belongings continue to the final address."
      },
      {
        "title": "Furniture from Broughty Ferry to another property",
        "body": "A Broughty Ferry furniture collection needs the seller's release time and a check of the receiving entrance, even when delivery is elsewhere in Dundee. Include sofa sections, table leaves and other loose parts in the item list. For a longer move towards Fife or beyond, send the full destination postcode rather than treating it as an extra stop after booking."
      }
    ],
    faqs: [
      {
        "question": "Does a Dundee parking dispensation also cover the Low Emission Zone?",
        "answer": "No. The council lists the Low Emission Zone among the matters not covered by its dispensation scheme. The vehicle and route must be suitable separately; share the actual collection and delivery addresses before confirmation."
      },
      {
        "question": "Can you move belongings between Dundee halls and a shared flat?",
        "answer": "Yes. Provide both access windows, the room inventory and any furniture, and check reception, lift or stair arrangements with the accommodation provider. Tell us if the outgoing and incoming tenancies do not overlap."
      },
      {
        "question": "Is a Broughty Ferry sofa delivery priced only by the driving distance?",
        "answer": "No. Sofa size, the people needed to handle it, stair turns and the distance from the van to each door also affect the work. Send measurements and access details as well as both addresses."
      }
    ]
  },
  {
    slug: "perth",
    schemaType: "City",
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
    metaDescription: "Man and van in Perth for furniture collections, flat moves and home removals. Get a quote using your item list, route and loading access.",
    moveAdvice: [
      {
        "title": "Plan the onward route from Perth",
        "body": "A Perth collection heading north on the A9 or south towards the M90 needs a delivery plan as well as a pickup time. Check Traffic Scotland for the route on your date, then share any destination handover or storage appointment. An estimated driving time should not replace an agreed window covering loading, the full journey and unloading.",
        "source": {
          "label": "Traffic Scotland trunk-road works and route updates",
          "href": "https://www.traffic.gov.scot/traffic-information/roadworks"
        }
      },
      {
        "title": "Perth city-centre flats and separate entrances",
        "body": "For a flat above a shop or a building entered from a side street, send the residential entrance as well as the postal address. Identify the floor, stair turns and a suitable loading position. A nearby public car park does not show how close the van can get to the furniture, so describe the complete carry before requesting a quote."
      },
      {
        "title": "Perthshire collections beyond the town address",
        "body": "If your Perth enquiry includes a property outside the city, provide its full address and actual approach rather than only the nearest town. Explain gates, narrow driveways, turning space and any separate outbuilding containing items. List a second collection or storage visit alongside the main move so the vehicle capacity and order of stops are assessed together."
      }
    ],
    faqs: [
      {
        "question": "Can you move from Perth to England or Wales?",
        "answer": "Yes. Moves originating in Perth can be quoted for destinations across Britain. Provide the complete inventory, both postcodes and destination access; the collection date, route, crew and delivery window are then confirmed for your move."
      },
      {
        "question": "What if my Perth flat has a different entrance from the shop below?",
        "answer": "Send the correct door location and directions from the loading point. Include floor numbers, entry arrangements and the largest furniture dimensions so the carrying route can be assessed before booking."
      },
      {
        "question": "Can a Perth removal include a rural property collection?",
        "answer": "Yes. Include the exact property address, the items there and any gate or vehicle access limits. If the route involves several stops, identify what is collected and delivered at each one."
      }
    ]
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
    metaDescription: "Man and van in Kirkcaldy for furniture, flat and house moves. Request a quote with your inventory, collection and delivery details.",
    moveAdvice: [
      {
        "title": "High Street flats and the van's loading position",
        "body": "Fife Council lists resident parking arrangements for Kirkcaldy High Street. For a flat or shop collection there, check the actual loading position and the door used to reach the goods. A resident permit is not the same as an agreed furniture-removal arrangement; ask the council about any permission needed and tell us if the carry begins on another street.",
        "source": {
          "label": "Fife Council resident parking information",
          "href": "https://www.fife.gov.uk/roads-travel-parking/parking-and-car-parks/residents-parking-permits"
        }
      },
      {
        "title": "Reserve the right space for bulky furniture",
        "body": "Where a Kirkcaldy move needs a bay kept clear or a vehicle positioned within restrictions, Fife Council has separate dispensation and bay-suspension procedures and considers furniture removals. Check the current requirements early and agree who will apply. Include the approved loading location and carrying distance in the move details rather than assuming a space will be available on arrival.",
        "source": {
          "label": "Fife Council furniture-removal parking permissions",
          "href": "https://www.fife.gov.uk/roads-travel-parking/parking-and-car-parks/parking-dispensations-and-parking-suspensions"
        }
      },
      {
        "title": "Kirkcaldy collections combined with a Fife house move",
        "body": "If a Kirkcaldy seller collection forms part of a move to Dunfermline, Glenrothes or another destination, list it as a separate stop with a release contact and item dimensions. Mark which pieces belong at the final home and which go to storage. The van should be planned around the largest combined load, not only the items at the first address."
      }
    ],
    faqs: [
      {
        "question": "Do you collect furniture from a Kirkcaldy High Street property?",
        "answer": "Yes. Provide the actual collection entrance, item dimensions and seller or key holder's availability. Loading restrictions and any required council arrangement need checking before the collection time is confirmed."
      },
      {
        "question": "Can I assume my Kirkcaldy resident permit covers a removal van?",
        "answer": "No. Confirm the vehicle and task with Fife Council. Its resident permit arrangements and furniture-removal dispensation or suspension process serve different purposes; agree any necessary application before the move."
      },
      {
        "question": "Can a Kirkcaldy move include delivery to two homes?",
        "answer": "Yes. Supply both destinations, their access details and the items for each. Clear labels and an agreed delivery order help the quote cover the full load, route and handling."
      }
    ]
  },
  {
    slug: "dunfermline",
    schemaType: "City",
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
    metaDescription: "Man and van in Dunfermline for furniture delivery and household moves. Share your route, item list and access requirements for a quote.",
    moveAdvice: [
      {
        "title": "Moves across the Forth",
        "body": "For a Dunfermline move to Edinburgh or further south, check the Forth Bridges traffic information when planning the journey. It reports conditions affecting the crossings and links to Traffic Scotland. Give the destination's key handover and any building access appointment, then agree a delivery window that includes loading and unloading rather than relying on a bridge crossing time.",
        "source": {
          "label": "Forth Bridges official live traffic information",
          "href": "https://www.theforthbridges.org/plan-your-journey/forth-bridges-live-traffic-information/"
        }
      },
      {
        "title": "City-centre and Reid Street parking arrangements",
        "body": "Fife Council identifies resident parking schemes in Dunfermline's city centre and Reid Street area. If the collection is within a permit street, identify the intended loading position and check whether the removal needs a separate arrangement. Tell us about the entrance and any shared stairs before confirming the crew; parking information alone does not describe the route to the room.",
        "source": {
          "label": "Fife Council Dunfermline resident parking schemes",
          "href": "https://www.fife.gov.uk/roads-travel-parking/parking-and-car-parks/residents-parking-permits"
        }
      },
      {
        "title": "Household belongings split between home and storage",
        "body": "For a Dunfermline house move with stored belongings elsewhere in Fife, count both loads before choosing the service. Explain whether storage is collected before or after the home, provide the unit access arrangements and identify large pieces needing dismantling. Keep the items required first at the destination clearly labelled so the loading order follows the agreed route."
      }
    ],
    faqs: [
      {
        "question": "Can you quote a Dunfermline-to-Edinburgh move?",
        "answer": "Yes. Give the complete inventory and access at both ends, including any booked loading or lift window. The route and available collection and delivery times are confirmed as part of the quote."
      },
      {
        "question": "Is a parking bay guaranteed for my Dunfermline removal?",
        "answer": "No. Identify a suitable loading location and check restrictions or any required permission with Fife Council. If a bay must be reserved, discuss its suspension process and agree who arranges it before booking."
      },
      {
        "question": "Can you take a Dunfermline household to another part of Britain?",
        "answer": "Yes. Scotland-origin moves can be quoted to destinations throughout Britain. Include all room, garage and storage contents, the destination postcode and any date constraints so suitable capacity and the full journey can be planned."
      }
    ]
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
    metaDescription: "Man and van in St Andrews for student rooms, shared flats and furniture moves. Request a quote based on your items, dates and access.",
    moveAdvice: [
      {
        "title": "University arrivals: keys before unloading",
        "body": "For a move into University of St Andrews accommodation, coordinate the delivery with your booked arrival slot and key collection instructions. The university directs arriving residents to reception, or to the key location given for a property without reception. Give the moving team the residence name and actual unloading entrance, and confirm you can access the room before arranging delivery.",
        "source": {
          "label": "University of St Andrews accommodation arrival guidance",
          "href": "https://www.st-andrews.ac.uk/guides/arrive-student-accommodation/"
        }
      },
      {
        "title": "Town-centre furniture loading",
        "body": "For a St Andrews flat or furniture collection, identify the nearest suitable loading space and check the signs at that location. If the job requires a bay suspension or dispensation, use Fife Council's application guidance and confirm the arrangement before relying on it. Include the floor, doorway measurements and carry from the van when describing an older building or shared entrance.",
        "source": {
          "label": "Fife Council parking dispensations and suspensions",
          "href": "https://www.fife.gov.uk/roads-travel-parking/parking-and-car-parks/parking-dispensations-and-parking-suspensions"
        }
      },
      {
        "title": "End-of-tenancy storage and onward moves",
        "body": "If you are leaving a St Andrews room before the next tenancy starts, separate the goods going into storage from those travelling home. Include the storage address and access window, and say whether the final destination is elsewhere in Scotland, England or Wales. Label cases, boxes and furniture by destination so the agreed vehicle and loading order match the complete move."
      }
    ],
    faqs: [
      {
        "question": "Can you deliver to my St Andrews hall before I collect my keys?",
        "answer": "Do not assume the residence can accept the delivery for you. Check its arrangements, book the appropriate arrival slot and confirm who can receive the goods. Share any written unloading instructions before the collection is confirmed."
      },
      {
        "question": "Can I combine a St Andrews student move with summer storage?",
        "answer": "Yes. Give the storage location, access window and the items being left there. Tell us whether the remainder goes to another address on the same journey so the route and total load can be quoted together."
      },
      {
        "question": "Can a St Andrews move go to a home in England or Wales?",
        "answer": "Yes. Moves collected in St Andrews can be quoted across Britain. Include both full postcodes, the inventory and your accommodation checkout time; the route, date and suitable crew remain subject to confirmation."
      }
    ]
  },
  // Grampian
  {
    slug: "aberdeen",
    schemaType: "City",
    name: "Aberdeen",
    region: "Grampian",
    postcode: "AB10–AB25",
    headline: "Man and Van in Aberdeen",
    description:
      "Get a man and van quote for your Aberdeen furniture collection, flat move or house removal. Moving a sofa, a student room or a full home? Share your items, both addresses and preferred date to plan the right vehicle and lifting help. Local moves, office removals and longer journeys start with your route and access details.",
    highlights: [
      "Furniture collection and small moves",
      "House, flat and office removals",
      "Local and long-distance moving quotes",
    ],
    nearbyAreas: ["inverurie", "westhill", "ellon", "stonehaven"],
    metaDescription:
      "Get an Aberdeen man and van quote for furniture, flats and house removals. Plan local or long-distance moves with the right vehicle and lifting help.",
  },
  {
    slug: "inverurie",
    name: "Inverurie",
    schemaType: "Place",
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
    nearbyAreas: ["aberdeen", "westhill", "ellon"],
    metaDescription: "Man and van enquiries in Inverurie for furniture and home moves. Share both addresses, the load and vehicle access details for a route-based quote.",
    moveAdvice: [
      {
        title: "Market Place and Burn Lane loading",
        body: "Inverurie has council resident permit arrangements around Market Place and Burn Lane. For a flat or business move there, identify the actual entrance and a suitable loading position before booking. A resident's parking arrangement does not establish access for the removal vehicle. Share any restrictions and the carrying distance so the crew can plan the load safely.",
        source: {
          label: "Aberdeenshire Council Inverurie parking information",
          href: "https://www.aberdeenshire.gov.uk/roads-and-travel/car-parking/inverurie"
        }
      },
      {
        title: "Collections around Kintore and Oldmeldrum",
        body: "Include the complete address when a collection is outside Inverurie, including Kintore, Oldmeldrum or a property reached by a private road. Provide the entrance location, gate width, surface and turning space where relevant. A postcode alone may leave the loading point unclear. Tell us about additional furniture collections before the route and vehicle are agreed."
      },
      {
        title: "Furniture to Aberdeen or another destination",
        body: "For an Inverurie furniture purchase being delivered to Aberdeen, confirm when the seller can release the item and whether it needs dismantling. Measure the furniture and the tightest doorway at the destination, including stair turns. If a storage stop or several deliveries are required, list them together so the quote covers the complete journey and handling."
      }
    ],
    faqs: [
      {
        question: "Can you move furniture from Inverurie to an Aberdeen flat?",
        answer: "Yes. Provide the collection and delivery addresses, item dimensions and the floor at the Aberdeen property. Include lift size or stair turns and the seller's collection window. The vehicle, lifting help and time are confirmed for the whole journey."
      },
      {
        question: "Do you collect outside Inverurie towards Kintore and Oldmeldrum?",
        answer: "Yes, you can request a collection or delivery in these surrounding communities. Send the exact address and explain any private lane, gate or limited turning space. Availability is checked for your date and load; a nearby town name does not set the arrival time."
      },
      {
        question: "What affects the price of an Inverurie move?",
        answer: "The inventory, collection and destination, crew requirements, stairs and loading distance all contribute. A small furniture collection differs from a full household move with several stops. List packing or dismantling requests in advance so their suitability and any additional cost can be confirmed."
      }
    ]
  },
  {
    slug: "westhill",
    name: "Westhill",
    schemaType: "Place",
    region: "Grampian",
    postcode: "AB32",
    headline: "Man and Van in Westhill, Aberdeenshire",
    description:
      "Book a man and van in Westhill, Aberdeenshire, for furniture delivery, a flat move or house removals. For a move around Westhill and Elrick, share the collection entrance, driveway space and destination access alongside your inventory. An office relocation needs its desks, equipment and building arrangements listed separately so the crew and loading plan match the job.",
    highlights: [
      "Westhill and Elrick home moves",
      "Furniture delivery to and from Aberdeen",
      "Office access and equipment planning"
    ],
    nearbyAreas: ["aberdeen", "inverurie", "ellon", "stonehaven"],
    metaDescription: "Man and van in Westhill, Aberdeenshire, for furniture delivery, house and office moves. Share your items and access details to get a moving quote.",
    moveAdvice: [
      {
        title: "Identify the Westhill collection address",
        body: "Use the full AB32 address for Westhill in Aberdeenshire and include Elrick when that is the collection location. Explain whether loading is from a driveway, shared parking area or a separate entrance. Measure any gate or tight approach rather than assuming the van will fit. The address and access notes help prevent confusion with other places named Westhill.",
        source: {
          label: "Aberdeenshire Council Westhill and Elrick area information",
          href: "https://www.aberdeenshire.gov.uk/environment/natural-heritage/local-nature-reserves"
        }
      },
      {
        title: "Plan an office or business move",
        body: "For Westhill office removals, identify the reception contact, goods entrance and permitted loading window. List desks, chairs, cabinets and boxed equipment, including items that need dismantling. Agree lift access and any building protection requirements with the premises manager. Specialist machinery or unusually heavy items need separate assessment; an office furniture quote should not be assumed to include them."
      },
      {
        title: "Furniture collections with an Aberdeen stop",
        body: "If you are collecting furniture in Aberdeen for a Westhill home, give the seller's address and release time as well as your delivery details. Check the destination room, doorway widths and stairs before purchase. Add every collection stop to the enquiry, and confirm whether each item will be assembled or dismantled when the crew arrives to collect it."
      }
    ],
    faqs: [
      {
        question: "Is this man and van service for Westhill in Aberdeenshire?",
        answer: "Yes, this page covers Westhill in Aberdeenshire and neighbouring Elrick. Enter your full address and postcode when requesting a quote. That identifies the correct collection point and allows the route, access and available date to be checked before confirmation."
      },
      {
        question: "Can you collect a sofa in Aberdeen and deliver it to Westhill?",
        answer: "Yes. Share the seller's collection address, sofa dimensions, delivery address and agreed collection window. Include steps or narrow doorways at either end and say whether the sofa separates into sections. Suitable lifting help and transport are arranged around those details."
      },
      {
        question: "Can I request an office move in Westhill?",
        answer: "Yes. Provide a desk and furniture inventory, equipment details and the building's loading arrangements. Confirm access times with the premises manager and flag heavy or specialist equipment separately. Packing, dismantling and any work outside normal access hours need agreement in the quote."
      }
    ]
  },
  {
    slug: "stonehaven",
    name: "Stonehaven",
    schemaType: "Place",
    region: "Grampian",
    postcode: "AB39",
    headline: "Man and Van in Stonehaven",
    description:
      "Arrange man and van in Stonehaven for a furniture collection, a flat move or a full house removal. Town-centre loading around Allardice Street and Market Square needs a different plan from a property with its own driveway. Include both addresses, the size of your load and any stairs, then request a quote for a local move or delivery towards Aberdeen and beyond.",
    highlights: [
      "Town-centre and household removals",
      "Sofa, bed and furniture collections",
      "Aberdeen and coastal-route enquiries"
    ],
    nearbyAreas: ["aberdeen", "westhill", "ellon"],
    metaDescription: "Man and van in Stonehaven for furniture collection, flat and house removals. Plan town-centre loading and your destination, then get a tailored quote.",
    moveAdvice: [
      {
        title: "Allardice Street and Market Square access",
        body: "The council lists resident parking zones around Allardice Street, Market Square and nearby streets. Check the signs at your actual address and identify a suitable loading position before the move. Share the distance between the entrance and van, plus any steps or shared passage. Parking arrangements for a resident do not automatically settle access for a removal vehicle.",
        source: {
          label: "Aberdeenshire Council Stonehaven parking zones",
          href: "https://www.aberdeenshire.gov.uk/roads-and-travel/car-parking/stonehaven"
        }
      },
      {
        title: "Harbour-area furniture and flat moves",
        body: "For a property near Stonehaven Harbour, describe the entrance and route from the room to the street rather than relying on the postcode. Send dimensions for a sofa, bed frame or wardrobe and flag narrow stairs, outside steps or a shared doorway. Agree a safe loading point and collection window before asking a seller or landlord to attend."
      },
      {
        title: "Delivery towards Newtonhill and Aberdeen",
        body: "A Stonehaven collection with delivery to Newtonhill, Portlethen or Aberdeen needs access details for both ends of the journey. Include any additional stop, key handover time or seller deadline when requesting the quote. For a house move, add the garage and outdoor furniture to the inventory so the vehicle is planned around the full load, not only bedrooms."
      }
    ],
    faqs: [
      {
        question: "Can you collect furniture from Stonehaven for delivery to Aberdeen?",
        answer: "Yes. Give the collection address, seller's time window, destination and item sizes. Tell us about loading restrictions and any stairs at both properties. The quote covers the assessed route and handling, with any extra stops included before the booking is confirmed."
      },
      {
        question: "What do you need for a Stonehaven town-centre flat move?",
        answer: "Share the floor, stairs or lift details, entrance location and furniture dimensions. Identify where loading can take place and the carrying distance to the door. Check local signs or building rules before the date; nearby public parking does not guarantee a suitable removal loading space."
      },
      {
        question: "Do you cover Newtonhill and Portlethen as well as Stonehaven?",
        answer: "Yes, collections and deliveries in these surrounding communities can be included. Use the full addresses and list each stop, even for a short coastal journey. The available date, vehicle and lifting help are checked for your specific inventory and property access."
      }
    ]
  },
  {
    slug: "ellon",
    name: "Ellon",
    schemaType: "Place",
    region: "Grampian",
    postcode: "AB41",
    headline: "Man and Van in Ellon",
    description:
      "Get a man and van quote in Ellon for furniture transport, a small move or house removals. Whether collecting near the town centre or from a home outside town, include the exact entrance and loading access. Deliveries to Aberdeen, nearby villages or a longer destination can be planned together when you provide every stop and the full item list.",
    highlights: [
      "Ellon and surrounding village collections",
      "Small moves and full home enquiries",
      "Town-centre and rural loading plans"
    ],
    nearbyAreas: ["aberdeen", "inverurie", "westhill", "stonehaven"],
    metaDescription: "Man and van in Ellon for furniture, small moves and house removals. Include town-centre or rural access and your delivery route to request a quote.",
    moveAdvice: [
      {
        title: "Market Street, The Square and Station Road",
        body: "Ellon's council parking information identifies resident permit arrangements around Market Street, The Square, Schoolhill Road and Station Road East. For a collection there, describe the entrance and check the current loading conditions at the property. Discuss any long carry or stair access in advance. A permit or nearby car park should not be treated as a reserved loading space.",
        source: {
          label: "Aberdeenshire Council Ellon parking information",
          href: "https://www.aberdeenshire.gov.uk/roads-and-travel/car-parking/ellon"
        }
      },
      {
        title: "Village and rural approaches outside Ellon",
        body: "For collections around Newburgh, Tarves or Pitmedden, include the property name and full address, together with directions to the loading entrance if needed. Note private tracks, gate widths, low branches and whether a van can turn. Tell us about the surface and any long walk from the road so the appropriate vehicle and handling can be assessed."
      },
      {
        title: "Combine furniture collection and delivery details",
        body: "A furniture collection in Ellon and a delivery to Aberdeen may involve different access constraints at each end. Ask the seller for dimensions and confirm who will release the item, then check your destination doors and stairs. If you are moving an entire home, list boxes and furniture room by room and include any storage stop in the original enquiry."
      }
    ],
    faqs: [
      {
        question: "Can I book a small move between Ellon and Aberdeen?",
        answer: "Yes. List your furniture, boxes and other belongings, then provide both addresses and your preferred date. Include any stairs, loading restrictions or storage stop. A small load still needs a suitable vehicle and lifting plan, so the quote is based on the full job."
      },
      {
        question: "Do you collect in villages outside Ellon?",
        answer: "Yes, including enquiries from Newburgh, Tarves and Pitmedden. Provide the exact property address and describe private roads, gates or turning limits. The team checks access, the complete route and availability for your requested date before confirming the collection arrangements."
      },
      {
        question: "Can you arrange an urgent furniture collection in Ellon?",
        answer: "Send the item details, both addresses and the latest collection time you can accept. Short-notice availability depends on the vehicle, crew and route needed. Wait for confirmation of the collection window before promising a seller that the item will be collected that day."
      }
    ]
  },
  // Highlands
  {
    slug: "inverness",
    schemaType: "City",
    name: "Inverness",
    region: "Highlands",
    postcode: "IV1–IV3",
    headline: "Man and Van in Inverness",
    description:
      "Get a man and van quote in Inverness for furniture collection, a small move or house removals. Share your items, collection and delivery addresses, and preferred date to check the price and availability. Planning a longer Highland journey? Include the full route and property access so the right vehicle and crew can be arranged.",
    highlights: [
      "Sofa, bed and furniture collections",
      "Student, flat and house moves",
      "Local and longer-route quote enquiries",
    ],
    nearbyAreas: ["nairn", "dingwall", "fort-william"],
    metaDescription:
      "Get a quote for man and van in Inverness, furniture collection and house removals. Share your items and route to check price and availability.",
  },
  {
    slug: "nairn",
    name: "Nairn",
    schemaType: "Place",
    region: "Highlands",
    postcode: "IV12",
    headline: "Man and Van in Nairn",
    description:
      "Arrange man and van in Nairn for furniture delivery, flat moves and house removals. A collection near Fishertown or the High Street needs clear entrance and loading details; a home outside town may need directions to a driveway or private lane. Share your items and both addresses for a local move or a route between Nairn and Inverness.",
    highlights: [
      "Nairn and Inverness furniture deliveries",
      "Fishertown and town-centre access planning",
      "Small moves and complete home enquiries"
    ],
    nearbyAreas: ["inverness", "dingwall"],
    metaDescription: "Man and van in Nairn for furniture delivery, flat and house removals. Share your load, access and Nairn or Inverness route to get a moving quote.",
    moveAdvice: [
      {
        title: "Fishertown and High Street entrances",
        body: "For a Fishertown or High Street collection, identify the actual door, any shared passage and where loading is possible. Measure large furniture against the tightest part of its exit route and mention external steps or narrow turns. Check current parking signs and discuss any permission required with Highland Council; a convenient space nearby does not establish loading access.",
        source: {
          label: "Highland Council parking and permits",
          href: "https://www.highland.gov.uk/parking"
        }
      },
      {
        title: "Furniture between Nairn and Inverness",
        body: "For a Nairn to Inverness collection or delivery, give both complete addresses and the seller's agreed release window. Include dimensions for sofas, wardrobes and beds, and check the destination entrance before purchase. If dismantling is required, discuss it before confirmation. Additional collections or storage stops should be included when the full route is quoted rather than added on collection day."
      },
      {
        title: "Homes around Auldearn and Cawdor",
        body: "For an address around Auldearn or Cawdor, provide the property name and an entrance description as well as the postcode. Flag private lanes, gates, surface conditions and limited turning space. A full house move should include outbuildings and garden furniture in the inventory. Those details help match the vehicle and crew to the property, not simply to a bedroom count."
      }
    ],
    faqs: [
      {
        question: "Can you deliver furniture from Inverness to Nairn?",
        answer: "Yes. Provide the collection address, item sizes, delivery address and seller or retailer collection window. Include the floor and doorway access at your Nairn property. The crew and vehicle are assessed for the items and the route before the booking is confirmed."
      },
      {
        question: "Do you cover Auldearn and Cawdor near Nairn?",
        answer: "Yes, you can request collections and deliveries in these surrounding communities. Send the full property address and details of any private lane, gate or turning restriction. Availability and access are checked for your preferred date; the postcode district is a guide, not a service boundary."
      },
      {
        question: "What should I include for a Nairn house removal quote?",
        answer: "List furniture and boxes from each room, plus garden, garage or outbuilding items. Explain access at both properties, including stairs and the distance from the loading point. Add any packing or dismantling request and key handover times so the scope can be agreed in advance."
      }
    ]
  },
  {
    slug: "dingwall",
    name: "Dingwall",
    schemaType: "Place",
    region: "Highlands",
    postcode: "IV15",
    headline: "Man and Van in Dingwall",
    description:
      "Get a man and van quote in Dingwall for a single furniture collection, a flat move or house removals. High Street access needs checking before arranging a loading time, while properties around the town may have private approaches or longer carries. Include the complete load and destination for local moves, Inverness deliveries and surrounding village collections.",
    highlights: [
      "Dingwall and surrounding village moves",
      "Furniture collections to and from Inverness",
      "High Street loading and property access reviewed"
    ],
    nearbyAreas: ["inverness", "nairn"],
    metaDescription: "Man and van in Dingwall for furniture collection, flat and house removals. Plan High Street or rural access and request a quote for your full route.",
    moveAdvice: [
      {
        title: "Check High Street vehicle access first",
        body: "Dingwall High Street includes a pedestrian section, so do not plan on loading outside a property without checking current vehicle access arrangements. Give the exact entrance, floor and nearest suitable loading point when requesting your quote. Ask Highland Council about any permission needed and confirm the available window before coordinating a landlord, seller or key handover.",
        source: {
          label: "Highland Council Dingwall High Street property information",
          href: "https://www.highland.gov.uk/directory-record/11205/office-3-mayfield-dingwall"
        }
      },
      {
        title: "Maryburgh, Conon Bridge and Muir of Ord",
        body: "For a collection around Maryburgh, Conon Bridge or Muir of Ord, use the exact address instead of only describing it as near Dingwall. Include gates, driveway width and turning space, particularly where the entrance is away from the main road. Note every collection and delivery stop so the route can be quoted together with its loading and unloading requirements."
      },
      {
        title: "Choose the load before choosing the van",
        body: "For a move between Dingwall and Inverness, list bulky furniture and box quantities before deciding whether it is a small move or a house removal. A short route can still require a larger vehicle or extra lifting help. Tell us about stairs, awkward items and dismantling, and give any key handover deadline so the collection plan reflects the whole job."
      }
    ],
    faqs: [
      {
        question: "Can a removal van collect from Dingwall High Street?",
        answer: "The exact address and current access conditions need checking first because part of High Street is pedestrianised. Share your entrance and proposed loading point. Any council permission or time restriction must be resolved before confirming a collection that relies on driving into a restricted section."
      },
      {
        question: "Do you cover Maryburgh, Conon Bridge and Muir of Ord?",
        answer: "Yes. Include the full collection and destination addresses, load and preferred date in your enquiry. For a private driveway or lane, describe the entrance, surface and turning space. The team confirms vehicle suitability, access and availability for the specific journey."
      },
      {
        question: "Can I book a man and van from Dingwall to Inverness?",
        answer: "Yes, for furniture collections, smaller moves or a larger household load. Give an item list and access details at both properties, including stairs and parking. The quote depends on the load, route and required crew; a short drive alone does not determine the price."
      }
    ]
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
    metaDescription: "Man and van enquiries in Fort William for furniture and home moves. Share your route, inventory and vehicle access to check suitability and availability.",
    moveAdvice: [
      {
        "title": "High Street bollards and collection access",
        "body": "Fort William High Street has council-operated automatic bollards and a controlled pedestrian zone. For a shop, office or residential collection there, ask the council or property contact to confirm the permitted access arrangements for the actual move. Share the entrance and alternative loading point if needed. Do not plan for the van to reach the door simply because a delivery is booked.",
        "source": {
          "label": "Highland Council Fort William High Street access information",
          "href": "https://www.highland.gov.uk/news/article/17266/fort-william-high-street-automatic-bollards-begin-operation"
        }
      },
      {
        "title": "The A82 journey and the last approach to the property",
        "body": "For a Fort William removal involving the A82, check Traffic Scotland for roadworks affecting the journey, then describe the final approach to both properties separately. A gate, steep drive or limited turning area can determine the loading plan after the trunk-road journey is complete. Give exact entrance details for an outlying Lochaber address rather than only the nearest village.",
        "source": {
          "label": "Traffic Scotland A82 and trunk-road updates",
          "href": "https://www.traffic.gov.scot/traffic-information/roadworks"
        }
      },
      {
        "title": "Fort William to destinations across Britain",
        "body": "Moves starting in Fort William can be quoted to destinations throughout Britain, including England and Wales. Include every room, shed and garage item, then agree the collection and delivery windows around the full route. Tell us about destination stairs, keys and any storage stop before confirming the move, so the long journey ends with an unloading plan that works."
      }
    ],
    faqs: [
      {
        "question": "Can you collect from Fort William High Street?",
        "answer": "Yes, subject to a workable access arrangement for the address and date. The High Street has controlled vehicle access, so confirm the loading location and any required authorisation before booking. A booked collection does not itself provide permission to pass the bollards."
      },
      {
        "question": "Can you move a Fort William household to England or Wales?",
        "answer": "Yes. Send the full destination postcode, inventory and property access details for a Britain-wide moving quote. Collection and delivery times, vehicle capacity and lifting help are agreed for the complete journey."
      },
      {
        "question": "What should I send for a rural collection near Fort William?",
        "answer": "Provide the full address and entrance location, plus details of the approach surface, gates, turning space and distance to the door. Include photographs where useful and identify any large or specialist items for assessment."
      }
    ]
  },
  // Central Scotland
  {
    slug: "stirling",
    schemaType: "City",
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
    metaDescription: "Man and van in Stirling for student moves, furniture and home removals. Request a quote using both addresses, your inventory and access requirements.",
    moveAdvice: [
      {
        "title": "City-centre parking and your removal vehicle",
        "body": "For a Stirling city-centre flat, identify the loading street and entrance before choosing a collection time. The council explains that a resident parking permit does not reserve a space or authorise parking in loading bays and other restricted places. Check the current signs and agree a suitable loading position, particularly where the nearest public car park is some distance from the property.",
        "source": {
          "label": "Stirling Council resident parking guidance",
          "href": "https://www.stirling.gov.uk/roads-transport-and-parking/parking-and-permits/apply-for-a-residents-parking-permit/"
        }
      },
      {
        "title": "Student rooms, campus addresses and tenancy handovers",
        "body": "For a Stirling student move, give the accommodation building and room-access arrangements rather than only the university or landlord's address. Check where collections are permitted and who will open the building. Separate your packed belongings from communal furniture, and include a storage stop if the dates between leaving one room and entering the next do not line up."
      },
      {
        "title": "Preparing a Stirling collection for a longer delivery",
        "body": "A move leaving Stirling for elsewhere in Scotland, England or Wales needs a receiving plan as well as a collection plan. Give the delivery property's key-release time, any lift appointment and a contact who can provide entry. Identify essential items that must travel with the main load, and agree the delivery window before booking dependent travel or accommodation."
      }
    ],
    faqs: [
      {
        "question": "Can you move a student room in Stirling without a full-house booking?",
        "answer": "Yes. Request a quote for the actual boxes, suitcases and furniture being moved. Include the accommodation building, floor and collection arrangements, with any storage stop or onward home address. The size of the load and access determine the plan."
      },
      {
        "question": "Does a Stirling resident permit guarantee space for a removal van?",
        "answer": "No. The council states that resident permits do not guarantee a parking space. Check the loading position and applicable restrictions with the council or building manager as relevant, and tell us the carrying route before confirming the move."
      },
      {
        "question": "Can my move start in Stirling and finish in England or Wales?",
        "answer": "Yes. Scotland-origin moves are available to destinations throughout Britain. Provide the full destination, complete inventory and access requirements, including when keys become available. Collection and delivery arrangements are agreed together for the route and requested date."
      }
    ]
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
    metaDescription: "Man and van in Falkirk for furniture collections, flat moves and home removals. Check your options using the full route, inventory and access details.",
    moveAdvice: [
      {
        "title": "Raise a blocked loading-space problem before move day",
        "body": "If suitable loading space outside a Falkirk property cannot be relied on, contact the council before fixing the arrangements. Falkirk Council lists furniture removal among the purposes for which it may suspend parking bays. Ask about the specific address and requirements; a request does not reserve a bay or confirm approval.",
        "source": {
          "label": "Falkirk Council: parking dispensations and suspensions",
          "href": "https://www.falkirk.gov.uk/streets-and-parking/parking-tickets-and-enforcement"
        }
      },
      {
        "title": "Distinguish a waiting place from doorstep access",
        "body": "A town-centre car park can help identify a waiting option, but it does not establish a practical furniture-carrying route. If considering a location around Meeks Road or Garrison Place, check the entrance, vehicle conditions and distance to the property. Tell us where loading is proposed, especially when a flat is reached from a different street.",
        "source": {
          "label": "Falkirk Council: car park locations and conditions",
          "href": "https://www.falkirk.gov.uk/streets-and-parking/car-parks"
        }
      },
      {
        "title": "Give each address across the wider Falkirk area",
        "body": "For moves involving Camelon, Larbert, Grangemouth or Polmont, list the actual collection and delivery properties instead of using Falkirk as a single location. Record which items belong at each stop and any key or storage access arrangements. For onward delivery to England or Wales, include the full destination so the route, date and capacity can be quoted together."
      }
    ],
    faqs: [
      {
        "question": "Can a parking bay be reserved for a Falkirk furniture move?",
        "answer": "Falkirk Council says it may suspend bays for furniture removal. Contact the council about the proposed location and its application requirements, then share the outcome when arranging the move. Approval and a reserved space should not be assumed."
      },
      {
        "question": "Can I include a Larbert or Grangemouth stop in a Falkirk moving enquiry?",
        "answer": "List every full address, the items for each stop and any access or collection constraints. The complete route needs assessment before booking. Tell us if the extra stop is a storage unit or a seller collection so its release arrangements can be included."
      },
      {
        "question": "What affects a short move between two Falkirk flats?",
        "answer": "The furniture and box inventory, floors, stair turns and distance from each entrance to a suitable loading point all matter. Include both access routes even when the addresses are close together, and identify any large item that needs dismantling or an access check."
      }
    ]
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
    metaDescription: "Man and van in Hamilton for furniture delivery, flat moves and house removals. Request a quote with your addresses, dates and item list.",
    moveAdvice: [
      {
        "title": "Check restricted access in Hamilton town centre",
        "body": "A collection on Cadzow Street, Townhead Street, Quarry Street or Castle Street needs the exact loading point checked. South Lanarkshire Council publishes different access and loading conditions for these streets, so a town-centre postcode alone is insufficient. Give the property entrance and contact the council about any required permission before agreeing the vehicle approach; an access permit does not reserve a space.",
        "source": {
          "label": "South Lanarkshire Council Hamilton access guidance",
          "href": "https://www.southlanarkshire.gov.uk/parking-car-parks/parking-zone-permit-application-renewals/16"
        }
      },
      {
        "title": "Loading a household rather than just the main rooms",
        "body": "For a Hamilton house removal, work through the garage, loft and garden storage as well as the bedrooms and living room. Separate fragile pieces and unusually heavy items, and explain how they reach the loading point. If a shed or rear garden uses a narrow side passage, supply its clearance before assuming the same route will work for every item."
      },
      {
        "title": "Key handovers on a Lanarkshire or longer move",
        "body": "When moving from Hamilton to Motherwell, East Kilbride or further afield, give the earliest time the destination can receive the load. For England or Wales deliveries, identify any fixed access appointment as well as the full postcode. Discuss what should happen if keys are delayed, and have any waiting or additional stop included in the agreed scope."
      }
    ],
    faqs: [
      {
        "question": "Can you collect from a restricted street in Hamilton town centre?",
        "answer": "Send the address and loading entrance for assessment. Access and loading conditions differ between the town-centre streets, and any necessary permission must be checked before confirmation. Do not assume a permit held for another vehicle gives the removal van access."
      },
      {
        "question": "Should a Hamilton house-removal inventory include the garage?",
        "answer": "Yes. Include garage, shed and loft contents, with dimensions for bulky items and details of how they can be carried out. Tell us about anything unusually heavy, fragile or needing separate handling so the quote covers the actual household load."
      },
      {
        "question": "Can you move a Hamilton household to England or Wales?",
        "answer": "Yes. Moves starting in Hamilton can be arranged to destinations across Britain. Provide the complete inventory, destination access and key handover requirements. The available collection date, capacity and delivery window are confirmed for the route before booking."
      }
    ]
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
    metaDescription: "Man and van in East Kilbride for furniture, flat and household moves. Request a quote based on your inventory, route and loading access.",
    moveAdvice: [
      {
        "title": "Resident zones do not reserve a loading space",
        "body": "If your East Kilbride property is in a resident parking zone, check the sign for the actual bay and tell us where the removal vehicle can stop. South Lanarkshire Council's terms explain that a resident permit does not guarantee a particular space or remove time limits in time-limited bays. Confirm the loading arrangements before planning furniture around an assumed space outside.",
        "source": {
          "label": "South Lanarkshire Council East Kilbride parking-zone terms",
          "href": "https://www.southlanarkshire.gov.uk/parking-car-parks/parking-zone-permit-application-renewals/4"
        }
      },
      {
        "title": "Show the route through a parking court or path",
        "body": "For an East Kilbride home reached from a parking court, mark the correct entrance and explain the path between the bay and front door. Include steps, bollards, gates or a rear entrance where relevant. A map pin on the building can miss the vehicle approach, so give a practical arrival description and measure the carrying distance for the quote."
      },
      {
        "title": "Moving between a house and an apartment",
        "body": "When an East Kilbride house move ends at an apartment, check the destination lift and communal doors before deciding which assembled furniture to take. List beds, wardrobes and large sofas separately, with anything being left behind clearly excluded. For a new home elsewhere in Scotland, England or Wales, arrange access at the destination alongside collection and request dismantling only where it is needed."
      }
    ],
    faqs: [
      {
        "question": "What if the van cannot reach my East Kilbride front door?",
        "answer": "Send the vehicle approach and nearest suitable loading point, then describe the path, steps and distance to the entrance. We can assess the carrying work with the item list. A nearby parking court should not be treated as direct doorstep access without checking the route."
      },
      {
        "question": "Does my East Kilbride resident permit reserve a bay for moving day?",
        "answer": "No. The council's parking-zone terms do not guarantee a particular space. Check the rules for the actual bay and discuss a suitable loading position before the move. Do not assume a permit can be transferred to a removal vehicle or used outside its conditions."
      },
      {
        "question": "Can you help plan an East Kilbride move into a smaller flat?",
        "answer": "Request a quote for the belongings you are taking, with dimensions for bulky furniture and the new flat's lift, stairs and doorway details. Identify items going elsewhere as separate stops. Agree any dismantling and the required lifting help before the collection is confirmed."
      }
    ]
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
    metaDescription: "Man and van in Motherwell for furniture collections and home moves. Share your item list, addresses and access details for a tailored quote.",
    moveAdvice: [
      {
        "title": "Read the loading signs at a Motherwell collection",
        "body": "For a Motherwell flat or business collection, check kerb markings as well as the nearest parking sign. North Lanarkshire Council distinguishes waiting restrictions from restrictions on loading and unloading. Send the actual entrance and proposed loading position, including any carry from an adjoining street. A short collection still needs a lawful place to stop while the furniture is handled.",
        "source": {
          "label": "North Lanarkshire Council parking and loading guidance",
          "href": "https://www.northlanarkshire.gov.uk/roads-parking-and-active-travel/parking/parking-enforcement"
        }
      },
      {
        "title": "Storage transfers with a clear collection order",
        "body": "If a Motherwell move starts at home and continues to a storage unit, separate the stored items from the household inventory. Confirm how the unit is accessed, whether a trolley or lift is available and who can release the contents. Give opening and access appointments for both stops so the route does not depend on a locked unit or an absent keyholder."
      },
      {
        "title": "Business furniture leaving an occupied workplace",
        "body": "For a Motherwell office collection, label desks, chairs and boxed equipment with their destination room and keep them separate from equipment still in use. Ask the building contact about goods access, lift dimensions and where the crew can load. Have your staff arrange data backups and equipment disconnection unless separate specialist support is agreed, including on a longer move to England or Wales."
      }
    ],
    faqs: [
      {
        "question": "Can a Motherwell removal include a storage-unit collection?",
        "answer": "Yes. Include the storage facility, unit-access details, opening window and item list in the original enquiry. Tell us who will unlock the unit and whether its contents are on an upper level. The vehicle and collection order need to account for everything travelling."
      },
      {
        "question": "Can you quote for office furniture leaving Motherwell?",
        "answer": "Provide a furniture and equipment list, building access details and the destination layout. Identify items requiring dismantling or specialist handling. IT preparation and reconnection are not assumed to be included; agree the transport, lifting support and any additional work in the quote."
      },
      {
        "question": "Do you arrange Motherwell moves to England and Wales?",
        "answer": "Yes. Collections starting in Motherwell can be delivered across Britain. Share the full route, inventory, access at both ends and any fixed handover appointment so the collection date and delivery window can be planned for the complete job."
      }
    ]
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
    metaDescription: "Man and van in Ayr for furniture delivery and household moves. Request a quote with your items, both addresses and access requirements.",
    moveAdvice: [
      {
        "title": "High Street access needs a separate check",
        "body": "For a collection on High Street, Kirk Port or Nile Court, identify the entrance used for large items and ask the occupier about vehicle access. Ayrshire Roads Alliance publishes different access and loading arrangements for this part of Ayr. Check what applies to the proposed removal vehicle before agreeing a collection window; an occupier's permit should not be assumed to cover it.",
        "source": {
          "label": "Ayrshire Roads Alliance: Ayr loading and access permits",
          "href": "https://www.ayrshireroadsalliance.org/Parking-Information/Business-Parking-Permits/Loading-and-Access-Permit.aspx"
        }
      },
      {
        "title": "Show the carrying route from the actual entrance",
        "body": "If your Ayr address has a shared close, side entrance or rear gate, describe that route separately from the street address. Photograph any steps, narrow passage or turning point that a sofa or wardrobe must pass. Give the distance to the proposed loading point so that a nearby parking space is not mistaken for access beside the door."
      },
      {
        "title": "List each stop on an Ayrshire move",
        "body": "For an Ayr move involving Prestwick, Troon or Kilmarnock, give each full address and say what is collected or delivered at every stop. Moves starting in Ayr can also continue to destinations in England or Wales. Include seller collection and key handover arrangements so the full route, date and vehicle capacity can be quoted together."
      }
    ],
    faqs: [
      {
        "question": "What should I check before arranging a collection from Ayr High Street?",
        "answer": "Confirm the correct entrance, where the vehicle can load and any access arrangements with the occupier. Check the Ayrshire Roads Alliance guidance for that location and vehicle. Access to the street and permission to stop at the property are separate questions."
      },
      {
        "question": "Can I include a furniture collection in Prestwick or Troon in my Ayr enquiry?",
        "answer": "Include the extra address, the items at that stop and the seller's availability when requesting the quote. The combined route and collection arrangements need confirmation before booking; adding a stop later may change the plan."
      },
      {
        "question": "Which details matter for an Ayr flat above a shop?",
        "answer": "Identify the residential entrance rather than only the shop frontage. Include the floor, stair turns, shared doors and the route from the close to a suitable loading point. Give dimensions for any furniture that may be difficult to turn on the stairs."
      }
    ]
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
    metaDescription: "Man and van in Kilmarnock for small moves, furniture and household removals. Share the item list, route and access details to request a quote.",
    moveAdvice: [
      {
        "title": "Match town-centre parking to the loading task",
        "body": "For a Kilmarnock town-centre move, check the street signs and identify the nearest suitable loading point before relying on a public parking space. Ayrshire Roads Alliance lists on-street parking, car parks and permit information separately. Tell us if the property entrance is on a different street from the place where the van can stop.",
        "source": {
          "label": "Ayrshire Roads Alliance: parking information",
          "href": "https://www.ayrshireroadsalliance.org/Parking-Information/Parking-Information.aspx"
        }
      },
      {
        "title": "Confirm the collection entrance at retail premises",
        "body": "For furniture bought around Queens Drive or Glencairn retail parks, ask the retailer for the actual goods-collection entrance and release procedure. Include the order details, packaging dimensions and whether the item will be assembled. A shop address alone does not establish where a removal vehicle should arrive or whether the furniture is ready to leave.",
        "source": {
          "label": "East Ayrshire Council: Kilmarnock town centre and retail parks",
          "href": "https://www.east-ayrshire.gov.uk/BusinessAndTrade/TownCentreManagement/Kilmarnock-Town-Centre-Mythbuster.aspx"
        }
      },
      {
        "title": "Describe the last approach beyond the town",
        "body": "If the delivery continues from Kilmarnock to an outlying home, provide the full destination rather than the nearest town name. For a rural property, add the driveway entrance, gate width and available turning space. Destinations across Scotland, England and Wales can be quoted; include any storage stop so the complete route, date and capacity requirements can be assessed."
      }
    ],
    faqs: [
      {
        "question": "What information is needed for a Kilmarnock retail-park furniture collection?",
        "answer": "Provide the retailer, collection entrance, item and packaging dimensions, and the agreed release arrangements. Confirm that the purchase is ready to collect and share the delivery access. The enquiry should include any assembly or handling uncertainty before the collection is confirmed."
      },
      {
        "question": "Does a parking space near my Kilmarnock flat mean the van can load there?",
        "answer": "Check the restrictions and the suitability of the space for the vehicle and loading task. Describe the route from that space to your entrance, including any road crossing, shared stairs or narrow passage. A nearby space does not establish direct access to the flat."
      },
      {
        "question": "Can I request a move from Kilmarnock to a rural Ayrshire address?",
        "answer": "Request a quote with the complete destination and inventory. Add directions to the property entrance and photos of any narrow drive or restricted turning area. The route, access and availability need to be assessed before the booking is confirmed."
      }
    ]
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
    metaDescription: "Man and van enquiries in Oban for furniture and household moves. Confirm your route, access and any ferry requirement before booking.",
    moveAdvice: [
      {
        "title": "Separate an Oban address from an onward ferry journey",
        "body": "State whether the job ends at a property in Oban or continues to an island. For a ferry-dependent enquiry, identify the island, both property addresses and any proposed sailing arrangements before making a booking. The vehicle, crossing and onward delivery require separate assessment; an Oban collection does not by itself confirm an island service."
      },
      {
        "title": "Check vehicle clearance before choosing a waiting place",
        "body": "Do not select an Oban car park from its location alone. The council directory distinguishes ordinary spaces from coach and lorry parking, and flags a height restriction and possible event closures at Corran Halls 1. Check the proposed vehicle against the current site restrictions, and keep the waiting location separate from the property's loading plan.",
        "source": {
          "label": "Argyll and Bute Council: Oban car parks",
          "href": "https://www.argyll-bute.gov.uk/roads-and-travel/car-parks-and-parking/car-parks-oban-lorn-and-isles"
        }
      },
      {
        "title": "Include the final approach beyond the waterfront",
        "body": "For an Oban home with a sloping drive, external steps or access from a lane, send details of the whole carrying route. Mainland moves can be quoted to destinations across Scotland, England and Wales. Give the exact delivery address and key handover constraints so the route, date and vehicle capacity can be assessed alongside the access at either end."
      }
    ],
    faqs: [
      {
        "question": "Is an island delivery included when I request an Oban move?",
        "answer": "An island or ferry leg needs to be stated and assessed separately. Provide the full route and proposed crossing arrangements at the enquiry stage. Do not treat a mainland quote as confirmation of ferry space, an island route or onward availability."
      },
      {
        "question": "Can a removal van wait in any Oban council car park?",
        "answer": "Use the council directory and the signs at the chosen site to check vehicle suitability and current conditions. Some locations have clearance or other restrictions. A place suitable for waiting may still be too far from the property to serve as the loading point."
      },
      {
        "question": "What should I send for an Oban property reached by steps or a steep drive?",
        "answer": "Send photos from the proposed stopping point to the entrance, with the number of steps and any narrow sections or turns. Include the largest item dimensions and describe the surface and driveway access so the handling requirements can be reviewed before confirmation."
      }
    ]
  },
  // Borders & South West
  {
    slug: "dumfries",
    name: "Dumfries",
    region: "Borders & South West",
    postcode: "DG1, DG2",
    headline: "Man and Van in Dumfries",
    description:
      "For a Dumfries move, describe both property access routes along with the load. Include narrow approaches, turning space, steps and any long carry from the van. We accept moves within Scotland and from Dumfries to destinations across Britain; provide both full postcodes when requesting your quote.",
    highlights: [
      "Household and furniture moving enquiries",
      "Rural access details considered",
      "Longer routes confirmed before booking"
    ],
    nearbyAreas: ["carlisle", "ayr", "kilmarnock", "stranraer"],
    metaDescription: "Man and van enquiries in Dumfries for furniture and home moves. Request a quote using the full route, inventory and property access details.",
    moveAdvice: [
      {
        "title": "Whitesands and Greensands access planning",
        "body": "For a move near Whitesands or Greensands, check the council's current project updates before settling the loading position. The flood protection programme includes phased parking and access changes. Give the precise property entrance and any route supplied by the building manager, then confirm the arrangements again near the moving date rather than relying on an older parking location.",
        "source": {
          "label": "Dumfries and Galloway Council Whitesands project updates",
          "href": "https://www.dumfriesandgalloway.gov.uk/whitesands-project-updates"
        }
      },
      {
        "title": "Disc parking is separate from a removal loading plan",
        "body": "Dumfries has visitor disc-parking arrangements with the permitted stay shown at the location. For a house or furniture move, do not treat a visitor parking option as confirmation that the van can remain for the whole job. Check the signs and ask the council about the proposed loading task, then include the approved position and carrying distance in the quote.",
        "source": {
          "label": "Council guidance on visitor parking in Dumfries",
          "href": "https://www.dumfriesandgalloway.gov.uk/roads-transport-parking/parking/visitor-parking-dumfries-langholm-stranraer"
        }
      },
      {
        "title": "Dumfries removals into England and Wales",
        "body": "A Dumfries-origin move can travel to any destination in Britain. Whether the delivery is in Carlisle or much further into England or Wales, provide the complete destination and inventory rather than only a region. Agree when keys will be available, identify any intermediate collection and include destination access so the quote covers loading, travel and unloading together."
      }
    ],
    faqs: [
      {
        "question": "Do you move from Dumfries to England and Wales?",
        "answer": "Yes. Moves originating in Dumfries are available to quote across Britain. Give the full addresses, inventory and preferred dates so suitable capacity, crew and collection and delivery arrangements can be confirmed."
      },
      {
        "question": "How do Whitesands works affect a removal?",
        "answer": "The effect depends on the property and moving date. Check the council's latest access information and share any building instructions with the team. Confirm a practical loading point and carrying route before the booking is finalised."
      },
      {
        "question": "Is a Dumfries visitor parking disc enough for a house move?",
        "answer": "It does not establish the loading arrangements for the entire job. Check the signs for the location and ask the council if the proposed removal needs a different permission. Agree who handles any application before the move."
      }
    ]
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
    metaDescription: "Man and van in Galashiels for furniture and household moves. Share your route, load and access details to check options for your preferred date.",
    moveAdvice: [
      {
        "title": "Town-centre parking and the actual loading place",
        "body": "For a collection near Galashiels High Street, Hall Place or Ladhope Vale, identify the property entrance and where the van will load. Scottish Borders Council's permit guidance explains that a permit or season ticket does not guarantee a space. Check the current arrangements for the specific location and vehicle, and do not assume a nearby car park can serve as a reserved removal bay.",
        "source": {
          "label": "Scottish Borders Council parking permit guidance",
          "href": "https://www.scotborders.gov.uk/parking/parking-permits/3"
        }
      },
      {
        "title": "Galashiels furniture and business handovers",
        "body": "For furniture collected from a Galashiels shop, office or private seller, establish who can release the goods and whether access is through the public entrance or another door. List desks, chairs, cabinets and loose parts separately. Include any stairs and agree dismantling in advance so a business collection is assessed on its contents rather than described only as an office move."
      },
      {
        "title": "Borders collections with an onward delivery",
        "body": "If a Galashiels move also collects belongings in Melrose or another Borders town, give each stop a separate item list and access contact. Moves originating in Scotland can be quoted to destinations across Britain. Include the final handover time and any rural approach at the destination so additional collections do not leave the delivery arrangements unresolved."
      }
    ],
    faqs: [
      {
        "question": "Will a Galashiels parking permit guarantee a place for the removal van?",
        "answer": "No. Scottish Borders Council states that its permit or season ticket does not guarantee a parking space. Check the actual loading location, vehicle suitability and any permission needed before the move is confirmed."
      },
      {
        "question": "Can you collect from Galashiels and another Borders address?",
        "answer": "Yes. Provide all addresses, the items at each stop and the access windows. The collection order and largest combined load need to be included when the van and crew are planned."
      },
      {
        "question": "Can a Galashiels house move go beyond Scotland?",
        "answer": "Yes. We quote moves starting in Galashiels to destinations throughout Britain, including England and Wales. Share the complete inventory and destination access so the route, date and delivery window can be agreed."
      }
    ]
  }
];

export const AREAS: Area[] = [
  ...EXISTING_AREAS,
  ...EXPANSION_TOWNS_1,
  ...EXPANSION_TOWNS_2,
  ...EXPANSION_TOWNS_3,
  ...EXPANSION_TOWNS_4,
];

export function getAreaBySlug(slug: string): Area | undefined {
  return AREAS.find((area) => area.slug === slug);
}

export const FEATURED_AREAS = AREAS.filter(
  (area, index) => index < 10 || ["aberdeen", "inverness"].includes(area.slug)
);
