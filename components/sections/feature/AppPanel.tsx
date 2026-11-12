import type { CSSProperties } from "react";
import {
  BADGE,
  BAND_ORDER,
  BAND_W,
  BAND_X,
  CARD,
  CATEGORY_STYLE,
  CHART,
  GROUP_H,
  LABEL,
  PANEL,
  PILL,
  ROW_H,
  SPINE_X,
  SPLIT,
  STROKE,
  SUBS,
  SYS_H,
  SYS_TOP,
  TILE,
  barGeometry,
  bandGeometry,
  chartPoints,
  markerPlan,
  route,
  smoothPath,
  type IconKey,
  type Scenario,
} from "./data";
import p from "./panel.module.css";

const u = (n: number) => `calc(var(--u) * ${n})`;

const ICONS: Record<IconKey, string[]> = {
  tag: ["M2.5 8.6V3.2c0-.4.3-.7.7-.7h5.4l5 5a1 1 0 0 1 0 1.4l-4.6 4.6a1 1 0 0 1-1.4 0z", "M5.5 5.5h.01"],
  truck: ["M1.5 4h8v7h-8z", "M9.5 6.5h3l2 2.5V11h-5", "M4.5 13a1.2 1.2 0 1 0 0-2.4 1.2 1.2 0 0 0 0 2.4zM12 13a1.2 1.2 0 1 0 0-2.4 1.2 1.2 0 0 0 0 2.4z"],
  box: ["M2.5 5 8 2.5 13.5 5v6L8 13.5 2.5 11z", "M2.5 5 8 7.5 13.5 5M8 7.5v6"],
  file: ["M4 1.8h5.2L12.5 5v9.2H4z", "M9 1.8V5h3.5M6 8.5h4.5M6 11h3"],
  receipt: ["M3.5 1.8v12.4l1.5-.8 1.5.8 1.5-.8 1.5.8 1.5-.8 1.5.8V1.8l-1.5.8-1.5-.8-1.5.8-1.5-.8-1.5.8z", "M6 6h4.5M6 9h3"],
  alert: ["M8 2 14.5 13.5h-13z", "M8 6.5v3M8 11.6h.01"],
};

export function Icon({ k, className }: { k: IconKey; className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {ICONS[k].map((d, i) => (
        <path key={i} d={d} />
      ))}
    </svg>
  );
}

/** Roma rosette, simplified as a vector for the panel (brand mark is raster-only today). */
function Rosette({ color = "#fff" }: { color?: string }) {
  const petals = Array.from({ length: 6 }, (_, i) => i * 60);
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.4" aria-hidden="true">
      <circle cx="12" cy="12" r="10.3" />
      {petals.map((a) => (
        <ellipse key={a} cx="12" cy="7.6" rx="2.6" ry="4.4" transform={`rotate(${a} 12 12)`} />
      ))}
    </svg>
  );
}

export const formatMoney = (n: number) => `$${Math.round(n).toLocaleString("en-US")}`;

