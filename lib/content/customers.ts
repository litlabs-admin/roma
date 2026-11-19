// Copy + illustrative data for /customers (DESIGN.md §G.15). Keep copy here, not inside
// animation code (§I.2).
//
// SOURCES
// - PDF ("Messaging and Positioning – Roma", 4 Nov 2026): Good Day Chocolate recovered
//   $53K within 6 months (Jasen Arias, VP Ops & Growth, quotable); Smash Kitchen $23K;
//   the three status-quo failures (doing nothing, spreadsheets, bookkeepers); the three
//   pillars (recover, time, visibility); "proof of dollars recoverable in their own data,
//   not a generic case study".
// - Client copy already on the site: "0 new hires" (products.ts storyCopy).
//
// MOCK — replace before launch (client decision, 20 Nov 2026: hybrid brands):
// - Every quote, including Jasen Arias's (the PDF marks him quotable but gives no words).
// - Good Day Chocolate's narrative beats (only "$53K in 6 months" is sourced).
// - Fernbrook Kombucha, Little Ember Popcorn and the wall brands other than Smash Kitchen
//   are FICTIONAL, with invented people, sizes and figures. Smash Kitchen has its PDF
//   figure only and no quote, on purpose.
// - The packaging art is generic and does not depict any brand's real packaging.
// This file is NOT part of the Ask Roma knowledge base (lib/content/knowledge.ts); keep
// it that way while it contains fictional customers.
//
// Guardrails (§A.1, §A.8, PDF): no "automatically", no guaranteed amounts, no "free",
// retailers only as channels (never "took"/"owe"), "invalid" not "wrong". Figures in
// each story reconcile (see comments).

import type { Heading } from "./platform";
import type { ProductHeroCopy } from "./products";
import type { Faq } from "@/components/sections/faq/data";
import { FAQS } from "@/components/sections/faq/data";

export const RESULTS_VARY = "Results vary by brand. Not a guarantee of recovery.";

/* ── Packaging ─────────────────────────────────────────────────────────── */

export type PackageKind = "bar" | "bottle" | "bag" | "box";

/** Wrapper palette: body, a deeper tone for bands/panels, and ink for the type. */
export type Palette = { body: string; deep: string; ink: string; accent: string };

export type Brand = {
  id: string;
  name: string;
  /** Short name for tight spots (tags, index). */
  short: string;
  kind: PackageKind;
  /** Words printed on the pack: a product line and a small descriptor. */
  pack: { line: string; sub: string; net: string };
  palette: Palette;
};

// Low-chroma wrappers built from the warm data tints (§B.4) so red stays a signal.
export const BRANDS = {
  gdc: {
    id: "good-day-chocolate",
    name: "Good Day Chocolate",
    short: "Good Day",
    kind: "bar",
    pack: { line: "Dark", sub: "chocolate", net: "NET WT 2.5 OZ" },
    palette: { body: "#EBD3CB", deep: "#5A2A22", ink: "#3B1712", accent: "#C99A5B" },
  },
  fernbrook: {
    id: "fernbrook-kombucha",
    name: "Fernbrook Kombucha",
    short: "Fernbrook",
    kind: "bottle",
    pack: { line: "Ginger", sub: "kombucha", net: "16 FL OZ" },
    palette: { body: "#DCE6D6", deep: "#2E4A33", ink: "#1E3324", accent: "#B98A3E" },
  },
  ember: {
    id: "little-ember-popcorn",
    name: "Little Ember Popcorn",
    short: "Little Ember",
    kind: "bag",
    pack: { line: "Sea salt", sub: "popcorn", net: "NET WT 4.4 OZ" },
    palette: { body: "#F1DFB4", deep: "#6B3F14", ink: "#3F2509", accent: "#C0632A" },
  },
  hollis: {
    id: "hollis-farm-granola",
    name: "Hollis Farm Granola",
    short: "Hollis Farm",
    kind: "box",
    pack: { line: "Oat & honey", sub: "granola", net: "NET WT 11 OZ" },
    palette: { body: "#D9DEE5", deep: "#27313F", ink: "#1B2430", accent: "#C9A25A" },
  },
} satisfies Record<string, Brand>;

