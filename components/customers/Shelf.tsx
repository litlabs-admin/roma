"use client";

import { useLayoutEffect, useRef, type CSSProperties, type MouseEvent } from "react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/motion";
import { SHELF, shelfCopy, type ShelfItem } from "@/lib/content/customers";
import { scrollToTarget } from "@/components/motion/SmoothScroll";
import Package, { PACK_BOX } from "./Package";
import Barcode from "./Barcode";
import s from "./shelf.module.css";

/**
 * Hero art for /customers (DESIGN.md §G.15): one bay of a grocery shelf. Four customer
 * products stand on it, two facings each, and a shelf tag hangs from the rail under
 * each one. On load the products settle onto the shelf and every tag flips from its
 * retail price to what changed for that brand: the number that matters isn't the price.
 *
 * Canvas: 1000 × 470 design units, `--u = 100cqw / 1000`. Below 768px the bay scrolls
 * sideways (snap per product) so type never shrinks below legibility. Each product +
 * tag is one link to its story. SSR markup is the final state (tags show outcomes).
 */

const T = { packs: 0.95, packStagger: 0.08, flips: 1.85, flipStagger: 0.14 };
const SCALE = 1.15; // design units per packaging viewBox unit

function Tag({ item }: { item: ShelfItem }) {
  return (
    <span className={s.tag}>
      <span className={s.flip} data-sh="flip">
        {/* outcome: the front in the final state */}
        <span className={`${s.face} ${s.outcome}`}>
          <span className={s.tagBrand}>{item.brand.name}</span>
          <span className={s.figure}>{item.outcome.figure}</span>
          <span className={s.tagLabel}>{item.outcome.label}</span>
          <span className={s.tagFoot}>
            <span className={s.sku}>
              <Barcode code={item.sku} className={s.bars} />
            </span>
            <span className={s.hint}>
              {shelfCopy.hint}
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M8 3v10M3.5 8.5 8 13l4.5-4.5" />
              </svg>
            </span>
          </span>
        </span>
        {/* price: seen only before the flip */}
        <span className={`${s.face} ${s.price}`} aria-hidden="true">
          <span className={s.tagBrand}>{item.brand.name}</span>
          <span className={s.priceLine}>
            {item.brand.pack.line} {item.brand.pack.sub}
          </span>
          <span className={s.figure}>{item.price.amount}</span>
          <span className={s.tagFoot}>
            <span className={s.unit}>{item.price.unit}</span>
            <Barcode code={item.sku} className={s.bars} />
          </span>
        </span>
      </span>
    </span>
  );
}

export default function Shelf() {
  const root = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = root.current;
    if (!el || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(el);
      gsap
        .timeline()
        .fromTo(
          q("[data-sh='pack']"),
          { autoAlpha: 0, yPercent: -14 },
          { autoAlpha: 1, yPercent: 0, duration: 0.75, ease: "back.out(1.5)", stagger: T.packStagger },
          T.packs,
        )
        .fromTo(q("[data-sh='flip']"), { rotationX: -180 }, { rotationX: 0, duration: 0.9, ease: "power3.inOut", stagger: T.flipStagger }, T.flips);
    }, el);
    return () => ctx.revert();
  }, []);

  const go = (e: MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    scrollToTarget(href);
    history.replaceState(null, "", href);
  };

  return (
    <div ref={root} className={s.bay}>
      <div className={s.stage}>
        <div className={s.canvas}>
          <span className={s.post} aria-hidden="true" />
          <span className={`${s.post} ${s.postRight}`} aria-hidden="true" />
          <p className={s.sign} aria-hidden="true">
            <span className={s.wire} />
            <span className={s.wire} />
            {shelfCopy.aisle}
          </p>

          <span className={s.board} aria-hidden="true" />
          <span className={s.rail} aria-hidden="true" />

          <ul className={s.row}>
            {SHELF.map((item) => {
              const box = PACK_BOX[item.brand.kind];
              const style = { "--pw": box.w * SCALE } as CSSProperties;
              return (
                <li key={item.brand.id} className={s.cell}>
                  <a
                    href={item.href}
                    className={s.item}
                    onClick={(e) => go(e, item.href)}
                    aria-label={`${item.brand.name}: ${item.outcome.figure} ${item.outcome.label}. ${shelfCopy.hint}`}
                  >
                    <span className={s.facings} style={style}>
                      <span className={`${s.facing} ${s.back}`} data-sh="pack">
                        <Package brand={item.brand} />
                      </span>
                      <span className={s.facing} data-sh="pack">
                        <span className={s.lift}>
                          <Package brand={item.brand} />
                        </span>
                      </span>
                    </span>
                    <Tag item={item} />
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
