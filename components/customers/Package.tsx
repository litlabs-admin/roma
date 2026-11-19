import type { Brand, PackageKind } from "@/lib/content/customers";
import s from "./package.module.css";

/**
 * Generic CPG packaging, drawn in SVG from a brand's palette (DESIGN.md §G.15). Four
 * kinds: a foil-crimped bar, a glass bottle, a pillow bag with a window, a cereal-style
 * box with a side panel. They're not anyone's real packaging, only the shape of the
 * category, so the shelf reads as a shelf. Type uses the site fonts via CSS classes.
 */

export const PACK_BOX: Record<PackageKind, { w: number; h: number }> = {
  bar: { w: 110, h: 190 },
  bottle: { w: 80, h: 232 },
  bag: { w: 140, h: 200 },
  box: { w: 132, h: 222 },
};

/** Zig-zag crimp points from x0 to x1 (either direction), alternating yA / yB every t/2. */
function zig(x0: number, x1: number, yA: number, yB: number, t = 5) {
  const dir = x1 > x0 ? 1 : -1;
  const n = Math.round(Math.abs(x1 - x0) / (t / 2));
  return Array.from({ length: n + 1 }, (_, i) => `${+(x0 + dir * i * (t / 2)).toFixed(2)} ${i % 2 ? yB : yA}`).join(" L");
}

function Bar({ b }: { b: Brand }) {
  const { body, deep, ink, accent } = b.palette;
  return (
    <>
      <ellipse cx="55" cy="186" rx="50" ry="3.5" className={s.shadow} />
      {/* foil ends */}
      <path d={`M8 18 L${zig(8, 102, 7, 3)} L102 18 Z`} fill={accent} />
      <path d={`M8 174 L102 174 L${zig(102, 8, 183, 187)} Z`} fill={accent} />
      <rect x="8" y="12" width="94" height="168" rx="1.5" fill={body} />
      <rect x="14" y="12" width="5" height="168" fill="#fff" opacity="0.28" />
      {/* brand + mark */}
      <text x="55" y="36" className={s.brand} fill={ink} fontSize="12" textAnchor="middle">
        {b.short}
      </text>
      <path d="M30 44 H80" stroke={ink} strokeWidth="0.6" opacity="0.5" />
      <g transform="translate(55 72)" stroke={deep} fill="none" strokeWidth="1.4" strokeLinecap="round">
        <circle r="9" />
        {Array.from({ length: 8 }, (_, i) => {
          const a = (i * Math.PI) / 4;
          return <path key={i} d={`M${(Math.cos(a) * 13).toFixed(2)} ${(Math.sin(a) * 13).toFixed(2)} L${(Math.cos(a) * 17).toFixed(2)} ${(Math.sin(a) * 17).toFixed(2)}`} />;
        })}
      </g>
      {/* band */}
      <rect x="8" y="104" width="94" height="52" fill={deep} />
      <text x="55" y="132" className={s.serif} fill={body} fontSize="21" textAnchor="middle">
        {b.pack.line}
      </text>
      <text x="55" y="146" className={s.mono} fill={accent} fontSize="6.4" textAnchor="middle">
        {b.pack.sub.toUpperCase()}
      </text>
      <text x="55" y="169" className={s.mono} fill={ink} fontSize="5" textAnchor="middle" opacity="0.75">
        {b.pack.net}
      </text>
    </>
  );
}

function Bottle({ b }: { b: Brand }) {
  const { body, deep, ink, accent } = b.palette;
  const glass = "M31 24 L49 24 L49 46 C49 60 68 64 68 86 L68 216 Q68 225 59 225 L21 225 Q12 225 12 216 L12 86 C12 64 31 60 31 46 Z";
  return (
    <>
      <ellipse cx="40" cy="228" rx="34" ry="3.5" className={s.shadow} />
      <path d={glass} fill={deep} />
      {/* liquid line seen through the shoulder */}
      <path d="M15 92 C26 88 54 88 65 92 L65 100 L15 100 Z" fill={accent} opacity="0.45" />
      <path d="M19 94 L19 208" stroke="#fff" strokeWidth="3" strokeLinecap="round" opacity="0.28" />
      <path d="M33 30 L33 46" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" opacity="0.3" />
      {/* cap */}
      <rect x="28" y="4" width="24" height="21" rx="2" fill={ink} />
      {[9, 13, 17, 21].map((y) => (
        <path key={y} d={`M28 ${y} H52`} stroke="#fff" strokeWidth="0.5" opacity="0.25" />
      ))}
      <rect x="31" y="32" width="18" height="7" fill={accent} />
      {/* label */}
      <rect x="12" y="108" width="56" height="88" fill={body} />
      <path d="M12 112 H68 M12 192 H68" stroke={deep} strokeWidth="0.6" />
      <text x="40" y="126" className={s.brand} fill={ink} fontSize="8.6" textAnchor="middle">
        {b.short}
      </text>
      {/* fern frond */}
      <g transform="translate(40 146)" stroke={deep} fill="none" strokeWidth="1" strokeLinecap="round">
        <path d="M0 9 C0 2 1 -4 3 -10" />
        {[6, 2, -2, -6].map((y, i) => (
          <path key={y} d={`M${0.3 + i * 0.6} ${y} l${-5 + i} ${-3 + i * 0.4} M${0.3 + i * 0.6} ${y} l${5 - i} ${-3 + i * 0.4}`} />
        ))}
      </g>
      <text x="40" y="173" className={s.serif} fill={ink} fontSize="14" textAnchor="middle">
        {b.pack.line}
      </text>
      <text x="40" y="182" className={s.mono} fill={deep} fontSize="5" textAnchor="middle">
        {b.pack.sub.toUpperCase()}
      </text>
      <text x="40" y="216" className={s.mono} fill="#fff" fontSize="4.6" textAnchor="middle" opacity="0.6">
        {b.pack.net}
      </text>
    </>
  );
}

