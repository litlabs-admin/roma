"use client";

import type { ReactNode, Ref } from "react";
import { calcCopy } from "@/lib/content/calculator";
import { fmtMoney, type Inputs, type Outputs } from "@/lib/calculator/math";
import RevenueSplit from "./RevenueSplit";
import RollingNumber from "./RollingNumber";
import s from "./calculator.module.css";

/**
 * The reveal under the revenue question (DESIGN.md §G.17), shared by /calculator and the
 * compact embeds: label, the invalid figure as an odometer, "Where your revenue goes",
 * then whatever the host adds (fine-tune, CTAs, disclaimer). Children rise in on a stagger.
 *
 * tone "red": the home Stories red surface (default). tone "light": cream, for hosts that
 * already sit on red (the pricing band).
 */
export default function ResultsPane({
  inp,
  out,
  idPrefix,
  tone = "red",
  paneRef,
  headlineRef,
  children,
}: {
  inp: Inputs;
  out: Outputs;
  idPrefix: string;
  tone?: "red" | "light";
  paneRef?: Ref<HTMLElement>;
  headlineRef?: Ref<HTMLParagraphElement>;
  children?: ReactNode;
}) {
  const labelId = `${idPrefix}-results-label`;
  return (
    <section ref={paneRef} id={`${idPrefix}-results`} className={`${s.results} ${tone === "light" ? s.resultsLight : ""}`} aria-labelledby={labelId}>
      <div className={`${s.resultsInner} ${s.stagger}`}>
        <p id={labelId} className={`${s.resultsLabel} type-label`}>
          <span className={s.dot} aria-hidden="true" />
          {calcCopy.results.label}
        </p>
        <p ref={headlineRef} className={s.headline}>
          <RollingNumber text={fmtMoney(out.invalid)} className={s.headlineFigure} rollIn />
          <span className={s.headlineSmall}>{calcCopy.results.headlineAfter}</span>
        </p>
        <RevenueSplit inp={inp} out={out} />
        {children}
      </div>
    </section>
  );
}
