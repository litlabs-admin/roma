"use client";

import { useLayoutEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/motion";
import { ILLUSTRATIVE, inbox, platformHero } from "@/lib/content/platform";
import Button from "@/components/ui/Button";
import { Glyph } from "@/components/platform/mock/kit";
import InboxWindow from "./InboxWindow";
import s from "./hero.module.css";

/**
 * /platform hero — composition from Hyperline's capability hero (accounting page):
 * eyebrow pill + title on the left, lead + CTAs on the right, then a wide card holding
 * the product. Roma's version: red-950 band (so the nav's dark → cream logic applies
 * via [data-hero]), the warm texture as the card ground (an image, not a gradient,
 * DESIGN.md §A.8), and a real-looking deductions inbox built in HTML.
 *
 * Load sequence (plays once): pill → title words → lead → actions → card rises →
 * rows land, each with its type and backup. (No status column: the product shows no
 * "Matched"/"Recoverable" states, client feedback Nov 2026.)
 */

const T = {
  pill: 0.1,
  words: 0.2,
  wordStagger: 0.07,
  lead: 0.55,
  actions: 0.7,
  card: 0.6,
  cardDur: 1.1,
  rows: 1.05,
  rowStagger: 0.08,
};

export default function PlatformHero() {
  const root = useRef<HTMLElement>(null);
  const { before, accent, after } = platformHero.heading;
  const words = before.trim().split(/\s+/);

  useLayoutEffect(() => {
    const el = root.current;
    if (!el || prefersReducedMotion()) return;
    document.documentElement.classList.add("motion-ready");

    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(el);
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.fromTo(q("[data-anim='pill']"), { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.8 }, T.pill)
        .fromTo(
          q("[data-w]"),
          { autoAlpha: 0, y: "0.45em", filter: "blur(8px)" },
          { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 0.9, stagger: T.wordStagger, clearProps: "filter" },
          T.words,
        )
        .fromTo(q("[data-anim='lead']"), { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.8 }, T.lead)
        .fromTo(q("[data-anim='actions']"), { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.8 }, T.actions)
        .fromTo(q("[data-anim='card']"), { autoAlpha: 0, y: 36 }, { autoAlpha: 1, y: 0, duration: T.cardDur }, T.card)
        .fromTo(q("[data-row]"), { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.6, stagger: T.rowStagger }, T.rows);

    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} className={s.hero} data-hero aria-labelledby="platform-title">
      <div className={s.inner}>
        <div className={s.top}>
          <div className={s.titleCol}>
            <p className={s.pill} data-anim="pill">
              <Glyph k="book" className={s.pillIcon} />
              {platformHero.eyebrow}
            </p>
            <h1 id="platform-title" className={`${s.h1} type-h1`} aria-label={`${before}${accent}${after}`}>
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

          <div className={s.leadCol}>
            <p className={s.lead} data-anim="lead">
              {platformHero.lead}
            </p>
            <div className={s.actions} data-anim="actions">
              <Button href={platformHero.primary.href} variant="inverse">
                {platformHero.primary.label} →
              </Button>
              <Button href={platformHero.secondary.href} variant="ghostOnDark" className={s.secondary}>
                {platformHero.secondary.label}
              </Button>
            </div>
          </div>
        </div>

        <figure className={s.figure}>
          <div className={s.card} data-anim="card">
            <Image src="/images/cta/texture-bg.webp" alt="" fill sizes="(max-width: 1200px) 100vw, 75rem" quality={85} fetchPriority="high" loading="eager" className={s.texture} />
            <div className={s.sheet}>
              <InboxWindow />
            </div>
          </div>
          <figcaption className={s.caption}>{ILLUSTRATIVE}</figcaption>
          <p className="sr-only">{inbox.summary}</p>
        </figure>
      </div>
    </section>
  );
}
