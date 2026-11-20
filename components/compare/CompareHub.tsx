"use client";

import { useLayoutEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/motion";
import type { Competitor } from "@/lib/content/compare/types";
import { refreshWhenReady, rise } from "@/components/platform/motion";
import { useCompare } from "./context";
import CompetitorLogo from "./CompetitorLogo";
import c from "./compare.module.css";
import s from "./hub.module.css";

/**
 * "Compare Roma with others" (DESIGN.md §G.13): one link card per other comparison page
 * (Retell / Framer keep a hub like this). Each card: the competitor's own logo, "Roma vs. X",
 * its one-line blurb. Hover per §F.7: border darkens, the arrow nudges; no lift.
 */
export default function CompareHub({ others }: { others: Competitor[] }) {
  const { c: comp } = useCompare();
  const root = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const el = root.current;
    if (!el || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(el);
      rise(q("[data-hub]"), q("[data-hub]")[0], { stagger: 0.08 });
    }, el);
    const stop = refreshWhenReady();
    return () => {
      stop();
      ctx.revert();
    };
  }, []);

  if (!others.length) return null;

  return (
    <section ref={root} className={`${c.section} ${s.section}`} aria-labelledby="hub-heading">
      <div className={c.inner}>
        <div className={s.head}>
          <h2 id="hub-heading" className={s.title} data-hub>
            Not comparing against {comp.name}?
          </h2>
          <p className={s.lead} data-hub>
            See how Roma compares with other deduction tools, in each company’s own words.
          </p>
        </div>
        <ul className={s.grid}>
          {others.map((o) => (
            <li key={o.slug} data-hub>
              <Link href={`/compare/${o.slug}`} className={s.card}>
                <span className={s.logo}>
                  <CompetitorLogo of={o} height={o.logo.size * 0.85} />
                </span>
                <span className={s.name}>Roma vs. {o.name}</span>
                <span className={s.blurb}>{o.blurb}</span>
                <span className={s.arrow} aria-hidden="true">
                  →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
