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
  { label: "Pricing", href: "#" },
  { label: "Blog", href: "/blogs" },
];

export const hero = {
  announce: {
    long: "Good Day Chocolate recovered $53K in 6 months",
    short: "Good Day Chocolate recovered $53K",
    href: "#",
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
  lead: "Roma pulls every deduction from your distributor and retailer portals. See where the money went, dispute the invalid ones, and book the rest.",
  // PLG first (client, Nov 2026): Try now leads, demo is the secondary path.
  primary: { label: "Try now", href: SIGNUP_HREF },
  secondary: { label: "Book a demo", href: DEMO_HREF },
  micro: "Live in under 5 minutes. No ERP or IT project.",
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
  sub: "Connect a portal and see your own numbers in under 5 minutes. Or book 30 minutes and we’ll walk you through them.",
  cta: { label: "Try now", href: SIGNUP_HREF },
  secondary: { label: "Book a demo", href: DEMO_HREF },
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
  copyright: "©2026 Roma Technologies Inc. All rights reserved.",
};
