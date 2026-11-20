"use client";

import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/motion";
import { useCompare } from "./context";
import s from "./switch.module.css";

/**
 * The "With X / With Roma" switch (DESIGN.md §G.13), the homepage hero's idea applied to
 * each comparison: the card opens on the competitor's way, in its own cited words, with
 * one button, "See what Roma does better". Pressing it plays the Roma version and the
 * button becomes a two-way toggle (focus moves onto it). A switch folds the current
 * side's rows (`data-sw-item`) away, then flips the new side's rows down into place. Each page puts a different
 * comparison inside, so the interaction is shared and the content is not.
 */

export type Side = "them" | "roma";

export function SwitchBar({ label, side, touched, onPick }: { label: string; side: Side; touched: boolean; onPick: (next: Side) => void }) {
  const { c } = useCompare();
  const romaBtn = useRef<HTMLButtonElement>(null);
  const wasTouched = useRef(touched);

  // Keep focus on the control when the CTA turns into the toggle (as the homepage hero).
  useLayoutEffect(() => {
    if (touched && !wasTouched.current) romaBtn.current?.focus({ preventScroll: true });
    wasTouched.current = touched;
  }, [touched]);

  return (
    <div className={s.bar}>
      <span className={s.barLabel}>{label}</span>
      {touched ? (
        <div className={s.toggle} role="group" aria-label={`Compare ${c.name} and Roma`}>
          <span className={s.thumb} data-side={side} aria-hidden="true" />
          <button type="button" className={s.opt} aria-pressed={side === "them"} onClick={() => onPick("them")}>
            With {c.name}
          </button>
          <button ref={romaBtn} type="button" className={s.opt} aria-pressed={side === "roma"} onClick={() => onPick("roma")}>
            With Roma
          </button>
        </div>
      ) : (
        <button type="button" className={s.cta} onClick={() => onPick("roma")}>
          See what Roma does better
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M3 8h10M9 4l4 4-4 4" />
          </svg>
        </button>
      )}
    </div>
  );
}

type Props = {
  label: string;
  /** Each side gets `active` so it can play its own entrance when shown. */
  them: (active: boolean) => ReactNode;
  roma: (active: boolean) => ReactNode;
  /** Screen-reader line announced after each switch. */
  announce: Record<Side, string>;
  /** One-line takeaway per side, in a strip under the art (Roma's in red). */
  takeaway?: Record<Side, string>;
  /** A control shared by both sides (e.g. Promomash's volume chips), under the bar. */
  toolbar?: ReactNode;
  /** Flat bottom corners, for hero art that sits on the band's edge. */
  flush?: boolean;
  className?: string;
};

export default function SwitchCard({ label, them, roma, announce, takeaway, toolbar, flush = false, className = "" }: Props) {
  const { c } = useCompare();
  const [side, setSide] = useState<Side>("them");
  const [touched, setTouched] = useState(false);
  const [said, setSaid] = useState("");
  const root = useRef<HTMLDivElement>(null);
  const first = useRef(true);
  const busy = useRef(false);

  // The pieces of a side that flip in and out, row by row (`data-sw-item`); the whole
  // layer when a side marks none.
  const items = (el: HTMLElement, which: Side) => {
    const layer = el.querySelector<HTMLElement>(`[data-layer='${which}']`);
    if (!layer) return [];
    const marked = Array.from(layer.querySelectorAll<HTMLElement>("[data-sw-item]"));
    return marked.length ? marked : [layer];
  };

  // Incoming half: the new side's rows flip down into place, one after another.
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
    const old = items(el, side === "roma" ? "them" : "roma");
    gsap.set(old, { clearProps: "transform,opacity,visibility" });
    const tl = gsap.timeline({ defaults: { ease: "power3.out" }, onComplete: () => void (busy.current = false) });
    tl.fromTo(
      items(el, side),
      { autoAlpha: 0, y: 14, rotateX: -55, transformPerspective: 700, transformOrigin: "50% 0%" },
      { autoAlpha: 1, y: 0, rotateX: 0, duration: 0.55, stagger: 0.07, clearProps: "transform,opacity,visibility" },
      0,
    ).fromTo(q("[data-sw='take']"), { autoAlpha: 0, y: 6 }, { autoAlpha: 1, y: 0, duration: 0.45, clearProps: "transform,opacity,visibility" }, 0.25);
    return () => void tl.progress(1).kill();
  }, [side]);

  const pick = (next: Side) => {
    setTouched(true);
    if (next === side || busy.current) return;
    setSaid(announce[next]);
    const el = root.current;
    if (!el || prefersReducedMotion()) {
      setSide(next);
      return;
    }
    // Outgoing half: the current side's rows fold away, then the side flips.
    busy.current = true;
    gsap.to(items(el, side), {
      autoAlpha: 0,
      y: -10,
      rotateX: 45,
      transformPerspective: 700,
      transformOrigin: "50% 100%",
      duration: 0.22,
      stagger: 0.035,
      ease: "power2.in",
      onComplete: () => setSide(next),
    });
  };

  return (
    <div ref={root} className={`${s.card} ${flush ? s.flush : ""} ${className}`}>
      <SwitchBar label={label} side={side} touched={touched} onPick={pick} />
      <p className="sr-only" aria-live="polite">
        {said}
      </p>
      {toolbar && <div className={s.toolbar}>{toolbar}</div>}
      <div className={s.stack}>
        <div className={s.layer} data-layer="them" data-on={side === "them"} inert={side !== "them"} aria-hidden={side !== "them"}>
          {them(side === "them")}
        </div>
        <div className={s.layer} data-layer="roma" data-on={side === "roma"} inert={side !== "roma"} aria-hidden={side !== "roma"}>
          {roma(side === "roma")}
        </div>
      </div>
      {takeaway && (
        <p className={`${s.take} ${side === "roma" ? s.takeRoma : ""}`} data-sw="take">
          <b>{side === "roma" ? "With Roma" : `With ${c.name}`}</b>
          <span>{takeaway[side]}</span>
        </p>
      )}
    </div>
  );
}
