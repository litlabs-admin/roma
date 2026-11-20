// Copy + illustrative data for the three product pages (/deduction-management,
// /analytics, /accounting). Sources: runroma.com's module pages (structure, feature
// lists), reworded to "Messaging and Positioning – Roma.pdf" and DESIGN.md §A guardrails:
// - retailers/distributors are channels or portals, never wrongdoers;
// - no "Matched"/"Recoverable" states, no "AI", no "automatically";
// - proof figures only from the PDF/client ($53K Good Day Chocolate, <5 min, 90%, $50M+);
// - every figure below is illustrative and the totals reconcile (see comments).
// Keep copy here, not inside animation code (DESIGN.md §I.2). Product pages: §G.11.

import { DEMO_HREF, SIGNUP_HREF } from "@/components/chat/data";
import type { Category, Heading } from "./platform";
import type { GlyphKey } from "@/components/platform/mock/kit";

export { ILLUSTRATIVE } from "./platform";

export type ProductKey = "deductions" | "analytics" | "accounting";

export type ProductHeroCopy = {
  eyebrow: string;
  icon: GlyphKey;
  heading: Heading;
  lead: string;
  ground: { src: string; position: string };
  summary: string;
};

export const productCtas = {
  primary: { label: "Try now", href: SIGNUP_HREF },
  secondary: { label: "Book a demo", href: DEMO_HREF },
};

export type Point = { icon: GlyphKey; text: string };

/* ── Shared: "Our numbers" band + Good Day story ───────────────────────── */

export const numbersCopy = {
  label: "Our numbers",
  heading: { before: "We don’t speak. Our numbers ", accent: "do", after: "." } as Heading,
  stats: [
    { prefix: "<", value: 5, suffix: " min", label: "To go live", body: "Connect a portal and your deductions start arriving.*" },
    { prefix: "", value: 90, suffix: "%", label: "Time saved", body: "No portal downloads, no spreadsheets, no copy and paste." },
    { prefix: "$", value: 50, suffix: "M+", label: "Recovered", body: "In invalid deductions recovered for Roma brands." },
  ],
  note: "*Setup time varies by portal. Results vary by brand.",
};

export const storyCopy = {
  label: "Customer story",
  brand: "Good Day Chocolate",
  heading: { before: "Good Day Chocolate stopped writing off ", accent: "deductions", after: "." } as Heading,
  body: "They connected their portals, disputed the invalid deductions with the right backup and tracked each one to payment.",
  stats: [
    { value: "$53K", label: "recovered" },
    { value: "6", label: "months" },
    { value: "0", label: "new hires" },
  ],
  note: "Results vary by brand. Not a guarantee of recovery.",
  months: ["M1", "M2", "M3", "M4", "M5", "M6"],
};

/** FAQ order per page: indexes into components/sections/faq/data.ts FAQS. */
export const faqOrder: Record<ProductKey, number[]> = {
  deductions: [2, 3, 1, 0, 4, 5, 6],
  analytics: [0, 6, 2, 3, 1, 4, 5],
  accounting: [1, 0, 6, 3, 2, 4, 5],
};

/* ══ 1 · Deduction management ═══════════════════════════════════════════ */

export const dmHero: ProductHeroCopy = {
  eyebrow: "Deduction management",
  icon: "stack",
  heading: { before: "Catch invalid deductions before they ", accent: "cost you", after: "." },
  lead: "Every deduction from UNFI, KeHE and your other retailers in one inbox, ready for your team to act on.",
  ground: { src: "/images/product/hero-deductions.webp", position: "50% 40%" },
  summary:
    "Example deductions desk: $82,410 deducted this quarter, split into invalid, needs a check and valid, above a list of six deductions from UNFI, KeHE, Target and Walmart, each with its backup, assignee and a valid or invalid status.",
};

export type DeskStatus = "valid" | "invalid" | "check";

