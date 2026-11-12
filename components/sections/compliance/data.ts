// Compliance — copy from runroma.com ("Privacy first. Security always."), desktop variant.
// Claims (SOC 2 Type II, ISO 27001) are the live site's; they are not in the positioning PDF.

export const complianceCopy = {
  heading: { before: "Privacy first. Security ", accent: "always", after: "." },
  body: "We never sell or share your data. With SOC 2 Type II and ISO 27001 compliance, Roma meets the highest standards for security.",
};

export const BADGES = [
  { src: "/images/compliance/iso-27001.webp", alt: "ISO 27001 certified" },
  { src: "/images/compliance/soc2-type2.webp", alt: "AICPA SOC 2 Type 2 compliant" },
] as const;

export type Pillar = { icon: "layers" | "lock" | "user"; title: string; body: string };

export const PILLARS: Pillar[] = [
  { icon: "layers", title: "Complete Transparency", body: "Full audit trail of all recommendations." },
  { icon: "lock", title: "Data Privacy First", body: "Your data never trains our models." },
  { icon: "user", title: "Human Oversight", body: "You maintain full control of every decision." },
];
