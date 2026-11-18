"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/motion";
import { creditMemos as C } from "@/lib/content/products";
import { Glyph, RomaGlyph, TypeChip, money } from "@/components/platform/mock/kit";
import s from "./check.module.css";

/**
 * /accounting hero art — "the check that explains itself" (DESIGN.md §G.11). A paper
 * UNFI check (perforated edge, MICR line) sits beside the credit memo screen. On load
 * the check drops in, its four deductions arrive as rows, and each row in turn gets its
 * GL code and is booked, while "To book" counts down to $0.00 (state: unbooked → booked).
 * SSR = everything booked.
 */

const AT = { check: 0.9, rows: 1.25, map: 1.8, step: 0.38 };

export default function CheckLedger() {
  const root = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = root.current;
    if (!el || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(el);
      const toBook = q("[data-cl='toBook']")[0] as HTMLElement;
      const booked = q("[data-cl='booked']")[0] as HTMLElement;
      const rows = q("[data-cl='row']") as HTMLElement[];
      const fmt = (v: number) => money(v);

      gsap.set(q("[data-cl='gl'], [data-cl='done']"), { autoAlpha: 0 });
      gsap.set(q("[data-cl='unmapped'], [data-cl='pending']"), { autoAlpha: 1 });

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from(q("[data-cl='check']"), { autoAlpha: 0, y: -40, rotation: -14, duration: 0.9, ease: "back.out(1.3)" }, AT.check)
        .from(q("[data-cl='stamp']"), { autoAlpha: 0, scale: 1.6, duration: 0.4, ease: "power3.in" }, AT.check + 0.7)
        .from(rows, { autoAlpha: 0, x: -24, duration: 0.55, stagger: 0.08 }, AT.rows)
        .add(() => {
          toBook.textContent = fmt(C.pending);
          booked.textContent = "0 of 4";
        }, 0);

      let left = C.pending;
      rows.forEach((row, i) => {
        const at = AT.map + i * AT.step;
        const r = gsap.utils.selector(row);
        const from = left;
        left = +(left + C.rows[i].amount).toFixed(2); // amounts are negative
        const to = Math.max(0, left);
        const n = { v: from };
        tl.to(r("[data-cl='unmapped']"), { autoAlpha: 0, duration: 0.15 }, at)
          .fromTo(r("[data-cl='gl']"), { autoAlpha: 0, x: -6 }, { autoAlpha: 1, x: 0, duration: 0.35 }, at + 0.08)
          .to(r("[data-cl='pending']"), { autoAlpha: 0, duration: 0.15 }, at + 0.18)
          .fromTo(r("[data-cl='done']"), { autoAlpha: 0, scale: 0.6 }, { autoAlpha: 1, scale: 1, duration: 0.35, ease: "back.out(2.2)" }, at + 0.22)
          .fromTo(row, { backgroundColor: "rgba(226,240,222,0)" }, { backgroundColor: "rgba(226,240,222,0.7)", duration: 0.2, yoyo: true, repeat: 1, ease: "power1.inOut" }, at + 0.1)
          .to(n, { v: to, duration: 0.35, ease: "power2.out", onUpdate: () => void (toBook.textContent = fmt(n.v)) }, at + 0.2)
          .add(() => void (booked.textContent = `${i + 1} of 4`), at + 0.25);
      });
    }, el);
    return () => ctx.revert();
  }, []);

  const k = C.check;
  return (
    <div ref={root} className={s.window} aria-hidden="true">
      <div className={s.head}>
        <span className={s.brand}>
          <RomaGlyph className={s.mark} />
        </span>
        <span className={s.tabs}>
          {C.tabs.map((t, i) => (
            <span key={t} className={`${s.tab} ${i === 0 ? s.tabOn : ""}`}>
              <Glyph k={i === 0 ? "file" : "book"} />
              {t}
            </span>
          ))}
        </span>
        <span className={s.ghostBtn}>
          <Glyph k="plus" />
          {C.actions[0]}
        </span>
        <span className={s.redBtn}>
          <Glyph k="download" />
          {C.actions[1]}
        </span>
      </div>

      <div className={s.body}>
        {/* the paper check */}
        <div className={s.checkCol}>
          <div className={s.check} data-cl="check">
            <div className={s.checkTop}>
              <span className={s.payer}>
                <b>{k.channel}</b>
                <span>{k.label} advice</span>
              </span>
              <span className={s.checkNo}>
                No. <b>{k.number}</b>
              </span>
            </div>
            <span className={s.date}>
              Date <b>{k.date}</b>
            </span>
            <div className={s.payRow}>
              <span className={s.payLabel}>Pay to the order of</span>
              <span className={s.payee}>{k.payTo}</span>
            </div>
            <div className={s.amountRow}>
              <span className={s.words}>{k.words}</span>
              <span className={s.amountBox}>{money(k.amount)}</span>
            </div>
            <div className={s.sigRow}>
              <svg className={s.sig} viewBox="0 0 120 30" fill="none">
                <path d="M3 22c8-14 14-17 16-10s-6 12-2 10 10-16 14-14-3 13 2 12 8-9 12-9-2 7 3 7 9-6 13-6 4 5 9 4 12-5 18-6" />
              </svg>
              <span className={s.sigLine}>Authorized signature</span>
            </div>
            <span className={s.micr}>{k.micr}</span>
            <span className={s.stamp} data-cl="stamp">
              Received
            </span>
          </div>
        </div>

        {/* credit memos for this check */}
        <div className={s.memo}>
          <div className={s.kpis}>
            <span className={s.kpi}>
              <span>{C.summary[0]}</span>
              <b data-cl="toBook">{money(0)}</b>
            </span>
            <span className={s.kpi}>
              <span>{C.summary[1]}</span>
              <b data-cl="booked">4 of 4</b>
            </span>
            <span className={`${s.kpi} ${s.kpiCheck}`}>
              <span>Check</span>
              <b>{money(k.amount)}</b>
            </span>
          </div>
          <div className={s.table}>
            <div className={`${s.row} ${s.headRow}`}>
              <span>{C.columns.ref}</span>
              <span className={s.cType}>{C.columns.type}</span>
              <span className={s.right}>{C.columns.amount}</span>
              <span>{C.columns.gl}</span>
              <span className={s.cBook}>{C.columns.booking}</span>
            </div>
            {C.rows.map((r) => (
              <div key={r.ref} className={s.row} data-cl="row">
                <span className={s.ref}>{r.ref}</span>
                <span className={s.cType}>
                  <TypeChip category={r.category}>{r.type}</TypeChip>
                </span>
                <span className={`${s.right} ${s.amt}`}>{money(r.amount)}</span>
                <span className={s.swap}>
                  <span className={s.gl} data-cl="gl">
                    {r.gl.split(" · ")[0]}
                    <span className={s.glName}> · {r.gl.split(" · ")[1]}</span>
                  </span>
                  <span className={s.unmapped} data-cl="unmapped" style={{ opacity: 0 }}>
                    Unmapped
                  </span>
                </span>
                <span className={`${s.swap} ${s.cBook}`}>
                  <span className={s.done} data-cl="done">
                    <Glyph k="check" />
                    Booked
                  </span>
                  <span className={s.pending} data-cl="pending" style={{ opacity: 0 }}>
                    Pending
                  </span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
