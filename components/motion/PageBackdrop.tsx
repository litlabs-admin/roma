"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { prefersReducedMotion, queryAllVisible, queryVisible } from "@/lib/motion";
import s from "./backdrop.module.css";

/**
 * Page-wide colour backdrop — Roma's port of Fruitful's pageBackground.js.
 *
 * One fixed layer sits behind the whole page (z-index −1, under every section — Roma's
 * sections have no fill, so it shows straight through). Its colour stops are stacked
 * radial layers whose opacity is scrubbed by scroll, linear (`ease: none`, `scrub:
 * true`), so smoothing comes from Lenis alone and the journey reverses exactly on the
 * way back up. The radial highlight stays centred in the viewport while content slides
 * over it — that is where the depth comes from.
 *
 * Journey: cream → light red (enters with `[data-backdrop="light"]`) → red (enters with
 * `[data-backdrop="red"]`) over the ranges below (Fruitful uses `top bottom → top 40%`;
 * Roma starts later so each section arrives on the previous colour and changes while
 * you read it). Mounted after the sections so it measures them last.
 */

/**
 * Scroll ranges per layer (ScrollTrigger start/end on the layer's section).
 * - light: the compliance section arrives on cream and the light red builds while you
 *   read through it, complete as its bottom reaches 75% of the viewport.
 * - red: picks up straight after, as the stories section rises (top 80% → top 25%).
 * Stories' text-colour crossfade uses the same red range.
 */
export const BACKDROP_RANGES = {
  light: { start: "top 50%", end: "bottom 75%" },
  red: { start: "top 80%", end: "top 25%" },
} as const;

export default function PageBackdrop() {
  const root = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
    // Reduced motion: no scroll-linked colour; the sections paint their own static
    // bands instead (see their [data-static] rules).
    // Visible sections only: a previously visited route may still be in the DOM, hidden.
    if (prefersReducedMotion()) {
      const secs = queryAllVisible("[data-backdrop]");
      secs.forEach((sec) => sec.setAttribute("data-static", ""));
      return () => secs.forEach((sec) => sec.removeAttribute("data-static"));
    }

    const ctx = gsap.context(() => {
      el.querySelectorAll<HTMLElement>("[data-layer]").forEach((layer) => {
        const key = layer.dataset.layer as keyof typeof BACKDROP_RANGES;
        const trigger = queryVisible(`[data-backdrop="${key}"]`);
        if (!trigger || !BACKDROP_RANGES[key]) return;
        gsap.fromTo(
          layer,
          { opacity: 0 },
          { opacity: 1, ease: "none", scrollTrigger: { trigger, ...BACKDROP_RANGES[key], scrub: true } },
        );
      });
    }, el);

    const refresh = () => ScrollTrigger.refresh();
    document.fonts?.ready.then(refresh);
    window.addEventListener("load", refresh);
    return () => {
      window.removeEventListener("load", refresh);
      ctx.revert();
    };
  }, []);

  return (
    <div ref={root} className={s.backdrop} aria-hidden="true">
      <div className={`${s.layer} ${s.light}`} data-layer="light" />
      <div className={`${s.layer} ${s.red}`} data-layer="red" />
    </div>
  );
}
