import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { StickyBookBar } from "@/components/booking/StickyBookBar";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main className="pb-20 md:pb-0">{children}</main>
      <Footer />
      <StickyBookBar />
    </>
  );
}
