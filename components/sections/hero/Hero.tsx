"use client";

import { useLayoutEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/motion";
import { hero } from "@/lib/content/site";
import Button from "@/components/ui/Button";
import ArrowLink from "@/components/ui/ArrowLink";
import HeroHeadline from "./HeroHeadline";
import s from "./hero.module.css";

/**
 * Hero — composition and motion adapted from Different AI (DESIGN.md §G.1).
 * SSR markup is the final state; the load sequence sets start states just before animating.
 */
export default function Hero() {
  const root = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
    if (prefersReducedMotion()) {
      el.setAttribute("data-entered", "");
      return;
    }
    document.documentElement.classList.add("motion-ready");
    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(el);
      const tl = gsap.timeline({ defaults: { ease: "power3.out" }, onComplete: () => el.setAttribute("data-entered", "") });
      tl.fromTo(q("[data-hero-bg]"), { scale: 1.06 }, { scale: 1, duration: 1.2 }, 0)
        .fromTo(q("[data-anim='announce']"), { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.8 }, 0.15)
        .add(() => {
          el.dispatchEvent(new CustomEvent("hero:headline-in"));
        }, 0.25)
        .fromTo(q("[data-anim='lead']"), { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.8 }, 0.65)
        .fromTo(q("[data-anim='actions']"), { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.8 }, 0.8);
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <>
      <section ref={root} className={s.hero} data-hero aria-labelledby="hero-title">
        <div className={s.visual} aria-hidden="true">
          <div className={s.bgWrap} data-hero-bg>
            {/* PLACEHOLDER ART — Different AI illustration until Roma commissions its own (DESIGN.md §11) */}
            <Image
              src="/images/hero/placeholder-balloons-2000.webp"
              alt=""
              fill
              sizes="100vw"
              fetchPriority="high"
              loading="eager"
              className={s.bg}
            />
          </div>
          <div className={s.overlay} />
        </div>

        <div className={s.content}>
          <div className={s.intro}>
            <a href={hero.announce.href} className={s.announce} data-anim="announce">
              <span className={s.announceLong}>{hero.announce.long}</span>
              <span className={s.announceShort}>{hero.announce.short}</span>
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M3 8h10M9 4l4 4-4 4" />
              </svg>
            </a>

            <HeroHeadline id="hero-title" lines={hero.lines} />

            <p className={s.lead} data-anim="lead">
              {hero.lead}
            </p>

            <div className={s.actions} data-anim="actions">
              <Button href={hero.primary.href} variant="inverse">
                {hero.primary.label} →
              </Button>
              <ArrowLink href={hero.secondary.href} onDark arrow="down" className={s.secondary}>
                {hero.secondary.label}
              </ArrowLink>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
