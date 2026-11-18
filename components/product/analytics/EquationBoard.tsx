"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/motion";
import { board } from "@/lib/content/products";
import { Glyph, RomaGlyph, money } from "@/components/platform/mock/kit";
import s from "./board.module.css";

/**
 * /analytics hero art — the original dashboard's best idea, made the headline:
 * Invoiced − Deducted = Paid. Below it, "Where it went" switches between By retailer
 * and By type on its own every few seconds while the hero is on screen (and on click);
 * bars re-grow to the new shape (DESIGN.md §G.11). SSR = By retailer, final values.
 */

const SWITCH_MS = 4200;
const AT = { tiles: 1.0, ops: 1.25, bars: 1.4 };

export default function EquationBoard() {
  const root = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState(0);
  const [auto, setAuto] = useState(true);
  const b = board.breakdown;
  const rows = mode === 0 ? b.byRetailer : b.byType;
  const max = Math.max(...rows.map((r) => r.amount));
  const cols = mode === 0 ? b.columns : b.typeColumns;

  useLayoutEffect(() => {
    const el = root.current;
    if (!el || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(el);
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from(q("[data-eq='tile']"), { autoAlpha: 0, y: 14, duration: 0.6, stagger: 0.12 }, AT.tiles - 0.15)
        .from(q("[data-eq='op']"), { autoAlpha: 0, scale: 0.3, duration: 0.45, stagger: 0.15, ease: "back.out(2.5)" }, AT.ops)
        .from(q("[data-eq='card']"), { autoAlpha: 0, y: 18, duration: 0.6 }, AT.bars - 0.2)
        .from(q("[data-eq='bar']"), { scaleX: 0, duration: 0.9, stagger: 0.07, ease: "power3.out", clearProps: "transform" }, AT.bars);
      q("[data-eq='value']").forEach((node, i) => {
        const v = node as HTMLElement;
        const to = Number(v.dataset.to);
        const n = { v: 0 };
        tl.fromTo(n, { v: 0 }, { v: to, duration: 1.3, ease: "power2.out", onUpdate: () => void (v.textContent = money(n.v, false)) }, AT.tiles + i * 0.12);
      });
    }, el);
    return () => {
      ctx.revert();
      el.querySelectorAll<HTMLElement>("[data-eq='value']").forEach((v) => (v.textContent = money(Number(v.dataset.to), false)));
    };
  }, []);

  // Auto-switch while on screen; a click hands control to the visitor.
  useEffect(() => {
    const el = root.current;
    if (!el || !auto || prefersReducedMotion()) return;
    let visible = false;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting), { threshold: 0.3 });
    io.observe(el);
    const id = window.setInterval(() => {
      if (visible && !document.hidden) setMode((m) => 1 - m);
    }, SWITCH_MS);
    return () => {
      io.disconnect();
      window.clearInterval(id);
    };
  }, [auto]);

  const pick = (i: number) => {
    setAuto(false);
    setMode(i);
  };

  return (
    <div ref={root} className={s.window}>
      <div className={s.head} aria-hidden="true">
        <span className={s.brand}>
          <RomaGlyph className={s.mark} />
        </span>
        <b className={s.title}>{board.title}</b>
        <span className={s.chip}>
          <Glyph k="calendar" />
          {board.range}
        </span>
        <span className={`${s.chip} ${s.chipCh}`}>
          {board.channels}
          <Glyph k="caret" />
        </span>
        <span className={s.segs}>
          {board.segments.map((g, i) => (
            <span key={g} className={i === 0 ? s.segOn : ""}>
              {g}
            </span>
          ))}
        </span>
        <span className={s.sync}>
          <i />
          {board.sync.title} · {board.sync.meta}
        </span>
      </div>

      <div className={s.equation} aria-hidden="true">
        {board.equation.map((t, i) =>
          "op" in t ? (
            <span key={i} className={s.op} data-eq="op">
              {t.op}
            </span>
          ) : (
            <div key={t.label} className={`${s.tile} ${s[`t_${t.tone}`]}`} data-eq="tile">
              <span className={s.tLabel}>{t.label}</span>
              <b className={s.tValue} data-eq="value" data-to={t.value}>
                {money(t.value, false)}
              </b>
              <span className={s.tMeta}>{t.meta}</span>
            </div>
          ),
        )}
      </div>

      <div className={s.card} data-eq="card">
        <div className={s.cardHead}>
          <span className={s.cardTitle} aria-hidden="true">
            <b>{b.title}</b>
            <span>{b.hint}</span>
          </span>
          <span className={s.toggle} role="group" aria-label="Breakdown">
            <span className={s.togglePill} style={{ transform: `translateX(${mode * 100}%)` }} aria-hidden="true" />
            {b.toggle.map((t, i) => (
              <button key={t} type="button" className={`${s.tBtn} ${mode === i ? s.tBtnOn : ""}`} aria-pressed={mode === i} onClick={() => pick(i)}>
                {t}
              </button>
            ))}
          </span>
        </div>
        <div className={s.rows} aria-hidden="true">
          <div className={`${s.row} ${s.rowHead}`}>
            <span>{mode === 0 ? "Retailer" : "Type"}</span>
            <span />
            <span className={s.right}>{cols[0]}</span>
            <span className={`${s.right} ${s.cRate}`}>{cols[1]}</span>
          </div>
          {rows.map((r, i) => (
            <div key={i} className={s.row}>
              <span key={`n${mode}`} className={s.name}>
                {r.name}
              </span>
              <span className={s.track} data-eq="bar">
                <span className={s.bar} style={{ transform: `scaleX(${r.amount / max})`, transitionDelay: `${i * 50}ms` }} />
              </span>
              <span key={`a${mode}`} className={`${s.right} ${s.amt}`}>
                {money(r.amount, false)}
              </span>
              <span key={`r${mode}`} className={`${s.right} ${s.cRate}`}>
                <span className={s.rate}>{r.rate.toFixed(1)}%</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
