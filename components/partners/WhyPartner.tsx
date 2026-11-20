"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/motion";
import { why } from "@/lib/content/partners";
import { refreshWhenReady, rise } from "@/components/platform/motion";
import Head from "./Head";
import BenefitArt from "./art/BenefitArt";
import p from "./partners.module.css";
import s from "./why.module.css";

/**
 * Why partner with Roma (DESIGN.md §G.16; Cygnet "Why Partner"): the gap Roma fills,
 * three benefits on one joined white strip, each led by a small illustration that plays
 * once (art/BenefitArt.tsx). PDF proof lives inside the art (client 20 Nov: no separate
 * stats row): "Live in 5 min" on the new service, "25 brands pay for Roma" under the market.
 */
export default function WhyPartner() {
  const root = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const el = root.current;
    if (!el || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(el);
      rise(q("[data-pt-head]"), el);
      rise(q("[data-wy='cell']"), q("[data-wy='strip']")[0], { start: "top 85%" });
    }, el);
    const off = refreshWhenReady();
    return () => {
      off();
      ctx.revert();
    };
  }, []);

  return (
    <section ref={root} className={p.section} aria-labelledby="pt-why">
      <div className={p.inner}>
        <Head id="pt-why" label={why.label} heading={why.heading} lead={why.lead} split />

        <ol className={s.strip} data-wy="strip">
          {why.benefits.map((b, i) => (
            <li key={b.title} className={s.cell} data-wy="cell">
              <BenefitArt i={i} />
              <span className={s.num}>{String(i + 1).padStart(2, "0")}</span>
              <h3 className={`${s.title} type-h5`}>{b.title}</h3>
              <p className={s.text}>{b.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
