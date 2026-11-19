import type { ProductHeroCopy } from "@/lib/content/products";
import type { Faq } from "@/components/sections/faq/data";

/**
 * Roma vs. Glimpse (/compare/glimpse, DESIGN.md §G.13).
 *
 * Sources rule: every Glimpse statement on the page is quoted verbatim from its public
 * site and lives in `SOURCES` below with its URL, so the whole comparison can be audited
 * (and re-checked) in one place. Roma statements use approved copy only (positioning PDF,
 * site.ts, platform.ts). Decisions (client, 20 Nov 2026): name and quote Glimpse; no
 * company-size, coverage or promo comparison; show "from $399/month".
 *
 * Guardrails: no "automatically" / "AI" for Roma, no recovery guarantee, never "free",
 * never imply Roma has (or lacks) a human service team: "You confirm, Roma files".
 * Glimpse is rendered in neutral ink/sand; its mark only as a single-ink mask (GlimpseMark).
 *
 * Re-check every SOURCES quote against the live site before launch and update CHECKED_ON.
 */

export const CHECKED_ON = "20 Nov 2026";
export const GLIMPSE_SITE = "https://www.tryglimpse.com/";

export type SourceId = keyof typeof SOURCES;
export type Source = { who: "roma" | "glimpse"; quote: string; url: string; where: string };

export const SOURCES = {
  gOnboard: {
    who: "glimpse",
    quote: "Get onboarded in 45 days",
    url: "https://www.tryglimpse.com/integrations",
    where: "tryglimpse.com/integrations, onboarding timeline",
  },
  gFirstDispute: {
    who: "glimpse",
    quote: "On average, 30 days, from signing the contract to sending out the first dispute.",
    url: "https://www.tryglimpse.com/product",
    where: "tryglimpse.com/product, FAQ",
  },
  gManaged: {
    who: "glimpse",
    quote: "Glimpse isn't a tool you have to implement. It's a managed service that handles retailer deductions end-to-end.",
    url: "https://www.tryglimpse.com/glimpse-guarantee",
    where: "tryglimpse.com/glimpse-guarantee",
  },
  gSpecialists: {
    who: "glimpse",
    quote: "Deduction specialists file every dispute, then resolved cases sync back to your ERP automatically.",
    url: "https://www.tryglimpse.com/glimpse-guarantee",
    where: "tryglimpse.com/glimpse-guarantee",
  },
  gPricing: {
    who: "glimpse",
    quote: "Pricing is simple and incentive-aligned. Talk to sales for a custom quote tailored to your brand's scale and retailer mix.",
    url: "https://www.tryglimpse.com/product",
    where: "tryglimpse.com/product, FAQ",
  },
  gHour: {
    who: "glimpse",
    quote: "Most customers spend under an hour per week in Glimpse.",
    url: "https://www.tryglimpse.com/product",
    where: "tryglimpse.com/product, FAQ",
  },
  gRetrieve: {
    who: "glimpse",
    quote: "Glimpse pulls deduction documents, automatically.",
    url: "https://www.tryglimpse.com/product",
    where: "tryglimpse.com/product, step 01 Retrieve",
  },
  gValidate: {
    who: "glimpse",
    quote: "AI agents check every single deduction.",
    url: "https://www.tryglimpse.com/product",
    where: "tryglimpse.com/product, step 02 Validate",
  },
  gDispute: {
    who: "glimpse",
    quote: "After identifying an invalid deduction, Glimpse files disputes before the retailer windows close.",
    url: "https://www.tryglimpse.com/product",
    where: "tryglimpse.com/product, step 03 Dispute",
  },
  gRecover: {
    who: "glimpse",
    quote: "Recovered dollars are applied automatically and reflected in your ERP.",
    url: "https://www.tryglimpse.com/product",
    where: "tryglimpse.com/product, step 04 Recover",
  },
  gInsights: {
    who: "glimpse",
    quote: "Personalized insights to action from invoice-level data",
    url: "https://www.tryglimpse.com/product",
    where: "tryglimpse.com/product",
  },
  gCashApp: {
    who: "glimpse",
    quote: "with cash application available on mid-market plans.",
    url: "https://www.tryglimpse.com/product",
    where: "tryglimpse.com/product, FAQ",
  },
  gErp: {
    who: "glimpse",
    quote: "Glimpse connects to QuickBooks and Netsuite major ERPs, alongside each retailer's portal.",
    url: "https://www.tryglimpse.com/integrations",
    where: "tryglimpse.com/integrations, FAQ",
  },
  gSoc2: {
    who: "glimpse",
    quote: "SOC 2 badge in the site footer, with a Trust Center hosted on Vanta.",
    url: GLIMPSE_SITE,
    where: "tryglimpse.com, footer",
  },
  rApproach: {
    who: "roma",
    quote: "Roma pulls every deduction from your distributor and retailer portals. See where the money went, dispute the invalid ones, and book the rest.",
    url: "/",
    where: "Roma home",
  },
  rLive: {
    who: "roma",
    quote: "Live in 5 minutes. No ERP or IT project. Setup time varies by portal.",
    url: "/platform",
    where: "How Roma works",
  },
  rConfirm: {
    who: "roma",
    quote: "You confirm every dispute, with a full audit trail. Your data never trains our models.",
    url: "/platform",
    where: "How Roma works",
  },
  rDispute: {
    who: "roma",
    quote: "Dispute in two clicks and track every status.",
    url: "/deduction-management",
    where: "Deduction management",
  },
  rPrice: {
    who: "roma",
    quote: "Paid subscription from $399/month. Exact pricing for your brand on a demo.",
    url: "/book-a-demo",
    where: "Roma pricing",
  },
  rAnalytics: {
    who: "roma",
    quote: "Trade rate per retailer, distributor and chain. Deductions as a percent of sales, and the margin impact. Forecasting based on 12-month trends.",
    url: "/analytics",
    where: "Analytics",
  },
  rAccounting: {
    who: "roma",
    quote: "Every remittance line tied to its invoice or deduction. Custom GL code mapping. A full audit trail.",
    url: "/accounting",
    where: "Accounting",
  },
  rErp: {
    who: "roma",
    quote: "Export to NetSuite, QuickBooks or CSV.",
    url: "/accounting",
    where: "Accounting",
  },
  rSecurity: {
    who: "roma",
    quote: "SOC 2 Type II and ISO 27001 compliant. Your data is only accessible to your team.",
    url: "/#faq",
    where: "Roma FAQ",
  },
} satisfies Record<string, Source>;

