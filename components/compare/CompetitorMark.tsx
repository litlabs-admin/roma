"use client";

import type { CSSProperties } from "react";
import type { Competitor } from "@/lib/content/compare/types";
import { useCompare } from "./context";
import s from "./competitorMark.module.css";

/**
 * The current competitor's mark inside a neutral badge (DESIGN.md §G.13, §E.10): a
 * client-supplied SVG rendered as a single-ink CSS mask, never in the competitor's own
 * colours; competitors without a supplied mark get their mono initial. Decorative: the
 * name always sits beside it in text.
 */
/** `of`: another competitor (the "compare with others" cards); defaults to this page's. */
export default function CompetitorMark({ of, className = "" }: { of?: Competitor; className?: string }) {
  const ctx = useCompare();
  const c = of ?? ctx.c;
  if (!c.mark) {
    return (
      <span className={`${s.initial} ${className}`} aria-hidden="true">
        {c.name.charAt(0)}
      </span>
    );
  }
  const style = { ["--mark" as string]: `url("${c.mark.src}")`, aspectRatio: String(c.mark.ratio) } as CSSProperties;
  return <span className={`${s.mark} ${className}`} style={style} aria-hidden="true" />;
}
