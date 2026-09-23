import Link from "next/link";
import type { Area } from "@/lib/areas";
import type { AreaGuide } from "@/lib/area-guides";
import { getServiceBySlug } from "@/lib/services";

interface AreaGuideContentProps {
  area: Area;
  guide: AreaGuide;
}

const textLinkClassName =
  "font-semibold text-amber-400 underline decoration-amber-400 decoration-2 underline-offset-4 hover:text-amber-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-4 focus-visible:ring-offset-[#0A0A0A]";

export function AreaGuideContent({ area, guide }: AreaGuideContentProps) {
  const servicesHeadingId = `${area.slug}-moving-services`;
  const bookingHeadingId = `${area.slug}-booking-steps`;
  const faqHeadingId = `${area.slug}-moving-questions`;

  return (
    <>
      <section className="py-16 bg-[#0A0A0A]" aria-labelledby={servicesHeadingId}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-8">
            <h2 id={servicesHeadingId} className="text-2xl font-black text-white">
              Choose the right moving service in {area.name}
            </h2>
            <p className="mt-4 text-white/70 leading-relaxed">
              {guide.introduction}
            </p>
            <nav aria-label={`${area.name} moving guide sections`} className="mt-6">
              <p className="font-semibold text-white">Plan your move</p>
              <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-3 text-sm">
                {guide.sections.map((section) => (
                  <li key={section.id} className="min-w-0">
                    <Link href={`#${area.slug}-${section.id}`} className={textLinkClassName}>
                      {section.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" role="list">
            {guide.services.map((item) => {
              const service = getServiceBySlug(item.slug);
              if (!service || service.indexable === false) return null;

              return (
                <li key={service.slug} className="min-w-0">
                  <Link
                    href={`/services/${service.slug}`}
                    className="group block h-full rounded-xl border border-amber-900/20 bg-white/[0.04] p-5 hover:border-amber-400/40 hover:bg-amber-400/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-4 focus-visible:ring-offset-[#0A0A0A] motion-safe:transition-colors"
                  >
                    <span className="text-2xl" aria-hidden="true">{service.icon}</span>
                    <h3 className="mt-3 font-semibold text-white underline decoration-transparent underline-offset-4 group-hover:text-amber-400 group-hover:decoration-amber-400">
                      {service.name}
                    </h3>
                    <p className="mt-2 text-sm text-white/70 leading-relaxed">
                      {item.description}
                    </p>
                  </Link>
                </li>
              );
            })}
          </ul>
          <p className="mt-6 max-w-3xl text-white/70 leading-relaxed">
            Unsure how much moving support to request?{" "}
            <Link href="/guides/man-and-van-or-house-removals" className={textLinkClassName}>
              Compare man and van with house removals
            </Link>
            {" using your inventory, access and preparation needs."}
          </p>
        </div>
      </section>

      {guide.sections.map((section, index) => {
        const headingId = `${area.slug}-${section.id}`;

        return (
          <section
            key={section.id}
            className={`py-16 ${index % 2 === 0 ? "bg-[#111]" : "bg-[#0A0A0A]"}`}
            aria-labelledby={headingId}
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="max-w-3xl">
                <h2 id={headingId} className="scroll-mt-28 text-2xl font-black text-white">
                  {section.title}
                </h2>
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph} className="mt-4 text-white/70 leading-relaxed">
                    {paragraph}
                  </p>
                ))}
                {section.checklist && (
                  <ul className="mt-6 space-y-3 list-disc pl-5 text-white/70">
                    {section.checklist.map((item) => (
                      <li key={item} className="pl-1 leading-relaxed">{item}</li>
                    ))}
                  </ul>
                )}
                {section.reference && (
                  <p className="mt-6 leading-relaxed">
                    <a href={section.reference.href} className={textLinkClassName}>
                      {section.reference.label}
                    </a>
                  </p>
                )}
                {section.id === "quote" && (
                  <p className="mt-6 leading-relaxed">
                    <Link href="/pricing" className={textLinkClassName}>
                      Read the moving price guide
                    </Link>
                    {" and "}
                    <Link href={`/pricing#${area.slug}`} className={textLinkClassName}>
                      plan your {area.name} quote
                    </Link>
                    {" with the access and journey details that matter."}
                  </p>
                )}
                {section.id === "urgent-moves" && (
                  <p className="mt-6 leading-relaxed">
                    <a href="tel:07909032889" className={textLinkClassName}>
                      Call to check short-notice availability
                    </a>
                    {" or "}
                    <Link href="/book" className={textLinkClassName}>
                      request a moving quote online
                    </Link>
                    .
                  </p>
                )}
              </div>
            </div>
          </section>
        );
      })}

      <section className="py-16 bg-[#111]" aria-labelledby={bookingHeadingId}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 id={bookingHeadingId} className="text-2xl font-black text-white mb-8">
            Arrange your {area.name} move in three steps
          </h2>
          <ol className="grid grid-cols-1 md:grid-cols-3 gap-6 list-decimal pl-6">
            {guide.bookingSteps.map((step) => (
              <li key={step.title} className="pl-1 marker:font-black marker:text-amber-400">
                <h3 className="font-semibold text-white">{step.title}</h3>
                <p className="mt-2 text-white/70 leading-relaxed">{step.description}</p>
              </li>
            ))}
          </ol>
          <Link href="/book" className="btn-primary mt-8 text-center focus-visible:ring-offset-[#111] motion-reduce:transition-none">
            Request a quote for {area.name}
          </Link>
        </div>
      </section>

      <section className="py-16 bg-[#0A0A0A]" aria-labelledby={faqHeadingId}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h2 id={faqHeadingId} className="text-2xl font-black text-white mb-8">
              Questions about moving in {area.name}
            </h2>
            <div className="space-y-3">
              {guide.faqs.map((faq) => (
                <details key={faq.question} className="rounded-xl border border-amber-900/20 bg-white/[0.04]">
                  <summary className="flex items-center justify-between gap-4 rounded-xl p-5 font-semibold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0A0A]">
                    <span>{faq.question}</span>
                    <svg
                      className="chevron w-5 h-5 shrink-0 text-white/70 motion-safe:transition-transform"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      aria-hidden="true"
                    >
                      <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </summary>
                  <p className="px-5 pb-5 text-white/70 leading-relaxed">{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
