"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/motion";
import type { QaArt } from "@/lib/content/compare/types";
import { Glyph, RomaGlyph } from "@/components/platform/mock/kit";
import Cite from "../Cite";
import CompetitorLogo from "../CompetitorLogo";
import SwitchCard, { type Side } from "../Switch";
import s from "./questions.module.css";

/**
 * Floret hero art (DESIGN.md §G.13): the same buyer question, two answers. One frame on
 * both sides, so only the answer changes (as the other reveal cards). Pick a question
 * (the micro-interaction, shared by both sides): Floret's answer is quoted from its site
 * and cited, beside a static visual; Roma's is approved copy, beside a visual that plays
 * one motion when shown ($399 counts up, the 5-minute ring fills, Confirm presses).
 */

type Q = QaArt["questions"][number];

/** "$399", counting up from $0 when mounted (remounted each time it is shown). */
function CountUp() {
  const el = useRef<HTMLSpanElement>(null);
  useLayoutEffect(() => {
    const node = el.current;
    if (!node || prefersReducedMotion()) return;
    const v = { n: 0 };
    const tw = gsap.to(v, { n: 399, duration: 1, delay: 0.35, ease: "power3.out", onUpdate: () => void (node.textContent = `$${Math.round(v.n)}`) });
    return () => {
      tw.kill();
      node.textContent = "$399";
    };
  }, []);
  return <span ref={el}>$399</span>;
}

function Visual({ id, side }: { id: Q["id"]; side: Side }) {
  if (id === "cost")
    return side === "them" ? (
      <div className={s.tag}>
        <span className={s.tagHole} aria-hidden="true" />
        <span className={s.vLabel}>Price</span>
        <span className={s.unknown}>?</span>
        <span className={s.tagNote}>Custom quote</span>
        <span className={s.steps}>Pilot → Estimate → Quote</span>
      </div>
    ) : (
      <div className={`${s.tag} ${s.tagRoma}`}>
        <span className={s.tagHole} aria-hidden="true" />
        <span className={s.vLabel}>From</span>
        <span className={s.price}>
          <CountUp />
          <small>/ month</small>
        </span>
        <span className={s.tagNote}>Published on this page</span>
      </div>
    );

  if (id === "speed")
    return (
      <div className={`${s.dial} ${side === "roma" ? s.dialRoma : ""}`}>
        <svg viewBox="0 0 120 120" aria-hidden="true">
          <circle className={s.track} cx="60" cy="60" r="50" />
          {side === "roma" && <circle className={s.ring} cx="60" cy="60" r="50" pathLength={1} />}
        </svg>
        <span className={s.dialText}>
          {side === "roma" ? (
            <>
              <b>Under 5 min</b>
              <span className={s.live}>
                <Glyph k="check" />
                Live
              </span>
            </>
          ) : (
            <>
              <b>Not published</b>
              <span>for deductions</span>
            </>
          )}
        </span>
      </div>
    );

  return side === "them" ? (
    <div className={s.filing}>
      <span className={s.fileRow}>
        <Glyph k="user" />
        Filed by Floret’s team
      </span>
      <span className={s.or}>or keep it in-house</span>
    </div>
  ) : (
    <div className={`${s.filing} ${s.filingRoma}`}>
      <span className={s.fileRow}>
        <b>UNFI · Promo</b>
        <span className={s.amt}>$1,240</span>
      </span>
      <span className={s.fileRow}>
        <span className={s.confirm}>
          <Glyph k="user" />
          Confirm
        </span>
        <span className={s.filed}>Filed</span>
      </span>
    </div>
  );
}

function Answer({ q, side, active, changed }: { q: Q; side: Side; active: boolean; changed: number }) {
  const roma = side === "roma";
  return (
    <div className={`${s.pane} ${roma ? s.paneRoma : ""}`}>
      <p className={s.qline} data-sw-item>
        <span className={s.qBadge}>Q</span>
        {q.q}
      </p>
      {/* keyed: a new question (or showing this side) replays the answer's entrance */}
      <div key={`${q.id}-${active}`} className={`${s.answer} ${changed ? s.swap : ""}`}>
        <div className={s.text} data-sw-item>
          <p className={s.who}>
            {roma ? (
              <>
                <span className={s.badge} aria-hidden="true">
                  <RomaGlyph className={s.rosette} />
                </span>
                <b>Roma</b>
              </>
            ) : (
              <CompetitorLogo label height={1.25} />
            )}
          </p>
          {roma ? (
            <p className={s.says}>{q.roma}</p>
          ) : (
            q.them.map((cl) => (
              <p key={cl.text} className={s.says}>
                {cl.text}
                {cl.source && <Cite id={cl.source} />}
              </p>
            ))
          )}
        </div>
        <div className={s.visual} data-sw-item aria-hidden="true">
          <Visual id={q.id} side={side} />
        </div>
      </div>
    </div>
  );
}

export default function QuestionCard({ qa }: { qa: QaArt }) {
  const [qid, setQid] = useState<Q["id"]>(qa.questions[0].id);
  const [changed, setChanged] = useState(0);
  const q = qa.questions.find((x) => x.id === qid) ?? qa.questions[0];

  const toolbar = (
    <span className={s.chips} role="group" aria-label="Pick a question">
      {qa.questions.map((x) => (
        <button
          key={x.id}
          type="button"
          className={s.chip}
          aria-pressed={x.id === qid}
          onClick={() => {
            if (x.id === qid) return;
            setQid(x.id);
            setChanged((n) => n + 1);
          }}
        >
          {x.q}
        </button>
      ))}
    </span>
  );

  return (
    <SwitchCard
      label="Your first questions"
      flush
      className={s.card}
      toolbar={toolbar}
      announce={{
        them: `Showing Floret’s answer to: ${q.q}`,
        roma: `Showing Roma’s answer to: ${q.q}`,
      }}
      takeaway={q.takeaway}
      them={(active) => <Answer q={q} side="them" active={active} changed={changed} />}
      roma={(active) => <Answer q={q} side="roma" active={active} changed={changed} />}
    />
  );
}
