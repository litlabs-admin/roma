// Deduction code library, copied verbatim from runroma.com/deduction-codes (the data
// embedded in its code component, fetched Nov 2026; counts match the live tabs:
// UNFI 428, KeHE 109, Walmart 34, Target 14). Rows live in deductionCodes.json.

import type { EditorialHeroCopy } from "@/components/blog/BlogHero";
import data from "./deductionCodes.json";

export type RetailerKey = "unfi" | "kehe" | "walmart" | "target";
export type CodeRow = Record<string, string | null>;
export type CodeSet = {
  key: RetailerKey;
  label: string;
  logo: string;
  /** Logo width ÷ height (the PNGs are 160px tall). */
  ratio: number;
  rows: CodeRow[];
};

export const codesCopy = {
  title: "Deduction code library",
  lead: "A reference of the deduction and billing codes each retailer uses on remittance advices, so you recognize a code the moment it lands on a statement.",
  updated: "Last updated July 31, 2026",
  library: {
    label: "Code library",
    heading: { before: "Look up ", accent: "a code", after: "." },
    lead: "Search every retailer at once. Type a code exactly as it appears on your remittance, or a word like shortage, freight or promo.",
  },
  placeholder: "Search a code or a word, e.g. 29CM, shortage, A030",
  legend: "marks a part that changes per deduction, like your invoice number.",
};

export const codeSets: CodeSet[] = [
  { key: "unfi", label: "UNFI", logo: "/logos/channels/unfi.png", ratio: 2.125, rows: data.unfi },
  { key: "kehe", label: "KeHE", logo: "/logos/channels/kehe.png", ratio: 3.97, rows: data.kehe },
  { key: "walmart", label: "Walmart", logo: "/logos/channels/walmart.png", ratio: 5.26, rows: data.walmart },
  { key: "target", label: "Target", logo: "/logos/channels/target.png", ratio: 0.79, rows: data.target },
];

/** /deduction-codes hero: the /blogs composition (DESIGN.md §G.10) on its own photo.
 *  Photo: Camilo Rueda López, unsplash.com/photos/3CLPBgNuX40 (Unsplash License). */
export const codesHero: EditorialHeroCopy = {
  id: "codes-title",
  eyebrow: "Deduction codes",
  icon: "book",
  heading: { before: "Know every deduction code ", accent: "on sight", after: "." },
  lead: codesCopy.lead,
  image: { src: "/images/codes/hero-codes-2400.webp", position: "50% 55%" },
  listLabel: "Browse by retailer",
  items: codeSets.map((s) => ({ label: `${s.label} · ${s.rows.length}`, href: `/deduction-codes?r=${s.key}#library` })),
};

// ── Library view model ─────────────────────────────────────────────────────
// One row per meaning. UNFI repeats a category + description for every retailer it
// bills on behalf of (116 "3rd Party Billing" rows read the same), so those collapse
// into one group row whose items are the retailer → code pairs.

export type Tone = "promo" | "shortage" | "fees" | "neutral";

export type CodeItem = { code: string; partner: string | null; region: string | null };

export type LibraryRow = {
  id: string;
  source: RetailerKey;
  /** UNFI billing type or KeHE section, as written in the source. */
  category: string | null;
  /** Top-level UNFI family for the category filter ("MCB (Quality)" → "MCB"). */
  family: string | null;
  tone: Tone;
  regions: string[];
  description: string;
  items: CodeItem[];
};

export const REGIONS = ["UNFI East Region", "UNFI West Region", "National", "Select Nutrition"] as const;

function familyOf(type: string): string {
  if (/^MCB\b/.test(type)) return "MCB";
  return type.split(" - ")[0].trim();
}

/** Colour a category with the deduction-type data tokens (DESIGN.md §B). */
function toneOf(category: string): Tone {
  if (/fee|fine|freight|transport|shipment|pallet|bol|late for|no call|reschedule|label|upc|cut case|pack change|load condition/i.test(category))
    return "fees";
  if (/overpull|damage|recall|spoil|disposition|reclaim|transfer|post audit/i.test(category)) return "shortage";
  if (/mcb|advertis|promo|edlc|food show|fairshare|new store|coupon|marketing|joint business|home store|payback|floor stock|sales|allowance|commission/i.test(category))
    return "promo";
  return "neutral";
}

function buildRows(): LibraryRow[] {
  const rows: LibraryRow[] = [];

  const groups = new Map<string, LibraryRow>();
  data.unfi.forEach((r) => {
    const type = r.type ?? "";
    const desc = r.description ?? "";
    const key = `${type}||${desc}`;
    let g = groups.get(key);
    if (!g) {
      g = {
        id: `unfi-${groups.size}`,
        source: "unfi",
        category: type || null,
        family: type ? familyOf(type) : null,
        tone: toneOf(type),
        regions: [],
        description: desc,
        items: [],
      };
      groups.set(key, g);
    }
    if (r.region && !g.regions.includes(r.region)) g.regions.push(r.region);
    g.items.push({ code: r.code ?? "", partner: r.retailer, region: r.region });
  });
  // Families A → Z, then the biggest group first inside a family.
  rows.push(
    ...[...groups.values()].sort(
      (a, b) => (a.family ?? "").localeCompare(b.family ?? "") || b.items.length - a.items.length || (a.category ?? "").localeCompare(b.category ?? ""),
    ),
  );

  (["kehe", "walmart", "target"] as const).forEach((src) => {
    (data[src] as CodeRow[]).forEach((r, i) => {
      const section = r.section ?? null;
      rows.push({
        id: `${src}-${i}`,
        source: src,
        category: section,
        family: null,
        tone: "neutral",
        regions: [],
        description: r.description ?? "",
        items: [{ code: r.code ?? "", partner: null, region: null }],
      });
    });
  });

  return rows;
}

export const LIBRARY_ROWS: LibraryRow[] = buildRows();

/** UNFI families with their code counts, for the category filter. */
export const UNFI_FAMILIES: { family: string; count: number }[] = (() => {
  const m = new Map<string, number>();
  LIBRARY_ROWS.filter((r) => r.source === "unfi").forEach((r) => m.set(r.family!, (m.get(r.family!) ?? 0) + r.items.length));
  return [...m.entries()].map(([family, count]) => ({ family, count })).sort((a, b) => a.family.localeCompare(b.family));
})();

/**
 * Split a code into literal text and placeholders: "(invoice #)29CM" →
 * [{ph: "invoice #"}, {lit: "29CM"}]. Each line of a multi-line cell is one variant.
 */
export type CodePart = { kind: "lit" | "ph"; text: string };
export function parseCode(code: string): CodePart[][] {
  return code
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) =>
      line
        .split(/(\([^)]*\))/)
        .filter(Boolean)
        .map((t) => (/^\(.*\)$/.test(t) ? { kind: "ph" as const, text: t.slice(1, -1).trim() } : { kind: "lit" as const, text: t })),
    );
}
