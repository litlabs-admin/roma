"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";

/**
 * Silent, looping teaser over a poster image (the poster is a next/image the parent
 * renders underneath, so it stays responsive and optimized).
 *
 * - `preload="none"`: nothing is fetched until it first plays.
 * - Plays only while `play` (the active card), on screen, and the visitor allows motion
 *   and isn't on Data Saver; otherwise it pauses and the poster/last frame shows.
 * - Fades in on its first frame, so there's no black flash over the poster.
 * - Decorative: hidden from assistive tech (the full video is behind "Watch testimonial").
 * - Pauses when Activity hides the route (display: none ends the intersection).
 */

const RM = "(prefers-reduced-motion: reduce)";

function subscribe(cb: () => void) {
  const mq = window.matchMedia(RM);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}
function blocked() {
  const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  return window.matchMedia(RM).matches || Boolean(conn?.saveData);
}

export default function TeaserVideo({
  src,
  play = true,
  position,
  className,
}: {
  src: string;
  play?: boolean;
  position?: string;
  className?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [visible, setVisible] = useState(false);
  const [ready, setReady] = useState(false);
  // Server snapshot: blocked, so nothing autoplays before hydration.
  const noAutoplay = useSyncExternalStore(subscribe, blocked, () => true);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.2 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (play && visible && !noAutoplay) {
      // Low Power Mode and some browsers refuse; the poster simply stays.
      el.play().catch(() => {});
    } else {
      el.pause();
    }
  }, [play, visible, noAutoplay]);

  return (
    <video
      ref={ref}
      className={className}
      data-ready={ready || undefined}
      src={src}
      muted
      loop
      playsInline
      preload="none"
      disablePictureInPicture
      disableRemotePlayback
      aria-hidden="true"
      tabIndex={-1}
      style={position ? { objectPosition: position } : undefined}
      onPlaying={() => setReady(true)}
    />
  );
}
