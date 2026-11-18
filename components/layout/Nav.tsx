"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { DEMO_HREF, SIGNUP_HREF } from "@/components/chat/data";
import Button from "@/components/ui/Button";
import { navLinks } from "@/lib/content/site";
import { queryVisible } from "@/lib/motion";
import s from "./nav.module.css";

/**
 * Different AI navbar pattern: transparent + white over the hero, solid cream
 * with a hairline once the hero has scrolled away (DESIGN.md §G.1 Interaction).
 */
export default function Nav() {
  const [solid, setSolid] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  // Active route (DESIGN.md §G.11): red on cream, a soft pill on the dark hero.
  const isActive = (href: string) => !href.includes("#") && href !== "/" && (pathname === href || pathname.startsWith(`${href}/`));

  useEffect(() => {
    // Visible hero only: a previously visited route may still be in the DOM, hidden.
    const hero = queryVisible<HTMLElement>("[data-hero]");
    const update = () => {
      const limit = hero ? hero.offsetHeight - 72 : 200;
      setSolid(window.scrollY > limit);
      setScrolled(window.scrollY > 8);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const dark = !solid && !open;

  return (
    <header className={`${s.nav} ${solid ? s.solid : ""} ${scrolled && !solid ? s.overHero : ""} ${open ? s.isOpen : ""}`} data-theme={dark ? "dark" : "light"}>
      <div className={s.inner}>
        <Link href="/" className={s.logo} aria-label="Roma home">
          <Image
            src="/brand/roma-logo.png"
            alt=""
            width={464}
            height={106}
            loading="eager"
            className={`${s.logoImg} ${dark ? s.logoOnDark : ""}`}
          />
        </Link>

        <nav aria-label="Primary" className={s.links}>
          {navLinks.map((l) => (
            <Link key={l.label} href={l.href} className={`${s.link} ${isActive(l.href) ? s.active : ""}`} aria-current={isActive(l.href) ? "page" : undefined}>
              {l.label}
            </Link>
          ))}
        </nav>

        <div className={s.actions}>
          <a href="#" className={`${s.link} ${s.login}`}>
            Log in
          </a>
          <Button href={SIGNUP_HREF} variant={dark ? "inverse" : "primary"} size="small">
            Try now
          </Button>
          <button
            type="button"
            className={s.menuBtn}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            <span />
            <span />
          </button>
        </div>
      </div>

      <div id="mobile-menu" className={s.sheet} hidden={!open}>
        <nav aria-label="Mobile" className={s.sheetLinks}>
          {navLinks.map((l) => (
            <Link
              key={l.label}
              href={l.href}
              onClick={() => setOpen(false)}
              className={isActive(l.href) ? s.sheetActive : undefined}
              aria-current={isActive(l.href) ? "page" : undefined}
            >
              {l.label}
            </Link>
          ))}
          <a href="#" onClick={() => setOpen(false)}>
            Log in
          </a>
          <a href={DEMO_HREF} onClick={() => setOpen(false)}>
            Book a demo
          </a>
        </nav>
        <Button href={SIGNUP_HREF} variant="primary" onClick={() => setOpen(false)}>
          Try now →
        </Button>
      </div>
    </header>
  );
}
