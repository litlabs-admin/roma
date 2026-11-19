"use client";

import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { useCompare } from "./context";
import s from "./cite.module.css";

/**
 * Footnote marker for the comparison pages (DESIGN.md §G.13). Competitor claims only. A small numbered button; it
 * shows its source (verbatim quote, where, link) on hover (pointer devices) or on
 * click/Enter (everyone). Esc or an outside click closes it and focus stays on the
 * marker. The numbered source list at the foot of the working paper is the static,
 * always-available version of the same information.
 */

export default function Cite({ id, tone = "light" }: { id: string; tone?: "light" | "dark" }) {
  const { c, order } = useCompare();
  const src = c.sources[id];
  const n = order.indexOf(id) + 1;
  const pid = useId();
  const [open, setOpen] = useState(false);
  const [shift, setShift] = useState(0);
  const wrap = useRef<HTMLSpanElement>(null);
  const pop = useRef<HTMLSpanElement>(null);
  const external = src.url.startsWith("http");

  // Keep the popover inside the viewport (16px gutter).
  useLayoutEffect(() => {
    if (!open || !pop.current) return;
    const r = pop.current.getBoundingClientRect();
    const g = 16;
    const over = r.right - shift - (window.innerWidth - g);
    const under = g - (r.left - shift);
    setShift(over > 0 ? -over : under > 0 ? under : 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onDown = (e: PointerEvent) => {
      if (wrap.current && !wrap.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
    };
  }, [open]);

  return (
    <span ref={wrap} className={`${s.wrap} ${tone === "dark" ? s.dark : ""} ${open ? s.isOpen : ""}`}>
      <button
        type="button"
        className={s.mark}
        aria-expanded={open}
        aria-controls={pid}
        aria-label={`Source ${n}: ${src.where}`}
        onClick={() => setOpen((o) => !o)}
      >
        {n}
      </button>
      <span ref={pop} id={pid} role="note" className={s.pop} style={{ ["--shift" as string]: `${shift}px` }}>
        <span className={s.who}>{c.name}, in its words</span>
        <q className={s.quote}>{src.quote}</q>
        <a className={s.link} href={src.url} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
          {src.where}
          <span aria-hidden="true"> ↗</span>
        </a>
      </span>
    </span>
  );
}