// KPIs reconcile: 9,862 + 14,236 + 58,312 = 82,410. Invalid starts at 7,754.30 and
// rises by the two rows marked invalid in the load animation (1,284.50 + 823.20).
export const desk = {
  title: "Deductions",
  sub: "Every retailer · Q3 2026",
  report: "Download report",
  kpis: [
    { key: "total", label: "Total deducted", value: 82410, from: 0, meta: "214 deductions", tone: "total" },
    { key: "invalid", label: "Invalid", value: 9862, from: 7754.3, meta: "31 to dispute", metaFrom: "29 to dispute", tone: "invalid" },
    { key: "check", label: "Needs a check", value: 14236, from: 0, meta: "42 deductions", tone: "check" },
    { key: "valid", label: "Valid", value: 58312, from: 0, meta: "141 deductions", tone: "valid" },
  ],
  filters: ["Check date", "Retailer", "Type", "Assignee", "Backup"],
  search: "Search deductions…",
  columns: { id: "Deduction", channel: "Retailer", type: "Type", amount: "Amount", backup: "Backup", assignee: "Assignee", status: "Status" },
  rows: [
    { id: "DED-24817", channel: "UNFI", type: "MCB", category: "promo" as Category, amount: 4116, assignee: "JA", status: "valid" as DeskStatus },
    { id: "DED-24818", channel: "KeHE", type: "Shortage", category: "shortage" as Category, amount: 1284.5, assignee: "", status: "invalid" as DeskStatus, animate: true },
    { id: "DED-24821", channel: "Target", type: "Compliance fee", category: "fees" as Category, amount: 650, assignee: "MR", status: "check" as DeskStatus },
    { id: "DED-24826", channel: "Walmart", type: "Promo", category: "promo" as Category, amount: 2750, assignee: "JA", status: "valid" as DeskStatus },
    { id: "DED-24830", channel: "UNFI", type: "Spoils", category: "shortage" as Category, amount: 823.2, assignee: "", status: "invalid" as DeskStatus, animate: true },
    { id: "DED-24833", channel: "KeHE", type: "Slotting", category: "fees" as Category, amount: 3400, assignee: "MR", status: "check" as DeskStatus },
  ],
};

export const dmIntro = {
  label: "Workflow",
  heading: { before: "Every deduction, start to ", accent: "finish", after: "." } as Heading,
  lead: "Portal downloads, spreadsheets and email threads, replaced by one workflow your team can actually run.",
};

export const dmChapters: { title: string; body: string; points: Point[]; summary: string }[] = [
  {
    title: "Single source of truth",
    body: "Every deduction lands the moment it posts, sorted by retailer, type and amount.",
    points: [
      { icon: "filter", text: "Filter by retailer, type, date or amount" },
      { icon: "bookmark", text: "Saved views for the checks you run every month" },
      { icon: "export", text: "Export to CSV, NetSuite or QuickBooks" },
    ],
    summary: "The inbox filtered to UNFI, with a saved view and an export menu for CSV, NetSuite and QuickBooks.",
  },
  {
    title: "Backup attached. Checked in one click.",
    body: "Roma pulls every MCB and chargeback backup, reads it line by line and links it to its deduction, so your team can mark it valid or invalid on the spot.",
    points: [
      { icon: "file", text: "Backup pulled, with line-level extraction" },
      { icon: "user", text: "Assign deductions to teammates" },
      { icon: "tag", text: "23 pre-built reason codes, fully customizable" },
    ],
    summary: "A KeHE vendor chargeback report read line by line, a reason code assigned, a teammate assigned, and the deduction marked invalid.",
  },
  {
    title: "Dispute from one place",
    body: "Dispute any deduction in two clicks with the right backup attached. You confirm, Roma files it, and every dispute is tracked to payment.",
    points: [
      { icon: "cursor", text: "Dispute in two clicks" },
      { icon: "history", text: "Track the status of every dispute" },
      { icon: "bell", text: "Know when you’re paid back" },
    ],
    summary: "A dispute form filled with the proof of delivery attached, then tracked from filed to in review to paid back.",
  },
];

