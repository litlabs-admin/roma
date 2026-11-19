import type { PenStage, QuoteId } from "./types";

/**
 * Roma's side of every comparison page (DESIGN.md §G.13). Sources: positioning PDF
 * (4 Nov 2026), Sales Battle Cards (Nov 2026), comparison sheet (Nov 2026).
 *
 * Guardrails: no accuracy %, never "100% accurate" (say "0% uncategorized"), never
 * "automatically disputes" or "AI marks lines invalid" (the user decides), Auto Backup
 * Request is "new" (no results quoted, no promise of how fast distributors reply),
 * contract terms are unconfirmed (don't say month-to-month), coverage is KeHE, UNFI,
 * Target and Walmart only, no revenue band named.
 */

export const ROMA = {
  price: "$399",
  live: "5 min",
  coverage: "KeHE, UNFI, Target and Walmart",
} as const;

export const ILLUSTRATIVE_ONLY = "Illustrative data.";

/** Shared copy for the "Where Roma stands apart" rows; pages may override title/body. */
export const APART = {
  classify: {
    label: "Classification",
    title: "Every line named. Nothing left in a pile.",
    body: "Roma decodes every UNFI, KeHE and Target code and reads the backup when a code is new or vague. Each line gets a type, subtype and retailer. Fix a mapping once and it sticks.",
    roma: "0% of deductions left uncategorized",
  },
  backups: {
    label: "Backups",
    title: "Every backup on a check, in one zip.",
    body: "Download the remittance advice and every deduction backup behind it in one file, ready for your bookkeeper. Missing a backup? Roma asks the distributor on day 3, then every 15 days until it arrives.",
    roma: "One zip per check, and missing backups requested for you",
    badge: "New · Auto Backup Request",
  },
  control: {
    label: "Disputes",
    title: "You decide what’s disputed in your name.",
    body: "Roma matches every deduction and queues the invalid ones with their documents. You confirm, Roma files from one place, and every status is tracked to payment.",
    roma: "You confirm every dispute before it’s filed",
  },
  price: {
    label: "Pricing",
    title: "A price you can read before the call.",
    body: "Roma is a flat subscription from $399 a month, published right here. Book a demo for exact pricing for your brand.",
    roma: "From $399/month, published",
  },
} as const;

/** "With Roma" lane for the who-does-what toggle. */
export const ROMA_PEN: PenStage[] = [
  { step: "Pull", title: "Roma pulls", text: "Every deduction and its backup comes in from your portals." },
  { step: "Check", title: "Roma classifies, you see why", text: "Each line gets a type, subtype and retailer, matched to your invoices and promos.", you: "See why" },
  { step: "Dispute", title: "You confirm, Roma files", text: "Invalid ones are queued with their documents. Nothing goes out without you.", you: "Confirm" },
  { step: "Recover", title: "Tracked to payment", text: "Every status in one place, then booked with its GL code.", you: "Track it" },
];

export const ROMA_RECEIPT = {
  lines: [
    { k: "Plan", v: "Subscription" },
    { k: "Live in", v: "Under 5 min" },
    { k: "Setup", v: "No ERP or IT project" },
  ],
  total: "$399",
  per: "/ month",
  foot: "Exact pricing for your brand: book a demo.",
} as const;

/** Customer words from Arali call recordings (Sales Battle Cards, Sep–Oct 2026). */
export const QUOTES: Record<QuoteId, { text: string; name: string; company: string; topic: string }> = {
  julie: {
    text: "The classification of the types is much better than what I was experiencing before with Glimpse. It seems much more accurate.",
    name: "Julie Mayden",
    company: "Farmer Direct Foods",
    topic: "On classification",
  },
  brandy: {
    text: "I really like the feature of downloading all the backup together. So it’s not like click, click, click.",
    name: "Brandy Hamilton",
    company: "Love Corn",
    topic: "On Download All backups",
  },
};

/** Proof figures (comparison sheet). */
export const STATS = [
  { figure: "$53K", label: "recovered by Good Day Chocolate in 6 months" },
  { figure: "$23K", label: "recovered by Smash Kitchen in 3 months" },
] as const;

export const RESULTS_CAPTION = "Results vary by brand. Not a guarantee of recovery.";
