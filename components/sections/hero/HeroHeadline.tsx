"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/motion";
import s from "./hero.module.css";

type Line = { before: string; accent: string; after: string };

const HOLD = 3.6; // s each line stays put (Different AI)

/** Words as inline-blocks; the accent phrase is one unit so it can "lean" in. */
function Words({ line }: { line: Line }) {
  const words = line.before.trim().split(/\s+/);
  return (
    <>
      {words.map((w, i) => (
        <span key={i}>
          <span className={s.w} data-w>
            {w}
          </span>{" "}
        </span>
      ))}
      <span className={`${s.w} ${s.accentWord}`} data-w data-accent>
        <span className="accent">{line.accent}</span>
        {line.after}
      </span>
    </>
  );
}

/**
 * Rotating H1 (Different AI `__dfxHeadline`). Both lines are stacked in one grid
 * cell, so the heading is always as tall as the taller line — nothing below moves.
 */
export default function HeroHeadline({ id, lines }: { id: string; lines: Line[] }) {
  const ref = useRef<HTMLHeadingElement>(null);

  useLayoutEffect(() => {
    const h = ref.current;
    if (!h) return;
    const layers = Array.from(h.querySelectorAll<HTMLElement>("[data-line]"));
    const wordsOf = (i: number) => layers[i].querySelectorAll<HTMLElement>("[data-w]");

    const reduce = prefersReducedMotion();
    gsap.set(layers.slice(1), { autoAlpha: 0 });
    if (reduce) return;

    // Start state for the entrance (set synchronously before paint of the next frame).
    gsap.set(wordsOf(0), { autoAlpha: 0, y: "0.45em", filter: "blur(8px)" });

    let visible = true;
    const io = new IntersectionObserver((e) => (visible = e[0].isIntersecting));
    io.observe(h);

    let current = 0;
    let delayed: gsap.core.Tween | null = null;

    const wordsIn = (i: number, first = false) => {
      gsap.set(layers[i], { autoAlpha: 1 });
      const tl = gsap.timeline({
        onComplete: () => {
          delayed = gsap.delayedCall(HOLD, next);
        },
      });
      tl.fromTo(
        wordsOf(i),
        { autoAlpha: 0, y: "0.45em", filter: "blur(8px)" },
        { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 0.9, ease: "power3.out", stagger: 0.07, clearProps: "filter" },
      );
      if (first) {
        // the serif accent "leans" upright as it lands (Different AI `__dfxLean`)
        const accent = layers[i].querySelector("[data-accent]");
        const at = (wordsOf(i).length - 1) * 0.07;
        tl.fromTo(accent, { skewX: 16 }, { skewX: 0, duration: 1.1, ease: "power3.inOut" }, at);
      }
    };

    const next = () => {
      if (!visible || document.hidden) {
        delayed = gsap.delayedCall(0.5, next);
        return;
      }
      gsap.to(wordsOf(current), {
        y: "-0.35em",
        autoAlpha: 0,
        filter: "blur(6px)",
        duration: 0.5,
        ease: "power2.in",
        stagger: 0.04,
        onComplete: () => {
          gsap.set(layers[current], { autoAlpha: 0 });
          current = (current + 1) % layers.length;
          wordsIn(current);
        },
      });
    };

    const hero = h.closest("[data-hero]");
    const start = () => wordsIn(0, true);
    hero?.addEventListener("hero:headline-in", start, { once: true });

    return () => {
      io.disconnect();
      delayed?.kill();
      hero?.removeEventListener("hero:headline-in", start);
      gsap.killTweensOf(h.querySelectorAll("[data-w]"));
    };
  }, []);

  return (
    <h1 ref={ref} id={id} className={`${s.h1} type-display`} aria-label={`${lines[0].before}${lines[0].accent}${lines[0].after}`}>
      {lines.map((line, i) => (
        <span key={i} className={s.line} data-line aria-hidden="true">
          <Words line={line} />
        </span>
      ))}
    </h1>
  );
}
