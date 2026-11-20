"use client";

import Image from "next/image";
import { useLayoutEffect, useRef, type MouseEvent } from "react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/motion";
import Button from "@/components/ui/Button";
import { scrollToTarget } from "@/components/motion/SmoothScroll";
import { closingCta } from "@/lib/content/site";
import s from "./closing.module.css";

/**
 * Closing CTA — Roma's port of Hyperline's PreFooterCta, without the product carousel:
 * type and background only.
 *
 * Layers (Hyperline): warm near-black base → the blurred amber texture (`object-fit:
 * cover`) → a scrim darkening the top 42% behind the copy. Roma adds a fade into the
 * footer black at the bottom, where Hyperline's mockup used to hide the seam. The
 * band tucks under the FAQ sheet's rounded bottom corners.
 */
type Cta = { label: string; href: string };
type Copy = { heading: { before: string; accent: string; after: string }; sub: string; cta: Cta };

/**
 * Try now leads; `secondary` (default: Book a demo) sits beside it as an outline button.
 * `copy` swaps heading, sub and primary CTA for a page's own (e.g. /partners); an
 * in-page hash CTA scrolls via Lenis.
 */
export default function ClosingCta({ secondary = closingCta.secondary, copy = closingCta }: { secondary?: Cta; copy?: Copy } = {}) {
  const root = useRef<HTMLElement>(null);
  const { before, accent, after } = copy.heading;
  const onCta = copy.cta.href.startsWith("#")
    ? (e: MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        scrollToTarget(copy.cta.href);
      }
    : undefined;

  useLayoutEffect(() => {
    const el = root.current;
    if (!el || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el.querySelectorAll("[data-reveal]"),
        { autoAlpha: 0, y: 16 },
        { autoAlpha: 1, y: 0, duration: 0.5, ease: "power3.out", stagger: 0.09, scrollTrigger: { trigger: el, start: "top 80%", once: true } },
      );
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} className={s.section} aria-labelledby="closing-heading">
      <Image src="/images/cta/texture-bg.webp" alt="" fill sizes="100vw" quality={85} className={s.texture} />
      <span className={s.scrim} aria-hidden="true" />
      <span className={s.fade} aria-hidden="true" />

      <div className={s.inner}>
        <div className={s.copy}>
          <h2 id="closing-heading" className={s.heading} data-reveal>
            {before}
            <span className="accent">{accent}</span>
            {after}
          </h2>
          <p className={s.sub} data-reveal>
            {copy.sub}
          </p>
        </div>
        <div className={s.actions} data-reveal>
          <Button href={copy.cta.href} onClick={onCta} variant="inverse">
            {copy.cta.label}
          </Button>
          {secondary && (
            <Button href={secondary.href} variant="ghostOnDark" className={s.secondary}>
              {secondary.label}
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}
