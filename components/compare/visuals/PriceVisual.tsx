"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/motion";
import { ROMA_RECEIPT } from "@/lib/content/compare/roma";
import { RomaGlyph } from "@/components/platform/mock/kit";
import { useCompare } from "../context";
import Cite from "../Cite";
import CompetitorMark from "../CompetitorMark";
import s from "./price.module.css";

/**
 * The `price` visual (DESIGN.md §G.13). Roma's price prints out of a slot as a paper
 * receipt (the paper slides down out of a clipped mouth, then its total lands); beside
 * it, the competitor's own pricing statement on a neutral card turned 2.5° with a stamp.
 * Plays once on enter. No claims about plan contents or fee structure.
 */
export default function PriceVisual() {
  const { c } = useCompare();
  const root = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = root.current;
    if (!el || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(el);
      const tl = gsap.timeline({ paused: true, defaults: { ease: "power3.out" } });
      tl.fromTo(q("[data-ps='paper']"), { yPercent: -100 }, { yPercent: 0, duration: 1.15, ease: "power2.out" }, 0)
        .fromTo(q("[data-ps='line']"), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.25, stagger: 0.12 }, 0.35)
        .fromTo(q("[data-ps='total']"), { autoAlpha: 0, y: 6 }, { autoAlpha: 1, y: 0, duration: 0.5 }, 0.95)
        .fromTo(q("[data-ps='quote']"), { autoAlpha: 0, y: 24, rotate: 0 }, { autoAlpha: 1, y: 0, rotate: 2.5, duration: 0.8 }, 0.5)
        .fromTo(q("[data-ps='stamp']"), { autoAlpha: 0, scale: 1.35 }, { autoAlpha: 1, scale: 1, duration: 0.35, ease: "power4.out" }, 1.15);
      ScrollTrigger.create({ trigger: el, start: "top 75%", once: true, onEnter: () => void tl.play() });
    }, el);
    return () => ctx.revert();
  }, []);

  const r = ROMA_RECEIPT;

  return (
    <div ref={root} className={s.stage}>
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
                <b>Roma</b>
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
                <span className={s.totalLabel}>From</span>
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

      {/* Competitor: its own pricing statement, neutral ink */}
      <figure className={s.quoteCard} data-ps="quote">
        <p className={s.qHead}>
          <span className={s.qBadge} aria-hidden="true">
            <CompetitorMark />
          </span>
          <b>{c.name}</b>
          <span className={s.stamp} data-ps="stamp">
            {c.price.stamp}
          </span>
        </p>
        <blockquote className={s.qText}>
          “{c.price.quote.text}”
          {c.price.quote.source && <Cite id={c.price.quote.source} />}
        </blockquote>
        <figcaption className={s.qFoot}>{c.name} pricing, in its words</figcaption>
      </figure>
    </div>
  );
}
