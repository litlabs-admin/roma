"use client";

import Image from "next/image";
import Link from "next/link";
import { useLayoutEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/motion";
import { refreshWhenReady } from "@/components/platform/motion";
import { BACKDROP_RANGES } from "@/components/motion/PageBackdrop";
import BrandMark from "@/components/customers/BrandMark";
import RollingNumber from "@/components/calculator/RollingNumber";
import { getStory, storyHref } from "@/lib/content/customers";
import { SECURITY, STATS, pricingCopy } from "@/lib/content/pricing";
import s from "./proofRed.module.css";

/**
 * Proof on the red stretch of the page backdrop (DESIGN.md §G.4, §G.17/§G.18), like
 * /platform's Proof: `data-backdrop="red"`, so PageBackdrop fades the red in as it rises.
 * Text outside the cards crosses ink → white over the same scrubbed range, so contrast
 * holds at every scroll position (SSR = final, white). Story figures and stats roll in as
 * odometers; cards rise with a short stagger. `security` adds the compliance row (pricing).
 */

const INK = "#111111";
const INK_MUTED = "#5a574f";
const ON_DARK = "#ffffff";
const ON_DARK_MUTED = "rgba(255, 255, 255, 0.8)";

const ICONS = [
  <path key="a" d="M8 1.8 13 3.6v4.1c0 3-2.1 5.4-5 6.5-2.9-1.1-5-3.5-5-6.5V3.6zM5.8 8l1.6 1.6 3-3.2" />,
  <path key="b" d="M8 1.8a4.2 4.2 0 1 1 0 8.4 4.2 4.2 0 0 1 0-8.4zM5.6 9.6 4.8 14.2 8 12.6l3.2 1.6-.8-4.6" />,
  <path key="c" d="M3.5 7h9v6.5h-9zM5.5 7V5a2.5 2.5 0 0 1 5 0v2" />,
  <path key="d" d="M3.5 8.5 6.5 11.5 12.5 5" />,
];

type Props = {
  label?: string;
  heading?: { before: string; accent: string; after: string };
  security?: boolean;
};

export default function ProofRed({ label = pricingCopy.proof.label, heading = pricingCopy.proof.heading, security = false }: Props) {
  const root = useRef<HTMLElement>(null);
  const C = pricingCopy.proof;
  const stories = C.stories.map((slug) => getStory(slug)).filter((st): st is NonNullable<typeof st> => !!st);

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
        .fromTo(el, { "--pr-fg": INK, "--pr-muted": INK_MUTED }, { "--pr-fg": ON_DARK, "--pr-muted": ON_DARK_MUTED, ease: "none", duration: 0.16 }, 0.42)
        .to({}, { duration: 0 }, 1);
      gsap.fromTo(
        q("[data-pr-head]"),
        { autoAlpha: 0, y: 16 },
        { autoAlpha: 1, y: 0, duration: 0.5, ease: "power3.out", stagger: 0.09, scrollTrigger: { trigger: el, start: "top 75%", once: true } },
      );
      gsap.fromTo(
        q("[data-pr-card]"),
        { autoAlpha: 0, y: 36 },
        { autoAlpha: 1, y: 0, duration: 0.8, ease: "power3.out", stagger: 0.12, scrollTrigger: { trigger: q("[data-pr-grid]")[0], start: "top 80%", once: true } },
      );
      gsap.fromTo(
        q("[data-pr-sec]"),
        { autoAlpha: 0, y: 12 },
        { autoAlpha: 1, y: 0, duration: 0.5, ease: "power3.out", stagger: 0.08, scrollTrigger: { trigger: q("[data-pr-security]")[0] ?? el, start: "top 85%", once: true } },
      );
    }, el);
    const stop = refreshWhenReady();
    return () => {
      stop();
      ctx.revert();
    };
  }, []);

  return (
    <section ref={root} className={s.section} data-backdrop="red" aria-labelledby="proof-red-heading">
      <div className={`container-lg ${s.inner}`}>
        <div className={s.head}>
          <p className={`${s.label} type-label`} data-pr-head>
            <span className={s.dot} aria-hidden="true" />
            {label}
          </p>
          <h2 id="proof-red-heading" className={`${s.heading} type-h2`} data-pr-head>
            {heading.before}
            <span className="accent">{heading.accent}</span>
            {heading.after}
          </h2>
        </div>

        <div className={s.grid} data-pr-grid>
          {stories.map((st) => {
            const m = st.metrics[0];
            return (
              <article key={st.slug} className={s.story} data-pr-card>
                <BrandMark brand={st.brand} className={s.mark} />
                <div className={s.storyBody}>
                  <p className={s.figure}>
                    <RollingNumber text={m.figure} rollIn />
                  </p>
                  <p className={s.metric}>{m.label}</p>
                  <h3 className={s.title}>
                    <Link href={storyHref(st.slug)} className={s.stretch}>
                      {st.cardTitle}
                    </Link>
                  </h3>
                  <span className={s.read} aria-hidden="true">
                    {C.readStory}
                    <svg viewBox="0 0 16 16">
                      <path d="M3 8h10M9 4l4 4-4 4" />
                    </svg>
                  </span>
                </div>
              </article>
            );
          })}

          <dl className={s.stats} data-pr-card>
            {STATS.map((st) => (
              <div key={st.label} className={s.stat}>
                <dt>{st.label}</dt>
                <dd>
                  <RollingNumber text={st.figure} rollIn />
                </dd>
              </div>
            ))}
          </dl>
        </div>
        <p className={s.note} data-pr-head>
          {C.note}
        </p>

        {security && (
          <div className={s.security} data-pr-security>
            <p className={`${s.secLabel} type-label`}>{C.securityLabel}</p>
            <ul className={s.secList}>
              {SECURITY.map((it, i) => (
                <li key={it.title} className={`${s.secItem} ${it.badge ? s.secItemBadge : ""}`} data-pr-sec>
                  {it.badge ? (
                    <Image src={it.badge.src} alt={it.badge.alt} width={512} height={512} sizes="4rem" quality={85} className={s.secBadge} />
                  ) : (
                    <span className={s.secIcon} aria-hidden="true">
                      <svg viewBox="0 0 16 16">{ICONS[i]}</svg>
                    </span>
                  )}
                  <span>
                    <span className={s.secTitle}>{it.title}</span>
                    <span className={s.secBody}>{it.body}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
