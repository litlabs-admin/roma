"use client";

import { INPUTS, calcCopy } from "@/lib/content/calculator";
import { fmtMoneyShort } from "@/lib/calculator/math";
import { formatInput, parseInput, useNumberField } from "./useNumberField";
import s from "./calculator.module.css";
import ui from "@/components/ui/ui.module.css";

/**
 * The revenue question (DESIGN.md §G.17). One large money field, quick-pick chips and a
 * live readout ("That's $10M a year"), sharing RangeField's parsing and validation.
 *
 * - ask:     the full page before results; big prompt, Calculate (or Enter, or a chip) reveals.
 * - summary: the full page after the reveal; "On [$10,000,000] in annual revenue", still
 *            editable, results re-tween live.
 * - embed:   compact embeds; label + field + chips, results update live, no submit step.
 */

const spec = INPUTS.R;
const C = calcCopy.ask;

type Mode = "ask" | "summary" | "embed";

export default function RevenueHero({
  value,
  onChange,
  idPrefix,
  mode,
  entered = true,
  onSubmit,
}: {
  value: number;
  onChange: (v: number) => void;
  idPrefix: string;
  mode: Mode;
  /** False until the visitor has given a revenue: the field shows its placeholder. */
  entered?: boolean;
  onSubmit?: () => void;
}) {
  const id = `${idPrefix}-R`;
  const { draft, setDraft, msg, setMsg, onType, onCommit } = useNumberField(spec, onChange, { emptyFallback: entered });

  const shown = draft ?? (entered ? formatInput(spec, value) : "");
  const parsed = draft !== null ? parseInput(spec, draft) : NaN;
  const readout =
    Number.isFinite(parsed) && parsed >= spec.min && parsed <= spec.max && draft !== formatInput(spec, parsed)
      ? C.readout(fmtMoneyShort(parsed))
      : null;

  const submit = () => {
    const committed = onCommit();
    if (committed !== null || entered) onSubmit?.();
    else setMsg((m) => m ?? { kind: "range", text: C.empty });
  };

  const pick = (v: number) => {
    setDraft(null);
    setMsg(null);
    onChange(v);
    if (mode === "ask") onSubmit?.();
  };

  const note = msg ? (
    <p id={`${id}-msg`} className={`${s.fieldMsg} ${msg.kind === "range" ? s.fieldMsgWarn : ""}`} role={msg.kind === "range" ? "alert" : undefined}>
      {msg.text}
    </p>
  ) : readout ? (
    <p id={`${id}-msg`} className={s.heroReadout} aria-live="polite">
      {readout}
    </p>
  ) : mode === "ask" ? (
    <p id={`${id}-msg`} className={s.fieldNote}>
      {C.hint}
    </p>
  ) : null;

  const input = (
    <input
      id={`${id}-text`}
      className={s.heroInput}
      type="text"
      inputMode="decimal"
      autoComplete="off"
      spellCheck={false}
      enterKeyHint={mode === "ask" ? "go" : "done"}
      placeholder={C.placeholder}
      value={shown}
      onFocus={(e) => {
        setDraft(shown);
        const t = e.currentTarget;
        requestAnimationFrame(() => t.select());
      }}
      onChange={(e) => onType(e.target.value)}
      onBlur={() => onCommit()}
      onKeyDown={(e) => {
        if (e.key !== "Enter") return;
        e.preventDefault();
        if (mode === "ask") submit();
        else e.currentTarget.blur();
      }}
      aria-describedby={note ? `${id}-msg` : undefined}
      aria-invalid={msg?.kind === "range" || undefined}
      size={mode === "summary" ? Math.max(6, shown.length) : undefined}
    />
  );

  const chips = (
    <div className={s.chips} role="group" aria-label={C.chipsLabel}>
      {C.chips.map((v) => {
        const on = entered && draft === null && value === v;
        return (
          <button key={v} type="button" className={`${s.chip} ${on ? s.chipOn : ""}`} aria-pressed={on} onClick={() => pick(v)}>
            {fmtMoneyShort(v)}
          </button>
        );
      })}
    </div>
  );

  if (mode === "summary") {
    return (
      <div className={s.summary}>
        <label htmlFor={`${id}-text`} className={s.summaryLine}>
          <span>{C.summaryBefore}</span>
          <span className={`${s.heroField} ${s.heroFieldSummary} ${msg?.kind === "range" ? s.heroFieldWarn : ""}`}>
            {input}
            <svg className={s.summaryPen} viewBox="0 0 16 16" aria-hidden="true">
              <path d="M10.5 3.5l2 2L6 12H4v-2z" />
            </svg>
          </span>
          <span>{C.summaryAfter}</span>
        </label>
        {note}
      </div>
    );
  }

  if (mode === "embed") {
    return (
      <div className={s.heroEmbed}>
        <label htmlFor={`${id}-text`} className={s.fieldLabel}>
          {spec.label}
        </label>
        <span className={`${s.heroField} ${s.heroFieldEmbed} ${msg?.kind === "range" ? s.heroFieldWarn : ""}`}>{input}</span>
        {note}
        {chips}
      </div>
    );
  }

  return (
    <div className={s.hero}>
      <p className={`${s.eyebrow} type-label`}>
        <span className={s.dot} aria-hidden="true" />
        {C.label}
      </p>
      <label htmlFor={`${id}-text`} className={`${s.heroPrompt} type-h3`}>
        {C.prompt}
      </label>
      <div className={s.heroRow}>
        <span className={`${s.heroField} ${msg?.kind === "range" ? s.heroFieldWarn : ""}`}>{input}</span>
        <button type="button" className={`${ui.btn} ${ui.primary} ${s.heroSubmit}`} onClick={submit}>
          <span className={ui.fill} aria-hidden="true" />
          <span className={ui.label}>{C.submit} →</span>
        </button>
      </div>
      {note}
      {chips}
    </div>
  );
}
