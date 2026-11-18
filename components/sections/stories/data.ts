// Customer stories — layout from Hyperline's Testimonials, content for Roma.
//
// MOCK — replace before launch. Proof numbers ($53K Good Day Chocolate in 6 months,
// $23K Smash Kitchen, Jasen Arias / VP Ops & Growth) come from the
// positioning PDF; every QUOTE below is placeholder copy (the PDF has no written
// quotes) and the photos are Unsplash-licensed stand-ins, not the customers.

import { SIGNUP_HREF } from "@/components/chat/data";

export const storiesCopy = {
  heading: { before: "Trusted by 170+ brands that stopped writing off ", accent: "deductions", after: "." },
  lead: "From emerging natural brands to established CPG teams, finance leads use Roma across UNFI, KeHE and their retailers.",
  primary: { label: "Customer stories", href: "#" },
  secondary: { label: "Try now", href: SIGNUP_HREF },
};

export type Story = {
  brand: string;
  /** Single-ink alpha mask, rendered white. Omit to fall back to a wordmark. */
  logo?: { src: string; w: number; h: number };
  metric: string;
  quote: string;
  author: string;
  href: string;
  photo: { src: string; position: string; credit: string };
};

export const STORIES: Story[] = [
  {
    brand: "Good Day Chocolate",
    metric: "$53K recovered in 6 months",
    quote:
      "We were writing off UNFI and KeHE deductions because nobody had time to check them. Within six months on Roma we'd recovered $53K we would have written off.",
    author: "Jasen Arias, VP Ops & Growth @ Good Day Chocolate",
    href: "#",
    photo: {
      src: "/images/stories/mock-good-day-chocolate.webp",
      position: "50% 30%",
      credit: "Walter Otto on Unsplash (unsplash.com/photos/qJ249_JzEL0)",
    },
  },
  {
    brand: "Smash Kitchen",
    logo: { src: "/logos/customers/smash-kitchen.png", w: 176, h: 107 },
    metric: "$23K recovered",
    quote:
      "For the first time we could see every deduction next to its invoice and promo, and exactly which ones were wrong. We got $23K back.",
    author: "Finance lead @ Smash Kitchen",
    href: "#",
    photo: {
      src: "/images/stories/mock-smash-kitchen.webp",
      position: "40% 50%",
      credit: "Unsplash (unsplash.com/photos/y--Os1aj_EU)",
    },
  },
  {
    brand: "Mochidoki",
    logo: { src: "/logos/customers/mochidoki.png", w: 161, h: 38 },
    metric: "Live in 5 minutes",
    quote:
      "Setup took minutes, not weeks. Now one person handles deductions across every channel, and not a single spreadsheet.",
    author: "Operations @ Mochidoki",
    href: "#",
    photo: {
      src: "/images/stories/mock-mochidoki.webp",
      position: "48% 35%",
      credit: "Rifki Kurniawan on Unsplash (unsplash.com/photos/k63Or81F8-M)",
    },
  },
];
