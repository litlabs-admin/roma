"use client";

import Image from "next/image";
import { useLayoutEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/motion";
import { splitChars } from "@/components/ui/splitChars";
import { BADGES, PILLARS, complianceCopy, type Pillar } from "./data";
import s from "./compliance.module.css";

/**
 * "Privacy first. Security always." — runroma.com's compliance section in Roma's
 * design language. Sits on the light-red stretch of the page backdrop
 * (`data-backdrop="light"`), so it has no fill of its own.
 *
 * Motion: Fruitful's scrubbed character highlight on the heading, then one-shot
 * Hyperline-style reveals (16px rise, 0.5s, 90ms stagger) for the copy, the badges
 * (with a soft pop) and the pillar strip. SSR markup is the finished state.
 */

const ICONS: Record<Pillar["icon"], React.ReactNode> = {
  layers: (
    <>
      <path d="M12 3 3 7.5 12 12l9-4.5L12 3Z" />
      <path d="m3 12 9 4.5 9-4.5" />
      <path d="m3 16.5 9 4.5 9-4.5" />
    </>
  ),
  lock: (
    <>
      <rect x="4.5" y="10.5" width="15" height="10" rx="2" />
      <path d="M8 10.5V7a4 4 0 0 1 8 0v3.5" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4.5 20.5c1.2-3.6 4-5.5 7.5-5.5s6.3 1.9 7.5 5.5" />
    </>
  ),
};

export default function Compliance() {
  const root = useRef<HTMLElement>(null);
  const { before, accent, after } = complianceCopy.heading;

  useLayoutEffect(() => {
    const el = root.current;
    if (!el || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(el);
      gsap.fromTo(
        q("[data-char]"),
        { opacity: 0.4 },
        { opacity: 1, stagger: 0.02, duration: 0.2, ease: "none", scrollTrigger: { trigger: q("h2")[0], start: "top bottom", end: "top 30%", scrub: true } },
      );
      const rise = (targets: Element[], trigger: Element, extra: gsap.TweenVars = {}) =>
        gsap.fromTo(
          targets,
          { autoAlpha: 0, y: 16 },
          { autoAlpha: 1, y: 0, duration: 0.5, ease: "power3.out", stagger: 0.09, ...extra, scrollTrigger: { trigger, start: "top 85%", once: true } },
        );
      rise(q("[data-cp-body]"), q("[data-cp-body]")[0]);
      gsap.fromTo(
        q("[data-cp-badge]"),
        { autoAlpha: 0, y: 16, scale: 0.9 },
        { autoAlpha: 1, y: 0, scale: 1, duration: 0.6, ease: "back.out(1.6)", stagger: 0.09, scrollTrigger: { trigger: q("[data-cp-badges]")[0], start: "top 85%", once: true } },
      );
      rise(q("[data-cp-pillar]"), q("[data-cp-pillars]")[0], { stagger: 0.08 });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} className={s.section} data-backdrop="light" aria-labelledby="compliance-heading">
      <div className={s.inner}>
        <h2 id="compliance-heading" className={`${s.heading} type-h2`} aria-label={`${before}${accent}${after}`}>
          <span aria-hidden="true">
            {splitChars(before, false, "a")}
            {splitChars(accent, true, "b")}
            {splitChars(after, false, "c")}
          </span>
        </h2>
        <p className={`${s.body} type-lead`} data-cp-body>
          {complianceCopy.body}
        </p>

        <ul className={s.badges} data-cp-badges>
          {BADGES.map((b) => (
            <li key={b.src} className={s.badge} data-cp-badge>
              <Image src={b.src} alt={b.alt} width={512} height={512} sizes="(max-width: 767px) 6rem, 9.375rem" quality={85} />
            </li>
          ))}
        </ul>

        <ul className={s.pillars} data-cp-pillars>
          {PILLARS.map((p) => (
            <li key={p.title} className={s.pillar} data-cp-pillar>
              <svg className={s.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                {ICONS[p.icon]}
              </svg>
              <div>
                <h3 className={s.pillarTitle}>{p.title}</h3>
                <p className={s.pillarBody}>{p.body}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
