"use client";

import Image from "next/image";
import { useCompare } from "./context";
import CompetitorLogo from "./CompetitorLogo";
import s from "./logo.module.css";

/**
 * "Roma vs X" as the two real logos on one light plate (DESIGN.md §G.13). Sits where the
 * product heroes carry their pill, so the matchup reads before the headline does.
 */
export default function VsLockup({ scale = 1 }: { scale?: number }) {
  const { c } = useCompare();
  return (
    <span className={s.lockup}>
      <span className="sr-only">Roma vs. {c.name}</span>
      <Image src="/brand/roma-logo.png" alt="" width={464} height={106} className={s.roma} aria-hidden="true" />
      <span className={s.vs} aria-hidden="true">
        vs
      </span>
      <CompetitorLogo height={c.logo.size * scale} className={s.them} />
    </span>
  );
}
