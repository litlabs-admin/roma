import type { Metadata } from "next";
import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";
import PageBackdrop from "@/components/motion/PageBackdrop";
import BlogHero from "@/components/blog/BlogHero";
import TrustStrip from "@/components/sections/trust/TrustStrip";
import ClosingCta from "@/components/sections/closing/ClosingCta";
import ResultsBento from "@/components/customers/ResultsBento";
import StoryLibrary from "@/components/customers/StoryLibrary";
import { custClosing, custHero } from "@/lib/content/customers";

export const metadata: Metadata = {
  title: "Customer stories | Roma",
  description:
    "How CPG brands stopped writing off deductions with Roma: Good Day Chocolate recovered $53K in 6 months, Smash Kitchen recovered $23K, and Mochidoki was live in 5 minutes.",
};

/** /customers (DESIGN.md §G.15): hero → logos → results bento → story library → CTA. */
export default function CustomersPage() {
  return (
    <>
      <Nav />
      <main>
        <BlogHero copy={custHero} />
        <TrustStrip />
        <ResultsBento />
        <StoryLibrary />
        <ClosingCta copy={custClosing} secondary={custClosing.secondary} />
      </main>
      <Footer />
      <PageBackdrop />
    </>
  );
}
