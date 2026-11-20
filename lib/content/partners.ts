// Copy for /partners (DESIGN.md §G.16). Keep copy here, not inside animation code (§I.2).
//
// STRUCTURE follows Cygnet.One's partner page (client reference, Nov 2026):
// hero → why partner → opportunity by partner type → solutions open for partnership →
// built to help you win → founder note → partnership journey → apply → FAQ → closing CTA.
// Cygnet's partner-logo wall and partner stories are left out on purpose (client,
// 20 Nov 2026): Roma has no partners yet and they would be fictional.
//
// SOURCES
// - PDF ("Messaging and Positioning – Roma", 4 Nov 2026): 2–3% of revenue lost to
//   deductions; "bookkeepers record deductions, they don't recover them"; live in 5
//   minutes; from $399/month; Good Day Chocolate $53K in 6 months; 25 brands.
// - Client (20 Nov 2026): partner types = accountants & fractional CFOs, technology &
//   integrations, investors & accelerators; a SHELL page for client preview.
// - Module capabilities: lib/content/products.ts (deduction management, analytics,
//   accounting pages).
//
// MOCK — replace before launch:
// - Every program term and enablement item (referral revenue, partner pricing, partner
//   manager, demo workspace, co-marketing, managed service). Roma has no partner program yet.
// - The founder quote (name and photo are Roma's real founder, Ujwal Kalra).
// - Every FAQ answer.
// Hero photo: Van Tay Media, unsplash.com/photos/TFFn3BYLc5s (Unsplash License).
// This file is NOT part of the Ask Roma knowledge base (lib/content/knowledge.ts).
//
// Guardrails (§A.1, §A.8, PDF): no "free", "automatically", "seamless", "AI-powered";
// retailers only as channels/portals; no guaranteed recovery amounts.

import type { Heading } from "./platform";
import type { Faq } from "@/components/sections/faq/data";
import type { Option } from "./contact";

export const APPLY_ID = "apply";
export const APPLY_HREF = `#${APPLY_ID}`;
export const JOURNEY_ID = "partner-journey";

/* ── Hero ──────────────────────────────────────────────────────────────── */

export const partnerHero = {
  eyebrow: "Partner program",
  heading: { before: "Become a Roma ", accent: "partner", after: "." } as Heading,
  lead: "Bring deduction recovery to the CPG brands you already work with, and add a recurring revenue line to your business.",
  primary: { label: "Become a partner", href: APPLY_HREF },
  secondary: { label: "How it works", href: `#${JOURNEY_ID}` },
  forLabel: "Who it’s for",
  forList: ["Accountants & fractional CFOs", "Technology partners", "Investors & accelerators"],
  image: { src: "/images/partners/hero-partners-2400.webp", width: 2400, height: 1600 },
};

/* ── Why partner ───────────────────────────────────────────────────────── */

export const why = {
  label: "Why partner with Roma",
  heading: { before: "The deduction layer your clients are ", accent: "missing", after: "." } as Heading,
  lead: "Emerging CPG brands lose 2–3% of revenue to deductions from UNFI, KeHE and retailers. Bookkeepers record them, but nobody has time to recover them. Roma closes that gap, and partners help brands get there.",
  benefits: [
    {
      title: "Expand what you offer",
      text: "Add deduction recovery, analytics and clean accounting to the services, software or support you already give brands.",
    },
    {
      title: "Reach a growing market",
      text: "Natural and specialty brands selling through UNFI, KeHE and major retailers, from $1M to $50M in revenue.",
    },
    {
      title: "Create recurring revenue",
      text: "Earn through referral, co-sell or managed-service models, for as long as your clients use Roma.",
    },
  ],
};

/* ── Opportunity by partner type ───────────────────────────────────────── */

export type PartnerTypeKey = "accounting" | "technology" | "investor";

export const opportunitiesHead = {
  label: "Partnership opportunities",
  heading: { before: "Find the partnership that ", accent: "fits", after: "." } as Heading,
  lead: "Three kinds of partners, each with its own way of working with Roma.",
};

