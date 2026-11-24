import type { Competitor } from "./compare/types";

/**
 * "Ask AI for more info" links (FAQ head on every page, plus the compare tables).
 * Each opens ChatGPT or Claude in a new tab with a page-specific question that names
 * runroma.com and links the page itself, so the answer starts from Roma's own words.
 */

export const SITE = "https://www.runroma.com";

const page = (path: string) => `${SITE}${path === "/" ? "" : path}`;

/** Keyed by pathname (usePathname). Paths not listed fall back to the home question. */
export const askAiPrompts: Record<string, string> = {
  "/": `What is Roma (runroma.com) and how does it help CPG brands track, dispute and account for retailer deductions from UNFI, KeHE and other retailers? Use ${page("/")} as a source.`,
  "/platform": `How does Roma (runroma.com) work end to end, from pulling deductions out of retailer portals to booking them in the ERP? Use ${page("/platform")} as a source.`,
  "/deduction-management": `How does Roma (runroma.com) help a CPG brand manage retailer deductions: collecting backup, finding invalid deductions and disputing them through to payment? Use ${page("/deduction-management")} as a source.`,
  "/analytics": `What can a CPG brand learn from Roma's deduction analytics (runroma.com), such as trade rate per retailer, deduction mix and deductions as a share of revenue? Use ${page("/analytics")} as a source.`,
  "/accounting": `How does Roma (runroma.com) handle deduction accounting: matching remittances to invoices, coding deductions to the GL and exporting to NetSuite or QuickBooks? Use ${page("/accounting")} as a source.`,
  "/pricing": `How is Roma (runroma.com) priced, and how do I work out whether it pays for itself in recovered deductions for my CPG brand? Use ${page("/pricing")} as a source.`,
  "/compare": `Compare Roma (runroma.com) with Glimpse, Promomash, Vividly and Floret for deduction management at a CPG brand. Which fits which kind of brand, and why? Use ${page("/compare")} as a source.`,
  "/partners": `What is Roma's partner program (runroma.com) and how do accountants, fractional CFOs, technology partners and investors work with Roma to help CPG brands recover deductions? Use ${page("/partners")} as a source.`,
  "/book-a-demo": `What should a CPG brand expect from a Roma (runroma.com) demo, and how quickly can it go live on deductions? Use ${page("/book-a-demo")} as a source.`,
  "/contact": `What is Roma (runroma.com), what does it do for CPG brands with retailer deductions, and how do I get in touch with the team? Use ${page("/contact")} as a source.`,
};

export const fallbackPrompt = askAiPrompts["/"];

export const promptFor = (pathname: string | null) => (pathname && askAiPrompts[pathname]) || fallbackPrompt;

export function compareAskPrompt(c: Pick<Competitor, "name" | "slug">) {
  return `Compare Roma (runroma.com) and ${c.name} for deduction management at a CPG brand. Which fits better, and why? Use ${page(`/compare/${c.slug}`)} as a source.`;
}

export type AskAiService = "chatgpt" | "claude";

export function askAiLinks(prompt: string): { id: AskAiService; name: string; href: string }[] {
  const q = encodeURIComponent(prompt);
  return [
    { id: "chatgpt", name: "ChatGPT", href: `https://chatgpt.com/?q=${q}` },
    { id: "claude", name: "Claude", href: `https://claude.ai/new?q=${q}` },
  ];
}
