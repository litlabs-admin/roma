"use client";

import { useEffect, useRef, useState, type CSSProperties, type RefObject } from "react";
import { prefersReducedMotion } from "@/lib/motion";
import type { VividlyStory } from "@/lib/content/compare/types";
import { Glyph, RomaGlyph } from "@/components/platform/mock/kit";
import Cite from "../Cite";
import CompetitorLogo from "../CompetitorLogo";
import SwitchCard, { type Side } from "../Switch";
import s from "./journey.module.css";

/**
 * Vividly "Where a deduction goes" (DESIGN.md §G.13): one illustrative deduction travels
 * four stations, in the shared switch card. With Vividly (its words, cited) it runs
 * straight through, and the "Your team" rail stays empty: handled for you. With Roma it
 * stops at the dispute gate, queued with its documents, until you press "Confirm
 * dispute" (the micro-interaction); then it moves on to "Roma files, tracked to payment"
 * and the rail lights where you acted. "Replay" resets it.
 *
 * Positions: the chip rides a lane above the station cards (--pos column). Before any
 * motion (SSR, reduced motion) Vividly's chip sits at the end and Roma's waits at the gate.
 */

const HOP = 650; // ms per station

type GateState = "waiting" | "confirmed";


/** Walks the chip 0 → `to` the first time the pane is active and on screen. */
function useRun(ref: RefObject<HTMLDivElement | null>, active: boolean, to: number) {
  const [pos, setPos] = useState(to);
  const started = useRef(false);
  useEffect(() => {
    const el = ref.current;
    if (!active || started.current || !el || prefersReducedMotion()) return;
    const timers: number[] = [];
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        started.current = true;
        setPos(0);
        for (let p = 1; p <= to; p++) timers.push(window.setTimeout(() => setPos(p), p * HOP + 250));
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      if (timers.length) {
        timers.forEach(clearTimeout);
        setPos(to);
      }
    };
  }, [ref, active, to]);
  return [pos, setPos] as const;
}

