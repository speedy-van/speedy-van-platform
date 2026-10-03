import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { BookingFlow } from "@/components/booking/BookingFlow";

export const metadata: Metadata = {
  title: "Book Your Van",
  description: "Book a man and van, house removal, or delivery in minutes. Instant pricing, Stripe payment.",
  robots: { index: false, follow: false },
};

type BookPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function firstParam(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default async function BookPage({ searchParams }: BookPageProps) {
  const params = (await searchParams) ?? {};
  if (firstParam(params.service) === "storage") {
    const next = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (key === "service") return;
      const selected = firstParam(value);
      if (selected) next.set(key, selected);
    });
    if (!next.has("source")) next.set("source", "book_service_storage");
    redirect(`/storage/enquiry?${next.toString()}`);
  }

  return <BookingFlow />;
}
