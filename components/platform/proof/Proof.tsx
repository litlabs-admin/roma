"use client";

import { useLayoutEffect, useRef, type CSSProperties } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/motion";
import { proofCopy } from "@/lib/content/platform";
import { customerLogos } from "@/lib/content/logos";
import { BACKDROP_RANGES } from "@/components/motion/PageBackdrop";
import { Glyph } from "@/components/platform/mock/kit";
import { refreshWhenReady } from "@/components/platform/motion";
import s from "./proof.module.css";

/**
 * Proof — on the red stretch of the page backdrop (`data-backdrop="red"`), like the
 * home stories. Three white stat cards, each a figure from the positioning PDF ($53K
 * Good Day Chocolate in 6 months, $23K Smash Kitchen, 170+ brands) with a small product
 * visual: a recovery curve, a dispute moving to credited, the customer logo wall.
 * Visuals show shape only (no invented intermediate amounts).
 *
 * Text outside the cards crosses from ink to white over the same scrubbed range the red
 * fades in on (home Stories logic), so contrast holds at every scroll position.
 */

const INK = "#111111";
const INK_MUTED = "#5a574f";
const ON_DARK = "#ffffff";
const ON_DARK_MUTED = "rgba(255, 255, 255, 0.78)";
const COUNT = { duration: 1.4, stagger: 0.15, start: "top 75%" };

// Curve for card 1, in a 260 × 90 box: slow first months, then recoveries compound.
const CURVE = "M0 86 C30 84 50 80 80 70 S140 46 180 30 S235 8 260 4";
const MONTHS = ["M1", "M2", "M3", "M4", "M5", "M6"];
const LOGO_WALL = customerLogos.slice(0, 8);

/** Big figure; the number span counts up (accessible label is the final value). */
function Figure({ st }: { st: (typeof proofCopy.stats)[number] }) {
  return (
    <p className={s.value} aria-label={`${st.prefix}${st.value}${st.suffix}`}>
      <span aria-hidden="true">
        {st.prefix}
        <span data-pf-value data-to={st.value}>
          {st.value}
        </span>
        {st.suffix}
      </span>
    </p>
  );
}

