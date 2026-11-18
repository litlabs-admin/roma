"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/motion";
import { numbersCopy } from "@/lib/content/products";
import { Glyph, RomaGlyph } from "@/components/platform/mock/kit";
import { refreshWhenReady, rise } from "@/components/platform/motion";
import s from "./numbers.module.css";

/**
 * "We don't speak. Our numbers do." — runroma.com's performance band, shared by the
 * three product pages (DESIGN.md §G.11), as three platform-style cards. Each figure
 * sits under a small illustration that shows what the number means, playing once as
 * the cards enter: a stopwatch that stops before 5 minutes as a portal connects; the
 * "before" bar of manual work shrinking to a tenth; a recovery curve with credits
 * landing on it. Figures count up. SSR = finished state.
 */

// Stopwatch: 5 of 60 minutes = 30° of arc on a r=34 ring (starts at 12 o'clock).
const R = 34;
const ARC = (() => {
  const a = (30 * Math.PI) / 180;
  return `M50 ${50 - R} A${R} ${R} 0 0 1 ${(50 + R * Math.sin(a)).toFixed(2)} ${(50 - R * Math.cos(a)).toFixed(2)}`;
})();
const TICKS = Array.from({ length: 12 }, (_, i) => i * 30);

const CURVE = "M0 70 C40 68 70 62 100 52 S160 26 200 10";
const MARKS = [
  { x: 62, y: 63 },
  { x: 118, y: 44 },
  { x: 168, y: 22 },
];

function Stopwatch() {
  return (
    <div className={s.vWatch}>
      <svg className={s.dial} viewBox="0 0 100 100" aria-hidden="true">
        <circle cx="50" cy="50" r={R + 8} className={s.dialFace} />
        {TICKS.map((t) => (
          <path key={t} d="M50 12v4" transform={`rotate(${t} 50 50)`} className={s.tick} />
        ))}
        <circle cx="50" cy="50" r={R} className={s.ring} />
        <path d={ARC} className={s.arc} data-nb="arc" />
        <g data-nb="hand" transform="rotate(30 50 50)">
          <path d="M50 50V22" className={s.hand} />
        </g>
        <circle cx="50" cy="50" r="3" className={s.hub} />
        <rect x="45" y="2" width="10" height="5" rx="1.5" className={s.crown} />
      </svg>
      <div className={s.connect}>
        <span className={s.portal} data-nb="pop">
          UNFI
        </span>
        <span className={s.wire} data-nb="wire" />
        <span className={s.badge} data-nb="pop">
          <RomaGlyph />
        </span>
        <span className={s.live} data-nb="pop">
          <i />
          Connected
        </span>
      </div>
    </div>
  );
}

function HoursBars() {
  return (
    <div className={s.vBars}>
      <div className={s.barRow}>
        <span className={s.barLabel}>Before</span>
        <span className={s.barTrack}>
          <span className={`${s.bar} ${s.barBefore}`} />
        </span>
        <span className={s.barNote}>Portals, spreadsheets, email</span>
      </div>
      <div className={s.barRow}>
        <span className={s.barLabel}>With Roma</span>
        <span className={s.barTrack}>
          <span className={`${s.bar} ${s.barRoma}`} data-nb="roma" />
          <span className={s.saved} data-nb="saved">
            −90%
          </span>
        </span>
        <span className={s.barNote}>Review and confirm</span>
      </div>
    </div>
  );
}

function RecoveryCurve() {
  return (
    <div className={s.vCurve}>
      <svg viewBox="0 0 200 80" preserveAspectRatio="none" aria-hidden="true">
        <path d={`${CURVE} V80 H0 Z`} className={s.area} data-nb="area" />
        <path d={CURVE} className={s.curve} data-nb="curve" />
      </svg>
      {MARKS.map((m) => (
        <span key={m.x} className={s.mark} style={{ left: `${(m.x / 200) * 100}%`, top: `${(m.y / 80) * 100}%` }} data-nb="mark">
          <Glyph k="check" />
        </span>
      ))}
      <span className={s.endDot} data-nb="mark" />
    </div>
  );
}

const VISUALS = [Stopwatch, HoursBars, RecoveryCurve];
const WELLS = ["warm", "neutral", "warm"] as const;

