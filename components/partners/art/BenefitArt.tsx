"use client";

import type { CSSProperties } from "react";
import { at, Glyph, RomaGlyph } from "@/components/platform/mock/kit";
import { benefitArt as B } from "@/lib/content/partners";
import { usePlayOnce } from "./usePlayOnce";
import a from "./art.module.css";
import s from "./benefit.module.css";

/**
 * Why-partner illustrations (DESIGN.md §G.16), one per benefit, on a 320 × 180 canvas.
 * Each plays one state change once in view; SSR = finished state; decorative.
 *  0 · Expand what you offer: a firm's services list gains "Deduction recovery", live in
 *      5 minutes (PDF).
 *  1 · Reach a growing market: retailer portals route through Roma to brands; "25 brands
 *      pay for Roma" (PDF).
 *  2 · Create recurring revenue: a partner statement whose monthly bars keep coming.
 */

const W = 320;
const H = 180;
const canvas = { "--w": W } as CSSProperties;

function Offer() {
  const root = usePlayOnce((q, tl) => {
    tl.fromTo(q("[data-ba='paper']"), { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.6 })
      .fromTo(q("[data-ba='row']"), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3, stagger: 0.08 }, 0.2)
      .fromTo(q("[data-ba='new']"), { autoAlpha: 0, y: -10, scale: 0.96 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.5, ease: "back.out(1.6)" }, 0.75)
      .fromTo(q("[data-ba='newTick']"), { scale: 0 }, { scale: 1, duration: 0.3, ease: "back.out(2.5)" }, 1.15)
      .fromTo(q("[data-ba='live']"), { autoAlpha: 0, x: 8 }, { autoAlpha: 1, x: 0, duration: 0.35 }, 1.3);
  });
  return (
    <div ref={root} className={a.canvas} style={canvas}>
      <div className={`${a.paper} ${s.list}`} style={at(34, 20, 252, 176)} data-ba="paper">
        <span className={a.mono}>{B.offer.title}</span>
        {B.offer.rows.map((r) => (
          <span key={r} className={s.row} data-ba="row">
            <span className={s.tick}>
              <Glyph k="check" />
            </span>
            {r}
          </span>
        ))}
        <span className={`${s.row} ${s.rowNew}`} data-ba="new">
          <span className={`${s.tick} ${s.tickRed}`} data-ba="newTick">
            <Glyph k="plus" />
          </span>
          {B.offer.added}
          <span className={`${a.pill} ${a.ok} ${s.newPill}`} data-ba="live">
            <Glyph k="history" />
            {B.offer.live}
          </span>
        </span>
      </div>
    </div>
  );
}

// Market: portals (top) → Roma (middle) → brands (bottom).
const PORTAL_X = [34, 104, 174, 244];
const BRAND_X = [26, 72, 118, 164, 210, 256];
const BADGE = { x: 144, y: 58, s: 32 };
const BRAND_Y = 110;
const BRAND_S = 32;

