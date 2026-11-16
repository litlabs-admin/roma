// FAQ — copy verbatim from runroma.com (FAQs section).

export const faqCopy = {
  label: "FAQs",
  // Two lines, revealed line by line (Fruitful lines-slide-up). One serif accent.
  lines: [{ text: "Questions?" }, { text: "Roma's already three steps ", accent: "ahead" }],
};

export type Faq = { q: string; a: string };

export const FAQS: Faq[] = [
  {
    q: "Does Roma replace my current accounting or ERP system?",
    a: "No. Roma works alongside your existing accounting stack. It captures and organizes your UNFI, KeHE and retailer deductions in one place, so your team has visibility without changing how you book or reconcile.",
  },
  {
    q: "Which distributors does Roma support?",
    a: "Roma is built for UNFI, KeHE, Target and Walmart remittances. It parses, standardizes retailer names, and organizes every deduction line item into a single, consistent view.",
  },
  {
    q: "Is my data secure?",
    a: "Yes. Your deduction and remittance data is handled with industry-standard security practices and is only accessible to your team.",
  },
  {
    q: "How long does it take to get started?",
    a: "Onboarding is fast. Once your remittance sources are connected, Roma generates live, organized deductions in minutes, not weeks.",
  },
  {
    q: "What kind of brands is Roma built for?",
    a: "Roma is designed for CPG food and beverage brands selling through UNFI, KeHE and major retailers, typically used by VP Finance, Controllers, and AR Managers who need clarity over distributor deductions.",
  },
  {
    q: "Can small teams use Roma, or is it only for larger brands?",
    a: "Both. Roma scales from emerging brands to established ones. The value is the same: every deduction, organized and visible in one place.",
  },
  {
    q: "How current is the data in Roma?",
    a: "Roma keeps your deductions up to date as new remittances come in, so you're always working from a live view rather than stale spreadsheets.",
  },
];
