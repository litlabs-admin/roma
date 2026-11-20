"use client";

import { useLayoutEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/motion";
import { blogIndex, formatDate, type Post } from "@/lib/content/blog";
import Monogram from "./Monogram";
import h from "./blog.module.css";
import a from "./article.module.css";

/**
 * Article hero (DESIGN.md §G.10): the /blogs full-bleed hero on the post's cover,
 * [data-hero] for the nav (same frame as the customer story hero, §G.15). Bottom-aligned:
 * back link, meta pill and title left; lead and author byline right.
 * Load: background settles 1.06 → 1, back + pill → title words (70ms) → lead → byline.
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
        .fromTo(q("[data-bg]"), { scale: 1.06 }, { scale: 1, duration: 1.2, clearProps: "transform" }, 0)
        .fromTo(q("[data-anim='pill']"), { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.06 }, 0.15)
        .fromTo(
          q("[data-w]"),
          { autoAlpha: 0, y: "0.45em", filter: "blur(8px)" },
          { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 0.9, stagger: 0.07, clearProps: "filter" },
          0.25,
        )
        .fromTo(q("[data-anim='lead']"), { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.8 }, 0.6)
        .fromTo(q("[data-anim='byline']"), { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.8 }, 0.75);
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <header ref={root} className={h.hero} data-hero aria-labelledby="article-title">
      <div className={h.heroBg} data-bg>
        <Image
          src={post.cover.src}
          alt={post.cover.alt}
          fill
          sizes="100vw"
          quality={85}
          fetchPriority="high"
          loading="eager"
          className={h.heroImg}
        />
      </div>
      <div className={h.heroOverlay} aria-hidden="true" />

      <div className={h.heroInner}>
        <div className={h.heroTitleCol}>
          <Link href="/blogs" className={a.back} data-anim="pill">
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M13 8H3M7.5 3.5 3 8l4.5 4.5" />
            </svg>
            {blogIndex.backLabel}
          </Link>
          <p className={`${h.pill} ${a.metaPill}`} data-anim="pill">
            <span className={a.category}>{post.category}</span>
            <span aria-hidden="true" className={a.dot} />
            <time dateTime={post.date}>{formatDate(post.date)}</time>
            <span aria-hidden="true" className={a.dot} />
            <span>{minutes} min read</span>
          </p>
          <h1 id="article-title" className={`${h.heroH1} ${a.heroTitle} type-h1`} aria-label={`${before}${accent}${after}`}>
            <span aria-hidden="true">
              {words.map((w, i) => (
                <span key={i}>
                  <span className={h.w} data-w>
                    {w}
                  </span>{" "}
                </span>
              ))}
              <span className={h.w} data-w>
                <span className="accent">{accent}</span>
                {after}
              </span>
            </span>
          </h1>
        </div>

        <div className={h.heroLeadCol}>
          <p className={h.heroLead} data-anim="lead">
            {post.excerpt}
          </p>
          <div className={a.byline} data-anim="byline">
            <Monogram initials={post.author.initials} />
            <p className={a.bylineText}>
              <a href="#author" rel="author" className={a.bylineName}>
                {post.author.name}
              </a>
              <span className={a.bylineRole}>{post.author.role}</span>
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
