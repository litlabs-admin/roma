"use client";

import { useLayoutEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/motion";
import { ILLUSTRATIVE, views, viewsCopy, type Point } from "@/lib/content/products";
import { Glyph, money } from "@/components/platform/mock/kit";
import { refreshWhenReady, rise } from "@/components/platform/motion";
import s from "./views.module.css";

/**
 * "Every angle on your deductions." — runroma.com's three analytics views (who, what,
 * when) as an asymmetric grid of working charts, not screenshots (DESIGN.md §G.11):
 * - Who: the retailer table really sorts (click a header); rows glide to their new
 *   place (FLIP).
 * - What: filter chips redraw the deduction mix for UNFI or KeHE.
 * - When: point (or arrow keys) along the year to read any month against last year;
 *   the dashed tail is the forecast.
 * Each chart builds once when it enters. Data illustrative, totals reconcile.
 */

function Points({ items }: { items: Point[] }) {
  return (
    <ul className={s.points}>
      {items.map((p) => (
        <li key={p.text}>
          <span className={s.pIcon}>
            <Glyph k={p.icon} />
          </span>
          {p.text}
        </li>
      ))}
    </ul>
  );
}

/* ── Who: sortable retailer table ─────────────────────────────────────── */
type SortKey = (typeof views.who.columns)[number]["key"];

function WhoTable() {
  const [sort, setSort] = useState<{ key: SortKey; dir: 1 | -1 }>({ key: "amount", dir: -1 });
  const body = useRef<HTMLDivElement>(null);
  const prev = useRef<Map<string, number>>(new Map());
  const rows = [...views.who.rows].sort((a, b) => {
    const k = sort.key;
    const av = a[k];
    const bv = b[k];
    return (typeof av === "string" ? av.localeCompare(bv as string) : (av as number) - (bv as number)) * sort.dir;
  });
  const maxRate = Math.max(...views.who.rows.map((r) => r.rate));

  // FLIP: rows glide from where they were to where the sort put them.
  useLayoutEffect(() => {
    const el = body.current;
    if (!el) return;
    const nodes = Array.from(el.querySelectorAll<HTMLElement>("[data-row]"));
    if (prev.current.size && !prefersReducedMotion()) {
      nodes.forEach((n) => {
        const before = prev.current.get(n.dataset.row!);
        if (before == null) return;
        const dy = before - n.offsetTop;
        if (dy) gsap.fromTo(n, { y: dy }, { y: 0, duration: 0.5, ease: "power3.out", clearProps: "transform" });
      });
    }
    prev.current = new Map(nodes.map((n) => [n.dataset.row!, n.offsetTop]));
  }, [sort]);

  const toggle = (key: SortKey) =>
    setSort((cur) => (cur.key === key ? { key, dir: cur.dir === 1 ? -1 : 1 } : { key, dir: key === "name" ? 1 : -1 }));

  return (
    <div className={s.table} role="table" aria-label="Deductions by retailer, Q3 2026">
      <div className={`${s.tr} ${s.th}`} role="row">
        {views.who.columns.map((c) => {
          const on = sort.key === c.key;
          return (
            <span key={c.key} role="columnheader" aria-sort={on ? (sort.dir === 1 ? "ascending" : "descending") : "none"} className={c.key === "name" ? "" : s.num}>
              <button type="button" className={`${s.sortBtn} ${on ? s.sortOn : ""}`} onClick={() => toggle(c.key)}>
                {c.label}
                <span className={s.sortIc} data-dir={on ? sort.dir : 0} aria-hidden="true">
                  <Glyph k="caret" />
                </span>
              </button>
            </span>
          );
        })}
      </div>
      <div ref={body} className={s.tbody}>
        {rows.map((r) => (
          <div key={r.name} className={s.tr} role="row" data-row={r.name} data-v="row">
            <span role="cell" className={s.rName}>
              {r.name}
            </span>
            <span role="cell" className={`${s.num} ${s.strong}`}>
              {money(r.amount, false)}
            </span>
            <span role="cell" className={s.num}>
              {r.count}
            </span>
            <span role="cell" className={`${s.num} ${s.rateCell}`}>
              <span className={s.rateBar} aria-hidden="true">
                <i style={{ width: `${(r.rate / maxRate) * 100}%` }} />
              </span>
              {r.rate.toFixed(1)}%
            </span>
            <span role="cell" className={`${s.num} ${r.change <= 0 ? s.good : s.bad}`}>
              {r.change > 0 ? "+" : "−"}
              {Math.abs(r.change).toFixed(1)} pts
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── What: deduction mix, filterable ──────────────────────────────────── */
function WhatMix() {
  const [f, setF] = useState(views.what.filters[0]);
  const data = views.what.data[f];
  const total = data.reduce((a, b) => a + b, 0);
  const max = Math.max(...views.what.data.All);
  return (
    <div className={s.mix}>
      <div className={s.mixHead}>
        <div className={s.chips} role="group" aria-label="Filter by distributor">
          {views.what.filters.map((x) => (
            <button key={x} type="button" className={`${s.fchip} ${x === f ? s.fchipOn : ""}`} aria-pressed={x === f} onClick={() => setF(x)}>
              {x}
            </button>
          ))}
        </div>
        <span className={s.mixTotal} aria-live="polite">
          {money(total, false)}
        </span>
      </div>
      <ul className={s.mixList}>
        {views.what.types.map((t, i) => (
          <li key={t} className={s.mixRow}>
            <span className={s.mixName}>{t}</span>
            <span className={s.mixTrack} data-v="mixTrack">
              <span className={`${s.mixBar} ${i === 0 ? s.mixLead : ""}`} style={{ transform: `scaleX(${data[i] / max})`, transitionDelay: `${i * 40}ms` }} />
            </span>
            <span className={s.mixAmt}>{data[i] ? money(data[i], false) : "—"}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ── When: share of revenue over time, scrubbable ─────────────────────── */
const CW = 600;
const CH = 230;
const PAD = { l: 8, r: 8, t: 14, b: 10 };

function WhenChart() {
  const w = views.when;
  const n = w.months.length + w.forecast.length;
  const [idx, setIdx] = useState(w.months.length - 1);
  const [compare, setCompare] = useState(true);
  const xs = (i: number) => PAD.l + (i / (n - 1)) * (CW - PAD.l - PAD.r);
  const ys = (v: number) => PAD.t + (1 - v / w.max) * (CH - PAD.t - PAD.b);
  const path = (vals: number[], offset = 0) => vals.map((v, i) => `${i ? "L" : "M"}${xs(i + offset).toFixed(1)} ${ys(v).toFixed(1)}`).join(" ");
  const cur = path(w.current);
  const prevPath = path(w.previous);
  const fc = path([w.current[w.current.length - 1], ...w.forecast], w.current.length - 1);
  const area = `${cur} L${xs(w.current.length - 1)} ${CH - PAD.b} L${xs(0)} ${CH - PAD.b} Z`;
  const labels = [...w.months, ...w.forecastMonths];
  const isForecast = idx >= w.months.length;
  const val = isForecast ? w.forecast[idx - w.months.length] : w.current[idx];
  const last = isForecast ? null : w.previous[idx];

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const t = (e.clientX - r.left) / r.width;
    setIdx(Math.max(0, Math.min(n - 1, Math.round(t * (n - 1)))));
  };
  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowRight") setIdx((i) => Math.min(n - 1, i + 1));
    else if (e.key === "ArrowLeft") setIdx((i) => Math.max(0, i - 1));
    else return;
    e.preventDefault();
  };

  return (
    <div className={s.when}>
      <div className={s.whenHead}>
        <span className={s.readout} aria-live="polite">
          <span className={s.mono}>
            {labels[idx]} {idx >= 3 && idx < w.months.length ? "2026" : idx < 3 ? "2025" : "2026"}
            {isForecast ? " · forecast" : ""}
          </span>
          <b>{val.toFixed(1)}% of revenue</b>
          {last != null && compare && (
            <span className={val <= last ? s.good : s.bad}>
              {val <= last ? "−" : "+"}
              {Math.abs(val - last).toFixed(1)} pts vs last year
            </span>
          )}
        </span>
        <button type="button" className={`${s.fchip} ${compare ? s.fchipOn : ""}`} aria-pressed={compare} onClick={() => setCompare((c) => !c)}>
          Compare last year
        </button>
      </div>
      <div className={s.plot} onPointerMove={onMove} onKeyDown={onKey} tabIndex={0} role="slider" aria-label="Month" aria-valuemin={0} aria-valuemax={n - 1} aria-valuenow={idx} aria-valuetext={`${labels[idx]}: ${val.toFixed(1)}% of revenue`}>
        <svg viewBox={`0 0 ${CW} ${CH}`} preserveAspectRatio="none" aria-hidden="true">
          {[1, 2, 3, 4, 5].map((g) => (
            <path key={g} d={`M0 ${ys(g)}H${CW}`} className={s.gridLine} />
          ))}
          <rect x={xs(w.months.length - 1)} y="0" width={CW - xs(w.months.length - 1)} height={CH} className={s.fcBand} />
          <path d={area} className={s.area} data-v="area" />
          <path d={prevPath} className={`${s.prevLine} ${compare ? "" : s.off}`} data-v="line" />
          <path d={cur} className={s.curLine} data-v="line" />
          <path d={fc} className={s.fcLine} data-v="fc" />
          <path d={`M${xs(idx)} 0V${CH}`} className={s.cross} />
        </svg>
        <span className={s.dot} style={{ left: `${(xs(idx) / CW) * 100}%`, top: `${(ys(val) / CH) * 100}%` }} />
        {last != null && compare && <span className={`${s.dot} ${s.dotPrev}`} style={{ left: `${(xs(idx) / CW) * 100}%`, top: `${(ys(last) / CH) * 100}%` }} />}
      </div>
      <div className={s.months} aria-hidden="true">
        {labels.map((m, i) => (
          <span key={m + i} className={`${i === idx ? s.mOn : ""} ${i >= w.months.length ? s.mFc : ""}`}>
            {m}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function ThreeViews() {
  const root = useRef<HTMLElement>(null);
  const { before, accent, after } = viewsCopy.heading;

  useLayoutEffect(() => {
    const el = root.current;
    if (!el || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(el);
      rise(q("[data-v-head]"), q("[data-v-head]")[0]);
      rise(q("[data-v-card]"), q("[data-v-grid]")[0], { stagger: 0.12 });
      const card = (k: string) => q(`[data-v-card='${k}']`)[0];
      const build = (k: string, fn: (qq: (s: string) => Element[]) => gsap.core.Timeline) => {
        const c = card(k);
        if (!c) return;
        const tl = fn(gsap.utils.selector(c)).pause();
        ScrollTrigger.create({ trigger: c, start: "top 75%", once: true, onEnter: () => void tl.play() });
      };
      build("who", (qq) => gsap.timeline().from(qq("[data-v='row']"), { autoAlpha: 0, x: -10, duration: 0.45, stagger: 0.07, ease: "power3.out", clearProps: "transform" }, 0.2));
      build("what", (qq) =>
        gsap.timeline().from(qq("[data-v='mixTrack']"), { scaleX: 0, transformOrigin: "0 50%", duration: 0.8, stagger: 0.06, ease: "power3.out", clearProps: "transform" }, 0.2),
      );
      build("when", (qq) =>
        gsap
          .timeline()
          .fromTo(qq("[data-v='line']"), { drawSVG: "0% 0%" }, { drawSVG: "0% 100%", duration: 1.4, ease: "power2.inOut", stagger: 0.15 }, 0.2)
          .from(qq("[data-v='area']"), { autoAlpha: 0, duration: 0.8 }, 0.9)
          .fromTo(qq("[data-v='fc']"), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5 }, 1.5),
      );
    }, el);
    const stop = refreshWhenReady();
    return () => {
      stop();
      ctx.revert();
    };
  }, []);

  return (
    <section ref={root} className={s.section} aria-labelledby="views-heading">
      <div className={s.inner}>
        <div className={s.head}>
          <p className={`${s.label} type-label`} data-v-head>
            {viewsCopy.label}
          </p>
          <h2 id="views-heading" className={`${s.heading} type-h2`} data-v-head>
            {before}
            <span className="accent">{accent}</span>
            {after}
          </h2>
          <p className={`${s.lead} type-lead`} data-v-head>
            {viewsCopy.lead}
          </p>
        </div>

        <div className={s.grid} data-v-grid>
          <article className={`${s.card} ${s.who}`} data-v-card="who">
            <div className={s.well}>
              <span className={s.tag}>
                <i>01</i> Who
              </span>
              <WhoTable />
            </div>
            <div className={s.text}>
              <h3 className={`${s.title} type-h5`}>{views.who.title}</h3>
              <p className={s.body}>{views.who.body}</p>
              <Points items={views.who.points} />
            </div>
          </article>

          <article className={`${s.card} ${s.what}`} data-v-card="what">
            <div className={`${s.well} ${s.wellWarm}`}>
              <span className={s.tag}>
                <i>02</i> What
              </span>
              <WhatMix />
            </div>
            <div className={s.text}>
              <h3 className={`${s.title} type-h5`}>{views.what.title}</h3>
              <p className={s.body}>{views.what.body}</p>
              <Points items={views.what.points} />
            </div>
          </article>

          <article className={`${s.card} ${s.whenCard}`} data-v-card="when">
            <div className={s.well}>
              <span className={s.tag}>
                <i>03</i> When
              </span>
              <WhenChart />
            </div>
            <div className={s.text}>
              <h3 className={`${s.title} type-h5`}>{views.when.title}</h3>
              <p className={s.body}>{views.when.body}</p>
              <Points items={views.when.points} />
              <p className="sr-only">{views.when.summary}</p>
            </div>
          </article>
        </div>
        <p className={s.caption}>{ILLUSTRATIVE}</p>
      </div>
    </section>
  );
}
