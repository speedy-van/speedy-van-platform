import Link from "next/link";
import { AREAS } from "@/lib/areas";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { buildBreadcrumbSchema } from "@/lib/seo/schemas";

export const metadata = buildPageMetadata({
  title: "Scottish Service Areas for Man and Van and Removals",
  description: "Find man and van and removals information for Glasgow, Edinburgh and other Scottish service areas. Check access, collection and destination details before booking.",
  path: "/areas",
});

export default function AreasPage() {
  const regions = Array.from(new Set(AREAS.map((area) => area.region)));

  return (
    <article className="bg-stone-950 px-4 py-12 text-white sm:px-6 lg:py-20">
      <JsonLd id="areas-hub-jsonld" data={buildBreadcrumbSchema([
        { name: "Home", url: "/" }, { name: "Areas", url: "/areas" },
      ])} />
      <div className="mx-auto max-w-6xl">
        <nav aria-label="Breadcrumb" className="mb-6 text-sm text-stone-300">
          <Link href="/" className="underline underline-offset-4">Home</Link>
          <span aria-hidden="true"> / </span><span aria-current="page">Service areas</span>
        </nav>
        <h1 className="max-w-4xl text-3xl font-black leading-tight sm:text-5xl">Man and van and removals in Scotland</h1>
        <p className="mt-5 max-w-3xl text-lg leading-relaxed text-stone-300">
          Find guidance for your collection or delivery area. These pages describe
          service areas, not branch offices. Availability depends on both addresses,
          the load and the date; a postcode range alone does not confirm a booking.
        </p>
        <div className="mt-10 grid gap-8 md:grid-cols-2">
          {regions.map((region) => (
            <section key={region} className="rounded-2xl border border-white/15 bg-white/5 p-6">
              <h2 className="text-2xl font-bold">{region}</h2>
              <ul className="mt-4 grid gap-3">
                {AREAS.filter((area) => area.region === region).map((area) => (
                  <li key={area.slug}>
                    <Link href={`/areas/${area.slug}`} className="block rounded-lg px-2 py-2 font-semibold text-amber-300 underline-offset-4 hover:underline">
                      {area.name}<span className="ml-2 text-sm font-normal text-stone-300">{area.postcode}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
        <section className="mt-12 max-w-3xl" aria-labelledby="route-heading">
          <h2 id="route-heading" className="text-2xl font-bold">Moving between towns or cities?</h2>
          <p className="mt-3 leading-relaxed text-stone-300">
            Provide collection and delivery postcodes, access at each end and your
            item list. Longer journeys, rural access and several stops need a route
            check before a time or price is agreed.
          </p>
          <div className="mt-5 flex flex-wrap gap-x-6 gap-y-3">
            <Link href="/services/long-distance-removals" className="text-amber-300 underline underline-offset-4">Long-distance removals</Link>
            <Link href="/services" className="text-amber-300 underline underline-offset-4">Compare moving services</Link>
            <Link href="/book" className="text-amber-300 underline underline-offset-4">Start a quote</Link>
          </div>
        </section>
      </div>
    </article>
  );
}