export const opportunities: { key: PartnerTypeKey; title: string; who: string; opportunity: string; cta: string }[] = [
  {
    key: "accounting",
    title: "Accountants & fractional CFOs",
    who: "Bookkeepers, outsourced accounting firms and fractional CFOs who keep the books for CPG brands.",
    opportunity: "Offer deduction recovery as a service on top of the books you already keep, and show clients their true margin by channel.",
    cta: "Apply as an accounting partner",
  },
  {
    key: "technology",
    title: "Technology & integration partners",
    who: "ERP, accounting, EDI and trade-promotion software used by CPG finance and operations teams.",
    opportunity: "Connect Roma to your product so mutual customers get deduction data where they already work, and build a shared go-to-market.",
    cta: "Apply as a technology partner",
  },
  {
    key: "investor",
    title: "Investors & accelerators",
    who: "CPG funds, accelerators and incubators backing emerging natural and specialty brands.",
    opportunity: "Give portfolio brands partner pricing and hands-on help with deductions, so margin isn’t lost as they scale into retail.",
    cta: "Apply as an investor partner",
  },
];

/* ── Solutions open for partnership ────────────────────────────────────── */

export const solutionsHead = {
  label: "Solutions open for partnership",
  heading: { before: "What you can bring to your ", accent: "clients", after: "." } as Heading,
  lead: "Roma’s three modules work together. Partners can lead with any of them.",
};

export const solutions = [
  {
    key: "deductions",
    tab: "Deduction management",
    title: "Recover invalid deductions",
    text: "Every deduction from UNFI, KeHE and retailer portals in one inbox, matched to invoices and promo agreements.",
    points: [
      "Run deduction reviews for clients from one place",
      "Dispute invalid deductions with backup attached",
      "Track every dispute from filed to paid back",
      "Report recovered dollars to clients each month",
    ],
    link: { label: "Explore Deduction management", href: "/deduction-management" },
  },
  {
    key: "analytics",
    tab: "Analytics",
    title: "Show where the money goes",
    text: "Deductions by retailer, type and month, so brands know what each promo and channel really costs.",
    points: [
      "Add trade-rate and margin reviews to your advisory work",
      "Compare channels and promos across a quarter",
      "Spot rising fees and shortages early",
    ],
    link: { label: "Explore Analytics", href: "/analytics" },
  },
  {
    key: "accounting",
    title: "Book every deduction",
    tab: "Accounting",
    text: "Coded, export-ready lines that tie out to every remittance and land in the client’s accounting system.",
    points: [
      "Close the month without manual matching",
      "Map deduction types to GL accounts once",
      "Export to NetSuite and other accounting tools",
    ],
    link: { label: "Explore Accounting", href: "/accounting" },
  },
];

/* ── Built to help you win ─────────────────────────────────────────────── */

export const enablementHead = {
  label: "Built to help you win",
  heading: { before: "Everything you need to ", accent: "succeed", after: "." } as Heading,
};

export const enablement = [
  { title: "Joint go-to-market", text: "Co-branded campaigns, webinars and guides for the brands you serve." },
  { title: "Sales enablement", text: "Pitch materials, demo scripts and deduction playbooks to start the conversation." },
  { title: "Onboarding & demo workspace", text: "Training for your team and a workspace to show Roma with real-looking data." },
  { title: "Commercial growth", text: "Recurring referral revenue for you and partner pricing for your clients." },
  { title: "Deduction expertise", text: "Roma’s know-how on UNFI, KeHE and retailer portals, on call when you need it." },
  { title: "A partner manager", text: "One person at Roma who knows your business and your clients." },
];

/* ── Founder note ──────────────────────────────────────────────────────── */

export const founder = {
  quote:
    "Founders don’t write off deductions because they want to. They do it because nobody has time to check. The people they already trust, their accountant, their investor, the tools they run on, are the best way to change that. We’d like to build that with you.",
  name: "Ujwal Kalra",
  role: "Co-founder & CEO, Roma",
  photo: { src: "/images/partners/founder-ujwal-kalra.webp", width: 800, height: 800 },
};

/* ── Partnership journey ───────────────────────────────────────────────── */

export const stepsHead = {
  label: "Partnership journey",
  heading: { before: "From first call to first ", accent: "client", after: "." } as Heading,
};

