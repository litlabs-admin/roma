import { storyPageCopy, type CustomerStory } from "@/lib/content/customers";
import s from "./story.module.css";

const ORDER = ["challenge", "solution", "channels", "results"] as const;

/**
 * The 2×2 summary (DESIGN.md §G.15; Hyperline's Challenge / Solution / Pricing model /
 * Results, with Channels in place of pricing). The brand's logo and About text live in
 * the "At a glance" card (StoryGlance), so the mark appears once on the page.
 */
export default function StorySummary({ story }: { story: CustomerStory }) {
  return (
    <section className={s.summary} aria-label={`${story.brand.name}: summary`} data-reveal>
      <dl className={s.facts}>
        {ORDER.map((key) => (
          <div key={key} className={s.fact}>
            <dt>{storyPageCopy.summary[key]}</dt>
            <dd>{story.summary[key]}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
