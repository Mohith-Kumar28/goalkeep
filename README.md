# Goalkeep

Marketing site for [Goalkeep](https://goalkeep.net), a data consultancy for the
social sector. This is a ground-up rebuild of the existing WordPress site.

**Shipped so far:** the homepage, production-grade, plus every sitemap route
stubbed with real metadata so navigation resolves.

```bash
pnpm install
pnpm dev            # http://localhost:3000
```

## Stack

TanStack Start (React 19) · Tailwind CSS v4 (CSS-first, no JS config) ·
shadcn/ui on Radix · Motion (scroll reveals only) · Lucide icons ·
self-hosted variable fonts via Fontsource.

## The design system is not decoration

Every value comes from `Goalkeep · Brand Guidelines · v0 · May 2026`.
`src/styles/tokens.css` is the source of truth — the artifact the brand book
calls `colors_and_type.css`. Its instruction is explicit:

> Reference variables — never hex codes — so a future palette tweak is a
> one-line change.

`src/styles.css` bridges those tokens into Tailwind's `@theme` and remaps
shadcn's expected variables (`--background`, `--primary`, `--ring`…) onto
Goalkeep's, rather than fighting them.

Three rules in that file are structural rather than stylistic, because the
brand book states them as absolutes:

- **Fraunces is italic-only and pull-quote-only.** Never body. Only the italic
  axis is even loaded.
- **JetBrains Mono carries tabular numerals by default**, so stacked figures
  align.
- **Yellow is a highlight, never a fill and never text.** It appears exactly
  twice on the homepage, eight bands apart, always with charcoal on top.

### Colour is the system

The page is built as eight colour-blocked bands. Each owns a hue, a tint
surface and its own link treatment, so a section reads as a place rather than
a stretch of scroll:

| Band | Surface | Hue |
|---|---|---|
| Hero | paper | ring motif, yellow keyword |
| Partners | sunken | logos in full colour on hover |
| What we do | white | blue / teal / coral, one per stage |
| Whom we do it for | coral tint | coral |
| Case studies | white | cards cycle all four hues |
| FAQs | yellow tint | yellow |
| Field notes | teal tint | teal |
| Closing | charcoal | ring motif, yellow keyword |

Design, build and adopt each keep the same hue everywhere they appear — the
hero pills, the stage cards, the case-study rail — so colour carries meaning
rather than variety.

### The shape language

`src/components/primitives/shapes.tsx` derives everything from the wordmark's
five-segment donut: `Arc`, `Ring`, `Dot`, `Half`. These are abstractions of
the mark, never reproductions — the lockup itself still only appears in the
header and footer.

Four rules keep them from turning into noise:

1. **Decoration uses the four bright hues only.** Charcoal at low opacity on
   cream reads as dirty grey, not as brand colour.
2. **Never anchor a shape on a clipped corner.** An arc that crosses an
   `overflow-hidden` boundary is cut into a rectangular nub rather than a
   curve — this was the single worst-looking thing on the first colour pass.
   Shapes belong in open space, or centred on a corner so the hidden part is
   exactly a quarter and reads as deliberate layering.
3. **Never let a shape cross text.** Decoration sits clear of the measure.
4. **Desktop only.** Narrow viewports have no margin for shapes to live in
   without landing on the copy.

```bash
pnpm check:design   # brand-palette fidelity + contrast audit
```

`check:palette` fails on any colour that is not in the brand system, which is
how a stray `text-blue-500` or a leftover shadcn default gets caught.

### Contrast

`pnpm check:contrast` enforces the brand book's published WCAG table and two
hard bans: **yellow never carries text**, and **`#6EBFAC` never carries text
under 24px** (it fails on cream — use teal-deep `#4A9C88`).

One deliberate departure is documented in `tokens.css`: the book's rule of
thumb is "500 for secondary text", but `#807E80` reaches only 3.64:1 on our
tinted bands. Since the book also says *"for body copy below 18px, stay
AAA"*, the semantic `--fg-2` maps to neutral-600. The neutral ramp itself is
unchanged.

## Motion

One easing curve, three durations, no exceptions — `cubic-bezier(.22, 1, .36, 1)`
at 140 / 220 / 400ms. The brand book bans spring physics, bounces, hover-scale
and glows, so hovers darken to a `-deep` token and nothing ever scales.

Everything is CSS except scroll reveals, which use Motion configured with the
easing token and never `type: "spring"`.

Under `prefers-reduced-motion` the rotating headline's timers **never
instantiate** (not merely `animation: none`), the marquee renders as a static
wrapped row, reveals are off, and the audience panel swaps instantly.

## Content

All copy lives in `src/content` as typed modules, so it is editable without
touching layout. Claims we could not source carry a `verify` note:

```bash
pnpm verify:report  # regenerates VERIFY.md from the content tree
```

**Read `VERIFY.md` before this goes anywhere near production.** 19 items are
outstanding, the data-privacy FAQ answer needs legal review, and the wordmark
and hero photography are still placeholders — see the briefs in
`src/components/layout/wordmark.tsx` and `src/components/sections/hero.tsx`.

## Checks

```bash
pnpm typecheck
pnpm build
pnpm check:design
```
