"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/motion";
import { CAPABILITIES, ILLUSTRATIVE, capabilitiesCopy, type CapabilityKey } from "@/lib/content/platform";
import { playOnce, refreshWhenReady, rise } from "@/components/platform/motion";
import { CAPABILITY_MOCKS } from "./CapabilityMocks";
import s from "./capabilities.module.css";

/**
 * "From deduction to dollars back." — Hyperline billing's 2 × 2 "Future-proof billing"
 * grid (an illustration in a well, then title + body), built as Roma cards (white,
 * sand border, no shadow, no hover scale: DESIGN.md §E.6, §F.7).
 *
 * Each illustration plays one short state change the first time its card reaches 80%
 * of the viewport (deductions land in the inbox; backup is read and matched; a dispute
 * is confirmed and filed; recovery climbs to credited), and replays when you hover the
 * card after it has finished. Layered objects also fan out on hover (CSS).
 */

const CARD_START = "top 80%";

type Q = (sel: string) => Element[];

const setText = (el: HTMLElement | undefined, text: string) => {
  if (el) el.textContent = text;
};

const BUILD: Record<CapabilityKey, (q: Q) => gsap.core.Timeline> = {
  // Portals connect, Roma lights up, deductions drop into the inbox one by one.
  inbox(q) {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    const count = q('[data-cm="count"]')[0] as HTMLElement | undefined;
    const rows = q('[data-cm="row"]');
    const ring = q('[data-cm="ring"]');
    tl.from(q('[data-cm="src"]'), { autoAlpha: 0, x: -14, duration: 0.5, stagger: 0.08 }, 0)
      .fromTo(q('[data-cm="wire"]'), { drawSVG: "0% 0%" }, { drawSVG: "0% 100%", duration: 0.6, stagger: 0.06, ease: "power2.inOut" }, 0.25)
      .from(q('[data-cm="hub"]'), { autoAlpha: 0, scale: 0.5, duration: 0.6, ease: "back.out(2)" }, 0.55)
      .fromTo(ring, { scale: 1, autoAlpha: 1 }, { scale: 1.7, autoAlpha: 0, duration: 0.9, ease: "power2.out", immediateRender: false }, 0.85)
      .to(ring, { scale: 1.24, autoAlpha: 1, duration: 0.5, ease: "power2.out" }, 1.75)
      .fromTo(q('[data-cm="out"]'), { drawSVG: "0% 0%" }, { drawSVG: "0% 100%", duration: 0.35, ease: "power2.inOut" }, 0.95)
      .from(q('[data-cm="deck"]'), { autoAlpha: 0, y: 16, duration: 0.6 }, 0.9)
      .add(() => setText(count, "0"), 0.9)
      .from(rows, { autoAlpha: 0, y: -12, duration: 0.45, stagger: 0.2 }, 1.2)
      .from(q('[data-cm="chip"]'), { autoAlpha: 0, scale: 0.7, duration: 0.35, stagger: 0.2, ease: "back.out(2)" }, 1.4);
    rows.forEach((_, i) => tl.add(() => setText(count, String(i + 1)), 1.2 + i * 0.2));
    return tl;
  },

  // A reading line sweeps the backup; each line lights up as it is matched, then the
  // seal joins it to the promo agreement.
  backup(q) {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    const scan = q('[data-cm="scan"]')[0] as HTMLElement | undefined;
    const lines = q('[data-cm="line"]') as HTMLElement[];
    gsap.set(q('[data-cm="final"]'), { autoAlpha: 0 });
    gsap.set(q('[data-cm="pending"]'), { autoAlpha: 1 });
    tl.from(q('[data-cm="doc"]'), { autoAlpha: 0, y: 22, rotation: -10, duration: 0.7 }, 0).from(
      q('[data-cm="agreement"]'),
      { autoAlpha: 0, x: 30, rotation: 12, duration: 0.7 },
      0.15,
    );
    if (scan) tl.fromTo(scan, { autoAlpha: 0, y: 0 }, { autoAlpha: 1, duration: 0.2 }, 0.6);
    lines.forEach((line, i) => {
      const at = 0.7 + i * 0.42;
      if (scan) tl.to(scan, { y: line.offsetTop + line.offsetHeight / 2, duration: 0.32, ease: "power2.inOut" }, at);
      tl.from(line.querySelector('[data-cm="hl"]'), { scaleX: 0, duration: 0.4, ease: "power2.out" }, at + 0.2).from(
        line.querySelector('[data-cm="tick"]'),
        { autoAlpha: 0, scale: 0.3, duration: 0.35, ease: "back.out(2.5)" },
        at + 0.32,
      );
    });
    const done = 0.7 + lines.length * 0.42;
    if (scan) tl.to(scan, { autoAlpha: 0, duration: 0.25 }, done);
    tl.fromTo(q('[data-cm="link"]'), { drawSVG: "0% 0%" }, { drawSVG: "0% 100%", duration: 0.35, ease: "power2.inOut" }, done)
      .from(q('[data-cm="seal"]'), { autoAlpha: 0, scale: 0, duration: 0.45, ease: "back.out(2.5)" }, done + 0.2)
      .to(q('[data-cm="pending"]'), { autoAlpha: 0, scale: 0.9, duration: 0.2, ease: "power2.in" }, done + 0.45)
      .fromTo(q('[data-cm="final"]'), { autoAlpha: 0, scale: 0.8 }, { autoAlpha: 1, scale: 1, duration: 0.45, ease: "back.out(2)" }, done + 0.6);
    return tl;
  },

  // The queue settles, the proof of delivery drops into place, you confirm, it files.
  dispute(q) {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    const btn = q('[data-cm="btn"]');
    const cursor = q('[data-cm="cursor"]');
    gsap.set(q('[data-cm="btnFace"]'), { opacity: 1 });
    gsap.set(q('[data-cm="btnConfirm"]'), { autoAlpha: 1 });
    gsap.set(q('[data-cm="btnFiled"]'), { autoAlpha: 0 });
    gsap.set(q('[data-cm="footQueued"]'), { autoAlpha: 1 });
    gsap.set(q('[data-cm="footFiled"]'), { autoAlpha: 0 });
    gsap.set(cursor, { autoAlpha: 0, x: "260%", y: "180%" });
    tl.from(q('[data-cm="qcount"]'), { autoAlpha: 0, y: 6, duration: 0.4 }, 0)
      .from(q('[data-cm="queue"]'), { autoAlpha: 0, y: 22, duration: 0.6 }, 0.1)
      .from(q('[data-cm="file"]'), { autoAlpha: 0, x: 70, y: -70, rotation: 14, duration: 0.75, ease: "back.out(1.4)" }, 0.6)
      .fromTo(cursor, { autoAlpha: 0, x: "260%", y: "180%" }, { autoAlpha: 1, x: 0, y: 0, duration: 0.75, ease: "power2.inOut" }, 1.2)
      .to(btn, { scale: 0.94, duration: 0.12, ease: "power2.in" }, 1.95)
      .to(btn, { scale: 1, duration: 0.35, ease: "back.out(2.5)" }, 2.07)
      .to(q('[data-cm="btnFace"]'), { opacity: 0, duration: 0.35, ease: "power2.out" }, 2.07)
      .to(q('[data-cm="btnConfirm"]'), { autoAlpha: 0, y: -8, duration: 0.2, ease: "power2.in" }, 2.07)
      .fromTo(q('[data-cm="btnFiled"]'), { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.35 }, 2.2)
      .to(q('[data-cm="footQueued"]'), { autoAlpha: 0, duration: 0.2 }, 2.2)
      .fromTo(q('[data-cm="footFiled"]'), { autoAlpha: 0, x: -6 }, { autoAlpha: 1, x: 0, duration: 0.35 }, 2.3)
      .to(cursor, { autoAlpha: 0, x: "60%", y: "80%", duration: 0.5, ease: "power2.in" }, 2.5);
    return tl;
  },

  // Recovered climbs while written-off falls away; credits land on the timeline.
  recovery(q) {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    const count = q('[data-cm="count"]')[0] as HTMLElement | undefined;
    const to = Number(count?.dataset.to ?? 0);
    const n = { v: 0 };
    const fmt = (v: number) => `$${Math.round(v).toLocaleString("en-US")}`;
    tl.from(q('[data-cm="tracker"]'), { autoAlpha: 0, y: 24, duration: 0.7 }, 0)
      .fromTo(q('[data-cm="curve"]'), { drawSVG: "0% 0%" }, { drawSVG: "0% 100%", duration: 1.3, ease: "power2.inOut", stagger: 0.1 }, 0.35)
      .from(q('[data-cm="area"]'), { autoAlpha: 0, duration: 0.8 }, 0.9)
      .fromTo(n, { v: 0 }, { v: to, duration: 1.4, ease: "power2.out", onUpdate: () => setText(count, fmt(n.v)) }, 0.35)
      .from(q('[data-cm="mark"]'), { autoAlpha: 0, scale: 0, duration: 0.4, stagger: 0.18, ease: "back.out(2.5)" }, 0.9)
      .from(q('[data-cm="delta"]'), { autoAlpha: 0, x: -8, duration: 0.4 }, 1.5)
      .from(q('[data-cm="tl"]'), { autoAlpha: 0, y: 10, duration: 0.45, stagger: 0.12 }, 1.4);
    return tl;
  },
};

