"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/motion";
import { storyCopy } from "@/lib/content/products";
import Button from "@/components/ui/Button";
import { DEMO_HREF } from "@/components/chat/data";
import { Glyph } from "@/components/platform/mock/kit";
import { refreshWhenReady } from "@/components/platform/motion";
import s from "./story.module.css";

/**
 * Customer story — runroma.com's "Success story" card, shared by the three product
 * pages (DESIGN.md §G.11). It rides the red stretch of the page backdrop
 * (`data-backdrop="red"`), like /platform's Proof, and keeps every word inside one white
 * card so contrast never depends on the scrub. PDF figure only ($53K in 6 months); the
 * visual shows shape, not invented monthly amounts: a recovery curve that draws, with
 * disputes landing on it as they're credited.
 */

const CURVE = "M0 210 C60 206 100 196 150 176 S250 120 310 88 S420 34 520 18";
const AREA = `${CURVE} V240 H0 Z`;
// marks along the curve (x, y in the 520 × 240 box)
const MARKS = [
  { x: 118, y: 188, k: "file" as const, label: "Filed" },
  { x: 236, y: 132, k: "check" as const, label: "Credited" },
  { x: 368, y: 64, k: "check" as const, label: "Credited" },
];

export default function Story() {
  const root = useRef<HTMLElement>(null);
  const { before, accent, after } = storyCopy.heading;

  useLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
    if (prefersReducedMotion()) {
      el.setAttribute("data-static", "");
      return () => el.removeAttribute("data-static");
    }
    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(el);
      const tl = gsap.timeline({ paused: true, defaults: { ease: "power3.out" } });
      tl.from(q("[data-st-card]"), { autoAlpha: 0, y: 40, duration: 0.8 }, 0)
        .from(q("[data-st-text]"), { autoAlpha: 0, y: 16, duration: 0.5, stagger: 0.08 }, 0.25)
        .fromTo(q("[data-st='curve']"), { drawSVG: "0% 0%" }, { drawSVG: "0% 100%", duration: 1.6, ease: "power2.inOut" }, 0.45)
        .from(q("[data-st='area']"), { autoAlpha: 0, duration: 0.9 }, 1.1)
        .from(q("[data-st='mark']"), { autoAlpha: 0, scale: 0.4, duration: 0.4, stagger: 0.3, ease: "back.out(2.5)" }, 0.9)
        .from(q("[data-st='end']"), { autoAlpha: 0, scale: 0, duration: 0.45, ease: "back.out(2.5)" }, 1.95)
        .from(q("[data-st='tag']"), { autoAlpha: 0, y: 8, duration: 0.4 }, 2.1)
        .from(q("[data-st='stat']"), { autoAlpha: 0, y: 12, duration: 0.45, stagger: 0.1 }, 0.8);
      ScrollTrigger.create({ trigger: q("[data-st-card]")[0], start: "top 75%", once: true, onEnter: () => void tl.play() });
    }, el);
    const stop = refreshWhenReady();
    return () => {
      stop();
      ctx.revert();
    };
  }, []);

  return (
    <section ref={root} className={s.section} data-backdrop="red" aria-labelledby="story-heading">
      <div className={s.inner}>
        <article className={s.card} data-st-card>
          <div className={s.text}>
            <p className={`${s.label} type-label`} data-st-text>
              {storyCopy.label}
            </p>
            <h2 id="story-heading" className={`${s.heading} type-h3`} data-st-text>
              {before}
              <span className="accent">{accent}</span>
              {after}
            </h2>
            <p className={s.body} data-st-text>
              {storyCopy.body}
            </p>
            <dl className={s.stats}>
              {storyCopy.stats.map((st) => (
                <div key={st.label} className={s.stat} data-st="stat">
                  <dt>{st.label}</dt>
                  <dd>{st.value}</dd>
                </div>
              ))}
            </dl>
            <div className={s.cta} data-st-text>
              <Button href={DEMO_HREF} variant="primary">
                Book a demo →
              </Button>
            </div>
          </div>

          <div className={s.visual} aria-hidden="true">
            <div className={s.chartCard}>
              <div className={s.chartHead}>
                <span className={s.mono}>{storyCopy.brand} · recovered</span>
                <span className={s.legend}>
                  <i />6 months
                </span>
              </div>
              <div className={s.chart}>
                <svg viewBox="0 0 520 240" preserveAspectRatio="none">
                  {[60, 120, 180].map((y) => (
                    <path key={y} d={`M0 ${y}H520`} className={s.grid} />
                  ))}
                  <path d={AREA} className={s.area} data-st="area" />
                  <path d={CURVE} className={s.curve} data-st="curve" />
                </svg>
                {MARKS.map((m) => (
                  <span key={m.x} className={s.mark} style={{ left: `${(m.x / 520) * 100}%`, top: `${(m.y / 240) * 100}%` }} data-st="mark">
                    <span className={`${s.markDot} ${m.k === "check" ? s.ok : ""}`}>
                      <Glyph k={m.k} />
                    </span>
                    <span className={s.markLabel}>{m.label}</span>
                  </span>
                ))}
                <span className={s.end} data-st="end">
                  <span className={s.endTag} data-st="tag">
                    $53K
                  </span>
                </span>
              </div>
              <div className={s.months}>
                {storyCopy.months.map((m) => (
                  <span key={m}>{m}</span>
                ))}
              </div>
            </div>
          </div>
          <p className={s.note}>{storyCopy.note}</p>
        </article>
      </div>
    </section>
  );
}
