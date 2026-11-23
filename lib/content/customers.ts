// Customer stories: the one source for /customers, /customers/[slug] and the homepage
// Stories section (components/sections/stories/data.ts picks the three real brands).
// DESIGN.md §G.15.
//
// WHAT IS REAL vs MOCK (replace before launch; see DESIGN.md pre-launch item 7)
// - status "real": Farmer Direct Foods. The quote (supplied by the client, 23 Nov 2026),
//   the video testimonial and the logo are real; the story body, summary and pill are
//   written only from what Julie Mayden says in that video (no figures). The product
//   kicker / "about" line ("grain and flour") is inferred from the video: confirm.
// - status "real-figures": Good Day Chocolate ($53K in 6 months, Jasen Arias, VP Ops &
//   Growth, from the positioning PDF, 4 Nov 2026), Smash Kitchen ($23K, PDF) and
//   Mochidoki (live in 5 minutes). ONLY those headline figures and names are sourced.
//   Their quotes, narratives, secondary metrics, facts, card titles, "about" lines and
//   summaries are MOCK. No portraits and no
//   invented people at real brands, on purpose.
// - status "mock": every other brand is FICTIONAL, with invented people, figures and
//   narratives (carried over from the earlier /customers content, client decision
//   20 Nov 2026: hybrid brands). Figures within each story reconcile.
// - Photos and portraits: Unsplash-licensed stand-ins (credits on each record), not the
//   customers or their staff.
// This file is NOT part of the Ask Roma knowledge base (lib/content/knowledge.ts); keep
// it that way while it contains mock content.
//
// Guardrails (§A.1, §A.8, PDF): no "automatically", no guaranteed amounts, no "free",
// retailers only as channels (never "took"/"owe"), "invalid" not "wrong".

import type { Block } from "./blog";
import type { Heading } from "./platform";
import { DEMO_HREF, SIGNUP_HREF } from "@/components/chat/data";

export const RESULTS_VARY = "Results vary by brand. Not a guarantee of recovery.";

/* ── Types ─────────────────────────────────────────────────────────────── */

export const CATEGORIES = [
  { key: "confectionery", label: "Confectionery" },
  { key: "beverages", label: "Beverages" },
  { key: "snacks", label: "Snacks" },
  { key: "pantry", label: "Pantry" },
  { key: "frozen", label: "Frozen" },
] as const;
export type CategoryKey = (typeof CATEGORIES)[number]["key"];

export type Metric = { figure: string; label: string };

/**
 * A video testimonial, self-hosted in public/videos/stories (versioned file names, served
 * immutable: next.config.ts). The card plays the silent `teaser` loop; "Watch testimonial"
 * opens the full video, which is only fetched then. Captions are burned into the video.
 */
export type StoryVideo = {
  /** Accessible name and dialog title. */
  title: string;
  /** "2:26" for the button, ISO 8601 for VideoObject JSON-LD. */
  duration: string;
  isoDuration: string;
  uploadDate: string;
  /** Silent loop for the card (H.264, no audio track). */
  teaser: string;
  /** Poster frame for the full video (shown until it starts). */
  poster: string;
  /** 1200×630 JPEG for Open Graph and VideoObject.thumbnailUrl. */
  og: string;
  /** Full video, first matching source wins: list larger files first with a `media` gate. */
  sources: { src: string; media?: string }[];
};

export type CustomerStory = {
  slug: string;
  /** What must be replaced before launch (see header). */
  status: "real" | "real-figures" | "mock";
  brand: {
    name: string;
    /** Single-ink alpha mask, rendered white. Omit for a serif wordmark. */
    logo?: { src: string; w: number; h: number };
  };
  category: CategoryKey;
  /** Short product line, for the kicker ("Mochi ice cream"). */
  product: string;
  channels: string[];
  facts: { team?: string; hq?: string; since?: string };
  photo: { src: string; position: string; credit: string };
  headline: Heading;
  excerpt: string;
  /** "How {brand} …": grid card title and the story page H1 (Hyperline pattern). */
  cardTitle: string;
  /** "About {brand}" paragraph on the story page. */
  about: string;
  /** Story page 2×2 summary (Hyperline's Challenge / Solution / Pricing model / Results). */
  summary: { challenge: string; solution: string; channels: string; results: string };
  /** metrics[0] is the headline result: card pill, bento tile, homepage pill. */
  metrics: Metric[];
  /** Pill text when "figure label" reads badly (default: metrics[0] joined). */
  pill?: string;
  /** Video testimonial: replaces the photo on the card and the story cover. */
  video?: StoryVideo;
  quote: {
    text: string;
    name?: string;
    role: string;
    portrait?: { src: string; credit: string };
  };
  /** The full story: challenge → what changed → results. */
  body: Block[];
};

