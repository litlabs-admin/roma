"use client";

import type { ChangeEvent, InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from "react";
import { Glyph } from "@/components/platform/mock/kit";
import type { Option } from "@/lib/content/contact";
import { COUNTRIES, countryByIso } from "@/lib/content/countries";
import Dropdown, { type DropdownOption } from "./Dropdown";
import f from "./forms.module.css";

/**
 * Form primitives (DESIGN.md §G.12). Every control has a real <label>, carries
 * aria-invalid + aria-describedby (hint and error ids), and shows its error under the
 * field. Styling only; state lives in LeadForm.
 */

export const ids = (name: string) => ({ input: `f-${name}`, hint: `f-${name}-hint`, error: `f-${name}-error` });

function describedBy(name: string, hint?: string, error?: string) {
  const i = ids(name);
  return [hint ? i.hint : "", error ? i.error : ""].filter(Boolean).join(" ") || undefined;
}

type FieldProps = {
  name: string;
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
  counter?: ReactNode;
  className?: string;
  /** For groups (checkboxes): render a fieldset/legend instead of a label. */
  group?: boolean;
  children: ReactNode;
};

/** Label + control + hint + error. */
export function Field({ name, label, required, hint, error, counter, className = "", group, children }: FieldProps) {
  const i = ids(name);
  const head = (
    <>
      {label}
      {required ? (
        <span className={f.req} aria-hidden="true">
          *
        </span>
      ) : (
        <span className={f.optional}>(optional)</span>
      )}
    </>
  );
  const tail = (
    <>
      {(hint || counter) && (
        <span className={f.hintRow}>
          {hint && (
            <span id={i.hint} className={f.hint}>
              {hint}
            </span>
          )}
          {counter}
        </span>
      )}
      <span id={i.error} className={f.error} hidden={!error}>
        <Glyph k="alert" />
        {error}
      </span>
    </>
  );
  if (group) {
    return (
      <fieldset className={`${f.field} ${f.fieldset} ${error ? f.hasError : ""} ${className}`} aria-describedby={describedBy(name, hint, error)} id={i.input} tabIndex={-1}>
        <legend className={f.label}>{head}</legend>
        {children}
        {tail}
      </fieldset>
    );
  }
  return (
    <div className={`${f.field} ${error ? f.hasError : ""} ${className}`}>
      <label htmlFor={i.input} className={f.label}>
        {head}
      </label>
      {children}
      {tail}
    </div>
  );
}

type Common = { name: string; error?: string; hint?: string; required?: boolean };

export function TextInput({ name, error, hint, required, ...rest }: Common & InputHTMLAttributes<HTMLInputElement>) {
  const i = ids(name);
  return (
    <input
      id={i.input}
      name={name}
      className={f.input}
      aria-invalid={error ? true : undefined}
      aria-required={required || undefined}
      aria-describedby={describedBy(name, hint, error)}
      {...rest}
    />
  );
}

/** Single select, rendered with the custom Dropdown (no native menu). */
export function SelectInput({
  name,
  error,
  hint,
  required,
  placeholder,
  options,
  value,
  onChange,
  onLeave,
  disabled,
}: Common & { placeholder: string; options: Option[]; value: string; onChange: (v: string) => void; onLeave?: () => void; disabled?: boolean }) {
  return (
    <Dropdown
      id={ids(name).input}
      name={name}
      value={value}
      options={options}
      placeholder={placeholder}
      onChange={onChange}
      onLeave={onLeave}
      invalid={!!error}
      describedBy={describedBy(name, hint, error)}
      required={required}
      disabled={disabled}
    />
  );
}

// Flags: country-flag-icons 3x2 SVGs (MIT), copied to public/flags (no runtime dependency).
const flagSrc = (iso: string) => `/flags/${iso.toLowerCase()}.svg`;
const COUNTRY_OPTIONS: DropdownOption[] = COUNTRIES.map((c) => ({
  value: c.iso,
  label: c.name,
  meta: c.dial,
  search: `${c.iso} ${c.dial} ${c.dial.slice(1)}`,
  img: flagSrc(c.iso),
}));

/** Phone: a searchable country-code prefix joined to the number input. */
export function PhoneInput({
  error,
  country,
  onCountry,
  countryLabel,
  searchLabel,
  disabled,
  ...rest
}: Omit<Common, "name"> & {
  country: string;
  onCountry: (iso: string) => void;
  countryLabel: string;
  searchLabel: string;
  disabled?: boolean;
} & InputHTMLAttributes<HTMLInputElement>) {
  const i = ids("phone");
  return (
    <div className={`${f.phone} ${error ? f.phoneInvalid : ""} ${disabled ? f.phoneDisabled : ""}`}>
      <Dropdown
        id="f-phoneCountry"
        name="phoneCountry"
        value={country}
        options={COUNTRY_OPTIONS}
        placeholder={countryLabel}
        onChange={onCountry}
        searchable
        searchPlaceholder={searchLabel}
        variant="prefix"
        ariaLabel={`${countryLabel}: ${countryByIso(country).name} ${countryByIso(country).dial}`}
        disabled={disabled}
        renderValue={(o) => (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element -- tiny local SVG */}
            <img src={flagSrc(o.value)} alt="" width={20} height={14} className={f.flag} />
            <span className={f.dial}>{o.meta}</span>
          </>
        )}
      />
      <input
        id={i.input}
        name="phone"
        type="tel"
        inputMode="tel"
        autoComplete="tel-national"
        className={f.phoneInput}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy("phone", undefined, error)}
        {...rest}
      />
    </div>
  );
}

