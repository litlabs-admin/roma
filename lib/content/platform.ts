// Copy + illustrative mock data for /platform ("How Roma works").
// Sources: "Messaging and Positioning – Roma.pdf" (wins any conflict) and the module
// pages on runroma.com (/deduction-management, /analytics, /accounting), reworded to the
// PDF guardrails (DESIGN.md §A.8). Keep copy here, not inside animation code (§I.2).
//
// Tone rule for this page (client decision, Nov 2026): retailers and distributors are
// named only as channels/portals. Never imply wrongdoing ("took", "keeping", "owe you").
// Deductions are "invalid", nothing more. No "Matched"/"Recoverable" states (client feedback).

import { DEMO_HREF, SIGNUP_HREF } from "@/components/chat/data";

export { SIGNUP_HREF };

export type Heading = { before: string; accent: string; after: string };

export const ILLUSTRATIVE = "Illustrative data. Not a guarantee of recovery.";

/* ── Hero ──────────────────────────────────────────────────────────────── */

export const platformHero = {
  eyebrow: "How Roma works",
  heading: { before: "Every deduction, accounted ", accent: "for", after: "." } as Heading,
  lead: "Roma pulls every deduction from your distributor and retailer portals, matches it to your invoices and promo agreements, and tracks every dispute through to payment. Live in 5 minutes. No ERP or IT project.",
  primary: { label: "Try now", href: SIGNUP_HREF },
  secondary: { label: "Book a demo", href: DEMO_HREF },
};

export type Category = "promo" | "shortage" | "fees";
export type InboxRow = {
  id: string;
  date: string;
  channel: string;
  category: Category;
  type: string;
  ref: string;
  amount: number;
};

/** Hero app window: the deductions inbox. Illustrative only. */
export const inbox = {
  tabs: ["Inbox", "Disputes", "Analytics", "Accounting"],
  scope: "All channels",
  search: "Search deduction, invoice, amount…",
  columns: { id: "Deduction", date: "Date", channel: "Channel", type: "Type", ref: "Backup", amount: "Amount" },
  rows: [
    { id: "DED-24817", date: "Jul 28, 2026", channel: "UNFI", category: "promo", type: "MCB", ref: "Promo PA-0412", amount: 4116 },
    { id: "DED-24818", date: "Jul 28, 2026", channel: "KeHE", category: "shortage", type: "Shortage", ref: "INV-30927", amount: 1284.5 },
    { id: "DED-24821", date: "Jul 27, 2026", channel: "Target", category: "fees", type: "Compliance fee", ref: "PO 4471-02", amount: 650 },
    { id: "DED-24826", date: "Jul 26, 2026", channel: "Walmart", category: "promo", type: "Promo", ref: "Promo PA-0398", amount: 2750 },
    { id: "DED-24830", date: "Jul 25, 2026", channel: "UNFI", category: "shortage", type: "Spoils", ref: "INV-30881", amount: 823.2 },
    { id: "DED-24833", date: "Jul 24, 2026", channel: "Costco", category: "fees", type: "Slotting", ref: "Agreement SA-118", amount: 3400 },
  ] as InboxRow[],
  summary:
    "Example deductions inbox: six deductions from UNFI, KeHE, Target, Walmart and Costco, each with its type and the backup it was pulled with: an invoice, promo agreement or purchase order.",
};

/* ── Capabilities (2×2) ───────────────────────────────────────────────── */

export const capabilitiesCopy = {
  heading: { before: "From deduction to dollars ", accent: "back", after: "." } as Heading,
  lead: "The work a lean team used to do in spreadsheets, in one place.",
};

export type CapabilityKey = "inbox" | "backup" | "dispute" | "recovery";

