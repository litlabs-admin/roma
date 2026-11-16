import { gsap } from "@/lib/gsap";
import { barGeometry, bandGeometry, type Layout, type Scenario } from "./data";
import { formatMoney } from "./AppPanel";

/**
 * The panel's own build — a PAUSED timeline driven by scroll through an eased
 * clock (never scrubbed directly). Port of Fruitful's gfScreenTimeline:
 * same stages, same timings, same labels. DESIGN.md §G.3. The timing is identical for
 * every layout (phone / laptop), so the scroll mapping never depends on the device.
 *
 *   0.00 – 2.50  screen 1 builds (badge pops, routes draw, figures land, split fills)
 *   strip  2.50  screen 1 strips back to bare shapes
 *          2.78  bars grow vertically into band rows   (x, width frozen)
 *   stretch 3.07 bands widen to full width             (y, height frozen)
 *          3.24+ rows assemble inside the bands, one band at a time
 *   settled      screen 2 complete — where a tab click parks the panel
 *   screen3      bands dissolve, recovered markers fly to the chart, card builds
 */
export function buildPanelTimeline(host: HTMLElement, s: Scenario, L: Layout) {
  const q = gsap.utils.selector(host);
  const tl = gsap.timeline({ paused: true, defaults: { ease: "power2.out" } });

  // ── start state (screen 1: pill, stem and bars are the first frame, not a payoff) ──
  gsap.set(q('[data-gf="badge"]'), { opacity: 0, scale: 0, transformOrigin: "50% 50%" });
  gsap.set(q('[data-gf="route"]'), { drawSVG: "0% 0%" });
  gsap.set(q('[data-gf="barText"]'), { opacity: 0 });
  gsap.set(q('[data-gf="split"]'), { opacity: 0 });
  gsap.set(q('[data-gf="fillValid"]'), { scaleX: 0, transformOrigin: "0% 50%" });
  gsap.set(q('[data-gf="fillRec"]'), { scaleX: 0, transformOrigin: "100% 50%" });
  gsap.set(q('[data-gf="knob"]'), { opacity: 0, scale: 0 });

  tl.to(q('[data-gf="badge"]'), { opacity: 1, scale: 1, duration: 0.45, ease: "back.out(2)" }, 0.15)
    // routes draw in category order — each bar's figures land as its route arrives
    .to(q('[data-gf="route"]'), { drawSVG: "0% 100%", duration: 0.7, stagger: 0.18 }, 0.7)
    .to(q('[data-gf="barText"]'), { opacity: 1, duration: 0.3, stagger: 0.09 }, 1.15)
    .to(q('[data-gf="split"]'), { opacity: 1, duration: 0.4 }, 1.85)
    .to(q('[data-gf="fillValid"], [data-gf="fillRec"]'), { scaleX: 1, duration: 0.6 }, 1.95)
    .to(q('[data-gf="knob"]'), { opacity: 1, scale: 1, duration: 0.35, ease: "back.out(2.5)" }, 2.25);

  // ── screen 2 start state ──
  const subs = q('[data-gf="sub"]');
  gsap.set(q('[data-gf="screen2"]'), { opacity: 0 });
  gsap.set(q('[data-gf="rail"], [data-gf="conn"]'), { drawSVG: "0% 0%" });
  gsap.set(q('[data-gf="bandLabel"], [data-gf="tile"]'), { opacity: 0 });
  gsap.set(q('[data-gf="card3"]'), { opacity: 0 });
  gsap.set(q('[data-gf="curve"]'), { drawSVG: "0% 0%" });
  gsap.set(q('[data-gf="area"], [data-gf="axis"], [data-gf="split3"], [data-gf="grid"]'), { opacity: 0 });
  gsap.set(q('[data-gf="row"]'), { opacity: 0 });
  gsap.set(q('[data-gf="marker"]'), { opacity: 0 });

  // Fruitful timings, recorded frame by frame from their prototype.
  const T_STRIP = 2.5;
  const T_VERT = 2.78;
  const T_HORIZ = 3.07;
  const T_FILL = 3.24;

  // ── bars → bands. Percentages resolve against the system box, so this survives
  // any resize with no re-measuring. Nothing scales: each band animates its own box
  // and clips the content inside it, which keeps every number crisp throughout.
  const pw = (n: number) => `${(n / L.panel.w) * 100}%`;
  const ph = (n: number) => `${(n / L.sysH) * 100}%`;
  const bars = barGeometry(L, s);
  const bands = bandGeometry(L);
  bands.forEach((band, i) => {
    const src = bars[i];
    const el = q(`[data-gf="band"][data-band="${band.key}"]`);
    if (!el.length) return;
    gsap.set(el, { left: pw(src.x), width: pw(src.w), top: ph(src.y - L.sysTop), height: ph(src.h) });
    tl.to(el, { top: ph(band.top), height: ph(band.h), duration: 0.29, ease: "power2.inOut" }, T_VERT).to(
      el,
      { left: pw(L.bandX), width: pw(L.bandW), duration: 0.27, ease: "power1.inOut" },
      T_HORIZ,
    );
  });

  // stage 1 — strip screen 1 back to bare shapes before anything moves
  tl.to(q('[data-gf="route"], [data-gf="stem"]'), { opacity: 0, duration: 0.18 }, T_STRIP)
    .to(q('[data-gf="badge"]'), { opacity: 0, scale: 0.4, duration: 0.18 }, T_STRIP)
    .to(q('[data-gf="barText"], [data-gf="pillText"]'), { opacity: 0, duration: 0.18 }, T_STRIP)
    .to(q('[data-gf="split"]'), { opacity: 0, duration: 0.18 }, T_STRIP)
    .to(subs[0], { opacity: 0, duration: 0.18 }, T_STRIP)
    .to(subs[1], { opacity: 1, duration: 0.2 }, T_STRIP + 0.16)
    .to(q('[data-gf="pill"]'), { opacity: 0, scaleY: 0.6, duration: 0.2 }, T_STRIP + 0.05)
    .to(q('[data-gf="screen1"]'), { opacity: 0, duration: 0.12 }, T_VERT - 0.02)
    .to(q('[data-gf="screen2"]'), { opacity: 1, duration: 0.01 }, T_VERT - 0.02);

  tl.addLabel("strip", T_STRIP);
  tl.addLabel("stretch", T_HORIZ);

  // stage 3 — rows assemble inside the bands, top to bottom: label pops, connectors
  // draw out of it, tiles slide in, chips wipe across.
  const ROW_STEP = 0.25;
  tl.to(q('[data-gf="rail"]'), { drawSVG: "0% 100%", duration: 0.85, ease: "none" }, T_FILL);
  let built = T_FILL;
  q('[data-gf="bandLabel"]').forEach((label, k) => {
    const at = T_FILL + k * ROW_STEP;
    const inRow = (sel: string) => q(`${sel}[data-row="${k}"]`);
    const tiles = inRow('[data-gf="tile"]');
    tl.fromTo(label, { opacity: 0, scale: 0.7 }, { opacity: 1, scale: 1, duration: 0.33, ease: "back.out(2)" }, at)
      .to(inRow('[data-gf="conn"]'), { drawSVG: "0% 100%", duration: 0.3, stagger: 0.06 }, at + 0.1)
      .fromTo(tiles, { opacity: 0, xPercent: -6 }, { opacity: 1, xPercent: 0, duration: 0.45, stagger: 0.08, ease: "power3.out" }, at + 0.22)
      .fromTo(
        inRow('[data-gf="chip"]'),
        { clipPath: "inset(0% 100% 0% 0%)" },
        { clipPath: "inset(0% 0% 0% 0%)", duration: 0.36, stagger: 0.08, ease: "power2.inOut" },
        at + 0.38,
      );
    built = Math.max(built, at + 0.38 + 0.36 + 0.08 * Math.max(0, tiles.length - 1));
  });
  tl.addLabel("settled", built);

  // ── screen 2 → 3: a short beat, then the bands dissolve while the recoverable
  // lines detach as markers and fly to the recovery chart. The card arrives as they land.
  const S3 = built + 0.3;
  tl.addLabel("screen3", S3);
  const FLY = S3 + 0.1;
  const LAND = FLY + 0.33;
  const PANEL_AT = LAND;

  tl.to(q('[data-gf="screen2"]'), { opacity: 0, duration: 0.25 }, S3)
    .to(subs[1], { opacity: 0, duration: 0.25 }, S3)
    .to(subs[2], { opacity: 1, duration: 0.25 }, S3 + 0.16);

  const screenEl = host.querySelector<HTMLElement>("[data-panel-screen]");
  const uPx = () => (screenEl ? screenEl.offsetWidth / L.panel.w : 1);
  const markers = q('[data-gf="marker"]');
  tl.set(markers, { opacity: 1 }, FLY);
  markers.forEach((m) => {
    const dx = Number(m.getAttribute("data-dx"));
    const dy = Number(m.getAttribute("data-dy"));
    tl.fromTo(m, { x: () => dx * uPx(), y: () => dy * uPx(), scale: 0.8 }, { x: 0, y: 0, scale: 1, duration: 0.33, ease: "power2.out" }, FLY);
  });

  const figure = q('[data-gf="figure"]')[0];
  const target = s.recovered;
  const counter = { v: 0 };
  tl.to(q('[data-gf="card3"]'), { opacity: 1, duration: 0.16 }, PANEL_AT)
    .to(q('[data-gf="grid"]'), { opacity: 1, duration: 0.2 }, PANEL_AT + 0.1)
    .to(q('[data-gf="curve"]'), { drawSVG: "0% 100%", duration: 0.32, ease: "power1.in" }, PANEL_AT + 0.2)
    .to(q('[data-gf="area"]'), { opacity: 1, duration: 0.27 }, PANEL_AT + 0.3)
    .fromTo(
      counter,
      { v: 0 },
      {
        v: target,
        duration: 0.55,
        ease: "power2.out",
        onUpdate: () => {
          if (figure) figure.textContent = formatMoney(counter.v);
        },
      },
      PANEL_AT + 0.15,
    )
    .to(q('[data-gf="axis"]'), { opacity: 1, duration: 0.1 }, PANEL_AT + 0.61)
    .to(q('[data-gf="split3"]'), { opacity: 1, duration: 0.14 }, PANEL_AT + 0.75)
    .fromTo(q('[data-gf="row"]'), { x: -14 }, { opacity: 1, x: 0, duration: 0.14, stagger: 0.082 }, PANEL_AT + 0.9);

  return tl;
}
