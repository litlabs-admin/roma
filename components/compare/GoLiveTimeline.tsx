"use client";

import { useLayoutEffect, useRef, type CSSProperties } from "react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/motion";
import type { TimelineArt } from "@/lib/content/compare/types";
import { RomaGlyph } from "@/components/platform/mock/kit";
import { useCompare } from "./context";
import CompetitorMark from "./CompetitorMark";
import s from "./goLive.module.css";

/**
 * Hero art for the comparison pages (DESIGN.md §G.13): "time to go live".
 * A ledger-style timeline, day 0 → `days`, two lanes. Roma is live at day 0 and
 * deductions land along its lane; the competitor's lane carries only what it publishes:
 * milestones, a single marker (e.g. first dispute), or a range band (e.g. "two to four
 * months"). A playhead sweeps once on load; the lanes change state as it passes.
 *
 * Positions are percentages of the track, type is rem, so it reads at phone width.
 * SSR markup is the finished state; JS sets start states just before animating.
 */

const SWEEP = 2.6; // s, playhead 0 → end
const START = 1.05; // s, after the hero card has risen (ProductHero T.card + most of cardDur)

export default function GoLiveTimeline({ art }: { art: TimelineArt }) {
  const { c } = useCompare();
  const root = useRef<HTMLDivElement>(null);
  const { days, unit, per, them } = art;

  const pct = (day: number) => `${(day / days) * 100}%`;
  const pos = (day: number): CSSProperties => ({ ["--x" as string]: pct(day) });
  const edge = (day: number) => (day <= 0 ? "start" : day >= days ? "end" : undefined);
  const tick = (day: number) => (day === 0 ? (unit === "Day" ? "Day 0" : "Today") : unit === "Day" ? String(day) : `${day / per} mo`);
  const count = (day: number) => (unit === "Day" ? `Day ${Math.round(day)}` : `Month ${Math.floor(day / per + 0.001)}`);
  const title = unit === "Day" ? `The first ${days} days` : `The first ${days / per} months`;

  useLayoutEffect(() => {
    const el = root.current;
    if (!el || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(el);
      const at = (day: number) => (day / days) * SWEEP;
      const counter = q("[data-gl='count']")[0] as HTMLElement | undefined;
      const tl = gsap.timeline({ delay: START, defaults: { ease: "power3.out" } });

      // Playhead + the Roma fill share one linear clock, so the fill sits exactly under it.
      const clock = { day: 0 };
      tl.fromTo(q("[data-gl='head']"), { x: 0, xPercent: 0 }, { x: 0, xPercent: 100, duration: SWEEP, ease: "none" }, 0)
        .fromTo(q("[data-gl='fill']"), { clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0% 0 0)", duration: SWEEP, ease: "none" }, 0)
        .fromTo(q("[data-gl='lane']"), { clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0% 0 0)", duration: SWEEP, ease: "none" }, 0)
        .fromTo(
          clock,
          { day: 0 },
          {
            day: days,
            duration: SWEEP,
            ease: "none",
            onUpdate: () => {
              if (counter) counter.textContent = count(clock.day);
            },
          },
          0,
        )
        .fromTo(q("[data-gl='live']"), { autoAlpha: 0, scale: 0.6 }, { autoAlpha: 1, scale: 1, duration: 0.5, ease: "back.out(2)" }, 0.05);

      q("[data-gl='chip']").forEach((n) => {
        tl.fromTo(n, { autoAlpha: 0, y: -10 }, { autoAlpha: 1, y: 0, duration: 0.45 }, at(Number((n as HTMLElement).dataset.day)) + 0.04);
      });
      q("[data-gl='pin']").forEach((n) => {
        tl.fromTo(n, { opacity: 0.28 }, { opacity: 1, duration: 0.35, ease: "power1.out" }, at(Number((n as HTMLElement).dataset.day)));
      });
      tl.fromTo(q("[data-gl='end']"), { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.6 }, SWEEP + 0.05).fromTo(
        q("[data-gl='headLine']"),
        { autoAlpha: 1 },
        { autoAlpha: 0.35, duration: 0.6, immediateRender: false },
        SWEEP + 0.2,
      );
    }, el);
    return () => {
      ctx.revert();
      const counter = el.querySelector<HTMLElement>("[data-gl='count']");
      if (counter) counter.textContent = count(days);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [days]);

  return (
    <div ref={root} className={s.window} aria-hidden="true">
      <div className={s.head}>
        <b className={s.title}>{title}</b>
        <span className={s.legend}>
          <span className={s.key}>
            <i className={s.keyRoma} />
            Roma
          </span>
          <span className={s.key}>
            <i className={s.keyThem} />
            {c.name}
          </span>
        </span>
      </div>

      <div className={s.plot}>
        {/* Ruler, aligned to the track column */}
        <div className={s.row}>
          <span />
          <div className={s.ruler}>
            {art.ruler.map((day) => (
              <span key={day} className={`${s.tick} ${art.rulerMobile.includes(day) ? s.tickKey : ""}`} style={pos(day)}>
                {tick(day)}
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
              <b>Roma</b>
              <em>Day 0 onward</em>
            </span>
          </div>
          <div className={s.track}>
            <div className={s.chips}>
              {art.chips.map((ch, i) => (
                <span key={ch.label} className={`${s.chip} ${i % 2 ? s.chipLow : ""}`} style={pos(ch.day)} data-gl="chip" data-day={ch.day}>
                  <i className={s[ch.cat]} />
                  {ch.label}
                </span>
              ))}
            </div>
            <div className={s.bar}>
              <div className={s.fill} data-gl="fill">
                <span className={s.live} data-gl="live">
                  Live · under 5 min
                </span>
                <span className={s.barText}>Your deductions, classified and in view</span>
              </div>
            </div>
          </div>
        </div>

        {/* Competitor lane: neutral ink, only what it publishes */}
        <div className={`${s.row} ${s.lane}`}>
          <div className={s.who}>
            <span className={`${s.badge} ${s.badgeThem}`}>
              <CompetitorMark />
            </span>
            <span>
              <b>{c.name}</b>
              <em>{them.tag}</em>
            </span>
          </div>
          <div className={`${s.track} ${them.marker || them.range ? s.trackThem : ""}`}>
            {them.marker && (
              <span className={s.flag} style={pos(them.marker.day)} data-gl="pin" data-day={them.marker.day}>
                <b>{them.marker.label}</b> · {them.marker.title}
              </span>
            )}
            {them.range && (
              <span className={`${s.flag} ${s.flagRange}`} style={pos((them.range.from + them.range.to) / 2)} data-gl="pin" data-day={them.range.from}>
                <b>{them.range.label}</b> · {them.range.title}
              </span>
            )}
            <div className={s.gbar}>
              <div className={s.gfill} data-gl="lane" />
              {them.range && (
                <span
                  className={s.range}
                  style={{ ["--from" as string]: pct(them.range.from), ["--to" as string]: pct(them.range.to) } as CSSProperties}
                  data-gl="pin"
                  data-day={them.range.from}
                />
              )}
              {them.marker && <i className={s.diamond} style={pos(them.marker.day)} data-gl="pin" data-day={them.marker.day} />}
              {them.milestones?.map((m) => (
                <i key={m.label} className={s.pin} style={pos(m.day)} data-edge={edge(m.day)} data-gl="pin" data-day={m.day} />
              ))}
            </div>
            {them.milestones && (
              <div className={s.mLabels}>
                {them.milestones.map((m) => (
                  <span key={m.label} className={s.mLabel} style={pos(m.day)} data-edge={edge(m.day)} data-gl="pin" data-day={m.day}>
                    <b>{m.label}</b>
                    <span>{m.title}</span>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Playhead over the track column */}
        <div className={`${s.row} ${s.headRow}`}>
          <span />
          <div className={s.headTrack}>
            <div className={s.playhead} data-gl="head">
              <span className={s.headLine} data-gl="headLine" />
              <span className={s.count} data-gl="count">
                {count(days)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className={s.end} data-gl="end">
        <b>{art.end.label}</b>
        <span>{art.end.them}</span>
        <span className={s.endSep} />
        <span className={s.endRoma}>{art.end.roma}</span>
      </div>
    </div>
  );
}
