// Copy, options and messages for /contact and /book-a-demo (DESIGN.md §G.12).
// /book-a-demo copy follows runroma.com's page (h1 + three benefit lines); the original
// embeds a HubSpot scheduler, ours is a form (client decision, Nov 2026).

import type { Heading } from "./platform";
import { LOGIN_HREF } from "@/components/chat/data";

export type Option = { value: string; label: string };

/** Valid ?topic= values for /contact (links like /contact?topic=partnerships). There is no
 *  topic field any more (client, Nov 2026); the value rides along in the payload. */
export const TOPICS: Option[] = [
  { value: "demo", label: "Book a demo" },
  { value: "pricing", label: "Pricing" },
  { value: "product", label: "Product question" },
  { value: "support", label: "Support" },
  { value: "partnerships", label: "Partnerships" },
  { value: "other", label: "Other" },
];

export const MESSAGE_MIN = 10;
export const MESSAGE_MAX = 2000;

/** Labels and placeholders shared by the contact, demo and partner forms. Contact and
 *  demo ask for these plus an optional message and consent (matches the HubSpot forms). */
export const fieldCopy = {
  name: { label: "Name", placeholder: "Jordan Alvarez" },
  email: { label: "Work email", placeholder: "jordan@yourbrand.com" },
  company: { label: "Company", placeholder: "Your brand" },
  jobTitle: { label: "Job title", placeholder: "Founder, Head of Finance…" },
  phone: { label: "Phone", placeholder: "555 123 4567", country: "Country code", search: "Search country or code" },
  message: { label: "Message", placeholder: "Anything you’d like us to know before we talk?" },
  consent: { before: "I agree to Roma’s ", link: "Privacy policy", href: "/privacy-policy", after: "." },
  required: "Required",
};

export const contactPage = {
  eyebrow: "Contact",
  heading: { before: "Let’s ", accent: "talk", after: "." } as Heading,
  lead: "Questions about Roma, pricing, support or partnerships? Leave your details and the right person will get back to you.",
  aside: [
    { title: "Prefer a walkthrough?", link: { label: "Book a demo", href: "/book-a-demo" } },
    { title: "Already a customer?", link: { label: "Log in", href: LOGIN_HREF } },
  ],
  formTitle: "Get in touch",
  formSub: "We reply within one business day.",
  submit: "Get in touch",
  success: {
    title: (name: string) => `Thanks, ${name}.`,
    body: "Your details are in. We’ll be in touch within one business day.",
    again: "Send another request",
  },
};

export const demoPage = {
  eyebrow: "Book a demo",
  heading: { before: "See what Roma can ", accent: "do", after: " for you." } as Heading,
  lead: "Book 30 minutes. We’ll show you your own numbers and answer your questions.",
  formTitle: "Book your demo",
  formSub: "Leave your details and we’ll set up a time that works.",
  submit: "Book my demo",
  success: {
    title: (name: string) => `Thanks, ${name}.`,
    body: "We’ll be in touch within one business day to schedule your demo.",
    again: "Book for someone else",
  },
};

export const formCopy = {
  summary: (n: number) => (n === 1 ? "Please fix 1 field below." : `Please fix ${n} fields below.`),
  sending: "Sending…",
  home: { label: "Back to home", href: "/" },
};
