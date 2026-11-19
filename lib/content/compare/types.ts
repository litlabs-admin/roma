import type { Heading } from "@/lib/content/platform";
import type { ProductHeroCopy } from "@/lib/content/products";
import type { Faq } from "@/components/sections/faq/data";

/**
 * One comparison page = one `Competitor` object (DESIGN.md §G.13). The template in
 * app/compare/[slug] renders every section from it; Roma's own facts live once in
 * roma.ts so a change lands on every page.
 *
 * Claims rule (client, 20 Nov 2026): a competitor statement appears only if a public
 * source can be cited, quoted verbatim in `sources` (prefer the competitor's own site).
 * Only competitor statements carry cites; Roma statements come from approved copy
 * (positioning PDF, sales battle cards, comparison sheet).
 */

export type Source = { quote: string; url: string; where: string };

/** A competitor statement, optionally tied to a `sources` key. */
export type Claim = { text: string; source?: string };

export type PenStage = { step: string; title: string; text: string; source?: string; you?: string };

export type TimelineArt = {
  kind: "timeline";
  /** Length of the ruler, in days. */
  days: number;
  ruler: number[];
  rulerMobile: number[];
  /** Day label format for the ruler's first tick and the playhead. */
  unit: "Day" | "Month";
  /** Divide a day value by this before printing (30 for months). */
  per: number;
  /** Illustrative deduction arrivals on Roma's lane. */
  chips: { day: number; label: string; cat: "promo" | "shortage" | "fees" }[];
  them: {
    tag: string;
    milestones?: { day: number; label: string; title: string }[];
    marker?: { day: number; label: string; title: string };
    /** A range the competitor gives (e.g. "two to four months"): drawn as a band. */
    range?: { from: number; to: number; label: string; title: string };
  };
  end: { label: string; them: string; roma: string };
};

export type GlanceArt = {
  kind: "glance";
  title: string;
  rows: { label: string; roma: string; them: string }[];
};

/** `vs`: the competitor's word on the same point; omit it and give `only` when the competitor says nothing citable. */
export type VerdictTile = { label: string; figure: string; sub: string; vs?: Claim; only?: string };

export type ApartVisual = "classify" | "backups" | "control" | "price";

export type ApartRow = {
  visual: ApartVisual;
  /** Overrides for the shared Roma copy of this row (roma.ts → APART). */
  title?: string;
  body?: string;
  /** What the competitor says on the same point, if it says anything citable. */
  them?: Claim;
  /** A customer report, shown attributed and never as fact. */
  note?: string;
  quote?: QuoteId;
};

export type MatrixRow = {
  label: string;
  roma: string;
  them: Claim;
  /** What the difference means for the reader (Framer's "choose based on"). */
  means: string;
  /** Both offer it: a tick in both columns. */
  parity?: boolean;
};

export type QuoteId = "julie" | "brandy";

export type Competitor = {
  slug: string;
  name: string;
  /** Short line for the "compare with others" cards and footer. */
  blurb: string;
  site: string;
  checkedOn: string;
  /** Client-supplied single-ink mark (SVG used as a CSS mask); else a mono initial. */
  mark?: { src: string; ratio: number };
  meta: { title: string; description: string };
  sources: Record<string, Source>;
  hero: { copy: ProductHeroCopy; caption: string; art: TimelineArt | GlanceArt };
  verdict: { heading: Heading; lead: string; tiles: VerdictTile[] };
  apart: { heading: Heading; lead: string; rows: ApartRow[] };
  pen?: { stages: PenStage[]; yourLane: Claim };
  price: { stamp: string; quote: Claim };
  matrix: { heading: Heading; lead: string; rows: MatrixRow[] };
  fit: { roma: string[]; them: string[] };
  faqs: Faq[];
};
