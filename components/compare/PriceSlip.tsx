"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/motion";
import { price } from "@/lib/content/compare/glimpse";
import { RomaGlyph } from "@/components/platform/mock/kit";
import ArrowLink from "@/components/ui/ArrowLink";
import { DEMO_HREF } from "@/components/chat/data";
import { refreshWhenReady, rise } from "@/components/platform/motion";
import SectionHead from "./SectionHead";
import Cite from "./Cite";
import c from "./compare.module.css";
import GlimpseMark from "./GlimpseMark";
import s from "./price.module.css";

/**
 * "Price on the page" (DESIGN.md §G.13). Roma's price prints out of a slot as a paper
 * receipt (the paper slides down out of a clipped mouth, then its total lands); beside
 * it, Glimpse's pricing is a sealed quote card in neutral ink with its own FAQ line.
 * Plays once on enter. No claims about plan contents or fee structure.
 */
export default function PriceSlip() {
  const root = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const el = root.current;
    if (!el || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(el);
      rise(q("[data-cmp-head]"), q("[data-cmp-head]")[0]);
      rise(q("[data-ps='foot']"), q("[data-ps='foot']")[0]);
      const tl = gsap.timeline({ paused: true, defaults: { ease: "power3.out" } });
      tl.fromTo(q("[data-ps='paper']"), { yPercent: -100 }, { yPercent: 0, duration: 1.15, ease: "power2.out" }, 0)
        .fromTo(q("[data-ps='line']"), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.25, stagger: 0.12 }, 0.35)
        .fromTo(q("[data-ps='total']"), { autoAlpha: 0, y: 6 }, { autoAlpha: 1, y: 0, duration: 0.5 }, 0.95)
        .fromTo(q("[data-ps='quote']"), { autoAlpha: 0, y: 24, rotate: 0 }, { autoAlpha: 1, y: 0, rotate: 2.5, duration: 0.8 }, 0.5)
        .fromTo(q("[data-ps='stamp']"), { autoAlpha: 0, scale: 1.35 }, { autoAlpha: 1, scale: 1, duration: 0.35, ease: "power4.out" }, 1.15);
      ScrollTrigger.create({ trigger: q("[data-ps='well']")[0], start: "top 75%", once: true, onEnter: () => void tl.play() });
    }, el);
    const stop = refreshWhenReady();
    return () => {
      stop();
      ctx.revert();
    };
  }, []);

  const r = price.roma;
  const g = price.glimpse;

  return (
    <section ref={root} className={`${c.section} ${s.section}`} aria-labelledby="price-heading">
      <div className={`${c.inner} ${s.layout}`}>
        <div className={s.text}>
          <SectionHead id="price-heading" label={price.label} heading={price.heading} lead={price.lead} />
          <p className={s.foot} data-ps="foot">
            {r.foot}{" "}
            <ArrowLink href={DEMO_HREF}>Book a demo</ArrowLink>
          </p>
        </div>

        <div className={s.well} data-ps="well">
          {/* Roma: receipt printing out of a slot */}
          <figure className={s.printer}>
            <div className={s.slot} aria-hidden="true">
              <span className={s.slotMouth} />
            </div>
            <div className={s.mouth}>
              <div className={s.paper} data-ps="paper">
                <div className={s.receipt}>
                  <p className={s.rHead}>
                    <span className={s.rBadge} aria-hidden="true">
                      <RomaGlyph className={s.rosette} />
                    </span>
                    <b>{r.head}</b>
                  </p>
                  <dl className={s.lines}>
                    {r.lines.map((l) => (
                      <div key={l.k} className={s.line} data-ps="line">
                        <dt>{l.k}</dt>
                        <dd>{l.v}</dd>
                      </div>
                    ))}
                  </dl>
                  <p className={s.total} data-ps="total">
                    <span className={s.totalLabel}>{r.totalLabel}</span>
                    <span className={s.figure}>
                      {r.total}
                      <small>{r.per}</small>
                    </span>
                  </p>
                </div>
              </div>
            </div>
            <figcaption className="sr-only">Roma: from $399 a month, paid subscription, live in under 5 minutes, no ERP or IT project.</figcaption>
          </figure>

          {/* Glimpse: a sealed quote, neutral ink */}
          <figure className={s.quoteCard} data-ps="quote">
            <p className={s.qHead}>
              <span className={s.qBadge} aria-hidden="true">
                <GlimpseMark />
              </span>
              <b>{g.head}</b>
              <span className={s.stamp} data-ps="stamp">
                {g.stamp}
              </span>
            </p>
            <blockquote className={s.qText}>
              “{g.quote}”
              <Cite id={g.source} />
            </blockquote>
            <figcaption className={s.qFoot}>Glimpse pricing FAQ</figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
