"use client";

import { askAiLinks, type AskAiService } from "@/lib/content/askAi";
import { track } from "@/lib/calculator/track";
import { ChatGptIcon, ClaudeIcon } from "./AiIcons";
import s from "./askAi.module.css";

type Props = {
  prompt: string;
  placement: "faq" | "compare_table" | "compare_hub";
  label?: string;
  /** "center" under the FAQ heading; "start" under the compare tables. */
  align?: "center" | "start";
  className?: string;
};

const ICON: Record<AskAiService, typeof ChatGptIcon> = { chatgpt: ChatGptIcon, claude: ClaudeIcon };

/** "Ask AI for more info": two pills that open ChatGPT / Claude with the page's question. */
export default function AskAi({ prompt, placement, label = "Ask AI for more info", align = "center", className = "" }: Props) {
  return (
    <div className={`${s.root} ${align === "start" ? s.start : ""} ${className}`}>
      <p className={`${s.label} type-label`}>{label}</p>
      <ul className={s.list}>
        {askAiLinks(prompt).map((l) => {
          const Icon = ICON[l.id];
          return (
            <li key={l.id}>
              <a
                className={s.pill}
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Ask ${l.name} about Roma (opens in a new tab)`}
                onClick={() => track("ai_ask_click", { service: l.id, placement, page: window.location.pathname })}
              >
                <Icon className={s.logo} />
                <span>
                  Ask <b className={s.name}>{l.name}</b>
                </span>
                <svg className={s.arrow} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M5 11 11 5M6 5h5v5" />
                </svg>
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