/* ── Hero: the shelf ───────────────────────────────────────────────────── */

export const custHero: ProductHeroCopy = {
  eyebrow: "Customer stories",
  icon: "book",
  heading: { before: "They checked. The money was ", accent: "theirs", after: "." },
  lead: "Natural and specialty brands selling through UNFI, KeHE and retailers, on what they found when someone finally looked at their deductions.",
  ground: { src: "/images/cta/texture-bg.webp", position: "50% 50%" },
  summary:
    "A store shelf with four products: Good Day Chocolate, Fernbrook Kombucha, Little Ember Popcorn and Hollis Farm Granola. Each shelf tag shows what changed for that brand: $53K recovered in 6 months, 19 hours a week back, 2.1 points of margin back at one retailer, $11.6K recovered on shortages.",
};

export type ShelfItem = {
  brand: Brand;
  href: string;
  /** Front of the tag before it flips: an ordinary retail price. */
  price: { amount: string; unit: string };
  /** What the tag flips to. */
  outcome: { figure: string; label: string };
  /** Shelf-tag code, printed small. */
  sku: string;
};

export const SHELF: ShelfItem[] = [
  { brand: BRANDS.gdc, href: "#good-day-chocolate", price: { amount: "$4.49", unit: "$1.80 / oz" }, outcome: { figure: "$53K", label: "recovered in 6 months" }, sku: "0 81234 50731" },
  { brand: BRANDS.fernbrook, href: "#fernbrook-kombucha", price: { amount: "$3.99", unit: "$0.25 / fl oz" }, outcome: { figure: "19 h", label: "back every week" }, sku: "0 86011 20416" },
  { brand: BRANDS.ember, href: "#little-ember-popcorn", price: { amount: "$5.29", unit: "$1.20 / oz" }, outcome: { figure: "+2.1 pts", label: "margin at one retailer" }, sku: "0 85203 11982" },
  { brand: BRANDS.hollis, href: "#hollis-farm-granola", price: { amount: "$6.99", unit: "$0.64 / oz" }, outcome: { figure: "$11.6K", label: "recovered on shortages" }, sku: "0 84410 77305" },
];

export const shelfCopy = {
  aisle: "Aisle 7 · Natural & specialty",
  hint: "Read the story",
  caption: `Illustrative. ${RESULTS_VARY}`,
};

/* ── Starting points ───────────────────────────────────────────────────── */

export type StartKey = "ignored" | "sheet" | "books";

export type StartingPoint = {
  key: StartKey;
  tab: string;
  title: string;
  body: string;
  /** Chapter that started here. */
  story: { brand: string; href: string };
  summary: string;
};

export const startCopy = {
  label: "Where they started",
  heading: { before: "Every story here starts the same ", accent: "way", after: "." } as Heading,
  lead: "Nobody chose to lose 2–3% of revenue to deductions. It happened because checking them was nobody’s job. Which of these sounds like you?",
  read: "Read their story",
};

// The PDF's three "why current solutions fail" lines, in the customer's own words.
export const STARTING_POINTS: StartingPoint[] = [
  {
    key: "ignored",
    tab: "We wrote it off",
    title: "A cost of doing business",
    body: "Deductions come off every payment and get absorbed. Nobody disputes what nobody has checked, so the margin leaks every month without anyone seeing it.",
    story: { brand: "Good Day Chocolate", href: "#good-day-chocolate" },
    summary: "A remittance whose deduction lines slide off the page into a tray labelled cost of doing business, stamped written off.",
  },
  {
    key: "sheet",
    tab: "A spreadsheet, when someone had time",
    title: "One person, one spreadsheet",
    body: "Someone downloads the portal exports and matches them to invoices by hand. It works until that person gets busy, then the spreadsheet quietly stops.",
    story: { brand: "Fernbrook Kombucha", href: "#fernbrook-kombucha" },
    summary: "A deductions master spreadsheet, version 14, with half the rows unfinished and a note that it was last edited 41 days ago.",
  },
  {
    key: "books",
    tab: "Our bookkeeper booked it",
    title: "Recorded, never recovered",
    body: "Your bookkeeper records every deduction, correctly. But disputing one needs portal know-how and backup they don’t have, so booked becomes final.",
    story: { brand: "Little Ember Popcorn", href: "#little-ember-popcorn" },
    summary: "A general journal where every deduction is booked to one deductions expense account, with a pencilled note asking recover, crossed out.",
  },
];

