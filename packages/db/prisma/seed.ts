import { PrismaClient, Role, VanSize as PrismaVanSize, BookingStatus } from "@prisma/client";
import bcrypt from "bcryptjs";
import { DEFAULT_PRICING_CONFIG_ROWS } from "@speedy-van/config";
import { generateBookingReference } from "@speedy-van/shared";

type VanSize = "SMALL" | "MEDIUM" | "LARGE" | "LUTON";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // ── Categories ─────────────────────────────────────────────────────────────
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: "residential" },
      update: {},
      create: {
        slug: "residential",
        name: "Residential",
        description: "Home and apartment moves",
        icon: "🏠",
      },
    }),
    prisma.category.upsert({
      where: { slug: "commercial" },
      update: {},
      create: {
        slug: "commercial",
        name: "Commercial",
        description: "Office and business moves",
        icon: "🏢",
      },
    }),
    prisma.category.upsert({
      where: { slug: "specialist" },
      update: {},
      create: {
        slug: "specialist",
        name: "Specialist",
        description: "Specialist item handling",
        icon: "🎹",
      },
    }),
    prisma.category.upsert({
      where: { slug: "delivery" },
      update: {},
      create: {
        slug: "delivery",
        name: "Delivery",
        description: "Fast delivery services",
        icon: "🚚",
      },
    }),
    prisma.category.upsert({
      where: { slug: "clearance" },
      update: {},
      create: {
        slug: "clearance",
        name: "Clearance",
        description: "Rubbish and waste removal",
        icon: "♻️",
      },
    }),
  ]);

  console.log(`✓ ${categories.length} categories created`);

  // ── Services ────────────────────────────────────────────────────────────────
  const serviceData = [
    { slug: "man-and-van", name: "Man and Van", description: "Versatile man and van hire for any size job.", categorySlug: "residential" },
    { slug: "house-removal", name: "House Removal", description: "Full house removal service with packing options.", categorySlug: "residential" },
    { slug: "office-removal", name: "Office Removal", description: "Minimal-disruption office and commercial relocation.", categorySlug: "commercial" },
    { slug: "student-move", name: "Student Move", description: "Affordable student moves between terms and cities.", categorySlug: "residential" },
    { slug: "furniture-delivery", name: "Furniture Delivery", description: "Safe delivery and placement of furniture items.", categorySlug: "delivery" },
    { slug: "ikea-delivery", name: "IKEA Delivery & Assembly", description: "Collect, deliver, and assemble flat-pack furniture.", categorySlug: "delivery" },
    { slug: "rubbish-removal", name: "Rubbish Removal", description: "Eco-friendly clearance of household and business waste.", categorySlug: "clearance" },
    { slug: "piano-moving", name: "Piano Moving", description: "Safe and secure piano moving by specialist team.", categorySlug: "specialist" },
    { slug: "same-day-delivery", name: "Same Day Delivery", description: "Urgent same-day parcel and item delivery.", categorySlug: "delivery" },
    { slug: "packing-service", name: "Packing Service", description: "Professional packing using quality materials.", categorySlug: "residential" },
  ];

  const services = await Promise.all(
    serviceData.map(({ slug, name, description, categorySlug }) => {
      const category = categories.find((c) => c.slug === categorySlug);
      if (!category) throw new Error(`Category not found: ${categorySlug}`);
      return prisma.service.upsert({
        where: { slug },
        update: {},
        create: { slug, name, description, categoryId: category.id },
      });
    })
  );

  console.log(`✓ ${services.length} services created`);

  // ── Service availability flags (admin-controlled) ──────────────────────────
  const flagSlugs = ["rubbish-removal", "same-day-delivery"];
  await Promise.all(
    flagSlugs.map((slug) =>
      prisma.serviceFlag.upsert({
        where: { slug },
        update: {},
        create: { slug, enabled: true, mode: null },
      }),
    ),
  );
  console.log(`✓ ${flagSlugs.length} service flags ensured`);

  // ── Areas ────────────────────────────────────────────────────────────────────
  const areaData = [
    { slug: "central-london", name: "Central London", region: "London", description: "Expert moves in the heart of the capital." },
    { slug: "north-london", name: "North London", region: "London", description: "Reliable van hire across North London." },
    { slug: "south-london", name: "South London", region: "London", description: "Fast, affordable moves in South London." },
    { slug: "east-london", name: "East London", region: "London", description: "Trusted removals throughout East London." },
    { slug: "west-london", name: "West London", region: "London", description: "Premium van services in West London." },
    { slug: "canary-wharf", name: "Canary Wharf", region: "London", description: "Office and residential moves in the Docklands." },
    { slug: "shoreditch", name: "Shoreditch", region: "London", description: "Creative-quarter moves done with care." },
    { slug: "brixton", name: "Brixton", region: "London", description: "Vibrant community moves across Brixton." },
    { slug: "hackney", name: "Hackney", region: "London", description: "Local knowledge for all Hackney moves." },
    { slug: "islington", name: "Islington", region: "London", description: "Smooth removals throughout Islington." },
    { slug: "clapham", name: "Clapham", region: "London", description: "Stress-free moves in and around Clapham." },
    { slug: "richmond", name: "Richmond", region: "London", description: "Careful van hire near Richmond Park and beyond." },
    { slug: "wimbledon", name: "Wimbledon", region: "London", description: "Dependable removals in the Wimbledon area." },
    { slug: "croydon", name: "Croydon", region: "London", description: "Efficient moves across Greater Croydon." },
    { slug: "stratford", name: "Stratford", region: "London", description: "Modern removals near the Olympic Park." },
    { slug: "greenwich", name: "Greenwich", region: "London", description: "Trusted moves across historic Greenwich." },
    { slug: "fulham", name: "Fulham", region: "London", description: "Quality van hire serving Fulham and Parsons Green." },
    { slug: "chelsea", name: "Chelsea", region: "London", description: "Discreet, professional removals in Chelsea." },
    { slug: "notting-hill", name: "Notting Hill", region: "London", description: "Careful moves in iconic Notting Hill." },
    { slug: "camden", name: "Camden", region: "London", description: "Flexible van hire across Camden Town." },
    { slug: "manchester", name: "Manchester", region: "North West", description: "Fast removals and delivery across Greater Manchester." },
    { slug: "birmingham", name: "Birmingham", region: "West Midlands", description: "Comprehensive van hire throughout Birmingham." },
    { slug: "leeds", name: "Leeds", region: "Yorkshire", description: "Reliable removal services across Leeds." },
    { slug: "liverpool", name: "Liverpool", region: "North West", description: "Friendly van services throughout Liverpool." },
    { slug: "sheffield", name: "Sheffield", region: "Yorkshire", description: "Quality moves and deliveries in Sheffield." },
    { slug: "bristol", name: "Bristol", region: "South West", description: "Trusted removals across Bristol and surrounds." },
    { slug: "edinburgh", name: "Edinburgh", region: "Scotland", description: "Professional van hire throughout Edinburgh." },
    { slug: "glasgow", name: "Glasgow", region: "Scotland", description: "Reliable removals across Greater Glasgow." },
    { slug: "nottingham", name: "Nottingham", region: "East Midlands", description: "Efficient van services throughout Nottingham." },
    { slug: "leicester", name: "Leicester", region: "East Midlands", description: "Affordable man and van hire in Leicester." },
    { slug: "coventry", name: "Coventry", region: "West Midlands", description: "Smooth moves and deliveries in Coventry." },
    { slug: "bradford", name: "Bradford", region: "Yorkshire", description: "Dependable van hire across Bradford." },
    { slug: "cardiff", name: "Cardiff", region: "Wales", description: "Professional removals throughout Cardiff." },
    { slug: "reading", name: "Reading", region: "South East", description: "Reliable van services in Reading and the Thames Valley." },
    { slug: "oxford", name: "Oxford", region: "South East", description: "Careful moves in historic Oxford." },
    { slug: "cambridge", name: "Cambridge", region: "East", description: "Student and residential moves across Cambridge." },
    { slug: "brighton", name: "Brighton", region: "South East", description: "Seaside removals and delivery in Brighton." },
    { slug: "southampton", name: "Southampton", region: "South", description: "Trusted van hire throughout Southampton." },
    { slug: "portsmouth", name: "Portsmouth", region: "South", description: "Efficient removals and deliveries in Portsmouth." },
  ];

  const areas = await Promise.all(
    areaData.map(({ slug, name, region, description }) =>
      prisma.area.upsert({
        where: { slug },
        update: {},
        create: { slug, name, region, description },
      })
    )
  );

  console.log(`✓ ${areas.length} areas created`);

  // ── Pricing ──────────────────────────────────────────────────────────────────
  const pricingMatrix: Record<string, { SMALL: [number, number]; MEDIUM: [number, number]; LARGE: [number, number]; LUTON: [number, number] }> = {
    "man-and-van":       { SMALL: [45, 45], MEDIUM: [55, 55], LARGE: [65, 65], LUTON: [75, 75] },
    "house-removal":     { SMALL: [120, 50], MEDIUM: [180, 60], LARGE: [250, 70], LUTON: [320, 80] },
    "office-removal":    { SMALL: [150, 55], MEDIUM: [220, 65], LARGE: [300, 75], LUTON: [400, 90] },
    "student-move":      { SMALL: [80, 40], MEDIUM: [100, 50], LARGE: [130, 60], LUTON: [160, 70] },
    "furniture-delivery":{ SMALL: [60, 45], MEDIUM: [75, 55], LARGE: [90, 65], LUTON: [110, 75] },
    "ikea-delivery":     { SMALL: [70, 50], MEDIUM: [85, 60], LARGE: [100, 70], LUTON: [125, 80] },
    "rubbish-removal":   { SMALL: [90, 50], MEDIUM: [120, 60], LARGE: [160, 70], LUTON: [200, 80] },
    "piano-moving":      { SMALL: [200, 80], MEDIUM: [250, 90], LARGE: [300, 100], LUTON: [350, 110] },
    "same-day-delivery": { SMALL: [55, 50], MEDIUM: [65, 60], LARGE: [80, 70], LUTON: [100, 80] },
    "packing-service":   { SMALL: [100, 55], MEDIUM: [140, 65], LARGE: [180, 75], LUTON: [220, 85] },
  };

  let pricingCount = 0;
  for (const service of services) {
    const matrix = pricingMatrix[service.slug];
    if (!matrix) continue;
    for (const [vanSize, [basePrice, perHour]] of Object.entries(matrix) as [PrismaVanSize, [number, number]][]) {
      await prisma.pricing.upsert({
        where: { serviceId_vanSize: { serviceId: service.id, vanSize } },
        update: {},
        create: { serviceId: service.id, vanSize, basePrice, perHour },
      });
      pricingCount++;
    }
  }

  // ── Users ─────────────────────────────────────────────────────────────────
  const [adminHash, driverHash, customerHash] = await Promise.all([
    bcrypt.hash("Admin123!", 10),
    bcrypt.hash("Driver123!", 10),
    bcrypt.hash("Customer123!", 10),
  ]);

  const admin = await prisma.user.upsert({
    where: { email: "admin@speedyvan.com" },
    update: {},
    create: { email: "admin@speedyvan.com", name: "Admin User", password: adminHash, role: Role.ADMIN },
  });

  const driverUser = await prisma.user.upsert({
    where: { email: "driver@speedyvan.com" },
    update: {},
    create: { email: "driver@speedyvan.com", name: "Dave Driver", password: driverHash, role: Role.DRIVER },
  });

  const customer = await prisma.user.upsert({
    where: { email: "customer@example.com" },
    update: {},
    create: { email: "customer@example.com", name: "Jane Smith", password: customerHash },
  });

  console.log(`✓ 3 users created (admin, driver, customer)`);

  // ── Driver profile ───────────────────────────────────────────────────────────
  await prisma.driver.upsert({
    where: { userId: driverUser.id },
    update: {},
    create: { userId: driverUser.id, vanSize: PrismaVanSize.LARGE, isActive: true },
  });

  console.log(`✓ 1 driver profile created`);

  // ── Pricing config (Phase 2 engine) ──────────────────────────────────────
  let pcCount = 0;
  for (const row of DEFAULT_PRICING_CONFIG_ROWS) {
    await prisma.pricingConfig.upsert({
      where: { category_key: { category: row.category, key: row.key } },
      update: { value: row.value, description: row.description ?? null },
      create: { category: row.category, key: row.key, value: row.value, description: row.description ?? null },
    });
    pcCount++;
  }
  console.log(`✓ ${pcCount} pricing config rows seeded`);

  // ── Item catalog ──────────────────────────────────────────────────────────
  const itemCats = await Promise.all([
    prisma.itemCategory.upsert({
      where: { slug: "living-room" },
      update: {},
      create: { slug: "living-room", name: "Living Room", icon: "🛋️", type: "residential", sortOrder: 1 },
    }),
    prisma.itemCategory.upsert({
      where: { slug: "bedroom" },
      update: {},
      create: { slug: "bedroom", name: "Bedroom", icon: "🛏️", type: "residential", sortOrder: 2 },
    }),
    prisma.itemCategory.upsert({
      where: { slug: "kitchen" },
      update: {},
      create: { slug: "kitchen", name: "Kitchen", icon: "🍽️", type: "both", sortOrder: 3 },
    }),
    prisma.itemCategory.upsert({
      where: { slug: "office" },
      update: {},
      create: { slug: "office", name: "Office", icon: "💼", type: "business", sortOrder: 4 },
    }),
  ]);

  const itemRows: { categorySlug: string; slug: string; name: string; weight?: number; size?: string }[] = [
    { categorySlug: "living-room", slug: "sofa-2-seater", name: "Sofa (2-seater)", weight: 35, size: "large" },
    { categorySlug: "living-room", slug: "sofa-3-seater", name: "Sofa (3-seater)", weight: 50, size: "large" },
    { categorySlug: "living-room", slug: "armchair", name: "Armchair", weight: 25, size: "medium" },
    { categorySlug: "living-room", slug: "tv-large", name: "TV (50\"+)", weight: 20, size: "medium" },
    { categorySlug: "living-room", slug: "coffee-table", name: "Coffee Table", weight: 15, size: "small" },
    { categorySlug: "bedroom", slug: "double-bed", name: "Double Bed", weight: 60, size: "large" },
    { categorySlug: "bedroom", slug: "king-bed", name: "King Bed", weight: 80, size: "xl" },
    { categorySlug: "bedroom", slug: "wardrobe", name: "Wardrobe", weight: 70, size: "large" },
    { categorySlug: "bedroom", slug: "chest-drawers", name: "Chest of Drawers", weight: 40, size: "medium" },
    { categorySlug: "kitchen", slug: "fridge-freezer", name: "Fridge/Freezer", weight: 65, size: "large" },
    { categorySlug: "kitchen", slug: "washing-machine", name: "Washing Machine", weight: 70, size: "large" },
    { categorySlug: "kitchen", slug: "dining-table", name: "Dining Table", weight: 45, size: "large" },
    { categorySlug: "kitchen", slug: "boxes-medium", name: "Box (Medium)", weight: 10, size: "small" },
    { categorySlug: "office", slug: "office-desk", name: "Office Desk", weight: 30, size: "large" },
    { categorySlug: "office", slug: "office-chair", name: "Office Chair", weight: 15, size: "medium" },
    { categorySlug: "office", slug: "filing-cabinet", name: "Filing Cabinet", weight: 35, size: "medium" },
    { categorySlug: "office", slug: "monitor", name: "Monitor", weight: 6, size: "small" },
  ];

  for (let i = 0; i < itemRows.length; i++) {
    const row = itemRows[i]!;
    const cat = itemCats.find((c) => c.slug === row.categorySlug);
    if (!cat) continue;
    await prisma.item.upsert({
      where: { slug: row.slug },
      update: {},
      create: {
        categoryId: cat.id,
        slug: row.slug,
        name: row.name,
        weight: row.weight,
        size: row.size,
        sortOrder: i,
      },
    });
  }
  console.log(`✓ ${itemCats.length} item categories and ${itemRows.length} items seeded`);

  // ── Bookings ─────────────────────────────────────────────────────────────────
  const manAndVanService = services.find((s) => s.slug === "man-and-van");
  const houseRemovalService = services.find((s) => s.slug === "house-removal");
  const centralLondon = areas.find((a) => a.slug === "central-london");
  const shoreditch = areas.find((a) => a.slug === "shoreditch");

  if (!manAndVanService || !houseRemovalService || !centralLondon || !shoreditch) {
    throw new Error("Missing required seed data for bookings");
  }

  const driver = await prisma.driver.findUnique({ where: { userId: driverUser.id } });
  if (!driver) throw new Error("Driver not found");

  const booking1 = await prisma.booking.upsert({
    where: { id: "seed-booking-1" },
    update: {},
    create: {
      id: "seed-booking-1",
      reference: generateBookingReference(),
      userId: customer.id,
      customerName: "Jane Smith",
      customerEmail: "customer@example.com",
      customerPhone: "+447700900001",
      serviceId: manAndVanService.id,
      serviceSlug: manAndVanService.slug,
      serviceName: manAndVanService.name,
      areaId: centralLondon.id,
      pickupAddress: "10 Baker Street, London",
      pickupPostcode: "W1U 6TT",
      pickupLat: 51.5237,
      pickupLng: -0.1585,
      pickupFloor: 3,
      pickupHasLift: false,
      dropoffAddress: "55 King's Road, London",
      dropoffPostcode: "SW3 4ND",
      dropoffLat: 51.4892,
      dropoffLng: -0.1659,
      dropoffFloor: 0,
      distanceMiles: 4.2,
      driverId: driver.id,
      status: BookingStatus.COMPLETED,
      scheduledAt: new Date("2026-03-15T09:00:00Z"),
      selectedTimeSlot: "morning",
      price: 165,
      totalPrice: 165,
      isPaid: true,
      paidAt: new Date("2026-03-10T12:00:00Z"),
      notes: "2 bedroom flat, 3rd floor no lift",
    },
  });

  const booking2 = await prisma.booking.upsert({
    where: { id: "seed-booking-2" },
    update: {},
    create: {
      id: "seed-booking-2",
      reference: generateBookingReference(),
      userId: admin.id,
      customerName: "Admin User",
      customerEmail: "admin@speedyvan.com",
      customerPhone: "+447700900002",
      serviceId: houseRemovalService.id,
      serviceSlug: houseRemovalService.slug,
      serviceName: houseRemovalService.name,
      areaId: shoreditch.id,
      pickupAddress: "100 Shoreditch High Street, London",
      pickupPostcode: "E1 6JJ",
      pickupLat: 51.5236,
      pickupLng: -0.0775,
      pickupFloor: 1,
      pickupHasLift: true,
      dropoffAddress: "200 Hackney Road, London",
      dropoffPostcode: "E2 7QL",
      dropoffLat: 51.5320,
      dropoffLng: -0.0721,
      dropoffFloor: 2,
      distanceMiles: 1.6,
      driverId: driver.id,
      status: BookingStatus.COMPLETED,
      scheduledAt: new Date("2026-04-01T08:00:00Z"),
      selectedTimeSlot: "morning",
      price: 320,
      totalPrice: 320,
      isPaid: true,
      paidAt: new Date("2026-03-25T10:00:00Z"),
    },
  });

  console.log(`✓ 2 bookings created`);

  // ── Reviews ──────────────────────────────────────────────────────────────────
  await prisma.review.upsert({
    where: { bookingId: booking1.id },
    update: {},
    create: {
      bookingId: booking1.id,
      userId: customer.id,
      rating: 5,
      comment: "Absolutely brilliant service! Dave was on time, careful with all my belongings, and the price was very fair. Highly recommend SpeedyVan for anyone moving in London.",
    },
  });

  await prisma.review.upsert({
    where: { bookingId: booking2.id },
    update: {},
    create: {
      bookingId: booking2.id,
      userId: admin.id,
      rating: 5,
      comment: "Professional team, arrived promptly, and handled the house removal with great care. Everything arrived in perfect condition. Will definitely use again.",
    },
  });

  console.log(`✓ 2 reviews created`);
  console.log("\n✅ Database seeded successfully!");
  console.log("\nDemo accounts:");
  console.log("  Admin:    admin@speedyvan.com   / Admin123!");
  console.log("  Driver:   driver@speedyvan.com  / Driver123!");
  console.log("  Customer: customer@example.com  / Customer123!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
