import { solutionsScene as S } from "@/lib/content/partners";
import { Glyph, TypeChip, at, money } from "@/components/platform/mock/kit";
import a from "./art.module.css";
import c from "./scenes.module.css";

/**
 * Solutions scroll story scenes (DESIGN.md §G.16) on the DM journey's 560 × 460 canvas
 * (--u comes from the stage, components/product/deductions/journey.module.css). Each
 * scene is one client seen from a partner's seat: a client switcher in the corner, the
 * module's work, then one partner action. SSR = finished state; SolutionsStory builds
 * them from `data-ss` hooks. Fictional client; figures reconcile (lib/content/partners.ts).
 */

const pct = (n: number, total: number) => Math.round((n / total) * 100);

function ClientSwitcher() {
  const cl = S.client;
  return (
    <div className={`${a.paper} ${c.switcher}`} style={at(28, 22, 300, 46)} data-ss="switcher">
      <span className={a.mono}>{cl.label}</span>
      <span className={`${a.av} ${a.avDark}`}>{cl.initial}</span>
      <b className={c.clientName}>{cl.name}</b>
      <Glyph k="caret" className={c.caret} />
      <span className={c.others}>
        {cl.others.map((o) => (
          <span key={o} className={`${a.av} ${c.otherAv}`}>
            {o}
          </span>
        ))}
      </span>
    </div>
  );
}

/* ── 1 · Deduction management: invalid lines disputed, money back for the client ── */
export function DeductionsScene() {
  const d = S.deductions;
  return (
    <>
      <ClientSwitcher />
      <div className={`${a.paper} ${c.inbox}`} style={at(28, 84, 420, 300)} data-ss="paper">
        <div className={c.head}>
          <span className={a.mono}>{d.title}</span>
          <span className={c.count}>{d.rows.length} open</span>
        </div>
        {d.rows.map((r) => (
          <div key={r.id} className={`${c.row} ${r.invalid ? c.rowInvalid : ""}`} data-ss={r.invalid ? "rowBad" : "row"}>
            <span className={a.av}>{r.ch.charAt(0)}</span>
            <span className={c.rowText}>
              <b>{r.id}</b>
              <span>{r.ch}</span>
            </span>
            <TypeChip category={r.category}>{r.type}</TypeChip>
            <span className={c.amt}>{money(-r.amount)}</span>
            <span className={`${a.pill} ${r.invalid ? a.red : a.ok} ${c.status}`} data-ss={r.invalid ? "disputed" : "valid"}>
              {r.invalid ? "Disputed" : "Valid"}
            </span>
          </div>
        ))}
      </div>
      <div className={`${a.paper} ${c.toast}`} style={at(316, 330, 222, 100)} data-ss="toast">
        <span className={a.mono}>{d.recovered.label}</span>
        <b className={c.big}>{money(d.recovered.amount)}</b>
        <span className={c.note}>
          <Glyph k="check" />
          {d.recovered.note}
        </span>
      </div>
    </>
  );
}

/* ── 2 · Analytics: where the client's deductions went, shared as a monthly review ── */
export function AnalyticsScene() {
  const an = S.analytics;
  const max = Math.max(...an.bars.map((b) => b.amount));
  return (
    <>
      <ClientSwitcher />
      <div className={`${a.paper} ${c.chart}`} style={at(28, 84, 400, 292)} data-ss="paper">
        <div className={c.head}>
          <span className={a.mono}>{an.title}</span>
          <b className={c.total}>{money(an.total, false)}</b>
        </div>
        <div className={c.bars}>
          {an.bars.map((b) => (
            <div key={b.label} className={c.barRow}>
              <span className={c.barLabel}>{b.label}</span>
              <span className={c.track}>
                <span className={`${c.fill} ${c[b.category]}`} style={{ width: `${(b.amount / max) * 100}%` }} data-ss="bar" />
              </span>
              <span className={c.barAmt}>
                {money(b.amount, false)}
                <span>{pct(b.amount, an.total)}%</span>
              </span>
            </div>
          ))}
        </div>
      </div>
      <div className={`${a.paper} ${c.report}`} style={at(330, 300, 206, 118)} data-ss="toast">
        <span className={c.reportHead}>
          <Glyph k="file" />
          <b>{an.report.label}</b>
        </span>
        <span className={c.reportFrom}>
          <span className={`${a.av} ${a.avDark}`}>{an.report.from}</span>
          <Glyph k="arrow" className={c.reportArrow} />
          <span className={`${a.av} ${a.avDark}`}>{S.client.initial}</span>
        </span>
        <span className={`${a.pill} ${a.ok}`} data-ss="shared">
          <Glyph k="check" />
          {an.report.status}
        </span>
      </div>
    </>
  );
}

/* ── 3 · Accounting: each deduction gets its GL code, the remittance ties out, export ── */
export function AccountingScene() {
  const ac = S.accounting;
  return (
    <>
      <ClientSwitcher />
      <div className={`${a.paper} ${c.ledger}`} style={at(28, 84, 420, 300)} data-ss="paper">
        <div className={c.head}>
          <span className={a.mono}>{ac.title}</span>
        </div>
        {ac.lines.map((l) => (
          <div key={l.label} className={c.gRow} data-ss="row">
            <span className={c.gLabel}>{l.label}</span>
            <span className={c.amt}>{money(l.amount)}</span>
            <span className={`${c.gl}`} data-ss="gl">
              {l.gl}
            </span>
          </div>
        ))}
        <div className={c.foot} data-ss="foot">
          <span>
            Booked <b>{money(ac.booked)}</b>
          </span>
          <span className={c.diff}>
            Difference <b>{money(0)}</b>
          </span>
        </div>
      </div>
      <span className={c.stamp} style={at(44, 398)} data-ss="stamp">
        {ac.stamp}
      </span>
      <div className={`${a.paper} ${c.export}`} style={at(318, 372, 220, 52)} data-ss="toast">
        <span className={`${a.av} ${c.exportMark}`}>N</span>
        <b>{ac.export}</b>
        <Glyph k="check" className={c.exportCheck} />
      </div>
    </>
  );
}

export const SOLUTION_SCENES = [DeductionsScene, AnalyticsScene, AccountingScene];
