import type { Competitor } from "./types";

/**
 * Roma vs. Promomash. Every Promomash statement is quoted from promomash.com (checked
 * 20 Nov 2026). Not used (not citable): "from ~$500/mo" (no prices on their site;
 * softwareadvice.com blocks access), Manzana / Mid-Day Squares case studies (not found).
 * Credit where due: Promomash covers trade promotion, deductions and field marketing,
 * with a team of deduction specialists.
 */

const CHECKED_ON = "20 Nov 2026";
const PLANS = "https://www.promomash.com/plans";
const HOME = "https://www.promomash.com/";

export const promomash: Competitor = {
  slug: "promomash",
  name: "Promomash",
  blurb: "A trade management suite with deduction specialists, priced on volume.",
  site: HOME,
  checkedOn: CHECKED_ON,
  // Client-supplied logo (public/logos/competitors/promomash-wordmark.svg); the "p" icon
  // was cut from it as the mark. Rendered single-ink, never in its purple/teal.
  mark: { src: "/logos/competitors/promomash-mark.svg", ratio: 39 / 33 },
  meta: {
    title: "Roma vs. Promomash | Roma",
    description:
      "Roma vs. Promomash, compared in each company's own words. Promomash is a trade management suite priced on deduction volume, with an onboarding of at least two to four months. Roma does deductions only, live in under 5 minutes, from $399/month.",
  },

  sources: {
    onboard: {
      quote: "For trade and deduction management, onboarding can typically take a minimum of two to four months",
      url: PLANS,
      where: "promomash.com/plans, FAQ",
    },
    pricing: { quote: "Plans and pricing are based on monthly deduction invoice (DI) volume to process.", url: PLANS, where: "promomash.com/plans" },
    commit: { quote: "One year commitment required. One-time initial onboarding fee may apply.", url: PLANS, where: "promomash.com/plans" },
    scope: {
      quote: "Trade Management Software and Services for CPG Brands | Trade Promotion | Deduction Management | Field Marketing",
      url: HOME,
      where: "promomash.com, page title",
    },
    team: {
      quote: "Dedicated team of deduction specialists to assist from coding & validation to dispute & recovery",
      url: HOME,
      where: "promomash.com, CPGenius Deductions",
    },
    capture: {
      quote: "Automated deduction invoice capture, AI-assisted categorization/coding, validation",
      url: PLANS,
      where: "promomash.com/plans",
    },
    recovery: {
      quote: "dispute/recovery of invalid deductions, and expert HITL (humans in the loop) throughout the process",
      url: PLANS,
      where: "promomash.com/plans",
    },
    reconcile: { quote: "Facilitate promo reconciliation & month-end closes", url: HOME, where: "promomash.com, CPGenius Deductions" },
    erp: {
      quote: "supports integration with commonly used ERP systems including NetSuite, QuickBooks, Sage",
      url: PLANS,
      where: "promomash.com/plans, FAQ",
    },
    soc2: { quote: "SOC II Type 2 AICPA badge on the homepage.", url: HOME, where: "promomash.com" },
  },

  hero: {
    copy: {
      eyebrow: "Roma vs. Promomash",
      icon: "sort",
      heading: { before: "Just ", accent: "deductions", after: ". Live in five minutes." },
      lead: "Promomash is trade management software and services, with a team of deduction specialists. Its deductions plans are priced on volume, and onboarding typically takes a minimum of two to four months. Roma does one job, deductions, live in under 5 minutes from $399 a month. Here’s how they compare, in each company’s own words.",
      ground: { src: "/images/cta/texture-bg.webp", position: "50% 50%" },
      summary:
        "A four-month timeline. Roma is live on day zero, in under 5 minutes, and deductions from UNFI, KeHE, Target and Walmart arrive from then on. Promomash says onboarding for trade and deduction management typically takes a minimum of two to four months, shown as a band from month two to month four.",
    },
    caption: `Illustrative. Promomash onboarding estimate from promomash.com, checked ${CHECKED_ON}. Roma setup time varies by portal.`,
    art: {
      kind: "timeline",
      days: 120,
      unit: "Month",
      per: 30,
      ruler: [0, 30, 60, 90, 120],
      rulerMobile: [0, 60, 120],
      chips: [
        { day: 3, label: "UNFI · MCB", cat: "promo" },
        { day: 18, label: "KeHE · Shortage", cat: "shortage" },
        { day: 38, label: "Target · Fee", cat: "fees" },
        { day: 58, label: "Walmart · Damage", cat: "shortage" },
        { day: 78, label: "UNFI · Promo", cat: "promo" },
        { day: 96, label: "KeHE · Slotting", cat: "fees" },
      ],
      them: {
        tag: "Published onboarding",
        range: { from: 60, to: 120, label: "2–4 months", title: "“A minimum of two to four months”" },
      },
      end: { label: "Month 4", them: "Promomash: end of its typical minimum onboarding", roma: "Roma: four months of deductions already in view" },
    },
  },

  verdict: {
    heading: { before: "One job, done today, at a price you can ", accent: "see", after: "." },
    lead: "Promomash covers trade promotion, deductions and field marketing, with a team behind it. Roma is built only for deductions: live in minutes, at a flat price you can see.",
    tiles: [
      { label: "Time to go live", figure: "5 min", sub: "No ERP or IT project", vs: { text: "“A minimum of two to four months”", source: "onboard" } },
      { label: "Price", figure: "$399/mo", sub: "Flat and published", vs: { text: "Priced on “monthly deduction invoice (DI) volume”", source: "pricing" } },
      { label: "Focus", figure: "Deductions", sub: "Built only for deductions", vs: { text: "Trade promotion, deduction management and field marketing", source: "scope" } },
    ],
  },

  apart: {
    heading: { before: "Where Roma stands ", accent: "apart", after: "." },
    lead: "Built only for deductions, and priced in the open.",
    rows: [
      { visual: "price", title: "A flat price, not a volume meter.", body: "Roma is a flat subscription from $399 a month, published right here, and it isn’t priced on your deduction volume. Book a demo for exact pricing for your brand.", them: { text: "“Plans and pricing are based on monthly deduction invoice (DI) volume to process.”", source: "pricing" } },
      { visual: "classify", them: { text: "“AI-assisted categorization/coding, validation”", source: "capture" } },
      { visual: "control", them: { text: "“Dedicated team of deduction specialists to assist from coding & validation to dispute & recovery”", source: "team" } },
      { visual: "backups", quote: "brandy" },
    ],
  },

  pen: {
    stages: [
      { step: "Capture", title: "Promomash captures", text: "“Automated deduction invoice capture”", source: "capture" },
      { step: "Code", title: "Coded and validated", text: "“AI-assisted categorization/coding, validation”", source: "capture" },
      { step: "Dispute", title: "Specialists dispute", text: "“dispute/recovery of invalid deductions, and expert HITL (humans in the loop)”", source: "recovery" },
      { step: "Reconcile", title: "Reconciled for close", text: "“Facilitate promo reconciliation & month-end closes”", source: "reconcile" },
    ],
    yourLane: { text: "“Dedicated team of deduction specialists to assist from coding & validation to dispute & recovery”", source: "team" },
  },

  price: { stamp: "Volume-priced", quote: { text: "Plans and pricing are based on monthly deduction invoice (DI) volume to process.", source: "pricing" } },

  matrix: {
    heading: { before: "Line by line, in their ", accent: "words", after: " and ours." },
    lead: "Ticks mark what both offer. Where the two differ, the last column says what it means for you.",
    rows: [
      { label: "What it is", roma: "Deduction software your team runs", them: { text: "Trade promotion, deduction management and field marketing, software and services.", source: "scope" }, means: "Roma if deductions are the job; Promomash if you want the whole trade suite." },
      { label: "Price", roma: "From $399/month, flat and published", them: { text: "Priced on “monthly deduction invoice (DI) volume”; no prices published.", source: "pricing" }, means: "Your price isn’t tied to deduction volume." },
      { label: "Time to go live", roma: "Under 5 minutes, no ERP or IT project", them: { text: "“A minimum of two to four months”", source: "onboard" }, means: "See this quarter’s deductions this week." },
      { label: "Who handles disputes", roma: "You confirm, Roma files", them: { text: "A “dedicated team of deduction specialists”.", source: "team" }, means: "Roma if you want to decide; Promomash if you want a team to." },
      { label: "Classification", roma: "0% left uncategorized: type, subtype, retailer", them: { text: "“AI-assisted categorization/coding, validation”", source: "capture" }, means: "Every line named, so you can dispute it." },
      { label: "ERP", roma: "Export to NetSuite, QuickBooks or CSV", them: { text: "NetSuite, QuickBooks, Sage.", source: "erp" }, means: "Both fit your books.", parity: true },
      { label: "Security", roma: "SOC 2 Type II and ISO 27001", them: { text: "SOC II Type 2.", source: "soc2" }, means: "Both are audited.", parity: true },
    ],
  },

  fit: {
    roma: [
      "Deductions are the job, and you want them handled this week.",
      "You want a flat price on the page, not one tied to volume.",
      "You want every line classified and every dispute in your hands.",
    ],
    them: [
      "You want trade promotion, deductions and field marketing in one suite.",
      "You’d rather a team of specialists code, validate and dispute for you.",
      "A one-year commitment and a 2–4 month onboarding work for you.",
    ],
  },


  faqs: [
    { q: "How does Roma’s pricing compare with Promomash’s?", a: "Roma is a flat subscription from $399/month, published on this page and not tied to deduction volume. Promomash prices its deductions plans on monthly deduction invoice volume and doesn’t publish prices. Book a demo and we’ll give you exact pricing for your brand." },
    { q: "Does Roma do trade promotion management like Promomash?", a: "No. Roma is built only for deductions: pulling them from your portals, classifying every line, disputing the invalid ones and booking the rest. If you need promotion planning or field marketing too, Promomash covers those." },
    { q: "How long does it take to get started with Roma?", a: "Under 5 minutes. Connect your portals and your deductions start coming in. No ERP or IT project. Setup time varies by portal." },
    { q: "Who files the disputes?", a: "You decide. Roma queues invalid deductions with their documents; you confirm, and Roma files from one place and tracks every status to payment." },
    { q: "Does Roma work with NetSuite and QuickBooks?", a: "Yes. Roma exports coded lines to NetSuite, QuickBooks or CSV, alongside your current accounting stack." },
    { q: "Where does the Promomash information come from?", a: `From Promomash’s public website, checked on ${CHECKED_ON}. We quote it directly and list every source on this page. If anything has changed, tell us through our contact page and we’ll update it.` },
  ],
};
