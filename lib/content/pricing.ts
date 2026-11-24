// /pricing (DESIGN.md §G.18): plans, feature matrix, alternatives, proof and FAQ.
// Brief: "Roma website: ROI calculator and pricing brief", 20 Nov 2026, §3.
// Pricing model B (tiers by portals connected). Entries with `confirmed: false` are drafts
// awaiting Roma's sign-off; edit them here and every surface (plan cards, matrix,
// JSON-LD) follows.

import { DEMO_HREF, SIGNUP_HREF } from "@/components/chat/data";

export type PlanId = "starter" | "growth" | "scale";

export type Plan = {
  id: PlanId;
  name: string;
  bestFor: string;
  /** Monthly price in USD; null = "Talk to sales". */
  price: number | null;
  /** "From" before the figure (entry plan). */
  from?: boolean;
  portals: string;
  /** Upper bound of portals for this plan. null = no cap. */
  maxPortals: number | null;
  users: string;
  modules: string;
  support: string;
  cta: { label: string; href: string; kind: "try" | "demo" };
  confirmed: boolean;
};

export const PLANS: Plan[] = [
  {
    id: "starter",
    name: "Starter",
    bestFor: "Founder-led brands getting deductions under control",
    price: 399,
    from: true,
    portals: "1–2 portals",
    maxPortals: 2,
    users: "Up to 3 users",
    modules: "Deduction management",
    support: "Email support",
    cta: { label: "Try now", href: SIGNUP_HREF, kind: "try" },
    confirmed: false,
  },
  {
    id: "growth",
    name: "Growth",
    bestFor: "Growing finance teams across more channels",
    price: 799,
    portals: "3–5 portals",
    maxPortals: 5,
    users: "Up to 10 users",
    modules: "Deduction management and Analytics",
    support: "Priority support and an onboarding call",
    cta: { label: "Book a demo", href: DEMO_HREF, kind: "demo" },
    confirmed: false,
  },
  {
    id: "scale",
    name: "Scale",
    bestFor: "Full AR teams with many retailers and distributors",
    price: null,
    portals: "6+ portals",
    maxPortals: null,
    users: "Unlimited users",
    modules: "Deduction management, Analytics and Accounting",
    support: "A dedicated success manager",
    cta: { label: "Book a demo", href: DEMO_HREF, kind: "demo" },
    confirmed: false,
  },
];

export const ENTRY_PLAN = PLANS[0];

/** The portal-count picker above the plans: each option highlights one plan. */
export const PORTAL_OPTIONS: { label: string; plan: PlanId }[] = [
  { label: "1–2", plan: "starter" },
  { label: "3–5", plan: "growth" },
  { label: "6+", plan: "scale" },
];

export const pricingCopy = {
  meta: {
    title: "Roma pricing | Deduction management for CPG brands",
    description:
      "Roma pricing starts from $399/month. Find, dispute and book every UNFI, KeHE, Walmart and Target deduction. Live in under 5 minutes.",
  },
  /** JSON-LD Offer is emitted only once Roma confirms the price (brief §3.9). */
  offerConfirmed: false,
  heading: "Simple pricing. Every deduction, accounted for.",
  lead: "Know your cost before the first call. Live in under 5 minutes, no ERP or IT project.",
  ctas: {
    demo: { label: "Book a demo", href: DEMO_HREF },
    try: { label: "Try now", href: SIGNUP_HREF },
  },
  plans: {
    label: "Plans",
    picker: "How many portals do you connect?",
    pickerHint: "We’ll point you to the plan that fits.",
    perMonth: "/month",
    from: "From",
    custom: "Talk to sales",
    customSub: "Priced for your portals",
    rows: { portals: "Portals", users: "Users", modules: "Modules", support: "Support" },
    fits: "Fits your portals",
    flat: "Flat monthly price. Your price isn’t tied to deduction volume.",
  },
  matrix: {
    label: "What’s included",
    heading: { before: "Everything in each plan, ", accent: "side by side", after: "." },
    lead: "Every plan pulls, checks and tracks every deduction. Higher plans add analytics, accounting and more portals.",
    feature: "Feature",
    included: "Included",
    notIncluded: "Not included",
    planSwitch: "Show plan",
  },
  alternatives: {
    label: "Roma vs. alternatives",
    heading: { before: "Most deduction tools hide the price. ", accent: "Ours", after: " is on this page." },
    lead: "How the other options charge, from their own public pages.",
    cols: { name: "", price: "Published price", model: "Model", compare: "Compare" },
    compareLink: "Full comparison",
    soon: "Coming soon",
    sources: "Sources",
    checked: "Competitor pricing checked 20 Nov 2026 from each company’s public site.",
  },
  proof: {
    label: "Proof",
    heading: { before: "Brands that stopped writing off ", accent: "deductions", after: "." },
    note: "Results vary by brand. Not a guarantee of recovery.",
    stories: ["good-day-chocolate", "smash-kitchen"],
    readStory: "Read story",
    securityLabel: "Security and control",
  },
  faqHead: { label: "Pricing FAQs", lines: [{ text: "Questions about " }, { text: "what Roma ", accent: "costs" }] },
  closing: {
    heading: { before: "Know your number. Then ", accent: "see it", after: " in Roma." },
    sub: "Book 30 minutes and we’ll price Roma for your portals, with your own deductions on screen.",
    cta: { label: "Book a demo", href: DEMO_HREF },
    secondary: { label: "Try now", href: SIGNUP_HREF },
  },
};

