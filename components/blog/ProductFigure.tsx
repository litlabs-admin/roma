import Image from "next/image";
import { productFigures, type ProductFigureKey } from "@/lib/content/blog";
import { moduleMocks } from "@/lib/content/platform";
import { Glyph, SourcePill, StatusChip, TypeChip, money } from "@/components/platform/mock/kit";
import p from "./productFigure.module.css";

/**
 * In-article product figures (DESIGN.md §A.6.3, §G.10): real HTML Roma UI on the warm
 * texture ground, `--shadow-raise` window. Decorative; each figure carries an sr-only
 * summary and an "Illustrative data" caption.
 */

function MatchingWindow() {
  const f = productFigures.matching;
  const recoverable = f.lines.filter((l) => l.status === "recoverable").reduce((n, l) => n + l.amount, 0);
  return (
    <div className={p.window}>
      <div className={p.bar}>
        <span className={p.barTitle}>
          <SourcePill>{f.channel}</SourcePill>
          <b>{f.doc}</b>
          <span className={p.muted}>{f.id}</span>
        </span>
        <span className={p.matchedTo}>
          <Glyph k="link" />
          {f.agreement}
        </span>
      </div>
      <div className={p.table} role="presentation">
        <div className={`${p.row} ${p.head}`}>
          <span>{f.columns.item}</span>
          <span className={p.cDate}>{f.columns.period}</span>
          <span className={p.num}>{f.columns.qty}</span>
          <span className={p.num}>{f.columns.amount}</span>
          <span className={p.cStatus}>{f.columns.status}</span>
        </div>
        {f.lines.map((l, i) => (
          <div key={i} className={`${p.row} ${l.status === "recoverable" ? p.rowFlag : ""}`}>
            <span className={p.item}>
              <TypeChip category="promo">MCB</TypeChip>
              {l.item}
            </span>
            <span className={p.cDate}>
              {l.period}
              {"note" in l && l.note && <em className={p.note}>{l.note}</em>}
            </span>
            <span className={p.num}>{l.qty}</span>
            <span className={p.num}>{money(l.amount)}</span>
            <span className={p.cStatus}>
              <StatusChip kind={l.status}>{f.statusLabel[l.status]}</StatusChip>
            </span>
          </div>
        ))}
      </div>
      <div className={p.foot}>
        <span>{f.totalLabel}</span>
        <b className={p.rec}>{money(recoverable)}</b>
      </div>
    </div>
  );
}

function TradeRateWindow() {
  const a = moduleMocks.analytics;
  return (
    <div className={p.window}>
      <div className={p.bar}>
        <span className={p.barTitle}>
          <span className={`${p.muted} ${p.mono}`}>Analytics</span>
          <b>{a.title}</b>
        </span>
        <span className={p.legend}>
          <span>
            <i className={p.swNow} />
            {a.periods[0]}
          </span>
          <span>
            <i className={p.swPrev} />
            {a.periods[1]}
          </span>
        </span>
      </div>
      <div className={p.bars}>
        {a.bars.map((b) => (
          <div key={b.channel} className={p.barRow}>
            <span className={p.barLabel}>{b.channel}</span>
            <span className={p.barTrack}>
              <span className={p.barNow} style={{ width: `${(b.now / a.max) * 100}%` }} />
              <span className={p.barPrev} style={{ width: `${(b.prev / a.max) * 100}%` }} />
            </span>
            <span className={p.barVal}>
              {b.now.toFixed(1)}%
              <span className={`${p.delta} ${b.now <= b.prev ? p.down : p.up}`}>
                {b.now <= b.prev ? "−" : "+"}
                {Math.abs(b.now - b.prev).toFixed(1)} pts
              </span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

const WINDOWS: Record<ProductFigureKey, () => React.JSX.Element> = {
  matching: MatchingWindow,
  tradeRate: TradeRateWindow,
};

export default function ProductFigure({ figure, caption, summary }: { figure: ProductFigureKey; caption: string; summary: string }) {
  const Window = WINDOWS[figure];
  return (
    <figure className={p.figure} data-reveal>
      <div className={p.ground}>
        <Image src="/images/cta/texture-bg.webp" alt="" fill sizes="(max-width: 991px) 100vw, 44rem" quality={75} className={p.texture} />
        <div aria-hidden="true">
          <Window />
        </div>
      </div>
      <figcaption className={p.caption}>{caption}</figcaption>
      <p className="sr-only">{summary}</p>
    </figure>
  );
}
