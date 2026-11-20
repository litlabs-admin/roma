// Field rules for the contact, demo and partner forms (DESIGN.md §G.12, §G.16). Pure functions: the
// same rules can run on the server when the backend is connected.

import { MESSAGE_MAX, MESSAGE_MIN } from "@/lib/content/contact";
import { DEFAULT_COUNTRY, countryByIso } from "@/lib/content/countries";

export type FormValues = {
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  jobTitle: string;
  phoneCountry: string; // ISO code for the dial-code picker
  phone: string; // national number, without the dial code
  revenue: string;
  channels: string[];
  otherChannels: string;
  topic: string;
  volume: string;
  partnerType: string; // /partners only
  message: string;
  consent: boolean;
  website: string; // honeypot
};

export type FieldName = Exclude<keyof FormValues, "website" | "phoneCountry">;
export type Errors = Partial<Record<FieldName, string>>;
export type FormKind = "contact" | "demo" | "partner";

export const emptyValues = (topic = ""): FormValues => ({
  firstName: "",
  lastName: "",
  email: "",
  company: "",
  jobTitle: "",
  phoneCountry: DEFAULT_COUNTRY,
  phone: "",
  revenue: "",
  channels: [],
  otherChannels: "",
  topic,
  volume: "",
  partnerType: "",
  message: "",
  consent: false,
  website: "",
});

const NAME = /^[\p{L}\p{M}][\p{L}\p{M} .'’-]*$/u;
// Practical email check: one @, no spaces, a dot in the domain, TLD of 2+ letters.
const EMAIL = /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)*\.[A-Za-z]{2,}$/;
const PHONE_CHARS = /^[\d\s().-]+$/;

function name(v: string, which: "first" | "last") {
  const t = v.trim();
  if (!t) return `Please enter your ${which} name.`;
  if (t.length > 50) return "Names can be up to 50 characters.";
  if (!NAME.test(t)) return "Names can only use letters, spaces, hyphens and apostrophes.";
  return "";
}

function email(v: string) {
  const t = v.trim();
  if (!t) return "Please enter your email.";
  if (t.length > 254 || !EMAIL.test(t)) return "Enter an email like name@company.com.";
  return "";
}

function text(v: string, empty: string, min: number, max: number, label: string) {
  const t = v.trim();
  if (!t) return empty;
  if (t.length < min) return `${label} needs at least ${min} characters.`;
  if (t.length > max) return `${label} can be up to ${max} characters.`;
  return "";
}

/** National number after the chosen dial code. US/Canada: exactly 10 digits; elsewhere
 *  4–14 digits and at most 15 including the country code (E.164). */
function phone(v: string, iso: string) {
  const t = v.trim();
  if (!t) return "";
  const c = countryByIso(iso);
  const digits = t.replace(/\D/g, "");
  if (!PHONE_CHARS.test(t)) return "Use digits only (spaces, dashes and brackets are fine).";
  if (c.dial === "+1") {
    if (digits.length !== 10) return `Enter a 10-digit number for ${c.name}, like 555 123 4567.`;
    return "";
  }
  const total = c.dial.replace(/\D/g, "").length + digits.length;
  if (digits.length < 4 || digits.length > 14 || total > 15) return `Enter a valid phone number for ${c.name}.`;
  return "";
}

function message(v: string, required: boolean) {
  const t = v.trim();
  if (!t) return required ? `Please add a short message (at least ${MESSAGE_MIN} characters).` : "";
  if (t.length < MESSAGE_MIN) return `Please add a little more detail (at least ${MESSAGE_MIN} characters).`;
  if (t.length > MESSAGE_MAX) return `Please keep your message under ${MESSAGE_MAX.toLocaleString("en-US")} characters.`;
  return "";
}

/** Error for one field ("" when valid). */
export function validateField(field: FieldName, v: FormValues, kind: FormKind): string {
  switch (field) {
    case "firstName":
      return name(v.firstName, "first");
    case "lastName":
      return name(v.lastName, "last");
    case "email":
      return email(v.email);
    case "company":
      return text(v.company, "Please enter your company name.", 2, 100, "Company name");
    case "jobTitle":
      return text(v.jobTitle, "Please enter your job title.", 2, 80, "Job title");
    case "phone":
      return phone(v.phone, v.phoneCountry);
    case "revenue":
      return v.revenue ? "" : "Please choose your annual revenue.";
    case "channels":
      return kind === "demo" && v.channels.length === 0 ? "Choose at least one retailer you sell through." : "";
    case "otherChannels":
      return v.channels.includes("Other") ? text(v.otherChannels, "Tell us which other retailers you sell through.", 2, 100, "Other retailers") : "";
    case "topic":
      return kind === "contact" && !v.topic ? "Please choose a topic." : "";
    case "volume":
      return "";
    case "partnerType":
      return kind === "partner" && !v.partnerType ? "Please choose a type of partnership." : "";
    case "message":
      return message(v.message, kind === "contact");
    case "consent":
      return v.consent ? "" : "Please accept the privacy policy to continue.";
  }
}

/** Fields each form shows, in on-screen order (drives focus order of errors). */
export const FIELDS: Record<FormKind, FieldName[]> = {
  contact: ["firstName", "lastName", "email", "company", "jobTitle", "phone", "revenue", "topic", "channels", "otherChannels", "message", "consent"],
  demo: ["firstName", "lastName", "email", "company", "jobTitle", "phone", "revenue", "volume", "channels", "otherChannels", "message", "consent"],
  partner: ["firstName", "lastName", "email", "company", "partnerType", "phone", "message", "consent"],
};

export function validateAll(v: FormValues, kind: FormKind): Errors {
  const out: Errors = {};
  for (const f of FIELDS[kind]) {
    const e = validateField(f, v, kind);
    if (e) out[f] = e;
  }
  return out;
}
