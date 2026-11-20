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
 * Footnote order for a page: the comparison table first (its numbered source list sits
 * right under it, so 1…n read down the table), then sources cited only in the page's
 * own story sections, then any listed but uncited.
 */
export function sourceOrder(c: Competitor): string[] {
  const seen: string[] = [];
  const add = (id?: string) => {
    if (id && c.sources[id] && !seen.includes(id)) seen.push(id);
  };
  c.table.rows.forEach((r) => add(r.them.source));
  const st = c.story;
  if (st.kind === "glimpse") {
    add(st.work.them.source);
    st.pen.stages.forEach((s) => add(s.source));
    add(st.pen.yourLane.source);
  } else if (st.kind === "promomash") {
    st.terms.clauses.forEach((cl) => add(cl.source));
    add(st.scope.source);
  } else if (st.kind === "vividly") {
    st.scope.stages.forEach((s) => add(s.source));
    st.gate.stations.forEach((s) => add(s.them.source));
  } else {
    st.qa.questions.forEach((q) => q.them.forEach((cl) => add(cl.source)));
    add(st.alike.quote.source);
  }
  Object.keys(c.sources).forEach(add);
  return seen;
}
