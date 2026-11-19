import s from "./glimpseMark.module.css";

/**
 * Glimpse's mark (client-supplied SVG, public/logos/competitors/), rendered as a
 * single-ink CSS mask like every other third-party logo on the site (DESIGN.md §E.10):
 * never in Glimpse's own blue. Decorative: the name always sits beside it in text.
 */
export default function GlimpseMark({ className = "" }: { className?: string }) {
  return <span className={`${s.mark} ${className}`} aria-hidden="true" />;
}
