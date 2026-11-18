import type { Metadata } from "next";
import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";
import PageBackdrop from "@/components/motion/PageBackdrop";
import ProductHero from "@/components/product/hero/ProductHero";
import CheckLedger from "@/components/product/accounting/CheckLedger";
import TieOut from "@/components/product/accounting/TieOut";
import GlMap from "@/components/product/accounting/GlMap";
import Numbers from "@/components/product/numbers/Numbers";
import Story from "@/components/product/story/Story";
import TrustStrip from "@/components/sections/trust/TrustStrip";
import Coverage from "@/components/platform/coverage/Coverage";
import Compliance from "@/components/sections/compliance/Compliance";
import Faq from "@/components/sections/faq/Faq";
import ClosingCta from "@/components/sections/closing/ClosingCta";
import { acHero, faqOrder } from "@/lib/content/products";

export const metadata: Metadata = {
  title: "Deduction accounting | Roma",
  description:
    "Tie every remittance to its invoices and deductions, code each line to your GL and export to NetSuite, QuickBooks or CSV. Close books with confidence.",
};

/** /accounting (DESIGN.md §G.11). */
export default function AccountingPage() {
  return (
    <>
      <Nav />
      <main>
        <ProductHero copy={acHero}>
          <CheckLedger />
        </ProductHero>
        <TrustStrip />
        <TieOut />
        <GlMap />
        <Numbers />
        <Coverage />
        <Compliance />
        <Story />
        <Faq order={faqOrder.accounting} />
        <ClosingCta />
      </main>
      <Footer />
      <PageBackdrop />
    </>
  );
}