/**
 * Footnote numbers: the working paper's reading order (row by row, Roma then Glimpse),
 * then the sources only cited in "Who holds the pen". Every SOURCES key must appear once.
 */
export const SOURCE_ORDER: SourceId[] = [
  "rApproach", "gManaged",
  "rLive", "gOnboard",
  "rDispute", "gFirstDispute",
  "rConfirm", "gSpecialists",
  "rPrice", "gPricing",
  "rAnalytics", "gInsights",
  "rAccounting", "gCashApp",
  "rErp", "gErp",
  "rSecurity", "gSoc2",
  "gRetrieve", "gValidate", "gDispute", "gRecover", "gHour",
];

/* ── 1. Hero ─────────────────────────────────────────────────────────────── */

export const cmpHero: ProductHeroCopy = {
  eyebrow: "Roma vs. Glimpse",
  icon: "sort",
  heading: { before: "Two ways to win back ", accent: "deductions", after: "." },
  lead: "Glimpse is a managed service that works your deductions for you, after a 45-day onboarding. Roma puts every deduction in front of you in under 5 minutes, and you decide what gets disputed. Here’s how they compare, in each company’s own words.",
  ground: { src: "/images/cta/texture-bg.webp", position: "50% 50%" },
  summary:
    "A 45-day timeline. Roma is live on day zero, in under 5 minutes, and deductions from UNFI, KeHE, Target and Walmart arrive from then on. Glimpse’s published onboarding runs from Today (we discuss your needs) to Day 10 (we build the pipelines) to Day 45 (we identify lost revenue), with the first dispute 30 days after signing on average.",
};

export const firstDays = {
  days: 45,
  ruler: [0, 5, 10, 15, 20, 25, 30, 35, 40, 45],
  rulerMobile: [0, 10, 30, 45],
  roma: {
    name: "Roma",
    live: "Live · under 5 min",
    bar: "Your deductions, matched and in view",
    // Illustrative arrivals along the lane (day, label, category). Shape only.
    chips: [
      { day: 1, label: "UNFI · MCB", cat: "promo" },
      { day: 6, label: "KeHE · Shortage", cat: "shortage" },
      { day: 13, label: "Target · Fee", cat: "fees" },
      { day: 20, label: "Walmart · Damage", cat: "shortage" },
      { day: 27, label: "UNFI · Promo", cat: "promo" },
      { day: 34, label: "KeHE · Slotting", cat: "fees" },
    ],
  },
  glimpse: {
    name: "Glimpse",
    tag: "Published onboarding",
    milestones: [
      { day: 0, label: "Today", title: "We discuss your needs" },
      { day: 10, label: "Day 10", title: "We build the pipelines" },
      { day: 45, label: "Day 45", title: "We identify lost revenue" },
    ],
    firstDispute: { day: 30, label: "Day 30", title: "First dispute, on average" },
  },
  end: { day: "Day 45", glimpse: "Glimpse: onboarded", roma: "Roma: 45 days of deductions already in view" },
  caption: `Illustrative. Glimpse milestones from tryglimpse.com, checked ${CHECKED_ON}. Roma setup time varies by portal.`,
} as const;

