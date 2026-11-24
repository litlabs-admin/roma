// HubSpot forms the website submits to (server side, app/api/forms/route.ts).
// Portal and form IDs are public (they appear in any HubSpot embed code), so they live here
// rather than in env vars. Field names are HubSpot contact property internal names.
//
// HubSpot's submit API does NOT validate email format, required fields or dropdown values,
// so the route validates everything first (lib/forms/validation.ts).
// CAPTCHA must stay OFF on these forms in HubSpot, or API submissions are rejected.

import type { FormKind } from "./validation";

export const HUBSPOT_PORTAL_ID = "246128325";

export const HUBSPOT_FORMS: Record<FormKind, string> = {
  contact: "775b31ca-0aaf-4088-bbe2-2ff0ce4066a6",
  demo: "9e6976de-4397-4e2a-9e57-5ab1f6a527df",
  partner: "5c40b98b-e01b-4d2a-935d-def2dee8c323",
};

/** Website field → HubSpot property. */
export const HUBSPOT_FIELDS = {
  firstName: "firstname",
  lastName: "lastname",
  email: "email",
  company: "company",
  jobTitle: "jobtitle",
  phone: "phone",
  message: "message",
  partnerType: "partner_type",
} as const;

export const hubspotSubmitUrl = (formId: string) =>
  `https://api.hsforms.com/submissions/v3/integration/submit/${HUBSPOT_PORTAL_ID}/${formId}`;
