"use client";

import { useLayoutEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/motion";
import { categoryLabel, storyPageCopy, type CustomerStory } from "@/lib/content/customers";
import { BrandMark } from "./StoryCard";
import h from "@/components/blog/blog.module.css";
import s from "./story.module.css";

/**
 * Case-study hero (DESIGN.md §G.15): the /blogs full-bleed hero (§G.10) on the brand's
 * photo, [data-hero] for the nav. Bottom-aligned: back link, brand pill and title left;
 * lead and the three results right (where the Blog lists its topics).
 * Load: background settles 1.06 → 1, back + pill → title words (70ms) → lead → results.
 */
export default function StoryHeader({ story }: { story: CustomerStory }) {
  const root = useRef<HTMLElement>(null);
  const { before, accent, after } = story.headline;
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
        .fromTo(q("[data-anim='metric']"), { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.08 }, 0.75);
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} className={h.hero} data-hero aria-labelledby="story-title">
      <div className={h.heroBg} data-bg aria-hidden="true">
        <Image
          src={story.photo.src}
          alt=""
          fill
          sizes="100vw"
          quality={85}
          fetchPriority="high"
          loading="eager"
          className={h.heroImg}
          style={{ objectPosition: story.photo.position }}
        />
      </div>
      <div className={h.heroOverlay} aria-hidden="true" />

      <div className={h.heroInner}>
        <div className={h.heroTitleCol}>
          <Link href="/customers#library" className={s.back} data-anim="pill">
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M13 8H3M7.5 3.5 3 8l4.5 4.5" />
            </svg>
            {storyPageCopy.back}
          </Link>
          <p className={`${h.pill} ${s.brandPill}`} data-anim="pill">
            <BrandMark brand={story.brand} className={s.pillMark} />
            <span className={s.pillSep} aria-hidden="true" />
            {categoryLabel(story.category)} · {story.product}
          </p>
          <h1 id="story-title" className={`${h.heroH1} ${s.title} type-display`} aria-label={`${story.brand.name}: ${before}${accent}${after}`}>
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
            {story.excerpt}
          </p>
          <dl className={s.results} aria-label={storyPageCopy.results}>
            {story.metrics.map((m) => (
              <div key={m.label} className={s.result} data-anim="metric">
                <dt className={s.resultLabel}>{m.label}</dt>
                <dd className={s.resultFigure}>{m.figure}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
