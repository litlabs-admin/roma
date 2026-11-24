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
 * - ask:     before results; big prompt, Calculate (or Enter, or a chip) reveals. Embeds
 *            pass their own eyebrow + heading; the prompt then reads as the field's label.
 * - summary: after the reveal; "On [$10,000,000] in annual revenue", still editable,
 *            results re-tween live.
 * - inline:  the slim banner; field + Calculate in one row, no chips.
 */

const spec = INPUTS.R;
const C = calcCopy.ask;

type Mode = "ask" | "summary" | "inline";

export default function RevenueHero({
  value,
  onChange,
  idPrefix,
  mode,
  entered = true,
  onSubmit,
  eyebrow = C.label,
  heading,
}: {
  value: number;
  onChange: (v: number) => void;
  idPrefix: string;
  mode: Mode;
  /** False until the visitor has given a revenue: the field shows its placeholder. */
  entered?: boolean;
  /** Called with the revenue to use (a just-typed value may not be in `value` yet). */
  onSubmit?: (v: number) => void;
  eyebrow?: string;
  /** An embed's own section heading; the prompt then becomes a smaller label under it. */
  heading?: { id: string; text: string };
}) {
  const id = `${idPrefix}-R`;
  const { draft, setDraft, msg, setMsg, onType, onCommit } = useNumberField(spec, onChange, { emptyFallback: entered });

  const shown = draft ?? (entered ? formatInput(spec, value) : "");
  const parsed = draft !== null ? parseInput(spec, draft) : NaN;
  const readout =
    Number.isFinite(parsed) && parsed >= spec.min && parsed <= spec.max && draft !== formatInput(spec, parsed) ? C.readout(fmtMoneyShort(parsed)) : null;

  const submit = () => {
    const committed = onCommit();
    if (committed !== null) onSubmit?.(committed);
    else if (entered) onSubmit?.(value);
    else setMsg((m) => m ?? { kind: "range", text: C.empty });
  };

  const pick = (v: number) => {
    setDraft(null);
    setMsg(null);
    onChange(v);
    if (mode === "ask") onSubmit?.(v);
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
      enterKeyHint={mode === "summary" ? "done" : "go"}
      placeholder={C.placeholder}
      value={shown}
      onFocus={(e) => {
        setDraft(shown);
        const t = e.currentTarget;
        // select the formatted value for easy overwrite, unless typing has already begun
        if (shown) requestAnimationFrame(() => t.value === shown && t.select());
      }}
      onChange={(e) => onType(e.target.value)}
      onBlur={() => onCommit()}
      onKeyDown={(e) => {
        if (e.key !== "Enter") return;
        e.preventDefault();
        if (mode !== "summary") submit();
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

  const submitBtn = (
    <button type="button" className={`${ui.btn} ${ui.primary} ${s.heroSubmit}`} onClick={submit}>
      <span className={ui.fill} aria-hidden="true" />
      <span className={ui.label}>{C.submit} →</span>
    </button>
  );

  if (mode === "inline") {
    return (
      <div className={s.heroInline}>
        <label htmlFor={`${id}-text`} className="sr-only">
          {spec.label}
        </label>
        <div className={s.heroInlineRow}>
          <span className={`${s.heroField} ${s.heroFieldInline} ${msg?.kind === "range" ? s.heroFieldWarn : ""}`}>{input}</span>
          {submitBtn}
        </div>
        {msg && note}
      </div>
    );
  }

  return (
    <div className={s.hero}>
      <p className={`${s.eyebrow} type-label`}>
        <span className={s.dot} aria-hidden="true" />
        {eyebrow}
      </p>
      {heading && (
        <h2 id={heading.id} className={`${s.heroPrompt} type-h3`}>
          {heading.text}
        </h2>
      )}
      <label htmlFor={`${id}-text`} className={heading ? s.heroPromptSmall : `${s.heroPrompt} type-h3`}>
        {C.prompt}
      </label>
      <div className={s.heroRow}>
        <span className={`${s.heroField} ${msg?.kind === "range" ? s.heroFieldWarn : ""}`}>{input}</span>
        {submitBtn}
      </div>
      {note}
      {chips}
    </div>
  );
}
