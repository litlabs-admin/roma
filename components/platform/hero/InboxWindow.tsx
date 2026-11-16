import { inbox } from "@/lib/content/platform";
import { Glyph, RomaGlyph, SourcePill, StatusChip, TypeChip, money } from "@/components/platform/mock/kit";
import s from "./inbox.module.css";

/**
 * The hero's product window: Roma's deductions inbox. Real responsive HTML (rem, not
 * scaled), so it stays legible on phones; container queries drop columns as the
 * window narrows. Decorative (aria-hidden); the hero carries an sr-only summary.
 */
export default function InboxWindow() {
  const c = inbox.columns;
  return (
    <div className={s.window} aria-hidden="true">
      <div className={s.bar}>
        <span className={s.brand}>
          <RomaGlyph className={s.mark} />
        </span>
        <span className={s.scope}>
          {inbox.scope}
          <Glyph k="caret" />
        </span>
        <span className={s.tabs}>
          {inbox.tabs.map((t, i) => (
            <span key={t} className={`${s.tab} ${i === 0 ? s.tabActive : ""}`}>
              {t}
            </span>
          ))}
        </span>
        <span className={s.export}>
          <Glyph k="download" />
          Export
        </span>
      </div>

      <div className={s.tools}>
        <div className={s.search}>
          <span className={s.filters}>
            <Glyph k="filter" />
            Filters
            <Glyph k="caret" />
          </span>
          <span className={s.placeholder}>{inbox.search}</span>
        </div>
      </div>

      <div className={s.table}>
        <div className={`${s.row} ${s.head}`}>
          <span className={s.cId}>{c.id}</span>
          <span className={s.cDate}>{c.date}</span>
          <span className={s.cChannel}>{c.channel}</span>
          <span className={s.cType}>{c.type}</span>
          <span className={s.cRef}>{c.ref}</span>
          <span className={s.cStatus}>{c.status}</span>
          <span className={s.cAmount}>{c.amount}</span>
        </div>
        {inbox.rows.map((r) => (
          <div key={r.id} className={s.row} data-row>
            <span className={`${s.cId} ${s.id}`}>{r.id}</span>
            <span className={s.cDate}>{r.date}</span>
            <span className={s.cChannel}>
              <SourcePill>{r.channel}</SourcePill>
            </span>
            <span className={s.cType}>
              <TypeChip category={r.category}>{r.type}</TypeChip>
            </span>
            <span className={`${s.cRef} ${s.ref}`}>
              <Glyph k="link" className={s.refIcon} />
              {r.ref}
            </span>
            <span className={`${s.cStatus} ${s.swap}`}>
              <span data-status="final">
                <StatusChip kind={r.status}>{inbox.statusLabel[r.status]}</StatusChip>
              </span>
              <span className={s.pending} data-status="pending">
                <StatusChip kind="pending">{inbox.statusLabel.pending}</StatusChip>
              </span>
            </span>
            <span className={`${s.cAmount} ${s.amount} ${r.status === "recoverable" ? s.amountRec : ""}`} data-amount={r.status}>
              {money(r.amount)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
