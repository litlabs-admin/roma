import type { Competitor, VividlyStory } from "@/lib/content/compare/types";
import ProductHero from "@/components/product/hero/ProductHero";
import TrustStrip from "@/components/sections/trust/TrustStrip";
import VsLockup from "../VsLockup";
import Feature from "../Feature";
import CompareTable from "../CompareTable";
import ScopeMap from "../visuals/ScopeMap";
import DeductionJourney from "../visuals/DeductionJourney";

/**
 * Roma vs. Vividly (DESIGN.md §G.13). The story: a full trade promotion platform that
 * disputes automatically, or deductions only, where you approve every dispute. Hero =
 * the scope map (centered); then the approval gate, then the table. Two sections, on
 * purpose: the map already makes the scope case.
 */
export default function VividlyPage({ c }: { c: Competitor & { story: VividlyStory } }) {
  const st = c.story;
  return (
    <>
      <ProductHero copy={c.hero.copy} caption={c.hero.caption} layout={c.hero.layout} pill={<VsLockup />}>
        <ScopeMap art={st.scope} />
      </ProductHero>
      <TrustStrip />
      <Feature id="gate-heading" label="Disputes" heading={st.gate.heading} lead={st.gate.lead} layout="wide" well="none">
        <DeductionJourney gate={st.gate} />
      </Feature>
      <CompareTable />
    </>
  );
}
