import type { ComponentType, CSSProperties } from "react";
import { gsap } from "@/lib/gsap";
import { pile, split, timeCards, type CaseStory } from "@/lib/content/customers";
import { Glyph, TypeChip, at, money } from "@/components/platform/mock/kit";
import a from "./artifacts.module.css";

/**
 * Chapter centrepieces for /customers (DESIGN.md §G.15). Each one is a different object
 * with one state change, played once on enter by CaseFiles:
 * - pile: written-off slips leave their folder and become credited disputes along six
 *   months (shape only, no monthly amounts), the folder's "Written off" gets struck;
 * - card: the ops lead's time card before Roma is punched, then filed behind the new one;
 * - split: one booked expense line splits by retailer, and one retailer opens by type.
 * Markup is the final state. Decorative: CaseFile renders an sr-only summary.
 */

type Play = (root: HTMLElement) => gsap.core.Timeline;

/* ── 01 · the write-off pile (560 × 440) ───────────────────────────────── */

const TRACK = { x0: 46, x1: 514, y: 380 };
const tickX = (i: number) => TRACK.x0 + (i * (TRACK.x1 - TRACK.x0)) / (pile.months.length - 1);
const TILT = [-3, 2, -2, 3, -1, 2];

function Pile() {
  return (
    <div className={a.canvas} style={{ "--cw": 560 } as CSSProperties}>
      <div className={a.folder} style={at(30, 40, 236, 156)} data-pl="folder">
        <span className={a.folderTab} />
        <span className={a.folderStamp}>
          {pile.stamp}
          <svg viewBox="0 0 100 20" preserveAspectRatio="none" aria-hidden="true">
            <path d="M2 12 L98 8" data-pl="strike" />
          </svg>
        </span>
        <span className={a.folderEmpty} data-pl="empty">
          {pile.empty}
        </span>
      </div>

      <p className={a.total} style={at(300, 36, 230)}>
        <span className={a.mono}>{pile.total.label}</span>
        <span className={a.totalFigure} aria-hidden="true">
          $<span data-pl="count" data-to="53">53</span>K
        </span>
        <span className={a.totalSub}>in 6 months</span>
      </p>

      <span className={a.rail} style={at(TRACK.x0, TRACK.y, TRACK.x1 - TRACK.x0, 3)}>
        <span className={a.railFill} data-pl="fill" />
      </span>
      {pile.months.map((m, i) => (
        <span key={m} className={a.tick} style={at(tickX(i), TRACK.y + 1.5)}>
          <i />
          <b>{m}</b>
        </span>
      ))}

      {pile.slips.map((sl, i) => {
        const [portal, type] = sl.ref.split(" · ");
        return (
          <span key={sl.ref} className={a.slip} style={{ ...at(tickX(sl.m) - 38, 258, 76, 106), "--r": `${TILT[i]}deg` } as CSSProperties} data-pl="slip" data-r={TILT[i]}>
            <span className={a.slipRef}>
              <b>{portal}</b>
              {type}
            </span>
            <span className={a.slipLines}>
              <i />
              <i />
              <i />
            </span>
            <span className={a.credited} data-pl="chip">
              <Glyph k="check" />
              {pile.credited}
            </span>
          </span>
        );
      })}
    </div>
  );
}

const playPile: Play = (root) => {
  const q = gsap.utils.selector(root);
  const slips = q("[data-pl='slip']") as HTMLElement[];
  const folder = (q("[data-pl='folder']") as HTMLElement[])[0];
  const count = (q("[data-pl='count']") as HTMLElement[])[0];
  gsap.set(slips, { x: 0, y: 0, rotation: (i: number) => Number(slips[i].dataset.r) });
  const f = folder.getBoundingClientRect();
  const from = slips.map((sl, i) => {
    const r = sl.getBoundingClientRect();
    return { x: f.left + f.width * 0.5 - (r.left + r.width / 2) + (i - 2.5) * 3, y: f.top + f.height * 0.58 - (r.top + r.height / 2) - i * 2 };
  });
  const n = { v: 0 };
  return gsap
    .timeline()
    .fromTo(q("[data-pl='chip']"), { autoAlpha: 0, scale: 0.6 }, { autoAlpha: 1, scale: 1, duration: 0.35, ease: "back.out(2.2)", stagger: 0.16 }, 1.15)
    .fromTo(
      slips,
      { x: (i: number) => from[i].x, y: (i: number) => from[i].y, rotation: (i: number) => (i % 2 ? 6 : -5) + i, scale: 0.92 },
      { x: 0, y: 0, rotation: (i: number) => Number(slips[i].dataset.r), scale: 1, duration: 0.85, ease: "power2.inOut", stagger: 0.16 },
      0.25,
    )
    .fromTo(q("[data-pl='fill']"), { scaleX: 0 }, { scaleX: 1, duration: 1.7, ease: "power1.inOut" }, 0.5)
    .fromTo(n, { v: 0 }, { v: Number(count.dataset.to), duration: 1.7, ease: "power1.inOut", onUpdate: () => void (count.textContent = String(Math.round(n.v))) }, 0.5)
    .fromTo(q("[data-pl='strike']"), { drawSVG: "0% 0%" }, { drawSVG: "0% 100%", duration: 0.4, ease: "power2.inOut" }, 2.15)
    .fromTo(q("[data-pl='empty']"), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4 }, 2.35);
};

