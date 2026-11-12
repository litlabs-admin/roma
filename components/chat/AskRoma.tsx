"use client";

// Ask Roma — floating assistant (Hyperline "Ask Hyperline" widget, adapted; see plan).
// One dock at the bottom centre with three views: the closed pill ("button"), the open panel
// with starter questions ("suggest"), and the conversation ("chat"). The panel grows upward;
// the input stays at the bottom. Everything visual lives in askRoma.module.css.

import { memo, useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import RomaMark from "./RomaMark";
import { Markdown } from "./markdown";
import { chatCopy, STARTERS, MAX_CHARS, COUNTER_FROM, ERRORS, DEMO_HREF, type ErrorCode } from "./data";
import { prefersReducedMotion } from "@/lib/motion";
import s from "./askRoma.module.css";

type View = "button" | "suggest" | "chat";
type Msg = {
  id: string;
  role: "user" | "assistant";
  content: string;
  status?: "streaming" | "done" | "interrupted";
  followups?: string[];
  /** Out-of-scope exchange: shown, but never sent back as history. */
  offtopic?: boolean;
};

// Tunables (Hyperline widget.js values unless noted).
const STORE_KEY = "roma-chat:v1";
const TTL_MS = 24 * 60 * 60 * 1000;
const MAX_STORED = 30; // Roma: cap the stored transcript (Hyperline has none)
const MAX_STARTERS = 3;
const MAX_FOLLOWUPS = 2;
const DEMO_AFTER = 3; // questions asked before the demo callout appears
const CLOSE_SCROLL_PX = 320;
const SCROLL_INTENT_MS = 700;
const REQUEST_TIMEOUT_MS = 30_000; // Roma: Hyperline has no timeout
const EXIT_MS = 170;
// Answer reveal pacing (chars/second). Aim to clear whatever has arrived within ~1.5s, but never
// slower than a calm reading pace or faster than the eye can follow — the ChatGPT feel.
const REVEAL_MIN_CPS = 90;
const REVEAL_MAX_CPS = 320;
const REVEAL_LAG_S = 1.5;
const REVEAL_SCROLL_EASE = 0.18; // share of the remaining distance scrolled per frame
const WORD_FADE_MS = 420; // keep in sync with .word in askRoma.module.css
const RESET_MS = 180;

const uid = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`;

class ChatError extends Error {
  constructor(public code: ErrorCode) {
    super(code);
  }
}

function loadStored(): { messages: Msg[]; view: View } {
  try {
    const raw = JSON.parse(localStorage.getItem(STORE_KEY) || "null");
    if (raw && raw.v === 1 && Date.now() - raw.ts < TTL_MS && Array.isArray(raw.messages)) {
      // A refresh mid-answer leaves a streaming message: keep what arrived, mark it cut short.
      const messages: Msg[] = raw.messages.map((m: Msg) =>
        m.status === "streaming" ? { ...m, status: "interrupted" } : m,
      );
      // A reload never reopens an empty dock; an open conversation comes back as it was.
      const view: View = raw.view === "chat" && messages.length ? "chat" : "button";
      return { messages, view };
    }
  } catch {}
  return { messages: [], view: "button" };
}

/** Minimal SSE reader for our own route's frames. */
async function readSSE(body: ReadableStream<Uint8Array>, onEvent: (event: string, data: unknown) => void) {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buf = "";
  while (true) {
    const { done, value } = await reader.read();
    if (done) return;
    buf += decoder.decode(value, { stream: true });
    const frames = buf.split("\n\n");
    buf = frames.pop() ?? "";
    for (const f of frames) {
      const ev = /^event: (.*)$/m.exec(f);
      const data = /^data: (.*)$/m.exec(f);
      if (!ev || !data) continue;
      let parsed: unknown;
      try {
        parsed = JSON.parse(data[1]);
      } catch {
        continue;
      }
      onEvent(ev[1], parsed);
    }
  }
}

const plain = (md: string) => md.replace(/\*\*|\[|\]\([^)]*\)/g, "");

export default function AskRoma() {
  const [initial] = useState(loadStored);
  const [view, setView] = useState<View>(initial.view);
  const [messages, setMessages] = useState<Msg[]>(initial.messages);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<ErrorCode | null>(() =>
    initial.messages.at(-1)?.status === "interrupted" ? "interrupted" : null,
  );
  const [closing, setClosing] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [launcherAnim, setLauncherAnim] = useState<"arrive" | "pop" | null>("arrive");
  const [logScrolled, setLogScrolled] = useState(false);
  const [sendTick, setSendTick] = useState(0);
  const [resetTick, setResetTick] = useState(0);
  const [announce, setAnnounce] = useState("");
  // Smooth reveal (ChatGPT-style): the network fills `content` in bursts; the screen shows
  // `content.slice(0, shownN)` of the answer `revealId`, advanced word by word at a steady pace.
  const [revealId, setRevealId] = useState<string | null>(null);
  const [shownN, setShownN] = useState(0);
  // Client-only component (loaded with ssr:false), so navigator is safe here.
  const [shortcut] = useState(() => (/Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent) ? "⌘K" : "Ctrl K"));

  const rootRef = useRef<HTMLDivElement>(null);
  const dockRef = useRef<HTMLDivElement>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const launcherRef = useRef<HTMLButtonElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const stickRef = useRef(true);
  const openedAtRef = useRef<number | null>(null);
  const intentAtRef = useRef(0);
  const closingRef = useRef(false);
  const messagesRef = useRef(messages);
  const busyRef = useRef(false);
  useLayoutEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  // ── persistence (Hyperline: localStorage, 24h TTL) ───────────────────────
  useEffect(() => {
    try {
      if (!messages.length && view === "button") localStorage.removeItem(STORE_KEY);
      else
        localStorage.setItem(
          STORE_KEY,
          JSON.stringify({ v: 1, ts: Date.now(), view, messages: messages.slice(-MAX_STORED) }),
        );
    } catch {}
  }, [messages, view]);

  // Cancel any in-flight request on unmount.
  useEffect(() => () => abortRef.current?.abort("cancel"), []);

  // ── open / close ──────────────────────────────────────────────────────────
  const open = useCallback(() => {
    if (closingRef.current) return;
    openedAtRef.current = window.scrollY;
    setView(messagesRef.current.length ? "chat" : "suggest");
  }, []);

  const close = useCallback(() => {
    if (closingRef.current) return;
    closingRef.current = true;
    const hadFocus = !!dockRef.current?.contains(document.activeElement);
    setClosing(true);
    window.setTimeout(
      () => {
        closingRef.current = false;
        openedAtRef.current = null;
        setClosing(false);
        setView("button");
        setLauncherAnim("pop");
        // Return focus to the launcher only if it was inside the panel (never steal it from the page).
        if (hadFocus) requestAnimationFrame(() => launcherRef.current?.focus({ preventScroll: true }));
      },
      prefersReducedMotion() ? 0 : EXIT_MS,
    );
  }, []);

  const isOpen = view !== "button";

  // Focus the input when the panel opens (not on touch: don't throw the keyboard up unasked).
  useEffect(() => {
    if (!isOpen) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;
    inputRef.current?.focus({ preventScroll: true });
  }, [isOpen]);

  // ⌘K / Ctrl+K opens from anywhere (Hyperline); when open it jumps to the input.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!(e.metaKey || e.ctrlKey) || e.altKey || e.shiftKey || e.key.toLowerCase() !== "k") return;
      e.preventDefault();
      if (view === "button") open();
      else inputRef.current?.focus({ preventScroll: true });
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [view, open]);

  // While open: Esc, outside click (unless a draft is being written), deliberate page scroll.
  useEffect(() => {
    if (!isOpen) return;
    const inside = (t: EventTarget | null) => !!(t instanceof Node && dockRef.current?.contains(t));
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    const onPointer = (e: PointerEvent) => {
      if (inside(e.target) || inputRef.current?.value.trim()) return;
      close();
    };
    const markIntent = (e: Event) => {
      if (!inside(e.target)) intentAtRef.current = Date.now();
    };
    const onScrollKey = (e: KeyboardEvent) => {
      if (["ArrowDown", "ArrowUp", "PageDown", "PageUp", "Home", "End", " "].includes(e.key)) markIntent(e);
    };
    const onScroll = () => {
      const at = openedAtRef.current;
      if (at === null) return;
      if (Date.now() - intentAtRef.current < SCROLL_INTENT_MS && Math.abs(window.scrollY - at) >= CLOSE_SCROLL_PX) {
        close();
      }
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("wheel", markIntent, { passive: true, capture: true });
    document.addEventListener("touchmove", markIntent, { passive: true, capture: true });
    document.addEventListener("keydown", onScrollKey, true);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("wheel", markIntent, { capture: true });
      document.removeEventListener("touchmove", markIntent, { capture: true });
      document.removeEventListener("keydown", onScrollKey, true);
      window.removeEventListener("scroll", onScroll);
    };
  }, [isOpen, close]);

  // Mobile keyboard: keep the dock above it and within the visible viewport.
  useEffect(() => {
    const vv = window.visualViewport;
    const el = rootRef.current;
    if (!isOpen || !vv || !el) return;
    const update = () => {
      const kb = Math.max(0, window.innerHeight - vv.height - vv.offsetTop);
      el.style.setProperty("--kb", `${kb}px`);
      el.style.setProperty("--vvh", `${vv.height}px`);
    };
    update();
    vv.addEventListener("resize", update);
    vv.addEventListener("scroll", update);
    return () => {
      vv.removeEventListener("resize", update);
      vv.removeEventListener("scroll", update);
      el.style.removeProperty("--kb");
      el.style.removeProperty("--vvh");
    };
  }, [isOpen]);

  // ── conversation scrolling ───────────────────────────────────────────────
  // The panel grows upward as the answer gets longer. Ease its height to the content instead of
  // letting it jump a full line each time text wraps (the second source of "shake").
  // Written straight to the DOM (no React state) so a wrap costs no extra render.
  const logInnerRef = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const inner = logInnerRef.current;
    const log = logRef.current;
    if (!inner || !log || view !== "chat") return;
    const cs = getComputedStyle(log);
    const pad = parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom);
    const apply = () => {
      log.style.height = `${inner.offsetHeight + pad}px`;
    };
    apply();
    const ro = new ResizeObserver(apply);
    ro.observe(inner);
    return () => {
      ro.disconnect();
      log.style.removeProperty("height");
    };
  }, [view]);

  const lastLogRef = useRef<HTMLDivElement | null>(null);
  useLayoutEffect(() => {
    const log = logRef.current;
    if (!log) return;
    if (log !== lastLogRef.current) {
      // Panel just opened on an existing conversation: start at the bottom, no animation.
      lastLogRef.current = log;
      log.scrollTop = log.scrollHeight;
      return;
    }
    // While an answer is revealing, the reveal loop eases the scroll itself.
    if (revealId || !stickRef.current) return;
    log.scrollTo({ top: log.scrollHeight, behavior: prefersReducedMotion() ? "auto" : "smooth" });
  }, [messages, error, view, busy, revealId]);

  // Reveal loop: steady word-by-word pace that speeds up with the backlog (never falls far
  // behind the network), plus an eased follow-scroll instead of snapping on every token.
  useEffect(() => {
    if (!revealId) return;
    const reduce = prefersReducedMotion();
    let raf = 0;
    let last = performance.now();
    let pos = 0;
    let shown = 0;
    let doneAt: number | null = null;
    const tick = (now: number) => {
      const dt = Math.min(64, now - last);
      last = now;
      const m = messagesRef.current.find((x) => x.id === revealId);
      if (!m) {
        setRevealId(null); // reset / removed
        return;
      }
      const text = m.content;
      const total = text.length;
      const streaming = m.status === "streaming";
      if (shown < total) {
        const backlog = total - pos;
        const cps = reduce
          ? Infinity
          : Math.min(REVEAL_MAX_CPS, Math.max(REVEAL_MIN_CPS, backlog / REVEAL_LAG_S));
        pos = Math.min(total, pos + (cps * dt) / 1000);
        let n = Math.floor(pos);
        if (n < total) {
          // Only ever show whole words.
          const toEnd = text.slice(n).search(/\s/);
          if (toEnd !== -1) n += toEnd;
          else if (!streaming) n = total;
          else n = Math.max(shown, text.lastIndexOf(" ", n), text.lastIndexOf("\n", n)); // word still arriving
        }
        if (n > shown) {
          shown = n;
          pos = Math.max(pos, n);
          setShownN(n);
        }
      } else if (!streaming) {
        // Fully shown and the stream is over: let the last words finish fading, then hand off
        // to plain rendering and show the follow-ups.
        doneAt ??= now;
        if (reduce || now - doneAt >= WORD_FADE_MS) {
          setRevealId(null);
          return;
        }
      }
      const log = logRef.current;
      if (log && stickRef.current) {
        const d = log.scrollHeight - log.clientHeight - log.scrollTop;
        if (d > 0.5) log.scrollTop += reduce ? d : Math.max(1, d * REVEAL_SCROLL_EASE);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [revealId]);

  const onLogScroll = () => {
    const log = logRef.current;
    if (!log) return;
    // Follow the stream only while the reader is at the bottom; scrolling up pauses it.
    stickRef.current = log.scrollHeight - log.scrollTop - log.clientHeight < 48;
    setLogScrolled(log.scrollTop > 1);
  };

  // Textarea grows to 120px, then scrolls (Hyperline autosize()).
  useLayoutEffect(() => {
    const ta = inputRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = `${Math.min(ta.scrollHeight, 120)}px`;
  }, [input, view]);

  // ── sending ───────────────────────────────────────────────────────────────
  const send = useCallback(async (text: string, retry = false) => {
    if (busyRef.current) return;
    let base = messagesRef.current;
    let userId: string;
    if (retry) {
      if (base.at(-1)?.role === "assistant") base = base.slice(0, -1); // replace the cut-short answer
      const lastUser = base.at(-1);
      if (!lastUser || lastUser.role !== "user") return;
      userId = lastUser.id;
    } else {
      const q = text.trim().slice(0, MAX_CHARS);
      if (!q) return;
      userId = uid();
      base = [...base, { id: userId, role: "user", content: q }];
      setInput("");
      setSendTick((t) => t + 1);
    }

    setError(null);
    setView("chat");
    stickRef.current = true;
    // A clicked starter/follow-up row unmounts with its focus; keep the visitor in the input
    // (not on touch, where focusing would pop the keyboard over the answer).
    if (!window.matchMedia("(pointer: coarse)").matches) inputRef.current?.focus({ preventScroll: true });

    if (!navigator.onLine) {
      setMessages(base);
      setError("offline");
      return;
    }

    const history = base
      .filter((m) => !m.offtopic && (m.role === "user" || m.status === "done"))
      .map(({ role, content }) => ({ role, content }));

    const aid = uid();
    setMessages([...base, { id: aid, role: "assistant", content: "", status: "streaming" }]);
    setShownN(0);
    setRevealId(aid);
    setBusy(true);
    busyRef.current = true;

    const ctrl = new AbortController();
    abortRef.current = ctrl;
    const timer = window.setTimeout(() => ctrl.abort("timeout"), REQUEST_TIMEOUT_MS);
    const update = (fn: (m: Msg) => Msg) => setMessages((ms) => ms.map((m) => (m.id === aid ? fn(m) : m)));
    let partial = false;
    let ended = false;
    let finalText = "";

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
        signal: ctrl.signal,
      });
      if (!res.ok || !res.body) {
        let code: ErrorCode = res.status === 429 ? "busy" : res.status === 400 ? "bad_request" : "server";
        try {
          const j = await res.json();
          if (j?.code && j.code in ERRORS) code = j.code;
        } catch {}
        throw new ChatError(code);
      }
      await readSSE(res.body, (event, data) => {
        if (event === "delta") {
          const t = (data as { t?: string })?.t ?? "";
          if (!t) return;
          partial = true;
          finalText += t;
          update((m) => ({ ...m, content: m.content + t }));
        } else if (event === "followups" && Array.isArray(data)) {
          update((m) => ({ ...m, followups: (data as string[]).slice(0, MAX_FOLLOWUPS) }));
        } else if (event === "offtopic") {
          ended = true;
          finalText = chatCopy.offTopic;
          setMessages((ms) =>
            ms.map((m) =>
              m.id === aid
                ? { ...m, content: chatCopy.offTopic, status: "done", offtopic: true, followups: STARTERS.slice(0, 2) }
                : m.id === userId
                  ? { ...m, offtopic: true }
                  : m,
            ),
          );
        } else if (event === "error") {
          const code = (data as { code?: string })?.code;
          throw new ChatError(code && code in ERRORS ? (code as ErrorCode) : "interrupted");
        } else if (event === "done") {
          ended = true;
          update((m) => ({ ...m, status: "done" }));
        }
      });
      if (!ended) throw new ChatError("interrupted");
      setAnnounce(plain(finalText));
    } catch (err) {
      if (ctrl.signal.reason === "cancel") return; // reset / unmount: nothing to show
      let code: ErrorCode =
        err instanceof ChatError
          ? err.code
          : ctrl.signal.reason === "timeout"
            ? "timeout"
            : !navigator.onLine
              ? "offline"
              : err instanceof TypeError // fetch() itself failed: connection dropped / blocked
                ? "network"
                : "server";
      // Keep whatever already streamed (Hyperline overwrites it) and offer a retry.
      if (partial) {
        update((m) => ({ ...m, status: "interrupted" }));
        if (code !== "offline") code = "interrupted";
      } else {
        setMessages((ms) => ms.filter((m) => m.id !== aid));
      }
      setError(code);
    } finally {
      window.clearTimeout(timer);
      if (abortRef.current === ctrl) abortRef.current = null;
      busyRef.current = false;
      setBusy(false);
    }
  }, []);

  const reset = () => {
    abortRef.current?.abort("cancel");
    setResetTick((t) => t + 1);
    setResetting(true);
    window.setTimeout(
      () => {
        setMessages([]);
        setError(null);
        setAnnounce("");
        setResetting(false);
        setLogScrolled(false);
        setView("suggest");
        inputRef.current?.focus({ preventScroll: true });
      },
      prefersReducedMotion() ? 0 : RESET_MS,
    );
  };

  // ── derived ───────────────────────────────────────────────────────────────
  const asked = messages.filter((m) => m.role === "user" && !m.offtopic);
  const askedSet = new Set(asked.map((m) => m.content.trim().toLowerCase()));
  const last = messages.at(-1);
  // Follow-ups and the demo callout wait until the answer has finished revealing.
  const lastDone =
    !busy && !revealId && last?.role === "assistant" && last.status === "done" ? last : null;
  const showDemo = !!lastDone && !lastDone.offtopic && asked.length >= DEMO_AFTER;
  const followups = lastDone
    ? (lastDone.followups ?? [])
        .filter((q) => lastDone.offtopic || !askedSet.has(q.trim().toLowerCase()))
        .slice(0, showDemo ? 1 : MAX_FOLLOWUPS)
    : [];
  const canSend = !!input.trim() && !busy;
  const count = input.length;

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      if (canSend) send(input);
    }
  };

  const row = (q: string, i: number, key: string) => (
    <button
      key={key}
      type="button"
      className={s.row}
      style={{ "--i": i } as React.CSSProperties}
      onClick={() => send(q)}
      disabled={busy}
    >
      <IconReturn />
      <span>{q}</span>
    </button>
  );

  return (
    <div
      ref={rootRef}
      className={s.root}
      data-view={view}
      data-closing={closing || undefined}
      data-resetting={resetting || undefined}
      data-log-scrolled={(view === "chat" && logScrolled) || undefined}
    >
      {view === "button" && (
        <div className={s.btnLayer}>
          <button
            ref={launcherRef}
            type="button"
            className={s.launcher}
            data-anim={launcherAnim ?? undefined}
            onAnimationEnd={(e) => {
              if (e.target === e.currentTarget) setLauncherAnim(null);
            }}
            onClick={open}
            aria-label={chatCopy.launcherAria}
            aria-haspopup="dialog"
          >
            <RomaMark className={s.launcherMark} />
            <span className={s.label}>{chatCopy.launcher}</span>
            <span className={s.hint} aria-hidden="true">
              <span>
                <kbd>{shortcut}</kbd>
              </span>
            </span>
          </button>
        </div>
      )}

      {view !== "button" && (
        <div ref={dockRef} className={s.dock} data-lenis-prevent>
          <div className={s.box} role="dialog" aria-label={chatCopy.title}>
            <div className={s.tools}>
              <span className={s.toolsTitle}>{chatCopy.title}</span>
              <span className={s.toolsActions}>
                <span className={s.toolItem}>
                  <button type="button" className={s.icon} aria-label={chatCopy.about} aria-describedby="ask-roma-about">
                    <IconInfo />
                  </button>
                  <span className={`${s.tip} ${s.tipAbout}`} id="ask-roma-about" role="tooltip">
                    {chatCopy.disclaimer}
                  </span>
                </span>
                {view === "chat" && (
                  <span className={s.toolItem}>
                    <button
                      type="button"
                      className={s.icon}
                      onClick={reset}
                      aria-label={chatCopy.reset}
                      aria-describedby="ask-roma-reset"
                    >
                      <span key={resetTick} className={resetTick ? s.spin : undefined}>
                        <IconReset />
                      </span>
                    </button>
                    <span className={s.tip} id="ask-roma-reset" role="tooltip">
                      {chatCopy.reset}
                    </span>
                  </span>
                )}
                <span className={s.toolItem}>
                  <button
                    type="button"
                    className={s.icon}
                    onClick={close}
                    aria-label={chatCopy.minimize}
                    aria-describedby="ask-roma-min"
                  >
                    <IconMinimize />
                  </button>
                  <span className={s.tip} id="ask-roma-min" role="tooltip">
                    {chatCopy.minimize}
                  </span>
                </span>
              </span>
            </div>

            {view === "suggest" && (
              <div className={s.suggest} data-collapsed={!!input.trim() || undefined}>
                <div className={s.rows}>{STARTERS.slice(0, MAX_STARTERS).map((q, i) => row(q, i, q))}</div>
              </div>
            )}

            {view === "chat" && (
              <div ref={logRef} className={s.log} onScroll={onLogScroll}>
                <div ref={logInnerRef} className={s.logInner}>
                {messages.map((m) =>
                  m.role === "user" ? (
                    <div key={m.id} className={s.user}>
                      {m.content}
                    </div>
                  ) : (
                    <BotMessage
                      key={m.id}
                      text={m.id === revealId ? m.content.slice(0, shownN) : m.content}
                      revealing={m.id === revealId}
                      onLink={close}
                    />
                  ),
                )}

                {error && !revealId && (
                  <div className={s.note}>
                    <span>{ERRORS[error].text}</span>
                    <span className={s.noteActions}>
                      {ERRORS[error].retry && (
                        <button type="button" className={s.retry} onClick={() => send("", true)}>
                          <IconReset />
                          {chatCopy.retry}
                        </button>
                      )}
                      {ERRORS[error].demo && (
                        <a className={s.retry} href={DEMO_HREF} onClick={close}>
                          {chatCopy.demoCta}
                        </a>
                      )}
                    </span>
                  </div>
                )}

                {showDemo && (
                  <div className={s.demo}>
                    <span>{chatCopy.demoText}</span>
                    <a className={s.cta} href={DEMO_HREF} onClick={close}>
                      {chatCopy.demoCta}
                    </a>
                  </div>
                )}

                {followups.length > 0 && (
                  <div className={`${s.rows} ${s.followups}`}>
                    {followups.map((q, i) => row(q, i, `${lastDone!.id}-${q}`))}
                  </div>
                )}
                </div>
              </div>
            )}

            <form
              className={s.form}
              onSubmit={(e) => {
                e.preventDefault();
                if (canSend) send(input);
              }}
            >
              <div className={s.field}>
                <RomaMark className={s.fieldMark} />
                <textarea
                  ref={inputRef}
                  rows={1}
                  maxLength={MAX_CHARS}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={onKeyDown}
                  placeholder={chatCopy.placeholder}
                  aria-label={chatCopy.inputAria}
                  enterKeyHint="send"
                />
                {count >= COUNTER_FROM && (
                  <span className={s.counter} data-full={count >= MAX_CHARS || undefined} aria-live="polite">
                    {count}/{MAX_CHARS}
                  </span>
                )}
                <button type="submit" className={s.send} disabled={!canSend} aria-label={chatCopy.send} title={chatCopy.send}>
                  <span key={sendTick} className={sendTick ? s.fly : undefined}>
                    <IconSend />
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Finished answers only — streaming text would make screen readers stutter. */}
      <div className={s.srOnly} role="status" aria-live="polite">
        {announce}
      </div>
    </div>
  );
}

/** One answer. Memoized: while an answer reveals (a render per word), earlier answers don't
 *  re-parse their Markdown. */
const BotMessage = memo(function BotMessage({
  text,
  revealing,
  onLink,
}: {
  text: string;
  revealing: boolean;
  onLink: () => void;
}) {
  return (
    <div className={s.bot}>
      {revealing && !text.trim() ? (
        <span className={s.thinking}>
          <RomaMark className={s.thinkingMark} />
          <span className={s.srOnly}>{chatCopy.thinking}</span>
        </span>
      ) : (
        <Markdown text={text} streaming={revealing} wordClass={s.word} onLink={onLink} />
      )}
    </div>
  );
});

// Phosphor (regular) icons, MIT — the same set Hyperline's widget inlines.
const IconSend = () => (
  <svg viewBox="0 0 256 256" fill="currentColor" aria-hidden="true">
    <path d="M205.66,117.66a8,8,0,0,1-11.32,0L136,59.31V216a8,8,0,0,1-16,0V59.31L61.66,117.66a8,8,0,0,1-11.32-11.32l72-72a8,8,0,0,1,11.32,0l72,72A8,8,0,0,1,205.66,117.66Z" />
  </svg>
);
const IconMinimize = () => (
  <svg viewBox="0 0 256 256" fill="currentColor" aria-hidden="true">
    <path d="M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z" />
  </svg>
);
const IconInfo = () => (
  <svg viewBox="0 0 256 256" fill="currentColor" aria-hidden="true">
    <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm16-40a8,8,0,0,1-8,8,16,16,0,0,1-16-16V128a8,8,0,0,1,0-16,16,16,0,0,1,16,16v40A8,8,0,0,1,144,176ZM112,84a12,12,0,1,1,12,12A12,12,0,0,1,112,84Z" />
  </svg>
);
const IconReset = () => (
  <svg viewBox="0 0 256 256" fill="currentColor" aria-hidden="true">
    <path d="M224,128a96,96,0,0,1-94.71,96H128A95.38,95.38,0,0,1,62.1,197.8a8,8,0,0,1,11-11.63A80,80,0,1,0,71.43,71.39a3.07,3.07,0,0,1-.26.25L44.59,96H72a8,8,0,0,1,0,16H24a8,8,0,0,1-8-8V56a8,8,0,0,1,16,0V85.8L60.25,60A96,96,0,0,1,224,128Z" />
  </svg>
);
const IconReturn = () => (
  <svg viewBox="0 0 256 256" fill="currentColor" aria-hidden="true">
    <path d="M221.66,181.66l-48,48a8,8,0,0,1-11.32-11.32L196.69,184H72a8,8,0,0,1-8-8V32a8,8,0,0,1,16,0V168H196.69l-34.35-34.34a8,8,0,0,1,11.32-11.32l48,48A8,8,0,0,1,221.66,181.66Z" />
  </svg>
);
