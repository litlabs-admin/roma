import { moduleMocks as M } from "@/lib/content/platform";
import { Glyph, money } from "@/components/platform/mock/kit";
import c from "./moduleMocks.module.css";

/**
 * Module illustrations for the tabbed showcase, in the home cards' language: a tinted
 * well, one main surface bleeding off the bottom, and a second layer (popover, tooltip,
 * toast) that carries the moment. 640 × 480 canvas (--u = 1/640 of the well width).
 *
 * Interactive bits (pointer-events on): reason-code options highlight on hover; each
 * analytics bar shows its own tooltip on hover; remittance rows highlight on hover.
 * SSR = finished state; Modules.tsx animates `data-mm` hooks.
 */

const REASONS = [
  { code: "R-07", label: "Shortage, not received" },
  { code: "R-14", label: "Promo, off-invoice", selected: true },
  { code: "R-21", label: "Slotting fee" },
  { code: "R-32", label: "Spoils allowance" },
];

const ACTIVITY = ["Pulled from the UNFI portal", "Backup read, 3 lines extracted", "Checked against Promo PA-0412"];

const KPIS = [
  { label: "Deducted this quarter", value: "$82,410" },
  { label: "Share of sales", value: "3.1%" },
  { label: "vs Q3 2025", value: "−0.6 pts", good: true },
];

const AUDIT = ["GL codes mapped by rule, Jul 30", "Reviewed by Finance, Jul 31"];

export function DeductionsMock() {
  const d = M.deductions;
  return (
    <div className={`${c.scene} ${c.warm}`}>
      <div className={`${c.paper} ${c.main}`} style={{ left: "calc(var(--u) * 48)", top: "calc(var(--u) * 52)", width: "calc(var(--u) * 430)" }} data-mm="main">
        <div className={c.head}>
          <span className={c.av}>U</span>
          <span className={c.headText}>
            <b>Promo · {d.channel}</b>
            <span>{d.id} · Jul 28, 2026</span>
          </span>
          <span className={c.headAmt}>{money(-d.amount)}</span>
        </div>

        <div className={c.fields}>
          <div className={c.field}>
            <span className={c.mono}>Reason code</span>
            <span className={`${c.select} ${c.selectOpen}`}>
              <span className={c.swap}>
                <span data-mm="reasonSet">R-14 · Promo</span>
                <span className={`${c.muted} ${c.hidden}`} data-mm="reasonEmpty">
                  Choose a code
                </span>
              </span>
              <Glyph k="caret" />
            </span>
          </div>
          <div className={c.field}>
            <span className={c.mono}>Status</span>
            <span className={c.swap}>
              <span className={`${c.tag} ${c.ok}`} data-mm="final">
                <Glyph k="check" />
                {d.status}
              </span>
              <span className={`${c.tag} ${c.wait} ${c.hidden}`} data-mm="pending">
                Reviewing
              </span>
            </span>
          </div>
        </div>

        <div className={c.lines}>
          <span className={c.mono}>Backup lines · MCB</span>
          {d.lines.map((l) => (
            <div key={l.item} className={c.line} data-mm="line">
              <span className={c.lineItem}>{l.item}</span>
              <span className={c.lineQty}>{l.qty} cs</span>
              <span className={c.lineAmt}>{money(-l.amount)}</span>
              <span className={c.tick} data-mm="tick">
                <Glyph k="check" />
              </span>
            </div>
          ))}
        </div>

        <div className={c.activity}>
          <span className={c.mono}>Activity</span>
          {ACTIVITY.map((a) => (
            <span key={a} className={c.actItem} data-mm="act">
              <i />
              {a}
            </span>
          ))}
        </div>
      </div>

      <div className={`${c.paper} ${c.popover}`} style={{ left: "calc(var(--u) * 64)", top: "calc(var(--u) * 186)", width: "calc(var(--u) * 268)" }} data-mm="popover">
        <span className={c.search}>
          <Glyph k="search" />
          Search 23 reason codes
        </span>
        <div className={c.opts}>
          <span className={c.optSel} data-mm="sel" />
          {REASONS.map((r) => (
            <span key={r.code} className={`${c.opt} ${r.selected ? c.optOn : ""}`}>
              <b>{r.code}</b>
              <span>{r.label}</span>
              {r.selected && (
                <span className={c.optCheck} data-mm="optCheck">
                  <Glyph k="check" />
                </span>
              )}
            </span>
          ))}
        </div>
      </div>
      <div className={c.scrim} />
    </div>
  );
}

