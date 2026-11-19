import type { Competitor } from "./types";

/**
 * Roma vs. Glimpse. Every Glimpse statement is quoted from tryglimpse.com (checked
 * 20 Nov 2026). Not used (not citable / contradicted by their site): "commission on
 * recoveries", "more retailers live today", the Emerging Brands promo, company size.
 * The ex-user report is a customer report, shown attributed (client-approved).
 */

const CHECKED_ON = "20 Nov 2026";

export const glimpse: Competitor = {
  slug: "glimpse",
  name: "Glimpse",
  blurb: "A managed deductions service with a 45-day onboarding.",
  site: "https://www.tryglimpse.com/",
  checkedOn: CHECKED_ON,
  mark: { src: "/logos/competitors/glimpse-mark.svg", ratio: 25.22 / 16.47 },
  meta: {
    title: "Roma vs. Glimpse | Roma",
    description:
      "Roma vs. Glimpse, compared in each company's own words. Glimpse is a managed deductions service with a 45-day onboarding and custom quotes. Roma is live in under 5 minutes, from $399/month, and you confirm every dispute.",
  },

  sources: {
    onboard: { quote: "Get onboarded in 45 days", url: "https://www.tryglimpse.com/integrations", where: "tryglimpse.com/integrations" },
    firstDispute: {
      quote: "On average, 30 days, from signing the contract to sending out the first dispute.",
      url: "https://www.tryglimpse.com/product",
      where: "tryglimpse.com/product, FAQ",
    },
    managed: {
      quote: "Glimpse isn't a tool you have to implement. It's a managed service that handles retailer deductions end-to-end.",
      url: "https://www.tryglimpse.com/glimpse-guarantee",
      where: "tryglimpse.com/glimpse-guarantee",
    },
    specialists: {
      quote: "Deduction specialists file every dispute, then resolved cases sync back to your ERP automatically.",
      url: "https://www.tryglimpse.com/glimpse-guarantee",
      where: "tryglimpse.com/glimpse-guarantee",
    },
    pricing: {
      quote: "Pricing is simple and incentive-aligned. Talk to sales for a custom quote tailored to your brand's scale and retailer mix.",
      url: "https://www.tryglimpse.com/product",
      where: "tryglimpse.com/product, FAQ",
    },
    hour: { quote: "Most customers spend under an hour per week in Glimpse.", url: "https://www.tryglimpse.com/product", where: "tryglimpse.com/product, FAQ" },
    retrieve: { quote: "Glimpse pulls deduction documents, automatically.", url: "https://www.tryglimpse.com/product", where: "tryglimpse.com/product, step 01" },
    validate: { quote: "AI agents check every single deduction.", url: "https://www.tryglimpse.com/product", where: "tryglimpse.com/product, step 02" },
    dispute: {
      quote: "After identifying an invalid deduction, Glimpse files disputes before the retailer windows close.",
      url: "https://www.tryglimpse.com/product",
      where: "tryglimpse.com/product, step 03",
    },
    recover: {
      quote: "Recovered dollars are applied automatically and reflected in your ERP.",
      url: "https://www.tryglimpse.com/product",
      where: "tryglimpse.com/product, step 04",
    },
    erp: {
      quote: "Glimpse connects to QuickBooks and Netsuite major ERPs, alongside each retailer's portal.",
      url: "https://www.tryglimpse.com/integrations",
      where: "tryglimpse.com/integrations, FAQ",
    },
    soc2: { quote: "SOC 2 badge in the site footer, with a Trust Center hosted on Vanta.", url: "https://www.tryglimpse.com/", where: "tryglimpse.com, footer" },
  },

  hero: {
    copy: {
      eyebrow: "Roma vs. Glimpse",
      icon: "sort",
      heading: { before: "Two ways to win back ", accent: "deductions", after: "." },
      lead: "Glimpse is a managed service that works your deductions for you, after a 45-day onboarding. Roma puts every deduction in front of you in under 5 minutes, and you decide what gets disputed. Here’s how they compare, in each company’s own words.",
      ground: { src: "/images/cta/texture-bg.webp", position: "50% 50%" },
      summary:
        "A 45-day timeline. Roma is live on day zero, in under 5 minutes, and deductions from UNFI, KeHE, Target and Walmart arrive from then on. Glimpse’s published onboarding runs from Today (we discuss your needs) to Day 10 (we build the pipelines) to Day 45 (we identify lost revenue), with the first dispute 30 days after signing on average.",
    },
    caption: `Illustrative. Glimpse milestones from tryglimpse.com, checked ${CHECKED_ON}. Roma setup time varies by portal.`,
    art: {
      kind: "timeline",
      days: 45,
      unit: "Day",
      per: 1,
      ruler: [0, 5, 10, 15, 20, 25, 30, 35, 40, 45],
      rulerMobile: [0, 10, 30, 45],
      chips: [
        { day: 1, label: "UNFI · MCB", cat: "promo" },
        { day: 6, label: "KeHE · Shortage", cat: "shortage" },
        { day: 13, label: "Target · Fee", cat: "fees" },
        { day: 20, label: "Walmart · Damage", cat: "shortage" },
        { day: 27, label: "UNFI · Promo", cat: "promo" },
        { day: 34, label: "KeHE · Slotting", cat: "fees" },
      ],
      them: {
        tag: "Published onboarding",
        milestones: [
          { day: 0, label: "Today", title: "We discuss your needs" },
          { day: 10, label: "Day 10", title: "We build the pipelines" },
          { day: 45, label: "Day 45", title: "We identify lost revenue" },
        ],
        marker: { day: 30, label: "Day 30", title: "First dispute, on average" },
      },
      end: { label: "Day 45", them: "Glimpse: onboarded", roma: "Roma: 45 days of deductions already in view" },
    },
  },

  verdict: {
    heading: { before: "Live today, priced on the page, and ", accent: "you decide", after: "." },
    lead: "Glimpse runs your deductions for you as a managed service. Roma gives your team every deduction, classified and ready to dispute, from day one.",
    tiles: [
      { label: "Time to go live", figure: "5 min", sub: "No ERP or IT project", vs: { text: "“Get onboarded in 45 days”", source: "onboard" } },
      { label: "Price", figure: "$399/mo", sub: "Flat and published", vs: { text: "“Talk to sales for a custom quote”", source: "pricing" } },
      { label: "Disputes", figure: "You confirm", sub: "Every dispute, before it’s filed", vs: { text: "“Deduction specialists file every dispute”", source: "specialists" } },
    ],
  },

  apart: {
    heading: { before: "Where Roma stands ", accent: "apart", after: "." },
    lead: "Four places Roma works differently, and why it matters.",
    rows: [
      {
        visual: "classify",
        note: "Brands that moved from Glimpse told us about double entries and exports that didn’t tie out.",
        quote: "julie",
      },
      { visual: "control", them: { text: "“Deduction specialists file every dispute.”", source: "specialists" } },
      { visual: "backups", quote: "brandy" },
      { visual: "price", them: { text: "“Talk to sales for a custom quote tailored to your brand's scale and retailer mix.”", source: "pricing" } },
    ],
  },

  pen: {
    stages: [
      { step: "Retrieve", title: "Glimpse retrieves", text: "“Glimpse pulls deduction documents, automatically.”", source: "retrieve" },
      { step: "Validate", title: "AI agents + experts validate", text: "“AI agents check every single deduction.” Human experts check the edge cases.", source: "validate" },
      { step: "Dispute", title: "Glimpse files", text: "“Glimpse files disputes before the retailer windows close.”", source: "dispute" },
      { step: "Recover", title: "Applied to your ERP", text: "“Recovered dollars are applied automatically and reflected in your ERP.”", source: "recover" },
    ],
    yourLane: { text: "“Most customers spend under an hour per week in Glimpse.”", source: "hour" },
  },

  price: { stamp: "Custom quote", quote: { text: "Talk to sales for a custom quote tailored to your brand's scale and retailer mix.", source: "pricing" } },

  matrix: {
    heading: { before: "Line by line, in their ", accent: "words", after: " and ours." },
    lead: "Ticks mark what both offer. Where the two differ, the last column says what it means for you.",
    rows: [
      { label: "What it is", roma: "Deduction software your team runs", them: { text: "“A managed service that handles retailer deductions end-to-end.”", source: "managed" }, means: "Roma if you want to see and decide; Glimpse if you’d rather hand it off." },
      { label: "Price", roma: "From $399/month, flat and published", them: { text: "“Talk to sales for a custom quote.”", source: "pricing" }, means: "Know your cost before the first call." },
      { label: "Time to go live", roma: "Under 5 minutes, no ERP or IT project", them: { text: "“Get onboarded in 45 days.”", source: "onboard" }, means: "See this quarter’s deductions this week." },
      { label: "First dispute", roma: "Two clicks, once your portals are connected", them: { text: "“On average, 30 days, from signing the contract.”", source: "firstDispute" }, means: "Your first dispute can go out this week." },
      { label: "Who files disputes", roma: "You confirm, Roma files", them: { text: "“Deduction specialists file every dispute.”", source: "specialists" }, means: "Nothing goes out in your name without you." },
      { label: "Classification", roma: "0% left uncategorized: type, subtype, retailer", them: { text: "“AI agents check every single deduction.”", source: "validate" }, means: "Every line named, so you can dispute it." },
      { label: "Backups", roma: "One zip per check; missing backups requested on day 3", them: { text: "“Glimpse pulls deduction documents, automatically.”", source: "retrieve" }, means: "Your bookkeeper gets the whole check at once." },
      { label: "ERP", roma: "Export to NetSuite, QuickBooks or CSV", them: { text: "Connects to QuickBooks and NetSuite.", source: "erp" }, means: "Both fit your books.", parity: true },
      { label: "Security", roma: "SOC 2 Type II and ISO 27001", them: { text: "SOC 2, with a public Trust Center.", source: "soc2" }, means: "Both are audited.", parity: true },
    ],
  },

  fit: {
    roma: [
      "You want to see every deduction yourself, starting this week.",
      "You’d rather approve each dispute than hand it off.",
      "You want the price on the page: from $399 a month.",
    ],
    them: [
      "You’d rather hand deductions to a managed service and not look at them.",
      "You want their specialists filing disputes for you.",
      "A 30–45 day onboarding and a custom quote work for you.",
    ],
  },


  faqs: [
    {
      q: "Is Roma a managed service like Glimpse?",
      a: "Roma is built for your team to use. It pulls every deduction from your portals, classifies it and matches it to your invoices and promos. You confirm which ones to dispute, Roma files them from one place, and every status is tracked to payment.",
    },
    { q: "How fast can I see my own deductions?", a: "Under 5 minutes. Connect your portals and your deductions start coming in. No ERP or IT project. Setup time varies by portal." },
    { q: "How much does Roma cost compared with Glimpse?", a: "Roma is a paid subscription from $399/month, published on this page. Glimpse prices by custom quote. Book a demo and we’ll give you exact pricing for your brand." },
    { q: "Can I switch from Glimpse to Roma?", a: "Yes. Connect your portals and Roma pulls your deductions in under 5 minutes, each classified by type, subtype and retailer. You can run Roma beside your current process for a month and compare." },
    { q: "Does Roma replace my ERP?", a: "No. Roma works alongside your accounting stack and exports coded lines to NetSuite, QuickBooks or CSV." },
    { q: "Where does the Glimpse information come from?", a: `From Glimpse’s public website, checked on ${CHECKED_ON}. We quote it directly and list every source on this page. If anything has changed, tell us through our contact page and we’ll update it.` },
  ],
};
