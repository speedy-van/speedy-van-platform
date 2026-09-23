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
    metadataTitle: "Man and Van & Removals in Aberdeen",
    introduction:
      "Moving a sofa across Aberdeen, leaving a shared flat or planning a business relocation? Choose the service that matches your load, then describe both addresses. A man with a van can suit a smaller move; a whole property needs an inventory and a plan for access and lifting.",
    services: [
      {
        slug: "man-and-van",
        description:
          "For manageable loads and flexible collections. Tell us what needs lifting, whether you can help and where the van can stop so the quote allows for the right support.",
      },
      {
        slug: "furniture-delivery",
        description:
          "Collecting a sofa, bed or wardrobe from a seller or shop? Provide dimensions, collection arrangements and the destination floor, including whether the item needs dismantling to fit.",
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
        question: "How far ahead should I arrange a flat removal?",
        answer:
          "Enquire once you know the likely date and addresses, and explain any uncertainty about keys. Check availability before committing to a handover time; a quote request alone does not confirm a booking.",
      },
      {
        question: "Does an office move include reconnecting equipment?",
        answer:
          "Describe the equipment when requesting the quote. Transport, dismantling and technical setup are different tasks; confirm exactly what is agreed and arrange any specialist IT work separately unless expressly included.",
      },
    ],
  },
  inverness: {
    metadataTitle: "Man and Van & Removals in Inverness",
    introduction:
      "An Inverness move might mean one furniture collection, a change of flat or a household travelling further into the Highlands. Match the quote to the complete journey. Whether you call it man and van or van and man, the important details are the load, lifting help and access at each end.",
    services: [
      {
        slug: "man-and-van",
        description:
          "For smaller loads and individual collections, provide an item list and the full route. Ask what loading help is included and which crew arrangement suits your access.",
      },
      {
        slug: "furniture-delivery",
        description:
          "Arrange a furniture collection with the seller before choosing a slot. Share item measurements, whether pieces are assembled and any narrow entrance or staircase at the delivery address.",
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
        question: "Can a student move be arranged around a room handover?",
        answer:
          "Include the accommodation's check-out or arrival time in your enquiry. Check its loading arrangements and whether keys must be collected first, then agree a suitable available collection and delivery window.",
      },
      {
        question: "How long will my Inverness move take?",
        answer:
          "The load, number of floors, carry distance and full journey all matter. Share these details for a realistic allowance. A few items with difficult access can take longer than a larger, straightforward collection.",
      },
    ],
  },
};

export function getAreaGuide(slug: string): AreaGuide | undefined {
  return Object.prototype.hasOwnProperty.call(AREA_GUIDES, slug)
    ? AREA_GUIDES[slug]
    : undefined;
}
