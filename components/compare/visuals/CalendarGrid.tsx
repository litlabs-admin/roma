"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/motion";
import type { CalendarArt } from "@/lib/content/compare/types";
import { RomaGlyph } from "@/components/platform/mock/kit";
import CompetitorLogo from "../CompetitorLogo";
import s from "./calendar.module.css";

/**
 * Glimpse hero art (DESIGN.md §G.13): the first 45 days as a calendar. Every day fills
 * red from day one (Roma is live in under 5 minutes) and deductions land on some of them;
 * Glimpse's published onboarding milestones are pinned on the same days, numbered, and
 * listed beside the grid in its own words. The fill sweeps once on load; SSR markup is
 * the finished state.
 */

const START = 1.05; // s, after the hero card has risen
const STEP = 0.045; // s per day

export default function CalendarGrid({ art }: { art: CalendarArt }) {
  const root = useRef<HTMLDivElement>(null);
  const days = Array.from({ length: art.days }, (_, i) => i + 1);
  const chipOn = new Map(art.chips.map((c) => [c.day, c]));
  const msOn = new Map(art.milestones.map((m, i) => [m.day, { ...m, n: i + 1 }]));

  useLayoutEffect(() => {
    const el = root.current;
    if (!el || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(el);
      const tl = gsap.timeline({ delay: START, defaults: { ease: "power3.out" } });
      tl.fromTo(q("[data-cg='fill']"), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.25, stagger: STEP, ease: "power1.out" }, 0);
      q("[data-cg='chip']").forEach((n) => {
        const d = Number((n as HTMLElement).dataset.day);
        tl.fromTo(n, { autoAlpha: 0, scale: 0.5 }, { autoAlpha: 1, scale: 1, duration: 0.35, ease: "back.out(2)" }, (d - 1) * STEP + 0.05);
      });
      q("[data-cg='ms']").forEach((n) => {
        const d = Number((n as HTMLElement).dataset.day);
        tl.fromTo(n, { opacity: 0.3 }, { opacity: 1, duration: 0.3 }, (d - 1) * STEP);
      });
      tl.fromTo(q("[data-cg='live']"), { autoAlpha: 0, y: 6 }, { autoAlpha: 1, y: 0, duration: 0.5 }, 0).fromTo(
        q("[data-cg='end']"),
        { autoAlpha: 0, y: 8 },
        { autoAlpha: 1, y: 0, duration: 0.6 },
        art.days * STEP + 0.1,
      );
    }, el);
    return () => ctx.revert();
  }, [art.days]);

  return (
    <div ref={root} className={s.window} aria-hidden="true">
      <div className={s.head}>
        <b className={s.title}>The first {art.days} days</b>
        <span className={s.legend}>
          <span className={s.key}>
            <i className={s.keyRoma} />
            Roma: deductions in view
          </span>
          <span className={s.key}>
            <i className={s.keyThem} />
            Glimpse milestone
          </span>
        </span>
      </div>

      <div className={s.body}>
        <div className={s.calWrap}>
          <p className={s.live} data-cg="live">
            <span className={s.badge}>
              <RomaGlyph className={s.rosette} />
            </span>
            Live on day 1, in under 5 minutes
          </p>
          <ol className={s.grid}>
            {days.map((d) => {
              const chip = chipOn.get(d);
              const ms = msOn.get(d);
              return (
                <li key={d} className={`${s.cell} ${ms ? s.cellMs : ""} ${ms?.key ? s.cellKey : ""}`}>
                  <i className={s.fill} data-cg="fill" />
                  <span className={s.n}>{d}</span>
                  {chip && (
                    <span className={s.chip} data-cg="chip" data-day={d}>
                      <i className={s[chip.cat]} />
                      <span className={s.chipText}>{chip.label}</span>
                    </span>
                  )}
                  {ms && (
                    <span className={s.pin} data-cg="ms" data-day={d}>
                      {ms.n}
                    </span>
                  )}
                </li>
              );
            })}
          </ol>
        </div>

        <aside className={s.side}>
          <p className={s.sideHead}>
            <CompetitorLogo height={1.05} />
            <span>Published onboarding</span>
          </p>
          <ol className={s.msList}>
            {art.milestones.map((m, i) => (
              <li key={m.label} className={`${s.ms} ${m.key ? s.msKey : ""}`} data-cg="ms" data-day={m.day}>
                <span className={s.msN}>{i + 1}</span>
                <span>
                  <b>{m.label}</b>
                  {m.title}
                </span>
              </li>
            ))}
          </ol>
        </aside>
      </div>

      <div className={s.end} data-cg="end">
        <b>Day {art.days}</b>
        <span>{art.end.them}</span>
        <span className={s.endSep} />
        <span className={s.endRoma}>{art.end.roma}</span>
      </div>
    </div>
  );
}
