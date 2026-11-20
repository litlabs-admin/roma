import type { FloretStory } from "@/lib/content/compare/types";
import CompetitorLogo from "./CompetitorLogo";
import Cite from "./Cite";
import c from "./compare.module.css";
import s from "./alike.module.css";

/**
 * Floret "Where we're alike" (DESIGN.md §G.13): text only, on purpose. Floret is the
 * closest alternative, so the page says so plainly, quotes Floret on keeping disputes
 * in-house, and names the one real difference: how you start.
 */
export default function AlikeCallout({ alike }: { alike: FloretStory["alike"] }) {
  return (
    <section className={c.section} aria-labelledby="alike-heading">
      <div className={c.inner}>
        <div className={s.wrap}>
          <div className={s.main}>
            <p className={`${c.label} type-label`}>The honest version</p>
            <h2 id="alike-heading" className={`${s.title} type-h2`}>
              {alike.heading.before}
              <span className="accent">{alike.heading.accent}</span>
              {alike.heading.after}
            </h2>
            <p className={s.body}>{alike.body}</p>
          </div>
          <figure className={s.quote}>
            <CompetitorLogo label height={1.3} />
            <blockquote className={s.text}>
              “{alike.quote.text}”{alike.quote.source && <Cite id={alike.quote.source} />}
            </blockquote>
            <figcaption className={s.cap}>On disputes, in its own words</figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
