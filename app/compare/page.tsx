import type { Metadata } from "next";
import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";
import PageBackdrop from "@/components/motion/PageBackdrop";
import ProductHero from "@/components/product/hero/ProductHero";
import TrustStrip from "@/components/sections/trust/TrustStrip";
import Story from "@/components/product/story/Story";
import Faq from "@/components/sections/faq/Faq";
import ClosingCta from "@/components/sections/closing/ClosingCta";
import CalculatorBanner from "@/components/calculator/CalculatorBanner";
import CompareHub from "@/components/compare/CompareHub";
import CompareMatrix from "@/components/compare/CompareMatrix";
import LedgerSheet from "@/components/compare/visuals/LedgerSheet";
import { SpotlightProvider } from "@/components/compare/spotlight";
import { competitors, compareHref } from "@/lib/content/compare";
import { compareHubCopy, compareHubFaqs } from "@/lib/content/compare/criteria";

const { meta, hero, hub } = compareHubCopy;

export const metadata: Metadata = {
  title: meta.title,
  description: meta.description,
  alternates: { canonical: "/compare" },
  openGraph: { title: meta.title, description: meta.description, url: "/compare", type: "website" },
};

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Roma compared with other deduction tools",
    itemListElement: competitors.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: `Roma vs. ${c.name}`, url: compareHref(c.slug) })),
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: compareHubFaqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  },
];

/**
 * /compare (DESIGN.md §G.13a): every competitor on the same eight questions. Same frame
 * as /compare/[slug] (hero → trust → … → hub → proof → FAQ → CTA) with its own art (the
 * comparison sheet) and its own interaction (the spotlight, shared by matrix and hub).
 */
export default function CompareHubPage() {
  return (
    <>
      <Nav />
      <main>
        <ProductHero copy={hero} caption={`Competitor answers from each company’s public website, checked ${compareHubCopy.matrix.checked}.`} layout="centered">
          <LedgerSheet />
        </ProductHero>
        <TrustStrip />
        <SpotlightProvider>
          <CompareMatrix />
          <CalculatorBanner />
          <CompareHub others={competitors} title={hub.title} lead={hub.lead} />
        </SpotlightProvider>
        <Story />
        <Faq items={compareHubFaqs} copy={{ label: "Compare", lines: [{ text: "Still comparing?" }, { text: "Here are straight ", accent: "answers" }] }} />
        <ClosingCta />
      </main>
      <Footer />
      <PageBackdrop />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
    </>
  );
}
