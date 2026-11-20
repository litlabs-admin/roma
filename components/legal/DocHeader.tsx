import d from "./doc.module.css";

/**
 * Header for the reference pages.
 * - `dark` (default; currently unused since /deduction-codes moved to the Blog hero):
 *   the red-950 band, left-aligned, [data-hero].
 * - `light` (legal pages, client 20 Nov 2026): on the cream page, centred, ink text, a
 *   hairline closing it off; [data-nav-light] keeps the nav solid cream from the top.
 */
export default function DocHeader({
  kicker,
  title,
  lead,
  meta,
  tone = "dark",
}: {
  kicker: string;
  title: string;
  lead: string;
  meta?: string;
  tone?: "dark" | "light";
}) {
  const light = tone === "light";
  return (
    <header className={`${d.header} ${light ? d.headerLight : ""}`} {...(light ? { "data-nav-light": "" } : { "data-hero": "" })}>
      <div className={d.inner}>
        <p className={`${d.kicker} type-label`}>{kicker}</p>
        <h1 id="doc-title" className={`${d.title} type-h1`}>
          {title}
        </h1>
        <p className={d.lead}>{lead}</p>
        {meta && <p className={d.meta}>{meta}</p>}
      </div>
    </header>
  );
}
