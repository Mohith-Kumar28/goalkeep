# Goalkeep — Design System & Brand Guidelines

Extracted from the shipped homepage (`v5.0-draft`). Every value below is what the
site actually uses today. The source of truth is code, not this file:

| What | Where |
|---|---|
| All tokens (colour, type, space, radius, shadow, motion) | `src/styles/tokens.css` |
| Type roles, grounds, highlighter, surfaces, image dissolves | `src/styles.css` |
| Buttons | `src/components/primitives/gk-button.tsx` |
| Highlighter | `src/components/primitives/marker.tsx`, `marker-text.tsx` |
| Hand-drawn marks | `src/components/primitives/doodles.tsx` |
| Logo arcs / shape layer / mark assembly | `src/components/primitives/logo-shapes.tsx` |
| Wordmark | `src/components/layout/wordmark.tsx`, `public/wordmark-*.webp`, `public/goalkeep-icon.png` |
| Homepage band order | `src/routes/index.tsx` |
| Audits | `scripts/check-palette.mjs`, `scripts/check-contrast.mjs` (`pnpm check:design`) |

**Rule zero: reference the token, never the hex.**

---

## 1. Brand character

Goalkeep is a data consultancy for the social sector. Its work decides whether a
nonprofit gets funded, so the site reads **formal first, human second**.

- **Formal structure:** navy and white grounds, rectangular buttons, one quiet
  surface treatment, restrained type weights.
- **A human hand on top:** handwriting (Caveat), a real highlighter stroke, and
  hand-drawn circles/underlines — the three things the client explicitly liked.
- **Never:** "young media agency", full-chroma colour, black outlines, hard
  offset shadows, pill buttons, bouncy hovers, boxed photographs.

---

## 2. Logo

| Asset | File | Use |
|---|---|---|
| Wordmark, dark letters | `public/wordmark-ink.webp` (673×160) | On light grounds |
| Wordmark, white letters | `public/wordmark-white.webp` | On navy |
| Icon (the `g` ring) | `public/goalkeep-icon.png` | Favicon, app icon, OG |

- Wordmark height: `h-8` (32px), `md:h-9` (36px) in the header.
- The ring keeps its own colours in both versions; only the letters change.
- **The mark:** a *closed* ring of five round-capped arcs plus a smile beneath.
  Stroke = 13.8% of the diameter. Spans: 71.5° / 68° / 71° / 77.5° / 72°.

### Mark colours (logo only — never UI accents)

| Token | Hex | Note |
|---|---|---|
| `--mark-yellow` | `#E8E724` | |
| `--mark-ink` | `#3F3D3D` | Becomes white on dark grounds |
| `--mark-blue` | `#526EB5` | |
| `--mark-teal` | `#79C2B4` | |
| `--mark-coral` | `#EE9D90` | |

These are deliberately louder than the site palette. Use them **only** where the
logo itself is drawn (e.g. `<MarkAssembly>` in the closing band).

---

## 3. Colour

### 3.1 Grounds — navy and white carry the page

| Token | Hex | Role |
|---|---|---|
| `--gk-navy` | `#2F4A92` | Dominant dark surface (hero, proof, closing) |
| `--gk-navy-deep` | `#1E3266` | Pressed / darkest well, primary hover |
| `--gk-navy-lift` | `#3D5AA8` | A card raised off navy; tonal hero arcs |
| `--gk-white` | `#FFFFFF` | Cards |
| `--gk-cream` | `#FCFCFD` | The light page ground (white to the eye) |
| `--gk-cream-deep` | `#F1F4FA` | Light-blue highlight band, sunken areas |
| `--gk-ink` | `#14131A` | Near-black. **The only dark text colour.** |

### 3.2 Accent hues (muted, off full chroma)

