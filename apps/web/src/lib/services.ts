export interface ServiceFaq {
  question: string;
  answer: string;
}

export interface Service {
  slug: string;
  name: string;
  tagline: string;
  icon: string;
  description: string;
  longDescription: string;
  includes: string[];
  whyUs: string[];
  startingFrom: number;
  metaDescription: string;
  faqs: ServiceFaq[];
}

export const SERVICES: Service[] = [
  {
    slug: "man-and-van",
    name: "Man and Van",
    tagline: "The original flexible move solution",
    icon: "🚐",
    description: "A single driver and van, ready for any size job. Perfect for small moves, single-item pickups, and anything in between.",
    longDescription:
      "Our man and van service is the most flexible option in our range. Ideal for studio and one-bedroom flat moves, single-item collections, flat-pack furniture runs, and small clearances. You get a professional, insured driver and a clean van — you choose how many hours you need.",
    includes: [
      "Fully insured professional driver",
      "Clean, well-maintained van",
      "Loading and unloading assistance",
      "Furniture blankets for protection",
      "No hidden mileage charges within service area",
    ],
    whyUs: [
      "Transparent hourly pricing with no surprise add-ons",
      "Same-day bookings accepted when available",
      "Drivers vetted and background-checked",
    ],
    startingFrom: 45,
    metaDescription:
      "Flexible man and van hire from £45/hr. Professional, insured drivers available same-day. Get an instant quote.",
    faqs: [
      {
        question: "How many hours do I need for a man and van?",
        answer:
          "A studio or one-bed flat typically takes 2–4 hours depending on access and distance. We'll help you estimate before booking.",
      },
      {
        question: "Can I help with loading to save time?",
        answer:
          "Absolutely — many customers help load, which can reduce the time needed. Your driver is always happy to accept a hand.",
      },
      {
        question: "Is my stuff insured during the move?",
        answer:
          "Yes. All SpeedyVan moves include goods-in-transit insurance up to £10,000. Additional cover available on request.",
      },
    ],
  },
  {
    slug: "house-removal",
    name: "House Removal",
    tagline: "Your whole home, safely moved",
    icon: "🏠",
    description: "Full house removal service for properties of every size. We bring the van, the team, and the expertise.",
    longDescription:
      "Moving house is one of the most stressful life events — but it doesn't have to be. Our house removal service provides a team of two or more experienced movers, a large or Luton van, and a methodical approach to packing, loading, transporting, and unloading your entire home.",
    includes: [
      "2–3 person removal team",
      "Large or Luton van",
      "Furniture disassembly and reassembly",
      "Wardrobe boxes and furniture blankets",
      "Flexible dates including weekends",
    ],
    whyUs: [
      "Fixed-price quotes available for whole-house moves",
      "Pre-move survey for larger properties",
      "Full packing service available as an add-on",
    ],
    startingFrom: 120,
    metaDescription:
      "Professional house removal service from £120. Full team, large vans, furniture disassembly included. Book today.",
    faqs: [
      {
        question: "Do you provide boxes and packing materials?",
        answer:
          "We can supply boxes, bubble wrap, and tape for purchase or hire. Our full packing service takes care of everything for you.",
      },
      {
        question: "How far in advance should I book?",
        answer:
          "We recommend 2–4 weeks for weekend moves, especially at month ends. Weekday moves can sometimes be booked with shorter notice.",
      },
      {
        question: "What if the move takes longer than expected?",
        answer:
          "For hourly bookings we charge the actual time used. Fixed-price moves include reasonable delays at no extra cost.",
      },
    ],
  },
  {
    slug: "office-removal",
    name: "Office Removal",
    tagline: "Minimise downtime, maximise care",
    icon: "🏢",
    description: "Professional office relocation with minimal disruption to your business operations.",
    longDescription:
      "A business can't afford a long downtime window. Our office removal service is built around your schedule — out-of-hours moves, pre-labelled IT equipment handling, and a systematic room-by-room approach ensure your team is back at their desks as quickly as possible.",
    includes: [
      "Out-of-hours and weekend moves",
      "Desk, chair, and equipment disassembly",
      "Crate hire for files and small items",
      "IT equipment blanket-wrapping",
      "Certificate of insurance provided for building management",
    ],
    whyUs: [
      "Dedicated move manager for your project",
      "Risk assessment available for large offices",
      "Confidential document handling",
    ],
    startingFrom: 150,
    metaDescription:
      "Office removal service from £150. Out-of-hours moves, IT handling, and certificate of insurance provided.",
    faqs: [
      {
        question: "Can you move our servers and IT equipment?",
        answer:
          "We transport IT equipment with specialist wrapping and crates. We recommend IT staff disconnect and reconnect servers; we handle the physical move.",
      },
      {
        question: "Do you work out of hours to avoid disruption?",
        answer:
          "Yes — evening, overnight, and weekend moves are our most popular for office relocations. Early morning handover is available.",
      },
      {
        question: "How do you handle confidential documents?",
        answer:
          "We use sealed crates and a chain-of-custody process. Shredding services can be arranged separately if required.",
      },
    ],
  },
  {
    slug: "student-move",
    name: "Student Move",
    tagline: "Affordable moves for students",
    icon: "🎓",
    description: "Budget-friendly van hire designed for the student moving season. Quick, easy, and wallet-friendly.",
    longDescription:
      "Moving in at the start of term or out at the end shouldn't cost a fortune. Our student move service is priced to fit a student budget while still delivering a professional, insured service. We work with many UK universities and student accommodation providers.",
    includes: [
      "Compact van options for smaller loads",
      "Flexible start times from 7 AM",
      "Box and bag loading assistance",
      "Short-distance city moves at reduced rates",
      "Student discount on booking",
    ],
    whyUs: [
      "Specific student pricing — no padding",
      "Experience with halls of residence and shared houses",
      "Quick 1–2 hour move slots available",
    ],
    startingFrom: 80,
    metaDescription:
      "Affordable student van hire from £80. Quick moves, flexible hours, and student discounts. Book today.",
    faqs: [
      {
        question: "Do I need to be a registered student?",
        answer:
          "Our student move pricing is available to anyone moving student-volume loads (1–2 rooms of belongings), whether or not you're currently enrolled.",
      },
      {
        question: "Can I share a van with a housemate to split costs?",
        answer:
          "Yes — if you and a housemate are moving on the same day and in the same direction, we can often accommodate a combined load. Contact us to arrange.",
      },
      {
        question: "Do you move items into and out of storage?",
        answer:
          "Absolutely. We work with several storage facilities and can collect from or deliver to any storage unit.",
      },
    ],
  },
  {
    slug: "furniture-delivery",
    name: "Furniture Delivery",
    tagline: "Delivered safely, placed perfectly",
    icon: "🛋️",
    description: "Safe collection and delivery of furniture items from any UK retailer, seller, or private address.",
    longDescription:
      "Bought a sofa on Facebook Marketplace? Ordered a wardrobe from a retailer that doesn't offer home delivery? We collect from sellers, showrooms, and warehouses, and deliver carefully to your home — carrying items to any room and unpacking if required.",
    includes: [
      "Collection from any retailer, showroom, or private seller",
      "Protective blankets and strapping",
      "Room-of-choice placement",
      "Assembly available as an add-on",
      "Recycling of packaging waste",
    ],
    whyUs: [
      "Flexible collection windows to suit retailers",
      "Notification to recipient 30 mins before arrival",
      "Careful handling of oversized and awkward pieces",
    ],
    startingFrom: 60,
    metaDescription:
      "Furniture delivery service from £60. Collect from any retailer, room-of-choice placement, assembly available.",
    faqs: [
      {
        question: "Can you collect from IKEA or other large stores?",
        answer:
          "Yes — our IKEA Delivery & Assembly service handles collections from all IKEA stores. For other retailers, our standard furniture delivery covers it.",
      },
      {
        question: "Do you deliver on weekends?",
        answer:
          "Yes, seven days a week. Weekend deliveries are popular — book early to secure your preferred slot.",
      },
      {
        question: "What if the furniture doesn't fit?",
        answer:
          "We'll always advise if we think access might be an issue before booking. If an item genuinely can't fit, we'll return it safely and you won't pay for the second attempt.",
      },
    ],
  },
  {
    slug: "ikea-delivery",
    name: "IKEA Delivery & Assembly",
    tagline: "From the trolley to your living room",
    icon: "🔧",
    description: "We collect your IKEA order, deliver to your home, and assemble every piece. No Allen key required.",
    longDescription:
      "IKEA's delivery charges can be expensive and slow. Our IKEA service is faster, more flexible, and includes assembly. Give us your order receipt, we'll collect from your nearest IKEA, deliver to any room, and build everything to a professional standard — right down to fitting the drawer inserts.",
    includes: [
      "Collection from any UK IKEA store",
      "Delivery to any room in your home",
      "Full assembly of all flat-pack items",
      "Packaging disposal included",
      "Same-day collection and assembly available",
    ],
    whyUs: [
      "Faster than IKEA's own delivery service",
      "Flat-pack assembly expertise — every IKEA product",
      "One fixed price for collection, delivery, and assembly",
    ],
    startingFrom: 70,
    metaDescription:
      "IKEA delivery and assembly from £70. Collect, deliver, and build — all in one service. Book today.",
    faqs: [
      {
        question: "Do I need to be at IKEA when you collect?",
        answer:
          "No — you can pay for your order in advance via IKEA Click & Collect and give us the order number. We handle collection from the Click & Collect desk.",
      },
      {
        question: "Can you assemble PAX wardrobes and BILLY bookcases?",
        answer:
          "Yes, we assemble all IKEA products including PAX, PLATSA, BRIMNES, HEMNES, and all kitchen and bathroom units.",
      },
      {
        question: "What if an item is damaged or missing a part?",
        answer:
          "We inspect items on collection. If something's damaged we'll flag it immediately. For missing parts, IKEA will send replacements and we can return to complete assembly.",
      },
    ],
  },
  {
    slug: "rubbish-removal",
    name: "Rubbish Removal",
    tagline: "We take the mess, you keep the space",
    icon: "♻️",
    description: "Fast, eco-friendly clearance of household and commercial waste. We sort, recycle, and dispose responsibly.",
    longDescription:
      "Old furniture, building waste, garden rubbish, office equipment — we take it all. Our rubbish removal service is licensed, insured, and eco-conscious. We aim to divert over 80% of collected waste from landfill through recycling and donation partnerships.",
    includes: [
      "Licensed waste carrier — fully compliant",
      "Heavy lifting included",
      "Eco-responsible disposal and recycling",
      "All waste types except hazardous materials",
      "Waste transfer note provided on request",
    ],
    whyUs: [
      "80%+ landfill diversion rate",
      "Fast same-day slots for urgent clearances",
      "Fixed prices — no per-bag surprises",
    ],
    startingFrom: 90,
    metaDescription:
      "Licensed rubbish removal from £90. Eco-friendly, same-day available, waste transfer note provided.",
    faqs: [
      {
        question: "Can you remove old furniture and appliances?",
        answer:
          "Yes — sofas, mattresses, fridges, washing machines, and all household appliances. Electrical items are disposed of in compliance with WEEE regulations.",
      },
      {
        question: "Do you handle garden clearances?",
        answer:
          "Absolutely. We clear sheds, garages, and gardens — green waste, tools, broken furniture, and general clutter.",
      },
      {
        question: "Are you licensed waste carriers?",
        answer:
          "Yes. SpeedyVan holds an Environment Agency waste carrier licence. We can provide a waste transfer note for your records.",
      },
    ],
  },
  {
    slug: "piano-moving",
    name: "Piano Moving",
    tagline: "Protecting your most precious instrument",
    icon: "🎹",
    description: "Specialist piano moving for upright and grand pianos. Insured, careful, and experienced.",
    longDescription:
      "A piano is one of the heaviest, most fragile, and most valuable items in a home. Our piano moving team uses specialist equipment — piano boards, skate boards, and piano straps — combined with years of experience to move your instrument without a scratch or a flat note.",
    includes: [
      "Specialist piano board and strap equipment",
      "2–3 person trained piano team",
      "Internal stair and lift navigation",
      "Protective blanket wrapping",
      "Piano insurance cover included",
    ],
    whyUs: [
      "100+ pianos moved without a claim",
      "Experience with uprights, baby grands, and concert grands",
      "Pre-move survey for complex access situations",
    ],
    startingFrom: 200,
    metaDescription:
      "Specialist piano moving from £200. Trained team, specialist equipment, piano insurance included.",
    faqs: [
      {
        question: "Can you move a grand piano up stairs?",
        answer:
          "Yes — we assess staircase dimensions before booking and bring the appropriate equipment. For very grand pianos, a crane or window removal may be necessary; we'll advise in advance.",
      },
      {
        question: "Do I need to have the piano tuned after moving?",
        answer:
          "We recommend a tuning after any piano move. Pianos adjust to their new environment over 2–4 weeks; your piano tuner will advise the best timing.",
      },
      {
        question: "Do you move digital pianos too?",
        answer:
          "Yes, digital pianos and electric keyboards are treated with the same care. They're often lighter but still require careful handling.",
      },
    ],
  },
  {
    slug: "same-day-delivery",
    name: "Same Day Delivery",
    tagline: "Need it there today? Done.",
    icon: "⚡",
    description: "Urgent same-day courier and delivery service for parcels, documents, and items of any size.",
    longDescription:
      "When next-day simply isn't good enough, our same-day delivery service gets your items collected and delivered within hours. From legal documents to birthday gifts, replacement parts to furniture — if you need it there today, call us.",
    includes: [
      "Collection within 60 minutes of booking",
      "Real-time driver tracking",
      "Proof of delivery photo and signature",
      "Parcel and large item delivery",
      "Available 7 days a week, including bank holidays",
    ],
    whyUs: [
      "60-minute collection SLA",
      "Dedicated driver — no depot sorting",
      "Reliable for business-critical deliveries",
    ],
    startingFrom: 55,
    metaDescription:
      "Same-day delivery from £55. 60-min collection, real-time tracking, and proof of delivery. Book now.",
    faqs: [
      {
        question: "How quickly can you collect?",
        answer:
          "In most service areas, we aim to collect within 60 minutes of booking confirmation. Peak times may extend this slightly.",
      },
      {
        question: "What's the maximum size item you can deliver same-day?",
        answer:
          "We can handle anything up to Luton van size — that's approximately 14 feet of floor space. Call us for very large items.",
      },
      {
        question: "Do you deliver outside your listed areas?",
        answer:
          "Yes — for an additional distance fee, we cover all mainland UK. Call for a quote on long-distance same-day deliveries.",
      },
    ],
  },
  {
    slug: "packing-service",
    name: "Packing Service",
    tagline: "We pack it right, so nothing goes wrong",
    icon: "📦",
    description: "Professional packing using premium materials. Your belongings protected, catalogued, and ready to move.",
    longDescription:
      "Packing is the most time-consuming part of any move — and the most important for keeping your items safe. Our professional packers use double-wall boxes, specialist cell-packs for glasses and crockery, acid-free tissue for delicate items, and professional bubble wrap. Everything is labelled with contents and destination room.",
    includes: [
      "Professional-grade double-wall boxes",
      "Specialist glassware and china packs",
      "Acid-free tissue for delicate items",
      "Wardrobe boxes for hanging clothes",
      "Labelled inventory list on completion",
    ],
    whyUs: [
      "Packing insured up to £20,000 when booked with removal",
      "Optional unpacking service at destination",
      "Eco packaging options available",
    ],
    startingFrom: 100,
    metaDescription:
      "Professional packing service from £100. Premium materials, inventory list, and optional unpacking included.",
    faqs: [
      {
        question: "Do you pack the entire house or can I choose rooms?",
        answer:
          "We can pack the entire property or just specific rooms — kitchen, bedrooms, artwork, etc. Partial packing is priced accordingly.",
      },
      {
        question: "Do you provide boxes, or do I need to supply them?",
        answer:
          "We supply all boxes and materials as part of the packing service. You won't need to source anything.",
      },
      {
        question: "Can you unpack at the destination too?",
        answer:
          "Yes — our unpack service puts items into rooms, places crockery in cupboards, and hangs clothes in wardrobes. It's available as an add-on.",
      },
    ],
  },
];

export function getServiceBySlug(slug: string): Service | undefined {
  return SERVICES.find((s) => s.slug === slug);
}
