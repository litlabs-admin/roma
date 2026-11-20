import { OG_SIZE, ogCard } from "@/lib/og/card";

export const alt = "Roma deductions calculator: what are deductions costing you?";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return ogCard({ eyebrow: "Deductions calculator", title: "What are deductions costing you?", foot: "See what you lose each year, and what you could get back." });
}
