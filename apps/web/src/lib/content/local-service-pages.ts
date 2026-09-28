import { AREAS, type Area } from "@/lib/areas";
import { SERVICES } from "@/lib/services";
import {
  LOCAL_SERVICE_PAGES as AUTHORED_CITY_SERVICE_PAGES,
  type LocalServicePage,
} from "./city-service-pages";
import { TOWN_SERVICE_PAGES_1 } from "./town-service-pages-1";

export type LocalServicePageServiceSlug =
  | "house-removal"
  | "flat-removals"
  | "furniture-delivery"
  | "storage-transport"
  | "office-removal"
  | "business-removals"
  | "man-and-van"
  | "student-move"
  | "small-moves"
  | "packing-service";

export const LOCAL_SERVICE_PAGE_SERVICE_SLUGS: readonly LocalServicePageServiceSlug[] = [
  "house-removal",
  "flat-removals",
  "furniture-delivery",
  "storage-transport",
  "office-removal",
  "business-removals",
  "man-and-van",
  "student-move",
  "small-moves",
  "packing-service",
];

const TARGET_REGIONS = new Set([
  "Greater Glasgow",
  "Edinburgh & Lothians",
  "Highlands",
  "Grampian",
  "Tayside & Fife",
  "Highlands and Islands",
]);

const EXTRA_GLASGOW_LINKED_AREAS = new Set([
  "east-kilbride",
  "hamilton",
]);

const SKYE_LOCALITY_AREAS = new Set([
  "isle-of-skye",
  "portree",
  "broadford",
]);

function isTargetArea(area: Area): boolean {
  return TARGET_REGIONS.has(area.region) || EXTRA_GLASGOW_LINKED_AREAS.has(area.slug);
}

export function localExpansionGroup(area: Area): string {
  if (SKYE_LOCALITY_AREAS.has(area.slug)) return "Isle of Skye";
  if (area.region === "Greater Glasgow" || EXTRA_GLASGOW_LINKED_AREAS.has(area.slug)) return "Glasgow";
  if (area.region === "Edinburgh & Lothians") return "Edinburgh";
  if (area.region === "Grampian") return "Aberdeen";
  if (["dundee", "broughty-ferry", "carnoustie", "arbroath", "forfar", "montrose", "brechin", "kirriemuir"].includes(area.slug)) return "Dundee";
  if (area.region === "Tayside & Fife") return "Perth";
  if (["fort-william", "caol", "mallaig", "oban"].includes(area.slug)) return "Fort William";
  if (area.region === "Highlands") return "Inverness";
  return area.region;
}

export const TARGET_LOCAL_SERVICE_AREAS: readonly Area[] = AREAS.filter(isTargetArea);

const SERVICE_SLUGS = new Set(SERVICES.filter((service) => service.indexable !== false).map((service) => service.slug));

function firstSource(area: Area): { label: string; href: string } | undefined {
  return area.moveAdvice?.find((entry) => entry.source)?.source;
}

function areaAccessSummary(area: Area): string {
  const advice = area.moveAdvice?.[0]?.body;
  if (advice) return advice;
  return `Use the full ${area.name} address, postcode where available, property entrance and any stairs, lifts, parking or long-carry details before booking.`;
}

interface ServiceTemplate {
  heading: string;
  noun: string;
  introduction: string;
  scope: string;
  access: string;
  quote: string;
  faqQuestion: string;
  faqAnswer: string;
}

