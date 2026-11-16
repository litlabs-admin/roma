"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/motion";
import { proofCopy } from "@/lib/content/platform";
import { refreshWhenReady, rise } from "@/components/platform/motion";
import s from "./proof.module.css";

/**
 * Proof — Hyperline billing's stat blocks, with the positioning PDF's figures only
 * ($53K Good Day Chocolate, $23K Smash Kitchen, 25 brands; DESIGN.md §0). Each figure
 * counts up once as the row arrives. No quotes: the PDF has none.
 */

const COUNT = { duration: 1.2, stagger: 0.12, start: "top 80%" };

export default function Proof() {
  const root = useRef<HTMLElement>(null);
  const { before, accent, after } = proofCopy.heading;

  useLayoutEffect(() => {
    const el = root.current;
    if (!el || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(el);
      rise(q("[data-pf-head]"), q("[data-pf-head]")[0]);
      rise(q("[data-pf-stat]"), q("[data-pf-list]")[0], { stagger: COUNT.stagger });

      const tl = gsap.timeline({ paused: true });
      q("[data-pf-value]").forEach((node, i) => {
        const span = node as HTMLElement;
        const to = Number(span.dataset.to ?? 0);
        const n = { v: 0 };
        span.textContent = "0";
        tl.to(n, { v: to, duration: COUNT.duration, ease: "power2.out", onUpdate: () => void (span.textContent = String(Math.round(n.v))) }, i * COUNT.stagger);
      });
      ScrollTrigger.create({ trigger: q("[data-pf-list]")[0], start: COUNT.start, once: true, onEnter: () => void tl.play() });
    }, el);
    const stop = refreshWhenReady();
    return () => {
      stop();
      ctx.revert();
      el.querySelectorAll<HTMLElement>("[data-pf-value]").forEach((sp) => (sp.textContent = sp.dataset.to ?? ""));
    };
  }, []);

  return (
    <section ref={root} className={s.section} aria-labelledby="proof-heading">
      <div className={s.inner}>
        <h2 id="proof-heading" className={`${s.heading} type-h2`} data-pf-head>
          {before}
          <span className="accent">{accent}</span>
          {after}
        </h2>

        <ul className={s.list} data-pf-list>
          {proofCopy.stats.map((st) => (
            <li key={st.label} className={s.stat} data-pf-stat>
              <p className={s.value} aria-label={`${st.prefix}${st.value}${st.suffix}`}>
                <span aria-hidden="true">
                  {st.prefix}
                  <span data-pf-value data-to={st.value}>
                    {st.value}
                  </span>
                  {st.suffix}
                </span>
              </p>
              <p className={s.label}>{st.label}</p>
            </li>
          ))}
        </ul>
        <p className={s.note}>{proofCopy.note}</p>
      </div>
    </section>
  );
}
