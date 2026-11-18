import type { CSSProperties, ReactNode } from "react";
import type { Category } from "@/lib/content/platform";
import m from "./mock.module.css";

/**
 * Shared kit for the /platform product mock-ups (DESIGN.md §A.6.3: product is the
 * illustration). Everything is HTML + inline SVG. Sizes are in `em`, so a piece scales
 * with whatever font-size its mock sets: rem in the hero window, container units
 * (`--u`) in the card wells.
 */

/** Money with cents, e.g. $1,284.50. Negative values get a leading minus. */
export function money(n: number, cents = true) {
  const abs = Math.abs(n).toLocaleString("en-US", {
    minimumFractionDigits: cents ? 2 : 0,
    maximumFractionDigits: cents ? 2 : 0,
  });
  return `${n < 0 ? "−" : ""}$${abs}`;
}

/** Place an absolutely positioned element on a `--u` canvas. */
export function at(x: number, y: number, w?: number, h?: number): CSSProperties {
  const u = (n: number) => `calc(var(--u) * ${n})`;
  return { position: "absolute", left: u(x), top: u(y), ...(w != null && { width: u(w) }), ...(h != null && { height: u(h) }) };
}

const CATEGORY_CLASS: Record<Category, string> = {
  promo: m.promo,
  shortage: m.shortage,
  fees: m.fees,
};

/** Deduction-type chip in the §B.4 data colours. */
export function TypeChip({ category, children }: { category: Category; children: ReactNode }) {
  return <span className={`${m.chip} ${CATEGORY_CLASS[category]}`}>{children}</span>;
}

/** Dark remittance/source pill (UNFI, KeHE, …). */
export function SourcePill({ children }: { children: ReactNode }) {
  return <span className={m.source}>{children}</span>;
}

export function StatusChip({ kind, children }: { kind: "matched" | "recoverable" | "pending" | "neutral"; children: ReactNode }) {
  const cls = { matched: m.matched, recoverable: m.recoverable, pending: m.pending, neutral: m.neutral }[kind];
  return (
    <span className={`${m.chip} ${cls}`}>
      {kind === "matched" && <Glyph k="check" />}
      {kind === "recoverable" && <span className={m.dot} />}
      {children}
    </span>
  );
}

const GLYPHS = {
  check: ["M3.5 8.5 6.5 11.5 12.5 5"],
  caret: ["M4.5 6.5 8 10l3.5-3.5"],
  search: ["M7.2 12.2a5 5 0 1 0 0-10 5 5 0 0 0 0 10z", "m10.8 10.8 3 3"],
  filter: ["M2.5 3.5h11l-4.2 5v4.5l-2.6-1.3V8.5z"],
  file: ["M4 1.8h5.2L12.5 5v9.2H4z", "M9 1.8V5h3.5M6 8.5h4.5M6 11h3"],
  download: ["M8 2.5v8M4.5 7.5 8 11l3.5-3.5", "M2.5 13.5h11"],
  book: ["M2.5 3h4a1.5 1.5 0 0 1 1.5 1.5V14a1.5 1.5 0 0 0-1.5-1.5h-4z", "M13.5 3h-4A1.5 1.5 0 0 0 8 4.5V14a1.5 1.5 0 0 1 1.5-1.5h4z"],
  user: ["M8 7.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z", "M3 13.5c.7-2.2 2.6-3.5 5-3.5s4.3 1.3 5 3.5"],
  link: ["M6.5 9.5 9.5 6.5", "M7.2 4.6 8.6 3.2a2.6 2.6 0 0 1 3.7 3.7l-1.4 1.4", "M8.8 11.4 7.4 12.8a2.6 2.6 0 0 1-3.7-3.7l1.4-1.4"],
  cursor: ["M3.5 2.5 12.5 7 8.3 8.3 7 12.5z"],
  eye: ["M1.8 8s2.3-4.5 6.2-4.5S14.2 8 14.2 8s-2.3 4.5-6.2 4.5S1.8 8 1.8 8z", "M8 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"],
  bookmark: ["M4 2.5h8v11L8 10.5l-4 3z"],
  export: ["M9.5 2.5h4v4", "M13.5 2.5 7.5 8.5", "M11.5 9.5v3.5h-9v-9H6"],
  clip: ["M12.8 7.6 8 12.4a3 3 0 0 1-4.3-4.2l5-5a2 2 0 0 1 2.8 2.8l-5 5a1 1 0 0 1-1.4-1.4l4.6-4.6"],
  plus: ["M8 3v10M3 8h10"],
  calendar: ["M2.5 4h11v9.5h-11z", "M2.5 7h11M5.5 2.5v3M10.5 2.5v3"],
  tag: ["M2.5 2.5h5.3l5.7 5.7-5.3 5.3-5.7-5.7z", "M5.5 5.5h.01"],
  history: ["M2.7 8a5.3 5.3 0 1 0 1.6-3.8", "M2.5 2.5v2.8h2.8", "M8 5.2V8l2 1.3"],
  bell: ["M4 11V7.2a4 4 0 0 1 8 0V11l1 1.5H3z", "M6.5 14h3"],
  sort: ["M5 3v10M2.8 5.2 5 3l2.2 2.2", "M11 13V3M8.8 10.8 11 13l2.2-2.2"],
  chart: ["M2.5 13.5h11", "M4.5 11V8M8 11V4.5M11.5 11V6.5"],
  arrow: ["M3 8h10M9 4l4 4-4 4"],
  stack: ["M8 2.5 13.5 5 8 7.5 2.5 5z", "M2.5 8 8 10.5 13.5 8", "M2.5 11 8 13.5 13.5 11"],
  alert: ["M8 14a6 6 0 1 0 0-12 6 6 0 0 0 0 12z", "M8 5v3.5", "M8 11h.01"],
  mail: ["M2.5 4h11v8h-11z", "m2.5 4.5 5.5 4 5.5-4"],
} as const;

export type GlyphKey = keyof typeof GLYPHS;

/** 16-unit line icons, 1.5 stroke, currentColor (DESIGN.md §E.8). */
export function Glyph({ k, className = "" }: { k: GlyphKey; className?: string }) {
  return (
    <svg className={`${m.glyph} ${className}`} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {GLYPHS[k].map((d, i) => (
        <path key={i} d={d} />
      ))}
    </svg>
  );
}

/** Roma rosette as a vector: outer ring + six circles through the centre. */
export function RomaGlyph({ className = "" }: { className?: string }) {
  const r = 12.1;
  const petals = Array.from({ length: 6 }, (_, i) => {
    const a = -Math.PI / 3 + (i * Math.PI) / 3;
    return { cx: +(32 + r * Math.cos(a)).toFixed(2), cy: +(32 + r * Math.sin(a)).toFixed(2) };
  });
  return (
    <svg className={className} viewBox="0 0 64 64" fill="none" stroke="currentColor" aria-hidden="true">
      <circle cx="32" cy="32" r="29.5" strokeWidth="4" />
      <g strokeWidth="3">
        {petals.map((p, i) => (
          <circle key={i} cx={p.cx} cy={p.cy} r={r} />
        ))}
      </g>
    </svg>
  );
}
