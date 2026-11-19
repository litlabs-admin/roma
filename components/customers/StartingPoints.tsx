"use client";

import { useCallback, useLayoutEffect, useRef, useState, type KeyboardEvent } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/motion";
import { STARTING_POINTS, startCopy, type StartKey } from "@/lib/content/customers";
import ArrowLink from "@/components/ui/ArrowLink";
import { refreshWhenReady, rise } from "@/components/platform/motion";
import { VIGNETTES } from "./Vignettes";
import s from "./startingPoints.module.css";

/**
 * "Where they started" (DESIGN.md §G.15): the PDF's three status-quo failures, asked as
 * a question so visitors find themselves before they read a story. A radio-style
 * tablist (arrow keys, Home, End) beside a warm well holding one paper vignette per
 * answer; each plays its single state change when chosen (the first one on enter).
 * Each answer routes to the chapter of the brand that started there. No autoplay.
 */

type Play = (root: HTMLElement) => gsap.core.Timeline;

const PLAYS: Record<StartKey, Play> = {
  // deduction lines leave the remittance and land in the write-off tray
  ignored: (root) => {
    const q = gsap.utils.selector(root);
    const slips = q("[data-vg='slip']") as HTMLElement[];
    const ghosts = q("[data-vg='ghost']") as HTMLElement[];
    gsap.set(slips, { x: 0, y: 0, rotation: (i: number) => Number(slips[i].dataset.r ?? 0) });
    const from = slips.map((sl, i) => {
      const a = sl.getBoundingClientRect();
      const b = ghosts[i].getBoundingClientRect();
      return { x: b.left - a.left, y: b.top + b.height / 2 - (a.top + a.height / 2) };
    });
    return gsap
      .timeline()
      .set(ghosts, { autoAlpha: 0 })
      .fromTo(
        slips,
        { x: (i: number) => from[i].x, y: (i: number) => from[i].y, rotation: 0 },
        { x: 0, y: 0, rotation: (i: number) => Number(slips[i].dataset.r ?? 0), duration: 0.9, ease: "power2.inOut", stagger: 0.18 },
        0.35,
      )
      .fromTo(ghosts, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3, stagger: 0.18 }, 0.55)
      .fromTo(q("[data-vg='stamp']"), { autoAlpha: 0, scale: 1.5 }, { autoAlpha: 1, scale: 1, duration: 0.35, ease: "power4.out" }, 1.65);
  },
  // the spreadsheet fills in, then stalls: a sticky note and "last edited 41 days ago"
  sheet: (root) => {
    const q = gsap.utils.selector(root);
    return gsap
      .timeline()
      .fromTo(q("[data-vg='row']"), { clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0% 0 0)", duration: 0.4, ease: "power2.out", stagger: 0.1 }, 0.15)
      .fromTo(q("[data-vg='note']"), { autoAlpha: 0, y: -24, rotation: -4 }, { autoAlpha: 1, y: 0, rotation: 3, duration: 0.6, ease: "power3.out" }, 1.0)
      .fromTo(q("[data-vg='edited']"), { autoAlpha: 0, scale: 0.7 }, { autoAlpha: 1, scale: 1, duration: 0.4, ease: "back.out(2)" }, 1.45);
  },
  // every deduction books to one account; "recover?" gets crossed out
  books: (root) => {
    const q = gsap.utils.selector(root);
    return gsap
      .timeline()
      .fromTo(q("[data-vg='jline']"), { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.4, ease: "power3.out", stagger: 0.14 }, 0.15)
      .fromTo(q("[data-vg='jtotal']"), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.35 }, 0.8)
      .fromTo(q("[data-vg='pencil']"), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3 }, 1.1)
      .fromTo(q("[data-vg='arrow']"), { drawSVG: "0% 0%" }, { drawSVG: "0% 100%", duration: 0.35, ease: "power1.inOut" }, 1.15)
      .fromTo(q("[data-vg='strike']"), { drawSVG: "0% 0%" }, { drawSVG: "0% 100%", duration: 0.45, ease: "power2.inOut" }, 1.6)
      .fromTo(q("[data-vg='posted']"), { autoAlpha: 0, scale: 1.4 }, { autoAlpha: 1, scale: 1, duration: 0.35, ease: "power4.out" }, 2.0);
  },
};