/* ── Feature matrix (brief §3.5, features from the live product pages) ── */

/** true = included, false = not included, string = a value shown in the cell. */
export type Cell = boolean | string;
export type MatrixRow = { label: string; cells: [Cell, Cell, Cell] };
export type MatrixGroup = { title: string; href?: string; rows: MatrixRow[] };

const all: [Cell, Cell, Cell] = [true, true, true];
const upGrowth: [Cell, Cell, Cell] = [false, true, true];
const scaleOnly: [Cell, Cell, Cell] = [false, false, true];

export const MATRIX: MatrixGroup[] = [
  {
    title: "Plan basics",
    rows: [
      { label: "Portals connected", cells: ["1–2", "3–5", "6+"] },
      { label: "Users", cells: ["Up to 3", "Up to 10", "Unlimited"] },
      { label: "Support", cells: ["Email", "Priority + onboarding call", "Dedicated success manager"] },
    ],
  },
  {
    title: "Deduction management",
    href: "/deduction-management",
    rows: [
      { label: "One inbox for every deduction", cells: all },
      { label: "Backup pulled with line-level extraction", cells: all },
      { label: "23 pre-built reason codes", cells: all },
      { label: "Assign to teammates and saved views", cells: all },
      { label: "Dispute in two clicks", cells: all },
      { label: "Track every dispute to payment", cells: all },
    ],
  },
  {
    title: "Analytics",
    href: "/analytics",
    rows: [
      { label: "Deducted, count and trade rate per retailer", cells: upGrowth },
      { label: "Classify by MCB, shortage, OI, damage and spoils", cells: upGrowth },
      { label: "Compare periods", cells: upGrowth },
      { label: "Trade spend as a % of revenue", cells: upGrowth },
      { label: "Forecasts from 12-month trends", cells: scaleOnly },
      { label: "Export", cells: upGrowth },
    ],
  },
  {
    title: "Accounting",
    href: "/accounting",
    rows: [
      { label: "Match payments to invoices", cells: scaleOnly },
      { label: "Custom GL code mapping", cells: scaleOnly },
      { label: "Standardized classification", cells: scaleOnly },
      { label: "Full audit trail", cells: scaleOnly },
      { label: "Export to NetSuite, QuickBooks or CSV", cells: scaleOnly },
    ],
  },
  {
    title: "Platform and security",
    href: "/platform",
    rows: [
      { label: "UNFI, KeHE, Target and Walmart", cells: all },
      { label: "Live in under 5 minutes", cells: all },
      { label: "You confirm every dispute", cells: all },
      { label: "SOC 2 Type II and ISO 27001", cells: all },
      { label: "Your data never trains models", cells: all },
    ],
  },
];

/* ── Roma vs alternatives (brief §3.6; competitor facts from public pages) ── */

export type AltRow = {
  name: string;
  price: string;
  model: string;
  /** /compare/<slug>, when that page exists. */
  href?: string;
  /** Compare registry slug: its wordmark is shown on the tag. */
  slug?: string;
  /** Price is on their public site (solid tag); otherwise a dashed "ask us" tag. */
  published?: boolean;
  /** Index into ALT_SOURCES (shown as a footnote number). */
  source?: number;
  roma?: boolean;
};

