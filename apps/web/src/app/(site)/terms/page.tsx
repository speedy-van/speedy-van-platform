import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms & Conditions | SpeedyVan",
  description:
    "SpeedyVan terms and conditions for man and van, removal and delivery services across Scotland — booking, payment, cancellation, liability and customer responsibilities.",
  robots: { index: true, follow: true },
  alternates: { canonical: "/terms" },
};

const LAST_UPDATED = "April 2026";

export default function TermsPage() {
  return (
    <article className="bg-white text-slate-800">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <header className="mb-10 border-b border-slate-200 pb-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary-600">
            Legal
          </p>
          <h1 className="mt-2 text-3xl sm:text-4xl font-extrabold text-slate-900">
            Terms &amp; Conditions
          </h1>
          <p className="mt-3 text-sm text-slate-500">
            Last updated: {LAST_UPDATED}
          </p>
        </header>

        <div className="prose prose-slate max-w-none prose-headings:scroll-mt-20 prose-h2:text-2xl prose-h2:font-bold prose-h2:text-slate-900 prose-h2:mt-10 prose-h3:text-lg prose-h3:font-semibold prose-h3:text-slate-900 prose-p:leading-relaxed prose-li:leading-relaxed prose-a:text-primary-600 prose-a:no-underline hover:prose-a:underline">
          <p>
            These Terms and Conditions (the &ldquo;<strong>Terms</strong>&rdquo;)
            govern the supply of services by <strong>SpeedyVan</strong> (&ldquo;we&rdquo;,
            &ldquo;us&rdquo;, &ldquo;our&rdquo;) to you (the &ldquo;Customer&rdquo;)
            when you book any service through our website, mobile interface or
            telephone. By placing a booking you confirm that you have read,
            understood and agreed to these Terms.
          </p>

          <h2>1. About us</h2>
          <ul>
            <li><strong>Trading name:</strong> SpeedyVan</li>
            <li>
              <strong>Registered office:</strong> 1 Barrack Street, Office 2.18,
              Hamilton ML3 0HS, Scotland
            </li>
            <li>
              <strong>Email:</strong>{" "}
              <a href="mailto:support@speedy-van.co.uk">support@speedy-van.co.uk</a>
            </li>
            <li><strong>Phone:</strong> 01202 129746</li>
          </ul>

          <h2>2. Services we provide</h2>
          <p>
            SpeedyVan provides removal and delivery services across Scotland,
            including:
          </p>
          <ul>
            <li>Man and van hire (single items, small moves, flat-pack runs).</li>
            <li>House and flat removals (studio to 4-bedroom).</li>
            <li>Office and commercial relocations.</li>
            <li>Furniture and parcel delivery.</li>
            <li>Same-day and scheduled bookings, 7 days a week.</li>
          </ul>
          <p>
            Specific service descriptions, vehicle sizes and crew options are
            listed on the relevant service page at the time of booking.
          </p>

          <h2>3. Quotes and pricing</h2>
          <ul>
            <li>
              Quotes are based on information you provide (postcodes, items,
              date, time, access conditions). Inaccurate information may result
              in a revised price on the day.
            </li>
            <li>
              All prices are in GBP (£) and inclusive of VAT where applicable.
            </li>
            <li>
              Hourly bookings have a minimum charge equal to the agreed minimum
              hours. Additional time is charged in 30-minute increments at the
              same hourly rate.
            </li>
            <li>
              Fixed-price quotes assume reasonable kerbside access at both ends
              and a continuous, uninterrupted job.
            </li>
          </ul>

          <h2>4. Booking and payment</h2>
          <ul>
            <li>
              A booking becomes binding when you receive a confirmation email
              and reference number.
            </li>
            <li>
              Payment is taken in full at the time of booking via Stripe
              (debit/credit card, Apple Pay, Google Pay).
            </li>
            <li>
              We do not store your full card number. All payments are processed
              over a secure, PCI-DSS compliant connection.
            </li>
            <li>
              Where additional time, congestion charges, parking suspension or
              waiting time is incurred on the day, the additional cost will be
              charged to the same payment method, with your consent.
            </li>
          </ul>

          <h2>5. Cancellation, rescheduling and refunds</h2>
          <p>
            Because vans, drivers and time slots are reserved exclusively for
            your job, our cancellation policy is as follows:
          </p>
          <ul>
            <li>
              <strong>More than 48 hours before pickup:</strong> full refund or
              free reschedule.
            </li>
            <li>
              <strong>Between 24 and 48 hours before pickup:</strong> 50% refund
              or free reschedule (subject to availability).
            </li>
            <li>
              <strong>Less than 24 hours before pickup:</strong> no refund.
              Reschedule may be offered at our discretion subject to a £25
              admin fee.
            </li>
            <li>
              <strong>Customer no-show:</strong> the booking is treated as
              completed; no refund is due.
            </li>
          </ul>
          <p>
            Refunds are processed back to the original payment method within
            5–10 business days. These cancellation rights are in addition to
            any statutory rights you may have under the Consumer Contracts
            Regulations.
          </p>

          <h2>6. Customer responsibilities</h2>
          <p>You agree to:</p>
          <ul>
            <li>Provide accurate booking information.</li>
            <li>
              Be present (or have an authorised adult representative present)
              at both pickup and drop-off addresses.
            </li>
            <li>
              Ensure safe, lawful, kerbside access for the van. Where parking
              suspensions or permits are required, obtaining and paying for
              them is your responsibility.
            </li>
            <li>
              Disassemble, pack and protect items unless you have purchased our
              packing or assembly add-on.
            </li>
            <li>
              Not present any of the following <strong>prohibited items</strong>:
              cash, jewellery, firearms, illegal substances, hazardous or
              flammable materials, perishable food, live plants requiring
              special handling, livestock or pets.
            </li>
          </ul>

          <h2>7. Our responsibilities and liability</h2>
          <ul>
            <li>
              All vehicles are insured for goods in transit up to{" "}
              <strong>£10,000 per booking</strong> as standard. Higher cover can
              be arranged in advance on request.
            </li>
            <li>
              We carry £1,000,000 public liability insurance.
            </li>
            <li>
              We do not accept liability for: pre-existing damage, items packed
              by the customer that break in transit due to inadequate packing,
              cosmetic damage to flat-pack furniture moved fully assembled, or
              items declared as prohibited under section&nbsp;6.
            </li>
            <li>
              Claims for loss or damage must be reported in writing within
              <strong> 7 days</strong> of completion of the job, with
              photographic evidence and a description of the items affected.
            </li>
            <li>
              Our maximum aggregate liability for any one booking is limited to
              the value of the goods in transit cover (£10,000 standard) and in
              no event will we be liable for indirect, consequential or
              economic loss.
            </li>
            <li>
              Nothing in these Terms limits or excludes liability for death or
              personal injury caused by our negligence, fraud, or any liability
              that cannot be limited by law.
            </li>
          </ul>

          <h2>8. Driver conduct</h2>
          <p>
            Our drivers are professional, fully insured and DBS-checked where
            applicable. They will:
          </p>
          <ul>
            <li>Arrive within the agreed time window.</li>
            <li>Treat customers and property with respect and care.</li>
            <li>
              Refuse to load any item which is unsafe, unlawful, or breaches
              section&nbsp;6, without penalty to themselves or the company.
            </li>
            <li>Stop work immediately if site conditions become unsafe.</li>
          </ul>

          <h2>9. Force majeure</h2>
          <p>
            We are not liable for delay or non-performance caused by events
            outside our reasonable control, including but not limited to:
            severe weather, road traffic accidents, road closures, strikes,
            civil unrest, acts of government, fire, flood, or pandemics. Where
            possible we will reschedule the affected booking at no charge.
          </p>

          <h2>10. Complaints and dispute resolution</h2>
          <p>
            If you are unhappy with any part of our service, please email{" "}
            <a href="mailto:support@speedy-van.co.uk">support@speedy-van.co.uk</a>{" "}
            within 7 days of completion. We aim to acknowledge complaints
            within 2 business days and resolve them within 14 business days.
            If a dispute cannot be resolved, you may refer it to an alternative
            dispute-resolution provider before pursuing legal action.
          </p>

          <h2>11. Privacy</h2>
          <p>
            Your personal data is handled in accordance with our{" "}
            <Link href="/privacy">Privacy Policy</Link>.
          </p>

          <h2>12. Governing law and jurisdiction</h2>
          <p>
            These Terms, the booking contract and any dispute or claim arising
            out of or in connection with them are governed by the laws of
            <strong> Scotland</strong> (or the law of England &amp; Wales where
            the Customer is resident there). Each party irrevocably agrees that
            the courts of Scotland (or, where applicable, England &amp; Wales)
            have exclusive jurisdiction.
          </p>

          <h2>13. Changes to these Terms</h2>
          <p>
            We may amend these Terms from time to time to reflect changes in
            law, regulation or our services. The version in force at the time
            you place a booking is the version that applies to that booking.
          </p>
        </div>

        <footer className="mt-12 pt-6 border-t border-slate-200 flex items-center justify-between text-sm">
          <Link href="/" className="text-primary-600 hover:underline font-medium">
            ← Back to home
          </Link>
          <Link href="/privacy" className="text-slate-500 hover:text-slate-700">
            View Privacy Policy →
          </Link>
        </footer>
      </div>
    </article>
  );
}
