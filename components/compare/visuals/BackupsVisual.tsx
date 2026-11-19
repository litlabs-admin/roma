"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/motion";
import { Glyph, SourcePill } from "@/components/platform/mock/kit";
import s from "./backups.module.css";

/**
 * The `backups` visual (DESIGN.md §G.13; Sales Battle Cards "Download All backups" and
 * "Auto Backup Request"). Top: one check's remittance advice and its deduction backups
 * are ticked off one by one and land in a single zip. Bottom: the request track for a
 * missing backup: check arrives (day 0) → Roma asks the distributor (day 3) → follows up
 * every 15 days → backup arrives, Roma stops. Illustrative data; no promise of how fast
 * distributors reply. SSR markup is the finished state.
 */

const DOCS = ["Remittance advice", "Backup · MCB", "Backup · Shortage", "Backup · Spoils", "Backup · Fee"];
const STEPS = [
  { day: "Day 0", node: "0", text: "Check arrives. Roma looks for every backup." },
  { day: "Day 3", node: "3", text: "Still missing? Roma emails the distributor." },
  { day: "Every 15 days", node: "15", text: "Roma follows up until it lands." },
  { day: "Done", node: "", text: "The backup arrives. Roma stops." },
];

export default function BackupsVisual() {
  const root = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = root.current;
    if (!el || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(el);
      const tl = gsap.timeline({ paused: true, defaults: { ease: "power3.out" } });
      tl.fromTo(q("[data-bk='tick']"), { autoAlpha: 0, scale: 0.4 }, { autoAlpha: 1, scale: 1, duration: 0.3, stagger: 0.14, ease: "back.out(2)" }, 0.2)
        .fromTo(q("[data-bk='zip']"), { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.5 }, 0.95)
        .fromTo(q("[data-bk='rail']"), { scaleX: 0 }, { scaleX: 1, duration: 1.2, ease: "power1.inOut" }, 1.25)
        .fromTo(q("[data-bk='node']"), { autoAlpha: 0.3 }, { autoAlpha: 1, duration: 0.3, stagger: 0.3 }, 1.25);
      ScrollTrigger.create({ trigger: el, start: "top 75%", once: true, onEnter: () => void tl.play() });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={root} className={s.window} aria-hidden="true">
      <div className={s.check}>
        <div className={s.checkHead}>
          <SourcePill>UNFI</SourcePill>
          <b>Check #48213</b>
          <span className={s.checkAmt}>$12,563.64</span>
        </div>
        <ul className={s.docs}>
          {DOCS.map((d) => (
            <li key={d} className={s.doc}>
              <Glyph k="file" className={s.docIcon} />
              <span>{d}</span>
              <span className={s.tick} data-bk="tick">
                <Glyph k="check" />
              </span>
            </li>
          ))}
        </ul>
        <div className={s.zip} data-bk="zip">
          <Glyph k="download" className={s.zipIcon} />
          <span>
            <b>check-48213.zip</b>
            <em>{DOCS.length} files · one download</em>
          </span>
        </div>
      </div>

      <div className={s.request}>
        <p className={s.reqHead}>
          <span className={s.newBadge}>New</span>
          Auto Backup Request
        </p>
        <div className={s.trackWrap}>
          <span className={s.rail} aria-hidden="true">
            <span className={s.railFill} data-bk="rail" />
          </span>
          <ol className={s.track}>
          {STEPS.map((st) => (
            <li key={st.day} className={s.step} data-bk="node">
              <span className={`${s.node} ${st.node ? "" : s.nodeDone}`}>{st.node || <Glyph k="check" />}</span>
              <b>{st.day}</b>
              <span>{st.text}</span>
            </li>
          ))}
          </ol>
        </div>
      </div>
      <p className={s.foot}>Illustrative data.</p>
    </div>
  );
}