export const steps = [
  { title: "Discover", text: "A 30-minute call to understand your business, your clients and the right partnership model." },
  { title: "Enable", text: "Training for your team, a demo workspace and your partner materials." },
  { title: "Collaborate", text: "Introduce your first brands. We onboard them together and they go live in minutes." },
  { title: "Grow", text: "Expand across your clients with joint marketing and regular reviews with your partner manager." },
];

/* ── FAQ ───────────────────────────────────────────────────────────────── */

export const partnerFaqCopy = {
  label: "Partner FAQs",
  lines: [{ text: "Questions?" }, { text: "Here are straight ", accent: "answers" }],
};

export const partnerFaqs: Faq[] = [
  { q: "Who can become a Roma partner?", a: "Accountants and fractional CFOs, technology companies, and investors or accelerators who work with CPG brands selling through distributors or major retailers." },
  { q: "Is there a fee to join?", a: "No. There’s no fee to join the partner program. Terms are agreed with each partner on the first call." },
  { q: "How do partners earn?", a: "Through referral, co-sell or managed-service models. We’ll walk you through the options on the first call." },
  { q: "Can I manage Roma on my clients’ behalf?", a: "Yes. Accounting partners can work in each client’s Roma account with the client’s permission." },
  { q: "Which tools does Roma work with?", a: "Roma hands coded, export-ready lines to accounting systems like NetSuite. Technology partners help us add more." },
  { q: "What happens after I apply?", a: "We reply within one business day to set up a 30-minute intro call." },
];

/* ── Apply ─────────────────────────────────────────────────────────────── */

export const applyCopy = {
  label: "Become a partner",
  heading: { before: "Let’s build this ", accent: "together", after: "." } as Heading,
  lead: "Tell us a little about you and the brands you work with. The right person at Roma will get back to you.",
  next: {
    title: "What happens next",
    items: ["We read every application", "A 30-minute intro call", "Terms, onboarding and your first introduction"],
  },
  formTitle: "Partner application",
  formSub: "We reply within one business day.",
};

/* ── Closing CTA ───────────────────────────────────────────────────────── */

export const partnerClosing = {
  heading: { before: "Ready to grow ", accent: "together", after: "?" } as Heading,
  sub: "Tell us about your firm, product or fund. We reply within one business day.",
  cta: { label: "Become a partner", href: APPLY_HREF },
  secondary: { label: "Contact us", href: "/contact?topic=partnerships" },
};

/* ── Form ──────────────────────────────────────────────────────────────── */

export const PARTNER_TYPES: Option[] = [
  { value: "accounting", label: "Accountant or fractional CFO" },
  { value: "technology", label: "Technology or integration partner" },
  { value: "investor", label: "Investor or accelerator" },
  { value: "other", label: "Other" },
];

/** Event a partner-type CTA dispatches so the form presets its type without a reload. */
export const PARTNER_TYPE_EVENT = "roma:partner-type";

export const partnerPage = {
  submit: "Send application",
  success: {
    title: (name: string) => `Thanks, ${name}.`,
    body: "Your application is in. We’ll be in touch within one business day to set up an intro call.",
    again: "Send another application",
  },
};

export const partnerFieldCopy = {
  partnerType: { label: "Type of partnership", placeholder: "Choose a type" },
  message: { label: "Anything we should know?", placeholder: "The brands you work with, your product, your portfolio, anything." },
};

/* ── Illustrations (all illustrative; fictional firm and brands) ───────── */

export const ILLUSTRATIVE_ART = "Illustrative data. Fictional firm and brands.";

export const benefitArt = {
  offer: {
    title: "Northfield · Services",
    rows: ["Bookkeeping", "Month-end close", "Tax preparation"],
    added: "Deduction recovery",
    live: "Live in 5 min", // PDF
  },
  market: {
    portals: ["UNFI", "KeHE", "Target", "Walmart"],
    brands: ["F", "L", "H", "S", "M", "B"],
    count: "25 brands pay for Roma", // PDF
  },
  revenue: {
    title: "Partner statement",
    chip: "Recurring",
    // shape only, no amounts
    bars: [3, 4, 4, 6, 7, 9],
    months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
  },
};

