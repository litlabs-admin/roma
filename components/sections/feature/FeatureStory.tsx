"use client";

import { useCallback, useLayoutEffect, useRef, useState, type KeyboardEvent } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/motion";
import { splitChars } from "@/components/ui/splitChars";
import AppPanel from "./AppPanel";
import { buildPanelTimeline } from "./panelTimeline";
import { SCENARIOS, featureCopy } from "./data";
import s from "./feature.module.css";

/**
 * "Get it back" — Roma's adaptation of Fruitful's goalflow section (DESIGN.md §G.3).
 *
 * Structure: a 400vh container with a CSS-sticky 100vh stage.
 *  1. Entrance (one viewport after the stage pins): the statement sits alone, the
 *     panel waits small at the bottom, rises and grows while screen 1 builds, the
 *     statement fades as it is covered, then the panel parks in its column and the
 *     copy arrives.
 *  2. Screens (the remaining two viewports): scroll maps to a TARGET time on the
 *     panel's paused timeline; a proxy clock eases toward it (0.3s power3.out).
 *     Lenis smoothing → scrub 0.6 → eased clock = the "crazy smooth" feel.
 */

// Copied from Fruitful GF_IN — fractions of the viewport of scroll after the pin.
const GF_IN = {
  rise: [0.2, 0.75], // panel rises and grows; screen 1 builds
  fade: [0.45, 0.7], // statement fades as the panel covers it
  park: [0.65, 1], // panel slides sideways into its column
  column: [0.75, 1], // the left column arrives
  scale: 0.72, // panel size while it waits
  peek: 0.72, // where its top edge waits, as a fraction of the stage height
};

type Clock = { t: number };