const SERVICE_TEMPLATES: Record<LocalServicePageServiceSlug, ServiceTemplate> = {
  "house-removal": {
    heading: "House removals",
    noun: "house removal",
    introduction:
      "Plan the full household load, including rooms, loft, garage, garden items, key timings and anything that needs packing or dismantling.",
    scope:
      "Use this page for house removals, home removals, residential removals, domestic removals and full-house moving enquiries. Bedroom count helps start the conversation, but the quote needs the actual furniture, boxes, access and route.",
    access:
      "Include driveway width, street loading, stairs, garden paths, sheds and any key handover deadline. A two-bedroom move and a four-bedroom move can need very different van space and crew time.",
    quote:
      "Start the quote as House removals so the booking opens with room-by-room inventory. Add packing, assembly or extra helper needs before choosing the date.",
    faqQuestion: "Is a bedroom count enough for a house removal quote?",
    faqAnswer:
      "No. Add the rooms, boxes, furniture, garage or garden contents, access and route. The bedroom count is only a starting point for the room planner.",
  },
  "flat-removals": {
    heading: "Flat removals",
    noun: "flat removal",
    introduction:
      "Plan studio, apartment, shared-flat and one or two-bedroom flat moves around the real route from the room to the van.",
    scope:
      "Use this page for flat removals, apartment removals, studio flat removals, one-bedroom flat removals and two-bedroom flat removals. Shared stairs, lifts, managed entrances and loading distance often matter as much as the number of rooms.",
    access:
      "Record floor levels, lift size, stair turns, entry systems and the lawful loading point at both addresses. Keep communal spaces clear and label belongings by destination when housemates have different loads.",
    quote:
      "Start the quote with the flat removal page so the booking preserves the specific service name while using the room planner where it is helpful.",
    faqQuestion: "Can a flat move use a man and van booking?",
    faqAnswer:
      "Yes. The booking uses the compatible man-and-van service behind the scenes, while preserving the flat-removal service name and room-planning context for your quote.",
  },
  "furniture-delivery": {
    heading: "Furniture delivery",
    noun: "furniture delivery",
    introduction:
      "Arrange furniture collection and delivery for sofas, beds, wardrobes, tables, marketplace purchases and other bulky pieces.",
    scope:
      "Use this page for furniture removals, furniture movers, furniture courier work, single-item delivery, sofa delivery, bed collection, mattress delivery, wardrobe collection, second-hand furniture delivery and Facebook Marketplace, Gumtree or eBay collection.",
    access:
      "Send item dimensions, photos where useful, seller or retailer release details and access at both ends. Check that the item fits through doors, stairs, lifts and the intended receiving room before collection.",
    quote:
      "Start the quote as Furniture so the booking opens with item inventory, collection and delivery labels and bulky-item context.",
    faqQuestion: "Can you collect from a private seller or marketplace listing?",
    faqAnswer:
      "Yes, when the seller has agreed the handover and the item details are clear. Provide the collection address, release window, item size and destination access.",
  },
  "storage-transport": {
    heading: "Storage transport",
    noun: "storage transport",
    introduction:
      "Move boxes, furniture and student belongings into or out of a booked storage unit. This is transport only, not storage-space rental.",
    scope:
      "Use this page for storage collection and delivery, storage removals, furniture transport to storage, moving furniture into storage, collection from a storage unit, delivery to a storage unit, self-storage transport and student storage transport.",
    access:
      "Provide the storage facility address, unit floor, opening hours, lift or trolley access, release process and the home access at the other end. Separate items going to storage from items going to the final address.",
    quote:
      "Start the quote as Storage so pricing uses the storage transport intent and item inventory rather than a generic move.",
    faqQuestion: "Do you supply the storage unit?",
    faqAnswer:
      "No. Book the unit separately with your storage provider, then request transport using the facility address, access details and inventory.",
  },
  "office-removal": {
    heading: "Office removals",
    noun: "office removal",
    introduction:
      "Move desks, chairs, filing cabinets and boxed office equipment with building access and handover planned before the date.",
    scope:
      "Use this page for office removals, office relocation, office movers, small office removals, office furniture removals, office equipment moving, office relocation quotes and weekend office removals.",
    access:
      "Confirm loading bays, goods lifts, security procedures, permitted moving hours and the destination layout. Your IT provider should handle backups, disconnection and reconnection unless separately arranged.",
    quote:
      "Start the quote as Office so the booking keeps office labels, item inventory and access prompts.",
    faqQuestion: "Are shop and commercial moves included on the office page?",
    faqAnswer:
      "Use Business removals for shops, studios, stock rooms and wider commercial relocations. Office removals are for workplace desks, chairs, files and office equipment.",
  },
  "business-removals": {
    heading: "Business removals",
    noun: "business removal",
    introduction:
      "Plan commercial moves for shops, studios, business furniture, display items, suitable stock and business equipment.",
    scope:
      "Use this page for business removals, commercial removals, business relocation, commercial relocation, shop relocation, retail removals, business equipment transport, commercial furniture delivery and business relocation quotes.",
    access:
      "Give the premises contact, release point, loading bay, service entrance, access window, destination layout and any stock or display items needing special care. Specialist machinery and regulated goods need separate assessment.",
    quote:
      "Start the quote as Business removals so the booking uses the distinct business intent, business inventory labels and commercial-access context.",
    faqQuestion: "How is business removals different from office removals?",
    faqAnswer:
      "Office removals focus on desks, chairs and office equipment. Business removals cover wider commercial moves such as shops, studios, business furniture, display pieces and suitable stock.",
  },
  "man-and-van": {
    heading: "Man and van",
    noun: "man and van move",
    introduction:
      "Book van-with-driver help for smaller loads, single rooms, marketplace collections, storage runs and flexible local transport.",
    scope:
      "Use this page for man and van, man with a van, man with van, van and man, man & van, two men and a van, Luton van with driver, local man and van and man and van removals.",
    access:
      "List every item and stop, then describe stairs, lifts, loading distance and parking. A short journey can still need extra lifting help if the access or item size is difficult.",
    quote:
      "Start the quote as Man and Van so the booking keeps flexible item inventory and general transport context.",
    faqQuestion: "Can man and van include two movers?",
    faqAnswer:
      "Extra helper options can be added where available. Describe heavy or awkward items before booking so the right crew can be assessed.",
  },
  "student-move": {
    heading: "Student moves",
    noun: "student move",
    introduction:
      "Move student belongings between halls, shared flats, family homes and storage with tenancy and key timing included.",
    scope:
      "Use this page for student removals, student movers, student man and van, university removals, student accommodation removals, student room moves and student storage transport.",
    access:
      "Provide the halls or flat address, room or block, floor, lift or stair details, check-in or check-out time and any storage stop between tenancies.",
    quote:
      "Start the quote as Student moves so the booking keeps student-specific labels and smaller-load context.",
    faqQuestion: "Can student belongings go into storage first?",
    faqAnswer:
      "Yes. Include the storage facility address, opening hours, unit access and which items go there before any later delivery.",
  },
  "small-moves": {
    heading: "Small moves",
    noun: "small move",
    introduction:
      "Move a few items, a single room, a partial load or bulky pieces without booking a full-house removal.",
    scope:
      "Use this page for small removals, small moves, small-load removals, single-room removals and part-load removals. It can also suit a few boxes, a bed, a sofa or a combined furniture and storage run.",
    access:
      "Small describes the load, not always the lifting effort. Send item dimensions, access details and any extra stop before the vehicle and crew are planned.",
    quote:
      "Start the quote from this page so the booking preserves the small-move service name while using compatible item or room inventory.",
    faqQuestion: "Is a single bulky item a small move?",
    faqAnswer:
      "Often, yes. A large sofa or wardrobe can still need two people and careful access planning, so provide measurements and stair or lift details.",
  },
  "packing-service": {
    heading: "Packing help",
    noun: "packing service",
    introduction:
      "Plan packing help for house, flat, office or student moves where packing is part of the agreed moving scope.",
    scope:
      "Use this page for packing and moving services, house packing service, packing services for moving, removals with packing service, furniture dismantling and reassembly and furniture assembly and delivery where available by quote.",
    access:
      "Separate full packing, fragile-only packing, dismantling, assembly and materials. Keep essentials with you and leave safe working space before loading day.",
    quote:
      "Start the quote with the packing page when packing is part of the move; the booking opens with house-removal context so room and packing details can be captured.",
    faqQuestion: "Can I book packing without a move?",
    faqAnswer:
      "Packing is normally quoted as part of a suitable move. State which rooms or fragile items need help and what you will pack yourself.",
  },
};