export function TextArea({ name, error, hint, required, ...rest }: Common & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const i = ids(name);
  return (
    <textarea
      id={i.input}
      name={name}
      className={`${f.input} ${f.textarea}`}
      aria-invalid={error ? true : undefined}
      aria-required={required || undefined}
      aria-describedby={describedBy(name, hint, error)}
      {...rest}
    />
  );
}

/** Character counter for the message ("1,840 / 2,000"). */
export function Counter({ length, max }: { length: number; max: number }) {
  const over = length > max;
  return (
    <span className={`${f.counter} ${over ? f.counterOver : ""}`} aria-live={over ? "polite" : undefined}>
      {length.toLocaleString("en-US")} / {max.toLocaleString("en-US")}
    </span>
  );
}

/** Channel toggle chips: native checkboxes, styled as pills. */
export function ChipGroup({
  name,
  options,
  value,
  onToggle,
  onBlur,
  disabled,
}: {
  name: string;
  options: string[];
  value: string[];
  onToggle: (v: string) => void;
  onBlur?: () => void;
  disabled?: boolean;
}) {
  return (
    <div className={f.chips}>
      {options.map((o) => {
        const on = value.includes(o);
        return (
          <label key={o} className={`${f.chip} ${on ? f.chipOn : ""}`}>
            <input
              type="checkbox"
              name={name}
              value={o}
              checked={on}
              onChange={() => onToggle(o)}
              onBlur={onBlur}
              disabled={disabled}
              className={f.chipInput}
            />
            <span className={f.chipCheck} aria-hidden="true">
              <Glyph k={on ? "check" : "plus"} />
            </span>
            {o}
          </label>
        );
      })}
    </div>
  );
}

/** Consent checkbox with the privacy-policy link. */
export function Consent({
  checked,
  onChange,
  error,
  disabled,
  before,
  link,
  href,
  after,
}: {
  checked: boolean;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  disabled?: boolean;
  before: string;
  link: string;
  href: string;
  after: string;
}) {
  const i = ids("consent");
  return (
    <div className={`${f.field} ${error ? f.hasError : ""}`}>
      <label className={f.consent}>
        <input
          id={i.input}
          type="checkbox"
          name="consent"
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className={f.boxInput}
          aria-invalid={error ? true : undefined}
          aria-required
          aria-describedby={error ? i.error : undefined}
        />
        <span className={f.box} aria-hidden="true">
          <Glyph k="check" />
        </span>
        <span>
          {before}
          <a href={href} className={f.inlineLink} target="_blank" rel="noopener">
            {link}
          </a>
          {after}
          <span className={f.req} aria-hidden="true">
            *
          </span>
        </span>
      </label>
      <span id={i.error} className={f.error} hidden={!error}>
        <Glyph k="alert" />
        {error}
      </span>
    </div>
  );
}
