export interface NearbyAreaPlace {
  slug: string;
  name: string;
  description: string;
  areaSlug?: string;
}

export interface NearbyAreaGroup {
  id: string;
  title: string;
  introduction: string;
  places: NearbyAreaPlace[];
}

const INVERNESS_NEARBY_AREA_GROUPS: readonly NearbyAreaGroup[] = [
  {
    id: "east-inverness-and-nairn",
    title: "East Inverness, Ardersier and Nairn",
    introduction:
      "We cover these communities for man and van moves, furniture deliveries and home removals. Include every collection and delivery address, even when the journey stays close to Inverness, so the load, lifting help and available date can be confirmed together.",
    places: [
      {
        slug: "culloden",
        name: "Culloden",
        description:
          "For a Culloden furniture collection or move across Inverness, list the largest pieces and describe the route from each room to the van. A short journey still needs the right lifting help; include steps, shared entrances and any furniture that needs dismantling.",
      },
      {
        slug: "smithton",
        name: "Smithton",
        description:
          "Moving a bedroom or a few household items in Smithton? Separate your load from anything staying behind and count boxes alongside furniture. Tell us whether collection uses the front door, a side entrance or shared access, and agree when everything will be packed and ready.",
      },
      {
        slug: "balloch",
        name: "Balloch",
        description:
          "Use the full postcode for your Balloch address near Inverness when requesting a house move or delivery. For bulky garden or garage items, include dimensions and the path to the loading point; flag any gate or doorway that limits how they can be carried.",
      },
      {
        slug: "ardersier",
        name: "Ardersier",
        description:
          "For furniture travelling between Ardersier, Inverness and Nairn, include the seller's collection window and who can release the item. Check the delivery entrance before committing to a large sofa or wardrobe, and state whether you need help placing it in an upstairs room.",
      },
      {
        slug: "croy",
        name: "Croy",
        description:
          "Planning a move in Croy near Inverness? Provide the property name or number and full postcode, plus directions to the actual entrance if it is not obvious. Describe any private approach and turning space so vehicle access can be assessed before the collection is agreed.",
      },
      {
        slug: "nairn",
        name: "Nairn",
        areaSlug: "nairn",
        description:
          "A Nairn move can involve a single furniture delivery, a complete home or an onward journey through Inverness. Give both addresses and key handover times, and identify any separate collection stop. The quote needs to cover loading and unloading as well as the journey.",
      },
    ],
  },
  {
    id: "beauly-and-dingwall",
    title: "Beauly, Muir of Ord and the Dingwall area",
    introduction:
      "Home moves and smaller collections are available across these towns and villages. If a journey combines several addresses, describe the stops in order and identify what belongs at each destination; a town name alone is not enough to plan the complete route.",
    places: [
      {
        slug: "beauly",
        name: "Beauly",
        description:
          "For a Beauly shop or private-seller collection, confirm the item is ready to release and give the collection contact's agreed time window. Include any onward delivery to Inverness or another village, with dimensions for glass, mirrors or furniture that needs separate protection.",
      },
      {
        slug: "muir-of-ord",
        name: "Muir of Ord",
        description:
          "Request a Muir of Ord house-removal quote with furniture, packed boxes and any shed or garage contents listed separately. If belongings are split between properties, explain which stop comes first and who will provide access. Include any preparation or dismantling you need quoted.",
      },
      {
        slug: "conon-bridge",
        name: "Conon Bridge",
        description:
          "Moving between Conon Bridge and Dingwall, or further afield? Tell us when keys become available at the destination and whether the whole load can be delivered together. For a property with a driveway, check whether it will be clear and suitable for loading on the day.",
      },
      {
        slug: "dingwall",
        name: "Dingwall",
        areaSlug: "dingwall",
        description:
          "For a Dingwall flat, house or business move, explain the collection floor and the destination access as separate parts of the enquiry. A larger load may need more crew or capacity than a furniture run; include heavy pieces and any agreed building access times.",
      },
    ],
  },
  {
    id: "loch-ness-communities",
    title: "Drumnadrochit and Loch Ness enquiries",
    introduction:
      "We also cover Drumnadrochit for local and onward moves. Provide the exact addresses for any journey towards Loch Ness, together with the load and preferred date, so the collection and delivery arrangements can be checked before you book.",
    places: [
      {
        slug: "drumnadrochit",
        name: "Drumnadrochit",
        description:
          "For a Drumnadrochit collection or a move to Inverness, give the full destination rather than only a Loch Ness area name. If either property has an unfamiliar approach, share entrance details and any access limitations. Agree the delivery window around keys and the complete journey.",
      },
    ],
  },
];

