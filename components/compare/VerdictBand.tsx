"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/motion";
import { refreshWhenReady, rise } from "@/components/platform/motion";
import { useCompare } from "./context";
import SectionHead from "./SectionHead";
import Cite from "./Cite";
import CompetitorMark from "./CompetitorMark";
import c from "./compare.module.css";
import s from "./verdict.module.css";

/**
 * "The short answer" (DESIGN.md §G.13): the at-a-glance verdict, right under the hero.
 * One white ledger strip split into three cells (not a card grid): each leads with
 * Roma's figure in red, then the competitor's own words on the same point, cited.
 * Cells rise in turn; the "vs" lines settle after their figure.
 */
export default function VerdictBand() {
  const { c: comp } = useCompare();
  const root = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const el = root.current;
    if (!el || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(el);
      rise(q("[data-cmp-head]"), q("[data-cmp-head]")[0]);
      const strip = q("[data-vb='strip']")[0];
      rise(q("[data-vb='fig']"), strip, { stagger: 0.12, start: "top 80%" });
      rise(q("[data-vb='vs']"), strip, { stagger: 0.12, delay: 0.3, start: "top 80%" });
      rise(q("[data-vb='jump']"), strip, { delay: 0.6, start: "top 80%" });
    }, el);
    const stop = refreshWhenReady();
    return () => {
      stop();
      ctx.revert();
    };
  }, []);

  return (
    <section ref={root} className={`${c.section} ${c.sectionTight}`} aria-labelledby="verdict-heading">
      <div className={c.inner}>
        <SectionHead id="verdict-heading" label="The short answer" heading={comp.verdict.heading} lead={comp.verdict.lead} split />

        <ul className={s.strip} data-vb="strip">
          {comp.verdict.tiles.map((t) => (
            <li key={t.label} className={s.cell}>
              <div data-vb="fig">
                <p className={s.label}>{t.label}</p>
                <p className={s.figure}>{t.figure}</p>
                <p className={s.sub}>{t.sub}</p>
              </div>
              {t.vs ? (
                <p className={s.vs} data-vb="vs">
                  <span className={s.vsWho}>
                    <span className={s.badge}>
                      <CompetitorMark />
                    </span>
                    {comp.name}
                  </span>
                  <span className={s.vsText}>
                    {t.vs.text}
                    {t.vs.source && <Cite id={t.vs.source} />}
                  </span>
                </p>
              ) : (
                t.only && (
                  <p className={`${s.vs} ${s.vsRoma}`} data-vb="vs">
                    <span className={s.vsWho}>Roma only</span>
                    <span className={s.vsText}>{t.only}</span>
                  </p>
                )
              )}
            </li>
          ))}
        </ul>

        <p className={s.jump} data-vb="jump">
          <a href="#compare-matrix" className={s.jumpLink}>
            See the full comparison
            <span aria-hidden="true">↓</span>
          </a>
        </p>
      </div>
    </section>
  );
}
