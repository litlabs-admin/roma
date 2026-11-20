"use client";

import { useRef, type KeyboardEvent } from "react";
import { usePlanPick } from "./PlanPick";
import Reveal from "@/components/blog/Reveal";
import { MATRIX, PLANS, pricingCopy, type Cell } from "@/lib/content/pricing";
import s from "./pricing.module.css";

/**
 * What's included (DESIGN.md §G.18, brief §3.5): one table grouped by product, plan
 * headers stick under the nav; the picked plan's column is lit (red wash, red rule). Below 768px a plan switcher (ARIA tablist, arrow keys)
 * shows one plan's column at a time, so the table never scrolls sideways.
 */

const C = pricingCopy.matrix;

function Mark({ cell }: { cell: Cell }) {
  if (typeof cell === "string") return <span className={s.cellText}>{cell}</span>;
  return cell ? (
    <span className={s.yes}>
      <svg viewBox="0 0 16 16" aria-hidden="true">
        <path d="M3.5 8.5 6.5 11.5 12.5 5" />
      </svg>
      <span className="sr-only">{C.included}</span>
    </span>
  ) : (
    <span className={s.no}>
      <span aria-hidden="true">–</span>
      <span className="sr-only">{C.notIncluded}</span>
    </span>
  );
}

export default function FeatureMatrix() {
  // The picked plan (portal picker above) is the lit column, and the phone tab.
  const { pick, setPick } = usePlanPick();
  const plan = Math.max(0, PLANS.findIndex((p) => p.id === pick));
  const setPlan = (i: number) => setPick(PLANS[i].id);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  const onKey = (e: KeyboardEvent, i: number) => {
    const last = PLANS.length - 1;
    let next = -1;
    if (e.key === "ArrowRight") next = i === last ? 0 : i + 1;
    else if (e.key === "ArrowLeft") next = i === 0 ? last : i - 1;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = last;
    if (next < 0) return;
    e.preventDefault();
    setPlan(next);
    tabs.current[next]?.focus();
  };

  return (
    <Reveal as="section" className={`container-lg ${s.section}`} aria-labelledby="matrix-heading">
      <div className={s.head}>
        <p className={`${s.eyebrow} type-label`} data-reveal>
          <span className={s.dot} aria-hidden="true" />
          {C.label}
        </p>
        <h2 id="matrix-heading" className={`${s.title} type-h2`} data-reveal>
          {C.heading.before}
          <span className="accent">{C.heading.accent}</span>
          {C.heading.after}
        </h2>
        <p className={`${s.lead} type-lead`} data-reveal>
          {C.lead}
        </p>
      </div>

      {/* phones: pick the plan column */}
      <div className={s.matrixTabs} role="tablist" aria-label={C.planSwitch} data-reveal>
        {PLANS.map((p, i) => (
          <button
            key={p.id}
            ref={(n) => {
              tabs.current[i] = n;
            }}
            type="button"
            role="tab"
            id={`matrix-tab-${p.id}`}
            aria-selected={plan === i}
            aria-controls="matrix-table"
            tabIndex={plan === i ? 0 : -1}
            className={`${s.matrixTab} ${plan === i ? s.matrixTabOn : ""}`}
            onClick={() => setPlan(i)}
            onKeyDown={(e) => onKey(e, i)}
          >
            {p.name}
          </button>
        ))}
      </div>

      <div className={s.matrixWrap} data-reveal>
        <table id="matrix-table" className={s.matrix} data-col={plan} aria-labelledby="matrix-heading">
          <thead>
            <tr>
              <th scope="col" className={s.mFeatureHead}>
                {C.feature}
              </th>
              {PLANS.map((p, i) => (
                <th key={p.id} scope="col" className={`${s.mPlanHead} ${i === plan ? s.mOn : ""}`}>
                  <span className={s.mPlanName}>{p.name}</span>
                  <span className={s.mPlanPrice}>{p.price !== null ? `${p.from ? "From " : ""}$${p.price}/mo` : pricingCopy.plans.custom}</span>
                </th>
              ))}
            </tr>
          </thead>
          {MATRIX.map((g) => (
            <tbody key={g.title}>
              <tr className={s.mGroup}>
                <th scope="colgroup" colSpan={4}>
                  {g.href ? (
                    <a href={g.href} className={s.mGroupLink}>
                      {g.title}
                      <svg viewBox="0 0 16 16" aria-hidden="true">
                        <path d="M5 11 11 5M6 5h5v5" />
                      </svg>
                    </a>
                  ) : (
                    g.title
                  )}
                </th>
              </tr>
              {g.rows.map((r) => (
                <tr key={r.label} className={s.mRow}>
                  <th scope="row">{r.label}</th>
                  {r.cells.map((cell, i) => (
                    <td key={PLANS[i].id} className={i === plan ? s.mOn : undefined}>
                      <Mark cell={cell} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          ))}
        </table>
      </div>
    </Reveal>
  );
}
