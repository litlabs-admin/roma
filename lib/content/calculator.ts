// Deductions calculator (DESIGN.md §G.17): every input spec, fixed assumption and line of
// copy in one place. Brief: "Roma website: ROI calculator and pricing brief", 20 Nov 2026,
// §2. Values marked `confirmed: false` are Roma's to sign off; change them here only.

import { SIGNUP_HREF, DEMO_HREF } from "@/components/chat/data";

export type InputKey = "R" | "d" | "i" | "c" | "h" | "w" | "n";

export type InputSpec = {
  key: InputKey;
  label: string;
  /** "money" ($), "percent" (stored as 2.5 for 2.5%), "hours", "count". */
  unit: "money" | "percent" | "hours" | "count";
  def: number;
  min: number;
  max: number;
  step: number;
  /** Revenue spans four orders of magnitude, so its slider is logarithmic. */
  log?: boolean;
  hint?: string;
  /** Where the default comes from (shown in "How we calculate"). */
  source?: string;
  confirmed: boolean;
};

/** Brief §2.2. */
export const INPUTS: Record<InputKey, InputSpec> = {
  R: {
    key: "R",
    label: "Annual revenue through retailers and distributors",
    unit: "money",
    def: 10_000_000,
    min: 100_000,
    max: 1_000_000_000,
    step: 100_000,
    log: true,
    hint: "Type 10m or 10,000,000",
    confirmed: true,
  },
  d: {
    key: "d",
    label: "Share of revenue lost to deductions",
    unit: "percent",
    def: 2.5,
    min: 0.1,
    max: 25,
    step: 0.1,
    source: "2 to 3% of revenue for many emerging CPG brands",
    confirmed: true,
  },
  i: {
    key: "i",
    label: "Share of deductions that are invalid",
    unit: "percent",
    def: 10,
    min: 0,
    max: 60,
    step: 1,
    source: "Industry surveys put the median at 5 to 10%",
    confirmed: false,
  },
  c: {
    key: "c",
    label: "Share of invalid deductions you recover today",
    unit: "percent",
    def: 10,
    min: 0,
    max: 100,
    step: 1,
    confirmed: false,
  },
  h: {
    key: "h",
    label: "Hours a week your team spends on deductions",
    unit: "hours",
    def: 10,
    min: 0,
    max: 168,
    step: 1,
    confirmed: true,
  },
  w: {
    key: "w",
    label: "Loaded hourly cost of that time",
    unit: "money",
    def: 50,
    min: 10,
    max: 500,
    step: 5,
    confirmed: false,
  },
  n: {
    key: "n",
    label: "Retailers and distributors you sell through",
    unit: "count",
    def: 2,
    min: 1,
    max: 50,
    step: 1,
    confirmed: true,
  },
};

/** Fixed assumptions (brief §2.3). Not user inputs. */
export const CONSTANTS = {
  /** Share of invalid deductions recovered with Roma. */
  r: { value: 0.7, confirmed: false },
  /** Time saved with Roma ("90% of your hours back", home and /deduction-management). */
  t: { value: 0.9, confirmed: true },
  /** Weeks per year. */
  W: { value: 52, confirmed: true },
  /** Roma monthly price used for ROI (the entry plan, /pricing). */
  P: { value: 399, confirmed: false },
  /** Stored on every submit so old leads can be re-read if the math changes. */
  v: { value: "calc-v1", confirmed: true },
} as const;

export const RETAILERS = ["UNFI", "KeHE", "Walmart", "Target", "Other"];

/** Gate form role options (brief §2.6). */
export const ROLES = [
  { value: "Founder", label: "Founder" },
  { value: "Finance or Accounting", label: "Finance or Accounting" },
  { value: "Operations", label: "Operations" },
  { value: "Sales", label: "Sales" },
  { value: "Other", label: "Other" },
];

/** Flagged (not blocked) on the gate form; client decision, 20 Nov 2026. */
export const FREE_EMAIL_DOMAINS = ["gmail.com", "yahoo.com", "outlook.com", "hotmail.com", "icloud.com"];

/** localStorage flag set after a successful submit (returning visitors skip the form). */
export const UNLOCK_KEY = "roma:calc-unlocked";

