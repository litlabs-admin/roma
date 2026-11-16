import type { ReactNode } from "react";
import Link from "next/link";

/**
 * Renders the blog's inline markup: **bold** and [label](href). Internal links use
 * next/link; hashes and external links stay plain anchors.
 */
export function renderInline(text: string, linkClass?: string): ReactNode[] {
  const out: ReactNode[] = [];
  const re = /\*\*([^*]+)\*\*|\[([^\]]+)\]\(([^)]+)\)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let k = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index));
    if (m[1]) out.push(<strong key={k++}>{m[1]}</strong>);
    else {
      const href = m[3];
      out.push(
        href.startsWith("/") ? (
          <Link key={k++} href={href} className={linkClass}>
            {m[2]}
          </Link>
        ) : (
          <a key={k++} href={href} className={linkClass} {...(href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
            {m[2]}
          </a>
        ),
      );
    }
    last = re.lastIndex;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}
