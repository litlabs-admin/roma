"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { prefersReducedMotion } from "@/lib/motion";
import s from "./calculator.module.css";

type Lenis = { stop: () => void; start: () => void };

/**
 * Mobile bottom sheet (brief §2.11: the gate form opens as a bottom sheet). A native
 * <dialog> opened with showModal(): focus is trapped, the page behind is inert, Esc
 * closes. It rises in 400ms (§F.3 state) and drops out before it closes; Lenis is paused
 * while it's open so the page doesn't scroll underneath.
 */
export default function BottomSheet({
  open,
  onClose,
  title,
  sub,
  closeLabel,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  sub?: string;
  closeLabel: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    const lenis = (window as unknown as { __lenis?: Lenis }).__lenis;
    if (open && !d.open) {
      d.showModal();
      lenis?.stop();
      requestAnimationFrame(() => d.setAttribute("data-shown", ""));
    } else if (!open && d.open) {
      d.removeAttribute("data-shown");
      const t = window.setTimeout(() => d.close(), prefersReducedMotion() ? 0 : 300);
      lenis?.start();
      return () => window.clearTimeout(t);
    }
  }, [open]);

  // Unmount safety: never leave Lenis stopped.
  useEffect(() => () => (window as unknown as { __lenis?: Lenis }).__lenis?.start(), []);

  return (
    <dialog
      ref={ref}
      className={s.sheet}
      aria-labelledby="sheet-title"
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        // A click on the backdrop (the dialog itself, outside the panel) closes it.
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className={s.sheetPanel} data-lenis-prevent>
        <span className={s.sheetGrip} aria-hidden="true" />
        <div className={s.sheetHead}>
          <div>
            <h2 id="sheet-title" className={s.sheetTitle}>
              {title}
            </h2>
            {sub && <p className={s.sheetSub}>{sub}</p>}
          </div>
          <button type="button" className={s.sheetClose} onClick={onClose} aria-label={closeLabel}>
            <svg viewBox="0 0 16 16" aria-hidden="true">
              <path d="M4 4l8 8M12 4l-8 8" />
            </svg>
          </button>
        </div>
        {children}
      </div>
    </dialog>
  );
}
