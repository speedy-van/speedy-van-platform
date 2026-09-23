import Link from "next/link";
import { AREAS } from "@/lib/areas";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { buildBreadcrumbSchema } from "@/lib/seo/schemas";

export const metadata = buildPageMetadata({
  title: "Scottish Service Areas for Man and Van and Removals",
  description: "Plan man and van and removals across Scotland, from cities to towns and rural addresses, or a move from Scotland to anywhere in Britain. Get a route-based quote.",
  path: "/areas",
});

export default function AreasPage() {
  const regions = Array.from(new Set(AREAS.map((area) => area.region)));
  const cities = AREAS.filter((area) => area.schemaType === "City");
  const regionId = (region: string) => `region-${region.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
  const textLink = "rounded-sm text-amber-300 underline underline-offset-4 hover:text-amber-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 focus-visible:ring-offset-4 focus-visible:ring-offset-stone-950";

  return (
    <article className="bg-stone-950 px-4 py-12 text-white sm:px-6 lg:py-20">
      <JsonLd id="areas-hub-jsonld" data={buildBreadcrumbSchema([
        { name: "Home", url: "/" }, { name: "Areas", url: "/areas" },
      ])} />
      <div className="mx-auto max-w-6xl">
        <nav aria-label="Breadcrumb" className="mb-6 text-sm text-stone-300">
          <Link href="/" className={textLink}>Home</Link>
          <span aria-hidden="true"> / </span><span aria-current="page">Service areas</span>
        </nav>
        <h1 className="max-w-4xl text-3xl font-black leading-tight sm:text-5xl">Man and van and removals in Scotland</h1>
        <p className="mt-5 max-w-3xl text-lg leading-relaxed text-stone-300">
          Arrange a move within Scotland or from Scotland to anywhere in Britain.
          Find local planning advice for cities, towns and rural addresses, then
          request a quote using both postcodes, your items and preferred date.
          These guides describe service areas; the vehicle, crew and collection
          slot are agreed for your individual move.
        </p>
        <section className="mt-8 rounded-2xl border border-amber-400/30 bg-amber-400/5 p-5 sm:p-6" aria-labelledby="town-not-listed-heading">
          <h2 id="town-not-listed-heading" className="text-xl font-bold">Your town or village is not listed?</h2>
          <p className="mt-3 max-w-3xl leading-relaxed text-stone-300">
            You can still request a move from your Scottish address. The guides
            below are a starting point, not a complete list of collection locations.
            Include rural access or a ferry crossing so the whole journey can be
            planned before the date and price are agreed.
          </p>
          <Link href="/book" className={`mt-4 inline-block py-2 font-semibold ${textLink}`}>Request a quote for your route</Link>
        </section>
        <section className="mt-10" aria-labelledby="city-guides-heading">
          <h2 id="city-guides-heading" className="text-2xl font-bold">Explore Scotland&apos;s city guides</h2>
          <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {cities.map((city) => (
              <li key={city.slug} className="min-w-0">
                <Link href={`/areas/${city.slug}`} className={`block py-3 font-semibold ${textLink}`}>{city.name}</Link>
              </li>
            ))}
          </ul>
        </section>
        <nav className="mt-8" aria-label="Browse regional moving guides">
          <p className="font-semibold text-stone-200">Browse by region</p>
          <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
            {regions.map((region) => (
              <li key={region}><a href={`#${regionId(region)}`} className={`inline-block py-2 ${textLink}`}>{region}</a></li>
            ))}
          </ul>
        </nav>
        <div className="mt-10 grid gap-8 md:grid-cols-2">
          {regions.map((region) => (
            <section key={region} id={regionId(region)} aria-labelledby={`${regionId(region)}-heading`} className="min-w-0 scroll-mt-28 rounded-2xl border border-white/15 bg-white/5 p-5 sm:p-6">
              <h2 id={`${regionId(region)}-heading`} className="text-2xl font-bold">{region}</h2>
              <ul className="mt-4 grid gap-3">
                {AREAS.filter((area) => area.region === region).map((area) => (
                  <li key={area.slug}>
                    <Link href={`/areas/${area.slug}`} className="block rounded-lg px-2 py-3 font-semibold text-amber-300 underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300">
                      {area.name}<span className="ml-2 text-sm font-normal text-stone-300">{area.postcode}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
        <section className="mt-12 max-w-3xl" aria-labelledby="route-heading">
          <h2 id="route-heading" className="text-2xl font-bold">Moving from Scotland to England or Wales?</h2>
          <p className="mt-3 leading-relaxed text-stone-300">
            We move homes, furniture and smaller loads from Scotland to destinations
            throughout Britain. Provide the delivery address, access at each end
            and your full item list. Include key handovers, storage stops and any
            ferry requirements so loading, travel and unloading are priced together.
          </p>
          <div className="mt-5 flex flex-wrap gap-x-6 gap-y-3">
            <Link href="/services/long-distance-removals" className={textLink}>Removals from Scotland across Britain</Link>
            <Link href="/services" className={textLink}>Compare moving services</Link>
            <Link href="/book" className={textLink}>Start a quote</Link>
          </div>
        </section>
      </div>
    </article>
  );
}
