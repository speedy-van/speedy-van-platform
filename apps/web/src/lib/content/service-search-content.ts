export interface ServiceSearchContent {
  metadataTitle: string;
  metadataDescription: string;
  headline: string;
  introduction: string;
}

export const SERVICE_SEARCH_CONTENT: Partial<Record<string, ServiceSearchContent>> = {
  "man-and-van": {
    metadataTitle: "Man and Van Scotland | Quotes for Your Move",
    metadataDescription:
      "Need a man with a van in Scotland? Get a quote for small moves, furniture collections and loading help. Share your items, addresses and date to check options.",
    headline: "Man and van for your next move in Scotland",
    introduction:
      "Need a man with a van for a few items, a flat load or furniture collection? Get a quote for transport and loading help across Scotland. Whether you call it man and van or van and man, we plan around the items, both addresses and the crew you need. Keep costs in view by listing boxes, stairs, parking and any extra stops before you book. Short-notice moves depend on available capacity.",
  },
  "house-removal": {
    metadataTitle: "House Removals Scotland | Get a Moving Quote",
    metadataDescription:
      "Plan your house removal in Scotland with a quote for your full inventory, van and crew. Include access, keys and packing needs before confirming your move.",
    headline: "House removals across Scotland, planned around your home",
    introduction:
      "Moving your whole home starts with a clear plan and a quote for everything you are taking. Our house removals cover smaller homes and full-house moves across Scotland, with the van and crew matched to your furniture, boxes and access. Include the loft, garage and garden items as well as the main rooms. Tell us about key collection, fragile pieces and any packing or dismantling help you need. Request your moving quote and agree the scope before you book.",
  },
  "furniture-delivery": {
    metadataTitle: "Furniture Movers Scotland | Collection & Delivery",
    metadataDescription:
      "Furniture movers for sofas, beds, tables and wardrobes across Scotland. Get a collection and delivery quote for homes, shops, private sellers or storage.",
    headline: "Furniture movers for collection and delivery across Scotland",
    introduction:
      "Bought a sofa, moving a bed or arranging a furniture collection? Request a quote to move sofas, tables, chairs, beds and wardrobes between homes, shops, private sellers and storage across Scotland. Our furniture movers plan the van and lifting help around your items and the access at both addresses. Delivery to your chosen room depends on safe access and the furniture fitting the route. Send dimensions, floor numbers and the collection window so your quote covers the work you need.",
  },
  "office-removal": {
    metadataTitle: "Office Removals Scotland | Business Moving Quotes",
    metadataDescription:
      "Get an office removal quote in Scotland for desks, chairs and business equipment. Plan your commercial relocation around building access and team handover.",
    headline: "Office removals and business relocation across Scotland",
    introduction:
      "Move your office with a quote based on the equipment, buildings and schedule your business needs. Our office removals cover desks, chairs, filing cabinets and boxed equipment across Scotland. Shop, studio and other commercial relocation enquiries are assessed against the items and handling required. Share the inventory, destination layout, loading bay and lift arrangements so the crew can plan collection and unloading. Evening and weekend options depend on availability; arrange IT disconnection and reconnection separately with your own team.",
  },
  "long-distance-removals": {
    metadataTitle: "Long Distance Man and Van & Removals Scotland",
    metadataDescription:
      "Request a long distance man and van or removals quote across Scotland. Move furniture, a flat or a full home with collection and delivery planned together.",
    headline: "Long distance man and van moves across Scotland",
    introduction:
      "Moving furniture, a flat or a whole home between Scottish towns and cities? Request a long distance man and van or removals quote for your complete route and load. The price takes account of distance in miles, van space, crew time and access at both ends. Include any storage stops, narrow approaches and key handover times so collection and delivery can be planned together. A dedicated van journey can be quoted where suitable. Routes outside Scotland need separate confirmation.",
  },
  "same-day-delivery": {
    metadataTitle: "Urgent Man and Van Delivery Scotland | Get a Quote",
    metadataDescription:
      "Need urgent furniture or item delivery in Scotland? Request a same-day man and van quote. Collection depends on driver, vehicle and route availability.",
    headline: "Urgent man and van delivery across Scotland",
    introduction:
      "Need furniture, business items, parcels or replacement parts moved at short notice? Ask about urgent man and van delivery with direct collection and delivery across Scotland. Send the item dimensions, both addresses, access details and the time the delivery is needed. Same-day work depends on a suitable driver, vehicle and route being available, so wait for confirmation before committing to collection arrangements. For an urgent house or flat move, use the relevant removals service so the full inventory and crew requirements can be assessed.",
  },
};
