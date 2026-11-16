// Feature section content + product-screen geometry (DESIGN.md §G.3).
// Every coordinate is in design units on the device canvas: 400 × 868 for the phone
// (Fruitful authors at 402 × 874), 800 × 500 for the laptop (16:10). Values are copied
// straight into `calc(var(--u) * N)` — author once, scale by width.
// Numbers are ILLUSTRATIVE (the panel says so); they add up within each scenario.

export type Box = { x: number; y: number; w: number; h: number };

/** Everything that differs between the phone and the laptop screen. */
export type Layout = {
  variant: "phone" | "laptop";
  panel: { w: number; h: number };
  head: { x: number; y: number; w: number };
  pill: Box;
  badge: { x: number; y: number; size: number };
  stroke: number;
  bar: { bottom: number; w: number; xs: readonly number[]; maxH: number; minH: number };
  split: { x: number; y: number; w: number };
  // screens 2 + 3 start under the screen head
  sysTop: number;
  sysH: number;
  bandX: number;
  bandW: number;
  /** Tile size; `y` is the first tile's top inside its band, `dx`/`dy` step to the next. */
  tile: { x: number; y: number; w: number; h: number; dx: number; dy: number };
  /** Height of one band (its two tiles plus padding). */
  groupH: number;
  label: { x: number; w: number };
  spineX: number;
  card: Box; // screen 3 card (absolute)
  cardHead: { x: number; y: number };
  chart: Box; // inside card
  split3: { x: number; y: number; w: number }; // inside card
  rows: { x: number; y: number; w: number }; // inside card
  rowH: number;
};

export const PHONE: Layout = {
  variant: "phone",
  panel: { w: 400, h: 868 },
  head: { x: 24, y: 40, w: 352 },
  pill: { x: 125, y: 228, w: 150, h: 64 },
  badge: { x: 176, y: 336, size: 48 },
  stroke: 12,
  bar: { bottom: 700, w: 110, xs: [16, 145, 274], maxH: 236, minH: 96 },
  split: { x: 16, y: 724, w: 368 },
  sysTop: 216,
  sysH: 636,
  bandX: 8,
  bandW: 384,
  tile: { x: 148, y: 8, w: 236, h: 76, dx: 0, dy: 84 },
  groupH: 2 * 84 + 8,
  label: { x: 16, w: 84 },
  spineX: 58,
  card: { x: 16, y: 228, w: 368, h: 620 },
  cardHead: { x: 18, y: 18 },
  chart: { x: 16, y: 100, w: 336, h: 220 },
  split3: { x: 14, y: 356, w: 340 },
  rows: { x: 0, y: 420, w: 368 },
  rowH: 60,
};

// Laptop: head across the top; screen 1 puts the pull diagram left and the split right,
// screen 2 lays each band's two tiles side by side, screen 3 splits the card into
// chart (left) and dispute rows (right).
export const LAPTOP: Layout = {
  variant: "laptop",
  panel: { w: 800, h: 500 },
  head: { x: 32, y: 26, w: 736 },
  pill: { x: 197, y: 104, w: 150, h: 54 },
  badge: { x: 250, y: 196, size: 44 },
  stroke: 12,
  bar: { bottom: 474, w: 140, xs: [46, 202, 358], maxH: 150, minH: 76 },
  split: { x: 546, y: 372, w: 222 },
  sysTop: 104,
  sysH: 380,
  bandX: 16,
  bandW: 768,
  tile: { x: 152, y: 18, w: 300, h: 76, dx: 316, dy: 0 },
  groupH: 112,
  label: { x: 32, w: 96 },
  spineX: 80,
  card: { x: 16, y: 104, w: 768, h: 380 },
  cardHead: { x: 20, y: 18 },
  chart: { x: 20, y: 96, w: 360, h: 176 },
  split3: { x: 20, y: 314, w: 360 },
  rows: { x: 412, y: 92, w: 356 },
  rowH: 80,
};

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
    headline: "Your UNFI deductions, sorted",
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
    headline: "Your KeHE deductions, sorted",
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
    headline: "Your Target deductions, sorted",
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
    headline: "Your Walmart deductions, sorted",
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

export function barGeometry(L: Layout, s: Scenario) {
  const { bar } = L;
  const max = Math.max(...s.bars.map((b) => b.value));
  return s.bars.map((b, i) => {
    const h = Math.round(Math.max(bar.minH, (b.value / max) * bar.maxH));
    return { ...b, x: bar.xs[i], y: bar.bottom - h, w: bar.w, h };
  });
}

/** Cubic with vertical tangents at both ends (Fruitful gfRoute). */
export function route(fromX: number, fromY: number, toX: number, toY: number) {
  const mid = (fromY + toY) / 2;
  return `M${fromX} ${fromY}C${fromX} ${mid} ${toX} ${mid} ${toX} ${toY}`;
}

/** Band rows, in screen-2 coordinates (0 = sysTop). */
export function bandGeometry(L: Layout) {
  return BAND_ORDER.map((key, k) => ({ key, top: 8 + k * (L.groupH + 8), h: L.groupH }));
}

/** Tile box inside its band (band-relative). */
export function tileAt(L: Layout, tileIndex: number) {
  return { x: L.tile.x - L.bandX + tileIndex * L.tile.dx, y: L.tile.y + tileIndex * L.tile.dy };
}

/** Absolute (panel) position of a tile's icon — where a recovered marker flies from. */
export function tileIconAt(L: Layout, bandIndex: number, tileIndex: number) {
  const t = tileAt(L, tileIndex);
  const top = L.sysTop + 8 + bandIndex * (L.groupH + 8) + t.y;
  return { x: L.bandX + t.x + 12 + 8, y: top + 12 + 9 };
}

export function chartPoints(L: Layout, curve: number[]) {
  const { chart } = L;
  return curve.map((v, i) => ({
    x: (i / (curve.length - 1)) * chart.w,
    y: chart.h - 6 - v * (chart.h - 18),
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
export function markerPlan(L: Layout, s: Scenario) {
  const from: { x: number; y: number }[] = [];
  BAND_ORDER.forEach((k, bi) => {
    s.tiles[k].forEach((t, ti) => {
      if (t.status === "recoverable") from.push(tileIconAt(L, bi, ti));
    });
  });
  const pts = chartPoints(L, s.curve);
  const at = [2, 4, 6].map((i) => ({
    x: L.card.x + L.chart.x + pts[i].x,
    y: L.card.y + L.chart.y + pts[i].y,
  }));
  return at.map((to, i) => ({ to, from: from[i] || from[from.length - 1] }));
}

export const featureCopy = {
  statementDesktop: ["Invalid deductions are money that’s ", "yours", ".", "Let’s get it back."],
  heading: { before: "Nothing gets written off ", accent: "by default", after: "." },
  body: "Roma connects to your distributor and retailer portals, pulls every deduction and matches it to your invoices and promo agreements. You see what was deducted, why, and what’s recoverable, then dispute the invalid ones from one place.",
  cardTitle: "Built for how you sell.",
  cardSub: "Pick a channel to see its deductions.",
  caption: "Illustrative data. Not a guarantee of recovery.",
};
