"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/motion";
import { coverage } from "@/lib/content/platform";
import { channelLogos, logoHeightRem, type Logo } from "@/lib/content/logos";
import { refreshWhenReady, rise } from "@/components/platform/motion";
import s from "./coverage.module.css";

/**
 * Coverage — the portals Roma connects to, as a moving logo strip: the home trust
 * strip's marquee (DESIGN.md §G.2: single-ink masks, constant 40px/s, edge fade,
 * paused off-screen, static wrap under reduced motion) under a centred heading.
 */

const SPEED = 40; // px/s, same as the home strip

function LogoMark({ logo, hidden = false }: { logo: Logo; hidden?: boolean }) {
  const style = {
    "--h": `${logoHeightRem(logo, 4200, 22, 48)}rem`,
    "--h-sm": `${logoHeightRem(logo, 2600, 18, 36)}rem`,
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

export default function Coverage() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLUListElement>(null);
  const { before, accent, after } = coverage.heading;

  useEffect(() => {
    const el = root.current;
    const tr = track.current;
    if (!el || !tr) return;
    if (prefersReducedMotion()) {
      el.setAttribute("data-static", "");
      return () => el.removeAttribute("data-static");
    }

    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(el);
      rise(q("[data-cv-head]"), q("[data-cv-head]")[0]);
      rise(q("[data-cv-strip]"), q("[data-cv-strip]")[0], { delay: 0.1 });
      rise(q("[data-cv-meta]"), q("[data-cv-strip]")[0], { delay: 0.25 });
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
    const stop = refreshWhenReady();

    return () => {
      stop();
      ctx.revert();
      tween?.kill();
      ro.disconnect();
      st.kill();
    };
  }, []);

  return (
    <section ref={root} className={s.section} aria-labelledby="coverage-heading">
      <div className={s.inner}>
        <h2 id="coverage-heading" className={`${s.heading} type-h3`} data-cv-head>
          {before}
          <span className="accent">{accent}</span>
          {after}
        </h2>
      </div>

      <div className={s.strip} data-cv-strip>
        <div className={s.marquee}>
          <ul ref={track} className={s.track} aria-label="Distributors and retailers">
            {channelLogos.map((l) => (
              <LogoMark key={l.name} logo={l} />
            ))}
            {channelLogos.map((l) => (
              <LogoMark key={`${l.name}-dup`} logo={l} hidden />
            ))}
          </ul>
        </div>
      </div>

      <div className={s.meta} data-cv-meta>
        <p className={s.metaMain}>{coverage.meta}</p>
        <p className={s.note}>{coverage.note}</p>
      </div>
    </section>
  );
}
