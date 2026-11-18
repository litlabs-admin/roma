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

// No "Matched"/"Recoverable" states (client, Nov 2026): a tile shows the backup it was
// checked against, or that the brand disputed it.
export type Status = "backup" | "disputed";
export type Tile = { title: string; amount: string; status: Status; icon: IconKey; doc?: string };
export type DisputeState = "Credited" | "In review" | "Filed";

export type Scenario = {
  key: string;
  channel: string;
  initial: string;
  headline: string;
  total: string;
  bars: { key: CategoryKey; label: string; band: string; amount: string; value: number }[];
  /** Deductions as % of sales, this quarter vs the same quarter last year (same figures as /platform analytics). */
  rate: { now: number; prev: number };
  tiles: Record<CategoryKey, [Tile, Tile]>;
  recovered: number;
  inDispute: string;
  rows: { title: string; state: DisputeState; amount: string; date: string; icon: IconKey }[];
};

export type IconKey = "receipt" | "tag" | "truck" | "box" | "file" | "alert";

// One question per screen: Analytics → Recovery → Accounting (client's three questions).
export const SUBS = ["Where is my money going?", "Is this deduction right?", "How do I book it?"] as const;

/** Screen 3 GL lines, one per band (codes illustrative, same as /platform accounting). */
export const GL: Record<CategoryKey, { code: string; name: string }> = {
  promo: { code: "4410", name: "Promo allowance" },
  shortage: { code: "4420", name: "Shortages & damages" },
  fees: { code: "6150", name: "Fees & fines" },
};
/** Scale of the rate track on screen 1 (% of sales). */
export const RATE_MAX = 6;

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
    rate: { now: 4.2, prev: 5.1 },
    tiles: {
      promo: [
        { title: "MCB · Mothers Market", amount: "$3,420", status: "backup", icon: "tag", doc: "PA-0412" },
        { title: "Scan · Whole Foods Q3", amount: "$1,847", status: "disputed", icon: "tag" },
      ],
      shortage: [
        { title: "Shortship · PO 10482", amount: "$924", status: "disputed", icon: "truck" },
        { title: "Fill-rate fine · Wk 29", amount: "$2,108", status: "disputed", icon: "alert" },
      ],
      fees: [
        { title: "New-item fee · 4 SKUs", amount: "$2,000", status: "backup", icon: "file", doc: "Agreement" },
        { title: "SSA · 2.5% purchases", amount: "$1,205", status: "backup", icon: "receipt", doc: "Terms" },
      ],
    },
    recovered: 12940,
    inDispute: "$3,870",
    rows: [
      { title: "Scan · Whole Foods Q3", state: "Credited", amount: "$1,847", date: "Oct 14", icon: "tag" },
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
    rate: { now: 3.6, prev: 3.9 },
    tiles: {
      promo: [
        { title: "MCB · Sprouts", amount: "$2,640", status: "backup", icon: "tag", doc: "PA-3021" },
        { title: "EP · 8% admin fee", amount: "$412", status: "disputed", icon: "receipt" },
      ],
      shortage: [
        { title: "UDR · Damages DC 4", amount: "$1,180", status: "disputed", icon: "box" },
        { title: "Shortage · PO 88213", amount: "$736", status: "backup", icon: "truck", doc: "POD" },
      ],
      fees: [
        { title: "Intro allowance · 3 SKUs", amount: "$2,250", status: "backup", icon: "file", doc: "Agreement" },
        { title: "Slotting · DC 2", amount: "$1,500", status: "disputed", icon: "alert" },
      ],
    },
    recovered: 7820,
    inDispute: "$2,690",
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
    rate: { now: 2.4, prev: 3.2 },
    tiles: {
      promo: [
        { title: "Promo allowance · Wk 31", amount: "$2,980", status: "backup", icon: "tag", doc: "PA-0398" },
        { title: "Markdown · Q3", amount: "$1,640", status: "disputed", icon: "tag" },
      ],
      shortage: [
        { title: "Shortage · ASN 7731", amount: "$1,215", status: "disputed", icon: "truck" },
        { title: "Concealed damage", amount: "$640", status: "backup", icon: "box", doc: "Photos" },
      ],
      fees: [
        { title: "Late delivery fine", amount: "$1,250", status: "disputed", icon: "alert" },
        { title: "Labeling fine · DC 3", amount: "$500", status: "backup", icon: "file", doc: "Routing guide" },
      ],
    },
    recovered: 6140,
    inDispute: "$2,465",
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
    rate: { now: 2.9, prev: 2.7 },
    tiles: {
      promo: [
        { title: "Rollback · Wk 30", amount: "$3,110", status: "backup", icon: "tag", doc: "PA-0377" },
        { title: "Promo claim · Q3", amount: "$1,920", status: "disputed", icon: "tag" },
      ],
      shortage: [
        { title: "Shortage · PO 4471", amount: "$1,385", status: "disputed", icon: "truck" },
        { title: "Damaged pallet", amount: "$760", status: "backup", icon: "box", doc: "Photos" },
      ],
      fees: [
        { title: "OTIF fine · Sep", amount: "$1,480", status: "disputed", icon: "alert" },
        { title: "Defective allowance", amount: "$1,020", status: "backup", icon: "file", doc: "Terms" },
      ],
    },
    recovered: 7210,
    inDispute: "$2,860",
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

/** Dispute markers: leave the disputed tiles (screen 2) and land on their dispute rows (screen 3). */
export function markerPlan(L: Layout, s: Scenario) {
  const from: { x: number; y: number }[] = [];
  BAND_ORDER.forEach((k, bi) => {
    s.tiles[k].forEach((t, ti) => {
      if (t.status === "disputed") from.push(tileIconAt(L, bi, ti));
    });
  });
  // row icon centre: row padding 18 + half the 30-unit dot
  return s.rows.map((_, i) => ({
    to: { x: L.card.x + L.rows.x + 18 + 15, y: L.card.y + L.rows.y + i * L.rowH + L.rowH / 2 },
    from: from[i] || from[from.length - 1],
  }));
}

export const featureCopy = {
  // [before, accent, after-accent, line 2] — the pinned statement.
  statementDesktop: ["Every deduction raises ", "three", " questions.", "Roma answers all of them."],
  heading: { before: "Three questions. ", accent: "One", after: " place to answer them." },
  // The three questions, spelled out in the order the screens answer them.
  questions: [
    { q: "Where is my money going?", pillar: "Analytics" },
    { q: "Is this deduction right?", pillar: "Recovery" },
    { q: "How do I book it?", pillar: "Accounting" },
  ],
  cardTitle: "Built for how you sell.",
  cardSub: "Pick a channel.",
  caption: "Illustrative data. Not a guarantee of recovery.",
  screen1: { label: "Deductions as % of sales", prevLabel: "Last year", nowSub: "this quarter", prevSub: "same quarter last year" },
  screen3: { label: "Booked this quarter", rowsLabel: "Disputes", tie: "Ties to your remittances", export: "Export" },
};
