"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/motion";
import { ROMA_PEN } from "@/lib/content/compare/roma";
import type { PenStage } from "@/lib/content/compare/types";
import { Glyph, RomaGlyph } from "@/components/platform/mock/kit";
import PenScene, { type SceneKind } from "./PenScenes";
import { useCompare } from "../context";
import Cite from "../Cite";
import CompetitorLogo from "../CompetitorLogo";
import { SwitchBar } from "../Switch";
import s from "./pen.module.css";

/**
 * "Who does each step" (DESIGN.md §G.13, the `control` visual). The same four steps,
 * two lanes: your team and the vendor. A toggle switches With Roma ↔ With {competitor}:
 * the step cards cross-fade and the "You" tokens either rise into your lane (Roma: you
 * see why, confirm, track) or sink toward the vendor lane, giving way to the
 * competitor's own line about your part (handed off). Competitor steps are its own
 * words, cited. Each step card opens on a small product scene (PenScenes); a switch
 * plays them in turn, and on Roma's side each "You" token replays its step.
 *
 * ≥992px the steps are columns on a subgrid (rows: step, your team, vendor); below,
 * each step stacks. Toggle = two buttons with aria-pressed + a polite live region.
 * Reduced motion: instant swap.
 */

type Mode = 0 | 1;
const OUT = 0.2;

const ROMA_SCENES: SceneKind[] = ["pull", "check", "dispute", "recover"];
const THEM_SCENES: SceneKind[] = ["retrieve", "validate", "file", "erp"];

/** What the live region says when a "You" token replays its step. */
const YOU_SAYS: Record<string, string> = {
  "See why": "See why: the line is classified as Promo, matched to your invoice and promo.",
  Confirm: "Confirm: the dispute is queued with its documents; you confirm and Roma files it.",
  "Track it": "Track it: filed, pending, paid, then booked with its GL code.",
};

export default function PenToggle() {
  const { c } = useCompare();
  const root = useRef<HTMLDivElement>(null);
  // Opens on the competitor's way; "See what Roma does better" plays Roma's (DESIGN.md §G.13).
  const [mode, setMode] = useState<Mode>(1);
  const [touched, setTouched] = useState(false);
  const [announce, setAnnounce] = useState("");
  // Scene replays: `all` plays every step in turn (on a switch), `one[i]` replays step i (its token).
  const [runs, setRuns] = useState<{ all: number; one: number[]; last: "all" | number }>({ all: 0, one: [0, 0, 0, 0], last: "all" });
  const busy = useRef(false);
  const first = useRef(true);
  const pen = c.story.kind === "glimpse" ? c.story.pen : null;
  const stages: PenStage[] = mode === 0 ? ROMA_PEN : (pen?.stages ?? []);
  const vendor = mode === 0 ? "Roma" : c.name;

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

  if (!pen) return null;
  const yourLane = pen.yourLane;

  const pick = (next: Mode) => {
    setTouched(true);
    if (next === mode || busy.current) return;
    setAnnounce(next === 0 ? "Showing Roma: your team confirms each dispute." : `Showing ${c.name}: the vendor runs each step.`);
    const el = root.current;
    if (!el || prefersReducedMotion()) {
      setMode(next);
      return;
    }
    busy.current = true;
    const q = gsap.utils.selector(el);
    const tl = gsap.timeline({
      onComplete: () => {
        setMode(next);
        // The incoming side's scenes play one step after another.
        setRuns((r) => ({ ...r, all: r.all + 1, last: "all" }));
      },
    });
    tl.to(q("[data-pen-swap]"), { autoAlpha: 0, y: -6, duration: OUT, ease: "power2.in" }, 0);
    // Handing off: your tokens sink toward the vendor lane.
    tl.to(q("[data-pen-you]"), { autoAlpha: 0, y: 28, scale: 0.7, duration: 0.3, stagger: 0.04, ease: "power2.in" }, 0);
    tl.to(q("[data-pen-note]"), { autoAlpha: 0, duration: OUT }, 0);
  };

  return (
    <div ref={root} className={s.card}>
      <SwitchBar label="Who does each step" side={mode === 0 ? "roma" : "them"} touched={touched} onPick={(side) => pick(side === "roma" ? 0 : 1)} />
      <p className="sr-only" aria-live="polite">
        {announce}
      </p>

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
              <CompetitorLogo height={1.1} />
            )}
            {mode === 0 && <span data-pen-swap>{vendor}</span>}
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
                  <button
                    type="button"
                    className={s.token}
                    data-pen-you
                    aria-label={`You: ${st.you}. Replay this step.`}
                    onClick={() => {
                      setRuns((r) => ({ ...r, one: r.one.map((n, j) => (j === i ? n + 1 : n)), last: i }));
                      setAnnounce(YOU_SAYS[st.you ?? ""] ?? "");
                    }}
                  >
                    <Glyph k="user" />
                    <span className={s.tokenWho}>You</span>
                    {st.you}
                    <span className={s.tokenPlay} aria-hidden="true">
                      ▸
                    </span>
                  </button>
                ) : (
                  mode === 0 && <span className={s.slot} aria-hidden="true" />
                )}
              </div>

              <div className={`${s.paper} ${mode === 1 ? s.paperG : ""}`} data-pen-swap>
                <PenScene kind={(mode === 0 ? ROMA_SCENES : THEM_SCENES)[i]} run={runs.all * 100 + runs.one[i]} delay={runs.last === "all" ? 0.3 + i * 0.22 : 0} />
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
