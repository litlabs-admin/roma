"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/motion";
import { desk } from "@/lib/content/products";
import { Glyph, RomaGlyph, SourcePill, TypeChip, money } from "@/components/platform/mock/kit";
import s from "./desk.module.css";

/**
 * /deduction-management hero art — "the deduction desk": the original page's dashboard
 * (four totals, filters, a table with backup, assignee and a Valid / Invalid switch),
 * rebuilt as responsive HTML in Roma's UI language.
 *
 * Motion (DESIGN.md §G.11):
 * - Load: totals count up, rows land, then a cursor marks two deductions Invalid and the
 *   Invalid total ticks up with them (state change: unchecked → invalid).
 * SSR markup is the final state.
 */

const AT = { kpis: 1.0, rows: 1.05, cursor: 2.1 };

const fmt = (n: number) => money(n, false);

export default function DeskWindow() {
  const root = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = root.current;
    if (!el || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(el);
      const win = q("[data-desk='window']")[0] as HTMLElement;
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // Totals count up (Invalid starts from its pre-check value).
      q("[data-kpi]").forEach((node, i) => {
        const v = node.querySelector<HTMLElement>("[data-kpi-value]");
        if (!v) return;
        const to = Number(v.dataset.to);
        const from = Number(v.dataset.from ?? 0);
        const isInvalid = (node as HTMLElement).dataset.kpi === "invalid";
        const n = { v: from };
        v.textContent = fmt(from);
        if (isInvalid) {
          const meta = node.querySelector<HTMLElement>("[data-kpi-meta]");
          if (meta) meta.textContent = meta.dataset.from ?? meta.textContent;
          return; // ticks with the cursor below
        }
        tl.fromTo(n, { v: from }, { v: to, duration: 1.2, ease: "power2.out", onUpdate: () => void (v.textContent = fmt(n.v)) }, AT.kpis + i * 0.08);
      });
      tl.from(q("[data-kpi]"), { autoAlpha: 0, y: 12, duration: 0.6, stagger: 0.08 }, AT.kpis - 0.1);
      tl.from(q("[data-desk='tools']"), { autoAlpha: 0, duration: 0.5 }, AT.rows - 0.1);
      tl.from(q("[data-desk='row']"), { autoAlpha: 0, y: 10, duration: 0.55, stagger: 0.07 }, AT.rows);

      // Cursor marks the two doubted deductions Invalid.
      const cursor = q("[data-desk='cursor']")[0] as HTMLElement;
      const targets = q("[data-desk='inv'][data-animate]") as HTMLElement[];
      const invKpi = q("[data-kpi='invalid'] [data-kpi-value]")[0] as HTMLElement;
      const invMeta = q("[data-kpi='invalid'] [data-kpi-meta]")[0] as HTMLElement;
      const invFrom = Number(invKpi?.dataset.from ?? 0);
      const amounts = targets.map((t) => Number(t.dataset.amount ?? 0));
      const fills = targets.map((t) => t.querySelector("[data-desk='fill']"));
      gsap.set(fills, { autoAlpha: 0, scale: 0.7 });

      // Layout offsets (not client rects), so the 3D tilt doesn't skew the target.
      const pos = (t: HTMLElement) => {
        let x = 0;
        let y = 0;
        let n: HTMLElement | null = t;
        while (n && n !== win) {
          x += n.offsetLeft;
          y += n.offsetTop;
          n = n.offsetParent as HTMLElement | null;
        }
        return { x: x + t.offsetWidth * 0.6, y: y + t.offsetHeight * 0.55 };
      };

      if (cursor && targets.length) {
        tl.set(cursor, { autoAlpha: 0, x: () => win.offsetWidth * 0.55, y: () => win.offsetHeight * 0.95 }, 0);
        let at = AT.cursor;
        let running = invFrom;
        targets.forEach((t, i) => {
          tl.to(cursor, { autoAlpha: 1, x: () => pos(t).x, y: () => pos(t).y, duration: 0.7, ease: "power2.inOut" }, at)
            .to(cursor, { scale: 0.82, duration: 0.1, ease: "power2.in" }, at + 0.72)
            .to(cursor, { scale: 1, duration: 0.25, ease: "back.out(2)" }, at + 0.82)
            .to(fills[i], { autoAlpha: 1, scale: 1, duration: 0.35, ease: "back.out(2)" }, at + 0.74);
          const start = running;
          running += amounts[i];
          const n = { v: start };
          const count = 29 + i + 1;
          tl.to(n, { v: running, duration: 0.6, ease: "power2.out", onUpdate: () => void (invKpi.textContent = fmt(n.v)) }, at + 0.8)
            .add(() => void (invMeta.textContent = `${count} to dispute`), at + 0.8)
            .fromTo(q("[data-kpi='invalid']"), { y: 0 }, { y: -3, duration: 0.15, yoyo: true, repeat: 1, ease: "power1.inOut" }, at + 0.8);
          at += 1.05;
        });
        tl.to(cursor, { autoAlpha: 0, y: "+=30", duration: 0.5, ease: "power2.in" }, at + 0.2);
      }
    }, el);
    return () => ctx.revert();
  }, []);

  const c = desk.columns;
  return (
    <div ref={root} className={s.stage} aria-hidden="true">
      <div className={s.window} data-desk="window">
        <div className={s.head}>
          <span className={s.brand}>
            <RomaGlyph className={s.mark} />
          </span>
          <span className={s.titleBlock}>
            <b className={s.title}>{desk.title}</b>
            <span className={s.sub}>{desk.sub}</span>
          </span>
          <span className={s.report}>
            <Glyph k="download" />
            {desk.report}
          </span>
        </div>

        <div className={s.kpis}>
          {desk.kpis.map((k) => (
            <div key={k.key} className={`${s.kpi} ${s[`k_${k.tone}`]}`} data-kpi={k.key}>
              <span className={s.kpiLabel}>
                <i className={s.kpiDot} />
                {k.label}
              </span>
              <b className={s.kpiValue} data-kpi-value data-to={k.value} data-from={k.from}>
                {fmt(k.value)}
              </b>
              <span className={s.kpiMeta} data-kpi-meta data-from={"metaFrom" in k ? k.metaFrom : undefined}>
                {k.meta}
              </span>
            </div>
          ))}
        </div>

        <div className={s.tools} data-desk="tools">
          <div className={s.chips}>
            {desk.filters.map((f, i) => (
              <span key={f} className={s.chip}>
                <Glyph k={i === 0 ? "calendar" : i === 3 ? "user" : i === 4 ? "file" : "filter"} />
                {f}
              </span>
            ))}
            <span className={`${s.chip} ${s.more}`}>
              <Glyph k="plus" />
              More
            </span>
          </div>
          <span className={s.search}>
            <Glyph k="search" />
            {desk.search}
          </span>
        </div>

        <div className={s.table}>
          <div className={`${s.row} ${s.headRow}`}>
            <span className={s.cId}>{c.id}</span>
            <span className={s.cCh}>{c.channel}</span>
            <span className={s.cType}>{c.type}</span>
            <span className={s.cAmt}>{c.amount}</span>
            <span className={s.cBackup}>{c.backup}</span>
            <span className={s.cWho}>{c.assignee}</span>
            <span className={s.cStatus}>{c.status}</span>
          </div>
          {desk.rows.map((r) => (
            <div key={r.id} className={s.row} data-desk="row">
              <span className={`${s.cId} ${s.id}`}>{r.id}</span>
              <span className={s.cCh}>
                <SourcePill>{r.channel}</SourcePill>
              </span>
              <span className={s.cType}>
                <TypeChip category={r.category}>{r.type}</TypeChip>
              </span>
              <span className={`${s.cAmt} ${s.amt}`}>{money(r.amount)}</span>
              <span className={s.cBackup}>
                <span className={s.iconBtn}>
                  <Glyph k="eye" />
                </span>
                <span className={s.iconBtn}>
                  <Glyph k="download" />
                </span>
              </span>
              <span className={s.cWho}>
                {r.assignee ? (
                  <span className={s.av}>{r.assignee}</span>
                ) : (
                  <span className={s.assign}>
                    <Glyph k="plus" />
                    Assign
                  </span>
                )}
              </span>
              <span className={s.cStatus}>
                <span className={s.seg}>
                  <span className={`${s.segBtn} ${s.valid} ${r.status === "valid" ? s.on : ""}`}>
                    <span className={s.segFill} />
                    <Glyph k="check" />
                    <span className={s.segLabel}>Valid</span>
                  </span>
                  <span
                    className={`${s.segBtn} ${s.invalid} ${r.status === "invalid" ? s.on : ""}`}
                    data-desk="inv"
                    data-animate={r.animate ? "" : undefined}
                    data-amount={r.amount}
                  >
                    <span className={s.segFill} data-desk={r.animate ? "fill" : undefined} />
                    <span className={s.x}>×</span>
                    <span className={s.segLabel}>Invalid</span>
                  </span>
                </span>
              </span>
            </div>
          ))}
        </div>

        <span className={s.cursor} data-desk="cursor">
          <svg viewBox="0 0 16 16">
            <path d="M3 2 13 7.2 8.6 8.6 7.2 13z" fill="#111" stroke="#fff" strokeWidth="1.2" strokeLinejoin="round" />
          </svg>
        </span>
      </div>
    </div>
  );
}
