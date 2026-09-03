# Goalkeep

Marketing site for Goalkeep, a data consultancy for the social sector.

TanStack Start (React 19, file router) · Tailwind v4 CSS-first · `motion` ·
`rough-notation` · Cloudflare Workers.

```bash
pnpm install
pnpm dev            # http://localhost:3000
pnpm check:design   # palette + contrast audit against the running dev server
pnpm run deploy     # NOT `pnpm deploy` — pnpm reserves that word
```

---

## The v1 redesign, September 2026

v0 was quiet, cool-grey and text-heavy. The client feedback was direct: grey
text isn't working, backgrounds look dull, the fonts are clunky and the mono
looks machine-generated, everything is too flat, and a social-sector site has
to actually show the community it works for.

The most useful thing that came out of acting on it: **the v0 tokens were not
the brand.** They were transcribed from a v0 brand PDF and sat roughly 25%
low on chroma, on a cool `#FAFAFA` paper. Sampling the logo PNG and the
approved Canva creatives directly gave a different, much louder system — and
one the organisation was already using everywhere except its website.

| | v0 token | Sampled from the mark |
|---|---|---|
| Blue | `#4765b3` | `#3666CC` bright · `#2F4A92` navy |
| Teal | `#6ebfac` | `#54BAAE` |
| Coral | `#e6968b` | `#F08A78` |
| Yellow | `#e7dd50` ✓ | `#E4DE0C` |
| Paper | `#FAFAFA` cool grey | `#FAF7F0` warm cream |

The shipped palette is those hues at full chroma. `src/styles/tokens.css` is
the source of truth. Reference the token, never the hex.

### Rules that are load-bearing

- **There is no grey text token and no neutral ramp.** Text is ink
  (`#14131A`) or white. Anything softer is an *alpha* of one of those two, so
  it can never drift into mud. `check-palette.mjs` skips alpha values, which
  is exactly why this works.
- **Navy is a ground, not an accent.** It carries roughly half the page. No
  two navy bands touch except Proof and Case studies, which are one argument.
- **The Single-Accent Viewport Rule is retired.** One accent hue on screen at
  a time, enforced by a neutral band between every coloured one, is what made
  v0 read flat. A band now takes one dominant hue plus up to two supporting
  pops in shapes and doodles.
- **Yellow is a marker, never an ink on light.** It clears 5.9:1 on navy and
  carries the stat figures, the closing line and every hand-drawn stroke. On
  cream it is unreadable and `check-contrast.mjs` hard-bans it there.
- **The pop teal and pop coral are display colours.** Both clear 3:1 on cream
  and neither clears 4.5:1, so `--gk-teal-ink` and `--gk-coral-ink` exist for
  running text and the audit bans the pop versions under 24px.
- **Cards lift and buttons press.** v0 banned hover-scale, springs and
  glows outright. The feedback reversed that in as many words, so
  `--ease-pop` overshoots, `.card-lift` rises 6px, and `.card-pop` is a
  sticker that slides into its own hard shadow.

### Type

Three families. All three replaced.

| Role | Face | Replaced |
|---|---|---|
| Display | **Outfit** | Nunito Sans — "the main header looks clunky" |
| Body | **Plus Jakarta Sans** | Nunito Sans |
| Hand | **Caveat** | JetBrains Mono — "looking very AI manufactured" |

Fraunces went too: with Caveat carrying the personality, a fourth family had
nothing left to do.

**Section labels are handwritten.** The feedback asked for another option for
the `12px uppercase mono +0.12em` eyebrows. They are now Caveat at 28px in the
band's accent hue, rotated 2.5°, often with a doodle arrow pointing into the
heading. A person annotating the page, not a CMS field.

**Stat figures** are Outfit 900 with `tabular-nums` — same alignment as the
mono, none of the terminal.

### The doodle layer

`src/components/primitives/doodles.tsx` is the personality of the redesign.

