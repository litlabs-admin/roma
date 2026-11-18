"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/motion";
import { ILLUSTRATIVE, acIntro, tieOut as T } from "@/lib/content/products";
import { Glyph, SourcePill, money } from "@/components/platform/mock/kit";
import { playOnce, refreshWhenReady, rise } from "@/components/platform/motion";
import s from "./tieout.module.css";

/**
 * "Zero manual matching." — the /accounting signature section (DESIGN.md §G.11): one
 * check, applied line by line on a ledger sheet, in an auditor's visual language
 * (red tick marks, footing, a double rule under the total, a "tied out" stamp).
 *
 * Four states, left to right on a stepper: the check arrives → its lines are tied to
 * invoices and deductions → each gets a GL code → it foots to $0.00 and exports.
 * ≥992px: CSS-sticky pin, scrubbed (0.7). Below: no pin, the sheet plays once on enter.
 * Reduced motion: finished sheet, all steps listed.
 */

function build(q: (sel: string) => Element[]) {
  const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
  const marks: number[] = [];
  gsap.set(q("[data-to='glSet']"), { autoAlpha: 0 });
  gsap.set(q("[data-to='glEmpty']"), { autoAlpha: 1 });

  // 1 · the check arrives
  tl.from(q("[data-to='sheet']"), { autoAlpha: 0, y: 30, duration: 0.6 }, 0)
    .from(q("[data-to='checkRow']"), { autoAlpha: 0, x: -20, duration: 0.5 }, 0.25)
    .to({}, { duration: 0.6 });
  // 2 · it opens into its lines; each gets an auditor's tick
  marks.push(tl.duration());
  tl.fromTo(q("[data-to='chev']"), { rotation: 0 }, { rotation: 90, duration: 0.3, ease: "power2.inOut", immediateRender: true })
    .from(q("[data-to='lines']"), { height: 0, duration: 0.6, ease: "power2.inOut" }, "<")
    .from(q("[data-to='line']"), { autoAlpha: 0, y: -8, duration: 0.35, stagger: 0.08 }, "<0.25")
    .from(q("[data-to='tick']"), { autoAlpha: 0, scale: 0.2, rotation: -30, duration: 0.3, stagger: 0.08, ease: "back.out(2.5)" }, "<0.2")
    .to({}, { duration: 0.5 });
  // 3 · GL codes, one by one
  marks.push(tl.duration());
  q("[data-to='line']").forEach((line, i) => {
    const r = gsap.utils.selector(line);
    const at = tl.duration() + (i ? 0.05 : 0);
    tl.to(r("[data-to='glEmpty']"), { autoAlpha: 0, duration: 0.12 }, at).fromTo(
      r("[data-to='glSet']"),
      { autoAlpha: 0, x: -6 },
      { autoAlpha: 1, x: 0, duration: 0.25 },
      at + 0.06,
    );
  });
  tl.to({}, { duration: 0.5 });
  // 4 · foot, tie out, export
  marks.push(tl.duration());
  // explicit start states (not from()) so nothing of step 4 shows before its turn
  gsap.set(q("[data-to='foot'], [data-to='stamp'], [data-to='export'], [data-to='toast']"), { autoAlpha: 0 });
  gsap.set(q("[data-to='rule']"), { scaleX: 0 });
  tl.fromTo(q("[data-to='foot']"), { y: 10 }, { autoAlpha: 1, y: 0, duration: 0.35, stagger: 0.1 })
    .to(q("[data-to='rule']"), { scaleX: 1, duration: 0.4, stagger: 0.1, ease: "power2.inOut" }, "<0.15")
    .fromTo(q("[data-to='stamp']"), { scale: 1.8, rotation: -30 }, { autoAlpha: 1, scale: 1, rotation: -8, duration: 0.4, ease: "power3.in" })
    .fromTo(q("[data-to='export']"), { y: 14 }, { autoAlpha: 1, y: 0, duration: 0.4 })
    .fromTo(q("[data-to='toast']"), { y: 10, scale: 0.95 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.4, ease: "back.out(1.8)" })
    .to({}, { duration: 0.6 });
  return { tl, marks };
}