function Journey({ gate, side, active }: { gate: VividlyStory["gate"]; side: Side; active: boolean }) {
  const n = gate.stations.length;
  const gateAt = gate.stations.findIndex((st) => st.roma.gate);
  const roma = side === "roma";
  const root = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useRun(root, active, roma ? gateAt : n - 1);
  const [state, setState] = useState<GateState>("waiting");
  const [said, setSaid] = useState("");
  const timers = useRef<number[]>([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const confirm = () => {
    setState("confirmed");
    setSaid("Confirmed. Roma files the dispute and tracks it to payment.");
    if (prefersReducedMotion()) return setPos(n - 1);
    timers.current.push(window.setTimeout(() => setPos(n - 1), 250));
  };
  const replay = () => {
    timers.current.forEach(clearTimeout);
    setState("waiting");
    setSaid("Replaying: the deduction stops at the gate until you confirm.");
    if (prefersReducedMotion()) return setPos(gateAt);
    setPos(0);
    for (let p = 1; p <= gateAt; p++) timers.current.push(window.setTimeout(() => setPos(p), p * HOP));
  };

  const done = pos === n - 1;
  const waiting = roma && state === "waiting" && pos === gateAt;
  const style = { ["--n" as string]: n, ["--pos" as string]: pos } as CSSProperties;

  return (
    <div ref={root} className={`${s.pane} ${roma ? s.paneRoma : ""}`} style={style}>
      <div className={s.board}>
        {/* station heads */}
        <ol className={s.heads} aria-hidden="true">
          {gate.stations.map((st, i) => (
            <li key={st.label} className={`${s.headCell} ${i <= pos ? s.reached : ""}`}>
              <span className={s.num}>{String(i + 1).padStart(2, "0")}</span>
              <span className={s.headLabel}>{st.label}</span>
            </li>
          ))}
        </ol>

        {/* the deduction on its lane */}
        <div className={s.lane} aria-hidden="true">
          <span className={`${s.chip} ${waiting ? s.chipWait : ""} ${done ? s.chipDone : ""}`}>
            <i className={s.dot} />
            {gate.chip.label}
            <b>{gate.chip.amount}</b>
          </span>
        </div>

        {/* station cards */}
        <ol className={s.cards}>
          {gate.stations.map((st, i) => {
            const c = roma ? st.roma : st.them;
            const isGate = roma && st.roma.gate;
            const here = i === pos;
            return (
              <li key={st.label} data-sw-item data-chip={`${gate.chip.label} ${gate.chip.amount}`} className={`${s.card} ${here ? s.cardHere : ""} ${isGate ? s.cardGate : ""} ${i < pos || (done && i === pos) ? s.cardPast : ""}`}>
                <span className={s.cardStep}>
                  {String(i + 1).padStart(2, "0")} · {st.label}
                </span>
                <b className={s.cardTitle}>{c.title}</b>
                {"needs" in c && c.needs && <span className={s.needs}>{c.needs}</span>}
                {c.text && (
                  <span className={s.cardText}>
                    {c.text}
                    {"source" in c && c.source && <Cite id={c.source} />}
                  </span>
                )}
                {isGate && (
                  <span className={s.gateCtl}>
                    {state === "waiting" ? (
                      <button type="button" className={s.confirm} onClick={confirm} disabled={pos !== gateAt}>
                        <Glyph k="user" className={s.you} />
                        Confirm dispute
                      </button>
                    ) : (
                      <span className={s.confirmed}>
                        <Glyph k="check" className={s.you} />
                        Confirmed by you
                      </span>
                    )}
                  </span>
                )}
                {roma && i === n - 1 && done && (
                  <span className={s.status}>
                    <span>Filed</span>
                    <span>Pending</span>
                    <span>Paid</span>
                  </span>
                )}
              </li>
            );
          })}
        </ol>

        {/* your team rail */}
        <div className={s.rail} data-sw-item>
          <span className={s.railWho}>
            <span className={s.avatar} aria-hidden="true">
              <Glyph k="user" />
            </span>
            Your team
          </span>
          {roma ? (
            <span className={s.railTrack}>
              {gate.stations.map((st) => (
                <span key={st.label} className={s.railCell}>
                  {st.roma.gate && (
                    <span className={`${s.youToken} ${state === "confirmed" ? s.youOn : ""}`}>
                      <Glyph k="user" />
                      You · Confirm
                    </span>
                  )}
                </span>
              ))}
            </span>
          ) : (
            <span className={s.railEmpty}>Handled for you</span>
          )}
        </div>
      </div>

      <div className={s.foot} data-sw-item>
        <span className={s.who}>
          {roma ? (
            <>
              <span className={s.badge} aria-hidden="true">
                <RomaGlyph className={s.rosette} />
              </span>
              <b>Roma</b>
            </>
          ) : (
            <CompetitorLogo label height={1.1} />
          )}
          <span className={`${s.mode} ${roma ? s.modeRoma : ""}`}>{roma ? "You approve" : "Automatic"}</span>
        </span>
        {roma && state === "confirmed" && (
          <button type="button" className={s.replay} onClick={replay}>
            <Glyph k="history" />
            Replay
          </button>
        )}
        <span className={s.illus}>Illustrative deduction</span>
      </div>
      {roma && (
        <p className="sr-only" aria-live="polite">
          {said}
        </p>
      )}
    </div>
  );
}

export default function DeductionJourney({ gate }: { gate: VividlyStory["gate"] }) {
  return (
    <SwitchCard
      label="Where a deduction goes"
      announce={{
        them: "Showing Vividly: the deduction goes from arrival to resolution automatically.",
        roma: "Showing Roma: the deduction waits, queued with its documents, until you confirm the dispute.",
      }}
      takeaway={{
        them: "Disputes go out automatically.",
        roma: "Nothing goes out in your name without you.",
      }}
      them={(active) => <Journey gate={gate} side="them" active={active} />}
      roma={(active) => <Journey gate={gate} side="roma" active={active} />}
    />
  );
}
