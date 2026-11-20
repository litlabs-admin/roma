import type { Competitor, GlimpseStory } from "@/lib/content/compare/types";
import ProductHero from "@/components/product/hero/ProductHero";
import TrustStrip from "@/components/sections/trust/TrustStrip";
import VsLockup from "../VsLockup";
import Feature, { Note, PullQuote, TheySay } from "../Feature";
import CompareTable from "../CompareTable";
import CalendarGrid from "../visuals/CalendarGrid";
import PenToggle from "../visuals/PenToggle";
import ClassifyVisual from "../visuals/ClassifyVisual";

/**
 * Roma vs. Glimpse (DESIGN.md §G.13). The story: a managed service you hand off after a
 * 45-day onboarding, or software you run from day one. Hero = the 45-day calendar;
 * then who does the work (the toggle), then classification from a brand that switched,
 * then the table.
 */
export default function GlimpsePage({ c }: { c: Competitor & { story: GlimpseStory } }) {
  const st = c.story;
  return (
    <>
      <ProductHero copy={c.hero.copy} caption={c.hero.caption} layout={c.hero.layout} pill={<VsLockup />}>
        <CalendarGrid art={st.calendar} />
      </ProductHero>
      <TrustStrip />
      <Feature id="work-heading" label="Who does the work" heading={st.work.heading} lead={st.work.lead} layout="wide" well="none" extra={<TheySay claim={st.work.them} />}>
        <PenToggle />
      </Feature>
      <Feature
        id="switched-heading"
        label="From a brand that switched"
        heading={st.switched.heading}
        lead={st.switched.lead}
        layout="flip"
        extra={
          <>
            <PullQuote id={st.switched.quote} />
            <Note>{st.switched.note}</Note>
          </>
        }
      >
        <ClassifyVisual />
      </Feature>
      <CompareTable />
    </>
  );
}
