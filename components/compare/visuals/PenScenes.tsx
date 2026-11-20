"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/motion";
import { Glyph, SourcePill, TypeChip } from "@/components/platform/mock/kit";
import s from "./penScenes.module.css";

/**
 * The little product scenes inside each step card of "Who does each step" (Glimpse,
 * DESIGN.md §G.13). Roma's four show what you see at each step (illustrative data, approved
 * claims only); Glimpse's four draw its own cited lines (documents pulled, AI agents and
 * experts check, specialists file, applied to your ERP). `run` is a counter: each change
 * replays the scene (the step's "You" token on Roma's side, or the switch). SSR markup is
 * the finished state.
 */

export type SceneKind = "pull" | "check" | "dispute" | "recover" | "retrieve" | "validate" | "file" | "erp";

const LINES = [
  { src: "UNFI", code: "MCB", amt: "$412.50" },
  { src: "KeHE", code: "SHRT", amt: "$86.20" },
  { src: "Target", code: "FEE", amt: "$1,240" },
];

function play(kind: SceneKind, el: HTMLElement) {
  const q = gsap.utils.selector(el);
  const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
  switch (kind) {
    case "pull":
      tl.fromTo(q("[data-sc='row']"), { autoAlpha: 0, x: -14 }, { autoAlpha: 1, x: 0, duration: 0.4, stagger: 0.16 }, 0);
      break;
    case "check":
      tl.fromTo(q("[data-sc='chip']"), { autoAlpha: 0, scale: 0.6 }, { autoAlpha: 1, scale: 1, duration: 0.35, ease: "back.out(2.2)" }, 0.1).fromTo(
        q("[data-sc='why']"),
        { autoAlpha: 0, y: 8 },
        { autoAlpha: 1, y: 0, duration: 0.4 },
        0.4,
      );
      break;
    case "dispute":
      tl.fromTo(q("[data-sc='doc']"), { autoAlpha: 0, y: -6 }, { autoAlpha: 1, y: 0, duration: 0.3, stagger: 0.1 }, 0)
        .fromTo(q("[data-sc='btn']"), { scale: 1 }, { scale: 0.9, duration: 0.12, yoyo: true, repeat: 1, ease: "power1.inOut" }, 0.45)
        .fromTo(q("[data-sc='filed']"), { autoAlpha: 0, scale: 1.4, rotate: -14 }, { autoAlpha: 1, scale: 1, rotate: -6, duration: 0.35, ease: "power4.out" }, 0.7);
      break;
    case "recover":
      tl.fromTo(q("[data-sc='fill']"), { scaleX: 0 }, { scaleX: 1, duration: 0.9, ease: "power1.inOut" }, 0).fromTo(
        q("[data-sc='node']"),
        { autoAlpha: 0.3, scale: 0.7 },
        { autoAlpha: 1, scale: 1, duration: 0.3, stagger: 0.38, ease: "back.out(2)" },
        0,
      );
      break;
    case "retrieve":
      tl.fromTo(q("[data-sc='doc']"), { autoAlpha: 0, x: -18, rotate: -8 }, { autoAlpha: 1, x: 0, rotate: 0, duration: 0.45, stagger: 0.14 }, 0);
      break;
    case "validate":
      tl.fromTo(q("[data-sc='badge']"), { autoAlpha: 0, y: 6 }, { autoAlpha: 1, y: 0, duration: 0.35, stagger: 0.2 }, 0.1);
      break;
    case "file":
      tl.fromTo(q("[data-sc='env']"), { x: -10, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 0.45 }, 0).fromTo(q("[data-sc='sent']"), { autoAlpha: 0, scale: 0.6 }, { autoAlpha: 1, scale: 1, duration: 0.3, ease: "back.out(2)" }, 0.45);
      break;
    case "erp":
      tl.fromTo(q("[data-sc='row']"), { autoAlpha: 0, y: 6 }, { autoAlpha: 1, y: 0, duration: 0.35, stagger: 0.15 }, 0);
      break;
  }
  return tl;
}