// Vignette data (illustrative; each reconciles on its own).
export const vignettes = {
  // 1 · remittance: 3 invoices paid, 3 deductions taken off. 2,840 + 1,960 + 3,215 = 8,015;
  // deductions 1,240 + 386 + 95 = 1,721; net 6,294.
  remit: {
    head: "UNFI remittance",
    date: "#4471029 · 10/14",
    invoices: [
      { ref: "INV 20418", amount: 2840 },
      { ref: "INV 20433", amount: 1960 },
      { ref: "INV 20451", amount: 3215 },
    ],
    deductions: [
      { ref: "MCB 88120", type: "promo" as const, label: "Promo", amount: 1240 },
      { ref: "SHT 30117", type: "shortage" as const, label: "Shortage", amount: 386 },
      { ref: "FEE 1021", type: "fees" as const, label: "Fee", amount: 95 },
    ],
    net: 6294,
    tray: "Cost of doing business",
    stamp: "Written off",
  },
  sheet: {
    file: "deductions_MASTER_v14_FINAL.xlsx",
    cols: ["Date", "Portal", "Ref", "Amount", "Backup", "Status"],
    rows: [
      ["08/02", "UNFI", "MCB 77810", "−1,120.00", "found", "disputed"],
      ["08/09", "KeHE", "SHT 20211", "−412.50", "chase POD", "?"],
      ["08/16", "UNFI", "MCB 78002", "−2,045.00", "", ""],
      ["08/23", "WFM", "FEE 0931", "−150.00", "", ""],
      ["", "", "", "", "", ""],
      ["", "", "", "", "", ""],
    ],
    note: "Dana out for launch. Pick up next month?",
    edited: "Last edited 41 days ago",
  },
  // 3 · journal: four deductions to one account. 1,240 + 386 + 95 + 2,210 = 3,931.
  books: {
    head: "General journal · October",
    account: "6120 Deductions expense",
    lines: [
      { memo: "UNFI MCB 88120", amount: 1240 },
      { memo: "KeHE short 30117", amount: 386 },
      { memo: "UNFI fee 1021", amount: 95 },
      { memo: "Target promo 5530", amount: 2210 },
    ],
    total: 3931,
    note: "recover?",
  },
};

/* ── Case files ────────────────────────────────────────────────────────── */

export type Fact = { k: string; v: string };
export type Outcome = { figure: string; label: string; /** count-up: numeric part + affixes */ count?: { to: number; prefix?: string; suffix?: string; decimals?: number } };

export type CaseStory = {
  n: string;
  code: string;
  brand: Brand;
  pillar: string;
  heading: Heading;
  facts: Fact[];
  channels: string[];
  started: string;
  beats: { label: string; text: string }[];
  outcomes: Outcome[];
  quote: { text: string; name: string; role: string };
  advice: string;
  artifact: "pile" | "card" | "split";
  /** sr-only description of the artifact. */
  summary: string;
};

export const caseCopy = {
  label: "Case files",
  heading: { before: "Three brands, three ways ", accent: "back", after: "." } as Heading,
  lead: "One recovered dollars, one recovered time, one finally saw where its money went. The three things the brands on this page say Roma changed.",
  indexLabel: "Stories",
  adviceLabel: "What they’d tell another founder",
  note: RESULTS_VARY,
};

