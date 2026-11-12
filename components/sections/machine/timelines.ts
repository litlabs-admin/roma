"use client";

import { gsap, ScrollTrigger } from "@/lib/gsap";
import { CARD_START, CARD_TIMESCALE, SCENE_TIMESCALE, STEP_START, STREAM } from "./data";
import { formatCount, formatUsd } from "./steps/kit";

/**
 * Timelines for the recovery-machine cards and the step icons.
 * Positions, durations and eases are Fruitful's (dreamMachine.js / stepIcons.js),
 * unchanged — only the targets are Roma's. All tweens use `data-mf` / `data-si` hooks.
 *
 * Call inside a gsap.context so ctx.revert() cleans up every set/tween/trigger.
 */

type Q = (sel: string) => Element[];

/** Plays a one-shot entrance the first time `trigger` reaches `start`. */
function playOnce(trigger: Element, tl: gsap.core.Timeline, start: string, timeScale = 1) {
  tl.pause().timeScale(timeScale);
  ScrollTrigger.create({ trigger, start, once: true, onEnter: () => void tl.play() });
}

/* ── Card 1 · connect (Fruitful buildComposer) ───────────────────────────── */
function buildConnect(q: Q) {
  const tl = gsap.timeline({ defaults: { ease: "power2.out" } });
  gsap.set(q('[data-mf="card"]'), { rotation: -9.68 });
  gsap.set(q('[data-mf="doc"]'), { rotation: 7.8 });
  gsap.set(q('[data-mf="opt"]'), { opacity: 0, x: -8 });
  gsap.set(q('[data-mf="send"]'), { scale: 0.6, opacity: 0, transformOrigin: "50% 50%" });

  tl.from(q('[data-mf="card"]'), { y: 26, rotation: -2, scale: 0.96, opacity: 0, duration: 0.8 }, 0)
    .to(q('[data-mf="opt"]'), { opacity: 1, x: 0, duration: 0.4, stagger: 0.09 }, 0.35)
    // −437.5% of the dot's own 8.8-unit height is exactly one 38.5-unit row
    .fromTo(q('[data-mf="dot"]'), { yPercent: -437.5, scale: 0, transformOrigin: "50% 50%" }, { scale: 1, duration: 0.3, ease: "back.out(3)" }, 0.62)
    .to(q('[data-mf="dot"]'), { yPercent: 0, duration: 0.45, ease: "power2.inOut" }, 0.92)
    .to(q('[data-mf="send"]'), { scale: 1, opacity: 1, duration: 0.4, ease: "back.out(2.5)" }, 1.15)
    .from(q('[data-mf="doc"]'), { x: 46, rotation: 17, opacity: 0, duration: 0.75 }, 1.2);
  return tl;
}

/* ── Card 2 · routing (Fruitful buildRouting) ────────────────────────────── */
function buildRouting(q: Q) {
  const tl = gsap.timeline({ defaults: { ease: "power2.out" } });
  gsap.set(q('[data-mf="blob"]'), { opacity: 0 });
  gsap.set(q('[data-mf="badge"]'), { transformOrigin: "50% 50%", scale: 0.4, opacity: 0 });
  gsap.set(q('[data-mf="ring"]'), { transformOrigin: "50% 50%", scale: 0.55, opacity: 0 });
  // '0% 0%' collapses to the path START (a bare 0 would collapse to the midpoint)
  gsap.set(q('[data-mf="shaft"]'), { drawSVG: "0% 0%" });
  gsap.set(q('[data-mf="head"]'), { opacity: 0, y: -5 });
  gsap.set(q('[data-mf="cat"]'), { transformOrigin: "50% 100%", y: 20, opacity: 0 });
  gsap.set(q('[data-mf="tick"]'), { drawSVG: "0% 0%" });
  gsap.set(q('[data-mf="star"]'), { transformOrigin: "50% 50%", scale: 0, opacity: 0 });

  tl.to(q('[data-mf="blob"]'), { opacity: 1, duration: 1.2 }, 0)
    .to(q('[data-mf="badge"]'), { scale: 1, opacity: 1, duration: 0.6, ease: "back.out(2)" }, 0.05)
    .to(q('[data-mf="ring"]'), { scale: 1, opacity: 1, duration: 0.9, stagger: 0.12 }, 0.15)
    .to(q('[data-mf="shaft"]'), { drawSVG: "0% 100%", duration: 0.75, stagger: 0.08 }, 0.5)
    .to(q('[data-mf="star"]'), { scale: 1, opacity: 1, duration: 0.5, stagger: 0.07, ease: "back.out(3)" }, 0.8)
    .to(q('[data-mf="head"]'), { opacity: 1, y: 0, duration: 0.3, stagger: 0.08 }, 1.1)
    .to(q('[data-mf="cat"]'), { y: 0, opacity: 1, duration: 0.55, stagger: 0.08, ease: "back.out(1.6)" }, 1.15)
    .to(q('[data-mf="tick"]'), { drawSVG: "0% 100%", duration: 0.35, stagger: 0.08 }, 1.5);
  return tl;
}

