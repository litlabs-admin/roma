// Deductions calculator (DESIGN.md §G.17): every input spec and line of copy in one place.
// Simplified per Roma's meeting, Nov 2026: revenue, valid deductions (%) and invalid
// deductions (%), both taken as a share of revenue. Change defaults here only.
// Revenue-first flow (Nov 2026): visitors give revenue only; the two rates start at the
// typical defaults below and sit behind "Fine-tune the rates".

import { SIGNUP_HREF, DEMO_HREF } from "@/components/chat/data";

export type InputKey = "R" | "v" | "i";

export type InputSpec = {
  key: InputKey;
  label: string;
  /** "money" ($) or "percent" (stored as 2.5 for 2.5%). */
  unit: "money" | "percent";
  def: number;
  min: number;
  max: number;
  step: number;
  /** Revenue spans four orders of magnitude, so its slider is logarithmic. */
  log?: boolean;
  hint?: string;
};

export const INPUTS: Record<InputKey, InputSpec> = {
  R: {
    key: "R",
    label: "Annual revenue",
    unit: "money",
    def: 10_000_000,
    min: 100_000,
    max: 1_000_000_000,
    step: 100_000,
    log: true,
    hint: "Type 10m or 10,000,000",
  },
  v: {
    key: "v",
    label: "Valid deductions, as a share of revenue",
    unit: "percent",
    def: 25,
    min: 0,
    max: 50,
    step: 0.5,
  },
  i: {
    key: "i",
    label: "Invalid deductions, as a share of revenue",
    unit: "percent",
    def: 10,
    min: 0,
    max: 50,
    step: 0.5,
  },
};

export const calcCopy = {
  meta: {
    title: "Deductions calculator | What are deductions costing you? | Roma",
    description: "Enter your annual revenue to see how much goes to valid and invalid deductions each year.",
  },
  heading: "What are deductions costing you?",
  lead: "One number. See how much of your revenue goes to deductions each year, and how much of it is invalid.",
  groupTitle: "Your numbers",
  ask: {
    label: "Start here",
    prompt: "What’s your brand’s annual revenue?",
    placeholder: "$10,000,000",
    hint: "Type 10m or 10,000,000, or pick one",
    readout: (v: string) => `That’s ${v} a year`,
    chips: [5_000_000, 25_000_000, 100_000_000, 500_000_000],
    chipsLabel: "Common revenue sizes",
    submit: "Calculate",
    empty: "Enter your annual revenue to see your numbers.",
    summaryBefore: "On",
    summaryAfter: "in annual revenue",
  },
  split: {
    label: "Where your revenue goes",
    kept: "Revenue you keep",
    valid: "Valid deductions",
    invalid: "Invalid deductions",
    total: "Total deductions per year",
  },
  fineTune: {
    toggle: "Fine-tune the rates",
    hide: "Hide the rates",
    help: "Based on typical rates. Know yours? Adjust them.",
    valid: "Valid deductions (% of revenue)",
    invalid: "Invalid deductions (% of revenue)",
  },
  results: {
    label: "Your estimate",
    headlineBefore: "",
    headlineAfter: "a year in invalid deductions",
    valid: "Valid deductions per year",
    invalid: "Invalid deductions per year",
    total: "Total deductions per year",
    flowLabel: "Of every deduction dollar",
    flowInvalid: "invalid",
    flowValid: "valid",
    disclaimer: "Estimate only, based on the numbers you entered. Results vary by brand.",
    copy: "Copy link",
    copied: "Link copied",
    sticky: "See results",
  },
  notes: {
    range: (min: string, max: string) => `Enter a value between ${min} and ${max}.`,
    fallback: (v: string) => `Using ${v}`,
    /** Shown live while the typed value can't be read (or a letter was typed). */
    format: {
      money: "Use numbers only, like 10m or 10,000,000.",
      percent: "Use numbers only, like 2.5 or 2.5%.",
    },
  },
  ctas: {
    demo: { label: "Book a demo", href: DEMO_HREF },
    try: { label: "Try now", href: SIGNUP_HREF },
  },
  compact: {
    label: "Deductions calculator",
    heading: "What are deductions costing you?",
    lead: "Enter your annual revenue. See what goes to deductions each year, and how much of it is invalid.",
    resultTail: "a year in invalid deductions",
    cta: "See the full breakdown",
  },
  banner: {
    heading: "What are deductions costing you?",
    sub: "Enter your annual revenue. See what you lose each year and how much of it is invalid.",
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