/** Journey scenes (illustrative). */
export const journey = {
  inbox: {
    tabs: ["All", "UNFI", "KeHE", "Target"],
    view: "Saved view · Q3 shortages",
    rows: [
      { ch: "UNFI", id: "DED-24817", type: "MCB", category: "promo" as Category, amount: 4116 },
      { ch: "KeHE", id: "DED-24818", type: "Shortage", category: "shortage" as Category, amount: 1284.5 },
      { ch: "UNFI", id: "DED-24830", type: "Spoils", category: "shortage" as Category, amount: 823.2 },
      { ch: "Target", id: "DED-24821", type: "Compliance fee", category: "fees" as Category, amount: 650 },
      { ch: "KeHE", id: "DED-24833", type: "Slotting", category: "fees" as Category, amount: 3400 },
    ],
    exports: ["CSV", "NetSuite", "QuickBooks"],
  },
  backup: {
    doc: { region: "Eastern region", title: "Vendor chargeback report", week: "Week ending 07/19/2026", file: "KeHE_Shortage_Backup.pdf" },
    lines: [
      { store: "Mother’s Market #11", item: "Oat Bar 12ct", qty: "40 cs", amount: 642.25 },
      { store: "Mother’s Market #11", item: "Oat Bar Mini", qty: "24 cs", amount: 318.0 },
      { store: "Sprouts #417", item: "Granola 10oz", qty: "18 cs", amount: 324.25 },
    ],
    reason: "R-07 · Shortage, not received",
    assignee: "JA",
    assigneeName: "Jordan A.",
  },
  dispute: {
    channel: "KeHE",
    invoice: "570621IA",
    check: "3278361",
    amount: 1284.5,
    type: "Shortage · Delivered in full",
    file: "Proof_of_delivery.pdf",
    stages: ["Filed", "In review", "Paid back"],
    paid: "Credited on your Aug 26 remittance",
  },
};

/* ══ 2 · Analytics ══════════════════════════════════════════════════════ */

export const anHero: ProductHeroCopy = {
  eyebrow: "Analytics",
  icon: "chart",
  heading: { before: "Every deduction tells a ", accent: "story", after: "." },
  lead: "See where your deductions go by retailer, type and month, so you know what each promo really costs.",
  ground: { src: "/images/product/hero-analytics.webp", position: "50% 55%" },
  summary:
    "Example analytics dashboard: $2,184,300 invoiced minus $82,410 deducted equals $2,101,890 paid this quarter, above a breakdown of deductions by retailer and by type, each with its trade rate.",
};

// 2,184,300 − 82,410 = 2,101,890
export const board = {
  title: "Dashboard",
  range: "Jul 1 – Sep 30, 2026",
  channels: "UNFI, KeHE +3",
  segments: ["All", "Trade", "Non-trade"],
  sync: { title: "Synced", meta: "2 hours ago" },
  equation: [
    { label: "Invoiced", value: 2184300, meta: "1,108 invoices", tone: "neutral" },
    { op: "−" },
    { label: "Deducted", value: 82410, meta: "214 deductions", tone: "red" },
    { op: "=" },
    { label: "Paid", value: 2101890, meta: "96 checks", tone: "ok" },
  ] as ({ label: string; value: number; meta: string; tone: string } | { op: string })[],
  breakdown: {
    title: "Where it went",
    hint: "Click a bar to drill down",
    toggle: ["By retailer", "By type"],
    columns: ["Deducted", "Trade rate"],
    byRetailer: [
      { name: "Whole Foods Market", amount: 21460, rate: 4.8 },
      { name: "Sprouts Farmers Market", amount: 12380, rate: 4.1 },
      { name: "Wegmans", amount: 9120, rate: 3.6 },
      { name: "Thrive Market", amount: 7940, rate: 3.2 },
      { name: "Target", amount: 6210, rate: 2.4 },
    ],
    byType: [
      { name: "MCB", amount: 24880, rate: 30.2 },
      { name: "Promo", amount: 18420, rate: 22.4 },
      { name: "Shortage", amount: 13140, rate: 15.9 },
      { name: "Spoils", amount: 7960, rate: 9.7 },
      { name: "Fees", amount: 6410, rate: 7.8 },
    ],
    typeColumns: ["Deducted", "Share"],
  },
};

