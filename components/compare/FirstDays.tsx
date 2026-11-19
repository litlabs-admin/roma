"use client";

import { useLayoutEffect, useRef, type CSSProperties } from "react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/motion";
import { firstDays as d } from "@/lib/content/compare/glimpse";
import { RomaGlyph } from "@/components/platform/mock/kit";
import GlimpseMark from "./GlimpseMark";
import s from "./firstDays.module.css";

/**
 * Hero art for /compare/glimpse (DESIGN.md §G.13): "The first 45 days".
 * A ledger-style timeline, day 0 → 45, two lanes. Roma is live at day 0 and deductions
 * land along its lane; Glimpse's lane carries its own published onboarding milestones.
 * A playhead sweeps once on load; the lanes change state as it passes (the change of
 * state is the point: one is working while the other is still onboarding).
 *
 * Positions are percentages of the track, type is rem, so it reads at phone width.
 * SSR markup is the finished state; JS sets start states just before animating.
 */

const SWEEP = 2.6; // s, playhead 0 → 45
const START = 1.05; // s, after the hero card has risen (ProductHero T.card + most of cardDur)

const pct = (day: number) => `${(day / d.days) * 100}%`;
const posStyle = (day: number): CSSProperties => ({ ["--x" as string]: pct(day) });

export default function FirstDays() {
  const root = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = root.current;
    if (!el || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(el);
      const at = (day: number) => (day / d.days) * SWEEP;
      const counter = q("[data-fd='count']")[0] as HTMLElement | undefined;
      const tl = gsap.timeline({ delay: START, defaults: { ease: "power3.out" } });

      // Playhead + the Roma fill share one linear clock, so the fill sits exactly under it.
      const clock = { day: 0 };
      tl.fromTo(q("[data-fd='head']"), { x: 0, xPercent: 0 }, { x: 0, xPercent: 100, duration: SWEEP, ease: "none" }, 0)
        .fromTo(q("[data-fd='fill']"), { clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0% 0 0)", duration: SWEEP, ease: "none" }, 0)
        .fromTo(
          clock,
          { day: 0 },
          {
            day: d.days,
            duration: SWEEP,
            ease: "none",
            onUpdate: () => {
              if (counter) counter.textContent = `Day ${Math.round(clock.day)}`;
            },
          },
          0,
        )
        .fromTo(q("[data-fd='live']"), { autoAlpha: 0, scale: 0.6 }, { autoAlpha: 1, scale: 1, duration: 0.5, ease: "back.out(2)" }, 0.05);

      q("[data-fd='chip']").forEach((c) => {
        tl.fromTo(c, { autoAlpha: 0, y: -10 }, { autoAlpha: 1, y: 0, duration: 0.45 }, at(Number((c as HTMLElement).dataset.day)) + 0.04);
      });
      q("[data-fd='pin']").forEach((p) => {
        tl.fromTo(p, { opacity: 0.28 }, { opacity: 1, duration: 0.35, ease: "power1.out" }, at(Number((p as HTMLElement).dataset.day)));
      });
      tl.fromTo(q("[data-fd='glane']"), { clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0% 0 0)", duration: SWEEP, ease: "none" }, 0)
        .fromTo(q("[data-fd='end']"), { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.6 }, SWEEP + 0.05)
        .fromTo(q("[data-fd='headLine']"), { autoAlpha: 1 }, { autoAlpha: 0.35, duration: 0.6, immediateRender: false }, SWEEP + 0.2);
    }, el);
    return () => {
      ctx.revert();
      const counter = el.querySelector<HTMLElement>("[data-fd='count']");
      if (counter) counter.textContent = `Day ${d.days}`;
    };
  }, []);

  return (
    <div ref={root} className={s.window} aria-hidden="true">
      <div className={s.head}>
        <b className={s.title}>The first 45 days</b>
        <span className={s.legend}>
          <span className={s.key}>
            <i className={s.keyRoma} />
            {d.roma.name}
          </span>
          <span className={s.key}>
            <i className={s.keyGlimpse} />
            {d.glimpse.name}
          </span>
        </span>
      </div>

      <div className={s.plot}>
        {/* Ruler, aligned to the track column */}
        <div className={s.row}>
          <span />
          <div className={s.ruler}>
            {d.ruler.map((day) => (
              <span key={day} className={`${s.tick} ${(d.rulerMobile as readonly number[]).includes(day) ? s.tickKey : ""}`} style={posStyle(day)}>
                {day === 0 ? "Day 0" : day}
              </span>
            ))}
          </div>
        </div>

        {/* Roma lane */}
        <div className={`${s.row} ${s.lane}`}>
          <div className={s.who}>
            <span className={s.badge}>
              <RomaGlyph className={s.rosette} />
            </span>
            <span>
              <b>{d.roma.name}</b>
              <em>Day 0 onward</em>
            </span>
          </div>
          <div className={s.track}>
            <div className={s.chips}>
              {d.roma.chips.map((c, i) => (
                <span key={c.label} className={`${s.chip} ${i % 2 ? s.chipLow : ""}`} style={posStyle(c.day)} data-fd="chip" data-day={c.day}>
                  <i className={s[c.cat]} />
                  {c.label}
                </span>
              ))}
            </div>
            <div className={s.bar}>
              <div className={s.fill} data-fd="fill">
                <span className={s.live} data-fd="live">
                  {d.roma.live}
                </span>
                <span className={s.barText}>{d.roma.bar}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Glimpse lane: neutral ink, their published milestones */}
        <div className={`${s.row} ${s.lane}`}>
          <div className={s.who}>
            <span className={`${s.badge} ${s.badgeG}`}>
              <GlimpseMark />
            </span>
            <span>
              <b>{d.glimpse.name}</b>
              <em>{d.glimpse.tag}</em>
            </span>
          </div>
          <div className={`${s.track} ${s.trackG}`}>
            <span className={s.flag} style={posStyle(d.glimpse.firstDispute.day)} data-fd="pin" data-day={d.glimpse.firstDispute.day}>
              <b>{d.glimpse.firstDispute.label}</b> · {d.glimpse.firstDispute.title}
            </span>
            <div className={s.gbar}>
              <div className={s.gfill} data-fd="glane" />
              <i className={s.diamond} style={posStyle(d.glimpse.firstDispute.day)} data-fd="pin" data-day={d.glimpse.firstDispute.day} />
              {d.glimpse.milestones.map((m) => (
                <i key={m.label} className={s.pin} style={posStyle(m.day)} data-edge={m.day === 0 ? "start" : m.day === d.days ? "end" : undefined} data-fd="pin" data-day={m.day} />
              ))}
            </div>
            <div className={s.mLabels}>
              {d.glimpse.milestones.map((m) => (
                <span key={m.label} className={s.mLabel} style={posStyle(m.day)} data-edge={m.day === 0 ? "start" : m.day === d.days ? "end" : undefined} data-fd="pin" data-day={m.day}>
                  <b>{m.label}</b>
                  <span>{m.title}</span>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Playhead over the track column */}
        <div className={`${s.row} ${s.headRow}`}>
          <span />
          <div className={s.headTrack}>
            <div className={s.playhead} data-fd="head">
              <span className={s.headLine} data-fd="headLine" />
              <span className={s.count} data-fd="count">
                Day {d.days}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className={s.end} data-fd="end">
        <b>{d.end.day}</b>
        <span>{d.end.glimpse}</span>
        <span className={s.endSep} />
        <span className={s.endRoma}>{d.end.roma}</span>
      </div>
    </div>
  );
}