export const CAPABILITIES: { key: CapabilityKey; title: string; body: string; summary: string }[] = [
  {
    key: "inbox",
    title: "Every deduction, in one inbox",
    body: "Deductions and remittances are pulled from your portals and sorted by retailer, type and amount. No CSVs, no manual exports.",
    summary: "Deductions arriving from UNFI, KeHE, Target and Walmart into one list, each tagged with its type.",
  },
  {
    key: "backup",
    title: "Backup, read line by line",
    body: "Every backup is pulled and read line by line, next to your invoices and promo agreements, so you know what’s valid before you act.",
    summary: "An MCB backup document whose lines are checked one by one against a promo agreement.",
  },
  {
    key: "dispute",
    title: "Disputes filed with the right backup",
    body: "Invalid deductions are queued with their documents. You confirm, and Roma files from one place.",
    summary: "A shortage deduction queued for dispute with its proof of delivery attached, confirmed and filed.",
  },
  {
    key: "recovery",
    title: "Recovery you can track to cash",
    body: "Follow each dispute from filed to credited, so nothing is written off by default.",
    summary: "A dispute moving from filed to in review to credited, with the recovered total rising.",
  },
];

/** Card mock data (illustrative). */
export const capabilityMocks = {
  inbox: {
    sources: ["UNFI", "KeHE", "Target", "Walmart"],
    rows: [
      { channel: "UNFI", label: "MCB · Promo", category: "promo" as Category, amount: 4116 },
      { channel: "KeHE", label: "Shortage", category: "shortage" as Category, amount: 1284.5 },
      { channel: "Target", label: "Compliance fee", category: "fees" as Category, amount: 650 },
      { channel: "Walmart", label: "Promo", category: "promo" as Category, amount: 2750 },
    ],
  },
  backup: {
    doc: "MCB backup · UNFI",
    agreement: "Promo PA-0412",
    lines: [
      { item: "Oat Bar 12ct · 4.2 off", amount: 1764 },
      { item: "Oat Bar Mini · 2.0 off", amount: 912 },
      { item: "Granola 10oz · 3.0 off", amount: 1440 },
    ],
  },
  dispute: {
    channel: "KeHE",
    title: "Shortage · INV-30927",
    amount: 1284.5,
    file: "Proof of delivery.pdf",
    size: "212 KB",
    cta: "Confirm dispute",
    filed: "Filed",
  },
  recovery: {
    label: "Recovered this quarter",
    total: 18420,
    stages: ["Filed", "In review", "Credited"],
  },
};

/* ── Coverage ─────────────────────────────────────────────────────────── */

export const coverage = {
  heading: { before: "Connected to the portals you already ", accent: "sell", after: " through." } as Heading,
  channels: ["UNFI", "KeHE", "Target", "Walmart", "Costco", "Kroger", "Whole Foods", "Amazon"],
  meta: "Live in 5 minutes. No ERP or IT project.*",
  note: "*Setup time varies by portal.",
};

/* ── Modules (tabs) ───────────────────────────────────────────────────── */

export const modulesCopy = {
  label: "Three modules",
  heading: { before: "Every deduction dollar, ", accent: "traced", after: "." } as Heading,
  lead: "Deduction management, analytics and accounting share the same data, so the number you dispute is the number you book.",
};

export type ModuleKey = "deductions" | "analytics" | "accounting";

