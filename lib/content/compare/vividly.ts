import type { Competitor } from "./types";

/**
 * Roma vs. Vividly. Every Vividly statement is quoted from govividly.com (checked
 * 20 Nov 2026). Not used: any accuracy row (the comparison sheet: skip it until Roma
 * has its own figure), "not built for small brands" (Vividly has an Emerging tier, up
 * to $50M). Credit where due: Vividly is a full trade promotion management platform.
 */

const CHECKED_ON = "20 Nov 2026";
const HOME = "https://govividly.com/";
const ABOUT = "https://govividly.com/about-us";
const EMERGING = "https://govividly.com/emerging";

export const vividly: Competitor = {
  slug: "vividly",
  name: "Vividly",
  blurb: "A full trade promotion platform, live in as little as two weeks.",
  site: HOME,
  checkedOn: CHECKED_ON,
  // Client-supplied logo (public/logos/competitors/vividly-wordmark.svg); the bar mark
  // was cut from its mask path. Rendered single-ink, never in its own colours.
  mark: { src: "/logos/competitors/vividly-mark.svg", ratio: 36 / 24.95 },
  meta: {
    title: "Roma vs. Vividly | Roma",
    description:
      "Roma vs. Vividly, compared in each company's own words. Vividly is a full trade promotion management platform, up and running in as little as two weeks. Roma does deductions only, live in under 5 minutes, from $399/month, and you confirm every dispute.",
  },

  sources: {
    live: { quote: "Up and running in as little as two weeks.", url: EMERGING, where: "govividly.com/emerging" },
    scope: {
      quote: "Every one of our 150 brands actively plans, optimizes, and manages their full trade program on Vividly",
      url: ABOUT,
      where: "govividly.com/about-us",
    },
    platform: { quote: "Trade Promotion And Deduction Management For CPG Brands", url: HOME, where: "govividly.com" },
    pricing: { quote: "Get off spreadsheets without the enterprise price tag.", url: EMERGING, where: "govividly.com/emerging (no prices published)" },
    auto: { quote: "Go from deduction to dispute resolution, automatically.", url: HOME, where: "govividly.com, Auto Disputes" },
    reconcile: {
      quote: "Deductions and deviations automatically reconcile against your live trade plans",
      url: ABOUT,
      where: "govividly.com/about-us",
    },
    resolved: { quote: "we stay on it until it's resolved", url: ABOUT, where: "govividly.com/about-us, Disputing" },
    cashApp: { quote: "Cash application", url: ABOUT, where: "govividly.com/about-us, lifecycle areas" },
    soc: {
      quote: "Vividly is the only modern TPM platform audited to both SOC 1 Type II and SOC 2 Type II standards",
      url: HOME,
      where: "govividly.com",
    },
  },

  hero: {
    copy: {
      eyebrow: "Roma vs. Vividly",
      icon: "sort",
      heading: { before: "Built for ", accent: "deductions", after: ", not the whole trade plan." },
      lead: "Vividly is a full trade promotion management platform: planning, forecasting, deductions and more, up and running in as little as two weeks. Roma does deductions only, live in under 5 minutes from $399 a month. Here’s how they compare, in each company’s own words.",
      ground: { src: "/images/cta/texture-bg.webp", position: "50% 50%" },
      summary:
        "A two-week timeline. Roma is live on day zero, in under 5 minutes, and deductions from UNFI, KeHE, Target and Walmart arrive from then on. Vividly says it is up and running in as little as two weeks, marked at day 14.",
    },
    caption: `Illustrative. Vividly’s fastest go-live from govividly.com, checked ${CHECKED_ON}. Roma setup time varies by portal.`,
    art: {
      kind: "timeline",
      days: 14,
      unit: "Day",
      per: 1,
      ruler: [0, 2, 4, 6, 8, 10, 12, 14],
      rulerMobile: [0, 7, 14],
      chips: [
        { day: 0.5, label: "UNFI · MCB", cat: "promo" },
        { day: 2, label: "KeHE · Shortage", cat: "shortage" },
        { day: 4.3, label: "Target · Fee", cat: "fees" },
        { day: 6.5, label: "Walmart · Damage", cat: "shortage" },
        { day: 8.7, label: "UNFI · Promo", cat: "promo" },
        { day: 10.7, label: "KeHE · Slotting", cat: "fees" },
      ],
      them: {
        tag: "Published go-live",
        milestones: [{ day: 14, label: "Day 14", title: "“As little as two weeks”" }],
      },
      end: { label: "Day 14", them: "Vividly: up and running, at its fastest", roma: "Roma: two weeks of deductions already in view" },
    },
  },

  verdict: {
    heading: { before: "Deductions sorted this week, at a price you can ", accent: "see", after: "." },
    lead: "Vividly runs your whole trade program. Roma is built only for deductions: live in minutes, priced on the page, and every dispute is yours to approve.",
    tiles: [
      { label: "Time to go live", figure: "5 min", sub: "No ERP or IT project", vs: { text: "“As little as two weeks”", source: "live" } },
      { label: "Price", figure: "$399/mo", sub: "Flat and published", vs: { text: "No prices published", source: "pricing" } },
      { label: "Disputes", figure: "You confirm", sub: "Every dispute, before it’s filed", vs: { text: "“Deduction to dispute resolution, automatically”", source: "auto" } },
    ],
  },

  apart: {
    heading: { before: "Where Roma stands ", accent: "apart", after: "." },
    lead: "Built only for deductions, so there’s no trade plan to roll out first.",
    rows: [
      { visual: "control", them: { text: "“Go from deduction to dispute resolution, automatically.”", source: "auto" } },
      { visual: "classify" },
      { visual: "price", them: { text: "“Get off spreadsheets without the enterprise price tag.” No prices are published.", source: "pricing" } },
      { visual: "backups", quote: "brandy" },
    ],
  },

  pen: {
    stages: [
      { step: "Reconcile", title: "Matched to trade plans", text: "“Deductions and deviations automatically reconcile against your live trade plans”", source: "reconcile" },
      { step: "Dispute", title: "Disputed automatically", text: "“Go from deduction to dispute resolution, automatically.”", source: "auto" },
      { step: "Follow up", title: "Followed to resolution", text: "“We stay on it until it's resolved”", source: "resolved" },
      { step: "Apply cash", title: "Cash applied", text: "Cash application is part of the platform.", source: "cashApp" },
    ],
    yourLane: { text: "Disputes are handled for you: “we stay on it until it’s resolved.”", source: "resolved" },
  },

  price: { stamp: "Ask sales", quote: { text: "Get off spreadsheets without the enterprise price tag.", source: "pricing" } },

  matrix: {
    heading: { before: "Line by line, in their ", accent: "words", after: " and ours." },
    lead: "Ticks mark what both offer. Where the two differ, the last column says what it means for you.",
    rows: [
      { label: "What it is", roma: "Deduction software your team runs", them: { text: "“Trade Promotion And Deduction Management For CPG Brands”", source: "platform" }, means: "Roma if deductions are the job; Vividly if you want trade planning too." },
      { label: "Scope", roma: "Deductions only: classify, dispute, book", them: { text: "Brands manage “their full trade program on Vividly”.", source: "scope" }, means: "No trade-plan rollout before you see a deduction." },
      { label: "Price", roma: "From $399/month, flat and published", them: { text: "No prices published.", source: "pricing" }, means: "Know your cost before the first call." },
      { label: "Time to go live", roma: "Under 5 minutes, no ERP or IT project", them: { text: "“As little as two weeks.”", source: "live" }, means: "See this quarter’s deductions today." },
      { label: "Disputes", roma: "You confirm, Roma files", them: { text: "Auto Disputes, plus a dispute service: “we stay on it until it’s resolved.”", source: "resolved" }, means: "Roma if you want to approve each dispute; Vividly if you want them handled." },
      { label: "Classification", roma: "0% left uncategorized: type, subtype, retailer", them: { text: "Deductions reconcile “against your live trade plans”.", source: "reconcile" }, means: "Every line named, with or without a trade plan." },
      { label: "Security", roma: "SOC 2 Type II and ISO 27001", them: { text: "SOC 1 Type II and SOC 2 Type II.", source: "soc" }, means: "Both are audited.", parity: true },
    ],
  },

  fit: {
    roma: [
      "Deductions are the job, and you want them sorted this week.",
      "You want to approve each dispute yourself.",
      "You want the price on the page: from $399 a month.",
    ],
    them: [
      "You want promotion planning, forecasting and deductions on one platform.",
      "You run a full trade program and want deductions tied to your trade plans.",
      "You’d like disputes handled for you, through Auto Disputes or its dispute service.",
    ],
  },


  faqs: [
    { q: "Is Roma a trade promotion management (TPM) platform like Vividly?", a: "No. Roma is built only for deductions: pulling them from your portals, classifying every line, disputing the invalid ones and booking the rest. If you need promotion planning and forecasting too, Vividly covers those." },
    { q: "How fast can I get started with Roma?", a: "Under 5 minutes. Connect your portals and your deductions start coming in. No ERP or IT project. Setup time varies by portal." },
    { q: "How much does Roma cost?", a: "Roma is a paid subscription from $399/month, published on this page. Book a demo and we’ll give you exact pricing for your brand." },
    { q: "Does Roma dispute deductions automatically?", a: "No, by design. Roma queues invalid deductions with their documents; you confirm each one, and Roma files it from one place and tracks it to payment." },
    { q: "Is Roma secure?", a: "Yes. Roma is SOC 2 Type II and ISO 27001 compliant, your data is only accessible to your team, and it never trains our models." },
    { q: "Where does the Vividly information come from?", a: `From Vividly’s public website, checked on ${CHECKED_ON}. We quote it directly and list every source on this page. If anything has changed, tell us through our contact page and we’ll update it.` },
  ],
};
