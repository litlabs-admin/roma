"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/motion";
import { RomaGlyph } from "@/components/platform/mock/kit";
import { playOnce, refreshWhenReady, rise } from "@/components/platform/motion";
import { useCompare } from "./context";
import SectionHead from "./SectionHead";
import Cite from "./Cite";
import CompetitorMark from "./CompetitorMark";
import c from "./compare.module.css";
import s from "./matrix.module.css";

/**
 * The decision matrix (DESIGN.md §G.13; evolved from the working paper, Framer's
 * "choose based on" column). A real <table> for SEO and screen readers:
 * Factor | Roma (raised column, red top rule) | competitor (its own cited words) |
 * What it means for you. Red pencil ticks only where BOTH offer the thing, in both
 * columns; differences get no tick on purpose. Numbered sources under the sheet.
 * Below 768px each row becomes a block.
 */

function Tick() {
  return (
    <svg className={s.tick} viewBox="0 0 24 20" fill="none" aria-hidden="true">
      <path d="M2.5 11.2c1.6 1.1 3.3 2.9 4.6 5.3C10 9.6 14.6 4.6 21.5 2.2" data-dm="tick" />
    </svg>
  );
}

export default function DecisionMatrix() {
  const { c: comp, order } = useCompare();
  const root = useRef<HTMLElement>(null);
  const m = comp.matrix;

  useLayoutEffect(() => {
    const el = root.current;
    if (!el || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(el);
      rise(q("[data-cmp-head]"), q("[data-cmp-head]")[0]);
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.fromTo(q("[data-dm='row']"), { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.45, stagger: 0.06, clearProps: "transform,opacity,visibility" }, 0).fromTo(
        q("[data-dm='tick']"),
        { drawSVG: "0% 0%" },
        { drawSVG: "0% 100%", duration: 0.35, stagger: 0.18, ease: "power2.out" },
        0.6,
      );
      playOnce(q("[data-dm='sheet']")[0], tl, "top 75%");
    }, el);
    const stop = refreshWhenReady();
    return () => {
      stop();
      ctx.revert();
    };
  }, []);

  return (
    <section ref={root} id="compare-matrix" className={`${c.section} ${s.section}`} aria-labelledby="matrix-heading">
      <div className={c.inner}>
        <SectionHead id="matrix-heading" label="Side by side" heading={m.heading} lead={m.lead} split />

        <div className={s.sheet} data-dm="sheet">
          <table className={s.table}>
            <caption className="sr-only">
              Roma compared with {comp.name}, row by row, with what each difference means for you. Sources for {comp.name}’s statements are listed below the table.
            </caption>
            <thead>
              <tr>
                <th scope="col" className={s.cornerHead}>
                  <span className="sr-only">Factor</span>
                </th>
                <th scope="col" className={s.romaHead}>
                  <span className={s.colHead}>
                    <span className={s.badge} aria-hidden="true">
                      <RomaGlyph className={s.rosette} />
                    </span>
                    Roma
                  </span>
                </th>
                <th scope="col">
                  <span className={s.colHead}>
                    <span className={`${s.badge} ${s.badgeThem}`} aria-hidden="true">
                      <CompetitorMark />
                    </span>
                    {comp.name}
                  </span>
                </th>
                <th scope="col" className={s.meansHead}>
                  What it means for you
                </th>
              </tr>
            </thead>
            <tbody>
              {m.rows.map((r) => (
                <tr key={r.label} className={s.row} data-dm="row">
                  <th scope="row" className={s.rowLabel}>
                    {r.label}
                  </th>
                  <td className={`${s.cell} ${s.cellRoma}`} data-col="Roma">
                    {r.parity && <Tick />}
                    {r.roma}
                  </td>
                  <td className={`${s.cell} ${s.cellThem}`} data-col={comp.name}>
                    {r.parity && <Tick />}
                    {r.them.text}
                    {r.them.source && <Cite id={r.them.source} />}
                  </td>
                  <td className={s.means} data-col="What it means">
                    {r.means}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className={s.legend}>
            <span className={s.legendKey}>
              <Tick />
              Both offer it
            </span>
            <span>
              Numbers link to sources. {comp.name} information is quoted from its public website, checked {comp.checkedOn}. Products change; if something here is out of date,{" "}
              <a className={s.noteLink} href="/contact">
                tell us
              </a>
              .
            </span>
          </div>

          <details className={s.sources}>
            <summary className={s.summary}>
              Sources <span>({order.length})</span>
            </summary>
            <ol className={s.srcList}>
              {order.map((id, i) => {
                const src = comp.sources[id];
                return (
                  <li key={id}>
                    <span className={s.srcN}>{i + 1}</span>
                    <span>
                      “{src.quote}”{" "}
                      <a href={src.url} className={s.noteLink} target="_blank" rel="noopener noreferrer">
                        {src.where}
                      </a>
                    </span>
                  </li>
                );
              })}
            </ol>
          </details>
        </div>
      </div>
    </section>
  );
}
