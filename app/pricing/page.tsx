import type { Metadata } from "next";
import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";
import Reveal from "@/components/blog/Reveal";
import Button from "@/components/ui/Button";
import TrustStrip from "@/components/sections/trust/TrustStrip";
import ClosingCta from "@/components/sections/closing/ClosingCta";
import CalculatorCompact from "@/components/calculator/CalculatorCompact";
import PlanTable from "@/components/pricing/PlanTable";
import FeatureMatrix from "@/components/pricing/FeatureMatrix";
import Alternatives from "@/components/pricing/Alternatives";
import ProofRed from "@/components/pricing/ProofRed";
import { PlanPickProvider } from "@/components/pricing/PlanPick";
import PageBackdrop from "@/components/motion/PageBackdrop";
import PricingFaq from "@/components/pricing/PricingFaq";
import { ENTRY_PLAN, PRICING_FAQS, pricingCopy } from "@/lib/content/pricing";
import c from "@/components/customers/customers.module.css";
import s from "@/components/pricing/pricing.module.css";

export const metadata: Metadata = {
  title: pricingCopy.meta.title,
  description: pricingCopy.meta.description,
  alternates: { canonical: "/pricing" },
  openGraph: { title: pricingCopy.meta.title, description: pricingCopy.meta.description, url: "/pricing", type: "website" },
};

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Roma",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    description: pricingCopy.meta.description,
    // Brief §3.9: the Offer is published only once Roma confirms the price.
    ...(pricingCopy.offerConfirmed && ENTRY_PLAN.price
      ? { offers: { "@type": "Offer", price: String(ENTRY_PLAN.price), priceCurrency: "USD", url: "/pricing" } }
      : {}),
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: PRICING_FAQS.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  },
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "/" },
      { "@type": "ListItem", position: 2, name: "Pricing", item: "/pricing" },
    ],
  },
];

/**
 * /pricing (DESIGN.md §G.18, brief §3.2): the /customers centred intro with the plans where
 * /customers has its story strip (the fitting plan on the home Stories red) → what's
 * included → "Will Roma pay for itself?" (red band) → Roma vs alternatives (price tags) →
 * logo strip → proof on the red backdrop → FAQ sheet → closing CTA. [data-nav-light] + LIGHT_ROUTES:
 * the nav is solid cream from the top.
 */
export default function PricingPage() {
  const C = pricingCopy;
  return (
    <>
      <Nav />
      <main>
        <PlanPickProvider>
        <div className={s.page}>
          <Reveal as="section" className="container-lg" aria-labelledby="pricing-title">
            <div className={c.intro} data-nav-light>
              <h1 id="pricing-title" className={`${c.heading} type-h2`} data-reveal>
                {C.heading}
              </h1>
              <p className={`${c.lead} type-lead`} data-reveal>
                {C.lead}
              </p>
              <div className={s.heroActions} data-reveal>
                <Button href={C.ctas.demo.href}>{C.ctas.demo.label} →</Button>
                <Button href={C.ctas.try.href} variant="secondary">
                  {C.ctas.try.label}
                </Button>
              </div>
            </div>
            <h2 className="sr-only">{C.plans.label}</h2>
            <PlanTable />
          </Reveal>

          <FeatureMatrix />
          <CalculatorCompact variant="pricing" id="roi" />
          <Alternatives />
          <div className={s.trust}>
            <TrustStrip />
          </div>
        </div>
        </PlanPickProvider>
        {/* On the red stretch of the page backdrop; the FAQ sheet rides up over it. */}
        <ProofRed security />

        <PricingFaq />
        <ClosingCta copy={C.closing} secondary={C.closing.secondary} />
      </main>
      <Footer />
      {/* After the sections so it measures them last (home pattern). */}
      <PageBackdrop />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\u003c") }} />
    </>
  );
}