function Market() {
  const root = usePlayOnce((q, tl) => {
    tl.fromTo(q("[data-ba='portal']"), { autoAlpha: 0, y: -8 }, { autoAlpha: 1, y: 0, duration: 0.4, stagger: 0.07 })
      .fromTo(q("[data-ba='in']"), { drawSVG: "0%" }, { drawSVG: "100%", duration: 0.5, stagger: 0.06, ease: "power2.inOut" }, 0.25)
      .fromTo(q("[data-ba='badge']"), { autoAlpha: 0, scale: 0.6 }, { autoAlpha: 1, scale: 1, duration: 0.35, ease: "back.out(2)" }, 0.6)
      .fromTo(q("[data-ba='out']"), { drawSVG: "0%" }, { drawSVG: "100%", duration: 0.5, stagger: 0.05, ease: "power2.inOut" }, 0.85)
      .fromTo(q("[data-ba='brand']"), { autoAlpha: 0, scale: 0.6 }, { autoAlpha: 1, scale: 1, duration: 0.3, stagger: 0.06, ease: "back.out(2)" }, 1.1)
      .fromTo(q("[data-ba='count']"), { autoAlpha: 0, y: 6 }, { autoAlpha: 1, y: 0, duration: 0.4 }, 1.5);
  });
  const bx = BADGE.x + BADGE.s / 2;
  return (
    <div ref={root} className={a.canvas} style={canvas}>
      <svg className={s.svg} viewBox={`0 0 ${W} ${H}`} aria-hidden="true">
        {PORTAL_X.map((x) => (
          <path key={x} d={`M${x + 21} 36 C ${x + 21} 52, ${bx} 44, ${bx} ${BADGE.y}`} className={a.line} data-ba="in" />
        ))}
        {BRAND_X.map((x) => (
          <path key={x} d={`M${bx} ${BADGE.y + BADGE.s} C ${bx} ${BADGE.y + BADGE.s + 14}, ${x + 19} ${BRAND_Y - 14}, ${x + 19} ${BRAND_Y}`} className={`${a.line} ${a.lineSoft}`} data-ba="out" />
        ))}
      </svg>
      {B.market.portals.map((p, i) => (
        <span key={p} className={`${a.pill} ${a.source} ${s.portal}`} style={at(PORTAL_X[i], 14, 42, 22)} data-ba="portal">
          {p}
        </span>
      ))}
      <span className={a.badge} style={at(BADGE.x, BADGE.y, BADGE.s, BADGE.s)} data-ba="badge">
        <RomaGlyph />
      </span>
      {BRAND_X.map((x, i) => (
        <span key={x} className={`${a.av} ${s.brand}`} style={at(x + 19 - BRAND_S / 2, BRAND_Y, BRAND_S, BRAND_S)} data-ba="brand">
          {B.market.brands[i]}
        </span>
      ))}
      <span className={`${a.mono} ${s.count}`} style={at(0, 154, W)} data-ba="count">
        {B.market.count}
      </span>
    </div>
  );
}

function Revenue() {
  const max = Math.max(...B.revenue.bars);
  const root = usePlayOnce((q, tl) => {
    tl.fromTo(q("[data-ba='paper']"), { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.6 })
      .fromTo(q("[data-ba='bar']"), { scaleY: 0 }, { scaleY: 1, duration: 0.5, stagger: 0.1, ease: "power2.out" }, 0.3)
      .fromTo(q("[data-ba='chip']"), { autoAlpha: 0, scale: 0.8 }, { autoAlpha: 1, scale: 1, duration: 0.35, ease: "back.out(2)" }, 1.0);
  });
  return (
    <div ref={root} className={a.canvas} style={canvas}>
      <div className={`${a.paper} ${s.statement}`} style={at(46, 20, 228, 180)} data-ba="paper">
        <span className={s.stHead}>
          <span className={a.mono}>{B.revenue.title}</span>
          <span className={`${a.pill} ${a.ok}`} data-ba="chip">
            <Glyph k="history" />
            {B.revenue.chip}
          </span>
        </span>
        <span className={s.bars}>
          {B.revenue.bars.map((v, i) => (
            <span key={i} className={s.barCol}>
              <span className={`${s.bar} ${i === B.revenue.bars.length - 1 ? s.barNow : ""}`} style={{ height: `${(v / max) * 100}%` }} data-ba="bar" />
              <span className={s.month}>{B.revenue.months[i]}</span>
            </span>
          ))}
        </span>
      </div>
    </div>
  );
}

const ART = [Offer, Market, Revenue];

export default function BenefitArt({ i }: { i: number }) {
  const Art = ART[i];
  return (
    <div className={`${a.well} ${s.well}`} style={{ aspectRatio: `${W} / ${H}` }} aria-hidden="true">
      <Art />
    </div>
  );
}
