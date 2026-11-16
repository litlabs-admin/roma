import { capabilityMocks as M } from "@/lib/content/platform";
import { Glyph, RomaGlyph, at, money } from "@/components/platform/mock/kit";
import c from "./mocks.module.css";

/**
 * Capability illustrations, in the language of the home "recovery machine" cards:
 * a tinted well that fades into the white card, one hero object (often tilted and
 * layered over a second one), real-looking numbers, and a bottom scrim so the art
 * bleeds into the card instead of sitting in a box.
 *
 * Canvas 560 × 420 (--u = 1/560 of the well width). SSR = finished state; timelines in
 * Capabilities.tsx hook onto `data-cm`. CSS hover micro-interactions live in
 * mocks.module.css under `.card:hover` (the parent card in capabilities.module.css).
 */

const W = 560;
const H = 420;

const initial = (name: string) => name.charAt(0);

/* ── 1 · inbox: portals → Roma → a fanned deck of deductions ───────────── */
const PORTAL = { x: 34, w: 118, h: 36, y0: 112, gap: 50 };
const HUB = { x: 196, y: 168, s: 84 };
const DECK = { x: 322, y: 82, w: 206, h: 262 };

export function InboxMock() {
  const hubY = HUB.y + HUB.s / 2;
  const wire = (i: number) => {
    const y1 = PORTAL.y0 + i * PORTAL.gap + PORTAL.h / 2;
    const x1 = PORTAL.x + PORTAL.w;
    const x2 = HUB.x;
    const mx = x1 + (x2 - x1) * 0.55;
    return `M${x1} ${y1} C${mx} ${y1} ${mx} ${hubY} ${x2} ${hubY}`;
  };
  return (
    <div className={`${c.scene} ${c.warm}`}>
      <svg className={c.wires} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
        {M.inbox.sources.map((_, i) => (
          <path key={i} d={wire(i)} className={c.wire} data-cm="wire" />
        ))}
        <path d={`M${HUB.x + HUB.s} ${hubY} L${DECK.x + 6} ${hubY}`} className={c.wireRed} data-cm="out" />
      </svg>

      {M.inbox.sources.map((src, i) => (
        <div key={src} className={c.portal} style={at(PORTAL.x, PORTAL.y0 + i * PORTAL.gap, PORTAL.w, PORTAL.h)} data-cm="src">
          <span className={c.av}>{initial(src)}</span>
          <span className={c.portalName}>{src}</span>
          <i className={c.live} />
        </div>
      ))}

      <div className={c.hubWrap} style={at(HUB.x, HUB.y, HUB.s, HUB.s)} data-cm="hub">
        <span className={c.ring} data-cm="ring" />
        <span className={c.hub}>
          <RomaGlyph className={c.hubMark} />
        </span>
      </div>

      <div className={c.deck} style={at(DECK.x, DECK.y, DECK.w, DECK.h)}>
        <span className={`${c.paper} ${c.ghost2}`} />
        <span className={`${c.paper} ${c.ghost1}`} />
        <div className={`${c.paper} ${c.front}`} data-cm="deck">
          <div className={c.deckHead}>
            <span className={c.mono}>Inbox</span>
            <span className={c.countPill}>
              <span data-cm="count">{M.inbox.rows.length}</span> new
            </span>
          </div>
          {M.inbox.rows.map((r) => (
            <div key={r.channel + r.label} className={c.deckRow} data-cm="row">
              <span className={`${c.av} ${c.avSm}`}>{initial(r.channel)}</span>
              <span className={c.deckMeta}>
                <span className={c.deckLabel}>{r.channel}</span>
                <span className={`${c.tag} ${c[r.category]}`} data-cm="chip">
                  {r.label}
                </span>
              </span>
              <span className={c.deckAmt}>{money(-r.amount, false)}</span>
            </div>
          ))}
        </div>
      </div>
      <div className={c.scrim} />
    </div>
  );
}

