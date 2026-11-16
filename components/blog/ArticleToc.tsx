"use client";

import { useEffect, useState, type MouseEvent } from "react";
import type Lenis from "lenis";
import { prefersReducedMotion, queryVisible } from "@/lib/motion";
import a from "./article.module.css";

type Item = { id: string; text: string };

/** The fixed nav is the visible header carrying data-theme (components/layout/Nav.tsx). */
const navHeight = () => queryVisible("header[data-theme]")?.getBoundingClientRect().height ?? 72;

/**
 * "On this page" (DESIGN.md §G.10). The active section is the last h2 whose top has
 * passed the reading line (nav height + 2rem). A rAF-throttled scroll listener, not
 * IntersectionObserver, so a fast scroll can't skip a heading.
 */
export default function ArticleToc({ items, label }: { items: Item[]; label: string }) {
  const [active, setActive] = useState(items[0]?.id ?? "");

  useEffect(() => {
    const headings = items.map((i) => document.getElementById(i.id)).filter((el): el is HTMLElement => !!el && el.getClientRects().length > 0);
    if (!headings.length) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const nav = navHeight();
      const line = nav + 32;
      let current = headings[0].id;
      for (const h of headings) {
        if (h.getBoundingClientRect().top <= line + 1) current = h.id;
        else break;
      }
      setActive(current);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [items]);

  const go = (e: MouseEvent<HTMLAnchorElement>, id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    e.preventDefault();
    const lenis = (window as unknown as { __lenis?: Lenis }).__lenis;
    const nav = navHeight();
    if (lenis) lenis.scrollTo(el, { offset: -(nav + 24), duration: 1.2 });
    else el.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth" });
    history.replaceState(null, "", `#${id}`);
    setActive(id);
  };

  return (
    <nav className={a.toc} aria-label={label}>
      <p className={`${a.tocLabel} type-label`}>{label}</p>
      <ol className={a.tocList}>
        {items.map((i) => (
          <li key={i.id}>
            <a href={`#${i.id}`} onClick={(e) => go(e, i.id)} className={`${a.tocLink} ${active === i.id ? a.tocActive : ""}`} aria-current={active === i.id ? "location" : undefined}>
              {i.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
