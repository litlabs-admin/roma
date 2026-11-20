"use client";

import { useLayoutEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/motion";
import { founder } from "@/lib/content/partners";
import { playOnce, refreshWhenReady } from "@/components/platform/motion";
import s from "./founder.module.css";

/**
 * Founder note (DESIGN.md §G.16; layout from the client's reference screenshot): a
 * full-bleed ink band, the cut-out portrait standing on the band's bottom edge and
 * breaking out above its top, the quote beside it with a short red rule and the
 * attribution. Stacks below 992px (portrait first). One-shot rise.
 * MOCK: the quote is placeholder copy (lib/content/partners.ts).
 */

export default function FounderNote() {
  const root = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const el = root.current;
    if (!el || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(el);
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.fromTo(q("[data-fn='photo']"), { autoAlpha: 0, y: 32 }, { autoAlpha: 1, y: 0, duration: 1 })
        .fromTo(q("[data-fn='quote']"), { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.7 }, 0.2)
        .fromTo(q("[data-fn='rule']"), { scaleX: 0 }, { scaleX: 1, duration: 0.6, ease: "power2.inOut" }, 0.55)
        .fromTo(q("[data-fn='by']"), { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.5 }, 0.7);
      playOnce(el, tl, "top 70%");
    }, el);
    const off = refreshWhenReady();
    return () => {
      off();
      ctx.revert();
    };
  }, []);

  return (
    <section ref={root} className={s.section} aria-label="A note from Roma's founder">
      <div className={s.band}>
        <div className={s.inner}>
          <div className={s.photoCol}>
            <Image
              src={founder.photo.src}
              alt={`${founder.name}, ${founder.role}`}
              width={founder.photo.width}
              height={founder.photo.height}
              sizes="(max-width: 991px) 18rem, 32rem"
              quality={85}
              className={s.photo}
              data-fn="photo"
            />
          </div>
          <figure className={s.copy}>
            <blockquote className={s.quote} data-fn="quote">
              <p>{founder.quote}</p>
            </blockquote>
            <span className={s.rule} data-fn="rule" aria-hidden="true" />
            <figcaption className={s.by} data-fn="by">
              <b>{founder.name},</b>
              <span>{founder.role}</span>
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
