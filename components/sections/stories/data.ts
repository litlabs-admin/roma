// Customer stories — layout from Hyperline's Testimonials, content for Roma.
//
// The three cards are the real-figure brands from lib/content/customers.ts (the single
// source for this section, /customers and /customers/[slug]); see that file for what
// is sourced and what is MOCK.

import { SIGNUP_HREF } from "@/components/chat/data";
import { CUSTOMER_STORIES, pillText, storyHref } from "@/lib/content/customers";

export const storiesCopy = {
  heading: { before: "Brands that stopped writing off ", accent: "deductions", after: "." },
  lead: "From emerging natural brands to established CPG teams, finance leads use Roma across UNFI, KeHE and their other retailers.",
  cta: { label: "Try now", href: SIGNUP_HREF },
  more: { label: "Read their stories", href: "/customers" },
};

export type Story = {
  id: string;
  href: string;
  brand: string;
  /** Single-ink alpha mask, rendered white. Omit to fall back to a wordmark. */
  logo?: { src: string; w: number; h: number };
  metric: string;
  quote: string;
  author: string;
  photo: { src: string; position: string; credit: string };
};

const HOME_SLUGS = ["good-day-chocolate", "smash-kitchen", "mochidoki"];

export const STORIES: Story[] = HOME_SLUGS.map((slug) => {
  const st = CUSTOMER_STORIES.find((c) => c.slug === slug)!;
  const who = st.quote.name ? `${st.quote.name}, ${st.quote.role}` : st.quote.role;
  return {
    id: st.slug,
    href: storyHref(st.slug),
    brand: st.brand.name,
    logo: st.brand.logo,
    metric: pillText(st),
    quote: st.quote.text,
    author: `${who} @ ${st.brand.name}`,
    photo: st.photo,
  };
});
