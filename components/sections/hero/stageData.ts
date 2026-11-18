// Hero stage — "Before Roma / With Roma" (Concept A, "The Remittance").
// One UNFI remittance. Before: the paper the founder actually gets. With Roma: the same
// lines, explained (Analytics), disputed (Recovery) and booked (Accounting).
//
// Illustrative data, but it reconciles: invoice − deductions = check.
//   14,608.64 − 2,045.00 = 12,563.64
//   deductions: 612.40 + 524.15 + 480.00 + 187.45 + 146.00 + 95.00 = 2,045.00
//   by category: promo 612.40 · shortage 1,191.60 · fees 241.00 (= 2,045.00)
//
// Copy rules (client, Nov 2026): no "Recoverable" / "Matched" states, no recovery promise.
// The dispute track stops at "In review"; "Credited" is shown as the next step, not reached.

import type { Category } from "@/lib/content/platform";

export type StageLine = {
  key: string;
  ref: string;
  /** Code as printed on the distributor's remittance. */
  code: string;
  amount: number;
  /** Only deductions have a category; the invoice line does not. */
  category?: Category;
};

export const REMITTANCE = {
  channel: "UNFI",
  title: "Remittance advice",
  check: "Check #40418",
  date: "Jul 28, 2026",
  invoice: { key: "inv", ref: "INV-30881", code: "INVOICE", amount: 14608.64 } as StageLine,
  deductions: [
    { key: "mcb", ref: "DED-24817", code: "MCB 0417-PA", amount: -612.4, category: "promo" },
    { key: "shrt", ref: "DED-24818", code: "SHRT PO10482", amount: -524.15, category: "shortage" },
    { key: "udr", ref: "DED-24819", code: "UDR DC4", amount: -480, category: "shortage" },
    { key: "spoils", ref: "DED-24820", code: "SPOILS", amount: -187.45, category: "shortage" },
    { key: "frt", ref: "DED-24821", code: "FRT CHG", amount: -146, category: "fees" },
    { key: "ep", ref: "DED-24822", code: "EP ADM FEE", amount: -95, category: "fees" },
  ] as StageLine[],
  net: { label: "Net payment", amount: 12563.64 },
  deducted: 2045,
};

/** The deduction that gets questioned and disputed. */
export const DISPUTED_KEY = "shrt";

/** Clutter around the paper in the "before" state. */
export const NOISE = {
  email: { from: "UNFI Supplier Portal", subject: "6 new deductions posted", when: "Jul 28" },
  sheet: {
    name: "deductions_FINAL_v3.xlsx",
    rows: [
      ["MCB?", "612.40", "check promo"],
      ["SHRT", "524.15", "#REF!"],
      ["UDR", "480.00", "???"],
    ],
  },
  backup: { key: "pod", name: "POD_10482.pdf", meta: "Proof of delivery · 212 KB" },
  note: "we shipped all 40 cases?",
  // one pain per pillar around the paper: deadline (Recovery), GL (Accounting), unread backup
  window: { label: "Dispute window", detail: "UNFI · closes Aug 27" },
  sticky: "which GL code is UDR??",
  promo: { name: "Promo_PA-0417.pdf", meta: "Signed Jun 12 · unopened" },
};

/** Analytics zone: deductions grouped by type, with share of total deducted. */
export const GROUPS: { category: Category; label: string; total: number; share: number; keys: string[] }[] = [
  { category: "promo", label: "Promo & MCB", total: 612.4, share: 30, keys: ["mcb"] },
  { category: "shortage", label: "Shortages & spoils", total: 1191.6, share: 58, keys: ["shrt", "udr", "spoils"] },
  { category: "fees", label: "Fees", total: 241, share: 12, keys: ["frt", "ep"] },
];

export const DISPUTE = {
  title: "Shortage claim · 40 cases",
  confirm: "You confirm. Roma files.",
  steps: [
    { label: "Filed", when: "Jul 30", done: true },
    { label: "In review", when: "Aug 4", done: true },
    { label: "Credited", when: "", done: false },
  ],
};

/** Accounting zone: the remittance as journal lines (GL codes illustrative). */
export const JOURNAL = {
  rows: [
    { gl: "4410", name: "Promo allowance", amount: -612.4 },
    { gl: "4420", name: "Shortages & spoils", amount: -1191.6 },
    { gl: "6150", name: "Distributor fees", amount: -241 },
  ],
  sales: { gl: "4000", name: "Sales" },
  net: { name: "Net to bank", tie: "Ties to check #40418" },
  export: "Export to GL",
};

export const ZONES = {
  analytics: { eyebrow: "Analytics", title: "Where it went" },
  recovery: { eyebrow: "Recovery", title: "Was it right?" },
  accounting: { eyebrow: "Accounting", title: "Booked" },
};

export const STAGE_COPY = {
  cta: "See what Roma can do",
  toggle: { before: "Before Roma", after: "With Roma" },
  caption: {
    before: "$12,563.64 paid. $2,045.00 deducted. No idea why.",
    after: "Same remittance. Every line explained, disputed or booked.",
  },
  note: "Illustrative data.",
  live: {
    before: "Showing before Roma: a UNFI remittance with six unexplained deductions.",
    after:
      "Showing with Roma: deductions grouped by type, one shortage disputed and in review, and the remittance booked to GL codes that tie to the check.",
  },
};
