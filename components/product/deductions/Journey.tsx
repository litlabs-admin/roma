"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/motion";
import { ILLUSTRATIVE, dmChapters, dmIntro } from "@/lib/content/products";
import { Glyph } from "@/components/platform/mock/kit";
import { playOnce, refreshWhenReady, rise } from "@/components/platform/motion";
import { SCENES } from "./JourneyScenes";
import s from "./journey.module.css";

/**
 * "Every deduction, start to finish." — the /deduction-management signature section
 * (DESIGN.md §G.11). One deduction's life, told by one stage that changes state:
 * inbox (filtered, saved, exported) → backup read line by line and marked invalid →
 * dispute filed and tracked to paid back.
 *
 * ≥992px: CSS-sticky pin (§F.6), 1 viewport per chapter + entry; the stage timeline is
 * scrubbed (0.7), the chapter list follows (active chapter opens, the rail fills).
 * <992px: no pin — each chapter carries its own stage, which plays once on enter.
 * Reduced motion: the stacked layout, every scene in its finished state.
 */

const INK_600 = "#5a574f";
type Q = (sel: string) => Element[];

/** Each builder takes a scene from its start to its finished (SSR) state. */
const BUILD: ((q: Q) => gsap.core.Timeline)[] = [
  // 1 · rows land, the filter pill slides to UNFI, the rest dims, view + export pop.
  (q) => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.from(q('[data-jr="paper"]'), { autoAlpha: 0, y: 24, duration: 0.6 }, 0)
      .from(q('[data-jr="rowOn"], [data-jr="rowOff"]'), { autoAlpha: 0, y: 10, duration: 0.4, stagger: 0.08 }, 0.2)
      .fromTo(q('[data-jr="tabPill"]'), { xPercent: 0, x: 0 }, { xPercent: 100, x: 0, duration: 0.45, ease: "power2.inOut" }, 0.85)
      .fromTo(q('[data-jr="tab0"]'), { color: "#ffffff" }, { color: INK_600, duration: 0.3 }, 0.9)
      .fromTo(q('[data-jr="tab1"]'), { color: INK_600 }, { color: "#ffffff", duration: 0.3 }, 1.0)
      .fromTo(q('[data-jr="rowOff"]'), { opacity: 1 }, { opacity: 0.32, duration: 0.4, immediateRender: false }, 1.05)
      .from(q('[data-jr="view"]'), { autoAlpha: 0, scale: 0.7, duration: 0.4, ease: "back.out(2)" }, 1.35)
      .from(q('[data-jr="menu"]'), { autoAlpha: 0, y: 18, scale: 0.96, duration: 0.5, ease: "back.out(1.4)" }, 1.6)
      .from(q('[data-jr="menuItem"]'), { autoAlpha: 0, x: -6, duration: 0.3, stagger: 0.07 }, 1.8);
    return tl;
  },
  // 2 · the backup slides in, a reading line marks each line, lines land on the
  // deduction, the reason + assignee settle, Invalid is pressed.
  (q) => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    const scan = q('[data-jr="scan"]')[0] as HTMLElement | undefined;
    const lines = q('[data-jr="pdfLine"]') as HTMLElement[];
    const xl = q('[data-jr="xline"]');
    tl.from(q('[data-jr="ded"]'), { autoAlpha: 0, y: 22, duration: 0.6 }, 0)
      .from(q('[data-jr="doc"]'), { autoAlpha: 0, x: 60, rotation: 12, duration: 0.7 }, 0.15);
    if (scan) tl.fromTo(scan, { autoAlpha: 0, y: lines[0]?.offsetTop ?? 0 }, { autoAlpha: 1, duration: 0.15 }, 0.75);
    lines.forEach((line, i) => {
      const at = 0.8 + i * 0.4;
      if (scan) tl.to(scan, { y: line.offsetTop + line.offsetHeight / 2, duration: 0.3, ease: "power2.inOut" }, at);
      tl.from(line.querySelector('[data-jr="mark"]'), { scaleX: 0, duration: 0.35, ease: "power2.out" }, at + 0.2).from(
        xl[i],
        { autoAlpha: 0, x: 26, duration: 0.4 },
        at + 0.28,
      );
    });
    const done = 0.8 + lines.length * 0.4;
    if (scan) tl.to(scan, { autoAlpha: 0, duration: 0.2 }, done);
    tl.from(q('[data-jr="reason"]'), { autoAlpha: 0, x: -8, duration: 0.35 }, done + 0.05)
      .from(q('[data-jr="assignee"]'), { autoAlpha: 0, y: -12, duration: 0.4, ease: "back.out(2)" }, done + 0.25)
      .from(q('[data-jr="vFill"]'), { autoAlpha: 0, scale: 0.7, duration: 0.4, ease: "back.out(2)" }, done + 0.55);
    return tl;
  },
  // 3 · the form rises, the type is chosen, the POD drops in, submit; the tracker fills
  // Filed → In review → Paid back and the payment toast lands.
  (q) => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    gsap.set(q('[data-jr="selEmpty"]'), { opacity: 1 });
    tl.from(q('[data-jr="form"]'), { autoAlpha: 0, y: 26, duration: 0.6 }, 0)
      .fromTo(q('[data-jr="selValue"]'), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3 }, 0.55)
      .to(q('[data-jr="selEmpty"]'), { opacity: 0, duration: 0.2 }, 0.5)
      .from(q('[data-jr="file"]'), { autoAlpha: 0, x: 40, y: -40, rotation: 10, duration: 0.6, ease: "back.out(1.4)" }, 0.75)
      .to(q('[data-jr="submit"]'), { scale: 0.95, duration: 0.1, ease: "power2.in" }, 1.3)
      .to(q('[data-jr="submit"]'), { scale: 1, duration: 0.3, ease: "back.out(2.5)" }, 1.4)
      .from(q('[data-jr="tracker"]'), { autoAlpha: 0, x: 40, duration: 0.6 }, 1.45)
      .fromTo(q('[data-jr="stageFill"]'), { scaleY: 0 }, { scaleY: 1, duration: 1.0, ease: "power1.inOut" }, 1.75)
      .from(q('[data-jr="node"]'), { scale: 0, duration: 0.35, stagger: 0.45, ease: "back.out(2.5)" }, 1.7)
      .from(q('[data-jr="toast"]'), { autoAlpha: 0, y: 18, scale: 0.96, duration: 0.5, ease: "back.out(1.6)" }, 2.75);
    return tl;
  },
];

