"use client";

import { useLayoutEffect, useRef, useState, type CSSProperties, type MouseEvent } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/motion";
import { CASES, caseCopy, type CaseStory, type Outcome } from "@/lib/content/customers";
import { SourcePill } from "@/components/platform/mock/kit";
import { refreshWhenReady, rise } from "@/components/platform/motion";
import { scrollToTarget } from "@/components/motion/SmoothScroll";
import Monogram from "@/components/blog/Monogram";
import Package from "./Package";
import { ARTIFACTS } from "./artifacts/Artifacts";
import s from "./caseFiles.module.css";

/**
 * Case files — the signature section of /customers (DESIGN.md §G.15). Three chapters,
 * one per pillar (recover · time · visibility), each a white case file with a folder
 * tab: facts, Before → The turn → After, a centrepiece object of its own (the chapters
 * vary their composition so they never read as one template), outcomes that count up,
 * the customer's words and one line of advice.
 *
 * A sticky index (≥992px, a chip bar under the nav below) shows where you are; it is
 * driven by ScrollTrigger progress only, so it also works under reduced motion. No
 * pins: chapters are read, not scrubbed. Every artifact plays once on enter.
 */

const fmt = (o: NonNullable<Outcome["count"]>, v: number) => v.toFixed(o.decimals ?? 0);

function OutcomeFigure({ o, lead }: { o: Outcome; lead: boolean }) {
  return (
    <div className={`${s.outcome} ${lead ? s.outcomeLead : ""}`}>
      <dt>{o.label}</dt>
      <dd aria-label={o.figure}>
        {o.count ? (
          <span aria-hidden="true">
            {o.count.prefix}
            <span data-cf-count data-to={o.count.to} data-dec={o.count.decimals ?? 0}>
              {fmt(o.count, o.count.to)}
            </span>
            {o.count.suffix}
          </span>
        ) : (
          <span aria-hidden="true">{o.figure}</span>
        )}
      </dd>
    </div>
  );
}

function CaseFile({ c }: { c: CaseStory }) {
  const { Art, wide } = ARTIFACTS[c.artifact];
  const initials = c.quote.name
    .split(" ")
    .map((w) => w[0])
    .join("");
  return (
    <article id={c.brand.id} className={`${s.file} ${s[`v_${c.artifact}`]}`} aria-labelledby={`${c.brand.id}-title`} data-cf-file>
      <span className={s.tab} aria-hidden="true">
        Case {c.n} · {c.code}
      </span>

      <header className={s.fhead} data-cf-rise>
        <span className={s.mark} aria-hidden="true">
          <Package brand={c.brand} />
        </span>
        <div className={s.titles}>
          <p className={`${s.pillar} type-label`}>
            {c.brand.name} · {c.pillar}
          </p>
          <h3 id={`${c.brand.id}-title`} className={`${s.h3} type-h3`}>
            {c.heading.before}
            <span className="accent">{c.heading.accent}</span>
            {c.heading.after}
          </h3>
        </div>
      </header>

      <dl className={s.facts} data-cf-rise>
        {c.facts.map((f) => (
          <div key={f.k}>
            <dt>{f.k}</dt>
            <dd>{f.v}</dd>
          </div>
        ))}
        <div>
          <dt>Channels</dt>
          <dd className={s.pills}>
            {c.channels.map((ch) => (
              <SourcePill key={ch}>{ch}</SourcePill>
            ))}
          </dd>
        </div>
        <div>
          <dt>Started with</dt>
          <dd className={s.started}>
            <i aria-hidden="true" />
            {c.started}
          </dd>
        </div>
      </dl>

      <div className={s.body}>
        <ol className={s.beats}>
          {c.beats.map((b, i) => (
            <li key={b.label} className={s[`beat${i}`]} data-cf-beat>
              <span className={s.beatLabel}>{b.label}</span>
              <p>{b.text}</p>
            </li>
          ))}
        </ol>
        <figure className={`${s.art} ${wide ? s.artWide : s[`art_${c.artifact}`]}`} data-cf-art>
          <div className={s.artInner} aria-hidden="true">
            <Art />
          </div>
          <figcaption className="sr-only">{c.summary}</figcaption>
        </figure>
      </div>

      <div className={s.foot}>
        <figure className={s.quote} data-cf-rise>
          <blockquote>
            <p>“{c.quote.text}”</p>
          </blockquote>
          <figcaption>
            <Monogram initials={initials} />
            <span>
              <b>{c.quote.name}</b>
              {c.quote.role}
            </span>
          </figcaption>
        </figure>
        <dl className={s.outcomes} data-cf-outcomes>
          {c.outcomes.map((o, i) => (
            <OutcomeFigure key={o.label} o={o} lead={i === 0} />
          ))}
        </dl>
      </div>

      <p className={s.advice} data-cf-rise>
        <span className={s.adviceLabel}>{caseCopy.adviceLabel}</span>
        <span className={s.adviceText}>{c.advice}</span>
      </p>
    </article>
  );
}

