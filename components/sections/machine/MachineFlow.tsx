"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/motion";
import DreamMachine from "./DreamMachine";
import BuiltForYou from "./BuiltForYou";
import { initFlowLine } from "./flowLine";
import { initCards, initStepScenes } from "./timelines";
import s from "./machine.module.css";

/**
 * Recovery machine → Built for finance teams of any size. Roma's port of Fruitful's `.dm-flow` block:
 * two sections sharing one wrapper so a single scroll-drawn line can run from above the
 * card grid, around both columns and down through every step circle.
 *
 * SSR markup is the finished state. On the client: scrubbed character highlight on the
 * heading, one-shot card entrances (top 90%, ×1.45), the on-screen-only marquee, step
 * scenes (top 85%) and the connector. Reduced motion: everything stays finished and the
 * line is drawn in full.
 */
export default function MachineFlow() {
  const root = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = root.current;
    if (!el) return;

    if (prefersReducedMotion()) {
      el.setAttribute("data-static", "");
      return initFlowLine(el, false);
    }

    let cleanupLine = () => {};
    const ctx = gsap.context(() => {
      // Heading highlight (Fruitful global.js toggleHighlightText).
      el.querySelectorAll("[data-mf-highlight]").forEach((h) => {
        gsap.fromTo(
          h.querySelectorAll("[data-char]"),
          { opacity: 0.4 },
          { opacity: 1, stagger: 0.02, duration: 0.2, ease: "none", scrollTrigger: { trigger: h, start: "top bottom", end: "top 30%", scrub: true } },
        );
      });

      initCards(el);
      initStepScenes(el);
      cleanupLine = initFlowLine(el, true);
    }, el);

    const refresh = () => ScrollTrigger.refresh();
    document.fonts?.ready.then(refresh);
    window.addEventListener("load", refresh);
    return () => {
      window.removeEventListener("load", refresh);
      cleanupLine();
      ctx.revert();
    };
  }, []);

  return (
    <div ref={root} className={s.flow}>
      <div className={s.flowLine} data-mf-flow aria-hidden="true">
        <svg fill="none">
          <defs>
            <linearGradient id="mf-flow-fade" gradientUnits="userSpaceOnUse" x1="0" x2="0">
              <stop offset="0" stopColor="#B21515" />
              <stop offset="1" stopColor="#B21515" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path data-mf="flow-branch" stroke="url(#mf-flow-fade)" fill="none" strokeLinecap="round" />
          <path data-mf="flow-branch" stroke="url(#mf-flow-fade)" fill="none" strokeLinecap="round" />
          <circle data-mf="flow-dot" fill="#B21515" />
        </svg>
      </div>
      <DreamMachine />
      <BuiltForYou />
    </div>
  );
}
