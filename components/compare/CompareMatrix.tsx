"use client";

import { useLayoutEffect, useRef, type CSSProperties, type KeyboardEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/motion";
import { competitors, compareHref, matrixCell, matrixSourceOrder } from "@/lib/content/compare";
import { CRITERIA, NOT_PUBLISHED, compareHubCopy } from "@/lib/content/compare/criteria";
import { playOnce, refreshWhenReady, rise } from "@/components/platform/motion";
import RollingNumber from "@/components/calculator/RollingNumber";
import ArrowLink from "@/components/ui/ArrowLink";
import AskAi from "@/components/ui/AskAi";
import { promptFor } from "@/lib/content/askAi";
import { useSpotlight } from "./spotlight";
import { CiteMark } from "./Cite";
import SectionHead from "./SectionHead";
import CompetitorLogo from "./CompetitorLogo";
import c from "./compare.module.css";
import t from "./table.module.css";
import s from "./matrix.module.css";

/**
 * The /compare matrix (DESIGN.md §G.13a): the same eight questions, Roma and every
 * competitor. A real <table>: criterion (+ the buyer's question) | Roma (red wash, red
 * rule) | one column per competitor (its logo, a short value, its own cited words).
 * Closing "Best fit if" row credits each one. Numbered sources run 1…n down each column.
 *
 * Spotlight (one tablist): ≥1024px it lights the picked competitor's column and steps the
 * others back ("All" resets); below 1024px it picks the one competitor shown beside Roma,
 * so the table never scrolls sideways. Every column stays in the HTML (indexable).
 */

const C = compareHubCopy.matrix;
const SOURCES = matrixSourceOrder();
const footnote = (slug: string, id: string) => SOURCES.findIndex((x) => x.key === `${slug}:${id}`) + 1;
/** Roma values that roll as odometers on first view (§G.17 signature motion). */
const ROLL = new Set(["price", "live"]);

export default function CompareMatrix() {
  const { pick, setPick } = useSpotlight();
  const root = useRef<HTMLElement>(null);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  // Phones show Roma + one competitor: the pick, else the first.
  const shown = pick ?? competitors[0].slug;
  const tabList: (string | null)[] = [null, ...competitors.map((x) => x.slug)];
  const focusComp = competitors.find((x) => x.slug === shown)!;

  useLayoutEffect(() => {
    const el = root.current;
    if (!el || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(el);
      rise(q("[data-cmp-head]"), q("[data-cmp-head]")[0]);
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.fromTo(q("[data-mx='head']"), { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.45, stagger: 0.08, clearProps: "transform,opacity,visibility" }, 0).fromTo(
        q("[data-mx='row']"),
        { autoAlpha: 0, y: 12 },
        { autoAlpha: 1, y: 0, duration: 0.45, stagger: 0.08, clearProps: "transform,opacity,visibility" },
        0.15,
      );
      playOnce(q("[data-mx='sheet']")[0], tl, "top 75%");
    }, el);
    const stop = refreshWhenReady();
    return () => {
      stop();
      ctx.revert();
    };
  }, []);

  const onKey = (e: KeyboardEvent, i: number) => {
    // Skip tabs hidden at this width ("All" on phones).
    const live = tabList.map((_, j) => j).filter((j) => tabs.current[j]?.offsetParent !== null);
    const at = live.indexOf(i);
    let next = -1;
    if (e.key === "ArrowRight") next = live[(at + 1) % live.length];
    else if (e.key === "ArrowLeft") next = live[(at - 1 + live.length) % live.length];
    else if (e.key === "Home") next = live[0];
    else if (e.key === "End") next = live[live.length - 1];
    if (next < 0 || next === undefined) return;
    e.preventDefault();
    setPick(tabList[next]);
    tabs.current[next]?.focus();
  };

  // Column state: lit, stepped back (desktop) and shown (phones).
  const col = (slug: string) =>
    [pick === slug ? s.on : "", pick && pick !== slug ? s.off : "", shown === slug ? s.shown : ""].filter(Boolean).join(" ");

  return (
    <section ref={root} id="matrix" className={`${c.section} ${s.section}`} aria-labelledby="matrix-heading">
      <div className={c.inner}>
        <SectionHead id="matrix-heading" label={C.label} heading={C.heading} lead={C.lead} split />

        <div className={s.bar}>
          <span className={s.barLabel} id="spotlight-label">
            {C.spotlight}
          </span>
          <div className={s.tabs} role="tablist" aria-labelledby="spotlight-label">
            {tabList.map((slug, i) => {
              const selected = slug === null ? pick === null : pick === slug;
              // Phones hide "All" and show the first competitor in its place.
              const phoneOn = pick === null && i === 1;
              const name = slug === null ? C.all : competitors.find((x) => x.slug === slug)!.name;
              return (
                <button
                  key={slug ?? "all"}
                  ref={(n) => {
                    tabs.current[i] = n;
                  }}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  aria-controls="matrix-table"
                  tabIndex={selected || phoneOn ? 0 : -1}
                  className={`${s.tab} ${slug === null ? s.tabAll : ""} ${selected ? s.tabOn : ""} ${phoneOn ? s.tabPhoneOn : ""}`}
                  onClick={() => setPick(slug)}
                  onKeyDown={(e) => onKey(e, i)}
                >
                  {name}
                </button>
              );
            })}
          </div>
        </div>

        <div className={s.sheet} data-mx="sheet">
          <table id="matrix-table" className={s.table} data-pick={pick ?? "all"}>
            <caption className="sr-only">
              Roma, {competitors.map((x) => x.name).join(", ")} compared on {CRITERIA.length} questions: {CRITERIA.map((x) => x.label.toLowerCase()).join(", ")}, then who
              each fits best. Competitor answers are quoted from their own websites; sources are listed below the table.
            </caption>
            <thead>
              <tr>
                <th scope="col" className={s.corner}>
                  <span className={t.cornerText}>{C.corner}</span>
                </th>
                <th scope="col" className={`${s.head} ${s.roma}`}>
                  <span className={s.headIn} data-mx="head">
                    <span className="sr-only">Roma</span>
                    <Image src="/brand/roma-logo.png" alt="" width={464} height={106} className={s.romaLogo} aria-hidden="true" />
                  </span>
                </th>
                {competitors.map((x) => (
                  <th key={x.slug} scope="col" className={`${s.head} ${s.them} ${col(x.slug)}`}>
                    <span className={s.headIn} data-mx="head">
                      <span className={s.logo}>
                        <CompetitorLogo of={x} label height={x.logo.size * 0.78} />
                      </span>
                      <Link href={compareHref(x.slug)} prefetch className={s.headLink}>
                        {C.fullShort}
                        <span className="sr-only">: Roma vs. {x.name}</span>
                        <span aria-hidden="true"> →</span>
                      </Link>
                    </span>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {CRITERIA.map((cr, r) => (
                <tr key={cr.id} className={s.row} data-mx="row" style={{ "--r": r } as CSSProperties}>
                  <th scope="row" className={s.label}>
                    <span className={t.factor}>{cr.label}</span>
                    <span className={t.means}>{cr.question}</span>
                  </th>
                  <td className={`${s.cell} ${s.roma}`} data-col="Roma">
                    <span className={s.cellIn}>
                      <span className={`${s.value} ${s.valueRoma}`}>{ROLL.has(cr.id) ? <RollingNumber text={cr.roma.value} rollIn /> : cr.roma.value}</span>
                      <span className={s.text}>
                        {cr.roma.text}
                        {cr.roma.badge && <span className={s.badge}>{cr.roma.badge}</span>}
                      </span>
                    </span>
                  </td>
                  {competitors.map((x) => {
                    const cell = matrixCell(x, cr.id);
                    const np = cell.value === NOT_PUBLISHED;
                    return (
                      <td key={x.slug} className={`${s.cell} ${s.them} ${col(x.slug)}`} data-col={x.name}>
                        <span className={s.cellIn}>
                          <span className={np ? s.np : s.value}>{cell.value}</span>
                          {cell.text && (
                            <span className={s.text}>
                              {cell.text}
                              {cell.source && <CiteMark n={footnote(x.slug, cell.source.id)} src={cell.source.src} who={x.name} />}
                            </span>
                          )}
                        </span>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>

            <tfoot>
              <tr className={`${s.row} ${s.fit}`} data-mx="row" style={{ "--r": CRITERIA.length } as CSSProperties}>
                <th scope="row" className={s.label}>
                  <span className={t.factor}>{C.fit.label}</span>
                  <span className={t.means}>{C.fit.question}</span>
                </th>
                <td className={`${s.cell} ${s.roma}`} data-col="Roma">
                  <span className={`${s.cellIn} ${s.fitText} ${s.fitRoma}`}>{C.romaFit}</span>
                </td>
                {competitors.map((x) => (
                  <td key={x.slug} className={`${s.cell} ${s.them} ${col(x.slug)}`} data-col={x.name}>
                    <span className={`${s.cellIn} ${s.fitText}`}>{x.table.choose.them[0]}</span>
                  </td>
                ))}
              </tr>
            </tfoot>
          </table>

          <div className={`${s.foot} ${pick === null ? s.footAll : ""}`}>
            <ArrowLink href={compareHref(focusComp.slug)} className={s.full}>
              {C.full(focusComp.name)}
            </ArrowLink>
          </div>

          <div className={t.legend}>
            <span>
              Numbers link to sources. Competitor answers are quoted from each company’s public website, checked {C.checked}. “{NOT_PUBLISHED}” means we found no
              public statement on its site. Products change; if something here is out of date,{" "}
              <a className={t.noteLink} href="/contact">
                tell us
              </a>
              .
            </span>
          </div>

          <details className={t.sources}>
            <summary className={t.summary}>
              Sources <span>({SOURCES.length})</span>
            </summary>
            <div className={s.srcGroups}>
              {competitors.map((x) => {
                const mine = SOURCES.map((src, i) => ({ ...src, n: i + 1 })).filter((src) => src.c.slug === x.slug);
                return (
                  <div key={x.slug} className={s.srcGroup}>
                    <p className={s.srcHead}>
                      <CompetitorLogo of={x} label height={x.logo.size * 0.62} />
                    </p>
                    <ol className={s.srcList}>
                      {mine.map((src) => (
                        <li key={src.key}>
                          <span className={t.srcN}>{src.n}</span>
                          <span>
                            “{src.src.quote}”{" "}
                            <a href={src.src.url} className={t.noteLink} target="_blank" rel="noopener noreferrer">
                              {src.src.where}
                            </a>
                          </span>
                        </li>
                      ))}
                    </ol>
                  </div>
                );
              })}
            </div>
          </details>
        </div>

        <AskAi className={t.ask} placement="compare_hub" align="start" label="Ask AI to compare Roma with the alternatives" prompt={promptFor("/compare")} />
      </div>
    </section>
  );
}
