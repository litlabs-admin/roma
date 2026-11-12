// Customer logos (from runroma.com), trimmed to single-ink alpha masks (DESIGN.md §E.10).
// Excluded: Desert Creek Honey, Good Day Chocolate — their masks become solid shapes.

export type Logo = { name: string; src: string; w: number; h: number };

export const customerLogos: Logo[] = [
  { name: "Boochcraft", src: "/logos/customers/boochcraft.png", w: 304, h: 57 },
  { name: "Love Corn", src: "/logos/customers/love-corn.png", w: 136, h: 89 },
  { name: "Evie's", src: "/logos/customers/evies.png", w: 139, h: 58 },
  { name: "PACA", src: "/logos/customers/paca.png", w: 126, h: 86 },
  { name: "Mochidoki", src: "/logos/customers/mochidoki.png", w: 161, h: 38 },
  { name: "BARIS", src: "/logos/customers/baris.png", w: 281, h: 93 },
  { name: "Annabella", src: "/logos/customers/annabella.png", w: 297, h: 72 },
  { name: "Smash Kitchen", src: "/logos/customers/smash-kitchen.png", w: 176, h: 107 },
  { name: "Vahdam Teas", src: "/logos/customers/vahdam.png", w: 308, h: 84 },
  { name: "Edward & Sons", src: "/logos/customers/edward-and-sons.png", w: 128, h: 96 },
  { name: "Pure & Simple", src: "/logos/customers/pure-and-simple.png", w: 157, h: 103 },
];

/**
 * Optical sizing: equal visual area regardless of aspect ratio.
 * h = clamp(min, sqrt(area / aspect), max). Returns height in rem (16px base) so the
 * fluid root scales logos with the rest of the layout.
 */
export function logoHeightRem(logo: Logo, area = 3600, min = 18, max = 44): number {
  const aspect = logo.w / logo.h;
  const h = Math.min(max, Math.max(min, Math.sqrt(area / aspect)));
  return Math.round((h / 16) * 1000) / 1000;
}
