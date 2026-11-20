"use client";

import { useLayoutEffect, useRef, type MouseEvent } from "react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/motion";
import { APPLY_HREF, PARTNER_TYPE_EVENT, opportunities, opportunitiesHead } from "@/lib/content/partners";
import { refreshWhenReady, rise } from "@/components/platform/motion";
import { scrollToTarget } from "@/components/motion/SmoothScroll";
import Head from "./Head";
import TypeArt from "./art/TypeArt";
import PlasmaHover from "./art/PlasmaHover";
import p from "./partners.module.css";
import s from "./opportunities.module.css";

/**
 * Partnership opportunities (DESIGN.md §G.16; Cygnet "opportunity by partner type"):
 * one §E.6 card per partner type: an illustration well (art/TypeArt.tsx) that lights up
 * with a warm plasma on hover (art/PlasmaHover.tsx), who it is, the opportunity on a
 * tinted band, and a link that presets the application form's type (PARTNER_TYPE_EVENT)
 * and scrolls to it. Without JS the link falls back to `?type=…#apply`.
 */
export default function Opportunities() {
  const root = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const el = root.current;
    if (!el || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(el);
      rise(q("[data-pt-head]"), el);
      rise(q("[data-op='card']"), q("[data-op='grid']")[0], { start: "top 85%", stagger: 0.08 });
    }, el);
    const off = refreshWhenReady();
    return () => {
      off();
      ctx.revert();
    };
  }, []);

  const apply = (key: string) => (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    window.dispatchEvent(new CustomEvent(PARTNER_TYPE_EVENT, { detail: key }));
    scrollToTarget(APPLY_HREF);
  };

  return (
    <section ref={root} className={p.section} aria-labelledby="pt-opps">
      <div className={p.inner}>
        <Head id="pt-opps" label={opportunitiesHead.label} heading={opportunitiesHead.heading} lead={opportunitiesHead.lead} split />

        <ul className={s.grid} data-op="grid">
          {opportunities.map((o, i) => (
            <li key={o.key} className={s.card} data-op="card" data-plasma-host>
              <div className={`${s.well} ${o.key === "technology" ? s.wellNeutral : ""}`} aria-hidden="true">
                <PlasmaHover />
                <TypeArt k={o.key} />
              </div>
              <span className={s.num}>{String(i + 1).padStart(2, "0")}</span>
              <h3 className={`${s.title} type-h4`}>{o.title}</h3>
              <p className={s.who}>{o.who}</p>
              <div className={s.opp}>
                <p className={`${s.oppLabel} type-label`}>Opportunity</p>
                <p className={s.oppText}>{o.opportunity}</p>
              </div>
              <a href={`?type=${o.key}${APPLY_HREF}`} onClick={apply(o.key)} className={s.link}>
                <span>{o.cta}</span>
                <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M3 8h10M9 4l4 4-4 4" />
                </svg>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
