// Blog content: /blogs and /blogs/[slug] (DESIGN.md §G.10).
// Claims come only from "Messaging and Positioning – Roma.pdf" and the runroma.com facts
// already reworded in lib/content/platform.ts. Same tone rule as /platform: retailers and
// distributors are channels or portals, deductions are "invalid" or "recoverable".
// US English, no em dashes, no guaranteed recovery amounts.
//
// Inline text supports **bold** and [label](href).
//
// Photography (Unsplash License), DESIGN.md §11 item 6:
//   writing-off-cover   Raja Patel           unsplash.com/photos/Z9E0dp9AVuM
//   warehouse-aisle     Arum Visuals         unsplash.com/photos/VnMbc9Szs-E (also blog-hero-2400)
//   backup-cover        2H Media             unsplash.com/photos/spScdgWY-_c
//   distribution-boxes  CPG.IO               unsplash.com/photos/CBTmEZqUaM0
//   trade-rate-cover    Zoshua Colah         unsplash.com/photos/RLVijPav1kU
//   store-aisle         David Trinks         unsplash.com/photos/N_e5v6g-IXc
//   routine-cover       Filipp Romanovski    unsplash.com/photos/ag5H7Nqbf9U
//   desk-laptop         Dan Burton           unsplash.com/photos/ZHHVvXNdMW0

import { DEMO_HREF } from "@/components/chat/data";
import type { Heading } from "@/lib/content/platform";

export type BlogImage = { src: string; alt: string; width: number; height: number };

export type Author = { name: string; role: string; initials: string; bio: string };

export type ProductFigureKey = "matching" | "tradeRate";

