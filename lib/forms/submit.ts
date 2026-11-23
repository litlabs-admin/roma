// The only backend touch-point for the contact and demo forms (DESIGN.md §G.12).
// Until the backend exists these simulate a successful request.

import type { FormValues } from "./validation";
import { countryByIso } from "@/lib/content/countries";
import type { CalculatorPayload } from "@/lib/calculator/payload";

export type SubmitResult = { ok: true } | { ok: false; message: string };

const SIMULATED_MS = 900;

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

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

// TODO(backend): POST toPayload(values) to the contact endpoint; map failures to { ok: false, message }.
export async function submitContact(values: FormValues): Promise<SubmitResult> {
  void toPayload(values);
  await wait(SIMULATED_MS);
  return { ok: true };
}

/** Where a demo request came from, from the URL (/book-a-demo?src=calculator&plan=starter). */
export type DemoContext = { src?: string; plan?: string; rev?: string };

// TODO(backend): POST { ...toPayload(values), ...context } to the demo endpoint (or CRM, e.g. HubSpot).
export async function submitDemo(values: FormValues, context: DemoContext = {}): Promise<SubmitResult> {
  void { ...toPayload(values), ...context };
  await wait(SIMULATED_MS);
  return { ok: true };
}

// TODO(backend): POST toPayload(values) to the partner-application endpoint (/partners, §G.16).
export async function submitPartner(values: FormValues): Promise<SubmitResult> {
  void toPayload(values);
  await wait(SIMULATED_MS);
  return { ok: true };
}

// TODO(backend): submit to the HubSpot "ROI calculator" form (brief §2.7): `payload.fields`
// as the form fields, `payload.context` as the HubSpot context (hutk, pageUri, pageName).
export async function submitCalculator(payload: CalculatorPayload): Promise<SubmitResult> {
  void payload;
  await wait(SIMULATED_MS);
  return { ok: true };
}
