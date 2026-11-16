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
| fruitful.com (Webflow + Vite source) | Typography style (grotesk medium + serif accent), the pinned scroll-driven product story ("goalflow"): entrance, clock-eased scrub, staged screen timeline, tabs, progress rail, character highlight. |

Data decisions made with the team:
- **Proof numbers come from the PDF**: Good Day Chocolate recovered **$53K** within 6 months; Smash Kitchen **$23K**; **25 brands** pay for Roma. The site's "170+ brands" and "$38K" are **not** used.
- **Hero art is a placeholder**: Different AI's balloons-over-red-mountains illustration, used until Roma commissions its own. Must be replaced before launch (see §11).
- **Fonts are free/open**: Geist + Geist Mono (OFL) replace PP Neue Montreal; Source Serif 4 (OFL) is the serif accent. No commercial font files ship.

---

## A. Brand and design philosophy

### A.1 What Roma is (one paragraph, use this to sanity-check any copy)
Natural and specialty CPG brands ($1M–$50M, sweet spot $3–10M) selling through UNFI, KeHE and major retailers lose 2–3% of revenue to deductions — chargebacks, promo claims, shortages, fees — taken straight out of their payments. Many are invalid, but no one on a lean team has time to check, so the money is written off by default. Roma pulls every deduction from distributor and retailer portals, categorizes it, matches it to invoices and promo agreements, and lets the brand dispute invalid ones from one place. Live in 5 minutes, no ERP or IT project, from $399/month.

**Value proposition (headline-level):** Stop writing off deductions. Roma recovers what UNFI, KeHE and retailers owe you.

### A.2 Audience
The founder (or one finance person) of a $1M–$50M natural CPG brand. Owns the P&L, wears five hats, has no AR team. Suspects deductions eat margin but has never had time to look. Hates software projects, wants **proof in dollars, fast**. Often loops in a CFO or bookkeeper to validate — so the page must also survive a sceptical finance read.

### A.3 Brand personality
Direct · Plain-spoken · Founder-to-founder · Lightly urgent · Precise with numbers.
Roma is the calm, competent operator who already did the spreadsheet for you. Not a "platform", not "AI-powered" (never as a headline).

### A.4 Desired perception
1. "This is about *my* money" — dollars first, features second.
2. "These people understand UNFI and KeHE" — real vocabulary (MCB, shortages, promo claims, portals), never generic "trade spend leakage".
3. "This is simple" — few elements per screen, one idea per section.
4. "I can trust the numbers" — exact figures, tabular numerals, restrained motion, no hype.

### A.5 Visual direction — "Warm ledger"
Roma red on warm cream paper, set in a precise grotesk with a single serif voice for the words that matter (money, outcome). Imagery is either rich illustration (hero) or real product UI (everything else). Motion is physical and calm: things rise, settle, draw, fill — like numbers being reconciled.

### A.6 Design principles (each is testable)
1. **Lead with dollars.** Every section's first readable element is an outcome or a number, not a feature name.
2. **One serif moment per heading.** The serif accent (Source Serif 4) is used on at most one phrase per heading, always the outcome word ("deductions", "back", "yours"). Never for a whole heading, never in body copy.
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
| Role | Family | Files / loader | Why |
|---|---|---|---|
| Primary (titles, body, UI) | **Geist** (variable 100–900) | `next/font/google` → `--font-geist` | Closest free match to Fruitful's PP Neue Montreal: neutral neo-grotesk, tight apertures, excellent medium weight. OFL. |
| Mono (eyebrows, labels, figures in UI chrome) | **Geist Mono** (variable) | `next/font/google` → `--font-geist-mono` | Different uses a mono (PP Fraktion Mono) for small labels; Roma's site already uses mono for eyebrows. Same family as Geist = optical harmony. |
| Serif accent | **Source Serif 4 Medium (36pt optical)** | `next/font/local` → `app/fonts/SourceSerif4-Medium.woff2` → `--font-serif` | The exact serif Fruitful pairs with its grotesk (file supplied in the Fruitful reference). OFL. Only weight: 500, upright. |

