"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/motion";
import { leanCopy } from "@/lib/content/platform";
import Button from "@/components/ui/Button";
import { DEMO_HREF } from "@/components/chat/data";
import { refreshWhenReady, rise } from "@/components/platform/motion";
import s from "./lean.module.css";

/**
 * Why Roma — the four differentiators from the positioning PDF as ledger rows, using
 * DESIGN.md §E.11's numbered step-block (mono "01" + h5 + small; inactive at .4, the
 * active row nudged in). Sticky heading on the left, like "Built for finance teams of any size".
 * Not an icon-card grid (§A.8).
 */

const ACTIVE_RANGE = { start: "top 62%", end: "bottom 38%" };

export default function LeanTeam() {
  const root = useRef<HTMLElement>(null);
  const { before, accent, after } = leanCopy.heading;

  useLayoutEffect(() => {
    const el = root.current;
    if (!el || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(el);
      rise(q("[data-ln-head]"), q("[data-ln-head]")[0]);
      // clearProps hands opacity/transform back to the CSS follow state once the rise ends
      rise(q("[data-ln-row]"), q("[data-ln-list]")[0], { stagger: 0.08, clearProps: "opacity,visibility,transform" });
      el.setAttribute("data-follow", "");
      q("[data-ln-row]").forEach((row) => {
        ScrollTrigger.create({ trigger: row, ...ACTIVE_RANGE, toggleClass: { targets: row, className: s.active } });
      });
    }, el);
    const stop = refreshWhenReady();
    return () => {
      stop();
      ctx.revert();
      el.removeAttribute("data-follow");
    };
  }, []);

  return (
    <section ref={root} className={s.section} aria-labelledby="lean-heading">
      <div className={s.inner}>
        <div className={s.left}>
          <h2 id="lean-heading" className={`${s.heading} type-h2`} data-ln-head>
            {before}
            <span className="accent">{accent}</span>
            {after}
          </h2>
          <p className={`${s.lead} type-lead`} data-ln-head>
            {leanCopy.lead}
          </p>
          <div className={s.cta} data-ln-head>
            <Button href={DEMO_HREF} variant="secondary">
              See your numbers
            </Button>
          </div>
        </div>

        <div>
          <ol className={s.list} data-ln-list>
            {leanCopy.rows.map((r, i) => (
              <li key={r.title} className={s.row} data-ln-row>
                <span className={s.num}>{String(i + 1).padStart(2, "0")}</span>
                <div className={s.rowText}>
                  <h3 className={`${s.rowTitle} type-h5`}>{r.title}</h3>
                  <p className={s.rowBody}>{r.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
