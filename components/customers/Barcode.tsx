/**
 * A UPC-style barcode drawn from the tag's code (deterministic, decorative). Bars and
 * gaps come from the digits so every tag has its own pattern.
 */
export default function Barcode({ code, className = "" }: { code: string; className?: string }) {
  const digits = code.replace(/\D/g, "").split("").map(Number);
  const bars: { x: number; w: number; tall: boolean }[] = [];
  let x = 0;
  const guard = () => {
    bars.push({ x, w: 1, tall: true });
    bars.push({ x: x + 2, w: 1, tall: true });
    x += 4;
  };
  guard();
  digits.forEach((d, i) => {
    if (i === Math.floor(digits.length / 2)) guard();
    bars.push({ x, w: (d % 3) + 1, tall: false });
    x += (d % 3) + 1 + ((d + i) % 2) + 1;
    bars.push({ x, w: ((d + 1) % 2) + 1, tall: false });
    x += ((d + 1) % 2) + 2;
  });
  guard();
  const w = x - 1;
  return (
    <svg className={className} viewBox={`0 0 ${w} 24`} preserveAspectRatio="none" aria-hidden="true" focusable="false">
      {bars.map((b, i) => (
        <rect key={i} x={b.x} y="0" width={b.w} height={b.tall ? 24 : 20} fill="currentColor" />
      ))}
    </svg>
  );
}
