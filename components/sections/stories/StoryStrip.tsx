"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, type CSSProperties } from "react";
import type { Story } from "./data";
import s from "./stories.module.css";

/**
 * The card row + quote from Hyperline's Testimonials, shared by the homepage Stories
 * section (G.5, `tone="backdrop"`: text follows the red backdrop) and /customers (G.15,
 * `tone="cream"`: ink quote on a cream-200 panel, taller cards, a story link on the
 * active card).
 *
 * Cards share a row with `flex-basis: 0`; the active one grows to 3× (flex-grow 3:1,
 * 500ms ease-out). Below 1024px they stack and the active one grows in height instead.
 * Inactive cards are full-card buttons; the quote below follows the active card.
 */

function LogoMark({ story }: { story: Story }) {
  if (!story.logo) return <span className={s.wordmark}>{story.brand}</span>;
  const style = { "--logo": `url(${story.logo.src})`, aspectRatio: `${story.logo.w} / ${story.logo.h}` } as CSSProperties;
  return <span className={s.logo} style={style} role="img" aria-label={story.brand} />;
}

function Arrow() {
  return (
    <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 8h10M9 4l4 4-4 4" />
    </svg>
  );
}

export default function StoryStrip({
  stories,
  tone = "backdrop",
  storyLink = false,
  priority = false,
}: {
  stories: Story[];
  tone?: "backdrop" | "cream";
  /** "Customer story →" pill on the active card (Hyperline customers page). */
  storyLink?: boolean;
  /** First card is the LCP image (above the fold on /customers). */
  priority?: boolean;
}) {
  const [active, setActive] = useState(0);
  const story = stories[active];

  return (
    <div className={`${s.stories} ${tone === "cream" ? s.cream : ""}`}>
      <ul className={s.row}>
        {stories.map((st, i) => {
          const on = i === active;
          return (
            <li key={st.id} className={s.card} data-active={on || undefined} style={{ flexGrow: on ? 3 : 1 }}>
              <Image
                src={st.photo.src}
                alt=""
                fill
                sizes="(max-width: 1023px) 100vw, 45rem"
                quality={85}
                className={s.photo}
                style={{ objectPosition: st.photo.position }}
                {...(priority && i === 0 ? { loading: "eager" as const, fetchPriority: "high" as const } : {})}
              />
              <span className={s.scrim} aria-hidden="true" />
              {!on && (
                <button type="button" className={s.hit} onClick={() => setActive(i)} aria-label={`Show ${st.brand}'s story`} />
              )}
              <div className={s.bar}>
                <LogoMark story={st} />
                <div className={s.extras} aria-hidden={!on}>
                  <span className={s.metric}>{st.metric}</span>
                  {storyLink && on && (
                    <Link href={st.href} className={s.storyLink}>
                      Customer story
                      <Arrow />
                      <span className="sr-only">: {st.brand}</span>
                    </Link>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      <figure className={s.quote} aria-live="polite">
        <div key={active} className={s.quoteInner}>
          <blockquote className={s.quoteText}>{story.quote}</blockquote>
          <figcaption className={s.author}>{story.author}</figcaption>
        </div>
      </figure>
    </div>
  );
}
