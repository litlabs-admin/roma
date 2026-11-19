import type { Metadata } from "next";
import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";
import PageBackdrop from "@/components/motion/PageBackdrop";
import ProductHero from "@/components/product/hero/ProductHero";
import Story from "@/components/product/story/Story";
import TrustStrip from "@/components/sections/trust/TrustStrip";
import Faq from "@/components/sections/faq/Faq";
import ClosingCta from "@/components/sections/closing/ClosingCta";
import FirstDays from "@/components/compare/FirstDays";
import FitLedger from "@/components/compare/FitLedger";
import WhoHoldsThePen from "@/components/compare/WhoHoldsThePen";
import PriceSlip from "@/components/compare/PriceSlip";
import WorkingPaper from "@/components/compare/WorkingPaper";
import { cmpFaqCopy, cmpFaqs, cmpHero, firstDays } from "@/lib/content/compare/glimpse";

export const metadata: Metadata = {
  title: "Roma vs. Glimpse | Roma",
  description:
    "Roma vs. Glimpse, compared honestly. Glimpse is a managed deductions service with a 45-day onboarding and custom quotes. Roma is live in under 5 minutes, from $399/month, and you confirm every dispute.",
};

/** /compare/glimpse (DESIGN.md §G.13). Copy + sources: lib/content/compare/glimpse.ts. */
export default function CompareGlimpsePage() {
  return (
    <>
      <Nav />
      <main>
        <ProductHero copy={cmpHero} caption={firstDays.caption}>
          <FirstDays />
        </ProductHero>
        <TrustStrip />
        <FitLedger />
        <WhoHoldsThePen />
        <PriceSlip />
        <WorkingPaper />
        <Story />
        <Faq items={cmpFaqs} copy={cmpFaqCopy} />
        <ClosingCta />
      </main>
      <Footer />
      <PageBackdrop />
    </>
  );
}
