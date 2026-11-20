"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { BP, prefersReducedMotion } from "@/lib/motion";
import { scrollToTarget } from "@/components/motion/SmoothScroll";
import { INPUTS, UNLOCK_KEY, calcCopy, type InputKey } from "@/lib/content/calculator";
import { PLANS } from "@/lib/content/pricing";
import {
  DEFAULT_INPUTS,
  compute,
  fmtHours,
  fmtMoney,
  fmtPayback,
  fmtRoi,
  fromParams,
  suggestPlan,
  toParams,
  valueBand,
  type Inputs,
} from "@/lib/calculator/math";
import { toCalculatorPayload, type GateValues } from "@/lib/calculator/payload";
import { track } from "@/lib/calculator/track";
import { submitCalculator } from "@/lib/forms/submit";
import Button from "@/components/ui/Button";
import Reveal from "@/components/blog/Reveal";
import RangeField from "./RangeField";
import RetailerPicker from "./RetailerPicker";
import GateForm from "./GateForm";
import BottomSheet from "./BottomSheet";
import Num from "./Num";
import RollingNumber from "./RollingNumber";
import PaybackChart from "./PaybackChart";
import MathLedger from "./MathLedger";
import { useCalcTracking } from "./useCalcTracking";
import s from "./calculator.module.css";

/**
 * The full deductions calculator (/calculator, DESIGN.md §G.17, brief §2).
 *
 * - Results update live; the headline and three figures are free (ungated).
 * - The breakdown (gain, write-off, time value, ROI, payback, plan) is gated: before
 *   submit each row shows a lock tag, never the numbers (brief §2.6).
 * - Inputs sync to the URL (?R=&d=&i=&c=&h=&w=&n=) so a result can be shared; a shared
 *   link restores the inputs but stays gated for a new visitor.
 * - Returning visitors (localStorage flag set after submit) see the breakdown directly.
 */

const C = calcCopy;
const fmtMoneyCb = (v: number) => fmtMoney(v);
const fmtHoursCb = (v: number) => fmtHours(v);
const fmtRoiCb = (v: number) => fmtRoi(v);
const fmtPaybackCb = (v: number) => fmtPayback(v, C.breakdown.longPayback);

/** Known visitor = submitted before on this browser. A HubSpot "known contact" check
 *  (hutk cookie resolved server-side) can be added here when HubSpot is connected. */
function isKnownVisitor(): string | null {
  try {
    return window.localStorage.getItem(UNLOCK_KEY);
  } catch {
    return null;
  }
}

function rememberVisitor(email: string) {
  try {
    window.localStorage.setItem(UNLOCK_KEY, email);
  } catch {
    /* storage blocked: the breakdown still unlocks for this visit */
  }
}


