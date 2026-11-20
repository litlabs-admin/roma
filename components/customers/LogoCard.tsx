import Link from "next/link";
import { customersCopy, storyHref, type CustomerStory } from "@/lib/content/customers";
import BrandMark from "./BrandMark";
import s from "./customers.module.css";

/**
 * Story card (DESIGN.md §G.15, Hyperline customers grid): brand mark top-left on a
 * cream-200 surface; product kicker, "How {brand} …" title and "Read story →" at the
 * foot. One link per card (the title, stretched over the card). No photo, no shadow.
 */
export default function LogoCard({ story, headingLevel = 3 }: { story: CustomerStory; headingLevel?: 2 | 3 }) {
  const H = headingLevel === 2 ? "h2" : "h3";
  return (
    <article className={s.card} data-reveal>
      <BrandMark brand={story.brand} className={s.cardMark} />
      <div className={s.cardBody}>
        <p className={`${s.cardKicker} type-label`}>{story.product}</p>
        <H className={s.cardTitle}>
          <Link href={storyHref(story.slug)} prefetch className={s.stretch}>
            {story.cardTitle}
          </Link>
        </H>
        <span className={s.cardRead} aria-hidden="true">
          {customersCopy.read}
          <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 8h10M9 4l4 4-4 4" />
          </svg>
        </span>
      </div>
    </article>
  );
}
