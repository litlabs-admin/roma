import type { Metadata } from "next";
import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";
import PageBackdrop from "@/components/motion/PageBackdrop";
import ProductHero from "@/components/product/hero/ProductHero";
import TrustStrip from "@/components/sections/trust/TrustStrip";
import Faq from "@/components/sections/faq/Faq";
import ClosingCta from "@/components/sections/closing/ClosingCta";
import Shelf from "@/components/customers/Shelf";
import StartingPoints from "@/components/customers/StartingPoints";
import CaseFiles from "@/components/customers/CaseFiles";
import TagWall from "@/components/customers/TagWall";
import { custFaqCopy, custFaqs, custHero, shelfCopy } from "@/lib/content/customers";

export const metadata: Metadata = {
  title: "Customer stories | Roma",
  description:
    "How natural and specialty CPG brands stopped writing off deductions: Good Day Chocolate recovered $53K in 6 months with Roma. Real starting points, what changed and what it was worth.",
};

/** /customers (DESIGN.md §G.15). Copy + illustrative data: lib/content/customers.ts. */
export default function CustomersPage() {
  return (
    <>
      <Nav />
      <main>
        <ProductHero copy={custHero} layout="centered" caption={shelfCopy.caption}>
          <Shelf />
        </ProductHero>
        <TrustStrip />
        <StartingPoints />
        <CaseFiles />
        <TagWall />
        <Faq items={custFaqs} copy={custFaqCopy} />
        <ClosingCta />
      </main>
      <Footer />
      <PageBackdrop />
    </>
  );
}