export const MODULES: { key: ModuleKey; tab: string; lead: string; points: string[]; summary: string }[] = [
  {
    key: "deductions",
    tab: "Deduction management",
    lead: "Catch invalid deductions before they’re written off.",
    points: [
      "One inbox for every deduction",
      "Backup pulled, with line-level extraction",
      "23 pre-built reason codes, fully customizable",
      "Dispute in two clicks and track every status",
      "Assign to teammates, save views, filter by distributor, retailer, type, date or amount",
    ],
    summary: "Example deduction detail: a UNFI MCB with its backup lines extracted, a reason code assigned and a dispute status.",
  },
  {
    key: "analytics",
    tab: "Analytics",
    lead: "See what each channel and promo really costs.",
    points: [
      "Trade rate per retailer, distributor and chain",
      "Deductions as a percent of sales, and the margin impact",
      "Compare any two periods, year over year",
      "Classify by MCB, shortage, OI, damage and spoils",
      "Forecasting based on 12-month trends",
      "Export as a chart or raw data",
    ],
    summary: "Example analytics view: deductions as a percent of sales per channel, this quarter against the same quarter last year.",
  },
  {
    key: "accounting",
    tab: "Accounting",
    lead: "Close books with confidence.",
    points: [
      "Every remittance line tied to its invoice or deduction",
      "Custom GL code mapping",
      "Standardized deduction classification",
      "A full audit trail",
      "Export to CSV, NetSuite or QuickBooks",
    ],
    summary: "Example remittance: each line tied to an invoice or deduction and assigned a GL code, ready to export.",
  },
];

export const moduleMocks = {
  deductions: {
    id: "DED-24817",
    channel: "UNFI",
    type: "MCB",
    amount: 4116,
    reason: "R-14 · Promo, off-invoice",
    lines: [
      { item: "Oat Bar 12ct", qty: 420, amount: 1764 },
      { item: "Oat Bar Mini", qty: 456, amount: 912 },
      { item: "Granola 10oz", qty: 480, amount: 1440 },
    ],
    assignee: "JA",
    status: "Backup attached",
  },
  analytics: {
    title: "Deductions as % of sales",
    periods: ["Q3 2026", "Q3 2025"],
    bars: [
      { channel: "UNFI", now: 4.2, prev: 5.1 },
      { channel: "KeHE", now: 3.6, prev: 3.9 },
      { channel: "Target", now: 2.4, prev: 3.2 },
      { channel: "Walmart", now: 2.9, prev: 2.7 },
      { channel: "Costco", now: 1.8, prev: 2.3 },
    ],
    max: 6,
  },
  accounting: {
    remittance: "UNFI remittance · RMT-88213",
    total: 46871.2,
    lines: [
      { ref: "INV-30881", kind: "Invoice", gl: "4000 · Sales", amount: 52480 },
      { ref: "DED-24817", kind: "MCB", gl: "4410 · Promo allowance", amount: -4116 },
      { ref: "DED-24830", kind: "Spoils", gl: "4420 · Spoils", amount: -823.2 },
      { ref: "DED-24835", kind: "Admin fee", gl: "6150 · Distributor fees", amount: -669.6 },
    ],
    exports: ["CSV", "NetSuite", "QuickBooks"],
  },
};

/* ── Lean team (differentiators) ──────────────────────────────────────── */

export const leanCopy = {
  heading: { before: "Made for the team that wears five ", accent: "hats", after: "." } as Heading,
  lead: "Roma is built for founders and lean finance teams, not AR departments. Proof in dollars, without a software project.",
  rows: [
    { title: "Live in 5 minutes", body: "Connect your portals. No ERP, no IT project, no CSV exports.*" },
    { title: "Built for founders, not AR departments", body: "A clean, simple UI that a team of one can run alongside everything else." },
    { title: "Numbers you can act on", body: "High-accuracy matching and categorization, so you trust the numbers and dispute with confidence." },
    { title: "You stay in control", body: "You confirm every dispute, with a full audit trail. Your data never trains our models." },
  ],
  note: "*Setup time varies by portal.",
};

/* ── Proof ────────────────────────────────────────────────────────────── */

export const proofCopy = {
  heading: { before: "Real dollars, back on the ", accent: "books", after: "." } as Heading,
  stats: [
    { value: 53, prefix: "$", suffix: "K", label: "in deductions recovered within 6 months" },
    { value: 23, prefix: "$", suffix: "K", label: "in deductions recovered" },
    { value: 170, prefix: "", suffix: "+", label: "CPG brands trust Roma with their deductions" },
  ],
  note: "Results vary by brand. Not a guarantee of recovery.",
};
