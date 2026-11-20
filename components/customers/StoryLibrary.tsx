"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Reveal from "@/components/blog/Reveal";
import Button from "@/components/ui/Button";
import { CATEGORIES, CUSTOMER_STORIES, libraryCopy, type CategoryKey } from "@/lib/content/customers";
import StoryCard from "./StoryCard";
import b from "@/components/blog/blog.module.css";
import s from "./customers.module.css";

type Filter = CategoryKey | "all";

function isFilter(v: string | null): v is Filter {
  return v === "all" || CATEGORIES.some((c) => c.key === v);
}

/**
 * Story library (DESIGN.md §G.15): the Blog grid sheet with category chips. "All" leads
 * with a wide featured card; a category shows its stories at equal size. The filter
 * syncs to `?cat=` so the hero's category links (and shared URLs) land filtered.
 */
function Library({ initial }: { initial: Filter }) {
  const [filter, setFilter] = useState<Filter>(initial);

  const counts = useMemo(() => {
    const m = new Map<Filter, number>([["all", CUSTOMER_STORIES.length]]);
    CATEGORIES.forEach((c) => m.set(c.key, CUSTOMER_STORIES.filter((st) => st.category === c.key).length));
    return m;
  }, []);
  const stories = filter === "all" ? CUSTOMER_STORIES : CUSTOMER_STORIES.filter((st) => st.category === filter);

  const choose = (f: Filter) => {
    setFilter(f);
    const url = f === "all" ? `${window.location.pathname}#library` : `${window.location.pathname}?cat=${f}#library`;
    window.history.replaceState(null, "", url);
  };

  const chips: { key: Filter; label: string }[] = [{ key: "all", label: libraryCopy.all }, ...CATEGORIES];
  const { before, accent, after } = libraryCopy.heading;

  return (
    <Reveal as="section" id="library" className={`${b.sheet} ${s.library}`} aria-labelledby="library-heading">
      <div className="container-lg">
        <div className={s.libraryHead}>
          <div className={s.libraryTitle}>
            <p className={`${b.sectionLabel} type-label`} data-reveal>
              {libraryCopy.label}
            </p>
            <h2 id="library-heading" className={`${b.gridHeading} type-h2`} data-reveal>
              {before}
              <span className="accent">{accent}</span>
              {after}
            </h2>
          </div>
          <p className={s.libraryLead} data-reveal>
            {libraryCopy.lead}
          </p>
        </div>

        <div className={s.chips} role="group" aria-label="Filter stories by category" data-reveal>
          {chips.map((c) => (
            <button
              key={c.key}
              type="button"
              className={s.chip}
              aria-pressed={filter === c.key}
              onClick={() => choose(c.key)}
            >
              {c.label}
              <span className={s.chipCount}>{counts.get(c.key)}</span>
            </button>
          ))}
        </div>

        <p className="sr-only" aria-live="polite">
          {stories.length} {stories.length === 1 ? "story" : "stories"}
        </p>

        {stories.length === 0 ? (
          <p className={s.empty}>{libraryCopy.empty}</p>
        ) : (
          <div key={filter} className={s.libraryGrid}>
            {stories.map((st, i) => {
              const featured = filter === "all" && i === 0;
              return <StoryCard key={st.slug} story={st} featured={featured} label={featured ? libraryCopy.featured : undefined} />;
            })}
            {filter === "all" && <YoursTile />}
          </div>
        )}
      </div>
    </Reveal>
  );
}

function YoursTile() {
  const y = libraryCopy.yours;
  return (
    <aside className={s.yours} aria-labelledby="yours-heading">
      <div>
        <p className={`${s.yoursLabel} type-label`}>{y.label}</p>
        <h3 id="yours-heading" className={`${s.yoursHeading} type-h4`}>
          {y.heading.before}
          <span className="accent">{y.heading.accent}</span>
          {y.heading.after}
        </h3>
        <p className={s.yoursBody}>{y.body}</p>
      </div>
      <div className={s.yoursActions}>
        <Button href={y.cta.href} variant="inverse" size="small">
          {y.cta.label}
        </Button>
        <Button href={y.secondary.href} variant="ghostOnDark" size="small">
          {y.secondary.label}
        </Button>
      </div>
    </aside>
  );
}

function FromParams() {
  const cat = useSearchParams().get("cat");
  const initial = isFilter(cat) ? cat : "all";
  // Keyed: a new ?cat= from a link (e.g. the hero) remounts with that filter.
  return <Library key={initial} initial={initial} />;
}

export default function StoryLibrary() {
  return (
    <Suspense fallback={<Library initial="all" />}>
      <FromParams />
    </Suspense>
  );
}