export default function Numbers() {
  const root = useRef<HTMLElement>(null);
  const { before, accent, after } = numbersCopy.heading;

  useLayoutEffect(() => {
    const el = root.current;
    if (!el || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(el);
      rise(q("[data-nb-head]"), q("[data-nb-head]")[0]);
      const tl = gsap.timeline({ paused: true, defaults: { ease: "power3.out" } });
      tl.from(q("[data-nb-card]"), { autoAlpha: 0, y: 24, duration: 0.6, stagger: 0.12 }, 0);

      // 1 · the watch runs and stops short of 5 minutes as the portal connects
      tl.fromTo(q("[data-nb='arc']"), { drawSVG: "0% 0%" }, { drawSVG: "0% 100%", duration: 1.1, ease: "power2.inOut" }, 0.35)
        .fromTo(q("[data-nb='hand']"), { rotation: 0, svgOrigin: "50 50" }, { rotation: 30, svgOrigin: "50 50", duration: 1.1, ease: "power2.inOut" }, 0.35)
        .from(q("[data-nb-card='0'] [data-nb='pop']"), { autoAlpha: 0, scale: 0.7, duration: 0.4, stagger: 0.15, ease: "back.out(2)" }, 0.7)
        .from(q("[data-nb='wire']"), { scaleX: 0, duration: 0.35, ease: "power2.out" }, 0.85);

      // 2 · the manual-work bar shrinks to a tenth and turns red
      tl.fromTo(q("[data-nb='roma']"), { scaleX: 1, backgroundColor: "#d6cfc0" }, { scaleX: 0.1, backgroundColor: "#b21515", duration: 1.1, ease: "power3.inOut" }, 0.55)
        .from(q("[data-nb='saved']"), { autoAlpha: 0, x: -8, duration: 0.4 }, 1.45);

      // 3 · recovery curve draws, credits land on it
      tl.fromTo(q("[data-nb='curve']"), { drawSVG: "0% 0%" }, { drawSVG: "0% 100%", duration: 1.3, ease: "power2.inOut" }, 0.6)
        .from(q("[data-nb='area']"), { autoAlpha: 0, duration: 0.8 }, 1.1)
        .from(q("[data-nb='mark']"), { autoAlpha: 0, scale: 0.3, duration: 0.35, stagger: 0.22, ease: "back.out(2.5)" }, 0.9);

      q("[data-nb-value]").forEach((node, i) => {
        const span = node as HTMLElement;
        const to = Number(span.dataset.to);
        const n = { v: 0 };
        tl.fromTo(n, { v: 0 }, { v: to, duration: 1.3, ease: "power2.out", onUpdate: () => void (span.textContent = String(Math.round(n.v))) }, 0.3 + i * 0.12);
      });
      ScrollTrigger.create({ trigger: q("[data-nb-grid]")[0], start: "top 80%", once: true, onEnter: () => void tl.play() });
    }, el);
    const stop = refreshWhenReady();
    return () => {
      stop();
      ctx.revert();
      el.querySelectorAll<HTMLElement>("[data-nb-value]").forEach((n) => (n.textContent = n.dataset.to ?? ""));
    };
  }, []);

  return (
    <section ref={root} className={s.section} aria-labelledby="numbers-heading">
      <div className={s.inner}>
        <div className={s.head}>
          <div className={s.headLeft}>
            <p className={`${s.label} type-label`} data-nb-head>
              {numbersCopy.label}
            </p>
            <h2 id="numbers-heading" className={`${s.heading} type-h2`} data-nb-head>
              {before}
              <span className="accent">{accent}</span>
              {after}
            </h2>
          </div>
          <p className={s.note} data-nb-head>
            {numbersCopy.note}
          </p>
        </div>

        <ul className={s.grid} data-nb-grid>
          {numbersCopy.stats.map((st, i) => {
            const Visual = VISUALS[i];
            return (
              <li key={st.label} className={s.card} data-nb-card={i}>
                <div className={`${s.well} ${s[WELLS[i]]}`} aria-hidden="true">
                  <Visual />
                </div>
                <div className={s.text}>
                  <span className={s.cardLabel}>{st.label}</span>
                  <p className={s.figure} aria-label={`${st.prefix}${st.value}${st.suffix}`}>
                    <span aria-hidden="true">
                      {st.prefix}
                      <span data-nb-value data-to={st.value}>
                        {st.value}
                      </span>
                      <span className={s.suffix}>{st.suffix}</span>
                    </span>
                  </p>
                  <p className={s.body}>{st.body}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
