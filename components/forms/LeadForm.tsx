"use client";

import { useEffect, useLayoutEffect, useRef, useState, type FormEvent } from "react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/motion";
import { Glyph } from "@/components/platform/mock/kit";
import {
  CHANNELS,
  MESSAGE_MAX,
  REVENUE,
  TOPICS,
  VOLUME,
  contactPage,
  demoPage,
  fieldCopy as C,
  formCopy,
} from "@/lib/content/contact";
import { FIELDS, emptyValues, validateAll, validateField, type Errors, type FieldName, type FormKind, type FormValues } from "@/lib/forms/validation";
import { submitContact, submitDemo } from "@/lib/forms/submit";
import { ChipGroup, Consent, Counter, Field, PhoneInput, SelectInput, TextArea, TextInput, ids } from "./fields";
import f from "./forms.module.css";

/**
 * The contact / demo form (DESIGN.md §G.12). One component, two field sets.
 *
 * Validation: a field is checked on blur, then re-checked on every change once
 * touched (no errors while someone is still typing into a fresh field). Submit checks
 * everything; on failure an error summary links to each field and focus moves to the
 * first one. On success the card cross-fades to a thank-you panel. The backend call is
 * isolated in lib/forms/submit.ts.
 */

type Status = "idle" | "sending" | "done" | "error";

const LABELS: Record<FieldName, string> = {
  firstName: C.firstName.label,
  lastName: C.lastName.label,
  email: C.email.label,
  company: C.company.label,
  jobTitle: C.jobTitle.label,
  phone: C.phone.label,
  revenue: C.revenue.label,
  channels: C.channels.label,
  otherChannels: C.otherChannels.label,
  topic: C.topic.label,
  volume: C.volume.label,
  message: C.message.label,
  consent: "Privacy policy",
};

