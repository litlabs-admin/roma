import type { Heading } from "@/lib/content/platform";
import type { Post } from "@/lib/content/blog";
import PostCard from "./PostCard";
import Reveal from "./Reveal";
import s from "./blog.module.css";

/**
 * Card grid in an opaque cream sheet whose rounded bottom corners sit on the closing CTA
 * (same hand-off as the FAQ sheet, DESIGN.md §G.6/§G.7). Used for "Latest" on /blogs and
 * "Keep reading" under an article.
 */
export default function PostGrid({ id, label, heading, posts }: { id: string; label: string; heading: Heading; posts: Post[] }) {
  return (
    <Reveal as="section" className={s.sheet} aria-labelledby={id}>
      <div className="container-lg">
        <div className={s.gridHead}>
          <p className={`${s.sectionLabel} type-label`} data-reveal>
            {label}
          </p>
          <h2 id={id} className={`${s.gridHeading} type-h2`} data-reveal>
            {heading.before}
            <span className="accent">{heading.accent}</span>
            {heading.after}
          </h2>
        </div>
        <div className={s.grid}>
          {posts.map((p) => (
            <PostCard key={p.slug} post={p} />
          ))}
        </div>
      </div>
    </Reveal>
  );
}
