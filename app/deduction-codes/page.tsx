import type { Metadata } from "next";
import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";
import BlogHero from "@/components/blog/BlogHero";
import CodeLibrary from "@/components/legal/CodeLibrary";
import ClosingCta from "@/components/sections/closing/ClosingCta";
import { codesCopy, codesHero } from "@/lib/content/deductionCodes";

export const metadata: Metadata = {
  title: "Deduction code library | Roma",
  description: codesCopy.lead,
};

/** /deduction-codes: the Blog hero (§G.10) → the code library sheet → closing CTA. */
export default function DeductionCodesPage() {
  return (
    <>
      <Nav />
      <main>
        <BlogHero copy={codesHero} />
        <CodeLibrary />
        <ClosingCta />
      </main>
      <Footer />
    </>
  );
}
