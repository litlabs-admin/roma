// The only backend touch-point for the contact, demo and partner forms (DESIGN.md §G.12).
// Posts to /api/forms, which validates and forwards to HubSpot (lib/forms/hubspot.ts).

import type { FormKind, FormValues } from "./validation";
import { countryByIso } from "@/lib/content/countries";

export type SubmitResult = { ok: true } | { ok: false; message: string };

/** Splits the single Name field at the first space, for CRMs that want first/last
 *  (HubSpot's firstname/lastname). "Jordan Alvarez" → ["Jordan", "Alvarez"];
 *  "Mary Ann de la Cruz" → ["Mary", "Ann de la Cruz"]; "Cher" → ["Cher", ""]. */
export function splitName(full: string): [string, string] {
  const t = full.trim().replace(/\s+/g, " ");
  const i = t.indexOf(" ");
  return i === -1 ? [t, ""] : [t.slice(0, i), t.slice(i + 1)];
}

/** Trimmed payload without the honeypot. `name` is exactly what was typed; first/last
 *  are derived from it so either mapping works in the receiving system. */
export function toPayload(v: FormValues) {
  const [firstName, lastName] = splitName(v.name);
  return {
    name: v.name.trim().replace(/\s+/g, " "),
    firstName,
    lastName: lastName || undefined,
    email: v.email.trim(),
    company: v.company.trim(),
    jobTitle: v.jobTitle.trim() || undefined,
    // E.164-style: "+1 5551234567" (dial code + national digits)
    phone: v.phone.trim() ? `${countryByIso(v.phoneCountry).dial} ${v.phone.replace(/\D/g, "")}` : undefined,
    topic: v.topic || undefined,
    partnerType: v.partnerType || undefined,
    message: v.message.trim() || undefined,
    consent: v.consent,
  };
}

const ERROR = "Something went wrong sending your details. Please try again, or email us directly.";

async function send(kind: FormKind, values: FormValues, context?: DemoContext): Promise<SubmitResult> {
  try {
    const res = await fetch("/api/forms", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ kind, values, context, pageUri: window.location.href, pageName: document.title }),
    });
    return res.ok ? { ok: true } : { ok: false, message: ERROR };
  } catch {
    return { ok: false, message: ERROR };
  }
}

export const submitContact = (values: FormValues) => send("contact", values);

/** Where a demo request came from, from the URL (/book-a-demo?src=calculator&plan=starter). */
export type DemoContext = { src?: string; plan?: string; rev?: string };

export const submitDemo = (values: FormValues, context: DemoContext = {}) => send("demo", values, context);

export const submitPartner = (values: FormValues) => send("partner", values);
