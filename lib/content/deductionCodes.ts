// Deduction code library, copied verbatim from runroma.com/deduction-codes (the data
// embedded in its code component, fetched Nov 2026; counts match the live tabs:
// UNFI 428, KeHE 109, Walmart 34, Target 14). Rows live in deductionCodes.json.

import data from "./deductionCodes.json";

export type RetailerKey = "unfi" | "kehe" | "walmart" | "target";
export type CodeRow = Record<string, string | null>;
export type CodeSet = {
  key: RetailerKey;
  label: string;
  placeholder: string;
  columns: { key: string; label: string; wide?: boolean }[];
  rows: CodeRow[];
};

export const codesCopy = {
  kicker: "Deduction codes",
  title: "Deduction code library",
  lead: "A reference of the deduction and billing codes each retailer uses on remittance advices, so you recognize a code the moment it lands on a statement.",
  updated: "Last updated July 31, 2026",
};

const DEF = { key: "description", label: "Definition", wide: true };

export const codeSets: CodeSet[] = [
  {
    key: "unfi",
    label: "UNFI",
    placeholder: "Search by code, category, region, retailer…",
    columns: [
      { key: "code", label: "Code" },
      { key: "type", label: "Category / Billing type" },
      { key: "region", label: "Region" },
      { key: "retailer", label: "Retailer" },
      { key: "description", label: "Description", wide: true },
    ],
    rows: data.unfi,
  },
  {
    key: "kehe",
    label: "KeHE",
    placeholder: "Search by code or definition…",
    columns: [{ key: "code", label: "Code" }, DEF, { key: "section", label: "Section" }],
    rows: data.kehe,
  },
  { key: "walmart", label: "Walmart", placeholder: "Search by code or definition…", columns: [{ key: "code", label: "Code" }, DEF], rows: data.walmart },
  { key: "target", label: "Target", placeholder: "Search by code or definition…", columns: [{ key: "code", label: "Code" }, DEF], rows: data.target },
];
