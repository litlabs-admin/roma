"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { StoryVideo } from "@/lib/content/customers";
import v from "./video.module.css";

type Lenis = { stop: () => void; start: () => void };
const lenis = () => (window as unknown as { __lenis?: Lenis }).__lenis;

function PlayIcon({ size = 12 }: { size?: number }) {
  return (
    <svg viewBox="0 0 12 12" width={size} height={size} aria-hidden="true">
      <path d="M3 1.6v8.8a.6.6 0 0 0 .9.5l7-4.4a.6.6 0 0 0 0-1L3.9 1.1a.6.6 0 0 0-.9.5Z" fill="currentColor" />
    </svg>
  );
}

/**
 * "Watch testimonial" trigger + the full video in a native modal <dialog>.
 *
 * - showModal(): focus is trapped, the page behind is inert, Esc closes; Lenis is paused.
 * - The <video> only mounts while open, so the full file is fetched on click and closing
 *   stops playback and the download. It starts with sound (the click is the gesture).
 * - Activity (Cache Components) keeps a route's state when you navigate away; the
 *   layout-effect cleanup closes the dialog so it never comes back open.
 *
 * `variant="pill"`: a small pill (className from the caller, e.g. the story-strip pill).
 * `variant="cover"`: a full-cover button with a centred play disc (story page cover).
 */
export default function WatchTestimonial({
  video,
  label = "Watch testimonial",
  variant = "pill",
  className = "",
}: {
  video: StoryVideo;
  label?: string;
  variant?: "pill" | "cover";
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) {
      d.showModal();
      lenis()?.stop();
    } else if (!open && d.open) {
      d.close();
      lenis()?.start();
    }
  }, [open]);

  useLayoutEffect(
    () => () => {
      if (ref.current?.open) ref.current.close();
      lenis()?.start();
      setOpen(false);
    },
    [],
  );

  const sub = `${video.duration} · Captions on screen`;

  return (
    <>
      {variant === "cover" ? (
        <button type="button" className={v.cover} onClick={() => setOpen(true)} aria-haspopup="dialog">
          <span className={v.disc}>
            <PlayIcon size={22} />
          </span>
          <span className={v.coverLabel}>
            {label}
            <span className={v.coverTime}>{video.duration}</span>
          </span>
        </button>
      ) : (
        <button type="button" className={`${v.pill} ${className}`} onClick={() => setOpen(true)} aria-haspopup="dialog">
          {label}
          <PlayIcon />
          <span className="sr-only">, {video.duration}</span>
        </button>
      )}

      <dialog
        ref={ref}
        className={v.dialog}
        aria-labelledby="video-dialog-title"
        onCancel={(e) => {
          e.preventDefault();
          setOpen(false);
        }}
        onClick={(e) => {
          if (e.target === e.currentTarget) setOpen(false);
        }}
      >
        <div className={v.panel} data-lenis-prevent>
          <div className={v.head}>
            <div>
              <h2 id="video-dialog-title" className={v.title}>
                {video.title}
              </h2>
              <p className={v.sub}>{sub}</p>
            </div>
            <button type="button" className={v.close} onClick={() => setOpen(false)} aria-label="Close video">
              <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
                <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </button>
          </div>
          <div className={v.frame}>
            {open && (
              <video className={v.player} controls autoPlay playsInline preload="auto" poster={video.poster} aria-label={video.title}>
                {video.sources.map((src) => (
                  <source key={src.src} src={src.src} type="video/mp4" media={src.media} />
                ))}
                <p>
                  Your browser can’t play this video. <a href={video.sources[video.sources.length - 1].src}>Download it (MP4)</a>.
                </p>
              </video>
            )}
          </div>
        </div>
      </dialog>
    </>
  );
}
