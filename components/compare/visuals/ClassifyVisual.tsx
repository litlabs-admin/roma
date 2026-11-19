"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/motion";
import { Glyph, SourcePill, TypeChip, money } from "@/components/platform/mock/kit";
import type { Category } from "@/lib/content/platform";
import s from "./classify.module.css";

/**
 * The `classify` visual (DESIGN.md §G.13; Sales Battle Card "Deduction classification").
 * A week's raw deduction lines arrive as bare portal codes; one by one each gets its
 * type, subtype and retailer, and the "uncategorized" counter runs down to 0.
 * Illustrative data. SSR markup is the finished (all classified, 0 left) state.
 */

type Line = { source: string; code: string; amount: number; type: string; cat: Category; sub: string; retailer: string };

const LINES: Line[] = [
  { source: "UNFI", code: "MCB-118", amount: 612.45, type: "Promo", cat: "promo", sub: "MCB", retailer: "Whole Foods" },
  { source: "KeHE", code: "SPL-07", amount: 88.1, type: "Shortage", cat: "shortage", sub: "Spoils", retailer: "Sprouts" },
  { source: "Target", code: "2390", amount: 1240, type: "Fees", cat: "fees", sub: "Compliance", retailer: "Target" },
  { source: "Walmart", code: "0412", amount: 214.6, type: "Shortage", cat: "shortage", sub: "Shortship", retailer: "Walmart" },
];

export default function ClassifyVisual() {
  const root = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = root.current;
    if (!el || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(el);
      const counter = q("[data-cl='count']")[0] as HTMLElement | undefined;
      // Start state: every line still a bare code, the counter at its full count.
      gsap.set(q("[data-cl='raw']"), { autoAlpha: 1 });
      gsap.set(q("[data-cl='fields'] > *"), { autoAlpha: 0, y: 6 });
      gsap.set(q("[data-cl='done']"), { autoAlpha: 0, scale: 0.6 });
      if (counter) counter.textContent = String(LINES.length);

      const tl = gsap.timeline({ paused: true, defaults: { ease: "power3.out" } });
      q("[data-cl='row']").forEach((row, i) => {
        const at = 0.35 + i * 0.5;
        const rq = gsap.utils.selector(row);
        tl.to(rq("[data-cl='raw']"), { autoAlpha: 0, duration: 0.2 }, at)
          .to(rq("[data-cl='fields'] > *"), { autoAlpha: 1, y: 0, duration: 0.35, stagger: 0.08 }, at + 0.1)
          .call(() => void (counter && (counter.textContent = String(LINES.length - i - 1))), undefined, at + 0.3);
      });
      tl.to(q("[data-cl='done']"), { autoAlpha: 1, scale: 1, duration: 0.4, ease: "back.out(2)" }, 0.35 + LINES.length * 0.5);
      ScrollTrigger.create({ trigger: el, start: "top 75%", once: true, onEnter: () => void tl.play() });
    }, el);
    return () => {
      ctx.revert();
      const counter = el.querySelector<HTMLElement>("[data-cl='count']");
      if (counter) counter.textContent = "0";
    };
  }, []);

  return (
    <div ref={root} className={s.window} aria-hidden="true">
      <div className={s.head}>
        <b className={s.title}>Deductions · this week</b>
        <span className={s.counter}>
          <span data-cl="count">0</span> uncategorized
          <span className={s.done} data-cl="done">
            <Glyph k="check" />
          </span>
        </span>
      </div>
      <ul className={s.rows}>
        {LINES.map((l) => (
          <li key={l.code} className={s.row} data-cl="row">
            <span className={s.id}>
              <SourcePill>{l.source}</SourcePill>
              <span className={s.code}>{l.code}</span>
              <span className={s.amount}>{money(-l.amount)}</span>
            </span>
            <span className={s.fieldsCell}>
              <span className={s.raw} data-cl="raw">
                Uncategorized
              </span>
              <span className={s.fields} data-cl="fields">
                <TypeChip category={l.cat}>{l.type}</TypeChip>
                <span className={s.field}>{l.sub}</span>
                <span className={s.field}>{l.retailer}</span>
              </span>
            </span>
          </li>
        ))}
      </ul>
      <p className={s.foot}>Illustrative data.</p>
    </div>
  );
}
