"use client";

import { useLayoutEffect, useRef, type CSSProperties } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/motion";
import { WALL, wallCopy, yourTag, type WallTag } from "@/lib/content/customers";
import { productCtas } from "@/lib/content/products";
import { BACKDROP_RANGES } from "@/components/motion/PageBackdrop";
import { SourcePill } from "@/components/platform/mock/kit";
import { refreshWhenReady } from "@/components/platform/motion";
import Button from "@/components/ui/Button";
import Barcode from "./Barcode";
import s from "./tagWall.module.css";

/**
 * "More from the shelf" + your own tag (DESIGN.md §G.15), on the red stretch of the
 * page backdrop (`data-backdrop="red"`). Short stories hang as white shelf tags at a
 * slight tilt; pointing at one straightens it and runs a scan line across its barcode.
 * Smash Kitchen is a receipt with its PDF figure only (no invented quote). Then one big
 * blank tag, "Your brand · $— recovered", holds the page's turn to conversion. Every
 * word sits inside a white card, so contrast never depends on the scrub; only the head
 * crosses ink → white with the backdrop (home Stories timing).
 */

const INK = "#111111";
const INK_MUTED = "#5a574f";
const ON_DARK = "#ffffff";
const ON_DARK_MUTED = "rgba(255, 255, 255, 0.78)";

function Tag({ t }: { t: WallTag }) {
  const receipt = !t.quote;
  return (
    <li className={s.cell} data-tw="tag">
      <article id={t.id} className={`${s.tag} ${receipt ? s.receipt : ""}`} style={{ "--tilt": `${t.tilt}deg` } as CSSProperties} tabIndex={-1} aria-label={t.brand}>
        <span className={s.hole} aria-hidden="true" />
        <p className={s.brand}>{t.brand}</p>
        <p className={s.figure}>{t.figure}</p>
        <p className={s.label}>{t.label}</p>
        {t.quote && (
          <figure className={s.quote}>
            <blockquote>
              <p>“{t.quote}”</p>
            </blockquote>
            <figcaption>
              <b>{t.name}</b>, {t.role}
            </figcaption>
          </figure>
        )}
        <div className={s.foot}>
          {t.channels ? (
            <span className={s.pills}>
              {t.channels.map((c) => (
                <SourcePill key={c}>{c}</SourcePill>
              ))}
            </span>
          ) : (
            <span className={s.receiptNote}>Recovered with Roma</span>
          )}
          <span className={s.code} aria-hidden="true">
            <Barcode code={t.sku} className={s.bars} />
            <span className={s.scan} />
          </span>
        </div>
      </article>
    </li>
  );
}

export default function TagWall() {
  const root = useRef<HTMLElement>(null);
  const { before, accent, after } = wallCopy.heading;
  const yt = yourTag.heading;

  useLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
    if (prefersReducedMotion()) {
      el.setAttribute("data-static", "");
      return () => el.removeAttribute("data-static");
    }
    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(el);
      gsap
        .timeline({ scrollTrigger: { trigger: el, ...BACKDROP_RANGES.red, scrub: true } })
        .fromTo(el, { "--tw-fg": INK, "--tw-muted": INK_MUTED }, { "--tw-fg": ON_DARK, "--tw-muted": ON_DARK_MUTED, ease: "none", duration: 0.16 }, 0.42)
        .to({}, { duration: 0 }, 1);
      gsap.fromTo(
        q("[data-tw='head']"),
        { autoAlpha: 0, y: 16 },
        { autoAlpha: 1, y: 0, duration: 0.5, ease: "power3.out", stagger: 0.09, scrollTrigger: { trigger: el, start: "top 75%", once: true } },
      );
      gsap.fromTo(
        q("[data-tw='tag']"),
        { autoAlpha: 0, y: 28 },
        { autoAlpha: 1, y: 0, duration: 0.6, ease: "power3.out", stagger: 0.08, scrollTrigger: { trigger: q("[data-tw='wall']")[0], start: "top 80%", once: true } },
      );
      const you = q("[data-tw='you']")[0];
      const tl = gsap.timeline({ paused: true, defaults: { ease: "power3.out" } });
      tl.fromTo(you, { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: 0.8 }, 0)
        .fromTo(q("[data-tw='blank']"), { autoAlpha: 0, y: -30, rotation: -8 }, { autoAlpha: 1, y: 0, rotation: -3, duration: 0.9, ease: "back.out(1.4)" }, 0.25)
        .add(() => you?.setAttribute("data-on", ""), 1.0);
      ScrollTrigger.create({ trigger: you, start: "top 75%", once: true, onEnter: () => void tl.play() });
    }, el);
    const stop = refreshWhenReady();
    return () => {
      stop();
      ctx.revert();
      el.querySelector("[data-tw='you']")?.removeAttribute("data-on");
    };
  }, []);

  return (
    <section ref={root} className={s.section} data-backdrop="red" aria-labelledby="wall-heading">
      <div className={s.inner}>
        <header className={s.head}>
          <p className={`${s.eyebrow} type-label`} data-tw="head">
            {wallCopy.label}
          </p>
          <h2 id="wall-heading" className={`${s.h2} type-h2`} data-tw="head">
            {before}
            <span className="accent">{accent}</span>
            {after}
          </h2>
          <p className={s.lead} data-tw="head">
            {wallCopy.lead}
          </p>
        </header>

        <ul className={s.wall} data-tw="wall">
          {WALL.map((t) => (
            <Tag key={t.id} t={t} />
          ))}
        </ul>
        <p className={s.note}>{wallCopy.note}</p>

        {/* your tag: the turn to conversion */}
        <div className={s.you} data-tw="you">
          <div className={s.blankWrap} aria-hidden="true">
            <div className={s.blank} data-tw="blank">
              <span className={s.hole} />
              <p className={s.blankBrand}>{yourTag.label}</p>
              <p className={s.blankFigure}>
                $<span className={s.caret} />
              </p>
              <p className={s.blankLabel}>{yourTag.figureLabel}</p>
              <span className={s.blankLines}>
                <i />
                <i />
              </span>
              <span className={s.blankFoot}>
                <Barcode code={yourTag.sku} className={s.bars} />
                <span>{yourTag.sku}</span>
              </span>
            </div>
          </div>
          <div className={s.youText}>
            <h2 className={`${s.youH2} type-h3`}>
              {yt.before}
              <span className="accent">{yt.accent}</span>
              {yt.after}
            </h2>
            <p className={s.youBody}>{yourTag.body}</p>
            <div className={s.actions}>
              <Button href={productCtas.primary.href} variant="primary">
                {productCtas.primary.label} →
              </Button>
              <Button href={productCtas.secondary.href} variant="secondary">
                {productCtas.secondary.label}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
