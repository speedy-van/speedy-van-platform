import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { StorageEnquiryForm } from "@/components/storage/StorageEnquiryForm";
import { getServiceImage } from "@/lib/service-images";
import { absoluteUrl, SITE_OG_IMAGE, SITE_OG_IMAGE_HEIGHT, SITE_OG_IMAGE_WIDTH } from "@/lib/seo/constants";

export const metadata: Metadata = {
  title: "Storage Quote Enquiry | SpeedyVan",
  description:
    "Request a manual storage quote from SpeedyVan. Share your storage timing, estimated load, collection access and return plans with no online payment.",
  alternates: { canonical: absoluteUrl("/storage/enquiry") },
  openGraph: {
    title: "Storage Quote Enquiry | SpeedyVan",
    description:
      "Tell us what needs storing, when storage should start, collection access and return plans. The team will review and quote manually.",
    url: absoluteUrl("/storage/enquiry"),
    type: "website",
    images: [
      {
        url: SITE_OG_IMAGE,
        width: SITE_OG_IMAGE_WIDTH,
        height: SITE_OG_IMAGE_HEIGHT,
        alt: "SpeedyVan storage quote enquiry",
      },
    ],
  },
};

export default function StorageEnquiryPage() {
  return (
    <main className="bg-stone-100 py-8 text-stone-950 sm:py-10">
      <section className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[minmax(280px,0.34fr)_minmax(0,0.66fr)] lg:px-8">
        <aside className="space-y-5 lg:sticky lg:top-6 lg:self-start">
          <div className="rounded-2xl bg-stone-950 p-5 text-white shadow-sm sm:p-6">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-amber-300">Manual quote</p>
            <h1 className="mt-3 text-3xl font-black leading-tight tracking-normal">
              Request storage without starting a paid booking
            </h1>
            <p className="mt-4 text-sm leading-6 text-stone-300">
              Share timing, load size, collection access and return plans. The team will review and reply with a manual quote.
            </p>
            <div className="relative mt-5 aspect-[4/3] overflow-hidden rounded-xl border border-white/10 bg-stone-900">
              <Image
                src={getServiceImage("storage")}
                alt="Packed boxes ready for storage transport"
                fill
                sizes="(max-width: 1023px) 100vw, 360px"
                className="object-cover"
                priority
              />
            </div>
            <div className="mt-5 flex flex-wrap gap-2 text-[11px] font-bold uppercase tracking-[0.12em] text-stone-300">
              <span className="rounded-full border border-white/15 px-3 py-1.5">No checkout</span>
              <span className="rounded-full border border-white/15 px-3 py-1.5">Manual review</span>
              <span className="rounded-full border border-white/15 px-3 py-1.5">Transport optional</span>
            </div>
          </div>
          <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-black text-stone-950">Transport only?</h2>
            <p className="mt-2 text-sm leading-6 text-stone-600">
              If you already have storage arranged and only need the van journey, use the normal priced booking flow.
            </p>
            <Link
              href="/book?service=storage-transport"
              className="mt-4 inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-amber-400 px-4 text-sm font-black text-stone-950 hover:bg-amber-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2"
            >
              Book storage transport
            </Link>
          </div>
          <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-black text-stone-950">What happens next</h2>
            <ol className="mt-3 space-y-3 text-sm leading-6 text-stone-600">
              <li><strong className="text-stone-950">1.</strong> We check the storage timing, load and access details.</li>
              <li><strong className="text-stone-950">2.</strong> The team prepares a manual quote for storage and any transport needed.</li>
              <li><strong className="text-stone-950">3.</strong> You reply to accept, adjust details, or ask questions.</li>
            </ol>
          </div>
        </aside>
        <div>
          <StorageEnquiryForm />
        </div>
      </section>
    </main>
  );
}
