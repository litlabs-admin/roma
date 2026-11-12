// Feature section content + phone-screen geometry (DESIGN.md §G.3).
// Every coordinate is in design units on a 400 × 868 phone canvas (Fruitful authors at
// 402 × 874), copied straight into `calc(var(--u) * N)` — author once, scale by width.
// Numbers are ILLUSTRATIVE (the panel says so); they add up within each scenario.

export const PANEL = { w: 400, h: 868 } as const;

export const PILL = { x: 125, y: 228, w: 150, h: 64 } as const;
export const BADGE = { x: 176, y: 336, size: 48 } as const;
export const STROKE = 12;
export const BAR = { bottom: 700, w: 110, xs: [16, 145, 274], maxH: 236, minH: 96 } as const;
export const SPLIT = { x: 16, y: 724, w: 368 } as const;

export const SYS_TOP = 216; // screens 2 + 3 start under the screen head
export const SYS_H = 636;
export const BAND_X = 8;
export const BAND_W = 384;
export const TILE = { x: 148, w: 236, h: 76, step: 84 } as const;
export const LABEL = { x: 16, w: 84 } as const;
export const SPINE_X = 58;

export const CARD = { x: 16, y: 228, w: 368, h: 620 } as const; // screen 3 card (absolute)
export const CHART = { x: 16, y: 100, w: 336, h: 220 } as const; // inside card
export const ROW_H = 60;

export type CategoryKey = "promo" | "shortage" | "fees";

export const CATEGORY_STYLE: Record<CategoryKey, { fill: string; ink: string }> = {
  promo: { fill: "#F4D9D4", ink: "#7A0E0E" },
  shortage: { fill: "#EED9A8", ink: "#5C4413" },
  fees: { fill: "#D7DCE3", ink: "#27313F" },
};

export type Status = "matched" | "recoverable";
export type Tile = { title: string; amount: string; status: Status; icon: IconKey };
export type DisputeState = "Credited" | "In review" | "Filed";

export type Scenario = {
  key: string;
  channel: string;
  initial: string;
  headline: string;
  total: string;
  bars: { key: CategoryKey; label: string; band: string; amount: string; value: number }[];
  split: { valid: string; validPct: number; recoverable: string };
  tiles: Record<CategoryKey, [Tile, Tile]>;
  recovered: number;
  inDispute: string;
  curve: number[]; // cumulative recovered, 0..1, evenly spaced Jul → Oct
  rows: { title: string; state: DisputeState; amount: string; date: string; icon: IconKey }[];
};

export type IconKey = "receipt" | "tag" | "truck" | "box" | "file" | "alert";

export const SUBS = ["Every deduction this quarter", "Matched to invoices & promos", "Disputed & recovered"] as const;

