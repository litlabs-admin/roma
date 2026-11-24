"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { BP } from "@/lib/motion";
import { scrollToTarget } from "@/components/motion/SmoothScroll";
import { INPUTS, calcCopy, type InputKey } from "@/lib/content/calculator";
import { DEFAULT_INPUTS, compute, fmtMoney, fromParams, toParams, valueBand, type Inputs } from "@/lib/calculator/math";
import { track } from "@/lib/calculator/track";
import Button from "@/components/ui/Button";
import Reveal from "@/components/blog/Reveal";
import RangeField from "./RangeField";
import RevenueHero from "./RevenueHero";
import RevenueSplit from "./RevenueSplit";
import RollingNumber from "./RollingNumber";
import { useCalcTracking } from "./useCalcTracking";
import s from "./calculator.module.css";

/**
 * The deductions calculator (/calculator, DESIGN.md §G.17). Revenue first: one question,
 * then the reveal (invalid figure rolls up, revenue bar splits into invalid / valid /
 * kept). The two rates start at their typical defaults and sit behind "Fine-tune the
 * rates". Results stay live; nothing is gated. Once revealed, inputs sync to the URL
 * (?R=&v=&i=) so a result can be shared; a link with ?R= opens straight on the reveal.
 */

const C = calcCopy;

type Stage = "ask" | "result";