export const CASES: CaseStory[] = [
  {
    n: "01",
    code: "GDC",
    brand: BRANDS.gdc,
    pillar: "Recover lost revenue",
    heading: { before: "$53K they’d already written off, ", accent: "back", after: "." },
    facts: [
      { k: "Category", v: "Chocolate" },
      { k: "Time on Roma", v: "6 months" },
    ],
    channels: ["UNFI", "KeHE"],
    started: "We wrote it off",
    beats: [
      {
        label: "Before",
        text: "Deductions came off every UNFI and KeHE payment, and the team treated them as the cost of selling. Checking one meant a portal export, an invoice search and a hunt for backup, so most were never checked.",
      },
      {
        label: "The turn",
        text: "They connected their portals to Roma. Every deduction arrived categorized and matched to its invoice and promo agreement, so the invalid ones stood out, each with the backup to dispute it.",
      },
      {
        label: "After",
        text: "Disputes went out from one place and were tracked to payment. Within six months, $53K that would have been written off had come back.",
      },
    ],
    outcomes: [
      { figure: "$53K", label: "recovered", count: { to: 53, prefix: "$", suffix: "K" } },
      { figure: "6", label: "months", count: { to: 6 } },
      { figure: "0", label: "new hires" },
    ],
    quote: {
      text: "We’d treated deductions like the weather. Once we could see each one next to its invoice and promo, it was obvious how many were invalid, and we stopped writing them off.",
      name: "Jasen Arias",
      role: "VP Ops & Growth, Good Day Chocolate",
    },
    advice: "Look at one quarter of your deductions. Just one. You’ll know.",
    artifact: "pile",
    summary:
      "A pile of remittance slips stamped written off is spread along a six-month track, each slip re-filed as a dispute and marked credited. The track ends at $53K recovered.",
  },
  {
    n: "02",
    code: "FBK",
    brand: BRANDS.fernbrook,
    pillar: "Get your team’s time back",
    heading: { before: "The spreadsheet that ran on one ", accent: "person", after: "." },
    facts: [
      { k: "Category", v: "Kombucha" },
      { k: "Revenue", v: "≈ $6M" },
      { k: "Team", v: "14 people" },
    ],
    channels: ["UNFI", "KeHE", "Whole Foods"],
    started: "A spreadsheet",
    beats: [
      {
        label: "Before",
        text: "Deductions belonged to Dana, their head of operations. Every Thursday she downloaded three portals’ exports, pasted them into a master spreadsheet and matched lines to invoices by hand. When a launch took her Thursday, the spreadsheet stopped.",
      },
      {
        label: "The turn",
        text: "Roma replaced the downloads. Deductions from all three portals land in one view, already categorized and matched, so Dana’s job changed from assembling the list to reviewing it.",
      },
      {
        label: "After",
        text: "Deductions went from most of a day each week to a couple of hours on Monday, and they haven’t fallen behind since, launches included.",
      },
    ],
    // 22 h before → 3 h after = 19 h back each week.
    outcomes: [
      { figure: "19 h", label: "back every week", count: { to: 19, suffix: " h" } },
      { figure: "3", label: "portals, one view", count: { to: 3 } },
      { figure: "$17.4K", label: "recovered in the first quarter", count: { to: 17.4, prefix: "$", suffix: "K", decimals: 1 } },
    ],
    quote: {
      text: "Deductions used to be Thursday. All of Thursday. Now it’s a coffee on Monday: I open Roma, confirm what to dispute and get back to running the business.",
      name: "Dana Whitfield",
      role: "Head of Operations, Fernbrook Kombucha",
    },
    advice: "If the process depends on one person’s free day, you don’t have a process.",
    artifact: "card",
    summary:
      "Two time cards for the head of operations. Before Roma: 22 hours a week on portal exports, matching and chasing backup. With Roma: 3 hours a week reviewing and confirming disputes.",
  },
  {
    n: "03",
    code: "LEP",
    brand: BRANDS.ember,
    pillar: "See where the money goes",
    heading: { before: "One expense line, finally ", accent: "explained", after: "." },
    facts: [
      { k: "Category", v: "Popcorn" },
      { k: "Revenue", v: "≈ $9M" },
      { k: "Team", v: "22 people" },
    ],
    channels: ["KeHE", "Target", "Walmart", "UNFI"],
    started: "Our bookkeeper",
    beats: [
      {
        label: "Before",
        text: "Their bookkeeper recorded every deduction faithfully, to one expense account. The books were right, but that one line couldn’t say which retailer, which promo, or which deductions were invalid.",
      },
      {
        label: "The turn",
        text: "In Roma, the same deductions broke down by channel, deduction type and promo. Most of one retailer’s deductions traced back to a single spring promo.",
      },
      {
        label: "After",
        text: "They reworked that promo before renewing it and disputed the invalid deductions they found along the way. Their bookkeeper now books from Roma’s coded lines.",
      },
    ],
    outcomes: [
      { figure: "$186K", label: "of deductions, explained line by line", count: { to: 186, prefix: "$", suffix: "K" } },
      { figure: "61%", label: "of one retailer’s deductions traced to one promo", count: { to: 61, suffix: "%" } },
      { figure: "+2.1 pts", label: "gross margin at that retailer", count: { to: 2.1, prefix: "+", suffix: " pts", decimals: 1 } },
    ],
    quote: {
      text: "Our bookkeeper did exactly what we asked: booked it. The first time we saw that line split by retailer and promo, we changed how we run our biggest promo that same week.",
      name: "Marcus Bell",
      role: "Co-founder & CFO, Little Ember Popcorn",
    },
    advice: "Booked isn’t the same as understood.",
    artifact: "split",
    summary:
      "One journal line, deductions expense $186,240 for three quarters, splits into four retailers: UNFI $52,310, KeHE $41,870, Target $63,820 and Walmart $28,240. Target's share opens into promo $38,900 (61%), shortages $14,260 and fees $10,660.",
  },
];

