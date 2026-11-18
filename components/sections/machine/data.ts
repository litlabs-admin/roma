// "Recovery machine" + "Built for lean teams" — Roma's adaptation of Fruitful's
// `.dm-flow` block ("This is your financial dream machine." + "It's all built for you.").
// Copy: Messaging & Positioning PDF pillars + runroma.com, filtered by DESIGN.md §A.
// Motion constants: Fruitful src/animations/dreamMachine.js + stepIcons.js (values verbatim).

/* ── motion ─────────────────────────────────────────────────────────────── */

/** Card entrances play this much faster than authored (Fruitful playInView). */
export const CARD_TIMESCALE = 1.45;
/** Card timelines start when the card's top crosses this line. */
export const CARD_START = "top 90%";
/** Step icons start when their row's top crosses this line. */
export const STEP_START = "top 85%";

/** Connector geometry, in px at a 1350px-wide card grid (scaled by k = grid / 1350). */
export const FLOW = {
  designGrid: 1350,
  dotAbove: 140, // dot sits this far above the grid
  barAbove: 76, // split bar above the grid
  barBelow: 102, // rejoin bar below the grid
  radius: 29, // corner radius of every turn
  stroke: 8,
  dotR: 13,
  fade: 260, // tail fades over this length
  tail: 96, // Roma: spine runs this far past the last step before it ends
} as const;

/** Below this width the connector becomes a straight rail through the step circles. */
export const RAIL_MQ = "(max-width: 767px)";
export const WIDE_MQ = "(min-width: 768px)";

/** Card 3 marquee — 3 screens at a 433-unit pitch in a 637-unit card, 26s per screen. */
export const STREAM = { vbW: 637, gap: 433, travel: 3, secondsPerScreen: 26 } as const;

/* ── copy ───────────────────────────────────────────────────────────────── */

export const machineCopy = {
  // One serif accent, on the outcome word (DESIGN.md §A).
  heading: { before: "Connect once. Every deduction,", accent: "handled", after: "." },
};

export type MachineCard = {
  key: "connect" | "routing" | "stream" | "recovery";
  title: string;
  body: string;
  note?: string;
};

// Same four cards as before, rewritten to cover all three pillars and to carry the
// verified figures in the copy (<5 min, 90%, $50M+ — client + runroma.com).
export const MACHINE_CARDS: MachineCard[] = [
  {
    key: "connect",
    title: "Live in under 5 minutes",
    body: "Connect your distributor and retailer portals. No ERP, no IT project, no CSV exports.*",
    note: "*Setup time varies by portal.",
  },
  {
    key: "routing",
    title: "The full picture",
    body: "Every deduction across KeHE, UNFI, Target, Walmart and more, by channel, type and promo, with its GL code.",
  },
  {
    key: "stream",
    title: "90% of your hours back",
    body: "No portal downloads, no spreadsheets. Every backup pulled and read line by line.",
  },
  {
    key: "recovery",
    title: "Recovery you can track",
    body: "Every dispute followed to payment, and every credit ready for your books. $50M+ recovered for Roma brands.",
    note: "Results vary by brand.",
  },
];

export const stepsCopy = {
  heading: "Built for lean finance teams.",
  // Second line is muted (Fruitful .o--40); the accent sits on the outcome.
  muted: { before: "Connect it once,", after: "and your books stay ", accent: "current", end: "." },
  cta: { label: "Try now", href: "https://app.runroma.com/signup" },
};

export type Step = { n: string; title: string; body: string };

export const STEPS: Step[] = [
  {
    n: "01",
    title: "Connect",
    body: "Link your UNFI, KeHE and retailer portals in minutes. Roma pulls every deduction and remittance from there.",
  },
  {
    n: "02",
    title: "Check",
    body: "Every deduction is read with its backup and checked against your invoices and promo agreements.",
  },
  {
    n: "03",
    title: "Dispute",
    body: "Invalid deductions are queued with the right backup. You confirm, and Roma files from the platform.",
  },
  {
    n: "04",
    title: "Recover & book",
    body: "Track every dispute to payment. Credits and remittances land GL-coded, ready for month-end.",
  },
];

/* ── step scenes (Built for lean finance teams) ─────────────────────────── */

/** Step scenes play once at STEP_START, this much faster than authored. */
export const SCENE_TIMESCALE = 1.2;

