import type { Metadata } from "next";
import Link from "next/link";
import { absoluteUrl } from "@/lib/seo/constants";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description:
    "How SpeedyVan uses cookies and similar technologies, and how you can control them.",
  robots: { index: true, follow: true },
  alternates: { canonical: absoluteUrl("/cookies") },
};

const LAST_UPDATED = "April 2026";

export default function CookiesPage() {
  return (
    <article style={{ background: "#0A0A0A", color: "rgba(255,255,255,0.70)" }}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <header
          className="mb-10 pb-6"
          style={{ borderBottom: "1px solid rgba(245,158,11,0.15)" }}
        >
          <p className="text-xs font-black uppercase tracking-wider text-amber-400">
            Legal
          </p>
          <h1 className="mt-2 text-3xl sm:text-4xl font-black text-white">
            Cookie Policy
          </h1>
          <p className="mt-3 text-sm" style={{ color: "rgba(255,255,255,0.40)" }}>
            Last updated: {LAST_UPDATED}
          </p>
        </header>

        <div className="prose max-w-none prose-headings:scroll-mt-20 prose-h2:text-2xl prose-h2:font-black prose-h2:text-white prose-h2:mt-10 prose-h3:text-lg prose-h3:font-bold prose-h3:text-white prose-p:leading-relaxed prose-li:leading-relaxed prose-a:text-amber-400 prose-a:no-underline hover:prose-a:underline prose-strong:text-white"
          style={{ color: "rgba(255,255,255,0.60)" }}
        >
          <p>
            This Cookie Policy explains what cookies are, which ones SpeedyVan
            uses, and how you can manage them. Please read this together with
            our <Link href="/privacy">Privacy Policy</Link>.
          </p>

          <h2>1. What are cookies?</h2>
          <p>
            Cookies are small text files placed on your device by websites you
            visit. They are widely used to make websites work, or work more
            efficiently, and to provide reporting information.
          </p>

          <h2>2. Categories of cookies we use</h2>
          <h3>Strictly necessary</h3>
          <p>
            Required for the site to function — for example, to keep you signed
            in, secure your booking session, and remember your cookie choices.
            These cannot be switched off.
          </p>
          <h3>Analytics</h3>
          <p>
            We use Google Analytics 4 to understand which pages are most useful
            and how visitors find us. Loaded only after you accept analytics
            cookies.
          </p>
          <h3>Marketing</h3>
          <p>
            Meta (Facebook) Pixel and TikTok Pixel measure the effectiveness of
            our advertising. Loaded only after you accept marketing cookies.
          </p>

          <h2>3. Managing your preferences</h2>
          <p>
            You can update your consent at any time using the cookie banner that
            appears on first visit, or by clearing your site data in your
            browser. Most browsers also let you block or delete cookies entirely
            via their settings — note that blocking strictly necessary cookies
            may break parts of the site.
          </p>

          <h2>4. Changes</h2>
          <p>
            We may update this Cookie Policy occasionally to reflect changes in
            the technologies we use or in legal requirements.
          </p>

          <h2>5. Contact</h2>
          <p>
            Questions? Email{" "}
            <a href="mailto:support@speedyvan.uk">support@speedyvan.uk</a>.
          </p>
        </div>

        <footer
          className="mt-12 pt-6 flex items-center justify-between text-sm"
          style={{ borderTop: "1px solid rgba(245,158,11,0.15)" }}
        >
          <Link href="/" className="font-bold text-amber-400 hover:underline">
            ← Back to home
          </Link>
          <Link
            href="/privacy"
            className="hover:text-white transition-colors"
            style={{ color: "rgba(255,255,255,0.40)" }}
          >
            View Privacy Policy →
          </Link>
        </footer>
      </div>
    </article>
  );
}