export const SCENARIOS: Scenario[] = [
  {
    key: "unfi",
    channel: "UNFI",
    initial: "U",
    headline: "Where your UNFI money went",
    total: "$48,210",
    bars: [
      { key: "promo", label: "Promo & MCB", band: "Promo", amount: "$24,860", value: 24860 },
      { key: "shortage", label: "Shortages", band: "Shortage", amount: "$14,120", value: 14120 },
      { key: "fees", label: "Fees", band: "Fees", amount: "$9,230", value: 9230 },
    ],
    split: { valid: "$31,400", validPct: 65, recoverable: "$16,810" },
    tiles: {
      promo: [
        { title: "MCB · Mothers Market", amount: "$3,420", status: "matched", icon: "tag" },
        { title: "Scan · Sprouts Q3", amount: "$1,847", status: "recoverable", icon: "tag" },
      ],
      shortage: [
        { title: "Shortship · PO 10482", amount: "$924", status: "recoverable", icon: "truck" },
        { title: "Fill-rate fine · Wk 29", amount: "$2,108", status: "recoverable", icon: "alert" },
      ],
      fees: [
        { title: "New-item fee · 4 SKUs", amount: "$2,000", status: "matched", icon: "file" },
        { title: "SSA · 2.5% purchases", amount: "$1,205", status: "matched", icon: "receipt" },
      ],
    },
    recovered: 12940,
    inDispute: "$3,870",
    curve: [0, 0.06, 0.18, 0.37, 0.52, 0.78, 1],
    rows: [
      { title: "Scan · Sprouts Q3", state: "Credited", amount: "$1,847", date: "Oct 14", icon: "tag" },
      { title: "Shortship · PO 10482", state: "In review", amount: "$924", date: "Oct 21", icon: "truck" },
      { title: "Fill-rate fine · Wk 29", state: "Filed", amount: "$2,108", date: "Oct 28", icon: "alert" },
    ],
  },
  {
    key: "kehe",
    channel: "KeHE",
    initial: "K",
    headline: "Where your KeHE money went",
    total: "$31,560",
    bars: [
      { key: "promo", label: "MCB & EP", band: "Promo", amount: "$17,920", value: 17920 },
      { key: "shortage", label: "Shortages", band: "Shortage", amount: "$8,240", value: 8240 },
      { key: "fees", label: "Fees", band: "Fees", amount: "$5,400", value: 5400 },
    ],
    split: { valid: "$21,050", validPct: 67, recoverable: "$10,510" },
    tiles: {
      promo: [
        { title: "MCB · Whole Foods", amount: "$2,640", status: "matched", icon: "tag" },
        { title: "EP · 8% admin fee", amount: "$412", status: "recoverable", icon: "receipt" },
      ],
      shortage: [
        { title: "UDR · Damages DC 4", amount: "$1,180", status: "recoverable", icon: "box" },
        { title: "Shortage · PO 88213", amount: "$736", status: "matched", icon: "truck" },
      ],
      fees: [
        { title: "Intro allowance · 3 SKUs", amount: "$2,250", status: "matched", icon: "file" },
        { title: "Slotting · DC 2", amount: "$1,500", status: "recoverable", icon: "alert" },
      ],
    },
    recovered: 7820,
    inDispute: "$2,690",
    curve: [0, 0.1, 0.21, 0.33, 0.58, 0.81, 1],
    rows: [
      { title: "EP · 8% admin fee", state: "Credited", amount: "$412", date: "Oct 9", icon: "receipt" },
      { title: "UDR · Damages DC 4", state: "In review", amount: "$1,180", date: "Oct 18", icon: "box" },
      { title: "Slotting · DC 2", state: "Filed", amount: "$1,500", date: "Oct 26", icon: "alert" },
    ],
  },
  {
    key: "target",
    channel: "Target",
    initial: "T",
    headline: "Where your Target money went",
    total: "$22,880",
    bars: [
      { key: "promo", label: "Promo", band: "Promo", amount: "$9,760", value: 9760 },
      { key: "shortage", label: "Shortages", band: "Shortage", amount: "$7,310", value: 7310 },
      { key: "fees", label: "Compliance", band: "Compliance", amount: "$5,810", value: 5810 },
    ],
    split: { valid: "$14,300", validPct: 62, recoverable: "$8,580" },
    tiles: {
      promo: [
        { title: "Promo allowance · Wk 31", amount: "$2,980", status: "matched", icon: "tag" },
        { title: "Markdown · Q3", amount: "$1,640", status: "recoverable", icon: "tag" },
      ],
      shortage: [
        { title: "Shortage · ASN 7731", amount: "$1,215", status: "recoverable", icon: "truck" },
        { title: "Concealed damage", amount: "$640", status: "matched", icon: "box" },
      ],
      fees: [
        { title: "Late delivery fine", amount: "$1,250", status: "recoverable", icon: "alert" },
        { title: "Labeling fine · DC 3", amount: "$500", status: "matched", icon: "file" },
      ],
    },
    recovered: 6140,
    inDispute: "$2,465",
    curve: [0, 0.04, 0.15, 0.31, 0.49, 0.72, 1],
    rows: [
      { title: "Markdown · Q3", state: "Credited", amount: "$1,640", date: "Oct 7", icon: "tag" },
      { title: "Shortage · ASN 7731", state: "In review", amount: "$1,215", date: "Oct 19", icon: "truck" },
      { title: "Late delivery fine", state: "Filed", amount: "$1,250", date: "Oct 27", icon: "alert" },
    ],
  },
  {
    key: "walmart",
    channel: "Walmart",
    initial: "W",
    headline: "Where your Walmart money went",
    total: "$27,340",
    bars: [
      { key: "promo", label: "Promo & rollbacks", band: "Promo", amount: "$11,920", value: 11920 },
      { key: "shortage", label: "Shortages", band: "Shortage", amount: "$8,610", value: 8610 },
      { key: "fees", label: "OTIF & fees", band: "Fees", amount: "$6,810", value: 6810 },
    ],
    split: { valid: "$17,500", validPct: 64, recoverable: "$9,840" },
    tiles: {
      promo: [
        { title: "Rollback · Wk 30", amount: "$3,110", status: "matched", icon: "tag" },
        { title: "Promo claim · Q3", amount: "$1,920", status: "recoverable", icon: "tag" },
      ],
      shortage: [
        { title: "Shortage · PO 4471", amount: "$1,385", status: "recoverable", icon: "truck" },
        { title: "Damaged pallet", amount: "$760", status: "matched", icon: "box" },
      ],
      fees: [
        { title: "OTIF fine · Sep", amount: "$1,480", status: "recoverable", icon: "alert" },
        { title: "Defective allowance", amount: "$1,020", status: "matched", icon: "file" },
      ],
    },
    recovered: 7210,
    inDispute: "$2,860",
    curve: [0, 0.08, 0.2, 0.34, 0.55, 0.76, 1],
    rows: [
      { title: "Promo claim · Q3", state: "Credited", amount: "$1,920", date: "Oct 8", icon: "tag" },
      { title: "Shortage · PO 4471", state: "In review", amount: "$1,385", date: "Oct 17", icon: "truck" },
      { title: "OTIF fine · Sep", state: "Filed", amount: "$1,480", date: "Oct 29", icon: "alert" },
    ],
  },
];

