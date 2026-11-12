import ConnectScene from "./ConnectScene";
import MatchScene from "./MatchScene";
import DisputeScene from "./DisputeScene";
import RecoverScene from "./RecoverScene";
import s from "./scenes.module.css";

const SCENES = [ConnectScene, MatchScene, DisputeScene, RecoverScene];

/**
 * Shared frame for a step's scene: identical 560 × 280 canvas, alternating warm /
 * neutral tint (continuing the card grid's checkerboard). Decorative — the step's
 * title and body carry the meaning.
 */
export default function StepScene({ index }: { index: number }) {
  const Scene = SCENES[index];
  return (
    <div className={`${s.scene} ${index % 2 === 0 ? s.warm : s.neutral}`} data-mf-step-scene={index} aria-hidden="true">
      <Scene />
    </div>
  );
}
