"use client";

import type { CSSProperties } from "react";
import type { Competitor } from "@/lib/content/compare/types";
import { useCompare } from "./context";
import s from "./logo.module.css";

/**
 * A competitor's own wordmark in its original colours and proportions (DESIGN.md §G.13,
 * client 20 Nov 2026). `height` is in rem; raster logos (`maxPx`) never render taller
 * than their sharp size. Pass `label` when the logo stands in for the name; otherwise it
 * is decorative and the name sits beside it in text.
 */
export default function CompetitorLogo({ of, height, label = false, className = "" }: { of?: Competitor; height?: number; label?: boolean; className?: string }) {
  const ctx = useCompare();
  const c = of ?? ctx.c;
  const { logo } = c;
  const h = height ?? logo.size;
  const style = {
    height: logo.maxPx ? `min(${h}rem, ${logo.maxPx}px)` : `${h}rem`,
    aspectRatio: `${logo.w} / ${logo.h}`,
  } as CSSProperties;
  return (
    // eslint-disable-next-line @next/next/no-img-element -- local SVG wordmark, shown at its own proportions
    <img src={logo.src} alt={label ? c.name : ""} aria-hidden={label ? undefined : true} width={logo.w} height={logo.h} className={`${s.logo} ${className}`} style={style} decoding="async" />
  );
}