/* ── Stories ───────────────────────────────────────────────────────────── */

const P = "/images/stories";
const VID = "/videos/stories";

export const CUSTOMER_STORIES: CustomerStory[] = [
  {
    slug: "farmer-direct-foods",
    status: "real",
    brand: { name: "Farmer Direct Foods", logo: { src: "/logos/customers/farmer-direct-foods.png", w: 202, h: 240 } },
    category: "pantry",
    product: "Grain and flour",
    channels: ["KeHE", "UNFI"],
    facts: {},
    photo: { src: `${VID}/farmer-direct-foods-teaser-poster-v2.webp`, position: "50% 30%", credit: "Still from Farmer Direct Foods’ video testimonial" },
    headline: { before: "Evaluate deductions, not just ", accent: "react", after: " to them." },
    excerpt: "Julie Mayden ran Farmer Direct Foods’ revenue deductions on spreadsheets she built herself. With Roma checking her classifications, she can analyze deductions and make decisions from them.",
    cardTitle: "How Farmer Direct Foods moved revenue deductions off spreadsheets and started making decisions from them",
    about: "Farmer Direct Foods is a grain and flour company whose retail brand is sold through KeHE and UNFI. It’s a small team where, in Julie Mayden’s words, “each of us covers a lot of bases.”",
    summary: {
      challenge: "Revenue deductions for the retail brand ran on Excel spreadsheets Julie built herself. A firm they tried first showed errors when she checked it against her spreadsheets for a few months.",
      solution: "Roma understands KeHE and UNFI invoice types and checks Julie’s classifications, so she can trust the data and analyze it.",
      channels: "KeHE and UNFI, the retail brand’s distributors.",
      results: "Deductions she can analyze and make decisions from, and a Roma team she calls the single biggest improvement.",
    },
    metrics: [{ figure: "KeHE & UNFI", label: "invoice types, understood" }],
    pill: "“Knows KeHE & UNFI invoices better than I do”",
    video: {
      title: "Julie Mayden, Farmer Direct Foods, on Roma",
      duration: "2:26",
      isoDuration: "PT2M26S",
      uploadDate: "2026-11-23",
      teaser: `${VID}/farmer-direct-foods-teaser-v2.mp4`,
      poster: `${VID}/farmer-direct-foods-poster-v1.webp`,
      og: `${VID}/farmer-direct-foods-og-v1.jpg`,
      sources: [
        // 1080p only where the player is wider than ~1280 device pixels.
        { src: `${VID}/farmer-direct-foods-1080-v1.mp4`, media: "(min-width: 1400px), (min-width: 900px) and (min-resolution: 1.5dppx)" },
        { src: `${VID}/farmer-direct-foods-720-v1.mp4` },
      ],
    },
    quote: {
      text: "Roma helps us understand our deductions and make better decisions. Their proactive team understands our business and gives us the support we need as we grow.",
      name: "Julie Mayden",
      role: "Senior VP of Grain and Finance",
    },
    body: [
      { type: "h2", id: "challenge", text: "The challenge" },
      { type: "p", text: "Farmer Direct Foods is a small company, and everyone covers a lot of bases. On the accounting side, Julie Mayden, Senior VP of Grain and Finance, ended up handling all of the revenue deductions for the retail brand, on Excel spreadsheets she created herself." },
      { type: "p", text: "They tried one other firm first, one her CEO had met at a baking convention. Julie ran her spreadsheets side by side with their system for a few months to check it, and found errors. That made her nervous about whether they were gathering all the data they needed." },
      { type: "h2", id: "what-changed", text: "What changed" },
      { type: "p", text: "Julie classifies deductions as best she can. Running Roma showed her that the system understands the invoice types from KeHE and UNFI even better than she does, because Roma has more history with them." },
      { type: "quote", text: "It’s been really reassuring to have a system behind me, checking all my classifications." },
      { type: "p", text: "With deductions classified and checked, she can use the data to analyze and make decisions, which she couldn’t do before." },
      { type: "h2", id: "results", text: "The results" },
      { type: "p", text: "For Julie, the Roma team has been the single biggest improvement. Roma took an interest in how a small, growing company like Farmer Direct Foods works, so it could shape its program around that." },
      { type: "p", text: "Asked whether she’d recommend Roma: “If you’re willing to work with me at my size and program, and change things for someone like us, there would be no reason to not recommend you.”" },
      { type: "callout", label: "In her words", text: "It allows me the ability to evaluate versus just react." },
    ],
  },
  {
    slug: "good-day-chocolate",
    status: "real-figures",
    brand: { name: "Good Day Chocolate" },
    category: "confectionery",
    product: "Chocolate",
    channels: ["UNFI", "KeHE"],
    facts: { since: "2026" },
    photo: { src: `${P}/mock-good-day-chocolate.webp`, position: "50% 30%", credit: "Walter Otto on Unsplash (unsplash.com/photos/qJ249_JzEL0)" },
    headline: { before: "$53K they’d already written off, ", accent: "back", after: "." },
    excerpt: "UNFI and KeHE deductions came off every payment and nobody had time to check them. Six months on Roma later, $53K that would have been written off had come back.",
    cardTitle: "How Good Day Chocolate recovered $53K in deductions it had been writing off",
    about: "Good Day Chocolate is a natural chocolate brand sold through UNFI and KeHE, with a lean team running operations and growth.",
    summary: {
      challenge: "Deductions came off every UNFI and KeHE payment. Checking one meant a portal export, an invoice search and a hunt for backup, so most were written off.",
      solution: "Roma pulls deductions from both distributor portals and matches each one to its invoice and promo agreement, with the backup needed to dispute it.",
      channels: "UNFI and KeHE, connected in Roma. Disputes go out and are tracked from one place.",
      results: "$53K recovered within six months, without adding anyone to the team.",
    },
    metrics: [
      { figure: "$53K", label: "recovered in 6 months" },
      { figure: "2", label: "distributor portals connected" },
      { figure: "0", label: "new hires" },
    ],
    quote: {
      text: "We were writing off UNFI and KeHE deductions because nobody had time to check them. Within six months on Roma we'd recovered $53K we would have written off.",
      name: "Jasen Arias",
      role: "VP Ops & Growth",
    },
    body: [
      { type: "h2", id: "challenge", text: "The challenge" },
      { type: "p", text: "Deductions came off every UNFI and KeHE payment, and the team treated them as a cost of selling. Checking one meant a portal export, an invoice search and a hunt for backup, so most were never checked at all." },
      { type: "p", text: "Nobody chose to write them off. It simply wasn’t anyone’s job, and the team’s time went to growing the brand." },
      { type: "h2", id: "what-changed", text: "What changed" },
      { type: "p", text: "They connected their distributor portals to Roma. Every deduction arrived categorized and matched to its invoice and promo agreement, so the invalid ones stood out, each with the backup needed to dispute it." },
      { type: "quote", text: "Once we could see each deduction next to its invoice and promo, it was obvious how many were invalid." },
      { type: "h2", id: "results", text: "The results" },
      { type: "p", text: "Disputes went out from one place and were tracked to payment. Within six months, $53K that would have been written off had come back, without adding anyone to the team." },
      { type: "callout", label: "What they’d tell another founder", text: "Look at one quarter of your deductions. Just one. You’ll know." },
    ],
  },
  {
    slug: "fernbrook-kombucha",
    status: "mock",
    brand: { name: "Fernbrook Kombucha" },
    category: "beverages",
    product: "Kombucha",
    channels: ["UNFI", "KeHE", "Whole Foods"],
    facts: { team: "14 people", hq: "Portland, OR", since: "2025" },
    photo: { src: `${P}/mock-fernbrook.webp`, position: "50% 55%", credit: "Megumi Nachev on Unsplash (unsplash.com/photos/TcNG1talu3s)" },
    headline: { before: "The spreadsheet that ran on one ", accent: "person", after: "." },
    excerpt: "Deductions belonged to their head of operations, every Thursday, by hand. Roma turned a day of downloads into a Monday coffee, and they haven’t fallen behind since.",
    cardTitle: "How Fernbrook Kombucha turned a day of portal downloads into a Monday review",
    about: "Fernbrook Kombucha brews organic kombucha in Portland, Oregon, sold through UNFI, KeHE and Whole Foods. Its 14-person team runs deductions through one operations lead.",
    summary: {
      challenge: "Every Thursday the head of operations downloaded three portals’ exports and matched lines to invoices by hand. When she was busy, the backlog grew.",
      solution: "Deductions from all three channels land in Roma categorized and matched, so her job changed from building the list to reviewing it.",
      channels: "UNFI, KeHE and Whole Foods in one view. Disputes are confirmed in Roma with backup attached.",
      results: "Deductions work went from 22 hours a week to 3, and $17.4K came back in the first quarter.",
    },
    metrics: [
      { figure: "19 h", label: "back every week" },
      { figure: "3", label: "portals in one view" },
      { figure: "$17.4K", label: "recovered in the first quarter" },
    ],
    quote: {
      text: "Deductions used to be Thursday. All of Thursday. Now it’s a coffee on Monday: I open Roma, confirm what to dispute and get back to running the business.",
      name: "Dana Whitfield",
      role: "Head of Operations",
      portrait: { src: `${P}/portrait-woman-1.webp`, credit: "Vitaly Gariev on Unsplash (unsplash.com/photos/LlcpQWSWPUo)" },
    },
    body: [
      { type: "h2", id: "challenge", text: "The challenge" },
      { type: "p", text: "Every Thursday, Dana downloaded three portals’ exports, pasted them into a master spreadsheet and matched lines to invoices by hand. Most of the day went to assembling the list, before a single deduction was reviewed." },
      { type: "p", text: "When a product launch took her Thursday, the spreadsheet stopped, and the backlog grew faster than anyone could clear it." },
      { type: "h2", id: "what-changed", text: "What changed" },
      { type: "p", text: "Roma replaced the downloads. Deductions from UNFI, KeHE and Whole Foods land in one view, categorized and matched, so Dana’s job changed from building the list to reviewing it." },
      { type: "ul", items: ["Portal exports: from 4.5 hours a week to none", "Matching to invoices: from 7.5 hours to a 90-minute review", "Disputes: confirmed in Roma, with backup attached"] },
      { type: "quote", text: "If the process depends on one person’s free day, you don’t have a process." },
      { type: "h2", id: "results", text: "The results" },
      { type: "p", text: "Deductions went from 22 hours a week to 3. In the first quarter the team recovered $17.4K in invalid deductions, and they haven’t fallen behind since, launches included." },
    ],
  },
  {
    slug: "little-ember-popcorn",
    status: "mock",
    brand: { name: "Little Ember Popcorn" },
    category: "snacks",
    product: "Popcorn",
    channels: ["KeHE", "Target", "Walmart", "UNFI"],
    facts: { team: "22 people", hq: "Austin, TX", since: "2025" },
    photo: { src: `${P}/mock-little-ember.webp`, position: "50% 50%", credit: "Pylz Works on Unsplash (unsplash.com/photos/ViI6qkoRfNA)" },
    headline: { before: "One expense line, finally ", accent: "explained", after: "." },
    excerpt: "Their bookkeeper booked every deduction to one account. Split by retailer and promo in Roma, 61% of one retailer’s deductions traced back to a single spring promo.",
    cardTitle: "How Little Ember Popcorn traced 61% of one retailer’s deductions to a single promo",
    about: "Little Ember Popcorn makes small-batch popcorn in Austin, Texas, sold through KeHE, UNFI, Target and Walmart. A 22-person team with a co-founder running finance.",
    summary: {
      challenge: "Every deduction was booked to one expense account. The books were right, but that line couldn’t say which retailer, which promo, or what was invalid.",
      solution: "Roma broke $186K of deductions down by channel, deduction type and promo, and coded each line for the bookkeeper.",
      channels: "KeHE, UNFI, Target and Walmart, split line by line instead of one expense account.",
      results: "They reworked their biggest promo and disputed the invalid deductions: 2.1 points of gross margin back at one retailer.",
    },
    metrics: [
      { figure: "+2.1 pts", label: "gross margin at one retailer" },
      { figure: "$186K", label: "of deductions explained line by line" },
      { figure: "61%", label: "traced to one promo" },
    ],
    quote: {
      text: "Our bookkeeper did exactly what we asked: booked it. The first time we saw that line split by retailer and promo, we changed how we run our biggest promo that same week.",
      name: "Marcus Bell",
      role: "Co-founder & CFO",
      portrait: { src: `${P}/portrait-man-3.webp`, credit: "Vitaly Gariev on Unsplash (unsplash.com/photos/AhZvzGUeLvs)" },
    },
    body: [
      { type: "h2", id: "challenge", text: "The challenge" },
      { type: "p", text: "Their bookkeeper recorded every deduction faithfully, to one expense account. The books were right, but that one line couldn’t say which retailer, which promo, or which deductions were invalid." },
      { type: "h2", id: "what-changed", text: "What changed" },
      { type: "p", text: "In Roma, $186K of deductions over three quarters broke down by channel, deduction type and promo. Target was the largest share, and 61% of Target’s deductions traced back to a single spring temporary price reduction." },
      { type: "table", caption: "Deductions by channel, Q1–Q3 (illustrative)", head: ["Channel", "Deductions"], rows: [["Target", "$63,820"], ["UNFI", "$52,310"], ["KeHE", "$41,870"], ["Walmart", "$28,240"]] },
      { type: "h2", id: "results", text: "The results" },
      { type: "p", text: "They reworked that promo before renewing it and disputed the invalid deductions they found along the way: 2.1 points of gross margin back at that retailer. Their bookkeeper now books from Roma’s coded lines." },
      { type: "callout", label: "What they’d tell another founder", text: "Booked isn’t the same as understood." },
    ],
  },
  {
    slug: "smash-kitchen",
    status: "real-figures",
    brand: { name: "Smash Kitchen", logo: { src: "/logos/customers/smash-kitchen.png", w: 176, h: 107 } },
    category: "pantry",
    product: "Condiments",
    channels: ["UNFI", "KeHE"],
    facts: { since: "2026" },
    photo: { src: `${P}/mock-smash-kitchen.webp`, position: "40% 50%", credit: "Unsplash (unsplash.com/photos/y--Os1aj_EU)" },
    headline: { before: "Every deduction next to its ", accent: "invoice", after: "." },
    excerpt: "For the first time, the team could see each deduction beside the invoice and promo it came from, and exactly which ones were invalid. $23K came back.",
    cardTitle: "How Smash Kitchen matched every deduction to its invoice and recovered $23K",
    about: "Smash Kitchen makes condiments for natural and specialty retail, distributed through UNFI and KeHE.",
    summary: {
      challenge: "Deductions arrived across distributor portals in different formats, without the invoice or promo they related to. Sorting valid from invalid meant rebuilding the context by hand.",
      solution: "Roma matches every deduction to its invoice and promo agreement in one place, so the invalid ones stand out with their backup.",
      channels: "UNFI and KeHE, with every deduction in one place and no portal exports by hand.",
      results: "$23K in invalid deductions recovered, with each claim tracked to payment.",
    },
    metrics: [
      { figure: "$23K", label: "recovered" },
      { figure: "1", label: "place for every deduction" },
      { figure: "0", label: "portal exports by hand" },
    ],
    quote: {
      text: "For the first time we could see every deduction next to its invoice and promo, and exactly which ones were wrong. We got $23K back.",
      role: "Finance lead",
    },
    body: [
      { type: "h2", id: "challenge", text: "The challenge" },
      { type: "p", text: "Deductions arrived across distributor portals in different formats, without the invoice or promo they related to. Telling a valid deduction from an invalid one meant rebuilding the context by hand." },
      { type: "h2", id: "what-changed", text: "What changed" },
      { type: "p", text: "Roma matched every deduction to its invoice and promo agreement, in one place. Invalid deductions stood out, and each came with the backup needed to dispute it." },
      { type: "h2", id: "results", text: "The results" },
      { type: "p", text: "The finance team disputed what the evidence supported and tracked each claim to payment. $23K in invalid deductions came back." },
    ],
  },
  {
    slug: "mochidoki",
    status: "real-figures",
    brand: { name: "Mochidoki", logo: { src: "/logos/customers/mochidoki.png", w: 161, h: 38 } },
    category: "frozen",
    product: "Mochi ice cream",
    channels: ["UNFI", "KeHE"],
    facts: { since: "2026" },
    photo: { src: `${P}/mock-mochidoki.webp`, position: "48% 35%", credit: "Rifki Kurniawan on Unsplash (unsplash.com/photos/k63Or81F8-M)" },
    headline: { before: "Live in five minutes, not a ", accent: "quarter", after: "." },
    excerpt: "Setup took minutes, not weeks. Now one person handles deductions across every retailer, with no spreadsheet in sight.",
    cardTitle: "How Mochidoki went live on Roma in five minutes and retired its deductions spreadsheets",
    about: "Mochidoki makes mochi ice cream, sold through UNFI, KeHE and its retail partners.",
    summary: {
      challenge: "Each retailer’s deductions lived in its own exports and spreadsheets. Keeping up took more people than a growing frozen brand wanted to spend on it.",
      solution: "The team connected its portals to Roma in about five minutes, with no ERP or IT project. Deductions now arrive in one view, categorized.",
      channels: "UNFI and KeHE, connected in about five minutes.",
      results: "One person handles deductions across every retailer, and the spreadsheets are gone.",
    },
    metrics: [
      { figure: "5 min", label: "to go live" },
      { figure: "1", label: "person across every retailer" },
      { figure: "0", label: "spreadsheets" },
    ],
    pill: "Live in 5 minutes",
    quote: {
      text: "Setup took minutes, not weeks. Now one person handles deductions across every retailer, and not a single spreadsheet.",
      role: "Operations",
    },
    body: [
      { type: "h2", id: "challenge", text: "The challenge" },
      { type: "p", text: "Deductions from each retailer lived in their own exports and spreadsheets. Keeping up took more people than a growing frozen brand wanted to spend on it." },
      { type: "h2", id: "what-changed", text: "What changed" },
      { type: "p", text: "The team connected their portals to Roma in about five minutes, with no ERP or IT project. Deductions from every retailer arrived in one view, already categorized." },
      { type: "h2", id: "results", text: "The results" },
      { type: "p", text: "One person now handles deductions across every retailer, and the spreadsheets are gone." },
    ],
  },
  {
    slug: "hollis-farm-granola",
    status: "mock",
    brand: { name: "Hollis Farm Granola" },
    category: "pantry",
    product: "Granola",
    channels: ["UNFI", "KeHE"],
    facts: { team: "9 people", hq: "Burlington, VT", since: "2025" },
    photo: { src: `${P}/mock-hollis-farm.webp`, position: "55% 60%", credit: "Katya Azimova on Unsplash (unsplash.com/photos/mkdr9COQxsk)" },
    headline: { before: "Shortages were the blind ", accent: "spot", after: "." },
    excerpt: "Proof of delivery always existed somewhere. Roma put it next to the shortage deduction it answers, and $11.6K came back.",
    cardTitle: "How Hollis Farm Granola put proof of delivery next to every shortage claim",
    about: "Hollis Farm Granola bakes granola in Burlington, Vermont, sold through UNFI and KeHE. A nine-person team led by its founder.",
    summary: {
      challenge: "Shortage deductions were the hardest to fight. Proof of delivery existed, but finding it for each claim took longer than the claim seemed worth.",
      solution: "Roma lines each shortage up with the shipment it refers to, so the team knows which proof to pull and disputes with the backup attached.",
      channels: "UNFI and KeHE, with every shortage matched to its shipment.",
      results: "38 shortage claims disputed and $11.6K recovered that had been absorbed as a cost of doing business.",
    },
    metrics: [
      { figure: "$11.6K", label: "recovered on shortages" },
      { figure: "38", label: "shortage claims disputed" },
      { figure: "2", label: "portals connected" },
    ],
    quote: {
      text: "Shortages were our blind spot. The proof of delivery always existed somewhere. Now it sits next to the deduction it answers.",
      name: "Erin Hollis",
      role: "Founder",
    },
    body: [
      { type: "h2", id: "challenge", text: "The challenge" },
      { type: "p", text: "Shortage deductions were the hardest to fight. The proof of delivery existed, in a carrier portal or an inbox, but finding it for each claim took longer than the claim seemed worth." },
      { type: "h2", id: "what-changed", text: "What changed" },
      { type: "p", text: "Roma flagged each shortage against the shipment it referred to, so the team knew which proof to pull and could dispute with the backup attached." },
      { type: "h2", id: "results", text: "The results" },
      { type: "p", text: "38 shortage claims disputed, and $11.6K recovered that had been absorbed as a cost of doing business." },
    ],
  },
  {
    slug: "saltwind-crackers",
    status: "mock",
    brand: { name: "Saltwind Crackers" },
    category: "snacks",
    product: "Crackers",
    channels: ["UNFI", "Target", "Walmart", "Kroger", "Whole Foods"],
    facts: { team: "31 people", hq: "Charleston, SC", since: "2025" },
    photo: { src: `${P}/mock-saltwind.webp`, position: "50% 55%", credit: "Grace Boburka on Unsplash (unsplash.com/photos/4EOmQBqZqq8)" },
    headline: { before: "Five portals, one ", accent: "view", after: "." },
    excerpt: "Their fractional CFO used to ask for the deductions spreadsheet every month. Now she logs in and sees it herself, across five retailers.",
    cardTitle: "How Saltwind Crackers brought five retailer portals into one view",
    about: "Saltwind Crackers bakes crackers in Charleston, South Carolina, sold through UNFI, Target, Walmart, Kroger and Whole Foods. 31 people, with a fractional CFO.",
    summary: {
      challenge: "Five retailers meant five portals, five export formats and one spreadsheet that took days to reconcile at month-end.",
      solution: "Roma brings all five portals into one view, and the fractional CFO has her own login instead of a monthly spreadsheet request.",
      channels: "UNFI, Target, Walmart, Kroger and Whole Foods, in one view.",
      results: "Month-end finished three days sooner, and $14.2K in invalid deductions came back over two quarters.",
    },
    metrics: [
      { figure: "5", label: "portals, one view" },
      { figure: "$14.2K", label: "recovered in two quarters" },
      { figure: "3 days", label: "faster month-end" },
    ],
    quote: {
      text: "Our fractional CFO used to ask me for the deductions spreadsheet every month. Now she logs in and sees it herself.",
      name: "Owen Brooks",
      role: "Head of Finance",
      portrait: { src: `${P}/portrait-man-1.webp`, credit: "Vitaly Gariev on Unsplash (unsplash.com/photos/o3PdpOz_iaA)" },
    },
    body: [
      { type: "h2", id: "challenge", text: "The challenge" },
      { type: "p", text: "Five retailers meant five portals, five export formats and one spreadsheet that took days to reconcile at month-end." },
      { type: "h2", id: "what-changed", text: "What changed" },
      { type: "p", text: "Roma brought all five portals into one view. The fractional CFO got her own login, so the monthly spreadsheet request stopped." },
      { type: "h2", id: "results", text: "The results" },
      { type: "p", text: "Month-end deductions work finished three days sooner, and $14.2K in invalid deductions came back over two quarters." },
    ],
  },
  {
    slug: "juniper-row-tea",
    status: "mock",
    brand: { name: "Juniper Row Tea" },
    category: "beverages",
    product: "Iced tea",
    channels: ["KeHE"],
    facts: { team: "6 people", hq: "Asheville, NC", since: "2026" },
    photo: { src: `${P}/mock-juniper-row.webp`, position: "50% 50%", credit: "Kita Centella on Unsplash (unsplash.com/photos/nVry2nZsoEU)" },
    headline: { before: "Connected between two ", accent: "calls", after: "." },
    excerpt: "A six-person team, one KeHE portal and no time. Their founder connected Roma between meetings and had every deduction sorted that afternoon.",
    cardTitle: "How Juniper Row Tea connected KeHE between two calls and recovered $6.8K",
    about: "Juniper Row Tea makes bottled iced tea in Asheville, North Carolina, distributed by KeHE. A six-person team where the founder covers finance.",
    summary: {
      challenge: "With six people and one distributor, deductions were nobody’s job. The founder suspected money was leaking but couldn’t justify a project to find out.",
      solution: "Connecting KeHE took under five minutes. By the end of the day every deduction was categorized and the invalid ones were marked for review.",
      channels: "KeHE, connected in under five minutes.",
      results: "$6.8K recovered in the first 90 days, from a portal nobody had opened in months.",
    },
    metrics: [
      { figure: "< 5 min", label: "to connect KeHE" },
      { figure: "$6.8K", label: "recovered in 90 days" },
      { figure: "1", label: "afternoon to a full picture" },
    ],
    quote: {
      text: "I connected our portal between two calls. By that afternoon our deductions were sorted in one place, for the first time ever.",
      name: "Lena Ortiz",
      role: "Founder",
    },
    body: [
      { type: "h2", id: "challenge", text: "The challenge" },
      { type: "p", text: "With six people and one distributor, deductions were nobody’s job. The founder knew money was leaking but couldn’t justify a project to find out how much." },
      { type: "h2", id: "what-changed", text: "What changed" },
      { type: "p", text: "Connecting KeHE to Roma took under five minutes. By the end of the day every deduction was categorized and the invalid ones were flagged." },
      { type: "h2", id: "results", text: "The results" },
      { type: "p", text: "$6.8K recovered in the first 90 days, from a portal nobody had opened in months." },
    ],
  },
  {
    slug: "pebble-creek-nut-butter",
    status: "mock",
    brand: { name: "Pebble Creek Nut Butter" },
    category: "pantry",
    product: "Nut butter",
    channels: ["KeHE", "Walmart"],
    facts: { team: "12 people", hq: "Boulder, CO", since: "2025" },
    photo: { src: `${P}/mock-pebble-creek.webp`, position: "50% 50%", credit: "personalgraphic.com on Unsplash (unsplash.com/photos/RUqCyjDQZ-A)" },
    headline: { before: "The 3% they’d stopped ", accent: "questioning", after: "." },
    excerpt: "They budgeted deductions at 3% of sales and moved on. A real share of that 3% turned out to be invalid, and $8.2K came back in a quarter.",
    cardTitle: "How Pebble Creek Nut Butter found that one in five deductions didn’t hold up",
    about: "Pebble Creek Nut Butter makes nut butters in Boulder, Colorado, sold through KeHE and Walmart. A 12-person team run by two co-founders.",
    summary: {
      challenge: "Deductions were a budget line: 3% of sales, accepted as the cost of being on shelf. Nobody checked whether the 3% was right.",
      solution: "Roma checks every KeHE and Walmart deduction against invoices and promo terms, so the invalid ones can be disputed with backup.",
      channels: "KeHE and Walmart, each deduction checked against invoices and promo terms.",
      results: "$8.2K back in the first quarter, and a deductions budget the team understands line by line.",
    },
    metrics: [
      { figure: "$8.2K", label: "back in the first quarter" },
      { figure: "1 in 5", label: "deductions found invalid" },
      { figure: "2", label: "channels connected" },
    ],
    quote: {
      text: "We’d budgeted deductions at 3% of sales and stopped thinking about them. A real chunk of that 3% turned out to be invalid.",
      name: "Sam Pruitt",
      role: "Co-founder",
      portrait: { src: `${P}/portrait-man-2.webp`, credit: "Vitaly Gariev on Unsplash (unsplash.com/photos/OvXZDyt7rXE)" },
    },
    body: [
      { type: "h2", id: "challenge", text: "The challenge" },
      { type: "p", text: "Deductions were a line in the budget: 3% of sales, accepted as the cost of being on shelf. Nobody checked whether the 3% was right." },
      { type: "h2", id: "what-changed", text: "What changed" },
      { type: "p", text: "Roma checked every KeHE and Walmart deduction against invoices and promo terms. About one in five didn’t hold up." },
      { type: "h2", id: "results", text: "The results" },
      { type: "p", text: "$8.2K back in the first quarter, and a deductions budget the team now understands line by line." },
    ],
  },
];

