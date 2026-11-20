"use client";

import Image from "next/image";
import Link from "next/link";
import { useLayoutEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/motion";
import { splitChars } from "@/components/ui/splitChars";
import { BACKDROP_RANGES } from "@/components/motion/PageBackdrop";
import { ArrowGlyph } from "@/components/blog/PostCard";
import { bentoCopy, getStory, storyHref, type CustomerStory } from "@/lib/content/customers";
import { BrandMark } from "./StoryCard";
import QuoteRotator from "./QuoteRotator";
import s from "./customers.module.css";

/**
 * Results bento (DESIGN.md §G.15): the homepage Stories section, continued. Same red
 * backdrop stretch, same heading, same photo-card language; here every card shows its
 * headline number. The wide slot holds the Duna-style quote rotator (QuoteRotator).
 * Text colour crosses ink → white with the red, as on the homepage.
 */

const INK = "#111111";
const INK_MUTED = "#5a574f";
const ON_DARK = "#ffffff";
const ON_DARK_MUTED = "rgba(255, 255, 255, 0.78)";

function must(slug: string) {
  const st = getStory(slug);
  if (!st) throw new Error(`Unknown story: ${slug}`);
  return st;
}

/** Big-number tile. "photo" sits on the brand photo; "gradient" on Roma red + texture. */
function MetricTile({ story, kind, className = "" }: { story: CustomerStory; kind: "photo" | "gradient"; className?: string }) {
  const m = story.metrics[0];
  return (
    <Link href={storyHref(story.slug)} className={`${s.tile} ${className}`} data-kind={kind} data-reveal>
      {kind === "photo" ? (
        <Image
          src={story.photo.src}
          alt=""
          fill
          sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 26rem"
          quality={80}
          className={s.tilePhoto}
          style={{ objectPosition: story.photo.position }}
        />
      ) : (
        <Image src="/images/cta/texture-bg.webp" alt="" fill sizes="26rem" quality={60} className={s.tileTexture} />
      )}
      <span className={s.tileScrim} aria-hidden="true" />
      <BrandMark brand={story.brand} className={s.tileMark} />
      <span className={s.tileArrow} aria-hidden="true">
        <ArrowGlyph />
      </span>
      <span className={s.tileFoot}>
        <span className={s.tileFigure}>{m.figure}</span>
        <span className={s.tileLabel}>{m.label}</span>
      </span>
      <span className="sr-only">
        {story.brand.name}: {m.figure} {m.label}. {bentoCopy.read}
      </span>
    </Link>
  );
}

export default function ResultsBento() {
  const root = useRef<HTMLElement>(null);
  const { heading, lead, note } = bentoCopy;
  const { before, accent, after } = heading;
  const leadStory = must(bentoCopy.leadTile);
  const quotes = bentoCopy.quotes.map(must);
  const row = bentoCopy.row.map((r) => ({ story: must(r.slug), kind: r.kind }));

  useLayoutEffect(() => {
    const el = root.current;
    if (!el || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(el);
      gsap
        .timeline({ scrollTrigger: { trigger: el, ...BACKDROP_RANGES.red, scrub: true } })
        .fromTo(
          el,
          { "--st-fg": INK, "--st-muted": INK_MUTED },
          { "--st-fg": ON_DARK, "--st-muted": ON_DARK_MUTED, ease: "none", duration: 0.16 },
          0.42,
        )
        .to({}, { duration: 0 }, 1);
      gsap.fromTo(
        q("[data-char]"),
        { opacity: 0.4 },
        { opacity: 1, stagger: 0.02, duration: 0.2, ease: "none", scrollTrigger: { trigger: q("h2")[0], start: "top bottom", end: "top 30%", scrub: true } },
      );
      gsap.fromTo(
        q("[data-reveal]"),
        { autoAlpha: 0, y: 16 },
        { autoAlpha: 1, y: 0, duration: 0.5, ease: "power3.out", stagger: 0.08, scrollTrigger: { trigger: q("[data-bento]")[0], start: "top 80%", once: true } },
      );
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} className={s.bentoSection} data-backdrop="red" aria-labelledby="bento-heading">
      <div className={s.bentoInner}>
        <div className={s.bentoHead}>
          <h2 id="bento-heading" className={`${s.bentoHeading} type-h3`} aria-label={`${before}${accent}${after}`}>
            <span aria-hidden="true">
              {splitChars(before, false, "a")}
              {splitChars(accent, true, "b")}
              {splitChars(after, false, "c")}
            </span>
          </h2>
          <div className={s.bentoSide}>
            <p className={s.bentoLead}>{lead}</p>
            <p className={s.bentoNote}>{note}</p>
          </div>
        </div>

        <div className={s.bento} data-bento>
          <MetricTile story={leadStory} kind="photo" className={s.tileLead} />
          <div className={s.quoteSlot}>
            <QuoteRotator stories={quotes} />
          </div>
          {row.map((r) => (
            <MetricTile key={r.story.slug} story={r.story} kind={r.kind} />
          ))}
        </div>
      </div>
    </section>
  );
}
