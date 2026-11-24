"use client";

import { useMemo, useState } from "react";
import Reveal from "@/components/blog/Reveal";
import Button from "@/components/ui/Button";
import { calcCopy, type InputKey } from "@/lib/content/calculator";
import { DEFAULT_INPUTS, compute, fmtMoney, toParams, type Inputs } from "@/lib/calculator/math";
import Num from "./Num";
import RevenueHero from "./RevenueHero";
import RollingNumber from "./RollingNumber";
import { useCalcTracking } from "./useCalcTracking";
import s from "./calculator.module.css";

/**
 * Compact calculator embed: revenue only (quick-pick chips + typed field), the figure
 * updates live, and one CTA opens /calculator on its reveal with ?R= in the URL. The rates
 * stay at their defaults here; visitors fine-tune them on the full calculator.
 *
 * - home / product: white card, result on the home Stories red (odometer figure).
 * - pricing: a full red band; inputs left, results on a white card right.
 */

const C = calcCopy.compact;
const money = (v: number) => fmtMoney(v);

type Variant = "home" | "product" | "pricing";

export default function CalculatorCompact({ variant, id }: { variant: Variant; id?: string }) {
  const [inp, setInp] = useState<Inputs>(DEFAULT_INPUTS);
  const out = useMemo(() => compute(inp), [inp]);
  const { root, onInput, onCta } = useCalcTracking("compact");
  const pricing = variant === "pricing";
  const prefix = `cc-${variant}`;
  const titleId = `${prefix}-title`;
  const href = `/calculator?${toParams(inp).toString()}`;

  const update = (key: InputKey, v: number) => {
    setInp((p) => {
      const next = { ...p, [key]: v };
      onInput(key, compute(next).invalid);
      return next;
    });
  };

  const inputs = (
    <div className={s.compactInputs}>
      <RevenueHero mode="embed" value={inp.R} onChange={(v) => update("R", v)} idPrefix={prefix} />
    </div>
  );

  const figures = (extra?: string) => (
    <dl className={`${s.figures} ${extra ?? ""}`}>
      <div className={s.figure}>
        <dt>{calcCopy.results.valid}</dt>
        <dd>
          <Num value={out.valid} format={money} />
        </dd>
      </div>
      <div className={s.figure}>
        <dt>{calcCopy.results.total}</dt>
        <dd>
          <Num value={out.total} format={money} />
        </dd>
      </div>
    </dl>
  );

  if (pricing) {
    return (
      <Reveal as="section" id={id} className={`container-xl ${s.bandSection}`} aria-labelledby={titleId}>
        <div ref={root} className={s.band} data-reveal>
          <div className={s.bandMain}>
            <p className={`${s.bandEyebrow} type-label`}>
              <span className={s.dot} aria-hidden="true" />
              {C.label}
            </p>
            <h2 id={titleId} className={`${s.bandTitle} type-h2`}>
              {C.heading}
            </h2>
            <p className={`${s.bandLead} type-lead`}>{C.lead}</p>
            <div className={s.bandInputs}>{inputs}</div>
          </div>

          <div className={s.bandResult}>
            <div>
              <p className={s.bandFigure}>
                <RollingNumber text={fmtMoney(out.invalid)} rollIn />
              </p>
              <p className={s.compactTail}>{C.resultTail}</p>
            </div>
            {figures(s.bandFigures)}
            <div className={s.compactActions}>
              <Button href={href} onClick={() => onCta("open_calculator")}>
                {C.cta}
              </Button>
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
          <p className={`${s.compactLead} type-small`}>{C.lead}</p>
          {inputs}
        </div>

        <div className={s.compactResult}>
          <div>
            <p className={s.compactFigure}>
              <RollingNumber text={fmtMoney(out.invalid)} rollIn />
            </p>
            <p className={s.compactKickerOnRed}>{C.resultTail}</p>
          </div>
          {figures(s.compactFigures)}
          <div className={s.compactActions}>
            <Button href={href} variant="inverse" onClick={() => onCta("open_calculator")}>
              {C.cta}
            </Button>
          </div>
          <p className={s.compactDisclaimerOnRed}>{calcCopy.results.disclaimer}</p>
        </div>
      </div>
    </Reveal>
  );
}
