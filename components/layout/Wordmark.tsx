"use client";

import { Fraunces } from "next/font/google";
import { useLayoutEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/motion";
import s from "./footer.module.css";

// Heavy serif close to the Roma logo's letterforms (runroma.com's display serif).
// Only used here, at the very bottom of the page, so it isn't preloaded.
const fraunces = Fraunces({ subsets: ["latin"], weight: "800", display: "swap", preload: false });

/** VISIBLE share of the x-height; the rest runs past the bottom edge of the page. */
const VISIBLE = 0.65;

/** The Roma rosette — outer ring + six interlocking circles — as the "o". */
function Rosette({ className }: { className?: string }) {
  const r = 16.5;
  return (
    <svg className={className} viewBox="0 0 100 100" fill="none" stroke="currentColor" aria-hidden="true">
      <circle cx="50" cy="50" r="46" strokeWidth="6.5" />
      <g strokeWidth="5">
        {[0, 60, 120, 180, 240, 300].map((a) => {
          const rad = (a * Math.PI) / 180;
          // fixed precision so server and client render identical attributes
          const cx = (50 + r * Math.cos(rad)).toFixed(3);
          const cy = (50 + r * Math.sin(rad)).toFixed(3);
          return <circle key={a} cx={cx} cy={cy} r={r} />;
        })}
      </g>
    </svg>
  );
}

/**
 * Oversized "roma" closing the page. All four letters are x-height letters, so the
 * rosette (sized to exactly 1ex) measures the x-height: the word is scaled to fill the
 * container, lifted so its x-height top meets the clip's top, and the clip shows 65% of
 * it — the rest continues past the bottom edge of the canvas.
 */
export default function Wordmark() {
  const clip = useRef<HTMLDivElement>(null);
  const word = useRef<HTMLDivElement>(null);
  const o = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const box = clip.current;
    const w = word.current;
    const ring = o.current;
    if (!box || !w || !ring) return;

    const fit = () => {
      // 1. Scale the word to the content width (measured at 100px).
      const target = w.parentElement?.clientWidth ?? box.clientWidth;
      w.style.fontSize = "100px";
      const natural = w.getBoundingClientRect().width;
      const size = (target / natural) * 100;
      w.style.fontSize = `${size}px`;
      // 2. Align the x-height top with the clip's top; show VISIBLE of the x-height.
      const wb = w.getBoundingClientRect();
      const ob = ring.getBoundingClientRect();
      box.style.setProperty("--x-top", `${ob.top - wb.top}px`);
      box.style.height = `${ob.height * VISIBLE}px`;
    };

    fit();
    document.fonts?.ready.then(() => {
      fit();
      ScrollTrigger.refresh();
    });
    const ro = new ResizeObserver(fit);
    ro.observe(box);

    let ctx: gsap.Context | undefined;
    if (!prefersReducedMotion()) {
      ctx = gsap.context(() => {
        gsap.fromTo(
          box.querySelector("[data-rise]"),
          { yPercent: 35 },
          { yPercent: 0, duration: 0.9, ease: "power3.out", scrollTrigger: { trigger: box, start: "top bottom", once: true } },
        );
      }, box);
    }
    return () => {
      ro.disconnect();
      ctx?.revert();
    };
  }, []);

  return (
    <div ref={clip} className={s.wordClip} aria-hidden="true">
      <div data-rise className={s.wordRise}>
        <div ref={word} className={`${s.word} ${fraunces.className}`}>
          <span>r</span>
          <span ref={o} className={s.wordO}>
            <Rosette />
          </span>
          <span>ma</span>
        </div>
      </div>
    </div>
  );
}
