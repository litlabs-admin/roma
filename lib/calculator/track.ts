// Analytics events for the calculator and pricing (brief §2.10, §3.10).
//
// The analytics tool is not chosen yet, so `track` only announces the event: it dispatches
// a `roma:analytics` CustomEvent on window with { event, props }. One listener added
// later (GA4, HubSpot or other) forwards every event without touching the components.

export type AnalyticsEvent =
  | "calculator_view"
  | "calculator_start"
  | "calculator_input_change"
  | "calculator_result_view"
  | "calculator_cta_click"
  | "calculator_share"
  | "pricing_view"
  | "pricing_plan_cta_click"
  | "pricing_billing_toggle"
  | "pricing_faq_open"
  | "pricing_compare_click"
  | "ai_ask_click";

export type AnalyticsProps = Record<string, string | number | boolean | undefined>;

export const ANALYTICS_EVENT = "roma:analytics";

export function track(event: AnalyticsEvent, props: AnalyticsProps = {}) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(ANALYTICS_EVENT, { detail: { event, props } }));
}

/** Trailing debounce per key (calculator_input_change fires once a field settles, 1s). */
export function debounced(ms: number) {
  const timers = new Map<string, number>();
  const run = (key: string, fn: () => void) => {
    const t = timers.get(key);
    if (t) window.clearTimeout(t);
    timers.set(
      key,
      window.setTimeout(() => {
        timers.delete(key);
        fn();
      }, ms),
    );
  };
  const cancel = () => {
    timers.forEach((t) => window.clearTimeout(t));
    timers.clear();
  };
  return { run, cancel };
}

/** Where the visitor came from, for pricing_view (brief §3.10: nav, compare, calculator, direct). */
export function pricingSource(): string {
  if (typeof document === "undefined") return "direct";
  const ref = document.referrer;
  if (!ref) return "direct";
  try {
    const u = new URL(ref);
    if (u.origin !== window.location.origin) return "direct";
    if (u.pathname.startsWith("/compare/")) return "compare";
    if (u.pathname.startsWith("/calculator")) return "calculator";
    return "nav";
  } catch {
    return "direct";
  }
}
