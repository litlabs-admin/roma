import type { CSSProperties } from "react";

/** Place an element on the 560 × 280 scene canvas (units of --u). */
export function at(x: number, y: number, w?: number, h?: number): CSSProperties {
  const u = (n: number) => `calc(var(--u) * ${n})`;
  return { left: u(x), top: u(y), ...(w != null && { width: u(w) }), ...(h != null && { height: u(h) }) };
}

export const Check = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3.5 8.5 6.5 11.5 12.5 5" />
  </svg>
);

export const SCENE_VB = "0 0 560 280";

export const formatUsd = (n: number) => `$${Math.round(n).toLocaleString("en-US")}`;
export const formatCount = (n: number) => Math.round(n).toLocaleString("en-US");
