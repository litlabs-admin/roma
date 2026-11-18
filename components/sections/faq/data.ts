// FAQ — runroma.com's questions, answers trimmed to 1–2 sentences (client: "a lot of
// words"), plus one question for Analytics + Accounting.

export const faqCopy = {
  label: "FAQs",
  // Two lines, revealed line by line (Fruitful lines-slide-up). One serif accent.
  lines: [{ text: "Questions?" }, { text: "Roma's already three steps ", accent: "ahead" }],
};

export type Faq = { q: string; a: string };

export const FAQS: Faq[] = [
  {
    q: "What does Roma do beyond disputes?",
    a: "It shows where every deduction goes by channel, type and promo, as a share of sales, and codes each remittance line to your GL so it’s ready for month-end.",
  },
  {
    q: "Does Roma replace my current accounting or ERP system?",
    a: "No. Roma works alongside your accounting stack and hands it coded, export-ready lines. You don’t change how you book or reconcile.",
  },
  {
    q: "Which distributors and retailers does Roma support?",
    a: "UNFI, KeHE, Target and Walmart today, with every deduction line standardized into one view.",
  },
  {
    q: "How long does it take to get started?",
    a: "Under 5 minutes. Connect your portals and your deductions start coming in. No ERP or IT project.",
  },
  {
    q: "Is my data secure?",
    a: "Yes. Roma is SOC 2 Type II and ISO 27001 compliant, your data is only accessible to your team, and it never trains our models.",
  },
  {
    q: "What kind of brands is Roma built for?",
    a: "Natural and specialty CPG brands selling through UNFI, KeHE and major retailers, usually run by a founder or a lean finance team.",
  },
  {
    q: "How current is the data in Roma?",
    a: "Roma updates as new remittances come in, so you work from a live view, not last month’s spreadsheet.",
  },
];
