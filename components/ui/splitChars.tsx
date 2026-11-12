/**
 * Splits text into per-character spans for the scrubbed character highlight
 * (Fruitful `data-highlight-text`: opacity .4 → 1, stagger .02). Render the result
 * inside an `aria-hidden` wrapper and put the readable text in the heading's
 * `aria-label`, so screen readers never hear it letter by letter.
 */
export function splitChars(text: string, accent = false, keyPrefix = "") {
  return text.split("").map((c, i) => (
    <span key={`${keyPrefix}${i}`} data-char className={accent ? "accent" : undefined}>
      {c}
    </span>
  ));
}
