import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";
import ArticleBody from "@/components/blog/ArticleBody";
import Reveal from "@/components/blog/Reveal";
import ClosingCta from "@/components/sections/closing/ClosingCta";
import StoryHeader from "@/components/customers/StoryHeader";
import StoryCard from "@/components/customers/StoryCard";
import { StoryFacts, StoryQuote } from "@/components/customers/StoryAside";
import { CUSTOMER_STORIES, custClosing, getRelatedStories, getStory, storyPageCopy } from "@/lib/content/customers";
import a from "@/components/blog/article.module.css";
import b from "@/components/blog/blog.module.css";
import c from "@/components/customers/customers.module.css";
import s from "@/components/customers/story.module.css";

export function generateStaticParams() {
  return CUSTOMER_STORIES.map((st) => ({ slug: st.slug }));
}

function titleOf(slug: string) {
  const st = getStory(slug);
  if (!st) return null;
  const { before, accent, after } = st.headline;
  return { st, title: `${before}${accent}${after}` };
}

export async function generateMetadata({ params }: PageProps<"/customers/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const t = titleOf(slug);
  if (!t) return { title: "Story not found | Roma" };
  const { st, title } = t;
  return {
    title: `${st.brand.name}: ${title} | Roma customer stories`,
    description: st.excerpt,
    openGraph: { type: "article", title: `${st.brand.name}: ${title}`, description: st.excerpt, images: [{ url: st.photo.src }] },
  };
}

/**
 * /customers/[slug] (DESIGN.md §G.15): header + results → facts | story (pull quote
 * before the results section) → more stories → closing CTA. Same Suspense pattern as
 * /blogs/[slug]: known slugs prerender in full.
 */
export default function CustomerStoryPage({ params }: PageProps<"/customers/[slug]">) {
  return (
    <>
      <Nav />
      {/* Footer inside the boundary: until the slug resolves, nothing renders below the Nav. */}
      <Suspense fallback={null}>
        {params.then(({ slug }) => (
          <>
            <Story slug={slug} />
            <Footer />
          </>
        ))}
      </Suspense>
    </>
  );
}

function Story({ slug }: { slug: string }) {
  const t = titleOf(slug);
  if (!t) notFound();
  const { st, title } = t;

  // The pull quote sits before "The results" (or at the end if there is none).
  const split = st.body.findIndex((blk) => blk.type === "h2" && blk.id === "results");
  const head = split < 0 ? st.body : st.body.slice(0, split);
  const tail = split < 0 ? [] : st.body.slice(split);
  const related = getRelatedStories(st.slug);
  const { label, heading } = storyPageCopy.more;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `${st.brand.name}: ${title}`,
    description: st.excerpt,
    image: st.photo.src,
    about: { "@type": "Organization", name: st.brand.name },
    publisher: { "@type": "Organization", name: "Roma" },
  };

  return (
    <>
      <main>
        <StoryHeader story={st} />

        <div className={s.main}>
          <div className={s.layout}>
            <StoryFacts story={st} />
            <Reveal mode="each" as="article" className={a.prose} aria-labelledby="story-title">
              <ArticleBody blocks={head} />
              <StoryQuote story={st} />
              <ArticleBody blocks={tail} />
            </Reveal>
          </div>
        </div>

        <Reveal as="section" className={b.sheet} aria-labelledby="more-heading">
          <div className="container-lg">
            <div className={b.gridHead}>
              <p className={`${b.sectionLabel} type-label`} data-reveal>
                {label}
              </p>
              <h2 id="more-heading" className={`${b.gridHeading} type-h2`} data-reveal>
                {heading.before}
                <span className="accent">{heading.accent}</span>
                {heading.after}
              </h2>
            </div>
            <div className={c.libraryGrid}>
              {related.map((r) => (
                <StoryCard key={r.slug} story={r} />
              ))}
            </div>
          </div>
        </Reveal>

        <ClosingCta copy={custClosing} secondary={custClosing.secondary} />
      </main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
    </>
  );
}