export default function Proof() {
  const root = useRef<HTMLElement>(null);
  const { before, accent, after } = proofCopy.heading;
  const [gdc, smash, brands] = proofCopy.stats;

  useLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
    if (prefersReducedMotion()) {
      el.setAttribute("data-static", "");
      return () => el.removeAttribute("data-static");
    }
    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(el);
      // text colour follows the red backdrop (home Stories: ink holds, then flips)
      gsap
        .timeline({ scrollTrigger: { trigger: el, ...BACKDROP_RANGES.red, scrub: true } })
        .fromTo(el, { "--pf-fg": INK, "--pf-muted": INK_MUTED }, { "--pf-fg": ON_DARK, "--pf-muted": ON_DARK_MUTED, ease: "none", duration: 0.16 }, 0.42)
        .to({}, { duration: 0 }, 1);

      gsap.fromTo(
        q("[data-pf-head]"),
        { autoAlpha: 0, y: 16 },
        { autoAlpha: 1, y: 0, duration: 0.5, ease: "power3.out", stagger: 0.09, scrollTrigger: { trigger: el, start: "top 75%", once: true } },
      );

      const list = q("[data-pf-list]")[0];
      const tl = gsap.timeline({ paused: true, defaults: { ease: "power3.out" } });
      tl.from(q("[data-pf-card]"), { autoAlpha: 0, y: 28, duration: 0.7, stagger: COUNT.stagger }, 0);
      q("[data-pf-value]").forEach((node, i) => {
        const span = node as HTMLElement;
        const to = Number(span.dataset.to ?? 0);
        const n = { v: 0 };
        tl.fromTo(n, { v: 0 }, { v: to, duration: COUNT.duration, ease: "power2.out", onUpdate: () => void (span.textContent = String(Math.round(n.v))) }, 0.2 + i * COUNT.stagger);
      });
      // 1 · curve draws, area fades, end dot lands
      tl.fromTo(q("[data-pf='curve']"), { drawSVG: "0% 0%" }, { drawSVG: "0% 100%", duration: 1.4, ease: "power2.inOut" }, 0.3)
        .from(q("[data-pf='area']"), { autoAlpha: 0, duration: 0.8 }, 0.9)
        .from(q("[data-pf='end']"), { autoAlpha: 0, scale: 0, duration: 0.45, ease: "back.out(2.5)" }, 1.6)
        // 2 · the dispute moves filed → in review → credited
        .fromTo(q("[data-pf='fill']"), { scaleX: 0 }, { scaleX: 1, duration: 1.3, ease: "power2.inOut" }, 0.45)
        .from(q("[data-pf='node']"), { scale: 0, duration: 0.35, stagger: 0.55, ease: "back.out(2.5)" }, 0.45)
        .from(q("[data-pf='credited']"), { autoAlpha: 0, y: 8, duration: 0.45 }, 1.6)
        // 3 · logos land one by one
        .from(q("[data-pf='logo']"), { autoAlpha: 0, scale: 0.85, duration: 0.4, stagger: 0.07 }, 0.5)
        .from(q("[data-pf='more']"), { autoAlpha: 0, scale: 0.8, duration: 0.4, ease: "back.out(2)" }, 1.1);
      ScrollTrigger.create({ trigger: list, start: COUNT.start, once: true, onEnter: () => void tl.play() });
    }, el);
    const stop = refreshWhenReady();
    return () => {
      stop();
      ctx.revert();
      el.querySelectorAll<HTMLElement>("[data-pf-value]").forEach((sp) => (sp.textContent = sp.dataset.to ?? ""));
    };
  }, []);

  return (
    <section ref={root} className={s.section} data-backdrop="red" aria-labelledby="proof-heading">
      <div className={s.inner}>
        <h2 id="proof-heading" className={`${s.heading} type-h2`} data-pf-head>
          {before}
          <span className="accent">{accent}</span>
          {after}
        </h2>

        <ul className={s.list} data-pf-list>
          {/* 1 · Good Day Chocolate */}
          <li className={s.card} data-pf-card>
            <span className={s.brand}>Good Day Chocolate</span>
            <Figure st={gdc} />
            <p className={s.label}>{gdc.label}</p>
            <div className={s.visual} aria-hidden="true">
              <div className={s.chart}>
                <svg viewBox="0 0 260 90" preserveAspectRatio="none">
                  <path d={`${CURVE} V90 H0 Z`} className={s.area} data-pf="area" />
                  <path d={CURVE} className={s.curve} data-pf="curve" />
                </svg>
                <span className={s.endDot} data-pf="end">
                  <span className={s.endTag}>$53K</span>
                </span>
              </div>
              <div className={s.months}>
                {MONTHS.map((m) => (
                  <span key={m}>{m}</span>
                ))}
              </div>
            </div>
          </li>

          {/* 2 · Smash Kitchen */}
          <li className={s.card} data-pf-card>
            <span className={s.brand}>Smash Kitchen</span>
            <Figure st={smash} />
            <p className={s.label}>{smash.label}</p>
            <div className={`${s.visual} ${s.visualPipe}`} aria-hidden="true">
              <div className={s.pipe}>
                <span className={s.track}>
                  <span className={s.fill} data-pf="fill" />
                </span>
                <ol className={s.stages}>
                  {["Filed", "In review", "Credited"].map((st) => (
                    <li key={st}>
                      <span className={s.node}>
                        <i data-pf="node">
                          <Glyph k="check" />
                        </i>
                      </span>
                      {st}
                    </li>
                  ))}
                </ol>
              </div>
              <span className={s.credited} data-pf="credited">
                <Glyph k="check" />
                Credited back, not written off
              </span>
            </div>
          </li>

          {/* 3 · 170+ brands */}
          <li className={s.card} data-pf-card>
            <span className={s.brand}>Roma customers</span>
            <Figure st={brands} />
            <p className={s.label}>{brands.label}</p>
            <div className={`${s.visual} ${s.visualWall}`} aria-hidden="true">
              <div className={s.wall}>
                {LOGO_WALL.map((l) => (
                  <span key={l.name} className={s.wallCell} data-pf="logo">
                    <span
                      className={s.wallLogo}
                      style={{ WebkitMaskImage: `url(${l.src})`, maskImage: `url(${l.src})`, aspectRatio: `${l.w} / ${l.h}` } as CSSProperties}
                    />
                  </span>
                ))}
                <span className={`${s.wallCell} ${s.more}`} data-pf="more">
                  +{brands.value - LOGO_WALL.length}
                </span>
              </div>
            </div>
          </li>
        </ul>
        <p className={s.note} data-pf-head>
          {proofCopy.note}
        </p>
      </div>
    </section>
  );
}
