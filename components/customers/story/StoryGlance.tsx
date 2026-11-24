import Button from "@/components/ui/Button";
import { glanceFacts, storyPageCopy, type CustomerStory } from "@/lib/content/customers";
import BrandMark from "../BrandMark";
import s from "./story.module.css";

/**
 * "At a glance" (DESIGN.md §G.15): the brand mark (its only appearance on the page), the
 * About line, the company facts and a demo CTA. Sticky beside the story from 992px;
 * a plain card above the summary below that.
 */
export default function StoryGlance({ story }: { story: CustomerStory }) {
  return (
    <aside className={s.glance} aria-labelledby="glance-heading">
      <div className={s.glanceCard}>
        <BrandMark brand={story.brand} className={s.glanceMark} />
        <h2 id="glance-heading" className={s.glanceHeading}>
          {storyPageCopy.glance}
        </h2>
        <p className={s.glanceAbout}>{story.about}</p>
        <dl className={s.glanceList}>
          {glanceFacts(story).map((f) => (
            <div key={f.label} className={s.glanceRow}>
              <dt>{f.label}</dt>
              <dd>{f.value}</dd>
            </div>
          ))}
        </dl>
        <Button href={storyPageCopy.glanceCta.href} size="small">
          {storyPageCopy.glanceCta.label}
        </Button>
      </div>
    </aside>
  );
}
