"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/motion";
import Button from "@/components/ui/Button";
import ArrowLink from "@/components/ui/ArrowLink";
import { splitChars } from "@/components/ui/splitChars";
import { BACKDROP_RANGES } from "@/components/motion/PageBackdrop";
import { STORIES, storiesCopy } from "./data";
import StoryStrip from "./StoryStrip";
import s from "./stories.module.css";

/**
 * Customer stories — port of Hyperline's Testimonials, on the red stretch of the page
 * backdrop (`data-backdrop="red"`).
 *
 * The card row + quote is `StoryStrip` (shared with /customers). Text colour follows the backdrop: it crosses from ink to white over the
 * same scrubbed range the red fades in on, so contrast holds at every scroll position.
 */

const INK = "#111111";
const INK_MUTED = "#5a574f";
const ON_DARK = "#ffffff";
const ON_DARK_MUTED = "rgba(255, 255, 255, 0.78)";

export default function Stories() {
  const root = useRef<HTMLElement>(null);
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
              <ArrowLink href={storiesCopy.more.href} onDark>
                {storiesCopy.more.label}
              </ArrowLink>
            </div>
          </div>
        </div>

        <div data-reveal>
          <StoryStrip stories={STORIES} />
        </div>
      </div>
    </section>
  );
}
