"use client";

import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { Glyph } from "@/components/platform/mock/kit";
import f from "./forms.module.css";

/**
 * Custom select (DESIGN.md §G.12): a button trigger styled like the inputs and a
 * listbox popover in the site's card language (white, sand hairline, raised shadow,
 * --radius-sm), replacing the browser's native menu.
 *
 * ARIA: trigger is role="combobox" + aria-haspopup="listbox"; the focused element
 * (search box when searchable, else the listbox) carries aria-activedescendant.
 * Keys: ↓/↑/Enter/Space open; ↓ ↑ Home End move; Enter selects; Esc closes; letters
 * type-ahead (non-searchable); Tab closes. Outside click closes.
 */

export type DropdownOption = { value: string; label: string; meta?: string; search?: string; /** small image (e.g. a flag) before the label */ img?: string };

type Props = {
  id: string;
  name: string;
  value: string;
  options: DropdownOption[];
  placeholder: string;
  onChange: (value: string) => void;
  /** Fired when the control is left (closed without a pick, or focus moves on). */
  onLeave?: () => void;
  invalid?: boolean;
  describedBy?: string;
  required?: boolean;
  disabled?: boolean;
  searchable?: boolean;
  searchPlaceholder?: string;
  /** Custom rendering of the selected value in the trigger. */
  renderValue?: (o: DropdownOption) => ReactNode;
  /** Visual variant: full input or the compact phone-prefix trigger. */
  variant?: "field" | "prefix";
  ariaLabel?: string;
};

