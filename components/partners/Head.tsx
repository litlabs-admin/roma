import type { Heading } from "@/lib/content/platform";
import s from "./partners.module.css";

/**
 * Section head for /partners: mono label with the red square → h2 with one accent →
 * optional lead. `split` puts the lead beside the heading ≥992px. `data-pt-head` is the
 * rise hook each section animates.
 */
export default function Head({
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
        <p className={`${s.label} type-label`} data-pt-head>
          {label}
        </p>
        <h2 id={id} className={`${s.h2} type-h2`} data-pt-head>
          {heading.before}
          <span className="accent">{heading.accent}</span>
          {heading.after}
        </h2>
      </div>
      {lead && (
        <p className={s.lead} data-pt-head>
          {lead}
        </p>
      )}
    </header>
  );
}
