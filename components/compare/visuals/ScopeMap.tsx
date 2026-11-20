"use client";

import { useLayoutEffect, useRef, type CSSProperties } from "react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/motion";
import type { ScopeArt } from "@/lib/content/compare/types";
import { RomaGlyph } from "@/components/platform/mock/kit";
import CompetitorLogo from "../CompetitorLogo";
import s from "./scope.module.css";

/**
 * Vividly hero art (DESIGN.md §G.13): the trade lifecycle as columns, each stage named
 * from Vividly's own site. Vividly's bar spans all of it; Roma's covers only the
 * deductions stages, with "no trade plan needed" where the plan would be. Wide windows
 * read left → right; phones read top → bottom. Bars draw once on load; SSR = finished.
 */

const START = 1.05;

export default function ScopeMap({ art }: { art: ScopeArt }) {
  const root = useRef<HTMLDivElement>(null);
  const n = art.stages.length;
  const first = art.stages.findIndex((st) => st.deductions);
  const last = n - 1 - [...art.stages].reverse().findIndex((st) => st.deductions);
  const span = (a: number, b: number) => ({ gridColumn: `${a + 2} / ${b + 3}` }) as CSSProperties;

  useLayoutEffect(() => {
    const el = root.current;
    if (!el || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(el);
      gsap
        .timeline({ delay: START, defaults: { ease: "power3.out" } })
        .fromTo(q("[data-sm='stage']"), { autoAlpha: 0, y: 6 }, { autoAlpha: 1, y: 0, duration: 0.4, stagger: 0.06 }, 0)
        .fromTo(q("[data-sm='them']"), { clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0% 0 0)", duration: 1.4, ease: "power2.inOut" }, 0.3)
        .fromTo(q("[data-sm='zone']"), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5 }, 1.5)
        .fromTo(q("[data-sm='roma']"), { autoAlpha: 0, scale: 0.92 }, { autoAlpha: 1, scale: 1, duration: 0.55, ease: "back.out(1.6)" }, 1.7)
        .fromTo(q("[data-sm='off']"), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5 }, 2.0);
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={root} className={s.window} aria-hidden="true">
      <div className={s.head}>
        <b className={s.title}>The trade lifecycle</b>
        <span className={s.legend}>Stages named in Vividly’s words</span>
      </div>

      {/* Wide: stages as columns, one bar per product */}
      <div className={s.wide} style={{ ["--n" as string]: n } as CSSProperties}>
        <span />
        {art.stages.map((st, i) => (
          <span key={st.label} className={`${s.stage} ${st.deductions ? s.stageDed : ""}`} data-sm="stage" style={span(i, i)}>
            {st.label}
          </span>
        ))}
        <span className={s.zone} data-sm="zone" style={span(first, last)}>
          <span className={s.zoneLabel}>Deductions</span>
        </span>

        <span className={s.who} style={{ gridRow: 2 }}>
          <CompetitorLogo height={1.15} />
        </span>
        <span className={s.themBar} data-sm="them" style={span(0, n - 1)}>
          {art.them.tag}
        </span>

        <span className={s.who} style={{ gridRow: 3 }}>
          <span className={s.badge}>
            <RomaGlyph className={s.rosette} />
          </span>
          <b>{art.roma.label}</b>
        </span>
        {first > 0 && (
          <span className={s.off} data-sm="off" style={span(0, first - 1)}>
            {art.roma.offPlan}
          </span>
        )}
        <span className={s.romaBar} data-sm="roma" style={span(first, last)}>
          <span className={s.live}>Live · under 5 min</span>
          <span className={s.romaTag}>{art.roma.tag}</span>
        </span>
      </div>

      {/* Phones: stages as rows */}
      <ol className={s.narrow}>
        <li className={s.nHead}>
          <span />
          <span className={s.nWho}>
            <CompetitorLogo height={0.95} />
          </span>
          <span className={s.nWho}>
            <span className={s.badge}>
              <RomaGlyph className={s.rosette} />
            </span>
            <b>{art.roma.label}</b>
          </span>
        </li>
        {art.stages.map((st, i) => (
          <li key={st.label} className={`${s.nRow} ${st.deductions ? s.nRowDed : ""}`} data-sm="stage">
            <span className={s.nStage}>{st.label}</span>
            <span className={`${s.nThem} ${i === 0 ? s.nTop : ""} ${i === n - 1 ? s.nBottom : ""}`} />
            {st.deductions ? (
              <span className={`${s.nRoma} ${i === first ? s.nTop : ""} ${i === last ? s.nBottom : ""}`} />
            ) : (
              <span className={s.nOff}>{i < first ? (i === 0 ? art.roma.offPlan : "") : "—"}</span>
            )}
          </li>
        ))}
        <li className={s.nFoot}>
          <span />
          <span>{art.them.tag}</span>
          <span className={s.nFootRoma}>Deductions only · live in under 5 min</span>
        </li>
      </ol>
    </div>
  );
}
