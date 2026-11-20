"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { prefersReducedMotion } from "@/lib/motion";
import s from "./rolling.module.css";

/**
 * Odometer figure (DESIGN.md §G.17/§G.18): each digit is a 0–9 strip that rolls to its
 * value (transform only, 700ms --ease-out, staggered from the right). `rollIn` starts the
 * digits at 0 and rolls them up the first time the figure is on screen. Server markup is
 * the final value; screen readers get the whole figure as one label.
 */
export default function RollingNumber({ text, className = "", rollIn = false }: { text: string; className?: string; rollIn?: boolean }) {
  const ref = useRef<HTMLSpanElement>(null);
  // Before the roll-in plays, every digit sits at 0.
  const [armed, setArmed] = useState(false);
  const [played, setPlayed] = useState(!rollIn);

  useEffect(() => {
    if (!rollIn || prefersReducedMotion()) return;
    const el = ref.current;
    if (!el) return;
    const raf = requestAnimationFrame(() => setArmed(true));
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          io.disconnect();
          // two frames: let the zeroed strips paint before they roll
          requestAnimationFrame(() => requestAnimationFrame(() => setPlayed(true)));
        }
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, [rollIn]);

  const zero = armed && !played;
  const chars = Array.from(text);
  const digitsTotal = chars.filter((ch) => /\d/.test(ch)).length;
  let digitIndex = 0;

  return (
    <span ref={ref} className={`${s.odo} ${className}`} aria-label={text} role="img">
      {chars.map((ch, i) => {
        // key from the right so a growing figure keeps its lower digits in place
        const key = chars.length - i;
        if (!/\d/.test(ch)) {
          return (
            <span key={`c${key}`} className={s.char} aria-hidden="true">
              {ch === " " ? " " : ch}
            </span>
          );
        }
        const fromRight = digitsTotal - 1 - digitIndex++;
        const d = zero ? 0 : Number(ch);
        return (
          <span key={`d${key}`} className={s.digit} aria-hidden="true">
            {/* sizer keeps the digit's own width */}
            <span className={s.sizer}>{ch}</span>
            <span className={s.strip} style={{ "--d": d, "--i": fromRight } as CSSProperties}>
              {"0123456789".split("").map((n) => (
                <span key={n}>{n}</span>
              ))}
            </span>
          </span>
        );
      })}
    </span>
  );
}
