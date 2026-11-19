"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { prefersReducedMotion, queryVisible } from "@/lib/motion";

/**
 * Lenis wired exactly as Fruitful does it (DESIGN.md §F.1): Lenis drives the
 * scroll, ScrollTrigger updates on every Lenis tick, GSAP's ticker drives Lenis.
 * Off for reduced motion and touch-first devices (native momentum is better).
 */
export default function SmoothScroll() {
  useEffect(() => {
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    if (prefersReducedMotion() || coarse) return;

    const lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 1 });
    (window as unknown as { __lenis?: Lenis }).__lenis = lenis;
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      delete (window as unknown as { __lenis?: Lenis }).__lenis;
    };
  }, []);

  return null;
}

/**
 * Scroll to an element through Lenis when present (keeps easing consistent). Native
 * scrolling honours the target's `scroll-margin-top`; Lenis doesn't, so it's passed as
 * the offset. Visible match first: a cached previous route may still be in the DOM.
 */
export function scrollToTarget(target: string | HTMLElement) {
  const lenis = (window as unknown as { __lenis?: Lenis }).__lenis;
  const el = typeof target === "string" ? (queryVisible<HTMLElement>(target) ?? document.querySelector<HTMLElement>(target)) : target;
  if (lenis) {
    const margin = el ? parseFloat(getComputedStyle(el).scrollMarginTop) || 0 : 0;
    lenis.scrollTo(el ?? target, { duration: 1.4, offset: -margin });
  } else el?.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth" });
}