export default function StartingPoints() {
  const root = useRef<HTMLElement>(null);
  const well = useRef<HTMLDivElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);
  const seen = useRef(false);
  const [active, setActive] = useState(0);
  const point = STARTING_POINTS[active];

  const play = useCallback((i: number) => {
    const host = well.current?.querySelector<HTMLElement>(`[data-vgn="${i}"]`);
    if (!host || prefersReducedMotion()) return;
    tl.current?.progress(1).kill();
    tl.current = PLAYS[STARTING_POINTS[i].key](host);
  }, []);

  useLayoutEffect(() => {
    const el = root.current;
    if (!el || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(el);
      rise(q("[data-sp-head]"), q("[data-sp-head]")[0]);
      rise(q("[data-sp-tab]"), q("[data-sp-tabs]")[0], { stagger: 0.08 });
      ScrollTrigger.create({
        trigger: well.current,
        start: "top 70%",
        once: true,
        onEnter: () => {
          seen.current = true;
          play(0);
        },
      });
    }, el);
    const stop = refreshWhenReady();
    return () => {
      stop();
      tl.current?.progress(1).kill();
      ctx.revert();
    };
  }, [play]);

  const choose = (i: number) => {
    if (i === active) return;
    setActive(i);
    // replay after the 300ms cross-fade has started; before first view it plays on enter
    if (seen.current) window.setTimeout(() => play(i), 120);
  };

  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const keys = ["ArrowRight", "ArrowLeft", "ArrowDown", "ArrowUp", "Home", "End"];
    if (!keys.includes(e.key)) return;
    e.preventDefault();
    const n = STARTING_POINTS.length;
    const next = e.key === "Home" ? 0 : e.key === "End" ? n - 1 : (active + (e.key === "ArrowRight" || e.key === "ArrowDown" ? 1 : -1) + n) % n;
    choose(next);
    e.currentTarget.querySelectorAll<HTMLButtonElement>("[role=tab]")[next]?.focus();
  };

  const { before, accent, after } = startCopy.heading;

  return (
    <section ref={root} className={s.section} aria-labelledby="start-heading">
      <div className={s.inner}>
        <div className={s.col}>
          <header className={s.head}>
            <p className={`${s.label} type-label`} data-sp-head>
              {startCopy.label}
            </p>
            <h2 id="start-heading" className={`${s.h2} type-h2`} data-sp-head>
              {before}
              <span className="accent">{accent}</span>
              {after}
            </h2>
            <p className={s.lead} data-sp-head>
              {startCopy.lead}
            </p>
          </header>

          <div className={s.tabs} role="tablist" aria-label="How you handle deductions today" aria-orientation="vertical" onKeyDown={onKey} data-sp-tabs>
            {STARTING_POINTS.map((p, i) => (
              <button
                key={p.key}
                type="button"
                role="tab"
                id={`start-tab-${p.key}`}
                aria-selected={i === active}
                aria-controls="start-panel"
                tabIndex={i === active ? 0 : -1}
                className={s.tab}
                onClick={() => choose(i)}
                data-sp-tab
              >
                <span className={s.radio} aria-hidden="true" />
                <span className={s.tabText}>{p.tab}</span>
              </button>
            ))}
          </div>
        </div>

        <div className={s.media}>
          <div ref={well} className={s.well} aria-hidden="true">
            {STARTING_POINTS.map((p, i) => {
              const Art = VIGNETTES[p.key];
              return (
                <div key={p.key} className={s.vg} data-vgn={i} data-on={i === active}>
                  <Art />
                </div>
              );
            })}
          </div>

          <div className={s.panel} id="start-panel" role="tabpanel" aria-labelledby={`start-tab-${point.key}`}>
            <div key={point.key} className={s.panelInner}>
              <h3 className={`${s.panelTitle} type-h5`}>{point.title}</h3>
              <p className={s.panelBody}>{point.body}</p>
              <p className="sr-only">{point.summary}</p>
              <p className={s.route}>
                <span>
                  This is where <b>{point.story.brand}</b> started.
                </span>
                <ArrowLink href={point.story.href} arrow="down" className={s.routeLink}>
                  {startCopy.read}
                </ArrowLink>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