/** Fine pointers only: hovering a card whose story has finished plays it again. */
function replayOnHover(card: Element, tl: gsap.core.Timeline) {
  if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return () => {};
  const onEnter = () => {
    if (tl.progress() === 1) tl.restart();
  };
  card.addEventListener("mouseenter", onEnter);
  return () => card.removeEventListener("mouseenter", onEnter);
}

export default function Capabilities() {
  const root = useRef<HTMLElement>(null);
  const { before, accent, after } = capabilitiesCopy.heading;

  useLayoutEffect(() => {
    const el = root.current;
    if (!el || prefersReducedMotion()) return;
    const unhover: (() => void)[] = [];
    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(el);
      rise(q("[data-cap-head]"), q("[data-cap-head]")[0]);
      rise(q("[data-cap-card]"), q("[data-cap-grid]")[0], { start: "top 85%", stagger: 0.1 });
      q("[data-cap-card]").forEach((card) => {
        const key = (card as HTMLElement).dataset.capCard as CapabilityKey;
        const tl = BUILD[key](gsap.utils.selector(card));
        playOnce(card, tl, CARD_START);
        unhover.push(replayOnHover(card, tl));
      });
    }, el);
    const stop = refreshWhenReady();
    return () => {
      stop();
      unhover.forEach((off) => off());
      ctx.revert();
    };
  }, []);

  return (
    <section ref={root} className={s.section} aria-labelledby="capabilities-heading">
      <div className={s.inner}>
        <div className={s.head}>
          <h2 id="capabilities-heading" className={`${s.heading} type-h2`} data-cap-head>
            {before}
            <span className="accent">{accent}</span>
            {after}
          </h2>
          <p className={`${s.lead} type-lead`} data-cap-head>
            {capabilitiesCopy.lead}
          </p>
        </div>

        <ul className={s.grid} data-cap-grid>
          {CAPABILITIES.map((cap) => {
            const Mock = CAPABILITY_MOCKS[cap.key];
            return (
              <li key={cap.key} className={s.card} data-cap-card={cap.key}>
                <div className={s.well} aria-hidden="true">
                  <Mock />
                </div>
                <div className={s.text}>
                  <h3 className={`${s.title} type-h5`}>{cap.title}</h3>
                  <p className={s.body}>{cap.body}</p>
                  <p className="sr-only">Illustration: {cap.summary}</p>
                </div>
              </li>
            );
          })}
        </ul>
        <p className={s.caption}>{ILLUSTRATIVE}</p>
      </div>
    </section>
  );
}