export default function Calculator() {
  const [inp, setInp] = useState<Inputs>(DEFAULT_INPUTS);
  const [retailers, setRetailers] = useState<string[]>([]);
  const [unlocked, setUnlocked] = useState(false);
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [sheet, setSheet] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [copied, setCopied] = useState(false);
  const [barShown, setBarShown] = useState(false);
  const [live, setLive] = useState("");
  const out = useMemo(() => compute(inp), [inp]);
  const plan = suggestPlan(PLANS, inp.n);
  const { root, onInput, onCta } = useCalcTracking("full");
  const resultsRef = useRef<HTMLElement>(null);
  const gateRef = useRef<HTMLDivElement>(null);
  const mounted = useRef(false);

  // Mount: inputs from a shared link, returning visitor, layout mode.
  useEffect(() => {
    const { inputs, found } = fromParams(window.location.search);
    const known = isKnownVisitor();
    const mq = window.matchMedia(`(max-width: ${BP.lg - 0.02}px)`);
    const sync = () => setMobile(mq.matches);
    // After hydration: the server renders the defaults.
    const raf = requestAnimationFrame(() => {
      if (found) setInp(inputs);
      if (known) setUnlocked(true);
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
    const t = window.setTimeout(() => setLive(`${C.results.headline(fmtMoney(out.value))}. ${C.results.deductions}: ${fmtMoney(out.D)}.`), 800);
    return () => window.clearTimeout(t);
  }, [out.value, out.D]);

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

  // calculator_gate_view: once, when the locked breakdown is on screen.
  useEffect(() => {
    const el = gateRef.current;
    if (!el || unlocked) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          track("calculator_gate_view", { source_page: window.location.pathname });
          io.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [unlocked]);

  const update = useCallback(
    (key: InputKey, v: number) => {
      setInp((p) => {
        const next = { ...p, [key]: v };
        onInput(key, compute(next).value);
        return next;
      });
    },
    [onInput],
  );

  const shareUrl = () => `${window.location.origin}/calculator?${toParams(inp).toString()}`;

  const copyLink = async () => {
    track("calculator_share");
    try {
      await navigator.clipboard.writeText(shareUrl());
    } catch {
      /* clipboard blocked: the address bar already holds the same link */
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  const unlock = (email: string) => {
    rememberVisitor(email);
    setSentTo(email.trim());
    setUnlocked(true);
    setSheet(false);
    if (mobile) window.setTimeout(() => gateRef.current && scrollToTarget(gateRef.current), prefersReducedMotion() ? 0 : 350);
  };

  const submit = async (v: GateValues) => {
    if (v.website) {
      // Honeypot filled: behave as if it worked, send nothing.
      unlock(v.email);
      return { ok: true } as const;
    }
    const payload = toCalculatorPayload({
      values: v,
      inputs: inp,
      retailers,
      out,
      plan: plan.name,
      reportUrl: shareUrl(),
      sourcePage: window.location.pathname,
    });
    const res = await submitCalculator(payload);
    if (res.ok) {
      track("calculator_email_submit", { suggested_plan: plan.name, value_band: valueBand(out.value) });
      unlock(v.email);
    } else {
      track("calculator_submit_error", { error_type: res.message || "submit_failed" });
    }
    return res;
  };

  const noHours = inp.h === 0;
  const fullC = inp.c >= 100;
  const timeLed = out.value < out.cost || out.gain === 0;
  const invalidPct = out.D > 0 ? (out.I / out.D) * 100 : 0;
  const demoHref = `${C.ctas.demo.href}?src=calculator&rev=${Math.round(inp.R)}&plan=${plan.id}`;

  /* Gated rows, in reading order. When value is mostly time (or Roma costs more than it
     returns), hours lead and ROI follows (brief §2.9). */
  const recoveryRows: Row[] = [
    { k: "gain", label: C.breakdown.gain, v: out.gain, fmt: fmtMoneyCb, accent: true },
    { k: "writeOff", label: C.breakdown.writeOff, v: out.writeOff, fmt: fmtMoneyCb },
  ];
  const timeRows: Row[] = noHours ? [] : [{ k: "time", label: C.breakdown.time, v: out.vTime, fmt: fmtMoneyCb, sub: `${fmtHours(out.hSaved)} hours a year` }];
  const returnRows: Row[] = [
    { k: "roi", label: C.breakdown.roi, v: out.roi, fmt: fmtRoiCb },
    { k: "payback", label: C.breakdown.payback, v: Number.isFinite(out.payback) ? out.payback : 99, fmt: fmtPaybackCb },
  ];
  const rows = timeLed ? [...timeRows, ...recoveryRows, ...returnRows] : [...recoveryRows, ...timeRows, ...returnRows];

  return (
    <>
      <Reveal>
      <div ref={root} className={s.card} data-reveal>
        <div className={s.calcGrid}>
          {/* ── inputs ── */}
          <div className={s.inputs}>
            <Group title={C.groups.business} n="01">
              <RangeField spec={INPUTS.R} value={inp.R} onChange={(v) => update("R", v)} idPrefix="calc" />
              <RetailerPicker
                retailers={retailers}
                onRetailers={setRetailers}
                n={inp.n}
                onN={(v) => update("n", v)}
                idPrefix="calc"
              />
            </Group>
            <Group title={C.groups.deductions} n="02">
              <RangeField spec={INPUTS.d} value={inp.d} onChange={(v) => update("d", v)} idPrefix="calc" note={inp.d > 15 ? C.notes.highD : undefined} />
              <RangeField spec={INPUTS.i} value={inp.i} onChange={(v) => update("i", v)} idPrefix="calc" />
              <RangeField spec={INPUTS.c} value={inp.c} onChange={(v) => update("c", v)} idPrefix="calc" />
            </Group>
            <Group title={C.groups.team} n="03">
              <RangeField spec={INPUTS.h} value={inp.h} onChange={(v) => update("h", v)} idPrefix="calc" unitAfter="hrs / week" />
              <RangeField spec={INPUTS.w} value={inp.w} onChange={(v) => update("w", v)} idPrefix="calc" unitAfter="/ hour" />
            </Group>
          </div>

          {/* ── results (sticky on desktop) ── */}
          <aside ref={resultsRef} id="calc-results" className={s.results} aria-labelledby="calc-results-label">
            <div className={s.resultsInner}>
              <p id="calc-results-label" className={`${s.resultsLabel} type-label`}>
                <span className={s.dot} aria-hidden="true" />
                {C.results.label}
              </p>
              <p className={s.headline}>
                <span className={s.headlineSmall}>Up to</span>
                <RollingNumber text={fmtMoney(out.value)} className={s.headlineFigure} rollIn />
                <span className={s.headlineSmall}>{C.results.headlineShort}</span>
              </p>
              {(fullC || noHours) && <p className={s.resultNote}>{fullC ? C.notes.fullC : C.notes.noHours}</p>}

              <dl className={s.figures}>
                <div className={s.figure}>
                  <dt>{C.results.deductions}</dt>
                  <dd>
                    <Num value={out.D} format={fmtMoneyCb} />
                  </dd>
                </div>
                <div className={s.figure}>
                  <dt>{C.results.invalid}</dt>
                  <dd>
                    <Num value={out.I} format={fmtMoneyCb} className={s.figureChip} />
                  </dd>
                </div>
                {!noHours && (
                  <div className={s.figure}>
                    <dt>{C.results.hours}</dt>
                    <dd>
                      <Num value={out.hSaved} format={fmtHoursCb} />
                    </dd>
                  </div>
                )}
              </dl>

              <div className={s.flow} aria-hidden="true">
                <p className={s.flowLabel}>{C.results.flowLabel}</p>
                <div className={s.flowBar}>
                  <span className={s.flowFill} style={{ "--share": invalidPct / 100 } as CSSProperties} />
                </div>
                <div className={s.flowKeys}>
                  <span className={s.flowKeyRed}>
                    {Math.round(invalidPct)}% {C.results.flowInvalid}
                  </span>
                  <span>
                    {100 - Math.round(invalidPct)}% {C.results.flowValid}
                  </span>
                </div>
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

        {/* ── gated breakdown ── */}
        <div ref={gateRef} id="calc-report" className={`${s.gate} ${unlocked ? s.gateOpen : ""}`}>
          <div className={s.gateMain}>
            <div className={s.gateHead}>
              <h2 className={`${s.gateTitle} type-h5`}>{C.gate.title}</h2>
              <p className={s.gateSub}>{C.gate.sub}</p>
            </div>

            {unlocked ? (
              <>
                {timeLed && !noHours && <p className={s.resultNote}>{C.breakdown.timeLed}</p>}
                <dl className={s.breakdown} data-unlocked>
                  {rows.map((r, i) => (
                    <div key={r.k} className={s.bRow} style={{ "--i": i } as CSSProperties}>
                      <dt>
                        {r.label}
                        {r.sub && <span className={s.bSub}>{r.sub}</span>}
                      </dt>
                      <dd className={r.accent ? s.figureRed : undefined}>
                        <Num value={r.v} format={r.fmt} from={0} delay={0.08 * i} />
                      </dd>
                    </div>
                  ))}
                </dl>
              </>
            ) : (
              <>
                <ul className={s.breakdown}>
                  {[C.breakdown.gain, C.breakdown.writeOff, C.breakdown.time, C.breakdown.roi, C.breakdown.payback].map((label) => (
                    <li key={label} className={s.bRow}>
                      <span>{label}</span>
                      <span className={s.lockPill}>
                        <LockIcon />
                        {C.gate.lockedTag}
                      </span>
                    </li>
                  ))}
                </ul>
                <p className={s.lockHint}>{mobile ? C.gate.lockHintMobile : C.gate.lockHint}</p>
              </>
            )}
          </div>

          <div className={s.gateSide}>
            {unlocked ? (
              <div className={s.unlockedSide}>
                {sentTo && (
                  <p className={s.sent} role="status">
                    <span className={s.sentIcon} aria-hidden="true">
                      <svg viewBox="0 0 16 16">
                        <path d="M3.5 8.5 6.5 11.5 12.5 5" />
                      </svg>
                    </span>
                    {C.gate.sent(sentTo)}
                  </p>
                )}
                <div className={s.chartCard}>
                  <div className={s.chartHead}>
                    <p className={s.chartTitle}>{C.breakdown.payback}</p>
                    <span className={s.chartFigure}>{fmtPayback(out.payback, C.breakdown.longPayback)}</span>
                  </div>
                  <PaybackChart
                    value={out.value}
                    cost={out.cost}
                    costLabel="Roma a year"
                    label={`Payback: ${fmtPayback(out.payback, C.breakdown.longPayback)}. Roma costs ${fmtMoney(out.cost, true)} a year; your estimated value is ${fmtMoney(out.value)} a year.`}
                  />
                </div>
                <div className={s.planCard}>
                  <p className={`${s.planLabel} type-label`}>{C.breakdown.plan}</p>
                  <p className={s.planName}>{plan.name}</p>
                  <p className={s.planMeta}>
                    {C.breakdown.planNote(inp.n)} · {plan.price ? `${plan.from ? "from " : ""}$${plan.price}/month` : "Talk to sales"}
                  </p>
                  <a href="/pricing" className={s.planLink} onClick={() => onCta("see_pricing")}>
                    {C.breakdown.seePricing}
                    <svg viewBox="0 0 16 16" aria-hidden="true">
                      <path d="M3 8h10M9 4l4 4-4 4" />
                    </svg>
                  </a>
                </div>
                <div className={s.ctaRow}>
                  <Button href={demoHref} variant="inverse" onClick={() => onCta("book_demo")}>
                    {C.ctas.demo.label} →
                  </Button>
                  <Button href={C.ctas.try.href} variant="ghostOnDark" onClick={() => onCta("try_now")}>
                    {C.ctas.try.label}
                  </Button>
                </div>
              </div>
            ) : mobile ? (
              <button type="button" className={s.gateBtn} onClick={() => setSheet(true)}>
                <LockIcon />
                {C.gate.cta}
              </button>
            ) : (
              <div className={s.formCard}>
                <p className={s.formTitle}>{C.gate.formTitle}</p>
                <p className={s.formSub}>{C.gate.formSub}</p>
                <GateForm onSubmit={submit} />
              </div>
            )}
          </div>
        </div>

        <p className="sr-only" aria-live="polite">
          {live}
        </p>
      </div>
      </Reveal>

      {/* Mobile: the headline follows you while you edit inputs (brief §2.11). */}
      {mobile && (
        <button
          type="button"
          className={`${s.stickyBar} ${barShown ? s.stickyBarOn : ""}`}
          onClick={() => resultsRef.current && scrollToTarget(resultsRef.current)}
          tabIndex={barShown ? 0 : -1}
          aria-hidden={!barShown}
        >
          <span className={s.stickyText}>
            <span className={s.stickyFigure}>{fmtMoney(out.value)}</span> {C.results.headlineShort}
          </span>
          <span className={s.stickyCta}>{C.results.sticky}</span>
        </button>
      )}

      {mobile && (
        <BottomSheet open={sheet} onClose={() => setSheet(false)} title={C.gate.formTitle} sub={C.gate.formSub} closeLabel={C.gate.close}>
          <GateForm onSubmit={submit} idPrefix="sheet-" />
        </BottomSheet>
      )}

      <MathLedger inp={inp} out={out} unlocked={unlocked} />
    </>
  );
}

type Row = { k: string; label: string; v: number; fmt: (v: number) => string; accent?: boolean; sub?: string };

function Group({ title, n, children }: { title: string; n: string; children: ReactNode }) {
  return (
    <fieldset className={s.group}>
      <legend className={`${s.groupTitle} type-label`}>
        <span className={s.groupNum}>{n}</span>
        {title}
      </legend>
      <div className={s.groupBody}>{children}</div>
    </fieldset>
  );
}

function LockIcon() {
  return (
    <svg className={s.lock} viewBox="0 0 16 16" aria-hidden="true">
      <rect x="3.5" y="7" width="9" height="6.5" rx="1.2" />
      <path d="M5.5 7V5a2.5 2.5 0 0 1 5 0v2" />
    </svg>
  );
}
