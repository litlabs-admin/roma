# Roma — Website Design System

> Single source of truth for the visual and interaction design of runroma.com.
> Every new section must be buildable from this file without inventing new values.
> If a value you need is missing, add it here first (with a reason), then use it.

Version 1.0 · 12 Nov 2026 · Covers: Hero, Trust strip, Feature section ("Get it back")

---

## 0. Sources this system is built from

| Source | What we took from it |
|---|---|
| `Messaging and Positioning – Roma.pdf` (4 Nov 2026) | Audience, problem, value prop, pillars, tone of voice, proof points, CTAs, claims to avoid. **Wins any conflict with the live site.** |
| runroma.com (Framer export) | Brand colours (exact token HEX values), logo, customer logos, product dashboard + "Before Roma" collage, current trust strip structure. |
| Webinar summary (Startup CPG, Jul 2026) | Customer vocabulary: MCB, shortages, UDR, portals, dispute windows, "track → validate → dispute". |
| different.ai (Webflow export) | Hero composition, fluid type root, button micro-interactions, headline rotation, word-rise reveal, spring-smoothed scroll rig, hero image + overlay treatment. |
| hyperline.co (Next.js export, Nov 2026) | Typography: Season Sans as the single sans for headings + body, near-zero heading tracking, Inter for in-page product UI, no serif. Roma uses a free look-alike (§C.1). |
| fruitful.com (Webflow + Vite source) | Typography scale (grotesk medium; its serif accent was retired Nov 2026 in favour of Hyperline's single-sans style), the pinned scroll-driven product story ("goalflow"): entrance, clock-eased scrub, staged screen timeline, tabs, progress rail, character highlight. |

Data decisions made with the team:
- **Proof numbers come from the PDF**: Good Day Chocolate recovered **$53K** within 6 months; Smash Kitchen **$23K**; **25 brands** pay for Roma. The site's "170+ brands" and "$38K" are **not** used.
- **Exception (client, 20 Nov 2026, ROI calculator and pricing brief):** /pricing may use runroma.com's "Trusted by 170+ CPG brands" and the stats row "<5 min to go live · 90% time saved · $50M+ recovered" (always with "Results vary by brand."). Good Day Chocolate stays at $53K everywhere.
- **Hero art is a placeholder**: Different AI's balloons-over-red-mountains illustration, used until Roma commissions its own. Must be replaced before launch (see §11).
- **Fonts are free/open**: Instrument Sans (OFL) stands in for Hyperline's commercial Season Sans; Inter (OFL) for product-UI mock-ups; Geist Mono (OFL) for data inside mock-ups and deduction codes only; Source Serif 4 (OFL) only inside paper/handwriting illustration props. No commercial font files ship.

---

## A. Brand and design philosophy

### A.1 What Roma is (one paragraph, use this to sanity-check any copy)
Natural and specialty CPG brands, from emerging to established, selling through UNFI, KeHE and major retailers lose 2–3% of revenue to deductions — chargebacks, promo claims, shortages, fees — deducted straight from their payments. Many are invalid, but checking them by hand takes more time than most teams have, so the money is written off by default. Roma pulls every deduction from distributor and retailer portals, categorizes it, matches it to invoices and promo agreements, and lets the brand dispute invalid ones from one place. Live in 5 minutes, no ERP or IT project, from $399/month.

**Value proposition (headline-level):** Stop writing off deductions. Roma recovers invalid deductions across UNFI, KeHE and retailers.

**Tone rule for retailers/distributors (client decision, Nov 2026, site-wide):** name them only as channels or portals (UNFI, KeHE, Target, Walmart, Costco, Kroger, Whole Foods, Amazon). Never imply wrongdoing ("take", "took", "keeping", "owe you"); deductions are "invalid" or "recoverable". Where copy names channels, say "UNFI, KeHE and retailers" (or "UNFI, KeHE, Target, Walmart and more"), not UNFI and KeHE alone. Coverage is a moving logo strip (home trust-strip marquee: 40px/s, single-ink masks, edge fade, paused off-screen, static under reduced motion) using the official marks in `public/logos/channels/` (client decision, Nov 2026; Wikimedia Commons sources, KeHE from kehe.com), shown only to name the portals Roma connects to.

### A.2 Audience
Finance owners at natural and specialty CPG brands of any size: a founder or single finance person at an emerging brand, up to a Controller, VP Finance or AR Manager with a full team. Never write copy that implies Roma is only for small or lean teams. Suspects deductions eat margin but has never had time to look. Hates software projects, wants **proof in dollars, fast**. Often loops in a CFO or bookkeeper to validate — so the page must also survive a sceptical finance read.

### A.3 Brand personality
Direct · Plain-spoken · Founder-to-founder · Lightly urgent · Precise with numbers.
Roma is the calm, competent operator who already did the spreadsheet for you. Not a "platform", not "AI-powered" (never as a headline).

### A.4 Desired perception
1. "This is about *my* money" — dollars first, features second.
2. "These people understand UNFI and KeHE" — real vocabulary (MCB, shortages, promo claims, portals), never generic "trade spend leakage".
3. "This is simple" — few elements per screen, one idea per section.
4. "I can trust the numbers" — exact figures, tabular numerals, restrained motion, no hype.

### A.5 Visual direction — "Warm ledger"
Roma red on warm cream paper, set in one compact, warm grotesk (Hyperline-style) for everything a reader reads; a serif appears only as ink on paper props inside illustrations (checks, sticky notes, receipts). Imagery is either rich illustration (hero) or real product UI (everything else). Motion is physical and calm: things rise, settle, draw, fill — like numbers being reconciled.

### A.6 Design principles (each is testable)
1. **Lead with dollars.** Every section's first readable element is an outcome or a number, not a feature name.
2. **One typeface for the reader.** Headings, body, nav and buttons are all Instrument Sans. No serif in headings or body copy; the serif lives only on illustration props that imitate paper. The accent phrase (`.accent`) is kept as a hook for motion but is styled as plain heading text.
3. **Product is the illustration.** Below the hero, visuals are Roma UI (real screenshots or HTML-built UI from this system). No stock photos, no abstract 3D, no generic icons-in-circles grids.
4. **Motion explains a change of state.** An animation must show something becoming something else (raw → categorized → matched → recovered). Decorative loops are banned except the logo marquee and the hero's idle float.
5. **Red is a signal.** Roma red (#B21515) marks action (primary CTA), money at stake (recoverable amounts), and the brand mark. It never fills large surfaces on light pages.
6. **Cream, not white, is the page.** White (#FFFFFF) is reserved for raised surfaces (cards, product UI) so they read as "objects on paper".

### A.7 What the site should feel like
A well-made financial instrument: weighty, quiet, exact. Scrolling feels like turning pages of a ledger that reconciles itself.

### A.8 Patterns to avoid (reject in review)
- Generic SaaS hero (left text / right floating screenshot with gradient blob).
- Gradients as decoration (the only allowed gradients: image legibility scrims and the marquee edge-fade mask).
- Glassmorphism / backdrop-blur panels.
- More than one shadow style; shadows on flat cards on cream.
- Rounded "feature card grids" with icon + title + 2 lines.
- Badges/pills sprinkled for decoration ("New!", "AI").
- Logos in mixed colours, mixed sizes, or boxed in bordered tiles.
- Copy: "AI-powered", "end-to-end", "leverage", "optimize", "seamless", "automatically disputes/flags", any guaranteed recovery amount, "free".
- Animations that hijack scroll direction, scale text past legibility, or loop while the user reads.

---

## B. Colour system

All values are CSS custom properties defined in `app/styles/tokens.css` and exposed to Tailwind via `@theme`. **Do not hard-code HEX in components** — use the token.

### B.1 Brand (verified from runroma.com tokens)
| Token | HEX | Source | Usage |
|---|---|---|---|
| `--color-red-600` | `#B21515` | site token `b7a8a446…`, logo rosette `#B31516` | Primary CTA fill on light, brand mark, recoverable amounts, active indicators, progress rail fill. |
| `--color-red-700` | `#9B1212` | site token `70f87c04…` | Primary CTA hover fill (via rising fill layer). Links on cream hover. |
| `--color-red-800` | `#7A0E0E` | site token `3efd53c2…` | Pressed state; ink colour on red tints (`--color-red-100`). |
| `--color-red-100` | `#F4D9D4` | derived: red-600 at ~16% on cream | Chip/tint backgrounds for "recoverable", promo category fill. |
| `--color-red-950` | `#1F0A08` | derived: red-800 darkened to near-black | Hero image overlay base, dark text-on-image fallbacks. |

### B.2 Neutrals — warm (verified)
| Token | HEX | Source | Usage |
|---|---|---|---|
| `--color-cream-50` | `#FAF7F1` | site token `02d2d0dc…` | **Page background** (body). |
| `--color-cream-100` | `#FDF3E1` | site token `11675e46…` (Roma's signature beige, most-used bg) | Brand band surfaces, tab card hover, product UI app background. |
| `--color-cream-200` | `#F8F1E1` | site token `e9048a33…` | Secondary surface (product UI panels), white-button hover fill. |
| `--color-sand-300` | `#E8E4DA` | site token `3add5d77…` | Default 1px borders & dividers on cream/white. |
| `--color-sand-400` | `#D6CFC0` | derived: sand-300 −8% L | Strong borders (inactive tab outline, input borders). |
| `--color-white` | `#FFFFFF` | — | Raised surfaces: cards, product frames, buttons on dark. |

### B.3 Text
| Token | HEX | Contrast on cream-50 | Usage |
|---|---|---|---|
| `--color-ink-900` | `#111111` | 17.7:1 | Headings, primary body. (site token `237daa79…`) |
| `--color-ink-800` | `#2A2A2A` | 13.4:1 | Logo wordmark ink, logo silhouettes, dense UI text. (site `71dd4a1a…`) |
| `--color-ink-600` | `#5A574F` | 6.8:1 | Secondary body, leads, captions. (site `574fc10f…`) |
| `--color-ink-500` | `#6B665C` | 5.3:1 | Meta text, labels, disabled-ish, legal. (derived; replaces failing `#7D776C`) |
| `--color-on-dark` | `#FFFFFF` | — | Text on hero image / red. |
| `--color-on-dark-muted` | `rgba(255,255,255,0.78)` | — | Lead text on hero image. |

### B.4 Product-UI data colours (used only inside product mock-ups)
| Token | Fill | Ink | Meaning |
|---|---|---|---|
| `--data-promo` | `#F4D9D4` | `#7A0E0E` (8.3:1) | Promo / MCB / scan deductions |
| `--data-shortage` | `#EED9A8` | `#5C4413` (6.6:1) | Shortages, shortships, damages |
| `--data-fees` | `#D7DCE3` | `#27313F` (9.5:1) | Fees, slotting, compliance |
| `--data-matched` | `#E2F0DE` | `#0B5D05` (6.9:1) | Matched / validated (from site green `#0F8207`) |
| `--data-recoverable` | `#B21515` | `#FFFFFF` | Recoverable amount chip |
| `--data-remit` | `#2A2A2A` | `#FFFFFF` | Remittance / source pill |

Implemented in `app/globals.css` as `--data-{promo,shortage,fees,ok}-{bg,fg}`, `--data-ok` (#2F9A3A, lines/dots), `--data-source`, plus in-UI surfaces `--ui-well`, `--ui-line`, `--ui-line-soft`, `--ui-axis` and the illustration wells `--well-warm` / `--well-neutral` (the home machine-card tints). The `type-h1` utility (page titles on non-home pages) also exists there.

### B.5 Overlays, borders, states
| Token | Value | Usage |
|---|---|---|
| `--overlay-hero` | `rgba(31,10,8,0.52)` | Flat overlay over hero art (Different uses `#191919` @ 61%; ours is red-950 tinted so the image stays warm). |
| `--scrim-hero-bottom` | `linear-gradient(to bottom, transparent 55%, rgba(31,10,8,0.45))` | Reserved (unused since the hero product frame was removed). Use only if a future element must separate from the art. |
| `--border-on-dark` | `rgba(255,255,255,0.45)` | Announcement pill border (Different `#ffffff73`). |
| `--fill-on-dark` | `rgba(0,0,0,0.28)` → hover `rgba(0,0,0,0.40)` | Announcement pill background. |
| `--nav-hover-on-dark` | `rgba(255,255,255,0.12)` | Nav link hover on hero. |
| `--nav-hover-on-light` | `#F1EBDF` | Nav link hover on cream. |
| `--focus-ring` | `2px solid #B21515`, offset `2px` (on dark: `2px solid #FFFFFF`) | All focusable elements, `:focus-visible` only. |

### B.6 Interaction states (buttons)
| Variant | Rest | Hover (fill rises) | Active | Disabled |
|---|---|---|---|---|
| `primary` (on light) | bg red-600, text white | fill red-800 `#7A0E0E` rises | scale .97 | bg sand-300, text ink-500 |
| `inverse` (on dark/image) | bg white, text ink-900 | fill cream-200 `#F8F1E1` rises | scale .97 | 50% opacity |
| `secondary` (on light) | transparent, 1px sand-400 border, ink-900 text | fill ink-900 rises, text white, border ink-900 | scale .97 | 50% opacity |
| `link` | ink or white, underline 1px at .25em offset | underline swipes out/in, arrow nudges (3px,−3px) | — | — |

---

## C. Typography system

### C.1 Families
Reference: hyperline.co (Nov 2026) sets everything in **Season Sans** (commercial compact grotesk), uses **Inter** only inside product-UI mock-ups, and has no serif. Roma follows that system with free fonts.

| Role | Family | Files / loader | Why |
|---|---|---|---|
| Primary (titles, body, nav, buttons) | **Instrument Sans** (variable wght 400–700, wdth 75–100), set at **`font-stretch: 94%`** on `body` | `next/font/google` (`axes: ["wdth"]`) → `--font-instrument` → `--font-sans` | Closest free match to Season Sans: compared side by side against 12 OFL families, it matches proportions, apertures and spacing; wdth 94 matches Season's compact set width. OFL. |
| Product-UI mock-ups | **Inter** (variable) | `next/font/google` → `--font-inter` → `--font-ui` | Hyperline's choice for in-page product UI. Separates "the product" from "the page" and has excellent small-size figures. Set once on each mock's root container; never on marketing text. |
| Mono (data only: codes and figures inside product-UI mock-ups; never marketing labels) | **Geist Mono** (variable) | `next/font/google` → `--font-geist-mono` → `--font-mono` | Kept instead of Hyperline's system mono so labels render identically on Mac/Windows. |
| Serif (props only) | **Source Serif 4 Medium** | `next/font/local` → `app/fonts/SourceSerif4-Medium.woff2` → `--font-serif` | Only as ink on illustration props that imitate paper or handwriting (check payee lines, sticky notes, pencil notes, receipt totals). **Never in headings, body, nav, buttons or product-UI headlines.** |

There is **no italic**. Emphasis in headings is word choice, not a font change.
Font swap: everything references `--font-sans`, `--font-ui`, `--font-mono`, `--font-serif`; replacing a family is a one-line change in `app/layout.tsx` (+ the `font-stretch` on `body` if the new family has no width axis).

### C.2 Weights
| Weight | Use |
|---|---|
| 400 | Body copy, leads, hero headline (display sizes read heavy at 500). |
| 500 | Section headings (h2–h5), buttons, nav, UI labels, figures. (Hyperline's default weight.) |
| 600 | Product-UI numbers only (amount emphasis). Never in marketing headings. |

### C.3 Fluid root (from Different AI)
`html { font-size: 16px }` below 992px. From 992–1440px: `font-size: clamp(14px, 1.1111vw, 16px)` → the whole rem-based layout scales with the 1440 design width; above 1440 it stays 16px. All type and spacing are in **rem** so they scale together. Exceptions in `px`: borders, focus rings, shadows.

### C.4 Type scale
Sizes are `desktop / tablet (≤991) / mobile (≤767)`. Line-height (LH) and letter-spacing (LS) are constant across breakpoints unless noted.

| Token | Size | LH | LS | Weight | Family | Use |
|---|---|---|---|---|---|---|
| `display` | 5.5 / 4 / 2.75rem | 1.02 | −0.025em | 400 | sans | Hero H1 only. |
| `h1` | 4 / 3.25 / 2.5rem | 1.04 | −0.022em | 500 | sans | Page titles (non-home). |
| `h2` | 3.25 / 2.5 / 2rem | 1.05 | −0.02em | 500 | sans | Section statements (e.g. feature pinned statement). |
| `h3` | 2.5 / 2 / 1.75rem | 1.1 | −0.015em | 500 | sans | Column headings. |
| `h4` | 1.75 / 1.5 / 1.375rem | 1.2 | −0.01em | 500 | sans | Card titles. |
| `h5` | 1.375 / 1.25 / 1.125rem | 1.25 | −0.005em | 500 | sans | Step titles, small headings. |
| `lead` | 1.25 / 1.125 / 1.0625rem | 1.4 | 0 | 400 | sans | Hero lead, section intros. Max 34ch–38rem. |
| `statement` | 2.75 / 2.25 / 1.75rem | 1.2 | −0.015em | 500 | sans | Brand statement paragraph (G.1b) only. Max-width 56rem, centred. |
| `body` | 1.0625 / 1 / 1rem | 1.5 | +0.005em | 400 | sans | Paragraphs. Max line length 64ch. |
| `small` | 0.9375rem | 1.45 | +0.01em | 400 | sans | Secondary text, step descriptions. |
| `label` | 0.8125rem | 1.3 | 0.02em, sentence case | 500 | sans | Eyebrows, pill labels, table headers. |
| `button` | 0.9375rem | 1.25 | −0.005em | 500 | sans | All buttons. |
| `nav` | 1rem | 1.4 | −0.005em | 400 | sans | Nav links. |

**Hyperline text settings (24 Nov 2026, client: "one font, like Hyperline"):** body, lead and small text run at weight 500 with +0.02em tracking (Hyperline's Season Sans settings, read from their CSS); headings keep their sizes. Marketing text is one family (Instrument Sans): labels, footer titles, table heads and brand wordmarks are all sans; mono survives only for data inside product-UI mock-ups and deduction codes, serif only on paper props, Fraunces only for the footer logo art.

**Tracking rule (Nov 2026):** Instrument Sans is looser than Geist, so tracking is roughly 55% of the old Geist values (Hyperline runs headings at −0.01em to 0). Any hard-coded `letter-spacing` in a module follows the same rule; mono labels keep their positive uppercase tracking.

**Accent phrase:** `<span className="accent">` inside a heading is a semantic + motion hook (hero "lean") only. It inherits the heading's font, weight, size and tracking; it is never set in serif.

**Numerals:** any figure in UI/proof context uses `font-variant-numeric: tabular-nums`. Hero/announcement figures use lining proportional (default).

### C.5 Line breaks & measure
- Headings: `text-wrap: balance`. Hand-set `<br>` only where the composition depends on it (pinned statement), with a separate mobile variant (Fruitful pattern).
- Body/lead: `text-wrap: pretty`, max-width `38rem` (lead) / `64ch` (body).
- Never let a heading line end on a single short word on desktop — adjust the max-width of the heading container, not the font size.

---

## D. Layout and spacing system

### D.1 Breakpoints (Different / Fruitful aligned)
| Name | Range | Notes |
|---|---|---|
| `mobile` | ≤ 767px | Single column, gutters 1.25rem. |
| `tablet` | 768–991px | Single/2-col, gutters 2rem. |
| `desktop` | 992–1439px | Fluid root active (C.3). Gutters 2.5rem. |
| `wide` | ≥ 1440px | Root fixed 16px; content max-width caps; extra space becomes margin. |

Tailwind: `md: 768px`, `lg: 992px`, `xl: 1440px` (custom, see `globals.css @theme`).

### D.2 Containers
| Token | Max-width | Use |
|---|---|---|
| `--container-xl` | 90rem (1440) | Nav, full layouts, trust strip. |
| `--container-lg` | 75rem (1200) | Wide media blocks (future). |
| `--container-md` | 64rem (1024) | Feature section two-column layout (Fruitful `goalflow_container`). |
| `--container-sm` | 50.75rem (812) | Hero copy block (Different `.hero_intro`). |

Gutters (`--gutter`): 2.5rem desktop · 2rem tablet · 1.25rem mobile. Container = `width:100%; max-width; margin-inline:auto; padding-inline: var(--gutter)`.

### D.3 Spacing scale (4px base, rem)
`0.25 · 0.5 · 0.75 · 1 · 1.25 · 1.5 · 2 · 2.5 · 3 · 4 · 5 · 6 · 7 · 8 · 10` (= 4…160px). Use only these. Tailwind default spacing already maps (`1 = 0.25rem`).

### D.4 Section vertical rhythm
| Token | desktop / tablet / mobile | Use |
|---|---|---|
| `--section-lg` | 7 / 6 / 5rem | Standard section padding-block. |
| `--section-md` | 5 / 4 / 3.5rem | Compact sections, trust strip. |
| `--section-sm` | 3 / 2.5 / 2.5rem | Bands, footers of sections. |

Inside sections: heading → lead `1.5rem`; lead → actions `2rem`; heading block → content `4rem` (desktop) / `2.5rem` (mobile).

### D.5 Grid
12 columns, column gap `1.5rem` (desktop) / `1rem` (mobile), row gap `2.5rem`. Two-column story layouts use flex with gap `4rem` (desktop) / `2.5rem` (tablet), each side `flex: 1` (Fruitful `goalflow_layout`).

### D.6 Radius
| Token | Value | Use |
|---|---|---|
| `--radius-pill` | 999px | Buttons, announcement pill, nav link hover, chips in marketing. |
| `--radius-sm` | 0.75rem | Small UI (tab icon wells, inputs). |
| `--radius-md` | 1.25rem | Cards (tab card, testimonial). |
| `--radius-lg` | 1.5rem | Product frames (dashboard image, feature app panel). |
| `--radius-xl` | 2rem | Large media blocks (future). |
Inside product UI the radius is in design units (see G.3).

### D.7 Borders, dividers, elevation
- Border: `1px solid var(--color-sand-300)`. Strong: `--color-sand-400`. On dark: `--border-on-dark`.
- Dividers: 1px sand-300, full container width; never double borders.
- **One elevation** (`--shadow-raise`): `0 1px 0 rgba(17,17,17,0.04), 0 24px 60px -24px rgba(58,20,14,0.28)`. Used only on floating product frames. Cards on cream use a border, not a shadow.

---

## E. Component guidelines

### E.1 Buttons (`components/ui/Button.tsx`)
- Shape: pill, height auto, padding `0.85rem 1.375rem`, `button` type token, `white-space: nowrap`, `isolation: isolate; overflow: hidden`.
- Hover (pointer devices only, `@media (hover:hover)`): a fill layer (`.fill`, `inset:0`, pill radius) moves `translateY(102%) → 0` over `500ms var(--ease-out)`; the label runs `btnSwap 550ms var(--ease-out)` (0% y0 → 45% y−130% o0 → 50% y130% o0 → 100% y0). Active: `scale(.97)` in 350ms.
- Arrow: buttons may end with "→" (text glyph, not icon) — only for the primary demo CTA.
- Order in groups: primary first, then link. Gap `0.75rem` (desktop), stacked full-width on mobile ≤ 479px with gap `1rem`.
- Copy: verbs + outcome. Approved: "Book a demo →", "See your numbers", "How it works". Never "Get started", "Learn more".

### E.2 Text link with arrow (`components/ui/ArrowLink.tsx`)
Underline is an element (`.line`, 1px, `scaleX(1)`, origin left). Hover: `lineSwipe 600ms` (shrink to right, grow from left). Optional arrow nudges `translate(3px,-3px)` in 350ms.

### E.3 Announcement pill (hero)
Inline-flex, gap 10px, padding `10px 18px 10px 20px`, 1rem text, `--fill-on-dark` bg, `--border-on-dark` border, pill radius. Content = one proof fact + arrow. Hover bg `rgba(0,0,0,.40)`. Max one per page.

### E.4 Eyebrows / labels
`label` token (sans, 13px, 500, sentence case, 0.02em). Colour ink-500 on light, `on-dark-muted` on dark. Optional 6px square bullet in red-600 before the text. Use sparingly — only where a section needs a category name.

### E.5 Section headings
Structure: optional eyebrow → heading (h2/h3) with ≤ 1 accent phrase (plain text, motion hook only) → optional lead. Alignment: centred for statements, left for column content. Heading max-width: 20ch (h2) / 16ch (h3).

### E.6 Cards
White surface, 1px sand-300 border, `--radius-md`, padding 1.5rem (mobile 1.25rem). No shadow. Interactive cards: hover border sand-400 + bg stays white; active: 2px red-600 border (Fruitful tab pattern).

### E.7 Images & product frames
- Product screenshots: `--radius-lg`, `--shadow-raise`, `aspect-ratio` locked to the asset (dashboard = 16/9, 2720×1530). Never crop UI text.
- Illustration (hero): `object-fit: cover`, `object-position: 50% 40%`, always under `--overlay-hero`.
- Use `next/image` with explicit `sizes`; LCP image uses `fetchPriority="high"` + `loading="eager"` (Next 16: `priority` is deprecated).

### E.8 Icons
Stroke icons, 1.5px stroke, 16/20/24px, `currentColor`, round caps/joins (Fruitful scroll hint style). Inline SVG only. No icon libraries for one-off glyphs.

### E.9 Dividers
1px sand-300; in product UI, 1px `#EFE9DD`. Never use a divider directly under a section heading.

### E.10 Trust indicators (logos)
- Customer logos are **single-ink silhouettes**: PNG alpha masks rendered with CSS `mask-image` and `background: var(--color-ink-800)` at `opacity: .78`. One colour for all logos, set by token.
- Logos whose mask would be a solid shape (Desert Creek Honey, Good Day Chocolate) are **excluded** from the strip; Good Day appears instead as a named proof point.
- Optical sizing: each logo gets height `h = clamp(18px, sqrt(A / aspect), 44px)` with target area `A = 3600px²` desktop (`2400px²` mobile). Pre-computed in `lib/content/logos.ts` from the trimmed asset size.
- No borders, tiles, or captions under logos.

### E.11 Scenario tabs (feature card)
2-column grid, gap .5rem. Tab: 2px sand-300 border, radius 1rem, padding .5rem, icon well 2.25rem (radius .75rem, cream-200, mono initial). Hover: cream-50 bg, sand-400 border. Active: red-600 border, white bg, icon well red-600/white, check scales 0→1 (200ms `--ease-state`). Keyboard: `role="tablist"`, roving tabindex, arrow keys move + select. (Fruitful `goalflow-tab_item`.)
*Reserved for future sections:* numbered step blocks (mono "01" + h5 + small; inactive .4 opacity, active `translateX(1rem)`) — Fruitful `moneyflow-text__card`.

---

## F. Motion system

### F.1 Libraries
- **GSAP 3.13** (`gsap`, `ScrollTrigger`, `DrawSVGPlugin` — all free since 3.13). Used by both references; required for scrubbed timelines and labelled screen timelines.
- **Lenis 1.3** smooth scrolling, wired exactly as Fruitful: `lenis.on('scroll', ScrollTrigger.update)`, `gsap.ticker.add(t => lenis.raf(t*1000))`, `gsap.ticker.lagSmoothing(0)`. Disabled under reduced motion and on touch devices (native momentum is better there).
- CSS transitions/keyframes for hover & state (no JS for hovers).

### F.2 Easing tokens
| Token | Value | Use |
|---|---|---|
| `--ease-out` | `cubic-bezier(0.22, 1, 0.36, 1)` | Entrances, button fills, word rise (Different house ease). GSAP equiv: `expo.out`-like → use `"power3.out"`. |
| `--ease-state` | `cubic-bezier(0.14, 0.43, 0.32, 1)` | UI state changes (active step, tab) (Fruitful `--moneyflow-ease`). |
| `--ease-inout` | `cubic-bezier(0.77, 0, 0.175, 1)` | Large surface swaps (Fruitful button bg). GSAP: `"power2.inOut"` for scrubbed transforms. |
| `back.out(2)` | GSAP | Small "pop" (badge, pills) — only on elements ≤ 48px. |
| `none` | linear | Scrubbed opacity/progress where scroll is the easing. |

### F.3 Durations
| Token | ms | Use |
|---|---|---|
| `--dur-micro` | 150 | Colour/opacity hover. |
| `--dur-state` | 300–400 | Active step, tab, chip. |
| `--dur-swap` | 500–550 | Button fill & label swap. |
| `--dur-enter` | 800–900 | Word rise, lead fade-up. |
| `--dur-hero` | 1200 | Hero background settle. |

### F.4 Entrance animations
- **Word rise** (Different `[data-rise]`): split heading into words (inline-block). From `opacity 0, y 16px` → `1, 0`. Opacity 700ms ease, transform 900ms `--ease-out`, stagger 35ms per word; the following lead paragraph starts +120ms, from y 10px, 600/800ms. Triggers when element top < 92% viewport. Elements already on screen at load do **not** animate (except the hero, which has its own sequence).
- **Hero sequence** (on load, t in s): bg scale 1.06→1 (0–1.2, `--ease-out`); announce pill fade/y8 (0.15); H1 words in from `y .45em, blur 8px, opacity 0` → 0, 900ms `power3.out`, stagger 70ms (0.25); accent phrase "lean" — skewX 16°→0 over 1.1s `power3.inOut` + rise yPercent 35→0 0.9s `expo.out` (starts with its word); lead (0.65); actions (0.8).

### F.5 Scroll-triggered animations
- **Scrub default**: `scrub: 0.6` (both Fruitful timelines). Never `scrub: true` on transforms of large surfaces (jitters with Lenis); `true` allowed for opacity-only char highlights.
- **Clock-eased screen time** (Fruitful): a paused GSAP timeline is never scrubbed directly. Scroll computes a target time; a proxy `clock.t` tweens toward it (`duration .3, ease power3.out`) and calls `timeline.time(clock.t)` — gives the product animation its own inertia.
- **Character highlight** (Fruitful `data-highlight-text`): split into chars; `opacity .4 → 1`, stagger .02, scrub `true`, from `top bottom` to `top 30%`.
- **Statement reveal** (word-level colour scrub, G.1b): split into words; colour `--color-sand-400` → `--color-ink-900` (highlights → `--color-red-600`), duration 1, stagger .35 (≈3-word soft front), `ease: none`, `scrub: 0.6`, from `top 75%` to `bottom 55%`. Colours are read from the CSS tokens at runtime, never hard-coded. Use for one central statement per page; headings keep the character highlight.

### F.6 Pinning
Use **CSS sticky**, not ScrollTrigger `pin` (no pin-spacer reflow, works with Lenis): a tall outer container (`height: N·100vh`), inner `position: sticky; top: 0; height: 100vh` (mobile `100svh`). All ScrollTriggers use the outer container as trigger. Rule of thumb: 1 viewport of scroll per distinct state + 1 for entrance. Pinned sections must show a progress affordance (rail or "Keep scrolling" hint).

### F.7 Hover interactions
Only on `@media (hover:hover) and (pointer:fine)`. Buttons (E.1), links (E.2), nav links (bg pill fade 150ms), tab cards (bg white, 200ms). No hover scale on images or cards.

### F.8 Page transitions
None in v1 (single page). Future multi-page: 400ms cream overlay fade, no route-level slide.

### F.9 Staggering
Words: 35ms (reveal) / 70ms (hero in) / 40ms (hero out). List items/tiles: 80ms. Paths/routes: 180ms. Never stagger more than 8 items; group beyond that.

### F.10 Transform & opacity conventions
- Animate only `transform`, `opacity`, `filter: blur()` (hero words only, ≤ 8px) and, inside the product panel, box geometry (`top/left/width/height` in %) where clipping is the mechanism (Fruitful band hand-off). Nothing else.
- Use `autoAlpha` (opacity + visibility) when an element must also be unclickable while hidden.
- `will-change: transform` only on elements that animate continuously (marquee track, hero product, hero words during rotation). Remove after one-shot animations.
- Every animated element must render correctly in its **final** state if JS fails (SSR markup is the end state; JS sets the start state just before animating).

### F.11 Reduced motion (`prefers-reduced-motion: reduce`)
- Lenis off; no headline rotation (first line only); no word rise; 
- Marquee becomes a static, centred, wrapping logo row.
- Feature section: not pinned (container `height:auto`), statement shown above the columns, product panel rendered at its final (fully built) state, all steps shown active, tabs still switch content (instant).
- Button fills: instant colour change, no label swap.

---

## G. Section specifications

### G.1 Hero (reference: Different AI)

**Purpose:** In 5 seconds: the problem (deductions written off) + the promise (we get it back) + proof (dollars, a real brand) + one action.

**Layout**
- `section.hero`: `height: 100svh; min-height: 40rem; max-height: 75rem` (desktop), `min-height: 36rem` mobile. Full-bleed. Text block vertically centred: `padding-top: var(--nav-h); padding-bottom: 2rem`.
- **Before/after stage** under the copy (client feedback, 18 Nov — replaces the 12 Nov "no product frame" decision). `section.hero` now grows to fit it (`height:auto`, padding-top `nav-h + 3.5rem`); the stage's control peeks above the fold at 1440×900.
- Stage = Concept A "The Remittance" (`components/sections/hero/HeroStage.tsx`, data in `stageData.ts`). Before: one UNFI remittance on paper + clutter (portal email, spreadsheet, POD backup, red-pen note). Control on the frame's top edge: "See what Roma can do" → becomes a `Before Roma / With Roma` toggle (`aria-pressed`, focus kept, polite live region). With Roma: the same lines FLIP from their paper positions into three zones — 01 Analytics "Where it went" (grouped by type, share of deducted), 02 Recovery "Was it right?" (the doubted shortage + its POD, track Filed → In review, Credited shown as *next*, never reached), 03 Accounting "Booked" (GL lines that tie to the check). ~2.8s, `power3.inOut` travel. Numbers reconcile (14,608.64 − 2,045.00 = 12,563.64). No "Recoverable"/"Matched" states anywhere.
- Both states are full DOM in one grid cell (CSS = final state; JS sets start states; GSAP clears only `transform,opacity,visibility`). Phones: the hidden state is taken out of flow so the stage is sized by what's showing. Reduced motion: 200ms crossfade.
- Copy block: `--container-sm` (50.75rem), centred, `text-align:center`. Internal gaps (Different): announce → H1 `3rem` (2rem mobile); H1 → lead `1.5rem`; lead → actions `2rem`.


**Content hierarchy**
1. Nav (transparent): Roma logo rendered fully white on the hero (`filter: brightness(0) invert(1)` — the red rosette disappears into red art; normal colours once solid), Platform · Solutions · Customers · Resources · Company: two plain links ("Platform", "Customers") and three dropdown triggers (see **Primary navigation** below), right: "Log in" link + `inverse` button "Try now".
2. Announcement pill: "Good Day Chocolate recovered $53K in deductions →" (PDF proof point, quotable).
3. H1 (`display`), rotating every 3.6s through the three pillars (first line is the SSR/SEO line):
   - "Every deduction, ⟨accounted for⟩." → "⟨explained⟩" → "⟨disputed⟩" → "⟨booked⟩"
4. Lead (`lead`, on-dark-muted, max 36rem): "Roma pulls every deduction from your distributor and retailer portals. See where the money went, dispute the invalid ones, and book the rest."
5. Actions: `inverse` "Try now →" (signup; PLG-first per client) + white `ArrowLink` "Book a demo". Microcopy: "Live in under 5 minutes. No ERP or IT project."

**Colour:** image + `--overlay-hero`; all text white; accent words white and plain (no serif, no colour change).

**Assets:** `public/images/hero/placeholder-balloons-{1080,2000}.webp` (placeholder), `public/brand/roma-logo.png`.

**Animation**
- Load sequence: F.4 hero sequence.
- Headline rotation (Different `__dfxHeadline`): hold 3.6s → words out (`y −.35em, opacity 0, blur 6px`, 500ms `power2.in`, stagger 40ms) → swap → words in (`y .45em, blur 8px` → 0, 900ms `power3.out`, stagger 70ms) → hold. Heading `min-height` locked to the taller line (re-measured on resize) so nothing below moves. Paused when hero is off-screen or tab hidden. `aria-label` on the H1 holds the first line; rotating spans are `aria-hidden`.
- **Spring rig (pattern kept for future use):** Different's balloon technique — scroll target `pT`, exponentially smoothed `pS += (pT − pS)·(1 − e^(−6·dt))`, damped springs (`k≈22, c≈6`), idle float fading as `calm = 1 − clamp(pS·4)`, rAF stops when settled. Not used in the hero today.
- Background: no parallax (keeps LCP stable); only the load settle.

**Interaction:** Announce pill links to the case study (`#` placeholder). Nav states (150ms colour transition): at top → transparent; scrolled inside the hero (`scrollY > 8`) → solid `red-950` so copy never runs under white nav text; past the hero (`scrollY > heroH − 72`) → solid cream-50, hairline sand-300, ink text, normal logo. An open dropdown panel also forces the solid cream state.

**Primary navigation (Nov 2026 restructure).** Data in `lib/content/nav.ts`, built on the server (`components/layout/Nav.tsx`) and rendered by the client `NavBar.tsx`, so story and blog content stays out of the client bundle.
- **IA (client, 20 Nov 2026):** Platform (standalone link to `/platform`) · Solutions (Deduction management, Analytics, Accounting) · **Customers** (standalone link to `/customers`, moved out of Resources by the client 20 Nov 2026) · Resources (Blog, Deduction codes, FAQs, then Roma vs. each competitor, generated from `competitors`) · Company (Partners, Contact us). Standalone links live in `navLinks`, dropdowns in `navMenus`; `navOrder` (labels) interleaves them, and `NavBar` renders the bar and the mobile sheet from that one order. Right side stays Log in + Try now. New pages go into a group; a new top-level link needs client sign-off (as Platform and Customers had).
- **Desktop panel:** full-width white sheet under the bar (sand-300 hairline, `--shadow-raise`, the only shadow), content in `--container-lg`: a 2-column list of rows (cream-100 tile with a red-600 line glyph from `NavIcon.tsx`, 500-weight title, ink-600 one-liner; hover cream-200 + red arrow) and one **feature tile** in the customer results bento's language (§G.15, `components/layout/NavTile.tsx`): photo under the warm two-gradient scrim, or Roma red + texture; brand mark top-left (logo mask or serif wordmark), white arrow chip top-right on hover, figure (3.5rem) + label at the foot; photo zooms to 1.04 on hover. Tiles: Product → Good Day $53K (photo), Compare → Roma logo, "5 min to go live" (gradient), Resources → latest post on its cover, Company → Smash Kitchen $23K (photo). The two story tiles never reuse the bento's photos: theirs live in `public/images/nav/` (`NAV_PHOTOS` in `nav.ts`) and render as gradient tiles until set. Figures always come from `CUSTOMER_STORIES` / compare content. Row icons use `.icon` (not `.tile`).
- **Behaviour:** disclosure pattern (button + `aria-expanded`/`aria-controls`, panels in DOM order after their trigger). Click toggles; mouse hover opens after 120ms, 200ms grace to cross into the panel; switching trigger → trigger swaps without re-animating. Closes on Esc (focus returns to the trigger), outside press, focus leaving the nav, link click, or scrolling 64px. Panel rises 8px over 180ms with an 8% ink scrim; no motion under reduced motion. The trigger of the group holding the current route uses the active style.
- **Mobile sheet:** groups as an accordion (one open, the current route's group open by default), feature cards omitted; the Ask Roma launcher hides while the sheet is open.

**Headline wrap:** greedy wrapping inside `max-width: 46rem` (not `balance`) so line 1 breaks as "Stop writing off / deductions." Both rotating lines are stacked in one CSS grid cell, so the H1 is always the height of the taller line (no JS height lock needed).

**Responsive**
- Tablet: display 4rem; lead 1.125rem; actions inline.
- Mobile: display 2.75rem, line breaks balanced; announce text shortens to "Good Day Chocolate recovered $53K →"; actions stack full-width ≤ 479px; nav collapses to logo + menu button (full-screen cream sheet in bar order: the two links and the three groups as an accordion, Log in · Book a demo, primary CTA).

### G.1b Brand statement (after the hero) — REMOVED 18 Nov
Cut at the client's request ("a lot of words"). Home order is now: Hero → Trust → Feature story (three questions) → Machine → Compliance → Stories → FAQ → Closing. (A "How do you handle deductions today?" comparison was tried here on 18 Nov and removed.) The spec below is kept for reference only.



**Purpose:** One central sentence block that says what Roma does — problem, cost, fix — before any proof. Read slowly, revealed in reading order.

**Copy** (`lib/content/site.ts` → `statement`): "Every month, deductions from your retailers add up to ⟨2–3% of your revenue⟩. Many deductions are invalid, but nobody has time to check, so they get ⟨written off⟩. Roma matches ⟨every deduction⟩ to your invoices and promos, so you can ⟨get back what’s yours⟩."
Rules: ≤ 50 words; ≤ 4 highlights; highlights are money or outcome phrases only (red = money at stake, A.6 #5); PDF guardrails apply.

**Layout:** section `padding-block: var(--section-lg)` on cream-50 (continuous with the page, no band). Paragraph centred (ragged edges by choice — justified was tried and reverted), `max-width: 56rem`, gutters, `text-wrap: pretty`, type token `statement`. No eyebrow, no CTA.

**Colour:** final state ink-900, highlights red-600 (same weight and family — colour alone carries emphasis). Muted start state sand-400 for every word, so the block reads as one uniform muted paragraph before the reveal.

**Animation:** Statement reveal (F.5): scrubbed, reverses on scroll-up, no pinning. GSAP ScrollTrigger (no second animation library).

**Accessibility / SEO:** visually hidden `h2` ("What Roma does") + an sr-only `<p>` with the full sentence; the word-split visual copy is `aria-hidden`. SSR renders the final colours; the muted state is applied on the client only.

**Reduced motion:** no tweens — the paragraph renders fully revealed.

**Responsive:** 2.75rem desktop · 2.25rem tablet · 1.75rem mobile; same centred block at every size.

### G.2 Trust strip (reference: Roma's existing strip)

**Purpose:** Quiet social proof directly under the product: "brands like mine use this".

**Layout**
- Section padding: top `--section-md`, bottom `2.5rem` (the feature stage below opens with its own empty half-screen). Background cream-50 (continuous with page — no band colour change).
- Desktop: `--container-xl`, grid `16rem | 1fr`, gap `3rem`, items centred vertically. Left: label. Right: marquee.
- Mobile/tablet: label centred above marquee (gap 1.5rem); marquee full-bleed (negative gutter margins).

**Content**
- Label (two lines, `small`/500): line 1 ink-500 "Recovering deductions for" · line 2 ink-900 "natural & specialty brands". No brand count (decision §0).
- Logos (11, single ink): Boochcraft, Love Corn, Evie's, PACA, mochidoki, BARIS, Annabella, Smash Kitchen, Vahdam, Edward & Sons, Pure & Simple. Each `role="img"` + `aria-label`; the duplicated marquee copy is `aria-hidden`.

**Spacing:** logo gap `4rem` desktop / `2.5rem` mobile; optical heights per E.10.

**Animation**
- Marquee: track = two identical sets; `translateX(0 → −50%)` linear, duration = `setWidth / 40px·s⁻¹` (constant speed regardless of logo count). Edge fade `mask-image: linear-gradient(to right, transparent 0, #000 12%, #000 88%, transparent 100%)` (from Roma's current strip). Paused only when off-screen; it keeps running on hover/focus (design decision, Nov 12). Strip itself fades up (y 16px, 800ms) when 85% in view.
- Reduced motion: static centred wrap, gap 2.5rem/3rem.

### G.3 Feature section — "Get it back" (reference: Fruitful goalflow)

**Purpose:** Show, not tell, how Roma turns a remittance into recovered cash: **Pull → Match → Recover** (Positioning "what Roma offers" + webinar's track/validate/dispute).

**Spacing above:** the section is pulled up by `min(24vh, 13rem)` (`margin-top`, not in static/reduced-motion mode). The statement sits mid-stage, so without this the gap after the trust strip reads as two section spaces. The stage is transparent, so it can overlap the strip's bottom padding.

**Structure** (outer → inner):
```
section.feature                  z-index 1
 └ div.container   height: 400vh (desktop+mobile)     ← ScrollTrigger trigger
    └ div.sticky   position: sticky; top: 0; height: 100vh (100svh mobile)
       ├ div.statement     absolute, centred (top 50%, yPercent −50), pointer-events none
       └ div.layout        --container-lg, flex row, gap 4rem, align center (stacked < 992px)
          ├ div.column     0 1 24rem  (progress rail, h3, body, channel card)
          └ div.visual     flex 1, laptop ≤ min(68vh, 44rem) tall (phone < 768px)  (app panel + caption)
```

**Content** (copy lives in `components/sections/feature/data.ts`)
- Statement (`h2`, centred, break after "yours."): "Invalid deductions are money that's ⟨yours⟩. Let's get it back." (Adapted from the PDF's tone-of-voice line to meet the tone rule in §A.1.) Split into characters for the highlight.
- Column (Fruitful structure: top copy + scenario card, progress rail on the left):
  - `h3`: "Nothing gets written off ⟨by default⟩." (from the PDF's approved recovery line)
  - Body (ink-600, 1rem/1.5): "Roma connects to your distributor and retailer portals, pulls every deduction and matches it to your invoices and promo agreements. You see what was deducted, why, and what's recoverable — then dispute the invalid ones from one place."
  - Channel card (white, E.6): "Built for how you sell." / "Pick a channel to see its deductions." + 2×2 tabs **UNFI · KeHE · Target · Walmart** (the four remittance sources the FAQ names). Icon well 2.25rem with the channel initial (mono), check badge on active. "Keep scrolling ↓" hint sits 1.5rem under the card.
- Pull → Match → Recover is told by the panel itself: its sub-line crossfades "Every deduction this quarter" → "Matched to invoices & promos" → "Disputed & recovered".
- Caption under panel (12px, ink-500): "Illustrative data. Not a guarantee of recovery." (PDF guardrail: never promise recovery amounts.)

**App panel (HTML-built product UI, not an image)**
- Device: a **laptop** from 768px up (beside the column ≥992px; stacked above it at 768–991px with the four channel tabs in one row), the original **phone** below 768px (a laptop's screen text would be ~5px there). Both run the same timeline; only the geometry differs (`Layout` objects `LAPTOP` / `PHONE` in `data.ts`).
- Laptop: modern MacBook proportions, lid = thin dark bezel (1.2% sides, 1.8% top, 2% chin, camera dot) around a 16:10 aperture, over a slim base (0.03W) 108% wide with a thumb notch. Screen canvas **800 × 500**: head across the top (rosette beside a 32u headline); screen 1 puts the pull diagram left and the Valid/Recoverable split right; screen 2's bands hold their two tiles side by side; screen 3's card splits into chart (left) and dispute rows (right). Visual box `aspect-ratio 1 / 0.678`.
- Phone: Fruitful's proportions — body `aspect-ratio 214.48/449.16`, bezel `#1C1C1E` with radius `16.45% / 7.85%`; screen aperture inset `3.18% / 1.52%`, size `93.63% × 96.96%`, radius `14.73% / 6.79%`. Behind it, a phone-shaped layer casts a long, soft shadow toward the lower right (stacked warm-ink box-shadows, light from upper-left). Height `min(78vh, 50rem)` desktop · `min(68vh, 42rem)` tablet · `min(58svh, 32rem)` mobile.
- Phone screen authored in design units on a **400 × 868** canvas (fits the aperture exactly; all coordinates live in the `Layout` objects in `data.ts`); `--u = 100cqw / var(--canvas-w)` (400 or 800) (container query units, Fruitful technique), so every value below is copied as-is: `calc(var(--u) * N)`.
- Screen bg `#F5F3EF`. In-screen type follows Fruitful's phone scale (UI 14–16u, figures 17–19u, headline 38u, figure 40u (both Inter)) so it stays legible at phone width.
- Head at y=40: red rosette 24u, headline 38u/500/−0.03em (Inter, `--font-ui`) "Your ⟨channel⟩ deductions, sorted"; sub-line 16u/500 crossfades "Every deduction this quarter" → "Matched to invoices & promos" → "Disputed & recovered".
- **Screen 1 — Pull** (system diagram, Fruitful screen 1): remittance pill (dark, 150×58u at (125,150)) "Deducted this quarter / $48,210" → 12u stem → Roma badge (44u red square, white rosette, at (178,250)) → three 12u routes (cubic, vertical tangents) → three category bars (w 112u, gap 14u, x 18/144/270, bottom 500u, heights ∝ amounts, min 90u) with amount + label.
- **Screen 2 — Match** (Fruitful band hand-off): bars strip (routes/badge/text fade 0.18s), then each bar's box grows **vertically** (0.29s `power2.inOut`) then **horizontally** to full width (0.27s `power1.inOut`) into a band that *clips* its content — nothing scales. Inside each band: category label pill (left) and deduction tiles (right, 230×62u): name + amount, then a chip that wipes in (`clip-path inset 0 100% → 0`, 0.36s): green "Matched · Promo Q3-07" or red "Recoverable · $1,240".
- **Screen 3 — Recover**: bands fade (0.25s); recovery panel builds: "Recovered so far" + figure (Inter 40u, counts up), area chart (path drawn with DrawSVG 0.9s, area fades in), 3 dispute rows (status chips: Filed / In review / Credited) sliding in from x −6%, stagger .08.
- Timeline labels: `strip` (screen 1 complete), `stretch`, `settled` (screen 2 complete), `screen3`, end.

**Scroll choreography** (all fractions of one viewport after the pin unless noted; constants copied from Fruitful `GF_IN`):
| Phase | Range | What happens |
|---|---|---|
| Statement | pre-pin | chars highlight .4→1 as the section scrolls in (F.5). |
| Rise | 0.20–0.75 | Panel rises from waiting position (`scale .72`, top edge at 72% of screen height) to its column height, scale 1, `power2.inOut`. Screen 1 builds in step. |
| Fade | 0.45–0.70 | Statement fades out (linear) as the panel covers it. |
| Park | 0.65–1.00 | Panel slides horizontally from screen centre into its column (`power3.inOut`). |
| Column | 0.75–1.00 | Left column fades up (`y 24 → 0`, `power2.out`). Progress rail appears. |
| Screens | viewport 2 → 94% of the section | Screen time maps linearly from `strip` to timeline end; panel runs on the eased clock (F.5). Progress rail fill `scaleY 0→1`. Active step = 01 before `stretch`, 02 until `screen3`, 03 after. Channel card arrives at `stretch`. "Keep scrolling" hint visible from viewport 2 until screen 3 ends. |

**Roma refinement:** Fruitful maps the screens to the very end of the section, so its final screen scrolls away the moment it completes. Ours finish at `END_AT = 0.94` and hold for the last ~0.24 viewport while still pinned.

**Tab click** (Fruitful): rebuild panel with new dataset; if not already on screen 2, jump to `stretch` and play to `settled` (1.1s `power2.out`), holding there until the scroll catches up; if on screen 2, rebuild and return to the current time. Active tab: 2px red-600 border, white bg, icon well red-600 with white initial, check badge scales 0→1.

**Colour:** section on cream-50; panel white; data colours B.4; progress rail track `rgba(17,17,17,0.1)`, fill red-600; active tab red-600.

**Responsive**
- Tablet (768–991): same as desktop with gap 2.5rem, visual height 64vh.
- Mobile (≤ 767): layout stacks with the **panel on top** (`flex-direction: column-reverse`), stage padding-top = nav + 1rem. Panel height `min(56svh, 31rem)`. Column shows h3 (1.5rem) + body; body hidden when the viewport is < 700px tall; channel card + hint hidden (Fruitful hides them); progress rail at left 0. Park phase has no horizontal travel (the panel is already centred).
- Reduced motion: F.11.

### G.4 Page backdrop — cream → light red → red (reference: Fruitful pageBackground.js)

**Approved exception to A.6 #5** ("red never fills large surfaces"): the compliance and customer-stories stretch of the page sits on a scroll-driven colour backdrop.
- `components/motion/PageBackdrop.tsx`: one `position:fixed; inset:0; z-index:-1` layer behind the page with two stacked radial layers — light red (`#FBEEEB → red-100`) and red (`red-700 → red-900 #4A0A08`). Sections have no fill, so it shows through.
- Each layer's opacity is scrubbed `0 → 1` (`ease: none`, `scrub: true`; Lenis does the smoothing and the journey reverses exactly scrolling up). Ranges (`BACKDROP_RANGES`): light red over compliance `top 50% → bottom 75%` — the section arrives on cream and changes while you read it; red over stories `top 80% → top 25%`.
- Text over a changing backdrop follows it: Stories moves `--st-fg` / `--st-muted` from ink to white on the same scrubbed range.
- Reduced motion: no scrub; each section paints its own static band (`[data-static]`).

### G.5 Compliance + customer stories

- **Compliance** (`components/sections/compliance`): runroma.com's security section in Roma tokens — h2 with an accent phrase, ISO 27001 / SOC 2 badges (`public/images/compliance`), joined three-cell pillar strip (solid white, no glass). No binary-pattern background (dropped by request).
- **Customer stories** (`components/sections/stories`): Hyperline Testimonials port — two-column header, card row with `flex-grow` 3:1 (500ms `--ease-out`), stacked 88/420px strips below 1024px, white logo masks, quote box below. The card row + quote is `StoryStrip.tsx`, shared with /customers (§G.15): `tone="backdrop"` here (text follows the red backdrop), `tone="cream"` there.
- **MOCK — replace before launch:** all three quotes, the Smash Kitchen / Mochidoki attributions, the photos (Unsplash-licensed stand-ins in `public/images/stories`, credits in `stories/data.ts`), "Customer stories" / story links (`#`). The compliance claims come from runroma.com, not the positioning PDF — confirm before launch.

### G.6 FAQ (reference: Fruitful faq.js + initHeadlines)

- `components/sections/faq`: copy verbatim from runroma.com. An opaque cream-50 sheet (`radius 2.5rem`, 1.25rem on mobile) rides up over the fixed red backdrop; its bottom corners sit on the closing CTA (Fruitful `.is--page__end`).
- Motion (Fruitful values): heading lines and each item rise in with `yPercent 50, rotate 3 → 0`, 0.5s `back.out(3)` at `top 80%`, reset when scrolled back below the viewport. Answers open to `height:auto` 0.45s `back.out(1.7)`, close 0.3s `power4.out`; chevron flips 180°. Closed answers are `inert`.
- Items: cream-200, `--radius-sm`, toggle padding `1.25rem 3rem` (1.25rem mobile), list max 63.5rem, gap .75rem.
### G.7 Closing CTA (reference: Hyperline PreFooterCta)

- `components/sections/closing`: full-bleed band, type and background only (no product imagery). Layers: ink-900 base → Hyperline's blurred amber texture (`public/images/cta/texture-bg.webp`, cover) → Hyperline scrim `linear-gradient(180deg, rgba(42,38,32,.55) 0%, transparent 42%)` → Roma fade into ink-900 (black) at the bottom (no seam into the footer). Tucks under the FAQ sheet (`margin-top: -2.5rem`).
- Copy (runroma.com): "Visibility over every *dollar*." / "See Roma in action. 5 minutes. No commitment." / white pill "Book a demo". One-shot reveal (16px, 0.5s, 90ms stagger).

### G.8 Footer + wordmark (reference: Hyperline footer)

- `components/layout/Footer.tsx`: black (ink-900) continues from the CTA. Top row (client, 20 Nov 2026): a brand block (red rosette tile, "Every deduction, *accounted for*." 1.75/2rem with an accent phrase, mono tagline) beside three columns mirroring the nav: **Solutions** (Platform, the three solution pages) · **Resources** (Customers, Blog, Deduction codes, FAQs, every Roma vs. page) · **Company** (Partners, Book a demo, Contact us, Log in ↗). Grid: brand then 2 cols on phones, 3 cols ≥768px, brand 0.8fr | links 2.2fr ≥1024px. Column titles are sans labels at 50% white; links 0.9375rem on-dark-muted → white (150ms), external links carry a small ↗ that nudges on hover. A 12% white hairline, then the bottom row: copyright left, Terms · Privacy · LinkedIn right (stacked, links first, on phones). Links and copy in `lib/content/site.ts → footer`.
- `components/layout/Wordmark.tsx`: oversized "roma" in Fraunces 800 (cream-50 on black, −0.035em), the "o" is the rosette as an inline SVG in red-600. JS fits the word to the container width and clips it to **65% of the x-height** (measured from the rosette, which is exactly 1ex); the rest runs off the bottom of the page. One-shot rise on entry.

### G.9 "How Roma works" page (`/platform`, references: Hyperline capability hero + billing grid)

Route `app/platform/page.tsx`; sections in `components/platform/*`; all copy and illustrative data in `lib/content/platform.ts`. Order: hero → capabilities 2×2 → coverage → modules tabs → why Roma → compliance (light red) → proof (red) → FAQ → closing CTA (with a secondary "Try now"). The backdrop journey is the home one: cream → light red → red → FAQ sheet.

- **Framing (client decision, Nov 2026):** the page is "How Roma works". "Platform" is the URL only, never a headline.
- **Tone rule for retailers/distributors:** site-wide, see §A.1.
- **CTAs:** "Book a demo →" (`DEMO_HREF`) + "Try now" → `https://app.runroma.com/signup` (ghost on dark). No pricing on the page.
- **Hero:** red-950 band with `[data-hero]` (drives the nav states). `container-lg`; title row is 2 columns ≥992px (pill + `type-h1` left; lead + CTAs right), stacked below. The page's one pill (§E.3) is a static label with a book icon. Below: a `--radius-xl` card whose ground is `public/images/cta/texture-bg.webp` (an image, not a gradient, §A.8), a translucent white frame (no blur), and an HTML deductions inbox window (`--radius-lg` top corners, `--shadow-raise`) sitting flush on the card's bottom edge. The window is rem-based and drops columns with container queries (56 / 46 / 30 / 22rem). Load: pill → words (70ms) → lead → actions → card (y 36, 1.1s) → rows (80ms) → each status settles from "Reviewing" to Matched / Recoverable.
- **Illustrations below the hero** follow the home machine cards: wells tinted with `--well-warm` / `--well-neutral` (fade to white into the card), raised "paper" objects (white, sand-300 hairline, a soft two-layer warm shadow scaled in `--u`), tilt and layering, initial avatars, mono labels, a bottom scrim. Canvases: capabilities 560 × 420, modules 640 × 480, `--u = 100cqw / W`. Each plays one state change once on enter; capability cards replay it on hover once finished, and their layered objects fan out or straighten (transform only, no scale on the card).
- **Modules:** one white card, well left and tabs right ≥992px (rail = red-600 3px, mono numbers), wrapped pill tabs below. ARIA tablist with arrow / Home / End keys. Timed (client decision, overrides §F 'no loops while reading' for this card): each tab holds 5s while a red progress fill runs on it (rail on desktop, bar under the pill on mobile), then advances and loops; starts only once the card is in view, never pauses on hover; a click jumps and restarts the timer; off under reduced motion. 300ms cross-fade then the panel's state timeline. Pointer interactions inside the art: reason-code options highlight, each analytics bar shows its own tooltip (first by default), remittance rows highlight and their GL code turns green.
- **Why Roma:** the §E.11 numbered block, used for real: sticky heading left, ledger rows right; rows rest at .4 and the one at the reading line is full and nudged 1rem.
- **Proof:** on the red backdrop (`data-backdrop="red"`; text outside cards crosses ink → white with the home Stories timing). Three white stat cards with PDF figures only ($53K Good Day Chocolate in 6 months, $23K Smash Kitchen, 25 brands), count-up once, each with a mini visual that shows shape only (recovery curve, filed → credited pipeline, customer logo wall + "+17"). Caption "Results vary by brand. Not a guarantee of recovery."
- Every illustration carries "Illustrative data. Not a guarantee of recovery."
- **Client navigation:** with Cache Components the previous route stays in the DOM hidden, so document-wide queries use `queryVisible` / `queryAllVisible` (`lib/motion.ts`), and effects must fully reset inline styles in cleanup.

**Hero card update (client, 18 Nov):** the card now ends flush with the bottom of the red-950 band (hero `padding-bottom: 0`, card radius on the top corners only, square bottom), and the "Illustrative data" caption sits inside the card, above the window. The product pages (§G.11) use the same card.

### G.11 Product pages (`/deduction-management`, `/analytics`, `/accounting`, reference: runroma.com module pages)

Routes `app/{deduction-management,analytics,accounting}/page.tsx`; all copy and illustrative data in `lib/content/products.ts` (totals reconcile at every level, see the comments there); components in `components/product/*`. The nav's Product dropdown links here (active item: red-600 title + filled red tile, `aria-current="page"`; the Product trigger turns red-600 on cream, a 14% white pill on the dark hero), and each /platform module tab ends with an "Explore …" `ArrowLink` to its page.

**Shared frame (consistent with /platform):** `ProductHero` (G.9 hero: pill with icon, `type-h1` with one accent, lead, Try now + Book a demo, flush card with the caption on top); TrustStrip → page sections → `Numbers` → `Story` (red backdrop) → FAQ (per-page question order, `faqOrder`) → closing CTA. Coverage and Compliance live on `/` and `/platform` only (client, Nov 2026: no repeated sections across pages).
- **Hero grounds (exception to §A.6.3, like the blog photos):** Unsplash photos colour-graded to the brand (duotone red-950 → red → amber at 72%, 3px blur, then lifted): warehouse racks (deductions), a grocery aisle (analytics), remittance paperwork and a calculator (accounting). Files `public/images/product/hero-*.webp`, 2000w. Sources: unsplash.com photo IDs `1587293852726-70cdb56c2866`, `1580913428735-bd3c269d6a82`, `1554224154-26032ffc0d07` (Unsplash License).
- **Numbers:** runroma.com's "We don't speak. Our numbers do." as three platform-style cards (tinted well over the figure): a stopwatch that stops short of 5 min as a portal connects; a Before vs With Roma bar shrinking to a tenth; a recovery curve with credits landing on it. Plays once, figures count up. Footnote beside the heading.
- **Story:** Good Day Chocolate **$53K** in 6 months (PDF figure; runroma.com's "$38K" and "$3.3M brand" are not used), one white card on the red backdrop with every word inside it, a recovery curve that draws with Filed/Credited marks landing on it (shape only).

**Each page has its own hero art and signature section, so the three never read as one template:**

| Page | Hero (layout · art) | Signature section | Second section |
|---|---|---|---|
| Deduction management | split · the deduction desk: 4 totals, filters, table with backup, assignee, Valid/Invalid. a cursor marks two rows Invalid and the Invalid total ticks up. | **Journey** "Every deduction, start to finish." CSS-sticky 400vh: chapters left (rail fills, active chapter opens), one 560 × 460 stage right that changes state: inbox filtered to UNFI + saved view + export menu → chargeback report read line by line, lines land on the deduction, reason + assignee, Invalid → dispute form with POD, tracker Filed → In review → Paid back. Below 992px each chapter has its own stage (full-bleed and cropped on phones) that plays once. | — |
| Analytics | centered · Invoiced − Deducted = Paid tiles, then "Where it went" switching By retailer ↔ By type every 4.2s while on screen (a click stops the autoplay). | **DrillDown** "From a quarter's total to a single line." Split header, CSS-sticky 460vh at every width; scroll picks the level and each step plays on its own clock (`tweenTo`, no scrub): quarter $82,410 → UNFI $33,790 → MCB $14,980 → Whole Foods #10234 $3,412 → line 0417 $34.20. Each step: the rest steps back to .22, a block on the next chart's frame opens by `clip-path` from the chosen part (no layout tweening) while its colour runs red → the area background, so the next chart lands on it with no red fade-out; breadcrumb fills. | **ThreeViews** asymmetric 7/5/12 grid of working charts: retailer table sorts by any column (FLIP), deduction mix filters All/UNFI/KeHE, revenue-share chart scrubs by pointer or arrow keys (role slider) with last year and a dashed forecast. |
| Accounting | split · a paper UNFI check (guilloche SVG pattern, perforated stub, MICR line, "Received" stamp) beside the credit memo screen; the check's four deductions get GL codes and are booked one by one while "To book" counts down to $0.00. | **TieOut** "Zero manual matching." Left head + points, horizontal 4-step stepper (titles in one row, the active step's line under it; track fills left → right), one compact ledger sheet (stamp + export beside the footing) that fits one screen, scaled down to ≥0.82 on short viewports, CSS-sticky 420vh: the check → its six lines with red auditor's ticks → GL codes → footing (single rule, double rule under the check total, Difference $0.00, "Tied out" stamp) and export to NetSuite. Below 992px it plays once on enter. | **GlMap** one white card, text + audit trail left, a 520 × 400 routing diagram right: deduction types → GL accounts; routes draw on enter; pointing at a type or account lights its routes. |

**Motion rules specific to these pages:** scrubbed stages use `scrub: 0.7` on CSS-sticky pins (§F.6) and `gsap.matchMedia` to switch to play-once below 992px; every timeline's SSR markup is the finished state. Elements GSAP animates must not carry a CSS transition on the same property (hover-only transitions are scoped to `:hover`), and `fromTo` is used where React's dev double-effect could otherwise record a mid-transition end value. Reduced motion: no pins, every level/scene/state shown finished and stacked.

### G.12 Contact + Book a demo (`/contact`, `/book-a-demo`)

Routes `app/contact/page.tsx`, `app/book-a-demo/page.tsx`; copy, options and messages in `lib/content/contact.ts`; rules in `lib/forms/validation.ts` (pure, reusable server-side); the only backend touch-point is `lib/forms/submit.ts` (`submitContact` / `submitDemo`, simulated ~900ms success until connected). Every "Book a demo" button (`DEMO_HREF`) goes to `/book-a-demo`; the footer lists "Book a demo" and "Contact us"; the nav is unchanged. runroma.com's demo page embeds a HubSpot scheduler; ours is a form (client decision).

- **Layout:** `ContactHero` on the cream page (client, 18 Nov: no dark band): ink copy left (sticky ≥992px), white raised form card right (`--radius-xl`, `--shadow-raise`). The hero carries `[data-nav-light]`, which keeps the nav solid cream from the top. Contact aside: "Prefer a walkthrough? / Already a customer?" link rows. Demo aside: runroma.com's three benefits as a checklist + a "What to expect" agenda card. Then TrustStrip, FAQ (per-page order), closing CTA (contact only).
- **Fields** (client, Nov 2026: nothing a visitor has to look up): contact and demo — name* (one field), work email*, company*, job title*, phone (optional), consent*. No revenue, deductions-per-month, retailers, topic or message. Payload sends `name` as typed plus `firstName`/`lastName` split at the first space (for CRMs that want both). Contact's `?topic=` is not a field; it rides along in the payload. Demo's `?src=&plan=&rev=` ride along too.
- **Validation UX:** text fields check on blur, then live once touched; choice controls check on change. Submit checks all, shows a focusable `role="alert"` summary linking to each field, marks fields `aria-invalid` with the message under them (`aria-describedby`). Hidden honeypot. Sending: disabled button with spinner, fields read-only. Success: card swaps to a thank-you panel (check pop, `back.out(2)`), "Back to home" + reset.
- **Controls:** inputs 3rem, sand-400 border, `--radius-sm`, 16px text (no iOS zoom), focus = red-600 border + soft red ring, error = red-600 border; custom checkbox and pill chips over native inputs (keyboard focus rings kept).
- **Dropdowns:** `components/forms/Dropdown.tsx` replaces native selects: input-styled trigger (role combobox), a white listbox popover (sand hairline, raised shadow, cream-200 active row, red check on the selected value, 180ms rise). Keys ↓ ↑ Home End Enter Space Esc Tab + type-ahead; outside click closes; scrolls inside the list only.
- **Phone:** one control = searchable country-code prefix (flag + dial code; flags are country-flag-icons 3x2 SVGs, MIT, copied to `public/flags/` with no runtime dependency; all countries, United States default, US/Canada pinned; `lib/content/countries.ts`) + national number. US/Canada need 10 digits; elsewhere 4–14 digits and ≤15 with the code. Payload sends `"+<dial> <digits>"`.
- **Blur errors wait for pointer-up:** an error that appears between pointer-down and pointer-up would shift the layout and swallow the click, so blur validation is deferred until the pointer is released.
- **Open:** contact email/phone to display (none shown), `/privacy-policy` page, backend endpoint / CRM.

### G.13 Comparison pages (`/compare/[slug]`: Glimpse, Promomash, Vividly, Floret)

One data file per competitor, **one page body per competitor** (redesign, client 20 Nov 2026: the four pages must not look like one template). Route `app/compare/[slug]/page.tsx` holds only the shared frame (Nav, `CompareProvider`, `CompareHub`, Story, FAQ, closing CTA) and switches on `c.story.kind` to `components/compare/pages/{Glimpse,Promomash,Vividly,Floret}Page.tsx`; each body composes its own hero art, story sections and the one table. Content: `lib/content/compare/<slug>.ts` (type `Competitor`, `story` is a per-competitor union in `types.ts`); Roma's side once in `roma.ts`; registry, `getCompetitor` and footnote order (`sourceOrder`: table first, then the story's own cites) in `index.ts`. Adding a competitor = a data file, a `story` variant and a page body.

**Sources (client, Nov 2026):** competitor-comparison sheet + Sales Battle Cards (Arali calls, Sep–Oct 2026) + each competitor's public site.
- **Claims rule:** a competitor statement appears only if a public source can be cited; it is quoted verbatim in `sources` (prefer the competitor's own site) and shown with a numbered `Cite` (hover/click popover, Esc closes) plus the numbered list under the table. Only competitor statements are cited; Roma's come from approved copy. `checkedOn` is printed; re-check before launch and at each review.
- **Dropped as not citable (Nov 2026):** Glimpse "commission on recoveries" and "more retailers live today"; Promomash "~$500/mo"; any accuracy row (Vividly); Floret go-live and coverage.
- **Roma guardrails:** "0% uncategorized", never an accuracy %; never "automatically disputes" / "AI marks lines invalid" (the user decides); Auto Backup Request is "new", no results quoted; coverage KeHE, UNFI, Target, Walmart; no revenue band; contract terms unconfirmed (not claimed, so the Promomash terms switch shows Roma's price and setup only).
- **Branding (client, 20 Nov 2026):** competitor logos in their **original colours and proportions** (`CompetitorLogo`, the full wordmark, always on a light surface): hero lockup (`VsLockup`: Roma logo · "vs" · wordmark on a cream plate, in place of the eyebrow pill via `ProductHero`'s `pill` slot), table header, story sections, hub cards. Floret's wordmark is a 236×64 raster, capped at 32px tall (`logo.maxPx`).
- **Fairness:** ticks only where both offer a thing; the table's "Which fits?" row credits the competitor's real strengths; customer reports (e.g. ex-Glimpse users) are shown attributed, never as fact.

**The switch (homepage idea, client 20 Nov 2026):** every page has one interactive card (`Switch.tsx`: `SwitchCard`, or `SwitchBar` inside `PenToggle`): white card, mono label, and a red "See what Roma does better →" button. The card **opens on the competitor's way** (cited); the button plays Roma's version and becomes a "With X / With Roma" toggle (focus moves to it, polite live region). Layers stack in one grid cell, so the height never jumps; the hidden layer is `inert`. Each page switches a different comparison. The reveal is two-phase: the current side's rows (`data-sw-item`) fold away, then the new side's rows flip down into place one after another (perspective rotateX, staggered); reduced motion swaps instantly. Each card carries one micro-interaction that proves its point (keyboard accessible, works instantly with reduced motion) and a takeaway strip under the art (`takeaway`: one line per side, Roma's in red).

**Per page (hero → story → table):**
- **Glimpse** (managed service vs software you run): hero `CalendarGrid` (45 day cells filling red from day 1, Glimpse's four published milestones pinned and listed); "Who does the work" (`PenToggle` switch, wide, Glimpse's own framing quoted; every step card opens on a small product scene (`PenScenes`: Roma's pull / check / dispute / recover with illustrative data; Glimpse's retrieve / validate / file / ERP drawn from its cited lines); a switch plays the incoming scenes step by step, and on Roma's side each "You" token replays its step); "From a brand that switched" (`ClassifyVisual` + Julie pull quote + ex-user report); table.
- **Promomash** (volume-priced suite vs flat deductions-only): hero `GoLiveTimeline` (months, 2–4 month range band); "What you sign up for" (`OrderSummary` switch, compact enough to fit one screen: a shared "Monthly deduction invoices 100 · 500 · 2,000" control, labelled illustrative; Promomash's checkout sheet lists its published terms, cited, with a "DI volume to process" meter that rises with the pick and a "Custom quote at this volume" total; Roma's sheet holds $399 at every volume with a "same price" flash and the total counts up from $0 when revealed, no contract-term claims); `ScopeStrip` (its three areas bracketed under its logo, Roma's bracket on Deduction Management only); table.
- **Vividly** (full TPM with auto disputes vs you approve): centered hero, `ScopeMap` (its lifecycle stages in its words as columns, Roma's bar on the deductions stages, "no trade plan needed"); "Automatic, or approved" (`DeductionJourney` switch, wide: an illustrative deduction chip rides four stations, Arrives → Matched → Dispute → Resolved; Vividly's run straight through, cited, with "Needs your live trade plans" and a "Handled for you" team rail; Roma's stops at a dashed gate until you press "Confirm dispute", then files with Filed/Pending/Paid and lights "You · Confirm" on the rail; Replay resets; starts when scrolled into view); table.
- **Floret** (closest alternative; the difference is how you start): centered hero, `QuestionCard` switch (flush): the same buyer question, two answers, in one identical frame per side. Three question chips shared by both sides (What does it cost? / How fast can I start? / Who files the disputes?); a large "Q" line, then an answer card: speaker (Floret logo or Roma badge), the answer (Floret's quoted and cited; Roma's approved copy) and a visual on the right. Floret's visuals are static (a dashed "?" price tag reading "Custom quote", a dashed "Not published" dial, "Filed by Floret's team · or keep it in-house"); Roma's play one motion when shown ($399 counts up on a price tag, the ring fills to "Under 5 min" and a Live pill pops, Confirm presses then a Filed stamp). The takeaway strip follows the question. Then `AlikeCallout` (text only, on purpose, Floret quoted on keeping disputes in-house); backups (`BackupsVisual` + Brandy quote); table.
- Then on every page: `CompareHub` → Story (red backdrop) → FAQ → closing CTA. Trust strip under every hero.

**The one table** (`CompareTable`, replaces the old verdict strip, glance card, decision matrix and fit ledger): Factor (+ "what it means" under it) | Roma (faint red wash, red top rule, logo) | competitor (its logo, its cited words). Groups: "What decides it" (rows with `key`, Roma's figure large, in the page's own order) → "The details" → "Both offer it" (parity rows, tinted, ticks in both columns) → `tfoot` "Which fits?" (Roma fits if / X may fit if). Legend + numbered sources in a `<details>`. Rows become blocks below 768px.

Story sections use `Feature` (label, h2 with one serif accent, lead, extras `TheySay` / `PullQuote` / `Note`, one visual; `split` / `flip` / `wide`). Illustrations only where they prove a point; text-only sections are fine. Product-UI art is set in `--font-ui`; no serif except the receipt total. Every animation plays once; reduced motion shows everything finished. `.section` clips x-overflow so closed cite popovers never widen the page on phones.

### G.13a Compare hub (`/compare`; client feedback, 24 Nov 2026: "one summary covering all the competitors")

Route `app/compare/page.tsx` (static, beside `[slug]`). Copy, criteria and FAQ in `lib/content/compare/criteria.ts`; each competitor's column is `matrix` on its own data file. Linked from the Resources menu and footer ("Compare all tools") and from every comparison page's hub ("See all five side by side →").

- **Eight fixed criteria, same for every brand:** What it is · Price · Time to go live · Who files disputes · Classification · Backups · Accounting · Security. Roma's answers are approved copy (§G.13 guardrails). Insights, First dispute and Scope stay on their own pages.
- **Consistency rule:** a cell names its page's table row (`row`), and `matrixCell()` reads that row's words and source verbatim, so the summary can't drift from the page; a renamed row fails the build, and `Record<CriterionId, …>` fails it if a criterion is missing. Only criteria a page doesn't cover carry their own quote (`them`), cited from `matrixSources` so the page's own footnotes are unchanged. No public statement = "Not published" (a dashed chip), never a guess. Adding a competitor now also means a `matrix` entry.
- **Hero art `LedgerSheet`:** a comparison sheet (window language of the other hero art). Price / Time to go live / Who files disputes are written in row by row: competitors' answers fade in and get a pen rule, then Roma's lands with a red tick (DrawSVG). Values come from `matrixCell`. Below a 40rem container two tools show, below 26rem one; the rest are named under the sheet.
- **Matrix (`CompareMatrix`):** real `<table>`, sticky head under the nav ≥1024px; criterion (+ the buyer's question) | Roma (red wash, red rule, $399 and 5 min roll in as `RollingNumber`) | one column per competitor (logo, "Full comparison →", short value, cited words). "Best fit if" closes it (Roma's line, then each competitor's own first "may fit if" line). Sources numbered 1…n down each column, grouped by competitor.
- **Spotlight (the page's one control):** a tablist (All · each competitor; arrows/Home/End). ≥1024px it lights the picked column and steps the others back to .45; "All" resets. Below 1024px "All" hides and the table shows Roma + the picked competitor (default the first), so nothing scrolls sideways; the new column fades up row by row (40ms). Below 640px each criterion becomes a block with the two answers side by side. The pick lives in `?vs=` (shareable) and gives the matching hub card the active border. Pointing at a row brings it forward and steps the rest back (pointer devices, CSS only).
- Then `CalculatorBanner` → `CompareHub` (all four) → Story → FAQ → closing CTA. ItemList + FAQPage JSON-LD. Reduced motion: everything finished, tabs switch instantly.

### G.14 Legal pages (`/terms-and-conditions`, `/privacy-policy`)

Client, 20 Nov 2026: no dark band. `DocHeader tone="light"` sits on the cream page, centred (label → `type-h1` → lead → effective date, all on the axis, ink colours), closed by a sand-300 hairline, then the blog article layout (sticky table of contents + prose). The header carries `[data-nav-light]`, and `Nav.tsx` lists these routes (with /contact and /book-a-demo) in `LIGHT_ROUTES` so the server already renders the solid cream nav: no white-on-cream flash before hydration. (/deduction-codes no longer uses `DocHeader`, see G.14a.)

### G.14a Deduction code library (`/deduction-codes`)

Client, 20 Nov 2026: brought in line with the index pages. Route `app/deduction-codes/page.tsx`; data and helpers in `lib/content/deductionCodes.ts` (rows verbatim in `deductionCodes.json`: UNFI 428, KeHE 109, Walmart 34, Target 14); library `components/legal/CodeLibrary.tsx` + `codes.module.css`.

- **Hero:** the /blogs hero (§G.10) via `BlogHero copy={codesHero}`; the list on the right is the four retailers with their code counts, each linking to `?r=<key>#library`. Photo: Camilo Rueda López, unsplash.com/photos/3CLPBgNuX40 (Unsplash License), ungraded like the blog hero, `public/images/codes/hero-codes-2400.webp`.
- **Library sheet** (Blog grid sheet): label + "Look up ⟨a code⟩." left, lead + updated date right. Lookup first: one search over every retailer (ranked: exact code, code prefix, code contains, retailer, meaning; `/` focuses it, Esc clears); retailer chips (single-ink logos as CSS masks, live match counts, 0-match chips disabled); for UNFI a region segment and a category select (top-level family, "MCB (…)" → MCB). The controls stick under the nav ≥768px, and the table head sticks under them (`--bar-h` from a ResizeObserver).
- **Rows:** one per meaning. UNFI rows that share a category + description collapse into one row (428 → 148). Up to 3 codes list in the cell; bigger groups preview two and open a panel (retailer · region → code, own filter above 12 items). The panel has no scroll box of its own (an inner scroller trapped the wheel): it flows with the page, shows 24 codes, then "Show all N codes" / "Show fewer" (which brings the panel back into view); the filter always searches every code in the group. A search that hits codes inside a group lists just those (inline when ≤3, else the panel opens with "Show all N"). Columns: Code | What it means (category, then description) | Details (retailer on "All", a tone tag from the `--data-*` tokens — Promo & trade / Product & returns / Fees & compliance — regions, retailer). Codes are mono; placeholders like `(invoice #)` render as dashed italic chips (legend above the table); each code has a copy button. Matches are marked in red-100. Below 768px rows become cards.
- **Pagination:** 25 rows a page (Prev · numbers with ellipses · Next); on change it scrolls back to the status line and focuses it. Every row stays in the HTML with `hidden` off-page, so all codes are prerendered and indexable.
- **URL state:** `?q=&r=&region=&cat=&page=` via `history.replaceState`; links that change the URL (the hero list) re-seed the state.

### G.15 Customers (`/customers`, `/customers/[slug]`; reference: hyperline.co/customers + its story pages, Nov 2026)
Rebuilt 20 Nov 2026 (client: "simple yet premium", Hyperline style). Replaces the earlier blog-hero / trust strip / results bento / quote rotator / filterable library version. Linked from the nav as a standalone "Customers" link (§G.1) and from the footer Resources column.

**`/customers`** (`app/customers/page.tsx`): one cream-50 **sheet** (z-index 2, bottom radius 2.5rem / 1.25rem on phones) whose rounded corners sit on the closing CTA. `[data-nav-light]` + `LIGHT_ROUTES`: the nav is solid cream from the top.
1. **Intro**, centred in `--container-lg`: h1 at `type-h2` (Hyperline's restrained heading; max 20ch, balance) + `type-lead` ink-600 (max 38rem), gap 1rem. Top padding `nav-h + 4rem` (3.5rem on phones); 2.5rem to the strip.
2. **Featured strip**: `StoryStrip tone="cream" storyLink priority` with the homepage's three real-figure stories (`STORIES` in `components/sections/stories/data.ts`). Taller than the homepage row (`clamp(24rem, 56svh, 30rem)` ≥1024px, active strip `min(26rem, 56svh)` below). The active card shows the metric pill + a "Customer story →" pill (`--fill-on-dark`, `--border-on-dark`, no blur). The quote panel is a white §E.6 surface (sand-300 hairline), `--radius-md`, quote 1.125/1.25rem 400 ink-900, attribution ink-600.
3. **Story grid**: every story as a `LogoCard` (`components/customers/LogoCard.tsx`), 3 cols ≥992, 2 ≥640, 1 below, gap 1rem, 4rem below the strip (2.5rem on phones). Visually hidden h2. `RESULTS_VARY` note under it (0.8125rem ink-500).
4. **Closing CTA** (G.7) with `custClosing`.

**Logo card** (§E.6 dress, client 20 Nov 2026: "red for better contrast"): white, 1px sand-300, `--radius-md`, padding 1.5rem (1.25rem phones), min-height 15rem (13rem phones), content split top/bottom. Top: `BrandMark` in ink-800 (logo mask at the §E.10 optical height, or the sans wordmark). Bottom: product as a `label` in **red-600**, the `cardTitle` ("How {brand} …", 1.125rem/500, max 28ch, the stretched link), "Read story →" 0.875rem/500 in **red-600**. Hover (pointer devices): border → red-600, "Read story" → red-700, arrow nudges 3px. Focus: 2px red-600 ring on the card (`:has(:focus-visible)`). Red stays a signal (§A.6 #5): text and hairline only, never a fill.

**`/customers/[slug]`** (`app/customers/[slug]/page.tsx`): the same cream sheet, one reading column (`--container-sm`), Hyperline's story page order:
1. `StoryIntro` (`components/customers/story/`): breadcrumb "Customers › {Brand}" (0.875rem ink-500/600, `›` in sand-400) → cover photo or video 16/9, `--radius-lg`, LCP → h1 `cardTitle` (1.625 → 2rem, Hyperline text-h2) → `type-lead` excerpt → person row: name + "role @ brand" (a 3rem portrait only when the record has one; client 24 Nov: no photo for Farmer Direct Foods). The intro sits on the body grid over the story column, so their edges line up.
2. Body grid (§G.10 article grid): "On this page" (`ArticleToc`, h2 `toc` labels) | story | **At a glance** (`StoryGlance`: sticky white §E.6 card ≥992px — brand mark, the page's only one; `about`; facts from `glance` or derived by `glanceFacts()`; "Book a demo"). Below 992px the card stacks above the summary. Story column: `StorySummary` 2×2 `<dl>` of white §E.6 cards (**Challenge · Solution · Channels · Results**) → prose → "Results vary" note.
3. Story prose (`ArticleBody`, §G.10 styles): Hyperline's plain large quotes (curly quotes added in CSS). The attributed quote (`quote.text` + "name, role @ brand") closes the first section (just before the second h2), so write that section not to end on a quote. Outcome points use the `cards` block.
4. "More customer stories" (`type-h4`) + 3 `LogoCard`s from `getRelatedStories`, in `--container-lg`.
5. Closing CTA. Static params for every story; Article + BreadcrumbList JSON-LD.

Motion: one-shot `Reveal` rises (16px, 0.5s, 80ms stagger); SSR is the final state; reduced motion shows everything at rest.

Data: one source, `lib/content/customers.ts` (`CUSTOMER_STORIES`); the homepage section derives its three cards from it. Each record is `status: "real" | "real-figures" | "mock"` and carries `cardTitle`, `about` and `summary` for these pages. Page copy: `customersCopy`, `storyPageCopy`, `custClosing`.

Video testimonials (`video` on a record; Farmer Direct Foods leads the strip): the card and the story cover play a silent, caption-free 12s teaser loop over its poster (`components/video/TeaserVideo.tsx`: `preload="none"`, plays only while active and on screen, never with reduced motion or Data Saver). "Watch testimonial" (`WatchTestimonial.tsx`) opens the full video with sound in a native modal `<dialog>`; the `<video>` mounts only while open, 1080p above ~1280 device px, else 720p. Files live in `public/videos/stories/` with a version suffix (`-v1`), served `immutable` (next.config.ts); bump the suffix to replace one. Self-hosted for now; move to Mux once there are 3+ videos.

### G.16 Partner program (`/partners`, reference: cygnet.one/partner-program/products)

Client-preview **shell** (20 Nov 2026): structure follows Cygnet's partner page; every program term is MOCK (see §11). Route `app/partners/page.tsx`; copy in `lib/content/partners.ts`; components in `components/partners/*`. Linked from the footer's Company column only.

- **Order:** hero → trust strip → Why partner (benefit strip; the PDF proof sits inside its art: "Live in 5 min", "25 brands pay for Roma"; no separate stats row, client 20 Nov) → Partnership opportunities (3 §E.6 cards, one per partner type, each with an "Opportunity" band and a link that presets the form) → Solutions open for partnership (scroll story) → Built to help you win (partner kit + item list) → Founder note → Partnership journey (Discover → Enable → Collaborate → Grow) → Apply (form) → FAQ → closing CTA.
- **Illustrations** (`components/partners/art/*`, client 20 Nov: "sections look dead"): the home machine-card language (tinted wells, raised paper, Inter, mono labels, `--u` canvas units via `art.module.css`); each plays one state change once in view (`usePlayOnce`), SSR = finished. Why: services list gains "Deduction recovery" · portals → Roma → brands · a recurring partner statement (320 × 180). Opportunity cards: GL lines + Booked stamp · portals → Roma → your product · portfolio wall. Fictional firm/brands, captioned "Illustrative data. Fictional firm and brands."
- **Solutions scroll story** (client asked for the /deduction-management Journey, §G.11): reuses `journey.module.css` and its mechanics (CSS-sticky pin pulled up 8rem under the heading; scene 1 plays once as the stage arrives, then only the hand-offs to scenes 2–3 are scrubbed; rail + opening chapters; play-once stages below 992px; stacked under reduced motion) with a 340vh pin. Each 560 × 460 scene is one client from a partner's seat (client switcher in the corner): two lines Disputed + "Recovered for client $2,107.70" · where it went ($48,210) + "Monthly review, shared with client" · four lines get GL codes, $0.00 difference, Tied out, exported to NetSuite. Figures reconcile in `lib/content/partners.ts`.
- **Partner hub** (replaced the scattered "kit" desk, client 20 Nov): one product window, the partner's Roma workspace ("Partner hub · Northfield Accounting"), with one block per enablement item in a 2-column grid: co-marketing webinar · sales kit files · demo workspace (Sandbox) · referral revenue bars (Recurring, no amounts) · playbooks · partner manager ("Book a call"). Pointing at a row outlines its block in red-600 with a soft ring and steps the rest back to .5 (CSS on the inner block; the GSAP entrance owns the outer cell). Pointer devices only.
- **Plasma hover (approved exception to §A.6.4/§A.8, client 20 Nov):** opportunity cards only. `art/PlasmaHover.tsx` is an in-house WebGL fragment shader (no library): domain-warped noise in cream → rose → amber with red gathering under the cursor, fading to white at the bottom like `--well-warm`. Context created on first hover; rAF runs only while hovered and stops after the fade-out; DPR ≤ 1.5; off on coarse pointers and reduced motion.
- **Hero:** the /blogs hero composition (§G.10) via `blog.module.css`: full-bleed photo under `--overlay-hero`, pill + `type-display` title left; lead, "Become a partner →" + "How it works ↓", and a "Who it's for" list right. Photo: Van Tay Media, unsplash.com/photos/TFFn3BYLc5s (Unsplash License), `public/images/partners/hero-partners-2400.webp`.
- **Backdrop journey (§G.4):** the journey section carries `data-backdrop="light"`, the Apply section `data-backdrop="red"` (its copy crosses ink → white on `BACKDROP_RANGES.red`, Proof timing; `[data-static]` bands under reduced motion); the FAQ sheet rides up over the red, then the closing CTA (`ClosingCta` `copy` prop: "Ready to grow together?", "Become a partner" → `#apply`, "Contact us").
- **Founder note:** full-bleed ink-900 band; the cut-out portrait stands on the band's bottom edge and breaks out 6–7rem above it; quote, 2px red-600 rule, attribution. Stacks below 992px.
- **Form:** `LeadForm kind="partner"`: first/last name, work email, company, type of partnership (full-width row), phone, message (optional), consent. `?type=` or a card link (`PARTNER_TYPE_EVENT`) presets the type. `submitPartner` in `lib/forms/submit.ts` is simulated. Dropdown options wrap instead of truncating (all forms).
- **Left out on purpose:** Cygnet's partner logo wall and partner stories (Roma has no partners yet; they would be fictional), stat counters and week-by-week durations.

### G.17–G.18 shared: brand-red surfaces and signature motion (client, 20 Nov 2026)

Client asked for more brand colour and contrast on /calculator and /pricing ("dark red looks like maroon"). Approved exception to §A.6.5 for these two pages: result surfaces use **the home Stories red as a fill**: `radial-gradient(120% 90% at 50% 25–30%, red-700, red-900)`, never flat red-950. Used for the calculator results column and gate column, the compact embed's result panel, the featured plan card (a layer that glides to the picked column ≥768px), the "Will Roma pay for itself?" band, and Roma's price tag. On red: white type, `rgba(255,255,255,.8)` muted, `.2` hairlines, white cards with the Proof shadow (`0 30px 60px -30px rgba(31,10,8,.6)`), inverse/ghostOnDark buttons; the invalid figure is a cream-100 chip.
Signature motion: **RollingNumber** (odometer digits, 700ms `--ease-out`, 45ms stagger from the right; rolls in on first view) for headline figures, plan prices and proof stats; **PaybackChart** (value line draws, dashed yearly-cost line, marker drops on the payback month; attr-tweens on input changes); **price tags** (Roma's tag rises and its price rolls, then the competitor tags rise in turn; straight rises only, no tilt or swing, client 20 Nov 2026; hover darkens the tag edge). The security row leads SOC 2 and ISO 27001 with the home Compliance medallions. Both pages end with `ProofRed` on the red scroll backdrop (§G.4). All static under reduced motion.

### G.17 Deductions calculator (`/calculator`; brief: "ROI calculator and pricing brief", 20 Nov 2026)

Route `app/calculator/page.tsx` (`/roi` 301s to it, `next.config.ts`); every input, constant and line of copy in `lib/content/calculator.ts`; math, rounding, parsing and URL params in `lib/calculator/math.ts` (pure; brief §2.12 worked example reproduces exactly: $38,400 · 702% · 1.5 months); components in `components/calculator/*`. Linked as the first Resources item and in the footer Resources column.

- **Hero:** the /customers intro on its cream sheet (§G.15), with the calculator card where /customers has its story strip. `[data-nav-light]` + `LIGHT_ROUTES`.
- **Card (revenue first, Nov 2026):** one centred column, max 52rem, white, `--radius-xl`. Stage 1 asks a single question ("What’s your brand’s annual revenue?") with one large money field (`RevenueHero`; typed parsing and validation shared with `RangeField` via `useNumberField`: "10m", "$10,000,000", live "That’s $10M a year" readout, range and format messages), quick-pick chips ($5M · $25M · $100M · $500M) and Calculate. Enter, Calculate or a chip reveals stage 2; the question collapses to an editable line ("On [$10,000,000] in annual revenue") that re-tweens results live. A link with `?R=` opens straight on stage 2.
- **Results:** the red surface under the question; children rise in on a stagger (16px, 600ms). Headline: the invalid figure as an odometer ("a year in invalid deductions"). "Where your revenue goes": one bar that opens from whole to invalid (cream) / valid (white 42%) / kept (white 14%), with a legend that doubles as the figures (share in mono, amounts count up; invalid on a cream pill) and a total row. "Fine-tune the rates" (collapsed, shows the current rates) opens a white inset with the valid and invalid % sliders (defaults 25% / 10%). Then Book a demo → / Try now, the disclaimer, Copy link. Live, no email needed; the URL syncs only once results are shown.
- **Gate (brief §2.6):** the breakdown row under the card: gain, write-off, time value, ROI, payback (+ suggested plan, See pricing, Book a demo → with `?src=calculator&rev=&plan=`, Try now). Locked = each row shows a dashed "In your report" lock tag plus a one-line hint (client found blurred bars unclear); gated numbers never reach the DOM before submit. Inputs validate live: characters a field can't use are dropped as typed with "Use numbers only…", unreadable or out-of-range values are flagged while typing and clamped on blur. Form beside it ≥992px, a bottom sheet (native `<dialog>`) below. Personal email domains get a hint, not a block (client). Returning visitors: localStorage flag. Submission: `submitCalculator` in `lib/forms/submit.ts` (simulated until HubSpot), payload with the brief's HubSpot property names in `lib/calculator/payload.ts`.
- **Mobile:** single column; once revealed, a dark pill bar with the headline sits above the Ask Roma launcher while the card is on screen and the headline isn’t.
- **How we calculate:** sticky head + assumptions with sources left, a live ledger table right; gated lines show only their formula until unlocked.
- **Embeds:** `CalculatorCompact` (revenue only: field + chips → invalid figure live → "Open the calculator" with `?R=&v=&i=`, landing on the reveal) on `/` after MachineFlow, `/deduction-management` after Numbers and `/pricing` (adds payback at the entry plan price). `CalculatorBanner` (link only) on every compare page and inline in the deductions blog post (`{ type: "calculator" }` block). Embeds carry no `data-backdrop`.
- **Analytics:** `track()` in `lib/calculator/track.ts` dispatches `roma:analytics` CustomEvents for every brief §2.10 / §3.10 event; attach the chosen tool there.

### G.18 Pricing (`/pricing`; same brief, §3)

Route `app/pricing/page.tsx`; plans, matrix, alternatives, proof and FAQ in `lib/content/pricing.ts` (model B: tiers by portals; every commercial value is `confirmed: false` until Roma signs off; the JSON-LD Offer waits on `offerConfirmed`); components in `components/pricing/*`. Top-level nav link between Customers and Resources (client, 20 Nov) and the footer Company column.

Order: /customers intro + Book a demo → / Try now → plans (portal picker radiogroup marks the fitting plan with the §E.6 active border, others step back to .62; prices count up once; no "popular" badge) → feature matrix (grouped by product, sticky plan headers; plan tabs below 768px) → "Will Roma pay for itself?" embed → Roma vs alternatives (Roma row in the compare table's red wash; competitor prices numbered to their public sources) → TrustStrip → proof (two story cards led by their figure, stats card, security row) → FAQ (10 pricing questions) → closing CTA.

### G.10 Blog (`/blogs`, `/blogs/[slug]`, reference: Vodex `/resources/blog`, adapted)

Routes `app/blogs/page.tsx` and `app/blogs/[slug]/page.tsx` (prerendered via `generateStaticParams`; unknown slugs call `notFound()`, since `dynamicParams` is unavailable with Cache Components); components in `components/blog/*`; every post, author and image credit in `lib/content/blog.ts` (typed blocks, no MDX). Same tone rule as G.9 for retailers and distributors, same banned copy (§A.8), PDF-approved proof only ($53K Good Day Chocolate, $23K Smash Kitchen, 25 brands).

- **Editorial photography (exception to §A.6.3, blog only, client decision Nov 2026):** article covers and in-body figures may use warm, documentary photography (shelves, warehouses, paperwork, founders at work). No people posed at the camera, no visible third-party UI, no filters or gradient overlays. Covers 3:2, 2000w WebP; body photos 1600w. Product-UI figures inside articles still follow §A.6.3 and carry the "Illustrative data" caption.
- **Listing:** hero (red-950, `[data-hero]`, PlatformHero composition: pill → `type-h1` with one accent → lead → topic list as mono labels with 6px red square bullets; no CTAs) → featured card → "Latest" grid sheet → closing CTA. No category filter or search until there are more than ~9 posts.
- **Featured card:** one white card, sand-300 border, `--radius-lg`; ≥992px a `1.15fr 1fr` split, image left (fills the row, min 3:2), body padded 3rem; stacked below 992px.
- **Post card:** §E.6 card with the image flush on top (3:2, top corners follow the card radius), body padding 1.5rem (1.25rem mobile): category label → `type-h5` title → excerpt (3-line clamp, ink-600, small) → meta row pinned to the bottom (`margin-top: auto`, tabular-nums). Whole card is one link (title `::after` inset 0). Grid: 3 columns ≥992px, 2 ≥768px (odd last card centred at column width), 1 below; gap 1.5rem.
- **Hover (strict §F.7):** border sand-300 → sand-400 (150ms), title underline swipe (§E.2 mechanics), arrow nudge `translate(3px,-3px)`. No image zoom, no lift, no shadow.
- **Article header:** the /blogs full-bleed hero (same frame as the story hero, §G.15): the post cover fills the `[data-hero]` section under `--overlay-hero` (real alt text kept; no separate cover card). Bottom-aligned, left: "All articles" back link → meta pill (category · `<time>` date · read time) → `type-h1` (max 18ch; display size runs too long for article titles). Right: lead → author byline above a hairline (initials monogram, name linking to the `#author` card with `rel="author"`, role). Load: background settles 1.06 → 1, back + pill → words (70ms) → lead → byline.
- **Article body (Hyperline `.prose`, 24 Nov 2026):** ≥1200px a 3-column grid `1fr | 40rem | 1fr` (sticky table of contents left at `top: calc(var(--nav-h) + 2rem)`; the right column holds the story pages' "At a glance" card, empty on posts); 992–1199px `13rem | 40rem`; single column below. Text 1.0625rem / 1.6, weight 500, +0.02em, ink-800, measure 39rem, 1.25rem apart. h2 1.5rem / 1.3 (margin-top 3.5rem, `scroll-margin-top`), h3 1.25rem (2.5rem). Quote = plain 1.25rem / 1.35 ink-900 with a hanging opening mark, 2rem around it (no rule). `cards` block = 2×2 white §E.6 cards (title with a red square + one line). Lists with 6px red-600 square bullets; callout = §E.6 card on white with a sans label; photo figure `--radius-md` with a small ink-500 caption; tables in a bordered `--radius-sm` frame, hairline rows, tabular-nums, horizontal scroll on narrow screens.
- **Table of contents:** "On this page" label; links small ink-600; active link ink-900 with a 2px red-600 left rule and `aria-current="location"`. Active section is computed with a rAF-throttled scroll listener (heading top ≤ nav height + 2rem), not IntersectionObserver.
- **Reading progress:** a 2px red-600 bar fixed under the nav, `scaleX` 0 → 1 across the article body (origin left). Explains a state (§A.6.4); not shown under reduced motion.
- **Motion:** header uses the G.9 hero load sequence (words 70ms); featured card, grid cards (80ms stagger), article figures and h2s use the one-shot `rise` (16px, 0.5s) from `components/platform/motion.ts`. SSR markup is the final state.
- **After the article:** author card (§E.6, monogram + name + role + one-line bio) → "Keep reading" grid sheet (3 posts, same category first) → closing CTA.
- **Navigation:** "Blog" (`/blogs`) sits in the nav Resources dropdown (its feature card is the latest post) and in the footer Resources column.

---

## H. Responsive design summary

| Element | Large desktop ≥1440 | Desktop 992–1439 | Tablet 768–991 | Mobile ≤767 |
|---|---|---|---|---|
| Root size | 16px fixed | `clamp(14px,1.111vw,16px)` | 16px | 16px |
| Nav | 89px, 2 links + 3 dropdowns | same | dropdowns → accordion sheet at <992 | 72px, accordion sheet |
| Hero H1 | 5.5rem | 5.5rem (fluid) | 4rem | 2.75rem |
| Hero product | 75rem frame | fluid | full width | full width, radius .75rem |
| Trust strip | label left, marquee right | same | label above | label above, full-bleed marquee |
| Feature | 2 col, 400vh pin | same | 2 col compact | stacked, panel on top, card hidden |

Composition changes, not just scaling: hero rig motion is halved on mobile; feature section drops horizontal park travel and the tabs card on mobile; marquee becomes full-bleed.

---

## I. Technical guidelines

### I.1 Stack
Next.js 16 (App Router, Turbopack) · React 19 · TypeScript (strict) · Tailwind CSS 4 (`@theme` tokens) · CSS Modules for complex section styles · GSAP 3.13 · Lenis 1.3.

### I.2 Architecture
```
app/
  layout.tsx            fonts, <SmoothScroll/>, metadata
  page.tsx              composes sections in order
  globals.css           Tailwind import, @theme (tokens), base, utilities
  fonts/                local font files (Source Serif 4, props only)
components/
  layout/               Nav.tsx, nav.module.css
  sections/hero/        Hero.tsx (load sequence), HeroHeadline.tsx (rotation), HeroProduct.tsx (spring rig), hero.module.css
  sections/trust/       TrustStrip.tsx, trust.module.css
  sections/feature/     FeatureStory.tsx (entrance + scroll→clock + tabs), AppPanel.tsx (panel markup),
                        panelTimeline.ts (paused screen timeline), data.ts (copy, scenarios, geometry),
                        feature.module.css, panel.module.css
  ui/                   Button.tsx, ArrowLink.tsx, ui.module.css
  motion/               SmoothScroll.tsx (Lenis + scrollToTarget)
lib/
  gsap.ts               single place that registers plugins (client only)
  motion.ts             easing constants mirrored from tokens, prefersReducedMotion(), clamp/smooth
  content/              site.ts (nav, hero, trust copy), logos.ts (logo list + optical sizing)
public/
  brand/  images/hero/  images/product/  logos/customers/
```
- Sections are client components only where they animate; static markup is server-rendered and is the **final state** (F.10).
- **Pre-paint guard:** a CSS `@media (scripting: enabled) and (prefers-reduced-motion: no-preference)` block (no inline script). Under it, `[data-anim]` elements start at `opacity:0` so server HTML never flashes before GSAP sets start states; a CSS fallback reveals them after 4s if JS never runs. The hero adds `html.motion-ready` the moment GSAP takes over, which turns the fallback off so it can't override inline styles. Only put `data-anim` on elements a script will animate in.
- **Turbopack/Tailwind:** `next.config.ts` runs `@tailwindcss/turbopack` on global CSS only (`condition: not *.module.css`); renaming modules "as *.css" strips CSS-module scoping.
- Animation code lives in `useLayoutEffect`/`useGSAP`-style effects scoped with `gsap.context(…, ref)` and reverted on unmount.

### I.3 Naming
- Components PascalCase; CSS module classes camelCase (`styles.heroIntro`); data attributes for animation hooks `data-anim="…"` / `data-gf="…"` (never select by Tailwind class).
- Tokens: `--color-{family}-{step}`, `--ease-*`, `--dur-*`, `--radius-*`, `--section-*`, `--container-*`.
- Assets: kebab-case, include width when multiple sizes (`placeholder-balloons-2000.webp`).

### I.4 Assets
- Raster UI/illustration → WebP; logos → trimmed PNG alpha masks (white on transparent) coloured by CSS mask.
- Every image has intrinsic width/height (or aspect-ratio) to prevent CLS.
- `next.config.ts`: `images.qualities: [75, 85]`.
- Reference ZIPs are **never** copied wholesale; only processed assets live in `public/`.

### I.5 Animation implementation conventions
- Register plugins once in `lib/gsap.ts`.
- Use CSS sticky for pinning; ScrollTrigger only for progress (`start/end` on the tall container).
- Long-running rAF loops (hero rig) stop when settled/off-screen and restart on scroll/resize.
- Re-measure on `resize` via `ScrollTrigger.refresh()`; use function-based values (`x: () => …`) + `invalidateOnRefresh`.
- All tunables live as named constants at the top of the file, with the reference they came from.

### I.6 Responsive implementation
Mobile-first Tailwind for layout; breakpoints `md 768 / lg 992 / xl 1440`. JS reads breakpoints from `lib/motion.ts` (`matchMedia`), not `innerWidth` constants.

### I.7 Accessibility
- One `h1` (hero). Rotating headline: static `aria-label`, animated words `aria-hidden`.
- All interactive elements keyboard reachable, `:focus-visible` ring per B.5; tabs use `role="tablist"/"tab"`, `aria-selected`, arrow-key navigation.
- Product panel is decorative (`aria-hidden`) with an adjacent visually-hidden text summary.
- Contrast ≥ 4.5:1 for text (verified in B.3/B.4); text over the hero image sits on the overlay (measured ≥ 4.5:1 at the brightest area).
- Respect `prefers-reduced-motion` (F.11). Marquee runs continuously (no hover pause, by request); it is decorative, duplicated logos are `aria-hidden`, and reduced motion makes it static.

### I.8 Performance
- LCP = hero background image: preloaded via `fetchPriority="high"`, `sizes="100vw"`, 2000w max on desktop.
- Fonts: `next/font` (self-hosted, `display: swap`), only the weights listed.
- Animate transform/opacity only (F.10); `will-change` sparingly.
- GSAP + Lenis are the only runtime deps (~45 kB gz together).
- No layout thrash: read geometry in one pass on refresh, never per frame (except the hero rig's cached values).

---

## 11. Open items (must resolve before launch)
1. **Hero illustration** is Different AI's artwork — placeholder only. Commission Roma-owned art (same full-bleed, warm-red, painterly brief) and swap `public/images/hero/*`.
2. **Logo licensing**: confirm customer logo usage approval (taken from the current site).
3. **Case-study link** for the announcement pill (Good Day Chocolate, $53K) — no URL yet.
4. **Higher-resolution customer logos** (current files are ≤ 336px wide; fine at ≤ 44px height on 2× screens, not beyond).
5. Vector Roma logo (SVG) — only a 512px PNG exists.
6. **Blog sample content** (G.10): the four articles, their author names and roles, and the Unsplash photography (credits in `lib/content/blog.ts`) were written for the client preview. Replace with real authors and approved posts before launch.
7. **Customer stories content** (G.5, G.15): Farmer Direct Foods is real (client-supplied quote, video, logo); its story copy comes from "Roma | Farmer Direct Foods Case Study | Drafts v1", a draft pending Julie's written approval and a claims check. Otherwise, in `lib/content/customers.ts`, only the headline figures of Good Day Chocolate ($53K / 6 months, Jasen Arias), Smash Kitchen ($23K) and Mochidoki (live in 5 minutes) are sourced. Every narrative, quote, secondary metric, card title, "about" line and Challenge/Solution/Channels/Results summary is MOCK, the six other brands and their people are fictional, and all photos and portraits are Unsplash stand-ins. Replace (or remove the `mock` records) before launch.
8. **Partner program content** (G.16): all program terms, enablement items and FAQ answers are MOCK (Roma has no partner program yet). The founder quote is placeholder copy; the name and portrait are Roma's founder, Ujwal Kalra (`public/images/partners/founder-ujwal-kalra.webp`, background cut out). The application form has no backend.
