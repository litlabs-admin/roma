// Ask Roma — chat endpoint. Stateless: the client sends the recent turns, we stream one answer.
//
// Wire format to the client (Server-Sent Events, Hyperline's shape):
//   event: delta      data: {"t":"..."}        answer text, in order
//   event: followups  data: ["...","..."]      up to 2 follow-up questions
//   event: offtopic   data: {}                 the question was out of scope (client shows fixed copy)
//   event: error      data: {"code":"..."}     stream failed after it started
//   event: done       data: {}
// Errors before streaming are JSON `{ code }` with an HTTP status. Codes only — never provider
// messages — so the client can show friendly copy (components/chat/data.ts ERRORS).

import { SYSTEM_PROMPT, OFFTOPIC_TOKEN, FOLLOWUPS_TOKEN } from "@/lib/content/knowledge";

export const maxDuration = 30;

const OPENAI_URL = "https://api.openai.com/v1/chat/completions";
const MODEL = process.env.OPENAI_MODEL || "gpt-5.4-mini";
const MAX_OUTPUT_TOKENS = 450;
const UPSTREAM_TIMEOUT_MS = 25_000;

const MAX_BODY_BYTES = 24_000;
const MAX_USER_CHARS = 1000;
const MAX_ASSISTANT_CHARS = 4000;
const MAX_HISTORY = 8; // messages (≈ last 4 exchanges) — keeps input tokens bounded

type Msg = { role: "user" | "assistant"; content: string };

const json = (code: string, status: number) => Response.json({ code }, { status });

