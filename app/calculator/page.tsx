import type { Metadata } from "next";
import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";
import Reveal from "@/components/blog/Reveal";
import ClosingCta from "@/components/sections/closing/ClosingCta";
import Calculator from "@/components/calculator/Calculator";
import ProofRed from "@/components/pricing/ProofRed";
import PageBackdrop from "@/components/motion/PageBackdrop";
import { calcCopy } from "@/lib/content/calculator";
import c from "@/components/customers/customers.module.css";
import s from "@/components/calculator/calculator.module.css";

export const metadata: Metadata = {
  title: calcCopy.meta.title,
  description: calcCopy.meta.description,
  alternates: { canonical: "/calculator" },
  openGraph: { title: calcCopy.meta.title, description: calcCopy.meta.description, url: "/calculator", type: "website" },
};

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Roma deductions calculator",
    url: "/calculator",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Any",
    description: calcCopy.meta.description,
    publisher: { "@type": "Organization", name: "Roma" },
  },
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "/" },
      { "@type": "ListItem", position: 2, name: "Deductions calculator", item: "/calculator" },
    ],
  },
];

/**
 * /calculator (DESIGN.md §G.17, brief §2): the /customers sheet and centred intro, with the
 * calculator card where /customers has its story strip; then "How we calculate" and the
 * closing CTA. [data-nav-light] + LIGHT_ROUTES: the nav is solid cream from the top.
 */
export default function CalculatorPage() {
  return (
    <>
      <Nav />
      <main>
        <div className={c.page}>
          <Reveal as="section" className="container-lg" aria-labelledby="calc-title">
            <div className={c.intro} data-nav-light>
              <h1 id="calc-title" className={`${c.heading} type-h2`} data-reveal>
                {calcCopy.heading}
              </h1>
              <p className={`${c.lead} type-lead`} data-reveal>
                {calcCopy.lead}
              </p>
            </div>
          </Reveal>
          <div className={`container-lg ${s.calcWrap}`}>
            <Calculator />
          </div>
        </div>

        {/* On the red stretch of the page backdrop, between the sheet and the closing CTA. */}
        <ProofRed label={calcCopy.proof.label} heading={calcCopy.proof.heading} />
        <ClosingCta copy={calcCopy.closing} secondary={calcCopy.closing.secondary} />
      </main>
      <Footer />
      <PageBackdrop />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
    </>
  );
}
