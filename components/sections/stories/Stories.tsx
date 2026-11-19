"use client";

import Image from "next/image";
import { useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/motion";
import Button from "@/components/ui/Button";
import { splitChars } from "@/components/ui/splitChars";
import { BACKDROP_RANGES } from "@/components/motion/PageBackdrop";
import { STORIES, storiesCopy, type Story } from "./data";
import s from "./stories.module.css";

/**
 * Customer stories — port of Hyperline's Testimonials, on the red stretch of the page
 * backdrop (`data-backdrop="red"`).
 *
 * Cards share a row with `flex-basis: 0`; the active one grows to 3× (flex-grow 3:1,
 * 500ms ease-out). Below 1024px they stack and the active one grows in height instead
 * (420 vs 88px). Inactive cards are full-card buttons; the quote below follows the
 * active card. Text colour follows the backdrop: it crosses from ink to white over the
 * same scrubbed range the red fades in on, so contrast holds at every scroll position.
 */

const INK = "#111111";
const INK_MUTED = "#5a574f";
const ON_DARK = "#ffffff";
const ON_DARK_MUTED = "rgba(255, 255, 255, 0.78)";

function LogoMark({ story }: { story: Story }) {
  if (!story.logo) return <span className={s.wordmark}>{story.brand}</span>;
  const style = { "--logo": `url(${story.logo.src})`, aspectRatio: `${story.logo.w} / ${story.logo.h}` } as CSSProperties;
  return <span className={s.logo} style={style} role="img" aria-label={story.brand} />;
}

export default function Stories() {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const story = STORIES[active];
  const { heading } = storiesCopy;

  useLayoutEffect(() => {
    const el = root.current;
    if (!el || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(el);
      // Text colour follows the red backdrop (same scrubbed range), but not linearly: a
      // half-way grey is unreadable on half-way rose. Ink holds while the backdrop is
      // still light, then flips to white over a short window once the red dominates.
      gsap
        .timeline({ scrollTrigger: { trigger: el, ...BACKDROP_RANGES.red, scrub: true } })
        .fromTo(
          el,
          { "--st-fg": INK, "--st-muted": INK_MUTED },
          { "--st-fg": ON_DARK, "--st-muted": ON_DARK_MUTED, ease: "none", duration: 0.16 },
          0.42,
        )
        .to({}, { duration: 0 }, 1);
      gsap.fromTo(
        q("[data-char]"),
        { opacity: 0.4 },
        { opacity: 1, stagger: 0.02, duration: 0.2, ease: "none", scrollTrigger: { trigger: q("h2")[0], start: "top bottom", end: "top 30%", scrub: true } },
      );
      // Hyperline Reveal: 16px rise, 0.5s, 90ms stagger, once.
      gsap.fromTo(
        q("[data-reveal]"),
        { autoAlpha: 0, y: 16 },
        { autoAlpha: 1, y: 0, duration: 0.5, ease: "power3.out", stagger: 0.09, scrollTrigger: { trigger: el, start: "top 75%", once: true } },
      );
    }, el);
    return () => ctx.revert();
  }, []);

  const { before, accent, after } = heading;

  return (
    <section ref={root} id="stories" className={s.section} data-backdrop="red" aria-labelledby="stories-heading">
      <div className={s.inner}>
        <div className={s.header} data-reveal>
          <h2 id="stories-heading" className={`${s.heading} type-h3`} aria-label={`${before}${accent}${after}`}>
            <span aria-hidden="true">
              {splitChars(before, false, "a")}
              {splitChars(accent, true, "b")}
              {splitChars(after, false, "c")}
            </span>
          </h2>
          <div className={s.side}>
            <p className={s.lead}>{storiesCopy.lead}</p>
            <div className={s.actions}>
              <Button href={storiesCopy.cta.href} variant="inverse" size="small">
                {storiesCopy.cta.label}
              </Button>
            </div>
          </div>
        </div>

        <div className={s.stories} data-reveal>
          <ul className={s.row}>
            {STORIES.map((st, i) => {
              const on = i === active;
              return (
                <li key={st.brand} className={s.card} data-active={on || undefined} style={{ flexGrow: on ? 3 : 1 }}>
                  <Image
                    src={st.photo.src}
                    alt=""
                    fill
                    sizes="(max-width: 1023px) 100vw, 45rem"
                    quality={85}
                    className={s.photo}
                    style={{ objectPosition: st.photo.position }}
                  />
                  <span className={s.scrim} aria-hidden="true" />
                  {!on && (
                    <button type="button" className={s.hit} onClick={() => setActive(i)} aria-label={`Show ${st.brand}'s story`} />
                  )}
                  <div className={s.bar}>
                    <LogoMark story={st} />
                    <div className={s.extras} aria-hidden={!on}>
                      <span className={s.metric}>{st.metric}</span>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>

          <figure className={s.quote} aria-live="polite">
            <div key={active} className={s.quoteInner}>
              <blockquote className={s.quoteText}>{story.quote}</blockquote>
              <figcaption className={s.author}>{story.author}</figcaption>
            </div>
          </figure>
        </div>
      </div>
    </section>
  );
}
