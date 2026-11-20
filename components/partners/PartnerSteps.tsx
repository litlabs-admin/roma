"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { BP, isBelow, prefersReducedMotion } from "@/lib/motion";
import { JOURNEY_ID, steps, stepsHead } from "@/lib/content/partners";
import { playOnce, refreshWhenReady, rise } from "@/components/platform/motion";
import Head from "./Head";
import p from "./partners.module.css";
import s from "./steps.module.css";

/**
 * Partnership journey (DESIGN.md §G.16; Cygnet "Partnership Journey"): Discover →
 * Enable → Collaborate → Grow on a track that fills red once (horizontal ≥992px, a
 * vertical rail below). `data-backdrop="light"`: the page backdrop turns light red
 * while this section is read (§G.4). No week durations (not confirmed).
 */

export default function PartnerSteps() {
  const root = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
    // Reduced motion: no backdrop scrub, so this section paints its own light band.
    if (prefersReducedMotion()) {
      el.setAttribute("data-static", "");
      return () => el.removeAttribute("data-static");
    }
    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(el);
      rise(q("[data-pt-head]"), el);
      const list = q("[data-st='list']")[0];
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      const axis = isBelow(BP.lg) ? "scaleY" : "scaleX";
      tl.fromTo(q("[data-st='fill']"), { [axis]: 0 }, { [axis]: 1, duration: 1.4, ease: "power2.inOut" }, 0)
        .fromTo(q("[data-st='node']"), { scale: 0.5, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.35, stagger: 0.32, ease: "back.out(2)" }, 0)
        .fromTo(q("[data-st='text']"), { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.32 }, 0.1);
      playOnce(list, tl, "top 78%");
    }, el);
    const off = refreshWhenReady();
    return () => {
      off();
      ctx.revert();
    };
  }, []);

  return (
    <section ref={root} id={JOURNEY_ID} className={`${p.section} ${s.section}`} data-backdrop="light" aria-labelledby="pt-steps">
      <div className={p.inner}>
        <Head id="pt-steps" label={stepsHead.label} heading={stepsHead.heading} />
        <div className={s.wrap} data-st="list">
          <span className={s.track} aria-hidden="true">
            <span className={s.fill} data-st="fill" />
          </span>
          <ol className={s.list}>
          {steps.map((st, i) => (
            <li key={st.title} className={s.step}>
              <span className={s.node} data-st="node">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className={s.text} data-st="text">
                <h3 className={`${s.title} type-h5`}>{st.title}</h3>
                <p className={s.body}>{st.text}</p>
              </div>
            </li>
          ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
