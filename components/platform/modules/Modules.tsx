"use client";

import { useEffect, useLayoutEffect, useRef, useState, type KeyboardEvent } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/motion";
import { ILLUSTRATIVE, MODULES, modulesCopy, type ModuleKey } from "@/lib/content/platform";
import { refreshWhenReady, rise } from "@/components/platform/motion";
import { MODULE_MOCKS } from "./ModuleMocks";
import ArrowLink from "@/components/ui/ArrowLink";
import s from "./modules.module.css";

/** Each module's own product page (DESIGN.md §G.11). */
const MODULE_HREF: Record<ModuleKey, string> = {
  deductions: "/deduction-management",
  analytics: "/analytics",
  accounting: "/accounting",
};

/**
 * The three modules — Hyperline's FeatureTabs (media square + tab list, active tab
 * shows its description; panels cross-fade) in Roma's card language, timed: each tab
 * holds 5s (a red bar fills on it), then the next one takes over, looping.
 *
 * Each module's mock plays one state change when it is shown: backup lines are matched
 * (deductions), bars grow against last year (analytics), lines get their GL codes
 * (accounting). The first one waits until the section scrolls into view.
 */

const SWAP = 0.3; // s cross-fade between panels (Hyperline: 300ms)
const AUTO = 5; // s per tab before autoplay moves on (client brief)
const ENTER_START = "top 70%";

type Q = (sel: string) => Element[];

const BUILD: Record<ModuleKey, (q: Q) => gsap.core.Timeline> = {
  // Backup lines are read and ticked, the reason-code picker opens and settles on
  // R-14, then the status resolves to Backup attached.
  deductions(q) {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    const sel = q('[data-mm="sel"]');
    gsap.set(q('[data-mm="final"], [data-mm="reasonSet"]'), { autoAlpha: 0 });
    gsap.set(q('[data-mm="pending"], [data-mm="reasonEmpty"]'), { autoAlpha: 1 });
    tl.from(q('[data-mm="main"]'), { autoAlpha: 0, y: 20, duration: 0.6 }, 0)
      .from(q('[data-mm="line"]'), { autoAlpha: 0, y: 8, duration: 0.4, stagger: 0.1 }, 0.3)
      .from(q('[data-mm="tick"]'), { autoAlpha: 0, scale: 0.3, duration: 0.35, stagger: 0.12, ease: "back.out(2.5)" }, 0.6)
      .from(q('[data-mm="act"]'), { autoAlpha: 0, x: -8, duration: 0.4, stagger: 0.1 }, 0.7)
      .from(q('[data-mm="popover"]'), { autoAlpha: 0, y: -8, scale: 0.96, duration: 0.45 }, 0.95)
      .fromTo(sel, { y: "-100%" }, { y: "0%", duration: 0.45, ease: "power2.inOut" }, 1.45)
      .from(q('[data-mm="optCheck"]'), { autoAlpha: 0, scale: 0.4, duration: 0.3, ease: "back.out(2.5)" }, 1.85)
      .to(q('[data-mm="reasonEmpty"]'), { autoAlpha: 0, duration: 0.15 }, 1.95)
      .fromTo(q('[data-mm="reasonSet"]'), { autoAlpha: 0, x: -6 }, { autoAlpha: 1, x: 0, duration: 0.35 }, 2.0)
      .to(q('[data-mm="pending"]'), { autoAlpha: 0, scale: 0.9, duration: 0.2, ease: "power2.in" }, 2.2)
      .fromTo(q('[data-mm="final"]'), { autoAlpha: 0, scale: 0.8 }, { autoAlpha: 1, scale: 1, duration: 0.45, ease: "back.out(2)" }, 2.35);
    return tl;
  },
  // Last year's bars lay down first, this quarter's grow over them, values count up.
  analytics(q) {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.from(q('[data-mm="main"]'), { autoAlpha: 0, y: 20, duration: 0.6 }, 0)
      .from(q('[data-mm="prev"]'), { scaleX: 0, duration: 0.7, stagger: 0.07 }, 0.25)
      .from(q('[data-mm="now"]'), { scaleX: 0, duration: 0.8, stagger: 0.07 }, 0.5)
      .from(q('[data-mm="kpi"]'), { autoAlpha: 0, y: 10, duration: 0.45, stagger: 0.08 }, 0.9);
    q('[data-mm="val"]').forEach((el, i) => {
      const to = Number((el as HTMLElement).dataset.to ?? 0);
      const n = { v: 0 };
      tl.fromTo(n, { v: 0 }, { v: to, duration: 0.8, onUpdate: () => void (el.textContent = `${n.v.toFixed(1)}%`) }, 0.5 + i * 0.07);
    });
    return tl;
  },
  // Remittance lines land, each gets its GL code, then the export toast rises.
  accounting(q) {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    gsap.set(q('[data-mm="gl"]'), { autoAlpha: 0 });
    gsap.set(q('[data-mm="unmapped"]'), { autoAlpha: 1 });
    tl.from(q('[data-mm="main"]'), { autoAlpha: 0, y: 20, duration: 0.6 }, 0).from(
      q('[data-mm="line"]'),
      { autoAlpha: 0, y: 8, duration: 0.45, stagger: 0.1 },
      0.25,
    );
    q('[data-mm="line"]').forEach((line, i) => {
      const at = 0.7 + i * 0.22;
      tl.to(line.querySelector('[data-mm="unmapped"]'), { autoAlpha: 0, duration: 0.2, ease: "power2.in" }, at).fromTo(
        line.querySelector('[data-mm="gl"]'),
        { autoAlpha: 0, x: -6 },
        { autoAlpha: 1, x: 0, duration: 0.4 },
        at + 0.15,
      );
    });
    tl.from(q('[data-mm="act"]'), { autoAlpha: 0, x: -8, duration: 0.4, stagger: 0.12 }, 1.55).from(
      q('[data-mm="toast"]'),
      { autoAlpha: 0, y: 24, duration: 0.55, ease: "back.out(1.4)" },
      1.75,
    );
    return tl;
  },
};

