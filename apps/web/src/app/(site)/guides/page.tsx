import Link from "next/link";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { buildBreadcrumbSchema } from "@/lib/seo/schemas";

export const metadata = buildPageMetadata({
  title: "Moving Guides: Services, Costs and Local Planning",
  description:
    "Choose the right moving service, understand quote details and plan access in Aberdeen or Inverness. Practical guides for moves across Scotland.",
  path: "/guides",
});

const linkClassName =
  "font-semibold text-amber-300 underline underline-offset-4 hover:text-amber-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-4 focus-visible:ring-offset-[#0A0A0A]";

const resources = [
  {
    href: "/guides/man-and-van-or-house-removals",
    title: "Man and van or house removals?",
    description:
      "Compare a few-item move with a whole-home removal. Work through your inventory, lifting needs and access before choosing a service.",
  },
  {
    href: "/pricing",
    title: "Understand your moving quote",
    description:
      "Check the difference between a guide price and an agreed quote, the details that affect cost, and what to confirm before booking.",
  },
  {
    href: "/areas/aberdeen",
    title: "Plan a move in Aberdeen",
    description:
      "Prepare information about shared stairs, parking, loading arrangements and building access at both addresses.",
  },
  {
    href: "/areas/inverness",
    title: "Plan a move in Inverness",
    description:
      "Consider city loading access alongside longer journeys, narrow approaches and collection or delivery outside the city.",
  },
];

export default function GuidesPage() {
  return (
    <article className="bg-[#0A0A0A] px-4 py-12 text-white sm:px-6 lg:py-20">
      <JsonLd
        id="guides-breadcrumb-jsonld"
        data={buildBreadcrumbSchema([
          { name: "Home", url: "/" },
          { name: "Moving guides", url: "/guides" },
        ])}
      />
      <div className="mx-auto max-w-5xl">
        <nav aria-label="Breadcrumb" className="mb-6 text-sm text-white/70">
          <ol className="flex flex-wrap gap-x-2 gap-y-2">
            <li><Link href="/" className={linkClassName}>Home</Link></li>
            <li aria-hidden="true">/</li>
            <li aria-current="page">Moving guides</li>
          </ol>
        </nav>
        <h1 className="text-3xl font-black leading-tight sm:text-5xl">Moving guides</h1>
        <p className="mt-5 max-w-3xl text-lg leading-relaxed text-white/70">
          Start with the decisions that shape your move: what you are taking,
          how it will reach the van and what help you need. These guides explain
          service choices, quote details and local planning without assuming
          that every home needs the same arrangement.
        </p>
        <section aria-labelledby="moving-guides-resources" className="mt-10">
          <h2 id="moving-guides-resources" className="text-2xl font-bold">Find the help you need</h2>
          <ul className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
            {resources.map((resource) => (
              <li key={resource.href} className="min-w-0 rounded-2xl border border-amber-900/20 bg-white/[0.04] p-6">
                <h3 className="text-xl font-bold leading-snug">
                  <Link href={resource.href} className={linkClassName}>{resource.title}</Link>
                </h3>
                <p className="mt-3 leading-relaxed text-white/70">{resource.description}</p>
              </li>
            ))}
          </ul>
        </section>
        <section aria-labelledby="moving-guides-next-step" className="mt-10 max-w-3xl">
          <h2 id="moving-guides-next-step" className="text-2xl font-bold">Ready to describe your move?</h2>
          <p className="mt-4 leading-relaxed text-white/70">
            Have both addresses, your preferred date and a complete item list
            ready. Include floors, lifts, parking and anything that needs
            dismantling or extra lifting help. You can also browse the{" "}
            <Link href="/services" className={linkClassName}>moving services</Link>
            {" "}before requesting a quote. The proposed load, route and access
            need to be checked before arrangements are confirmed.
          </p>
          <Link href="/book" className="btn-primary mt-6 max-w-full text-center focus-visible:ring-offset-[#0A0A0A] motion-reduce:transition-none">
            Start your moving quote
          </Link>
        </section>
      </div>
    </article>
  );
}