export default function Journey() {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const { before, accent, after } = dmIntro.heading;

  useLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
    if (prefersReducedMotion()) {
      el.setAttribute("data-static", "");
      return () => el.removeAttribute("data-static");
    }
    const mm = gsap.matchMedia();
    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(el);
      rise(q("[data-jr-head]"), q("[data-jr-head]")[0]);

      // Desktop: one stage, scrubbed through all three scenes.
      mm.add("(min-width: 992px)", () => {
        const pin = q("[data-jr-pin]")[0];
        const scenes = q("[data-jr-stage='all'] [data-jr-scene]") as HTMLElement[];
        // SSR shows the last (finished) scene; the scrubbed story starts on the first.
        scenes.forEach((scene, i) => gsap.set(scene, { autoAlpha: i === 0 ? 1 : 0 }));
        const master = gsap.timeline({ paused: true });
        master.from(q("[data-jr-stage='all']"), { autoAlpha: 0, y: 30, duration: 0.6, ease: "power3.out" }, 0);
        scenes.forEach((scene, i) => {
          const build = BUILD[i](gsap.utils.selector(scene));
          if (i > 0) {
            master.addLabel(`in${i}`);
            master.to(scenes[i - 1], { autoAlpha: 0, y: -24, duration: 0.45, ease: "power2.in" });
            master.fromTo(scene, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.01 }, "<0.4");
          }
          master.add(build, i === 0 ? 0.3 : ">");
          master.addLabel(`s${i}`);
          master.to({}, { duration: 0.9 }); // hold each finished scene
        });
        const total = master.duration();
        // A chapter becomes active as its scene starts to come in.
        const starts = [master.labels.in1 / total, master.labels.in2 / total];
        ScrollTrigger.create({
          trigger: pin,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.7,
          animation: master,
          onUpdate: (self) => {
            const p = self.progress;
            const idx = p < starts[0] ? 0 : p < starts[1] ? 1 : 2;
            setActive(idx);
            gsap.set(q("[data-jr-fill]"), { scaleY: p });
          },
        });
        return () => setActive(0);
      });

      // Below 992px: each chapter's own stage plays once on enter.
      mm.add("(max-width: 991.98px)", () => {
        q("[data-jr-stage='one']").forEach((stage) => {
          const scene = stage.querySelector("[data-jr-scene]");
          const i = Number((stage as HTMLElement).dataset.index);
          if (scene) playOnce(stage, BUILD[i](gsap.utils.selector(scene)), "top 80%");
        });
      });
    }, el);
    const stop = refreshWhenReady();
    return () => {
      stop();
      mm.revert();
      ctx.revert();
    };
  }, []);

  return (
    <section ref={root} className={s.section} aria-labelledby="journey-heading">
      <div className={s.head}>
        <p className={`${s.label} type-label`} data-jr-head>
          {dmIntro.label}
        </p>
        <h2 id="journey-heading" className={`${s.heading} type-h2`} data-jr-head>
          {before}
          <span className="accent">{accent}</span>
          {after}
        </h2>
        <p className={`${s.lead} type-lead`} data-jr-head>
          {dmIntro.lead}
        </p>
      </div>

      <div className={s.pin} data-jr-pin>
        <div className={s.sticky}>
          <div className={s.layout}>
            <div className={s.chaptersCol}>
              <span className={s.rail} aria-hidden="true">
                <span className={s.railFill} data-jr-fill />
              </span>
              <ol className={s.chapters}>
                {dmChapters.map((ch, i) => {
                  const Scene = SCENES[i];
                  return (
                    <li key={ch.title} className={`${s.chapter} ${i === active ? s.on : ""}`}>
                      <span className={s.num}>{String(i + 1).padStart(2, "0")}</span>
                      <div className={s.chText}>
                        <h3 className={`${s.chTitle} type-h4`}>{ch.title}</h3>
                        <div className={s.more}>
                          <div className={s.moreInner}>
                            <p className={s.chBody}>{ch.body}</p>
                            <ul className={s.points}>
                              {ch.points.map((p) => (
                                <li key={p.text}>
                                  <span className={s.pIcon}>
                                    <Glyph k={p.icon} />
                                  </span>
                                  {p.text}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                      <div className={s.stageOne} data-jr-stage="one" data-index={i} aria-hidden="true">
                        <div className={s.canvas} data-jr-scene>
                          <Scene />
                        </div>
                      </div>
                      <p className="sr-only">Illustration: {ch.summary}</p>
                    </li>
                  );
                })}
              </ol>
            </div>

            <div className={s.stageCol} aria-hidden="true">
              <div className={s.stageAll} data-jr-stage="all">
                {SCENES.map((Scene, i) => (
                  <div key={i} className={`${s.canvas} ${s.layer}`} data-jr-scene style={i < SCENES.length - 1 ? { opacity: 0 } : undefined}>
                    <Scene />
                  </div>
                ))}
              </div>
              <p className={s.caption}>{ILLUSTRATIVE}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