export const drillCopy = {
  label: "Drill down",
  heading: { before: "From a quarter’s total to a single ", accent: "line", after: "." } as Heading,
  lead: "Start at what left your account this quarter. Four clicks later you’re looking at the one line behind it, with its backup.",
  hint: "Keep scrolling",
};

// Totals reconcile at every level: 82,410 → UNFI 33,790 → MCB 14,980 → Whole Foods
// #10234 3,412.00 → line 0417 34.20. UNFI's store level lists UNFI-served stores only
// (Sprouts is a KeHE account): 3,412 + 2,104 + 1,880 + 7,584 = 14,980 across 27 stores.
export const drill = {
  crumbs: ["All retailers", "UNFI", "MCB", "Whole Foods #10234", "Line 0417"],
  levels: [
    {
      key: "quarter",
      eyebrow: "Deducted · Q3 2026",
      total: 82410,
      caption: "214 deductions across 5 retailers",
      parts: [
        { name: "UNFI", amount: 33790 },
        { name: "KeHE", amount: 22250 },
        { name: "Target", amount: 11540 },
        { name: "Walmart", amount: 9060 },
        { name: "Others", amount: 5770 },
      ],
    },
    {
      key: "channel",
      eyebrow: "UNFI · by type",
      total: 33790,
      caption: "86 deductions",
      parts: [
        { name: "MCB", amount: 14980 },
        { name: "Promo", amount: 8120 },
        { name: "Shortage", amount: 5640 },
        { name: "Spoils", amount: 2830 },
        { name: "Fees", amount: 2220 },
      ],
    },
    {
      key: "type",
      eyebrow: "UNFI · MCB · by store",
      total: 14980,
      caption: "27 stores",
      parts: [
        { name: "Whole Foods #10234", amount: 3412 },
        { name: "Wegmans #82", amount: 2104 },
        { name: "Mother’s Market #11", amount: 1880 },
        { name: "24 more stores", amount: 7584 },
      ],
    },
    {
      key: "store",
      eyebrow: "Whole Foods #10234 · MCB lines",
      total: 3412,
      caption: "4 lines · Promo PA-0412",
      parts: [
        { name: "Oat Bar 12ct", amount: 1764, meta: "84 cs × $21.00" },
        { name: "Granola 10oz", amount: 1248.6, meta: "62 cs × $20.14" },
        { name: "Oat Bar Mini", amount: 365.2, meta: "22 cs × $16.60" },
        { name: "Sea Salt Bar 2ct", amount: 34.2, meta: "2 cs × $17.10" },
      ],
    },
  ],
  line: {
    eyebrow: "Line 0417",
    total: 34.2,
    item: "Sea Salt Bar 2ct",
    fields: [
      ["Store", "Whole Foods #10234"],
      ["Quantity", "2 cs × $17.10"],
      ["Promo", "PA-0412 · Q3 scan"],
      ["Week ending", "Jul 19, 2026"],
    ],
    backup: "MCB backup · page 3 of 7",
  },
  summary:
    "Drill-down example: $82,410 deducted this quarter, $33,790 of it from UNFI, $14,980 of that as MCB, $3,412 of that at Whole Foods store 10234, and finally a single $34.20 line for 2 cases of Sea Salt Bar, with its backup page.",
};

export const viewsCopy = {
  label: "Three views",
  heading: { before: "Every angle on your ", accent: "deductions", after: "." } as Heading,
  lead: "Who, what and when, built on 99% matching accuracy.",
};