/* ── 02 · the time card (560 × 470) ────────────────────────────────────── */

type Card = typeof timeCards.before;

function Cells({ h }: { h: number }) {
  return (
    <span className={a.cells}>
      {Array.from({ length: timeCards.scale }, (_, i) => {
        const fill = Math.max(0, Math.min(1, h - i));
        return <i key={i} className={fill >= 1 ? a.full : fill > 0 ? a.half : ""} />;
      })}
    </span>
  );
}

function TimeCardFace({ card, tone }: { card: Card; tone: "before" | "after" }) {
  return (
    <>
      <p className={a.cardHead}>
        <span className={a.mono}>Time card</span>
        <span className={`${a.cardTag} ${tone === "after" ? a.cardTagOn : ""}`}>{card.label}</span>
      </p>
      <p className={a.cardWho}>
        {timeCards.person}
        <span className={a.mono}>{card.week} · deductions</span>
      </p>
      <ul className={a.cardRows}>
        {card.rows.map((r) => (
          <li key={r.task} className={r.h === 0 ? a.rowZero : ""} data-tc="row">
            <span className={a.task}>
              {r.task}
              <b>{r.h === 0 ? "—" : `${r.h.toFixed(1)} h`}</b>
            </span>
            <Cells h={r.h} />
          </li>
        ))}
      </ul>
      <p className={a.cardTotal} data-tc="total">
        <span className={a.mono}>Week total</span>
        <b>{card.total.toFixed(1)} h</b>
      </p>
    </>
  );
}

function TimeCard() {
  return (
    <div className={a.canvas} style={{ "--cw": 560 } as CSSProperties}>
      <div className={`${a.card} ${a.cardBefore}`} style={at(18, 52, 262, 352)} data-tc="before">
        <TimeCardFace card={timeCards.before} tone="before" />
      </div>
      <div className={`${a.card} ${a.cardAfter}`} style={at(284, 60, 262, 352)} data-tc="after">
        <TimeCardFace card={timeCards.after} tone="after" />
      </div>
      <span className={a.delta} style={at(330, 416)} data-tc="delta">
        <Glyph k="history" />
        {timeCards.before.total - timeCards.after.total} h back every week
      </span>
    </div>
  );
}

