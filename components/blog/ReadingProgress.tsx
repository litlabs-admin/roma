"use client";

import { useEffect, useRef } from "react";
import { clamp, prefersReducedMotion } from "@/lib/motion";
import a from "./article.module.css";

/**
 * 2px red-600 bar fixed under the nav: how far through the article body you are
 * (DESIGN.md §G.10). Explains a state, never loops; hidden under reduced motion.
 */
export default function ReadingProgress({ target }: { target: string }) {
  const bar = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = bar.current;
    const body = document.getElementById(target);
    if (!el || !body || prefersReducedMotion()) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = body.getBoundingClientRect();
      const start = window.innerHeight * 0.35;
      const p = clamp((start - r.top) / Math.max(1, r.height - window.innerHeight * 0.5), 0, 1);
      el.style.transform = `scaleX(${p})`;
      el.dataset.visible = p > 0 && p < 1 ? "true" : "false";
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [target]);

  return <div ref={bar} className={a.progress} data-visible="false" aria-hidden="true" />;
}