export const typeArt = {
  accounting: {
    source: "UNFI remittance",
    lines: [
      { label: "MCB · Promo", gl: "6410 Promo" },
      { label: "Shortage", gl: "4920 Shortages" },
      { label: "Slotting fee", gl: "6420 Slotting" },
    ],
    status: "Booked",
  },
  technology: {
    tool: "Your product",
    portals: ["UNFI", "KeHE", "Target"],
    out: ["Coded lines", "Dispute status"],
  },
  investor: {
    fund: "Portfolio",
    brands: ["F", "L", "H", "S", "M", "B", "A", "P"],
    active: [0, 1, 2, 4, 5, 6],
    perk: "Roma for portfolio brands",
  },
};

/* Solutions scroll story: one client seen from a partner's seat (fictional). Figures
   reconcile within each scene (see comments). */
export const solutionsScene = {
  client: { name: "Fernbrook Kombucha", initial: "F", label: "Client", others: ["L", "H", "S"] },
  deductions: {
    title: "Deductions · Q3",
    // invalid rows: 1,284.50 + 823.20 = 2,107.70 recovered
    rows: [
      { ch: "UNFI", id: "DED-40211", type: "MCB · Promo", category: "promo" as const, amount: 1284.5, invalid: true },
      { ch: "KeHE", id: "DED-40227", type: "Slotting", category: "fees" as const, amount: 450, invalid: false },
      { ch: "UNFI", id: "DED-40235", type: "Shortage", category: "shortage" as const, amount: 823.2, invalid: true },
      { ch: "Target", id: "DED-40242", type: "Compliance fee", category: "fees" as const, amount: 312.4, invalid: false },
      { ch: "Walmart", id: "DED-40250", type: "Promo", category: "promo" as const, amount: 618, invalid: false },
    ],
    recovered: { label: "Recovered for client", amount: 2107.7, note: "2 disputes · paid back" },
  },
  analytics: {
    title: "Where it went · Q3",
    total: 48210, // 22,177 + 13,499 + 8,678 + 3,856
    bars: [
      { label: "Promo & MCB", amount: 22177, category: "promo" as const },
      { label: "Shortages", amount: 13499, category: "shortage" as const },
      { label: "Fees", amount: 8678, category: "fees" as const },
      { label: "Other", amount: 3856, category: "fees" as const },
    ],
    report: { label: "Monthly review", status: "Shared with client", from: "N" },
  },
  accounting: {
    title: "Remittance #48213 → GL",
    // 1,284.50 + 823.20 + 450.00 + 312.40 = 2,870.10
    lines: [
      { label: "MCB · Promo", amount: 1284.5, gl: "6410 Trade promotion" },
      { label: "Shortage", amount: 823.2, gl: "4920 Shortage claims" },
      { label: "Slotting", amount: 450, gl: "6420 Slotting" },
      { label: "Compliance fee", amount: 312.4, gl: "6430 Compliance fees" },
    ],
    booked: 2870.1,
    stamp: "Tied out",
    export: "Exported to NetSuite",
  },
};

/* Partner hub: one product window, one block per enablement item, same order as
   `enablement`. Fictional firm; no money figures. */
export const kitArt = {
  window: { title: "Partner hub", firm: "Northfield Accounting", tag: "Roma partner" },
  gtm: { label: "Co-marketing", kind: "Webinar", when: "Thu · 11:00 ET", title: "Stop writing off deductions", with: "Roma × Northfield" },
  sales: { label: "Sales kit", files: ["Pitch deck", "One-pager", "Demo script"] },
  demo: { label: "Demo workspace", tag: "Sandbox", rows: [{ id: "DED-40211", ch: "U", ok: false }, { id: "DED-40227", ch: "K", ok: true }] },
  earnings: { label: "Referral revenue", chip: "Recurring", bars: [3, 4, 4, 6, 7, 9] },
  playbooks: { label: "Playbooks", items: ["UNFI deduction codes", "KeHE chargebacks", "Target compliance"] },
  manager: { label: "Your partner manager", name: "Partner manager", initials: "PM", cta: "Book a call" },
};
