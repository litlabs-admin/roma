import type { NavIconKey } from "@/lib/content/nav";

/**
 * Nav menu glyphs: 20px line drawings (1.5 stroke, round caps) in currentColor. The tile
 * around them (cream-100 well, red-600 ink) lives in nav.module.css.
 */
const PATHS: Record<NavIconKey, React.ReactNode> = {
  // portal → ledger: three inputs joining one line
  platform: (
    <>
      <path d="M3 5h4M3 10h4M3 15h4" />
      <path d="M7 5c4 0 4 5 7 5M7 15c4 0 4-5 7-5M7 10h10" />
    </>
  ),
  // inbox tray
  deductions: (
    <>
      <path d="M3 11l2.2-6h9.6l2.2 6v4.5a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5z" />
      <path d="M3 11h4l1 2h4l1-2h4" />
    </>
  ),
  // bars
  analytics: <path d="M4 16V9M8 16V5M12 16v-5M16 16V7M3 16.5h14" />,
  // ledger page with ruled lines
  accounting: (
    <>
      <rect x="4.5" y="3" width="11" height="14" rx="1" />
      <path d="M7.5 7h5M7.5 10h5M7.5 13h3" />
    </>
  ),
  // two columns, one ticked
  compare: (
    <>
      <rect x="3" y="4" width="6" height="12" rx="1" />
      <rect x="11" y="4" width="6" height="12" rx="1" />
      <path d="M12.8 10.2l1.3 1.3 2-2.6" />
    </>
  ),
  // quote mark in a speech bubble
  stories: (
    <>
      <path d="M4 4.5h12a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H9l-3.5 3v-3H4a1 1 0 0 1-1-1v-7a1 1 0 0 1 1-1z" />
      <path d="M7.5 8v2M10.5 8v2" />
    </>
  ),
  // open book
  blog: (
    <>
      <path d="M10 6c-1.5-1.3-3.7-2-6.5-2v11c2.8 0 5 .7 6.5 2 1.5-1.3 3.7-2 6.5-2V4c-2.8 0-5 .7-6.5 2z" />
      <path d="M10 6v11" />
    </>
  ),
  // hash tag (codes)
  codes: <path d="M7.5 3.5l-1.5 13M14 3.5l-1.5 13M4 7.5h13M3.5 12.5h13" />,
  // question mark in a circle
  faq: (
    <>
      <circle cx="10" cy="10" r="7" />
      <path d="M8 8a2 2 0 1 1 2.8 1.8c-.5.3-.8.7-.8 1.2v.5M10 14v.01" />
    </>
  ),
  // two linked rings
  partners: (
    <>
      <circle cx="7.5" cy="10" r="4" />
      <circle cx="12.5" cy="10" r="4" />
    </>
  ),
  // envelope
  contact: (
    <>
      <rect x="3" y="5" width="14" height="10" rx="1" />
      <path d="M3.5 5.5L10 11l6.5-5.5" />
    </>
  ),
};

export default function NavIcon({ name }: { name: NavIconKey }) {
  return (
    <svg viewBox="0 0 20 20" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      {PATHS[name]}
    </svg>
  );
}
