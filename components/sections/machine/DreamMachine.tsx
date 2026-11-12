import { splitChars } from "@/components/ui/splitChars";
import { MACHINE_CARDS, machineCopy } from "./data";
import ConnectVisual from "./visuals/ConnectVisual";
import RoutingVisual from "./visuals/RoutingVisual";
import StreamVisual from "./visuals/StreamVisual";
import RecoveryVisual from "./visuals/RecoveryVisual";
import s from "./machine.module.css";

const VISUALS = {
  connect: ConnectVisual,
  routing: RoutingVisual,
  stream: StreamVisual,
  recovery: RecoveryVisual,
} as const;

/** "This is your deduction recovery machine." — Fruitful's dream-machine grid. */
export default function DreamMachine() {
  const { before, accent, after } = machineCopy.heading;
  return (
    <section className={s.machine} aria-labelledby="machine-heading">
      <div className={s.machineInner}>
        <div className={s.machineHeading}>
          <h2 id="machine-heading" className="type-h3" data-mf-highlight aria-label={`${before} ${accent}${after}`}>
            <span aria-hidden="true">
              {splitChars(before, false, "a")}
              <br />
              {splitChars(accent, true, "b")}
              {splitChars(after, false, "c")}
            </span>
          </h2>
        </div>

        <ul className={s.grid} data-mf-grid>
          {MACHINE_CARDS.map((card) => {
            const Visual = VISUALS[card.key];
            return (
              <li key={card.key} className={s.item} data-mf-item>
                <div className={s.well}>
                  <Visual />
                </div>
                <div className={`${s.content} ${card.note ? s.withNote : ""}`}>
                  <h3 className={`${s.title} type-h4`}>{card.title}</h3>
                  <p className={s.body}>{card.body}</p>
                  {card.note && <p className={s.note}>{card.note}</p>}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
