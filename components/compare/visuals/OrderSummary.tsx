"use client";

import { useId, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import Image from "next/image";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/motion";
import { ROMA_RECEIPT } from "@/lib/content/compare/roma";
import type { PromomashStory } from "@/lib/content/compare/types";
import Cite from "../Cite";
import CompetitorLogo from "../CompetitorLogo";
import SwitchCard from "../Switch";
import s from "./order.module.css";

/**
 * Promomash "What you sign up for" (DESIGN.md §G.13) as a compact order summary in the
 * shared switch card; sized to fit one screen. A volume control sits above both sides
 * (the micro-interaction): pick a monthly deduction-invoice volume (illustrative).
 * Promomash's sheet lists its published plan terms, cited; its volume meter rises with
 * the pick and the total stays "Custom quote" (it publishes no price). Roma's sheet is
 * shorter on purpose: its $399 counts up when revealed and holds at every volume (a
 * "same price" tick flashes on each change). No claims about Roma's contract terms.
 */

const fmt = (n: number) => n.toLocaleString("en-US");
const PRICE = 399;

/** "$399", counting up from $0 the first time it is shown. SSR prints the final figure. */
function CountUp({ active, className }: { active: boolean; className?: string }) {
  const el = useRef<HTMLSpanElement>(null);
  const played = useRef(false);
  useLayoutEffect(() => {
    const node = el.current;
    if (!active || played.current || !node || prefersReducedMotion()) return;
    played.current = true;
    const v = { n: 0 };
    const tw = gsap.to(v, {
      n: PRICE,
      duration: 1.1,
      delay: 0.35,
      ease: "power3.out",
      onUpdate: () => void (node.textContent = `$${Math.round(v.n)}`),
    });
    return () => {
      tw.kill();
      node.textContent = `$${PRICE}`;
    };
  }, [active]);
  return (
    <span ref={el} className={className}>
      ${PRICE}
    </span>
  );
}

export default function OrderSummary({ terms }: { terms: PromomashStory["terms"] }) {
  const labelId = useId();
  const [vol, setVol] = useState(terms.volumes[1] ?? terms.volumes[0]);
  const [changed, setChanged] = useState(0);
  const max = Math.max(...terms.volumes);
  const fill = { ["--fill" as string]: `${Math.max(8, (vol / max) * 100)}%` } as CSSProperties;
  const r = ROMA_RECEIPT;
  const price = terms.clauses.find((cl) => cl.price);
  const rest = terms.clauses.filter((cl) => !cl.price);

  const pick = (v: number) => {
    if (v === vol) return;
    setVol(v);
    setChanged((n) => n + 1);
  };

  const toolbar = (
    <>
      <span className={s.volLabel} id={labelId}>
        Monthly deduction invoices
      </span>
      <span className={s.chips} role="group" aria-labelledby={labelId}>
        {terms.volumes.map((v) => (
          <button key={v} type="button" className={s.chip} aria-pressed={v === vol} onClick={() => pick(v)}>
            {fmt(v)}
          </button>
        ))}
      </span>
      <span className={s.illus}>Illustrative</span>
    </>
  );

  return (
    <SwitchCard
      label="What you sign up for"
      toolbar={toolbar}
      announce={{
        them: `Showing Promomash’s published plan terms, priced on monthly deduction invoice volume.`,
        roma: "Showing Roma: from $399 a month at any volume, live in under 5 minutes, no ERP or IT project.",
      }}
      takeaway={{
        them: "Priced on your volume, with a one-year commitment.",
        roma: "$399 a month, flat, live in under 5 minutes.",
      }}
      them={() => (
        <div className={s.pane}>
          <div className={s.sheet}>
            <p className={s.head} data-sw-item>
              <CompetitorLogo label height={1.1} />
              <span className={s.kicker}>Plan terms, as published</span>
              <span className={s.stamp}>{terms.stamp}</span>
            </p>
            <dl className={s.lines}>
              {price && (
                <div className={`${s.line} ${s.linePrice}`} data-sw-item>
                  <dt>{price.label}</dt>
                  <dd>
                    <span className={s.meterHead}>
                      <span>DI volume to process</span>
                      <b>{fmt(vol)} / mo</b>
                    </span>
                    <span className={s.meter} style={fill} aria-hidden="true">
                      <i />
                    </span>
                    <span className={s.said}>
                      “{price.text}”{price.source && <Cite id={price.source} />}
                    </span>
                  </dd>
                </div>
              )}
              {rest.map((cl) => (
                <div key={cl.label} className={s.line} data-sw-item>
                  <dt>{cl.label}</dt>
                  <dd>
                    <span className={s.said}>
                      “{cl.text}”{cl.source && <Cite id={cl.source} />}
                    </span>
                  </dd>
                </div>
              ))}
            </dl>
            <p className={s.total} data-sw-item>
              <span>Total at {fmt(vol)} / mo</span>
              <b className={s.totalThem}>Custom quote</b>
            </p>
          </div>
        </div>
      )}
      roma={(active) => (
        <div className={s.pane}>
          <div className={`${s.sheet} ${s.sheetRoma}`}>
            <p className={s.head} data-sw-item>
              <Image src="/brand/roma-logo.png" alt="Roma" width={464} height={106} className={s.romaLogo} />
              <span className={s.kicker}>Your plan</span>
              <span className={`${s.stamp} ${s.stampRoma}`}>Published</span>
            </p>
            <dl className={s.lines}>
              {r.lines.map((l) => (
                <div key={l.k} className={s.line} data-sw-item>
                  <dt>{l.k}</dt>
                  <dd className={s.romaVal}>{l.v}</dd>
                </div>
              ))}
              <div className={s.line} data-sw-item>
                <dt>Volume</dt>
                <dd>
                  <span key={changed} className={`${s.same} ${changed ? s.flash : ""}`}>
                    ✓ Same price at {fmt(vol)} / mo
                  </span>
                  <span className={s.said}>Not priced on your deduction volume.</span>
                </dd>
              </div>
            </dl>
            <p className={s.total} data-sw-item>
              <span>From</span>
              <b className={s.totalRoma}>
                <CountUp active={active} />
                <small>{r.per}</small>
              </b>
            </p>
            <p className={s.foot} data-sw-item>
              {r.foot}
            </p>
          </div>
        </div>
      )}
    />
  );
}
