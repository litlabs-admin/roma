"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/motion";
import { pen, type PenStage } from "@/lib/content/compare/glimpse";
import { Glyph, RomaGlyph } from "@/components/platform/mock/kit";
import { refreshWhenReady, rise } from "@/components/platform/motion";
import SectionHead from "./SectionHead";
import Cite from "./Cite";
import c from "./compare.module.css";
import GlimpseMark from "./GlimpseMark";
import s from "./pen.module.css";

/**
 * "Who holds the pen" (DESIGN.md §G.13). The same four steps, two lanes: your team and
 * the vendor. A toggle switches With Roma ↔ With Glimpse: the step cards cross-fade and
 * the "You" tokens either rise into your lane (Roma: you see why, confirm, track) or sink
 * into the vendor lane and give way to Glimpse's own line about customer time (handed
 * off). Glimpse's steps are its own words, cited.
 *
 * ≥992px the steps are columns on a subgrid (rows: step, your team, vendor); below, each
 * step stacks. Toggle = two buttons with aria-pressed + a polite live region. Reduced
 * motion: instant swap.
 */

type Mode = 0 | 1;
const OUT = 0.2;

export default function WhoHoldsThePen() {
  const root = useRef<HTMLElement>(null);
  const [mode, setMode] = useState<Mode>(0);
  const [announce, setAnnounce] = useState("");
  const busy = useRef(false);
  const first = useRef(true);
  const stages: PenStage[] = mode === 0 ? pen.roma : pen.glimpse;
  const vendor = pen.lanes.vendor[mode];

  // Entrance, once.
  useLayoutEffect(() => {
    const el = root.current;
    if (!el || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(el);
      rise(q("[data-cmp-head]"), q("[data-cmp-head]")[0]);
      const card = q("[data-pen='card']")[0];
      rise(q("[data-pen='bar']"), card, { start: "top 80%" });
      rise(q("[data-pen='col']"), card, { stagger: 0.08, delay: 0.1, start: "top 80%" });
      rise(q("[data-pen='close']"), q("[data-pen='close']")[0]);
    }, el);
    const stop = refreshWhenReady();
    return () => {
      stop();
      ctx.revert();
    };
  }, []);

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

  const pick = (next: Mode) => {
    if (next === mode || busy.current) return;
    setAnnounce(pen.announce[next]);
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
    <section ref={root} className={c.section} aria-labelledby="pen-heading">
      <div className={c.inner}>
        <SectionHead id="pen-heading" label={pen.label} heading={pen.heading} lead={pen.lead} split />

        <div className={s.card} data-pen="card">
          <div className={s.bar} data-pen="bar">
            <span className={s.barLabel}>Who does each step</span>
            <div className={s.toggle} role="group" aria-label="Compare workflow">
              <span className={s.thumb} style={{ transform: `translateX(${mode * 100}%)` }} data-mode={mode} aria-hidden="true" />
              {pen.modes.map((label, i) => (
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
                {pen.lanes.you}
              </span>
              <span className={s.laneLabel}>
                {mode === 0 ? (
                  <span className={s.vBadge}>
                    <RomaGlyph className={s.rosette} />
                  </span>
                ) : (
                  <span className={`${s.vBadge} ${s.vBadgeG}`}>
                    <GlimpseMark />
                  </span>
                )}
                <span data-pen-swap>{vendor}</span>
              </span>
            </div>

            <ol className={s.steps}>
              {stages.map((st, i) => (
                <li key={`${mode}-${st.step}`} className={s.col} data-pen="col">
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
                  <span className={s.noteWho}>{pen.lanes.you}</span>
                  {pen.yourLaneGlimpse}
                  <Cite id={pen.yourLaneSource} />
                </span>
              </p>
            )}
          </div>
        </div>

        <p className={s.close} data-pen="close">
          {pen.close}
        </p>
        <p className="sr-only">{pen.summary}</p>
      </div>
    </section>
  );
}
