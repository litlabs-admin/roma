import type { Heading } from "@/lib/content/platform";
import type { ProductHeroCopy } from "@/lib/content/products";
import type { Faq } from "@/components/sections/faq/data";

/**
 * One comparison page = one `Competitor` object (DESIGN.md §G.13). The shared frame in
 * app/compare/[slug] renders the hero shell, the one comparison table, the hub, FAQ and
 * CTA; everything in between is the competitor's own story (`story`, a per-competitor
 * union read by components/compare/pages/*). Roma's own facts live once in roma.ts.
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

export type QuoteId = "julie" | "brandy";

/** The competitor's own logo files, shown in their original colours (client, 20 Nov 2026). */
export type Logo = {
  src: string;
  /** Intrinsic width / height of the file. */
  w: number;
  h: number;
  /** Optical height in the hero lockup, rem (wordmarks differ in x-height and padding). */
  size: number;
  /** Raster logos: never render taller than this many CSS px (keeps them sharp). */
  maxPx?: number;
};

export type Chip = { day: number; label: string; cat: "promo" | "shortage" | "fees" };

/** Promomash hero: the horizontal "time to go live" ruler with a range band. */
export type TimelineArt = {
  days: number;
  ruler: number[];
  rulerMobile: number[];
  unit: "Day" | "Month";
  /** Divide a day value by this before printing (30 for months). */
  per: number;
  chips: Chip[];
  them: {
    tag: string;
    milestones?: { day: number; label: string; title: string }[];
    marker?: { day: number; label: string; title: string };
    range?: { from: number; to: number; label: string; title: string };
  };
  end: { label: string; them: string; roma: string };
};

/** Glimpse hero: a 45-day calendar. Roma fills every day; Glimpse's milestones are pinned. */
export type CalendarArt = {
  days: number;
  chips: Chip[];
  milestones: { day: number; label: string; title: string; key?: boolean }[];
  end: { them: string; roma: string };
};

/** Vividly hero: its full trade lifecycle as columns, Roma's single deductions lane under it. */
export type ScopeArt = {
  stages: { label: string; source: string; deductions?: boolean }[];
  them: { label: string; tag: string };
  roma: { label: string; tag: string; offPlan: string };
};

/** Floret hero: the same buyer question, answered by each side. Visuals are keyed by `id`. */
export type QaArt = {
  questions: {
    id: "cost" | "speed" | "disputes";
    q: string;
    them: Claim[];
    roma: string;
    /** The one-line takeaway under the card for this question, per side. */
    takeaway: { them: string; roma: string };
  }[];
};

export type GlimpseStory = {
  kind: "glimpse";
  calendar: CalendarArt;
  pen: { stages: PenStage[]; yourLane: Claim };
  work: { heading: Heading; lead: string; them: Claim };
  switched: { heading: Heading; lead: string; note: string; quote: QuoteId };
};

export type PromomashStory = {
  kind: "promomash";
  timeline: TimelineArt;
  terms: {
    heading: Heading;
    lead: string;
    stamp: string;
    /** Illustrative monthly deduction-invoice volumes for the order summary's control. */
    volumes: number[];
    /** Cited plan terms; the one with `price` drives the volume meter. */
    clauses: (Claim & { label: string; price?: boolean })[];
  };
  scope: { heading: Heading; lead: string; modules: { name: string; roma?: boolean }[]; source: string };
};

export type VividlyStory = {
  kind: "vividly";
  scope: ScopeArt;
  gate: {
    heading: Heading;
    lead: string;
    /** The illustrative deduction that travels the stations. */
    chip: { label: string; amount: string };
    /** Four stations; the competitor's lines are cited, Roma's are approved copy. */
    stations: {
      label: string;
      them: { title: string; text?: string; source?: string; needs?: string };
      roma: { title: string; text: string; gate?: boolean };
    }[];
  };
};

export type FloretStory = {
  kind: "floret";
  qa: QaArt;
  alike: { heading: Heading; body: string; quote: Claim };
  backups: { heading: Heading; lead: string; quote: QuoteId };
};

export type MatrixRow = {
  label: string;
  roma: string;
  them: Claim;
  /** What the difference means for the reader, under the factor. */
  means: string;
  /** Both offer it: a tick in both columns, grouped under "Both offer". */
  parity?: boolean;
  /** A decider row: Roma's figure set large at the top of the table. */
  key?: { figure: string };
};

export type Competitor = {
  slug: string;
  name: string;
  /** Short line for the "compare with others" cards. */
  blurb: string;
  site: string;
  checkedOn: string;
  logo: Logo;
  meta: { title: string; description: string };
  sources: Record<string, Source>;
  hero: { copy: ProductHeroCopy; caption: string; layout?: "split" | "centered" };
  /** The one comparison table: deciders (in the page's order) → details → both offer → choose. */
  table: { heading: Heading; lead: string; rows: MatrixRow[]; choose: { roma: string[]; them: string[] } };
  story: GlimpseStory | PromomashStory | VividlyStory | FloretStory;
  faqs: Faq[];
};