export default function Dropdown({
  id,
  name,
  value,
  options,
  placeholder,
  onChange,
  onLeave,
  invalid,
  describedBy,
  required,
  disabled,
  searchable,
  searchPlaceholder = "Search",
  renderValue,
  variant = "field",
  ariaLabel,
}: Props) {
  const uid = useId().replace(/:/g, "");
  const listId = `${uid}-list`;
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const list = useRef<HTMLUListElement>(null);
  const search = useRef<HTMLInputElement>(null);
  const typed = useRef({ text: "", t: 0 });

  const selected = options.find((o) => o.value === value);
  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter((o) => `${o.label} ${o.meta ?? ""} ${o.search ?? ""}`.toLowerCase().includes(q));
  }, [options, query]);

  const openList = () => {
    if (disabled) return;
    const i = Math.max(0, options.findIndex((o) => o.value === value));
    setQuery("");
    setActive(i);
    setOpen(true);
  };
  const close = (refocus = true, leave = true) => {
    setOpen(false);
    if (refocus) trigger.current?.focus();
    if (leave) onLeave?.();
  };
  const pick = (o: DropdownOption | undefined) => {
    if (!o) return;
    onChange(o.value);
    setOpen(false);
    trigger.current?.focus();
  };

  // Focus the search box / listbox when opening; keep the active option in view.
  useEffect(() => {
    if (!open) return;
    (searchable ? search.current : list.current)?.focus({ preventScroll: true });
  }, [open, searchable]);
  useEffect(() => {
    if (!open) return;
    // Scroll inside the list only (scrollIntoView could also scroll the page).
    const ul = list.current;
    const li = ul?.querySelector<HTMLElement>(`[data-index="${active}"]`);
    if (!ul || !li) return;
    if (li.offsetTop < ul.scrollTop) ul.scrollTop = li.offsetTop - 4;
    else if (li.offsetTop + li.offsetHeight > ul.scrollTop + ul.clientHeight) ul.scrollTop = li.offsetTop + li.offsetHeight - ul.clientHeight + 4;
  }, [active, open]);

  // Outside pointer closes (counts as leaving the field).
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) close(false);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  });

  const onTriggerKey = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (["ArrowDown", "ArrowUp", "Enter", " "].includes(e.key)) {
      e.preventDefault();
      openList();
      return;
    }
    // type-ahead on the closed trigger selects the next match
    if (e.key.length === 1 && /\S/.test(e.key) && !searchable) {
      const now = Date.now();
      typed.current = { text: now - typed.current.t < 600 ? typed.current.text + e.key.toLowerCase() : e.key.toLowerCase(), t: now };
      const hit = options.find((o) => o.label.toLowerCase().startsWith(typed.current.text));
      if (hit) onChange(hit.value);
    }
  };

  const onListKey = (e: KeyboardEvent<HTMLElement>) => {
    const n = shown.length;
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActive((a) => Math.min(n - 1, a + 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        setActive((a) => Math.max(0, a - 1));
        break;
      case "Home":
        if (!searchable) {
          e.preventDefault();
          setActive(0);
        }
        break;
      case "End":
        if (!searchable) {
          e.preventDefault();
          setActive(n - 1);
        }
        break;
      case "Enter":
        e.preventDefault();
        pick(shown[active]);
        break;
      case " ":
        if (!searchable) {
          e.preventDefault();
          pick(shown[active]);
        }
        break;
      case "Escape":
        e.preventDefault();
        close();
        break;
      case "Tab":
        close(false);
        break;
      default:
        if (!searchable && e.key.length === 1 && /\S/.test(e.key)) {
          const now = Date.now();
          typed.current = { text: now - typed.current.t < 600 ? typed.current.text + e.key.toLowerCase() : e.key.toLowerCase(), t: now };
          const i = shown.findIndex((o) => o.label.toLowerCase().startsWith(typed.current.text));
          if (i >= 0) setActive(i);
        }
    }
  };

  const activeId = shown[active] ? `${uid}-opt-${shown[active].value}` : undefined;

  return (
    <div ref={root} className={`${f.dd} ${variant === "prefix" ? f.ddPrefix : ""} ${open ? f.ddOpen : ""}`}>
      <input type="hidden" name={name} value={value} />
      <button
        ref={trigger}
        id={id}
        type="button"
        role="combobox"
        className={`${variant === "prefix" ? f.prefixBtn : `${f.input} ${f.ddBtn}`} ${selected ? "" : f.selectEmpty}`}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-invalid={invalid || undefined}
        aria-required={required || undefined}
        aria-describedby={describedBy}
        aria-label={ariaLabel}
        disabled={disabled}
        onClick={() => (open ? close(true, false) : openList())}
        onKeyDown={onTriggerKey}
      >
        <span className={f.ddValue}>{selected ? (renderValue ? renderValue(selected) : selected.label) : placeholder}</span>
        <Glyph k="caret" className={f.ddCaret} />
      </button>

      <div className={f.ddPop} hidden={!open}>
        {searchable && (
          <span className={f.ddSearch}>
            <Glyph k="search" />
            <input
              ref={search}
              type="text"
              value={query}
              placeholder={searchPlaceholder}
              aria-label={searchPlaceholder}
              role="combobox"
              aria-expanded={open}
              aria-controls={listId}
              aria-activedescendant={activeId}
              aria-autocomplete="list"
              onChange={(e) => {
                setQuery(e.target.value);
                setActive(0);
              }}
              onKeyDown={onListKey}
            />
          </span>
        )}
        <ul
          ref={list}
          id={listId}
          role="listbox"
          className={f.ddList}
          tabIndex={searchable ? -1 : 0}
          aria-activedescendant={searchable ? undefined : activeId}
          aria-label={ariaLabel ?? placeholder}
          onKeyDown={searchable ? undefined : onListKey}
        >
          {shown.length === 0 && <li className={f.ddEmpty}>No matches</li>}
          {shown.map((o, i) => {
            const isSel = o.value === value;
            return (
              <li
                key={o.value}
                id={`${uid}-opt-${o.value}`}
                role="option"
                aria-selected={isSel}
                data-index={i}
                className={`${f.ddOpt} ${i === active ? f.ddActive : ""} ${isSel ? f.ddSel : ""}`}
                onPointerMove={() => setActive(i)}
                onPointerDown={(e) => e.preventDefault()}
                onClick={() => pick(o)}
              >
                {o.img && (
                  // eslint-disable-next-line @next/next/no-img-element -- tiny local SVG, lazy, no optimisation needed
                  <img src={o.img} alt="" width={20} height={14} loading="lazy" decoding="async" className={f.flag} />
                )}
                <span className={f.ddLabel}>{o.label}</span>
                {o.meta && <span className={f.ddMeta}>{o.meta}</span>}
                <Glyph k="check" className={f.ddCheck} />
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
