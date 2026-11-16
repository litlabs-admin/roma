"use client";

import { gsap, ScrollTrigger } from "@/lib/gsap";

/**
 * Motion helpers shared by the /platform sections (DESIGN.md §F).
 * Call inside a gsap.context so ctx.revert() removes every tween and trigger.
 */

/** One-shot reveal: 16px rise, 0.5s, 90ms stagger (Hyperline reveal, Roma tokens). */
export const REVEAL = { y: 16, duration: 0.5, stagger: 0.09, start: "top 85%" } as const;

export function rise(targets: gsap.TweenTarget, trigger: Element | null, vars: gsap.TweenVars & { start?: string } = {}) {
  if (!trigger) return;
  const { start = REVEAL.start, ...rest } = vars;
  gsap.fromTo(
    targets,
    { autoAlpha: 0, y: REVEAL.y },
    { autoAlpha: 1, y: 0, duration: REVEAL.duration, ease: "power3.out", stagger: REVEAL.stagger, ...rest, scrollTrigger: { trigger, start, once: true } },
  );
}

/** Plays a paused timeline once, the first time `trigger` reaches `start`. */
export function playOnce(trigger: Element | null, tl: gsap.core.Timeline, start = "top 80%") {
  if (!trigger) return;
  tl.pause();
  ScrollTrigger.create({ trigger, start, once: true, onEnter: () => void tl.play() });
}

/**
 * Re-measure triggers once layout is final. `load` does not fire again after a client
 * navigation, so also refresh on the next frame and when fonts settle.
 */
export function refreshWhenReady(): () => void {
  const refresh = () => ScrollTrigger.refresh();
  const raf = requestAnimationFrame(refresh);
  document.fonts?.ready.then(refresh);
  window.addEventListener("load", refresh);
  return () => {
    cancelAnimationFrame(raf);
    window.removeEventListener("load", refresh);
  };
}

/** Reads a colour token so GSAP can tween to/from it (it can't tween `var(...)`). */
export function token(name: string) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}
