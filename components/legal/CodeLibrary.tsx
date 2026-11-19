"use client";

import { useMemo, useState } from "react";
import type { CodeSet, RetailerKey } from "@/lib/content/deductionCodes";
import a from "@/components/blog/article.module.css";
import f from "@/components/forms/forms.module.css";
import d from "./doc.module.css";

/**
 * /deduction-codes browser: one tab per retailer, a text filter, and a scrolling table
 * with a sticky head. Columns follow each retailer's source data (runroma.com library).
 */
export default function CodeLibrary({ sets }: { sets: CodeSet[] }) {
  const [key, setKey] = useState<RetailerKey>(sets[0].key);
  const [query, setQuery] = useState("");
  const set = sets.find((s) => s.key === key) ?? sets[0];

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return set.rows;
    return set.rows.filter((r) => set.columns.some((c) => (r[c.key] ?? "").toLowerCase().includes(q)));
  }, [set, query]);

  return (
    <div className={d.library}>
      <div className={d.controls}>
        <div className={d.tabs} role="group" aria-label="Retailer">
          {sets.map((s) => (
            <button key={s.key} type="button" className={d.tab} aria-pressed={s.key === key} onClick={() => setKey(s.key)}>
              {s.label}
              <span className={d.count}>{s.rows.length}</span>
            </button>
          ))}
        </div>
        <label className={d.search}>
          <span className="sr-only">Search {set.label} codes</span>
          <input className={f.input} type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder={set.placeholder} />
        </label>
      </div>

      <p className={d.status} aria-live="polite">
        {rows.length} of {set.rows.length} {set.label} codes
      </p>

      <div className={`${a.tableScroll} ${d.codeScroll}`} tabIndex={0} role="region" aria-label={`${set.label} deduction codes`}>
        <table className={`${a.table} ${d.codeTable}`}>
          <thead>
            <tr>
              {set.columns.map((c) => (
                <th key={c.key} scope="col" className={c.wide ? d.wide : undefined}>
                  {c.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={`${key}-${i}`}>
                {set.columns.map((c, j) =>
                  j === 0 ? (
                    <th key={c.key} scope="row" className={d.code}>
                      {r[c.key]}
                    </th>
                  ) : (
                    <td key={c.key}>{r[c.key] ?? "—"}</td>
                  ),
                )}
              </tr>
            ))}
            {!rows.length && (
              <tr>
                <td colSpan={set.columns.length}>No codes match “{query}”.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