const playCard: Play = (root) => {
  const q = gsap.utils.selector(root);
  const before = (q("[data-tc='before']") as HTMLElement[])[0];
  const after = (q("[data-tc='after']") as HTMLElement[])[0];
  const u = root.clientWidth / 560;
  const bq = gsap.utils.selector(before);
  const aq = gsap.utils.selector(after);
  return gsap
    .timeline()
    .set(after, { autoAlpha: 0 })
    .set(before, { x: 140 * u, y: 8 * u, rotation: 0, opacity: 1 }, 0)
    .fromTo(bq("[data-tc='row']"), { clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0% 0 0)", duration: 0.35, ease: "power2.out", stagger: 0.14 }, 0.2)
    .fromTo(bq("[data-tc='total']"), { autoAlpha: 0, y: 6 }, { autoAlpha: 1, y: 0, duration: 0.35 }, 0.85)
    .to(before, { x: 0, y: 0, rotation: -4, opacity: 0.7, duration: 0.8, ease: "power3.inOut" }, 1.5)
    .fromTo(after, { autoAlpha: 0, y: 70 * u, rotation: 8 }, { autoAlpha: 1, y: 0, rotation: 3, duration: 0.8, ease: "power3.out" }, 1.65)
    .fromTo(aq("[data-tc='row']"), { clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0% 0 0)", duration: 0.3, ease: "power2.out", stagger: 0.1 }, 2.15)
    .fromTo(aq("[data-tc='total']"), { autoAlpha: 0, y: 6 }, { autoAlpha: 1, y: 0, duration: 0.35 }, 2.55)
    .fromTo(q("[data-tc='delta']"), { autoAlpha: 0, scale: 0.7 }, { autoAlpha: 1, scale: 1, duration: 0.4, ease: "back.out(2)" }, 2.8);
};

/* ── 03 · one line, split open (rem layout) ─────────────────────────────── */

const SPLIT_TOTAL = split.journal.total;
const shareOf = (n: number) => (n / SPLIT_TOTAL) * 100;
const focusIdx = split.channels.findIndex((c) => c.focus);
const focusCentre = split.channels.slice(0, focusIdx).reduce((t, c) => t + shareOf(c.amount), 0) + shareOf(split.channels[focusIdx].amount) / 2;
const focusTotal = split.focus.types.reduce((t, x) => t + x.amount, 0);

function Split() {
  return (
    <div className={a.split}>
      <p className={a.splitLabel}>{split.before}</p>
      <p className={a.journal} data-ls="journal">
        <span className={a.jAccount}>{split.journal.account}</span>
        <span className={a.mono}>{split.journal.period}</span>
        <b>{money(SPLIT_TOTAL)}</b>
      </p>

      <p className={a.splitLabel}>{split.after}</p>
      <div className={a.bar}>
        {split.channels.map((c, i) => (
          <span key={c.name} className={`${a.seg} ${a[`seg${i}`]} ${c.focus ? a.segFocus : ""}`} style={{ flexBasis: `${shareOf(c.amount)}%` }}>
            <span className={a.segText} data-ls="seg">
              <span className={a.segName}>{c.name}</span>
              <b>{money(c.amount, false)}</b>
            </span>
          </span>
        ))}
        <span className={a.barWhole} data-ls="whole">
          <span>{split.journal.account}</span>
          <b>{money(SPLIT_TOTAL, false)}</b>
        </span>
      </div>
      <ul className={a.legend}>
        {split.channels.map((c, i) => (
          <li key={c.name}>
            <i className={a[`seg${i}`]} />
            {c.name}
            <b>{money(c.amount, false)}</b>
          </li>
        ))}
      </ul>

      <span className={a.stem} style={{ left: `${focusCentre}%` } as CSSProperties} data-ls="stem" />
      <div className={a.detail} data-ls="detail">
        <p className={a.detailHead}>
          <b>{split.focus.title}</b>
          <span>{money(focusTotal, false)}</span>
        </p>
        <ul className={a.types}>
          {split.focus.types.map((t, i) => (
            <li key={t.name} className={i === 0 ? a.typeFocus : ""} data-ls="type">
              <TypeChip category={t.type}>{t.name}</TypeChip>
              <span className={a.track}>
                <span className={a.trackFill} style={{ width: `${t.share}%` }} data-ls="fill" />
              </span>
              <b>{money(t.amount, false)}</b>
              <span className={a.share}>{t.share}%</span>
            </li>
          ))}
        </ul>
        <p className={a.detailNote} data-ls="note">
          <Glyph k="alert" />
          {split.focus.note}
        </p>
      </div>
    </div>
  );
}

const playSplit: Play = (root) => {
  const q = gsap.utils.selector(root);
  return gsap
    .timeline()
    .fromTo(q("[data-ls='journal']"), { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.5, ease: "power3.out" }, 0)
    .fromTo(q("[data-ls='whole']"), { autoAlpha: 1 }, { autoAlpha: 0, duration: 0.45, ease: "power1.in" }, 0.95)
    .fromTo(q("[data-ls='seg']"), { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.45, ease: "power3.out", stagger: 0.09 }, 1.15)
    .fromTo(q("[data-ls='stem']"), { scaleY: 0 }, { scaleY: 1, duration: 0.35, ease: "power2.out" }, 1.6)
    .fromTo(q("[data-ls='detail']"), { clipPath: "inset(0% 30% 100% 30% round 1.25rem)" }, { clipPath: "inset(0% 0% 0% 0% round 1.25rem)", duration: 0.75, ease: "power3.inOut" }, 1.85)
    .fromTo(q("[data-ls='type']"), { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.4, ease: "power3.out", stagger: 0.1 }, 2.3)
    .fromTo(q("[data-ls='fill']"), { scaleX: 0 }, { scaleX: 1, duration: 0.7, ease: "power2.out", stagger: 0.1 }, 2.4)
    .fromTo(q("[data-ls='note']"), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4 }, 2.95);
};

export const ARTIFACTS: Record<CaseStory["artifact"], { Art: ComponentType; play: Play; wide?: boolean }> = {
  pile: { Art: Pile, play: playPile },
  card: { Art: TimeCard, play: playCard },
  split: { Art: Split, play: playSplit, wide: true },
};