| Hue | Base | `-deep` (hover) | `-ink` (small text on white) | `-tint` (band/chip wash) | `-lift` (on navy only) |
|---|---|---|---|---|---|
| Blue | `#3F63C8` | `#2F4D9F` | — (use `-deep`) | `#EAEFF9` | `#8FA8E8` |
| Teal | `#2F9C8F` | `#237A70` | `#176059` | `#E7F2F0` | `#5FC9BA` |
| Coral | `#E07A5F` | `#C8613F` | `#9C452A` | `#FBEEE9` | `#F0A58C` |
| Yellow (gold) | `#EAC452` | `#CFA72F` | `#7D5E0C` | `#FBF3DF` | — |

### 3.3 Neutrals & hand-mark colours

| Token | Hex | Role |
|---|---|---|
| `--gk-beige` | `#F7F5EF` | "Why we exist" ground; case-study sector label |
| `--gk-beige-deep` | `#ECE6D8` | |
| `--gk-scribble` | `#F6D83A` | Every hand mark: circle, underline, emphasis burst |
| `--gk-highlight` | `#FCF0A5` | Highlighter body |
| `--gk-highlight-end` | `#F7DB63` | Highlighter's darker ends |

### 3.4 Semantic tokens

| Token | Value |
|---|---|
| `--fg-1` | `--gk-ink` |
| `--fg-2` | `rgb(20 19 26 / 0.72)` — ink at 72% |
| `--fg-inverse` | white |
| `--fg-inverse-2` | `rgb(255 255 255 / 0.76)` |
| `--bg-page` / `--bg-card` / `--bg-sunken` / `--bg-inverse` | cream / white / cream-deep / navy |
| `--hairline` | `#E5E7EE` (on white) |
| `--hairline-strong` | `#D3D7E2` (dividers that must be read) |
| `--hairline-inverse` | `rgb(255 255 255 / 0.16)` (on navy) |

### 3.5 Colour rules (enforced by the audits)

1. **No grey text token and no neutral ramp.** Text is ink or white; anything
   softer is an *alpha* of one of those two.
2. **Navy and white are the grounds.** Tints are occasional highlight bands, not
   a third ground.
3. **Gold is a marker, never text on a light ground.** (Hard-banned by
   `check-contrast.mjs`.)
4. **Pop teal/coral are display colours on white only.** On navy use the
   `-lift` values; pop teal/coral under 24px are banned.
5. **Any opaque colour not in the token list fails `check-palette.mjs`** — no
   stray Tailwind defaults.
6. **Focus:** blue halo on light (`--shadow-ring`), gold halo on navy
   (`--shadow-ring-inverse`). Text selection is gold on ink.

### 3.6 Grounds & band accents (how a section gets its colour)

A section picks **one ground class and one accent class**; components read
`--band-*` variables and never name a hue.

| Ground class | Surface | Text | Links |
|---|---|---|---|
| `.ground-navy` | navy | white / white 76% | gold → white on hover |
| `.ground-cream` | cream | ink / ink 72% | blue-deep → navy-deep |
| `.ground-cream-deep` | pale blue | ink / ink 72% | blue-deep → navy-deep |

Accent classes `.accent-blue | -teal | -coral | -yellow` set `--band-accent`,
`--band-accent-deep`, `--band-accent-ink`, `--band-tint`. On navy, the accent
ink becomes a light value (blue → gold).

---

## 4. Typography

**Two families only.** No mono, no serif, no second display face.

| Role | Family | Token |
|---|---|---|
| Everything — display, headings, body, labels, buttons | **Nunito Sans** (variable, with italics) | `--font-sans` / `--font-display` |
| Marginalia, asides, hand notes | **Caveat** (variable) | `--font-hand` |

Loaded via `@fontsource-variable/nunito-sans` (+ `wght-italic.css`) and
`@fontsource-variable/caveat`. Fallbacks: `ui-sans-serif, system-ui` and
`"Bradley Hand", cursive`.

### 4.1 Scale

