// Copy for the homepage — sourced from "Messaging and Positioning – Roma.pdf" and the
// client's website feedback (Nov 2026): three pillars (Analytics, Recovery, Accounting),
// Try now first, 170+ brands, no "Matched"/"Recoverable" claims.

// Keep copy here, not inside animation code (DESIGN.md §I.2).

import { DEMO_HREF, SIGNUP_HREF } from "@/components/chat/data";

// Hash targets are absolute ("/#…") so they also work from other routes (/platform).
export const navLinks = [
  { label: "How it works", href: "/platform" },
  { label: "Deduction management", href: "/deduction-management" },
  { label: "Analytics", href: "/analytics" },
  { label: "Accounting", href: "/accounting" },
  { label: "Blog", href: "/blogs" },
];

export const hero = {
  announce: {
    long: "Good Day Chocolate recovered $53K in 6 months",
    short: "Good Day Chocolate recovered $53K",
    href: "/customers#good-day-chocolate",
  },
  // Rotating H1 (Different AI). First line is the SSR / SEO line.
  // `accent` marks the serif phrase (one per line). The rotation walks the three
  // pillars (Analytics → Recovery → Accounting) and returns to the brand line.
  lines: [
    { before: "Every deduction, ", accent: "accounted for", after: "." },
    { before: "Every deduction, ", accent: "explained", after: "." },
    { before: "Every deduction, ", accent: "disputed", after: "." },
    { before: "Every deduction, ", accent: "booked", after: "." },
  ],
  lead: "Roma pulls every deduction from your retailer portals. See where the money went, dispute the invalid ones, and book the rest.",
  // PLG first (client, Nov 2026): Try now leads, demo is the secondary path.
  primary: { label: "Try now", href: SIGNUP_HREF },
  secondary: { label: "Book a demo", href: DEMO_HREF },
  micro: "Live in under 5 minutes.",
};

// Brand statement — no longer on the page (client: "a lot of words"); kept as the
// plain-language summary the Ask Roma knowledge base quotes. (DESIGN.md §G.1b) ≤ 50 words, ≤ 4 highlights;
// highlights are money / outcome phrases only and reveal to Roma red.
export const statement = {
  label: "What Roma does",
  segments: [
    { text: "Every month, deductions from your retailers add up to" },
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
  labelMuted: "Trusted by",
  label: "170+ CPG brands",
};

// Closing CTA + footer — copy and links from runroma.com.
export const closingCta = {
  heading: { before: "See where every deduction ", accent: "went", after: "." },
  sub: "Connect a portal and see your own numbers. Or book 30 minutes and we’ll walk you through them.",
  cta: { label: "Try now", href: SIGNUP_HREF },
  secondary: { label: "Book a demo", href: DEMO_HREF },
};

export type FooterLink = { label: string; href: string; external?: boolean };

export const footer = {
  // Brand block (left): the home hero's first line + the existing tagline.
  brand: {
    line: { before: "Every deduction, ", accent: "accounted for", after: "." },
    tagline: "The OS for CPG finance",
  },
  // Grouped by intent (client, 20 Nov 2026): what Roma does, what to read, how it
  // compares, how to reach us. Legal + social live in the bottom row.
  columns: [
    {
      title: "Product",
      links: [
        { label: "How Roma works", href: "/platform" },
        { label: "Deduction management", href: "/deduction-management" },
        { label: "Analytics", href: "/analytics" },
        { label: "Accounting", href: "/accounting" },
      ],
    },
    {
      title: "Resources",
      links: [
        { label: "Blog", href: "/blogs" },
        { label: "Deduction codes", href: "/deduction-codes" },
        { label: "FAQs", href: "/#faq" },
      ],
    },
    {
      title: "Compare",
      links: [{ label: "Roma vs. Glimpse", href: "/compare/glimpse" }],
    },
    {
      title: "Company",
      links: [
        { label: "Customer stories", href: "/customers" },
        { label: "Book a demo", href: "/book-a-demo" },
        { label: "Contact us", href: "/contact" },
        { label: "Log in", href: "https://app.runroma.com/", external: true },
      ],
    },
  ] as { title: string; links: FooterLink[] }[],
  legal: [
    { label: "Terms & conditions", href: "/terms-and-conditions" },
    { label: "Privacy policy", href: "/privacy-policy" },
  ] as FooterLink[],
  social: [{ label: "LinkedIn", href: "https://www.linkedin.com/company/runroma/", external: true }] as FooterLink[],
  tagline: "The OS for CPG finance",
  copyright: "©2026 Roma Technologies Inc. All rights reserved.",
};
