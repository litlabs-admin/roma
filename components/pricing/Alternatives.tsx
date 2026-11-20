"use client";

import { useLayoutEffect, useRef, type CSSProperties } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/motion";
import RollingNumber from "@/components/calculator/RollingNumber";
import { getCompetitor } from "@/lib/content/compare";
import { ALTERNATIVES, ALT_SOURCES, ENTRY_PLAN, pricingCopy } from "@/lib/content/pricing";
import { track } from "@/lib/calculator/track";
import s from "./alternatives.module.css";

/**
 * Roma vs alternatives as price tags (DESIGN.md §G.18, brief §3.6; the Floret compare
 * card's "Custom quote" tag, grown into a row). Every competitor hangs a tag with what its
 * own public page says about price: dashed when no price is published, solid when it is.
 * Roma's tag is the one on the home Stories red. On enter Roma's tag rises and its price
 * rolls in, then the others rise in turn (no tilt, client 20 Nov 2026); pointing at a tag
 * darkens its edge and nudges its link arrow. Statements are cited:
 * each tag carries its source number, listed under the row.
 */

const C = pricingCopy.alternatives;

export default function Alternatives() {
  const root = useRef<HTMLElement>(null);
  const roma = ALTERNATIVES.find((r) => r.roma)!;
  const others = ALTERNATIVES.filter((r) => !r.roma);

  useLayoutEffect(() => {
    const el = root.current;
    if (!el || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(el);
      const tl = gsap.timeline({ paused: true });
      tl.fromTo(q("[data-alt-head]"), { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.5, ease: "power3.out", stagger: 0.09 }, 0)
        // straight rises only (client, 20 Nov 2026: no tilt)
        .fromTo(q("[data-roma-tag]"), { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.7, ease: "power3.out", clearProps: "transform" }, 0.2)
        .fromTo(q("[data-tag]"), { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.6, ease: "power3.out", stagger: 0.08, clearProps: "transform" }, 0.35)
        .fromTo(q("[data-alt-foot]"), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5 }, 1);
      ScrollTrigger.create({ trigger: el, start: "top 75%", once: true, onEnter: () => void tl.play() });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} className={`container-lg ${s.section}`} aria-labelledby="alt-heading">
      <div className={s.head}>
        <div>
          <p className={`${s.eyebrow} type-label`} data-alt-head>
            <span className={s.dot} aria-hidden="true" />
            {C.label}
          </p>
          <h2 id="alt-heading" className={`${s.title} type-h2`} data-alt-head>
            {C.heading.before}
            <span className="accent">{C.heading.accent}</span>
            {C.heading.after}
          </h2>
        </div>
        <p className={`${s.lead} type-lead`} data-alt-head>
          {C.lead}
        </p>
      </div>

      <div className={s.stage}>
        {/* Roma */}
        <article className={s.romaTag} data-roma-tag aria-labelledby="alt-roma">
          <span className={s.hole} aria-hidden="true" />
          <p id="alt-roma" className={`${s.romaName} type-label`}>
            Roma
          </p>
          <p className={s.romaPrice}>
            <span className={s.romaFrom}>From</span>
            <RollingNumber text={`$${ENTRY_PLAN.price ?? 399}`} className={s.romaFig} rollIn />
            <span className={s.romaUnit}>/month</span>
          </p>
          <p className={s.romaModel}>{roma.model}</p>
          <ul className={s.romaPoints}>
            <li>Published on this page</li>
            <li>Not tied to deduction volume</li>
            <li>No % of what you recover</li>
          </ul>
          <span className={s.stamp} aria-hidden="true">
            Published
          </span>
        </article>

        {/* the others */}
        <ul className={s.tags}>
          {others.map((r, i) => {
            const comp = r.slug ? getCompetitor(r.slug) : undefined;
            const logo = comp?.logo;
            return (
              <li key={r.name} className={s.tagSlot} data-tag style={{ "--i": i } as CSSProperties}>
                <div className={`${s.tag} ${r.published ? s.tagSolid : ""}`}>
                <span className={s.hole} aria-hidden="true" />
                <div className={s.tagHead}>
                  {logo ? (
                    // eslint-disable-next-line @next/next/no-img-element -- local SVG wordmark, own proportions
                    <img
                      src={logo.src}
                      alt={r.name}
                      width={logo.w}
                      height={logo.h}
                      className={s.logo}
                      style={{ height: logo.maxPx ? `min(1.25rem, ${logo.maxPx}px)` : "1.25rem", aspectRatio: `${logo.w} / ${logo.h}` }}
                    />
                  ) : (
                    <span className={s.tagName}>{r.name}</span>
                  )}
                  {r.source !== undefined && (
                    <a className={s.cite} href={`#alt-src-${r.source + 1}`} aria-label={`Source ${r.source + 1}: ${ALT_SOURCES[r.source].where}`}>
                      {r.source + 1}
                    </a>
                  )}
                </div>
                <p className={s.tagPrice}>{r.price}</p>
                <p className={s.tagModel}>{r.model}</p>
                {r.href ? (
                  <a href={r.href} className={s.tagLink} onClick={() => track("pricing_compare_click", { competitor: r.name })}>
                    {C.compareLink}
                    <span className="sr-only"> with {r.name}</span>
                    <svg viewBox="0 0 16 16" aria-hidden="true">
                      <path d="M3 8h10M9 4l4 4-4 4" />
                    </svg>
                  </a>
                ) : (
                  <span className={s.tagSoon}>{C.soon}</span>
                )}
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      <div className={s.sources} data-alt-foot>
        <p className={`${s.sourcesTitle} type-label`}>{C.sources}</p>
        <ol>
          {ALT_SOURCES.map((src, i) => (
            <li key={src.url} id={`alt-src-${i + 1}`}>
              {src.name}:{" "}
              <a href={src.url} target="_blank" rel="noopener noreferrer">
                {src.where}
              </a>
            </li>
          ))}
        </ol>
        <p className={s.checked}>{C.checked}</p>
      </div>
    </section>
  );
}