/* ── 2 · backup: tilted MCB document, scanned line by line, sealed to the promo ── */
export function BackupMock() {
  const total = M.backup.lines.reduce((a, l) => a + l.amount, 0);
  return (
    <div className={`${c.scene} ${c.neutral}`}>
      <div className={c.docTilt} style={at(46, 66, 262, 270)} data-cm="doc">
        <div className={`${c.paper} ${c.doc}`}>
          <div className={c.docHead}>
            <span className={c.monoRed}>{M.backup.doc}</span>
            <span className={c.docTitle}>Check #20931</span>
          </div>
          <div className={c.docRows}>
            <span className={c.scan} data-cm="scan" />
            {M.backup.lines.map((l) => (
              <div key={l.item} className={c.docRow} data-cm="line">
                <span className={c.hl} data-cm="hl" />
                <span className={c.docItem}>{l.item}</span>
                <span className={c.docAmt}>{money(-l.amount, false)}</span>
                <span className={c.tick} data-cm="tick">
                  <Glyph k="check" />
                </span>
              </div>
            ))}
          </div>
          <div className={c.docFoot}>
            <span>Deducted</span>
            <span className={c.docTotal}>{money(-total, false)}</span>
          </div>
        </div>
      </div>

      <svg className={c.wires} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
        <path d="M296 214 H338" className={c.wireGreen} data-cm="link" />
      </svg>
      <span className={c.seal} style={at(300, 197, 34, 34)} data-cm="seal">
        <Glyph k="check" />
      </span>

      <div className={c.agreeTilt} style={at(334, 108, 192, 204)} data-cm="agreement">
        <div className={`${c.paper} ${c.agreement}`}>
          <span className={c.mono}>Promo agreement · Q3</span>
          <span className={c.agreeId}>{M.backup.agreement}</span>
          <div className={c.kv}>
            <span>Allowance</span>
            <b>{money(total, false)}</b>
          </div>
          <div className={c.kv}>
            <span>Period</span>
            <b>Jul 1 to Sep 30</b>
          </div>
          <span className={c.swap}>
            <span className={`${c.tag} ${c.ok}`} data-cm="final">
              <Glyph k="check" />
              Matched
            </span>
            <span className={`${c.tag} ${c.wait} ${c.hidden}`} data-cm="pending">
              Checking…
            </span>
          </span>
        </div>
      </div>
      <div className={c.scrim} />
    </div>
  );
}

/* ── 3 · dispute: a queue of invalid deductions, backup attached, filed ── */
export function DisputeMock() {
  const d = M.dispute;
  return (
    <div className={`${c.scene} ${c.warm}`}>
      <span className={c.queueCount} style={at(84, 50)} data-cm="qcount">
        <i className={c.redDot} />3 queued with backup
      </span>
      <div className={c.queueStack} style={at(84, 86, 392, 244)}>
        <span className={`${c.paper} ${c.qGhost2}`} />
        <span className={`${c.paper} ${c.qGhost1}`} />
        <div className={`${c.paper} ${c.queue}`} data-cm="queue">
          <div className={c.qHead}>
            <span className={`${c.av} ${c.avRed}`}>{initial(d.channel)}</span>
            <span className={c.qTitle}>
              <span>
                Shortage · {d.channel}
                <span className={`${c.tag} ${c.invalid}`}>Invalid</span>
              </span>
              <span className={c.qSub}>INV-30927 · Jul 28, 2026</span>
            </span>
            <span className={c.qAmount}>{money(-d.amount)}</span>
          </div>

          <div className={c.slot}>
            <span className={c.slotHint}>Drop backup here</span>
            <span className={c.file} data-cm="file">
              <span className={c.fileIc}>
                <Glyph k="file" />
              </span>
              <span className={c.fileName}>{d.file}</span>
              <span className={c.fileSize}>{d.size}</span>
            </span>
          </div>

          <div className={c.qFoot}>
            <span className={c.swapLeft}>
              <span className={c.mono} data-cm="footFiled">
                Filed with {d.channel}
              </span>
              <span className={`${c.mono} ${c.hidden}`} data-cm="footQueued">
                Backup attached
              </span>
            </span>
            <span className={c.btn} data-cm="btn">
              <span className={c.btnFace} data-cm="btnFace" />
              <span className={c.btnLabel} data-cm="btnFiled">
                <Glyph k="check" />
                {d.filed}
              </span>
              <span className={`${c.btnLabel} ${c.hidden}`} data-cm="btnConfirm">
                {d.cta}
              </span>
            </span>
          </div>
        </div>
      </div>
      <span className={`${c.cursor} ${c.hidden}`} style={at(400, 300)} data-cm="cursor">
        <svg viewBox="0 0 16 16" aria-hidden="true">
          <path d="M3 2 13 7.2 8.6 8.6 7.2 13z" fill="#111" stroke="#fff" strokeWidth="1.2" strokeLinejoin="round" />
        </svg>
      </span>
      <div className={c.scrim} />
    </div>
  );
}

