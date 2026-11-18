"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/motion";
import { ILLUSTRATIVE, glMap } from "@/lib/content/products";
import { Glyph, at } from "@/components/platform/mock/kit";
import { refreshWhenReady, rise } from "@/components/platform/motion";
import m from "@/components/platform/mock/mock.module.css";
import s from "./glmap.module.css";

/**
 * "Accounting-ready credit memos." — runroma.com's GL-mapping feature as a routing
 * diagram (DESIGN.md §G.11): deduction types on the left, GL accounts on the right,
 * one rule per route. Routes draw on enter; pointing at a type (or an account) lights
 * its routes and dims the rest. 520 × 400 canvas, --u = 1/520 of the well width.
 */

const W = 520;
const T = { x: 24, w: 150, h: 40, y0: 34, gap: 56 };
const A = { x: 324, w: 172, h: 58, y0: 52, gap: 80 };
const CAT = { promo: m.promo, shortage: m.shortage, fees: m.fees } as const;

const ty = (i: number) => T.y0 + i * T.gap + T.h / 2;
const ay = (j: number) => A.y0 + j * A.gap + A.h / 2;
const route = (i: number, j: number) => {
  const x1 = T.x + T.w;
  const x2 = A.x;
  const mx = (x1 + x2) / 2;
  return `M${x1} ${ty(i)} C${mx} ${ty(i)} ${mx} ${ay(j)} ${x2} ${ay(j)}`;
};

export default function GlMap() {
  const root = useRef<HTMLElement>(null);
  const [hot, setHot] = useState<{ t?: number; a?: number } | null>(null);
  const lit = (i: number) => !hot || hot.t === i || hot.a === glMap.types[i].to;
  const litA = (j: number) => !hot || hot.a === j || (hot.t != null && glMap.types[hot.t].to === j);

  useLayoutEffect(() => {
    const el = root.current;
    if (!el || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(el);
      rise(q("[data-gm-head]"), q("[data-gm-card]")[0]);
      const tl = gsap.timeline({ paused: true, defaults: { ease: "power3.out" } });
      // fromTo, not from: these nodes carry a CSS opacity transition (hover dimming), so a
      // from() could read a mid-transition value as its end state.
      tl.fromTo(q("[data-gm='type']"), { autoAlpha: 0, x: -16 }, { autoAlpha: 1, x: 0, duration: 0.45, stagger: 0.07, clearProps: "opacity,visibility,transform" }, 0)
        .fromTo(q("[data-gm='route']"), { drawSVG: "0% 0%" }, { drawSVG: "0% 100%", duration: 0.7, stagger: 0.09, ease: "power2.inOut" }, 0.35)
        .fromTo(q("[data-gm='acct']"), { autoAlpha: 0, x: 16 }, { autoAlpha: 1, x: 0, duration: 0.45, stagger: 0.12, clearProps: "opacity,visibility,transform" }, 0.75)
        .from(q("[data-gm='audit']"), { autoAlpha: 0, y: 8, duration: 0.35, stagger: 0.1 }, 1.3);
      ScrollTrigger.create({ trigger: q("[data-gm-well]")[0], start: "top 75%", once: true, onEnter: () => void tl.play() });
    }, el);
    const stop = refreshWhenReady();
    return () => {
      stop();
      ctx.revert();
    };
  }, []);

  return (
    <section ref={root} className={s.section} aria-labelledby="glmap-heading">
      <div className={s.inner}>
        <div className={s.card} data-gm-card>
          <div className={s.text}>
            <p className={`${s.label} type-label`} data-gm-head>
              {glMap.label}
            </p>
            <h2 id="glmap-heading" className={`${s.heading} type-h3`} data-gm-head>
              {glMap.title}
            </h2>
            <p className={s.body} data-gm-head>
              {glMap.body}
            </p>
            <ul className={s.points} data-gm-head>
              {glMap.points.map((p) => (
                <li key={p.text}>
                  <span className={s.pIcon}>
                    <Glyph k={p.icon} />
                  </span>
                  {p.text}
                </li>
              ))}
            </ul>
            <ol className={s.audit} aria-label="Audit trail">
              {glMap.audit.map((a) => (
                <li key={a} data-gm="audit">
                  <i />
                  {a}
                </li>
              ))}
            </ol>
          </div>

          <div className={s.well} data-gm-well onPointerLeave={() => setHot(null)}>
            <div className={s.canvas} aria-hidden="true">
              <div className={s.colLabels}>
                <span className={s.mono} style={at(T.x, 6)}>
                  Deduction type
                </span>
                <span className={s.mono} style={at(A.x, 6)}>
                  GL account
                </span>
              </div>
              <svg className={s.wires} viewBox={`0 0 ${W} 400`} preserveAspectRatio="none">
                {glMap.types.map((t, i) => (
                  <path key={t.name} d={route(i, t.to)} className={`${s.route} ${lit(i) ? (hot ? s.routeHot : "") : s.dim}`} data-gm="route" />
                ))}
              </svg>
              {glMap.types.map((t, i) => (
                <span
                  key={t.name}
                  className={`${s.type} ${lit(i) ? "" : s.dim}`}
                  style={at(T.x, T.y0 + i * T.gap, T.w, T.h)}
                  data-gm="type"
                  onPointerEnter={() => setHot({ t: i })}
                >
                  <span className={`${s.dot} ${CAT[t.category]}`} />
                  {t.name}
                  <span className={s.port} />
                </span>
              ))}
              {glMap.accounts.map((a, j) => (
                <span
                  key={a.code}
                  className={`${s.acct} ${litA(j) ? (hot ? s.acctHot : "") : s.dim}`}
                  style={at(A.x, A.y0 + j * A.gap, A.w, A.h)}
                  data-gm="acct"
                  onPointerEnter={() => setHot({ a: j })}
                >
                  <b>{a.code}</b>
                  <span>{a.name}</span>
                  <em>{a.count}</em>
                </span>
              ))}
            </div>
            <p className={s.caption}>{ILLUSTRATIVE}</p>
          </div>
          <p className="sr-only">{glMap.summary}</p>
        </div>
      </div>
    </section>
  );
}
