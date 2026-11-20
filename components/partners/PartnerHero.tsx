"use client";

import { useLayoutEffect, useRef, type MouseEvent } from "react";
import Image from "next/image";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/motion";
import { partnerHero as h } from "@/lib/content/partners";
import { Glyph } from "@/components/platform/mock/kit";
import { scrollToTarget } from "@/components/motion/SmoothScroll";
import Button from "@/components/ui/Button";
import ArrowLink from "@/components/ui/ArrowLink";
import b from "@/components/blog/blog.module.css";
import s from "./hero.module.css";

/**
 * /partners hero (DESIGN.md §G.16), the /blogs hero composition (§G.10, client 20 Nov):
 * a full-bleed documentary photo under --overlay-hero, [data-hero] for the nav. Pill +
 * display title left; lead, CTAs and "Who it's for" right (≥992px). Same load sequence
 * as BlogHero: background settles, pill → words (70ms) → lead → actions → list.
 */
export default function PartnerHero() {
  const root = useRef<HTMLElement>(null);
  const { before, accent, after } = h.heading;
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
        .fromTo(q("[data-anim='actions']"), { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.8 }, 0.7)
        .fromTo(q("[data-anim='topics']"), { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.8 }, 0.8);
    }, el);
    return () => ctx.revert();
  }, []);

  const toApply = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    scrollToTarget(h.primary.href);
  };

  return (
    <section ref={root} className={b.hero} data-hero aria-labelledby="partner-title">
      <div className={b.heroBg} data-bg aria-hidden="true">
        <Image src={h.image.src} alt="" fill sizes="100vw" quality={85} fetchPriority="high" loading="eager" className={`${b.heroImg} ${s.img}`} />
      </div>
      <div className={b.heroOverlay} aria-hidden="true" />

      <div className={b.heroInner}>
        <div className={b.heroTitleCol}>
          <p className={b.pill} data-anim="pill">
            <Glyph k="link" className={b.pillIcon} />
            {h.eyebrow}
          </p>
          <h1 id="partner-title" className={`${b.heroH1} ${s.h1} type-display`} aria-label={`${before}${accent}${after}`}>
            <span aria-hidden="true">
              {words.map((w, i) => (
                <span key={i}>
                  <span className={b.w} data-w>
                    {w}
                  </span>{" "}
                </span>
              ))}
              <span className={b.w} data-w>
                <span className="accent">{accent}</span>
                {after}
              </span>
            </span>
          </h1>
        </div>

        <div className={b.heroLeadCol}>
          <p className={b.heroLead} data-anim="lead">
            {h.lead}
          </p>
          <div className={s.actions} data-anim="actions">
            <Button href={h.primary.href} onClick={toApply} variant="inverse">
              {h.primary.label} →
            </Button>
            <ArrowLink href={h.secondary.href} onDark arrow="down">
              {h.secondary.label}
            </ArrowLink>
          </div>
          <div className={b.topicsWrap} data-anim="topics">
            <p className={`${b.topicsLabel} type-label`}>{h.forLabel}</p>
            <ul className={b.topics}>
              {h.forList.map((t) => (
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
