import type { Metadata } from "next";
import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";
import PageBackdrop from "@/components/motion/PageBackdrop";
import ProductHero from "@/components/product/hero/ProductHero";
import EquationBoard from "@/components/product/analytics/EquationBoard";
import DrillDown from "@/components/product/analytics/DrillDown";
import ThreeViews from "@/components/product/analytics/ThreeViews";
import Numbers from "@/components/product/numbers/Numbers";
import Story from "@/components/product/story/Story";
import TrustStrip from "@/components/sections/trust/TrustStrip";
import Faq from "@/components/sections/faq/Faq";
import ClosingCta from "@/components/sections/closing/ClosingCta";
import { anHero, faqOrder } from "@/lib/content/products";

export const metadata: Metadata = {
  title: "Deduction analytics | Roma",
  description:
    "See where your deductions go across retailers, types and time periods. Trade rate per retailer, your deduction mix, and deductions as a share of revenue, down to a single line.",
};

/** /analytics (DESIGN.md §G.11). */
export default function AnalyticsPage() {
  return (
    <>
      <Nav />
      <main>
        <ProductHero copy={anHero} layout="centered">
          <EquationBoard />
        </ProductHero>
        <TrustStrip />
        <DrillDown />
        <ThreeViews />
        <Numbers />
        <Story />
        <Faq order={faqOrder.analytics} />
        <ClosingCta />
      </main>
      <Footer />
      <PageBackdrop />
    </>
  );
}
