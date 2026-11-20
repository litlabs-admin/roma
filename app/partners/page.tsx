import type { Metadata } from "next";
import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";
import PageBackdrop from "@/components/motion/PageBackdrop";
import TrustStrip from "@/components/sections/trust/TrustStrip";
import Faq from "@/components/sections/faq/Faq";
import ClosingCta from "@/components/sections/closing/ClosingCta";
import PartnerHero from "@/components/partners/PartnerHero";
import WhyPartner from "@/components/partners/WhyPartner";
import Opportunities from "@/components/partners/Opportunities";
import SolutionsStory from "@/components/partners/SolutionsStory";
import Enablement from "@/components/partners/Enablement";
import FounderNote from "@/components/partners/FounderNote";
import PartnerSteps from "@/components/partners/PartnerSteps";
import ApplySection from "@/components/partners/ApplySection";
import { partnerClosing, partnerFaqCopy, partnerFaqs } from "@/lib/content/partners";

export const metadata: Metadata = {
  title: "Partner program | Roma",
  description:
    "Become a Roma partner. Bring deduction recovery to the CPG brands you work with: for accountants and fractional CFOs, technology partners, and investors and accelerators.",
};

/**
 * /partners (DESIGN.md §G.16), structured after Cygnet.One's partner page. Client-preview
 * shell: program terms are MOCK. Copy: lib/content/partners.ts.
 * Backdrop journey as the other pages: cream → light red (journey) → red (apply) → FAQ
 * sheet → closing CTA.
 */
export default function PartnersPage() {
  return (
    <>
      <Nav />
      <main>
        <PartnerHero />
        <TrustStrip />
        <WhyPartner />
        <Opportunities />
        <SolutionsStory />
        <Enablement />
        <FounderNote />
        <PartnerSteps />
        <ApplySection />
        <Faq items={partnerFaqs} copy={partnerFaqCopy} />
        <ClosingCta copy={partnerClosing} secondary={partnerClosing.secondary} />
      </main>
      <Footer />
      <PageBackdrop />
    </>
  );
}
