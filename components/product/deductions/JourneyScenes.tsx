import { journey as J } from "@/lib/content/products";
import { Glyph, TypeChip, at, money } from "@/components/platform/mock/kit";
import c from "./scenes.module.css";

/**
 * The three journey scenes on a 560 × 460 canvas (--u = 1/560 of the stage width),
 * in the home machine cards' language: tinted well, raised paper, tilt and layering.
 * SSR = each scene's finished state; Journey.tsx builds them from `data-jr` hooks.
 */

const initial = (s: string) => s.charAt(0);

/* ── 1 · Inbox: filtered to UNFI, saved view, export menu ─────────────── */
export function InboxScene() {
  const i = J.inbox;
  return (
    <>
      <div className={`${c.paper} ${c.inbox}`} style={at(36, 44, 420, 372)} data-jr="paper">
        <div className={c.inboxHead}>
          <span className={c.mono}>Inbox</span>
          <span className={c.view} data-jr="view">
            <Glyph k="bookmark" />
            {i.view}
          </span>
        </div>
        <div className={c.tabs}>
          <span className={c.tabPill} data-jr="tabPill" />
          {i.tabs.map((t, n) => (
            <span key={t} className={`${c.tab} ${n === 1 ? c.tabOn : ""}`} data-jr={`tab${n}`}>
              {t}
            </span>
          ))}
        </div>
        <div className={c.rows}>
          {i.rows.map((r) => (
            <div key={r.id} className={`${c.irow} ${r.ch === "UNFI" ? "" : c.dim}`} data-jr={r.ch === "UNFI" ? "rowOn" : "rowOff"}>
              <span className={c.av}>{initial(r.ch)}</span>
              <span className={c.irowText}>
                <b>{r.id}</b>
                <span>{r.ch}</span>
              </span>
              <TypeChip category={r.category}>{r.type}</TypeChip>
              <span className={c.irowAmt}>{money(-r.amount)}</span>
            </div>
          ))}
        </div>
      </div>

      <div className={`${c.paper} ${c.menu}`} style={at(356, 286, 180, 156)} data-jr="menu">
        <span className={c.menuTitle}>
          <Glyph k="export" />
          Export 2 deductions
        </span>
        {i.exports.map((x, n) => (
          <span key={x} className={`${c.menuItem} ${n === 1 ? c.menuOn : ""}`} data-jr="menuItem">
            <span className={c.menuIc}>{x.charAt(0)}</span>
            {x}
            {n === 1 && <Glyph k="check" className={c.menuCheck} />}
          </span>
        ))}
      </div>
    </>
  );
}

/* ── 2 · Backup: the chargeback report read line by line ──────────────── */
export function BackupScene() {
  const b = J.backup;
  const total = b.lines.reduce((a, l) => a + l.amount, 0);
  return (
    <>
      <div className={c.docTilt} style={at(282, 34, 250, 392)} data-jr="doc">
        <div className={`${c.paper} ${c.pdf}`}>
          <div className={c.pdfBar}>
            <i />
            <i />
            <i />
            <span>{b.doc.file}</span>
          </div>
          <div className={c.pdfBody}>
            <span className={c.pdfRegion}>{b.doc.region}</span>
            <span className={c.pdfTitle}>{b.doc.title}</span>
            <span className={c.pdfWeek}>{b.doc.week}</span>
            <div className={c.pdfRule} />
            <span className={c.scan} data-jr="scan" />
            {b.lines.map((l) => (
              <div key={l.item + l.store} className={c.pdfLine} data-jr="pdfLine">
                <i className={c.mark} data-jr="mark" />
                <span className={c.pdfStore}>{l.store}</span>
                <span className={c.pdfItem}>
                  {l.item} · {l.qty}
                </span>
                <span className={c.pdfAmt}>{l.amount.toFixed(2)}</span>
              </div>
            ))}
            {[0, 1, 2, 3].map((n) => (
              <div key={n} className={c.pdfFiller}>
                <i style={{ width: `${62 - n * 9}%` }} />
                <i style={{ width: "14%" }} />
              </div>
            ))}
            <div className={c.pdfTotal}>
              <span>Customer total</span>
              <b>{total.toFixed(2)}</b>
            </div>
          </div>
        </div>
      </div>

      <div className={`${c.paper} ${c.ded}`} style={at(26, 58, 278, 360)} data-jr="ded">
        <div className={c.dedHead}>
          <span className={`${c.av} ${c.avRed}`}>K</span>
          <span className={c.dedTitle}>
            <b>Shortage · KeHE</b>
            <span>DED-24818 · Jul 28</span>
          </span>
          <span className={c.dedAmt}>{money(-1284.5)}</span>
        </div>
        <span className={c.mono}>Backup lines · 3 extracted</span>
        <div className={c.xlines}>
          {b.lines.map((l) => (
            <div key={l.item + l.store} className={c.xline} data-jr="xline">
              <span>{l.item}</span>
              <span className={c.xqty}>{l.qty}</span>
              <b>{money(-l.amount)}</b>
            </div>
          ))}
        </div>
        <div className={c.fields}>
          <span className={c.field}>
            <span className={c.mono}>Reason</span>
            <span className={`${c.tag} ${c.tagShort}`} data-jr="reason">
              <Glyph k="tag" />
              {b.reason}
            </span>
          </span>
          <span className={c.field}>
            <span className={c.mono}>Assignee</span>
            <span className={c.assignee} data-jr="assignee">
              <span className={c.avSm}>{b.assignee}</span>
              {b.assigneeName}
            </span>
          </span>
        </div>
        <div className={c.verdict}>
          <span className={c.vBtn}>
            <Glyph k="check" />
            Valid
          </span>
          <span className={`${c.vBtn} ${c.vInvalid}`}>
            <span className={c.vFill} data-jr="vFill" />
            <span className={c.vLabel}>× Invalid</span>
          </span>
        </div>
      </div>
    </>
  );
}