| Token | rem | px |
|---|---|---|
| `--fs-xs` | 0.8125 | 13 |
| `--fs-sm` | 0.9375 | 15 |
| `--fs-base` | 1.0625 | 17 (body) |
| `--fs-lg` | 1.1875 | 19 |
| `--fs-xl` | 1.375 | 22 |
| `--fs-2xl` | 1.75 | 28 |
| `--fs-3xl` | 2.25 | 36 |
| `--fs-4xl` | 2.875 | 46 |
| `--fs-5xl` | 3.5 | 56 |
| `--fs-hand-sm` / `--fs-hand` / `--fs-hand-lg` | 1.25 / 1.5 / 2 | 20 / 24 / 32 |

Weights: 400 regular · 500 medium · 600 semibold · 700 bold · **800 ceiling**
(never 900).

Line-height: display `1.06`, heading `1.16`, body `1.65`.
Tracking: display `-0.02em`, heading `-0.012em`, labels `+0.09em`.

### 4.2 Type roles (classes in `styles.css`)

| Class | Size | Weight | Notes |
|---|---|---|---|
| `.display` (h1) | `clamp(2.125rem, 4.6vw, 3.5rem)` | **500** | lh 1.06, `text-wrap: balance`, max ~22ch |
| `.h2` | `clamp(1.75rem, 3.2vw, 2.625rem)` | **400** | lh 1.16, max 22–36ch |
| `.h3` | 22px | 700 | lh 1.28 |
| `.lead` | 19px | 400 | lh 1.6, always ink/white |
| body | 17px | 400 | lh 1.65 |
| `.eyebrow` | 13px | 700 | UPPERCASE, +0.09em, band accent ink, 24×2px rule before it |
| `.hand` | 24px Caveat | 600 | lh 1.3 |
| `.hand-lg` | `clamp(1.5rem, 2.4vw, 2rem)` Caveat | 700 | |
| `.stat-figure` | per use | 800 | tabular nums, -0.03em, lh 1 |
| `.chip` | 15px | 700 | 4px radius, tint background |
| Buttons | 15px | 700 | sentence case, +0.005em |

### 4.3 The headline pattern

Headings are set **light**; only the phrase that carries the sentence is in
**bold italic** (`<em>` → italic 800). Emphasis is never a colour or a second
lighter line.

> Enabling social sector organisations to use data to ***scale impact.***
> India's social sector isn't short on data. ***It's short on decisions made with data.***

### 4.4 Copy formatting

- **Sentence case everywhere** — headings, buttons, nav. Eyebrows are written
  lowercase in content and uppercased by CSS.
- Measures: hero lead `46ch`, headings `22–36ch`.
- Hyphenated words are kept unbroken (`white-space: nowrap`).
- Paragraph body on any light ground is ink, never a tint or grey.

---

## 5. Shape, radius, depth

### 5.1 Radius

| Token | Value | Use |
|---|---|---|
| `--r-btn` / `--r-sm` | 4px | Buttons, chips, tabs, focus ring |
| `--r-md` | 8px | Inputs, shadcn default |
| `--r-lg` | 12px | Cards, surfaces |
| `--r-xl` | 16px | Large panels |
| `--r-pill` | 999px | Round icon buttons / carousel arrows only |

### 5.2 Shadows (all soft neutral drops — no hard offsets)

| Token | Value |
|---|---|
| `--shadow-xs` | `0 1px 2px rgb(20 19 26 / .04)` |
| `--shadow-sm` | `+ 0 2px 8px / .05` |
| `--shadow-md` | `0 2px 6px / .05, 0 10px 24px / .07` |
| `--shadow-lg` | `0 4px 12px / .06, 0 22px 48px / .10` |
| `--shadow-navy` | `0 10px 30px rgb(20 30 60 / .28)` |

### 5.3 Surfaces — one treatment

