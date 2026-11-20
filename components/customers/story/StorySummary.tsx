import { storyPageCopy, type CustomerStory } from "@/lib/content/customers";
import BrandMark from "../BrandMark";
import s from "./story.module.css";

const ORDER = ["challenge", "solution", "channels", "results"] as const;

/**
 * "About {brand}" + the 2×2 summary (DESIGN.md §G.15; Hyperline's Challenge / Solution /
 * Pricing model / Results, with Channels in place of pricing).
 */
export default function StorySummary({ story }: { story: CustomerStory }) {
  return (
    <section className={s.summary} aria-label={`${storyPageCopy.about} ${story.brand.name}`} data-reveal>
      <div className={s.about}>
        <BrandMark brand={story.brand} className={s.aboutMark} />
        <p>{story.about}</p>
      </div>
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
