import type { Heading } from "@/lib/content/platform";
import type { ProductHeroCopy } from "@/lib/content/products";
import type { Faq } from "@/components/sections/faq/data";
import type { CriterionId } from "./types";
import { ROMA } from "./roma";

/**
 * The /compare hub (DESIGN.md §G.13a): one matrix, the same eight questions asked of
 * every brand. Roma's answers are approved copy (roma.ts guardrails apply: "0%
 * uncategorized", never an accuracy %; the user confirms every dispute; Auto Backup
 * Request is "New", no results quoted). Each competitor's answers live on its own data
 * file (`matrix`), read through `matrixCell` so they match its comparison page.
 *
 * Insights, First dispute and Scope appear on one page each, so they stay there.
 */

export type Criterion = {
  id: CriterionId;
  label: string;
  /** The buyer's question, under the label. */
  question: string;
  roma: { value: string; text: string; badge?: string };
};

export const CRITERIA: Criterion[] = [
  { id: "what", label: "What it is", question: "Software you run, or a service that runs it for you?", roma: { value: "Deduction software", text: "Deduction software your team runs" } },
  { id: "price", label: "Price", question: "Can you see the cost before the first call?", roma: { value: `${ROMA.price}/mo`, text: "From $399/month, flat and published" } },
  { id: "live", label: "Time to go live", question: "How soon are this quarter’s deductions in view?", roma: { value: ROMA.live, text: "Under 5 minutes, no ERP or IT project" } },
  { id: "disputes", label: "Who files disputes", question: "Does anything go out in your name without you?", roma: { value: "You confirm", text: "You confirm every dispute, then Roma files" } },
  { id: "classify", label: "Classification", question: "Is every deduction line named, so you can dispute it?", roma: { value: "0% uncategorized", text: "Every line gets a type, subtype and retailer" } },
  {
    id: "backups",
    label: "Backups",
    question: "Can you get the documents behind each deduction?",
    roma: { value: "1 zip per check", text: "Missing backups requested on day 3, then every 15 days", badge: "New" },
  },
  { id: "accounting", label: "Accounting", question: "Does it fit the books you already keep?", roma: { value: "NetSuite, QuickBooks", text: "Export to NetSuite, QuickBooks or CSV" } },
  { id: "security", label: "Security", question: "Is it independently audited?", roma: { value: "SOC 2 Type II", text: "SOC 2 Type II and ISO 27001" } },
];

/** The three criteria the hero sheet writes in (the ones that decide most comparisons). */
export const HERO_CRITERIA: CriterionId[] = ["price", "live", "disputes"];

export const NOT_PUBLISHED = "Not published";

export const compareHubCopy = {
  meta: {
    title: "Roma vs. deduction tools, compared | Roma",
    description:
      "Roma, Glimpse, Promomash, Vividly and Floret on the same eight questions: price, time to go live, who files disputes, classification, backups, accounting and security. Each company in its own words, with sources.",
  },
  hero: {
    eyebrow: "Compare",
    icon: "sort",
    heading: { before: "Every deduction tool, on the same ", accent: "questions", after: "." },
    lead: "Price, time to go live, who files disputes and five more, asked of Roma, Glimpse, Promomash, Vividly and Floret. Each answer is in the company’s own words, with its source.",
    ground: { src: "/images/cta/texture-bg.webp", position: "50% 50%" },
    summary:
      "A comparison sheet being filled in. Price: Roma from $399 a month; Glimpse a custom quote; Promomash priced on deduction volume; Vividly no prices published; Floret a free pilot, then a quote. Time to go live: Roma under 5 minutes; Glimpse 45 days; Promomash two to four months; Vividly as little as two weeks; Floret not published for deductions. Who files disputes: with Roma you confirm; Glimpse’s specialists; Promomash’s team; Vividly’s Auto Disputes and dispute service; Floret’s team, or you.",
  } satisfies ProductHeroCopy,
  matrix: {
    label: "Side by side",
    heading: { before: "Eight questions, five ", accent: "answers", after: "." } satisfies Heading,
    lead: "The same questions for every tool. Competitors’ answers are quoted from their own sites; the numbers open each source.",
    spotlight: "Compare Roma with",
    all: "All",
    corner: "Compared on",
    fit: { label: "Best fit if", question: "Each one has a buyer it suits best." },
    romaFit: "You want every deduction in view this week, a price on the page, and to approve each dispute yourself.",
    /** Competitor pages were checked 20 Nov; the matrix-only quotes 24 Nov 2026. */
    checked: "20–24 Nov 2026",
    full: (name: string) => `Read the full Roma vs. ${name} comparison`,
    fullShort: "Full comparison",
  },
  hub: {
    title: "Want the full story?",
    lead: "Each comparison goes deeper on what decides it, with its own sources.",
  },
};

export const compareHubFaqs: Faq[] = [
  {
    q: "Where does the competitor information come from?",
    a: "From each company’s own public website. We quote it directly, number every source, and print the date we last checked it. Roma’s answers are our own product facts.",
  },
  {
    q: "What does “Not published” mean?",
    a: "We looked on the company’s own site and couldn’t find a public statement on that question. It doesn’t mean they don’t offer it; ask them directly.",
  },
  {
    q: "Don’t see the tool you’re comparing?",
    a: "Tell us through our contact page and we’ll look at adding it, held to the same rule: only what the company says publicly, with its source.",
  },
  {
    q: "How often is this checked?",
    a: "Before launch and at every review. Products change; if something here is out of date, tell us and we’ll update it.",
  },
  {
    q: "Which tool fits a brand like mine?",
    a: "If you’d rather hand deductions off to a team, a managed service may suit you. If you want to see every deduction, approve each dispute and know your price up front, Roma is built for that. Book a demo and we’ll walk through your retailers.",
  },
];
