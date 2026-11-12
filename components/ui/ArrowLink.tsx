"use client";

import type { MouseEvent, ReactNode } from "react";
import { scrollToTarget } from "@/components/motion/SmoothScroll";
import s from "./ui.module.css";

type Props = {
  href: string;
  children: ReactNode;
  onDark?: boolean;
  arrow?: "down" | "up-right" | "none";
  className?: string;
};

/** Underlined text link with swipe + arrow nudge (DESIGN.md §E.2). In-page hashes scroll via Lenis. */
export default function ArrowLink({ href, children, onDark = false, arrow = "up-right", className = "" }: Props) {
  const onClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (href.startsWith("#") && href.length > 1) {
      e.preventDefault();
      scrollToTarget(href);
    }
  };
  return (
    <a href={href} onClick={onClick} className={`${s.link} ${onDark ? s.onDark : ""} ${className}`}>
      <span>{children}</span>
      {arrow !== "none" && (
        <svg className={s.linkIcon} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          {arrow === "down" ? <path d="M8 3v10M3.5 8.5 8 13l4.5-4.5" /> : <path d="M5 11 11 5M6 5h5v5" />}
        </svg>
      )}
      <span className={s.line} aria-hidden="true" />
    </a>
  );
}