export default function CaseFiles() {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const { before, accent, after } = caseCopy.heading;

  useLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
    const q = gsap.utils.selector(el);
    const files = q("[data-cf-file]") as HTMLElement[];
    const nav = (q("[data-cf-nav]") as HTMLElement[])[0];

    // index: active chapter + reading progress (not motion: runs under reduced motion too)
    const ctx = gsap.context(() => {
      files.forEach((f, i) => {
        ScrollTrigger.create({ trigger: f, start: "top 55%", end: "bottom 55%", onToggle: (st) => st.isActive && setActive(i) });
      });
      ScrollTrigger.create({
        trigger: q("[data-cf-chapters]")[0],
        start: "top 55%",
        end: "bottom 55%",
        onUpdate: (st) => nav?.style.setProperty("--p", st.progress.toFixed(4)),
      });
    }, el);

    if (prefersReducedMotion()) {
      const stop = refreshWhenReady();
      return () => {
        stop();
        ctx.revert();
      };
    }

    ctx.add(() => {
      rise(q("[data-cf-head]"), q("[data-cf-head]")[0]);
      files.forEach((f) => {
        const fq = gsap.utils.selector(f);
        rise(fq("[data-cf-rise]"), f, { start: "top 80%" });
        rise(fq("[data-cf-beat]"), fq("[data-cf-beat]")[0], { start: "top 85%", stagger: 0.12 });

        const art = fq("[data-cf-art]")[0] as HTMLElement;
        const kind = CASES[files.indexOf(f)].artifact;
        ScrollTrigger.create({ trigger: art, start: "top 70%", once: true, onEnter: () => ctx.add(() => ARTIFACTS[kind].play(art)) });

        const counts = fq("[data-cf-count]") as HTMLElement[];
        ScrollTrigger.create({
          trigger: fq("[data-cf-outcomes]")[0],
          start: "top 88%",
          once: true,
          onEnter: () =>
            ctx.add(() =>
              counts.forEach((node, i) => {
                const to = Number(node.dataset.to);
                const dec = Number(node.dataset.dec);
                const n = { v: 0 };
                gsap.fromTo(n, { v: 0 }, { v: to, duration: 1.3, delay: i * 0.12, ease: "power2.out", onUpdate: () => void (node.textContent = n.v.toFixed(dec)) });
              }),
            ),
        });
      });
    });

    const stop = refreshWhenReady();
    return () => {
      stop();
      ctx.revert();
      el.querySelectorAll<HTMLElement>("[data-cf-count]").forEach((n) => (n.textContent = Number(n.dataset.to).toFixed(Number(n.dataset.dec))));
      el.querySelectorAll<HTMLElement>("[data-pl='count']").forEach((n) => (n.textContent = n.dataset.to ?? ""));
    };
  }, []);

  const go = (e: MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    scrollToTarget(`#${id}`);
    history.replaceState(null, "", `#${id}`);
  };

  return (
    <section ref={root} className={s.section} aria-labelledby="cases-heading">
      <div className={s.inner}>
        <header className={s.head}>
          <div className={s.headMain}>
            <p className={`${s.label} type-label`} data-cf-head>
              {caseCopy.label}
            </p>
            <h2 id="cases-heading" className={`${s.h2} type-h2`} data-cf-head>
              {before}
              <span className="accent">{accent}</span>
              {after}
            </h2>
          </div>
          <p className={s.lead} data-cf-head>
            {caseCopy.lead}
          </p>
        </header>

        <div className={s.layout}>
          <nav className={s.index} aria-label={caseCopy.indexLabel} data-cf-nav style={{ "--p": 0 } as CSSProperties}>
            <span className={s.rail} aria-hidden="true">
              <span className={s.railFill} />
            </span>
            <ol>
              {CASES.map((c, i) => (
                <li key={c.brand.id}>
                  <a href={`#${c.brand.id}`} onClick={(e) => go(e, c.brand.id)} aria-current={i === active ? "location" : undefined}>
                    <span className={s.idxN}>{c.n}</span>
                    <span className={s.idxText}>
                      <b>{c.brand.short}</b>
                      <small>{c.pillar}</small>
                    </span>
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <div className={s.chapters} data-cf-chapters>
            {CASES.map((c) => (
              <CaseFile key={c.brand.id} c={c} />
            ))}
            <p className={s.note}>{caseCopy.note}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