/* ── 2. The short version ─────────────────────────────────────────────────── */

export const fit = {
  label: "The short version",
  heading: { before: "Pick the one that fits how you ", accent: "work", after: "." },
  lead: "Both help CPG brands get invalid deductions back. They differ in who does the work, how fast you start, and how you pay.",
  roma: {
    name: "Roma fits if",
    items: [
      "You want to see every deduction yourself, starting this week.",
      "You’d rather approve each dispute than hand it off.",
      "You want the price on the page: from $399 a month.",
      "You also want margin by channel and GL-coded books.",
    ],
  },
  glimpse: {
    name: "Glimpse may fit if",
    items: [
      "You’d rather hand deductions to a managed service and not look at them.",
      "You want their specialists filing disputes for you.",
      "A 30–45 day onboarding and a custom quote work for you.",
    ],
  },
} as const;

/* ── 3. Who holds the pen ─────────────────────────────────────────────────── */

/** `you`: what your team does at this step (absent = the vendor does it alone). */
export type PenStage = { step: string; title: string; text: string; source?: SourceId; you?: string };

export const pen = {
  label: "Who does what",
  heading: { before: "Both file disputes. The difference is who ", accent: "decides", after: "." },
  lead: "Same four steps, different hands on them. Switch between the two to see where your team sits.",
  modes: ["With Roma", "With Glimpse"] as const,
  lanes: { you: "Your team", vendor: ["Roma", "Glimpse"] as const },
  roma: [
    { step: "Pull", title: "Roma pulls", text: "Every deduction and its backup comes in from your portals." },
    { step: "Check", title: "Roma matches, you see why", text: "Each one is matched to your invoices and promos, with the reason in view.", you: "See why" },
    { step: "Dispute", title: "You confirm, Roma files", text: "Invalid ones are queued with their documents. Nothing goes out without you.", source: "rConfirm", you: "Confirm" },
    { step: "Recover", title: "Tracked to payment", text: "Every status in one place, then booked with its GL code.", source: "rDispute", you: "Track it" },
  ] satisfies PenStage[],
  glimpse: [
    { step: "Retrieve", title: "Glimpse retrieves", text: "“Glimpse pulls deduction documents, automatically.”", source: "gRetrieve" },
    { step: "Validate", title: "AI agents + experts validate", text: "“AI agents check every single deduction.” Human experts check the edge cases.", source: "gValidate" },
    { step: "Dispute", title: "Glimpse files", text: "“Glimpse files disputes before the retailer windows close.”", source: "gDispute" },
    { step: "Recover", title: "Applied to your ERP", text: "“Recovered dollars are applied automatically and reflected in your ERP.”", source: "gRecover" },
  ] satisfies PenStage[],
  yourLaneGlimpse: "“Most customers spend under an hour per week in Glimpse.”",
  yourLaneSource: "gHour" as SourceId,
  announce: ["Showing Roma: your team confirms each dispute.", "Showing Glimpse: the vendor runs every step."] as const,
  close:
    "If you never want to look at a deduction, Glimpse is built for that. If you want to know what’s disputed in your name, Roma is.",
  summary:
    "With Roma, Roma pulls and matches every deduction, your team sees why each was taken and confirms every dispute, and Roma files it and tracks it to payment. With Glimpse, a managed service retrieves, validates, disputes and recovers, and its customers spend under an hour a week in the product.",
};

/* ── 4. Price on the page ─────────────────────────────────────────────────── */

export const price = {
  label: "Pricing",
  heading: { before: "From ", accent: "$399", after: " a month. Before the sales call." },
  lead: "Roma is a paid subscription with its starting price in public. Glimpse prices every brand by custom quote.",
  roma: {
    head: "Roma",
    lines: [
      { k: "Plan", v: "Subscription" },
      { k: "Live in", v: "Under 5 min" },
      { k: "Setup", v: "No ERP or IT project" },
    ],
    totalLabel: "From",
    total: "$399",
    per: "/ month",
    foot: "Exact pricing for your brand: book a demo.",
  },
  glimpse: {
    head: "Glimpse",
    stamp: "Custom quote",
    quote: "Talk to sales for a custom quote tailored to your brand’s scale and retailer mix.",
    source: "gPricing" as SourceId,
  },
} as const;

/* ── 5. The working paper ─────────────────────────────────────────────────── */

