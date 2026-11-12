"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/motion";
import { customerLogos, logoHeightRem, type Logo } from "@/lib/content/logos";
import { trust } from "@/lib/content/site";
import s from "./trust.module.css";

const SPEED = 40; // px/s — constant speed regardless of logo count (DESIGN.md §G.2)

function LogoMark({ logo, hidden = false }: { logo: Logo; hidden?: boolean }) {
  const h = logoHeightRem(logo);
  const style = {
    "--h": `${h}rem`,
    "--h-sm": `${logoHeightRem(logo, 2400, 16, 34)}rem`,
    "--ar": `${logo.w} / ${logo.h}`,
    WebkitMaskImage: `url(${logo.src})`,
    maskImage: `url(${logo.src})`,
  } as CSSProperties;
  return (
    <li className={s.item} aria-hidden={hidden || undefined}>
      <span className={s.logo} style={style} role={hidden ? undefined : "img"} aria-label={hidden ? undefined : logo.name} />
    </li>
  );
}

export default function TrustStrip() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const el = root.current;
    const tr = track.current;
    if (!el || !tr) return;
    if (prefersReducedMotion()) {
      el.setAttribute("data-static", "");
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el.querySelector("[data-reveal]"),
        { autoAlpha: 0, y: 16 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
        },
      );
    }, el);

    // Marquee: one tween over exactly one set's width, repeating seamlessly.
    let tween: gsap.core.Tween | null = null;
    const build = () => {
      tween?.kill();
      gsap.set(tr, { x: 0 });
      const setW = tr.scrollWidth / 2;
      tween = gsap.to(tr, { x: -setW, duration: setW / SPEED, ease: "none", repeat: -1 });
    };
    build();
    const ro = new ResizeObserver(build);
    ro.observe(tr);

    const st = ScrollTrigger.create({
      trigger: el,
      start: "top bottom",
      end: "bottom top",
      onToggle: (self) => (self.isActive ? tween?.play() : tween?.pause()),
    });
    // Runs continuously — no hover pause (design decision). Only paused while off-screen.

    return () => {
      ctx.revert();
      tween?.kill();
      ro.disconnect();
      st.kill();
    };
  }, []);

  return (
    <section ref={root} className={s.strip} aria-label="Customers">
      <div className={s.inner} data-reveal>
        <p className={s.label}>
          <span className={s.labelMuted}>{trust.labelMuted}</span> <span className={s.labelStrong}>{trust.label}</span>
        </p>
        <div className={s.marquee}>
          <ul ref={track} className={s.track}>
            {customerLogos.map((l) => (
              <LogoMark key={l.name} logo={l} />
            ))}
            {customerLogos.map((l) => (
              <LogoMark key={`${l.name}-dup`} logo={l} hidden />
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
