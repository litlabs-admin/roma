"use client";

import { useMemo, useState } from "react";
import Reveal from "@/components/blog/Reveal";
import Button from "@/components/ui/Button";
import ArrowLink from "@/components/ui/ArrowLink";
import { INPUTS, calcCopy } from "@/lib/content/calculator";
import { ENTRY_PLAN, fmtPrice } from "@/lib/content/pricing";
import { DEFAULT_CONSTANTS, DEFAULT_INPUTS, compute, fmtMoney, fmtPayback, toParams, type Inputs } from "@/lib/calculator/math";
import Num from "./Num";

const money = (v: number) => fmtMoney(v);
import RangeField from "./RangeField";
import RollingNumber from "./RollingNumber";
import PaybackChart from "./PaybackChart";
import { useCalcTracking } from "./useCalcTracking";
import s from "./calculator.module.css";

/**
 * Compact calculator embed (brief §1.2): revenue, deduction rate and hours, one result,
 * one CTA that opens the full calculator with these values in the URL. The other inputs
 * use the calculator's defaults.
 *
 * - home / product: white card, result on the home Stories red (odometer figure).
 * - pricing: "Will Roma pay for itself?" as a full red band; inputs on a white card left,
 *   and on the right the figure, Roma's yearly price and the payback chart (the marker
 *   lands on the month Roma has paid for itself).
 */

const C = calcCopy.compact;

type Variant = "home" | "product" | "pricing";

const LEAD = "Three numbers from your business. See what deductions cost you each year, and what checking every one could bring back.";
const PRICING_LEAD = "Three numbers from your business. We’ll weigh what Roma could bring back against the price of the plan.";

export default function CalculatorCompact({ variant, id }: { variant: Variant; id?: string }) {
  const [inp, setInp] = useState<Inputs>(DEFAULT_INPUTS);
  const price = ENTRY_PLAN.price ?? DEFAULT_CONSTANTS.P;
  const out = useMemo(() => compute(inp, { ...DEFAULT_CONSTANTS, P: price }), [inp, price]);
  const { root, onInput, onCta } = useCalcTracking("compact");
  const pricing = variant === "pricing";
  const prefix = `cc-${variant}`;
  const titleId = `${prefix}-title`;
  const href = `/calculator?${toParams(inp).toString()}`;
  const payback = fmtPayback(out.payback, calcCopy.breakdown.longPayback);

  const update = (key: "R" | "d" | "h", v: number) => {
    setInp((p) => {
      const next = { ...p, [key]: v };
      onInput(key, compute(next).value);
      return next;
    });
  };

  const inputs = (
    <div className={s.compactInputs}>
      <RangeField spec={INPUTS.R} value={inp.R} onChange={(v) => update("R", v)} idPrefix={prefix} label="Annual revenue through retailers" compact />
      <RangeField spec={INPUTS.d} value={inp.d} onChange={(v) => update("d", v)} idPrefix={prefix} label="Share lost to deductions" compact note={inp.d > 15 ? calcCopy.notes.highD : undefined} />
      <RangeField spec={INPUTS.h} value={inp.h} onChange={(v) => update("h", v)} idPrefix={prefix} label="Hours a week on deductions" unitAfter="hrs" compact />
    </div>
  );

  if (pricing) {
    return (
      <Reveal as="section" id={id} className={`container-xl ${s.bandSection}`} aria-labelledby={titleId}>
        <div ref={root} className={s.band} data-reveal>
          <div className={s.bandMain}>
            <p className={`${s.bandEyebrow} type-label`}>
              <span className={s.dot} aria-hidden="true" />
              Return on Roma
            </p>
            <h2 id={titleId} className={`${s.bandTitle} type-h2`}>
              {C.pricingHeading}
            </h2>
            <p className={`${s.bandLead} type-lead`}>{PRICING_LEAD}</p>
            <div className={s.bandInputs}>{inputs}</div>
          </div>

          <div className={s.bandResult}>
            <div className={s.bandFigureRow}>
              <div>
                <p className={s.compactKicker}>{C.result}</p>
                <p className={s.bandFigure}>
                  <RollingNumber text={fmtMoney(out.value)} rollIn />
                </p>
                <p className={s.compactTail}>{C.resultTail}</p>
              </div>
              <div className={s.bandPayback}>
                <span>{C.payback}</span>
                <strong>{payback}</strong>
              </div>
            </div>
            <PaybackChart
              value={out.value}
              cost={out.cost}
              costLabel={`${ENTRY_PLAN.name}, a year`}
              label={`Payback: ${payback}. Roma costs ${fmtMoney(out.cost, true)} a year; estimated value ${fmtMoney(out.value)} a year.`}
            />
            <p className={s.compactNote}>{C.paybackTail(ENTRY_PLAN.name, fmtPrice(price))}</p>
            <div className={s.compactActions}>
              <Button href={href} onClick={() => onCta("see_full_breakdown")}>
                {C.cta}
              </Button>
              <ArrowLink href="/calculator" arrow="up-right" className={s.compactLink}>
                {C.estimate}
              </ArrowLink>
            </div>
            <p className={s.compactDisclaimer}>{calcCopy.results.disclaimer}</p>
          </div>
        </div>
      </Reveal>
    );
  }

  return (
    <Reveal as="section" id={id} className={`container-lg ${s.compactSection}`} aria-labelledby={titleId}>
      <div ref={root} className={s.compact} data-reveal>
        <div className={s.compactMain}>
          <p className={`${s.eyebrow} type-label`}>
            <span className={s.dot} aria-hidden="true" />
            {C.label}
          </p>
          <h2 id={titleId} className={`${s.compactTitle} type-h3`}>
            {C.heading}
          </h2>
          <p className={`${s.compactLead} type-small`}>{LEAD}</p>
          {inputs}
        </div>

        <div className={s.compactResult}>
          <div>
            <p className={s.compactKickerOnRed}>{C.result}</p>
            <p className={s.compactFigure}>
              <RollingNumber text={fmtMoney(out.value)} rollIn />
            </p>
            <p className={s.compactKickerOnRed}>{C.resultTail}</p>
          </div>
          <dl className={`${s.figures} ${s.compactFigures}`}>
            <div className={s.figure}>
              <dt>{calcCopy.results.deductions}</dt>
              <dd>
                <Num value={out.D} format={money} />
              </dd>
            </div>
            <div className={s.figure}>
              <dt>{calcCopy.results.invalid}</dt>
              <dd>
                <Num value={out.I} format={money} className={s.figureChip} />
              </dd>
            </div>
          </dl>
          <div className={s.compactActions}>
            <Button href={href} variant="inverse" onClick={() => onCta("see_full_breakdown")}>
              {C.cta}
            </Button>
          </div>
          <p className={s.compactDisclaimerOnRed}>{calcCopy.results.disclaimer}</p>
        </div>
      </div>
    </Reveal>
  );
}
