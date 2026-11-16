"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/motion";
import { coverage } from "@/lib/content/platform";
import { refreshWhenReady, rise, token } from "@/components/platform/motion";
import s from "./coverage.module.css";

/**
 * Coverage — the channels Roma connects to, set as type (no retailer logos: names are
 * stated factually as portals, DESIGN.md §G.9 tone rule). Static row, no marquee.
 */
export default function Coverage() {
  const root = useRef<HTMLElement>(null);
  const { before, accent, after } = coverage.heading;

  useLayoutEffect(() => {
    const el = root.current;
    if (!el || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(el);
      rise(q("[data-cv-head]"), q("[data-cv-head]")[0]);
      rise(q("[data-cv-name]"), q("[data-cv-list]")[0], { stagger: 0.06 });
      // each portal "connects": its dot goes from sand to green, left to right
      gsap.fromTo(
        q("[data-cv-dot]"),
        { backgroundColor: token("--color-sand-400"), scale: 0.6 },
        {
          backgroundColor: token("--data-ok"),
          scale: 1,
          duration: 0.4,
          ease: "back.out(2.5)",
          stagger: 0.12,
          delay: 0.45,
          scrollTrigger: { trigger: q("[data-cv-list]")[0], start: "top 85%", once: true },
        },
      );
      rise(q("[data-cv-meta]"), q("[data-cv-list]")[0], { delay: 0.4 });
    }, el);
    const stop = refreshWhenReady();
    return () => {
      stop();
      ctx.revert();
    };
  }, []);

  return (
    <section ref={root} className={s.section} aria-labelledby="coverage-heading">
      <div className={s.inner}>
        <h2 id="coverage-heading" className={`${s.heading} type-h3`} data-cv-head>
          {before}
          <span className="accent">{accent}</span>
          {after}
        </h2>
        <ul className={s.list} data-cv-list aria-label="Distributors and retailers">
          {coverage.channels.map((ch) => (
            <li key={ch} className={s.name} data-cv-name>
              <span className={s.dot} data-cv-dot aria-hidden="true" />
              {ch}
            </li>
          ))}
        </ul>
        <div className={s.meta} data-cv-meta>
          <p className={s.metaMain}>{coverage.meta}</p>
          <p className={s.note}>{coverage.note}</p>
        </div>
      </div>
    </section>
  );
}