export default function Modules() {
  const root = useRef<HTMLElement>(null);
  const host = useRef<HTMLDivElement>(null);
  const entered = useRef(false);
  const [active, setActive] = useState(0);
  const mod = MODULES[active];
  const Mock = MODULE_MOCKS[mod.key];
  const { before, accent, after } = modulesCopy.heading;

  const [inView, setInView] = useState(false);

  // Section entrance, and whether the card is on screen (drives the autoplay).
  useLayoutEffect(() => {
    const el = root.current;
    if (!el || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(el);
      rise(q("[data-md-head]"), q("[data-md-head]")[0]);
      rise(q("[data-md-card]"), q("[data-md-card]")[0], { start: "top 85%" });
      ScrollTrigger.create({
        trigger: q("[data-md-card]")[0],
        start: ENTER_START,
        end: "bottom 20%",
        onToggle: (self) => setInView(self.isActive),
      });
    }, el);
    const stop = refreshWhenReady();
    return () => {
      stop();
      ctx.revert();
    };
  }, []);

  // Autoplay: the active tab's bar fills over AUTO seconds, then the next tab takes
  // over, looping back to the first. Starts only once the card is in view, stops while
  // it is off screen; hover does not pause it; a click restarts the timer on that tab.
  useEffect(() => {
    const el = root.current;
    if (!el || !inView || prefersReducedMotion()) return;
    const bar = el.querySelector<HTMLElement>(`[data-md-progress="${active}"]`);
    if (!bar) return;
    const tw = gsap.fromTo(
      bar,
      { "--p": 0 },
      { "--p": 1, duration: AUTO, ease: "none", onComplete: () => setActive((a) => (a + 1) % MODULES.length) },
    );
    return () => {
      tw.kill();
      gsap.set(bar, { "--p": 0 });
    };
  }, [active, inView]);

  // Per-panel state timeline: play now if the section was already seen, else on enter.
  useLayoutEffect(() => {
    const el = host.current;
    if (!el || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      const tl = BUILD[MODULES[active].key](gsap.utils.selector(el)).pause();
      if (entered.current) {
        gsap.fromTo(el, { autoAlpha: 0 }, { autoAlpha: 1, duration: SWAP, ease: "power2.out" });
        tl.play();
      } else {
        ScrollTrigger.create({
          trigger: el,
          start: ENTER_START,
          once: true,
          onEnter: () => {
            entered.current = true;
            tl.play();
          },
        });
      }
    }, el);
    return () => ctx.revert();
  }, [active]);

  const select = (i: number) => {
    if (i === active) return;
    entered.current = true; // a click means the user is here
    setActive(i);
  };

  const onTabKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const keys = ["ArrowRight", "ArrowLeft", "ArrowDown", "ArrowUp", "Home", "End"];
    if (!keys.includes(e.key)) return;
    e.preventDefault();
    const n = MODULES.length;
    const next =
      e.key === "Home" ? 0 : e.key === "End" ? n - 1 : (active + (e.key === "ArrowRight" || e.key === "ArrowDown" ? 1 : -1) + n) % n;
    select(next);
    e.currentTarget.querySelectorAll<HTMLButtonElement>("[role=tab]")[next]?.focus();
  };

  return (
    <section ref={root} className={s.section} id="modules" aria-labelledby="modules-heading">
      <div className={s.inner}>
        <div className={s.head}>
          <p className={`${s.label} type-label`} data-md-head>
            {modulesCopy.label}
          </p>
          <h2 id="modules-heading" className={`${s.heading} type-h2`} data-md-head>
            {before}
            <span className="accent">{accent}</span>
            {after}
          </h2>
          <p className={`${s.lead} type-lead`} data-md-head>
            {modulesCopy.lead}
          </p>
        </div>

        <div className={s.card} data-md-card>
          <div className={s.tabs} role="tablist" aria-label="Roma modules" aria-orientation="vertical" onKeyDown={onTabKey}>
            {MODULES.map((m, i) => (
              <button
                key={m.key}
                type="button"
                role="tab"
                id={`module-tab-${m.key}`}
                aria-selected={i === active}
                aria-controls="module-panel"
                tabIndex={i === active ? 0 : -1}
                className={`${s.tab} ${i === active ? s.tabActive : ""}`}
                onClick={() => select(i)}
              >
                <span className={s.tabNum}>{String(i + 1).padStart(2, "0")}</span>
                <span className={s.tabTitle}>{m.tab}</span>
                <span className={s.progress} data-md-progress={i} aria-hidden="true" />
              </button>
            ))}
          </div>

          <div className={s.well}>
            <div ref={host} className={s.mockHost} aria-hidden="true">
              <Mock key={mod.key} />
            </div>
          </div>

          <div className={s.panel} id="module-panel" role="tabpanel" aria-labelledby={`module-tab-${mod.key}`}>
            <p key={mod.key} className={`${s.panelLead} type-h5`}>
              {mod.lead}
            </p>
            <ul className={s.points}>
              {mod.points.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
            <ArrowLink href={MODULE_HREF[mod.key]} className={s.explore}>
              Explore {mod.tab.toLowerCase()}
            </ArrowLink>
            <p className="sr-only">Illustration: {mod.summary}</p>
          </div>
        </div>
        <p className={s.caption}>{ILLUSTRATIVE}</p>
      </div>
    </section>
  );
}
