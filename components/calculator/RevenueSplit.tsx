"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { calcCopy } from "@/lib/content/calculator";
import { fmtMoney, type Inputs, type Outputs } from "@/lib/calculator/math";
import Num from "./Num";
import s from "./calculator.module.css";

/**
 * "Where your revenue goes" (DESIGN.md §G.17): one bar for revenue that splits into
 * invalid / valid deductions / revenue kept, with a legend that doubles as the figures.
 * On mount the bar starts whole (all "kept") and opens to the real split, so the
 * deductions visibly carve out of revenue. Widths transition on every later change.
 */

const C = calcCopy.split;
const money = (v: number) => fmtMoney(v);
const pct = (v: number) => `${Number.isInteger(v) ? v : v.toFixed(1)}%`;

export default function RevenueSplit({ inp, out }: { inp: Inputs; out: Outputs }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // two frames: the closed state paints first, then the widths transition open
    let r2 = 0;
    const r1 = requestAnimationFrame(() => {
      r2 = requestAnimationFrame(() => setOpen(true));
    });
    return () => {
      cancelAnimationFrame(r1);
      cancelAnimationFrame(r2);
    };
  }, []);

  const R = inp.R > 0 ? inp.R : 1;
  const kept = Math.max(0, inp.R - out.total);
  const w = open
    ? { invalid: out.invalid / R, valid: out.valid / R, kept: kept / R }
    : { invalid: 0, valid: 0, kept: 1 };
  const keptPct = Math.max(0, 100 - inp.v - inp.i);

  const rows = [
    { key: "invalid", label: C.invalid, share: pct(inp.i), value: out.invalid, cls: s.swInvalid },
    { key: "valid", label: C.valid, share: pct(inp.v), value: out.valid, cls: s.swValid },
    { key: "kept", label: C.kept, share: pct(keptPct), value: kept, cls: s.swKept },
  ] as const;

  return (
    <div className={s.split}>
      <p className={s.splitLabel}>{C.label}</p>
      <div className={s.splitBar} aria-hidden="true">
        {rows.map((r) => (
          <span key={r.key} className={`${s.splitSeg} ${r.cls}`} style={{ "--w": w[r.key] } as CSSProperties} />
        ))}
      </div>
      <dl className={s.splitLegend}>
        {rows.map((r, n) => (
          <div key={r.key} className={`${s.splitRow} ${r.key === "invalid" ? s.splitRowHot : ""}`} style={{ "--i": n } as CSSProperties}>
            <dt>
              <span className={`${s.swatch} ${r.cls}`} aria-hidden="true" />
              {r.label}
              <span className={s.splitShare}>{r.share}</span>
            </dt>
            <dd>
              <Num value={r.value} format={money} from={0} delay={0.25 + n * 0.12} />
            </dd>
          </div>
        ))}
        <div className={`${s.splitRow} ${s.splitTotal}`}>
          <dt>{C.total}</dt>
          <dd>
            <Num value={out.total} format={money} from={0} delay={0.6} />
          </dd>
        </div>
      </dl>
    </div>
  );
}
