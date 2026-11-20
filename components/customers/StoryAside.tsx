import Image from "next/image";
import Button from "@/components/ui/Button";
import Monogram from "@/components/blog/Monogram";
import { categoryLabel, storyPageCopy, type CustomerStory } from "@/lib/content/customers";
import s from "./story.module.css";

/** "At a glance" card for the case-study sidebar (DESIGN.md §G.15). Sticky ≥992px. */
export function StoryFacts({ story }: { story: CustomerStory }) {
  const f = storyPageCopy.facts;
  const rows: [string, string | undefined][] = [
    [f.company, story.brand.name],
    [f.category, `${categoryLabel(story.category)} · ${story.product}`],
    [f.channels, story.channels.join(", ")],
    [f.team, story.facts.team],
    [f.hq, story.facts.hq],
    [f.since, story.facts.since],
  ];
  return (
    <aside className={s.facts} aria-label={storyPageCopy.glance}>
      <p className={`${s.factsLabel} type-label`}>{storyPageCopy.glance}</p>
      <dl className={s.factsList}>
        {rows
          .filter((r): r is [string, string] => Boolean(r[1]))
          .map(([k, v]) => (
            <div key={k} className={s.fact}>
              <dt>{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
      </dl>
      <Button href={storyPageCopy.try.href} size="small">
        {storyPageCopy.try.label}
      </Button>
      <p className={s.factsNote}>{storyPageCopy.note}</p>
    </aside>
  );
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

/** Large pull quote with portrait (or a monogram when there is none). */
export function StoryQuote({ story }: { story: CustomerStory }) {
  const { quote } = story;
  const who = quote.name ?? story.brand.name;
  return (
    <figure className={s.pull} data-reveal>
      <svg className={s.pullMark} viewBox="0 0 32 24" aria-hidden="true">
        <path d="M0 24V14C0 6 4.5 1.3 12.5 0l1.3 3.4C9.4 4.8 7.3 7.6 7 11.5h6V24H0Zm18 0V14c0-8 4.5-12.7 12.5-14l1.3 3.4c-4.4 1.4-6.5 4.2-6.8 8.1h6V24H18Z" />
      </svg>
      <blockquote className={s.pullText}>{quote.text}</blockquote>
      <figcaption className={s.pullWho}>
        {quote.portrait ? (
          <span className={s.pullPortrait}>
            <Image src={quote.portrait.src} alt="" fill sizes="3.5rem" className={s.pullImg} />
          </span>
        ) : (
          <Monogram initials={initials(who)} size="md" />
        )}
        <span className={s.pullText2}>
          <span className={s.pullName}>{quote.name ?? quote.role}</span>
          <span className={s.pullRole}>{quote.name ? `${quote.role}, ${story.brand.name}` : story.brand.name}</span>
        </span>
      </figcaption>
    </figure>
  );
}
