"use client";

import Image from "next/image";
import { useLayoutEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/motion";
import Button from "@/components/ui/Button";
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
export default function ClosingCta() {
  const root = useRef<HTMLElement>(null);
  const { before, accent, after } = closingCta.heading;

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
            {closingCta.sub}
          </p>
        </div>
        <div data-reveal>
          <Button href={closingCta.cta.href} variant="inverse">
            {closingCta.cta.label}
          </Button>
        </div>
      </div>
    </section>
  );
}
