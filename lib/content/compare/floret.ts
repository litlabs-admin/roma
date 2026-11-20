import type { Competitor } from "./types";

/**
 * Roma vs. Floret. Every Floret statement is quoted from tryfloret.com (checked
 * 20 Nov 2026). Not used: any coverage claim (comparison sheet: don't claim broader
 * coverage than Floret), a deductions go-live time (Floret states one only for its Cash
 * Application module: 3–4 weeks), TrewUp's claims about
 * Floret (a competitor's page). Credit where due: Floret's team executes disputes, and
 * brands can keep disputes in-house; it publishes per-brand results.
 * No timeline in the hero (no published go-live): the hero shows the two ways to start.
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
  // Client-supplied logo: a 236×64 raster inside an SVG, so it is capped at 32px tall
  // (2× density) to stay sharp.
  logo: { src: "/logos/competitors/floret-wordmark.svg", w: 118, h: 32, size: 1.75, maxPx: 32 },
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
    cashApp: {
      quote: "This can take 3-4 weeks depending on the complexity and detail of your team's credit memos.",
      url: "https://www.tryfloret.com/cash-application",
      where: "tryfloret.com/cash-application (Cash Application only)",
    },
    gl: {
      quote: "all chargebacks can be coded to the corresponding categories in your company's accounting General Ledger.",
      url: TRADE,
      where: "tryfloret.com/deductions-trade",
    },
  },

  hero: {
    layout: "centered",
    copy: {
      eyebrow: "Roma vs. Floret",
      icon: "sort",
      heading: { before: "See your ", accent: "price", after: " before the pilot." },
      lead: "Floret pairs deduction software with a team that executes disputes, starting with a free pilot and a custom quote. Roma is software you run, live in under 5 minutes, from $399 a month on the page. Here’s how they compare, in each company’s own words.",
      ground: { src: "/images/cta/texture-bg.webp", position: "50% 50%" },
      summary:
        "The same buyer questions, answered by each side. What does it cost? Floret offers a free pilot to estimate recoveries, then a custom quote; Roma is from $399 a month, published. How fast can I start? Floret doesn’t publish a go-live time for deductions; Roma is under 5 minutes. Who files the disputes? Floret’s team executes them, or you keep them in-house; with Roma you confirm and Roma files.",
    },
    caption: `Floret details from tryfloret.com, checked ${CHECKED_ON}. Roma setup time varies by portal.`,
  },

  story: {
    kind: "floret",
    qa: {
      questions: [
        {
          id: "cost",
          q: "What does it cost?",
          them: [
            { text: "“We offer a detailed free pilot where we can estimate the potential recoveries for your brand.”", source: "pilot" },
            { text: "Then a custom quote." },
          ],
          roma: "From $399/month, published right here. Book a demo for exact pricing for your brand.",
          takeaway: { them: "A pilot and a quote first.", roma: "Your price, before any pilot." },
        },
        {
          id: "speed",
          q: "How fast can I start?",
          them: [
            { text: "No go-live time is published for deductions." },
            { text: "Its Cash Application setup “can take 3-4 weeks”.", source: "cashApp" },
          ],
          roma: "Under 5 minutes. Connect your portals and your deductions start coming in. No ERP or IT project.",
          takeaway: { them: "No published go-live for deductions.", roma: "Your deductions, in under 5 minutes." },
        },
        {
          id: "disputes",
          q: "Who files the disputes?",
          them: [
            { text: "“Our team (not a bot!) actually executes the disputes.”", source: "team" },
            { text: "“If you'd like to keep your disputes functionality in-house, you can certainly do so!”", source: "inHouse" },
          ],
          roma: "You decide. Roma queues invalid deductions with their documents; you confirm, and Roma files and tracks every status to payment.",
          takeaway: { them: "Their team files, or you keep it in-house.", roma: "Nothing is filed until you confirm it." },
        },
      ],
    },
    alike: {
      heading: { before: "The closest match. The difference is how you ", accent: "start", after: "." },
      body: "Floret and Roma are both deduction software for CPG brands. Both work with QuickBooks and NetSuite, both show where your trade dollars go, and Floret’s team can execute disputes for you, or you can keep them in-house. Where they part is the first step: a pilot and a quote, or a price on the page and your deductions in view today.",
      quote: { text: "If you'd like to keep your disputes functionality in-house, you can certainly do so!", source: "inHouse" },
    },
    backups: {
      heading: { before: "Every backup on a check, in ", accent: "one zip", after: "." },
      lead: "Download the remittance advice and every deduction backup behind it in one file, ready for your bookkeeper. Missing a backup? Roma asks the distributor on day 3, then every 15 days until it arrives.",
      quote: "brandy",
    },
  },

  table: {
    heading: { before: "Line by line, in their ", accent: "words", after: " and ours." },
    lead: "Price, time and disputes decide it, so they come first. Floret’s side is quoted from its own site; the numbers open each source.",
    rows: [
      { label: "Price", key: { figure: "$399/mo" }, roma: "From $399/month, flat and published", them: { text: "A free pilot, then a custom quote.", source: "pilot" }, means: "Know your cost before any pilot." },
      { label: "Time to go live", key: { figure: "5 min" }, roma: "Under 5 minutes, no ERP or IT project", them: { text: "Not published for deductions; its Cash Application setup “can take 3-4 weeks”.", source: "cashApp" }, means: "See this quarter’s deductions today." },
      { label: "Who files disputes", key: { figure: "You confirm" }, roma: "You confirm, Roma files", them: { text: "“Our team (not a bot!) actually executes the disputes.” Or keep them in-house.", source: "team" }, means: "Both let you stay in control; Floret can also do it for you." },
      { label: "What it is", roma: "Deduction software your team runs", them: { text: "“The new operating system for CPG Sales and Finance teams.”", source: "what" }, means: "Both are software; Floret adds a dispute team." },
      { label: "Classification", roma: "0% left uncategorized: type, subtype, retailer", them: { text: "Chargebacks “coded to the corresponding categories” in your GL.", source: "gl" }, means: "Every line named, so you can dispute it." },
      { label: "Insights", roma: "Trade rate by retailer, deductions as % of sales, margin impact", them: { text: "“Insights by month, UPC, retailer, and category.”", source: "insights" }, means: "Both show where your trade dollars go.", parity: true },
      { label: "Accounting", roma: "Export to NetSuite, QuickBooks or CSV", them: { text: "QuickBooks Online, NetSuite and Sage Intacct.", source: "erp" }, means: "Both fit your books.", parity: true },
    ],
    choose: {
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