/* ── Card 4 · recovery (Fruitful buildGoals) ─────────────────────────────── */
function buildRecovery(q: Q) {
  const tl = gsap.timeline({ defaults: { ease: "power2.out" } });
  const areas = q('[data-mf="area"]');
  const areaOpacity = areas.map((a) => Number(a.getAttribute("opacity") ?? 1));
  gsap.set(q('[data-mf="curve"]'), { drawSVG: "0% 0%" });
  gsap.set(areas, { opacity: 0 });
  gsap.set(q('[data-mf="legend"], [data-mf="axis"]'), { opacity: 0 });
  gsap.set(q('[data-mf="chip"]'), { transformOrigin: "50% 50%", scale: 0, opacity: 0 });
  gsap.set(q('[data-mf="tline"]'), { drawSVG: "0% 0%" });
  gsap.set(q('[data-mf="row"]'), { x: -14, opacity: 0 });

  tl.to(q('[data-mf="axis"]'), { opacity: 1, duration: 0.5 }, 0)
    .to(q('[data-mf="legend"]'), { opacity: 1, duration: 0.5 }, 0.1)
    .to(q('[data-mf="curve"]'), { drawSVG: "0% 100%", duration: 1.3, ease: "power1.inOut" }, 0.15)
    .to(areas, { opacity: (i: number) => areaOpacity[i], duration: 0.9 }, 0.5)
    .to(q('[data-mf="chip"]'), { scale: 1, opacity: 1, duration: 0.45, stagger: 0.11, ease: "back.out(2.2)" }, 0.75)
    .to(q('[data-mf="tline"]'), { drawSVG: "0% 100%", duration: 0.7 }, 1.15)
    .to(q('[data-mf="row"]'), { x: 0, opacity: 1, duration: 0.5, stagger: 0.11 }, 1.3);
  return tl;
}

const CARD_BUILDERS: Record<string, (q: Q) => gsap.core.Timeline> = {
  connect: buildConnect,
  routing: buildRouting,
  recovery: buildRecovery,
};

/**
 * Card 3 · stream (Fruitful buildMap): a linear marquee of three screens, played only
 * while the card is on screen. Returns nothing to clean — the context reverts it.
 */
function buildStream(visual: Element, card: Element) {
  const drift = visual.querySelector('[data-mf="drift"]');
  if (!drift) return;
  gsap.set(drift, { willChange: "transform" });
  const loop = gsap.to(drift, {
    xPercent: (-STREAM.gap * STREAM.travel * 100) / STREAM.vbW, // −203.925%
    duration: STREAM.secondsPerScreen * STREAM.travel, // 78s
    ease: "none",
    repeat: -1,
    paused: true,
  });
  ScrollTrigger.create({
    trigger: card,
    start: "top bottom",
    end: "bottom top",
    onToggle: (self) => void (self.isActive ? loop.play() : loop.pause()),
  });
}

/** Wires every `[data-mf-visual]` card under `root`. */
export function initCards(root: HTMLElement) {
  root.querySelectorAll<HTMLElement>("[data-mf-visual]").forEach((visual) => {
    const kind = visual.dataset.mfVisual!;
    const card = visual.closest("[data-mf-item]") ?? visual;
    if (kind === "stream") return buildStream(visual, card);
    const build = CARD_BUILDERS[kind];
    if (!build) return;
    playOnce(card, build(gsap.utils.selector(visual)), CARD_START, CARD_TIMESCALE);
  });
}

/* ── Step scenes (replaces Fruitful's step icons; same once-at-85% trigger) ── */

/** Counts `el` up from 0 to `data-to`, writing formatted text (tabular numerals). */
function countUp(el: Element | undefined, format: (n: number) => string, duration: number) {
  if (!el) return gsap.timeline();
  const to = Number((el as HTMLElement).dataset.to);
  const proxy = { v: 0 };
  el.textContent = format(0);
  return gsap.to(proxy, { v: to, duration, ease: "power2.out", onUpdate: () => void (el.textContent = format(proxy.v)) });
}

