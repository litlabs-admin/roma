"use client";

import { gsap, ScrollTrigger } from "@/lib/gsap";
import { FLOW, RAIL_MQ, WIDE_MQ } from "./data";

/**
 * The connector that ties both sections together — port of Fruitful's initFlowLine.
 *
 * Desktop: a dot above the card grid; the line drops, splits along a bar into the two
 * card columns (hidden behind the opaque cards, visible in the gaps), rejoins below the
 * grid and runs down the centre spine through every step circle, fading at its tail.
 * ≤767px: a single straight rail through the step circles.
 * Drawn 1:1 in px (viewBox = wrapper size) and scrubbed with DrawSVG.
 */

type Geo = { cx: number; colX: number; dotY: number; topY: number; botY: number; endY: number; r: number };

/** One half of the split: centre → bar → column → bar → centre → tail. */
function flowBranch({ cx, colX, dotY, topY, botY, endY, r }: Geo) {
  const dir = colX > cx ? 1 : -1;
  return [
    `M${cx} ${dotY}`,
    `V${topY - r}`,
    `Q${cx} ${topY} ${cx + dir * r} ${topY}`,
    `H${colX - dir * r}`,
    `Q${colX} ${topY} ${colX} ${topY + r}`,
    `V${botY - r}`,
    `Q${colX} ${botY} ${colX - dir * r} ${botY}`,
    `H${cx + dir * r}`,
    `Q${cx} ${botY} ${cx} ${botY + r}`,
    `V${endY}`,
  ].join("");
}

const centreIn = (wrap: DOMRect, el: Element) => {
  const b = el.getBoundingClientRect();
  return b.x + b.width / 2 - wrap.x;
};

/**
 * Wires the line. `animate: false` (reduced motion) draws it once, fully, and keeps it
 * in place on resize — no scroll trigger ever hides it. Returns a cleanup.
 */
export function initFlowLine(wrap: HTMLElement, animate: boolean): () => void {
  const host = wrap.querySelector<HTMLElement>("[data-mf-flow]");
  const grid = wrap.querySelector<HTMLElement>("[data-mf-grid]");
  const cols = grid ? grid.querySelectorAll("[data-mf-item]") : [];
  const svg = host?.querySelector("svg");
  const branches = host ? Array.from(host.querySelectorAll<SVGPathElement>('[data-mf="flow-branch"]')) : [];
  const dot = host?.querySelector<SVGCircleElement>('[data-mf="flow-dot"]');
  const fade = host?.querySelector<SVGLinearGradientElement>("linearGradient");
  const steps = wrap.querySelector<HTMLElement>("[data-mf-steps]");
  const circle = wrap.querySelector<HTMLElement>("[data-mf-circle]");
  const tail = wrap.querySelector<HTMLElement>("[data-mf-flow-end]");
  if (!host || !grid || !svg || !dot || !fade || !steps || !circle || cols.length < 2 || branches.length < 2) return () => {};

  const railMode = () => window.matchMedia(RAIL_MQ).matches;
  let tl: gsap.core.Timeline | null = null;
  let lastW = 0;
  let lastH = 0;

  const draw = () => {
    const wb = wrap.getBoundingClientRect();
    const gb = grid.getBoundingClientRect();
    if (!wb.height || !gb.width) return;
    const k = gb.width / FLOW.designGrid;
    const cx = wb.width / 2;
    const gT = gb.y - wb.y;
    const gB = gT + gb.height;
    // Roma: a deliberate tail past the last step (Fruitful falls back to 94% of the wrapper).
    const endY = tail ? tail.getBoundingClientRect().bottom - wb.y + FLOW.tail * k : wb.height * 0.94;

    svg.setAttribute("viewBox", `0 0 ${wb.width} ${wb.height}`);
    fade.setAttribute("y1", String(endY - FLOW.fade * k));
    fade.setAttribute("y2", String(endY));
    dot.setAttribute("r", String(FLOW.dotR * k));
    branches.forEach((p) => p.setAttribute("stroke-width", String(FLOW.stroke * k)));

    if (railMode()) {
      const rx = centreIn(wb, circle);
      const topY = steps.getBoundingClientRect().y - wb.y;
      dot.setAttribute("cx", String(rx));
      dot.setAttribute("cy", String(topY));
      branches[0].setAttribute("d", `M${rx} ${topY}V${endY}`);
      branches[1].removeAttribute("d");
    } else {
      const dotY = gT - FLOW.dotAbove * k;
      dot.setAttribute("cx", String(cx));
      dot.setAttribute("cy", String(dotY));
      const geo = { cx, dotY, topY: gT - FLOW.barAbove * k, botY: gB + FLOW.barBelow * k, endY, r: FLOW.radius * k };
      branches.forEach((p, i) => p.setAttribute("d", flowBranch({ ...geo, colX: centreIn(wb, cols[i]) })));
    }
    lastW = wb.width;
    lastH = wb.height;
    tl?.invalidate(); // DrawSVG caches path length
  };

  draw();

  let mm: gsap.MatchMedia | null = null;
  if (animate) {
    gsap.set(dot, { transformOrigin: "50% 50%" });
    const build = () => {
      const rail = railMode();
      draw();
      const trigger = rail ? steps : wrap;
      // Fruitful ends at `bottom 75%` (rail) / `bottom 65%`; clamped to the max scroll so
      // the line still completes when this block sits at the very end of the page.
      const endAt = rail ? 0.75 : 0.65;
      tl = gsap
        .timeline({
          scrollTrigger: {
            trigger,
            start: rail ? "top 85%" : "top 70%",
            end: () => {
              const bottom = trigger.getBoundingClientRect().bottom + window.scrollY;
              return Math.min(bottom - window.innerHeight * endAt, ScrollTrigger.maxScroll(window));
            },
            scrub: 0.6,
          },
        })
        .fromTo(dot, { scale: 0 }, { scale: 1, duration: 0.03, ease: "none" }, 0)
        .fromTo(rail ? branches[0] : branches, { drawSVG: "0% 0%" }, { drawSVG: "0% 100%", duration: 1, ease: "none" }, 0);
      return () => {
        tl = null;
      };
    };
    mm = gsap.matchMedia();
    mm.add(RAIL_MQ, build).add(WIDE_MQ, build);
    ScrollTrigger.addEventListener("refreshInit", draw);
  }

  // Fonts, images and breakpoints change the wrapper after first paint: redraw, then
  // let ScrollTrigger re-measure once things settle.
  let pending: ReturnType<typeof setTimeout> | undefined;
  const ro = new ResizeObserver(() => {
    const b = wrap.getBoundingClientRect();
    if (Math.abs(b.width - lastW) < 1 && Math.abs(b.height - lastH) < 1) return;
    draw();
    if (!animate) return;
    clearTimeout(pending);
    pending = setTimeout(() => ScrollTrigger.refresh(), 200);
  });
  ro.observe(wrap);

  return () => {
    ro.disconnect();
    clearTimeout(pending);
    if (animate) ScrollTrigger.removeEventListener("refreshInit", draw);
    mm?.revert();
  };
}
