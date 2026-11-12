import { STEP_SCENES } from "../data";
import { at, Check } from "./kit";
import s from "./scenes.module.css";

/**
 * 03 Dispute — the human-in-the-loop moment. An invalid deduction arrives, its
 * backup drops into the attachment slot, the cursor presses "Confirm dispute" and
 * the button turns to "Disputed" as the filing note appears.
 */

const CARD = { x: 110, y: 55, w: 340, h: 170 };
// Button sits bottom-right of the card; the cursor's tip lands inside it.
const PRESS = { x: CARD.x + CARD.w - 60, y: CARD.y + CARD.h - 26 };

export default function DisputeScene() {
  const d = STEP_SCENES.dispute;
  return (
    <>
      <div className={`${s.card} ${s.queue}`} style={at(CARD.x, CARD.y, CARD.w, CARD.h)} data-ss="queue">
        <div className={s.qHead}>
          <span className={s.badge}>{d.initial}</span>
          <span className={s.qTitle}>
            {d.title}
            <span className={`${s.chip} ${s.invalid}`} data-ss="tag">
              {d.tag}
            </span>
          </span>
          <span className={`${s.num} ${s.qAmount}`}>{d.amount}</span>
        </div>

        <div className={s.slot}>
          <span className={s.slotHint}>{d.slot}</span>
          <span className={s.file} data-ss="file">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path data-ss="clip" d="M21 11.5 12.5 20a5 5 0 0 1-7-7L14 4.5a3.3 3.3 0 0 1 4.7 4.7l-8.5 8.5a1.7 1.7 0 0 1-2.4-2.4L15.5 7.5" />
            </svg>
            {d.file}
            <span className={s.fileSize}>212 KB</span>
          </span>
        </div>

        <div className={s.qFoot}>
          <span className={s.label} data-ss="filed">
            {d.filed}
          </span>
          <span className={s.btn} data-ss="btn">
            <i className={s.btnFace} style={{ opacity: 0 }} data-ss="face" />
            <span style={{ opacity: 0 }} data-ss="confirm">
              {d.confirm}
            </span>
            <span data-ss="done">
              <Check />
              {d.done}
            </span>
          </span>
        </div>
      </div>

      <svg className={`${s.abs} ${s.cursor}`} style={at(PRESS.x, PRESS.y)} viewBox="0 0 20 20" data-ss="cursor">
        <path d="M3 2.5v13.2l3.6-3.3 2.4 5.6 2.4-1-2.4-5.5h4.9z" fill="#111" stroke="#fff" strokeWidth="1.3" strokeLinejoin="round" />
      </svg>
    </>
  );
}
