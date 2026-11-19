import type { Competitor } from "./types";
import { glimpse } from "./glimpse";
import { promomash } from "./promomash";
import { vividly } from "./vividly";
import { floret } from "./floret";

/** Every comparison page, in the order the "compare with others" cards list them. */
export const competitors: Competitor[] = [glimpse, promomash, vividly, floret];

export function getCompetitor(slug: string) {
  return competitors.find((c) => c.slug === slug);
}

export const compareHref = (slug: string) => `/compare/${slug}`;

/**
 * Footnote order for a page: the decision matrix first (its numbered source list sits
 * right under it, so 1…n read down the table), then sources cited only elsewhere
 * (verdict → stand-apart rows → who-does-what → price), then any listed but uncited.
 */
export function sourceOrder(c: Competitor): string[] {
  const seen: string[] = [];
  const add = (id?: string) => {
    if (id && c.sources[id] && !seen.includes(id)) seen.push(id);
  };
  c.matrix.rows.forEach((r) => add(r.them.source));
  c.verdict.tiles.forEach((t) => add(t.vs?.source));
  c.apart.rows.forEach((r) => add(r.them?.source));
  c.pen?.stages.forEach((s) => add(s.source));
  add(c.pen?.yourLane.source);
  add(c.price.quote.source);
  Object.keys(c.sources).forEach(add);
  return seen;
}