function buildLocalServicePage(area: Area, serviceSlug: LocalServicePageServiceSlug): LocalServicePage {
  const template = SERVICE_TEMPLATES[serviceSlug];
  const service = SERVICES.find((entry) => entry.slug === serviceSlug);
  const source = firstSource(area);
  const group = localExpansionGroup(area);
  const routePhrase = group === area.name ? area.name : `${area.name} and the ${group} service area`;

  return {
    areaSlug: area.slug,
    serviceSlug,
    title: `${template.heading} in ${area.name}`,
    description: `${template.heading} in ${area.name}. Plan ${template.noun} quotes around inventory, access, route, loading details and the correct booking service.`,
    introduction: `${template.introduction} For ${routePhrase}, provide the real collection and delivery details rather than a broad place name.`,
    sections: [
      {
        title: `${template.heading} scope in ${area.name}`,
        body: `${template.scope} ${area.description}`,
      },
      {
        title: "Access and route details to include",
        body: `${template.access} ${areaAccessSummary(area)}`,
        ...(source ? { source } : {}),
      },
      {
        title: "Quote and booking route",
        body: `${template.quote} Prices depend on the route distance in miles, inventory, stairs, carry distance, crew, date and agreed extras. Same-day, urgent or weekend timing is checked against the actual job and available capacity.`,
      },
    ],
    faqs: [
      {
        question: template.faqQuestion,
        answer: template.faqAnswer,
      },
      {
        question: `What should I include for ${service?.name ?? template.heading} in ${area.name}?`,
        answer:
          "Include both addresses, postcode where available, item list, floor levels, lifts, parking or loading notes, preferred date and any packing, dismantling, assembly or extra helper request.",
      },
    ],
  };
}

const targetAreaSlugs = new Set(TARGET_LOCAL_SERVICE_AREAS.map((area) => area.slug));
const localServiceSlugSet = new Set(LOCAL_SERVICE_PAGE_SERVICE_SLUGS);
const reviewedTownPages = TOWN_SERVICE_PAGES_1.filter(
  (page) => targetAreaSlugs.has(page.areaSlug) && localServiceSlugSet.has(page.serviceSlug as LocalServicePageServiceSlug),
);

const GENERATED_LOCAL_SERVICE_PAGES = TARGET_LOCAL_SERVICE_AREAS.flatMap((area) =>
  LOCAL_SERVICE_PAGE_SERVICE_SLUGS.flatMap((serviceSlug) =>
    SERVICE_SLUGS.has(serviceSlug) ? [buildLocalServicePage(area, serviceSlug)] : [],
  ),
);

function dedupeLocalServicePages(pages: readonly LocalServicePage[]): LocalServicePage[] {
  const seen = new Set<string>();
  const result: LocalServicePage[] = [];

  for (const page of pages) {
    const key = `${page.areaSlug}/${page.serviceSlug}`;
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(page);
  }

  return result;
}

export const LOCAL_SERVICE_PAGES: readonly LocalServicePage[] = dedupeLocalServicePages([
  ...AUTHORED_CITY_SERVICE_PAGES,
  ...reviewedTownPages,
  ...GENERATED_LOCAL_SERVICE_PAGES,
]);
