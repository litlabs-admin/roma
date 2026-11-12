import { STEP_SCENES } from "../data";
import { at, formatCount, SCENE_VB } from "./kit";
import s from "./scenes.module.css";

/**
 * 01 Connect — portals plug into Roma. Chips slide in, their wires draw into the
 * hub, the hub pops with one ring pulse, the feed draws out to the counter card,
 * the count ticks up and every portal's status turns green.
 */

const CHIP = { x: 40, w: 150, h: 44, ys: [58, 118, 178] };
const HUB = { cx: 280, cy: 140, size: 72 };
const OUT = { x: 372, y: 92, w: 150, h: 96 };

const chipMid = (i: number) => CHIP.ys[i] + CHIP.h / 2;
const hubL = HUB.cx - HUB.size / 2;
const hubR = HUB.cx + HUB.size / 2;
const IN_D = CHIP.ys.map((_, i) => `M${CHIP.x + CHIP.w} ${chipMid(i)}C${(CHIP.x + CHIP.w + hubL) / 2} ${chipMid(i)} ${(CHIP.x + CHIP.w + hubL) / 2} ${HUB.cy} ${hubL} ${HUB.cy}`);
const OUT_D = `M${hubR} ${HUB.cy}H${OUT.x}`;

export default function ConnectScene() {
  const { portals, label, count, sub } = STEP_SCENES.connect;
  return (
    <>
      <svg className={s.wires} viewBox={SCENE_VB} fill="none">
        <g stroke="#D6CFC0" strokeWidth="1.5" strokeLinecap="round">
          {IN_D.map((d) => (
            <path key={d} data-ss="in" d={d} />
          ))}
          <path data-ss="out" d={OUT_D} />
        </g>
      </svg>

      {portals.map((p, i) => (
        <div key={p.name} className={`${s.card} ${s.portal}`} style={at(CHIP.x, CHIP.ys[i], CHIP.w, CHIP.h)} data-ss="portal">
          <span className={s.badge}>{p.initial}</span>
          <span className={s.name}>{p.name}</span>
          <span className={s.status}>
            <i data-ss="live" />
          </span>
        </div>
      ))}

      <div className={`${s.abs} ${s.ring}`} style={at(hubL, HUB.cy - HUB.size / 2, HUB.size, HUB.size)} data-ss="ring" />
      <div className={`${s.card} ${s.hub}`} style={at(hubL, HUB.cy - HUB.size / 2, HUB.size, HUB.size)} data-ss="hub">
        {/* eslint-disable-next-line @next/next/no-img-element -- decorative 44px mark inside an aria-hidden scene */}
        <img src="/brand/roma-mark.png" alt="" />
      </div>

      <div className={`${s.card} ${s.pulled}`} style={at(OUT.x, OUT.y, OUT.w, OUT.h)} data-ss="pulled">
        <span className={s.label}>{label}</span>
        <span className={`${s.num} ${s.pulledNum}`} data-ss="count" data-to={count}>
          {formatCount(count)}
        </span>
        <span className={s.sub}>{sub}</span>
      </div>
    </>
  );
}
