import type { Competitor } from "./types";

/**
 * Roma vs. Floret. Every Floret statement is quoted from tryfloret.com (checked
 * 20 Nov 2026). Not used: any coverage claim (comparison sheet: don't claim broader
 * coverage than Floret), go-live time (Floret doesn't state one), TrewUp's claims about
 * Floret (a competitor's page). Credit where due: Floret's team executes disputes, and
 * brands can keep disputes in-house; it publishes per-brand results.
 * No timeline in the hero (no published go-live), so the hero uses the glance card.
 */

const CHECKED_ON = "20 Nov 2026";
const HOME = "https://www.tryfloret.com/";
const DISPUTES = "https://www.tryfloret.com/disputes";
const TRADE = "https://www.tryfloret.com/deductions-trade";

export const floret: Competitor = {
  slug: "floret",
  name: "Floret",
  blurb: "Deduction software with a team that executes disputes.",
  site: HOME,
  checkedOn: CHECKED_ON,
  meta: {
    title: "Roma vs. Floret | Roma",
    description:
      "Roma vs. Floret, compared in each company's own words. Floret pairs deduction software with a team that executes disputes, starting with a free pilot and a custom quote. Roma is live in under 5 minutes, from $399/month on the page.",
  },

  sources: {
    what: { quote: "The new operating system for CPG Sales and Finance teams.", url: HOME, where: "tryfloret.com" },
    team: {
      quote: "Our platform is AI-powered... However, our team (not a bot!) actually executes the disputes.",
      url: DISPUTES,
      where: "tryfloret.com/disputes, FAQ",
    },
    inHouse: {
      quote: "If you'd like to keep your disputes functionality in-house, you can certainly do so!",
      url: DISPUTES,
      where: "tryfloret.com/disputes, FAQ",
    },
    pilot: {
      quote: "We offer a detailed free pilot where we can estimate the potential recoveries for your brand.",
      url: DISPUTES,
      where: "tryfloret.com/disputes, FAQ",
    },
    erp: {
      quote: "Floret syncs with accounting software like Quickbooks Online, NetSuite, and Sage Intacct.",
      url: HOME,
      where: "tryfloret.com",
    },
    insights: {
      quote: "Manage your trade spend down to the dollar with insights by month, UPC, retailer, and category.",
      url: TRADE,
      where: "tryfloret.com/deductions-trade",
    },
    gl: {
      quote: "all chargebacks can be coded to the corresponding categories in your company's accounting General Ledger.",
      url: TRADE,
      where: "tryfloret.com/deductions-trade",
    },
  },

  hero: {
    copy: {
      eyebrow: "Roma vs. Floret",
      icon: "sort",
      heading: { before: "See your ", accent: "price", after: " before the pilot." },
      lead: "Floret pairs deduction software with a team that executes disputes, starting with a free pilot and a custom quote. Roma is software you run, live in under 5 minutes, from $399 a month on the page. Here’s how they compare, in each company’s own words.",
      ground: { src: "/images/cta/texture-bg.webp", position: "50% 50%" },
      summary:
        "A side-by-side card. Price: Roma from $399 a month, published; Floret a free pilot, then a quote. Go-live: Roma under 5 minutes; Floret doesn’t publish one. Disputes: with Roma you confirm and Roma files; Floret’s team executes them, or you keep them in-house. Accounting: both sync with QuickBooks and NetSuite.",
    },
    caption: `Floret details from tryfloret.com, checked ${CHECKED_ON}.`,
    art: {
      kind: "glance",
      title: "At a glance",
      rows: [
        { label: "Price", roma: "From $399/mo, published", them: "Free pilot, then a quote" },
        { label: "Go-live", roma: "Under 5 minutes", them: "Not published" },
        { label: "Disputes", roma: "You confirm, Roma files", them: "Their team executes them" },
        { label: "Accounting", roma: "NetSuite, QuickBooks, CSV", them: "QuickBooks, NetSuite, Sage" },
      ],
    },
  },

  verdict: {
    heading: { before: "Know the price, go live today, keep the ", accent: "decisions", after: "." },
    lead: "Floret starts with a pilot and a team that executes your disputes. Roma starts the moment you connect a portal, at a price you can read now.",
    tiles: [
      { label: "Price", figure: "$399/mo", sub: "Flat and published", vs: { text: "A free pilot, then a custom quote", source: "pilot" } },
      { label: "Time to go live", figure: "5 min", sub: "No ERP or IT project", vs: { text: "No go-live time published" } },
      { label: "Classification", figure: "0%", sub: "Of deductions left uncategorized", only: "Every line gets a type, subtype and retailer." },
    ],
  },

  apart: {
    heading: { before: "Where Roma stands ", accent: "apart", after: "." },
    lead: "Three things you get on day one, without a pilot.",
    rows: [
      { visual: "price", title: "A price you can read before the pilot.", body: "Roma is a flat subscription from $399 a month, published right here. No pilot needed to get a number. Book a demo for exact pricing for your brand.", them: { text: "“We offer a detailed free pilot where we can estimate the potential recoveries for your brand.”", source: "pilot" } },
      { visual: "classify" },
      { visual: "backups", quote: "brandy" },
    ],
  },

  price: { stamp: "Free pilot", quote: { text: "We offer a detailed free pilot where we can estimate the potential recoveries for your brand.", source: "pilot" } },

  matrix: {
    heading: { before: "Line by line, in their ", accent: "words", after: " and ours." },
    lead: "Ticks mark what both offer. Where the two differ, the last column says what it means for you.",
    rows: [
      { label: "What it is", roma: "Deduction software your team runs", them: { text: "“The new operating system for CPG Sales and Finance teams.”", source: "what" }, means: "Both are software; Floret adds a dispute team." },
      { label: "Price", roma: "From $399/month, flat and published", them: { text: "A free pilot, then a custom quote.", source: "pilot" }, means: "Know your cost before any pilot." },
      { label: "Time to go live", roma: "Under 5 minutes, no ERP or IT project", them: { text: "Not published." }, means: "See this quarter’s deductions today." },
      { label: "Who files disputes", roma: "You confirm, Roma files", them: { text: "“Our team (not a bot!) actually executes the disputes.” Or keep them in-house.", source: "team" }, means: "Both let you stay in control; Floret can also do it for you." },
      { label: "Classification", roma: "0% left uncategorized: type, subtype, retailer", them: { text: "Chargebacks “coded to the corresponding categories” in your GL.", source: "gl" }, means: "Every line named, so you can dispute it." },
      { label: "Insights", roma: "Trade rate by retailer, deductions as % of sales, margin impact", them: { text: "“Insights by month, UPC, retailer, and category.”", source: "insights" }, means: "Both show where your trade dollars go.", parity: true },
      { label: "Accounting", roma: "Export to NetSuite, QuickBooks or CSV", them: { text: "QuickBooks Online, NetSuite and Sage Intacct.", source: "erp" }, means: "Both fit your books.", parity: true },
    ],
  },

  fit: {
    roma: [
      "You want the price on the page before any pilot.",
      "You want to be live today, in under 5 minutes.",
      "You want every line classified and every backup in one zip.",
    ],
    them: [
      "You’d like a team to execute disputes for you.",
      "You want a free pilot to estimate recoveries first.",
      "You want insights by month, UPC, retailer and category.",
    ],
  },


  faqs: [
    { q: "How much does Roma cost compared with Floret?", a: "Roma is a paid subscription from $399/month, published on this page. Floret starts with a free pilot and a custom quote. Book a demo and we’ll give you exact pricing for your brand." },
    { q: "Does Roma file disputes for me?", a: "You decide what gets disputed. Roma queues invalid deductions with their documents; you confirm, and Roma files from one place and tracks every status to payment." },
    { q: "How fast can I get started with Roma?", a: "Under 5 minutes. Connect your portals and your deductions start coming in. No ERP or IT project. Setup time varies by portal." },
    { q: "Which retailers does Roma cover?", a: "KeHE, UNFI, Target and Walmart today, with every deduction line classified into one view." },
    { q: "Does Roma work with QuickBooks and NetSuite?", a: "Yes. Roma exports coded lines to NetSuite, QuickBooks or CSV, alongside your current accounting stack." },
    { q: "Where does the Floret information come from?", a: `From Floret’s public website, checked on ${CHECKED_ON}. We quote it directly and list every source on this page. If anything has changed, tell us through our contact page and we’ll update it.` },
  ],
};
