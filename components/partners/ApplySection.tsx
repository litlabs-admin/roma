"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/motion";
import { APPLY_ID, applyCopy as a } from "@/lib/content/partners";
import { BACKDROP_RANGES } from "@/components/motion/PageBackdrop";
import { refreshWhenReady, rise } from "@/components/platform/motion";
import LeadForm from "@/components/forms/LeadForm";
import c from "@/components/contact/contact.module.css";
import s from "./apply.module.css";

/**
 * Apply (DESIGN.md §G.16): the partner application on the red stretch of the page
 * backdrop (`data-backdrop="red"`, §G.4), like Proof / Stories on the other pages. Copy
 * outside the card uses --ap-fg / --ap-muted, scrubbed ink → white on the red range
 * (Proof.tsx timing); the white form card (the /contact card) is unchanged. Reduced
 * motion: a static red band ([data-static]). The FAQ sheet then rides up over the red.
 */

const INK = "#111111";
const INK_MUTED = "#5a574f";
const ON_DARK = "#ffffff";
const ON_DARK_MUTED = "rgba(255, 255, 255, 0.78)";

export default function ApplySection() {
  const root = useRef<HTMLElement>(null);

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
        .fromTo(el, { "--ap-fg": INK, "--ap-muted": INK_MUTED }, { "--ap-fg": ON_DARK, "--ap-muted": ON_DARK_MUTED, ease: "none", duration: 0.16 }, 0.42)
        .to({}, { duration: 0 }, 1);
      rise(q("[data-ap]"), el, { start: "top 75%" });
    }, el);
    const off = refreshWhenReady();
    return () => {
      off();
      ctx.revert();
    };
  }, []);

  return (
    <section ref={root} id={APPLY_ID} className={s.section} data-backdrop="red" aria-labelledby="pt-apply">
      <div className={s.inner}>
        <div className={s.copy}>
          <p className={`${s.label} type-label`} data-ap>
            {a.label}
          </p>
          <h2 id="pt-apply" className={`${s.h2} type-h2`} data-ap>
            {a.heading.before}
            <span className="accent">{a.heading.accent}</span>
            {a.heading.after}
          </h2>
          <p className={s.lead} data-ap>
            {a.lead}
          </p>
          <div className={s.next} data-ap>
            <p className={`${s.nextTitle} type-label`}>{a.next.title}</p>
            <ol className={s.nextList}>
              {a.next.items.map((x, i) => (
                <li key={x}>
                  <span className={s.nextNum}>{i + 1}</span>
                  {x}
                </li>
              ))}
            </ol>
          </div>
        </div>

        <div className={c.cardCol} data-ap>
          <div className={c.card}>
            <div className={c.cardHead}>
              <h3 className={`${c.cardTitle} type-h5`}>{a.formTitle}</h3>
              <p className={c.cardSub}>{a.formSub}</p>
            </div>
            <LeadForm kind="partner" />
          </div>
        </div>
      </div>
    </section>
  );
}
