import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Cookie Policy | SpeedyVan",
  description:
    "How SpeedyVan uses cookies and similar technologies, and how you can control them.",
  robots: { index: true, follow: true },
  alternates: { canonical: "/cookies" },
};

const LAST_UPDATED = "April 2026";

export default function CookiesPage() {
  return (
    <article className="bg-white text-slate-800">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <header className="mb-10 border-b border-slate-200 pb-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary-600">
            Legal
          </p>
          <h1 className="mt-2 text-3xl sm:text-4xl font-extrabold text-slate-900">
            Cookie Policy
          </h1>
          <p className="mt-3 text-sm text-slate-500">Last updated: {LAST_UPDATED}</p>
        </header>

        <div className="prose prose-slate max-w-none prose-h2:text-2xl prose-h2:font-bold prose-h2:text-slate-900 prose-h2:mt-10 prose-p:leading-relaxed prose-li:leading-relaxed prose-a:text-primary-600 prose-a:no-underline hover:prose-a:underline">
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
            <a href="mailto:support@speedy-van.co.uk">support@speedy-van.co.uk</a>.
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
