"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/motion";
import { fit } from "@/lib/content/compare/glimpse";
import { RomaGlyph } from "@/components/platform/mock/kit";
import { refreshWhenReady, rise } from "@/components/platform/motion";
import SectionHead from "./SectionHead";
import c from "./compare.module.css";
import GlimpseMark from "./GlimpseMark";
import s from "./fitLedger.module.css";

/**
 * "The short version" (DESIGN.md §G.13): who each product fits, as two ruled ledger
 * columns split by a hairline with a serif "or" — a statement, not a card grid. Rows
 * rise in reading order; the "or" settles last.
 */
export default function FitLedger() {
  const root = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const el = root.current;
    if (!el || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(el);
      rise(q("[data-cmp-head]"), q("[data-cmp-head]")[0]);
      const sheet = q("[data-fit='sheet']")[0];
      rise(q("[data-fit='roma']"), sheet, { stagger: 0.08, start: "top 78%" });
      rise(q("[data-fit='glimpse']"), sheet, { stagger: 0.08, delay: 0.16, start: "top 78%" });
      gsap.fromTo(
        q("[data-fit='or']"),
        { autoAlpha: 0, scale: 0.6 },
        { autoAlpha: 1, scale: 1, duration: 0.5, ease: "back.out(2)", delay: 0.35, scrollTrigger: { trigger: sheet, start: "top 78%", once: true } },
      );
    }, el);
    const stop = refreshWhenReady();
    return () => {
      stop();
      ctx.revert();
    };
  }, []);

  return (
    <section ref={root} className={`${c.section} ${c.sectionTight}`} aria-labelledby="fit-heading">
      <div className={c.inner}>
        <SectionHead id="fit-heading" label={fit.label} heading={fit.heading} lead={fit.lead} split />

        <div className={s.sheet} data-fit="sheet">
          <div className={`${s.col} ${s.roma}`}>
            <h3 className={s.name} data-fit="roma">
              <span className={s.badge}>
                <RomaGlyph className={s.rosette} />
              </span>
              {fit.roma.name}
            </h3>
            <ol className={s.list}>
              {fit.roma.items.map((t, i) => (
                <li key={t} data-fit="roma">
                  <span className={s.n}>{String(i + 1).padStart(2, "0")}</span>
                  {t}
                </li>
              ))}
            </ol>
          </div>

          <div className={s.divider} aria-hidden="true">
            <span className={s.or} data-fit="or">
              or
            </span>
          </div>

          <div className={`${s.col} ${s.glimpse}`}>
            <h3 className={s.name} data-fit="glimpse">
              <span className={`${s.badge} ${s.badgeG}`}>
                <GlimpseMark />
              </span>
              {fit.glimpse.name}
            </h3>
            <ol className={s.list}>
              {fit.glimpse.items.map((t, i) => (
                <li key={t} data-fit="glimpse">
                  <span className={s.n}>{String(i + 1).padStart(2, "0")}</span>
                  {t}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
