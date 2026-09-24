import Link from "next/link";
import type { Area } from "@/lib/areas";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildBreadcrumbSchema } from "@/lib/seo/schemas";
import { absoluteUrl, SITE_LEGAL_NAME, SITE_URL } from "@/lib/seo/constants";

export const movingTextLink = "rounded-sm text-amber-300 underline underline-offset-4 hover:text-amber-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 focus-visible:ring-offset-4 focus-visible:ring-offset-stone-950";

interface MovingContentPageProps {
  path: string;
  title: string;
  description: string;
  introduction: string;
  origin: Pick<Area, "name" | "schemaType">;
  breadcrumbs: { name: string; url: string }[];
  sections: { title: string; body: string; source?: { label: string; href: string } }[];
  faqs: { question: string; answer: string }[];
  related: { name: string; href: string }[];
}

/** Server-rendered planning information. Quote links retain existing booking drafts. */
export function MovingContentPage({ path, title, description, introduction, origin, breadcrumbs, sections, faqs, related }: MovingContentPageProps) {
  return (
    <article className="bg-stone-950 px-4 py-12 text-white sm:px-6 lg:py-20">
      <JsonLd id="moving-content-jsonld" data={[
        buildBreadcrumbSchema(breadcrumbs),
        {
          "@context": "https://schema.org",
          "@type": "Service",
          "@id": `${absoluteUrl(path)}#service`,
          name: title,
          description,
          url: absoluteUrl(path),
          provider: { "@type": "MovingCompany", "@id": `${SITE_URL}/#organization`, name: SITE_LEGAL_NAME, url: SITE_URL },
          areaServed: { "@type": origin.schemaType ?? "Place", name: origin.name },
        },
      ]} />
      <div className="mx-auto max-w-5xl">
        <nav aria-label="Breadcrumb" className="mb-6 text-sm text-stone-300">
          <ol className="flex flex-wrap gap-x-3 gap-y-2">
            {breadcrumbs.map((crumb, index) => (
              <li key={crumb.url} className="min-w-0">
                {index > 0 && <span aria-hidden="true" className="mr-3">/</span>}
                {index === breadcrumbs.length - 1 ? <span aria-current="page">{crumb.name}</span> : <Link href={crumb.url} className={movingTextLink}>{crumb.name}</Link>}
              </li>
            ))}
          </ol>
        </nav>
        <h1 className="max-w-4xl text-3xl font-black leading-tight sm:text-5xl">{title}</h1>
        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-stone-300">{introduction}</p>
        <Link href="/book" className="mt-7 inline-flex min-h-12 items-center justify-center rounded-lg bg-amber-400 px-6 py-3 text-center font-bold text-stone-950 hover:bg-amber-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 focus-visible:ring-offset-4 focus-visible:ring-offset-stone-950">Get a moving quote</Link>
        <nav aria-label="On this page" className="mt-10 rounded-xl border border-white/15 p-5">
          <p className="font-bold">Plan your move</p>
          <ul className="mt-3 grid gap-3 sm:grid-cols-2">
            {sections.map((section, index) => <li key={section.title}><a className={movingTextLink} href={`#planning-${index + 1}`}>{section.title}</a></li>)}
            <li><a href="#moving-questions" className={movingTextLink}>Moving questions</a></li>
          </ul>
        </nav>
        <div className="mt-10 grid gap-8">
          {sections.map((section, index) => (
            <section key={section.title} id={`planning-${index + 1}`} aria-labelledby={`planning-heading-${index + 1}`} className="scroll-mt-28 rounded-xl border border-white/15 bg-white/5 p-5 sm:p-7">
              <h2 id={`planning-heading-${index + 1}`} className="text-2xl font-bold">{section.title}</h2>
              <p className="mt-4 max-w-3xl leading-relaxed text-stone-300">{section.body}</p>
              {section.source && <a className={`mt-4 inline-block ${movingTextLink}`} href={section.source.href}>{section.source.label}</a>}
            </section>
          ))}
        </div>
        <section id="moving-questions" aria-labelledby="moving-questions-heading" className="mt-12 scroll-mt-28">
          <h2 id="moving-questions-heading" className="text-2xl font-bold">Moving questions</h2>
          <div className="mt-5 grid gap-3">
            {faqs.map((faq) => (
              <details key={faq.question} className="rounded-xl border border-white/15 bg-white/5">
                <summary className="cursor-pointer rounded-xl p-5 font-bold hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300">{faq.question}</summary>
                <p className="px-5 pb-5 leading-relaxed text-stone-300">{faq.answer}</p>
              </details>
            ))}
          </div>
        </section>
        <nav aria-label="Related moving guides" className="mt-12 border-t border-white/15 pt-7">
          <h2 className="text-xl font-bold">More help with your move</h2>
          <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-4">
            {related.map((link) => <li key={link.href}><Link href={link.href} className={movingTextLink}>{link.name}</Link></li>)}
            <li><Link href="/book" className={movingTextLink}>Start a quote</Link></li>
          </ul>
        </nav>
      </div>
    </article>
  );
}