- `.surface`: white, **1px `--hairline`**, `--r-lg`, `--shadow-sm`.
- `.surface-inverse` (on navy): `white / 6%` fill, 1px `--hairline-inverse`.
- `.card-lift` hover: `translateY(-4px)`, `--shadow-lg`, `--hairline-strong`.
- **No black borders, ever.**

---

## 6. Buttons & links

Rectangles, 4px radius, `px-5 py-[0.7rem]`, flat fill. **Hover is a colour step
only** — no translate, no overshoot, no magnetic pull. Optional trailing arrow
(lucide `ArrowRight`, stroke 2.25) nudges 3px on hover.

| Variant | On light | On navy (`onDark`) |
|---|---|---|
| `primary` | navy fill, white text → navy-deep | white fill, navy text → cream-deep |
| `secondary` | white, navy text, hairline-strong border → navy border | transparent, white text, `white/60` border |
| `ghost` | transparent, navy border → navy fill | transparent, `white/40` border |
| `accent` | gold fill, navy-deep text → gold-deep | gold fill → white fill (hero / closing "Talk to us") |
| `tertiary` | `.link-cta` text link | gold → white |

**`.link-cta`** — the text call to action used instead of buttons on cards:
bold, `--link-color`, 1.5px underline (border-bottom), gap widens 8→12px on hover.

---

## 7. Patterns & brand devices

### 7.1 The highlighter (`.marker`, `<Marker>`)

A real marker swipe, not a coloured box. All four are required:

1. **Chisel ends** — CSS `skewX(±4deg)` (so the angle holds at any length).
2. **Wobbling edges** — SVG `mask-image` on a `::before` pseudo-element.
3. **Uneven ink** — darker ends (`--gk-highlight-end`), ink settling along the
   bottom edge.
4. **A degree off horizontal** — `rotate(-0.4deg)` / `0.3deg` (`.marker-b`).

- Default ink: `--gk-highlight` body + `--gk-highlight-end` ends. Text stays ink.
- Overshoots the word: `inset: -0.18em -0.3em -0.14em -0.24em`.
- On navy: `.marker-light` (white swipe, navy text, navy-tinted mottling).
- Wrapped prose: one `.marker-line` per rendered line (`marker-text.tsx`).
- Two stroke shapes (`a`, `b`) so neighbours never look identical.
- Used in: hero typed phrase, audience challenge sentences, "decision" in the
  closing headline.

### 7.2 Hand-drawn marks (`<Scribble>`, `<Annotate>`, `<Emphasis>`, `<MarginNote>`)

- Shapes: `circle`, `oval`, `ring`, `underline`, `underline-double`,
  `underline-swash`, `underline-pair`, `squiggle`, `arrow-curve`, `arrow-hook`,
  `arrow-down`, `bracket`, `star`, `spiral`, `check`, `zigzag`, `cross`.
- Colour: always `--gk-scribble` yellow.
- Round caps/joins, `non-scaling-stroke`, weights 4–7.
- **Deliberately imperfect:** circles don't close, underlines wobble.
- Draw in once on scroll (`pathLength` 0 → 1, 0.9s, `--ease-out`).
- `<Emphasis>`: three tapered strokes fanning out each side of a word.
- `<MarginNote>`: Caveat note rotated −3° with a curved arrow back to its subject.

### 7.3 Logo-arc shape layer (`<ArcPiece>`, `<ShapeField>`)

Every decorative shape is an arc of the logo ring — nothing generic.

- One primitive: a thick round-capped arc on a 100×100 box. Sweep 360 = ring,
  180 = half, ~80–100 = the "comma".
- **Large** (200–440px), **anchored to a corner and bleeding off the edge**,
  never over text, stroke tuned to ≈48px visible weight.
- **Max one coloured piece per light band; two tonal (`--gk-navy-lift`) on the
  hero.**
- Must show curvature and at least one round cap (otherwise it reads as a blob).
- Drifts gently against scroll; hidden below `lg`.
- `<MarkAssembly>` (closing band): the mark's five arcs start scattered and
  assemble on scroll; the only place the whole mark is drawn from parts.

