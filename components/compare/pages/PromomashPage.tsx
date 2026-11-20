import type { Competitor, PromomashStory } from "@/lib/content/compare/types";
import ProductHero from "@/components/product/hero/ProductHero";
import TrustStrip from "@/components/sections/trust/TrustStrip";
import VsLockup from "../VsLockup";
import Feature from "../Feature";
import CompareTable from "../CompareTable";
import GoLiveTimeline from "../GoLiveTimeline";
import OrderSummary from "../visuals/OrderSummary";
import ScopeStrip from "../ScopeStrip";

/**
 * Roma vs. Promomash (DESIGN.md §G.13). The story: a volume-priced trade suite with a
 * one-year commitment and a 2–4 month onboarding, or deductions only at a flat price.
 * Hero = the four-month timeline; then what you sign up for (its terms beside Roma's
 * receipt), then the scope strip, then the table.
 */
export default function PromomashPage({ c }: { c: Competitor & { story: PromomashStory } }) {
  const st = c.story;
  return (
    <>
      <ProductHero copy={c.hero.copy} caption={c.hero.caption} layout={c.hero.layout} pill={<VsLockup />}>
        <GoLiveTimeline art={st.timeline} />
      </ProductHero>
      <TrustStrip />
      <Feature id="terms-heading" label="Pricing and terms" heading={st.terms.heading} lead={st.terms.lead} well="none">
        <OrderSummary terms={st.terms} />
      </Feature>
      <ScopeStrip scope={st.scope} />
      <CompareTable />
    </>
  );
}
