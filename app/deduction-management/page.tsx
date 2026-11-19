import type { Metadata } from "next";
import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";
import PageBackdrop from "@/components/motion/PageBackdrop";
import ProductHero from "@/components/product/hero/ProductHero";
import DeskWindow from "@/components/product/deductions/DeskWindow";
import Journey from "@/components/product/deductions/Journey";
import Numbers from "@/components/product/numbers/Numbers";
import Story from "@/components/product/story/Story";
import TrustStrip from "@/components/sections/trust/TrustStrip";
import Faq from "@/components/sections/faq/Faq";
import ClosingCta from "@/components/sections/closing/ClosingCta";
import { dmHero, faqOrder } from "@/lib/content/products";

export const metadata: Metadata = {
  title: "Deduction management | Roma",
  description:
    "Every deduction from UNFI, KeHE and your other retailers in one inbox, with its backup attached. Check it, dispute the invalid ones in two clicks and track every dispute to payment.",
};

/** /deduction-management (DESIGN.md §G.11). */
export default function DeductionManagementPage() {
  return (
    <>
      <Nav />
      <main>
        <ProductHero copy={dmHero}>
          <DeskWindow />
        </ProductHero>
        <TrustStrip />
        <Journey />
        <Numbers />
        <Story />
        <Faq order={faqOrder.deductions} />
        <ClosingCta />
      </main>
      <Footer />
      <PageBackdrop />
    </>
  );
}
