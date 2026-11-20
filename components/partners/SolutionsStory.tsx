"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/motion";
import { ILLUSTRATIVE_ART, solutions, solutionsHead } from "@/lib/content/partners";
import { Glyph } from "@/components/platform/mock/kit";
import { playOnce, refreshWhenReady, rise } from "@/components/platform/motion";
import ArrowLink from "@/components/ui/ArrowLink";
import { SOLUTION_SCENES } from "./art/SolutionScenes";
import Head from "./Head";
import p from "./partners.module.css";
import j from "@/components/product/deductions/journey.module.css";
import s from "./solutionsStory.module.css";

/**
 * Solutions open for partnership (DESIGN.md §G.16; client asked for the
 * /deduction-management Journey pattern, §G.11). The three modules as chapters; one
 * stage tells what a partner does for one client with each: dispute invalid lines and
 * report the recovery → share where the money went → book and tie out the remittance.
 *
 * ≥992px: CSS-sticky pin (§F.6) for 3.4 viewports; scene 1 plays once on arrival, the
 * hand-offs to scenes 2 and 3 are scrubbed (0.7), the
 * chapter list follows (active chapter opens, the rail fills). <992px: each chapter has
 * its own stage that plays once. Reduced motion: stacked, every scene finished.
 * Layout + stage CSS are the Journey's own (journey.module.css), not a copy.
 */

type Q = (sel: string) => Element[];