export default function Calculator() {
  const [inp, setInp] = useState<Inputs>(DEFAULT_INPUTS);
  const [stage, setStage] = useState<Stage>("ask");
  const [entered, setEntered] = useState(false);
  const [tuneOpen, setTuneOpen] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [copied, setCopied] = useState(false);
  const [barShown, setBarShown] = useState(false);
  const [live, setLive] = useState("");
  const out = useMemo(() => compute(inp), [inp]);
  const { root, onInput, onCta } = useCalcTracking("full");
  const resultsRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLParagraphElement>(null);
  const userSubmitted = useRef(false);
  const tuneTracked = useRef(false);

  // Mount: inputs from a shared link (with ?R=, open on the reveal), layout mode.
  useEffect(() => {
    const { inputs, found } = fromParams(window.location.search);
    const hasRevenue = new URLSearchParams(window.location.search).has("R");
    const mq = window.matchMedia(`(max-width: ${BP.lg - 0.02}px)`);
    const sync = () => setMobile(mq.matches);
    // After hydration: the server renders the question.
    const raf = requestAnimationFrame(() => {
      if (found) setInp(inputs);
      if (hasRevenue) {
        setEntered(true);
        setStage("result");
      }
      if (found && (inputs.v !== DEFAULT_INPUTS.v || inputs.i !== DEFAULT_INPUTS.i)) setTuneOpen(true);
      sync();
    });
    mq.addEventListener("change", sync);
    return () => {
      cancelAnimationFrame(raf);
      mq.removeEventListener("change", sync);
    };
  }, []);

  // Keep the URL in step once there is a result (debounced), preserving other params (utm_*).
  useEffect(() => {
    if (stage !== "result") return;
    const t = window.setTimeout(() => {
      const q = new URLSearchParams(window.location.search);
      toParams(inp).forEach((v, k) => q.set(k, v));
      window.history.replaceState(window.history.state, "", `${window.location.pathname}?${q.toString()}${window.location.hash}`);
    }, 400);
    return () => window.clearTimeout(t);
  }, [inp, stage]);

  // The reveal: track it, and bring the results into view if the visitor submitted.
  useEffect(() => {
    if (stage !== "result") return;
    const invalid = compute(inp).invalid;
    track("calculator_submit", { value_band: valueBand(invalid), source: userSubmitted.current ? "typed" : "link" });
    onInput("R", invalid);
    if (!userSubmitted.current) return;
    const raf = requestAnimationFrame(() => {
      const el = resultsRef.current;
      if (el && el.getBoundingClientRect().top > window.innerHeight * 0.55) scrollToTarget(el);
    });
    return () => cancelAnimationFrame(raf);
    // runs once per reveal; later input changes are tracked by update()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage]);

  // Screen-reader summary once the numbers settle (the visible figures tween).
  useEffect(() => {
    if (stage !== "result") return;
    const t = window.setTimeout(
      () => setLive(`${C.results.invalid}: ${fmtMoney(out.invalid)}. ${C.results.valid}: ${fmtMoney(out.valid)}. ${C.results.total}: ${fmtMoney(out.total)}.`),
      800,
    );
    return () => window.clearTimeout(t);
  }, [stage, out.invalid, out.valid, out.total]);

  // Mobile sticky result bar: shown while the card is on screen but the headline isn't.
  useEffect(() => {
    const card = root.current;
    const head = headlineRef.current;
    if (!card || !head || !mobile || stage !== "result") return;
    let cardIn = false;
    let headIn = false;
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.target === card) cardIn = e.isIntersecting;
        if (e.target === head) headIn = e.isIntersecting;
      }
      setBarShown(cardIn && !headIn);
    });
    io.observe(card);
    io.observe(head);
    return () => {
      io.disconnect();
      setBarShown(false);
    };
  }, [mobile, root, stage]);

  const update = useCallback(
    (key: InputKey, v: number) => {
      if (key === "R") setEntered(true);
      setInp((p) => {
        const next = { ...p, [key]: v };
        if (stage === "result") onInput(key, compute(next).invalid);
        return next;
      });
    },
    [onInput, stage],
  );

  const submit = () => {
    userSubmitted.current = true;
    setStage("result");
  };

  const toggleTune = () => {
    setTuneOpen((o) => !o);
    if (!tuneTracked.current) {
      tuneTracked.current = true;
      track("calculator_finetune_open");
    }
  };

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

  const demoHref = `${C.ctas.demo.href}?src=calculator&rev=${Math.round(inp.R)}`;
  const revealed = stage === "result";

  return (
    <>
      <Reveal>
        <div ref={root} className={`${s.card} ${s.flowCard} ${revealed ? s.flowCardDone : ""}`} data-reveal>
          <div className={s.askPane}>
            <RevenueHero
              mode={revealed ? "summary" : "ask"}
              value={inp.R}
              onChange={(v) => update("R", v)}
              idPrefix="calc"
              entered={entered}
              onSubmit={submit}
            />
          </div>

          {revealed && (
            <section ref={resultsRef} id="calc-results" className={s.results} aria-labelledby="calc-results-label">
              <div className={`${s.resultsInner} ${s.stagger}`}>
                <p id="calc-results-label" className={`${s.resultsLabel} type-label`}>
                  <span className={s.dot} aria-hidden="true" />
                  {C.results.label}
                </p>
                <p ref={headlineRef} className={s.headline}>
                  <RollingNumber text={fmtMoney(out.invalid)} className={s.headlineFigure} rollIn />
                  <span className={s.headlineSmall}>{C.results.headlineAfter}</span>
                </p>

                <RevenueSplit inp={inp} out={out} />

                <div className={s.tune}>
                  <button type="button" className={s.tuneToggle} aria-expanded={tuneOpen} aria-controls="calc-tune" onClick={toggleTune}>
                    <svg viewBox="0 0 16 16" aria-hidden="true">
                      <path d="M2.5 5h7M12.5 5h1M2.5 11h1M6.5 11h7" />
                      <circle cx="11" cy="5" r="1.5" />
                      <circle cx="5" cy="11" r="1.5" />
                    </svg>
                    <span>{tuneOpen ? C.fineTune.hide : C.fineTune.toggle}</span>
                    <span className={s.tuneRates}>
                      {inp.v}% · {inp.i}%
                    </span>
                  </button>
                  <div id="calc-tune" className={`${s.tunePanel} ${tuneOpen ? s.tunePanelOn : ""}`} inert={!tuneOpen}>
                    <div className={s.tunePanelClip}>
                      <div className={s.tunePanelBody}>
                        <p className={s.tuneHelp}>{C.fineTune.help}</p>
                        <RangeField spec={INPUTS.v} value={inp.v} onChange={(v) => update("v", v)} idPrefix="calc" label={C.fineTune.valid} />
                        <RangeField spec={INPUTS.i} value={inp.i} onChange={(v) => update("i", v)} idPrefix="calc" label={C.fineTune.invalid} />
                      </div>
                    </div>
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
            </section>
          )}

          <p className="sr-only" aria-live="polite">
            {live}
          </p>
        </div>
      </Reveal>

      {/* Mobile: the headline follows you while you fine-tune the rates. */}
      {mobile && revealed && (
        <button
          type="button"
          className={`${s.stickyBar} ${barShown ? s.stickyBarOn : ""}`}
          onClick={() => headlineRef.current && scrollToTarget(headlineRef.current)}
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
