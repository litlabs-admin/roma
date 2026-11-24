"use client";

import { useLayoutEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/motion";
import type { MatrixRow } from "@/lib/content/compare/types";
import { playOnce, refreshWhenReady, rise } from "@/components/platform/motion";
import { compareAskPrompt } from "@/lib/content/askAi";
import AskAi from "@/components/ui/AskAi";
import { useCompare } from "./context";
import SectionHead from "./SectionHead";
import Cite from "./Cite";
import CompetitorLogo from "./CompetitorLogo";
import c from "./compare.module.css";
import s from "./table.module.css";

/**
 * The one comparison table (DESIGN.md §G.13). It replaces the old verdict strip, glance
 * card, decision matrix and fit ledger. A real <table> (SEO, screen readers):
 * Factor (+ what it means for you) | Roma (raised column) | competitor (its own cited
 * words, under its logo). Groups: the page's deciders, set large in the page's own
 * order → the details → "Both offer it" (ticks in both columns) → a closing
 * "Which fits?" row that credits the competitor's strengths. Numbered sources below.
 * Below 768px every row becomes a block.
 */

function Tick() {
  return (
    <svg className={s.tick} viewBox="0 0 24 20" fill="none" aria-hidden="true">
      <path d="M2.5 11.2c1.6 1.1 3.3 2.9 4.6 5.3C10 9.6 14.6 4.6 21.5 2.2" data-dm="tick" />
    </svg>
  );
}

type Kind = "key" | "detail" | "parity";

export default function CompareTable() {
  const { c: comp, order } = useCompare();
  const root = useRef<HTMLElement>(null);
  const t = comp.table;
  const keys = t.rows.filter((r) => r.key);
  const details = t.rows.filter((r) => !r.key && !r.parity);
  const parity = t.rows.filter((r) => r.parity);

  useLayoutEffect(() => {
    const el = root.current;
    if (!el || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(el);
      rise(q("[data-cmp-head]"), q("[data-cmp-head]")[0]);
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.fromTo(q("[data-dm='row']"), { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.45, stagger: 0.05, clearProps: "transform,opacity,visibility" }, 0)
        .fromTo(q("[data-dm='fig']"), { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.1, clearProps: "transform,opacity,visibility" }, 0.15)
        .fromTo(q("[data-dm='tick']"), { drawSVG: "0% 0%" }, { drawSVG: "0% 100%", duration: 0.35, stagger: 0.12, ease: "power2.out" }, 0.8);
      playOnce(q("[data-dm='sheet']")[0], tl, "top 75%");
    }, el);
    const stop = refreshWhenReady();
    return () => {
      stop();
      ctx.revert();
    };
  }, []);

  const row = (r: MatrixRow, kind: Kind) => (
    <tr key={r.label} className={`${s.row} ${kind === "key" ? s.keyRow : ""}`} data-dm="row">
      <th scope="row" className={s.rowLabel}>
        <span className={s.factor}>{r.label}</span>
        {kind !== "parity" && <span className={s.means}>{r.means}</span>}
      </th>
      <td className={`${s.cell} ${s.cellRoma}`} data-col="Roma">
        {kind === "parity" && <Tick />}
        {r.key ? (
          <>
            <span className={s.figure} data-dm="fig">
              {r.key.figure}
            </span>
            <span className={s.sub}>{r.roma}</span>
          </>
        ) : (
          r.roma
        )}
      </td>
      <td className={`${s.cell} ${s.cellThem}`} data-col={comp.name}>
        {kind === "parity" && <Tick />}
        {r.them.text}
        {r.them.source && <Cite id={r.them.source} />}
      </td>
    </tr>
  );

  const group = (label: string, note?: string) => (
    <tr className={s.group}>
      <th scope="rowgroup" colSpan={3}>
        {label}
        {note && <span className={s.groupNote}>{note}</span>}
      </th>
    </tr>
  );

  return (
    <section ref={root} id="compare-table" className={`${c.section} ${s.section}`} aria-labelledby="table-heading">
      <div className={c.inner}>
        <SectionHead id="table-heading" label="Side by side" heading={t.heading} lead={t.lead} split />

        <div className={s.sheet} data-dm="sheet">
          <table className={s.table}>
            <caption className="sr-only">
              Roma compared with {comp.name}: the deciding differences first, then the details, what both offer, and who each fits. Sources for {comp.name}’s statements are listed below the table.
            </caption>
            <thead>
              <tr>
                <th scope="col" className={s.cornerHead}>
                  <span className={s.cornerText}>Compared on</span>
                </th>
                <th scope="col" className={s.romaHead}>
                  <span className="sr-only">Roma</span>
                  <Image src="/brand/roma-logo.png" alt="" width={464} height={106} className={s.romaLogo} aria-hidden="true" />
                </th>
                <th scope="col" className={s.themHead}>
                  <CompetitorLogo label height={comp.logo.size * 0.95} />
                </th>
              </tr>
            </thead>

            <tbody>
              {group("What decides it")}
              {keys.map((r) => row(r, "key"))}
            </tbody>
            {details.length > 0 && (
              <tbody>
                {group("The details")}
                {details.map((r) => row(r, "detail"))}
              </tbody>
            )}
            {parity.length > 0 && (
              <tbody className={s.parity}>
                {group("Both offer it", "Ticked in both columns")}
                {parity.map((r) => row(r, "parity"))}
              </tbody>
            )}

            <tfoot>
              <tr className={`${s.row} ${s.choose}`} data-dm="row">
                <th scope="row" className={s.rowLabel}>
                  <span className={s.factor}>Which fits?</span>
                  <span className={s.means}>Both help CPG brands with deductions. Here’s when each is the better choice.</span>
                </th>
                <td className={`${s.cell} ${s.cellRoma}`} data-col="Roma">
                  <b className={s.chooseHead}>Roma fits if</b>
                  <ul className={s.chooseList}>
                    {t.choose.roma.map((x) => (
                      <li key={x}>{x}</li>
                    ))}
                  </ul>
                </td>
                <td className={`${s.cell} ${s.cellThem}`} data-col={comp.name}>
                  <b className={s.chooseHead}>{comp.name} may fit if</b>
                  <ul className={s.chooseList}>
                    {t.choose.them.map((x) => (
                      <li key={x}>{x}</li>
                    ))}
                  </ul>
                </td>
              </tr>
            </tfoot>
          </table>

          <div className={s.legend}>
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

        <AskAi className={s.ask} placement="compare_table" align="start" label={`Ask AI to compare Roma and ${comp.name}`} prompt={compareAskPrompt(comp)} />
      </div>
    </section>
  );
}
