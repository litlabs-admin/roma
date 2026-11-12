import { STEP_SCENES } from "../data";
import { at, Check, formatUsd } from "./kit";
import s from "./scenes.module.css";

/**
 * 04 Recover — tracked through to cash. The pipeline fills Disputed → Approved →
 * Paid, each node lands, "Cash in bank" pops as Paid lands, and the recovered amount
 * counts up while its sparkline draws.
 */

const CARD = { x: 100, y: 56, w: 360, h: 168 };
const SPARK = "M2 36C18 35 28 31 40 30S60 22 72 20 96 12 108 8 122 3 128 2";

export default function RecoverScene() {
  const r = STEP_SCENES.recover;
  return (
    <div className={`${s.card} ${s.tracker}`} style={at(CARD.x, CARD.y, CARD.w, CARD.h)} data-ss="tracker">
      <div className={s.tHead}>
        <span className={s.label}>{r.label}</span>
        <span className={`${s.chip} ${s.matched}`} data-ss="cash">
          <Check />
          {r.chip}
        </span>
      </div>

      <div className={s.tMid}>
        <span className={`${s.num} ${s.tAmount}`} data-ss="amount" data-to={r.amount}>
          {formatUsd(r.amount)}
        </span>
        <svg className={s.spark} viewBox="0 0 130 40" fill="none">
          <path data-ss="spark" d={SPARK} stroke="#2F9A3A" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>

      <div className={s.pipe}>
        <span className={s.track}>
          <i className={s.trackFill} data-ss="fill" />
        </span>
        <ol className={s.stages}>
          {r.stages.map((st) => (
            <li key={st} className={s.stage}>
              <span className={s.node}>
                <i data-ss="node">
                  <Check />
                </i>
              </span>
              {st}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
