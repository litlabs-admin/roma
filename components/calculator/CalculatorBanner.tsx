"use client";

import Button from "@/components/ui/Button";
import { calcCopy } from "@/lib/content/calculator";
import { track } from "@/lib/calculator/track";
import s from "./calculator.module.css";

/**
 * Slim link banner to /calculator (brief §1.2): compare pages and blog posts. Link only,
 * no inputs. `inline` drops the section frame for use inside an article body.
 */
export default function CalculatorBanner({ inline = false }: { inline?: boolean }) {
  const C = calcCopy.banner;
  const body = (
    <aside className={`${s.banner} ${inline ? s.bannerInline : ""}`} aria-label={C.heading}>
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
      <Button
        href="/calculator"
        size="small"
        className={s.bannerBtn}
        onClick={() => track("calculator_cta_click", { cta: "banner", source_page: window.location.pathname })}
      >
        {C.cta}
      </Button>
    </aside>
  );
  if (inline) return body;
  return <div className={`container-lg ${s.bannerSection}`}>{body}</div>;
}
