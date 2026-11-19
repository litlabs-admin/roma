"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/motion";
import { APART, QUOTES } from "@/lib/content/compare/roma";
import type { ApartRow } from "@/lib/content/compare/types";
import { RomaGlyph } from "@/components/platform/mock/kit";
import { refreshWhenReady, rise } from "@/components/platform/motion";
import { useCompare } from "./context";
import SectionHead from "./SectionHead";
import Cite from "./Cite";
import CompetitorMark from "./CompetitorMark";
import ClassifyVisual from "./visuals/ClassifyVisual";
import BackupsVisual from "./visuals/BackupsVisual";
import PenToggle from "./visuals/PenToggle";
import PriceVisual from "./visuals/PriceVisual";
import c from "./compare.module.css";
import s from "./apart.module.css";

/**
 * "Where Roma stands apart" (DESIGN.md §G.13). Three or four rows, each one point of
 * difference: an "X, not Y" headline, two lines, a Roma | competitor contrast (the
 * competitor in its own cited words), an optional customer report or quote, and one
 * illustration from the visual library. Rows alternate sides; the who-does-what toggle
 * (`control`) needs the full width, so its row stacks the text above it.
 */

function Visual({ kind }: { kind: ApartRow["visual"] }) {
  if (kind === "classify") return <ClassifyVisual />;
  if (kind === "backups") return <BackupsVisual />;
  if (kind === "price") return <PriceVisual />;
  return <PenToggle />;
}

export default function StandApart() {
  const { c: comp } = useCompare();
  const root = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const el = root.current;
    if (!el || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(el);
      rise(q("[data-cmp-head]"), q("[data-cmp-head]")[0]);
      q("[data-sa='row']").forEach((row) => {
        const rq = gsap.utils.selector(row);
        rise(rq("[data-sa='text'] > *"), row, {
          stagger: 0.07,
          start: "top 80%",
        });
        rise(rq("[data-sa='well']"), row, {
          y: 24,
          duration: 0.7,
          start: "top 80%",
        });
      });
    }, el);
    const stop = refreshWhenReady();
    return () => {
      stop();
      ctx.revert();
    };
  }, []);

  return (
    <section ref={root} className={c.section} aria-labelledby="apart-heading">
      <div className={c.inner}>
        <SectionHead
          id="apart-heading"
          label="Why brands choose Roma"
          heading={comp.apart.heading}
          lead={comp.apart.lead}
          split
        />

        <ol className={s.rows}>
          {comp.apart.rows.map((row, i) => {
            const base = APART[row.visual];
            const wide = row.visual === "control";
            // Alternate sides among the split rows only (the wide row has no side).
            const flip =
              comp.apart.rows.slice(0, i).filter((r) => r.visual !== "control")
                .length %
                2 ===
              1;
            const quote = row.quote ? QUOTES[row.quote] : undefined;
            const badge = "badge" in base ? base.badge : undefined;
            return (
              <li
                key={row.visual}
                className={`${s.row} ${wide ? s.wide : flip ? s.flip : ""}`}
                data-sa="row"
              >
                <div className={s.text} data-sa="text">
                  <div className={s.textHead}>
                    <p className={s.kicker}>
                      <span className={s.num}>
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      {base.label}
                      {badge && <span className={s.badgeNew}>{badge}</span>}
                    </p>
                    <h3 className={s.title}>{row.title ?? base.title}</h3>
                    <p className={s.body}>{row.body ?? base.body}</p>
                  </div>

                  <div className={s.textSide}>
                    <dl className={s.contrast}>
                      <div className={s.side}>
                        <dt>
                          <span className={s.mRoma} aria-hidden="true">
                            <RomaGlyph className={s.rosette} />
                          </span>
                          Roma
                        </dt>
                        <dd className={s.romaVal}>{base.roma}</dd>
                      </div>
                      {row.them && (
                        <div className={s.side}>
                          <dt>
                            <span className={s.mThem} aria-hidden="true">
                              <CompetitorMark />
                            </span>
                            {comp.name}
                          </dt>
                          <dd className={s.themVal}>
                            {row.them.text}
                            {row.them.source && <Cite id={row.them.source} />}
                          </dd>
                        </div>
                      )}
                    </dl>

                    {row.note && <p className={s.note}>{row.note}</p>}
                    {quote && (
                      <figure className={s.quote}>
                        <blockquote>“{quote.text}”</blockquote>
                        <figcaption>
                          <b>{quote.name}</b>, {quote.company}
                        </figcaption>
                      </figure>
                    )}
                  </div>
                </div>

                <div
                  className={`${s.well} ${flip ? s.wellNeutral : ""}`}
                  data-sa="well"
                >
                  <Visual kind={row.visual} />
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
