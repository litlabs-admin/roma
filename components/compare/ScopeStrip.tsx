import type { CSSProperties } from "react";
import Image from "next/image";
import type { PromomashStory } from "@/lib/content/compare/types";
import CompetitorLogo from "./CompetitorLogo";
import Cite from "./Cite";
import c from "./compare.module.css";
import s from "./scopeStrip.module.css";

/**
 * Promomash scope (DESIGN.md §G.13): its three areas, named from its own page title,
 * bracketed under its logo; Roma's bracket covers only Deduction Management. A compact
 * band after the terms section, not a full feature: one point, made once.
 */
export default function ScopeStrip({ scope }: { scope: PromomashStory["scope"] }) {
  const n = scope.modules.length;
  const at = scope.modules.findIndex((m) => m.roma);
  return (
    <section className={`${c.section} ${c.sectionTight}`} aria-labelledby="scope-heading">
      <div className={c.inner}>
        <div className={s.band}>
          <div className={s.text}>
            <p className={`${c.label} type-label`}>Scope</p>
            <h2 id="scope-heading" className={s.title}>
              {scope.heading.before}
              <span className="accent">{scope.heading.accent}</span>
              {scope.heading.after}
            </h2>
            <p className={s.lead}>{scope.lead}</p>
          </div>

          <figure className={s.map} style={{ ["--n" as string]: n, ["--at" as string]: at + 1 } as CSSProperties}>
            <div className={s.them}>
              <CompetitorLogo label height={1.2} />
              <span className={s.bracket} aria-hidden="true" />
            </div>
            <ul className={s.modules}>
              {scope.modules.map((m) => (
                <li key={m.name} className={`${s.module} ${m.roma ? s.moduleRoma : ""}`}>
                  {m.name}
                </li>
              ))}
            </ul>
            <div className={s.roma}>
              <span className={`${s.bracket} ${s.bracketRoma}`} aria-hidden="true" />
              <Image src="/brand/roma-logo.png" alt="Roma" width={464} height={106} className={s.romaLogo} />
              <span className={s.romaNote}>Built only for deductions</span>
            </div>
            <figcaption className={s.cap}>
              Promomash’s areas, from its page title
              <Cite id={scope.source} />
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
