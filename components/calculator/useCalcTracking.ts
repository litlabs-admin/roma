"use client";

import { useCallback, useEffect, useRef } from "react";
import { debounced, track } from "@/lib/calculator/track";
import { valueBand } from "@/lib/calculator/math";

/** Brief §2.10 events for one calculator instance (full page or compact embed). */
export function useCalcTracking(variant: "full" | "compact") {
  const root = useRef<HTMLDivElement | null>(null);
  const started = useRef(false);
  const resultSeen = useRef(false);
  const deb = useRef<ReturnType<typeof debounced> | null>(null);

  const page = () => (typeof window === "undefined" ? "" : window.location.pathname);

  // calculator_view: once, when the calculator (or embed) enters the viewport.
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    deb.current = debounced(1000);
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          track("calculator_view", { source_page: page(), variant });
          io.disconnect();
        }
      },
      { threshold: 0.25 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      deb.current?.cancel();
    };
  }, [variant]);

  /** Call on every input change; `value` is the new total so result_view can band it. */
  const onInput = useCallback((field: string, value: number) => {
    if (!started.current) {
      started.current = true;
      track("calculator_start", { source_page: page() });
    }
    if (!resultSeen.current) {
      resultSeen.current = true;
      track("calculator_result_view", { value_band: valueBand(value) });
    }
    deb.current?.run(field, () => track("calculator_input_change", { field }));
  }, []);

  const onCta = useCallback((cta: string) => track("calculator_cta_click", { cta, source_page: page() }), []);

  return { root, onInput, onCta, page };
}
