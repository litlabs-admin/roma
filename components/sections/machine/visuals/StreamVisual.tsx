import { STATUS_LABEL, STREAM_SCREENS } from "../data";
import v from "../visuals.module.css";

/**
 * Card 3 — "Your hours back". Port of Fruitful's map card: a tilted row of screens
 * drifting left forever behind an edge-fade mask, only while on screen. Three
 * remittance screens, duplicated to six so the loop is seamless. Tiles are HTML,
 * not SVG — Fruitful found Safari repaints SVG content every frame.
 */

// Fruitful tile lefts (% of the card) — a 433/637 = 67.975% pitch.
const LEFTS = ["-45.039%", "22.936%", "90.911%", "158.885%", "226.860%", "294.835%"];

export default function StreamVisual() {
  return (
    <div className={`${v.visual} ${v.neutral} ${v.stream}`} data-mf-visual="stream" aria-hidden="true">
      <div className={v.sWindow}>
        <div className={v.sDrift} data-mf="drift">
          {LEFTS.map((left, i) => {
            const sc = STREAM_SCREENS[i % STREAM_SCREENS.length];
            return (
              <div key={left} className={v.sTile} style={{ left }}>
                <div className={v.sTop}>
                  <span className={v.sBadge}>{sc.channel.charAt(0)}</span>
                  <span className={v.sTitle}>{sc.channel} remittance</span>
                </div>
                <p className={v.sLabel}>Check total</p>
                <p className={`${v.sAmount} ${v.num}`}>{sc.check}</p>
                <ul className={v.sLines}>
                  {sc.lines.map((l) => (
                    <li key={l.code}>
                      <span className={v.sCode}>{l.code}</span>
                      <span className={`${v.sChip} ${v[l.status]}`}>{STATUS_LABEL[l.status]}</span>
                      <span className={`${v.sLineAmt} ${v.num}`}>{l.amount}</span>
                    </li>
                  ))}
                </ul>
                <div className={v.sFoot}>
                  <span>Net payment</span>
                  <span className={v.num}>{sc.total}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className={v.sScrim} />
    </div>
  );
}
