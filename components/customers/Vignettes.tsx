import type { ComponentType, CSSProperties } from "react";
import { vignettes, type StartKey } from "@/lib/content/customers";
import { Glyph, TypeChip, money, at } from "@/components/platform/mock/kit";
import v from "./vignettes.module.css";

/**
 * The three starting points as paper vignettes on a 560 × 420 canvas (`--u = 100cqw /
 * 560`), in the /platform illustration language: raised paper, tilt, mono labels
 * (DESIGN.md §G.9, §G.15). Markup is each vignette's final state; StartingPoints plays
 * its one state change (`data-vg` hooks). Decorative: the panel text says the same.
 */

const R = vignettes.remit;
// Where each deduction lands in the tray (canvas units). The travel from its paper row
// is measured at runtime (StartingPoints), so the two never drift apart.
const LAND = [
  { x: 316, y: 302, r: -5 },
  { x: 350, y: 342, r: -2 },
  { x: 436, y: 306, r: 4 },
];

function Remit() {
  return (
    <div className={v.canvas}>
      <div className={`${v.paper} ${v.remit}`} style={at(22, 22, 284)}>
        <p className={v.paperHead}>
          <b>{R.head}</b>
          <span className={v.mono}>{R.date}</span>
        </p>
        <p className={v.colHead}>
          <span>Invoice</span>
          <span>Paid</span>
        </p>
        {R.invoices.map((r) => (
          <p key={r.ref} className={v.line}>
            <span>{r.ref}</span>
            <span>{money(r.amount)}</span>
          </p>
        ))}
        <p className={v.colHead}>
          <span>Deductions</span>
        </p>
        {R.deductions.map((d) => (
          <p key={d.ref} className={`${v.line} ${v.ghost}`} data-vg="ghost">
            <span>{d.ref}</span>
            <span>{money(-d.amount)}</span>
          </p>
        ))}
        <p className={v.net}>
          <span>Net paid</span>
          <b>{money(R.net)}</b>
        </p>
      </div>

      <div className={v.tray} style={at(300, 284, 236, 128)}>
        <span className={v.trayLabel}>{R.tray}</span>
      </div>
      {R.deductions.map((d, i) => {
        const land = LAND[i];
        const style = { ...at(land.x, land.y), "--r": `${land.r}deg` } as CSSProperties;
        return (
          <span key={d.ref} className={v.slip} style={style} data-vg="slip" data-r={land.r}>
            <TypeChip category={d.type}>{d.label}</TypeChip>
            <b>{money(-d.amount, false)}</b>
          </span>
        );
      })}
      <span className={v.stamp} style={at(372, 240)} data-vg="stamp">
        {R.stamp}
      </span>
    </div>
  );
}

const S = vignettes.sheet;

function Sheet() {
  return (
    <div className={v.canvas}>
      <div className={`${v.paper} ${v.sheet}`} style={at(26, 30, 508, 300)}>
        <p className={v.sheetBar}>
          <span className={v.dots} aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          <span className={v.file}>{S.file}</span>
        </p>
        <div className={v.grid}>
          <p className={`${v.gridRow} ${v.gridHead}`}>
            <span className={v.rowNo} />
            {S.cols.map((c) => (
              <span key={c}>{c}</span>
            ))}
          </p>
          {S.rows.map((row, i) => (
            <p key={i} className={v.gridRow} data-vg="row">
              <span className={v.rowNo}>{i + 2}</span>
              {row.map((cell, j) => (
                <span key={j} className={j === 5 && cell ? (cell === "disputed" ? v.cellOk : v.cellQ) : j === 4 && cell === "chase POD" ? v.cellWarn : ""}>
                  {cell}
                </span>
              ))}
            </p>
          ))}
        </div>
      </div>
      <p className={v.note} style={at(334, 236, 186, 118)} data-vg="note">
        {S.note}
      </p>
      <span className={v.edited} style={at(40, 352)} data-vg="edited">
        <Glyph k="history" />
        {S.edited}
      </span>
    </div>
  );
}

const B = vignettes.books;

function Books() {
  return (
    <div className={v.canvas}>
      <div className={`${v.paper} ${v.journal}`} style={at(48, 26, 380)}>
        <p className={v.paperHead}>
          <b>{B.head}</b>
          <span className={v.mono}>JE-1048</span>
        </p>
        <p className={v.colHead}>
          <span>Account · memo</span>
          <span>Debit</span>
        </p>
        {B.lines.map((l) => (
          <p key={l.memo} className={v.jLine} data-vg="jline">
            <span>
              <b>{B.account}</b>
              <small>{l.memo}</small>
            </span>
            <span>{money(l.amount)}</span>
          </p>
        ))}
        <p className={v.jTotal} data-vg="jtotal">
          <span>Total · one account</span>
          <b>{money(B.total)}</b>
        </p>
        <p className={v.postedRow}>
          <span className={v.posted} data-vg="posted">
            Posted
          </span>
        </p>
      </div>
      {/* pencil note in the margin, crossed out */}
      <div className={v.pencil} style={at(430, 164, 120, 80)} data-vg="pencil">
        <span>{B.note}</span>
        <svg viewBox="0 0 120 80" aria-hidden="true">
          <path d="M8 44 C36 34 70 42 108 30" data-vg="strike" />
          <path d="M-22 84 C-10 76 -2 66 6 54" data-vg="arrow" />
        </svg>
      </div>
    </div>
  );
}

export const VIGNETTES: Record<StartKey, ComponentType> = { ignored: Remit, sheet: Sheet, books: Books };
