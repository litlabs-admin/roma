import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowGlyph } from "@/components/blog/PostCard";
import { attribution, categoryLabel, pillText, storyHref, type CustomerStory } from "@/lib/content/customers";
import b from "@/components/blog/blog.module.css";
import s from "./customers.module.css";

/** Brand logo as a single-ink mask in currentColor, or a serif wordmark. */
export function BrandMark({ brand, className = "" }: { brand: CustomerStory["brand"]; className?: string }) {
  if (!brand.logo) return <span className={`${s.wordmark} ${className}`}>{brand.name}</span>;
  const style = { "--logo": `url(${brand.logo.src})`, aspectRatio: `${brand.logo.w} / ${brand.logo.h}` } as CSSProperties;
  return <span className={`${s.logo} ${className}`} style={style} role="img" aria-label={brand.name} />;
}

/**
 * Story card (DESIGN.md §G.15): the homepage photo card (scrim, white brand mark, metric
 * pill) on top of a Blog post card body (§E.6). One link per card: the title, stretched.
 * Hover comes from the blog card rules: border, title underline, arrow nudge (§F.7).
 * `featured` lays it out wide (media left, body right) with the excerpt and quote.
 */
export default function StoryCard({ story, featured = false, label }: { story: CustomerStory; featured?: boolean; label?: string }) {
  const { before, accent, after } = story.headline;
  return (
    <article className={`${b.card} ${s.storyCard}`} data-featured={featured || undefined} data-reveal>
      <div className={s.cardMedia}>
        <Image
          src={story.photo.src}
          alt=""
          fill
          sizes={featured ? "(max-width: 639px) 100vw, (max-width: 991px) 100vw, 36rem" : "(max-width: 639px) 100vw, (max-width: 991px) 50vw, 24rem"}
          quality={80}
          className={s.cardPhoto}
          style={{ objectPosition: story.photo.position }}
        />
        <span className={s.cardScrim} aria-hidden="true" />
        <BrandMark brand={story.brand} className={s.cardMark} />
        <span className={s.pill}>{pillText(story)}</span>
      </div>

      <div className={`${b.cardBody} ${s.cardBody}`}>
        <p className={`${b.cardCat} type-label`}>
          {label && <span className={s.flag}>{label}</span>}
          {categoryLabel(story.category)} · {story.product}
        </p>
        <h3 className={`${b.cardTitle} ${featured ? "type-h4" : "type-h5"}`}>
          <Link href={storyHref(story.slug)} prefetch className={b.stretch} aria-label={`${story.brand.name}: ${before}${accent}${after}`}>
            <span className={b.titleLine}>
              {before}
              <span className="accent">{accent}</span>
              {after}
            </span>
          </Link>
        </h3>
        <p className={b.cardExcerpt}>{story.excerpt}</p>
        {featured && (
          <figure className={s.cardQuote}>
            <blockquote>“{story.quote.text}”</blockquote>
            <figcaption>{attribution(story)}</figcaption>
          </figure>
        )}
        <div className={b.cardFoot}>
          <span className={s.cardChannels}>{story.channels.join(" · ")}</span>
          <ArrowGlyph className={b.cardArrow} />
        </div>
      </div>
    </article>
  );
}