- `<Scribble>` — fourteen named hand-drawn paths (circle, squiggle, arrows,
  bracket, star, spiral, cross…), each drawn in with `stroke-dashoffset` on
  scroll. Every path is deliberately imperfect: the circles don't close, the
  underlines wobble, the arrows overshoot. A geometrically perfect hand-drawn
  mark reads as a vector asset, which is the exact quality being designed away
  from here.
- `<Annotate>` — wraps a run of text and draws a mark round it. Pass `nowrap`
  for any non-enclosing mark: an underline drawn under a phrase that has
  wrapped spans the whole two-line box and lands nowhere near the words.
- `<FloatingField>` — parallax shapes off the mark: arcs, broken rings, dots,
  the smile. **Positions are constrained to three safe zones**: the strip
  below the sticky header, the band's bottom padding, and just off the left
  and right edges. The shell is 1440px and the viewport often isn't much
  wider, so several sit at a negative offset and bleed off-canvas. A shape
  half out of frame reads as deliberate; the same shape on a CTA reads as a
  bug, which is what the first pass did.
- `<PatternField>` — tiling textures built from the logo's geometry: a
  quarter-arc lattice, a segmented-ring tile, a dot grid.

Everything in that file is `aria-hidden`, `xl:` and up only, and renders fully
drawn under reduced motion rather than disappearing.

### Band map

| Band | Ground | Notes |
|---|---|---|
| Hero | navy | Ken Burns through four real photos under an 0.84 navy wash |
| Partners | cream-deep | full-colour marks, a third larger, heading centred |
| What we do | cream | the interactive one |
| Whom we do it for | coral tint | the longest band; needs its own ground |
| Proof | navy | four counters |
| Case studies | navy | continuous with Proof by design |
| Team | cream | faces |
| FAQs | yellow tint | the only band with no surfaces at all |
| Field notes | cream-deep | |
| Closing | navy | the ending |

### Motion

`--ease-out` for anything travelling, `--ease-pop` (1.56 overshoot) for
anything that responds to a pointer. 140 / 260 / 520 / 900ms.

Under `prefers-reduced-motion`: the Ken Burns holds one frame, the ticker
renders as a static grid, the marker highlights all three phrases at once
instead of rotating, the phase sequences skip to their photographs, carousel
autoplay is never constructed, and scribbles render drawn. `useReducedMotion`
starts `true`, so nothing animates before we have actually asked the browser —
use it rather than motion's own hook, which returns `null` during SSR and
caused a hydration mismatch in `FloatingField`.

---

## Photography

All 26 images are Goalkeep's own, from the brand Drive. The four Unsplash
stand-ins are deleted. The five AI-generated files in those folders were not
used. `public/photos/CREDITS.md` maps every file to its source folder.

---

## The audits

`pnpm check:design` runs both against the dev server. Both currently pass.

- **`check-palette.mjs`** fails on any opaque colour that isn't in the brand
  list. This is what catches a stray `text-blue-500` or a shadcn default.
- **`check-contrast.mjs`** computes real WCAG ratios plus two hard bans
  (yellow on light, pop teal/coral under 24px). It rasterises colours through
  a canvas rather than regex-parsing them — Tailwind v4 emits
  `oklab(0.99 0.00004 0.00002 / 0.8)` for `text-white/80`, and pulling the
  first three numbers out of that reads as near-black and reports
  white-on-navy as a 2.5:1 failure. It also resolves a transparent element's
  backdrop through `data-ground`, which is how the header is checked against
  the navy hero it floats over rather than the cream body behind it.

Both default to `http://localhost:3000`.

---

## Deploy gotchas

- `pnpm run deploy`, not `pnpm deploy` — pnpm reserves the word.
- `@cloudflare/vite-plugin` must come **before** `tanstackStart()` in
  `vite.config.ts`.
- `wrangler.jsonc` `main` points at `@tanstack/react-start/server-entry`.

Live at `https://goalkeep.mohithkumar808.workers.dev`.

## Outstanding

`VERIFY.md` is generated from `src/content` by `pnpm verify:report` — 20 items
need client sign-off, and there is a **Back to Rumit** section in it listing
the four places his feedback needs a decision from him.
