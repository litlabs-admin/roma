// Motion constants mirrored from the CSS tokens (DESIGN.md §F).

export const EASE = {
  out: "power3.out", // ≈ cubic-bezier(.22,1,.36,1)
  inOut: "power2.inOut",
  state: "power2.out",
} as const;

export const BP = { md: 768, lg: 992, xl: 1440 } as const;

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function isBelow(bp: number): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia(`(max-width: ${bp - 0.02}px)`).matches;
}

export const clamp = (x: number, a: number, b: number) => (x < a ? a : x > b ? b : x);
export const smooth = (t: number) => t * t * (3 - 2 * t);
