import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildLocalBusinessSchema } from "@/lib/seo/schemas";
import { absoluteUrl, SITE_OG_IMAGE } from "@/lib/seo/constants";

const canonical = absoluteUrl("/about");

export const metadata: Metadata = {
  title: "About SpeedyVan – Man and Van & Removal Company Scotland",
  description:
    "SpeedyVan is a professional man and van and removal company based in Hamilton, Scotland. We cover Glasgow, Edinburgh, Dundee, Aberdeen and over 30 areas across Scotland.",
  alternates: { canonical },
  openGraph: {
    title: "About SpeedyVan | Man and Van Scotland",
    description:
      "Professional man and van and removal company based in Hamilton, Scotland. Covering Glasgow, Edinburgh, Dundee, Aberdeen and beyond.",
    url: canonical,
    images: [{ url: SITE_OG_IMAGE, width: 1200, height: 630, alt: "About SpeedyVan" }],
  },
};

export default function AboutPage() {
  return (
    <>
      <JsonLd id="about-jsonld" data={[buildLocalBusinessSchema()]} />

      {/* Hero */}
      <section
        className="py-16 lg:py-24 text-white"
        style={{ background: "linear-gradient(135deg, #0A0A0A 0%, #111 50%, #0A0A0A 100%)" }}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex items-center gap-2 text-sm" style={{ color: "rgba(255,255,255,0.40)" }}>
              <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
              <li aria-hidden="true">/</li>
              <li className="text-white" aria-current="page">About</li>
            </ol>
          </nav>

          <h1 className="text-4xl sm:text-5xl font-black leading-tight text-white">
            About SpeedyVan
          </h1>
          <p className="mt-6 text-xl leading-relaxed" style={{ color: "rgba(255,255,255,0.65)" }}>
            Professional man and van and removal services across Scotland — based in Hamilton,
            covering Glasgow, Edinburgh, Dundee, Aberdeen, Stirling, Inverness and beyond.
          </p>
        </div>
      </section>

      {/* Who we are */}
      <section className="py-16" style={{ background: "#0A0A0A" }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl font-black text-white mb-4">Who We Are</h2>
              <div className="space-y-4 text-base leading-relaxed" style={{ color: "rgba(255,255,255,0.65)" }}>
                <p>
                  SpeedyVan is a Scottish man and van and removals company operating out of Hamilton,
                  South Lanarkshire. We help households, students, and businesses move across
                  Scotland with clear quotes, professional drivers, and goods-in-transit cover
                  included as standard.
                </p>
                <p>
                  We cover over 30 locations across Scotland including Glasgow, Edinburgh, Dundee,
                  Aberdeen, Stirling, Falkirk, Inverness, Hamilton, East Kilbride, Paisley, Ayr,
                  and the Scottish Borders.
                </p>
                <p>
                  Whether you need a single item collected, a flat cleared, or a full house
                  removal planned, we give you an accurate online quote before you commit.
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-black text-white mb-4">What We Do</h2>
              <ul className="space-y-3">
                {[
                  { icon: "🚐", label: "Man and Van", desc: "Flexible van-with-driver help from £45/hr" },
                  { icon: "🏠", label: "House Removals", desc: "Full-home moves with fixed-price quotes" },
                  { icon: "🛋️", label: "Furniture Delivery", desc: "Single items, sofas, beds and bulky pieces" },
                  { icon: "🏢", label: "Office Removals", desc: "Business relocations across Scotland" },
                  { icon: "📦", label: "Storage Transport", desc: "To and from storage facilities" },
                  { icon: "⚡", label: "Same-Day Delivery", desc: "Urgent point-to-point transport" },
                ].map((item) => (
                  <li key={item.label} className="flex items-start gap-3">
                    <span className="text-2xl shrink-0" aria-hidden="true">{item.icon}</span>
                    <div>
                      <p className="font-bold text-white text-sm">{item.label}</p>
                      <p className="text-sm" style={{ color: "rgba(255,255,255,0.50)" }}>{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Why choose us */}
      <section
        className="py-16"
        style={{ background: "rgba(245,158,11,0.04)", borderTop: "1px solid rgba(245,158,11,0.10)" }}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-black text-white mb-8 text-center">Why Choose SpeedyVan</h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {[
              { title: "Transparent pricing", body: "Your quote shows the full price before you book. No hidden charges added on move day." },
              { title: "Goods-in-transit cover", body: "Every move includes goods-in-transit insurance up to £10,000 as standard." },
              { title: "Online booking", body: "Book and pay securely online with no phone calls needed for standard jobs." },
              { title: "7-day availability", body: "We take bookings every day of the week, including weekends and bank holidays." },
              { title: "Scotland-wide coverage", body: "Over 30 locations across Scotland covered, including all major cities and towns." },
              { title: "Fixed-price options", body: "House removals can be quoted at a fixed price after a brief survey." },
            ].map((item) => (
              <li
                key={item.title}
                className="rounded-2xl p-5"
                style={{ background: "rgba(255,255,255,0.04)", boxShadow: "0 0 0 1px rgba(245,158,11,0.12)" }}
              >
                <h3 className="font-black text-white">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>
                  {item.body}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Contact / NAP */}
      <section className="py-16" style={{ background: "#0A0A0A" }} aria-labelledby="contact-heading">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 id="contact-heading" className="text-2xl font-black text-white mb-8">Contact Us</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div
              className="rounded-2xl p-5"
              style={{ background: "rgba(255,255,255,0.04)", boxShadow: "0 0 0 1px rgba(255,255,255,0.08)" }}
            >
              <p className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-2">Address</p>
              <address className="not-italic text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.70)" }}>
                1 Barrack Street, Office 2.18<br />
                Hamilton<br />
                ML3 0HS, Scotland
              </address>
            </div>

            <div
              className="rounded-2xl p-5"
              style={{ background: "rgba(255,255,255,0.04)", boxShadow: "0 0 0 1px rgba(255,255,255,0.08)" }}
            >
              <p className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-2">Phone</p>
              <a
                href="tel:07909032889"
                className="text-sm font-bold text-white hover:text-amber-400 transition-colors"
              >
                07909 032889
              </a>
              <p className="mt-1 text-xs" style={{ color: "rgba(255,255,255,0.40)" }}>
                Mon–Fri 08:00–19:00<br />
                Sat–Sun 08:00–17:00
              </p>
            </div>

            <div
              className="rounded-2xl p-5"
              style={{ background: "rgba(255,255,255,0.04)", boxShadow: "0 0 0 1px rgba(255,255,255,0.08)" }}
            >
              <p className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-2">Email</p>
              <a
                href="mailto:hello@speedyvan.uk"
                className="text-sm font-bold text-white hover:text-amber-400 transition-colors break-all"
              >
                hello@speedyvan.uk
              </a>
            </div>
          </div>

          <div className="mt-10 flex flex-col sm:flex-row gap-4 items-center">
            <Link
              href="/book"
              className="inline-flex items-center justify-center rounded-xl px-8 py-4 font-black text-black text-base transition hover:brightness-110"
              style={{ background: "linear-gradient(135deg, #F59E0B 0%, #EA580C 100%)" }}
            >
              Get an Online Quote →
            </Link>
            <Link
              href="/#services"
              className="text-sm font-semibold text-white/60 hover:text-white transition-colors"
            >
              View all services
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
