import type { Competitor, CriterionId, Source } from "./types";
import { CRITERIA, NOT_PUBLISHED } from "./criteria";
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

export type ResolvedCell = { value: string; text?: string; source?: { id: string; src: Source } };

/**
 * One competitor's answer to one /compare criterion (DESIGN.md §G.13a). A cell tied to a
 * comparison-table row takes that row's words and source verbatim, so the matrix can't
 * drift from the page; a row that no longer exists fails the build.
 */
export function matrixCell(c: Competitor, id: CriterionId): ResolvedCell {
  const cell = c.matrix[id];
  let claim = cell.them;
  if (cell.row) {
    const row = c.table.rows.find((r) => r.label === cell.row);
    if (!row) throw new Error(`compare/${c.slug}: matrix.${id} points at table row "${cell.row}", which doesn't exist`);
    claim = row.them;
  }
  if (!claim) {
    if (cell.value !== NOT_PUBLISHED) throw new Error(`compare/${c.slug}: matrix.${id} has no words or source; use "${NOT_PUBLISHED}"`);
    return { value: cell.value };
  }
  const sid = claim.source;
  const src = sid ? (c.sources[sid] ?? c.matrixSources?.[sid]) : undefined;
  if (sid && !src) throw new Error(`compare/${c.slug}: matrix.${id} cites unknown source "${sid}"`);
  return { value: cell.value, text: claim.text, source: sid && src ? { id: sid, src } : undefined };
}

/**
 * Footnote numbers for the /compare matrix: down each competitor's column in criteria
 * order, competitors in registry order, so 1…n read column by column. Keyed `slug:id`.
 */
export function matrixSourceOrder(): { key: string; c: Competitor; id: string; src: Source }[] {
  const out: { key: string; c: Competitor; id: string; src: Source }[] = [];
  competitors.forEach((c) =>
    CRITERIA.forEach(({ id }) => {
      const s = matrixCell(c, id).source;
      const key = s && `${c.slug}:${s.id}`;
      if (s && key && !out.some((o) => o.key === key)) out.push({ key, c, id: s.id, src: s.src });
    }),
  );
  return out;
}
