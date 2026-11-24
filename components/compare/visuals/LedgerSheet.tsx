"use client";

import { useLayoutEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/motion";
import { competitors, matrixCell } from "@/lib/content/compare";
import { CRITERIA, HERO_CRITERIA, NOT_PUBLISHED } from "@/lib/content/compare/criteria";
import CompetitorLogo from "../CompetitorLogo";
import s from "./ledger.module.css";

/**
 * /compare hero art (DESIGN.md §G.13a): a comparison sheet filling itself in. The three
 * deciding questions are asked of every tool; row by row each answer is written in and
 * ruled off, competitors first, then Roma's, which lands with a red tick. Values come
 * from the same `matrixCell` data as the matrix, so the art can't disagree with it.
 * Plays once after the hero card rises; SSR markup is the finished sheet. Decorative:
 * the hero's sr-only summary carries the same content.
 */

const START = 1.05; // s, after the hero card has risen
const ROWS = CRITERIA.filter((c) => HERO_CRITERIA.includes(c.id));

export default function LedgerSheet() {
  const root = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = root.current;
    if (!el || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(el);
      const tl = gsap.timeline({ delay: START, defaults: { ease: "power3.out" } });
      tl.fromTo(q("[data-ls='col']"), { autoAlpha: 0, y: 6 }, { autoAlpha: 1, y: 0, duration: 0.4, stagger: 0.06 }, 0);
      q("[data-ls='row']").forEach((row, r) => {
        const rq = gsap.utils.selector(row);
        const at = 0.35 + r * 0.75;
        tl.fromTo(rq("[data-ls='q']"), { autoAlpha: 0, x: -6 }, { autoAlpha: 1, x: 0, duration: 0.35 }, at)
          .fromTo(rq("[data-ls='them']"), { autoAlpha: 0, y: 5 }, { autoAlpha: 1, y: 0, duration: 0.35, stagger: 0.09 }, at + 0.1)
          .fromTo(rq("[data-ls='rule']"), { drawSVG: "0% 0%" }, { drawSVG: "0% 100%", duration: 0.3, stagger: 0.09, ease: "power2.out" }, at + 0.2)
          .fromTo(rq("[data-ls='roma']"), { autoAlpha: 0, y: 5 }, { autoAlpha: 1, y: 0, duration: 0.4 }, at + 0.5)
          .fromTo(rq("[data-ls='tick']"), { drawSVG: "0% 0%" }, { drawSVG: "0% 100%", duration: 0.35, ease: "power2.out" }, at + 0.65);
      });
      tl.fromTo(q("[data-ls='foot']"), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5 }, 0.35 + ROWS.length * 0.75);
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={root} className={s.window} aria-hidden="true">
      <div className={s.head}>
        <b className={s.title}>Comparison sheet</b>
        <span className={s.meta}>Same questions · every tool · in their words</span>
      </div>

      <div className={s.grid} style={{ ["--cols" as string]: competitors.length }}>
        <span className={s.corner} />
        <span className={`${s.colHead} ${s.romaHead}`} data-ls="col">
          <Image src="/brand/roma-logo.png" alt="" width={464} height={106} className={s.romaLogo} />
        </span>
        {competitors.map((c, i) => (
          <span key={c.slug} className={`${s.colHead} ${i >= 2 ? s.wide : ""} ${i >= 1 ? s.rest : ""}`} data-ls="col">
            <CompetitorLogo of={c} height={c.logo.size * 0.62} />
          </span>
        ))}

        {ROWS.map((cr) => (
          <div key={cr.id} className={s.row} data-ls="row">
            <span className={s.q} data-ls="q">
              {cr.label}
            </span>
            <span className={`${s.cell} ${s.romaCell}`} data-ls="roma">
              <span className={s.romaValue}>{cr.roma.value}</span>
              <svg className={s.tick} viewBox="0 0 24 20" fill="none">
                <path d="M2.5 11.2c1.6 1.1 3.3 2.9 4.6 5.3C10 9.6 14.6 4.6 21.5 2.2" data-ls="tick" />
              </svg>
            </span>
            {competitors.map((c, i) => {
              const v = matrixCell(c, cr.id).value;
              return (
                <span key={c.slug} className={`${s.cell} ${i >= 2 ? s.wide : ""} ${i >= 1 ? s.rest : ""}`} data-ls="them">
                  <span className={v === NOT_PUBLISHED ? s.np : s.value}>{v}</span>
                  <svg className={s.rule} viewBox="0 0 100 4" preserveAspectRatio="none">
                    <path d="M1 2.4C30 1.4 62 2.9 99 1.8" data-ls="rule" />
                  </svg>
                </span>
              );
            })}
          </div>
        ))}
      </div>

      <p className={s.foot} data-ls="foot">
        <span>+ {CRITERIA.length - ROWS.length} more questions in the matrix below</span>
        <span className={s.more}>{competitors.slice(2).map((c) => c.name).join(" and ")} in the matrix below</span>
        <span className={s.moreXs}>
          {competitors
            .slice(1)
            .map((c) => c.name)
            .join(", ")
            .replace(/, ([^,]*)$/, " and $1")}{" "}
          in the matrix below
        </span>
      </p>
    </div>
  );
}