/* ── Lookups ───────────────────────────────────────────────────────────── */

export function getStory(slug: string) {
  return CUSTOMER_STORIES.find((s) => s.slug === slug);
}

/** Same category first, then the rest, in list order. */
export function getRelatedStories(slug: string, n = 3) {
  const story = getStory(slug);
  const others = CUSTOMER_STORIES.filter((s) => s.slug !== slug);
  const same = others.filter((s) => s.category === story?.category);
  return [...same, ...others.filter((s) => s.category !== story?.category)].slice(0, n);
}

export function pillText(story: CustomerStory) {
  return story.pill ?? `${story.metrics[0].figure} ${story.metrics[0].label}`;
}

export function storyHref(slug: string) {
  return `/customers/${slug}`;
}

/* ── Page copy ─────────────────────────────────────────────────────────── */

// /customers (DESIGN.md §G.15): centred intro → featured strip (the homepage's three
// real brands, components/sections/stories/data.ts) → every story as a logo card.
export const customersCopy = {
  heading: "Built for brands that stopped writing off deductions",
  lead: "See how natural and specialty CPG brands track, dispute and book their deductions with Roma.",
  gridHeading: "All customer stories",
  read: "Read story",
  note: RESULTS_VARY,
};

export const storyPageCopy = {
  breadcrumb: "Customers",
  about: "About",
  summary: { challenge: "Challenge", solution: "Solution", channels: "Channels", results: "Results" },
  more: "More customer stories",
  note: RESULTS_VARY,
};

export const custClosing = {
  heading: { before: "Your deductions have a story ", accent: "too", after: "." },
  sub: "Connect a portal and see your own numbers. Or book 30 minutes and we’ll walk you through them.",
  cta: { label: "Try now", href: SIGNUP_HREF },
  secondary: { label: "Book a demo", href: DEMO_HREF },
};
