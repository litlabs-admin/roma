"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/motion";
import { ILLUSTRATIVE, drill, drillCopy } from "@/lib/content/products";
import { Glyph, money } from "@/components/platform/mock/kit";
import { refreshWhenReady, rise, token } from "@/components/platform/motion";
import s from "./drill.module.css";

/**
 * "From a quarter's total to a single line." — the /analytics signature section
 * (DESIGN.md §G.11), from runroma.com's "drill from a $400K month down to a single $34.20
 * line". A pinned stage walks five levels: quarter → UNFI → MCB → one store → one line.
 *
 * Each step is a state change you can follow: the chosen part lights up, the rest
 * steps back, then a red block grows from that part to fill the chart (the zoom),
 * and the next level's chart appears inside it. Totals reconcile at every level.
 * CSS-sticky pin at every width; scroll picks the level and each step plays on its own
 * clock (tweenTo), so the motion never jitters with the scroll. The zoom is a clip-path
 * reveal measured from the DOM. Reduced motion: all five levels, stacked.
 */

type Level = (typeof drill.levels)[number];

function Header({ eyebrow, total, caption }: { eyebrow: string; total: number; caption: string }) {
  return (
    <div className={s.lhead}>
      <span className={s.eyebrow}>{eyebrow}</span>
      <b className={s.total}>{money(total, total < 100)}</b>
      <span className={s.caption}>{caption}</span>
    </div>
  );
}

function Quarter({ lv }: { lv: Level }) {
  return (
    <div className={`${s.area} ${s.quarterArea}`} data-dd="area">
      <div className={s.stack}>
        {lv.parts.map((p, i) => (
          <span key={p.name} className={`${s.seg} ${i === 0 ? s.segSel : ""}`} style={{ flexGrow: p.amount }} data-dd={i === 0 ? "sel" : "rest"}>
            <span className={s.segLabel}>{p.name}</span>
          </span>
        ))}
      </div>
      <div className={s.legend}>
        {lv.parts.map((p, i) => (
          <span key={p.name} className={s.legendItem} data-dd={i === 0 ? "selText" : "rest"}>
            <i className={`${s.sw} ${i === 0 ? s.swSel : ""}`} style={{ opacity: i === 0 ? 1 : 0.85 - i * 0.14 }} />
            <span>{p.name}</span>
            <b>{money(p.amount, false)}</b>
            <span className={s.pct}>{Math.round((p.amount / lv.total) * 100)}%</span>
          </span>
        ))}
      </div>
    </div>
  );
}

function Bars({ lv }: { lv: Level }) {
  const max = Math.max(...lv.parts.map((p) => p.amount));
  return (
    <div className={`${s.area} ${s.barsArea}`} data-dd="area">
      {lv.parts.map((p, i) => (
        <div key={p.name} className={s.barRow} data-dd={i === 0 ? "selRow" : "rest"}>
          <span className={s.barName}>{p.name}</span>
          <span className={s.barTrack}>
            <span className={`${s.bar} ${i === 0 ? s.barSel : ""}`} style={{ width: `${(p.amount / max) * 100}%` }} data-dd={i === 0 ? "sel" : "bar"} />
          </span>
          <span className={s.barAmt}>{money(p.amount, false)}</span>
        </div>
      ))}
    </div>
  );
}

function Lines({ lv }: { lv: Level }) {
  const last = lv.parts.length - 1;
  return (
    <div className={`${s.area} ${s.linesArea}`} data-dd="area">
      {lv.parts.map((p, i) => (
        <div key={p.name} className={`${s.line} ${i === last ? s.lineSel : ""}`} data-dd={i === last ? "sel" : "rest"}>
          <span className={s.lineNo}>{String(414 + i).padStart(4, "0")}</span>
          <span className={s.lineItem}>
            <b>{p.name}</b>
            <span>{"meta" in p ? p.meta : ""}</span>
          </span>
          <span className={s.lineAmt}>{money(p.amount)}</span>
        </div>
      ))}
    </div>
  );
}

