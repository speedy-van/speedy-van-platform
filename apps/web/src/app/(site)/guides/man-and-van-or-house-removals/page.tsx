import Link from "next/link";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { buildBreadcrumbSchema } from "@/lib/seo/schemas";

export const metadata = buildPageMetadata({
  title: "Man and Van or House Removals: Which Do You Need?",
  description:
    "Compare man and van with house removals, flat moves and furniture delivery. Choose by inventory, crew, access and packing needs, with Scottish planning examples.",
  path: "/guides/man-and-van-or-house-removals",
});

const linkClassName =
  "font-semibold text-amber-300 underline underline-offset-4 hover:text-amber-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-4 focus-visible:ring-offset-[#0A0A0A]";

const comparisons = [
  {
    title: "Man and van",
    href: "/services/man-and-van",
    suits: "A room, a few pieces of furniture, a storage run or a partial move.",
    planning:
      "List every item and the lifting help required. A driver helps with loading, but heavy or awkward pieces may need additional crew. Agree the van, help and quote basis before booking.",
  },
  {
    title: "House removals",
    href: "/services/house-removal",
    suits: "Most or all of a household, including furniture, boxes and belongings from several rooms.",
    planning:
      "Use a full inventory, including the loft, garage and garden store. Confirm vehicle capacity, crew, key handover and any packing or dismantling. A fixed quote can be considered for larger moves.",
  },
  {
    title: "Flat removals",
    href: "/services/flat-removals",
    suits: "A studio or apartment where building access needs particular attention.",
    planning:
      "Describe both floors, lift dimensions, shared stairs and the walk to the van. A small flat can still contain a substantial load; the property label does not determine capacity or crew.",
  },
  {
    title: "Furniture collection and delivery",
    href: "/services/furniture-delivery",
    suits: "An agreed sofa, bed, wardrobe or other furniture purchase moving between two addresses.",
    planning:
      "Share item dimensions and collection arrangements. Check doorways and turns at the destination. Confirm whether dismantling is needed and who will prepare the item for collection.",
  },
  {
    title: "Student moves",
    href: "/services/student-move",
    suits: "Suitcases, boxes and room furniture moving between halls, a shared flat, home or storage.",
    planning:
      "Include check-in or check-out arrangements and every stop. If housemates share a move, combine their inventories so that the full load and separate destinations can be assessed.",
  },
  {
    title: "Office removals",
    href: "/services/office-removal",
    suits: "Desks, chairs, boxed equipment and suitable stock moving between business premises.",
    planning:
      "Confirm service lifts, loading bays and building permissions. Label equipment by destination. Your IT team should arrange backups, disconnection and reconnection unless separate specialist support is agreed.",
  },
];

