// Copy, options and messages for /contact and /book-a-demo (DESIGN.md §G.12).
// /book-a-demo copy follows runroma.com's page (h1 + three benefit lines); the original
// embeds a HubSpot scheduler, ours is a form (client decision, Nov 2026).

import type { Heading } from "./platform";

export type Option = { value: string; label: string };

export const REVENUE: Option[] = [
  { value: "under-1m", label: "Under $1M" },
  { value: "1m-5m", label: "$1M–$5M" },
  { value: "5m-10m", label: "$5M–$10M" },
  { value: "10m-50m", label: "$10M–$50M" },
  { value: "50m-plus", label: "$50M+" },
];

export const TOPICS: Option[] = [
  { value: "demo", label: "Book a demo" },
  { value: "pricing", label: "Pricing" },
  { value: "product", label: "Product question" },
  { value: "support", label: "Support" },
  { value: "partnerships", label: "Partnerships" },
  { value: "other", label: "Other" },
];

export const VOLUME: Option[] = [
  { value: "under-50", label: "Under 50" },
  { value: "50-200", label: "50–200" },
  { value: "200-500", label: "200–500" },
  { value: "500-plus", label: "500+" },
  { value: "not-sure", label: "Not sure" },
];

export const CHANNELS = ["UNFI", "KeHE", "Target", "Walmart", "Costco", "Kroger", "Whole Foods", "Amazon", "Other"];

export const MESSAGE_MIN = 10;
export const MESSAGE_MAX = 2000;

/** Labels, hints and placeholders shared by both forms. */
export const fieldCopy = {
  firstName: { label: "First name", placeholder: "Jordan" },
  lastName: { label: "Last name", placeholder: "Alvarez" },
  email: { label: "Work email", placeholder: "jordan@yourbrand.com" },
  company: { label: "Company", placeholder: "Your brand" },
  jobTitle: { label: "Job title", placeholder: "Founder, Head of Finance…" },
  phone: { label: "Phone", placeholder: "555 123 4567", country: "Country code", search: "Search country or code" },
  revenue: { label: "Annual revenue", placeholder: "Choose a range" },
  channels: { label: "Channels you sell through", hint: "Choose all that apply." },
  otherChannels: { label: "Other channels", placeholder: "e.g. Sprouts, H-E-B" },
  topic: { label: "How can we help?", placeholder: "Choose a topic" },
  volume: { label: "Deductions per month", hint: "A rough number is fine.", placeholder: "Choose a range" },
  message: { label: "Message", placeholder: "Tell us a little about what you need." },
  demoMessage: { label: "Anything we should know?", hint: undefined as string | undefined, placeholder: "Your portals, your biggest deduction headache, anything." },
  consent: { before: "I agree to Roma’s ", link: "Privacy policy", href: "/privacy-policy", after: "." },
  required: "Required",
};

export const contactPage = {
  eyebrow: "Contact",
  heading: { before: "Let’s ", accent: "talk", after: "." } as Heading,
  lead: "Questions about Roma, pricing, support or partnerships? Send us a note and the right person will get back to you.",
  aside: [
    { title: "Prefer a walkthrough?", link: { label: "Book a demo", href: "/book-a-demo" } },
    { title: "Already a customer?", link: { label: "Log in", href: "#" } },
  ],
  formTitle: "Send us a message",
  formSub: "We reply within one business day.",
  submit: "Send message",
  success: {
    title: (name: string) => `Thanks, ${name}.`,
    body: "Your message is in. We’ll be in touch within one business day.",
    again: "Send another message",
  },
};

export const demoPage = {
  eyebrow: "Book a demo",
  heading: { before: "See what Roma can ", accent: "do", after: " for you." } as Heading,
  lead: "Schedule time with our team to see the platform in action. We’ll show you how it works on your own deductions and answer all your questions.",
  formTitle: "Book your demo",
  formSub: "Tell us a little about your brand and we’ll set up a time that works.",
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
