import type { Metadata } from "next";
import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";
import PageBackdrop from "@/components/motion/PageBackdrop";
import PlatformHero from "@/components/platform/hero/PlatformHero";
import Capabilities from "@/components/platform/capabilities/Capabilities";
import Coverage from "@/components/platform/coverage/Coverage";
import Modules from "@/components/platform/modules/Modules";
import LeanTeam from "@/components/platform/lean/LeanTeam";
import Proof from "@/components/platform/proof/Proof";
import Compliance from "@/components/sections/compliance/Compliance";
import Faq from "@/components/sections/faq/Faq";
import ClosingCta from "@/components/sections/closing/ClosingCta";

export const metadata: Metadata = {
  title: "How Roma works | Roma",
  description:
    "Roma pulls every deduction from your distributor and retailer portals, matches it to your invoices and promo agreements, and tracks every dispute through to payment. Live in 5 minutes. No ERP or IT project.",
};

/** /platform — "How Roma works" (DESIGN.md §G.9). */
export default function PlatformPage() {
  return (
    <>
      <Nav />
      <main>
        <PlatformHero />
        <Capabilities />
        <Coverage />
        <Modules />
        <LeanTeam />
        {/* backdrop journey as on home: cream → light red (Compliance) → red (Proof) → FAQ sheet */}
        <Compliance />
        <Proof />
        <Faq />
        <ClosingCta />
      </main>
      <Footer />
      {/* After the sections so it measures them last. */}
      <PageBackdrop />
    </>
  );
}
