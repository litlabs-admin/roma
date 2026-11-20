"use client";

import type { CSSProperties, ReactNode } from "react";
import { kitArt as K } from "@/lib/content/partners";
import { Glyph, RomaGlyph, at } from "@/components/platform/mock/kit";
import { usePlayOnce } from "./usePlayOnce";
import a from "./art.module.css";
import s from "./kit.module.css";

/**
 * Partner hub (DESIGN.md §G.16): one product window, the partner's own Roma workspace,
 * with one block per "Built to help you win" item (same order as `enablement`):
 * co-marketing webinar · sales kit · demo workspace · referral revenue · playbooks ·
 * partner manager. Replaces the scattered "kit" desk (client 20 Nov: looked unfinished).
 * Blocks rise in once in view. Pointing at an item in the list outlines its block in red
 * and steps the others back; the outer cell carries the GSAP entrance, the inner block
 * the CSS state, so they never fight over opacity.
 */

const W = 560;
const H = 460;

function Head({ label, children }: { label: string; children?: ReactNode }) {
  return (
    <span className={s.head}>
      <span className={a.mono}>{label}</span>
      {children}
    </span>
  );
}

function Gtm() {
  const g = K.gtm;
  return (
    <>
      <Head label={g.label}>
        <span className={`${a.pill} ${a.rose}`}>
          <Glyph k="calendar" />
          {g.kind}
        </span>
      </Head>
      <b className={s.webTitle}>{g.title}</b>
      <span className={s.webMeta}>
        <span className={s.cobrand}>
          <span className={s.mark}>
            <RomaGlyph />
          </span>
          {g.with}
        </span>
        <span>{g.when}</span>
      </span>
    </>
  );
}

function Sales() {
  return (
    <>
      <Head label={K.sales.label} />
      <span className={s.files}>
        {K.sales.files.map((f) => (
          <span key={f} className={s.file}>
            <Glyph k="file" className={s.fileIc} />
            {f}
            <Glyph k="download" className={s.fileDl} />
          </span>
        ))}
      </span>
    </>
  );
}

function Demo() {
  const d = K.demo;
  return (
    <>
      <Head label={d.label}>
        <span className={`${a.pill} ${s.sandbox}`}>{d.tag}</span>
      </Head>
      <span className={s.rows}>
        {d.rows.map((r) => (
          <span key={r.id} className={s.row}>
            <span className={`${a.av} ${s.rowAv}`}>{r.ch}</span>
            <b>{r.id}</b>
            <span className={`${a.pill} ${r.ok ? a.ok : a.red}`}>{r.ok ? "Valid" : "Disputed"}</span>
          </span>
        ))}
      </span>
    </>
  );
}

function Earnings() {
  const e = K.earnings;
  const max = Math.max(...e.bars);
  return (
    <>
      <Head label={e.label}>
        <span className={`${a.pill} ${a.ok}`}>{e.chip}</span>
      </Head>
      <span className={s.bars}>
        {e.bars.map((v, i) => (
          <span key={i} className={i === e.bars.length - 1 ? s.barOn : s.bar} style={{ height: `${(v / max) * 100}%` }} />
        ))}
      </span>
    </>
  );
}

function Playbooks() {
  return (
    <>
      <Head label={K.playbooks.label} />
      <span className={s.files}>
        {K.playbooks.items.map((t) => (
          <span key={t} className={s.file}>
            <Glyph k="book" className={s.fileIc} />
            {t}
          </span>
        ))}
      </span>
    </>
  );
}

function Manager() {
  const m = K.manager;
  return (
    <>
      <Head label={m.label} />
      <span className={s.mgr}>
        <span className={`${a.av} ${s.mgrAv}`}>{m.initials}</span>
        <b>{m.name}</b>
      </span>
      <span className={s.mgrActions}>
        <span className={`${a.pill} ${a.red}`}>
          <Glyph k="calendar" />
          {m.cta}
        </span>
        <span className={s.iconBtn}>
          <Glyph k="mail" />
        </span>
      </span>
    </>
  );
}

const BLOCKS = [Gtm, Sales, Demo, Earnings, Playbooks, Manager];

export default function PartnerKit({ active }: { active: number | null }) {
  const root = usePlayOnce((q, tl) => {
    tl.fromTo(q("[data-kit='win']"), { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.6 }).fromTo(
      q("[data-kit='cell']"),
      { autoAlpha: 0, y: 12 },
      { autoAlpha: 1, y: 0, duration: 0.45, stagger: 0.07 },
      0.25,
    );
  }, "top 80%");
  const w = K.window;

  return (
    <div ref={root} className={`${a.well} ${s.well}`} style={{ aspectRatio: `${W} / ${H}` }} aria-hidden="true">
      <div className={a.canvas} style={{ "--w": W } as CSSProperties}>
        <div className={`${a.paper} ${s.window}`} style={at(26, 30, 508, 446)} data-kit="win">
          <div className={s.bar0}>
            <span className={s.dots}>
              <i />
              <i />
              <i />
            </span>
            <span className={s.brand}>
              <span className={s.mark}>
                <RomaGlyph />
              </span>
              <b>{w.title}</b>
              <span className={s.firm}>· {w.firm}</span>
            </span>
            <span className={`${a.pill} ${a.rose}`}>{w.tag}</span>
          </div>
          <div className={`${s.grid} ${active !== null ? s.focusing : ""}`}>
            {BLOCKS.map((Block, i) => (
              <div key={i} className={s.cell} data-kit="cell">
                <div className={`${s.block} ${active === i ? s.on : ""}`}>
                  <Block />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