export const BAND_ORDER: CategoryKey[] = ["promo", "shortage", "fees"];

// ── geometry helpers ──────────────────────────────────────────────────────

export function barGeometry(s: Scenario) {
  const max = Math.max(...s.bars.map((b) => b.value));
  return s.bars.map((b, i) => {
    const h = Math.round(Math.max(BAR.minH, (b.value / max) * BAR.maxH));
    return { ...b, x: BAR.xs[i], y: BAR.bottom - h, w: BAR.w, h };
  });
}

/** Cubic with vertical tangents at both ends (Fruitful gfRoute). */
export function route(fromX: number, fromY: number, toX: number, toY: number) {
  const mid = (fromY + toY) / 2;
  return `M${fromX} ${fromY}C${fromX} ${mid} ${toX} ${mid} ${toX} ${toY}`;
}

export const GROUP_H = 2 * TILE.step + 8; // two tiles per band
export function bandGeometry() {
  return BAND_ORDER.map((key, k) => ({ key, top: 8 + k * (GROUP_H + 8), h: GROUP_H }));
}

/** Absolute (panel) position of a tile's icon — where a recovered marker flies from. */
export function tileIconAt(bandIndex: number, tileIndex: number) {
  const top = SYS_TOP + 8 + bandIndex * (GROUP_H + 8) + 8 + tileIndex * TILE.step;
  return { x: TILE.x + 12 + 8, y: top + 12 + 9 };
}

export function chartPoints(curve: number[]) {
  return curve.map((v, i) => ({
    x: (i / (curve.length - 1)) * CHART.w,
    y: CHART.h - 6 - v * (CHART.h - 18),
  }));
}

/** Smooth monotone-ish path through points (Catmull-Rom → Bézier). */
export function smoothPath(pts: { x: number; y: number }[]) {
  let d = `M${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] || p2;
    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = p2.y - (p3.y - p1.y) / 6;
    d += `C${c1x.toFixed(1)} ${c1y.toFixed(1)} ${c2x.toFixed(1)} ${c2y.toFixed(1)} ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
  }
  return d;
}

/** Which chart points the three recovered markers land on, and which tiles they leave from. */
export function markerPlan(s: Scenario) {
  const from: { x: number; y: number }[] = [];
  BAND_ORDER.forEach((k, bi) => {
    s.tiles[k].forEach((t, ti) => {
      if (t.status === "recoverable") from.push(tileIconAt(bi, ti));
    });
  });
  const pts = chartPoints(s.curve);
  const at = [2, 4, 6].map((i) => ({
    x: CARD.x + CHART.x + pts[i].x,
    y: CARD.y + CHART.y + pts[i].y,
  }));
  return at.map((to, i) => ({ to, from: from[i] || from[from.length - 1] }));
}

export const featureCopy = {
  statementDesktop: ["Your distributors are keeping money that’s ", "yours", ".", "Let’s get it back."],
  heading: { before: "Nothing gets written off ", accent: "by default", after: "." },
  body: "Roma connects to your distributor and retailer portals, pulls every deduction and matches it to your invoices and promo agreements. You see what was taken, why, and what’s recoverable, then dispute the invalid ones from one place.",
  cardTitle: "Built for how you sell.",
  cardSub: "Pick a channel to see its deductions.",
  caption: "Illustrative data. Not a guarantee of recovery.",
};
