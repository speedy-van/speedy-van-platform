import Link from "next/link";
import { LOCAL_SERVICE_PAGES } from "@/lib/content/city-service-pages";
import { movingTextLink } from "./MovingContentPage";

export function ServiceExpansionLinks({ serviceSlug }: { serviceSlug: string }) {
  const pages = LOCAL_SERVICE_PAGES.filter((page) => page.serviceSlug === serviceSlug);
  if (!pages.length && serviceSlug !== "long-distance-removals") return null;
  return (
    <section className="bg-stone-950 px-4 py-12 text-white sm:px-6" aria-labelledby="service-local-guides-heading">
      <div className="mx-auto max-w-7xl">
        <h2 id="service-local-guides-heading" className="text-2xl font-bold">Local planning guides</h2>
        <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {pages.map((page) => <li key={page.areaSlug}><Link href={`/areas/${page.areaSlug}/${page.serviceSlug}`} className={movingTextLink}>{page.title}</Link></li>)}
          {serviceSlug === "long-distance-removals" && <li><Link href="/moving-routes" className={movingTextLink}>Moving routes from Scotland across Britain</Link></li>}
        </ul>
      </div>
    </section>
  );
}
