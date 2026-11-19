// Ask Roma — all user-facing copy for the floating assistant (DESIGN.md §I.2: copy lives in data files).

export const DEMO_HREF = "/book-a-demo";
/** Self-serve signup — the primary CTA site-wide (client: PLG first, Nov 2026). */
export const SIGNUP_HREF = "https://app.runroma.com/signup";
/** The Roma app; signed-out visitors land on its sign-in screen. */
export const LOGIN_HREF = "https://app.runroma.com/";

export const chatCopy = {
  launcher: "Ask Roma",
  launcherAria: "Ask Roma a question",
  title: "Ask Roma",
  placeholder: "Ask anything about Roma…",
  inputAria: "Your question",
  send: "Send",
  about: "About these answers",
  disclaimer:
    "Answers are AI-generated from Roma's website and may be wrong. Please don't share sensitive information.",
  reset: "New conversation",
  minimize: "Minimize",
  thinking: "Roma is thinking",
  demoText: "See your own numbers in 30 minutes.",
  demoCta: "Book a demo",
  offTopic: "I can only help with questions about Roma and recovering deductions. Here are a few things you can ask:",
  retry: "Try again",
};

/** Starters for an empty conversation (max 3 shown) — Hyperline's api/config shape. */
export const STARTERS = [
  "What does Roma do?",
  "Which retailers does Roma support?",
  "How much does Roma cost?",
  "How long does it take to get started?",
];

export const MAX_CHARS = 1000;
export const COUNTER_FROM = 900;

/**
 * Friendly, non-technical messages for every failure (plan §2.1b). The client never shows
 * raw errors, status codes or provider messages — only one of these.
 */
export type ErrorCode = "offline" | "network" | "timeout" | "busy" | "server" | "bad_request" | "interrupted";

export const ERRORS: Record<ErrorCode, { text: string; retry: boolean; demo?: boolean }> = {
  offline: { text: "Looks like you're offline. Check your connection and try again.", retry: true },
  network: { text: "We couldn't connect just now. Please check your connection and try again.", retry: true },
  timeout: { text: "This is taking longer than usual. Please try again in a moment.", retry: true },
  busy: {
    text: "Ask Roma is a little busy right now. Please try again shortly, or book a demo to talk to our team.",
    retry: true,
    demo: true,
  },
  server: { text: "Something went wrong on our side. Please try again in a moment.", retry: true },
  bad_request: { text: "Please shorten your question and try again.", retry: false },
  interrupted: { text: "The answer was cut short.", retry: true },
};
