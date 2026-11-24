"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { INPUTS, calcCopy } from "@/lib/content/calculator";
import { toParams } from "@/lib/calculator/math";
import { track } from "@/lib/calculator/track";
import RevenueHero from "./RevenueHero";
import s from "./calculator.module.css";

/**
 * Slim calculator banner (brief §1.2): compare pages and blog posts. Revenue first, like
 * every calculator surface: type a revenue, Calculate opens /calculator straight on its
 * reveal (?R=). `inline` drops the section frame for use inside an article body.
 */
export default function CalculatorBanner({ inline = false }: { inline?: boolean }) {
  const C = calcCopy.banner;
  const router = useRouter();
  const [R, setR] = useState(INPUTS.R.def);
  const [entered, setEntered] = useState(false);
  const prefix = inline ? "cb-inline" : "cb";

  const go = (v: number) => {
    track("calculator_cta_click", {
      cta: "banner",
      source_page: window.location.pathname,
    });
    router.push(`/calculator?${toParams({ R: v }).toString()}`);
  };

  const body = (
    <aside className={`${s.banner} ${inline ? s.bannerInline : ""}`} aria-label={C.heading}>
      <div className={s.bannerTop}>
        <span className={s.bannerIcon} aria-hidden="true">
          <svg viewBox="0 0 20 20">
            <rect x="4.5" y="2.5" width="11" height="15" rx="1.5" />
            <path d="M7 6h6M7.5 10h.01M10 10h.01M12.5 10h.01M7.5 12.75h.01M10 12.75h.01M12.5 12.75h.01M7.5 15.25h.01M10 15.25h.01M12.5 15.25h.01" />
          </svg>
        </span>
        <div className={s.bannerCopy}>
          <p className={s.bannerTitle}>{C.heading}</p>
          <p className={s.bannerSub}>{C.sub}</p>
        </div>
      </div>
      <div className={s.bannerForm}>
        <RevenueHero
          mode="inline"
          value={R}
          onChange={(v) => {
            setEntered(true);
            setR(v);
          }}
          idPrefix={prefix}
          entered={entered}
          onSubmit={go}
        />
      </div>
    </aside>
  );
  if (inline) return body;
  return <div className={`container-lg ${s.bannerSection}`}>{body}</div>;
}