export default function FeatureStory() {
  const [active, setActive] = useState(0);
  const scenario = SCENARIOS[active];

  const container = useRef<HTMLDivElement>(null);
  const host = useRef<HTMLDivElement>(null);
  const screenTl = useRef<gsap.core.Timeline | null>(null);
  const clock = useRef<Clock>({ t: 0 });
  const drive = useRef<gsap.core.Tween | null>(null);
  const hold = useRef<number | null>(null);
  const pendingSwitch = useRef<{ now: number } | null>(null);
  const reduced = useRef(false);

  const goTo = useCallback((t: number, vars: gsap.TweenVars) => {
    drive.current?.kill();
    drive.current = gsap.to(clock.current, {
      t,
      ...vars,
      onUpdate: () => {
        screenTl.current?.time(clock.current.t);
      },
    });
  }, []);

  // (Re)build the panel timeline whenever the scenario changes. Runs before the
  // mount effect below on first render, so the scroll wiring always has a timeline.
  useLayoutEffect(() => {
    const el = host.current;
    if (!el) return;
    screenTl.current?.kill();
    const tl = buildPanelTimeline(el, scenario);
    screenTl.current = tl;

    if (reduced.current || prefersReducedMotion()) {
      tl.progress(1);
      return;
    }

    const sw = pendingSwitch.current;
    if (sw) {
      // Fruitful tab behaviour: show the detailed screen without touching the scroll.
      // Already on screen 2 → rebuild and land back where the scroll has it.
      // Otherwise → replay from the band stretch and park on "settled" until the
      // scroll catches up.
      pendingSwitch.current = null;
      const L = tl.labels;
      const onScreen2 = sw.now >= L.settled && sw.now < L.screen3;
      hold.current = onScreen2 ? null : L.settled;
      clock.current.t = L.stretch;
      tl.time(clock.current.t);
      goTo(onScreen2 ? sw.now : L.settled, { duration: 1.1, ease: "power2.out" });
    } else {
      tl.time(clock.current.t);
    }
  }, [scenario, goTo]);

  // Scroll wiring — once.
  useLayoutEffect(() => {
    const root = container.current;
    if (!root) return;
    reduced.current = prefersReducedMotion();
    if (reduced.current) {
      root.setAttribute("data-static", "");
      return;
    }

    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(root);
      const sticky = q("[data-gf-sticky]")[0] as HTMLElement;
      const visual = q("[data-gf-visual]")[0] as HTMLElement;
      const statements = q("[data-gf-statement]") as HTMLElement[];
      const column = q("[data-gf-column]")[0] as HTMLElement;
      const card = q("[data-gf-card]")[0] as HTMLElement | undefined;
      const track = q("[data-gf-progress]")[0] as HTMLElement | undefined;
      const fill = track?.firstElementChild as HTMLElement | undefined;
      const hint = q("[data-gf-hint]")[0] as HTMLElement | undefined;

      // Character highlight on the statement (Fruitful `data-highlight-text`).
      statements.forEach((st) => {
        const chars = st.querySelectorAll("[data-char]");
        gsap.fromTo(
          chars,
          { opacity: 0.4 },
          { opacity: 1, stagger: 0.02, duration: 0.2, ease: "none", scrollTrigger: { trigger: root, start: "top 85%", end: "top 15%", scrub: true } },
        );
      });

      // ── entrance ──
      // offsetLeft/Top ignore transforms, so these read the same mid-flight.
      const toMiddle = (axis: "x" | "y") => {
        const f = sticky.getBoundingClientRect();
        const parent = (visual.offsetParent as HTMLElement).getBoundingClientRect();
        return axis === "x"
          ? f.left + f.width / 2 - (parent.left + visual.offsetLeft + visual.offsetWidth / 2)
          : f.top + f.height / 2 - (parent.top + visual.offsetTop + visual.offsetHeight / 2);
      };
      // Middle, then down until the scaled top edge sits at `peek`.
      const waitY = () => toMiddle("y") + (GF_IN.peek - 0.5) * sticky.offsetHeight + (GF_IN.scale * visual.offsetHeight) / 2;

      const { rise, fade, park } = GF_IN;
      gsap.set(visual, { transformOrigin: "50% 50%" });
      const intro = gsap.timeline({
        defaults: { ease: "power2.inOut" },
        scrollTrigger: { trigger: root, start: "top top", end: () => `+=${window.innerHeight}`, scrub: 0.6, invalidateOnRefresh: true },
      });
      intro
        .fromTo(visual, { y: waitY, scale: GF_IN.scale }, { y: 0, scale: 1, duration: rise[1] - rise[0] }, rise[0])
        .fromTo(visual, { x: () => toMiddle("x") }, { x: 0, ease: "power3.inOut", duration: park[1] - park[0] }, park[0])
        .fromTo(statements, { opacity: 1 }, { opacity: 0, ease: "none", duration: fade[1] - fade[0] }, fade[0])
        .fromTo(column, { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, ease: "power2.out", duration: GF_IN.column[1] - GF_IN.column[0] }, GF_IN.column[0]);
      // the timeline starts at 0 with an empty lead-in; pin its total length to 1 viewport
      intro.to({}, { duration: 0 }, 1);

      if (card) gsap.set(card, { autoAlpha: 0, y: 24 });
      if (track) gsap.set(track, { opacity: 0 });
      if (fill) gsap.set(fill, { scaleY: 0, transformOrigin: "50% 0%" });
      if (hint) gsap.set(hint, { autoAlpha: 0 });

      // ── scroll → screen time ──
      // In this trigger's progress the pin lands one viewport in, and the entrance
      // takes the next one. Both heights are vh, so the ratio survives a resize.
      const tlNow = () => screenTl.current!;
      const vp = () => window.innerHeight / root.offsetHeight;
      const RISE_AT = () => vp() * (1 + GF_IN.rise[0]);
      const BUILT_AT = () => vp() * (1 + GF_IN.rise[1]);
      const SCREEN_AT = vp() * 2;
      // Roma refinement: screens finish at 94% so the completed screen 3 holds while
      // still pinned (Fruitful ends exactly at unpin and the payoff scrolls away).
      const END_AT = 0.94;
      const mapRange = gsap.utils.mapRange;
      const clampU = gsap.utils.clamp;
      const screenTime = (p: number) => {
        const t = tlNow();
        const built = t.labels.strip;
        return p < SCREEN_AT ? clampU(0, built, mapRange(RISE_AT(), BUILT_AT(), 0, built, p)) : clampU(built, t.duration(), mapRange(SCREEN_AT, END_AT, built, t.duration(), p));
      };

      let lastProgress: number | null = null;
      const main = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: root,
          start: "top bottom",
          end: "bottom bottom",
          scrub: 0.6,
          onUpdate: (self) => {
            if (!screenTl.current) return;
            // Only real scroll takes over (idle ticks must not cut off a tab rebuild).
            const first = lastProgress === null;
            if (!first && Math.abs(self.progress - (lastProgress as number)) <= 0.0005) return;
            lastProgress = self.progress;
            let t = screenTime(self.progress);
            if (hold.current !== null) {
              if (t < hold.current) t = hold.current;
              else hold.current = null;
            }
            goTo(t, { duration: first ? 0 : 0.3, ease: "power3.out" });
          },
        },
      });

      // Progress rail: arrives with the column, fills across the screens' scroll.
      if (track) main.to(track, { opacity: 1, duration: 0.04 }, SCREEN_AT - 0.1);
      if (fill) main.to(fill, { scaleY: 1, duration: END_AT - SCREEN_AT }, SCREEN_AT);

      const D = tlNow().duration();
      const L = tlNow().labels;
      // Channel card belongs to screen 2: it arrives as the bands start stretching.
      if (card) {
        const at = mapRange(L.strip, D, SCREEN_AT, END_AT, L.stretch);
        main.to(card, { autoAlpha: 1, y: 0, duration: 0.06 }, at);
      }
      // Keep-scrolling hint: in once the panel has parked, out as screen 3 finishes.
      if (hint) {
        const outAt = mapRange(L.strip, D, SCREEN_AT, END_AT, D - 0.6);
        main.fromTo(hint, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.03 }, SCREEN_AT).fromTo(
          hint,
          { autoAlpha: 1 },
          { autoAlpha: 0, duration: 0.03, immediateRender: false },
          outAt,
        );
        const icon = hint.querySelector("svg");
        if (icon) gsap.to(icon, { y: 5, duration: 0.8, ease: "sine.inOut", repeat: -1, yoyo: true });
      }
      main.to({}, { duration: 0 }, 1);
    }, root);

    const refresh = () => ScrollTrigger.refresh();
    document.fonts?.ready.then(refresh);
    window.addEventListener("load", refresh);
    return () => {
      ctx.revert();
      drive.current?.kill();
      window.removeEventListener("load", refresh);
    };
  }, [goTo]);

  const select = (i: number) => {
    if (i === active) return;
    pendingSwitch.current = { now: clock.current.t };
    setActive(i);
  };

  const onTabKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft" && e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
    e.preventDefault();
    const dir = e.key === "ArrowRight" || e.key === "ArrowDown" ? 1 : -1;
    const next = (active + dir + SCENARIOS.length) % SCENARIOS.length;
    select(next);
    (e.currentTarget.querySelectorAll<HTMLButtonElement>("[role=tab]")[next])?.focus();
  };

  const chars = splitChars;

  const [st1, stAccent, stDot, st2] = featureCopy.statementDesktop;

  return (
    <section className={s.section} id="how-it-works" aria-labelledby="feature-statement">
      <div ref={container} className={s.container}>
        <div className={s.sticky} data-gf-sticky>
          <div className={s.statement} data-gf-statement>
            <h2 id="feature-statement" className={`${s.statementText} type-h2`} aria-label={`${st1}${stAccent}${stDot} ${st2}`}>
              <span aria-hidden="true">
                {chars(st1)}
                <span className={s.nowrap}>
                  {chars(stAccent, true)}
                  {chars(stDot)}
                </span>
                <br />
                {chars(st2)}
              </span>
            </h2>
          </div>

          <div className={s.layoutWrap}>
            <div className={s.layout}>
              <div className={s.column} data-gf-column data-anim="column">
                <div className={s.progress} data-gf-progress aria-hidden="true">
                  <span />
                </div>
                <div className={s.columnTop}>
                  <h3 className={`${s.heading} type-h3`}>
                    {featureCopy.heading.before}
                    <span className="accent">{featureCopy.heading.accent}</span>
                    {featureCopy.heading.after}
                  </h3>
                  <p className={s.body}>{featureCopy.body}</p>
                </div>
                <div className={s.card} data-gf-card>
                  <p className={s.cardTitle}>{featureCopy.cardTitle}</p>
                  <p className={s.cardSub}>{featureCopy.cardSub}</p>
                  <div className={s.tabs} role="tablist" aria-label="Channel" onKeyDown={onTabKey}>
                    {SCENARIOS.map((sc, i) => (
                      <button
                        key={sc.key}
                        type="button"
                        role="tab"
                        aria-selected={i === active}
                        aria-controls="feature-panel"
                        tabIndex={i === active ? 0 : -1}
                        className={`${s.tab} ${i === active ? s.tabActive : ""}`}
                        onClick={() => select(i)}
                      >
                        <span className={s.tabIcon}>{sc.initial}</span>
                        <span>{sc.channel}</span>
                        <span className={s.tabCheck} aria-hidden="true">
                          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M3.5 8.5 6.5 11.5 12.5 5" />
                          </svg>
                        </span>
                      </button>
                    ))}
                  </div>
                  <div className={`${s.hint} ${s.hintCard}`} data-gf-hint aria-hidden="true">
                    Keep scrolling
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M8 3v10M3.5 8.5 8 13l4.5-4.5" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className={s.visual} data-gf-visual>
                {/* long cast shadow, light from upper-left (Fruitful phone shadow, rebuilt in CSS) */}
                <span className={s.phoneShadow} aria-hidden="true" />
                <div className={s.panel} id="feature-panel" role="tabpanel" aria-label={`${scenario.channel} deductions example`}>
                  <div ref={host} className={s.panelHost} aria-hidden="true">
                    <AppPanel key={scenario.key} s={scenario} />
                  </div>
                  <p className="sr-only">
                    Example for {scenario.channel}: {scenario.total} deducted this quarter, split into {scenario.bars.map((b) => `${b.label} ${b.amount}`).join(", ")}.{" "}
                    {scenario.split.recoverable} identified as recoverable. {scenario.inDispute} in dispute and recoveries tracked to cash.
                  </p>
                </div>
                <p className={s.caption}>{featureCopy.caption}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
