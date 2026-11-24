// Lead forms → HubSpot. The browser posts { kind, values, context, pageUri, pageName };
// we validate with the same rules the form uses, map to HubSpot properties and forward to
// the form's submit endpoint. Errors back to the client are codes only, never HubSpot text.

import { cookies } from "next/headers";
import { validateAll, type FormKind, type FormValues } from "@/lib/forms/validation";
import { toPayload } from "@/lib/forms/submit";
import { HUBSPOT_FIELDS as H, HUBSPOT_FORMS, hubspotSubmitUrl } from "@/lib/forms/hubspot";
import { PARTNER_TYPES } from "@/lib/content/partners";

export const maxDuration = 15;

const MAX_BODY_BYTES = 16_000;
const UPSTREAM_TIMEOUT_MS = 10_000;
const KINDS: FormKind[] = ["contact", "demo", "partner"];

const json = (code: string, status: number) => Response.json({ code }, { status });

/** Same-origin only: browsers always send Origin on a POST fetch. */
function sameOrigin(req: Request): boolean {
  const origin = req.headers.get("origin");
  if (!origin) return false;
  try {
    const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

const str = (v: unknown, max = 2000) => (typeof v === "string" ? v.slice(0, max) : "");

/** Rebuilds FormValues from untrusted JSON: only known keys, strings only. */
function readValues(raw: unknown): FormValues {
  const r = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  return {
    name: str(r.name, 200),
    email: str(r.email, 300),
    company: str(r.company, 200),
    jobTitle: str(r.jobTitle, 200),
    phoneCountry: str(r.phoneCountry, 4),
    phone: str(r.phone, 40),
    topic: str(r.topic, 40),
    partnerType: str(r.partnerType, 40),
    message: str(r.message, 4000),
    consent: r.consent === true,
    website: str(r.website, 200),
  };
}

export async function POST(req: Request) {
  if (!sameOrigin(req)) return json("forbidden", 403);
  const text = await req.text();
  if (text.length > MAX_BODY_BYTES) return json("too_large", 413);

  let body: Record<string, unknown>;
  try {
    body = JSON.parse(text);
  } catch {
    return json("bad_request", 400);
  }

  const kind = body.kind as FormKind;
  if (!KINDS.includes(kind)) return json("bad_request", 400);
  const values = readValues(body.values);

  // Honeypot: report success, send nothing.
  if (values.website) return Response.json({ ok: true });

  if (Object.keys(validateAll(values, kind)).length) return json("invalid", 422);
  if (kind === "partner" && !PARTNER_TYPES.some((o) => o.value === values.partnerType)) return json("invalid", 422);

  const p = toPayload(values);

  // Demo: where the visitor came from (?src=pricing&plan=growth) goes in front of the message.
  let message = p.message ?? "";
  if (kind === "demo") {
    const ctx = (body.context && typeof body.context === "object" ? body.context : {}) as Record<string, unknown>;
    const parts = [
      str(ctx.src, 40) && `From: ${str(ctx.src, 40)}`,
      str(ctx.plan, 40) && `Plan: ${str(ctx.plan, 40)}`,
      str(ctx.rev, 20) && `Revenue: $${Number(str(ctx.rev, 20)).toLocaleString("en-US")}`,
    ].filter(Boolean);
    if (parts.length) message = `[${parts.join(" · ")}]${message ? `\n\n${message}` : ""}`;
  }

  const fields: { name: string; value: string }[] = [
    { name: H.firstName, value: p.firstName },
    { name: H.lastName, value: p.lastName ?? "" },
    { name: H.email, value: p.email },
    { name: H.company, value: p.company },
  ];
  if (kind !== "partner" && p.jobTitle) fields.push({ name: H.jobTitle, value: p.jobTitle });
  if (p.phone) fields.push({ name: H.phone, value: p.phone });
  if (message) fields.push({ name: H.message, value: message });
  if (kind === "partner") fields.push({ name: H.partnerType, value: values.partnerType });

  const hutk = (await cookies()).get("hubspotutk")?.value;
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const context: Record<string, string> = {};
  if (hutk) context.hutk = hutk;
  if (ip) context.ipAddress = ip;
  const pageUri = str(body.pageUri, 500);
  const pageName = str(body.pageName, 200);
  if (pageUri) context.pageUri = pageUri;
  if (pageName) context.pageName = pageName;

  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), UPSTREAM_TIMEOUT_MS);
  try {
    const res = await fetch(hubspotSubmitUrl(HUBSPOT_FORMS[kind]), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fields, context }),
      signal: ctrl.signal,
    });
    if (!res.ok) {
      console.error("[forms] HubSpot rejected", kind, res.status, await res.text().catch(() => ""));
      return json("upstream", 502);
    }
    return Response.json({ ok: true });
  } catch (err) {
    console.error("[forms] HubSpot request failed", kind, err);
    return json("upstream", 502);
  } finally {
    clearTimeout(timer);
  }
}
