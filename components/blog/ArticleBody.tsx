import Image from "next/image";
import type { Block } from "@/lib/content/blog";
import { renderInline } from "./inline";
import ProductFigure from "./ProductFigure";
import CalculatorBanner from "@/components/calculator/CalculatorBanner";
import a from "./article.module.css";

/**
 * Renders an article's typed blocks with the §G.10 prose styles. Headings, figures,
 * callouts and tables carry [data-reveal] (one-shot rise via <Reveal mode="each">);
 * running text never animates, so reading is never interrupted.
 */
export default function ArticleBody({ blocks }: { blocks: Block[] }) {
  return (
    <>
      {blocks.map((b, i) => {
        switch (b.type) {
          case "p":
            return <p key={i}>{renderInline(b.text, a.inlineLink)}</p>;
          case "h2":
            return (
              <h2 key={i} id={b.id} className="type-h4" data-reveal>
                {b.text}
              </h2>
            );
          case "h3":
            return (
              <h3 key={i} className="type-h5">
                {b.text}
              </h3>
            );
          case "ul":
            return (
              <ul key={i} className={a.list}>
                {b.items.map((t, j) => (
                  <li key={j}>{renderInline(t, a.inlineLink)}</li>
                ))}
              </ul>
            );
          case "ol":
            return (
              <ol key={i} className={a.steps}>
                {b.items.map((t, j) => (
                  <li key={j}>{renderInline(t, a.inlineLink)}</li>
                ))}
              </ol>
            );
          case "quote":
            return (
              <blockquote key={i} className={a.quote} data-reveal>
                <p>{b.text}</p>
              </blockquote>
            );
          case "callout":
            return (
              <aside key={i} className={a.callout} data-reveal>
                <p className={`${a.calloutLabel} type-label`}>{b.label}</p>
                <p className={a.calloutText}>{renderInline(b.text, a.inlineLink)}</p>
              </aside>
            );
          case "figure":
            return (
              <figure key={i} className={a.figure} data-reveal>
                <div className={a.figureMedia} style={{ aspectRatio: `${b.image.width} / ${b.image.height}` }}>
                  <Image src={b.image.src} alt={b.image.alt} fill sizes="(max-width: 991px) 100vw, 44rem" quality={75} className={a.figureImg} />
                </div>
                <figcaption className={a.caption}>{b.caption}</figcaption>
              </figure>
            );
          case "calculator":
            return (
              <div key={i} data-reveal>
                <CalculatorBanner inline />
              </div>
            );
          case "product":
            return <ProductFigure key={i} figure={b.figure} caption={b.caption} summary={b.summary} />;
          case "table":
            return (
              <figure key={i} className={a.tableFigure} data-reveal>
                <div className={a.tableScroll} tabIndex={0} role="region" aria-label={b.caption}>
                  <table className={a.table}>
                    <thead>
                      <tr>
                        {b.head.map((h) => (
                          <th key={h} scope="col">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {b.rows.map((r, j) => (
                        <tr key={j}>
                          {r.map((c, k) =>
                            k === 0 ? (
                              <th key={k} scope="row">
                                {c}
                              </th>
                            ) : (
                              <td key={k}>{c}</td>
                            ),
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <figcaption className={a.caption}>{b.caption}</figcaption>
              </figure>
            );
        }
      })}
    </>
  );
}
