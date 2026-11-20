// Deductions calculator math (brief §2.4). Pure functions, no React: the same code can run
// on the server or in a test. Calculate on unrounded values; round only for display.

import { CONSTANTS, INPUTS, type InputKey } from "@/lib/content/calculator";

export type Inputs = Record<InputKey, number>;

export type Constants = { r: number; t: number; W: number; P: number };

export type Outputs = {
  D: number; // deductions per year ($)
  I: number; // invalid deductions per year ($)
  recNow: number; // invalid $ recovered today
  writeOff: number; // invalid $ written off today
  recRoma: number; // invalid $ recovered with Roma
  gain: number; // extra $ recovered per year with Roma
  hNow: number; // hours per year on deductions
  hSaved: number; // hours saved per year
  vTime: number; // $ value of time saved
  value: number; // total annual value
  cost: number; // annual Roma cost
  net: number; // net annual benefit
  roi: number; // Net / Cost (7.02 = 702%)
  payback: number; // months (Infinity when there is no value)
};

export const DEFAULT_CONSTANTS: Constants = {
  r: CONSTANTS.r.value,
  t: CONSTANTS.t.value,
  W: CONSTANTS.W.value,
  P: CONSTANTS.P.value,
};

export const DEFAULT_INPUTS: Inputs = {
  R: INPUTS.R.def,
  d: INPUTS.d.def,
  i: INPUTS.i.def,
  c: INPUTS.c.def,
  h: INPUTS.h.def,
  w: INPUTS.w.def,
  n: INPUTS.n.def,
};

const floor0 = (x: number) => (x > 0 ? x : 0);

/** Brief §2.4. Percent inputs arrive as 2.5 for 2.5%. Never returns a negative figure. */
export function compute(inp: Inputs, k: Constants = DEFAULT_CONSTANTS): Outputs {
  const d = inp.d / 100;
  const i = inp.i / 100;
  const c = inp.c / 100;
  const D = inp.R * d;
  const I = D * i;
  const recNow = I * c;
  const writeOff = I - recNow;
  // Roma is never shown as worse than today.
  const recRoma = I * Math.max(k.r, c);
  const gain = floor0(recRoma - recNow);
  const hNow = inp.h * k.W;
  const hSaved = hNow * k.t;
  const vTime = hSaved * inp.w;
  const value = gain + vTime;
  const cost = k.P * 12;
  const net = value - cost;
  return {
    D: floor0(D),
    I: floor0(I),
    recNow: floor0(recNow),
    writeOff: floor0(writeOff),
    recRoma: floor0(recRoma),
    gain,
    hNow: floor0(hNow),
    hSaved: floor0(hSaved),
    vTime: floor0(vTime),
    value: floor0(value),
    cost,
    net: floor0(net),
    roi: cost > 0 ? floor0(net / cost) : 0,
    payback: value > 0 ? cost / (value / 12) : Infinity,
  };
}

export const clamp = (x: number, min: number, max: number) => Math.min(max, Math.max(min, x));

/* ── Display (brief §2.4 rounding) ───────────────────────────────────── */

const usd0 = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
const int = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });

/** Dollars to the nearest $100 ($38,400). `exact` keeps whole dollars (prices). */
export function fmtMoney(v: number, exact = false) {
  const x = floor0(v);
  return usd0.format(exact ? Math.round(x) : Math.round(x / 100) * 100);
}

/** Short money for slider readouts and chips: $10M, $250K, $1.5B. */
export function fmtMoneyShort(v: number) {
  const x = floor0(v);
  const trim = (n: number) => (Number.isInteger(n) ? String(n) : n.toFixed(n < 10 ? 2 : 1).replace(/\.?0+$/, ""));
  if (x >= 1e9) return `$${trim(x / 1e9)}B`;
  if (x >= 1e6) return `$${trim(x / 1e6)}M`;
  if (x >= 1e3) return `$${trim(x / 1e3)}K`;
  return `$${Math.round(x)}`;
}

export const fmtHours = (v: number) => int.format(Math.round(floor0(v)));
export const fmtRoi = (roi: number) => `${int.format(Math.round(floor0(roi) * 100))}%`;
export const fmtPercent = (v: number) => `${Number.isInteger(v) ? v : v.toFixed(1)}%`;

/** Payback to 0.1 month; anything past a year reads "More than 12 months". */
export function fmtPayback(months: number, long = "More than 12 months") {
  if (!Number.isFinite(months) || months > 12) return long;
  const m = Math.round(months * 10) / 10;
  return `${m.toFixed(1)} ${m === 1 ? "month" : "months"}`;
}

/** Analytics band for a total value (brief §2.10). */
export function valueBand(v: number) {
  if (v < 50_000) return "<50K";
  if (v < 250_000) return "50K-250K";
  return "250K+";
}

/* ── Parsing (brief §2.9) ────────────────────────────────────────────── */

/** "10m", "10M", "$10,000,000", "250k", "1.5b" → number. NaN when unreadable. */
export function parseMoney(raw: string): number {
  const t = raw.trim().toLowerCase().replace(/[$,\s]/g, "");
  if (!t) return NaN;
  const m = /^(\d*\.?\d+)([kmb])?$/.exec(t);
  if (!m) return NaN;
  const mult = m[2] === "k" ? 1e3 : m[2] === "m" ? 1e6 : m[2] === "b" ? 1e9 : 1;
  return parseFloat(m[1]) * mult;
}

/** "2.5" or "2.5%" → 2.5. */
export function parsePercent(raw: string): number {
  const t = raw.trim().replace(/[%\s]/g, "");
  if (!t || !/^\d*\.?\d+$/.test(t)) return NaN;
  return parseFloat(t);
}

export function parseNumber(raw: string): number {
  const t = raw.trim().replace(/[,\s]/g, "");
  if (!t || !/^\d*\.?\d+$/.test(t)) return NaN;
  return parseFloat(t);
}

/* ── Suggested plan (brief §3.4, thresholds in lib/content/pricing.ts) ── */

export function suggestPlan<T extends { id: string; maxPortals: number | null }>(plans: T[], n: number): T {
  return plans.find((p) => p.maxPortals !== null && n <= p.maxPortals) ?? plans[plans.length - 1];
}

/* ── Shareable URL (brief §2.6) ──────────────────────────────────────── */

const KEYS: InputKey[] = ["R", "d", "i", "c", "h", "w", "n"];

export function toParams(inp: Partial<Inputs>): URLSearchParams {
  const p = new URLSearchParams();
  for (const k of KEYS) {
    const v = inp[k];
    if (typeof v === "number" && Number.isFinite(v)) p.set(k, String(Math.round(v * 100) / 100));
  }
  return p;
}

/** Reads ?R=&d=… back into inputs, clamped to each input's range. Unknown keys are ignored. */
export function fromParams(search: string | URLSearchParams, base: Inputs = DEFAULT_INPUTS): { inputs: Inputs; found: boolean } {
  const p = typeof search === "string" ? new URLSearchParams(search) : search;
  const out = { ...base };
  let found = false;
  for (const k of KEYS) {
    const raw = p.get(k);
    if (raw === null) continue;
    const v = parseFloat(raw);
    if (!Number.isFinite(v)) continue;
    const s = INPUTS[k];
    out[k] = clamp(k === "n" ? Math.round(v) : v, s.min, s.max);
    found = true;
  }
  return { inputs: out, found };
}
