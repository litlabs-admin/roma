import { OG_SIZE, ogCard } from "@/lib/og/card";

export const alt = "Roma pricing: simple pricing, every deduction accounted for.";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return ogCard({ eyebrow: "Pricing", title: "Simple pricing. Every deduction, accounted for.", foot: "Plans from $399/month. Live in under 5 minutes." });
}