export const STEP_SCENES = {
  connect: {
    portals: [
      { initial: "U", name: "UNFI" },
      { initial: "K", name: "KeHE" },
      { initial: "T", name: "Target" },
    ],
    label: "Deductions pulled",
    count: 1284,
    sub: "3 portals · synced",
  },
  match: {
    deduction: {
      label: "KeHE · Deduction",
      rows: [
        { k: "Promo allowance", v: "−$1,454.45" },
        { k: "Promo ID", v: "PA-3021" },
      ],
      before: "No backup",
      after: "Backup attached",
    },
    backup: {
      label: "Promo agreement · Q3",
      rows: [
        { k: "Allowance", v: "$1,454.45" },
        { k: "Promo ID", v: "PA-3021" },
      ],
      foot: "Signed Jul 02",
    },
  },
  dispute: {
    initial: "U",
    title: "Shortage · UNFI",
    amount: "−$1,120.00",
    tag: "Invalid",
    slot: "Attach backup",
    file: "POD_88213.pdf",
    confirm: "Confirm dispute",
    done: "Disputed",
    filed: "Filed with UNFI",
  },
  recover: {
    label: "Recovered · Q3",
    chip: "Cash in bank",
    amount: 12800,
    stages: ["Disputed", "Approved", "Paid"],
  },
} as const;

/* ── illustration data ──────────────────────────────────────────────────── */

/** Card 1 — the "which portals" question card. Dot rests on row 2 (Fruitful's CSS rest). */
export const CONNECT = {
  question: "Which portals do you sell through?",
  options: ["UNFI", "KeHE", "Target"],
  placeholder: "Add another portal…",
  backup: {
    label: "KeHE · Remittance",
    check: "Check #40418",
    lines: [
      { code: "MCB", amount: "−$245.55" },
      { code: "Promo allowance", amount: "−$1,454.45" },
      { code: "Freight", amount: "−$345.65" },
    ],
    total: { label: "Net payment", amount: "$12,563.64" },
  },
};

/** Card 2 — three destinations the deductions get sorted into (product data colours). */
export const ROUTES = [
  { lines: ["PROMO", "& MCB"], fill: "#F4D9D4", ink: "#7A0E0E" },
  { lines: ["SHORTAGES"], fill: "#EED9A8", ink: "#5C4413" },
  { lines: ["FEES"], fill: "#D7DCE3", ink: "#27313F" },
] as const;

/** Card 3 — remittance screens drifting past (illustrative amounts from runroma.com). */
export type StreamLine = { code: string; amount: string; status: "matched" | "recoverable" | "review" };
export const STREAM_SCREENS: { channel: string; check: string; total: string; lines: StreamLine[] }[] = [
  {
    channel: "UNFI",
    check: "$45,245.34",
    total: "$125,563.64",
    lines: [
      { code: "MCB deduction", amount: "−$245.55", status: "matched" },
      { code: "Promo allowance", amount: "−$8,454.45", status: "matched" },
      { code: "Freight", amount: "−$345.65", status: "recoverable" },
      { code: "Spoilage", amount: "−$2,545.21", status: "review" },
    ],
  },
  {
    channel: "KeHE",
    check: "$18,902.10",
    total: "$61,207.88",
    lines: [
      { code: "Shortage", amount: "−$1,120.00", status: "recoverable" },
      { code: "Slotting fee", amount: "−$2,500.00", status: "matched" },
      { code: "MCB deduction", amount: "−$612.40", status: "matched" },
      { code: "Admin fee", amount: "−$95.00", status: "review" },
    ],
  },
  {
    channel: "Target",
    check: "$32,610.75",
    total: "$94,118.02",
    lines: [
      { code: "OTIF fine", amount: "−$1,875.00", status: "recoverable" },
      { code: "Compliance", amount: "−$420.00", status: "review" },
      { code: "Promo allowance", amount: "−$5,210.30", status: "matched" },
      { code: "Damages", amount: "−$318.90", status: "matched" },
    ],
  },
];

export const STATUS_LABEL: Record<StreamLine["status"], string> = {
  // No "Matched"/"Recoverable" states (client): a line is coded to GL, or disputed.
  matched: "Coded",
  recoverable: "Disputed",
  review: "In review",
};

/** Card 4 — recovery timeline rows. */
export const RECOVERY_ROWS = [
  { when: "WEEK 02", title: "KeHE shortage", sub: "Disputed · $4,210", tone: "promo" },
  { when: "WEEK 05", title: "UNFI promo", sub: "Recovered · $12,800", tone: "matched" },
  { when: "WEEK 09", title: "Target fees", sub: "Cleared · $1,960", tone: "fees" },
] as const;
