import Link from "next/link";
import { getAreaBySlug, type Area } from "@/lib/areas";
import { getNearbyAreaGroups } from "@/lib/nearby-area-guides";

interface NearbyAreaContentProps {
  area: Area;
}

const linkClassName =
  "font-semibold text-amber-400 underline decoration-2 underline-offset-4 hover:text-amber-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-4 focus-visible:ring-offset-[#111]";

export function NearbyAreaContent({ area }: NearbyAreaContentProps) {
  const groups = getNearbyAreaGroups(area.slug);
  if (groups.length === 0) return null;

  const headingId = `${area.slug}-nearby-places`;

  return (
    <section className="bg-[#111] py-16" aria-labelledby={headingId}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <h2 id={headingId} className="scroll-mt-28 text-2xl font-black text-white">
            Man and van in the towns and villages around {area.name}
          </h2>
          <p className="mt-4 leading-relaxed text-white/70">
            We also serve the surrounding places below for local collections,
            deliveries and moves to or from {area.name}. Choose{" "}
            <Link href="/services/man-and-van" className={linkClassName}>man and van</Link>
            {" for a smaller load, "}
            <Link href="/services/furniture-delivery" className={linkClassName}>furniture collection and delivery</Link>
            {", or "}
            <Link href="/services/house-removal" className={linkClassName}>house removals</Link>
            {" for a whole home. Supply both addresses and the full inventory so we can confirm the vehicle, lifting help and available date."}
          </p>
          <nav aria-label={`${area.name} surrounding places`} className="mt-6">
            <ul className="flex flex-wrap gap-x-5 gap-y-3 text-sm">
              {groups.map((group) => (
                <li key={group.id} className="min-w-0">
                  <Link href={`#${area.slug}-${group.id}`} className={linkClassName}>
                    {group.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {groups.map((group) => (
          <div key={group.id} className="mt-10">
            <h3 id={`${area.slug}-${group.id}`} className="scroll-mt-28 text-xl font-bold text-white">
              {group.title}
            </h3>
            <p className="mt-3 max-w-3xl leading-relaxed text-white/70">
              {group.introduction}
            </p>
            <ul className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {group.places.map((place) => {
                const destination = place.areaSlug ? getAreaBySlug(place.areaSlug) : undefined;

                return (
                  <li key={place.slug} className="min-w-0 rounded-xl border border-amber-900/20 bg-white/[0.04] p-5">
                    <h4 id={`${area.slug}-${place.slug}`} className="scroll-mt-28 text-lg font-bold text-white">
                      {destination ? (
                        <Link href={`/areas/${destination.slug}`} className={linkClassName}>
                          {place.name}
                        </Link>
                      ) : place.name}
                    </h4>
                    <p className="mt-3 text-sm leading-relaxed text-white/70">{place.description}</p>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}

        <p className="mt-8 max-w-3xl leading-relaxed text-white/70">
          For a village address, include the property name and full postcode,
          together with any access instructions. Tell us about gates, vehicle-size
          restrictions or additional stops when they apply. Collection times are
          agreed for your booking.
        </p>
        <Link href="/book" className="btn-primary mt-6 text-center focus-visible:ring-offset-[#111] motion-reduce:transition-none">
          Get a quote for your town or village
        </Link>
      </div>
    </section>
  );
}
