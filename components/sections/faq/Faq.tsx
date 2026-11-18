"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/motion";
import { FAQS, faqCopy } from "./data";
import s from "./faq.module.css";

/**
 * FAQ — Roma's adaptation of Fruitful's FAQ (components/faq.js + splitText.js
 * initHeadlines, `.faq-*` / `.is--page__end` CSS).
 *
 * - An opaque cream sheet with rounded corners: it slides up over the fixed red
 *   backdrop behind the stories and sits on the closing CTA below.
 * - Heading lines and each item rise in with a tilt (`yPercent 50, rotate 3` →
 *   rest, 0.5s `back.out(3)`) as they reach 80% of the viewport, and reset when
 *   scrolled back above the viewport — so the entrance replays, as on Fruitful.
 * - Answers open to `height: auto` with a soft overshoot (0.45s `back.out(1.7)`) and
 *   close fast (0.3s `power4.out`); the chevron flips 180° (`back.out(1.7)`).
 */

function replayOnEnter(trigger: Element, tl: gsap.core.Timeline) {
  ScrollTrigger.create({ trigger, start: "top bottom", onLeaveBack: () => void tl.progress(0).pause() });
  ScrollTrigger.create({ trigger, start: "top 80%", onEnter: () => void tl.play() });
}

/** `order`: optional indexes into FAQS, so a product page can lead with its own question. */
export default function Faq({ order }: { order?: number[] } = {}) {
  const items = order ? order.map((i) => FAQS[i]).filter(Boolean) : FAQS;
  const root = useRef<HTMLElement>(null);
  const answers = useRef<(HTMLDivElement | null)[]>([]);
  const icons = useRef<(SVGSVGElement | null)[]>([]);
  const [open, setOpen] = useState<boolean[]>(() => items.map(() => false));

  useLayoutEffect(() => {
    const el = root.current;
    if (!el || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(el);
      const rise = { opacity: 0, yPercent: 50, rotate: 3 };
      const rest = { opacity: 1, yPercent: 0, rotate: 0, duration: 0.5, ease: "back.out(3)" };

      const heading = q("[data-faq-heading]")[0];
      const lineTl = gsap.timeline({ paused: true }).fromTo(q("[data-faq-line]"), rise, { ...rest, stagger: { amount: 0.25 } });
      replayOnEnter(heading, lineTl);

      q("[data-faq-item]").forEach((item) => {
        replayOnEnter(item, gsap.timeline({ paused: true }).fromTo(item, rise, rest));
      });
    }, el);
    return () => ctx.revert();
  }, []);

  const toggle = (i: number) => {
    const next = !open[i];
    setOpen((o) => o.map((v, j) => (j === i ? next : v)));
    const answer = answers.current[i];
    const icon = icons.current[i];
    const instant = prefersReducedMotion();
    if (answer) {
      gsap.to(answer, {
        height: next ? "auto" : 0,
        duration: instant ? 0 : next ? 0.45 : 0.3,
        ease: next ? "back.out(1.7)" : "power4.out",
        overwrite: true,
      });
    }
    if (icon) {
      gsap.to(icon, { rotate: next ? 180 : 0, duration: instant ? 0 : next ? 0.6 : 0.5, ease: "back.out(1.7)", overwrite: true });
    }
  };

  return (
    <section ref={root} id="faq" className={s.section} aria-labelledby="faq-heading">
      <div className={s.head}>
        <p className={`${s.label} type-label`}>{faqCopy.label}</p>
        <h2 id="faq-heading" className={`${s.heading} type-h2`} data-faq-heading>
          {faqCopy.lines.map((line) => (
            <span key={line.text} className={s.line} data-faq-line>
              {line.text}
              {line.accent && <span className="accent">{line.accent}</span>}
            </span>
          ))}
        </h2>
      </div>

      <div className={s.container}>
        <ul className={s.list}>
          {items.map((f, i) => {
            const id = `faq-${i}`;
            return (
              <li key={f.q} className={`${s.item} ${open[i] ? s.isOpen : ""}`} data-faq-item>
                <h3 className={s.itemHeading}>
                  <button type="button" className={s.toggle} aria-expanded={open[i]} aria-controls={`${id}-a`} id={`${id}-q`} onClick={() => toggle(i)}>
                    <span className={s.question}>{f.q}</span>
                    <svg
                      ref={(n) => {
                        icons.current[i] = n;
                      }}
                      className={s.icon}
                      viewBox="0 0 32 32"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M10 13.5 16 19.5 22 13.5" />
                    </svg>
                  </button>
                </h3>
                <div
                  ref={(n) => {
                    answers.current[i] = n;
                  }}
                  className={s.answer}
                  id={`${id}-a`}
                  role="region"
                  aria-labelledby={`${id}-q`}
                  inert={!open[i]}
                >
                  <p className={s.answerText}>{f.a}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
