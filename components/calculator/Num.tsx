"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/motion";

/**
 * A figure that counts to its new value when it changes (§F.3 state, 450ms, power3.out).
 * Server markup is the final figure; the tween writes textContent directly, so React
 * doesn't re-render per frame. `format` must be stable (a module-level function).
 * `from` (optional) counts up from that value on mount, e.g. 0 when a block unlocks.
 */
export default function Num({
  value,
  format,
  className,
  from,
  delay = 0,
}: {
  value: number;
  format: (v: number) => string;
  className?: string;
  from?: number;
  delay?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const shown = useRef<number>(from ?? value);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const start = shown.current;
    if (start === value || !Number.isFinite(value) || !Number.isFinite(start) || prefersReducedMotion()) {
      shown.current = value;
      el.textContent = format(value);
      return;
    }
    const o = { v: start };
    el.textContent = format(start);
    const tw = gsap.to(o, {
      v: value,
      duration: from !== undefined && start === from ? 0.9 : 0.45,
      delay,
      ease: "power3.out",
      onUpdate: () => {
        shown.current = o.v;
        el.textContent = format(o.v);
      },
      onComplete: () => {
        shown.current = value;
        el.textContent = format(value);
      },
    });
    return () => {
      tw.kill();
    };
    // `from` and `delay` only matter for the first run.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, format]);

  return (
    <span ref={ref} className={className}>
      {format(value)}
    </span>
  );
}