function LineDetail() {
  const l = drill.line;
  return (
    <div className={`${s.area} ${s.detailArea}`} data-dd="area">
      <div className={s.detail}>
        <div className={s.detailTop}>
          <span className={s.eyebrow}>{l.item}</span>
          <b className={s.detailTotal}>{money(l.total)}</b>
        </div>
        <dl className={s.fields}>
          {l.fields.map(([k, v]) => (
            <div key={k}>
              <dt>{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>
        <span className={s.backup}>
          <span className={s.page}>
            <i />
            <i />
            <i className={s.pageHl} />
            <i />
          </span>
          <span className={s.backupText}>
            <b>{l.backup}</b>
            <span>Highlighted on the page it came from</span>
          </span>
          <Glyph k="eye" />
        </span>
      </div>
    </div>
  );
}

const LEVELS = [
  { lv: drill.levels[0], Body: Quarter },
  { lv: drill.levels[1], Body: Bars },
  { lv: drill.levels[2], Body: Bars },
  { lv: drill.levels[3], Body: Lines },
] as const;

export default function DrillDown() {
  const root = useRef<HTMLElement>(null);
  const [level, setLevel] = useState(drill.crumbs.length - 1);
  const { before, accent, after } = drillCopy.heading;

  useLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
    if (prefersReducedMotion()) {
      el.setAttribute("data-static", "");
      return () => el.removeAttribute("data-static");
    }
    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(el);
      rise(q("[data-dd-head]"), q("[data-dd-head]")[0]);

      const stage = q("[data-dd-stage]")[0] as HTMLElement;
      const layers = q("[data-dd-layer]") as HTMLElement[];
      const zoom = q("[data-dd-zoom]")[0] as HTMLElement;

      // Box of an element in stage coordinates (layout offsets, transform-free).
      const box = (node: Element | null) => {
        let x = 0;
        let y = 0;
        let n = node as HTMLElement | null;
        while (n && n !== stage) {
          x += n.offsetLeft;
          y += n.offsetTop;
          n = n.offsetParent as HTMLElement | null;
        }
        const t = node as HTMLElement;
        return { x, y, width: t?.offsetWidth ?? 0, height: t?.offsetHeight ?? 0 };
      };

      setLevel(0);
      layers.forEach((l, i) => gsap.set(l, { autoAlpha: i === 0 ? 1 : 0 }));
      gsap.set(zoom, { autoAlpha: 0 });

      // The zoom block sits on the next chart's frame and is revealed by clip-path from
      // the chosen part's box: only clip-path, colour and opacity animate (no layout).
      // Its colour runs red → the area's own background, so when the next chart lands
      // on top the block is already invisible: no red fade-out.
      const AREA_BG = token("--ui-well") || "#fbf9f5";
      const RED = token("--color-red-600") || "#b21515";
      const inset = (sel: Element, area: Element, r: number) => {
        const s0 = box(sel);
        const a0 = box(area);
        const t0 = Math.max(0, s0.y - a0.y);
        const l0 = Math.max(0, s0.x - a0.x);
        const r0 = Math.max(0, a0.x + a0.width - (s0.x + s0.width));
        const b0 = Math.max(0, a0.y + a0.height - (s0.y + s0.height));
        return `inset(${t0}px ${r0}px ${b0}px ${l0}px round ${r}px)`;
      };

      const tl = gsap.timeline({ paused: true });
      tl.addLabel("L0");
      for (let i = 0; i < layers.length - 1; i++) {
        const cur = gsap.utils.selector(layers[i]);
        const next = layers[i + 1];
        const sel = cur("[data-dd='sel']")[0];
        const nextArea = next.querySelector("[data-dd='area']")!;
        // 1 · pick: the rest steps back, the chosen part lifts
        tl.to(cur("[data-dd='rest']"), { opacity: 0.22, duration: 0.3, ease: "power1.out" });
        tl.to(sel, { scale: 1.02, duration: 0.25, ease: "power2.out" }, "<");
        // 2 · zoom: the block opens from the part to the next chart's frame
        tl.set(zoom, {
          autoAlpha: 1,
          left: () => box(nextArea).x,
          top: () => box(nextArea).y,
          width: () => box(nextArea).width,
          height: () => box(nextArea).height,
          backgroundColor: RED,
          clipPath: () => inset(sel, nextArea, 8),
        });
        tl.to(layers[i], { autoAlpha: 0, duration: 0.25, ease: "power1.in" }, "<0.05");
        tl.to(zoom, { clipPath: "inset(0px 0px 0px 0px round 14px)", duration: 0.7, ease: "power3.inOut" }, "<");
        tl.to(zoom, { backgroundColor: AREA_BG, duration: 0.4, ease: "power1.inOut" }, "<0.3");
        // 3 · hand-over: the next level lands on a block that now matches its frame
        tl.fromTo(next, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.25, ease: "power1.out" }, ">-0.1");
        const parts = gsap.utils.selector(next)("[data-dd='bar'], [data-dd='sel'], [data-dd='rest'], [data-dd='selRow']");
        if (parts.length) tl.fromTo(parts, { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.35, stagger: 0.04, ease: "power2.out" }, "<");
        tl.set(zoom, { autoAlpha: 0 }, ">");
        tl.addLabel(`L${i + 1}`);
      }

      // Scroll picks the level; the step plays on its own clock (no scrub jitter) and
      // reverses when scrolling back.
      const count = layers.length;
      let current = 0;
      let tween: gsap.core.Tween | null = null;
      const go = (idx: number) => {
        if (idx === current) return;
        current = idx;
        setLevel(idx);
        tween?.kill();
        const target = tl.labels[`L${idx}`];
        const dist = Math.abs(target - tl.time());
        tween = tl.tweenTo(target, { duration: Math.min(dist, 1.4), ease: dist > 1.6 ? "power2.inOut" : "none" });
      };
      ScrollTrigger.create({
        trigger: q("[data-dd-pin]")[0],
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => {
          go(Math.min(count - 1, Math.floor(self.progress * count * 0.999 + 0.0001)));
          gsap.set(q("[data-dd-fill]"), { scaleX: self.progress });
        },
        onRefresh: () => {
          // re-measure the zoom geometry for the new layout
          const at = tl.time();
          tl.invalidate();
          tl.time(at);
        },
      });
    }, el);
    const stop = refreshWhenReady();
    return () => {
      stop();
      ctx.revert();
      setLevel(drill.crumbs.length - 1);
    };
  }, []);

  return (
    <section ref={root} className={s.section} aria-labelledby="drill-heading">
      <div className={s.head}>
        <div className={s.headLeft}>
          <p className={`${s.label} type-label`} data-dd-head>
            {drillCopy.label}
          </p>
          <h2 id="drill-heading" className={`${s.heading} type-h2`} data-dd-head>
            {before}
            <span className="accent">{accent}</span>
            {after}
          </h2>
        </div>
        <p className={`${s.lead} type-lead`} data-dd-head>
          {drillCopy.lead}
        </p>
      </div>

      <div className={s.pin} data-dd-pin>
        <div className={s.sticky}>
          <div className={s.frame}>
            <nav className={s.crumbs} aria-hidden="true">
              {drill.crumbs.map((c, i) => (
                <span key={c} className={`${s.crumb} ${i <= level ? s.crumbOn : ""} ${i === level ? s.crumbNow : ""}`}>
                  {i > 0 && <span className={s.chev}>›</span>}
                  {c}
                </span>
              ))}
            </nav>

            <div className={s.stage} data-dd-stage aria-hidden="true">
              {LEVELS.map(({ lv, Body }) => (
                <div key={lv.key} className={s.layer} data-dd-layer>
                  <Header eyebrow={lv.eyebrow} total={lv.total} caption={lv.caption} />
                  <Body lv={lv} />
                </div>
              ))}
              <div className={`${s.layer} ${s.layerLast}`} data-dd-layer>
                <Header eyebrow={drill.line.eyebrow} total={drill.line.total} caption="1 line · 2 cases" />
                <LineDetail />
              </div>
              <span className={s.zoom} data-dd-zoom />
            </div>

            <div className={s.foot}>
              <span className={s.progress} aria-hidden="true">
                <span className={s.progressFill} data-dd-fill />
              </span>
              <span className={s.hint}>
                {drillCopy.hint}
                <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
                  <path d="M8 3v10M4 9l4 4 4-4" />
                </svg>
              </span>
              <span className={s.note}>{ILLUSTRATIVE}</span>
            </div>
          </div>
          <p className="sr-only">{drill.summary}</p>
        </div>
      </div>
    </section>
  );
}
