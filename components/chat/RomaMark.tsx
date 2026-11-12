import s from "./askRoma.module.css";

// Roma rosette (public/brand/roma-mark.png) redrawn as SVG: two rings + six circles that pass
// through the centre. Each petal circle is its own element so it can be staggered (bloom on
// arrival, ripple on hover, pulse while thinking) — Hyperline's per-path mark-wave, in Roma form.
const R = 12.1;
const PETALS = Array.from({ length: 6 }, (_, i) => {
  const a = -Math.PI / 3 + (i * Math.PI) / 3;
  return { cx: +(32 + R * Math.cos(a)).toFixed(2), cy: +(32 + R * Math.sin(a)).toFixed(2) };
});

export default function RomaMark({ className = "" }: { className?: string }) {
  return (
    <svg className={`${s.mark} ${className}`} viewBox="0 0 64 64" aria-hidden="true" focusable="false">
      <g fill="none" stroke="currentColor">
        <circle className={s.ring} cx="32" cy="32" r="30.2" strokeWidth="3.4" />
        <circle className={s.ring} cx="32" cy="32" r="26.7" strokeWidth="2" />
        <g strokeWidth="2.7">
          {PETALS.map((p, i) => (
            <circle
              key={i}
              className={s.petal}
              cx={p.cx}
              cy={p.cy}
              r={R}
              style={{ "--i": i } as React.CSSProperties}
            />
          ))}
        </g>
      </g>
    </svg>
  );
}
