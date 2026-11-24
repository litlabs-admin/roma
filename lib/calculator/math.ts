// Deductions calculator math. Pure functions, no React: the same code can run on the
// server or in a test. Calculate on unrounded values; round only for display.
//
// Both rates are a share of revenue (Roma, Nov 2026):
//   valid   = revenue × valid %
//   invalid = revenue × invalid %
//   total   = valid + invalid

import { INPUTS, type InputKey } from "@/lib/content/calculator";

export type Inputs = Record<InputKey, number>;

export type Outputs = {
  valid: number; // valid deductions per year ($)
  invalid: number; // invalid deductions per year ($)
  total: number; // all deductions per year ($)
  invalidShare: number; // invalid / total, 0..1
};

export const DEFAULT_INPUTS: Inputs = {
  R: INPUTS.R.def,
  v: INPUTS.v.def,
  i: INPUTS.i.def,
};

const floor0 = (x: number) => (x > 0 ? x : 0);

/** Percent inputs arrive as 2.5 for 2.5%. Never returns a negative figure. */
export function compute(inp: Inputs): Outputs {
  const valid = floor0(inp.R * (inp.v / 100));
  const invalid = floor0(inp.R * (inp.i / 100));
  const total = valid + invalid;
  return { valid, invalid, total, invalidShare: total > 0 ? invalid / total : 0 };
}

export const clamp = (x: number, min: number, max: number) => Math.min(max, Math.max(min, x));

/* ── Display ─────────────────────────────────────────────────────────── */

const usd0 = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

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

/** Analytics band for the invalid-deductions figure. */
export function valueBand(v: number) {
  if (v < 50_000) return "<50K";
  if (v < 250_000) return "50K-250K";
  return "250K+";
}

/* ── Parsing ─────────────────────────────────────────────────────────── */

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

/* ── Shareable URL ───────────────────────────────────────────────────── */

const KEYS: InputKey[] = ["R", "v", "i"];

export function toParams(inp: Partial<Inputs>): URLSearchParams {
  const p = new URLSearchParams();
  for (const k of KEYS) {
    const v = inp[k];
    if (typeof v === "number" && Number.isFinite(v)) p.set(k, String(Math.round(v * 100) / 100));
  }
  return p;
}

/** Reads ?R=&v=&i= back into inputs, clamped to each input's range. Unknown keys are ignored. */
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
    out[k] = clamp(v, s.min, s.max);
    found = true;
  }
  return { inputs: out, found };
}
