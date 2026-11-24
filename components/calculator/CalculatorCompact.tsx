"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Reveal from "@/components/blog/Reveal";
import Button from "@/components/ui/Button";
import { scrollToTarget } from "@/components/motion/SmoothScroll";
import { calcCopy } from "@/lib/content/calculator";
import { DEFAULT_INPUTS, compute, toParams, valueBand, type Inputs } from "@/lib/calculator/math";
import { track } from "@/lib/calculator/track";
import ResultsPane from "./ResultsPane";
import RevenueHero from "./RevenueHero";
import { useCalcTracking } from "./useCalcTracking";
import s from "./calculator.module.css";

/**
 * Compact calculator embed (DESIGN.md §G.17): the same revenue-first flow as /calculator.
 * The section's own heading sits above the revenue question; Calculate (Enter, or a chip)
 * reveals the invalid figure and "Where your revenue goes" below it, and the revenue stays
 * editable. Rates stay at their defaults here; "See the full breakdown" opens /calculator
 * on its reveal (?R=&v=&i=), where they can be fine-tuned.
 *
 * - home / product: the card on the page sheet, results on the home Stories red.
 * - pricing: the card centred on a full red band, results on cream.
 */

const C = calcCopy.compact;

type Variant = "home" | "product" | "pricing";

export default function CalculatorCompact({ variant, id }: { variant: Variant; id?: string }) {
  const [inp, setInp] = useState<Inputs>(DEFAULT_INPUTS);
  const [revealed, setRevealed] = useState(false);
  const [entered, setEntered] = useState(false);
  const out = useMemo(() => compute(inp), [inp]);
  const { root, onInput, onCta } = useCalcTracking("compact");
  const resultsRef = useRef<HTMLElement>(null);
  const pricing = variant === "pricing";
  const prefix = `cc-${variant}`;
  const titleId = `${prefix}-title`;
  const href = `/calculator?${toParams(inp).toString()}`;
  const demoHref = `${calcCopy.ctas.demo.href}?src=calculator&rev=${Math.round(inp.R)}`;

  // The reveal: track it, and bring the results into view if they opened below the fold.
  useEffect(() => {
    if (!revealed) return;
    const invalid = compute(inp).invalid;
    track("calculator_submit", {
      value_band: valueBand(invalid),
      source: "embed",
    });
    onInput("R", invalid);
    const raf = requestAnimationFrame(() => {
      const el = resultsRef.current;
      if (el && el.getBoundingClientRect().top > window.innerHeight * 0.6) scrollToTarget(el);
    });
    return () => cancelAnimationFrame(raf);
    // once per reveal; later edits are tracked by setRevenue()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [revealed]);

  const setRevenue = (v: number) => {
    setEntered(true);
    setInp((p) => {
      const next = { ...p, R: v };
      if (revealed) onInput("R", compute(next).invalid);
      return next;
    });
  };

  const card = (
    <div ref={root} className={`${s.card} ${s.flowCard} ${revealed ? s.flowCardDone : ""}`} data-reveal>
      <div className={s.askPane}>
        {/* the visible heading folds away with the question; keep the section labelled */}
        {revealed && !pricing && (
          <h2 id={titleId} className="sr-only">
            {C.heading}
          </h2>
        )}
        <RevenueHero
          mode={revealed ? "summary" : "ask"}
          value={inp.R}
          onChange={setRevenue}
          idPrefix={prefix}
          entered={entered}
          onSubmit={() => setRevealed(true)}
          eyebrow={pricing ? undefined : C.label}
          heading={pricing ? undefined : { id: titleId, text: C.heading }}
        />
      </div>

      {revealed && (
        <ResultsPane inp={inp} out={out} idPrefix={prefix} tone={pricing ? "light" : "red"} paneRef={resultsRef}>
          <div className={s.compactActions}>
            <Button href={href} variant={pricing ? "primary" : "inverse"} onClick={() => onCta("open_calculator")}>
              {C.cta} →
            </Button>
            <Button href={demoHref} variant={pricing ? "secondary" : "ghostOnDark"} onClick={() => onCta("book_demo")}>
              {calcCopy.ctas.demo.label}
            </Button>
          </div>
          <p className={s.disclaimer}>{calcCopy.results.disclaimer}</p>
        </ResultsPane>
      )}
    </div>
  );

  if (pricing) {
    return (
      <Reveal as="section" id={id} className={`container-xl ${s.bandSection}`} aria-labelledby={titleId}>
        <div className={s.band}>
          <div className={s.bandHead} data-reveal>
            <p className={`${s.bandEyebrow} type-label`}>
              <span className={s.dot} aria-hidden="true" />
              {C.label}
            </p>
            <h2 id={titleId} className={`${s.bandTitle} type-h2`}>
              {C.heading}
            </h2>
            <p className={`${s.bandLead} type-lead`}>{C.lead}</p>
          </div>
          {card}
        </div>
      </Reveal>
    );
  }

  return (
    <Reveal as="section" id={id} className={`container-lg ${s.compactSection}`} aria-labelledby={titleId}>
      {card}
    </Reveal>
  );
}
