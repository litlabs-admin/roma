import { STEP_SCENES } from "../data";
import { at, Check, SCENE_VB } from "./kit";
import s from "./scenes.module.css";

/**
 * 02 Match — a deduction meets the promo agreement behind it. The two cards slide
 * together, matching rows light up left then right, links draw between them, a seal
 * stamps the match and the deduction flips from Unmatched to Matched.
 */

const L = { x: 26, w: 212 };
const R = { x: 322, w: 212 };
const TOP = 52;
const H = 176;
// Row centres, in canvas units: card top + padding + label + gap + row offsets.
const ROW_Y = [TOP + 14 + 13 + 12 + 13, TOP + 14 + 13 + 12 + 26 + 6 + 13];
const LINKS = ROW_Y.map((y) => `M${L.x + L.w} ${y}H${R.x}`);
const SEAL = { cx: (L.x + L.w + R.x) / 2, cy: (ROW_Y[0] + ROW_Y[1]) / 2, r: 15 };

export default function MatchScene() {
  const { deduction, backup } = STEP_SCENES.match;
  return (
    <>
      <svg className={s.wires} viewBox={SCENE_VB} fill="none">
        <g stroke="#2F9A3A" strokeWidth="1.5" strokeLinecap="round">
          {LINKS.map((d) => (
            <path key={d} data-ss="link" d={d} />
          ))}
        </g>
      </svg>

      <div className={`${s.card} ${s.doc}`} style={at(L.x, TOP, L.w, H)} data-ss="docL">
        <span className={s.label}>{deduction.label}</span>
        <div className={s.docRows}>
          {deduction.rows.map((r) => (
            <div key={r.k} className={s.row}>
              <i className={s.hl} data-ss="hlL" />
              <span className={s.k}>{r.k}</span>
              <span className={s.v}>{r.v}</span>
            </div>
          ))}
        </div>
        <div className={s.swap}>
          <span className={`${s.chip} ${s.review}`} style={{ opacity: 0 }} data-ss="before">
            {deduction.before}
          </span>
          <span className={`${s.chip} ${s.matched}`} data-ss="after">
            <Check />
            {deduction.after}
          </span>
        </div>
      </div>

      <div className={`${s.card} ${s.doc}`} style={at(R.x, TOP, R.w, H)} data-ss="docR">
        <span className={s.label}>{backup.label}</span>
        <div className={s.docRows}>
          {backup.rows.map((r) => (
            <div key={r.k} className={s.row}>
              <i className={s.hl} data-ss="hlR" />
              <span className={s.k}>{r.k}</span>
              <span className={s.v}>{r.v}</span>
            </div>
          ))}
        </div>
        <span className={s.docFoot}>{backup.foot}</span>
      </div>

      <div className={`${s.abs} ${s.seal}`} style={at(SEAL.cx - SEAL.r, SEAL.cy - SEAL.r)} data-ss="seal">
        <Check />
      </div>
    </>
  );
}