const SCENE_BUILDERS: ((q: Q) => gsap.core.Timeline)[] = [
  // 01 · Connect — portals slide in, wires draw into the hub, hub pops and pulses,
  // the feed draws out, the count ticks up, every portal goes live.
  (q) => {
    const tl = gsap.timeline({ defaults: { ease: "power2.out" } });
    gsap.set(q('[data-ss="portal"]'), { x: -24, opacity: 0 });
    gsap.set(q('[data-ss="in"], [data-ss="out"]'), { drawSVG: "0% 0%" });
    gsap.set(q('[data-ss="hub"]'), { transformOrigin: "50% 50%", scale: 0.5, opacity: 0 });
    gsap.set(q('[data-ss="ring"]'), { transformOrigin: "50% 50%", opacity: 0 });
    gsap.set(q('[data-ss="pulled"]'), { y: 14, opacity: 0 });
    gsap.set(q('[data-ss="live"]'), { transformOrigin: "50% 50%", scale: 0 });
    return tl
      .to(q('[data-ss="portal"]'), { x: 0, opacity: 1, duration: 0.5, stagger: 0.1 }, 0)
      .to(q('[data-ss="in"]'), { drawSVG: "0% 100%", duration: 0.55, stagger: 0.08, ease: "power1.inOut" }, 0.35)
      .to(q('[data-ss="hub"]'), { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(2)" }, 0.75)
      .fromTo(q('[data-ss="ring"]'), { scale: 1, opacity: 0.9 }, { scale: 1.8, opacity: 0, duration: 0.9 }, 0.95)
      .to(q('[data-ss="ring"]'), { scale: 1.22, opacity: 1, duration: 0.45 }, 1.85)
      .to(q('[data-ss="out"]'), { drawSVG: "0% 100%", duration: 0.4 }, 1.05)
      .to(q('[data-ss="pulled"]'), { y: 0, opacity: 1, duration: 0.5 }, 1.2)
      .add(countUp(q('[data-ss="count"]')[0], formatCount, 1), 1.3)
      .to(q('[data-ss="live"]'), { scale: 1, duration: 0.3, stagger: 0.08, ease: "back.out(3)" }, 1.4);
  },
  // 02 · Match — cards slide together, rows light up left then right, links draw,
  // the seal stamps, and the deduction flips Unmatched → Matched.
  (q) => {
    const tl = gsap.timeline({ defaults: { ease: "power2.out" } });
    gsap.set(q('[data-ss="docL"]'), { x: -30, opacity: 0 });
    gsap.set(q('[data-ss="docR"]'), { x: 30, opacity: 0 });
    gsap.set(q('[data-ss="hlL"], [data-ss="hlR"]'), { scaleX: 0 });
    gsap.set(q('[data-ss="link"]'), { drawSVG: "0% 0%" });
    gsap.set(q('[data-ss="seal"]'), { transformOrigin: "50% 50%", scale: 0, opacity: 0 });
    gsap.set(q('[data-ss="before"]'), { opacity: 1 });
    gsap.set(q('[data-ss="after"]'), { opacity: 0 });
    return tl
      .to(q('[data-ss="docL"]'), { x: 0, opacity: 1, duration: 0.6 }, 0)
      .to(q('[data-ss="docR"]'), { x: 0, opacity: 1, duration: 0.6 }, 0.1)
      .to(q('[data-ss="hlL"]'), { scaleX: 1, duration: 0.4, stagger: 0.12, ease: "power2.inOut" }, 0.6)
      .to(q('[data-ss="hlR"]'), { scaleX: 1, duration: 0.4, stagger: 0.12, ease: "power2.inOut" }, 0.8)
      .to(q('[data-ss="link"]'), { drawSVG: "0% 100%", duration: 0.4, stagger: 0.1 }, 1.0)
      .to(q('[data-ss="seal"]'), { scale: 1, opacity: 1, duration: 0.45, ease: "back.out(2.5)" }, 1.3)
      .to(q('[data-ss="before"]'), { opacity: 0, y: -6, duration: 0.25 }, 1.5)
      .fromTo(q('[data-ss="after"]'), { opacity: 0, y: 6 }, { opacity: 1, y: 0, duration: 0.3 }, 1.55);
  },
  // 03 · Dispute — invalid deduction arrives, backup drops into the slot, the cursor
  // presses Confirm, the button turns to Disputed and the filing note appears.
  (q) => {
    const tl = gsap.timeline({ defaults: { ease: "power2.out" } });
    gsap.set(q('[data-ss="queue"]'), { y: 16, opacity: 0 });
    gsap.set(q('[data-ss="tag"]'), { transformOrigin: "0% 50%", scale: 0 });
    gsap.set(q('[data-ss="file"]'), { y: -18, opacity: 0 });
    gsap.set(q('[data-ss="clip"]'), { drawSVG: "0% 0%" });
    gsap.set(q('[data-ss="cursor"]'), { xPercent: 300, yPercent: 220, opacity: 0 });
    gsap.set(q('[data-ss="face"], [data-ss="confirm"]'), { opacity: 1 });
    gsap.set(q('[data-ss="done"], [data-ss="filed"]'), { opacity: 0 });
    gsap.set(q('[data-ss="btn"]'), { transformOrigin: "50% 50%" });
    return tl
      .to(q('[data-ss="queue"]'), { y: 0, opacity: 1, duration: 0.55 }, 0)
      .to(q('[data-ss="tag"]'), { scale: 1, duration: 0.35, ease: "back.out(3)" }, 0.35)
      .to(q('[data-ss="file"]'), { y: 0, opacity: 1, duration: 0.45, ease: "back.out(1.6)" }, 0.6)
      .to(q('[data-ss="clip"]'), { drawSVG: "0% 100%", duration: 0.5 }, 0.75)
      .to(q('[data-ss="cursor"]'), { opacity: 1, duration: 0.2 }, 0.9)
      .to(q('[data-ss="cursor"]'), { xPercent: 0, yPercent: 0, duration: 0.7, ease: "power2.inOut" }, 0.9)
      .to(q('[data-ss="btn"]'), { scale: 0.94, duration: 0.12, ease: "power1.in" }, 1.6)
      .to(q('[data-ss="btn"]'), { scale: 1, duration: 0.35, ease: "back.out(3)" }, 1.72)
      .to(q('[data-ss="face"]'), { opacity: 0, duration: 0.3 }, 1.7)
      .to(q('[data-ss="confirm"]'), { opacity: 0, duration: 0.15 }, 1.7)
      .fromTo(q('[data-ss="done"]'), { opacity: 0, y: 4 }, { opacity: 1, y: 0, duration: 0.3 }, 1.8)
      .to(q('[data-ss="filed"]'), { opacity: 1, duration: 0.4 }, 1.95);
  },
  // 04 · Recover — tracker arrives, the pipeline fills node by node while the amount
  // counts up and its sparkline draws; "Cash in bank" pops as Paid lands.
  (q) => {
    const tl = gsap.timeline({ defaults: { ease: "power2.out" } });
    const nodes = q('[data-ss="node"]');
    gsap.set(q('[data-ss="tracker"]'), { y: 16, opacity: 0 });
    gsap.set(q('[data-ss="fill"]'), { scaleX: 0 });
    gsap.set(nodes, { transformOrigin: "50% 50%", scale: 0 });
    gsap.set(q('[data-ss="cash"]'), { transformOrigin: "100% 50%", scale: 0, opacity: 0 });
    gsap.set(q('[data-ss="spark"]'), { drawSVG: "0% 0%" });
    const pop = { scale: 1, duration: 0.3, ease: "back.out(3)" };
    return tl
      .to(q('[data-ss="tracker"]'), { y: 0, opacity: 1, duration: 0.55 }, 0)
      .add(countUp(q('[data-ss="amount"]')[0], formatUsd, 1.3), 0.45)
      .to(q('[data-ss="spark"]'), { drawSVG: "0% 100%", duration: 1.3, ease: "power1.inOut" }, 0.45)
      .to(nodes[0], pop, 0.4)
      .to(q('[data-ss="fill"]'), { scaleX: 0.5, duration: 0.5, ease: "power2.inOut" }, 0.55)
      .to(nodes[1], pop, 1.0)
      .to(q('[data-ss="fill"]'), { scaleX: 1, duration: 0.5, ease: "power2.inOut" }, 1.1)
      .to(nodes[2], pop, 1.55)
      .to(q('[data-ss="cash"]'), { scale: 1, opacity: 1, duration: 0.4, ease: "back.out(2.5)" }, 1.65);
  },
];

/** Wires every step scene under `root`; each plays once when its row arrives. */
export function initStepScenes(root: HTMLElement) {
  root.querySelectorAll<HTMLElement>("[data-mf-step-scene]").forEach((scene) => {
    const build = SCENE_BUILDERS[Number(scene.dataset.mfStepScene)];
    const row = scene.closest("[data-mf-step]") ?? scene;
    if (build) playOnce(row, build(gsap.utils.selector(scene)), STEP_START, SCENE_TIMESCALE);
  });
}
