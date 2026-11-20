"use client";

import { useEffect, useRef, useState, type MouseEvent as ReactMouseEvent, type PointerEvent as ReactPointerEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { DEMO_HREF, LOGIN_HREF, SIGNUP_HREF } from "@/components/chat/data";
import Button from "@/components/ui/Button";
import type { NavLink, NavMenu } from "@/lib/content/nav";
import { queryVisible } from "@/lib/motion";
import { detailPrefetch } from "@/lib/prefetch";
import NavIcon from "./NavIcon";
import NavTile from "./NavTile";
import s from "./nav.module.css";

/**
 * Primary nav (DESIGN.md §G.1). Transparent + white over the hero, solid cream with a
 * hairline once the hero has scrolled away. A plain Platform link, then three dropdowns
 * (Solutions · Resources · Company) that open full-width cream panels; opening one turns the bar solid cream so the panel
 * never hangs off a transparent bar. Below 992px the groups become an accordion in the sheet.
 *
 * Disclosure pattern (button + aria-expanded + aria-controls), not ARIA `menu`: the panels
 * hold ordinary links in DOM order right after their trigger, so Tab walks into them.
 */

/**
 * Routes whose first section sits on cream ([data-nav-light]). Known from the URL so the
 * server renders the light nav: no white-on-cream flash before hydration.
 */
const LIGHT_ROUTES = ["/contact", "/book-a-demo", "/terms-and-conditions", "/privacy-policy"];

const OPEN_DELAY = 120; // ms, hover intent before a panel opens
const CLOSE_DELAY = 200; // ms, grace while the pointer crosses from trigger to panel
const CLICK_GRACE = 400; // ms, a click right after hover-open keeps the panel open
const SCROLL_CLOSE = 64; // px scrolled from where the panel opened

function Chevron({ className }: { className: string }) {
  return (
    <svg className={className} viewBox="0 0 10 10" width="10" height="10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M2 3.75l3 3 3-3" />
    </svg>
  );
}

export default function NavBar({ links, menus }: { links: NavLink[]; menus: NavMenu[] }) {
  const pathname = usePathname();
  const lightRoute = LIGHT_ROUTES.includes(pathname);
  const [solid, setSolid] = useState(lightRoute);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false); // mobile sheet
  const [sheetGroup, setSheetGroup] = useState<string | null>(null);
  const [menu, setMenu] = useState<string | null>(null); // desktop panel
  const [swap, setSwap] = useState(false); // panel → panel: no re-animation

  const linksRef = useRef<HTMLElement>(null);
  const triggers = useRef<Record<string, HTMLButtonElement | null>>({});
  const timer = useRef(0);
  const openedAt = useRef(0);
  const openY = useRef(0);
  const menuRef = useRef<string | null>(null);

  useEffect(() => {
    menuRef.current = menu;
  }, [menu]);

  // Active route (DESIGN.md §G.11): red on cream, a soft pill on the dark hero.
  const isActive = (href: string) => !href.includes("#") && href !== "/" && (pathname === href || pathname.startsWith(`${href}/`));
  const activeGroup = menus.find((m) => m.items.some((i) => isActive(i.href)))?.label ?? null;

  const clearTimer = () => window.clearTimeout(timer.current);
  /** `stamp`: event timeStamp of the gesture that opened it (for the click grace). */
  const openMenu = (label: string, stamp = 0) => {
    clearTimer();
    const current = menuRef.current;
    if (current === label) return;
    setSwap(current !== null);
    openedAt.current = stamp;
    openY.current = window.scrollY;
    menuRef.current = label;
    setMenu(label);
  };
  const closeMenu = () => {
    clearTimer();
    menuRef.current = null;
    setMenu(null);
  };

  useEffect(() => {
    // Visible hero only: a previously visited route may still be in the DOM, hidden.
    const hero = queryVisible<HTMLElement>("[data-hero]");
    // Pages that open on cream (contact, demo) mark their hero [data-nav-light]: the
    // nav is solid cream from the top.
    const light = !!queryVisible("[data-nav-light]");
    const update = () => {
      const limit = hero ? hero.offsetHeight - 72 : 200;
      setSolid(light || window.scrollY > limit);
      setScrolled(window.scrollY > 8);
      if (menuRef.current && Math.abs(window.scrollY - openY.current) > SCROLL_CLOSE) {
        menuRef.current = null;
        setMenu(null);
      }
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      window.clearTimeout(timer.current);
    };
  }, []);

  // Mobile sheet: scroll lock + Esc.
  useEffect(() => {
    const html = document.documentElement;
    html.style.overflow = open ? "hidden" : "";
    // The Ask Roma launcher floats above the nav; it steps aside while the sheet is open.
    if (open) html.dataset.navSheet = "open";
    else delete html.dataset.navSheet;
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // Desktop panel: Esc returns focus to its trigger; a press outside the nav closes it.
  useEffect(() => {
    if (!menu) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      triggers.current[menu]?.focus();
      close();
    };
    const onDown = (e: PointerEvent) => {
      if (!linksRef.current?.contains(e.target as Node)) close();
    };
    const close = () => {
      window.clearTimeout(timer.current);
      menuRef.current = null;
      setMenu(null);
    };
    window.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
    };
  }, [menu]);

  const mouse = (e: ReactPointerEvent) => e.pointerType === "mouse" && window.matchMedia("(hover: hover)").matches;

  const onTriggerEnter = (e: ReactPointerEvent, label: string) => {
    if (!mouse(e)) return;
    clearTimer();
    const stamp = e.timeStamp;
    if (menuRef.current) openMenu(label, stamp);
    else timer.current = window.setTimeout(() => openMenu(label, stamp + OPEN_DELAY), OPEN_DELAY);
  };
  const onZoneEnter = (e: ReactPointerEvent) => {
    if (mouse(e) && menuRef.current) clearTimer();
  };
  const onZoneLeave = (e: ReactPointerEvent) => {
    if (!mouse(e)) return;
    clearTimer();
    timer.current = window.setTimeout(closeMenu, CLOSE_DELAY);
  };
  const onTriggerClick = (e: ReactMouseEvent, label: string) => {
    if (menuRef.current !== label) return openMenu(label, e.timeStamp);
    // A click that lands just after hover opened the panel keeps it open.
    if (e.timeStamp - openedAt.current > CLICK_GRACE) closeMenu();
  };

  const toggleSheet = () => {
    if (!open) setSheetGroup(activeGroup);
    setOpen(!open);
  };

  const bar = solid || lightRoute || !!menu;
  const dark = !bar && !open;

  return (
    <header
      className={`${s.nav} ${bar ? s.solid : ""} ${scrolled && !bar ? s.overHero : ""} ${open ? s.isOpen : ""}`}
      data-theme={dark ? "dark" : "light"}
    >
      <div className={s.inner}>
        <Link href="/" className={s.logo} aria-label="Roma home" onClick={closeMenu}>
          <Image
            src="/brand/roma-logo.png"
            alt=""
            width={464}
            height={106}
            loading="eager"
            className={`${s.logoImg} ${dark ? s.logoOnDark : ""}`}
          />
        </Link>

        <nav
          ref={linksRef}
          aria-label="Primary"
          className={s.links}
          onPointerEnter={onZoneEnter}
          onPointerLeave={onZoneLeave}
          onBlur={(e) => {
            // Focus moved to something outside the nav (Tab past the last link).
            if (e.relatedTarget && !e.currentTarget.contains(e.relatedTarget as Node)) closeMenu();
          }}
        >
          <ul className={s.menuList}>
            {links.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className={`${s.link} ${isActive(l.href) ? s.active : ""}`}
                  aria-current={isActive(l.href) ? "page" : undefined}
                  onPointerEnter={(e) => mouse(e) && menuRef.current && closeMenu()}
                  onClick={closeMenu}
                >
                  {l.label}
                </Link>
              </li>
            ))}
            {menus.map((m, i) => {
              const isOpen = menu === m.label;
              return (
                <li key={m.label}>
                  <button
                    type="button"
                    ref={(el) => {
                      triggers.current[m.label] = el;
                    }}
                    className={`${s.link} ${s.trigger} ${activeGroup === m.label ? s.active : ""}`}
                    aria-expanded={isOpen}
                    aria-controls={`nav-panel-${i}`}
                    onPointerEnter={(e) => onTriggerEnter(e, m.label)}
                    onClick={(e) => onTriggerClick(e, m.label)}
                  >
                    {m.label}
                    <Chevron className={s.chevron} />
                  </button>

                  <div id={`nav-panel-${i}`} className={`${s.panel} ${swap ? s.swap : ""}`} hidden={!isOpen}>
                    <div className={s.panelInner}>
                      <ul className={s.rows}>
                        {m.items.map((item) => {
                          const active = isActive(item.href);
                          return (
                            <li key={item.href}>
                              <Link
                                href={item.href}
                                prefetch={detailPrefetch(item.href)}
                                className={`${s.row} ${active ? s.rowActive : ""}`}
                                aria-current={active ? "page" : undefined}
                                onClick={closeMenu}
                              >
                                <span className={s.icon}>
                                  <NavIcon name={item.icon} />
                                </span>
                                <span className={s.rowText}>
                                  <span className={s.rowTitle}>
                                    {item.label}
                                    <span className={s.rowArrow} aria-hidden="true">
                                      →
                                    </span>
                                  </span>
                                  <span className={s.rowDesc}>{item.desc}</span>
                                </span>
                              </Link>
                            </li>
                          );
                        })}
                      </ul>

                      <NavTile f={m.feature} onNavigate={closeMenu} />
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className={s.actions}>
          <a href={LOGIN_HREF} className={`${s.link} ${s.login}`}>
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
            onClick={toggleSheet}
          >
            <span />
            <span />
          </button>
        </div>
      </div>

      <div className={s.scrim} hidden={!menu} aria-hidden="true" onClick={closeMenu} />

      <div id="mobile-menu" className={s.sheet} hidden={!open}>
        <nav aria-label="Mobile" className={s.sheetLinks}>
          {links.map((l) => (
            <div key={l.href} className={s.group}>
              <Link
                href={l.href}
                onClick={() => setOpen(false)}
                className={`${s.groupBtn} ${isActive(l.href) ? s.sheetActive : ""}`}
                aria-current={isActive(l.href) ? "page" : undefined}
              >
                {l.label}
              </Link>
            </div>
          ))}
          {menus.map((m, i) => {
            const expanded = sheetGroup === m.label;
            return (
              <div key={m.label} className={s.group}>
                <button
                  type="button"
                  className={`${s.groupBtn} ${activeGroup === m.label ? s.sheetActive : ""}`}
                  aria-expanded={expanded}
                  aria-controls={`sheet-group-${i}`}
                  onClick={() => setSheetGroup(expanded ? null : m.label)}
                >
                  {m.label}
                  <Chevron className={s.chevron} />
                </button>
                <div id={`sheet-group-${i}`} className={s.groupBody} data-open={expanded || undefined} inert={!expanded}>
                  <ul className={s.groupList}>
                    {m.items.map((item) => (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          prefetch={detailPrefetch(item.href)}
                          onClick={() => setOpen(false)}
                          className={isActive(item.href) ? s.sheetActive : undefined}
                          aria-current={isActive(item.href) ? "page" : undefined}
                        >
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
          <div className={s.sheetMeta}>
            <a href={LOGIN_HREF} onClick={() => setOpen(false)}>
              Log in
            </a>
            <Link href={DEMO_HREF} onClick={() => setOpen(false)}>
              Book a demo
            </Link>
          </div>
        </nav>
        <Button href={SIGNUP_HREF} variant="primary" onClick={() => setOpen(false)}>
          Try now →
        </Button>
      </div>
    </header>
  );
}
