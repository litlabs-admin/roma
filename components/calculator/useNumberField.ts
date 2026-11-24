"use client";

import { useState } from "react";
import type { InputSpec } from "@/lib/content/calculator";
import { calcCopy } from "@/lib/content/calculator";
import { clamp, fmtMoneyShort, parseMoney, parsePercent } from "@/lib/calculator/math";

/**
 * The typed half of a calculator input (brief §2.9, §2.11), shared by RangeField and the
 * revenue hero. Typing accepts "10m" / "10,000,000" / "2.5%"; disallowed characters never
 * reach the field; a value that can't be read, or is out of range, is flagged while typing
 * and clamped on commit (blur / Enter). An emptied field falls back to its default and says
 * so, unless `emptyFallback` is off (the hero before anything is entered).
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

export function formatShort(spec: InputSpec, v: number) {
  return spec.unit === "money" ? fmtMoneyShort(v) : formatInput(spec, v);
}

/** Characters each kind of field accepts; anything else is dropped as it's typed. */
const DISALLOWED: Record<InputSpec["unit"], RegExp> = {
  money: /[^0-9.,$kmbKMB\s]/g,
  percent: /[^0-9.%\s]/g,
};

export function parseInput(spec: InputSpec, raw: string) {
  return spec.unit === "money" ? parseMoney(raw) : parsePercent(raw);
}

export type FieldMsg = { kind: "range" | "fallback"; text: string };

export function useNumberField(spec: InputSpec, onChange: (v: number) => void, { emptyFallback = true }: { emptyFallback?: boolean } = {}) {
  const [draft, setDraft] = useState<string | null>(null);
  const [msg, setMsg] = useState<FieldMsg | null>(null);
  const rangeMsg = calcCopy.notes.range(formatShort(spec, spec.min), formatShort(spec, spec.max));
  const formatMsg = calcCopy.notes.format[spec.unit];

  const onType = (typed: string) => {
    const raw = typed.replace(DISALLOWED[spec.unit], "");
    setDraft(raw);
    const blocked = raw !== typed;
    if (!raw.trim()) {
      setMsg(blocked ? { kind: "range", text: formatMsg } : null);
      return;
    }
    const v = parseInput(spec, raw);
    if (!Number.isFinite(v)) {
      setMsg({ kind: "range", text: formatMsg });
      return;
    }
    if (v < spec.min || v > spec.max) {
      // a blocked keystroke explains itself first; the range shows on the next key or blur
      setMsg({ kind: "range", text: blocked ? formatMsg : rangeMsg });
      return;
    }
    onChange(v);
    setMsg(blocked ? { kind: "range", text: formatMsg } : null);
  };

  /** Settles the draft. Returns the value it committed, or null when nothing was committed. */
  const onCommit = (): number | null => {
    const raw = draft;
    setDraft(null);
    if (raw === null) return null;
    if (!raw.trim()) {
      if (!emptyFallback) {
        setMsg(null);
        return null;
      }
      onChange(spec.def);
      setMsg({ kind: "fallback", text: calcCopy.notes.fallback(formatInput(spec, spec.def)) });
      return spec.def;
    }
    const v = parseInput(spec, raw);
    if (!Number.isFinite(v)) {
      // unreadable: keep the last good value and say why
      setMsg({ kind: "range", text: formatMsg });
      return null;
    }
    const c = clamp(v, spec.min, spec.max);
    onChange(c);
    setMsg(c !== v ? { kind: "range", text: rangeMsg } : null);
    return c;
  };

  return { draft, setDraft, msg, setMsg, onType, onCommit };
}