export default function MovingServiceChoiceGuidePage() {
  return (
    <article className="bg-[#0A0A0A] px-4 py-12 text-white sm:px-6 lg:py-20">
      <JsonLd
        id="service-choice-breadcrumb-jsonld"
        data={buildBreadcrumbSchema([
          { name: "Home", url: "/" },
          { name: "Moving guides", url: "/guides" },
          { name: "Man and van or house removals", url: "/guides/man-and-van-or-house-removals" },
        ])}
      />
      <div className="mx-auto max-w-5xl">
        <nav aria-label="Breadcrumb" className="mb-6 text-sm text-white/70">
          <ol className="flex flex-wrap gap-x-2 gap-y-2">
            <li><Link href="/" className={linkClassName}>Home</Link></li>
            <li aria-hidden="true">/</li>
            <li><Link href="/guides" className={linkClassName}>Moving guides</Link></li>
            <li aria-hidden="true">/</li>
            <li aria-current="page">Man and van or house removals</li>
          </ol>
        </nav>
        <h1 className="max-w-4xl text-3xl font-black leading-tight sm:text-5xl">
          Man and van or house removals: which do you need?
        </h1>
        <p className="mt-5 max-w-3xl text-lg leading-relaxed text-white/70">
          Choose by the load and help you need. Man and van often suits a partial
          move; house removals suit a whole household that needs coordinated
          planning. The service name alone does not tell you the vehicle size,
          crew or what is included. Agree those details using your actual inventory.
        </p>

        <section aria-labelledby="compare-moving-services" className="mt-10">
          <h2 id="compare-moving-services" className="text-2xl font-bold">Match the service to your move</h2>
          <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
            {comparisons.map((service) => (
              <section key={service.href} className="min-w-0 rounded-2xl border border-amber-900/20 bg-white/[0.04] p-6">
                <h3 className="text-xl font-bold leading-snug">
                  <Link href={service.href} className={linkClassName}>{service.title}</Link>
                </h3>
                <dl className="mt-4 space-y-4 leading-relaxed">
                  <div>
                    <dt className="font-semibold">Useful for</dt>
                    <dd className="mt-1 text-white/70">{service.suits}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold">What to confirm</dt>
                    <dd className="mt-1 text-white/70">{service.planning}</dd>
                  </div>
                </dl>
              </section>
            ))}
          </div>
          <p className="mt-5 max-w-3xl leading-relaxed text-white/70">
            Only taking a few belongings? The{" "}
            <Link href="/services/small-moves" className={linkClassName}>small moves guide</Link>
            {" "}covers partial loads. For a longer journey, also read about{" "}
            <Link href="/services/long-distance-removals" className={linkClassName}>long-distance removals</Link>.
            Distance changes the route plan; it does not replace the need to assess the load.
          </p>
        </section>

        <section aria-labelledby="service-choice-inventory" className="mt-12 max-w-3xl">
          <h2 id="service-choice-inventory" className="text-2xl font-bold">Use bedrooms as a starting point, then list the contents</h2>
          <p className="mt-4 leading-relaxed text-white/70">
            A bedroom count helps organise a home inventory, but it cannot establish
            the required van capacity on its own. Include furniture, boxes,
            appliances and stored items. Note dimensions for bulky pieces,
            unusually heavy items and whether furniture can be dismantled.
            Describe stairs, tight turns, lifts and loading distance at both ends.
            Do not assume that customer lifting help will replace the crew needed
            for a safe move.
          </p>
        </section>

        <section aria-labelledby="service-choice-local-planning" className="mt-12">
          <h2 id="service-choice-local-planning" className="text-2xl font-bold">Two planning examples</h2>
          <p className="mt-4 max-w-3xl leading-relaxed text-white/70">
            These are illustrative situations to help prepare an enquiry, not records of completed jobs.
          </p>
          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
            <section className="min-w-0 rounded-2xl border border-amber-900/20 p-6">
              <h3 className="text-xl font-bold">An Aberdeen flat with shared stairs</h3>
              <p className="mt-3 leading-relaxed text-white/70">
                A sofa, bed and boxes may look like a small load. A narrow stair
                turn or a long carry from the loading space can change the handling
                plan. Check measurements and access before choosing the crew.
              </p>
              <p className="mt-4 leading-relaxed">
                <Link href="/areas/aberdeen" className={linkClassName}>Plan your Aberdeen move</Link>
                {" · "}<Link href="/pricing#aberdeen" className={linkClassName}>Aberdeen quote details</Link>
              </p>
            </section>
            <section className="min-w-0 rounded-2xl border border-amber-900/20 p-6">
              <h3 className="text-xl font-bold">An Inverness move with a rural destination</h3>
              <p className="mt-3 leading-relaxed text-white/70">
                A few items travelling further still need an agreed delivery plan.
                Provide the exact destination, road approach, gate width and safe
                unloading position. Have the route and vehicle suitability checked
                together with the inventory.
              </p>
              <p className="mt-4 leading-relaxed">
                <Link href="/areas/inverness" className={linkClassName}>Plan your Inverness move</Link>
                {" · "}<Link href="/pricing#inverness" className={linkClassName}>Inverness quote details</Link>
              </p>
            </section>
          </div>
        </section>

        <section aria-labelledby="service-choice-quote" className="mt-12 max-w-3xl">
          <h2 id="service-choice-quote" className="text-2xl font-bold">Compare the agreed scope, not just the starting price</h2>
          <p className="mt-4 leading-relaxed text-white/70">
            The quote depends on the items, route, date, access and crew. Ask
            whether it is hourly or fixed, what any minimum charge covers and how
            changes to the inventory or access are handled. For an hourly quote,
            confirm which parts of the job count towards chargeable time.
          </p>
          <p className="mt-4 leading-relaxed text-white/70">
            Packing, materials, dismantling and reassembly must be agreed; do not
            assume they are included. Read the{" "}
            <Link href="/pricing" className={linkClassName}>moving price guide</Link>
            {" "}and describe any{" "}
            <Link href="/services/packing-service" className={linkClassName}>packing support</Link>
            {" "}you need. Special items such as pianos require their own handling
            assessment. A service selection or enquiry does not confirm capacity
            or a collection slot.
          </p>
          <Link href="/book" className="btn-primary mt-6 max-w-full text-center focus-visible:ring-offset-[#0A0A0A] motion-reduce:transition-none">
            Request a quote for your move
          </Link>
        </section>
      </div>
    </article>
  );
}
