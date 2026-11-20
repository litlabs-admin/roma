"use client";

import { Fragment, Suspense, useDeferredValue, useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { useSearchParams } from "next/navigation";
import {
  LIBRARY_ROWS,
  REGIONS,
  UNFI_FAMILIES,
  codeSets,
  codesCopy,
  parseCode,
  type CodeItem,
  type LibraryRow,
  type RetailerKey,
} from "@/lib/content/deductionCodes";
import { Glyph } from "@/components/platform/mock/kit";
import { prefersReducedMotion } from "@/lib/motion";
import b from "@/components/blog/blog.module.css";
import f from "@/components/forms/forms.module.css";
import c from "./codes.module.css";

/**
 * /deduction-codes library: lookup first. One search over every retailer, retailer
 * chips (with live match counts) to narrow it, and for UNFI a region + category filter.
 * UNFI's repeated meanings are one row each; their retailer → code pairs sit in a
 * panel that opens on click, or on its own when a search hits a code inside it.
 *
 * Pagination is visual: every row is in the HTML (the codes stay indexable and the
 * prerendered page lists them all); rows off the current page carry `hidden`.
 * State lives in the URL (?q, r, region, cat, page) so a lookup can be shared.
 */

type Filter = RetailerKey | "all";
type State = { q: string; r: Filter; region: string; cat: string; page: number };

const PAGE = 25;
const DEFAULT: State = { q: "", r: "all", region: "", cat: "", page: 1 };
const LABEL: Record<RetailerKey, string> = Object.fromEntries(codeSets.map((s) => [s.key, s.label])) as Record<RetailerKey, string>;
const PANEL_FILTER_MIN = 12;
const INLINE = 3;
const PANEL_PREVIEW = 24;

const shortRegion = (r: string) => r.replace(/^UNFI /, "").replace(/ Region$/, "");
const compact = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");
const literal = (code: string) =>
  parseCode(code)
    .map((v) => v.filter((p) => p.kind === "lit").map((p) => p.text).join(""))
    .map(compact);

function fromParams(sp: URLSearchParams | null): State {
  if (!sp) return DEFAULT;
  const r = sp.get("r");
  const page = Number(sp.get("page"));
  return {
    q: sp.get("q") ?? "",
    r: r && r in LABEL ? (r as RetailerKey) : "all",
    region: REGIONS.find((x) => x === sp.get("region")) ?? "",
    cat: UNFI_FAMILIES.find((x) => x.family === sp.get("cat"))?.family ?? "",
    page: Number.isInteger(page) && page > 1 ? page : 1,
  };
}

function toQuery(s: State): string {
  const p = new URLSearchParams();
  if (s.q.trim()) p.set("q", s.q.trim());
  if (s.r !== "all") p.set("r", s.r);
  if (s.r === "unfi" && s.region) p.set("region", s.region);
  if (s.r === "unfi" && s.cat) p.set("cat", s.cat);
  if (s.page > 1) p.set("page", String(s.page));
  const str = p.toString();
  return str ? `?${str}` : "";
}

// ── Matching ───────────────────────────────────────────────────────────────

type Hit = {
  row: LibraryRow;
  /** Items to list (all of them, or only the ones the search hit). */
  items: CodeItem[];
  /** The search hit codes inside the row rather than its meaning: open the panel. */
  byItem: boolean;
  score: number;
};

function matchRow(row: LibraryRow, q: string, region: string): Hit | null {
  const regionItems = region ? row.items.filter((i) => i.region === region) : row.items;
  if (!regionItems.length) return null;
  if (!q) return { row, items: regionItems, byItem: false, score: 0 };

  const lq = q.toLowerCase();
  const cq = compact(q);
  let best = 9;
  const hitItems = regionItems.filter((i) => {
    const code = i.code.toLowerCase();
    const lits = literal(i.code);
    let s = 9;
    if (cq && (lits.includes(cq) || compact(i.code) === cq)) s = 0;
    else if (cq && lits.some((l) => l.startsWith(cq))) s = 1;
    else if (code.includes(lq) || (cq.length > 1 && compact(i.code).includes(cq))) s = 2;
    else if (i.partner?.toLowerCase().includes(lq)) s = 3;
    best = Math.min(best, s);
    return s < 9;
  });

  const text = [row.description, row.category ?? "", LABEL[row.source], ...row.regions].join(" ").toLowerCase();
  const textHit = text.includes(lq);
  if (!hitItems.length && !textHit) return null;
  if (textHit) best = Math.min(best, 4);
  // A hit on the meaning shows the whole row; a hit on codes lists just those codes.
  const byItem = hitItems.length > 0 && !textHit;
  return { row, items: byItem ? hitItems : regionItems, byItem, score: best };
}

// ── Component ──────────────────────────────────────────────────────────────

export default function CodeLibrary() {
  return (
    <Suspense fallback={<Library sp={null} />}>
      <WithParams />
    </Suspense>
  );
}

function WithParams() {
  return <Library sp={useSearchParams()} />;
}

function Library({ sp }: { sp: URLSearchParams | null }) {
  const [state, setState] = useState<State>(() => fromParams(sp));
  const [open, setOpen] = useState<Record<string, boolean>>({});
  const written = useRef(toQuery(fromParams(sp)));
  const root = useRef<HTMLElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const status = useRef<HTMLParagraphElement>(null);
  const input = useRef<HTMLInputElement>(null);

  const q = useDeferredValue(state.q.trim());
  const set = (patch: Partial<State>) => {
    setState((s) => ({ ...s, page: 1, ...patch }));
    setOpen({});
  };

  // A link that changes the URL (the hero's retailer list) re-seeds the state.
  const spKey = sp?.toString() ?? "";
  useEffect(() => {
    if (!sp) return;
    const incoming = toQuery(fromParams(sp));
    if (incoming === written.current) return;
    written.current = incoming;
    setState(fromParams(sp));
    setOpen({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spKey]);

  // …and the state writes back to the URL, so the lookup can be shared.
  useEffect(() => {
    const qs = toQuery(state);
    if (qs === written.current) return;
    written.current = qs;
    window.history.replaceState(null, "", `${window.location.pathname}${qs}`);
  }, [state]);

  // "/" focuses the search from anywhere on the page.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "/" || e.metaKey || e.ctrlKey || e.altKey) return;
      const t = e.target as HTMLElement | null;
      if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return;
      e.preventDefault();
      input.current?.focus();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  // The sticky table head sits under the sticky search bar, whatever its height.
  useEffect(() => {
    const el = bar.current;
    const host = root.current;
    if (!el || !host) return;
    const ro = new ResizeObserver(() => host.style.setProperty("--bar-h", `${el.offsetHeight}px`));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Everything the search matches, before the retailer filter (for the chip counts).
  const matched = useMemo(() => {
    const out: Hit[] = [];
    LIBRARY_ROWS.forEach((row) => {
      const h = matchRow(row, q, "");
      if (h) out.push(h);
    });
    return out;
  }, [q]);

  const counts = useMemo(() => {
    const m: Record<Filter, number> = { all: 0, unfi: 0, kehe: 0, walmart: 0, target: 0 };
    matched.forEach((h) => {
      m[h.row.source] += h.items.length;
      m.all += h.items.length;
    });
    return m;
  }, [matched]);

  const hits = useMemo(() => {
    const out: Hit[] = [];
    LIBRARY_ROWS.forEach((row) => {
      if (state.r !== "all" && row.source !== state.r) return;
      if (state.r === "unfi" && state.cat && row.family !== state.cat) return;
      const h = matchRow(row, q, state.r === "unfi" ? state.region : "");
      if (h) out.push(h);
    });
    if (q) out.sort((a, z) => a.score - z.score);
    return out;
  }, [q, state.r, state.region, state.cat]);

  const codeCount = hits.reduce((n, h) => n + h.items.length, 0);
  const pages = Math.max(1, Math.ceil(hits.length / PAGE));
  const page = Math.min(state.page, pages);
  const from = (page - 1) * PAGE;
  const filtered = !!(q || state.r !== "all" || state.region || state.cat);

  const goTo = (p: number) => {
    setState((s) => ({ ...s, page: p }));
    const el = status.current;
    if (!el) return;
    const nav = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--nav-h")) * 16 || 72;
    const y = el.getBoundingClientRect().top + window.scrollY - nav - (bar.current?.offsetHeight ?? 0) - 16;
    if (window.scrollY > y) {
      const lenis = (window as unknown as { __lenis?: { scrollTo: (y: number, o?: object) => void } }).__lenis;
      if (lenis && !prefersReducedMotion()) lenis.scrollTo(y, { duration: 0.6 });
      else window.scrollTo({ top: y });
    }
    el.focus({ preventScroll: true });
  };

  const others = state.r !== "all" && q && !hits.length ? (Object.keys(LABEL) as RetailerKey[]).filter((k) => counts[k] > 0) : [];
  const { before, accent, after } = codesCopy.library.heading;

  return (
    <section ref={root} id="library" className={`${b.sheet} ${c.library}`} aria-labelledby="library-heading">
      <div className="container-lg">
        <div className={c.head}>
          <div className={c.headTitle}>
            <p className={`${b.sectionLabel} type-label`}>{codesCopy.library.label}</p>
            <h2 id="library-heading" className="type-h2">
              {before}
              <span className="accent">{accent}</span>
              {after}
            </h2>
          </div>
          <div className={c.headAside}>
            <p className={c.headLead}>{codesCopy.library.lead}</p>
            <p className={c.updated}>{codesCopy.updated}</p>
          </div>
        </div>

        {/* ── Controls ── */}
        <div ref={bar} className={c.bar}>
          <div className={c.searchRow}>
            <label className={c.search}>
              <span className="sr-only">Search deduction codes</span>
              <Glyph k="search" className={c.searchIcon} />
              <input
                ref={input}
                className={`${f.input} ${c.searchInput}`}
                type="search"
                inputMode="search"
                autoComplete="off"
                spellCheck={false}
                value={state.q}
                placeholder={codesCopy.placeholder}
                onChange={(e) => set({ q: e.target.value })}
                onKeyDown={(e) => {
                  if (e.key !== "Escape") return;
                  if (state.q) set({ q: "" });
                  else e.currentTarget.blur();
                }}
              />
              <kbd className={c.kbd} aria-hidden="true">
                /
              </kbd>
            </label>
          </div>

          <div className={c.chips} role="group" aria-label="Filter by retailer">
            {(["all", ...codeSets.map((s) => s.key)] as Filter[]).map((k) => {
              const set_ = k === "all" ? null : codeSets.find((s) => s.key === k)!;
              const logo = set_ ? { "--logo": `url(${set_.logo})`, "--ar": set_.ratio } : null;
              return (
                <button
                  key={k}
                  type="button"
                  className={c.chip}
                  aria-pressed={state.r === k}
                  onClick={() => set({ r: k, region: "", cat: "" })}
                  disabled={counts[k] === 0 && state.r !== k}
                >
                  {logo ? (
                    <>
                      <span className={c.chipLogo} style={logo as CSSProperties} aria-hidden="true" />
                      <span className="sr-only">{LABEL[k as RetailerKey]}</span>
                    </>
                  ) : (
                    "All retailers"
                  )}
                  <span className={c.chipCount}>{counts[k]}</span>
                </button>
              );
            })}
          </div>

          {state.r === "unfi" && (
            <div className={c.subFilters}>
              <div className={c.segment} role="group" aria-label="UNFI region">
                {["", ...REGIONS].map((r) => (
                  <button key={r || "all"} type="button" className={c.segBtn} aria-pressed={state.region === r} onClick={() => set({ region: r })}>
                    {r ? shortRegion(r) : "All regions"}
                  </button>
                ))}
              </div>
              <label className={c.selectWrap}>
                <span className="sr-only">UNFI category</span>
                <select className={`${f.input} ${c.select}`} value={state.cat} onChange={(e) => set({ cat: e.target.value })}>
                  <option value="">All categories</option>
                  {UNFI_FAMILIES.map((x) => (
                    <option key={x.family} value={x.family}>
                      {x.family} ({x.count})
                    </option>
                  ))}
                </select>
                <Glyph k="caret" className={c.selectCaret} />
              </label>
            </div>
          )}
        </div>

        {/* ── Status + legend ── */}
        <div className={c.statusRow}>
          <p ref={status} className={c.status} tabIndex={-1} aria-live="polite">
            {hits.length ? (
              <>
                <strong>{codeCount}</strong> {codeCount === 1 ? "code" : "codes"}
                {q ? (
                  <>
                    {" "}
                    match “{q}”
                  </>
                ) : null}
                {state.r !== "all" ? ` · ${LABEL[state.r]}` : ""}
                {pages > 1 ? ` · rows ${from + 1}–${Math.min(from + PAGE, hits.length)} of ${hits.length}` : ""}
              </>
            ) : (
              "No matching codes"
            )}
            {filtered && (
              <button type="button" className={c.clear} onClick={() => set({ ...DEFAULT })}>
                Clear filters
              </button>
            )}
          </p>
          <p className={c.legend}>
            <span className={c.ph}>invoice #</span> {codesCopy.legend}
          </p>
        </div>

        {/* ── Results ── */}
        {hits.length ? (
          <table className={c.table}>
            <caption className="sr-only">Deduction codes{state.r !== "all" ? ` for ${LABEL[state.r]}` : ""}</caption>
            <thead>
              <tr>
                <th scope="col" className={c.colCode}>
                  Code
                </th>
                <th scope="col">What it means</th>
                <th scope="col" className={c.colDetails}>
                  Details
                </th>
              </tr>
            </thead>
            <tbody>
              {hits.map((h, i) => (
                <ResultRow
                  key={h.row.id}
                  hit={h}
                  q={q}
                  showSource={state.r === "all"}
                  hidden={i < from || i >= from + PAGE}
                  open={open[h.row.id] ?? (h.byItem && h.items.length > INLINE)}
                  onToggle={(v) => setOpen((o) => ({ ...o, [h.row.id]: v }))}
                />
              ))}
            </tbody>
          </table>
        ) : (
          <div className={c.empty}>
            <p className={c.emptyTitle}>
              No {state.r !== "all" ? `${LABEL[state.r]} ` : ""}codes match{q ? ` “${q}”` : " these filters"}.
            </p>
            {others.length ? (
              <p>
                Found in{" "}
                {others.map((k, i) => (
                  <Fragment key={k}>
                    {i > 0 && ", "}
                    <button type="button" className={c.inlineBtn} onClick={() => set({ r: k, region: "", cat: "" })}>
                      {LABEL[k]} ({counts[k]})
                    </button>
                  </Fragment>
                ))}
                .
              </p>
            ) : (
              <p>Try a shorter part of the code (the letters after your invoice number), or a word from its meaning.</p>
            )}
            <button type="button" className={c.clearBtn} onClick={() => set({ ...DEFAULT })}>
              Clear search and filters
            </button>
          </div>
        )}

        {pages > 1 && <Pager page={page} pages={pages} onGo={goTo} />}
      </div>
    </section>
  );
}

// ── Row ────────────────────────────────────────────────────────────────────

function ResultRow({
  hit,
  q,
  showSource,
  hidden,
  open,
  onToggle,
}: {
  hit: Hit;
  q: string;
  showSource: boolean;
  hidden: boolean;
  open: boolean;
  onToggle: (v: boolean) => void;
}) {
  const { row, items, byItem } = hit;
  // Up to INLINE codes are listed in the cell; bigger groups preview two and open a panel.
  const group = row.items.length > INLINE;
  // A search that narrows a big group to a few codes lists them here too.
  const inline = !group || (byItem && items.length <= INLINE);
  const panelId = `panel-${row.id}`;
  const partners = new Set(items.map((i) => i.partner).filter(Boolean)).size;

  return (
    <>
      <tr className={c.row} hidden={hidden} data-open={open || undefined}>
        <th scope="row" className={c.codeCell}>
          {inline ? (
            <span className={c.groupCell}>
            <span className={c.preview}>
              {items.map((it, i) => (
                <span key={i} className={c.previewItem}>
                  <Code code={it.code} q={q} copy />
                  {it.partner && (group || items.length > 1) && <span className={c.previewPartner}>{hl(it.partner, q)}</span>}
                </span>
              ))}
            </span>
            {group && (
              <button type="button" className={c.groupBtn} aria-expanded={open} aria-controls={panelId} onClick={() => onToggle(!open)}>
                <span className={c.groupCount}>{open ? "Hide" : "All"}</span>
                <span className={c.groupHint}>{row.items.length} codes</span>
                <Glyph k="caret" className={c.caret} />
              </button>
            )}
            </span>
          ) : (
            <span className={c.groupCell}>
              {!open && (
                <span className={c.preview}>
                  {items.slice(0, 2).map((it, i) => (
                    <span key={i} className={c.previewItem}>
                      <Code code={it.code} q={q} />
                      {it.partner && <span className={c.previewPartner}>{hl(it.partner, q)}</span>}
                    </span>
                  ))}
                </span>
              )}
              <button type="button" className={c.groupBtn} aria-expanded={open} aria-controls={panelId} onClick={() => onToggle(!open)}>
                <span className={c.groupCount}>{open ? "Hide" : items.length > 2 ? `+${items.length - 2} more` : "Show all"}</span>
                <span className={c.groupHint}>
                  {byItem && items.length < row.items.length ? `${items.length} of ${row.items.length}` : `${row.items.length} codes`}
                </span>
                <Glyph k="caret" className={c.caret} />
              </button>
            </span>
          )}
        </th>
        <td className={c.meaning}>
          {row.category && <p className={c.category}>{hl(row.category, q)}</p>}
          <p className={c.desc}>{hl(row.description, q)}</p>
        </td>
        <td className={c.details}>
          <ul className={c.meta}>
            {showSource && <li className={c.source}>{LABEL[row.source]}</li>}
            {row.tone !== "neutral" && (
              <li className={c.tag} data-tone={row.tone}>
                {row.tone === "promo" ? "Promo & trade" : row.tone === "shortage" ? "Product & returns" : "Fees & compliance"}
              </li>
            )}
            {(byItem ? [...new Set(items.map((i) => i.region).filter((r): r is string => !!r))] : row.regions).map((r) => (
              <li key={r} className={c.region}>
                {hl(shortRegion(r), q)}
              </li>
            ))}
            {row.items.length === 1 && row.items[0].partner && <li className={c.partner}>{hl(row.items[0].partner, q)}</li>}
            {group && partners > 0 && (
              <li className={c.partner}>
                {partners} {partners === 1 ? "retailer" : "retailers"}
              </li>
            )}
          </ul>
        </td>
      </tr>
      {group && (
        <tr className={c.panelRow} hidden={hidden || !open}>
          <td colSpan={3} id={panelId}>
            <GroupPanel row={row} items={inline ? row.items : items} q={q} narrowed={!inline && byItem && items.length < row.items.length} />
          </td>
        </tr>
      )}
    </>
  );
}

function GroupPanel({ row, items, q, narrowed }: { row: LibraryRow; items: CodeItem[]; q: string; narrowed: boolean }) {
  const [all, setAll] = useState(false);
  const [full, setFull] = useState(false);
  const [local, setLocal] = useState("");
  const panel = useRef<HTMLDivElement>(null);
  const base = all ? row.items : items;
  const lq = local.trim().toLowerCase();
  const list = lq ? base.filter((i) => `${i.code} ${i.partner ?? ""}`.toLowerCase().includes(lq)) : base;
  const mixedRegions = row.regions.length > 1;
  const term = local.trim() || q;
  // No inner scroll box (it trapped the wheel): the list flows with the page and
  // shows PANEL_PREVIEW codes until "Show all". A filter always shows every match.
  const shown = full || lq ? list : list.slice(0, PANEL_PREVIEW);
  const rest = list.length - shown.length;

  const collapse = () => {
    setFull(false);
    const el = panel.current;
    if (!el) return;
    const nav = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--nav-h")) * 16 || 72;
    const top = el.getBoundingClientRect().top;
    if (top < nav) window.scrollTo({ top: top + window.scrollY - nav - 96 });
  };

  return (
    <div ref={panel} className={c.panel}>
      {(row.items.length > PANEL_FILTER_MIN || narrowed) && (
        <div className={c.panelHead}>
          {row.items.length > PANEL_FILTER_MIN && (
            <label className={c.panelSearch}>
              <span className="sr-only">Filter these codes by retailer or code</span>
              <Glyph k="filter" className={c.searchIcon} />
              <input
                className={`${f.input} ${c.panelInput}`}
                type="search"
                value={local}
                placeholder="Filter by retailer or code"
                onChange={(e) => setLocal(e.target.value)}
              />
            </label>
          )}
          {narrowed && (
            <button type="button" className={c.inlineBtn} onClick={() => setAll((v) => !v)}>
              {all ? `Show only the ${items.length} that match` : `Show all ${row.items.length} codes`}
            </button>
          )}
        </div>
      )}
      <ul className={c.items}>
        {shown.map((it, i) => (
          <li key={`${it.code}-${it.partner}-${i}`} className={c.item}>
            <span className={c.itemPartner}>
              {it.partner ? hl(it.partner, term) : "All retailers"}
              {mixedRegions && it.region && <span className={c.itemRegion}> · {shortRegion(it.region)}</span>}
            </span>
            <Code code={it.code} q={term} copy />
          </li>
        ))}
        {!list.length && <li className={c.itemEmpty}>Nothing in this group matches “{local}”.</li>}
      </ul>
      {(rest > 0 || (full && list.length > PANEL_PREVIEW && !lq)) && (
        <div className={c.panelFoot}>
          <button type="button" className={c.moreBtn} aria-expanded={full} onClick={() => (full ? collapse() : setFull(true))}>
            {full ? "Show fewer" : `Show all ${list.length} codes`}
            <Glyph k="caret" className={c.caret} />
          </button>
          {!full && <span className={c.moreHint}>{rest} more · or filter above</span>}
        </div>
      )}
    </div>
  );
}

// ── Code + copy ────────────────────────────────────────────────────────────

function Code({ code, q, copy }: { code: string; q: string; copy?: boolean }) {
  const variants = parseCode(code);
  const lines = code
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
  return (
    <span className={c.codeStack}>
      {variants.map((parts, i) => (
        <span key={i} className={c.codeLine}>
          <code className={c.code}>
            {parts.map((p, j) =>
              p.kind === "ph" ? (
                <span key={j} className={c.ph} title={`Changes per deduction: ${p.text}`}>
                  {p.text}
                </span>
              ) : (
                <span key={j} className={c.lit}>
                  {hl(p.text, q)}
                </span>
              ),
            )}
          </code>
          {copy && <CopyButton value={lines[i]} />}
        </span>
      ))}
    </span>
  );
}

function CopyButton({ value }: { value: string }) {
  const [done, setDone] = useState(false);
  useEffect(() => {
    if (!done) return;
    const t = setTimeout(() => setDone(false), 1400);
    return () => clearTimeout(t);
  }, [done]);
  return (
    <button
      type="button"
      className={c.copy}
      data-done={done || undefined}
      aria-label={done ? "Copied" : `Copy ${value}`}
      onClick={() => {
        navigator.clipboard?.writeText(value).then(() => setDone(true), () => {});
      }}
    >
      {done ? (
        <Glyph k="check" />
      ) : (
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M5.5 5.5h7v8h-7z" />
          <path d="M3.5 10.5v-8h7" />
        </svg>
      )}
      <span className={c.copyTip} aria-hidden="true">
        {done ? "Copied" : "Copy"}
      </span>
    </button>
  );
}

// ── Pager ──────────────────────────────────────────────────────────────────

function pageList(page: number, pages: number): (number | "…")[] {
  const set = new Set([1, pages, page - 1, page, page + 1]);
  const nums = [...set].filter((n) => n >= 1 && n <= pages).sort((a, z) => a - z);
  const out: (number | "…")[] = [];
  nums.forEach((n, i) => {
    if (i && n - nums[i - 1] > 1) out.push(n - nums[i - 1] === 2 ? n - 1 : "…");
    out.push(n);
  });
  return out;
}

function Pager({ page, pages, onGo }: { page: number; pages: number; onGo: (p: number) => void }) {
  return (
    <nav className={c.pager} aria-label="Code pages">
      <button type="button" className={c.pageStep} disabled={page === 1} onClick={() => onGo(page - 1)}>
        <Glyph k="arrow" className={c.flip} />
        <span>Previous</span>
      </button>
      <ol className={c.pageList}>
        {pageList(page, pages).map((n, i) =>
          n === "…" ? (
            <li key={`gap-${i}`} className={c.pageGap} aria-hidden="true">
              …
            </li>
          ) : (
            <li key={n}>
              <button
                type="button"
                className={c.pageNum}
                aria-current={n === page ? "page" : undefined}
                aria-label={`Page ${n}`}
                onClick={() => onGo(n)}
              >
                {n}
              </button>
            </li>
          ),
        )}
      </ol>
      <button type="button" className={c.pageStep} disabled={page === pages} onClick={() => onGo(page + 1)}>
        <span>Next</span>
        <Glyph k="arrow" />
      </button>
    </nav>
  );
}

// ── Highlight ──────────────────────────────────────────────────────────────

function hl(text: string, q: string): ReactNode {
  if (!q) return text;
  const re = new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "ig");
  const parts = text.split(re);
  if (parts.length === 1) return text;
  return parts.map((p, i) => (i % 2 ? <mark key={i}>{p}</mark> : p));
}
