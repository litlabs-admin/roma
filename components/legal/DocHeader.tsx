import d from "./doc.module.css";

/** Static header band for the reference pages (legal + deduction codes). */
export default function DocHeader({ kicker, title, lead, meta }: { kicker: string; title: string; lead: string; meta?: string }) {
  return (
    <header className={d.header} data-hero>
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
