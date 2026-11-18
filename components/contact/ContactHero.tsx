"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/motion";
import type { Heading } from "@/lib/content/platform";
import { Glyph, type GlyphKey } from "@/components/platform/mock/kit";
import s from "./contact.module.css";

/**
 * Shared hero for /contact and /book-a-demo (DESIGN.md §G.12): on the cream page
 * (client, 18 Nov: no dark band), ink copy on the left (sticky beside the long form),
 * a white raised form card on the right. [data-nav-light] keeps the nav solid cream.
 * Load sequence as ProductHero: pill → words → lead → aside → card.
 */

const T = { pill: 0.1, words: 0.2, wordStagger: 0.07, lead: 0.55, aside: 0.7, card: 0.45 };

type Props = {
  eyebrow: string;
  icon: GlyphKey;
  heading: Heading;
  lead: string;
  aside: ReactNode;
  formTitle: string;
  formSub: string;
  children: ReactNode;
};

export default function ContactHero({ eyebrow, icon, heading, lead, aside, formTitle, formSub, children }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const { before, accent, after } = heading;
  const words = before.trim().split(/\s+/);

  useLayoutEffect(() => {
    const el = root.current;
    if (!el || prefersReducedMotion()) return;
    document.documentElement.classList.add("motion-ready");
    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(el);
      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .fromTo(q("[data-anim='pill']"), { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.8 }, T.pill)
        .fromTo(
          q("[data-w]"),
          { autoAlpha: 0, y: "0.45em", filter: "blur(8px)" },
          { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 0.9, stagger: T.wordStagger, clearProps: "filter" },
          T.words,
        )
        .fromTo(q("[data-anim='lead']"), { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.8 }, T.lead)
        .fromTo(q("[data-anim='aside']"), { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.8 }, T.aside)
        .fromTo(q("[data-anim='card']"), { autoAlpha: 0, y: 36 }, { autoAlpha: 1, y: 0, duration: 1.1 }, T.card);
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={root}>
      <section className={s.hero} data-nav-light aria-labelledby="contact-title">
        <div className={s.inner}>
          <div className={s.copy}>
            <p className={s.pill} data-anim="pill">
              <Glyph k={icon} className={s.pillIcon} />
              {eyebrow}
            </p>
            <h1 id="contact-title" className={`${s.h1} type-h1`} aria-label={`${before}${accent}${after}`}>
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
            <p className={s.lead} data-anim="lead">
              {lead}
            </p>
            <div className={s.aside} data-anim="aside">
              {aside}
            </div>
          </div>

          <div className={s.cardCol}>
            <div className={s.card} data-anim="card">
              <div className={s.cardHead}>
                <h2 className={`${s.cardTitle} type-h5`}>{formTitle}</h2>
                <p className={s.cardSub}>{formSub}</p>
              </div>
              {children}
            </div>
          </div>
        </div>
      </section>
      <div className={s.spacer} aria-hidden="true" />
    </div>
  );
}