/* ── 4 · recovery: recovered rises, written-off falls, credits land ─────── */
// Chart box 380 × 120 (panel inner coordinates).
const RECOVERED = "M0 112 C60 110 110 100 150 82 S240 30 380 8";
const WRITTEN_OFF = "M0 40 C50 46 100 74 150 112";
const MARKS = [
  { x: 96, y: 101, k: "file" as const, tone: "promo" },
  { x: 182, y: 66, k: "check" as const, tone: "ok" },
  { x: 268, y: 34, k: "check" as const, tone: "ok" },
  { x: 344, y: 15, k: "check" as const, tone: "ok" },
];
const ROWS = [
  { when: "Wk 31", title: "KeHE shortage", sub: "Credited", amount: 1284.5, tone: "ok" },
  { when: "Wk 30", title: "UNFI promo", sub: "In review", amount: 4116, tone: "wait" },
];

export function RecoveryMock() {
  const r = M.recovery;
  return (
    <div className={`${c.scene} ${c.neutral}`}>
      <div className={`${c.paper} ${c.tracker}`} style={at(70, 40, 420, 420)} data-cm="tracker">
        <div className={c.tTop}>
          <span className={c.mono}>{r.label}</span>
          <span className={c.legend}>
            <i className={c.lgUp} />
            Recovered
            <i className={c.lgDown} />
            Written off
          </span>
        </div>
        <div className={c.tNumRow}>
          <span className={c.bigNum} data-cm="count" data-to={r.total}>
            {money(r.total, false)}
          </span>
          <span className={`${c.tag} ${c.ok}`} data-cm="delta">
            +$4,210 this month
          </span>
        </div>
        <div className={c.chartWrap}>
          <svg className={c.chart} viewBox="0 0 380 120" preserveAspectRatio="none" aria-hidden="true">
            <path d={`${WRITTEN_OFF} V120 H0 Z`} className={c.areaDown} data-cm="area" />
            <path d={`${RECOVERED} V120 H0 Z`} className={c.areaUp} data-cm="area" />
            <path d={WRITTEN_OFF} className={c.curveDown} data-cm="curve" />
            <path d={RECOVERED} className={c.curveUp} data-cm="curve" />
            <path d="M0 120 H380" className={c.base} />
          </svg>
          {MARKS.map((m) => (
            <span key={m.x} className={`${c.mark} ${c[m.tone]}`} style={{ left: `${(m.x / 380) * 100}%`, top: `calc(var(--u) * ${m.y})` }} data-cm="mark">
              <Glyph k={m.k} />
            </span>
          ))}
        </div>
        <div className={c.axis}>
          {["Q1", "Q2", "Q3", "Q4"].map((q) => (
            <span key={q}>{q}</span>
          ))}
        </div>
        <ul className={c.timeline}>
          {ROWS.map((row) => (
            <li key={row.title} className={c.tlRow} data-cm="tl">
              <span className={`${c.when} ${c[row.tone]}`}>{row.when}</span>
              <span className={c.tlText}>
                <b>{row.title}</b>
                <span>{row.sub}</span>
              </span>
              <span className={c.tlAmt}>{money(row.amount)}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className={c.scrim} />
    </div>
  );
}

export const CAPABILITY_MOCKS = {
  inbox: InboxMock,
  backup: BackupMock,
  dispute: DisputeMock,
  recovery: RecoveryMock,
} as const;
