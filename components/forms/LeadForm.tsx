"use client";

import { useEffect, useLayoutEffect, useRef, useState, type FormEvent } from "react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/motion";
import { Glyph } from "@/components/platform/mock/kit";
import { MESSAGE_MAX, TOPICS, contactPage, demoPage, fieldCopy as C, formCopy } from "@/lib/content/contact";
import { FIELDS, emptyValues, validateAll, validateField, type Errors, type FieldName, type FormKind, type FormValues } from "@/lib/forms/validation";
import { submitContact, submitDemo, submitPartner, type DemoContext } from "@/lib/forms/submit";
import { PARTNER_TYPES, PARTNER_TYPE_EVENT, partnerFieldCopy as P, partnerPage } from "@/lib/content/partners";
import { Consent, Counter, Field, PhoneInput, SelectInput, TextArea, TextInput, ids } from "./fields";
import f from "./forms.module.css";

/**
 * The contact / demo / partner form (DESIGN.md §G.12). Contact and demo ask for name,
 * email, company, job title, an optional phone and an optional message; partner asks
 * for its type and a required message instead of job title. Fields mirror the HubSpot
 * forms (lib/forms/hubspot.ts).
 *
 * Validation: a field is checked on blur, then re-checked on every change once
 * touched (no errors while someone is still typing into a fresh field). Submit checks
 * everything; on failure an error summary links to each field and focus moves to the
 * first one. On success the card cross-fades to a thank-you panel. The backend call is
 * isolated in lib/forms/submit.ts.
 */

type Status = "idle" | "sending" | "done" | "error";

/** First word of the Name field, for the thank-you line ("Thanks, Jordan."). */
const firstWord = (name: string) => name.trim().split(/\s+/)[0] ?? "";

const LABELS: Record<FieldName, string> = {
  name: C.name.label,
  email: C.email.label,
  company: C.company.label,
  jobTitle: C.jobTitle.label,
  phone: C.phone.label,
  partnerType: P.partnerType.label,
  message: C.message.label,
  consent: "Privacy policy",
};

export default function LeadForm({ kind }: { kind: FormKind }) {
  const page = kind === "contact" ? contactPage : kind === "partner" ? partnerPage : demoPage;
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

  // Contact topic comes from the URL (?topic=partnerships). It isn't a field; it rides
  // along in the payload so the right person picks it up. Read on mount only, so the
  // page stays static.
  useEffect(() => {
    if (kind !== "contact") return;
    const t = new URLSearchParams(window.location.search).get("topic");
    if (!t || !TOPICS.some((o) => o.value === t)) return;
    // after hydration (the server renders no topic)
    const raf = requestAnimationFrame(() => setValues((v) => ({ ...v, topic: t })));
    return () => cancelAnimationFrame(raf);
  }, [kind]);

  // Demo: context passed from the calculator or pricing (?src=calculator&rev=10000000&plan=starter,
  // brief §1.3). No revenue field any more; src/plan/rev ride along in the payload.
  const demoContext = useRef<DemoContext>({});
  useEffect(() => {
    if (kind !== "demo") return;
    const q = new URLSearchParams(window.location.search);
    demoContext.current = { src: q.get("src") ?? undefined, plan: q.get("plan") ?? undefined, rev: q.get("rev") ?? undefined };
  }, [kind]);

  // Partner type: preset from the URL (?type=technology#apply) on mount, and from the
  // partner-type CTAs on the same page (they dispatch PARTNER_TYPE_EVENT, no reload).
  useEffect(() => {
    if (kind !== "partner") return;
    const valid = (t: string | null): t is string => !!t && PARTNER_TYPES.some((o) => o.value === t);
    const preset = (t: string) => {
      setValues((v) => ({ ...v, partnerType: t }));
      setErrors((prev) => {
        const out = { ...prev };
        delete out.partnerType;
        return out;
      });
    };
    const t = new URLSearchParams(window.location.search).get("type");
    const raf = valid(t) ? requestAnimationFrame(() => preset(t)) : 0;
    const onPreset = (ev: Event) => {
      const v = (ev as CustomEvent<string>).detail;
      if (valid(v)) preset(v);
    };
    window.addEventListener(PARTNER_TYPE_EVENT, onPreset);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener(PARTNER_TYPE_EVENT, onPreset);
    };
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
  const INSTANT: FieldName[] = ["partnerType", "consent"];
  const set = <K extends keyof FormValues>(key: K, val: FormValues[K]) => {
    const next = { ...values, [key]: val };
    setValues(next);
    if (key === "website") return;
    const fld = key as FieldName;
    setErrors((prev) => {
      if (!(touched[fld] || prev[fld] || INSTANT.includes(fld))) return prev;
      const out = { ...prev };
      const msg = validateField(fld, next, kind);
      if (msg) out[fld] = msg;
      else delete out[fld];
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
      setDoneName(firstWord(values.name));
      setStatus("done");
      return;
    }
    setStatus("sending");
    const res = await (kind === "contact" ? submitContact(values) : kind === "partner" ? submitPartner(values) : submitDemo(values, demoContext.current));
    if (res.ok) {
      setDoneName(firstWord(values.name));
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
  const partner = kind === "partner";

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

      <Field name="name" label={C.name.label} required error={e.name}>
        <TextInput
          name="name"
          required
          error={e.name}
          autoComplete="name"
          placeholder={C.name.placeholder}
          value={values.name}
          onChange={(ev) => set("name", ev.target.value)}
          onBlur={() => blur("name")}
          readOnly={sending}
          maxLength={110}
        />
      </Field>

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

      {/* Partner form: company and type each get a full row, so the type's long options read in full. */}
      <div className={`${f.row} ${partner ? f.rowSingle : ""}`}>
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
        {partner ? (
          <Field name="partnerType" label={P.partnerType.label} required error={e.partnerType}>
            <SelectInput
              name="partnerType"
              required
              error={e.partnerType}
              placeholder={P.partnerType.placeholder}
              options={PARTNER_TYPES}
              value={values.partnerType}
              onChange={(v) => set("partnerType", v)}
              onLeave={() => blur("partnerType")}
              disabled={sending}
            />
          </Field>
        ) : (
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
        )}
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

      <Field
        name="message"
        label={partner ? P.message.label : C.message.label}
        required={partner}
        error={e.message}
        counter={<Counter length={values.message.trim().length} max={MESSAGE_MAX} />}
      >
        <TextArea
          name="message"
          rows={5}
          error={e.message}
          placeholder={partner ? P.message.placeholder : C.message.placeholder}
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
