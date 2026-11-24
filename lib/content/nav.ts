// Primary navigation (DESIGN.md §G.1): Platform · Solutions · Customers · Resources · Company.
// Platform and Customers are standalone links; the other three are dropdowns, each with one
// bento-style feature tile (order: `navOrder`). Built on the server (components/layout/Nav.tsx)
// and passed to the client bar as plain data, so blog and story content never ships in the
// client bundle. Every figure below comes from approved content, never typed in here.

import { competitors, compareHref } from "./compare";
import { getStory, storyHref } from "./customers";
import { getPosts, headingText, readMinutes } from "./blog";

export type NavIconKey =
  | "platform"
  | "deductions"
  | "analytics"
  | "accounting"
  | "compare"
  | "stories"
  | "blog"
  | "codes"
  | "faq"
  | "partners"
  | "contact"
  | "calculator"
  | "pricing";

export type NavItem = { label: string; href: string; desc: string; icon: NavIconKey };

/** Brand mark as the customer bento draws it: the logo (masked, white) or a serif wordmark. */
export type NavBrand = { name: string; logo?: { src: string; w: number; h: number } };

/**
 * Feature tile (DESIGN.md §G.1): the customer results bento's tile language (§G.15).
 * `photo` sits on an image under a warm scrim; `gradient` on Roma red + texture.
 */
export type NavFeature = {
  kind: "photo" | "gradient";
  image?: { src: string; position?: string };
  mark: { type: "brand"; brand: NavBrand } | { type: "roma" } | { type: "eyebrow"; text: string };
  /** Large figure, e.g. "$53K". */
  figure?: string;
  /** Under the figure, or the title when there's no figure. */
  label: string;
  meta?: string;
  href: string;
  /** Full sentence for screen readers (the tile is one link). */
  sr: string;
};

export type NavMenu = { label: string; items: NavItem[]; feature: NavFeature };

/** Top-level link with no dropdown. */
export type NavLink = { label: string; href: string };

export const navLinks: NavLink[] = [
  { label: "Platform", href: "/platform" },
  { label: "Customers", href: "/customers" },
  { label: "Pricing", href: "/pricing" },
];

/** Bar order by label: links and menus interleave (client, 20 Nov 2026). */
export const navOrder = ["Platform", "Solutions", "Customers", "Pricing", "Resources", "Company"];

/*
 * Story tile photos. Not the bento's images (customers page), on purpose.
 * Drop the files in public/images/nav/ and fill in the entry below; until then the tile
 * renders as the red gradient. Credits (Unsplash License):
 *   good-day.webp      <photographer>  unsplash.com/photos/<id>
 *   smash-kitchen.webp <photographer>  unsplash.com/photos/<id>
 */
const NAV_PHOTOS: Record<string, { src: string; position?: string } | undefined> = {
  "good-day-chocolate": undefined, // { src: "/images/nav/good-day.webp", position: "50% 50%" }
  "smash-kitchen": undefined, // { src: "/images/nav/smash-kitchen.webp", position: "50% 50%" }
};

function storyFeature(slug: string): NavFeature {
  const story = getStory(slug);
  if (!story) throw new Error(`nav: unknown story "${slug}"`);
  const m = story.metrics[0];
  const image = NAV_PHOTOS[slug];
  return {
    kind: image ? "photo" : "gradient",
    image,
    mark: { type: "brand", brand: { name: story.brand.name, logo: story.brand.logo } },
    figure: m.figure,
    label: m.label,
    href: storyHref(slug),
    sr: `${story.brand.name}: ${m.figure} ${m.label}. Read the story.`,
  };
}

function latestPostFeature(): NavFeature {
  const post = getPosts()[0];
  const title = headingText(post.title);
  return {
    kind: "photo",
    image: { src: post.cover.src },
    mark: { type: "eyebrow", text: `Latest · ${post.category}` },
    label: title,
    meta: `${readMinutes(post)} min read`,
    href: `/blogs/${post.slug}`,
    sr: `Latest post: ${title} Read the post.`,
  };
}

export const navMenus: NavMenu[] = [
  {
    label: "Solutions",
    items: [
      { label: "Deduction management", href: "/deduction-management", desc: "Every deduction from UNFI, KeHE and your retailers in one inbox.", icon: "deductions" },
      { label: "Analytics", href: "/analytics", desc: "See where deductions go by retailer, type and month.", icon: "analytics" },
      { label: "Accounting", href: "/accounting", desc: "Every remittance tied to its invoices, every line coded to your GL.", icon: "accounting" },
    ],
    feature: storyFeature("good-day-chocolate"),
  },
  {
    label: "Resources",
    items: [
      { label: "Deductions calculator", href: "/calculator", desc: "See what deductions cost you each year and what you could get back.", icon: "calculator" },
      { label: "Blog", href: "/blogs", desc: "Guides on deductions, retailers and trade spend.", icon: "blog" },
      { label: "Deduction codes", href: "/deduction-codes", desc: "Look up a retailer's deduction code and what it means.", icon: "codes" },
      { label: "FAQs", href: "/#faq", desc: "Quick answers on setup, retailers and security.", icon: "faq" },
      { label: "Compare all tools", href: "/compare", desc: "Roma and every alternative on the same eight questions.", icon: "compare" as const },
      ...competitors.map((c) => ({ label: `Roma vs. ${c.name}`, href: compareHref(c.slug), desc: c.blurb, icon: "compare" as const })),
    ],
    feature: latestPostFeature(),
  },
  {
    label: "Company",
    items: [
      { label: "Partners", href: "/partners", desc: "Bring deduction recovery to the brands you work with.", icon: "partners" },
      { label: "Contact us", href: "/contact", desc: "Questions about Roma? Talk to the team.", icon: "contact" },
    ],
    feature: storyFeature("smash-kitchen"),
  },
];
