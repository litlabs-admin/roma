"use client";

import Image from "next/image";
import Link from "next/link";
import { Fragment, useEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import { ArrowGlyph } from "@/components/blog/PostCard";
import { bentoCopy, storyHref, type CustomerStory } from "@/lib/content/customers";
import { BrandMark } from "./StoryCard";
import q from "./quoteRotator.module.css";

/**
 * Customer quote rotator: Roma's port of Duna's testimonial carousel (duna.com,
 * modules vF8TX6w6C + TestimonialIMG xJOlenb86), fitted into the results bento.
 *
 * Duna: a logo selector (edge-faded mask; active 1, others 0.3, hover 0.8 over 0.2s)
 * above a two-panel card (quote + name on light grey, portrait on sand, 8px radius).
 * Each customer's card mounts fresh: the quote appears word by word (blur 2px,
 * opacity 0, y 4px → sharp; 0.6s, 20ms stagger), then portrait (+0.3s), name (+0.5s)
 * and role (+0.6s), 0.8s each, no exit. Autoplay steps through the customers; picking
 * a logo jumps there (Duna then stops autoplay; Roma restarts the clock instead).
 *
 * Roma: the logo row is the card's top strip so the bento keeps square edges; 6s
 * interval (our quotes run ~30 words, Duna's ~20), shown as the active tab's red bar
 * filling left to right (its animationend advances). Picking a logo jumps there and
 * restarts the bar from zero. The mouse never pauses it; keyboard focus inside the
 * card does (WCAG 2.2.2 pause), as do off-screen and a hidden tab. Under reduced
 * motion the bar stays full and nothing rotates.
 * The logo row is a tablist (arrow keys move between customers).
 */

const ROTATE_MS = 6000;

export default function QuoteRotator({ stories }: { stories: CustomerStory[] }) {
  const root = useRef<HTMLElement>(null);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const [i, setI] = useState(0);
  /** Bumped on every pick so re-clicking the active logo also restarts the bar. */
  const [run, setRun] = useState(0);
  const [kbFocus, setKbFocus] = useState(false);
  const [visible, setVisible] = useState(false);

  const [docHidden, setDocHidden] = useState(false);
  const [still, setStill] = useState(false);
  const st = stories[i];

  // Rotate only while on screen and the tab is visible; never under reduced motion.
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.35 });
    io.observe(el);
    const onVis = () => setDocHidden(document.hidden);
    document.addEventListener("visibilitychange", onVis);
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onMq = () => setStill(mq.matches);
    onMq();
    mq.addEventListener("change", onMq);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      mq.removeEventListener("change", onMq);
    };
  }, []);

  // The active tab's red bar is the clock: it fills over ROTATE_MS and its
  // animationend advances, so pausing the bar pauses the rotation exactly.
  const timer: "run" | "pause" | "held" = still ? "held" : kbFocus || !visible || docHidden ? "pause" : "run";
  const advance = () => setI((v) => (v + 1) % stories.length);

  const pick = (n: number, focus = false) => {
    const next = (n + stories.length) % stories.length;
    setI(next);
    setRun((r) => r + 1);
    if (focus) tabs.current[next]?.focus();
  };

  const onKey = (e: KeyboardEvent) => {
    if (e.key === "ArrowRight") pick(i + 1, true);
    else if (e.key === "ArrowLeft") pick(i - 1, true);
    else if (e.key === "Home") pick(0, true);
    else if (e.key === "End") pick(stories.length - 1, true);
    else return;
    e.preventDefault();
  };

  const words = `“${st.quote.text}”`.split(/\s+/);
  const panelId = "quote-panel";

  return (
    <section
      ref={root}
      className={q.card}
      aria-label="Customer quotes"
      // Keyboard focus pauses; a mouse click also focuses the tab, so only
      // :focus-visible (keyboard) counts.
      onFocus={(e) => setKbFocus((e.target as HTMLElement).matches(":focus-visible"))}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setKbFocus(false);
      }}
      onPointerDown={() => setKbFocus(false)}
      data-reveal
    >
      <div className={q.logos} role="tablist" aria-label="Choose a customer" onKeyDown={onKey}>
        {stories.map((c, n) => (
          <button
            key={c.slug}
            ref={(el) => {
              tabs.current[n] = el;
            }}
            type="button"
            role="tab"
            id={`quote-tab-${c.slug}`}
            className={q.logo}
            aria-selected={n === i}
            aria-controls={panelId}
            tabIndex={n === i ? 0 : -1}
            onClick={() => pick(n)}
          >
            <BrandMark brand={c.brand} className={q.mark} />
            {n === i && (
              <span
                key={`${i}-${run}`}
                className={q.bar}
                data-timer={timer}
                style={{ "--rotate": `${ROTATE_MS}ms` } as CSSProperties}
                onAnimationEnd={(e) => {
                  if (timer !== "held" && e.animationName.includes("barClock")) advance();
                }}
                aria-hidden="true"
              />
            )}
          </button>
        ))}
      </div>

      <div key={st.slug} id={panelId} role="tabpanel" aria-labelledby={`quote-tab-${st.slug}`} className={q.body}>
        <div className={q.info}>
          <blockquote className={q.quote}>
            {words.map((w, n) => (
              <Fragment key={n}>
                <span className={q.word} style={{ "--i": n } as CSSProperties}>
                  {w}
                </span>{" "}
              </Fragment>
            ))}
          </blockquote>
          <div className={q.foot}>
            <p className={q.who}>
              <span className={q.name}>{st.quote.name ?? st.brand.name}</span>
              <span className={q.role}>
                {st.quote.role}, {st.brand.name}
              </span>
            </p>
            <Link href={storyHref(st.slug)} className={q.read}>
              {bentoCopy.read}
              <ArrowGlyph className={q.readIcon} />
            </Link>
          </div>
        </div>
        <div className={q.portrait}>
          <Image
            src={st.quote.portrait?.src ?? st.photo.src}
            alt=""
            fill
            sizes="(max-width: 767px) 100vw, 30rem"
            quality={90}
            className={q.portraitImg}
          />
        </div>
      </div>
    </section>
  );
}
