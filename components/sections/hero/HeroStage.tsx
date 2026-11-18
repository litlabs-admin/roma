"use client";

import { useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/motion";
import { money } from "@/components/platform/mock/kit";
import type { Category } from "@/lib/content/platform";
import {
  DISPUTE,
  DISPUTED_KEY,
  GROUPS,
  JOURNAL,
  NOISE,
  REMITTANCE,
  STAGE_COPY,
  ZONES,
  type StageLine,
} from "./stageData";
import s from "./heroStage.module.css";

type Mode = "before" | "after";

/** Paper + backup tilt in the "before" scene (deg). Mirrors --paper-rot / --pod-rot in CSS. */
const TILT: Record<string, number> = { pod: 3 };
const PAPER_TILT = -1;

/** Stage start times (s) for the "With Roma" reveal. */
const T = { lift: 0, s1: 0.55, s2: 1.5, s3: 2.15 };
const TRAVEL = "power3.inOut";

const CAT_CLASS: Record<Category, string> = { promo: s.promo, shortage: s.shortage, fees: s.fees };

const LINES_BY_KEY: Record<string, StageLine> = Object.fromEntries(REMITTANCE.deductions.map((l) => [l.key, l]));

/** Remittance amounts the way a distributor prints them: no $, trailing minus. */
const paperAmount = (n: number) =>
  `${Math.abs(n).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}${n < 0 ? "-" : ""}`;

/** A remittance line once Roma has it: a slip that takes its category colour when sorted. */
function Slip({ line, flip = line.key }: { line: StageLine; flip?: string }) {
  return (
    <span className={s.slip} data-flip={flip}>
      {line.category && <span className={`${s.tint} ${CAT_CLASS[line.category]}`} data-tint aria-hidden="true" />}
      <span className={s.slipCode}>{line.code}</span>
      <span className={s.slipAmt}>{money(line.amount)}</span>
    </span>
  );
}

/**
 * Hero stage, Concept A ("The Remittance").
 * Both states are complete, laid-out DOM stacked in one grid cell (so the stage never
 * changes height). CSS renders each state's final look; the reveal is a FLIP: every
 * "With Roma" element that has a paper counterpart starts at that counterpart's measured
 * position and travels home, so nothing in the end state appears from nowhere.
 */
export default function HeroStage() {
  const [mode, setMode] = useState<Mode>("before");
  const [touched, setTouched] = useState(false);
  const frame = useRef<HTMLDivElement>(null);
  const afterBtn = useRef<HTMLButtonElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);
  const first = useRef(true);

  // Keep focus on the control when the CTA turns into the toggle.
  useLayoutEffect(() => {
    if (touched) afterBtn.current?.focus({ preventScroll: true });
  }, [touched]);

  useLayoutEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    const root = frame.current;
    if (!root) return;
    const before = root.querySelector<HTMLElement>("[data-layer='before']")!;
    const after = root.querySelector<HTMLElement>("[data-layer='after']")!;
    const inB = (sel: string) => Array.from(before.querySelectorAll<HTMLElement>(sel));
    const inA = (sel: string) => Array.from(after.querySelectorAll<HTMLElement>(sel));

    tl.current?.kill();
    const layers = [before, after];
    const animated = [
      ...inB("[data-src],[data-noise],[data-paper]"),
      ...inA("[data-flip],[data-tint],[data-chrome],[data-reveal],[data-bar],[data-ghost],[data-step],[data-stepline],[data-row],[data-tick]"),
    ];
    // Every run starts from the CSS (final) state, so an interrupted run never leaks.
    // Only clear what GSAP writes: React owns other inline styles (e.g. bar widths).
    const OWN = "transform,opacity,visibility";
    gsap.set(animated, { clearProps: OWN });
    const settle = () => void gsap.set([...layers, ...animated], { clearProps: OWN });

    if (prefersReducedMotion()) {
      const [from, to] = mode === "after" ? [before, after] : [after, before];
      tl.current = gsap
        .timeline({ onComplete: settle })
        .set(from, { autoAlpha: 1 })
        .fromTo(to, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.2, ease: "none" }, 0)
        .to(from, { autoAlpha: 0, duration: 0.2, ease: "none" }, 0);
      return;
    }

    if (mode === "before") {
      // Back to the paper: a quiet crossfade; the clutter drifts back in.
      tl.current = gsap
        .timeline({ onComplete: settle })
        .set(before, { autoAlpha: 1 })
        .set(after, { autoAlpha: 1 })
        .to(after, { autoAlpha: 0, duration: 0.35, ease: "power2.out" }, 0)
        .from(inB("[data-paper]"), { autoAlpha: 0, y: 10, duration: 0.6, ease: "power3.out" }, 0.1)
        .from(inB("[data-noise],[data-src='pod']"), { autoAlpha: 0, y: 10, duration: 0.6, ease: "power3.out", stagger: 0.06 }, 0.2);
      return;
    }

    // ── With Roma ────────────────────────────────────────────────────────────
    const rect = (el: Element) => el.getBoundingClientRect();
    // Left edges + vertical centres line up: the text reads as lifting straight off the paper.
    const offset = (from: DOMRect, to: DOMRect) => ({
      x: from.left - to.left,
      y: from.top + from.height / 2 - (to.top + to.height / 2),
    });
    const src = new Map(inB("[data-src]").map((el) => [el.dataset.src!, rect(el)]));
    const flips = new Map(inA("[data-flip]").map((el) => [el.dataset.flip!, el]));
    const flip = (key: string) => flips.get(key)!;
    const from = (key: string) => {
      const o = offset(src.get(key)!, rect(flip(key)));
      return { ...o, rotation: TILT[key] ?? PAPER_TILT };
    };
    const ghost = after.querySelector<HTMLElement>("[data-ghost]")!;
    const viaGhost = offset(rect(ghost), rect(flip(DISPUTED_KEY)));

    const analyticsKeys = GROUPS.flatMap((g) => g.keys).filter((k) => k !== DISPUTED_KEY);
    const zone = (name: string) => after.querySelector<HTMLElement>(`[data-zone='${name}']`)!;
    const reveal = (name: string) => Array.from(zone(name).querySelectorAll<HTMLElement>("[data-reveal]"));

    const t = gsap.timeline({ onComplete: settle });
    tl.current = t;

    // t = 0 · the paper's lines are swapped for slips sitting exactly where they were.
    t.set(before, { autoAlpha: 1 })
      .set(after, { autoAlpha: 1 })
      .set(inB("[data-src]"), { autoAlpha: 0 })
      .set(inA("[data-chrome]"), { autoAlpha: 0 })
      .set(inA("[data-reveal]"), { autoAlpha: 0, y: 8 })
      .set(inA("[data-tint]"), { autoAlpha: 0 })
      .set(inA("[data-bar]"), { scaleX: 0 })
      .set(ghost, { autoAlpha: 0 })
      .set(inA("[data-step]"), { autoAlpha: 0 })
      .set(inA("[data-stepline]"), { scaleX: 0 })
      .set(inA("[data-row]"), { autoAlpha: 0, x: -8 })
      .set(inA("[data-tick]"), { autoAlpha: 0, scale: 0.6 });
    flips.forEach((el, key) => t.set(el, from(key)));

    // Lift · the clutter leaves, then the paper dissolves from under its own lines,
    // and only then does Roma's surface settle in behind them.
    t.to(inB("[data-noise]"), { autoAlpha: 0, y: -8, duration: 0.35, ease: "power2.in", stagger: 0.05 }, T.lift)
      .to(inB("[data-paper]"), { autoAlpha: 0, duration: 0.45, ease: "power2.inOut" }, T.lift + 0.25)
      .to(inA("[data-chrome]"), { autoAlpha: 1, duration: 0.55, ease: "power2.out" }, T.lift + 0.5)
      .to(flip("head"), { x: 0, y: 0, rotation: 0, duration: 0.75, ease: TRAVEL }, T.lift + 0.4)
      .to(inA("[data-step]"), { autoAlpha: 0.35, duration: 0.55, ease: "power2.out" }, T.lift + 0.5);

    // 1 · Analytics: every deduction sorted by type; the questionable shortage too.
    t.to(reveal("analytics"), { autoAlpha: 1, y: 0, duration: 0.5, ease: "power3.out", stagger: 0.05 }, T.s1)
      .to(analyticsKeys.map(flip), { x: 0, y: 0, rotation: 0, duration: 0.8, ease: TRAVEL, stagger: 0.07 }, T.s1)
      .to(flip(DISPUTED_KEY), { ...viaGhost, rotation: 0, duration: 0.8, ease: TRAVEL }, T.s1 + 0.07)
      .to(inA("[data-tint]"), { autoAlpha: 1, duration: 0.3, ease: "power2.out", stagger: 0.07 }, T.s1 + 0.55)
      .to(inA("[data-bar]"), { scaleX: 1, duration: 0.6, ease: "power3.out", stagger: 0.08 }, T.s1 + 0.6)
      // the invoice and the net payment head for the journal right behind them
      .to([flip("inv"), flip("net")], { x: 0, y: 0, rotation: 0, duration: 0.8, ease: TRAVEL, stagger: 0.08 }, T.s1 + 0.4);

    // 2 · Recovery: the shortage lifts out to a dispute, its proof of delivery attaches.
    t.to(reveal("recovery"), { autoAlpha: 1, y: 0, duration: 0.5, ease: "power3.out", stagger: 0.05 }, T.s2)
      .to(flip(DISPUTED_KEY), { x: 0, y: 0, duration: 0.7, ease: TRAVEL }, T.s2)
      .to(ghost, { autoAlpha: 1, duration: 0.3, ease: "power2.out" }, T.s2 + 0.2)
      .to(flip("pod"), { x: 0, y: 0, rotation: 0, duration: 0.7, ease: TRAVEL }, T.s2 + 0.1);
    inA("[data-step]").forEach((el, i) => {
      const line = el.querySelector("[data-stepline]");
      if (line) t.to(line, { scaleX: 1, duration: 0.25, ease: "power2.inOut" }, T.s2 + 0.55 + i * 0.25);
      // Steps not yet reached end at full opacity too; CSS greys them, not GSAP.
      const at = el.dataset.step === "done" ? T.s2 + 0.6 + i * 0.25 : T.s2 + 0.6 + i * 0.25 + 0.1;
      t.to(el, { autoAlpha: 1, duration: 0.25, ease: "power2.out" }, at);
    });

    // 3 · Accounting: the journal builds around the invoice and net, and ties out.
    t.to(reveal("accounting"), { autoAlpha: 1, y: 0, duration: 0.5, ease: "power3.out", stagger: 0.05 }, T.s3)
      .to(inA("[data-row]"), { autoAlpha: 1, x: 0, duration: 0.45, ease: "power3.out", stagger: 0.06 }, T.s3 + 0.15)
      .to(inA("[data-tick]"), { autoAlpha: 1, scale: 1, duration: 0.4, ease: "back.out(2)" }, T.s3 + 0.6);
  }, [mode]);

  useLayoutEffect(() => () => void tl.current?.kill(), []);

  const show = (m: Mode) => {
    setTouched(true);
    setMode(m);
  };

  const isAfter = mode === "after";

  return (
    <div className={s.wrap} data-anim="stage" data-mode={mode}>
      <div ref={frame} className={s.frame}>
        <div className={s.control}>
          {touched ? (
            <div className={s.toggle} role="group" aria-label="Compare">
              <button type="button" className={s.opt} aria-pressed={!isAfter} onClick={() => show("before")}>
                {STAGE_COPY.toggle.before}
              </button>
              <button ref={afterBtn} type="button" className={s.opt} aria-pressed={isAfter} onClick={() => show("after")}>
                {STAGE_COPY.toggle.after}
              </button>
            </div>
          ) : (
            <button type="button" className={s.cta} onClick={() => show("after")}>
              {STAGE_COPY.cta}
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M3 8h10M9 4l4 4-4 4" />
              </svg>
            </button>
          )}
        </div>

        <div className={s.surface}>
          {/* ── Before Roma ─────────────────────────────────────────────── */}
          <div className={s.before} data-layer="before" inert={isAfter} aria-hidden={isAfter}>
            <div className={s.scene}>
              <div className={s.email} data-noise>
                <span className={s.emailDot} aria-hidden="true" />
                <span className={s.emailFrom}>{NOISE.email.from}</span>
                <span className={s.emailSubject}>{NOISE.email.subject}</span>
                <span className={s.emailWhen}>{NOISE.email.when}</span>
              </div>

              <div className={s.sheet} data-noise aria-hidden="true">
                <div className={s.sheetTab}>{NOISE.sheet.name}</div>
                <div className={s.sheetGrid}>
                  {NOISE.sheet.rows.map((r, i) => (
                    <div key={i} className={s.sheetRow}>
                      {r.map((c, j) => (
                        <span key={j} className={c === "#REF!" ? s.sheetErr : undefined}>
                          {c}
                        </span>
                      ))}
                    </div>
                  ))}
                </div>
              </div>

              <div className={s.paper} data-paper>
                <div className={s.paperHead} data-src="head">
                  <span className={s.paperChannel}>{REMITTANCE.channel}</span>
                  <span>{REMITTANCE.title}</span>
                </div>
                <div className={s.paperMeta}>
                  <span>{REMITTANCE.check}</span>
                  <span>{REMITTANCE.date}</span>
                </div>
                <div className={s.paperCols} aria-hidden="true">
                  <span>Ref</span>
                  <span>Description</span>
                  <span>Amount</span>
                </div>
                {[REMITTANCE.invoice, ...REMITTANCE.deductions].map((l) => (
                  <div key={l.key} className={`${s.paperRow} ${l.key === DISPUTED_KEY ? s.paperFlag : ""}`}>
                    <span className={s.paperRef}>{l.ref}</span>
                    <span className={s.paperLine} data-src={l.key}>
                      <span>{l.code}</span>
                      <span>{paperAmount(l.amount)}</span>
                    </span>
                  </div>
                ))}
                <div className={s.paperNet} data-src="net">
                  <span>{REMITTANCE.net.label}</span>
                  <span>{paperAmount(REMITTANCE.net.amount)}</span>
                </div>
              </div>

              <p className={s.note} data-noise>
                {NOISE.note}
              </p>

              <div className={s.window} data-noise>
                <svg className={s.clock} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" aria-hidden="true">
                  <circle cx="8" cy="8" r="6" />
                  <path d="M8 4.8V8l2.2 1.4" />
                </svg>
                <span className={s.podText}>
                  <span className={s.windowLabel}>{NOISE.window.label}</span>
                  <span className={s.podMeta}>{NOISE.window.detail}</span>
                </span>
              </div>

              <p className={s.sticky} data-noise>
                {NOISE.sticky}
              </p>

              <div className={s.promoDoc} data-noise>
                <PdfIcon />
                <span className={s.podText}>
                  <span className={s.podName}>{NOISE.promo.name}</span>
                  <span className={s.podMeta}>{NOISE.promo.meta}</span>
                </span>
              </div>

              <div className={s.pod} data-src="pod">
                <PdfIcon />
                <span className={s.podText}>
                  <span className={s.podName}>{NOISE.backup.name}</span>
                  <span className={s.podMeta}>{NOISE.backup.meta}</span>
                </span>
              </div>
            </div>
          </div>

          {/* ── With Roma ───────────────────────────────────────────────── */}
          <div className={s.after} data-layer="after" inert={!isAfter} aria-hidden={!isAfter}>
            <div className={s.panel}>
              <span className={s.panelBg} data-chrome aria-hidden="true" />
              <div className={s.panelHead}>
                <Image className={s.mark} src="/brand/roma-mark.png" alt="" width={20} height={20} data-chrome />
                <span className={s.headTitle} data-flip="head">
                  {REMITTANCE.channel} remittance · {REMITTANCE.check}
                </span>
                <span className={s.headMeta} data-chrome>
                  {REMITTANCE.deductions.length} deductions · {money(-REMITTANCE.deducted)}
                </span>
                <span className={s.headRule} data-chrome aria-hidden="true" />
              </div>

              <div className={s.zones}>
                {/* 1 · Analytics */}
                <section className={`${s.zone} ${s.zA}`} data-zone="analytics" aria-label={ZONES.analytics.eyebrow}>
                  <ZoneLabel {...ZONES.analytics} n="01" />
                  <div className={s.groups}>
                    {GROUPS.map((g) => (
                      <div key={g.category} className={s.group}>
                        <div className={s.groupHead} data-reveal>
                          <span className={`${s.catDot} ${CAT_CLASS[g.category]}`} aria-hidden="true" />
                          <span className={s.groupLabel}>{g.label}</span>
                          <span className={s.groupTotal}>{money(g.total)}</span>
                          <span className={s.groupShare}>{g.share}%</span>
                        </div>
                        <span className={s.barTrack} data-chrome aria-hidden="true">
                          <span className={`${s.bar} ${CAT_CLASS[g.category]}`} style={{ width: `${g.share}%` }} data-bar />
                        </span>
                        <div className={s.slips}>
                          {g.keys.map((k) =>
                            k === DISPUTED_KEY ? (
                              <span key={k} className={s.ghost} data-ghost>
                                <span className={s.slipCode}>{LINES_BY_KEY[k].code}</span>
                                <span className={s.ghostTag}>In dispute ↗</span>
                              </span>
                            ) : (
                              <Slip key={k} line={LINES_BY_KEY[k]} />
                            ),
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* 2 · Recovery */}
                <section className={`${s.zone} ${s.zB}`} data-zone="recovery" aria-label={ZONES.recovery.eyebrow}>
                  <span className={s.divider} data-chrome aria-hidden="true" />
                  <ZoneLabel {...ZONES.recovery} n="02" />
                  <div className={s.dispute}>
                    <span className={s.cardBg} data-chrome aria-hidden="true" />
                    <Slip line={LINES_BY_KEY[DISPUTED_KEY]} />
                    <p className={s.disputeTitle} data-reveal>
                      {DISPUTE.title}
                    </p>
                    <div className={s.attach} data-flip="pod">
                      <PdfIcon />
                      <span className={s.podName}>{NOISE.backup.name}</span>
                    </div>
                    <ol className={s.track}>
                      {DISPUTE.steps.map((st, i) => (
                        <li key={st.label} className={`${s.step} ${st.done ? s.stepDone : ""}`} data-step={st.done ? "done" : "next"}>
                          {i > 0 && (
                            <span className={s.stepLine} aria-hidden="true">
                              {st.done && <span className={s.stepFill} data-stepline />}
                            </span>
                          )}
                          <span className={s.stepDot} aria-hidden="true" />
                          <span className={s.stepLabel}>{st.label}</span>
                          <span className={s.stepWhen}>{st.when || "Next"}</span>
                        </li>
                      ))}
                    </ol>
                    <p className={s.confirm} data-reveal>
                      {DISPUTE.confirm}
                    </p>
                  </div>
                </section>

                {/* 3 · Accounting */}
                <section className={`${s.zone} ${s.zC}`} data-zone="accounting" aria-label={ZONES.accounting.eyebrow}>
                  <span className={s.divider} data-chrome aria-hidden="true" />
                  <ZoneLabel {...ZONES.accounting} n="03" />
                  <div className={s.journal}>
                    <div className={s.jRow}>
                      <span className={s.gl} data-row>
                        {JOURNAL.sales.gl}
                      </span>
                      <span className={s.jName}>
                        <span data-row>{JOURNAL.sales.name}</span>
                        <span className={s.jRef} data-flip="inv">
                          {REMITTANCE.invoice.ref}
                        </span>
                      </span>
                      <span className={s.jAmt} data-row>
                        {money(REMITTANCE.invoice.amount)}
                      </span>
                    </div>
                    {JOURNAL.rows.map((r) => (
                      <div key={r.gl} className={`${s.jRow} ${s.jRuled}`} data-row>
                        <span className={s.gl}>{r.gl}</span>
                        <span className={s.jName}>{r.name}</span>
                        <span className={s.jAmt}>{money(r.amount)}</span>
                      </div>
                    ))}
                    <div className={s.jNet}>
                      <span className={s.netRule} data-row aria-hidden="true" />
                      <span className={s.jNetInner} data-flip="net">
                        <span>{JOURNAL.net.name}</span>
                        <span className={s.jAmt}>{money(REMITTANCE.net.amount)}</span>
                      </span>
                      <span className={s.tie}>
                        <span className={s.tick} data-tick aria-hidden="true">
                          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M3.5 8.5 6.5 11.5 12.5 5" />
                          </svg>
                        </span>
                        <span data-row>{JOURNAL.net.tie}</span>
                      </span>
                    </div>
                    <span className={s.export} data-reveal>
                      {JOURNAL.export}
                    </span>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>
      </div>

      <p className={s.caption}>
        <span className={s.captionText} data-show="before">
          {STAGE_COPY.caption.before}
        </span>
        <span className={s.captionText} data-show="after">
          {STAGE_COPY.caption.after} <span className={s.captionNote}>{STAGE_COPY.note}</span>
        </span>
      </p>
      <p className="sr-only" aria-live="polite">
        {touched ? STAGE_COPY.live[mode] : ""}
      </p>
    </div>
  );
}

function ZoneLabel({ eyebrow, title, n }: { eyebrow: string; title: string; n: string }) {
  return (
    <div className={s.zoneLabel} data-reveal>
      <span className={s.eyebrow}>
        <span className={s.eyebrowN}>{n}</span>
        {eyebrow}
      </span>
      <span className={s.zoneTitle}>{title}</span>
    </div>
  );
}

function PdfIcon() {
  return (
    <svg className={s.pdf} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 1.8h5.2L12.5 5v9.2H4z" />
      <path d="M9 1.8V5h3.5M6 8.5h4.5M6 11h3" />
    </svg>
  );
}
