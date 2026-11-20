// The only backend touch-point for the contact and demo forms (DESIGN.md §G.12).
// Until the backend exists these simulate a successful request.

import type { FormValues } from "./validation";
import { countryByIso } from "@/lib/content/countries";

export type SubmitResult = { ok: true } | { ok: false; message: string };

const SIMULATED_MS = 900;

/** Trimmed payload without the honeypot. */
export function toPayload(v: FormValues) {
  return {
    firstName: v.firstName.trim(),
    lastName: v.lastName.trim(),
    email: v.email.trim(),
    company: v.company.trim(),
    jobTitle: v.jobTitle.trim(),
    // E.164-style: "+1 5551234567" (dial code + national digits)
    phone: v.phone.trim() ? `${countryByIso(v.phoneCountry).dial} ${v.phone.replace(/\D/g, "")}` : undefined,
    revenue: v.revenue,
    channels: v.channels,
    otherChannels: v.channels.includes("Other") ? v.otherChannels.trim() : undefined,
    topic: v.topic || undefined,
    volume: v.volume || undefined,
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

// TODO(backend): POST toPayload(values) to the demo endpoint (or CRM, e.g. HubSpot).
export async function submitDemo(values: FormValues): Promise<SubmitResult> {
  void toPayload(values);
  await wait(SIMULATED_MS);
  return { ok: true };
}

// TODO(backend): POST toPayload(values) to the partner-application endpoint (/partners, §G.16).
export async function submitPartner(values: FormValues): Promise<SubmitResult> {
  void toPayload(values);
  await wait(SIMULATED_MS);
  return { ok: true };
}
