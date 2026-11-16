"use client";

import { useLayoutEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/motion";
import { blogIndex, formatDate, type Post } from "@/lib/content/blog";
import Monogram from "./Monogram";
import a from "./article.module.css";

/**
 * Article header (DESIGN.md §G.10): red-950 [data-hero] band with back link, meta, title,
 * lead and author; the cover straddles the band's bottom edge.
 * Load: back → meta → title words (70ms) → lead → author → cover.
 */
export default function ArticleHeader({ post, minutes }: { post: Post; minutes: number }) {
  const root = useRef<HTMLElement>(null);
  const { before, accent, after } = post.title;
  const words = before.trim().split(/\s+/);

  useLayoutEffect(() => {
    const el = root.current;
    if (!el || prefersReducedMotion()) return;
    document.documentElement.classList.add("motion-ready");
    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(el);
      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .fromTo(q("[data-anim='back'], [data-anim='meta']"), { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.06 }, 0.1)
        .fromTo(
          q("[data-w]"),
          { autoAlpha: 0, y: "0.45em", filter: "blur(8px)" },
          { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 0.9, stagger: 0.07, clearProps: "filter" },
          0.2,
        )
        .fromTo(q("[data-anim='lead']"), { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.8 }, 0.55)
        .fromTo(q("[data-anim='author']"), { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.8 }, 0.68)
        .fromTo(q("[data-anim='cover']"), { autoAlpha: 0, y: 36 }, { autoAlpha: 1, y: 0, duration: 1.1 }, 0.6);
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <header ref={root} className={a.header} data-hero>
      <div className={a.headerInner}>
        <Link href="/blogs" className={a.back} data-anim="back">
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M13 8H3M7.5 3.5 3 8l4.5 4.5" />
          </svg>
          {blogIndex.backLabel}
        </Link>

        <p className={`${a.kicker} type-label`} data-anim="meta">
          <span className={a.category}>{post.category}</span>
          <span aria-hidden="true" className={a.dot} />
          <time dateTime={post.date}>{formatDate(post.date)}</time>
          <span aria-hidden="true" className={a.dot} />
          <span>{minutes} min read</span>
        </p>

        <h1 id="article-title" className={`${a.title} type-h1`} aria-label={`${before}${accent}${after}`}>
          <span aria-hidden="true">
            {words.map((w, i) => (
              <span key={i}>
                <span className={a.w} data-w>
                  {w}
                </span>{" "}
              </span>
            ))}
            <span className={a.w} data-w>
              <span className="accent">{accent}</span>
              {after}
            </span>
          </span>
        </h1>

        <p className={a.lead} data-anim="lead">
          {post.excerpt}
        </p>

        <div className={a.author} data-anim="author">
          <Monogram initials={post.author.initials} />
          <p className={a.authorText}>
            <span className={a.authorName}>{post.author.name}</span>
            <span className={a.authorRole}>{post.author.role}</span>
          </p>
        </div>
      </div>

      <div className={a.coverWrap}>
        <div className={a.cover} data-anim="cover">
          <Image
            src={post.cover.src}
            alt={post.cover.alt}
            fill
            sizes="(max-width: 1200px) 100vw, 75rem"
            quality={85}
            fetchPriority="high"
            loading="eager"
            className={a.coverImg}
          />
        </div>
      </div>
    </header>
  );
}
