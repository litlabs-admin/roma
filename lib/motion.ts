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

/**
 * First element matching `sel` that is actually rendered. With Cache Components, a
 * route you navigated away from stays in the DOM under `display: none` (React
 * <Activity>), so a bare document query can find the hidden page's element.
 */
export function queryVisible<T extends Element = HTMLElement>(sel: string): T | null {
  if (typeof document === "undefined") return null;
  return (Array.from(document.querySelectorAll<T>(sel)).find((el) => el.getClientRects().length > 0) ?? null) as T | null;
}

export function queryAllVisible<T extends Element = HTMLElement>(sel: string): T[] {
  if (typeof document === "undefined") return [];
  return Array.from(document.querySelectorAll<T>(sel)).filter((el) => el.getClientRects().length > 0);
}
