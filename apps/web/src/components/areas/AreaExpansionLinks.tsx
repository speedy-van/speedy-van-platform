import Link from "next/link";
import type { Area } from "@/lib/areas";
import { LOCAL_SERVICE_PAGES } from "@/lib/content/city-service-pages";
import { MOVING_ROUTE_PAGES } from "@/lib/content/moving-route-pages";
import { movingTextLink } from "./MovingContentPage";

export function AreaExpansionLinks({ area }: { area: Area }) {
  const services = LOCAL_SERVICE_PAGES.filter((page) => page.areaSlug === area.slug);
  const routes = MOVING_ROUTE_PAGES.filter((page) => page.originSlug === area.slug);
  if (!services.length && !routes.length) return null;
  return (
    <section className="bg-stone-950 px-4 py-12 text-white sm:px-6" aria-labelledby="local-moving-guides-heading">
      <div className="mx-auto max-w-7xl">
        <h2 id="local-moving-guides-heading" className="text-2xl font-bold">Plan your {area.name} move</h2>
        <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((page) => <li key={page.serviceSlug}><Link className={movingTextLink} href={`/areas/${area.slug}/${page.serviceSlug}`}>{page.title}</Link></li>)}
          {routes.map((page) => <li key={page.slug}><Link className={movingTextLink} href={`/moving-routes/${page.slug}`}>{area.name} to {page.destination}</Link></li>)}
        </ul>
        {routes.length > 0 && <Link href="/moving-routes" className={`mt-6 inline-block ${movingTextLink}`}>Explore routes from Scotland</Link>}
      </div>
    </section>
  );
}
