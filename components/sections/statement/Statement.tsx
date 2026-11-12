"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/motion";
import { statement } from "@/lib/content/site";
import s from "./statement.module.css";

/**
 * Brand statement (DESIGN.md §G.1b). Words fill from muted to full colour in reading
 * order, scrubbed to scroll so the reveal reverses on the way back up.
 *
 * SSR markup is the finished state (ink + red). The client sets the muted start colour
 * only when motion is allowed. The split copy is aria-hidden; screen readers and
 * crawlers get the clean sentence from the sr-only paragraph.
 */

const fullText = statement.segments.map((seg) => seg.text).join(" ");
const words = statement.segments.flatMap((seg) => seg.text.split(/\s+/).map((w) => ({ w, hl: !!seg.highlight })));

export default function Statement() {
  const root = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const el = root.current;
    if (!el || prefersReducedMotion()) return;

    // Tokens stay the single source of truth for every colour in the reveal.
    const css = getComputedStyle(document.documentElement);
    const muted = css.getPropertyValue("--color-sand-400").trim();
    const ink = css.getPropertyValue("--color-ink-900").trim();
    const red = css.getPropertyValue("--color-red-600").trim();

    const ctx = gsap.context(() => {
      const spans = gsap.utils.toArray<HTMLElement>("[data-word]", el);
      gsap.fromTo(
        spans,
        { color: muted },
        {
          color: (_i: number, w: HTMLElement) => (w.hasAttribute("data-hl") ? red : ink),
          duration: 1,
          stagger: 0.35, // soft ~3-word reading front instead of a hard per-word switch
          ease: "none",
          scrollTrigger: { trigger: el, start: "top 75%", end: "bottom 55%", scrub: 0.6 },
        },
      );
    }, el);

    const refresh = () => ScrollTrigger.refresh();
    document.fonts?.ready.then(refresh);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} className={s.section} aria-labelledby="statement-title">
      <h2 id="statement-title" className="sr-only">
        {statement.label}
      </h2>
      <p className="sr-only">{fullText}</p>
      <p className={s.text} aria-hidden="true">
        {words.map(({ w, hl }, i) => (
          <span key={i}>
            <span data-word data-hl={hl || undefined} className={hl ? s.hl : undefined}>
              {w}
            </span>{" "}
          </span>
        ))}
      </p>
    </section>
  );
}
