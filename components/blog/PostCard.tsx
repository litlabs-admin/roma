import Image from "next/image";
import Link from "next/link";
import { formatDate, headingText, readMinutes, type Post } from "@/lib/content/blog";
import s from "./blog.module.css";

export function ArrowGlyph({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 11 11 5M6 5h5v5" />
    </svg>
  );
}

export function PostMeta({ post, className = "" }: { post: Post; className?: string }) {
  return (
    <p className={`${s.meta} ${className}`}>
      <time dateTime={post.date}>{formatDate(post.date)}</time>
      <span aria-hidden="true" className={s.metaDot} />
      <span>{readMinutes(post)} min read</span>
    </p>
  );
}

/**
 * Grid card (DESIGN.md §E.6 / §G.10): white, sand-300 border, image flush on top.
 * One link per card (the title, stretched over the card). Hover is border + title
 * underline + arrow nudge only; no image zoom or lift (§F.7).
 */
export default function PostCard({ post, headingLevel = 3 }: { post: Post; headingLevel?: 2 | 3 }) {
  const H = headingLevel === 2 ? "h2" : "h3";
  const { before, accent, after } = post.title;
  return (
    <article className={s.card} data-reveal>
      <div className={s.cardMedia}>
        <Image src={post.cover.src} alt="" fill sizes="(max-width: 767px) 100vw, (max-width: 991px) 50vw, 24rem" quality={75} className={s.img} />
      </div>
      <div className={s.cardBody}>
        <p className={`${s.cardCat} type-label`}>{post.category}</p>
        <H className={`${s.cardTitle} type-h5`}>
          <Link href={`/blogs/${post.slug}`} prefetch className={s.stretch} aria-label={headingText(post.title)}>
            <span className={s.titleLine}>
              {before}
              <span className="accent">{accent}</span>
              {after}
            </span>
          </Link>
        </H>
        <p className={s.cardExcerpt}>{post.excerpt}</p>
        <div className={s.cardFoot}>
          <PostMeta post={post} />
          <ArrowGlyph className={s.cardArrow} />
        </div>
      </div>
    </article>
  );
}
