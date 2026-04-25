import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { StickyBookBar } from "@/components/booking/StickyBookBar";
import { ScrollReveal } from "@/components/ScrollReveal";
import { CtaClickTracker } from "@/components/CtaClickTracker";
import { LiveActivityFeed } from "@/components/LiveActivityFeed";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { ExitIntentPopup } from "@/components/ExitIntentPopup";
import { LocationPersonalization } from "@/components/LocationPersonalization";
import { SofaItemPopup } from "@/components/SofaItemPopup";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <LocationPersonalization />
      <Navbar />
      <main className="pb-28 md:pb-0">{children}</main>
      <Footer />
      <StickyBookBar />
      <ScrollReveal />
      <CtaClickTracker />
      <LiveActivityFeed />
      <WhatsAppButton />
      <ExitIntentPopup />
      <SofaItemPopup />
    </>
  );
}
