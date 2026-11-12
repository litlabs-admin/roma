import type { AnchorHTMLAttributes, ReactNode } from "react";
import s from "./ui.module.css";

type Variant = "primary" | "inverse" | "secondary" | "ghostOnDark";

type Props = AnchorHTMLAttributes<HTMLAnchorElement> & {
  variant?: Variant;
  size?: "default" | "small";
  children: ReactNode;
};

/** Pill button — rising fill + label swap on hover (DESIGN.md §E.1). */
export default function Button({ variant = "primary", size = "default", className = "", children, ...rest }: Props) {
  return (
    <a className={`${s.btn} ${s[variant]} ${size === "small" ? s.small : ""} ${className}`} {...rest}>
      <span className={s.fill} aria-hidden="true" />
      <span className={s.label}>{children}</span>
    </a>
  );
}
