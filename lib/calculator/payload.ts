// The calculator's gate-form payload (brief §2.7). Field names are the HubSpot contact
// properties the brief specifies, so the form can be posted as-is once the "ROI calculator"
// form exists. Nothing here assumes an endpoint; lib/forms/submit.ts owns the request.

import { CONSTANTS } from "@/lib/content/calculator";
import type { Inputs, Outputs } from "./math";

export type GateValues = {
  email: string;
  firstName: string;
  company: string;
  role: string;
  website: string; // honeypot
};

export type CalculatorPayload = {
  fields: Record<string, string | number>;
  context: { hutk?: string; pageUri: string; pageName: string };
};

function cookie(name: string) {
  if (typeof document === "undefined") return undefined;
  const hit = document.cookie.split("; ").find((c) => c.startsWith(`${name}=`));
  return hit ? decodeURIComponent(hit.slice(name.length + 1)) : undefined;
}

const round2 = (x: number) => Math.round(x * 100) / 100;

export function toCalculatorPayload(args: {
  values: GateValues;
  inputs: Inputs;
  retailers: string[];
  out: Outputs;
  plan: string;
  reportUrl: string;
  sourcePage: string;
}): CalculatorPayload {
  const { values, inputs, retailers, out, plan, reportUrl, sourcePage } = args;
  const fields: Record<string, string | number> = {
    email: values.email.trim(),
    firstname: values.firstName.trim(),
    company: values.company.trim(),
    jobtitle: values.role,
    roi_annual_revenue: inputs.R,
    roi_deduction_pct: inputs.d,
    roi_invalid_pct: inputs.i,
    roi_current_recovery_pct: inputs.c,
    roi_hours_per_week: inputs.h,
    roi_hourly_cost: inputs.w,
    roi_retailer_count: inputs.n,
    // HubSpot multi-checkbox values are ";"-separated.
    roi_retailers: retailers.join(";"),
    roi_deductions_per_year: round2(out.D),
    roi_invalid_per_year: round2(out.I),
    roi_extra_recovered: round2(out.gain),
    roi_hours_saved: Math.round(out.hSaved),
    roi_time_value: round2(out.vTime),
    roi_total_value: round2(out.value),
    roi_pct: Math.round(out.roi * 100),
    roi_payback_months: Number.isFinite(out.payback) ? Math.round(out.payback * 10) / 10 : -1,
    roi_suggested_plan: plan,
    roi_report_url: reportUrl,
    roi_source_page: sourcePage,
    roi_calc_version: CONSTANTS.v.value,
    roi_submitted_at: new Date().toISOString().slice(0, 10),
  };
  if (!fields.jobtitle) delete fields.jobtitle;
  // UTM hidden fields, passed through when present on the URL.
  if (typeof window !== "undefined") {
    const q = new URLSearchParams(window.location.search);
    for (const k of ["utm_source", "utm_medium", "utm_campaign", "utm_content"]) {
      const v = q.get(k);
      if (v) fields[k] = v;
    }
  }
  return {
    fields,
    context: {
      hutk: cookie("hubspotutk"),
      pageUri: typeof window !== "undefined" ? window.location.href : "",
      pageName: typeof document !== "undefined" ? document.title : "",
    },
  };
}
