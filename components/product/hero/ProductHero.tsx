"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";
import Image from "next/image";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/motion";
import { ILLUSTRATIVE, productCtas, type ProductHeroCopy } from "@/lib/content/products";
import Button from "@/components/ui/Button";
import { Glyph } from "@/components/platform/mock/kit";
import s from "./productHero.module.css";

/**
 * Shared hero frame for the product pages (DESIGN.md §G.11), built on the /platform
 * hero (§G.9): red-950 band with [data-hero], pill → title words → lead → actions, then
 * a wide card whose ground is a colour-graded photo for the page, the caption at the
 * top of the card, and the product art sitting flush on the band's bottom edge (flat
 * bottom corners, client 18 Nov).
 *
 * `layout`: "split" puts title left / lead right ≥992px (as /platform); "centered"
 * stacks everything on the axis (Analytics). The visual is a child and owns its own
 * load animation; it receives the card's entrance time through CSS order only.
 */

const T = { pill: 0.1, words: 0.2, wordStagger: 0.07, lead: 0.55, actions: 0.7, card: 0.6, cardDur: 1.1 };

type Props = {
  copy: ProductHeroCopy;
  layout?: "split" | "centered";
  /** Extra class on the card's inner sheet (per-page padding/perspective). */
  sheetClass?: string;
  /** Caption above the art; defaults to the "Illustrative data" line. */
  caption?: string;
  /** Replaces the eyebrow pill (the comparison pages' "Roma vs X" logo lockup). */
  pill?: ReactNode;
  children: ReactNode;
};

export default function ProductHero({ copy, layout = "split", sheetClass = "", caption = ILLUSTRATIVE, pill, children }: Props) {
  const root = useRef<HTMLElement>(null);
  const { before, accent, after } = copy.heading;
  const words = before.trim().split(/\s+/);

  useLayoutEffect(() => {
    const el = root.current;
    if (!el || prefersReducedMotion()) return;
    document.documentElement.classList.add("motion-ready");
    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(el);
      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .fromTo(q("[data-anim='pill']"), { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.8 }, T.pill)
        .fromTo(
          q("[data-w]"),
          { autoAlpha: 0, y: "0.45em", filter: "blur(8px)" },
          { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 0.9, stagger: T.wordStagger, clearProps: "filter" },
          T.words,
        )
        .fromTo(q("[data-anim='lead']"), { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.8 }, T.lead)
        .fromTo(q("[data-anim='actions']"), { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.8 }, T.actions)
        .fromTo(q("[data-anim='card']"), { autoAlpha: 0, y: 36 }, { autoAlpha: 1, y: 0, duration: T.cardDur }, T.card);
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} className={`${s.hero} ${layout === "centered" ? s.centered : ""}`} data-hero aria-labelledby="product-title">
      <div className={s.inner}>
        <div className={s.top}>
          <div className={s.titleCol}>
            {pill ? (
              <p className={s.pillSlot} data-anim="pill">
                {pill}
              </p>
            ) : (
              <p className={s.pill} data-anim="pill">
                <Glyph k={copy.icon} className={s.pillIcon} />
                {copy.eyebrow}
              </p>
            )}
            <h1 id="product-title" className={`${s.h1} type-h1`} aria-label={`${before}${accent}${after}`}>
              <span aria-hidden="true">
                {words.map((w, i) => (
                  <span key={i}>
                    <span className={s.w} data-w>
                      {w}
                    </span>{" "}
                  </span>
                ))}
                <span className={s.w} data-w>
                  <span className="accent">{accent}</span>
                  {after}
                </span>
              </span>
            </h1>
          </div>

          <div className={s.leadCol}>
            <p className={s.lead} data-anim="lead">
              {copy.lead}
            </p>
            <div className={s.actions} data-anim="actions">
              <Button href={productCtas.primary.href} variant="inverse">
                {productCtas.primary.label} →
              </Button>
              <Button href={productCtas.secondary.href} variant="ghostOnDark" className={s.secondary}>
                {productCtas.secondary.label}
              </Button>
            </div>
          </div>
        </div>

        <figure className={s.figure}>
          <div className={s.card} data-anim="card">
            <Image
              src={copy.ground.src}
              alt=""
              fill
              sizes="(max-width: 1200px) 100vw, 75rem"
              quality={85}
              fetchPriority="high"
              loading="eager"
              className={s.ground}
              style={{ objectPosition: copy.ground.position }}
            />
            <figcaption className={s.caption}>{caption}</figcaption>
            <div className={`${s.sheet} ${sheetClass}`}>{children}</div>
          </div>
          <p className="sr-only">{copy.summary}</p>
        </figure>
      </div>
    </section>
  );
}
