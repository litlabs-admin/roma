import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import type { NavFeature } from "@/lib/content/nav";
import s from "./nav.module.css";

/**
 * Nav panel feature tile, in the customer results bento's language (ResultsBento
 * `MetricTile`, DESIGN.md §G.15): photo under a warm scrim, or Roma red + texture; mark
 * top-left, arrow chip top-right, big figure + label at the foot. One link per tile.
 * The arrow is drawn here, not imported from blog/PostCard: that module pulls in all of
 * lib/content/blog.ts, which must stay out of the client bundle.
 */
export default function NavTile({ f, onNavigate }: { f: NavFeature; onNavigate: () => void }) {
  return (
    <Link href={f.href} className={s.tile} data-kind={f.kind} onClick={onNavigate}>
      {f.kind === "photo" && f.image ? (
        <Image src={f.image.src} alt="" fill sizes="21rem" quality={75} className={s.tilePhoto} style={{ objectPosition: f.image.position }} />
      ) : (
        <Image src="/images/cta/texture-bg.webp" alt="" fill sizes="21rem" quality={60} className={s.tileTexture} />
      )}
      <span className={s.tileScrim} aria-hidden="true" />

      <span className={s.tileHead} aria-hidden="true">
        {f.mark.type === "brand" &&
          (f.mark.brand.logo ? (
            <span
              className={s.tileLogo}
              style={{ "--logo": `url(${f.mark.brand.logo.src})`, aspectRatio: `${f.mark.brand.logo.w} / ${f.mark.brand.logo.h}` } as CSSProperties}
            />
          ) : (
            <span className={s.tileWordmark}>{f.mark.brand.name}</span>
          ))}
        {f.mark.type === "roma" && <Image src="/brand/roma-logo.png" alt="" width={464} height={106} className={s.tileRoma} />}
        {f.mark.type === "eyebrow" && <span className={s.tileEyebrow}>{f.mark.text}</span>}
      </span>

      <span className={s.tileArrow} aria-hidden="true">
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 11 11 5M6 5h5v5" />
        </svg>
      </span>

      <span className={s.tileFoot} aria-hidden="true">
        {f.figure ? (
          <>
            <span className={s.tileFigure}>{f.figure}</span>
            <span className={s.tileLabel}>{f.label}</span>
          </>
        ) : (
          <span className={s.tileTitle}>{f.label}</span>
        )}
        {f.meta && <span className={s.tileMeta}>{f.meta}</span>}
      </span>
      <span className="sr-only">{f.sr}</span>
    </Link>
  );
}
