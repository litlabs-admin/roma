"use client";

import { useRef, useState, type FormEvent } from "react";
import { Glyph } from "@/components/platform/mock/kit";
import { Field, SelectInput, TextInput, ids } from "@/components/forms/fields";
import { FREE_EMAIL_DOMAINS, ROLES, calcCopy } from "@/lib/content/calculator";
import { checkCompany, checkEmail, checkFirstName, isFreeEmail } from "@/lib/forms/validation";
import type { SubmitResult } from "@/lib/forms/submit";
import type { GateValues } from "@/lib/calculator/payload";
import f from "@/components/forms/forms.module.css";
import s from "./calculator.module.css";

/**
 * The report gate (brief §2.6): work email, first name, company (required), role
 * (optional), plus the honeypot. Same validation UX as the lead forms (§G.12): fields
 * check on blur, then live once touched; submit checks all and focuses the first error.
 * Personal email domains get a soft hint but still submit (client, 20 Nov 2026).
 */

type Key = "email" | "firstName" | "company";
const CHECK: Record<Key, (v: string) => string> = { email: checkEmail, firstName: checkFirstName, company: checkCompany };
const ORDER: Key[] = ["email", "firstName", "company"];
const C = calcCopy.gate;

export default function GateForm({ onSubmit, idPrefix = "" }: { onSubmit: (v: GateValues) => Promise<SubmitResult>; idPrefix?: string }) {
  const [v, setV] = useState<GateValues>({ email: "", firstName: "", company: "", role: "", website: "" });
  const [errors, setErrors] = useState<Partial<Record<Key, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<Key, boolean>>>({});
  const [sending, setSending] = useState(false);
  const [failed, setFailed] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const name = (k: string) => `${idPrefix}${k}`;

  const set = (k: keyof GateValues, val: string) => {
    setV((p) => ({ ...p, [k]: val }));
    if (k in CHECK && (touched[k as Key] || errors[k as Key])) {
      const msg = CHECK[k as Key](val);
      setErrors((e) => ({ ...e, [k]: msg || undefined }));
    }
  };
  const blur = (k: Key) => {
    setTouched((t) => ({ ...t, [k]: true }));
    const msg = CHECK[k](v[k]);
    setErrors((e) => ({ ...e, [k]: msg || undefined }));
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (sending) return;
    const all: Partial<Record<Key, string>> = {};
    for (const k of ORDER) {
      const msg = CHECK[k](v[k]);
      if (msg) all[k] = msg;
    }
    setErrors(all);
    setTouched({ email: true, firstName: true, company: true });
    const first = ORDER.find((k) => all[k]);
    if (first) {
      document.getElementById(ids(name(first)).input)?.focus();
      return;
    }
    setSending(true);
    setFailed(false);
    const res = await onSubmit(v);
    setSending(false);
    if (!res.ok) setFailed(true);
  };

  const free = !errors.email && isFreeEmail(v.email, FREE_EMAIL_DOMAINS) ? C.freeEmail : undefined;

  return (
    <form ref={formRef} className={s.gateForm} noValidate onSubmit={submit} aria-busy={sending || undefined}>
      <Field name={name("email")} label={C.fields.email.label} required error={errors.email} hint={free}>
        <TextInput
          name={name("email")}
          type="email"
          inputMode="email"
          autoComplete="email"
          spellCheck={false}
          required
          error={errors.email}
          hint={free}
          placeholder={C.fields.email.placeholder}
          value={v.email}
          onChange={(e) => set("email", e.target.value)}
          onBlur={() => blur("email")}
          readOnly={sending}
          maxLength={254}
        />
      </Field>
      <div className={f.row}>
        <Field name={name("firstName")} label={C.fields.firstName.label} required error={errors.firstName}>
          <TextInput
            name={name("firstName")}
            autoComplete="given-name"
            required
            error={errors.firstName}
            placeholder={C.fields.firstName.placeholder}
            value={v.firstName}
            onChange={(e) => set("firstName", e.target.value)}
            onBlur={() => blur("firstName")}
            readOnly={sending}
            maxLength={60}
          />
        </Field>
        <Field name={name("company")} label={C.fields.company.label} required error={errors.company}>
          <TextInput
            name={name("company")}
            autoComplete="organization"
            required
            error={errors.company}
            placeholder={C.fields.company.placeholder}
            value={v.company}
            onChange={(e) => set("company", e.target.value)}
            onBlur={() => blur("company")}
            readOnly={sending}
            maxLength={110}
          />
        </Field>
      </div>
      <Field name={name("role")} label={C.fields.role.label}>
        <SelectInput name={name("role")} placeholder={C.fields.role.placeholder} options={ROLES} value={v.role} onChange={(r) => set("role", r)} disabled={sending} />
      </Field>

      {/* Honeypot: hidden from people and assistive tech; bots fill it. */}
      <div className={f.hp} aria-hidden="true">
        <label htmlFor={`${idPrefix}gate-website`}>Website</label>
        <input id={`${idPrefix}gate-website`} name="website" tabIndex={-1} autoComplete="off" value={v.website} onChange={(e) => set("website", e.target.value)} />
      </div>

      {failed && (
        <p className={f.submitError} role="alert">
          <Glyph k="alert" />
          {C.error}
        </p>
      )}

      <button type="submit" className={f.submit} disabled={sending} aria-disabled={sending || undefined}>
        <span className={f.submitFill} aria-hidden="true" />
        <span className={f.submitLabel}>
          {sending ? (
            <>
              <span className={f.spinner} aria-hidden="true" />
              {C.sending}
            </>
          ) : (
            C.submit
          )}
        </span>
      </button>
      <p className={s.gatePrivacy}>
        {C.privacy.before}
        <a href={C.privacy.href} className={f.inlineLink}>
          {C.privacy.link}
        </a>
        {C.privacy.after}
      </p>
    </form>
  );
}