export const views = {
  who: {
    title: "Every retailer. Every deduction.",
    body: "Sort by what matters this week.",
    points: [
      { icon: "chart", text: "Deducted, count and trade rate per retailer" },
      { icon: "sort", text: "Sort any column: amount, count, rate, change" },
      { icon: "calendar", text: "Compare any two periods side by side" },
    ] as Point[],
    columns: [
      { key: "name", label: "Retailer" },
      { key: "amount", label: "Deducted" },
      { key: "count", label: "Count" },
      { key: "rate", label: "Trade rate" },
      { key: "change", label: "vs Q3 ’25" },
    ] as const,
    rows: [
      { name: "Whole Foods Market", amount: 21460, count: 48, rate: 4.8, change: -0.4 },
      { name: "Sprouts Farmers Market", amount: 12380, count: 31, rate: 4.1, change: 0.3 },
      { name: "Wegmans", amount: 9120, count: 22, rate: 3.6, change: -0.2 },
      { name: "Thrive Market", amount: 7940, count: 17, rate: 3.2, change: -0.9 },
      { name: "Target", amount: 6210, count: 26, rate: 2.4, change: 0.1 },
    ],
    summary: "A table of five retailers with deducted amount, count, trade rate and change against last year; columns can be sorted.",
  },
  what: {
    title: "Your deduction mix at a glance.",
    body: "Every deduction classified by type, so you see what drives the total.",
    points: [
      { icon: "stack", text: "Classify by MCB, shortage, OI, damage and spoils" },
      { icon: "filter", text: "Filter by retailer in one click" },
      { icon: "export", text: "Export as a chart or raw data" },
    ] as Point[],
    filters: ["All", "UNFI", "KeHE"],
    types: ["MCB", "Promo", "Shortage", "Spoils", "Fees", "Others"],
    // All = 82,410 · UNFI = 33,790 · KeHE = 22,250
    data: {
      All: [24880, 18420, 13140, 7960, 6410, 11600],
      UNFI: [14980, 8120, 5640, 2830, 2220, 0],
      KeHE: [6120, 5480, 4310, 3060, 1940, 1340],
    } as Record<string, number[]>,
    summary: "Deductions by type as horizontal bars, filterable to UNFI or KeHE.",
  },
  when: {
    title: "Track every dollar against revenue.",
    body: "Deductions as a share of revenue, month over month, so you spot a trend before it reaches your margin.",
    points: [
      { icon: "chart", text: "Trade spend as a percent of revenue" },
      { icon: "history", text: "Forecasts based on 12-month trends" },
      { icon: "calendar", text: "This year against last year" },
    ] as Point[],
    months: ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"],
    forecastMonths: ["Oct", "Nov", "Dec"],
    current: [3.9, 4.1, 4.4, 4.0, 3.8, 3.6, 3.7, 3.5, 3.4, 3.6, 3.3, 3.2],
    previous: [4.3, 4.6, 4.9, 4.7, 4.4, 4.3, 4.5, 4.2, 4.1, 4.3, 4.0, 3.9],
    forecast: [3.1, 3.1, 3.0],
    max: 5.5,
    summary: "Deductions as a percent of revenue over 12 months, trending down from 4.4% to 3.2%, below last year's line, with a three-month forecast near 3%.",
  },
};

/* ══ 3 · Accounting ═════════════════════════════════════════════════════ */

export const acHero: ProductHeroCopy = {
  eyebrow: "Accounting",
  icon: "book",
  heading: { before: "Close books with ", accent: "confidence", after: "." },
  lead: "Every remittance tied to its invoices and deductions, every line coded to your GL, ready to export in one click.",
  ground: { src: "/images/product/hero-accounting.webp", position: "50% 78%" },
  summary:
    "Example credit memo screen: a UNFI check for $9,494.00 beside its four deductions, $3,037.26 in total, each given a GL code and booked as a credit memo until nothing is left to book.",
};

export const creditMemos = {
  tabs: ["Credit memos", "Checks"],
  actions: ["GL mapping", "Download for ERP"],
  check: {
    channel: "UNFI",
    label: "Remittance",
    number: "3281841",
    date: "May 27, 2026",
    payTo: "Hearth & Grain Co.",
    amount: 9494,
    words: "Nine thousand four hundred ninety-four and 00/100",
    micr: "⑈3281841⑈ ⑆021000089⑆ 4471026⑈",
  },
  columns: { ref: "Deduction", type: "Type", amount: "Amount", gl: "GL description", booking: "Booking" },
  // The check's four deductions, booked as credit memos: 2,641.08 + 228.32 + 114.16
  // + 53.70 = 3,037.26 (the same check as the tie-out section below).
  rows: [
    { ref: "SHRT-0527", type: "Shortage", category: "shortage" as Category, amount: -2641.08, gl: "4420 · Shortages" },
    { ref: "PRM-1184", type: "Promotions", category: "promo" as Category, amount: -228.32, gl: "4410 · Promo allowance" },
    { ref: "SPL-0219", type: "Spoils", category: "shortage" as Category, amount: -114.16, gl: "4430 · Spoils" },
    { ref: "FSH-0527", type: "Fairshare", category: "fees" as Category, amount: -53.7, gl: "6150 · Retailer fees" },
  ],
  pending: 3037.26,
  summary: ["To book", "Booked"],
};

