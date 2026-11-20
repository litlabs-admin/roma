"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/motion";
import { playOnce } from "@/components/platform/motion";

type Q = (sel: string) => Element[];

/**
 * Plays an illustration's one state change the first time it scrolls into view
 * (DESIGN.md §A.6.4, §F.10). `build` takes the art from its start to its finished state;
 * the SSR markup is already the finished state, so nothing is lost without JS or under
 * reduced motion. Returns the ref for the art's root.
 */
export function usePlayOnce<T extends HTMLElement = HTMLDivElement>(build: (q: Q, tl: gsap.core.Timeline) => void, start = "top 85%") {
  const root = useRef<T>(null);
  const buildRef = useRef(build);
  useLayoutEffect(() => {
    const el = root.current;
    if (!el || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      buildRef.current(gsap.utils.selector(el), tl);
      playOnce(el, tl, start);
    }, el);
    return () => ctx.revert();
  }, [start]);
  return root;
}
