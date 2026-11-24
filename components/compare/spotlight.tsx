"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { competitors } from "@/lib/content/compare";

/**
 * The /compare spotlight (DESIGN.md §G.13a): which competitor the reader is comparing
 * Roma with. `null` = all of them (desktop only; phones always show Roma + one). Shared
 * by the matrix (lit column, phone column) and the hub (active card), and kept in `?vs=`
 * so a focused link can be shared. Server markup is "all".
 */

type Ctx = { pick: string | null; setPick: (slug: string | null) => void };
const SpotlightCtx = createContext<Ctx>({ pick: null, setPick: () => {} });

const isSlug = (v: string | null): v is string => !!v && competitors.some((c) => c.slug === v);

export function SpotlightProvider({ children }: { children: ReactNode }) {
  const [pick, setPickState] = useState<string | null>(null);

  // Seed from the URL once mounted (keeps the page static; no useSearchParams bailout).
  // After hydration, as the calculator does: the server renders "all".
  useEffect(() => {
    const vs = new URLSearchParams(window.location.search).get("vs");
    const raf = requestAnimationFrame(() => {
      if (isSlug(vs)) setPickState(vs);
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  const setPick = useCallback((slug: string | null) => {
    const next = isSlug(slug) ? slug : null;
    setPickState(next);
    const q = new URLSearchParams(window.location.search);
    if (next) q.set("vs", next);
    else q.delete("vs");
    const qs = q.toString();
    window.history.replaceState(window.history.state, "", `${window.location.pathname}${qs ? `?${qs}` : ""}${window.location.hash}`);
  }, []);

  const value = useMemo(() => ({ pick, setPick }), [pick, setPick]);
  return <SpotlightCtx.Provider value={value}>{children}</SpotlightCtx.Provider>;
}

export function useSpotlight() {
  return useContext(SpotlightCtx);
}
