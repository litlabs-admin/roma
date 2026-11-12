import { CONNECT } from "../data";
import v from "../visuals.module.css";

/**
 * Card 1 — "Live in 5 minutes". Port of Fruitful's composer card: a tilted glass
 * question card (options stagger in, a selection dot pops onto row 1 then slides to
 * row 2, the send button pops) and a second tilted layer that slides in from the
 * right — here a KeHE remittance backup instead of a portrait.
 * Geometry is in 637-unit design space (`--u` = 1/637 of the card width).
 */
export default function ConnectVisual() {
  const { question, options, placeholder, backup } = CONNECT;
  return (
    <div className={`${v.visual} ${v.warm} ${v.connect}`} data-mf-visual="connect" aria-hidden="true">
      <div className={v.cCard} data-mf="card">
        <div className={v.cInner}>
          <div className={v.cHead}>
            <p className={v.cQ}>{question}</p>
            <span className={v.cClose}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <path d="M17 7 7 17M7 7l10 10" />
              </svg>
            </span>
          </div>

          <div className={v.cOpts}>
            {options.map((o) => (
              <div key={o} className={v.cOpt} data-mf="opt">
                <i className={v.cRadio} />
                <span>{o}</span>
              </div>
            ))}
            <b className={v.cDot} data-mf="dot" />
          </div>

          <div className={v.cInput}>
            <span className={v.cLink}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10 14a4.5 4.5 0 0 0 6.4 0l3-3a4.5 4.5 0 0 0-6.4-6.4l-1 1" />
                <path d="M14 10a4.5 4.5 0 0 0-6.4 0l-3 3a4.5 4.5 0 0 0 6.4 6.4l1-1" />
              </svg>
            </span>
            <span className={v.cPh}>{placeholder}</span>
            <span className={v.cSend} data-mf="send">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </span>
          </div>
        </div>
      </div>

      <div className={v.cDoc} data-mf="doc">
        <div className={v.cDocInner}>
          <div className={v.cDocHead}>
            <span className={v.cDocLabel}>{backup.label}</span>
            <span className={v.cDocCheck}>{backup.check}</span>
          </div>
          <ul className={v.cDocLines}>
            {backup.lines.map((l) => (
              <li key={l.code}>
                <span>{l.code}</span>
                <span className={v.num}>{l.amount}</span>
              </li>
            ))}
          </ul>
          <div className={v.cDocTotal}>
            <span>{backup.total.label}</span>
            <span className={v.num}>{backup.total.amount}</span>
          </div>
          <span className={v.cDocChip}>
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3.5 8.5 6.5 11.5 12.5 5" />
            </svg>
            Synced
          </span>
        </div>
      </div>
    </div>
  );
}
