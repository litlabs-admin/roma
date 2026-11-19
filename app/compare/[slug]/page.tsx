import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";
import PageBackdrop from "@/components/motion/PageBackdrop";
import ProductHero from "@/components/product/hero/ProductHero";
import Story from "@/components/product/story/Story";
import TrustStrip from "@/components/sections/trust/TrustStrip";
import Faq from "@/components/sections/faq/Faq";
import ClosingCta from "@/components/sections/closing/ClosingCta";
import { CompareProvider } from "@/components/compare/context";
import GoLiveTimeline from "@/components/compare/GoLiveTimeline";
import GlanceCard from "@/components/compare/GlanceCard";
import VerdictBand from "@/components/compare/VerdictBand";
import StandApart from "@/components/compare/StandApart";
import DecisionMatrix from "@/components/compare/DecisionMatrix";
import FitLedger from "@/components/compare/FitLedger";
import CompareHub from "@/components/compare/CompareHub";
import { competitors, getCompetitor, sourceOrder } from "@/lib/content/compare";

export function generateStaticParams() {
  return competitors.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/compare/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const c = getCompetitor(slug);
  if (!c) return { title: "Comparison not found | Roma" };
  return { title: c.meta.title, description: c.meta.description };
}

/**
 * /compare/[slug] (DESIGN.md §G.13): one template, every competitor. Each section has
 * one job: hero (time to go live) → the short answer → where Roma stands apart → the
 * decision matrix → who each is for → other comparisons → proof (red backdrop) → FAQ →
 * closing CTA. Content: lib/content/compare/<slug>.ts; Roma's side: roma.ts.
 */
export default function ComparePage({ params }: PageProps<"/compare/[slug]">) {
  // With Cache Components, params are awaited inside <Suspense> (as /blogs/[slug]);
  // the slugs from generateStaticParams still prerender in full.
  return (
    <>
      <Nav />
      <Suspense fallback={null}>{params.then(({ slug }) => <Comparison slug={slug} />)}</Suspense>
      <Footer />
      <PageBackdrop />
    </>
  );
}

function Comparison({ slug }: { slug: string }) {
  const c = getCompetitor(slug);
  if (!c) notFound();
  const order = sourceOrder(c);
  const others = competitors.filter((o) => o.slug !== c.slug);

  return (
    <main>
      <CompareProvider competitor={c} order={order}>
        <ProductHero copy={c.hero.copy} caption={c.hero.caption}>
          {c.hero.art.kind === "timeline" ? <GoLiveTimeline art={c.hero.art} /> : <GlanceCard art={c.hero.art} />}
        </ProductHero>
        <TrustStrip />
        <VerdictBand />
        <StandApart />
        <DecisionMatrix />
        <FitLedger />
        <CompareHub others={others} />
      </CompareProvider>
      <Story />
      <Faq items={c.faqs} copy={{ label: `Roma vs. ${c.name}`, lines: [{ text: "Still comparing?" }, { text: "Here are straight ", accent: "answers" }] }} />
      <ClosingCta />
    </main>
  );
}