const BUILD: ((q: Q) => gsap.core.Timeline)[] = [
  // 1 · rows land, the two invalid rows tint and get Disputed, the recovery toast lands.
  (q) =>
    gsap
      .timeline({ defaults: { ease: "power3.out" } })
      .from(q('[data-ss="switcher"]'), { autoAlpha: 0, y: -12, duration: 0.5 }, 0)
      .from(q('[data-ss="paper"]'), { autoAlpha: 0, y: 24, duration: 0.6 }, 0.1)
      .from(q('[data-ss="row"], [data-ss="rowBad"]'), { autoAlpha: 0, y: 10, duration: 0.4, stagger: 0.08 }, 0.3)
      .from(q('[data-ss="valid"]'), { autoAlpha: 0, scale: 0.7, duration: 0.3, stagger: 0.06, ease: "back.out(2)" }, 0.85)
      .fromTo(q('[data-ss="rowBad"]'), { backgroundColor: "rgba(253,245,243,0)" }, { backgroundColor: "rgba(253,245,243,1)", duration: 0.3 }, 1.05)
      .from(q('[data-ss="disputed"]'), { autoAlpha: 0, scale: 0.6, duration: 0.35, stagger: 0.15, ease: "back.out(2.2)" }, 1.15)
      .from(q('[data-ss="toast"]'), { autoAlpha: 0, y: 20, scale: 0.96, duration: 0.5, ease: "back.out(1.6)" }, 1.6),
  // 2 · the chart builds bar by bar, then the monthly review is shared with the client.
  (q) =>
    gsap
      .timeline({ defaults: { ease: "power3.out" } })
      .from(q('[data-ss="switcher"]'), { autoAlpha: 0, y: -12, duration: 0.5 }, 0)
      .from(q('[data-ss="paper"]'), { autoAlpha: 0, y: 24, duration: 0.6 }, 0.1)
      .from(q('[data-ss="bar"]'), { scaleX: 0, duration: 0.6, stagger: 0.12, ease: "power2.out" }, 0.4)
      .from(q('[data-ss="toast"]'), { autoAlpha: 0, x: 30, duration: 0.5 }, 1.1)
      .from(q('[data-ss="shared"]'), { autoAlpha: 0, scale: 0.7, duration: 0.35, ease: "back.out(2)" }, 1.45),
  // 3 · lines land, GL codes wipe in, the footing appears, stamp, export.
  (q) =>
    gsap
      .timeline({ defaults: { ease: "power3.out" } })
      .from(q('[data-ss="switcher"]'), { autoAlpha: 0, y: -12, duration: 0.5 }, 0)
      .from(q('[data-ss="paper"]'), { autoAlpha: 0, y: 24, duration: 0.6 }, 0.1)
      .from(q('[data-ss="row"]'), { autoAlpha: 0, x: -10, duration: 0.4, stagger: 0.08 }, 0.3)
      .fromTo(q('[data-ss="gl"]'), { clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0% 0 0)", duration: 0.4, stagger: 0.14, ease: "power2.out" }, 0.7)
      .from(q('[data-ss="foot"]'), { autoAlpha: 0, duration: 0.4 }, 1.3)
      .from(q('[data-ss="stamp"]'), { autoAlpha: 0, scale: 1.5, duration: 0.35, ease: "back.out(2)" }, 1.55)
      .from(q('[data-ss="toast"]'), { autoAlpha: 0, y: 18, duration: 0.45, ease: "back.out(1.6)" }, 1.8),
];

export default function SolutionsStory() {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);

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
      rise(q("[data-pt-head]"), el);

      mm.add("(min-width: 992px)", () => {
        const pin = q("[data-ss-pin]")[0];
        const scenes = q("[data-ss-stage='all'] [data-ss-scene]") as HTMLElement[];
        scenes.forEach((scene, i) => gsap.set(scene, { autoAlpha: i === 0 ? 1 : 0 }));
        // Scene 1 plays on its own clock as the section arrives (client 20 Nov: the art
        // came in late when it waited for the pin), so the stage is never empty. Scroll
        // then scrubs only the hand-offs to scenes 2 and 3.
        playOnce(q("[data-ss-stage='all']")[0], BUILD[0](gsap.utils.selector(scenes[0])), "top 85%");
        const master = gsap.timeline({ paused: true });
        master.to({}, { duration: 0.9 }); // hold scene 1
        scenes.forEach((scene, i) => {
          if (i === 0) return;
          const build = BUILD[i](gsap.utils.selector(scene));
          master.addLabel(`in${i}`);
          master.to(scenes[i - 1], { autoAlpha: 0, y: -24, duration: 0.45, ease: "power2.in" });
          master.fromTo(scene, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.01 }, "<0.4");
          master.add(build, ">");
          master.to({}, { duration: 0.9 }); // hold each finished scene
        });
        const total = master.duration();
        const starts = [master.labels.in1 / total, master.labels.in2 / total];
        ScrollTrigger.create({
          trigger: pin,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.7,
          animation: master,
          onUpdate: (self) => {
            const pr = self.progress;
            setActive(pr < starts[0] ? 0 : pr < starts[1] ? 1 : 2);
            gsap.set(q("[data-ss-fill]"), { scaleY: pr });
          },
        });
        return () => setActive(0);
      });

      mm.add("(max-width: 991.98px)", () => {
        q("[data-ss-stage='one']").forEach((stage) => {
          const scene = stage.querySelector("[data-ss-scene]");
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
    <section ref={root} className={j.section} aria-labelledby="pt-solutions">
      <div className={p.inner}>
        <Head id="pt-solutions" label={solutionsHead.label} heading={solutionsHead.heading} lead={solutionsHead.lead} split />
      </div>

      <div className={`${j.pin} ${s.pin}`} data-ss-pin>
        <div className={j.sticky}>
          <div className={j.layout}>
            <div className={j.chaptersCol}>
              <span className={j.rail} aria-hidden="true">
                <span className={j.railFill} data-ss-fill />
              </span>
              <ol className={`${j.chapters} ${s.chapters}`}>
                {solutions.map((ch, i) => {
                  const Scene = SOLUTION_SCENES[i];
                  return (
                    <li key={ch.key} className={`${j.chapter} ${i === active ? j.on : ""}`}>
                      <span className={j.num}>{String(i + 1).padStart(2, "0")}</span>
                      <div className={j.chText}>
                        <h3 className={`${j.chTitle} type-h4`}>{ch.tab}</h3>
                        <div className={j.more}>
                          <div className={j.moreInner}>
                            <p className={j.chBody}>
                              <b className={s.lede}>{ch.title}.</b> {ch.text}
                            </p>
                            <ul className={j.points}>
                              {ch.points.map((pt) => (
                                <li key={pt}>
                                  <span className={j.pIcon}>
                                    <Glyph k="check" />
                                  </span>
                                  {pt}
                                </li>
                              ))}
                            </ul>
                            <ArrowLink href={ch.link.href} className={s.explore}>
                              {ch.link.label}
                            </ArrowLink>
                          </div>
                        </div>
                      </div>
                      <div className={j.stageOne} data-ss-stage="one" data-index={i} aria-hidden="true">
                        <div className={j.canvas} data-ss-scene>
                          <Scene />
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ol>
            </div>

            <div className={j.stageCol} aria-hidden="true">
              <div className={j.stageAll} data-ss-stage="all">
                {SOLUTION_SCENES.map((Scene, i) => (
                  <div key={i} className={`${j.canvas} ${j.layer}`} data-ss-scene style={i < SOLUTION_SCENES.length - 1 ? { opacity: 0 } : undefined}>
                    <Scene />
                  </div>
                ))}
              </div>
              <p className={j.caption}>{ILLUSTRATIVE_ART}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
