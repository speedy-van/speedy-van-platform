import type { ServiceFaq } from "@/lib/services";

interface AreaGuideService {
  slug: string;
  description: string;
}

interface AreaGuideSection {
  id: string;
  title: string;
  paragraphs: string[];
  checklist?: string[];
  reference?: { href: string; label: string };
}

export interface AreaGuide {
  metadataTitle: string;
  introduction: string;
  services: AreaGuideService[];
  sections: AreaGuideSection[];
  bookingSteps: { title: string; description: string }[];
  faqs: ServiceFaq[];
}

const AREA_GUIDES: Record<string, AreaGuide> = {
  aberdeen: {
    metadataTitle: "Man and Van Aberdeen | Get a Moving Quote",
    introduction:
      "Hire a man with a van in Aberdeen for a furniture collection or smaller load, or plan a house, flat or office removal around the full inventory. From a sofa bought from a seller to the contents of a shared home, start with the service below and request a price for your items, route and lifting help.",
    services: [
      {
        slug: "man-and-van",
        description:
          "For manageable loads and flexible collections. Tell us what needs lifting, whether you can help and where the van can stop so the quote allows for the right support.",
      },
      {
        slug: "furniture-delivery",
        description:
          "Furniture collection and delivery for sofas, tables, chairs, beds and wardrobes. Share measurements, the seller's collection window and the destination floor so the lifting and access can be planned.",
      },
      {
        slug: "house-removal",
        description:
          "For a full-house move, list every room and any garage or garden items. Include key collection times and the unloading plan before agreeing vehicle capacity and crew requirements.",
      },
      {
        slug: "flat-removals",
        description:
          "Apartment and studio moves need more than a floor number. Describe shared entrances, stair turns, lift size and the walk from the building to the loading point.",
      },
      {
        slug: "office-removal",
        description:
          "Plan office or business removals around building access, desks, equipment and the agreed handover. Identify items requiring specialist handling and confirm what packing or dismantling is included.",
      },
      {
        slug: "small-moves",
        description:
          "A few boxes, bedroom furniture or a storage collection can be quoted as a smaller load. Include every stop and bulky item so the planned capacity is realistic.",
      },
      {
        slug: "long-distance-removals",
        description:
          "For a move to or from Aberdeen, provide the full route and delivery window. Availability beyond the city depends on the addresses, load and date being assessed.",
      },
      {
        slug: "student-move",
        description:
          "Moving between halls, a shared flat and home? List boxes and furniture separately, check the residence loading arrangements and agree collection around your room handover.",
      },
    ],
    sections: [
      {
        id: "moving-costs",
        title: "Planning a lower-cost man and van move in Aberdeen",
        paragraphs: [
          "For a smaller Aberdeen flat move, list only the items travelling with you and have boxes packed before the agreed collection. Separate your belongings from a housemate's and check whether a bed or table can be prepared in advance. These details help plan the load and time needed.",
          "If your date or seller's collection window is flexible, include the options in your quote request. Choose lifting help around the furniture and stairs: reducing the crew is not a useful saving if the load cannot be moved safely.",
        ],
      },
      {
        id: "furniture-collection",
        title: "Furniture movers in Aberdeen: sofas, tables, chairs and beds",
        paragraphs: [
          "Buying a sofa from a private seller or collecting a dining set from a shop? Agree when the items will be ready and send a complete list, including matching chairs, cushions or bed parts. For an upper-floor delivery, measure the largest piece against the shared entrance and stair turns before arranging collection.",
          "Tell us whether the seller can dismantle an item or whether you need that work included in the enquiry. Keep fixings with the furniture and identify fragile glass or loose panels so handling can be planned.",
        ],
      },
      {
        id: "urgent-moves",
        title: "Need an urgent man and van in Aberdeen?",
        paragraphs: [
          "For a short-notice flat move or a seller who needs furniture collected soon, send both addresses, the item list and the latest collection time together. Include the floor and loading point so the enquiry can be assessed without missing access details.",
          "Call to discuss the deadline if it is urgent. Same-day or next-day moves depend on a suitable vehicle, crew and slot being available; confirm the collection before promising a handover time.",
        ],
      },
      {
        id: "long-distance",
        title: "Long-distance man and van from Aberdeen",
        paragraphs: [
          "A small load leaving Aberdeen for another Scottish city needs a plan for arrival as well as departure. Provide the destination postcode, key handover time and any final stop at storage. Furniture and boxes for different stops should be identified in the inventory.",
          "For a flat-to-flat journey, share the stairs or lift details at both ends. Ask for the complete route and handling to be included in the quote, then agree the available collection and delivery window.",
        ],
      },
      {
        id: "access",
        title: "Parking, shared stairs and access in Aberdeen",
        paragraphs: [
          "Check the collection street and the destination before requesting a quote. A space near the entrance can change, and a residents' permit does not reserve a bay or override parking restrictions. Read the signs for the actual loading point and tell us about any building arrangements.",
          "Measure awkward furniture against doorways and stair turns. For a flat above ground level, give the floor, whether the lift is suitable and the approximate carry distance. Office premises may also require loading-bay access to be arranged with building management.",
        ],
        checklist: [
          "Share access details for both addresses, including entry codes when arranging the move.",
          "Flag restricted loading times, long carries and any change of floor.",
          "Confirm any parking permission with the council or property manager responsible.",
        ],
        reference: {
          href: "https://sites.aberdeencity.gov.uk/Council-Services/roads-parking-and-travel/residential-parking-permits",
          label: "Aberdeen City Council parking permit guidance",
        },
      },
      {
        id: "quote",
        title: "What your Aberdeen moving quote needs to cover",
        paragraphs: [
          "The useful comparison is the price for your complete job: load, route in miles, crew, time and access. Ask which vehicle and lifting support suit the inventory, whether the quote is hourly or fixed, and whether a minimum charge applies.",
          "Confirm collection, loading, transport and unloading in the agreed scope. Ask separately about packing materials, dismantling, reassembly, waiting, extra stops and parking costs. Disposal, appliance disconnection and specialist lifting should not be assumed to be part of a standard move. Agree any extra work before booking.",
        ],
      },
    ],
    bookingSteps: [
      {
        title: "Describe the move",
        description:
          "Enter both addresses, your preferred date and a complete item list, including heavy or awkward pieces.",
      },
      {
        title: "Check the scope",
        description:
          "Explain stairs, parking and collection deadlines. Review the proposed crew, vehicle, price and any additional work.",
      },
      {
        title: "Confirm the arrangements",
        description:
          "Agree the available slot and booking details before coordinating keys, sellers or building access.",
      },
    ],
    faqs: [
      {
        question: "Can I book a man and van for one item in Aberdeen?",
        answer:
          "Request a quote with the item dimensions, both addresses and any stairs. A single large sofa can require more lifting support than several boxes, so describe the access as well as the load.",
      },
      {
        question: "Can you quote for Aberdeen to another city?",
        answer:
          "Yes, you can request an intercity quote. Give the destination postcode, full inventory and required delivery date. The route and available capacity need confirmation before you rely on a particular slot.",
      },
      {
        question: "How much does a man and van in Aberdeen cost?",
        answer:
          "Request a price using your full item list, both addresses and access details. The load, journey, lifting help and handling time affect the quote. Compare the included work and ask whether the price is hourly or fixed and whether a minimum charge applies.",
      },
      {
        question: "Can I request an urgent or same-day Aberdeen collection?",
        answer:
          "Yes, send the item list, addresses and latest collection time, or call to discuss a short-notice enquiry. Same-day availability is not guaranteed. A suitable slot, vehicle and lifting help must be confirmed before the collection is booked.",
      },
    ],
  },
  inverness: {
    metadataTitle: "Man and Van Inverness | Get a Moving Quote",
    introduction:
      "Looking for a man with a van in Inverness? Request a quote for a furniture collection, student room, flat or full-house removal. Choose the service for your load and describe the complete journey, including any onward Highland address. Whether you need a van and man for a few items or more lifting help for a home move, the plan starts with your inventory.",
    services: [
      {
        slug: "man-and-van",
        description:
          "For smaller loads and individual collections, provide an item list and the full route. Ask what loading help is included and which crew arrangement suits your access.",
      },
      {
        slug: "furniture-delivery",
        description:
          "Collect sofas, tables, chairs and beds from a seller or shop in Inverness. Include every piece, its measurements and the delivery address, with any gate, narrow entrance or staircase on the way in.",
      },
      {
        slug: "house-removal",
        description:
          "For a whole-home move, include cupboards, outdoor items and storage spaces in the inventory. Discuss the required capacity, crew and key handover before settling the schedule.",
      },
      {
        slug: "flat-removals",
        description:
          "Studios and apartments need a clear access plan. Give both floor numbers, lift details and the distance from a suitable loading point to each entrance.",
      },
      {
        slug: "office-removal",
        description:
          "For an office or small business relocation, list desks, boxed records and equipment. Agree access times and label destination rooms to make the planned unloading clear.",
      },
      {
        slug: "small-moves",
        description:
          "A room's contents, a storage transfer or several bulky items need a realistic load estimate. Mention additional stops and any furniture that cannot travel fully assembled.",
      },
      {
        slug: "long-distance-removals",
        description:
          "For a longer journey to or from Inverness, request assessment of the full route. Include the destination access and delivery deadline rather than estimating the job from mileage alone.",
      },
      {
        slug: "student-move",
        description:
          "Leaving halls or moving into a shared flat? Check room handover and vehicle access with the accommodation provider, then list boxes, bedding and any furniture needing transport.",
      },
    ],
    sections: [
      {
        id: "moving-costs",
        title: "Keep your Inverness man and van costs under control",
        paragraphs: [
          "When comparing low-cost man and van quotes, use an accurate load rather than a rough count of rooms. Group boxes by destination and include furniture from sheds or storage before requesting a quote. If a shop collection and a home collection are part of the same move, list both stops together.",
          "For a delivery beyond Inverness, confirm that someone can receive the items and open any gate when the van arrives. Good preparation helps avoid a preventable wait or an extra journey; ask what any change to the agreed route would cost.",
        ],
      },
      {
        id: "furniture-collection",
        title: "Furniture collection and delivery in Inverness",
        paragraphs: [
          "Use a furniture moving quote for a single sofa, a dining table and chairs, a bed or several larger pieces. Check the seller's collection arrangements, measure assembled items and explain where each piece will go at delivery. A mattress and a dismantled bed frame should both appear on the list.",
          "For delivery from Inverness to a rural property, include the entrance, turning space and distance to the door. Ask about dismantling or reassembly when requesting the quote so the planned work matches the furniture.",
        ],
      },
      {
        id: "urgent-moves",
        title: "Urgent man and van enquiries in Inverness",
        paragraphs: [
          "Need to leave a room at short notice or collect furniture before a seller's deadline? Give the earliest and latest collection times, the complete load and the delivery address. A city collection with an onward rural journey needs enough time for both parts.",
          "Call to discuss an urgent request and whether an alternative time could work. Same-day and next-day slots are subject to availability; confirm the route, crew and collection before finalising other arrangements.",
        ],
      },
      {
        id: "long-distance",
        title: "Long-distance man and van to or from Inverness",
        paragraphs: [
          "For an intercity move or a longer Highland journey, give the full destination rather than a broad area name. Include the number of stops, when the property will be accessible and whether delivery must fit around keys or a storage facility's opening times.",
          "Describe any narrow approach, vehicle-size limit or restricted turning space before the vehicle is selected. Route suitability and the available date are assessed together, with the quote based on the full load and journey in miles.",
        ],
      },
      {
        id: "access",
        title: "Plan Inverness loading and Highland access",
        paragraphs: [
          "For an Inverness loading point, check the signs rather than treating an empty bay as unrestricted parking. Highland Council explains that loading bays can specify operating times and vehicle types; they are for active loading and unloading. Tell us where the van can lawfully stop and how far items must be carried.",
          "If either address is outside the city, describe narrow approaches, gates, steep driveways, turning space and any limit on vehicle size. Supply the exact destination and a contact for access. A city collection does not by itself confirm that every onward Highland route or requested date is available.",
        ],
        checklist: [
          "Measure doors and stair turns for sofas, wardrobes and other awkward items.",
          "Report every floor, lift restriction and long carry at both properties.",
          "Check loading permissions and any timed access with the relevant property manager.",
        ],
        reference: {
          href: "https://www.highland.gov.uk/parking-fines-enforcement/good-parking-guidance/5",
          label: "Highland Council loading-bay guidance",
        },
      },
      {
        id: "quote",
        title: "Compare the full Inverness removal quote",
        paragraphs: [
          "Your inventory, distance in miles, access and handling time help determine the quote. Ask whether the proposed vehicle has suitable capacity, how much lifting help is included and whether the price is hourly or fixed. Confirm any minimum charge before comparing offers.",
          "Check that the agreed scope describes collection, loading, transport and unloading. Packing, dismantling, reassembly, waiting, parking and extra collection points may need separate agreement. Do not assume disposal, appliance disconnection or specialist handling is included. Tell us about unusually heavy or fragile items while the move is being assessed.",
        ],
      },
    ],
    bookingSteps: [
      {
        title: "Share both addresses",
        description:
          "Start with the collection, destination, preferred date and inventory, including anything kept outside the main rooms.",
      },
      {
        title: "Explain the access",
        description:
          "Add stairs, loading restrictions and rural approach details so the vehicle, crew and route can be assessed.",
      },
      {
        title: "Agree the move",
        description:
          "Review the price and included work, then confirm the available date before finalising collection and handover arrangements.",
      },
    ],
    faqs: [
      {
        question: "Can I request a furniture collection in Inverness?",
        answer:
          "Yes. Include the seller's collection address, agreed collection window, item dimensions and destination access. Ask about dismantling and lifting support before paying for an item that may be difficult to move.",
      },
      {
        question: "Do you assess moves beyond Inverness into the Highlands?",
        answer:
          "Provide the exact addresses and proposed date for assessment. Rural access, journey length, load and capacity affect what can be arranged. Confirm the route and slot before making dependent travel or handover plans.",
      },
      {
        question: "Can I request a same-day man and van in Inverness?",
        answer:
          "You can enquire about a short-notice move with your addresses, items and required collection window. Call if the deadline is urgent. Same-day service depends on a suitable slot and crew being available, including enough time for any onward journey.",
      },
      {
        question: "What affects the price of a man and van in Inverness?",
        answer:
          "The full route, load, lifting help and access affect the quote. An onward rural delivery, extra stop or long carry can change the work even with only a few items. Include these details and check the minimum charge, included time and any separately agreed packing or assembly.",
      },
    ],
  },
};

export function getAreaGuide(slug: string): AreaGuide | undefined {
  return Object.prototype.hasOwnProperty.call(AREA_GUIDES, slug)
    ? AREA_GUIDES[slug]
    : undefined;
}