export type PaperCell = { text: string; source: SourceId; tick?: boolean };
export type PaperRow = { label: string; roma: PaperCell; glimpse: PaperCell };

export const paper = {
  label: "Side by side",
  heading: { before: "Line by line, in their ", accent: "words", after: " and ours." },
  lead: "Ticks mark what both offer. Where the two differ, we describe each one and let you weigh it.",
  ref: "WP-01 · Deductions vendor review",
  cols: ["", "Roma", "Glimpse"] as const,
  rows: [
    {
      label: "Approach",
      roma: { text: "Software your team runs: deductions, analytics and accounting in one place.", source: "rApproach" },
      glimpse: { text: "“A managed service that handles retailer deductions end-to-end.”", source: "gManaged" },
    },
    {
      label: "Time to go live",
      roma: { text: "Under 5 minutes. No ERP or IT project.", source: "rLive" },
      glimpse: { text: "“Get onboarded in 45 days.”", source: "gOnboard" },
    },
    {
      label: "First dispute",
      roma: { text: "Dispute in two clicks, once your portals are connected.", source: "rDispute" },
      glimpse: { text: "“On average, 30 days, from signing the contract.”", source: "gFirstDispute" },
    },
    {
      label: "Who files disputes",
      roma: { text: "You confirm each one, Roma files it.", source: "rConfirm" },
      glimpse: { text: "“Deduction specialists file every dispute.”", source: "gSpecialists" },
    },
    {
      label: "Price",
      roma: { text: "From $399/month, paid subscription.", source: "rPrice" },
      glimpse: { text: "“Talk to sales for a custom quote.”", source: "gPricing" },
    },
    {
      label: "Analytics",
      roma: { text: "Trade rate by retailer, deductions as % of sales, margin impact, 12-month forecast.", source: "rAnalytics", tick: true },
      glimpse: { text: "“Personalized insights to action from invoice-level data.”", source: "gInsights", tick: true },
    },
    {
      label: "Accounting",
      roma: { text: "Custom GL code mapping, every remittance line tied out, full audit trail.", source: "rAccounting", tick: true },
      glimpse: { text: "Cash application, “available on mid-market plans.”", source: "gCashApp", tick: true },
    },
    {
      label: "ERP",
      roma: { text: "Export to NetSuite, QuickBooks or CSV.", source: "rErp", tick: true },
      glimpse: { text: "Connects to QuickBooks and NetSuite.", source: "gErp", tick: true },
    },
    {
      label: "Security",
      roma: { text: "SOC 2 Type II and ISO 27001.", source: "rSecurity", tick: true },
      glimpse: { text: "SOC 2, with a public Trust Center.", source: "gSoc2", tick: true },
    },
  ] satisfies PaperRow[],
  sourcesTitle: "Sources",
  note: `Glimpse information is quoted from tryglimpse.com, checked ${CHECKED_ON}. Products change; if something here is out of date,`,
  noteLink: { label: "tell us", href: "/contact" },
  summary:
    "A table comparing Roma and Glimpse on approach, time to go live, first dispute, who files disputes, price, analytics, accounting, ERP and security, with a source for every statement.",
};

/* ── FAQ ─────────────────────────────────────────────────────────────────── */

export const cmpFaqCopy = {
  label: "Roma vs. Glimpse",
  lines: [{ text: "Still comparing?" }, { text: "Here are straight ", accent: "answers" }],
};

export const cmpFaqs: Faq[] = [
  {
    q: "Is Roma a managed service like Glimpse?",
    a: "Roma is built for your team to use. It pulls every deduction from your portals and matches it to your invoices and promos. You confirm which ones to dispute, Roma files them from one place, and every status is tracked to payment.",
  },
  {
    q: "How fast can I see my own deductions?",
    a: "Under 5 minutes. Connect your portals and your deductions start coming in. No ERP or IT project. Setup time varies by portal.",
  },
  {
    q: "How much does Roma cost?",
    a: "Roma is a paid subscription from $399/month. Book a demo and we’ll give you exact pricing for your brand.",
  },
  {
    q: "Does Roma replace my current accounting or ERP system?",
    a: "No. Roma works alongside your accounting stack and exports coded lines to NetSuite, QuickBooks or CSV. You don’t change how you book or reconcile.",
  },
  {
    q: "Is my data secure?",
    a: "Yes. Roma is SOC 2 Type II and ISO 27001 compliant, your data is only accessible to your team, and it never trains our models.",
  },
  {
    q: "Where does the Glimpse information on this page come from?",
    a: `From Glimpse’s public website, checked on ${CHECKED_ON}. We quote it directly and list every source on this page. If anything has changed, let us know through our contact page and we’ll update it.`,
  },
];
