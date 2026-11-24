"use client";

import { useState, type CSSProperties } from "react";
import type { InputSpec } from "@/lib/content/calculator";
import { calcCopy } from "@/lib/content/calculator";
import { clamp, fmtMoneyShort, parseMoney, parsePercent } from "@/lib/calculator/math";
import s from "./calculator.module.css";

/**
 * One calculator input: a label, a typed field and a slider bound to the same value
 * (brief §2.9, §2.11). Typing accepts "10m" / "10,000,000" / "2.5%"; out-of-range values
 * clamp on blur with an inline message; an emptied field falls back to its default and
 * says so. The slider is native (keyboard and screen readers for free), restyled; revenue
 * uses a log scale because it spans $100K to $1B.
 */

const usd = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

export function formatInput(spec: InputSpec, v: number) {
  switch (spec.unit) {
    case "money":
      return usd.format(v);
    case "percent":
      return `${Number.isInteger(v) ? v : v.toFixed(1)}%`;
  }
}

function formatShort(spec: InputSpec, v: number) {
  return spec.unit === "money" ? fmtMoneyShort(v) : formatInput(spec, v);
}

/** Characters each kind of field accepts; anything else is dropped as it's typed. */
const DISALLOWED: Record<InputSpec["unit"], RegExp> = {
  money: /[^0-9.,$kmbKMB\s]/g,
  percent: /[^0-9.%\s]/g,
};

function parse(spec: InputSpec, raw: string) {
  return spec.unit === "money" ? parseMoney(raw) : parsePercent(raw);
}

const STEPS = 1000;

/** Two significant figures keep log-slider values tidy ($12M, not $12,345,678). */
function nice(v: number) {
  const mag = Math.pow(10, Math.floor(Math.log10(v)) - 1);
  return Math.round(v / mag) * mag;
}

function toPos(spec: InputSpec, v: number) {
  if (!spec.log) return v;
  return Math.round((Math.log(v / spec.min) / Math.log(spec.max / spec.min)) * STEPS);
}
function fromPos(spec: InputSpec, p: number) {
  if (!spec.log) return p;
  return clamp(nice(spec.min * Math.pow(spec.max / spec.min, p / STEPS)), spec.min, spec.max);
}

function snap(spec: InputSpec, v: number) {
  const dp = spec.step < 1 ? 1 : 0;
  return Number(v.toFixed(dp));
}

export default function RangeField({
  spec,
  value,
  onChange,
  idPrefix,
  label = spec.label,
  unitAfter,
  note,
  compact = false,
}: {
  spec: InputSpec;
  value: number;
  onChange: (v: number) => void;
  idPrefix: string;
  label?: string;
  /** Unit shown after the typed field. */
  unitAfter?: string;
  /** Advisory note under the slider. */
  note?: string;
  compact?: boolean;
}) {
  const id = `${idPrefix}-${spec.key}`;
  const [draft, setDraft] = useState<string | null>(null);
  const [msg, setMsg] = useState<{ kind: "range" | "fallback"; text: string } | null>(null);

  const pos = toPos(spec, value);
  const lo = toPos(spec, spec.min);
  const hi = toPos(spec, spec.max);
  const pct = ((pos - lo) / (hi - lo)) * 100;
  const rangeMsg = calcCopy.notes.range(formatShort(spec, spec.min), formatShort(spec, spec.max));

  // Live validation: disallowed characters never reach the field; a value that can't be
  // read, or is out of range, is flagged while typing (and clamped on blur).
  const onType = (typed: string) => {
    const raw = typed.replace(DISALLOWED[spec.unit], "");
    setDraft(raw);
    const blocked = raw !== typed;
    if (!raw.trim()) {
      setMsg(blocked ? { kind: "range", text: calcCopy.notes.format[spec.unit] } : null);
      return;
    }
    const v = parse(spec, raw);
    if (!Number.isFinite(v)) {
      setMsg({ kind: "range", text: calcCopy.notes.format[spec.unit] });
      return;
    }
    if (v < spec.min || v > spec.max) {
      // a blocked keystroke explains itself first; the range shows on the next key or blur
      setMsg({ kind: "range", text: blocked ? calcCopy.notes.format[spec.unit] : rangeMsg });
      return;
    }
    onChange(v);
    setMsg(blocked ? { kind: "range", text: calcCopy.notes.format[spec.unit] } : null);
  };

  const onCommit = () => {
    const raw = draft;
    setDraft(null);
    if (raw === null) return;
    if (!raw.trim()) {
      onChange(spec.def);
      setMsg({ kind: "fallback", text: calcCopy.notes.fallback(formatInput(spec, spec.def)) });
      return;
    }
    const v = parse(spec, raw);
    if (!Number.isFinite(v)) {
      // unreadable: keep the last good value and say why
      setMsg({ kind: "range", text: calcCopy.notes.format[spec.unit] });
      return;
    }
    const c = clamp(v, spec.min, spec.max);
    onChange(c);
    setMsg(c !== v ? { kind: "range", text: rangeMsg } : null);
  };

  const describedBy = [msg ? `${id}-msg` : "", note ? `${id}-note` : ""].filter(Boolean).join(" ") || undefined;

  return (
    <div className={`${s.field} ${compact ? s.fieldCompact : ""}`}>
      <div className={s.fieldHead}>
        <label htmlFor={`${id}-text`} className={s.fieldLabel}>
          {label}
        </label>
        <span className={`${s.typed} ${msg?.kind === "range" ? s.typedWarn : ""}`}>
          <input
            id={`${id}-text`}
            className={s.typedInput}
            type="text"
            inputMode="decimal"
            autoComplete="off"
            spellCheck={false}
            value={draft ?? formatInput(spec, value)}
            onFocus={(e) => {
              setDraft(formatInput(spec, value));
              const t = e.currentTarget;
              requestAnimationFrame(() => t.select());
            }}
            onChange={(e) => onType(e.target.value)}
            onBlur={onCommit}
            onKeyDown={(e) => {
              if (e.key === "Enter") e.currentTarget.blur();
            }}
            aria-describedby={describedBy}
            aria-invalid={msg?.kind === "range" || undefined}
            size={Math.max(4, (draft ?? formatInput(spec, value)).length)}
          />
          {unitAfter && <span className={s.typedUnit}>{unitAfter}</span>}
        </span>
      </div>
      <input
        id={id}
        className={s.range}
        type="range"
        min={lo}
        max={hi}
        step={spec.log ? 1 : spec.step}
        value={pos}
        onChange={(e) => {
          setMsg(null);
          onChange(snap(spec, fromPos(spec, Number(e.target.value))));
        }}
        aria-label={label}
        aria-valuetext={formatInput(spec, value)}
        style={{ "--pct": `${pct}%` } as CSSProperties}
      />
      {!compact && (
        <div className={s.rangeEnds} aria-hidden="true">
          <span>{formatShort(spec, spec.min)}</span>
          <span>{formatShort(spec, spec.max)}</span>
        </div>
      )}
      {msg && (
        <p id={`${id}-msg`} className={`${s.fieldMsg} ${msg.kind === "range" ? s.fieldMsgWarn : ""}`} role={msg.kind === "range" ? "alert" : undefined}>
          {msg.text}
        </p>
      )}
      {note && (
        <p id={`${id}-note`} className={s.fieldNote}>
          {note}
        </p>
      )}
    </div>
  );
}
