import type { CSSProperties } from "react";
import type { CustomerStory } from "@/lib/content/customers";
import s from "./customers.module.css";

/** Optical logo height (DESIGN.md §E.10): h = clamp(18px, √(A / aspect), 44px), A = 3600px². */
function logoHeight(w: number, h: number) {
  return Math.min(44, Math.max(18, Math.sqrt(3600 / (w / h))));
}

/**
 * Brand mark in currentColor: the single-ink logo through a CSS mask, or the serif
 * wordmark for brands without a logo file (DESIGN.md §C.1 "the stories wordmark").
 */
export default function BrandMark({ brand, className = "" }: { brand: CustomerStory["brand"]; className?: string }) {
  if (!brand.logo) return <span className={`${s.wordmark} ${className}`}>{brand.name}</span>;
  const { src, w, h } = brand.logo;
  const style = {
    "--logo": `url(${src})`,
    aspectRatio: `${w} / ${h}`,
    height: `${logoHeight(w, h) / 16}rem`,
  } as CSSProperties;
  return <span className={`${s.logo} ${className}`} style={style} role="img" aria-label={brand.name} />;
}
