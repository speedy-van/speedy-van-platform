import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy | SpeedyVan",
  description:
    "SpeedyVan privacy policy — how we collect, use, store and protect your personal data under the UK GDPR and Data Protection Act 2018.",
  robots: { index: true, follow: true },
  alternates: { canonical: "/privacy" },
};

const LAST_UPDATED = "April 2026";

export default function PrivacyPage() {
  return (
    <article className="bg-white text-slate-800">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <header className="mb-10 border-b border-slate-200 pb-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary-600">
            Legal
          </p>
          <h1 className="mt-2 text-3xl sm:text-4xl font-extrabold text-slate-900">
            Privacy Policy
          </h1>
          <p className="mt-3 text-sm text-slate-500">
            Last updated: {LAST_UPDATED}
          </p>
        </header>

        <div className="prose prose-slate max-w-none prose-headings:scroll-mt-20 prose-h2:text-2xl prose-h2:font-bold prose-h2:text-slate-900 prose-h2:mt-10 prose-h3:text-lg prose-h3:font-semibold prose-h3:text-slate-900 prose-p:leading-relaxed prose-li:leading-relaxed prose-a:text-primary-600 prose-a:no-underline hover:prose-a:underline">
          <p>
            This Privacy Policy explains how <strong>SpeedyVan</strong>
            {" "}(&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;)
            collects, uses, stores and protects personal information when you
            use our website, book a removal or delivery, or otherwise interact
            with our services. We are committed to processing your data fairly,
            lawfully and transparently in accordance with the UK General Data
            Protection Regulation (UK GDPR) and the Data Protection Act 2018.
          </p>

          <h2>1. Who we are</h2>
          <p>
            SpeedyVan provides man and van, removals, and delivery services
            across Scotland.
          </p>
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
          <p>
            We are the data controller for personal data collected through this
            website and our booking platform.
          </p>

          <h2>2. Information we collect</h2>
          <p>
            We only collect information that is necessary to provide and improve
            our services. The categories of personal data we may process include:
          </p>
          <ul>
            <li>
              <strong>Identity data:</strong> full name, salutation.
            </li>
            <li>
              <strong>Contact data:</strong> email address, mobile/phone number.
            </li>
            <li>
              <strong>Booking data:</strong> pickup and drop-off addresses
              (including postcodes), date and time of move, item descriptions,
              service tier selected, special requirements (e.g. parking, stairs,
              access notes).
            </li>
            <li>
              <strong>Payment data:</strong> billing address and the last four
              digits of the card used. <strong>We never see or store full card
              numbers.</strong> All payments are processed securely by Stripe
              (PCI-DSS Level 1 certified).
            </li>
            <li>
              <strong>Account data:</strong> hashed password, account role
              (customer / driver / admin), preferences.
            </li>
            <li>
              <strong>Technical data:</strong> IP address (stored hashed where
              possible), browser type and version, device identifiers, operating
              system, time zone setting, pages visited, referring URL.
            </li>
            <li>
              <strong>Communications data:</strong> messages sent through our
              in-app chat, emails, SMS, and call records (limited metadata only).
            </li>
            <li>
              <strong>Marketing data:</strong> consent preferences for cookies
              and marketing communications.
            </li>
          </ul>

          <h2>3. How we use your information</h2>
          <p>We use your personal data for the following purposes:</p>
          <ul>
            <li>To create and manage your account.</li>
            <li>To process bookings, payments and refunds.</li>
            <li>To dispatch drivers and provide live tracking.</li>
            <li>
              To send transactional communications (booking confirmations,
              receipts, reminders, status updates).
            </li>
            <li>To provide customer support.</li>
            <li>
              To detect, prevent and respond to fraud, abuse, security
              incidents and unlawful activity.
            </li>
            <li>To comply with our legal and regulatory obligations.</li>
            <li>
              To analyse, improve and personalise our services (only where you
              have consented to non-essential cookies).
            </li>
          </ul>

          <h2>4. Legal bases for processing</h2>
          <p>
            Under the UK GDPR, we rely on the following lawful bases:
          </p>
          <ul>
            <li>
              <strong>Performance of a contract</strong> — to provide the
              removal/delivery service you have booked.
            </li>
            <li>
              <strong>Legitimate interests</strong> — to operate, secure and
              improve our platform, prevent fraud, and protect our drivers and
              customers.
            </li>
            <li>
              <strong>Consent</strong> — for non-essential cookies, analytics
              and marketing communications (you may withdraw consent at any time).
            </li>
            <li>
              <strong>Legal obligation</strong> — to retain financial records,
              respond to lawful requests, and comply with tax law.
            </li>
          </ul>

          <h2>5. Sharing your data</h2>
          <p>
            We never sell your personal data. We share it only with the
            processors and partners we need to deliver our service:
          </p>
          <ul>
            <li>
              <strong>Stripe</strong> — payment processing (cards, Apple Pay,
              Google Pay).
            </li>
            <li>
              <strong>Mapbox</strong> — address autocomplete, geocoding and live
              tracking maps.
            </li>
            <li>
              <strong>Resend</strong> — transactional and customer-service
              emails.
            </li>
            <li>
              <strong>Vercel</strong> — secure cloud hosting and edge delivery.
            </li>
            <li>
              <strong>Pusher</strong> — real-time chat and driver location
              updates.
            </li>
            <li>
              <strong>Drivers</strong> — only the booking details strictly
              necessary to complete the job (name, contact, addresses, items,
              access notes).
            </li>
            <li>
              <strong>Authorities</strong> — if required by law, court order,
              or to protect our legal rights.
            </li>
          </ul>
          <p>
            All processors are bound by data-processing agreements that meet UK
            GDPR standards. Where data is transferred outside the UK, we rely on
            adequacy decisions or Standard Contractual Clauses.
          </p>

          <h2>6. Cookies and analytics</h2>
          <p>
            We use a small number of cookies to make the site work and, with
            your consent, to understand how it is used. You will see a cookie
            banner the first time you visit. You can change or withdraw your
            consent at any time from the cookie settings link in the footer.
          </p>
          <ul>
            <li>
              <strong>Strictly necessary</strong> — session, login, CSRF
              protection, cookie-consent record. Always on; cannot be disabled.
            </li>
            <li>
              <strong>Analytics</strong> — Google Analytics 4. Only loaded after
              consent.
            </li>
            <li>
              <strong>Marketing</strong> — Meta (Facebook) Pixel, TikTok Pixel.
              Only loaded after consent.
            </li>
          </ul>

          <h2>7. How long we keep your data</h2>
          <ul>
            <li>
              <strong>Booking and financial records:</strong> 7 years (HMRC
              requirement).
            </li>
            <li>
              <strong>Customer accounts:</strong> for as long as the account is
              active, then deleted on request or after 3 years of inactivity.
            </li>
            <li>
              <strong>Anonymous visitor / analytics data:</strong> up to 90 days.
            </li>
            <li>
              <strong>Cookie consent:</strong> 12 months, then re-asked.
            </li>
            <li>
              <strong>Support communications:</strong> up to 2 years after
              resolution.
            </li>
          </ul>

          <h2>8. How we protect your data</h2>
          <p>
            We use TLS 1.2+ encryption in transit, encrypted databases at rest,
            principle-of-least-privilege access controls, hashed passwords
            (bcrypt), audited admin actions and continuous monitoring for
            unusual activity. Despite our best efforts, no system is 100%
            secure; we will notify you and the ICO of any qualifying breach
            without undue delay.
          </p>

          <h2>9. Your rights</h2>
          <p>Under the UK GDPR you have the right to:</p>
          <ul>
            <li>Access the personal data we hold about you.</li>
            <li>Request correction of inaccurate or incomplete data.</li>
            <li>
              Request erasure (the &ldquo;right to be forgotten&rdquo;), subject
              to legal retention obligations.
            </li>
            <li>Restrict or object to processing.</li>
            <li>Receive your data in a portable, machine-readable format.</li>
            <li>
              Withdraw consent at any time (this does not affect the lawfulness
              of processing carried out before withdrawal).
            </li>
            <li>Lodge a complaint with the supervisory authority (see below).</li>
          </ul>
          <p>
            To exercise any of these rights, please email{" "}
            <a href="mailto:support@speedy-van.co.uk">support@speedy-van.co.uk</a>.
            We aim to respond within 30 days.
          </p>

          <h2>10. Supervisory authority</h2>
          <p>
            You have the right to complain to the UK Information Commissioner&apos;s
            Office (ICO):
          </p>
          <ul>
            <li>Website: <a href="https://ico.org.uk" rel="noopener noreferrer" target="_blank">ico.org.uk</a></li>
            <li>Helpline: 0303 123 1113</li>
            <li>Address: Wycliffe House, Water Lane, Wilmslow, Cheshire SK9 5AF</li>
          </ul>

          <h2>11. Children</h2>
          <p>
            Our services are not intended for individuals under 18. We do not
            knowingly collect personal data from children.
          </p>

          <h2>12. Changes to this policy</h2>
          <p>
            We may update this Privacy Policy from time to time to reflect
            changes in law or our services. The &ldquo;Last updated&rdquo; date
            at the top will always show when it was last revised. Material
            changes will be notified by email or by a prominent notice on the
            site.
          </p>

          <h2>13. Contact us</h2>
          <p>
            If you have any questions about this policy or how we handle your
            personal data, please contact our team at{" "}
            <a href="mailto:support@speedy-van.co.uk">support@speedy-van.co.uk</a>{" "}
            or write to us at the address in section&nbsp;1.
          </p>
        </div>

        <footer className="mt-12 pt-6 border-t border-slate-200 flex items-center justify-between text-sm">
          <Link href="/" className="text-primary-600 hover:underline font-medium">
            ← Back to home
          </Link>
          <Link href="/terms" className="text-slate-500 hover:text-slate-700">
            View Terms &amp; Conditions →
          </Link>
        </footer>
      </div>
    </article>
  );
}
