import type { CSSProperties, ReactNode } from "react";
import { numbersCopy, storyCopy } from "@/lib/content/products";
import { customerLogos, logoHeightRem } from "@/lib/content/logos";
import { trust } from "@/lib/content/site";
import s from "./proof.module.css";

/**
 * Left column of /contact and /book-a-demo (client, Nov 2026: "proof-led"): the
 * three verified figures as small cards, the Good Day Chocolate result as a case card
 * with its recovery curve (shape only; PDF figure, no invented quote), and the
 * customer logo wall in single ink (DESIGN.md §E.10). Static markup; the hero's aside
 * entrance animates it in.
 */

const CURVE = "M0 46 C30 45 52 41 76 34 S120 16 150 6";
const LOGOS = customerLogos;

export default function ProofAside({ footer }: { footer?: ReactNode }) {
  return (
    <div className={s.aside}>
      <ul className={s.stats}>
        {numbersCopy.stats.map((st) => (
          <li key={st.label} className={s.stat}>
            <span className={s.statValue}>
              {st.prefix}
              {st.value}
              <span className={s.suffix}>{st.suffix}</span>
            </span>
            <span className={s.statLabel}>{st.label}</span>
          </li>
        ))}
      </ul>

      <figure className={s.case}>
        <div className={s.caseText}>
          <span className={s.caseLabel}>{storyCopy.label}</span>
          <p className={s.caseLine}>
            <b>{storyCopy.brand}</b> recovered <span className={s.money}>$53K</span> in invalid deductions within 6 months.
          </p>
        </div>
        <div className={s.spark} aria-hidden="true">
          <svg viewBox="0 0 150 50" preserveAspectRatio="none">
            <path d={`${CURVE} V50 H0 Z`} className={s.area} />
            <path d={CURVE} className={s.curve} />
          </svg>
          <span className={s.end} />
        </div>
        <figcaption className={s.note}>{numbersCopy.note}</figcaption>
      </figure>

      <div className={s.logos}>
        <p className={s.logosLabel}>
          <span>{trust.labelMuted}</span> {trust.label}
        </p>
        {/* Infinite marquee (home trust-strip pattern): two identical sets, the track
            moves −50% linearly; the duplicate set is hidden from assistive tech. */}
        <div className={s.marquee}>
          <ul className={s.track} aria-label="Customers">
            {[...LOGOS, ...LOGOS].map((l, i) => {
              const dup = i >= LOGOS.length;
              return (
                <li key={`${l.name}-${i}`} aria-hidden={dup || undefined}>
                  <span
                    className={s.logo}
                    role={dup ? undefined : "img"}
                    aria-label={dup ? undefined : l.name}
                    style={
                      {
                        "--h": `${logoHeightRem(l, 1700, 16, 30)}rem`,
                        aspectRatio: `${l.w} / ${l.h}`,
                        WebkitMaskImage: `url(${l.src})`,
                        maskImage: `url(${l.src})`,
                      } as CSSProperties
                    }
                  />
                </li>
              );
            })}
          </ul>
        </div>
      </div>
      {footer}
    </div>
  );
}
