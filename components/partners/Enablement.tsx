"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/motion";
import { ILLUSTRATIVE_ART, enablement, enablementHead } from "@/lib/content/partners";
import { refreshWhenReady, rise } from "@/components/platform/motion";
import Head from "./Head";
import PartnerKit from "./art/PartnerKit";
import p from "./partners.module.css";
import s from "./enablement.module.css";

/**
 * Built to help you win (DESIGN.md §G.16; Cygnet's enablement grid): the partner kit
 * illustration (art/PartnerKit.tsx) beside the six items as hairline ledger rows.
 * Pointing at an item lifts its object in the kit (pointer devices only; the list is
 * complete on its own). Every item is MOCK program content.
 */
export default function Enablement() {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState<number | null>(null);

  useLayoutEffect(() => {
    const el = root.current;
    if (!el || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(el);
      rise(q("[data-pt-head]"), el);
      rise(q("[data-en='item']"), q("[data-en='list']")[0], { start: "top 85%", stagger: 0.07 });
    }, el);
    const off = refreshWhenReady();
    return () => {
      off();
      ctx.revert();
    };
  }, []);

  return (
    <section ref={root} className={p.section} aria-labelledby="pt-enable">
      <div className={p.inner}>
        <Head id="pt-enable" label={enablementHead.label} heading={enablementHead.heading} />
        <div className={s.layout}>
          <figure className={s.art}>
            <PartnerKit active={active} />
            <figcaption className={s.caption}>{ILLUSTRATIVE_ART}</figcaption>
          </figure>
          <ol className={s.list} data-en="list" onMouseLeave={() => setActive(null)}>
            {enablement.map((e, i) => (
              <li key={e.title} className={`${s.item} ${active === i ? s.itemOn : ""}`} data-en="item" onMouseEnter={() => setActive(i)}>
                <span className={s.num}>{String(i + 1).padStart(2, "0")}</span>
                <span className={s.body}>
                  <h3 className={`${s.title} type-h5`}>{e.title}</h3>
                  <p className={s.text}>{e.text}</p>
                </span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
