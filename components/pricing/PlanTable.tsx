"use client";

import { useRef, type CSSProperties, type KeyboardEvent } from "react";
import Button from "@/components/ui/Button";
import RollingNumber from "@/components/calculator/RollingNumber";
import { PLANS, PORTAL_OPTIONS, pricingCopy } from "@/lib/content/pricing";
import { track } from "@/lib/calculator/track";
import { usePlanPick } from "./PlanPick";
import s from "./pricing.module.css";

/**
 * Plans (DESIGN.md §G.18, brief §3.4, model B: tiers by portals connected).
 *
 * The plan that fits the visitor's portal count is the featured card: it sits on the home
 * Stories red (a radial, never flat dark red), taller than its neighbours, with white type
 * and a white CTA. ≥768px the red is one layer behind the grid that glides to the picked
 * column (600ms --ease-out) while the cards cross-fade their type, so the highlight hands
 * off rather than jumps. Below 768px the picked card carries the red itself. Prices roll
 * in as odometers. Picker: ARIA radiogroup, arrow keys, Home/End.
 */

const C = pricingCopy.plans;

export default function PlanTable() {
  const { pick, setPick } = usePlanPick();
  const radios = useRef<(HTMLButtonElement | null)[]>([]);
  const index = Math.max(0, PLANS.findIndex((p) => p.id === pick));
  const opt = Math.max(0, PORTAL_OPTIONS.findIndex((o) => o.plan === pick));

  const onKey = (e: KeyboardEvent, i: number) => {
    const last = PORTAL_OPTIONS.length - 1;
    let next = -1;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") next = i === last ? 0 : i + 1;
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp") next = i === 0 ? last : i - 1;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = last;
    if (next < 0) return;
    e.preventDefault();
    setPick(PORTAL_OPTIONS[next].plan);
    radios.current[next]?.focus();
  };

  return (
    <div className={s.plans}>
      <div className={s.picker} data-reveal>
        <p id="portal-picker" className={s.pickerLabel}>
          {C.picker}
        </p>
        <div className={s.segment} role="radiogroup" aria-labelledby="portal-picker">
          <span className={s.segThumb} aria-hidden="true" style={{ transform: `translateX(${opt * 100}%)` }} />
          {PORTAL_OPTIONS.map((o, i) => {
            const on = pick === o.plan;
            return (
              <button
                key={o.plan}
                ref={(n) => {
                  radios.current[i] = n;
                }}
                type="button"
                role="radio"
                aria-checked={on}
                tabIndex={on ? 0 : -1}
                className={`${s.segBtn} ${on ? s.segOn : ""}`}
                onClick={() => setPick(o.plan)}
                onKeyDown={(e) => onKey(e, i)}
              >
                {o.label}
                <span className="sr-only"> portals</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className={s.planStage} style={{ "--pick": index } as CSSProperties}>
        <span className={s.spot} aria-hidden="true" />
        <ul className={s.planGrid}>
          {PLANS.map((p) => {
            const on = pick === p.id;
            return (
              <li key={p.id} className={`${s.plan} ${on ? s.planOn : ""}`} data-reveal aria-current={on ? "true" : undefined}>
                <div className={s.planTop}>
                  <div className={s.planNameRow}>
                    <h3 className={s.planName}>{p.name}</h3>
                    <span className={s.fits} aria-hidden={!on}>
                      {C.fits}
                    </span>
                  </div>
                  <p className={s.bestFor}>{p.bestFor}</p>
                </div>

                <div className={s.price}>
                  {p.price !== null ? (
                    <>
                      {p.from && <span className={s.priceFrom}>{C.from}</span>}
                      <RollingNumber text={`$${p.price}`} className={s.priceFig} rollIn />
                      <span className={s.priceUnit}>{C.perMonth}</span>
                    </>
                  ) : (
                    <>
                      <span className={`${s.priceFig} ${s.priceCustom}`}>{C.custom}</span>
                      <span className={s.priceUnit}>{C.customSub}</span>
                    </>
                  )}
                </div>

                <Button
                  href={p.cta.href}
                  variant={on ? "inverse" : p.cta.kind === "demo" ? "primary" : "secondary"}
                  className={s.planCta}
                  onClick={() => track("pricing_plan_cta_click", { plan: p.id, cta: p.cta.kind })}
                >
                  {p.cta.label}
                  {p.cta.kind === "demo" ? " →" : ""}
                </Button>

                <dl className={s.planRows}>
                  {(
                    [
                      [C.rows.portals, p.portals],
                      [C.rows.users, p.users],
                      [C.rows.modules, p.modules],
                      [C.rows.support, p.support],
                    ] as const
                  ).map(([k, v]) => (
                    <div key={k} className={s.planRow}>
                      <dt>{k}</dt>
                      <dd>{v}</dd>
                    </div>
                  ))}
                </dl>
              </li>
            );
          })}
        </ul>
      </div>

      <p className={s.flat} data-reveal>
        <svg viewBox="0 0 16 16" aria-hidden="true">
          <path d="M3.5 8.5 6.5 11.5 12.5 5" />
        </svg>
        {C.flat}
      </p>
    </div>
  );
}
