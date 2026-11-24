import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";
import ArticleBody from "@/components/blog/ArticleBody";
import Reveal from "@/components/blog/Reveal";
import ClosingCta from "@/components/sections/closing/ClosingCta";
import LogoCard from "@/components/customers/LogoCard";
import StoryIntro from "@/components/customers/story/StoryIntro";
import StorySummary from "@/components/customers/story/StorySummary";
import StoryGlance from "@/components/customers/story/StoryGlance";
import ArticleToc from "@/components/blog/ArticleToc";
import { getToc } from "@/lib/content/blog";
import { CUSTOMER_STORIES, custClosing, getRelatedStories, getStory, storyHref, storyPageCopy } from "@/lib/content/customers";
import a from "@/components/blog/article.module.css";
import c from "@/components/customers/customers.module.css";
import s from "@/components/customers/story/story.module.css";

export function generateStaticParams() {
  return CUSTOMER_STORIES.map((st) => ({ slug: st.slug }));
}

export async function generateMetadata({ params }: PageProps<"/customers/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const st = getStory(slug);
  if (!st) return { title: "Story not found | Roma" };
  return {
    title: `${st.cardTitle} | Roma customers`,
    description: st.excerpt,
    openGraph: {
      type: "article",
      title: st.cardTitle,
      description: st.excerpt,
      images: [st.video ? { url: st.video.og, width: 1200, height: 630 } : { url: st.photo.src }],
      ...(st.video ? { videos: [{ url: st.video.sources[st.video.sources.length - 1].src, type: "video/mp4", width: 1280, height: 720 }] } : {}),
    },
  };
}

/**
 * /customers/[slug] (DESIGN.md §G.15, Hyperline story page): breadcrumb, cover, title,
 * lead, person → about + 2×2 summary → story prose (the attributed quote before "What
 * changed") → more customer stories → closing CTA. Same Suspense pattern as
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
  const st = getStory(slug);
  if (!st) notFound();

  // The attributed quote closes the first section (just before the second h2, else the
  // end). Write that section so it doesn't itself end on a quote block.
  const h2s = st.body.flatMap((blk, i) => (blk.type === "h2" ? [i] : []));
  const split = h2s[1] ?? -1;
  const head = split < 0 ? st.body : st.body.slice(0, split);
  const tail = split < 0 ? [] : st.body.slice(split);
  const related = getRelatedStories(st.slug);
  const who = st.quote.name ? `${st.quote.name}, ${st.quote.role}` : st.quote.role;

  const video = st.video;
  const jsonLd = [
    ...(video
      ? [
          {
            "@context": "https://schema.org",
            "@type": "VideoObject",
            name: video.title,
            description: `${who} @ ${st.brand.name}: “${st.quote.text}”`,
            thumbnailUrl: video.og,
            uploadDate: video.uploadDate,
            duration: video.isoDuration,
            contentUrl: video.sources[video.sources.length - 1].src,
            publisher: { "@type": "Organization", name: "Roma" },
          },
        ]
      : []),
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: st.cardTitle,
      description: st.excerpt,
      image: st.photo.src,
      about: { "@type": "Organization", name: st.brand.name },
      publisher: { "@type": "Organization", name: "Roma" },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: storyPageCopy.breadcrumb, item: "/customers" },
        { "@type": "ListItem", position: 2, name: st.brand.name, item: storyHref(st.slug) },
      ],
    },
  ];

  return (
    <>
      <main>
        <div className={s.page}>
          <div className={`${s.body} ${s.head}`}>
            <StoryIntro story={st} />
          </div>

          {/* Hyperline article grid: "On this page" | story | "At a glance". */}
          <div className={s.body}>
            <div className={s.tocCol}>
              <ArticleToc items={getToc(st)} label={storyPageCopy.toc} />
            </div>
            <div className={s.center}>
              <Reveal mode="each">
                <StorySummary story={st} />
              </Reveal>
              <Reveal mode="each" as="article" className={`${a.prose} ${s.prose}`} aria-labelledby="story-title">
                <ArticleBody blocks={head} />
                <figure className={s.quote} data-reveal>
                  <blockquote>“{st.quote.text}”</blockquote>
                  <figcaption>
                    {who} @ {st.brand.name}
                  </figcaption>
                </figure>
                <ArticleBody blocks={tail} />
              </Reveal>
              <p className={s.note}>{storyPageCopy.note}</p>
            </div>
            <StoryGlance story={st} />
          </div>

          <Reveal as="section" className={`container-lg ${s.more}`} aria-labelledby="more-heading">
            <h2 id="more-heading" className={`${s.moreHeading} type-h4`} data-reveal>
              {storyPageCopy.more}
            </h2>
            <ul className={c.grid}>
              {related.map((r) => (
                <li key={r.slug}>
                  <LogoCard story={r} />
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <ClosingCta copy={custClosing} secondary={custClosing.secondary} />
      </main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
    </>
  );
}
