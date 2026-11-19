import type { Heading } from "@/lib/content/platform";
import s from "./compare.module.css";

/**
 * Section head for /compare/glimpse: mono label with the red square → h2 with one
 * serif accent → lead. `split` puts the lead beside the heading ≥992px (the analytics
 * DrillDown header); otherwise it stacks. `data-cmp-head` is the rise hook.
 */
export default function SectionHead({
  id,
  label,
  heading,
  lead,
  split = false,
  center = false,
}: {
  id: string;
  label: string;
  heading: Heading;
  lead?: string;
  split?: boolean;
  center?: boolean;
}) {
  return (
    <header className={`${s.head} ${split ? s.headSplit : ""} ${center ? s.headCenter : ""}`}>
      <div className={s.headMain}>
        <p className={`${s.label} type-label`} data-cmp-head>
          {label}
        </p>
        <h2 id={id} className={`${s.h2} type-h2`} data-cmp-head>
          {heading.before}
          <span className="accent">{heading.accent}</span>
          {heading.after}
        </h2>
      </div>
      {lead && (
        <p className={s.lead} data-cmp-head>
          {lead}
        </p>
      )}
    </header>
  );
}
