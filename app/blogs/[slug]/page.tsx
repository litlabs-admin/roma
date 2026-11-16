import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";
import ArticleHeader from "@/components/blog/ArticleHeader";
import ArticleBody from "@/components/blog/ArticleBody";
import ArticleToc from "@/components/blog/ArticleToc";
import AuthorCard from "@/components/blog/AuthorCard";
import PostGrid from "@/components/blog/PostGrid";
import ReadingProgress from "@/components/blog/ReadingProgress";
import Reveal from "@/components/blog/Reveal";
import ClosingCta from "@/components/sections/closing/ClosingCta";
import { blogIndex, getPost, getPosts, getRelated, getToc, headingText, readMinutes } from "@/lib/content/blog";
import a from "@/components/blog/article.module.css";

export function generateStaticParams() {
  return getPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/blogs/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return { title: "Article not found | Roma" };
  const title = headingText(post.title);
  return {
    title: `${title} | Roma`,
    description: post.excerpt,
    openGraph: {
      type: "article",
      title,
      description: post.excerpt,
      publishedTime: post.date,
      authors: [post.author.name],
      images: [{ url: post.cover.src, width: post.cover.width, height: post.cover.height, alt: post.cover.alt }],
    },
  };
}

/**
 * /blogs/[slug]: header → progress → TOC + body → author → keep reading → closing CTA
 * (DESIGN.md §G.10). With Cache Components, params for a slug outside
 * generateStaticParams are runtime data, so they are awaited inside <Suspense>; the
 * four known slugs still prerender in full.
 */
export default function ArticlePage({ params }: PageProps<"/blogs/[slug]">) {
  return (
    <>
      <Nav />
      <Suspense fallback={null}>{params.then(({ slug }) => <Article slug={slug} />)}</Suspense>
      <Footer />
    </>
  );
}

function Article({ slug }: { slug: string }) {
  const post = getPost(slug);
  if (!post) notFound();

  const minutes = readMinutes(post);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: headingText(post.title),
    description: post.excerpt,
    datePublished: post.date,
    image: post.cover.src,
    author: { "@type": "Person", name: post.author.name, jobTitle: post.author.role },
    publisher: { "@type": "Organization", name: "Roma" },
  };

  return (
    <>
      <ReadingProgress target="article-body" />
      <main>
        <ArticleHeader post={post} minutes={minutes} />

        <div className={a.main}>
          <div className={a.layout}>
            <div className={a.tocCol}>
              <ArticleToc items={getToc(post)} label={blogIndex.tocLabel} />
            </div>
            <Reveal mode="each" as="article" id="article-body" className={a.prose} aria-labelledby="article-title">
              <ArticleBody blocks={post.body} />
              <AuthorCard author={post.author} />
            </Reveal>
          </div>
        </div>

        <PostGrid id="related-heading" label={blogIndex.related.label} heading={blogIndex.related.heading} posts={getRelated(post.slug)} />
        <ClosingCta />
      </main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
    </>
  );
}
