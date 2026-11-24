"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { BP } from "@/lib/motion";
import { scrollToTarget } from "@/components/motion/SmoothScroll";
import { INPUTS, calcCopy, type InputKey } from "@/lib/content/calculator";
import { DEFAULT_INPUTS, compute, fmtMoney, fromParams, toParams, type Inputs } from "@/lib/calculator/math";
import { track } from "@/lib/calculator/track";
import Button from "@/components/ui/Button";
import Reveal from "@/components/blog/Reveal";
import RangeField from "./RangeField";
import Num from "./Num";
import RollingNumber from "./RollingNumber";
import { useCalcTracking } from "./useCalcTracking";
import s from "./calculator.module.css";

/**
 * The deductions calculator (/calculator). Three inputs (revenue, valid %, invalid %),
 * both rates taken of revenue; results update live with nothing gated.
 * Inputs sync to the URL (?R=&v=&i=) so a result can be shared.
 */

const C = calcCopy;
const fmtMoneyCb = (v: number) => fmtMoney(v);

export default function Calculator() {
  const [inp, setInp] = useState<Inputs>(DEFAULT_INPUTS);
  const [mobile, setMobile] = useState(false);
  const [copied, setCopied] = useState(false);
  const [barShown, setBarShown] = useState(false);
  const [live, setLive] = useState("");
  const out = useMemo(() => compute(inp), [inp]);
  const { root, onInput, onCta } = useCalcTracking("full");
  const resultsRef = useRef<HTMLElement>(null);
  const mounted = useRef(false);

  // Mount: inputs from a shared link, layout mode.
  useEffect(() => {
    const { inputs, found } = fromParams(window.location.search);
    const mq = window.matchMedia(`(max-width: ${BP.lg - 0.02}px)`);
    const sync = () => setMobile(mq.matches);
    // After hydration: the server renders the defaults.
    const raf = requestAnimationFrame(() => {
      if (found) setInp(inputs);
      sync();
    });
    mq.addEventListener("change", sync);
    return () => {
      cancelAnimationFrame(raf);
      mq.removeEventListener("change", sync);
    };
  }, []);

  // Keep the URL in step (debounced), preserving any other params (utm_*).
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    const t = window.setTimeout(() => {
      const q = new URLSearchParams(window.location.search);
      toParams(inp).forEach((v, k) => q.set(k, v));
      window.history.replaceState(window.history.state, "", `${window.location.pathname}?${q.toString()}${window.location.hash}`);
    }, 400);
    return () => window.clearTimeout(t);
  }, [inp]);

  // Screen-reader summary once the numbers settle (the visible figures tween).
  useEffect(() => {
    const t = window.setTimeout(
      () => setLive(`${C.results.invalid}: ${fmtMoney(out.invalid)}. ${C.results.valid}: ${fmtMoney(out.valid)}. ${C.results.total}: ${fmtMoney(out.total)}.`),
      800,
    );
    return () => window.clearTimeout(t);
  }, [out.invalid, out.valid, out.total]);

  // Mobile sticky result bar: shown while the inputs are on screen but the results aren't.
  useEffect(() => {
    const card = root.current;
    const res = resultsRef.current;
    if (!card || !res || !mobile) return;
    let cardIn = false;
    let resIn = false;
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.target === card) cardIn = e.isIntersecting;
        if (e.target === res) resIn = e.isIntersecting;
      }
      setBarShown(cardIn && !resIn);
    });
    io.observe(card);
    io.observe(res);
    return () => {
      io.disconnect();
      setBarShown(false);
    };
  }, [mobile, root]);

  const update = useCallback(
    (key: InputKey, v: number) => {
      setInp((p) => {
        const next = { ...p, [key]: v };
        onInput(key, compute(next).invalid);
        return next;
      });
    },
    [onInput],
  );

  const copyLink = async () => {
    track("calculator_share");
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/calculator?${toParams(inp).toString()}`);
    } catch {
      /* clipboard blocked: the address bar already holds the same link */
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  const invalidPct = Math.round(out.invalidShare * 100);
  const demoHref = `${C.ctas.demo.href}?src=calculator&rev=${Math.round(inp.R)}`;

  return (
    <>
      <Reveal>
        <div ref={root} className={s.card} data-reveal>
          <div className={s.calcGrid}>
            {/* ── inputs ── */}
            <div className={s.inputs}>
              <fieldset className={s.group}>
                <legend className={`${s.groupTitle} type-label`}>{C.groupTitle}</legend>
                <div className={s.groupBody}>
                  <RangeField spec={INPUTS.R} value={inp.R} onChange={(v) => update("R", v)} idPrefix="calc" />
                  <RangeField spec={INPUTS.v} value={inp.v} onChange={(v) => update("v", v)} idPrefix="calc" />
                  <RangeField spec={INPUTS.i} value={inp.i} onChange={(v) => update("i", v)} idPrefix="calc" />
                </div>
              </fieldset>
            </div>

            {/* ── results (sticky on desktop) ── */}
            <aside ref={resultsRef} id="calc-results" className={s.results} aria-labelledby="calc-results-label">
              <div className={s.resultsInner}>
                <p id="calc-results-label" className={`${s.resultsLabel} type-label`}>
                  <span className={s.dot} aria-hidden="true" />
                  {C.results.label}
                </p>
                <p className={s.headline}>
                  <RollingNumber text={fmtMoney(out.invalid)} className={s.headlineFigure} rollIn />
                  <span className={s.headlineSmall}>{C.results.headlineAfter}</span>
                </p>

                <dl className={s.figures}>
                  <div className={s.figure}>
                    <dt>{C.results.valid}</dt>
                    <dd>
                      <Num value={out.valid} format={fmtMoneyCb} />
                    </dd>
                  </div>
                  <div className={s.figure}>
                    <dt>{C.results.invalid}</dt>
                    <dd>
                      <Num value={out.invalid} format={fmtMoneyCb} className={s.figureChip} />
                    </dd>
                  </div>
                  <div className={s.figure}>
                    <dt>{C.results.total}</dt>
                    <dd>
                      <Num value={out.total} format={fmtMoneyCb} />
                    </dd>
                  </div>
                </dl>

                <div className={s.flow} aria-hidden="true">
                  <p className={s.flowLabel}>{C.results.flowLabel}</p>
                  <div className={s.flowBar}>
                    <span className={s.flowFill} style={{ "--share": out.invalidShare } as CSSProperties} />
                  </div>
                  <div className={s.flowKeys}>
                    <span className={s.flowKeyRed}>
                      {invalidPct}% {C.results.flowInvalid}
                    </span>
                    <span>
                      {100 - invalidPct}% {C.results.flowValid}
                    </span>
                  </div>
                </div>

                <div className={s.compactActions}>
                  <Button href={demoHref} variant="inverse" onClick={() => onCta("book_demo")}>
                    {C.ctas.demo.label} →
                  </Button>
                  <Button href={C.ctas.try.href} variant="ghostOnDark" onClick={() => onCta("try_now")}>
                    {C.ctas.try.label}
                  </Button>
                </div>

                <div className={s.resultsFoot}>
                  <p className={s.disclaimer}>{C.results.disclaimer}</p>
                  <button type="button" className={s.copyBtn} onClick={copyLink}>
                    <svg viewBox="0 0 16 16" aria-hidden="true">
                      {copied ? <path d="M3.5 8.5 6.5 11.5 12.5 5" /> : <path d="M6.5 9.5 9.5 6.5M7.2 4.6l1.4-1.4a2.6 2.6 0 0 1 3.7 3.7l-1.4 1.4M8.8 11.4l-1.4 1.4a2.6 2.6 0 0 1-3.7-3.7l1.4-1.4" />}
                    </svg>
                    <span aria-live="polite">{copied ? C.results.copied : C.results.copy}</span>
                  </button>
                </div>
              </div>
            </aside>
          </div>

          <p className="sr-only" aria-live="polite">
            {live}
          </p>
        </div>
      </Reveal>

      {/* Mobile: the headline follows you while you edit inputs. */}
      {mobile && (
        <button
          type="button"
          className={`${s.stickyBar} ${barShown ? s.stickyBarOn : ""}`}
          onClick={() => resultsRef.current && scrollToTarget(resultsRef.current)}
          tabIndex={barShown ? 0 : -1}
          aria-hidden={!barShown}
        >
          <span className={s.stickyText}>
            <span className={s.stickyFigure}>{fmtMoney(out.invalid)}</span> invalid a year
          </span>
          <span className={s.stickyCta}>{C.results.sticky}</span>
        </button>
      )}
    </>
  );
}
