import { ROUTES } from "../data";
import v from "../visuals.module.css";

/**
 * Card 2 — "The full picture". Port of Fruitful's routing card: a frosted panel, a
 * soft blob, the brand badge with ripple rings, three routes that draw then land
 * their chevrons, and three destination tiles whose ticks draw last.
 * Drawn in the same 407 × 294 panel space; every shape here is Roma's own.
 */

const VB = { w: 407.073, h: 294.381 };
const HUB = { x: 203.5, y: 47 };
const TILE = { y: 159.84, w: 123.81, h: 125.34, r: 12.65 };
const TILE_X = [10.35, 142.21, 274.07];
const tileCx = (i: number) => TILE_X[i] + TILE.w / 2;
const ARRIVE_Y = 153;

// Routes leave the badge together and fan out to the tile centres.
const ROUTE_D = [
  `M${HUB.x} 82V${ARRIVE_Y}`,
  `M${HUB.x} 98C${HUB.x} 130 ${tileCx(0)} 118 ${tileCx(0)} ${ARRIVE_Y}`,
  `M${HUB.x} 98C${HUB.x} 130 ${tileCx(2)} 118 ${tileCx(2)} ${ARRIVE_Y}`,
];
// Chevron heads, same order as the routes (centre, left, right).
const HEAD_X = [HUB.x, tileCx(0), tileCx(2)];

/** Four-point sparkle centred on (x, y). */
const sparkle = (x: number, y: number, r: number) =>
  `M${x} ${y - r}Q${x} ${y} ${x + r} ${y}Q${x} ${y} ${x} ${y + r}Q${x} ${y} ${x - r} ${y}Q${x} ${y} ${x} ${y - r}Z`;
const SPARKLES: [number, number, number][] = [
  [159, 66, 10],
  [244, 146, 7],
  [282, 22, 6.5],
  [84, 18, 5],
  [52, 122, 5],
];

export default function RoutingVisual() {
  return (
    <div className={`${v.visual} ${v.neutral}`} data-mf-visual="routing" aria-hidden="true">
      <div className={v.rPanel}>
        <div className={v.rBlob} data-mf="blob" />
        <svg className={v.svg} viewBox={`0 0 ${VB.w} ${VB.h}`} fill="none">
          {/* ripple rings, outermost first so the badge paints on top */}
          <g stroke="#fff" strokeWidth="1.15">
            {[158, 109, 65].map((r) => (
              <circle key={r} data-mf="ring" cx={HUB.x} cy={HUB.y} r={r} />
            ))}
          </g>

          {/* Roma badge */}
          <g data-mf="badge">
            <rect x={HUB.x - 28} y={HUB.y - 28} width="56" height="56" rx="16" fill="#fff" stroke="#E8E4DA" strokeWidth="1.15" />
            <image href="/brand/roma-mark.png" x={HUB.x - 19} y={HUB.y - 19} width="38" height="38" />
          </g>

          {/* routes: shafts draw, then the heads land */}
          <g stroke="#6B665C" strokeWidth="1.15" strokeLinecap="round" strokeLinejoin="round">
            {ROUTE_D.map((d) => (
              <path key={d} data-mf="shaft" d={d} />
            ))}
            {HEAD_X.map((x) => (
              <path key={x} data-mf="head" d={`M${x - 3.7} ${ARRIVE_Y - 3.7}l3.7 3.7 3.7-3.7`} />
            ))}
          </g>

          {/* destination tiles */}
          {ROUTES.map((t, i) => {
            const cx = tileCx(i);
            return (
              <g key={t.lines.join("")} data-mf="cat">
                <rect x={TILE_X[i]} y={TILE.y} width={TILE.w} height={TILE.h} rx={TILE.r} fill={t.fill} />
                <g stroke={t.ink} strokeWidth="1.72" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx={cx} cy="192" r="11.5" />
                  <path data-mf="tick" d={`M${cx - 4.4} 192.4l3 3 5.8-5.9`} />
                </g>
                <text className={v.rLabel} fill={t.ink} textAnchor="middle">
                  {t.lines.map((line, j) => (
                    <tspan key={line} x={cx} y={t.lines.length === 1 ? 234 : 226 + j * 15}>
                      {line}
                    </tspan>
                  ))}
                </text>
              </g>
            );
          })}

          {/* sparkles */}
          <g fill="#fff">
            {SPARKLES.map(([x, y, r]) => (
              <path key={`${x}-${y}`} data-mf="star" d={sparkle(x, y, r)} />
            ))}
          </g>
        </svg>
      </div>
    </div>
  );
}
