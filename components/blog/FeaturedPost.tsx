import Image from "next/image";
import Link from "next/link";
import { blogIndex, headingText, type Post } from "@/lib/content/blog";
import Monogram from "./Monogram";
import Reveal from "./Reveal";
import { ArrowGlyph, PostMeta } from "./PostCard";
import s from "./blog.module.css";

/**
 * Featured article (DESIGN.md §G.10): one white card, image left / body right ≥992px,
 * stacked below. The title link is stretched over the whole card; "Read the article"
 * is a visual affordance only, so there is one link per card.
 */
export default function FeaturedPost({ post }: { post: Post }) {
  const { before, accent, after } = post.title;
  return (
    <Reveal as="section" className={s.featuredSection} aria-labelledby="featured-title">
      <div className="container-lg">
        <article className={s.featured} data-reveal>
          <div className={s.featuredMedia}>
            <Image
              src={post.cover.src}
              alt={post.cover.alt}
              fill
              sizes="(max-width: 991px) 100vw, 40rem"
              quality={85}
              className={s.img}
            />
          </div>
          <div className={s.featuredBody}>
            <p className={s.featuredLabels}>
              <span className={`${s.featuredFlag} type-label`}>{blogIndex.featuredLabel}</span>
              <span className="type-label">{post.category}</span>
            </p>
            <h2 id="featured-title" className={`${s.featuredTitle} type-h3`}>
              <Link href={`/blogs/${post.slug}`} prefetch className={s.stretch} aria-label={headingText(post.title)}>
                <span className={s.titleLine}>
                  {before}
                  <span className="accent">{accent}</span>
                  {after}
                </span>
              </Link>
            </h2>
            <p className={s.featuredExcerpt}>{post.excerpt}</p>
            <div className={s.byline}>
              <Monogram initials={post.author.initials} />
              <div>
                <p className={s.bylineName}>{post.author.name}</p>
                <PostMeta post={post} />
              </div>
            </div>
            <span className={s.fauxLink} aria-hidden="true">
              <span>{blogIndex.readCta}</span>
              <ArrowGlyph className={s.fauxIcon} />
              <span className={s.fauxLine} />
            </span>
          </div>
        </article>
      </div>
    </Reveal>
  );
}
