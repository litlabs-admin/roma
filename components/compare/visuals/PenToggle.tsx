"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/motion";
import { ROMA_PEN } from "@/lib/content/compare/roma";
import type { PenStage } from "@/lib/content/compare/types";
import { Glyph, RomaGlyph } from "@/components/platform/mock/kit";
import { useCompare } from "../context";
import Cite from "../Cite";
import CompetitorMark from "../CompetitorMark";
import s from "./pen.module.css";

/**
 * "Who does each step" (DESIGN.md §G.13, the `control` visual). The same four steps,
 * two lanes: your team and the vendor. A toggle switches With Roma ↔ With {competitor}:
 * the step cards cross-fade and the "You" tokens either rise into your lane (Roma: you
 * see why, confirm, track) or sink toward the vendor lane, giving way to the
 * competitor's own line about your part (handed off). Competitor steps are its own
 * words, cited.
 *
 * ≥992px the steps are columns on a subgrid (rows: step, your team, vendor); below,
 * each step stacks. Toggle = two buttons with aria-pressed + a polite live region.
 * Reduced motion: instant swap.
 */

type Mode = 0 | 1;
const OUT = 0.2;

export default function PenToggle() {
  const { c } = useCompare();
  const root = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<Mode>(0);
  const [announce, setAnnounce] = useState("");
  const busy = useRef(false);
  const first = useRef(true);
  const stages: PenStage[] = mode === 0 ? ROMA_PEN : (c.pen?.stages ?? []);
  const vendor = mode === 0 ? "Roma" : c.name;
  const modes = ["With Roma", `With ${c.name}`];

  // Incoming half of a switch (the outgoing half runs in `pick` before the state flips).
  useLayoutEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    const el = root.current;
    if (!el || prefersReducedMotion()) {
      busy.current = false;
      return;
    }
    const q = gsap.utils.selector(el);
    const tl = gsap.timeline({ onComplete: () => void (busy.current = false) });
    tl.fromTo(q("[data-pen-swap]"), { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.4, stagger: 0.05, ease: "power3.out", clearProps: "transform,opacity,visibility" }, 0);
    if (mode === 0) {
      tl.fromTo(q("[data-pen-you]"), { autoAlpha: 0, y: 28, scale: 0.7 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.08, ease: "back.out(1.7)", clearProps: "transform,opacity,visibility" }, 0.1);
    } else {
      tl.fromTo(q("[data-pen-note]"), { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.45, ease: "power3.out", clearProps: "transform,opacity,visibility" }, 0.15);
    }
    return () => void tl.kill();
  }, [mode]);

  if (!c.pen) return null;
  const yourLane = c.pen.yourLane;

  const pick = (next: Mode) => {
    if (next === mode || busy.current) return;
    setAnnounce(next === 0 ? "Showing Roma: your team confirms each dispute." : `Showing ${c.name}: the vendor runs each step.`);
    const el = root.current;
    if (!el || prefersReducedMotion()) {
      setMode(next);
      return;
    }
    busy.current = true;
    const q = gsap.utils.selector(el);
    const tl = gsap.timeline({ onComplete: () => setMode(next) });
    tl.to(q("[data-pen-swap]"), { autoAlpha: 0, y: -6, duration: OUT, ease: "power2.in" }, 0);
    // Handing off: your tokens sink toward the vendor lane.
    tl.to(q("[data-pen-you]"), { autoAlpha: 0, y: 28, scale: 0.7, duration: 0.3, stagger: 0.04, ease: "power2.in" }, 0);
    tl.to(q("[data-pen-note]"), { autoAlpha: 0, duration: OUT }, 0);
  };

  return (
    <div ref={root} className={s.card}>
      <div className={s.bar}>
        <span className={s.barLabel}>Who does each step</span>
        <div className={s.toggle} role="group" aria-label="Compare who does each step">
          <span className={s.thumb} style={{ transform: `translateX(${mode * 100}%)` }} data-mode={mode} aria-hidden="true" />
          {modes.map((label, i) => (
            <button key={label} type="button" className={s.opt} aria-pressed={mode === i} onClick={() => pick(i as Mode)}>
              {label}
            </button>
          ))}
        </div>
        <p className="sr-only" aria-live="polite">
          {announce}
        </p>
      </div>

      <div className={s.grid}>
        {/* lane labels (desktop) */}
        <div className={s.lanes} aria-hidden="true">
          <span />
          <span className={s.laneLabel}>
            <span className={s.youAvatar}>
              <Glyph k="user" />
            </span>
            Your team
          </span>
          <span className={s.laneLabel}>
            {mode === 0 ? (
              <span className={s.vBadge}>
                <RomaGlyph className={s.rosette} />
              </span>
            ) : (
              <span className={`${s.vBadge} ${s.vBadgeG}`}>
                <CompetitorMark />
              </span>
            )}
            <span data-pen-swap>{vendor}</span>
          </span>
        </div>

        <ol className={s.steps}>
          {stages.map((st, i) => (
            <li key={`${mode}-${st.step}`} className={s.col}>
              <p className={s.step}>
                <span className={s.num}>{String(i + 1).padStart(2, "0")}</span>
                <span data-pen-swap>{st.step}</span>
              </p>

              <div className={s.you}>
                {mode === 0 && st.you ? (
                  <span className={s.token} data-pen-you>
                    <Glyph k="user" />
                    <span className={s.tokenWho}>You</span>
                    {st.you}
                  </span>
                ) : (
                  mode === 0 && <span className={s.slot} aria-hidden="true" />
                )}
              </div>

              <div className={`${s.paper} ${mode === 1 ? s.paperG : ""}`} data-pen-swap>
                <span className={s.paperWho}>{vendor}</span>
                <b className={s.paperTitle}>{st.title}</b>
                <span className={s.paperText}>
                  {st.text}
                  {st.source && <Cite id={st.source} />}
                </span>
              </div>
            </li>
          ))}
        </ol>

        {mode === 1 && (
          <p className={s.note} data-pen-note>
            <span className={s.youAvatar} aria-hidden="true">
              <Glyph k="user" />
            </span>
            <span>
              <span className={s.noteWho}>Your team</span>
              {yourLane.text}
              {yourLane.source && <Cite id={yourLane.source} />}
            </span>
          </p>
        )}
      </div>
    </div>
  );
}