export const ALT_SOURCES = [
  { name: "Glimpse", url: "https://www.tryglimpse.com/product", where: "tryglimpse.com/product (FAQ)" },
  { name: "Promomash", url: "https://www.promomash.com/plans", where: "promomash.com/plans" },
  { name: "Vividly", url: "https://www.govividly.com", where: "govividly.com" },
  { name: "Floret", url: "https://www.tryfloret.com/disputes", where: "tryfloret.com/disputes" },
  { name: "Overdeduct", url: "https://www.overdeduct.com/pricing", where: "overdeduct.com/pricing" },
];

export const ALTERNATIVES: AltRow[] = [
  { name: "Roma", price: "From $399/month", model: "Software your team runs", roma: true },
  { name: "Glimpse", slug: "glimpse", price: "Custom quote", model: "Managed service", href: "/compare/glimpse", source: 0 },
  { name: "Promomash", slug: "promomash", price: "“Get Pricing” per plan; deductions priced on monthly DI volume", model: "Platform + managed service", href: "/compare/promomash", source: 1 },
  { name: "Vividly", slug: "vividly", price: "No prices published", model: "Full trade platform", href: "/compare/vividly", source: 2 },
  { name: "Floret", slug: "floret", price: "Free pilot, then custom quote", model: "Software + team that executes disputes", href: "/compare/floret", source: 3 },
  { name: "Overdeduct", price: "Free tool; $49 to $99/month self-serve; 25% contingency managed", model: "Self-serve or contingency", source: 4, published: true },
];

/* ── Proof (brief §3.7) ─────────────────────────────────────────────── */

export const STATS = [
  { figure: "<5 min", label: "to go live" },
  { figure: "90%", label: "time saved" },
  { figure: "$50M+", label: "deductions recovered" },
];

/** `badge`: the compliance medallion used on the home Compliance section. */
export const SECURITY: { title: string; body: string; badge?: { src: string; alt: string } }[] = [
  { title: "SOC 2 Type II", body: "Independently audited controls.", badge: { src: "/images/compliance/soc2-type2.webp", alt: "AICPA SOC 2 Type 2 compliant" } },
  { title: "ISO 27001", body: "Certified information security.", badge: { src: "/images/compliance/iso-27001.webp", alt: "ISO 27001 certified" } },
  { title: "Your data never trains our models", body: "Your deductions stay yours." },
  { title: "You confirm every dispute", body: "Nothing is filed without you." },
];

/* ── FAQ (brief §3.8; answers marked confirmed: false are drafts) ───── */

export const PRICING_FAQS: { q: string; a: string; confirmed: boolean }[] = [
  {
    q: "How much does Roma cost?",
    a: "Plans start from $399/month. Book a demo for exact pricing for your brand.",
    confirmed: false,
  },
  {
    q: "Is the price tied to my deduction volume?",
    a: "No. Your price depends on the portals you connect, not on how many deductions come through them.",
    confirmed: false,
  },
  {
    q: "Is there a contract or minimum term?",
    a: "Plans are billed monthly. If you’d rather lock in your price, ask us about an annual agreement.",
    confirmed: false,
  },
  {
    q: "Is there a free trial or pilot?",
    a: "You can try Roma now: connect a portal and see your own deductions before you commit. For a guided pilot, book a demo.",
    confirmed: false,
  },
  {
    q: "Do you charge a % of recovered dollars?",
    a: "No. Roma is a flat monthly price, so every dollar you recover stays with you.",
    confirmed: false,
  },
  {
    q: "What does adding a retailer cost?",
    a: "Portals within your plan’s range are included. Going past it moves you to the next plan, and we’ll size it with you.",
    confirmed: false,
  },
  {
    q: "How long does setup take?",
    a: "Under 5 minutes. Connect your portals and your deductions start coming in.",
    confirmed: true,
  },
  {
    q: "Does Roma replace my ERP?",
    a: "No. Roma works alongside your accounting stack and exports coded lines to NetSuite, QuickBooks or CSV.",
    confirmed: true,
  },
  {
    q: "Is my data secure?",
    a: "Yes. SOC 2 Type II and ISO 27001; your data never trains our models.",
    confirmed: true,
  },
  {
    q: "Which retailers are supported?",
    a: "UNFI, KeHE, Target and Walmart today.",
    confirmed: true,
  },
];

export function getPlan(id: string | null | undefined) {
  return PLANS.find((p) => p.id === id);
}

export const fmtPrice = (n: number) => `$${n.toLocaleString("en-US")}`;