const ABERDEEN_NEARBY_AREA_GROUPS: readonly NearbyAreaGroup[] = [
  {
    id: "north-aberdeen-and-inverurie",
    title: "North Aberdeen, Ellon and the Inverurie area",
    introduction:
      "We cover these communities for furniture collections, smaller moves and full home removals. Give the full postcode at each end and include any additional stop; an Aberdeen postal address can describe a journey beyond the city itself.",
    places: [
      {
        slug: "balmedie",
        name: "Balmedie",
        description:
          "For a Balmedie furniture delivery, measure the largest piece and the entrance it must pass through at its destination. Include the collection address in Aberdeen or elsewhere, whether the item is assembled, and who will meet the crew to confirm where it should be placed.",
      },
      {
        slug: "ellon",
        name: "Ellon",
        areaSlug: "ellon",
        description:
          "Plan an Ellon house move around the full inventory and the point when both properties are accessible. If you are collecting items from storage or another household on the way, list that stop in the enquiry and label the belongings for their final rooms.",
      },
      {
        slug: "newmachar",
        name: "Newmachar",
        description:
          "For a smaller Newmachar move, count your boxes and list furniture separately so suitable capacity can be planned. Tell us whether the load is going to one address or being divided between homes, and include the floor and lifting requirements at each stop.",
      },
      {
        slug: "oldmeldrum",
        name: "Oldmeldrum",
        description:
          "An Oldmeldrum collection needs the exact property address and an agreed handover, particularly when someone else is releasing the furniture. Share item dimensions and photographs of awkward access where useful. If the destination is outside the town, include the complete delivery address before requesting a price.",
      },
      {
        slug: "blackburn",
        name: "Blackburn",
        description:
          "Use the full Aberdeenshire postcode for a Blackburn removal or furniture enquiry. For a move between Blackburn and Aberdeen, describe access at the city address as well as the collection point; shared stairs, lift bookings or a longer carry can affect the handling needed.",
      },
      {
        slug: "kintore",
        name: "Kintore",
        description:
          "For a Kintore move involving beds, wardrobes or dining furniture, say what will be dismantled before collection and what help you need included. Keep fixings with each item and record any fragile panels. Include the delivery access even if the journey is only to nearby Inverurie.",
      },
      {
        slug: "inverurie",
        name: "Inverurie",
        areaSlug: "inverurie",
        description:
          "Inverurie enquiries can combine home removals, office furniture and individual collections, but each needs its own item list and access plan. For business premises, arrange loading access with the person responsible and identify equipment requiring specialist handling before confirming the scope of the move.",
      },
    ],
  },
  {
    id: "westhill-and-peterculter",
    title: "Westhill and Peterculter",
    introduction:
      "Moves west of Aberdeen can involve homes, workplace collections and deliveries into the city. Explain both ends of the journey and any access appointment, so the agreed collection slot allows for the work required at the destination as well.",
    places: [
      {
        slug: "westhill",
        name: "Westhill",
        areaSlug: "westhill",
        description:
          "For a Westhill home or office move, separate desks, chairs and boxed belongings from items staying behind. Check any building access appointment and confirm whether dismantling is required. List the heaviest pieces so lifting help can be assessed before the collection date is booked.",
      },
      {
        slug: "peterculter",
        name: "Peterculter",
        description:
          "For a Peterculter collection or onward Deeside move, supply the full route and any time you must vacate the property. If the loading point is away from the entrance, describe the carry and any steps rather than assuming a van can reach the door.",
      },
    ],
  },
  {
    id: "portlethen-to-stonehaven",
    title: "Portlethen, Newtonhill and Stonehaven",
    introduction:
      "We cover these communities south of Aberdeen for man and van work and larger removals. A furniture collection and a full-house move need different plans; describe the load, crew requirements and destination before relying on a particular collection time.",
    places: [
      {
        slug: "portlethen",
        name: "Portlethen",
        description:
          "For a Portlethen collection from a seller or shop, confirm when the item will be available and whether it is packaged or assembled. Include accessories and matching pieces in the list. Ask for the collection, transport and delivery handling to be included in the agreed scope.",
      },
      {
        slug: "newtonhill",
        name: "Newtonhill",
        description:
          "Moving furniture in Newtonhill? Describe the actual entrance and any steps between the loading point and the room, including at the destination. For a smaller household move, pack and label loose belongings in advance and identify anything that requires two people to lift safely.",
      },
      {
        slug: "stonehaven",
        name: "Stonehaven",
        areaSlug: "stonehaven",
        description:
          "For Stonehaven removals or an Aberdeen furniture collection delivered to town, coordinate the seller or key holder at each address. Tell us about floor changes, tight doorways and the proposed loading position. Include any onward stop so the quote covers the full journey and handling.",
      },
    ],
  },
];

export function getNearbyAreaGroups(slug: string): readonly NearbyAreaGroup[] {
  if (slug === "inverness") return INVERNESS_NEARBY_AREA_GROUPS;
  if (slug === "aberdeen") return ABERDEEN_NEARBY_AREA_GROUPS;
  return [];
}
