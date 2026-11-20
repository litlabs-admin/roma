import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";
import PageBackdrop from "@/components/motion/PageBackdrop";
import Story from "@/components/product/story/Story";
import Faq from "@/components/sections/faq/Faq";
import ClosingCta from "@/components/sections/closing/ClosingCta";
import { CompareProvider } from "@/components/compare/context";
import CompareHub from "@/components/compare/CompareHub";
import CalculatorBanner from "@/components/calculator/CalculatorBanner";
import GlimpsePage from "@/components/compare/pages/GlimpsePage";
import PromomashPage from "@/components/compare/pages/PromomashPage";
import VividlyPage from "@/components/compare/pages/VividlyPage";
import FloretPage from "@/components/compare/pages/FloretPage";
import type { Competitor } from "@/lib/content/compare/types";
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
 * /compare/[slug] (DESIGN.md §G.13). Shared frame only: nav, the competitor context, the
 * "compare with others" hub, proof (red backdrop), FAQ, closing CTA. Everything from the
 * hero to the comparison table is the competitor's own page body
 * (components/compare/pages/*), so no two comparisons share a layout.
 */
export default function ComparePage({ params }: PageProps<"/compare/[slug]">) {
  // With Cache Components, params are awaited inside <Suspense> (as /blogs/[slug]);
  // the slugs from generateStaticParams still prerender in full.
  return (
    <>
      <Nav />
      {/* Footer inside the boundary: until the slug resolves, nothing renders below the Nav. */}
      <Suspense fallback={null}>
        {params.then(({ slug }) => (
          <>
            <Comparison slug={slug} />
            <Footer />
          </>
        ))}
      </Suspense>
      <PageBackdrop />
    </>
  );
}

function Body({ c }: { c: Competitor }) {
  const st = c.story;
  switch (st.kind) {
    case "glimpse":
      return <GlimpsePage c={{ ...c, story: st }} />;
    case "promomash":
      return <PromomashPage c={{ ...c, story: st }} />;
    case "vividly":
      return <VividlyPage c={{ ...c, story: st }} />;
    case "floret":
      return <FloretPage c={{ ...c, story: st }} />;
  }
}

function Comparison({ slug }: { slug: string }) {
  const c = getCompetitor(slug);
  if (!c) notFound();
  const order = sourceOrder(c);
  const others = competitors.filter((o) => o.slug !== c.slug);

  return (
    <main>
      <CompareProvider competitor={c} order={order}>
        <Body c={c} />
        {/* Brief §1.2: slim link to the calculator on every compare page. */}
        <CalculatorBanner />
        <CompareHub others={others} />
      </CompareProvider>
      <Story />
      <Faq items={c.faqs} copy={{ label: `Roma vs. ${c.name}`, lines: [{ text: "Still comparing?" }, { text: "Here are straight ", accent: "answers" }] }} />
      <ClosingCta />
    </main>
  );
}
