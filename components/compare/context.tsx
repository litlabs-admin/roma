"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import type { Competitor } from "@/lib/content/compare/types";

/**
 * Hands the current competitor (and its footnote order) to every comparison section,
 * so components stay generic: Cite, CompetitorMark and the visuals read from here.
 */

type Ctx = { c: Competitor; order: string[] };
const CompareCtx = createContext<Ctx | null>(null);

export function CompareProvider({ competitor, order, children }: { competitor: Competitor; order: string[]; children: ReactNode }) {
  const value = useMemo(() => ({ c: competitor, order }), [competitor, order]);
  return <CompareCtx.Provider value={value}>{children}</CompareCtx.Provider>;
}

/** The current competitor, or null outside a comparison page (the /compare hub). */
export function useCompareOptional() {
  return useContext(CompareCtx);
}

export function useCompare() {
  const v = useContext(CompareCtx);
  if (!v) throw new Error("useCompare must be used inside <CompareProvider>");
  return v;
}