// Ch 1 · the write-off pile. Shape only: slips carry refs, never amounts (the PDF gives
// the 6-month total, not monthly figures).
export const pile = {
  folder: "Written off",
  stamp: "Written off",
  slips: [
    { ref: "UNFI · MCB", m: 0 },
    { ref: "KeHE · Shortage", m: 1 },
    { ref: "UNFI · Promo", m: 2 },
    { ref: "KeHE · MCB", m: 3 },
    { ref: "UNFI · Shortage", m: 4 },
    { ref: "KeHE · Promo", m: 5 },
  ],
  months: ["M1", "M2", "M3", "M4", "M5", "M6"],
  credited: "Credited",
  total: { label: "Recovered", figure: "$53K" },
  empty: "Nothing left in here",
};

// Ch 2 · time cards. Before rows sum to 22.0, after to 3.0.
export const timeCards = {
  person: "Dana W. · Head of Operations",
  before: {
    label: "Before Roma",
    week: "Week of Sep 9",
    rows: [
      { task: "Download portal exports", h: 4.5 },
      { task: "Paste & clean in sheet", h: 5 },
      { task: "Match to invoices", h: 7.5 },
      { task: "Chase backup", h: 5 },
    ],
    total: 22,
  },
  after: {
    label: "With Roma",
    week: "Week of Mar 3",
    rows: [
      { task: "Download portal exports", h: 0 },
      { task: "Paste & clean in sheet", h: 0 },
      { task: "Review matches", h: 1.5 },
      { task: "Confirm disputes", h: 1.5 },
    ],
    total: 3,
  },
  scale: 8, // hours at full bar width
};

// Ch 3 · one line split open. 52,310 + 41,870 + 63,820 + 28,240 = 186,240;
// Target: 38,900 + 14,260 + 10,660 = 63,820; 38,900 / 63,820 = 61%.
export const split = {
  journal: { account: "6120 Deductions expense", period: "Q1–Q3", total: 186240 },
  channels: [
    { name: "UNFI", amount: 52310 },
    { name: "KeHE", amount: 41870 },
    { name: "Target", amount: 63820, focus: true },
    { name: "Walmart", amount: 28240 },
  ],
  focus: {
    title: "Target · by type",
    types: [
      { name: "Spring promo (TPR)", type: "promo" as const, amount: 38900, share: 61 },
      { name: "Shortages", type: "shortage" as const, amount: 14260, share: 22 },
      { name: "Fees", type: "fees" as const, amount: 10660, share: 17 },
    ],
    note: "61% of Target’s deductions trace to one promo",
  },
  before: "As booked",
  after: "As seen in Roma",
};

/* ── The wall ──────────────────────────────────────────────────────────── */

export type WallTag = {
  id: string;
  brand: string;
  figure: string;
  label: string;
  quote?: string;
  name?: string;
  role?: string;
  channels?: string[];
  sku: string;
  /** Resting tilt in degrees. */
  tilt: number;
};

