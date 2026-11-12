"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

// Hyperline loads its widget through `__interactLoad`: only after the first real user gesture,
// so bots and Lighthouse never pay for it and LCP is untouched (DESIGN.md §I.8). Same here, plus
// a floor so the launcher never lands in the middle of the hero's load sequence (§F.4).
const AskRoma = dynamic(() => import("./AskRoma"), { ssr: false });

const MIN_DELAY_MS = 1600;
const EVENTS = ["scroll", "wheel", "pointerdown", "touchstart", "keydown", "pointermove"] as const;

export default function AskRomaLoader() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let done = false;
    let timer = 0;
    let lastX: number | null = null;
    let lastY: number | null = null;

    const go = () => {
      if (done) return;
      done = true;
      EVENTS.forEach((t) => window.removeEventListener(t, onEvent, true));
      const wait = Math.max(0, MIN_DELAY_MS - performance.now());
      timer = window.setTimeout(() => setReady(true), wait);
    };
    function onEvent(e: Event) {
      // Content moving under a still cursor fires synthetic moves; only count real movement.
      if (e.type === "pointermove") {
        const p = e as PointerEvent;
        const moved = lastX !== null && (p.clientX !== lastX || p.clientY !== lastY);
        lastX = p.clientX;
        lastY = p.clientY;
        if (!moved) return;
      }
      go();
    }
    // A conversation already in progress (reload) should come straight back.
    try {
      if (localStorage.getItem("roma-chat:v1")) go();
    } catch {}
    EVENTS.forEach((t) => window.addEventListener(t, onEvent, { capture: true, passive: true }));
    return () => {
      done = true;
      window.clearTimeout(timer);
      EVENTS.forEach((t) => window.removeEventListener(t, onEvent, true));
    };
  }, []);

  return ready ? <AskRoma /> : null;
}