/** Same-origin only: browsers always send Origin on a POST fetch. */
function sameOrigin(req: Request): boolean {
  const origin = req.headers.get("origin");
  if (!origin) return false;
  try {
    const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

function parseMessages(body: unknown): Msg[] | null {
  if (!body || typeof body !== "object") return null;
  const raw = (body as { messages?: unknown }).messages;
  if (!Array.isArray(raw) || raw.length === 0 || raw.length > 40) return null;
  const msgs: Msg[] = [];
  for (const m of raw) {
    if (!m || typeof m !== "object") return null;
    const { role, content } = m as { role?: unknown; content?: unknown };
    if ((role !== "user" && role !== "assistant") || typeof content !== "string") return null;
    const text = content.trim();
    if (!text) continue;
    if (text.length > (role === "user" ? MAX_USER_CHARS : MAX_ASSISTANT_CHARS)) return null;
    msgs.push({ role, content: text });
  }
  let recent = msgs.slice(-MAX_HISTORY);
  while (recent.length && recent[0].role !== "user") recent = recent.slice(1);
  if (!recent.length || recent[recent.length - 1].role !== "user") return null;
  return recent;
}

/** Longest suffix of `s` that is a prefix of `token` — held back so a marker is never streamed half-way. */
function partialMarkerLength(s: string, token: string): number {
  for (let n = Math.min(token.length - 1, s.length); n > 0; n--) {
    if (token.startsWith(s.slice(-n))) return n;
  }
  return 0;
}

function parseFollowups(raw: string): string[] {
  const match = raw.match(/\[[\s\S]*\]/);
  if (!match) return [];
  try {
    const arr = JSON.parse(match[0]);
    if (!Array.isArray(arr)) return [];
    return arr
      .filter((q): q is string => typeof q === "string")
      .map((q) => q.trim())
      .filter((q) => q.length > 0 && q.length <= 120)
      .slice(0, 2);
  } catch {
    return [];
  }
}

export async function POST(req: Request) {
  if (!sameOrigin(req)) return json("forbidden", 403);

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.error("[ask-roma] OPENAI_API_KEY is not set");
    return json("server", 503);
  }

  const text = await req.text();
  if (text.length > MAX_BODY_BYTES) return json("bad_request", 400);
  let body: unknown;
  try {
    body = JSON.parse(text);
  } catch {
    return json("bad_request", 400);
  }
  const messages = parseMessages(body);
  if (!messages) return json("bad_request", 400);

  // One controller for: client disconnect, our timeout, and early stop on off-topic.
  const upstream = new AbortController();
  const timeout = setTimeout(() => upstream.abort("timeout"), UPSTREAM_TIMEOUT_MS);
  req.signal.addEventListener("abort", () => upstream.abort("client"));

  let res: Response;
  try {
    res = await fetch(OPENAI_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: MODEL,
        stream: true,
        max_completion_tokens: MAX_OUTPUT_TOKENS,
        messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
      }),
      signal: upstream.signal,
    });
  } catch (err) {
    clearTimeout(timeout);
    if (upstream.signal.reason === "client") return new Response(null, { status: 499 });
    console.error("[ask-roma] upstream fetch failed", err);
    return json(upstream.signal.reason === "timeout" ? "timeout" : "server", 504);
  }

  if (!res.ok || !res.body) {
    clearTimeout(timeout);
    const detail = await res.text().catch(() => "");
    console.error(`[ask-roma] OpenAI ${res.status}`, detail.slice(0, 500));
    // 429 = rate limit or spend limit reached → "busy"; everything else is ours to fix.
    return json(res.status === 429 ? "busy" : "server", res.status === 429 ? 429 : 502);
  }

  const upstreamBody = res.body;
  const encoder = new TextEncoder();

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const send = (event: string, data: unknown) =>
        controller.enqueue(encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`));

      const reader = upstreamBody.getReader();
      const decoder = new TextDecoder();
      let buf = "";
      let answer = ""; // everything the model wrote
      let emitted = 0; // how much of `answer` has been sent as delta
      let decided = false; // off-topic check done
      let followupAt = -1;
      let finished = false;

      const flush = (final: boolean) => {
        if (followupAt === -1) {
          const idx = answer.indexOf(FOLLOWUPS_TOKEN);
          if (idx !== -1) followupAt = idx;
        }
        const end =
          followupAt !== -1 ? followupAt : final ? answer.length : answer.length - partialMarkerLength(answer, FOLLOWUPS_TOKEN);
        if (end > emitted) {
          const chunk = answer.slice(emitted, end);
          emitted = end;
          // Trailing whitespace before the marker is noise.
          const out = followupAt !== -1 || final ? chunk.replace(/\s+$/, "") : chunk;
          if (out) send("delta", { t: out });
        }
      };

      try {
        outer: while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buf += decoder.decode(value, { stream: true });
          const lines = buf.split("\n");
          buf = lines.pop() ?? "";
          for (const line of lines) {
            const l = line.trim();
            if (!l.startsWith("data:")) continue;
            const data = l.slice(5).trim();
            if (data === "[DONE]") {
              finished = true;
              break outer;
            }
            let piece = "";
            try {
              const parsed = JSON.parse(data);
              piece = parsed?.choices?.[0]?.delta?.content ?? "";
              if (parsed?.choices?.[0]?.finish_reason) finished = true;
            } catch {
              continue;
            }
            if (!piece) continue;
            answer += piece;

            if (!decided) {
              const head = answer.trimStart();
              if (head.length < OFFTOPIC_TOKEN.length && OFFTOPIC_TOKEN.startsWith(head)) continue; // still ambiguous
              decided = true;
              if (head.startsWith(OFFTOPIC_TOKEN)) {
                upstream.abort("offtopic"); // stop paying for output tokens now
                send("offtopic", {});
                send("done", {});
                return;
              }
              answer = head;
            }
            flush(false);
          }
        }

        if (!decided && answer.trim().startsWith(OFFTOPIC_TOKEN.slice(0, 2))) {
          // Model ended inside the marker (e.g. "<<OFFTOP") — treat as off-topic.
          send("offtopic", {});
          send("done", {});
          return;
        }
        flush(true);
        if (!finished || !answer.trim()) {
          send("error", { code: "interrupted" });
          return;
        }
        if (followupAt !== -1) {
          const followups = parseFollowups(answer.slice(followupAt + FOLLOWUPS_TOKEN.length));
          if (followups.length) send("followups", followups);
        }
        send("done", {});
      } catch (err) {
        const reason = upstream.signal.reason;
        if (reason !== "client" && reason !== "offtopic") {
          console.error("[ask-roma] stream failed", reason ?? err);
          try {
            send("error", { code: reason === "timeout" ? "timeout" : "interrupted" });
          } catch {}
        }
      } finally {
        clearTimeout(timeout);
        try {
          controller.close();
        } catch {}
      }
    },
    cancel() {
      upstream.abort("client");
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      "X-Accel-Buffering": "no",
    },
  });
}