export type Block =
  | { type: "p"; text: string }
  | { type: "h2"; id: string; text: string }
  | { type: "h3"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | { type: "quote"; text: string }
  | { type: "callout"; label: string; text: string }
  | { type: "figure"; image: BlogImage; caption: string }
  | { type: "product"; figure: ProductFigureKey; caption: string; summary: string }
  | { type: "table"; caption: string; head: string[]; rows: string[][] };

export type Post = {
  slug: string;
  title: Heading;
  excerpt: string;
  category: string;
  date: string; // YYYY-MM-DD
  author: Author;
  cover: BlogImage;
  body: Block[];
};

/* ── Listing copy ─────────────────────────────────────────────────────── */

export const blogIndex = {
  eyebrow: "Roma Blog",
  heroImage: { src: "/images/blog/blog-hero-2400.webp", width: 2400, height: 1600 },
  heading: { before: "Field notes on getting your ", accent: "money", after: " back." } as Heading,
  lead: "Plain-spoken guides for CPG founders and finance leads on deductions, distributors and the margin in between.",
  topicsLabel: "What we write about",
  topics: ["Deductions 101", "Distributors", "Analytics", "Operations"],
  featuredLabel: "Featured",
  latest: { label: "Latest", heading: { before: "More from the ", accent: "ledger", after: "." } as Heading },
  related: { label: "Keep reading", heading: { before: "More from the ", accent: "ledger", after: "." } as Heading },
  readCta: "Read the article",
  backLabel: "All articles",
  tocLabel: "On this page",
};

/* ── Authors ──────────────────────────────────────────────────────────── */

const AUTHORS = {
  maya: {
    name: "Maya Castellanos",
    role: "Head of Customer Success",
    initials: "MC",
    bio: "Maya works with Roma’s brands from their first portal connection to their first credited dispute.",
  },
  daniel: {
    name: "Daniel Okafor",
    role: "Deductions Lead",
    initials: "DO",
    bio: "Daniel has spent his career reading backup, and helps brands make sense of distributor deductions.",
  },
  priya: {
    name: "Priya Raman",
    role: "Finance Operations",
    initials: "PR",
    bio: "Priya focuses on trade rate, margin reporting and keeping deduction data in step with the books.",
  },
} satisfies Record<string, Author>;

/* ── Images ───────────────────────────────────────────────────────────── */

const IMG = {
  writingOff: { src: "/images/blog/writing-off-cover.webp", alt: "Warmly lit store shelves lined with bottles, jars and packaged goods", width: 2000, height: 1389 },
  warehouse: { src: "/images/blog/warehouse-aisle.webp", alt: "A dim warehouse aisle with cartons stacked on tall steel racking", width: 1600, height: 1067 },
  backup: { src: "/images/blog/backup-cover.webp", alt: "Printed documents and a pen spread across a wooden desk", width: 2000, height: 1333 },
  boxes: { src: "/images/blog/distribution-boxes.webp", alt: "Pallet racking in a distribution center stacked with branded cases", width: 1600, height: 991 },
  tradeRate: { src: "/images/blog/trade-rate-cover.webp", alt: "Grocery shelves stocked with rows of spreads, sauces and pantry goods", width: 2000, height: 1159 },
  storeAisle: { src: "/images/blog/store-aisle.webp", alt: "A shopper walking down a long, brightly lit grocery aisle", width: 1600, height: 1067 },
  routine: { src: "/images/blog/routine-cover.webp", alt: "A founder working through orders at a packing table surrounded by kraft bags", width: 2000, height: 1333 },
  desk: { src: "/images/blog/desk-laptop.webp", alt: "Hands on a laptop keyboard at a wooden desk, with envelopes and a phone nearby", width: 1600, height: 1067 },
} satisfies Record<string, BlogImage>;

const ILLUSTRATIVE = "Illustrative data. Not a guarantee of recovery.";

/* ── Posts (newest first) ─────────────────────────────────────────────── */

const POSTS: Post[] = [
  {
    slug: "deductions-quietly-costing-you-revenue",
    title: { before: "The deductions quietly costing you 2–3% of ", accent: "revenue", after: "." },
    excerpt:
      "Chargebacks, promo claims, shortages and fees come out of every payment. Many are invalid, but on a lean team nobody has time to check. Here is what that costs, and what checking every one looks like.",
    category: "Deductions 101",
    date: "2026-11-10",
    author: AUTHORS.maya,
    cover: IMG.writingOff,
    body: [
      {
        type: "p",
        text: "If you sell through UNFI, KeHE or a major retailer, the payment that lands in your account is rarely the number on your invoice. Somewhere between the invoice and the remittance, deductions come out: chargebacks, promo claims, shortages, fees. Each one is small enough to shrug off. Together, they add up to 2–3% of revenue for many emerging CPG brands.",
      },
      {
        type: "p",
        text: "Some of those deductions are valid. You ran the promotion, the case really did arrive damaged, the fee is in your agreement. But many are not, and on a lean team nobody has the hours to check which is which. So the outcome is the same every month: the deduction is booked, the money is written off, and the margin you planned for quietly shrinks.",
      },
      { type: "p", text: "This guide covers what deductions are, why invalid ones slip through, and what it looks like to check every single one." },

      { type: "h2", id: "what-a-deduction-is", text: "What a deduction actually is" },
      {
        type: "p",
        text: "A deduction is an amount a distributor or retailer subtracts from what it pays you, instead of paying the invoice in full and billing you separately. The remittance tells you how much was paid. The backup, a separate document or portal record, explains why the rest was held back.",
      },
      { type: "p", text: "Most deductions fall into a handful of families:" },
      {
        type: "ul",
        items: [
          "**Promo claims and chargebacks.** Amounts tied to promotions, such as manufacturer chargebacks (MCBs) and off-invoice allowances. Each should match a promo agreement you signed.",
          "**Shortages.** The channel reports receiving less than you invoiced. Each should match what was actually delivered.",
          "**Damage and spoils.** Product reported as damaged or unsaleable on arrival or on the shelf.",
          "**Fees.** Compliance, slotting, administrative and similar charges, which should match the terms of your agreements.",
        ],
      },
      { type: "p", text: "Every one of these has a document trail behind it. That trail is what makes a deduction checkable, and it is also what makes checking slow." },

      { type: "h2", id: "why-invalid-ones-slip-through", text: "Why invalid deductions slip through" },
      {
        type: "p",
        text: "Invalid deductions are rarely dramatic. A promotion billed against the wrong period. A shortage on a delivery your proof of delivery says arrived complete. A fee that isn’t in your agreement. The same claim deducted twice. None of these announce themselves. They sit in a remittance next to dozens of valid lines.",
      },
      {
        type: "p",
        text: "To catch them, someone has to download the remittance, find the backup in the right portal, line it up against the original invoice or promo agreement, and decide. Then, if the deduction is invalid, file a dispute with the right documents and follow it until it is credited. Multiply that by every deduction, from every channel, every month.",
      },
      {
        type: "p",
        text: "For a founder who owns the P&L and wears five hats, that work never reaches the top of the list. It isn’t negligence. It’s arithmetic: the time cost is visible today, and the recovered dollars stay invisible until someone does the work.",
      },
      { type: "figure", image: IMG.warehouse, caption: "Every case that leaves a warehouse has a paper trail. Deductions are where that trail gets tested." },
      {
        type: "callout",
        label: "The default",
        text: "When nobody checks, every deduction is treated as valid. The money isn’t lost in one moment. It’s written off one line at a time.",
      },

      { type: "h2", id: "why-the-usual-fixes-dont-stick", text: "Why the usual fixes don’t stick" },
      { type: "p", text: "Most brands we talk to have tried at least one of these." },
      { type: "h3", text: "Doing nothing" },
      {
        type: "p",
        text: "The cheapest option on paper. In practice, margin leaks every month, and because it leaks invisibly, the cost never shows up as a line item anyone can argue with.",
      },
      { type: "h3", text: "Spreadsheets" },
      {
        type: "p",
        text: "A spreadsheet works for as long as the person maintaining it has time. It is slow, it is error-prone, and it tends to be abandoned in the first busy month, which is usually the month with the most deductions.",
      },
      { type: "h3", text: "Your bookkeeper" },
      {
        type: "p",
        text: "Bookkeepers are good at what they’re hired for: recording what happened. A deduction gets recorded accurately, as a deduction. Recovering it is a different job, and it usually isn’t in the scope.",
      },
      { type: "p", text: "The common thread is that each fix depends on someone finding spare hours. Deductions don’t wait for spare hours." },

      { type: "h2", id: "what-checking-looks-like", text: "What checking every deduction looks like" },
      {
        type: "p",
        text: "The goal isn’t to dispute everything. It’s to know, for every deduction, whether it is valid or recoverable, and to act on the recoverable ones while there is still time.",
      },
      {
        type: "ol",
        items: [
          "**Pull every deduction into one place.** Across distributors and retailers, so nothing depends on remembering to log in to a portal.",
          "**Categorize it.** Promo, shortage, damage, spoils or fee. The category tells you which document should support it.",
          "**Match it to the source.** The invoice, the proof of delivery, the promo agreement. A matched deduction is one you can stop thinking about.",
          "**Dispute what doesn’t match.** With the backup attached, from one place, and a record of what was filed and when.",
          "**Track it to cash.** A dispute isn’t recovery until the credit shows up.",
        ],
      },
      {
        type: "p",
        text: "That is the loop Roma runs for lean teams. Roma pulls every deduction from your distributor and retailer portals, categorizes it and matches it to your invoices and promo agreements. You see what was deducted, why, and what’s recoverable, and you confirm each dispute before it is filed.",
      },

      { type: "h2", id: "what-its-worth", text: "What it’s worth" },
      {
        type: "p",
        text: "Recovery depends on your channels, your agreements and your history, so there is no honest universal number. What we can share is what a few brands have seen. **Good Day Chocolate recovered $53K in deductions within 6 months** of using Roma. **Smash Kitchen recovered $23K.**",
      },
      {
        type: "p",
        text: "Just as valuable is the part that doesn’t show up as recovered cash: a true view of margin by distributor, retailer and promo, and the confidence that nothing slips through unchecked.",
      },
      {
        type: "p",
        text: `Curious what your own deductions look like? [Book 30 minutes with us](${DEMO_HREF}). We’ll show you your numbers.`,
      },
    ],
  },

  {
    slug: "reading-deduction-backup",
    title: { before: "Reading deduction backup: how to tell valid from ", accent: "recoverable", after: "." },
    excerpt:
      "The remittance tells you what you were paid. The backup tells you why you weren’t paid the rest. A field guide to reading backup line by line, without an AR team.",
    category: "Distributors",
    date: "2026-10-28",
    author: AUTHORS.daniel,
    cover: IMG.backup,
    body: [
      {
        type: "p",
        text: "A remittance tells you what you were paid. The backup tells you why you weren’t paid the rest. If you only ever look at the first, you’re accepting every deduction on faith.",
      },
      {
        type: "p",
        text: "Reading backup is the core skill of deduction management, and it is less mysterious than it looks. This is how an experienced AR team approaches it, written for brands that don’t have one.",
      },

      { type: "h2", id: "remittance-vs-backup", text: "Remittance vs. backup" },
      {
        type: "p",
        text: "The remittance advice is the summary attached to a payment: which invoices were paid, and which amounts were deducted against them. It’s where most brands stop, because it’s the document that arrives with the money.",
      },
      {
        type: "p",
        text: "The backup is the supporting detail behind each deduction: the claim, the line items, the quantities, the promotion or agreement it refers to. With distributors like UNFI and KeHE, it usually lives in their portals rather than in your inbox, which is exactly why it goes unread.",
      },
      {
        type: "callout",
        label: "Rule of thumb",
        text: "If you can’t point to the document that justifies a deduction, you haven’t validated it. You’ve accepted it.",
      },

      { type: "h2", id: "start-with-the-type", text: "Start with the type" },
      {
        type: "p",
        text: "Before you read a single line, classify the deduction. The type tells you what the backup should prove, and what you should match it against.",
      },
      {
        type: "table",
        caption: "Common deduction types and the document each one should be matched to.",
        head: ["Type", "What it claims", "Match it against"],
        rows: [
          ["MCB (manufacturer chargeback)", "Your share of a promotion the channel ran", "The promo agreement: products, dates, rate"],
          ["OI (off-invoice)", "A discount taken off the invoice price", "The agreed allowance and the invoice"],
          ["Shortage", "Less product arrived than you invoiced", "The invoice and proof of delivery"],
          ["Damage and spoils", "Product arrived damaged or became unsaleable", "Delivery records and your allowance terms"],
          ["Fees", "Compliance, slotting or administrative charges", "The fee terms in your agreement"],
        ],
      },
      {
        type: "p",
        text: "Roma classifies deductions by MCB, shortage, OI, damage and spoils, and ships with 23 pre-built reason codes you can customize, so the type is set before anyone opens a PDF.",
      },

      { type: "h2", id: "reading-the-lines", text: "Reading the lines" },
      {
        type: "p",
        text: "Backup is where the detail lives, and the detail is where invalid deductions hide. For each line, you’re asking a few plain questions:",
      },
      {
        type: "ul",
        items: [
          "**Is it my product?** Check item codes against what you actually sell through that channel.",
          "**Is it in the right period?** Promo claims should fall inside the promotion’s dates.",
          "**Is the rate right?** Compare the per-unit amount with the agreed rate.",
          "**Is the quantity plausible?** Compare it with what you invoiced and shipped.",
          "**Have I seen it before?** The same claim deducted twice is still a claim deducted twice.",
        ],
      },
      {
        type: "p",
        text: "A deduction is valid when every line holds up. It is recoverable when one or more lines don’t, and you have the document to show it.",
      },
      {
        type: "product",
        figure: "matching",
        caption: `MCB backup lines matched to a promo agreement. ${ILLUSTRATIVE}`,
        summary:
          "Example backup for a UNFI manufacturer chargeback with four lines. Three lines match promo agreement PA-0412. One line falls outside the promotion’s dates and is marked recoverable.",
      },

      { type: "h2", id: "matching-is-the-job", text: "Matching is the whole job" },
      {
        type: "p",
        text: "Reading backup is only useful if you compare it with something. The work that recovers money is matching: each deduction to the invoice, proof of delivery or promo agreement it refers to.",
      },
      {
        type: "p",
        text: "Done by hand, that means a portal, a PDF, your invoicing system and your promo tracker open side by side. In Roma, deductions and remittances are pulled from your portals, and every backup is read line by line and matched to your invoices and promo agreements, so you know what’s valid before you act.",
      },
      { type: "figure", image: IMG.boxes, caption: "Shortage claims are checked against what actually shipped, not only what the remittance says arrived." },

      { type: "h2", id: "from-recoverable-to-recovered", text: "From recoverable to recovered" },
      {
        type: "p",
        text: "Once a deduction is recoverable, the dispute is simple in principle: tell the channel what’s wrong and attach the document that proves it. In practice, it stalls on logistics. Which portal, which form, which attachment, and who is following up?",
      },
      {
        type: "ol",
        items: [
          "**Gather the proof.** The invoice, proof of delivery or promo agreement that contradicts the deduction.",
          "**File it through the channel’s process.** Each distributor and retailer has its own process and its own timelines, so check your agreement.",
          "**Track the status.** Filed, in review, credited. A dispute nobody is watching is a dispute that quietly dies.",
        ],
      },
      {
        type: "p",
        text: "In Roma, invalid deductions are queued with their documents. You confirm, Roma files from one place, and you follow each dispute from filed to credited. Dispute in two clicks, track every status, and nothing is written off by default.",
      },

      { type: "h2", id: "where-to-start", text: "Where to start this week" },
      {
        type: "p",
        text: "Pick one channel and one month. Pull the remittances, find the backup for your five largest deductions and match each one to its source document. You’ll learn more about your deductions in an afternoon than a year of remittances will tell you.",
      },
      {
        type: "p",
        text: `Or [book 30 minutes with us](${DEMO_HREF}) and we’ll walk through your own deductions together.`,
      },
    ],
  },

  {
    slug: "trade-rate-is-your-real-margin",
    title: { before: "Trade rate is your real ", accent: "margin", after: "." },
    excerpt:
      "Your blended margin hides which channels, promotions and deduction types are costing you. How to read trade rate by channel, by type and over time.",
    category: "Analytics",
    date: "2026-10-14",
    author: AUTHORS.priya,
    cover: IMG.tradeRate,
    body: [
      {
        type: "p",
        text: "Ask a founder for their gross margin and you’ll get a number. Ask for their margin at UNFI, net of deductions, last quarter against the same quarter last year, and the room usually goes quiet.",
      },
      { type: "p", text: "That second number is the one that decides where you should grow. This piece is about how to get it, and how to read it." },

      { type: "h2", id: "what-trade-rate-means", text: "What we mean by trade rate" },
      {
        type: "p",
        text: "Trade rate is what it costs you to sell through a channel: promotions, allowances, fees and other deductions, expressed as a percentage of that channel’s sales. It is the gap between the price on your invoice and the cash that comes back.",
      },
      {
        type: "p",
        text: "Two channels with the same list price can have very different trade rates. One runs heavier promotions, another charges more fees, a third sees more shortages. Until you measure it per channel, you’re averaging a good account with a difficult one and calling it margin.",
      },
      {
        type: "callout",
        label: "Definition",
        text: "Trade rate = deductions and trade spend for a channel ÷ that channel’s sales, for the same period.",
      },

      { type: "h2", id: "why-the-blended-number-hides-it", text: "Why the blended number hides the problem" },
      {
        type: "p",
        text: "Most brands see deductions as one line in the P&L. That line is accurate, and almost useless for decisions, because it can’t tell you:",
      },
      {
        type: "ul",
        items: [
          "which distributor, retailer or chain the deductions came from",
          "which promotions cost more than planned",
          "whether shortages are concentrated in one channel",
          "whether this quarter is better or worse than the same quarter last year",
        ],
      },
      {
        type: "p",
        text: "Those are the questions behind real decisions: which promotion to renew, which account to renegotiate, and where the next dollar of trade spend should go.",
      },

      { type: "h2", id: "three-cuts", text: "Three cuts worth looking at" },
      { type: "h3", text: "By channel" },
      {
        type: "p",
        text: "Deductions as a percent of sales for each distributor, retailer and chain, with the margin impact next to it. This is the view that tells you whether a channel that looks big is actually profitable.",
      },
      { type: "h3", text: "By deduction type" },
      {
        type: "p",
        text: "Split each channel by MCB, shortage, OI, damage and spoils. A high trade rate driven by promotions is a planning conversation. One driven by shortages is an operations conversation.",
      },
      { type: "h3", text: "Over time" },
      {
        type: "p",
        text: "Compare any two periods, year over year. A trade rate that is creeping up is far easier to fix early than to explain later.",
      },
      {
        type: "product",
        figure: "tradeRate",
        caption: `Deductions as a percent of sales by channel, Q3 2026 against Q3 2025. ${ILLUSTRATIVE}`,
        summary:
          "Example chart of deductions as a percent of sales for UNFI, KeHE, Target, Walmart and Costco, comparing Q3 2026 with Q3 2025. Four of the five channels are lower than last year; Walmart is slightly higher.",
      },

      { type: "h2", id: "reading-without-overreacting", text: "Reading the numbers without overreacting" },
      {
        type: "p",
        text: "A higher trade rate isn’t automatically bad. A promotion that drove volume can be worth every point. What you’re looking for is the gap between what you planned to spend and what was actually deducted, and the deductions that should never have happened at all.",
      },
      {
        type: "ol",
        items: [
          "**Separate planned from unplanned.** Promotions you agreed to are planned. Shortages, unexplained fees and duplicate claims are not.",
          "**Check the unplanned against your documents.** Some of it will be recoverable.",
          "**Watch the trend, not the month.** One heavy month is noise. Three in a row is a pattern.",
        ],
      },
      { type: "figure", image: IMG.storeAisle, caption: "Shelf price is only part of the story. Trade rate decides whether a placement pays." },

      { type: "h2", id: "closing-the-loop", text: "Closing the loop with accounting" },
      {
        type: "p",
        text: "Analytics only helps if the numbers agree with your books. In Roma, deduction management, analytics and accounting share the same data, so the number you dispute is the number you book.",
      },
      {
        type: "ul",
        items: [
          "Every remittance matched to invoices and deductions",
          "Custom GL code mapping and standardized deduction classification",
          "A full audit trail",
          "Export to CSV, NetSuite or QuickBooks",
        ],
      },
      {
        type: "p",
        text: "Roma doesn’t replace your accounting or ERP system. It works alongside it. And with forecasting based on 12-month trends, you can plan next year’s trade spend from what actually happened, not from what the plan said would happen.",
      },
      {
        type: "p",
        text: `Want to see your own trade rate by channel? [Book a demo](${DEMO_HREF}) and we’ll show you your numbers.`,
      },
    ],
  },

  {
    slug: "deduction-routine-for-lean-teams",
    title: { before: "A deduction routine that gives your week ", accent: "back", after: "." },
    excerpt:
      "No AR department, no problem. A weekly cadence for founders and lean finance teams that survives busy weeks, and the parts of the job you should stop doing by hand.",
    category: "Operations",
    date: "2026-09-30",
    author: AUTHORS.maya,
    cover: IMG.routine,
    body: [
      {
        type: "p",
        text: "Most natural and specialty brands don’t have an AR team. They have a founder, maybe an operations lead, and a bookkeeper who comes in at month end. Deductions land on whoever has the least time to deal with them.",
      },
      {
        type: "p",
        text: "This is the routine we’d suggest for that team, whether or not you use Roma. It is deliberately small, because the routine that survives a busy month is the only one that works.",
      },

      { type: "h2", id: "why-the-spreadsheet-gets-abandoned", text: "Why the spreadsheet gets abandoned" },
      {
        type: "p",
        text: "Almost every brand starts with a spreadsheet: one row per deduction, a column for status, a column for notes. It works for a month or two. Then a launch happens, or a big order ships, or someone is out, and the spreadsheet falls a few weeks behind. Catching up feels worse than starting over, so nobody does either.",
      },
      {
        type: "p",
        text: "The problem isn’t discipline. A spreadsheet asks one person to do three jobs by hand: collect deductions from every portal, research each one, and chase the disputes. Any routine that depends on all three happening manually will break on the first busy week.",
      },
      { type: "figure", image: IMG.desk, caption: "The work is rarely hard. It’s the switching between portals, PDFs and spreadsheets that eats the week." },

      { type: "h2", id: "a-weekly-cadence", text: "A weekly cadence that survives busy weeks" },
      { type: "p", text: "Keep it small, fixed and boring. Short blocks of time, on the same days every week." },
      {
        type: "table",
        caption: "A starting cadence for a team of one or two. Adjust the time boxes to your volume.",
        head: ["When", "What", "Time box"],
        rows: [
          ["Monday", "Review new deductions across every channel and confirm each one’s type", "30 min"],
          ["Monday", "Mark anything that matches its invoice or promo agreement as valid, and move on", "15 min"],
          ["Wednesday", "Confirm disputes for recoverable deductions, with backup attached", "30 min"],
          ["Friday", "Check dispute statuses and note anything credited", "15 min"],
          ["Month end", "Review trade rate by channel and hand clean numbers to your bookkeeper", "1 hr"],
        ],
      },
      {
        type: "p",
        text: "The point of the cadence is that the slow parts, collecting, categorizing and matching, shouldn’t be on it. If your routine still includes downloading CSVs from portals, that’s the first thing to remove.",
      },

      { type: "h2", id: "what-to-hand-off", text: "What to hand off, and what to keep" },
      { type: "p", text: "Some of this work needs judgment. Most of it doesn’t." },
      {
        type: "ul",
        items: [
          "**Hand off:** pulling deductions and remittances from portals, categorizing them, reading backup and matching it to invoices and promo agreements.",
          "**Keep:** deciding which deductions to dispute, approving every dispute, and the channel relationships behind them.",
        ],
      },
      {
        type: "p",
        text: "That is the split Roma is built around. Deductions are pulled from your portals and matched for you. You confirm every dispute, with a full audit trail of what was filed and why. And your data never trains our models.",
      },
      {
        type: "quote",
        text: "Nothing is filed on your behalf without your confirmation. The routine gets faster; the decisions stay yours.",
      },

      { type: "h2", id: "how-to-tell-its-working", text: "How to tell it’s working" },
      { type: "p", text: "Give the routine a quarter, then look at three things." },
      {
        type: "ol",
        items: [
          "**Coverage.** Is every deduction from every channel reviewed, or only the big ones?",
          "**Time.** How many hours a week does the team spend on deductions now, compared with before?",
          "**Recovery.** How much was disputed, and how much came back as credit?",
        ],
      },
      {
        type: "p",
        text: "Roma is built for exactly these outcomes: cash back from invalid deductions, and 25+ hours a week freed from portal downloads and spreadsheets. Smash Kitchen recovered $23K with Roma. Results vary by brand, and the honest answer for yours depends on your channels and your history.",
      },
      {
        type: "callout",
        label: "Before you start",
        text: "Write down how many hours deductions take today. In three months, it’s the number you’ll want to compare against.",
      },

      { type: "h2", id: "getting-set-up", text: "Getting set up" },
      {
        type: "p",
        text: "Roma connects to the portals you already sell through, including UNFI, KeHE, Target and Walmart, and you’re live in 5 minutes with no ERP or IT project. Setup time varies by portal.",
      },
      {
        type: "p",
        text: `If that sounds like the week you want, [book 30 minutes with us](${DEMO_HREF}). We’ll show you your numbers.`,
      },
    ],
  },
];

/* ── Product figure data (illustrative) ───────────────────────────────── */

export const productFigures = {
  matching: {
    doc: "MCB backup",
    channel: "UNFI",
    id: "DED-24817",
    agreement: "Promo PA-0412 · Sep 1–30",
    columns: { item: "Item", period: "Ship date", qty: "Qty", amount: "Amount", status: "Status" },
    lines: [
      { item: "Oat Bar 12ct", period: "Sep 4", qty: 420, amount: 1764, status: "matched" as const },
      { item: "Oat Bar Mini", period: "Sep 11", qty: 456, amount: 912, status: "matched" as const },
      { item: "Granola 10oz", period: "Sep 18", qty: 480, amount: 1440, status: "matched" as const },
      { item: "Granola 10oz", period: "Oct 6", qty: 210, amount: 630, status: "recoverable" as const, note: "Outside promo dates" },
    ],
    statusLabel: { matched: "Matched", recoverable: "Recoverable" },
    totalLabel: "Recoverable",
  },
};

/* ── Helpers ──────────────────────────────────────────────────────────── */

const WPM = 220;

function plain(text: string) {
  return text.replace(/\*\*/g, "").replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");
}

function blockText(b: Block): string {
  switch (b.type) {
    case "ul":
    case "ol":
      return b.items.join(" ");
    case "table":
      return [b.caption, ...b.head, ...b.rows.flat()].join(" ");
    case "figure":
    case "product":
      return b.caption;
    case "callout":
      return `${b.label} ${b.text}`;
    default:
      return b.text;
  }
}

export function readMinutes(post: Post) {
  const words = post.body.map((b) => plain(blockText(b))).join(" ").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / WPM));
}

export function headingText(h: Heading) {
  return `${h.before}${h.accent}${h.after}`;
}

export function formatDate(iso: string) {
  return new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });
}

export function getPosts() {
  return [...POSTS].sort((a, b) => b.date.localeCompare(a.date));
}

export function getPost(slug: string) {
  return POSTS.find((p) => p.slug === slug);
}

/** Same category first, then newest, excluding the current post. */
export function getRelated(slug: string, n = 3) {
  const current = getPost(slug);
  return getPosts()
    .filter((p) => p.slug !== slug)
    .sort((a, b) => Number(b.category === current?.category) - Number(a.category === current?.category))
    .slice(0, n);
}

export function getToc(post: Post) {
  return post.body.flatMap((b) => (b.type === "h2" ? [{ id: b.id, text: b.text }] : []));
}
