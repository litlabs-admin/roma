import { RECOVERY_ROWS } from "../data";
import v from "../visuals.module.css";

/**
 * Card 4 — "Recovery you can track". Port of Fruitful's goals card: a clipped white
 * panel whose two curves draw together, areas fade under them, milestone chips pop
 * along the rising curve, then a timeline rule draws and its rows slide in.
 * Same 637 × 436 card space and panel placement; chart and content are Roma's.
 */

const TONES = {
  promo: { pill: "#FBEDEA", chip: "#F4D9D4", icon: "mf-ic-doc" },
  matched: { pill: "#EEF6EC", chip: "#E2F0DE", icon: "mf-ic-cash" },
  fees: { pill: "#EDF0F4", chip: "#D7DCE3", icon: "mf-ic-check" },
} as const;

// Recovered cash rises; written-off deductions fall away.
const RECOVERED = "M19.39 168C90 166 150 150 190 118S270 40 305.39 20";
const WRITTEN_OFF = "M19.39 84C62 94 118 122 160 170";

// Chips sit on the recovered curve, ordered left to right so the stagger follows it.
const CHIPS: { x: number; y: number; fill: string; icon: string }[] = [
  { x: 82, y: 165, fill: "#F4D9D4", icon: "mf-ic-doc" },
  { x: 140, y: 152, fill: "#E2F0DE", icon: "mf-ic-check" },
  { x: 233, y: 78, fill: "#E2F0DE", icon: "mf-ic-cash" },
  { x: 266, y: 49, fill: "#E2F0DE", icon: "mf-ic-check" },
];

const ROW_Y = [220.48, 283.33, 346.18];

export default function RecoveryVisual() {
  return (
    <div className={`${v.visual} ${v.warm}`} data-mf-visual="recovery" aria-hidden="true">
      <svg className={v.svg} viewBox="0 0 637 436" fill="none">
        <defs>
          <linearGradient id="mf-rec-up" x1="0" y1="20" x2="0" y2="198" gradientUnits="userSpaceOnUse">
            <stop stopColor="#CFE6CA" />
            <stop offset="1" stopColor="#fff" />
          </linearGradient>
          <linearGradient id="mf-rec-down" x1="0" y1="84" x2="0" y2="198" gradientUnits="userSpaceOnUse">
            <stop stopColor="#F4D9D4" />
            <stop offset="1" stopColor="#fff" />
          </linearGradient>
          <clipPath id="mf-rec-chart">
            <rect x="19.39" y="0" width="286" height="198.75" />
          </clipPath>
          <clipPath id="mf-rec-panel">
            <rect x="19.39" y="0" width="286" height="513.01" rx="12.93" />
          </clipPath>
          {/* 13 × 13 icons drawn at the origin, one <use> per instance */}
          <g id="mf-ic-check" stroke="#111" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" fill="none">
            <path d="M3 6.9l2.5 2.5 4.8-5" />
          </g>
          <g id="mf-ic-doc" stroke="#111" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" fill="none">
            <path d="M3.2 1.6h4.3l2.4 2.4v7.4H3.2z" />
            <path d="M7.5 1.6V4h2.4M5 7h3M5 9.2h3" />
          </g>
          <g id="mf-ic-cash" stroke="#111" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" fill="none">
            <path d="M6.5 1.4v10.2" />
            <path d="M9 3.7c-.5-.7-1.4-1-2.5-1-1.5 0-2.5.7-2.5 1.8 0 2.6 5 1.4 5 4 0 1.1-1.1 1.8-2.5 1.8-1.1 0-2.1-.4-2.7-1.2" />
          </g>
        </defs>

        <g transform="translate(155.61 40)">
          <g clipPath="url(#mf-rec-panel)" className={v.gPanel}>
            <rect x="19.39" y="0" width="286" height="513.01" rx="12.93" fill="#fff" />

            {/* ── chart ── */}
            <g clipPath="url(#mf-rec-chart)">
              <path data-mf="area" opacity=".39" d={`${WRITTEN_OFF}V198.75H19.39Z`} fill="url(#mf-rec-down)" />
              <path data-mf="curve" d={RECOVERED} stroke="#8DBF86" strokeWidth="1.62" strokeLinecap="round" />
              <path data-mf="area" opacity=".55" d={`${RECOVERED}V198.75H19.39Z`} fill="url(#mf-rec-up)" />
              <path data-mf="curve" d={WRITTEN_OFF} stroke="#E3AFA6" strokeWidth="1.62" strokeLinecap="round" />
            </g>

            <g data-mf="legend" className={v.gText} fontSize="9.7" fontWeight="500">
              <text fill="#0B5D05" x="32.32" y="23.59">
                Recovered
              </text>
              <text fill="#9B1212" x="32.32" y="38.21">
                Written off
              </text>
            </g>
            <g data-mf="axis" className={v.gText} fill="#B3AC9E" fontSize="9.7" fontWeight="600">
              <text x="32.56" y="182.68">Q1</text>
              <text x="122.19" y="182.68">Q2</text>
              <text x="197.84" y="182.68">Q3</text>
              <text x="272.49" y="182.68">Q4</text>
            </g>

            {CHIPS.map((c) => (
              <g key={c.x} data-mf="chip">
                <rect x={c.x - 9.7} y={c.y - 9.7} width="19.39" height="19.39" rx="9.7" fill={c.fill} />
                <use href={`#${c.icon}`} x={c.x - 6.5} y={c.y - 6.5} />
              </g>
            ))}

            <path d="M19.39 0h286M19.39 198.75h286" stroke="#E8E4DA" strokeWidth="1.62" strokeLinecap="square" />

            {/* ── timeline ── */}
            <path data-mf="tline" d="M42.01 231.06v243.99" stroke="#E8E4DA" strokeWidth="1.62" strokeLinecap="square" />

            {RECOVERY_ROWS.map((r, i) => {
              const y = ROW_Y[i];
              const t = TONES[r.tone];
              return (
                <g key={r.title} data-mf="row" className={v.gText}>
                  <rect x="32.32" y={y} width="80.79" height="19.39" rx="9.7" fill={t.pill} />
                  <rect x="32.32" y={y} width="19.39" height="19.39" rx="9.7" fill={t.chip} />
                  <use href={`#${t.icon}`} x="35.5" y={y + 3.2} />
                  <text x="58.17" y={y + 12.35} fill="#111" fontSize="8.08" fontWeight="600" letterSpacing=".05em">
                    {r.when}
                  </text>
                  <text x="126.04" y={y + 5.41} fill="#111" fontSize="12.93" fontWeight="500">
                    {r.title}
                  </text>
                  <text x="126.04" y={y + 23.23} fill="#6B665C" fontSize="11.31" fontWeight="500">
                    {r.sub}
                  </text>
                </g>
              );
            })}
          </g>
        </g>
      </svg>
      <div className={v.gScrim} />
    </div>
  );
}
