"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/motion";
import type { GlanceArt } from "@/lib/content/compare/types";
import { RomaGlyph } from "@/components/platform/mock/kit";
import { useCompare } from "./context";
import CompetitorMark from "./CompetitorMark";
import s from "./glance.module.css";

/**
 * Hero art for competitors that publish no go-live time (DESIGN.md §G.13): the same
 * window as the timeline, holding a two-column ledger of the few facts that matter.
 * Rows write in once on load (after the hero card rises); Roma's cells settle last
 * with a red rule, the "answer" in each row. SSR markup is the finished state.
 */

const START = 1.05;

export default function GlanceCard({ art }: { art: GlanceArt }) {
  const { c } = useCompare();
  const root = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = root.current;
    if (!el || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(el);
      gsap
        .timeline({ delay: START, defaults: { ease: "power3.out" } })
        .fromTo(q("[data-gc='row']"), { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.12 }, 0)
        .fromTo(q("[data-gc='rule']"), { scaleY: 0 }, { scaleY: 1, duration: 0.4, stagger: 0.12, ease: "power2.out" }, 0.35);
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={root} className={s.window} aria-hidden="true">
      <div className={s.head}>
        <b className={s.title}>{art.title}</b>
        <span className={s.cols}>
          <span className={s.col}>
            <span className={s.badge}>
              <RomaGlyph className={s.rosette} />
            </span>
            Roma
          </span>
          <span className={s.col}>
            <span className={`${s.badge} ${s.badgeThem}`}>
              <CompetitorMark />
            </span>
            {c.name}
          </span>
        </span>
      </div>
      <div className={s.rows}>
        {art.rows.map((r) => (
          <div key={r.label} className={s.row} data-gc="row">
            <span className={s.label}>{r.label}</span>
            <span className={s.roma}>
              <i className={s.rule} data-gc="rule" />
              {r.roma}
            </span>
            <span className={s.them}>{r.them}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
