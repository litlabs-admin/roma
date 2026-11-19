"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/motion";
import { CHECKED_ON, SOURCES, SOURCE_ORDER, paper } from "@/lib/content/compare/glimpse";
import { RomaGlyph } from "@/components/platform/mock/kit";
import { playOnce, refreshWhenReady, rise } from "@/components/platform/motion";
import SectionHead from "./SectionHead";
import Cite from "./Cite";
import c from "./compare.module.css";
import GlimpseMark from "./GlimpseMark";
import s from "./paper.module.css";

/**
 * "The working paper" (DESIGN.md §G.13): the line-by-line comparison as an auditor's
 * sheet. A real <table> (SEO + screen readers). Every statement carries a numbered
 * source; red pencil ticks draw only where BOTH products offer the thing (parity rows,
 * ticked in both columns). Rows that describe a difference get no tick on purpose:
 * we describe each and let the reader weigh it. Below 768px rows become blocks.
 */

function Tick() {
  return (
    <svg className={s.tick} viewBox="0 0 24 20" fill="none" aria-hidden="true">
      <path d="M2.5 11.2c1.6 1.1 3.3 2.9 4.6 5.3C10 9.6 14.6 4.6 21.5 2.2" data-wp="tick" />
    </svg>
  );
}

export default function WorkingPaper() {
  const root = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const el = root.current;
    if (!el || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(el);
      rise(q("[data-cmp-head]"), q("[data-cmp-head]")[0]);
      const sheet = q("[data-wp='sheet']")[0];
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.fromTo(q("[data-wp='row']"), { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.45, stagger: 0.06, clearProps: "transform,opacity,visibility" }, 0).fromTo(
        q("[data-wp='tick']"),
        { drawSVG: "0% 0%" },
        { drawSVG: "0% 100%", duration: 0.35, stagger: 0.18, ease: "power2.out" },
        0.6,
      );
      playOnce(sheet, tl, "top 75%");
    }, el);
    const stop = refreshWhenReady();
    return () => {
      stop();
      ctx.revert();
    };
  }, []);

  return (
    <section ref={root} className={c.section} aria-labelledby="paper-heading">
      <div className={c.inner}>
        <SectionHead id="paper-heading" label={paper.label} heading={paper.heading} lead={paper.lead} split />

        <div className={s.sheet} data-wp="sheet">
          <div className={s.strip}>
            <span>{paper.ref}</span>
            <span>Checked {CHECKED_ON}</span>
            <span className={s.reviewer}>
              Reviewed by <b>you</b>
            </span>
          </div>

          <table className={s.table}>
            <caption className="sr-only">{paper.summary}</caption>
            <thead>
              <tr>
                <th scope="col" className={s.corner}>
                  <span className="sr-only">Comparison point</span>
                </th>
                <th scope="col">
                  <span className={s.colHead}>
                    <span className={s.badge} aria-hidden="true">
                      <RomaGlyph className={s.rosette} />
                    </span>
                    Roma
                  </span>
                </th>
                <th scope="col">
                  <span className={s.colHead}>
                    <span className={`${s.badge} ${s.badgeG}`} aria-hidden="true">
                      <GlimpseMark />
                    </span>
                    Glimpse
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              {paper.rows.map((r) => (
                <tr key={r.label} className={s.row} data-wp="row">
                  <th scope="row" className={s.rowLabel}>
                    {r.label}
                  </th>
                  {(["roma", "glimpse"] as const).map((k) => {
                    const cell = r[k];
                    return (
                      <td key={k} className={`${s.cell} ${k === "roma" ? s.cellRoma : s.cellG}`} data-col={k === "roma" ? "Roma" : "Glimpse"}>
                        {"tick" in cell && cell.tick && <Tick />}
                        <span className={s.cellText}>
                          {cell.text}
                          <Cite id={cell.source} />
                        </span>
                      </td>
                    );
                  })}
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
              Numbers link to sources. {paper.note}{" "}
              <a className={s.noteLink} href={paper.noteLink.href}>
                {paper.noteLink.label}
              </a>
              .
            </span>
          </div>

          <details className={s.sources}>
            <summary className={s.summary}>
              {paper.sourcesTitle} <span>({SOURCE_ORDER.length})</span>
            </summary>
            <ol className={s.srcList}>
              {SOURCE_ORDER.map((id, i) => {
                const src = SOURCES[id];
                const external = src.url.startsWith("http");
                return (
                  <li key={id} value={i + 1}>
                    <span className={s.srcN}>{i + 1}</span>
                    <span>
                      <span className={s.srcWho}>{src.who === "glimpse" ? "Glimpse" : "Roma"}</span> “{src.quote}”{" "}
                      <a href={src.url} className={s.noteLink} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
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
