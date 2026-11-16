"use client";

import { useLayoutEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/motion";
import { blogIndex } from "@/lib/content/blog";
import { Glyph } from "@/components/platform/mock/kit";
import s from "./blog.module.css";

/**
 * /blogs hero (DESIGN.md §G.10): full-bleed like the home hero (§G.1): a warm editorial
 * photo under --overlay-hero, [data-hero] so the nav's dark → cream logic applies.
 * Copy sits at the bottom: pill + title left, lead + topics right (≥992px).
 * Load: background settles 1.06 → 1, pill → title words (70ms) → lead → topics.
 */
export default function BlogHero() {
  const root = useRef<HTMLElement>(null);
  const { before, accent, after } = blogIndex.heading;
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
        .fromTo(q("[data-anim='pill']"), { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.8 }, 0.15)
        .fromTo(
          q("[data-w]"),
          { autoAlpha: 0, y: "0.45em", filter: "blur(8px)" },
          { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 0.9, stagger: 0.07, clearProps: "filter" },
          0.25,
        )
        .fromTo(q("[data-anim='lead']"), { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.8 }, 0.6)
        .fromTo(q("[data-anim='topics']"), { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.8 }, 0.75);
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} className={s.hero} data-hero aria-labelledby="blog-title">
      <div className={s.heroBg} data-bg aria-hidden="true">
        <Image
          src={blogIndex.heroImage.src}
          alt=""
          fill
          sizes="100vw"
          quality={85}
          fetchPriority="high"
          loading="eager"
          className={s.heroImg}
        />
      </div>
      <div className={s.heroOverlay} aria-hidden="true" />

      <div className={s.heroInner}>
        <div className={s.heroTitleCol}>
          <p className={s.pill} data-anim="pill">
            <Glyph k="book" className={s.pillIcon} />
            {blogIndex.eyebrow}
          </p>
          <h1 id="blog-title" className={`${s.heroH1} type-display`} aria-label={`${before}${accent}${after}`}>
            <span aria-hidden="true">
              {words.map((w, i) => (
                <span key={i}>
                  <span className={s.w} data-w>
                    {w}
                  </span>{" "}
                </span>
              ))}
              <span className={s.w} data-w>
                <span className="accent">{accent}</span>
                {after}
              </span>
            </span>
          </h1>
        </div>

        <div className={s.heroLeadCol}>
          <p className={s.heroLead} data-anim="lead">
            {blogIndex.lead}
          </p>
          <div className={s.topicsWrap} data-anim="topics">
            <p className={`${s.topicsLabel} type-label`}>{blogIndex.topicsLabel}</p>
            <ul className={s.topics}>
              {blogIndex.topics.map((t) => (
                <li key={t} className="type-label">
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