export default function TieOut() {
  const root = useRef<HTMLElement>(null);
  const [step, setStep] = useState(T.steps.length - 1);
  const { before, accent, after } = acIntro.heading;

  useLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
    if (prefersReducedMotion()) {
      el.setAttribute("data-static", "");
      return () => el.removeAttribute("data-static");
    }
    const mm = gsap.matchMedia();
    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(el);
      rise(q("[data-to-head]"), q("[data-to-head]")[0]);

      mm.add("(min-width: 992px)", () => {
        const { tl, marks } = build(q);
        tl.pause();
        const total = tl.duration();
        setStep(0);
        ScrollTrigger.create({
          trigger: q("[data-to-pin]")[0],
          start: "top top",
          end: "bottom bottom",
          scrub: 0.7,
          animation: tl,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const t = self.progress * total;
            setStep(marks.filter((m) => t >= m).length);
            gsap.set(q("[data-to-fill]"), { scaleX: self.progress });
          },
        });
        // Short viewports: scale the frame down (≥ 0.82) so the whole sheet stays on screen.
        const frame = q("[data-to-frame]")[0] as HTMLElement;
        const fit = () => {
          const nav = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--nav-h")) * parseFloat(getComputedStyle(document.documentElement).fontSize) || 89;
          const room = window.innerHeight - nav - 24;
          const k = Math.max(0.82, Math.min(1, room / frame.offsetHeight));
          frame.style.setProperty("--fit", String(k));
        };
        fit();
        const ro = new ResizeObserver(fit);
        ro.observe(frame);
        window.addEventListener("resize", fit);
        return () => {
          ro.disconnect();
          window.removeEventListener("resize", fit);
          frame.style.removeProperty("--fit");
          setStep(T.steps.length - 1);
        };
      });
      mm.add("(max-width: 991.98px)", () => {
        const { tl, marks } = build(q);
        tl.eventCallback("onUpdate", () => setStep(marks.filter((m) => tl.time() >= m).length));
        playOnce(q("[data-to='sheet']")[0], tl, "top 75%");
        return () => setStep(T.steps.length - 1);
      });
    }, el);
    const stop = refreshWhenReady();
    return () => {
      stop();
      mm.revert();
      ctx.revert();
    };
  }, []);

  return (
    <section ref={root} className={s.section} aria-labelledby="tieout-heading">
      <div className={s.head}>
        <p className={`${s.label} type-label`} data-to-head>
          {acIntro.label}
        </p>
        <h2 id="tieout-heading" className={`${s.heading} type-h2`} data-to-head>
          {before}
          <span className="accent">{accent}</span>
          {after}
        </h2>
        <div className={s.headSide} data-to-head>
          <p className={`${s.lead} type-lead`}>{acIntro.lead}</p>
          <ul className={s.points}>
            {acIntro.points.map((p) => (
              <li key={p}>
                <Glyph k="check" />
                {p}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className={s.pin} data-to-pin>
        <div className={s.sticky}>
          <div className={s.frame} data-to-frame>
            <div className={s.stepWrap}>
              <ol className={s.stepper}>
                <span className={s.track} aria-hidden="true">
                  <span className={s.trackFill} data-to-fill />
                </span>
                {T.steps.map((st, i) => (
                  <li key={st.title} className={`${s.step} ${i <= step ? s.stepOn : ""} ${i === step ? s.stepNow : ""}`}>
                    <span className={s.stepNum}>{i < step ? <Glyph k="check" /> : String(i + 1).padStart(2, "0")}</span>
                    <span className={s.stepTitle}>{st.title}</span>
                    <span className={s.stepBody}>{st.body}</span>
                  </li>
                ))}
              </ol>
              <p key={step} className={s.stepCaption} aria-live="polite">
                {T.steps[step].body}
              </p>
            </div>

            <div className={s.sheet} data-to="sheet" aria-hidden="true">
              <div className={s.checkRow} data-to="checkRow">
                <span className={s.chev} data-to="chev">
                  <Glyph k="arrow" />
                </span>
                <span className={s.checkTitle}>
                  <b>Check {T.check.number}</b>
                  <span>
                    {T.check.date} · {T.lines.length} lines
                  </span>
                </span>
                <SourcePill>{T.check.channel}</SourcePill>
                <b className={s.checkAmt}>{money(T.check.amount)}</b>
              </div>

              <div className={s.lines} data-to="lines">
                <div className={`${s.line} ${s.lineHead}`}>
                  <span />
                  <span>Line</span>
                  <span>Tied to</span>
                  <span>GL code</span>
                  <span className={s.right}>Amount</span>
                </div>
                {T.lines.map((l) => (
                  <div key={l.ref} className={s.line} data-to="line">
                    <span className={s.tick} data-to="tick">
                      ✓
                    </span>
                    <span className={s.ref}>{l.ref}</span>
                    <span className={`${s.kind} ${l.amount > 0 ? s.inv : s.ded}`}>{l.kind}</span>
                    <span className={s.swap}>
                      <span className={s.gl} data-to="glSet">
                        {l.gl}
                      </span>
                      <span className={s.glEmpty} data-to="glEmpty" style={{ opacity: 0 }}>
                        —
                      </span>
                    </span>
                    <span className={`${s.right} ${s.amt} ${l.amount < 0 ? s.neg : ""}`}>{l.amount < 0 ? `(${money(-l.amount)})` : money(l.amount)}</span>
                  </div>
                ))}
              </div>

              <div className={s.bottom}>
                <div className={s.exportCol}>
                  <span className={s.stamp} data-to="stamp">
                    Tied out
                  </span>
                  <div className={s.exportBar} data-to="export">
                    <span className={s.mono}>Export</span>
                    <span className={s.seg}>
                      {T.exports.map((x, i) => (
                        <span key={x} className={i === 0 ? s.segOn : ""}>
                          {x}
                        </span>
                      ))}
                    </span>
                  </div>
                  <span className={s.toast} data-to="toast">
                    <Glyph k="check" />
                    {T.exported}
                  </span>
                </div>
                <div className={s.footing}>
                  <div className={s.foot} data-to="foot">
                    <span>Invoices</span>
                    <span className={s.amt}>{money(T.totals.invoices)}</span>
                  </div>
                  <div className={s.foot} data-to="foot">
                    <span>Deductions</span>
                    <span className={`${s.amt} ${s.neg}`}>({money(-T.totals.deductions)})</span>
                  </div>
                  <span className={s.rule} data-to="rule" />
                  <div className={`${s.foot} ${s.footTotal}`} data-to="foot">
                    <span>Check {T.check.number}</span>
                    <span className={s.amt}>{money(T.totals.check)}</span>
                  </div>
                  <span className={`${s.rule} ${s.double}`} data-to="rule" />
                  <div className={`${s.foot} ${s.diff}`} data-to="foot">
                    <span>Difference</span>
                    <span className={s.amt}>$0.00</span>
                  </div>
                </div>
              </div>
            </div>
            <p className={s.caption}>{ILLUSTRATIVE}</p>
          </div>
          <p className="sr-only">{T.summary}</p>
        </div>
      </div>
    </section>
  );
}