export function AnalyticsMock() {
  const a = M.analytics;
  return (
    <div className={`${c.scene} ${c.neutral}`}>
      <div className={`${c.paper} ${c.main}`} style={{ left: "calc(var(--u) * 40)", top: "calc(var(--u) * 44)", width: "calc(var(--u) * 560)" }} data-mm="main">
        <div className={c.head}>
          <span className={c.headText}>
            <span className={c.mono}>Analytics</span>
            <b className={c.headBig}>{a.title}</b>
          </span>
          <span className={c.compare}>
            {a.periods[0]} <span className={c.vs}>vs</span> {a.periods[1]}
            <Glyph k="caret" />
          </span>
        </div>
        <div className={c.legend}>
          <span>
            <i className={c.swNow} />
            {a.periods[0]}
          </span>
          <span>
            <i className={c.swPrev} />
            {a.periods[1]}
          </span>
          <span className={c.hint}>Hover a channel</span>
        </div>
        <div className={c.bars}>
          {a.bars.map((b) => {
            const delta = b.now - b.prev;
            return (
              <div key={b.channel} className={c.barRow}>
                <span className={c.barLabel}>{b.channel}</span>
                <span className={c.barTrack}>
                  <span className={c.barPrev} style={{ width: `${(b.prev / a.max) * 100}%` }} data-mm="prev" />
                  <span className={c.barNow} style={{ width: `${(b.now / a.max) * 100}%` }} data-mm="now" />
                  <span className={c.tip} style={{ left: `${(Math.max(b.now, b.prev) / a.max) * 100}%` }}>
                    <b>{b.now.toFixed(1)}% of sales</b>
                    <span className={delta <= 0 ? c.down : c.up}>
                      {delta <= 0 ? "−" : "+"}
                      {Math.abs(delta).toFixed(1)} pts vs {a.periods[1]}
                    </span>
                  </span>
                </span>
                <span className={c.barVal} data-mm="val" data-to={b.now}>
                  {b.now.toFixed(1)}%
                </span>
              </div>
            );
          })}
        </div>
        <div className={c.axis}>
          {[0, 2, 4, 6].map((t) => (
            <span key={t}>{t}%</span>
          ))}
        </div>
        <div className={c.kpis}>
          {KPIS.map((k) => (
            <span key={k.label} className={c.kpi} data-mm="kpi">
              <span className={c.mono}>{k.label}</span>
              <b className={k.good ? c.good : undefined}>{k.value}</b>
            </span>
          ))}
        </div>
      </div>
      <div className={c.scrim} />
    </div>
  );
}

export function AccountingMock() {
  const r = M.accounting;
  return (
    <div className={`${c.scene} ${c.warm}`}>
      <div className={`${c.paper} ${c.main}`} style={{ left: "calc(var(--u) * 40)", top: "calc(var(--u) * 52)", width: "calc(var(--u) * 470)" }} data-mm="main">
        <div className={c.head}>
          <span className={c.av}>U</span>
          <span className={c.headText}>
            <b>UNFI remittance</b>
            <span>RMT-88213 · Jul 30, 2026</span>
          </span>
          <span className={c.headAmt}>{money(r.total)}</span>
        </div>
        <div className={c.gl}>
          <div className={`${c.glRow} ${c.glHead}`}>
            <span>Line</span>
            <span>GL code</span>
            <span className={c.right}>Amount</span>
          </div>
          {r.lines.map((l) => (
            <div key={l.ref} className={c.glRow} data-mm="line">
              <span className={c.glRef}>
                <b>{l.ref}</b>
                <span>{l.kind}</span>
              </span>
              <span className={c.swap}>
                <span className={c.glCode} data-mm="gl">
                  {l.gl}
                </span>
                <span className={`${c.unmapped} ${c.hidden}`} data-mm="unmapped">
                  Unmapped
                </span>
              </span>
              <span className={`${c.right} ${c.glAmt}`}>{money(l.amount)}</span>
            </div>
          ))}
          <div className={`${c.glRow} ${c.glTotal}`}>
            <span>Net payment</span>
            <span />
            <span className={c.right}>{money(r.total)}</span>
          </div>
        </div>
        <div className={c.activity}>
          <span className={c.mono}>Audit trail</span>
          {AUDIT.map((a) => (
            <span key={a} className={c.actItem} data-mm="act">
              <i />
              {a}
            </span>
          ))}
        </div>
      </div>

      <div className={`${c.paper} ${c.toast}`} style={{ left: "calc(var(--u) * 372)", top: "calc(var(--u) * 296)", width: "calc(var(--u) * 236)" }} data-mm="toast">
        <div className={c.toastHead}>
          <span className={c.seal}>
            <Glyph k="check" />
          </span>
          <span className={c.headText}>
            <b>Ready to export</b>
            <span>4 lines · GL codes mapped</span>
          </span>
        </div>
        <div className={c.seg}>
          {r.exports.map((x, i) => (
            <span key={x} className={`${c.segItem} ${i === 1 ? c.segOn : ""}`}>
              {x}
            </span>
          ))}
        </div>
      </div>
      <div className={c.scrim} />
    </div>
  );
}

export const MODULE_MOCKS = {
  deductions: DeductionsMock,
  analytics: AnalyticsMock,
  accounting: AccountingMock,
} as const;