/* ── 3 · Dispute: filed with the backup, tracked to paid back ─────────── */
export function DisputeScene() {
  const d = J.dispute;
  return (
    <>
      <div className={`${c.paper} ${c.form}`} style={at(26, 30, 300, 400)} data-jr="form">
        <div className={c.formHead}>
          <b>Dispute deduction</b>
          <span className={c.close}>×</span>
        </div>
        <div className={c.summary}>
          {[
            ["Customer", d.channel],
            ["Invoice", d.invoice],
            ["Amount", money(d.amount)],
            ["Check", d.check],
          ].map(([k, v]) => (
            <span key={k} className={c.sumCell}>
              <span>{k}</span>
              <b>{v}</b>
            </span>
          ))}
        </div>
        <span className={c.label}>
          Dispute type <i>*</i>
        </span>
        <span className={c.select} data-jr="select">
          <span className={c.swap}>
            <span data-jr="selValue">{d.type}</span>
            <span className={c.placeholder} data-jr="selEmpty">
              Select a dispute type
            </span>
          </span>
          <Glyph k="caret" />
        </span>
        <span className={c.label}>Supporting documents</span>
        <span className={c.drop}>
          <span className={c.file} data-jr="file">
            <span className={c.fileIc}>
              <Glyph k="clip" />
            </span>
            {d.file}
            <span className={c.fileSize}>212 KB</span>
          </span>
        </span>
        <span className={c.submit} data-jr="submit">
          Submit dispute
        </span>
      </div>

      <div className={`${c.paper} ${c.toast}`} style={at(300, 64, 236, 78)} data-jr="toast">
        <span className={c.toastIc}>
          <Glyph k="bell" />
        </span>
        <span className={c.toastText}>
          <b>Paid back · {money(d.amount)}</b>
          <span>{d.paid}</span>
        </span>
      </div>

      <div className={`${c.paper} ${c.tracker}`} style={at(300, 178, 236, 214)} data-jr="tracker">
        <span className={c.mono}>Dispute DSP-0912</span>
        <ol className={c.stages}>
          <span className={c.stageTrack}>
            <span className={c.stageFill} data-jr="stageFill" />
          </span>
          {d.stages.map((st, n) => (
            <li key={st} className={c.stage}>
              <span className={c.node} data-jr="node">
                <Glyph k="check" />
              </span>
              <span className={c.stageText}>
                <b>{st}</b>
                <span>{["Jul 30 · with POD", "Aug 6 · KeHE", "Aug 26 · remittance"][n]}</span>
              </span>
            </li>
          ))}
        </ol>
      </div>
    </>
  );
}

export const SCENES = [InboxScene, BackupScene, DisputeScene] as const;