export default function PenScene({ kind, run, delay = 0 }: { kind: SceneKind; run: number; delay?: number }) {
  const root = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = root.current;
    if (!run || !el || prefersReducedMotion()) return;
    const tl = play(kind, el).delay(delay);
    return () => void tl.progress(1).kill();
  }, [kind, run, delay]);

  return (
    <div ref={root} className={s.scene} aria-hidden="true">
      {kind === "pull" && (
        <ul className={s.rows}>
          {LINES.map((l) => (
            <li key={l.src} className={s.row} data-sc="row">
              <SourcePill>{l.src}</SourcePill>
              <span className={s.code}>{l.code}</span>
              <Glyph k="clip" className={s.clip} />
              <span className={s.amt}>{l.amt}</span>
            </li>
          ))}
        </ul>
      )}

      {kind === "check" && (
        <div className={s.stack}>
          <span className={s.line}>
            <SourcePill>UNFI</SourcePill>
            <span className={s.code}>MCB</span>
            <span className={s.arrow}>→</span>
            <span data-sc="chip">
              <TypeChip category="promo">Promo</TypeChip>
            </span>
          </span>
          <span className={s.why} data-sc="why">
            <Glyph k="eye" />
            Matched to your invoice and promo
          </span>
        </div>
      )}

      {kind === "dispute" && (
        <div className={s.stack}>
          <span className={s.line}>
            <b className={s.strong}>UNFI · Promo</b>
            <span className={s.amt}>$1,240</span>
          </span>
          <span className={s.line}>
            <span className={s.docs}>
              {["Invoice", "Promo", "Backup"].map((d) => (
                <span key={d} className={s.doc} data-sc="doc">
                  <Glyph k="file" />
                  {d}
                </span>
              ))}
            </span>
          </span>
          <span className={s.line}>
            <span className={s.btn} data-sc="btn">
              <Glyph k="user" />
              Confirm
            </span>
            <span className={s.filed} data-sc="filed">
              Filed
            </span>
          </span>
        </div>
      )}

      {kind === "recover" && (
        <div className={s.stack}>
          <span className={s.track}>
            <i className={s.trackFill} data-sc="fill" />
            {["Filed", "Pending", "Paid"].map((t) => (
              <span key={t} className={s.node} data-sc="node">
                <i />
                {t}
              </span>
            ))}
          </span>
          <span className={s.line}>
            <span className={s.code}>Booked · GL 4310</span>
            <span className={s.amt}>$1,240</span>
          </span>
        </div>
      )}

      {kind === "retrieve" && (
        <div className={s.pile}>
          {[0, 1, 2].map((i) => (
            <span key={i} className={s.paperDoc} data-sc="doc">
              <Glyph k="file" />
            </span>
          ))}
          <span className={s.into}>
            <Glyph k="arrow" />
          </span>
          <span className={s.vault}>Glimpse</span>
        </div>
      )}

      {kind === "validate" && (
        <div className={s.stack}>
          <span className={s.line}>
            <Glyph k="file" className={s.clip} />
            <b className={s.strong}>Deduction</b>
            <span className={s.amt}>$412.50</span>
          </span>
          <span className={s.badges}>
            <span className={s.badge} data-sc="badge">
              <Glyph k="check" />
              AI agents
            </span>
            <span className={s.badge} data-sc="badge">
              <Glyph k="check" />
              Experts, edge cases
            </span>
          </span>
        </div>
      )}

      {kind === "file" && (
        <div className={s.stack}>
          <span className={s.env} data-sc="env">
            <Glyph k="mail" />
            Dispute, filed by a specialist
          </span>
          <span className={s.sent} data-sc="sent">
            <Glyph k="check" />
            Sent before the window closes
          </span>
        </div>
      )}

      {kind === "erp" && (
        <ul className={s.rows}>
          <li className={`${s.row} ${s.ledgerHead}`} data-sc="row">
            <Glyph k="book" className={s.clip} />
            Your ERP
          </li>
          <li className={s.row} data-sc="row">
            <span className={s.code}>Recovered</span>
            <span className={s.amt}>applied</span>
          </li>
        </ul>
      )}
    </div>
  );
}