// Popcorn in the bag window: a deterministic cluster.
const KERNELS = [
  [52, 112, 6], [61, 108, 5], [70, 113, 6.5], [80, 108, 5.5], [89, 113, 5],
  [48, 123, 5.5], [58, 121, 6.5], [69, 124, 5.5], [79, 121, 6.5], [91, 124, 6],
  [53, 133, 5], [63, 132, 5.5], [74, 134, 6], [85, 132, 5.5],
] as const;

function Bag({ b }: { b: Brand }) {
  const { body, deep, ink, accent } = b.palette;
  return (
    <>
      <ellipse cx="70" cy="196" rx="62" ry="3.5" className={s.shadow} />
      <path d="M14 22 Q70 14 126 22 L131 178 Q70 186 9 178 Z" fill={body} />
      <path d={`M14 24 L${zig(14, 126, 11, 6, 6)} L126 24 Q70 16 14 24 Z`} fill={deep} />
      <path d={`M9 176 Q70 184 131 176 L${zig(131, 9, 189, 194, 6)} Z`} fill={deep} />
      <path d="M22 30 L18 170" stroke="#fff" strokeWidth="4" strokeLinecap="round" opacity="0.25" />
      <text x="70" y="44" className={s.brand} fill={ink} fontSize="11.5" textAnchor="middle">
        {b.short}
      </text>
      {/* small flame */}
      <path d="M70 50 C66 55 65 59 67 62 C68 64 72 64 73 62 C75 59 74 55 70 50 Z" fill={accent} />
      <text x="70" y="84" className={s.serif} fill={ink} fontSize="17" textAnchor="middle">
        {b.pack.line}
      </text>
      {/* window */}
      <rect x="40" y="96" width="60" height="48" rx="22" fill="#FFF9EC" stroke={deep} strokeWidth="1" />
      {KERNELS.map(([x, y, r], i) => (
        <circle key={i} cx={x} cy={y} r={r} fill="#FBF1D6" stroke="#E2C88E" strokeWidth="0.8" />
      ))}
      <text x="70" y="158" className={s.mono} fill={deep} fontSize="6" textAnchor="middle">
        {b.pack.sub.toUpperCase()}
      </text>
      <text x="70" y="169" className={s.mono} fill={ink} fontSize="4.8" textAnchor="middle" opacity="0.7">
        {b.pack.net}
      </text>
    </>
  );
}

const CLUSTERS = [
  [38, 148, 4], [46, 145, 3.5], [54, 147, 4.5], [62, 144, 3.5], [70, 147, 4], [78, 145, 3.5],
  [43, 152, 3], [51, 153, 3.5], [59, 151, 3], [67, 153, 3.5], [74, 152, 3],
] as const;

function Box({ b }: { b: Brand }) {
  const { body, deep, ink, accent } = b.palette;
  return (
    <>
      <ellipse cx="66" cy="218" rx="58" ry="3.5" className={s.shadow} />
      {/* top + side faces */}
      <path d="M8 16 L26 8 L124 8 L106 16 Z" fill={deep} opacity="0.72" />
      <path d="M106 16 L124 8 L124 206 L106 214 Z" fill={deep} />
      {[40, 46, 52, 58, 64, 70, 76, 82].map((y, i) => (
        <path key={y} d={`M109 ${y} L${i % 3 === 0 ? 121 : 117} ${y - 3}`} stroke={body} strokeWidth="0.6" opacity="0.55" />
      ))}
      <rect x="8" y="16" width="98" height="198" fill={body} />
      <rect x="13" y="16" width="5" height="198" fill="#fff" opacity="0.25" />
      <text x="57" y="38" className={s.brand} fill={ink} fontSize="11" textAnchor="middle">
        {b.short}
      </text>
      <path d="M22 46 H92" stroke={ink} strokeWidth="0.6" opacity="0.45" />
      <text x="57" y="72" className={s.serif} fill={ink} fontSize="15" textAnchor="middle">
        {b.pack.line}
      </text>
      <text x="57" y="85" className={s.mono} fill={deep} fontSize="6" textAnchor="middle">
        {b.pack.sub.toUpperCase()}
      </text>
      {/* bowl of granola */}
      <path d="M26 150 Q57 196 88 150 Z" fill={deep} />
      <ellipse cx="57" cy="150" rx="31" ry="6" fill={accent} />
      {CLUSTERS.map(([x, y, r], i) => (
        <circle key={i} cx={x + 2} cy={y - 2} r={r} fill={i % 2 ? "#E7CF9A" : "#D9B776"} />
      ))}
      <path d="M88 128 L100 116" stroke={ink} strokeWidth="2.2" strokeLinecap="round" opacity="0.7" />
      <text x="57" y="205" className={s.mono} fill={ink} fontSize="4.8" textAnchor="middle" opacity="0.7">
        {b.pack.net}
      </text>
    </>
  );
}

const ART = { bar: Bar, bottle: Bottle, bag: Bag, box: Box };

export default function Package({ brand, className = "" }: { brand: Brand; className?: string }) {
  const box = PACK_BOX[brand.kind];
  const Art = ART[brand.kind];
  return (
    <svg className={`${s.pack} ${className}`} viewBox={`0 0 ${box.w} ${box.h}`} aria-hidden="true" focusable="false">
      <Art b={brand} />
    </svg>
  );
}
