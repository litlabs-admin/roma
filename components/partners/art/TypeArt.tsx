"use client";

import { typeArt, type PartnerTypeKey } from "@/lib/content/partners";
import { Glyph, RomaGlyph } from "@/components/platform/mock/kit";
import { usePlayOnce } from "./usePlayOnce";
import s from "./typeArt.module.css";

/**
 * One illustration per partner type, on top of each opportunity card (DESIGN.md §G.16).
 * Each plays one state change once in view; SSR = finished state; decorative.
 *  accounting: deduction lines get GL codes and the slip is stamped Booked.
 *  technology: portals route through Roma into the partner's product.
 *  investor:   portfolio brands switch on one by one.
 */

function Accounting() {
  const a = typeArt.accounting;
  const root = usePlayOnce((q, tl) => {
    tl.fromTo(q("[data-ta='slip']"), { autoAlpha: 0, y: 14, rotate: -4 }, { autoAlpha: 1, y: 0, rotate: -2, duration: 0.6 })
      .fromTo(q("[data-ta='line']"), { autoAlpha: 0, x: -8 }, { autoAlpha: 1, x: 0, duration: 0.4, stagger: 0.12 }, 0.2)
      .fromTo(q("[data-ta='gl']"), { clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0% 0 0)", duration: 0.45, stagger: 0.18, ease: "power2.out" }, 0.55)
      .fromTo(q("[data-ta='stamp']"), { autoAlpha: 0, scale: 1.4 }, { autoAlpha: 1, scale: 1, duration: 0.35, ease: "back.out(2)" }, 1.2);
  });
  return (
    <div ref={root} className={s.stage}>
      <div className={s.slip} data-ta="slip">
        <p className={s.slipHead}>
          <span>{a.source}</span>
          <span className={s.slipDots} />
        </p>
        <ul className={s.lines}>
          {a.lines.map((l) => (
            <li key={l.label} className={s.line} data-ta="line">
              <span className={s.lineLabel}>{l.label}</span>
              <Glyph k="arrow" className={s.lineArrow} />
              <span className={s.gl} data-ta="gl">
                {l.gl}
              </span>
            </li>
          ))}
        </ul>
        <span className={s.stamp} data-ta="stamp">
          {a.status}
        </span>
      </div>
    </div>
  );
}

// Technology: an SVG routing diagram (viewBox units). Portals → Roma → your product.
const PORTAL_Y = [44, 104, 164];
const BADGE = { x: 160, y: 84, s: 40 };
const CARD = { x: 236, y: 50, w: 118, h: 120 };

function Technology() {
  const t = typeArt.technology;
  const root = usePlayOnce((q, tl) => {
    tl.fromTo(q("[data-ta='portal']"), { autoAlpha: 0, x: -10 }, { autoAlpha: 1, x: 0, duration: 0.4, stagger: 0.1 })
      .fromTo(q("[data-ta='route']"), { drawSVG: "0%" }, { drawSVG: "100%", duration: 0.6, stagger: 0.12, ease: "power2.inOut" }, 0.25)
      .fromTo(q("[data-ta='badge']"), { autoAlpha: 0, scale: 0.6, transformOrigin: "50% 50%" }, { autoAlpha: 1, scale: 1, duration: 0.35, ease: "back.out(2)" }, 0.65)
      .fromTo(q("[data-ta='out']"), { drawSVG: "0%" }, { drawSVG: "100%", duration: 0.4, ease: "power2.inOut" }, 0.95)
      .fromTo(q("[data-ta='card']"), { autoAlpha: 0, x: 10 }, { autoAlpha: 1, x: 0, duration: 0.45 }, 1.1)
      .fromTo(q("[data-ta='row']"), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3, stagger: 0.12 }, 1.3);
  });
  const bx = BADGE.x;
  const by = BADGE.y + BADGE.s / 2;
  return (
    <div ref={root} className={s.stage}>
      <svg className={s.diagram} viewBox="0 0 360 220" fill="none">
        {PORTAL_Y.map((y) => (
          <path key={y} d={`M92 ${y + 14} C 128 ${y + 14}, 124 ${by}, ${bx} ${by}`} className={s.route} data-ta="route" />
        ))}
        <path d={`M${bx + BADGE.s} ${by} L ${CARD.x} ${by}`} className={s.route} data-ta="out" />
        {t.portals.map((p, i) => (
          <g key={p} data-ta="portal">
            <rect x="12" y={PORTAL_Y[i]} width="80" height="28" rx="14" className={s.portal} />
            <text x="52" y={PORTAL_Y[i] + 18.5} textAnchor="middle" className={s.portalText}>
              {p}
            </text>
          </g>
        ))}
        <g data-ta="badge">
          <rect x={BADGE.x} y={BADGE.y} width={BADGE.s} height={BADGE.s} rx="10" className={s.badge} />
          <svg x={BADGE.x + 10} y={BADGE.y + 10} width="20" height="20" overflow="visible">
            <RomaGlyph className={s.badgeGlyph} />
          </svg>
        </g>
        <g data-ta="card">
          <rect x={CARD.x} y={CARD.y} width={CARD.w} height={CARD.h} rx="12" className={s.card} />
          <rect x={CARD.x + 12} y={CARD.y + 14} width="16" height="16" rx="4" className={s.cardMark} />
          <text x={CARD.x + 36} y={CARD.y + 26.5} className={s.cardTitle}>
            {t.tool}
          </text>
          <line x1={CARD.x} x2={CARD.x + CARD.w} y1={CARD.y + 42} y2={CARD.y + 42} className={s.cardRule} />
          {t.out.map((o, i) => (
            <g key={o} data-ta="row">
              <circle cx={CARD.x + 18} cy={CARD.y + 64 + i * 30} r="4" className={s.okDot} />
              <text x={CARD.x + 30} y={CARD.y + 68 + i * 30} className={s.cardRow}>
                {o}
              </text>
            </g>
          ))}
        </g>
      </svg>
    </div>
  );
}

function Investor() {
  const v = typeArt.investor;
  const root = usePlayOnce((q, tl) => {
    tl.fromTo(q("[data-ta='tile']"), { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.4, stagger: 0.05 })
      .fromTo(q("[data-ta='on']"), { scale: 0 }, { scale: 1, duration: 0.3, stagger: 0.1, ease: "back.out(2)" }, 0.5)
      .fromTo(q("[data-ta='perk']"), { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.5 }, 0.9);
  });
  return (
    <div ref={root} className={s.stage}>
      <div className={s.portfolio}>
        <p className={s.portfolioHead}>{v.fund}</p>
        <div className={s.tiles}>
          {v.brands.map((b, i) => {
            const on = v.active.includes(i);
            return (
              <span key={i} className={`${s.tile} ${on ? s.tileOn : ""}`} data-ta="tile">
                <span className={s.tileAvatar}>{b}</span>
                {on && (
                  <span className={s.tileCheck} data-ta="on">
                    <Glyph k="check" />
                  </span>
                )}
              </span>
            );
          })}
        </div>
        <div className={s.perk} data-ta="perk">
          <span className={s.perkMark}>
            <RomaGlyph className={s.perkGlyph} />
          </span>
          <span className={s.perkText}>
            <b>{v.perk}</b>
            <span>
              {v.active.length} of {v.brands.length} brands live
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}

export default function TypeArt({ k }: { k: PartnerTypeKey }) {
  if (k === "accounting") return <Accounting />;
  if (k === "technology") return <Technology />;
  return <Investor />;
}
