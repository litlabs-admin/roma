"use client";

import { useState } from "react";
import { ChipGroup } from "@/components/forms/fields";
import { INPUTS, RETAILERS, calcCopy } from "@/lib/content/calculator";
import { clamp } from "@/lib/calculator/math";
import s from "./calculator.module.css";

/**
 * Where you sell (brief §2.2 input 7): portal chips plus the total count n. Ticking chips
 * raises n to at least the number ticked; the stepper can go higher (other distributors,
 * regional retailers). n feeds the suggested plan and the lead record, not the $ math.
 */
export default function RetailerPicker({
  retailers,
  onRetailers,
  n,
  onN,
  idPrefix,
}: {
  retailers: string[];
  onRetailers: (r: string[]) => void;
  n: number;
  onN: (n: number) => void;
  idPrefix: string;
}) {
  const spec = INPUTS.n;
  const id = `${idPrefix}-n`;
  const [draft, setDraft] = useState<string | null>(null);
  const floor = Math.max(spec.min, retailers.length);

  const set = (v: number) => onN(clamp(Math.round(v), floor, spec.max));

  return (
    <div className={s.retailers}>
      <fieldset className={s.chipSet}>
        <legend className={s.fieldLabel}>{calcCopy.retailers.label}</legend>
        <ChipGroup
          name={`${idPrefix}-retailers`}
          options={RETAILERS}
          value={retailers}
          onToggle={(o) => {
            const next = retailers.includes(o) ? retailers.filter((r) => r !== o) : [...retailers, o];
            onRetailers(next);
            if (next.length > n) onN(Math.min(spec.max, next.length));
          }}
        />
      </fieldset>

      <div className={s.countRow}>
        <label htmlFor={id} className={s.fieldLabel}>
          {calcCopy.retailers.count}
        </label>
        <div className={s.stepper}>
          <button type="button" className={s.stepBtn} onClick={() => set(n - 1)} disabled={n <= floor} aria-label="One fewer">
            <svg viewBox="0 0 16 16" aria-hidden="true">
              <path d="M3.5 8h9" />
            </svg>
          </button>
          <input
            id={id}
            className={s.stepInput}
            type="text"
            inputMode="numeric"
            autoComplete="off"
            value={draft ?? String(n)}
            onFocus={(e) => {
              setDraft(String(n));
              const t = e.currentTarget;
              requestAnimationFrame(() => t.select());
            }}
            onChange={(e) => {
              const raw = e.target.value.replace(/[^0-9]/g, "");
              setDraft(raw);
              const v = parseInt(raw, 10);
              if (Number.isFinite(v) && v >= floor && v <= spec.max) onN(v);
            }}
            onBlur={() => {
              const v = parseInt(draft ?? "", 10);
              setDraft(null);
              set(Number.isFinite(v) ? v : spec.def);
            }}
            onKeyDown={(e) => {
              if (e.key === "ArrowUp") {
                e.preventDefault();
                set(n + 1);
              } else if (e.key === "ArrowDown") {
                e.preventDefault();
                set(n - 1);
              } else if (e.key === "Enter") e.currentTarget.blur();
            }}
            aria-describedby={`${id}-hint`}
          />
          <button type="button" className={s.stepBtn} onClick={() => set(n + 1)} disabled={n >= spec.max} aria-label="One more">
            <svg viewBox="0 0 16 16" aria-hidden="true">
              <path d="M8 3.5v9M3.5 8h9" />
            </svg>
          </button>
        </div>
      </div>
      <p id={`${id}-hint`} className={s.fieldNote}>
        {calcCopy.retailers.hint}
      </p>
    </div>
  );
}
