// Copy for the homepage — sourced from "Messaging and Positioning – Roma.pdf".
// Keep copy here, not inside animation code (DESIGN.md §I.2).

// Hash targets are absolute ("/#…") so they also work from other routes (/platform).
export const navLinks = [
  { label: "How it works", href: "/platform" },
  { label: "Deduction management", href: "/#how-it-works" },
  { label: "Analytics", href: "#" },
  { label: "Accounting", href: "#" },
  { label: "Pricing", href: "#" },
];

export const hero = {
  announce: {
    long: "Good Day Chocolate recovered $53K in deductions",
    short: "Good Day Chocolate recovered $53K",
    href: "#",
  },
  // Rotating H1 (Different AI). First line is the SSR / SEO line.
  // `accent` marks the serif phrase (one per line).
  lines: [
    { before: "Stop writing off ", accent: "deductions", after: "." },
    { before: "Every invalid deduction, ", accent: "disputed", after: "." },
  ],
  lead: "Roma pulls every deduction from your distributor and retailer portals, matches it to your invoices and promos, and helps you dispute the invalid ones. Live in 5 minutes. No ERP or IT project.",
  primary: { label: "Book a demo", href: "#demo" },
  secondary: { label: "See how it works", href: "#how-it-works" },
};

// Brand statement after the hero (DESIGN.md §G.1b). ≤ 50 words, ≤ 4 highlights;
// highlights are money / outcome phrases only and reveal to Roma red.
export const statement = {
  label: "What Roma does",
  segments: [
    { text: "Every month, deductions from UNFI, KeHE and your retailers add up to" },
    { text: "2–3% of your revenue.", highlight: true },
    { text: "Many deductions are invalid, but nobody has time to check, so they get" },
    { text: "written off.", highlight: true },
    { text: "Roma matches" },
    { text: "every deduction", highlight: true },
    { text: "to your invoices and promos, so you can" },
    { text: "get back what’s yours.", highlight: true },
  ] as { text: string; highlight?: boolean }[],
};

export const trust = {
  labelMuted: "Recovering deductions for",
  label: "natural & specialty brands",
};

// Closing CTA + footer — copy and links from runroma.com.
export const closingCta = {
  heading: { before: "Visibility over every ", accent: "dollar", after: "." },
  sub: "See Roma in action. 5 minutes. No commitment.",
  cta: { label: "Book a demo", href: "#demo" },
};

export type FooterLink = { label: string; href: string; external?: boolean };

export const footer = {
  columns: [
    {
      title: "Resources",
      links: [
        { label: "How Roma works", href: "/platform" },
        { label: "Deduction management", href: "/deduction-management" },
        { label: "Analytics", href: "/analytics" },
        { label: "Accounting", href: "/accounting" },
        { label: "Pricing", href: "/pricing" },
        { label: "Deduction Codes", href: "/deduction-codes" },
        { label: "Blog", href: "/blogs" },
        { label: "FAQs", href: "/#faq" },
      ],
    },
    {
      title: "Legal",
      links: [
        { label: "Terms & conditions", href: "/terms-and-conditions" },
        { label: "Privacy policy", href: "/privacy-policy" },
      ],
    },
    {
      title: "Social",
      links: [{ label: "LinkedIn", href: "https://www.linkedin.com/company/runroma/", external: true }],
    },
  ] as { title: string; links: FooterLink[] }[],
  tagline: "The OS for CPG finance",
  copyright: "©2026 Alphastar Technologies Pvt. Ltd. All rights reserved.",
};
