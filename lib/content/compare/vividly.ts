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
  // Client-supplied logo, in its own colours (the bar mark carries a raster gradient).
  logo: { src: "/logos/competitors/vividly-wordmark.svg", w: 198, h: 41, size: 1.6 },
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
    layout: "centered",
    copy: {
      eyebrow: "Roma vs. Vividly",
      icon: "sort",
      heading: { before: "Built for ", accent: "deductions", after: ", not the whole trade plan." },
      lead: "Vividly is a full trade promotion management platform: planning, forecasting, deductions and more, up and running in as little as two weeks. Roma does deductions only, live in under 5 minutes from $399 a month. Here’s how they compare, in each company’s own words.",
      ground: { src: "/images/cta/texture-bg.webp", position: "50% 50%" },
      summary:
        "A map of the trade lifecycle. Vividly’s bar spans all of it: planning, optimizing and managing the trade program, reconciling deductions against trade plans, Auto Disputes and cash application. Roma’s bar covers only the deductions part: classify, match, dispute and book, live in under 5 minutes, with no trade plan needed.",
    },
    caption: `Vividly’s scope in its own words, from govividly.com, checked ${CHECKED_ON}.`,
  },

  story: {
    kind: "vividly",
    scope: {
      stages: [
        { label: "Plan", source: "scope" },
        { label: "Optimize", source: "scope" },
        { label: "Manage trade", source: "scope" },
        { label: "Reconcile deductions", source: "reconcile", deductions: true },
        { label: "Auto Disputes", source: "auto", deductions: true },
        { label: "Cash application", source: "cashApp" },
      ],
      them: { label: "Vividly", tag: "Your full trade program" },
      roma: { label: "Roma", tag: "Deductions only · classify, match, dispute, book", offPlan: "No trade plan needed" },
    },
    gate: {
      heading: { before: "Automatic, or ", accent: "approved", after: " by you." },
      lead: "Vividly takes a deduction to dispute resolution automatically. Roma matches every deduction and queues the invalid ones with their documents. You confirm, Roma files from one place, and every status is tracked to payment.",
      chip: { label: "UNFI · Promo", amount: "$1,240" },
      stations: [
        {
          label: "Arrives",
          them: { title: "A deduction comes in" },
          roma: { title: "Pulled from your portal", text: "Every deduction and its backup comes in from your portals." },
        },
        {
          label: "Matched",
          them: { title: "Reconciled to your trade plan", text: "“Deductions and deviations automatically reconcile against your live trade plans”", source: "reconcile", needs: "Needs your live trade plans" },
          roma: { title: "Classified, no plan needed", text: "Each line gets a type, subtype and retailer, matched to your invoices and promos." },
        },
        {
          label: "Dispute",
          them: { title: "Auto Disputes", text: "“Go from deduction to dispute resolution, automatically.”", source: "auto" },
          roma: { title: "Queued with its documents", text: "Nothing goes out in your name until you confirm.", gate: true },
        },
        {
          label: "Resolved",
          them: { title: "Followed to resolution", text: "“we stay on it until it's resolved”", source: "resolved" },
          roma: { title: "Roma files, tracked to payment", text: "Every status in one place, then booked with its GL code." },
        },
      ],
    },
  },

  table: {
    heading: { before: "Line by line, in their ", accent: "words", after: " and ours." },
    lead: "Scope, disputes and time decide it, so they come first. Vividly’s side is quoted from its own site; the numbers open each source.",
    rows: [
      { label: "Scope", key: { figure: "Deductions" }, roma: "Deductions only: classify, dispute, book", them: { text: "Brands manage “their full trade program on Vividly”.", source: "scope" }, means: "No trade-plan rollout before you see a deduction." },
      { label: "Disputes", key: { figure: "You confirm" }, roma: "You confirm, Roma files", them: { text: "Auto Disputes, plus a dispute service: “we stay on it until it’s resolved.”", source: "resolved" }, means: "Roma if you want to approve each dispute; Vividly if you want them handled." },
      { label: "Time to go live", key: { figure: "5 min" }, roma: "Under 5 minutes, no ERP or IT project", them: { text: "“As little as two weeks.”", source: "live" }, means: "See this quarter’s deductions today." },
      { label: "What it is", roma: "Deduction software your team runs", them: { text: "“Trade Promotion And Deduction Management For CPG Brands”", source: "platform" }, means: "Roma if deductions are the job; Vividly if you want trade planning too." },
      { label: "Price", roma: "From $399/month, flat and published", them: { text: "No prices published.", source: "pricing" }, means: "Know your cost before the first call." },
      { label: "Classification", roma: "0% left uncategorized: type, subtype, retailer", them: { text: "Deductions reconcile “against your live trade plans”.", source: "reconcile" }, means: "Every line named, with or without a trade plan." },
      { label: "Security", roma: "SOC 2 Type II and ISO 27001", them: { text: "SOC 1 Type II and SOC 2 Type II.", source: "soc" }, means: "Both are audited.", parity: true },
    ],
    choose: {
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