export const wallCopy = {
  label: "More from the shelf",
  heading: { before: "Different shelves, the same ", accent: "relief", after: "." } as Heading,
  lead: "Short notes from other brands running their deductions through Roma.",
  note: RESULTS_VARY,
};

export const WALL: WallTag[] = [
  {
    id: "hollis-farm-granola",
    brand: "Hollis Farm Granola",
    figure: "$11.6K",
    label: "recovered on shortages",
    quote: "Shortages were our blind spot. The proof of delivery always existed somewhere. Now it sits next to the deduction it answers.",
    name: "Erin Hollis",
    role: "Founder",
    channels: ["UNFI", "KeHE"],
    sku: "0 84410 77305",
    tilt: -2,
  },
  {
    id: "smash-kitchen",
    brand: "Smash Kitchen",
    figure: "$23K",
    label: "in invalid deductions recovered with Roma",
    sku: "0 85500 23000",
    tilt: 1.5,
  },
  {
    id: "juniper-row-tea",
    brand: "Juniper Row Tea",
    figure: "< 5 min",
    label: "to connect KeHE",
    quote: "I connected our portal between two calls. By that afternoon our deductions were sorted in one place, for the first time ever.",
    name: "Lena Ortiz",
    role: "Founder",
    channels: ["KeHE"],
    sku: "0 87120 45518",
    tilt: 2.5,
  },
  {
    id: "saltwind-crackers",
    brand: "Saltwind Crackers",
    figure: "5 portals",
    label: "one view",
    quote: "Our fractional CFO used to ask me for the deductions spreadsheet every month. Now she logs in and sees it herself.",
    name: "Nadia Brooks",
    role: "Head of Finance",
    channels: ["UNFI", "Target", "Walmart", "Kroger", "Whole Foods"],
    sku: "0 86630 90142",
    tilt: -1.5,
  },
  {
    id: "pebble-creek-nut-butter",
    brand: "Pebble Creek Nut Butter",
    figure: "$8.2K",
    label: "back in the first quarter",
    quote: "We’d budgeted deductions at 3% of sales and stopped thinking about them. A real chunk of that 3% turned out to be invalid.",
    name: "Sam Okafor",
    role: "Co-founder",
    channels: ["KeHE", "Walmart"],
    sku: "0 85871 30604",
    tilt: 2,
  },
  {
    id: "marigold-salsa",
    brand: "Marigold Salsa Co.",
    figure: "Every TPR",
    label: "costed, deductions included",
    quote: "We finally know what a promo at each retailer really costs us. That changed which ones we say yes to.",
    name: "Ruth Castillo",
    role: "VP Sales",
    channels: ["UNFI", "Kroger"],
    sku: "0 89034 61127",
    tilt: -2.5,
  },
];

/* ── Your tag (the turn to conversion) ─────────────────────────────────── */

export const yourTag = {
  label: "Your brand",
  heading: { before: "A case study is someone else’s ", accent: "numbers", after: "." } as Heading,
  body: "Connect a portal and see your own deductions by retailer and by type. Live in under 5 minutes, no ERP or IT project. Or book 30 minutes and we’ll walk you through them.",
  figureLabel: "recovered",
  sku: "0 00000 00000",
};

/* ── FAQ ───────────────────────────────────────────────────────────────── */

export const custFaqCopy = {
  label: "Customer stories",
  lines: [{ text: "Wondering about" }, { text: "your own ", accent: "numbers" }],
};

export const custFaqs: Faq[] = [
  {
    q: "Are these results typical?",
    a: "Results vary by brand. They depend on your channels, how many deductions you get and how many are invalid. Roma doesn’t promise a recovery amount. It shows you every deduction so you can see what’s recoverable in your own data.",
  },
  FAQS[3], // How long does it take to get started?
  FAQS[2], // Which retailers does Roma support?
  {
    q: "We have a bookkeeper. Does Roma replace them?",
    a: "No. Roma works alongside your bookkeeper and your accounting stack. They keep booking; Roma hands them coded, export-ready lines and shows you which deductions are worth disputing.",
  },
  FAQS[5], // What kind of brands is Roma built for?
  FAQS[4], // Is my data secure?
];
