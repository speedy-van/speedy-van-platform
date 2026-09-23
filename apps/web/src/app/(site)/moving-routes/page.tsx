import Link from "next/link";
import { getAreaBySlug } from "@/lib/areas";
import { MOVING_ROUTE_PAGES } from "@/lib/content/moving-route-pages";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { buildBreadcrumbSchema } from "@/lib/seo/schemas";
import { JsonLd } from "@/components/seo/JsonLd";
import { movingTextLink } from "@/components/areas/MovingContentPage";

export const metadata = buildPageMetadata({ title: "Moving Routes from Scotland across Britain", description: "Plan a move from Scotland to another Scottish city, England or Wales. Compare route guides, loading arrangements and delivery access before requesting a quote.", path: "/moving-routes" });

export default function MovingRoutesPage() {
  const origins = Array.from(new Set(MOVING_ROUTE_PAGES.map((page) => page.originSlug)));
  return (
    <article className="bg-stone-950 px-4 py-12 text-white sm:px-6 lg:py-20">
      <JsonLd id="moving-routes-jsonld" data={buildBreadcrumbSchema([{ name: "Home", url: "/" }, { name: "Routes from Scotland", url: "/moving-routes" }])} />
      <div className="mx-auto max-w-6xl">
        <nav aria-label="Breadcrumb" className="mb-6 text-sm text-stone-300"><Link href="/" className={movingTextLink}>Home</Link><span aria-hidden="true"> / </span><span aria-current="page">Routes from Scotland</span></nav>
        <h1 className="max-w-4xl text-3xl font-black leading-tight sm:text-5xl">Moving from Scotland to anywhere in Britain</h1>
        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-stone-300">Your collection address in Scotland is the starting point. These guides help you prepare the load, loading access and handover at the destination, whether you are moving within Scotland or onwards to England or Wales.</p>
        <p className="mt-4 max-w-3xl leading-relaxed text-stone-300">A route guide is not a fixed timetable. Give both addresses, your inventory, preferred date and any extra stops so the vehicle, crew and delivery window can be agreed together. For a town or destination not listed here, you can still request a quote for your move from Scotland.</p>
        <Link href="/book" className={`mt-6 inline-block py-2 font-bold ${movingTextLink}`}>Request a quote for your route</Link>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {origins.map((slug) => {
            const origin = getAreaBySlug(slug);
            if (!origin) return null;
            return <section key={slug} aria-labelledby={`routes-${slug}`} className="min-w-0 rounded-xl border border-white/15 bg-white/5 p-5 sm:p-7">
              <h2 id={`routes-${slug}`} className="text-2xl font-bold">Moves from {origin.name}</h2>
              <ul className="mt-5 grid gap-4">{MOVING_ROUTE_PAGES.filter((page) => page.originSlug === slug).map((page) => <li key={page.slug}><Link href={`/moving-routes/${page.slug}`} className={movingTextLink}>{origin.name} to {page.destination}</Link></li>)}</ul>
              <Link href={`/areas/${slug}`} className={`mt-6 inline-block text-sm ${movingTextLink}`}>Plan your collection in {origin.name}</Link>
            </section>;
          })}
        </div>
        <nav aria-label="More moving information" className="mt-10 flex flex-wrap gap-6"><Link href="/areas" className={movingTextLink}>Scottish area guides</Link><Link href="/services/long-distance-removals" className={movingTextLink}>Long-distance removals</Link><Link href="/pricing" className={movingTextLink}>Moving price guide</Link></nav>
      </div>
    </article>
  );
}
