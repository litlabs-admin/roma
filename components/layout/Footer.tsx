import { footer, type FooterLink } from "@/lib/content/site";
import { RomaGlyph } from "@/components/platform/mock/kit";
import Wordmark from "./Wordmark";
import s from "./footer.module.css";

/**
 * Footer — after Hyperline's: the closing band's dark colour carries straight on.
 * Top: a brand block (rosette, the home hero line with its serif accent, tagline) beside
 * four link columns grouped by intent (Product · Resources · Compare · Company).
 * A hairline, then one quiet bottom row: copyright left, legal + social right. Then the
 * oversized "roma" running off the bottom of the page.
 */

function FLink({ l, className }: { l: FooterLink; className: string }) {
  return (
    <a className={className} href={l.href} {...(l.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
      {l.label}
      {l.external && (
        <span className={s.ext} aria-hidden="true">
          ↗
        </span>
      )}
    </a>
  );
}

export default function Footer() {
  const { brand } = footer;
  return (
    <footer className={s.footer}>
      <div className={s.inner}>
        <div className={s.top}>
          <div className={s.brand}>
            <span className={s.mark} aria-hidden="true">
              <RomaGlyph className={s.rosette} />
            </span>
            <p className={s.line}>
              {brand.line.before}
              <span className="accent">{brand.line.accent}</span>
              {brand.line.after}
            </p>
            <p className={s.tagline}>{brand.tagline}</p>
          </div>

          <div className={s.grid}>
            {footer.columns.map((col) => (
              <nav key={col.title} className={s.col} aria-label={col.title}>
                <h3 className={s.colTitle}>{col.title}</h3>
                <ul className={s.links}>
                  {col.links.map((l) => (
                    <li key={l.label}>
                      <FLink l={l} className={s.link} />
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        <div className={s.bottom}>
          <span>{footer.copyright}</span>
          <nav className={s.meta} aria-label="Legal and social">
            {[...footer.legal, ...footer.social].map((l) => (
              <FLink key={l.label} l={l} className={s.metaLink} />
            ))}
          </nav>
        </div>
      </div>

      <Wordmark />
      <span className="sr-only">Roma</span>
    </footer>
  );
}
