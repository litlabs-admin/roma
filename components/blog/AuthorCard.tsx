import type { Author } from "@/lib/content/blog";
import Monogram from "./Monogram";
import a from "./article.module.css";

/** §E.6 card closing the article: who wrote it (DESIGN.md §G.10). */
export default function AuthorCard({ author }: { author: Author }) {
  return (
    <aside id="author" className={a.authorCard} aria-label="About the author" data-reveal>
      <Monogram initials={author.initials} size="lg" />
      <div>
        <p className={`${a.authorCardLabel} type-label`}>Written by</p>
        <p className={a.authorCardName}>{author.name}</p>
        <p className={a.authorCardRole}>{author.role}</p>
        <p className={a.authorCardBio}>{author.bio}</p>
      </div>
    </aside>
  );
}