### 7.4 Photography

- Goalkeep's own photography only (`public/photos`, see `CREDITS.md`).
- **Never framed in a box.** Photos dissolve into the ground with masks:
  `.dissolve-r`, `-l`, `-b`, `-rb`, `-soft` (five-stop fades), or
  `.photo-bleed` overlays fading into `--fade-to`.
- The dissolve applies to photographs only, never to drawn illustrations.
- Case-study and card images run flush to card edges.
- Partner logos: greyscale, colour on hover, in a ticker masked 210px each side.

### 7.5 Pointer light (hero only)

`<Spotlight>` (faint band glow) and `<SpotlightCard>` (rim light on the case
card). Purely additive light — nothing moves, scales or tilts.

---

## 8. Layout & spacing

- **Space scale (4pt):** 4, 8, 12, 16, 24, 32, 48, 64, 96, 128px
  (`--sp-1` … `--sp-10`).
- **`.shell`:** max-width 1320px; side padding 16px → 48px (≥768) → 64px (≥1280).
- **`.band`:** vertical padding 64px → 96px (≥768). Tighter bands use
  `py-12 md:py-14`.
- **Grid:** 12 columns at `lg`; hero splits 7 / 5.
- **Section header pattern:** `.eyebrow` (mb 16px) → `.h2` → content.
- **Band rhythm — alternate light and dark:**

| # | Section | Ground |
|---|---|---|
| 1 | Hero | navy (flat, accent yellow) |
| 2 | Partners | white |
| 3 | Why we exist | beige `#F7F5EF` |
| 4 | What we do | white |
| 5 | Whom we do it for | per-audience tint (yellow / teal / coral / blue) |
| 6 | Our approach | white |
| 7 | Proof | navy over photography |
| 8 | Case studies | white |
| 9 | FAQs | yellow tint, no surfaces |
| 10 | Closing | navy |
| 11 | Contact | white |

---

## 9. Motion

| Token | Value | Use |
|---|---|---|
| `--ease-out` | `cubic-bezier(0.22, 1, 0.36, 1)` | All chrome |
| `--ease-pop` | `cubic-bezier(0.34, 1.4, 0.64, 1)` | Only inside the process animations |
| `--dur-fast` | 140ms | Link colour |
| `--dur-base` | 240ms | Buttons, card lift |
| `--dur-slow` | 520ms | Marker reveal |
| `--dur-lazy` | 900ms | Scribble draw-in |

- Nothing overshoots on hover.
- Scroll-triggered reveals play once (`viewport: once`), gated by
  IntersectionObserver so off-screen animations don't run early.
- **Reduced motion:** everything resolves to its final state (typed sentence
  shown whole, scribbles drawn, carousels static, ticker as a grid). Use the
  project's `useReducedMotion` hook, which starts `true`.

---

## 10. Iconography

- **lucide-react**, stroke 2–2.25, sized in `em` (e.g. `size-[1.05em]`) or
  `size-5` in controls.
- Round icon buttons: 44px (`size-11`), 1px `white/40` border on navy.

---

## 11. Do / Don't

| Do | Don't |
|---|---|
| Navy + white grounds, tints as occasional highlights | Full-chroma fills, a third "brand colour" ground |
| Light headings with one bold-italic phrase | 900 weight, colour-as-emphasis, all-caps headlines |
| Nunito Sans + Caveat | Any third family |
| 1px hairline + soft drop | Black borders, hard offset shadows |
| 4px rectangular buttons, colour-step hover | Pills, press-in shadows, bounce |
| Photos dissolving into the ground | Photos in frames / boxes |
| Logo-arc shapes, large, cornered, bleeding | Random circles floating mid-band |
| Yellow highlighter + hand marks for emphasis | Flat rectangles of colour behind text |
| Ink or white text (alphas for softness) | Grey text tokens |
