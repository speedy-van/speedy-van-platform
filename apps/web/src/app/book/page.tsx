import type { Metadata } from "next";
import { BookingFlow } from "@/components/booking/BookingFlow";

export const metadata: Metadata = {
  title: "Book Your Van | SpeedyVan",
  description: "Book a man and van, house removal, or delivery in minutes. Instant pricing, Stripe payment.",
  robots: { index: false, follow: false },
};

export default function BookPage() {
  return <BookingFlow />;
}
