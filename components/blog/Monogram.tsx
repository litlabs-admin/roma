import s from "./blog.module.css";

/** Author avatar: initials on red-800 (DESIGN.md §G.10). Decorative; the name sits beside it. */
export default function Monogram({ initials, size = "md" }: { initials: string; size?: "sm" | "md" | "lg" }) {
  return (
    <span className={`${s.monogram} ${s[`mono_${size}`]}`} aria-hidden="true">
      {initials}
    </span>
  );
}
