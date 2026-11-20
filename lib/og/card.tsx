import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

// Open Graph cards for /calculator and /pricing (brief §3.9): cream paper, the Roma logo,
// a mono eyebrow with the red square, the page's headline. Colours mirror the §B tokens
// (ImageResponse can't read CSS variables).
export const OG_SIZE = { width: 1200, height: 630 };

const CREAM = "#FAF7F1";
const INK = "#111111";
const INK_600 = "#5A574F";
const RED = "#B21515";
const SAND = "#E8E4DA";

export async function ogCard({ eyebrow, title, foot }: { eyebrow: string; title: string; foot: string }) {
  const logo = await readFile(join(process.cwd(), "public/brand/roma-logo.png"));
  const logoSrc = `data:image/png;base64,${logo.toString("base64")}`;
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 72, background: CREAM, color: INK }}>
        {/* eslint-disable-next-line @next/next/no-img-element -- ImageResponse renders plain img */}
        <img src={logoSrc} width={232} height={53} alt="" />
        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 22, letterSpacing: 3, textTransform: "uppercase", color: INK_600 }}>
            <div style={{ width: 12, height: 12, background: RED }} />
            {eyebrow}
          </div>
          <div style={{ fontSize: 76, lineHeight: 1.05, letterSpacing: -2, maxWidth: 940 }}>{title}</div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 28, borderTop: `2px solid ${SAND}`, fontSize: 26, color: INK_600 }}>
          <span>{foot}</span>
          <span style={{ color: RED }}>runroma.com</span>
        </div>
      </div>
    ),
    OG_SIZE,
  );
}