There is **no italic**. Emphasis in headings = serif accent, never faux italic.
Font swap: everything references `--font-sans`, `--font-mono`, `--font-serif`; replacing a family is a one-line change in `app/layout.tsx`.

### C.2 Weights
| Weight | Use |
|---|---|
| 400 | Body copy, leads, hero headline (display sizes look heavy at 500 in Geist). |
| 500 | Section headings (h2–h5), buttons, nav, UI labels, figures. (Fruitful's title weight.) |
| 600 | Product-UI numbers only (amount emphasis). Never in marketing headings. |

### C.3 Fluid root (from Different AI)
`html { font-size: 16px }` below 992px. From 992–1440px: `font-size: clamp(14px, 1.1111vw, 16px)` → the whole rem-based layout scales with the 1440 design width; above 1440 it stays 16px. All type and spacing are in **rem** so they scale together. Exceptions in `px`: borders, focus rings, shadows.

### C.4 Type scale
Sizes are `desktop / tablet (≤991) / mobile (≤767)`. Line-height (LH) and letter-spacing (LS) are constant across breakpoints unless noted.

| Token | Size | LH | LS | Weight | Family | Use |
|---|---|---|---|---|---|---|
| `display` | 5.5 / 4 / 2.75rem | 0.98 | −0.045em | 400 | sans | Hero H1 only. |
| `h1` | 4 / 3.25 / 2.5rem | 1.0 | −0.04em | 500 | sans | Page titles (non-home). |
| `h2` | 3.25 / 2.5 / 2rem | 1.05 | −0.035em | 500 | sans | Section statements (e.g. feature pinned statement). |
| `h3` | 2.5 / 2 / 1.75rem | 1.1 | −0.03em | 500 | sans | Column headings. |
| `h4` | 1.75 / 1.5 / 1.375rem | 1.2 | −0.02em | 500 | sans | Card titles. |
| `h5` | 1.375 / 1.25 / 1.125rem | 1.25 | −0.015em | 500 | sans | Step titles, small headings. |
| `lead` | 1.25 / 1.125 / 1.0625rem | 1.4 | −0.01em | 400 | sans | Hero lead, section intros. Max 34ch–38rem. |
| `statement` | 2.75 / 2.25 / 1.75rem | 1.2 | −0.03em | 500 | sans | Brand statement paragraph (G.1b) only. Max-width 56rem, centred. |
| `body` | 1.0625 / 1 / 1rem | 1.5 | −0.005em | 400 | sans | Paragraphs. Max line length 64ch. |
| `small` | 0.9375rem | 1.45 | 0 | 400 | sans | Secondary text, step descriptions. |
| `label` | 0.75rem | 1.2 | 0.08em, UPPERCASE | 500 | mono | Eyebrows, pill labels, table headers. |
| `button` | 0.9375rem | 1.25 | −0.01em | 500 | sans | All buttons. |
| `nav` | 1rem | 1.4 | −0.01em | 400 | sans | Nav links. |

**Serif accent rule:** inside any heading, wrap the accent phrase in `<Accent>` → `font-family: var(--font-serif); font-weight: 500; letter-spacing: -0.03em; font-size: 1.04em` (optical match: Source Serif has a smaller x-height than Geist). One per heading.

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
`label` token (mono, 12px, uppercase, 0.08em). Colour ink-500 on light, `on-dark-muted` on dark. Optional 6px square bullet in red-600 before the text. Use sparingly — only where a section needs a category name.

### E.5 Section headings
Structure: optional eyebrow → heading (h2/h3) with ≤ 1 serif accent → optional lead. Alignment: centred for statements, left for column content. Heading max-width: 20ch (h2) / 16ch (h3).

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
- **Hero sequence** (on load, t in s): bg scale 1.06→1 (0–1.2, `--ease-out`); announce pill fade/y8 (0.15); H1 words in from `y .45em, blur 8px, opacity 0` → 0, 900ms `power3.out`, stagger 70ms (0.25); serif accent "lean" — skewX 16°→0 over 1.1s `power3.inOut` + rise yPercent 35→0 0.9s `expo.out` (starts with its word); lead (0.65); actions (0.8).

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
- No product frame in the hero (removed 12 Nov at the team's request). The hero ends on the art; the trust strip follows on cream.
- Copy block: `--container-sm` (50.75rem), centred, `text-align:center`. Internal gaps (Different): announce → H1 `3rem` (2rem mobile); H1 → lead `1.5rem`; lead → actions `2rem`.


**Content hierarchy**
1. Nav (transparent): Roma logo rendered fully white on the hero (`filter: brightness(0) invert(1)` — the red rosette disappears into red art; normal colours once solid), links "Deduction management · Analytics · Accounting · Pricing", right: "Log in" link + `inverse` button "Book a demo".
2. Announcement pill: "Good Day Chocolate recovered $53K in deductions →" (PDF proof point, quotable).
3. H1 (`display`), rotating every 3.6s between two lines (first line is the SSR/SEO line):
   - "Stop writing off ⟨deductions⟩."
   - "Get back what UNFI and KeHE ⟨owe you⟩."
4. Lead (`lead`, on-dark-muted, max 36rem): "Roma pulls every deduction from your distributor and retailer portals, matches it to your invoices and promos, and helps you dispute the invalid ones. Live in 5 minutes. No ERP or IT project."
5. Actions: `inverse` "Book a demo →" + white `ArrowLink` "See how it works" (scrolls to feature section).

**Colour:** image + `--overlay-hero`; all text white; accent words white (serif carries emphasis, not colour).

**Assets:** `public/images/hero/placeholder-balloons-{1080,2000}.webp` (placeholder), `public/brand/roma-logo.png`.

**Animation**
- Load sequence: F.4 hero sequence.
- Headline rotation (Different `__dfxHeadline`): hold 3.6s → words out (`y −.35em, opacity 0, blur 6px`, 500ms `power2.in`, stagger 40ms) → swap → words in (`y .45em, blur 8px` → 0, 900ms `power3.out`, stagger 70ms) → hold. Heading `min-height` locked to the taller line (re-measured on resize) so nothing below moves. Paused when hero is off-screen or tab hidden. `aria-label` on the H1 holds the first line; rotating spans are `aria-hidden`.
- **Spring rig (pattern kept for future use):** Different's balloon technique — scroll target `pT`, exponentially smoothed `pS += (pT − pS)·(1 − e^(−6·dt))`, damped springs (`k≈22, c≈6`), idle float fading as `calm = 1 − clamp(pS·4)`, rAF stops when settled. Not used in the hero today.
- Background: no parallax (keeps LCP stable); only the load settle.

**Interaction:** Announce pill links to the case study (`#` placeholder). Nav states (150ms colour transition): at top → transparent; scrolled inside the hero (`scrollY > 8`) → solid `red-950` so copy never runs under white nav text; past the hero (`scrollY > heroH − 72`) → solid cream-50, hairline sand-300, ink text, normal logo.

**Headline wrap:** greedy wrapping inside `max-width: 46rem` (not `balance`) so line 1 breaks as "Stop writing off / deductions." Both rotating lines are stacked in one CSS grid cell, so the H1 is always the height of the taller line (no JS height lock needed).

**Responsive**
- Tablet: display 4rem; lead 1.125rem; actions inline.
- Mobile: display 2.75rem, line breaks balanced; announce text shortens to "Good Day Chocolate recovered $53K →"; actions stack full-width ≤ 479px; nav collapses to logo + menu button (full-screen cream sheet with links + primary CTA).

### G.1b Brand statement (after the hero)

**Purpose:** One central sentence block that says what Roma does — problem, cost, fix — before any proof. Read slowly, revealed in reading order.

**Copy** (`lib/content/site.ts` → `statement`): "Every month, UNFI, KeHE and your retailers quietly take ⟨2–3% of your revenue⟩. Many deductions are invalid, but nobody has time to check, so they get ⟨written off⟩. Roma matches ⟨every deduction⟩ to your invoices and promos, so you can ⟨get back what’s yours⟩."
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
       └ div.layout        --container-md, flex row, gap 4rem, align center
          ├ div.column     flex 1  (progress rail, h3, steps, channel card)
          └ div.visual     flex 1, height 75vh, max-height 46rem  (app panel + caption)
```

**Content** (copy lives in `components/sections/feature/data.ts`)
- Statement (`h2`, centred, break after "yours."): "Your distributors are keeping money that's ⟨yours⟩. Let's get it back." (Tone-of-voice line from the PDF, verbatim.) Split into characters for the highlight.
- Column (Fruitful structure: top copy + scenario card, progress rail on the left):
  - `h3`: "Nothing gets written off ⟨by default⟩." (from the PDF's approved recovery line)
  - Body (ink-600, 1rem/1.5): "Roma connects to your distributor and retailer portals, pulls every deduction and matches it to your invoices and promo agreements. You see what was taken, why, and what's recoverable — then dispute the invalid ones from one place."
  - Channel card (white, E.6): "Built for how you sell." / "Pick a channel to see its deductions." + 2×2 tabs **UNFI · KeHE · Target · Walmart** (the four remittance sources the FAQ names). Icon well 2.25rem with the channel initial (mono), check badge on active. "Keep scrolling ↓" hint sits 1.5rem under the card.
- Pull → Match → Recover is told by the panel itself: its sub-line crossfades "Every deduction this quarter" → "Matched to invoices & promos" → "Disputed & recovered".
- Caption under panel (12px, ink-500): "Illustrative data. Not a guarantee of recovery." (PDF guardrail: never promise recovery amounts.)

**App panel (HTML-built product UI, not an image)**
- Device: a **phone**, Fruitful's proportions — body `aspect-ratio 214.48/449.16`, bezel `#1C1C1E` with radius `16.45% / 7.85%`; screen aperture inset `3.18% / 1.52%`, size `93.63% × 96.96%`, radius `14.73% / 6.79%`. Behind it, a phone-shaped layer casts a long, soft shadow toward the lower right (stacked warm-ink box-shadows, light from upper-left). Height `min(78vh, 50rem)` desktop · `min(68vh, 42rem)` tablet · `min(58svh, 32rem)` mobile.
- Screen authored in design units on a **400 × 868** canvas (fits the aperture exactly; all coordinates are constants in `data.ts`); `--u = 100cqw / 400` (container query units, Fruitful technique), so every value below is copied as-is: `calc(var(--u) * N)`.
- Screen bg `#F5F3EF`. In-screen type follows Fruitful's phone scale (UI 14–16u, figures 17–19u, serif headline 38u, figure 40u) so it stays legible at phone width.
- Head at y=40: red rosette 24u, serif headline 38u/500/−0.045em "Where your ⟨channel⟩ money went"; sub-line 16u/500 crossfades "Every deduction this quarter" → "Matched to invoices & promos" → "Disputed & recovered".
- **Screen 1 — Pull** (system diagram, Fruitful screen 1): remittance pill (dark, 150×58u at (125,150)) "Deducted this quarter / $48,210" → 12u stem → Roma badge (44u red square, white rosette, at (178,250)) → three 12u routes (cubic, vertical tangents) → three category bars (w 112u, gap 14u, x 18/144/270, bottom 500u, heights ∝ amounts, min 90u) with amount + label.
- **Screen 2 — Match** (Fruitful band hand-off): bars strip (routes/badge/text fade 0.18s), then each bar's box grows **vertically** (0.29s `power2.inOut`) then **horizontally** to full width (0.27s `power1.inOut`) into a band that *clips* its content — nothing scales. Inside each band: category label pill (left) and deduction tiles (right, 230×62u): name + amount, then a chip that wipes in (`clip-path inset 0 100% → 0`, 0.36s): green "Matched · Promo Q3-07" or red "Recoverable · $1,240".
- **Screen 3 — Recover**: bands fade (0.25s); recovery panel builds: "Recovered so far" + figure (serif 40u, counts up), area chart (path drawn with DrawSVG 0.9s, area fades in), 3 dispute rows (status chips: Filed / In review / Credited) sliding in from x −6%, stagger .08.
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

- **Compliance** (`components/sections/compliance`): runroma.com's security section in Roma tokens — h2 with serif accent, ISO 27001 / SOC 2 badges (`public/images/compliance`), joined three-cell pillar strip (solid white, no glass). No binary-pattern background (dropped by request).
- **Customer stories** (`components/sections/stories`): Hyperline Testimonials port — two-column header, card row with `flex-grow` 3:1 (500ms `--ease-out`), stacked 88/420px strips below 1024px, white logo masks, quote box below.
- **MOCK — replace before launch:** all three quotes, the Smash Kitchen / Mochidoki attributions, the photos (Unsplash-licensed stand-ins in `public/images/stories`, credits in `stories/data.ts`), "Customer stories" / story links (`#`). The compliance claims come from runroma.com, not the positioning PDF — confirm before launch.

### G.6 FAQ (reference: Fruitful faq.js + initHeadlines)

- `components/sections/faq`: copy verbatim from runroma.com. An opaque cream-50 sheet (`radius 2.5rem`, 1.25rem on mobile) rides up over the fixed red backdrop; its bottom corners sit on the closing CTA (Fruitful `.is--page__end`).
- Motion (Fruitful values): heading lines and each item rise in with `yPercent 50, rotate 3 → 0`, 0.5s `back.out(3)` at `top 80%`, reset when scrolled back below the viewport. Answers open to `height:auto` 0.45s `back.out(1.7)`, close 0.3s `power4.out`; chevron flips 180°. Closed answers are `inert`.
- Items: cream-200, `--radius-sm`, toggle padding `1.25rem 3rem` (1.25rem mobile), list max 63.5rem, gap .75rem.
### G.7 Closing CTA (reference: Hyperline PreFooterCta)

- `components/sections/closing`: full-bleed band, type and background only (no product imagery). Layers: ink-900 base → Hyperline's blurred amber texture (`public/images/cta/texture-bg.webp`, cover) → Hyperline scrim `linear-gradient(180deg, rgba(42,38,32,.55) 0%, transparent 42%)` → Roma fade into ink-900 (black) at the bottom (no seam into the footer). Tucks under the FAQ sheet (`margin-top: -2.5rem`).
- Copy (runroma.com): "Visibility over every *dollar*." / "See Roma in action. 5 minutes. No commitment." / white pill "Book a demo". One-shot reveal (16px, 0.5s, 90ms stagger).

### G.8 Footer + wordmark (reference: Hyperline footer)

- `components/layout/Footer.tsx`: black (ink-900) continues from the CTA. Link grid 2 → 3 (640px) → 6-column track (1024px); headings 0.875rem/500 white, links 0.875rem on-dark-muted → white on hover (150ms). Bottom row: tagline + copyright at 50% white. Links and copy from runroma.com (`lib/content/site.ts → footer`).
- `components/layout/Wordmark.tsx`: oversized "roma" in Fraunces 800 (cream-50 on black, −0.035em), the "o" is the rosette as an inline SVG in red-600. JS fits the word to the container width and clips it to **65% of the x-height** (measured from the rosette, which is exactly 1ex); the rest runs off the bottom of the page. One-shot rise on entry.

### G.9 "How Roma works" page (`/platform`, references: Hyperline capability hero + billing grid)

Route `app/platform/page.tsx`; sections in `components/platform/*`; all copy and illustrative data in `lib/content/platform.ts`. Order: hero → capabilities 2×2 → coverage → modules tabs → why Roma → proof → compliance → FAQ → closing CTA (with a secondary "Try now").

- **Framing (client decision, Nov 2026):** the page is "How Roma works". "Platform" is the URL only, never a headline.
- **Tone rule for retailers/distributors (client decision):** name them only as channels or portals (UNFI, KeHE, Target, Walmart, Costco, Kroger, Whole Foods, Amazon). Never imply wrongdoing ("took", "keeping", "owe you"); deductions are "invalid" or "recoverable". Names are set as type, never as retailer logos.
- **CTAs:** "Book a demo →" (`DEMO_HREF`) + "Try now" → `https://app.runroma.com/signup` (ghost on dark). No pricing on the page.
- **Hero:** red-950 band with `[data-hero]` (drives the nav states). `container-lg`; title row is 2 columns ≥992px (pill + `type-h1` left; lead + CTAs right), stacked below. The page's one pill (§E.3) is a static label with a book icon. Below: a `--radius-xl` card whose ground is `public/images/cta/texture-bg.webp` (an image, not a gradient, §A.8), a translucent white frame (no blur), and an HTML deductions inbox window (`--radius-lg` top corners, `--shadow-raise`) sitting flush on the card's bottom edge. The window is rem-based and drops columns with container queries (56 / 46 / 30 / 22rem). Load: pill → words (70ms) → lead → actions → card (y 36, 1.1s) → rows (80ms) → each status settles from "Reviewing" to Matched / Recoverable.
- **Illustrations below the hero** follow the home machine cards: wells tinted with `--well-warm` / `--well-neutral` (fade to white into the card), raised "paper" objects (white, sand-300 hairline, a soft two-layer warm shadow scaled in `--u`), tilt and layering, initial avatars, mono labels, a bottom scrim. Canvases: capabilities 560 × 420, modules 640 × 480, `--u = 100cqw / W`. Each plays one state change once on enter; capability cards replay it on hover once finished, and their layered objects fan out or straighten (transform only, no scale on the card).
- **Modules:** one white card, well left and tabs right ≥992px (rail = red-600 3px, mono numbers), wrapped pill tabs below. ARIA tablist with arrow / Home / End keys; no autoplay; 300ms cross-fade then the panel's state timeline. Pointer interactions inside the art: reason-code options highlight, each analytics bar shows its own tooltip (first by default), remittance rows highlight and their GL code turns green.
- **Why Roma:** the §E.11 numbered block, used for real: sticky heading left, ledger rows right; rows rest at .4 and the one at the reading line is full and nudged 1rem.
- **Proof:** PDF figures only ($53K, $23K, 25 brands) in red-600, count-up once; caption "Results vary by brand. Not a guarantee of recovery."
- Every illustration carries "Illustrative data. Not a guarantee of recovery."
- **Client navigation:** with Cache Components the previous route stays in the DOM hidden, so document-wide queries use `queryVisible` / `queryAllVisible` (`lib/motion.ts`), and effects must fully reset inline styles in cleanup.

### G.10 Blog (`/blogs`, `/blogs/[slug]`, reference: Vodex `/resources/blog`, adapted)

Routes `app/blogs/page.tsx` and `app/blogs/[slug]/page.tsx` (prerendered via `generateStaticParams`; unknown slugs call `notFound()`, since `dynamicParams` is unavailable with Cache Components); components in `components/blog/*`; every post, author and image credit in `lib/content/blog.ts` (typed blocks, no MDX). Same tone rule as G.9 for retailers and distributors, same banned copy (§A.8), PDF-approved proof only ($53K Good Day Chocolate, $23K Smash Kitchen, 25 brands).

- **Editorial photography (exception to §A.6.3, blog only, client decision Nov 2026):** article covers and in-body figures may use warm, documentary photography (shelves, warehouses, paperwork, founders at work). No people posed at the camera, no visible third-party UI, no filters or gradient overlays. Covers 3:2, 2000w WebP; body photos 1600w. Product-UI figures inside articles still follow §A.6.3 and carry the "Illustrative data" caption.
- **Listing:** hero (red-950, `[data-hero]`, PlatformHero composition: pill → `type-h1` with one accent → lead → topic list as mono labels with 6px red square bullets; no CTAs) → featured card → "Latest" grid sheet → closing CTA. No category filter or search until there are more than ~9 posts.
- **Featured card:** one white card, sand-300 border, `--radius-lg`; ≥992px a `1.15fr 1fr` split, image left (fills the row, min 3:2), body padded 3rem; stacked below 992px.
- **Post card:** §E.6 card with the image flush on top (3:2, top corners follow the card radius), body padding 1.5rem (1.25rem mobile): category label → `type-h5` title → excerpt (3-line clamp, ink-600, small) → meta row pinned to the bottom (`margin-top: auto`, tabular-nums). Whole card is one link (title `::after` inset 0). Grid: 3 columns ≥992px, 2 ≥768px (odd last card centred at column width), 1 below; gap 1.5rem.
- **Hover (strict §F.7):** border sand-300 → sand-400 (150ms), title underline swipe (§E.2 mechanics), arrow nudge `translate(3px,-3px)`. No image zoom, no lift, no shadow.
- **Article header:** red-950 `[data-hero]` band: "All articles" back link → meta label (category · date · read time) → `type-h1` (max 18ch) → lead (on-dark-muted, max 38rem) → author (initials monogram 2.5rem, cream-200 on red-800). The cover (`--radius-lg`, 3:2 below 992px, 2:1 at ≥992px) straddles the band: the band ends halfway down the image (computed with container query units on the header).
- **Article body:** 2 columns ≥992px (`13rem` sticky table of contents at `top: calc(var(--nav-h) + 2rem)`, gap 5rem), single column below. Measure max 64ch. h2 = `type-h4` (margin-top 3rem, `scroll-margin-top: calc(var(--nav-h) + 1.5rem)`), h3 = `type-h5` (2rem); paragraphs body token in ink-800 at line-height 1.6 (long-form reading), 1.25rem apart, `text-wrap: pretty`; lists with 6px red-600 square bullets; quote = 2px red-600 rule, `type-h5` weight 400; callout = §E.6 card on white with a mono label; photo figure `--radius-md` with a small ink-500 caption; tables in a bordered `--radius-sm` frame, hairline rows, tabular-nums, horizontal scroll on narrow screens.
- **Table of contents:** "On this page" label; links small ink-600; active link ink-900 with a 2px red-600 left rule and `aria-current="location"`. Active section is computed with a rAF-throttled scroll listener (heading top ≤ nav height + 2rem), not IntersectionObserver.
- **Reading progress:** a 2px red-600 bar fixed under the nav, `scaleX` 0 → 1 across the article body (origin left). Explains a state (§A.6.4); not shown under reduced motion.
- **Motion:** header uses the G.9 hero load sequence (words 70ms); featured card, grid cards (80ms stagger), article figures and h2s use the one-shot `rise` (16px, 0.5s) from `components/platform/motion.ts`. SSR markup is the final state.
- **After the article:** author card (§E.6, monogram + name + role + one-line bio) → "Keep reading" grid sheet (3 posts, same category first) → closing CTA.
- **Navigation:** "Blog" lives in the footer Resources column only.

---

## H. Responsive design summary

| Element | Large desktop ≥1440 | Desktop 992–1439 | Tablet 768–991 | Mobile ≤767 |
|---|---|---|---|---|
| Root size | 16px fixed | `clamp(14px,1.111vw,16px)` | 16px | 16px |
| Nav | 89px, full links | same | links → menu at <992 | 72px, menu sheet |
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
  fonts/                local font files (Source Serif 4)
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
- **Pre-paint guard:** an inline `<head>` script adds `html.js-motion` (unless reduced motion). Under it, `[data-anim]` elements start at `opacity:0` so server HTML never flashes before GSAP sets start states; a CSS fallback reveals them after 4s if JS never runs. The hero adds `html.motion-ready` the moment GSAP takes over, which turns the fallback off so it can't override inline styles. Only put `data-anim` on elements a script will animate in.
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
