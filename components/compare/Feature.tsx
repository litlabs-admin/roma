"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/motion";
import type { Heading } from "@/lib/content/platform";
import type { Claim, QuoteId } from "@/lib/content/compare/types";
import { QUOTES } from "@/lib/content/compare/roma";
import { refreshWhenReady, rise } from "@/components/platform/motion";
import { useCompare } from "./context";
import Cite from "./Cite";
import CompetitorLogo from "./CompetitorLogo";
import c from "./compare.module.css";
import s from "./feature.module.css";

/**
 * One story section on a comparison page (DESIGN.md §G.13): a mono label, an h2 with
 * one serif accent, a lead, optional extras (the competitor's own line, a customer
 * quote), and one illustration that proves the point. Pages choose which sections
 * they need and in what order; nothing here is a fixed template.
 */

type Props = {
  id: string;
  label: string;
  heading: Heading;
  lead: string;
  layout?: "split" | "flip" | "wide";
  well?: "warm" | "neutral" | "none";
  badge?: string;
  children: ReactNode;
  extra?: ReactNode;
};

export default function Feature({ id, label, heading, lead, layout = "split", well = "warm", badge, children, extra }: Props) {
  const root = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const el = root.current;
    if (!el || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(el);
      const row = q("[data-ft='row']")[0];
      rise(q("[data-ft='text'] > *"), row, { stagger: 0.07, start: "top 80%" });
      rise(q("[data-ft='well']"), row, { y: 24, duration: 0.7, start: "top 80%" });
    }, el);
    const stop = refreshWhenReady();
    return () => {
      stop();
      ctx.revert();
    };
  }, []);

  const wellClass = well === "none" ? s.wellBare : `${s.well} ${well === "neutral" ? s.wellNeutral : ""}`;

  return (
    <section ref={root} className={c.section} aria-labelledby={id}>
      <div className={c.inner}>
        <div className={`${s.row} ${layout === "wide" ? s.wide : layout === "flip" ? s.flip : ""}`} data-ft="row">
          <div className={s.text} data-ft="text">
            <div className={s.textHead}>
              <p className={`${c.label} type-label`}>
                {label}
                {badge && <span className={s.badgeNew}>{badge}</span>}
              </p>
              <h2 id={id} className={s.title}>
                {heading.before}
                <span className="accent">{heading.accent}</span>
                {heading.after}
              </h2>
            </div>
            <div className={s.textSide}>
              <p className={s.body}>{lead}</p>
              {extra}
            </div>
          </div>
          <div className={wellClass} data-ft="well">
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}

/** The competitor's own line on the section's point, under its logo, cited. */
export function TheySay({ claim }: { claim: Claim }) {
  const { c } = useCompare();
  return (
    <div className={s.said}>
      <span className={s.saidWho}>
        <CompetitorLogo height={c.logo.size * 0.7} />
        <span>in its own words</span>
      </span>
      <p className={s.saidText}>
        {claim.text}
        {claim.source && <Cite id={claim.source} />}
      </p>
    </div>
  );
}

/** A customer's words, set large. */
export function PullQuote({ id }: { id: QuoteId }) {
  const q = QUOTES[id];
  return (
    <figure className={s.pull}>
      <blockquote>{q.text}</blockquote>
      <figcaption>
        <b>{q.name}</b>, {q.company}
      </figcaption>
    </figure>
  );
}

/** A customer report, shown attributed and never as fact. */
export function Note({ children }: { children: ReactNode }) {
  return <p className={s.note}>{children}</p>;
}
