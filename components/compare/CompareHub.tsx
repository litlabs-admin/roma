"use client";

import { useLayoutEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/motion";
import type { Competitor } from "@/lib/content/compare/types";
import { refreshWhenReady, rise } from "@/components/platform/motion";
import ArrowLink from "@/components/ui/ArrowLink";
import { useCompareOptional } from "./context";
import { useSpotlight } from "./spotlight";
import CompetitorLogo from "./CompetitorLogo";
import c from "./compare.module.css";
import s from "./hub.module.css";

/**
 * "Compare Roma with others" (DESIGN.md §G.13): one link card per other comparison page
 * (Retell / Framer keep a hub like this). Each card: the competitor's own logo, "Roma vs. X",
 * its one-line blurb. Hover per §F.7: border darkens, the arrow nudges; no lift.
 */
export default function CompareHub({ others, title, lead }: { others: Competitor[]; title?: string; lead?: string }) {
  // On /compare/[slug] the page's competitor; on the /compare hub there is none, and the
  // spotlighted competitor's card carries the active border (§G.13a).
  const comp = useCompareOptional()?.c;
  const { pick } = useSpotlight();
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
            {title ?? `Not comparing against ${comp?.name}?`}
          </h2>
          <div className={s.leadCol} data-hub>
            <p className={s.lead}>{lead ?? "See how Roma compares with other deduction tools, in each company’s own words."}</p>
            {comp && (
              <ArrowLink href="/compare" arrow="none" className={s.all}>
                See all five side by side →
              </ArrowLink>
            )}
          </div>
        </div>
        <ul className={s.grid} style={{ ["--hub-cols" as string]: Math.min(others.length, 4) }}>
          {others.map((o) => (
            <li key={o.slug} data-hub>
              <Link href={`/compare/${o.slug}`} prefetch className={`${s.card} ${pick === o.slug ? s.cardOn : ""}`} aria-current={pick === o.slug ? "true" : undefined}>
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
