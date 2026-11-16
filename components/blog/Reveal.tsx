"use client";

import { useLayoutEffect, useRef, type ElementType, type ReactNode } from "react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/motion";
import { REVEAL, refreshWhenReady, rise } from "@/components/platform/motion";

type Props = {
  children: ReactNode;
  /** "group": every [data-reveal] rises together with an 80ms stagger when the wrapper enters.
   *  "each": every [data-reveal] rises on its own as it reaches the viewport. */
  mode?: "group" | "each";
  as?: ElementType;
  className?: string;
  id?: string;
  "aria-labelledby"?: string;
};

/**
 * One-shot scroll reveal for the blog (DESIGN.md §F.4/§G.10): 16px rise, 0.5s, power3.out.
 * Server markup is the final state; GSAP only sets the start state on mount (§F.10).
 */
export default function Reveal({ children, mode = "group", as: Tag = "div", className, ...rest }: Props) {
  const root = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const el = root.current;
    if (!el || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      const targets = gsap.utils.toArray<HTMLElement>(el.querySelectorAll("[data-reveal]"));
      if (!targets.length) return;
      if (mode === "group") rise(targets, el, { stagger: 0.08 });
      else targets.forEach((t) => rise(t, t, { start: REVEAL.start }));
    }, el);
    const stop = refreshWhenReady();
    return () => {
      stop();
      ctx.revert();
    };
  }, [mode]);

  return (
    <Tag ref={root} className={className} {...rest}>
      {children}
    </Tag>
  );
}
