import type { ReactNode } from "react";

// Minimal, safe Markdown for answers (Hyperline's widget does the same by hand): paragraphs,
// "- " / "1." lists, **bold** and [links](…). Builds React nodes — no innerHTML anywhere.
//
// While an answer is being revealed (`streaming`), every word is its own span keyed by its
// character offset: words already on screen keep their DOM node, and only new words mount —
// so only they play the fade-in. Half-written syntax is held back so the layout never flips
// ("-" becoming a list, "**" becoming bold, "[text](" becoming a link).

function safeHref(url: string): string | null {
  if (url.startsWith("#") || (url.startsWith("/") && !url.startsWith("//"))) return url;
  try {
    const u = new URL(url);
    return u.protocol === "https:" || u.protocol === "mailto:" ? u.href : null;
  } catch {
    return null;
  }
}

type Ctx = { onLink?: () => void; wordClass?: string; streaming: boolean };

/** Plain text → words (spans while streaming). `base` = offset of `text` in its line, for stable keys. */
function words(text: string, base: number, key: string, ctx: Ctx): ReactNode[] {
  if (!ctx.streaming) return [text];
  const out: ReactNode[] = [];
  let pos = 0;
  for (const tok of text.split(/(\s+)/)) {
    if (!tok) continue;
    if (/^\s+$/.test(tok)) out.push(tok);
    else
      out.push(
        <span key={`${key}w${base + pos}`} className={ctx.wordClass}>
          {tok}
        </span>,
      );
    pos += tok.length;
  }
  return out;
}

const INLINE = /\*\*([^*]+)\*\*|\[([^\]]+)\]\(([^)\s]+)\)/g;

function inline(raw: string, key: string, ctx: Ctx): ReactNode[] {
  let text = raw;
  if (ctx.streaming) {
    // Unfinished link "[Book a d" / "[Book a demo](#de": hold it back until it closes.
    const open = text.lastIndexOf("[");
    if (open !== -1 && !/\]\([^)\s]*\)/.test(text.slice(open))) text = text.slice(0, open);
    // Unclosed bold: close it virtually so the strong element grows in place (same key).
    if ((text.match(/\*\*/g)?.length ?? 0) % 2 === 1) text = text.endsWith("**") ? text.slice(0, -2) : `${text}**`;
  }

  const out: ReactNode[] = [];
  let last = 0;
  for (const m of text.matchAll(INLINE)) {
    if (m.index > last) out.push(...words(text.slice(last, m.index), last, key, ctx));
    if (m[1] !== undefined) {
      out.push(<strong key={`${key}b${m.index}`}>{words(m[1], m.index + 2, `${key}b`, ctx)}</strong>);
    } else {
      const href = safeHref(m[3]);
      if (!href) out.push(...words(m[2], m.index + 1, key, ctx));
      else {
        // Same-site links open in place (the conversation persists); others in a new tab.
        const external = href.startsWith("mailto:") || (href.startsWith("https:") && new URL(href).host !== location.host);
        out.push(
          <a
            key={`${key}a${m.index}`}
            href={href}
            onClick={ctx.onLink}
            className={ctx.streaming ? ctx.wordClass : undefined}
            {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          >
            {m[2]}
          </a>,
        );
      }
    }
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push(...words(text.slice(last), last, key, ctx));
  return out;
}

type Props = { text: string; streaming?: boolean; wordClass?: string; onLink?: () => void };

export function Markdown({ text, streaming = false, wordClass, onLink }: Props) {
  return <>{renderMarkdown(text, { streaming, wordClass, onLink })}</>;
}

const MARKER_ONLY = /^\s*([-*•]|\d+[.)]?)\s*$/;

function renderMarkdown(text: string, ctx: Ctx): ReactNode[] {
  const lines = text.split("\n");
  const blocks: { type: "p" | "ul" | "ol"; lines: string[] }[] = [];
  lines.forEach((raw, i) => {
    const line = raw.trimEnd();
    // A list marker with no text yet would render as a stray "-" paragraph for a frame.
    if (ctx.streaming && i === lines.length - 1 && MARKER_ONLY.test(line)) return;
    const ul = /^\s*[-*•]\s+(.*)$/.exec(line);
    const ol = /^\s*\d+[.)]\s+(.*)$/.exec(line);
    const prev = blocks[blocks.length - 1];
    if (ul || ol) {
      const type = ul ? "ul" : "ol";
      const content = (ul ?? ol)![1];
      if (prev && prev.type === type) prev.lines.push(content);
      else blocks.push({ type, lines: [content] });
    } else if (line.trim()) {
      // Strip stray heading markers rather than rendering "#".
      blocks.push({ type: "p", lines: [line.replace(/^#{1,6}\s+/, "")] });
    }
  });

  return blocks.map((b, bi) => {
    const k = `m${bi}`;
    if (b.type === "p") return <p key={k}>{inline(b.lines[0], k, ctx)}</p>;
    const items = b.lines.map((l, li) => <li key={`${k}i${li}`}>{inline(l, `${k}i${li}`, ctx)}</li>);
    return b.type === "ul" ? <ul key={k}>{items}</ul> : <ol key={k}>{items}</ol>;
  });
}
