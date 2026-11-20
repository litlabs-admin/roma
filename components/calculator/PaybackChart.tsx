"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/motion";
import { fmtMoneyShort } from "@/lib/calculator/math";
import s from "./payback.module.css";

/**
 * Payback chart (DESIGN.md §G.17/§G.18): Roma's cost for the year as a flat dashed line,
 * the money coming back as a line climbing month by month, and a red marker where they
 * cross: the payback month. On enter the value line draws and the marker drops; when the
 * inputs change, every shape tweens to its new place (attr tweens, 450ms). Shape follows
 * the calculator's own math (value accrues evenly over 12 months).
 */

const W = 320;
const H = 168;
const PAD = { l: 8, r: 8, t: 18, b: 26 };
const IW = W - PAD.l - PAD.r;
const IH = H - PAD.t - PAD.b;
const MONTHS = [0, 3, 6, 9, 12];

type Geo = { vx: number; vy: number; cy: number; mx: number; area: string; cross: boolean };

function geometry(value: number, cost: number): Geo {
  const max = Math.max(value, cost, 1) * 1.12;
  const y = (v: number) => PAD.t + IH - (v / max) * IH;
  const x = (m: number) => PAD.l + (m / 12) * IW;
  const pay = value > 0 ? cost / (value / 12) : Infinity;
  const cross = Number.isFinite(pay) && pay <= 12;
  const vx = x(12);
  const vy = y(value);
  const base = PAD.t + IH;
  return { vx, vy, cy: y(cost), mx: cross ? x(pay) : x(12), area: `${PAD.l},${base} ${vx},${vy} ${vx},${base}`, cross };
}

export default function PaybackChart({ value, cost, label, costLabel }: { value: number; cost: number; label: string; costLabel: string }) {
  const root = useRef<SVGSVGElement>(null);
  const prev = useRef<Geo | null>(null);
  const g = geometry(value, cost);

  // Entrance: line draws, area fades, marker drops (once, on enter).
  useLayoutEffect(() => {
    const el = root.current;
    if (!el || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(el);
      const tl = gsap.timeline({ paused: true, defaults: { ease: "power3.out" } });
      tl.fromTo(q("[data-pc='value']"), { drawSVG: "0% 0%" }, { drawSVG: "0% 100%", duration: 1.1, ease: "power2.inOut" }, 0)
        .from(q("[data-pc='area']"), { autoAlpha: 0, duration: 0.8 }, 0.4)
        .from(q("[data-pc='cost']"), { autoAlpha: 0, duration: 0.5 }, 0)
        .from(q("[data-pc='drop']"), { scaleY: 0, transformOrigin: "50% 100%", duration: 0.45 }, 0.9)
        .from(q("[data-pc='mark']"), { autoAlpha: 0, scale: 0, transformOrigin: "50% 50%", duration: 0.45, ease: "back.out(2.5)" }, 1);
      ScrollTrigger.create({ trigger: el, start: "top 85%", once: true, onEnter: () => void tl.play() });
    }, el);
    return () => ctx.revert();
  }, []);

  // Updates: tween from the previous geometry to the new one.
  useLayoutEffect(() => {
    const el = root.current;
    const p = prev.current;
    prev.current = g;
    if (!el || !p || prefersReducedMotion()) return;
    const q = gsap.utils.selector(el);
    const d = { duration: 0.45, ease: "power3.out", overwrite: "auto" as const };
    gsap.fromTo(q("[data-pc='value']"), { attr: { x2: p.vx, y2: p.vy } }, { attr: { x2: g.vx, y2: g.vy }, ...d });
    gsap.fromTo(q("[data-pc='area']"), { attr: { points: p.area } }, { attr: { points: g.area }, ...d });
    gsap.fromTo(q("[data-pc='cost']"), { attr: { y1: p.cy, y2: p.cy } }, { attr: { y1: g.cy, y2: g.cy }, ...d });
    gsap.fromTo(q("[data-pc='mark']"), { attr: { cx: p.mx, cy: p.cy } }, { attr: { cx: g.mx, cy: g.cy }, ...d });
    gsap.fromTo(q("[data-pc='drop']"), { attr: { x1: p.mx, x2: p.mx, y1: p.cy } }, { attr: { x1: g.mx, x2: g.mx, y1: g.cy }, ...d });
  });

  const base = PAD.t + IH;
  return (
    <figure className={s.chart}>
      <svg ref={root} viewBox={`0 0 ${W} ${H}`} className={s.svg} role="img" aria-label={label}>
        {/* month grid */}
        {MONTHS.map((m) => {
          const x = PAD.l + (m / 12) * IW;
          return (
            <g key={m}>
              <line x1={x} x2={x} y1={PAD.t} y2={base} className={s.grid} />
              <text x={x} y={H - 8} className={s.tick} textAnchor={m === 0 ? "start" : m === 12 ? "end" : "middle"}>
                {m === 0 ? "Month 0" : m === 12 ? "12" : m}
              </text>
            </g>
          );
        })}
        <line x1={PAD.l} x2={W - PAD.r} y1={base} y2={base} className={s.axis} />
        <polygon points={g.area} className={s.area} data-pc="area" />
        <line x1={PAD.l} x2={W - PAD.r} y1={g.cy} y2={g.cy} className={s.cost} data-pc="cost" />
        <line x1={PAD.l} y1={base} x2={g.vx} y2={g.vy} className={s.value} data-pc="value" />
        {/* hidden (not removed) past 12 months, so the shapes keep tweening */}
        <g className={`${s.marker} ${g.cross ? "" : s.hidden}`}>
          <line x1={g.mx} x2={g.mx} y1={g.cy} y2={base} className={s.drop} data-pc="drop" />
          <circle cx={g.mx} cy={g.cy} r={6} className={s.mark} data-pc="mark" />
        </g>
      </svg>
      <figcaption className={s.legend}>
        <span className={s.keyValue}>Money back, month by month</span>
        <span className={s.keyCost}>
          {costLabel} {fmtMoneyShort(cost)}
        </span>
      </figcaption>
    </figure>
  );
}
