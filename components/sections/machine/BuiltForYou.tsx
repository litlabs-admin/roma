import Button from "@/components/ui/Button";
import { STEPS, stepsCopy } from "./data";
import StepScene from "./steps/StepScene";
import s from "./machine.module.css";

/** "Built for finance teams of any size." — Fruitful's "It's all built for you." steps. */
export default function BuiltForYou() {
  const { heading, muted, cta } = stepsCopy;
  return (
    <section className={s.steps} aria-labelledby="steps-heading">
      <div className={s.stepsInner}>
        <div className={s.stepsGrid}>
          <div className={s.stepsLeft}>
            <h2 id="steps-heading" className={`${s.stepsHeading} type-h3`}>
              {heading}
              <br />
              <span className={s.muted}>
                {muted.before}
                <br className={s.brWide} /> {muted.after}
                <span className="accent">{muted.accent}</span>
                {muted.end}
              </span>
            </h2>
            <div className={s.ctaWide}>
              <Button href={cta.href}>{cta.label}</Button>
            </div>
          </div>

          <ol className={s.stepList} data-mf-steps data-mf-flow-end>
            {STEPS.map((step, i) => (
              <li key={step.n} className={s.stepRow} data-mf-step>
                <div className={s.circleWrap} aria-hidden="true">
                  <span className={s.circle} data-mf-circle>
                    {step.n}
                  </span>
                </div>
                <div className={s.stepCard}>
                  <div className={s.stepWell}>
                    <StepScene index={i} />
                  </div>
                  <div className={s.stepText}>
                    <h3 className={s.stepTitle}>
                      <span className="sr-only">Step {step.n}: </span>
                      {step.title}
                    </h3>
                    <p className={s.stepBody}>{step.body}</p>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className={s.ctaNarrow}>
          <Button href={cta.href}>{cta.label}</Button>
        </div>
      </div>
    </section>
  );
}
