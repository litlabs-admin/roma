// Customer stories: the one source for /customers, /customers/[slug] and the homepage
// Stories section (components/sections/stories/data.ts picks the three real brands).
// DESIGN.md §G.15.
//
// WHAT IS REAL vs MOCK (replace before launch; see DESIGN.md pre-launch item 7)
// - status "real-figures": Good Day Chocolate ($53K in 6 months, Jasen Arias, VP Ops &
//   Growth, from the positioning PDF, 4 Nov 2026), Smash Kitchen ($23K, PDF) and
//   Mochidoki (live in 5 minutes). ONLY those headline figures and names are sourced.
//   Their quotes, narratives, secondary metrics and facts are MOCK. No portraits and no
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

import type { EditorialHeroCopy } from "@/components/blog/BlogHero";
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

export type CustomerStory = {
  slug: string;
  /** What must be replaced before launch (see header). */
  status: "real-figures" | "mock";
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
  /** metrics[0] is the headline result: card pill, bento tile, homepage pill. */
  metrics: Metric[];
  /** Pill text when "figure label" reads badly (default: metrics[0] joined). */
  pill?: string;
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

export const CUSTOMER_STORIES: CustomerStory[] = [
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

export function categoryLabel(key: CategoryKey) {
  return CATEGORIES.find((c) => c.key === key)?.label ?? key;
}

export function pillText(story: CustomerStory) {
  return story.pill ?? `${story.metrics[0].figure} ${story.metrics[0].label}`;
}

export function storyHref(slug: string) {
  return `/customers/${slug}`;
}

/** "Name, Role" or just the role when no person is named. */
export function attribution(story: CustomerStory) {
  return story.quote.name ? `${story.quote.name}, ${story.quote.role}` : story.quote.role;
}

/* ── Page copy ─────────────────────────────────────────────────────────── */

export const custHero: EditorialHeroCopy = {
  id: "customers-title",
  eyebrow: "Customer stories",
  icon: "book",
  heading: { before: "They checked. The money was ", accent: "theirs", after: "." },
  lead: "Natural and specialty brands selling through UNFI, KeHE and retailers, on what they found when someone finally looked at their deductions.",
  image: { src: `${P}/mock-good-day-chocolate.webp`, position: "50% 30%" },
  listLabel: "Browse by category",
  items: CATEGORIES.map((c) => ({ label: c.label, href: `/customers?cat=${c.key}#library` })),
};

// Bento (DESIGN.md §G.15): the homepage Stories heading, continued.
export const bentoCopy = {
  heading: { before: "Brands that stopped writing off ", accent: "deductions", after: "." } as Heading,
  lead: "From emerging natural brands to established CPG teams, finance leads use Roma across UNFI, KeHE and their other retailers.",
  note: RESULTS_VARY,
  /** Lead photo tile, the rotating quote card, then the row of three tiles. */
  leadTile: "good-day-chocolate",
  quotes: ["fernbrook-kombucha", "little-ember-popcorn", "saltwind-crackers", "pebble-creek-nut-butter"],
  row: [
    { slug: "smash-kitchen", kind: "photo" as const },
    { slug: "mochidoki", kind: "gradient" as const },
    { slug: "hollis-farm-granola", kind: "photo" as const },
  ],
  read: "Read story",
};

export const libraryCopy = {
  label: "All stories",
  heading: { before: "Find a brand like ", accent: "yours", after: "." } as Heading,
  lead: "Every story starts the same way: deductions nobody had time to check. Filter by what you make.",
  all: "All",
  featured: "Featured story",
  read: "Read story",
  empty: "No stories in this category yet.",
  /** Closing tile of the "All" grid: the turn to the reader's own data. */
  yours: {
    label: "Your brand",
    heading: { before: "A case study is someone else’s ", accent: "numbers", after: "." } as Heading,
    body: "Connect a portal and see your own deductions by retailer and by type. Live in under 5 minutes, no ERP or IT project.",
    cta: { label: "Try now", href: SIGNUP_HREF },
    secondary: { label: "Book a demo", href: DEMO_HREF },
  },
};

export const storyPageCopy = {
  back: "All customer stories",
  glance: "At a glance",
  facts: { company: "Company", category: "Category", channels: "Channels", team: "Team", hq: "Headquarters", since: "On Roma since" },
  try: { label: "Try now", href: SIGNUP_HREF },
  results: "Results",
  more: { label: "More stories", heading: { before: "Brands like ", accent: "theirs", after: "." } as Heading },
  note: RESULTS_VARY,
};

export const custClosing = {
  heading: { before: "Your deductions have a story ", accent: "too", after: "." },
  sub: "Connect a portal and see your own numbers. Or book 30 minutes and we’ll walk you through them.",
  cta: { label: "Try now", href: SIGNUP_HREF },
  secondary: { label: "Book a demo", href: DEMO_HREF },
};
