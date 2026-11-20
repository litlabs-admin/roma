import type { Competitor, FloretStory } from "@/lib/content/compare/types";
import ProductHero from "@/components/product/hero/ProductHero";
import TrustStrip from "@/components/sections/trust/TrustStrip";
import { APART } from "@/lib/content/compare/roma";
import VsLockup from "../VsLockup";
import Feature, { PullQuote } from "../Feature";
import CompareTable from "../CompareTable";
import AlikeCallout from "../AlikeCallout";
import QuestionCard from "../visuals/QuestionCard";
import BackupsVisual from "../visuals/BackupsVisual";

/**
 * Roma vs. Floret (DESIGN.md §G.13). The story: the closest alternative, so the page is
 * candid about what's alike and puts the difference where it is, in how you start.
 * Hero = the same buyer question, two answers (centered switch card); then a text-only "where we're alike" (no
 * illustration on purpose), then backups in one zip, then the table.
 */
export default function FloretPage({ c }: { c: Competitor & { story: FloretStory } }) {
  const st = c.story;
  return (
    <>
      <ProductHero copy={c.hero.copy} caption={c.hero.caption} layout={c.hero.layout} pill={<VsLockup />}>
        <QuestionCard qa={st.qa} />
      </ProductHero>
      <TrustStrip />
      <AlikeCallout alike={st.alike} />
      <Feature id="backups-heading" label="Day one, no pilot" badge={APART.backups.badge} heading={st.backups.heading} lead={st.backups.lead} extra={<PullQuote id={st.backups.quote} />}>
        <BackupsVisual />
      </Feature>
      <CompareTable />
    </>
  );
}
