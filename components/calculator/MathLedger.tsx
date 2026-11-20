"use client";

import { CONSTANTS, INPUTS, calcCopy } from "@/lib/content/calculator";
import { fmtHours, fmtMoney, fmtPayback, fmtRoi, type Inputs, type Outputs } from "@/lib/calculator/math";
import Reveal from "@/components/blog/Reveal";
import Num from "./Num";
import s from "./calculator.module.css";

/**
 * "How we calculate" (DESIGN.md §G.17): the brief's formulas as a ledger that follows the
 * inputs above. Lines the report gates show only their formula until the visitor unlocks
 * it, so no gated figure is ever in the DOM early (brief §2.6). The assumptions sit beside
 * it with where each comes from: Overdeduct's lesson, sources build trust (brief §2.13).
 */

const C = calcCopy.ledger;
const money = (v: number) => fmtMoney(v);
const moneyExact = (v: number) => fmtMoney(v, true);
const hours = (v: number) => fmtHours(v);
const roi = (v: number) => fmtRoi(v);
const payback = (v: number) => fmtPayback(v, calcCopy.breakdown.longPayback);

type Line = { sym: string; label: string; formula: string; v?: number; fmt?: (v: number) => string; gated?: boolean; total?: boolean; hide?: boolean };

export default function MathLedger({ inp, out, unlocked }: { inp: Inputs; out: Outputs; unlocked: boolean }) {
  const r = Math.round(CONSTANTS.r.value * 100);
  const t = Math.round(CONSTANTS.t.value * 100);
  const P = CONSTANTS.P.value;
  const noHours = inp.h === 0;

  const lines: Line[] = [
    { sym: "D", label: "Deductions per year", formula: "revenue × deduction rate", v: out.D, fmt: money },
    { sym: "I", label: "Invalid deductions", formula: "D × invalid share", v: out.I, fmt: money },
    { sym: "Now", label: "Recovered today", formula: "I × your recovery rate", v: out.recNow, fmt: money, gated: true },
    { sym: "Off", label: "Written off today", formula: "I − recovered today", v: out.writeOff, fmt: money, gated: true },
    { sym: "Roma", label: "Recovered with Roma", formula: `I × the higher of ${r}% or today’s rate`, v: out.recRoma, fmt: money, gated: true },
    { sym: "Gain", label: "Extra recovered", formula: "with Roma − today", v: out.gain, fmt: money, gated: true },
    { sym: "H", label: "Hours a year on deductions", formula: "hours a week × 52", v: out.hNow, fmt: hours, hide: noHours },
    { sym: "Saved", label: "Hours saved", formula: `H × ${t}%`, v: out.hSaved, fmt: hours, hide: noHours },
    { sym: "Time", label: "Value of time saved", formula: "hours saved × hourly cost", v: out.vTime, fmt: money, gated: true, hide: noHours },
    { sym: "Value", label: "Total value a year", formula: noHours ? "extra recovered" : "extra recovered + time value", v: out.value, fmt: money, total: true },
    { sym: "Cost", label: "Roma a year", formula: `$${P} × 12 months`, v: out.cost, fmt: moneyExact },
    { sym: "Net", label: "Net benefit", formula: "value − cost", v: out.net, fmt: money, gated: true },
    { sym: "ROI", label: "Return on Roma", formula: "net ÷ cost", v: out.roi, fmt: roi, gated: true },
    { sym: "Back", label: "Payback", formula: "cost ÷ monthly value", v: Number.isFinite(out.payback) ? out.payback : 99, fmt: payback, gated: true },
  ];

  const assumptions = [
    { k: "Recovery with Roma", v: `${r}%`, note: "Share of invalid deductions recovered once every one is checked" },
    { k: "Time saved", v: `${t}%`, note: "Roma customers get 90% of their deduction hours back" },
    { k: "Weeks a year", v: "52", note: "Hours are weekly, so the year is 52 of them" },
    { k: "Roma price", v: `$${P}/month`, note: "The Starter plan, the lowest published price", href: "/pricing" },
    { k: "Deduction rate", v: `${INPUTS.d.def}% default`, note: INPUTS.d.source },
    { k: "Invalid share", v: `${INPUTS.i.def}% default`, note: INPUTS.i.source },
  ];

  return (
    <Reveal as="section" className={s.ledgerSection} aria-labelledby="ledger-heading">
      <div className={s.ledgerHead}>
        <p className={`${s.eyebrow} type-label`} data-reveal>
          <span className={s.dot} aria-hidden="true" />
          {C.label}
        </p>
        <h2 id="ledger-heading" className={`${s.ledgerTitle} type-h3`} data-reveal>
          {C.heading.before}
          <span className="accent">{C.heading.accent}</span>
          {C.heading.after}
        </h2>
        <p className={`${s.ledgerLead} type-small`} data-reveal>
          {C.lead}
        </p>
        <div className={s.assumptions} data-reveal>
          <p className={`${s.assumptionsTitle} type-label`}>{C.assumptions}</p>
          <dl>
          {assumptions.map((a) => (
            <div key={a.k} className={s.assumption}>
              <dt>
                {a.k}
                {a.note && <span className={s.assumptionNote}>{a.note}</span>}
              </dt>
              <dd>{a.href ? <a href={a.href}>{a.v}</a> : a.v}</dd>
            </div>
          ))}
          </dl>
        </div>
      </div>

      <div className={s.ledger} data-reveal>
        <table className={s.ledgerTable}>
          <caption className="sr-only">{C.label}</caption>
          <thead>
            <tr>
              <th scope="col">Line</th>
              <th scope="col">Math</th>
              <th scope="col" className={s.num}>
                Amount
              </th>
            </tr>
          </thead>
          <tbody>
            {lines
              .filter((l) => !l.hide)
              .map((l) => {
                const locked = l.gated && !unlocked;
                return (
                  <tr key={l.sym} className={`${l.total ? s.lTotal : ""} ${locked ? s.lLocked : ""}`}>
                    <th scope="row">{l.label}</th>
                    <td className={s.lFormula}>{l.formula}</td>
                    <td className={s.num}>
                      {locked ? (
                        <span className={s.lockedTag}>
                          <svg viewBox="0 0 16 16" aria-hidden="true">
                            <rect x="3.5" y="7" width="9" height="6.5" rx="1.2" />
                            <path d="M5.5 7V5a2.5 2.5 0 0 1 5 0v2" />
                          </svg>
                          <a href="#calc-report">{C.locked}</a>
                        </span>
                      ) : (
                        <Num value={l.v ?? 0} format={l.fmt ?? money} />
                      )}
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
        <p className={s.disclaimer}>{calcCopy.results.disclaimer}</p>
      </div>
    </Reveal>
  );
}
