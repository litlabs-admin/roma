import { footer } from "@/lib/content/site";
import Wordmark from "./Wordmark";
import s from "./footer.module.css";

/**
 * Footer — after Hyperline's: the closing band's dark colour carries straight on, a
 * plain grid of link columns, one quiet bottom row, then the oversized "roma"
 * running off the bottom of the page.
 */
export default function Footer() {
  return (
    <footer className={s.footer}>
      <div className={s.inner}>
        <div className={s.grid}>
          {footer.columns.map((col) => (
            <nav key={col.title} className={s.col} aria-label={col.title}>
              <h3 className={s.colTitle}>{col.title}</h3>
              <ul className={s.links}>
                {col.links.map((l) => (
                  <li key={l.label}>
                    <a className={s.link} href={l.href} {...(l.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className={s.bottom}>
          <span>{footer.tagline}</span>
          <span>{footer.copyright}</span>
        </div>
      </div>

      <Wordmark />
      <span className="sr-only">Roma</span>
    </footer>
  );
}
