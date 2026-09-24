import Link from "next/link";
import { JsonLd } from "@/components/seo/JsonLd";
import { SERVICES, getServicePriceLabel } from "@/lib/services";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { buildBreadcrumbSchema, buildServiceCatalogSchema } from "@/lib/seo/schemas";

export const metadata = buildPageMetadata({
  title: "Man and Van, Removals and Delivery Services in Scotland",
  description: "Compare man and van, house and flat removals, furniture collection, office moves, student moves and packing help. Choose the service that fits your move.",
  path: "/services",
});

export default function ServicesPage() {
  const services = SERVICES.filter((service) => service.indexable !== false);

  return (
    <article className="bg-stone-950 px-4 py-12 text-white sm:px-6 lg:py-20">
      <JsonLd id="services-hub-jsonld" data={[
        buildBreadcrumbSchema([{ name: "Home", url: "/" }, { name: "Services", url: "/services" }]),
        buildServiceCatalogSchema(services.map((service) => ({
          name: service.name,
          description: service.description,
          url: `/services/${service.slug}`,
          startingFrom: service.startingFrom,
          priceUnit: service.priceUnit,
          bookingUrl: `/book?service=${service.slug}`,
        }))),
      ]} />
      <div className="mx-auto max-w-7xl">
        <nav aria-label="Breadcrumb" className="mb-6 text-sm text-stone-300">
          <Link href="/" className="underline underline-offset-4">Home</Link>
          <span aria-hidden="true"> / </span><span aria-current="page">Services</span>
        </nav>
        <h1 className="max-w-4xl text-3xl font-black leading-tight sm:text-5xl">Moving services across Scotland</h1>
        <p className="mt-5 max-w-3xl text-lg leading-relaxed text-stone-300">
          Moving a few items, a flat, a whole home or a workplace? Start with the
          service that matches your load. Each page explains access, preparation
          and the details needed for a quote.
        </p>
        <section aria-labelledby="choose-service-heading" className="mt-10">
          <h2 id="choose-service-heading" className="text-2xl font-bold">Choose the right moving service</h2>
          <p className="mt-3 max-w-3xl text-stone-300">
            Guide prices are starting points. Your route, items, crew, stairs,
            loading access and date determine the confirmed quote. Check your
            collection and destination in our <Link href="/areas" className="text-amber-300 underline underline-offset-4">service areas</Link>.
          </p>
          <ul className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <li key={service.slug} className="rounded-2xl border border-white/15 bg-white/5 p-6">
                <h3 className="text-xl font-bold">
                  <Link href={`/services/${service.slug}`} className="text-amber-300 underline-offset-4 hover:underline">{service.name}</Link>
                </h3>
                <p className="mt-3 leading-relaxed text-stone-300">{service.description}</p>
                <p className="mt-4 font-semibold">Guide price from {getServicePriceLabel(service)}</p>
              </li>
            ))}
          </ul>
        </section>
        <section className="mt-12 grid gap-6 rounded-2xl border border-amber-400/25 p-6 sm:grid-cols-2" aria-labelledby="plan-move-heading">
          <div>
            <h2 id="plan-move-heading" className="text-2xl font-bold">Prepare for an accurate quote</h2>
            <p className="mt-3 leading-relaxed text-stone-300">Have both postcodes, your item list and your preferred date ready. Include floors, lift access, parking and anything that may need dismantling. For a full-home move, use the room and bedroom inventory.</p>
            <Link href="/pricing" className="mt-4 inline-block font-semibold text-amber-300 underline underline-offset-4">How moving prices are worked out</Link>
          </div>
          <div>
            <h2 className="text-2xl font-bold">Moving to Europe?</h2>
            <p className="mt-3 leading-relaxed text-stone-300">European removals use a separate enquiry so the route, inventory and arrangements can be checked before a quote is agreed.</p>
            <Link href="/services/european-removals" className="mt-4 inline-block font-semibold text-amber-300 underline underline-offset-4">Request a European removals quote</Link>
          </div>
        </section>
        <Link href="/book" className="mt-8 inline-flex rounded-lg bg-amber-400 px-6 py-4 font-bold text-stone-950 hover:bg-amber-300">Start your moving quote</Link>
      </div>
    </article>
  );
}