export const calcCopy = {
  meta: {
    title: "Deductions calculator | What are deductions costing you? | Roma",
    description:
      "Estimate how much your CPG brand loses to retailer deductions each year, how much is invalid, and what you could recover.",
  },
  heading: "What are deductions costing you?",
  lead: "Enter a few numbers. See how much you lose to deductions each year, how much is invalid, and what checking every one could bring back.",
  groups: {
    business: "Your business",
    deductions: "Your deductions",
    team: "Your team",
  },
  retailers: {
    label: "Where you sell",
    count: "Retailers and distributors",
    hint: "Pick the portals you use, then set the total.",
  },
  results: {
    label: "Your estimate",
    headline: (v: string) => `Up to ${v} a year back`,
    headlineShort: "a year back",
    deductions: "Deductions per year",
    invalid: "Invalid deductions per year",
    hours: "Hours saved per year",
    flowLabel: "Of every deduction dollar",
    flowInvalid: "invalid",
    flowValid: "valid",
    disclaimer: "Estimate only, based on your inputs and the assumptions shown. Results vary by brand. Not a guarantee of recovery.",
    copy: "Copy link",
    copied: "Link copied",
    sticky: "See breakdown",
  },
  gate: {
    title: "Your full breakdown",
    sub: "What checking every deduction adds up to, your ROI and payback, and the plan that fits.",
    cta: "Get my full report",
    lockedTag: "In your report",
    lockHint: "Fill in the form to unlock these five numbers. We’ll email them too.",
    lockHintMobile: "Tap “Get my full report” to unlock these five numbers.",
    formTitle: "Where should we send your report?",
    formSub: "We’ll email the full breakdown and a link back to these numbers.",
    submit: "Get my full report",
    sending: "Sending…",
    sent: (email: string) => `Report sent to ${email}`,
    error: "Something went wrong. Try again or book a demo.",
    freeEmail: "Please use your work email.",
    close: "Close",
    fields: {
      email: { label: "Work email", placeholder: "jordan@brand.com" },
      firstName: { label: "First name", placeholder: "Jordan" },
      company: { label: "Company", placeholder: "Brand Co." },
      role: { label: "Role", placeholder: "Choose your role" },
    },
    privacy: { before: "By sending, you agree to our ", link: "privacy policy", href: "/privacy-policy", after: "." },
  },
  breakdown: {
    gain: "Extra recovered with Roma",
    writeOff: "Written off today",
    time: "Value of time saved",
    roi: "Return on Roma",
    payback: "Payback",
    plan: "Suggested plan",
    planNote: (n: number) => `For ${n} ${n === 1 ? "retailer" : "retailers and distributors"}`,
    seePricing: "See pricing",
    longPayback: "More than 12 months",
    timeLed: "Most of your return is time. Roma gives your team back the hours spent chasing deductions.",
  },
  notes: {
    highD: "That is high. Check whether trade promotions are included.",
    fullC: "You already recover most invalid deductions. Roma saves your team time.",
    noHours: "No hours entered, so the estimate shows recovery only.",
    range: (min: string, max: string) => `Enter a value between ${min} and ${max}.`,
    fallback: (v: string) => `Using ${v}`,
    /** Shown live while the typed value can't be read (or a letter was typed). */
    format: {
      money: "Use numbers only, like 10m or 10,000,000.",
      percent: "Use numbers only, like 2.5 or 2.5%.",
      hours: "Use whole numbers only.",
      count: "Use whole numbers only.",
    },
  },
  ctas: {
    demo: { label: "Book a demo", href: DEMO_HREF },
    try: { label: "Try now", href: SIGNUP_HREF },
  },
  ledger: {
    label: "How we calculate",
    heading: { before: "Every number, ", accent: "shown", after: " line by line." },
    lead: "Your inputs, our assumptions and the math in between. Change an input above and every line here follows.",
    locked: "In your full report",
    assumptions: "Assumptions",
  },
  compact: {
    label: "Deductions calculator",
    heading: "What are deductions costing you?",
    pricingHeading: "Will Roma pay for itself?",
    result: "Up to",
    resultTail: "a year back",
    payback: "Pays for itself in",
    paybackTail: (plan: string, price: string) => `On the ${plan} plan at ${price}/month`,
    cta: "See full breakdown",
    estimate: "Estimate your return",
  },
  banner: {
    heading: "What are deductions costing you?",
    sub: "Three numbers. See what you lose each year and how much of it is invalid.",
    cta: "Open the calculator",
  },
  proof: {
    label: "From estimate to recovered",
    heading: { before: "What checking every deduction ", accent: "brought back", after: "." },
  },
  closing: {
    heading: { before: "Put real numbers ", accent: "behind", after: " the estimate." },
    sub: "Connect a portal and see your own deductions. Or book 30 minutes and we’ll walk you through them.",
    cta: { label: "Book a demo", href: DEMO_HREF },
    secondary: { label: "Try now", href: SIGNUP_HREF },
  },
};