export default function LeadForm({ kind }: { kind: FormKind }) {
  const page = kind === "contact" ? contactPage : demoPage;
  const [values, setValues] = useState<FormValues>(() => emptyValues(kind === "demo" ? "demo" : ""));
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Partial<Record<FieldName, boolean>>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [summary, setSummary] = useState<FieldName[]>([]);
  const [submitError, setSubmitError] = useState("");
  const [doneName, setDoneName] = useState("");
  const summaryRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const sending = status === "sending";

  // Contact topic can be preset from the URL (?topic=pricing). Read on mount only, so
  // the page stays static.
  useEffect(() => {
    if (kind !== "contact") return;
    const t = new URLSearchParams(window.location.search).get("topic");
    if (!t || !TOPICS.some((o) => o.value === t)) return;
    // after hydration (the server renders no topic)
    const raf = requestAnimationFrame(() => setValues((v) => ({ ...v, topic: t })));
    return () => cancelAnimationFrame(raf);
  }, [kind]);

  // Success panel entrance (cross-fade + check pop).
  useLayoutEffect(() => {
    if (status !== "done" || !panelRef.current || prefersReducedMotion()) return;
    const q = gsap.utils.selector(panelRef.current);
    const ctx = gsap.context(() => {
      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .from(panelRef.current, { autoAlpha: 0, y: 12, duration: 0.3 })
        .from(q("[data-done='check']"), { scale: 0, duration: 0.45, ease: "back.out(2)" }, 0.1)
        .from(q("[data-done='text']"), { autoAlpha: 0, y: 8, duration: 0.4, stagger: 0.08 }, 0.2);
    }, panelRef);
    return () => ctx.revert();
  }, [status]);

  // Choice controls (selects, chips, consent) validate as soon as they change; text
  // fields only once touched (blurred) or already showing an error.
  const INSTANT: FieldName[] = ["revenue", "topic", "volume", "channels", "consent"];
  const set = <K extends keyof FormValues>(key: K, val: FormValues[K]) => {
    const next = { ...values, [key]: val };
    setValues(next);
    if (key === "website") return;
    const recheck: FieldName[] = key === "channels" ? ["channels", "otherChannels"] : [key as FieldName];
    setErrors((prev) => {
      const out = { ...prev };
      for (const fld of recheck) {
        if (touched[fld] || prev[fld] || INSTANT.includes(fld)) {
          const msg = validateField(fld, next, kind);
          if (msg) out[fld] = msg;
          else delete out[fld];
        }
      }
      return out;
    });
  };

  // Errors from a blur wait for the pointer to come back up: otherwise a message
  // appearing mid-click shifts the layout and the click lands on the wrong control.
  const pointerDown = useRef(false);
  const pending = useRef<(() => void)[]>([]);
  useEffect(() => {
    const down = () => (pointerDown.current = true);
    const up = () => {
      pointerDown.current = false;
      const run = pending.current;
      pending.current = [];
      // after the click event has been dispatched
      if (run.length) window.setTimeout(() => run.forEach((fn) => fn()), 0);
    };
    document.addEventListener("pointerdown", down, true);
    document.addEventListener("pointerup", up, true);
    document.addEventListener("pointercancel", up, true);
    return () => {
      document.removeEventListener("pointerdown", down, true);
      document.removeEventListener("pointerup", up, true);
      document.removeEventListener("pointercancel", up, true);
    };
  }, []);

  const blur = (fld: FieldName) => {
    const apply = () => {
      setTouched((t) => ({ ...t, [fld]: true }));
      setValues((current) => {
        const msg = validateField(fld, current, kind);
        setErrors((e) => {
          const n = { ...e };
          if (msg) n[fld] = msg;
          else delete n[fld];
          return n;
        });
        return current;
      });
    };
    if (pointerDown.current) pending.current.push(apply);
    else apply();
  };

  // Keep the summary in step with fixes.
  const liveSummary = summary.filter((fld) => errors[fld]);

  const focusField = (fld: FieldName) => {
    const el = document.getElementById(ids(fld).input);
    if (!el) return;
    // Scroll so the field's label clears the fixed nav, then focus without a jump.
    const nav = document.querySelector("header")?.getBoundingClientRect().height ?? 80;
    const y = el.getBoundingClientRect().top + window.scrollY - nav - 56;
    const lenis = (window as unknown as { __lenis?: { scrollTo: (y: number, o?: object) => void } }).__lenis;
    if (lenis) lenis.scrollTo(y, { duration: 0.8 });
    else window.scrollTo({ top: y, behavior: prefersReducedMotion() ? "auto" : "smooth" });
    window.setTimeout(() => el.focus({ preventScroll: true }), prefersReducedMotion() ? 0 : 500);
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (sending) return;
    const all = validateAll(values, kind);
    const bad = FIELDS[kind].filter((fld) => all[fld]);
    setErrors(all);
    setTouched(Object.fromEntries(FIELDS[kind].map((fld) => [fld, true])));
    setSubmitError("");
    if (bad.length) {
      setSummary(bad);
      requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }
    setSummary([]);
    if (values.website) {
      // Honeypot filled: pretend it worked, send nothing.
      setDoneName(values.firstName.trim());
      setStatus("done");
      return;
    }
    setStatus("sending");
    const res = await (kind === "contact" ? submitContact(values) : submitDemo(values));
    if (res.ok) {
      setDoneName(values.firstName.trim());
      setStatus("done");
    } else {
      setStatus("error");
      setSubmitError(res.message);
    }
  };

  const reset = () => {
    setValues(emptyValues(kind === "demo" ? "demo" : ""));
    setErrors({});
    setTouched({});
    setSummary([]);
    setStatus("idle");
  };

  if (status === "done") {
    return (
      <div ref={panelRef} className={f.done} role="status" aria-live="polite">
        <span className={f.doneCheck} data-done="check">
          <Glyph k="check" />
        </span>
        <h2 className={`${f.doneTitle} type-h4`} data-done="text">
          {page.success.title(doneName)}
        </h2>
        <p className={f.doneBody} data-done="text">
          {page.success.body}
        </p>
        <div className={f.doneActions} data-done="text">
          <a href={formCopy.home.href} className={f.btnGhost}>
            {formCopy.home.label}
          </a>
          <button type="button" className={f.textBtn} onClick={reset}>
            {page.success.again}
          </button>
        </div>
      </div>
    );
  }

  const e = errors;
  const otherShown = values.channels.includes("Other");
  const message = kind === "contact" ? C.message : C.demoMessage;
  const messageHint = kind === "contact" ? undefined : C.demoMessage.hint;

  return (
    <form className={f.form} noValidate onSubmit={onSubmit} aria-busy={sending || undefined}>
      <p className={f.legend}>
        <span className={f.req} aria-hidden="true">
          *
        </span>{" "}
        {C.required}
      </p>

      {liveSummary.length > 0 && (
        <div ref={summaryRef} className={f.summary} role="alert" tabIndex={-1}>
          <p className={f.summaryTitle}>
            <Glyph k="alert" />
            {formCopy.summary(liveSummary.length)}
          </p>
          <ul>
            {liveSummary.map((fld) => (
              <li key={fld}>
                <a
                  href={`#${ids(fld).input}`}
                  onClick={(ev) => {
                    ev.preventDefault();
                    focusField(fld);
                  }}
                >
                  {LABELS[fld]}: {e[fld]}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className={f.row}>
        <Field name="firstName" label={C.firstName.label} required error={e.firstName}>
          <TextInput
            name="firstName"
            required
            error={e.firstName}
            autoComplete="given-name"
            placeholder={C.firstName.placeholder}
            value={values.firstName}
            onChange={(ev) => set("firstName", ev.target.value)}
            onBlur={() => blur("firstName")}
            readOnly={sending}
            maxLength={60}
          />
        </Field>
        <Field name="lastName" label={C.lastName.label} required error={e.lastName}>
          <TextInput
            name="lastName"
            required
            error={e.lastName}
            autoComplete="family-name"
            placeholder={C.lastName.placeholder}
            value={values.lastName}
            onChange={(ev) => set("lastName", ev.target.value)}
            onBlur={() => blur("lastName")}
            readOnly={sending}
            maxLength={60}
          />
        </Field>
      </div>

      <Field name="email" label={C.email.label} required error={e.email}>
        <TextInput
          name="email"
          type="email"
          inputMode="email"
          required
          error={e.email}
          autoComplete="email"
          spellCheck={false}
          placeholder={C.email.placeholder}
          value={values.email}
          onChange={(ev) => set("email", ev.target.value)}
          onBlur={() => blur("email")}
          readOnly={sending}
          maxLength={254}
        />
      </Field>

      <div className={f.row}>
        <Field name="company" label={C.company.label} required error={e.company}>
          <TextInput
            name="company"
            required
            error={e.company}
            autoComplete="organization"
            placeholder={C.company.placeholder}
            value={values.company}
            onChange={(ev) => set("company", ev.target.value)}
            onBlur={() => blur("company")}
            readOnly={sending}
            maxLength={110}
          />
        </Field>
        <Field name="jobTitle" label={C.jobTitle.label} required error={e.jobTitle}>
          <TextInput
            name="jobTitle"
            required
            error={e.jobTitle}
            autoComplete="organization-title"
            placeholder={C.jobTitle.placeholder}
            value={values.jobTitle}
            onChange={(ev) => set("jobTitle", ev.target.value)}
            onBlur={() => blur("jobTitle")}
            readOnly={sending}
            maxLength={90}
          />
        </Field>
      </div>


      <Field name="phone" label={C.phone.label} error={e.phone}>
        <PhoneInput
          error={e.phone}
          country={values.phoneCountry}
          onCountry={(iso) => {
            const next = { ...values, phoneCountry: iso };
            setValues(next);
            if (values.phone.trim()) {
              const msg = validateField("phone", next, kind);
              setErrors((prev) => {
                const out = { ...prev };
                if (msg) out.phone = msg;
                else delete out.phone;
                return out;
              });
            }
          }}
          countryLabel={C.phone.country}
          searchLabel={C.phone.search}
          placeholder={C.phone.placeholder}
          value={values.phone}
          onChange={(ev) => set("phone", ev.target.value)}
          onBlur={() => blur("phone")}
          readOnly={sending}
          disabled={sending}
          maxLength={20}
        />
      </Field>

      <div className={f.row}>
        <Field name="revenue" label={C.revenue.label} required error={e.revenue}>
          <SelectInput
            name="revenue"
            required
            error={e.revenue}
            placeholder={C.revenue.placeholder}
            options={REVENUE}
            value={values.revenue}
            onChange={(v) => set("revenue", v)}
            onLeave={() => blur("revenue")}
            disabled={sending}
          />
        </Field>
        {kind === "contact" ? (
          <Field name="topic" label={C.topic.label} required error={e.topic}>
            <SelectInput
              name="topic"
              required
              error={e.topic}
              placeholder={C.topic.placeholder}
              options={TOPICS}
              value={values.topic}
              onChange={(v) => set("topic", v)}
              onLeave={() => blur("topic")}
              disabled={sending}
            />
          </Field>
        ) : (
          <Field name="volume" label={C.volume.label} hint={C.volume.hint} error={e.volume}>
            <SelectInput
              name="volume"
              hint={C.volume.hint}
              placeholder={C.volume.placeholder}
              options={VOLUME}
              value={values.volume}
              onChange={(v) => set("volume", v)}
              disabled={sending}
            />
          </Field>
        )}
      </div>

      <Field name="channels" label={C.channels.label} required={kind === "demo"} hint={C.channels.hint} error={e.channels} group>
        <ChipGroup
          name="channels"
          options={CHANNELS}
          value={values.channels}
          disabled={sending}
          onToggle={(o) => {
            const next = values.channels.includes(o) ? values.channels.filter((c) => c !== o) : [...values.channels, o];
            set("channels", next);
          }}
        />
      </Field>

      {otherShown && (
        <Field name="otherChannels" label={C.otherChannels.label} required error={e.otherChannels} className={f.reveal}>
          <TextInput
            name="otherChannels"
            required
            error={e.otherChannels}
            placeholder={C.otherChannels.placeholder}
            value={values.otherChannels}
            onChange={(ev) => set("otherChannels", ev.target.value)}
            onBlur={() => blur("otherChannels")}
            readOnly={sending}
            maxLength={110}
          />
        </Field>
      )}


      <Field
        name="message"
        label={message.label}
        required={kind === "contact"}
        hint={messageHint}
        error={e.message}
        counter={<Counter length={values.message.trim().length} max={MESSAGE_MAX} />}
      >
        <TextArea
          name="message"
          rows={5}
          required={kind === "contact"}
          hint={messageHint}
          error={e.message}
          placeholder={message.placeholder}
          value={values.message}
          onChange={(ev) => set("message", ev.target.value)}
          onBlur={() => blur("message")}
          readOnly={sending}
        />
      </Field>

      {/* Honeypot: hidden from people and assistive tech; bots fill it. */}
      <div className={f.hp} aria-hidden="true">
        <label htmlFor="f-website">Website</label>
        <input id="f-website" name="website" tabIndex={-1} autoComplete="off" value={values.website} onChange={(ev) => set("website", ev.target.value)} />
      </div>

      <Consent
        checked={values.consent}
        disabled={sending}
        error={e.consent}
        onChange={(ev) => {
          set("consent", ev.target.checked);
        }}
        before={C.consent.before}
        link={C.consent.link}
        href={C.consent.href}
        after={C.consent.after}
      />

      {submitError && (
        <p className={f.submitError} role="alert">
          <Glyph k="alert" />
          {submitError}
        </p>
      )}

      <button type="submit" className={f.submit} disabled={sending} aria-disabled={sending || undefined}>
        <span className={f.submitFill} aria-hidden="true" />
        <span className={f.submitLabel}>
          {sending ? (
            <>
              <span className={f.spinner} aria-hidden="true" />
              {formCopy.sending}
            </>
          ) : (
            <>{page.submit} →</>
          )}
        </span>
      </button>
    </form>
  );
}