export const acIntro = {
  label: "Cash application",
  heading: { before: "Zero manual ", accent: "matching", after: "." } as Heading,
  lead: "Every check, explained to the cent.",
  points: [
    "Match payments to invoices with minimal effort",
    "Sync with the financial systems you already use",
    "Find and resolve unapplied payments fast",
  ],
};

// Invoices 12,531.26 − deductions 3,037.26 = check 9,494.00
export const tieOut = {
  check: { channel: "UNFI", number: "3281841", date: "May 27, 2026", amount: 9494 },
  steps: [
    { title: "The check arrives", body: "One UNFI payment for $9,494.00. On its own, it explains nothing." },
    { title: "Every line, tied out", body: "Roma reads the remittance and ties each line to its invoice or deduction." },
    { title: "Coded to your GL", body: "Each line gets its GL code from your mapping rules." },
    { title: "Ready for your ERP", body: "The check foots to the cent. Export to NetSuite, QuickBooks or CSV." },
  ],
  lines: [
    { ref: "571049IA", kind: "Invoice", amount: 8240, gl: "1200 · Receivables" },
    { ref: "571049", kind: "Invoice", amount: 4291.26, gl: "1200 · Receivables" },
    { ref: "SHRT-0527", kind: "Shortage", amount: -2641.08, gl: "4420 · Shortages" },
    { ref: "PRM-1184", kind: "Promotions", amount: -228.32, gl: "4410 · Promo allowance" },
    { ref: "SPL-0219", kind: "Spoils", amount: -114.16, gl: "4430 · Spoils" },
    { ref: "FSH-0527", kind: "Fairshare", amount: -53.7, gl: "6150 · Retailer fees" },
  ],
  totals: { invoices: 12531.26, deductions: -3037.26, check: 9494 },
  exports: ["NetSuite", "QuickBooks", "CSV"],
  exported: "6 lines exported to NetSuite",
  summary:
    "Cash application example: a $9,494.00 UNFI check expands into two invoices totalling $12,531.26 and four deductions totalling $3,037.26, each line gets a GL code, the check ties out to a $0.00 difference and is exported to NetSuite.",
};

export const glMap = {
  label: "Credit memos",
  title: "Accounting-ready credit memos.",
  body: "Set your mapping once. Every deduction gets the right GL code, so credit memos and reports come out clean.",
  points: [
    { icon: "link", text: "Custom GL code mapping" },
    { icon: "stack", text: "Standardized deduction classification" },
    { icon: "history", text: "A full audit trail" },
  ] as Point[],
  types: [
    { name: "MCB", category: "promo" as Category, to: 0 },
    { name: "Promo", category: "promo" as Category, to: 0 },
    { name: "Shortage", category: "shortage" as Category, to: 1 },
    { name: "Spoils", category: "shortage" as Category, to: 2 },
    { name: "Fairshare", category: "fees" as Category, to: 3 },
    { name: "Slotting", category: "fees" as Category, to: 3 },
  ],
  accounts: [
    { code: "4410", name: "Promo allowance", count: 96 },
    { code: "4420", name: "Shortages", count: 41 },
    { code: "4430", name: "Spoils", count: 23 },
    { code: "6150", name: "Retailer fees", count: 54 },
  ],
  audit: ["Rule MCB → 4410 added, Jul 2", "214 deductions coded, Jul 30", "Reviewed by Finance, Jul 31"],
  summary: "A mapping diagram: MCB and promo deductions route to GL 4410 promo allowance, shortages to 4420, spoils to 4430, fairshare and slotting to 6150 retailer fees, with an audit trail.",
};