export default function AppPanel({ s }: { s: Scenario }) {
  const bars = barGeometry(s);
  const bands = bandGeometry();
  const cx = BADGE.x + BADGE.size / 2;
  const pts = chartPoints(s.curve);
  const line = smoothPath(pts);
  const area = `${line}L${CHART.w} ${CHART.h}L0 ${CHART.h}Z`;
  const markers = markerPlan(s);
  const knobPct = s.split.validPct;
  const disputeN = Number(s.inDispute.replace(/[^0-9.]/g, ""));
  const recPct = Math.round((s.recovered / (s.recovered + disputeN)) * 100);

  return (
    <div className={p.screen} data-panel-screen>
      {/* ── head (Fruitful phone layout): mark, serif headline, crossfading sub-line ── */}
      <div className={p.head}>
        <span className={p.mark}>
          <Rosette color="#B21515" />
        </span>
        <h3 className={p.headline}>{s.headline}</h3>
        <div className={p.subs}>
          {SUBS.map((t, i) => (
            <p key={t} className={`${p.sub} ${i ? p.subAlt : ""}`} data-gf="sub">
              {t}
            </p>
          ))}
        </div>
      </div>

      {/* ── screen 1: pull & categorize ── */}
      <div className={p.system} data-gf="screen1">
        <svg className={p.paths} viewBox={`0 0 ${PANEL.w} ${PANEL.h}`} fill="none">
          <path data-gf="stem" d={`M${cx} ${PILL.y + PILL.h + STROKE}V${BADGE.y - STROKE}`} stroke="#2A2A2A" strokeWidth={STROKE} strokeLinecap="round" />
          {bars.map((b) => (
            <path
              key={b.key}
              data-gf="route"
              d={route(cx, BADGE.y + BADGE.size + STROKE, b.x + b.w / 2, b.y - STROKE)}
              stroke={CATEGORY_STYLE[b.key].fill}
              strokeWidth={STROKE}
              strokeLinecap="round"
            />
          ))}
        </svg>
        <div className={p.pill} data-gf="pill" style={{ left: u(PILL.x), top: u(PILL.y), width: u(PILL.w), height: u(PILL.h) }}>
          <span data-gf="pillText">Deducted this quarter</span>
          <b data-gf="pillText">{s.total}</b>
        </div>
        <div className={p.badge} data-gf="badge" style={{ left: u(BADGE.x), top: u(BADGE.y), width: u(BADGE.size), height: u(BADGE.size) }}>
          <Rosette />
        </div>
        {bars.map((b) => (
          <div
            key={b.key}
            className={p.bar}
            data-gf="bar"
            style={{ left: u(b.x), top: u(b.y), width: u(b.w), height: u(b.h), background: CATEGORY_STYLE[b.key].fill, color: CATEGORY_STYLE[b.key].ink }}
          >
            <b data-gf="barText">{b.amount}</b>
            <span data-gf="barText">{b.label}</span>
          </div>
        ))}
        <div className={p.split} data-gf="split" style={{ left: u(SPLIT.x), top: u(SPLIT.y), width: u(SPLIT.w) }}>
          <div className={p.legend}>
            <span>
              <i style={{ background: "#CFC6B4" }} />
              Valid
            </span>
            <span>
              Recoverable
              <i style={{ background: "#B21515" }} />
            </span>
          </div>
          <div className={p.track}>
            <i data-gf="fillValid" style={{ left: 0, width: `${knobPct}%`, background: "#CFC6B4" }} />
            <i data-gf="fillRec" style={{ left: `${knobPct}%`, width: `${100 - knobPct}%`, background: "#B21515" }} />
            <span className={p.knob} data-gf="knob" style={{ left: `calc(${knobPct}% - ${u(11)})` }} />
          </div>
          <div className={p.values}>
            <div>
              <b>{s.split.valid}</b>
              <small>{knobPct}% of deductions</small>
            </div>
            <div>
              <b className={p.red}>{s.split.recoverable}</b>
              <small>{100 - knobPct}% to dispute</small>
            </div>
          </div>
        </div>
      </div>

      {/* ── screen 2: match (bands grow out of the bars and clip their content) ── */}
      <div className={p.system2} data-gf="screen2" style={{ top: u(SYS_TOP) }}>
        <svg className={p.spine} viewBox={`0 0 ${PANEL.w} ${SYS_H}`} fill="none">
          <path data-gf="rail" d={`M${SPINE_X} ${bands[0].top + GROUP_H / 2}V${bands[2].top + GROUP_H / 2}`} stroke="#E4DCCB" strokeWidth="2" />
        </svg>
        {bands.map((band, bi) => {
          const st = CATEGORY_STYLE[band.key];
          const tiles = s.tiles[band.key];
          const barLabel = s.bars.find((b) => b.key === band.key)?.band ?? band.key;
          return (
            <div
              key={band.key}
              className={p.band}
              data-gf="band"
              data-band={band.key}
              style={{ left: u(BAND_X), width: u(BAND_W), top: u(band.top), height: u(band.h), background: st.fill }}
            >
              <svg className={p.bandWires} viewBox={`${BAND_X} ${band.top} ${BAND_W} ${band.h}`} fill="none">
                {tiles.map((_, ti) => {
                  const ty = band.top + 8 + ti * TILE.step + TILE.h / 2;
                  const fy = band.top + band.h / 2;
                  return (
                    <path
                      key={ti}
                      data-gf="conn"
                      data-row={bi}
                      d={`M${LABEL.x + LABEL.w} ${fy}C${(LABEL.x + LABEL.w + TILE.x) / 2} ${fy} ${(LABEL.x + LABEL.w + TILE.x) / 2} ${ty} ${TILE.x} ${ty}`}
                      stroke="#fff"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  );
                })}
              </svg>
              <div className={p.bandLabel} data-gf="bandLabel" data-row={bi} style={{ left: u(LABEL.x - BAND_X), width: u(LABEL.w), top: u(band.h / 2 - 10), color: st.ink }}>
                {barLabel}
              </div>
              {tiles.map((t, ti) => (
                <div key={t.title} className={p.tile} data-gf="tile" data-row={bi} style={{ left: u(TILE.x - BAND_X), top: u(8 + ti * TILE.step), width: u(TILE.w), height: u(TILE.h) }}>
                  <span className={p.tileLabel}>
                    <Icon k={t.icon} className={p.ic} />
                    {t.title}
                  </span>
                  <span className={`${p.chip} ${t.status === "recoverable" ? p.chipRec : p.chipOk}`} data-gf="chip" data-row={bi}>
                    <b>{t.amount}</b>
                    <em>{t.status === "recoverable" ? "Recoverable" : "Matched"}</em>
                  </span>
                </div>
              ))}
            </div>
          );
        })}
      </div>

      {/* ── screen 3: dispute & recover ── */}
      <div className={p.system3} data-gf="screen3">
        <div className={p.card} data-gf="card3" style={{ left: u(CARD.x), top: u(CARD.y), width: u(CARD.w), height: u(CARD.h) }}>
          <div className={p.cardHead}>
            <span className={p.cardLabel}>Recovered so far</span>
            <b className={p.figure} data-gf="figure" data-value={s.recovered}>
              {formatMoney(s.recovered)}
            </b>
          </div>
          <div className={p.chart} style={{ left: u(CHART.x), top: u(CHART.y), width: u(CHART.w), height: u(CHART.h) }}>
            <svg viewBox={`0 0 ${CHART.w} ${CHART.h}`} preserveAspectRatio="none" fill="none">
              <defs>
                <linearGradient id={`rg-${s.key}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#B21515" stopOpacity="0.22" />
                  <stop offset="1" stopColor="#B21515" stopOpacity="0" />
                </linearGradient>
              </defs>
              {[0.25, 0.5, 0.75].map((g) => (
                <path key={g} d={`M0 ${CHART.h * g}H${CHART.w}`} stroke="#EFE9DD" strokeWidth="1" data-gf="grid" />
              ))}
              <path data-gf="area" d={area} fill={`url(#rg-${s.key})`} />
              <path data-gf="curve" d={line} stroke="#B21515" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>
          <div className={p.axis} data-gf="axis" style={{ top: u(CHART.y + CHART.h + 6) }}>
            {["Jul", "Aug", "Sep", "Oct"].map((m, i) => (
              <span key={m} style={{ left: `${(i / 3) * 100}%` }}>
                {m}
              </span>
            ))}
          </div>
          <div className={p.split3} data-gf="split3">
            <div className={p.legend}>
              <span>
                <i style={{ background: "#B21515" }} />
                Recovered
              </span>
              <span>
                In dispute · {s.inDispute}
                <i style={{ background: "#EED9A8" }} />
              </span>
            </div>
            <div className={p.track}>
              <i data-gf="fill3" style={{ left: 0, width: `${recPct}%`, background: "#B21515" }} />
              <i data-gf="fill3b" style={{ left: `${recPct}%`, width: `${100 - recPct}%`, background: "#EED9A8" }} />
            </div>
          </div>
          <div className={p.rows}>
            {s.rows.map((r, i) => (
              <div key={r.title} className={p.row} data-gf="row" style={{ top: u(i * ROW_H) }}>
                <span className={p.rowDot}>
                  <Icon k={r.icon} className={p.ic} />
                </span>
                <span className={p.rowMain}>
                  <b>{r.title}</b>
                  <i className={p[`state${r.state.replace(" ", "")}` as keyof typeof p]}>{r.state}</i>
                </span>
                <span className={p.rowWhen}>
                  <b>{r.amount}</b>
                  <em>{r.date}</em>
                </span>
              </div>
            ))}
          </div>
        </div>
        {markers.map((m, i) => (
          <span
            key={i}
            className={p.marker}
            data-gf="marker"
            data-dx={m.from.x - m.to.x}
            data-dy={m.from.y - m.to.y}
            style={{ left: u(m.to.x - 13), top: u(m.to.y - 13) } as CSSProperties}
          >
            <span>$</span>
          </span>
        ))}
      </div>
    </div>
  );
}

export { BAND_ORDER };
