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

## v3 — after the 4 September review

There are three versions of this homepage in the repo, on purpose. The client
asked for that directly ("don't overwrite 1.0 and 2.0 — so we have all the
versions we've been through and can quickly reference them"):

| Version | Where | What it was |
|---|---|---|
| 2.0 | tag `v2.0`, branch `v2.0-draft` | the draft reviewed on 4 September |
| 3.0 | `master` | this one |

### What the review said

v2 acted on the *first* feedback doc — more human, more playful, more depth —
and overshot. The review was unambiguous about it: a young media agency vibe,
formality diluted, fonts clunky, colours too vibrant and popping, the boxed
images amateurish, the buttons too casual, the text screaming. Goalkeep's work
decides whether a nonprofit gets funded, and the page has to read like that.

The instruction was a middle ground, not a reversion: keep the handwriting,
the highlighter and the circling — those were explicitly liked — and put the
formal structure back around them.

### The five changes everything else follows from

1. **Two type families, not four.** "Stick to Nunito Sans for the most part…
   combine Nunito Sans and the handwritten stuff, let's keep it to those two."
   Outfit, Plus Jakarta and the mono are gone and uninstalled. Weight, italics
   and Caveat carry every distinction the extra faces used to. The heading
   weight ceiling dropped 900 → 800 and every display size came down 20–33%.
2. **The palette came off full chroma.** "Use what I've given as the reference
   base… let's not get too funky." Navy and white are the grounds; the pop
   hues are the muted values from the reference creatives; tinted bands are
   occasional highlights. `--gk-teal-lift` and `--gk-coral-lift` exist only
   for use *on* navy, where the muted values drop to ~2.5:1.
3. **No black borders anywhere.** "I don't like the black, man… add a slight
   drop shadow and a lighter version of grey." `.card-pop` — the 2px ink
   outline with a hard offset shadow that was on nearly every surface — is
   deleted. One treatment replaces it: white, 1px hairline, soft neutral drop,
   4px lift on hover.
4. **Buttons are rectangles.** 4px radius, flat fill, hover is a colour step.
   No pill, no press-into-shadow, no magnetic pull.
5. **Images integrate rather than sit in frames.** No photograph on the page
   is in a box any more. The hero card's photo dissolves into its panel; every
   "what we do" row — open *and* closed — bleeds a single full-height image to
   the row edge behind a mask; the case-study and field-note images run flush
   to their card edges.

   Three things were wrong on the first pass and are worth remembering. The
   dissolve was a two-stop ramp crossing from clear to solid in 27% of the
   panel, which reads as a strip of gradient laid *over* a photograph rather
   than the photograph fading out; it is now five stops across the full width.
   Closed rows still showed two small thumbnails side by side, which put the
   boxed look straight back on two of the three rows. And the dissolve was
   applied to the whole panel rather than to the photographs — **it belongs on
   the photographs only.** A photograph is a rectangle of unrelated content and
   needs to stop being one; the sketch is drawn art in the panel's own colours
   that has no edges to begin with, so masking it only dimmed the half of each
   sequence nearest the copy — the design board's first sticky note, the build
   sequence's pie chart. The one piece of the sketch that *is* a full-panel
   rectangle, the design board's own ground, carries a soft edge of its own.

### Section by section

| Section | What changed |
|---|---|
| Hero | Ken Burns and its navy wash removed — flat navy, "like in the marketing materials". The subheader **types and backspaces** through design → build → enable the adoption of, each on a white highlight. Semicircles, rings and the arc lattice deleted. Case-study card is a translucent panel with the photo dissolving into it. |
| Partners | Marks are greyscale, colour on hover. Heading reduced to a small centred label, hand-drawn underline removed, band rules removed, fade mask widened to 210px so neither rail has a visible start or finish. |
| What we do | Three separate cards became **one surface divided by hairlines** ("it's seeming very blocks right now"). The open row inverts to navy rather than to a saturated fill. Both process animations rebuilt to spec — see below. |
| Whom we do it for | Testimonial moved into the empty right column beside the challenge statement, which is both the dead-space fix and what was asked for. "Read the case study" is a text link under it. Tabs are rectangles. Band moved off coral tint onto pale blue. |
| Proof | This is where the hero photography went: "keep this video in some other component's background below." Nothing but four figures sits over it. |
| Case studies | The horizontal rail is **deleted** — it was the scrolling problem reported live in the call. A `overflow-x:auto` region under the pointer eats any trackpad gesture that is slightly off-axis. Replaced with the 10x Impact Labs shape: a full-width lead, a three-up row, and the post-mortem full width again. Every CTA is a text link, not a button. |
| Team | Removed entirely, with its component and content file. |
| Closing | The spinning ring and floating shapes are gone; the band now assembles one element at a time on arrival, which is what was asked for in their place. |
| Share card | `scripts/build-og.mjs` rebuilt on the same system — the review's consistency requirement covers social and newsletter, and the card was the loudest surviving instance of the old look. |

### The two process animations

Both were specced in detail in the call and are built in
`src/components/primitives/phase-animation.tsx`.

- **Design** — a whiteboard: post-its land and are written on, one is peeled
  off and replaced, a data sheet is pinned with a question mark, an arrow is
  drawn, a light bulb lands last.
- **Build** — twelve blocks; nine drop away; the three that remain are ticked;
  each then **morphs into one part of a dashboard** — a pie chart, a bar graph
  and a spreadsheet table. The keepers travel between the two layouts rather
  than being swapped out, so it reads as the same blocks becoming the
  dashboard.
- **Adopt** — parked by the client ("keep it how it is, we'll come back to
  it"), restyled only.

Two bugs found while building these: the photo loop's `setInterval` ran in
parallel with the sketch timeout rather than after it, so the first photograph
faded up over a sequence that was still playing; and the sequence started on
mount, meaning the row that is open by default played its whole animation
several screens above the visitor and had resolved to photographs by the time
anyone scrolled to it. Both fixed — the interval is chained off the timeout,
and the section gates on an IntersectionObserver.

### Rules that are load-bearing

- **There is no grey text token and no neutral ramp.** Text is ink
  (`#14131A`) or white. Anything softer is an *alpha* of one of those two, so
  it can never drift into mud. `check-palette.mjs` skips alpha values, which
  is exactly why this works.
- **Navy and white are the grounds.** Tinted bands are highlights between
  them, not a third ground.
- **The gold is a marker, never an ink on light.** `check-contrast.mjs` hard
  bans it as text on a light ground.
- **The pop teal and coral are display colours on white and unreadable on
  navy.** `--gk-teal-lift` / `--gk-coral-lift` are the on-navy values; the
  audit bans the pop versions under 24px.
- **Nothing overshoots on hover.** `--ease-pop` is still defined but is now
  used only inside the two process animations.

### Type

Two families.

| Role | Face |
|---|---|
| Display, body, subheaders, CTAs | **Nunito Sans** |
| Marginalia, highlights, asides | **Caveat** |

**Section labels** are on their third answer. v1 set them in uppercase mono
("looking very AI manufactured"); v2 in a rotated hand, which pushed the page
further into the register the review pulled back from. They are now small
letterspaced Nunito Sans in the band accent with a short rule in front —
formal and quiet, which leaves the handwriting for the places it was actually
asked for.

### The doodle layer

`src/components/primitives/doodles.tsx` survives the review, reduced. The
handwriting, the circling and the highlighter were the three things named as
working and worth keeping.

- `<Scribble>` — named hand-drawn paths, each drawn in with `stroke-dashoffset`
  on scroll. Every path is deliberately imperfect: the circles don't close, the
  underlines wobble. A geometrically perfect hand-drawn mark reads as a vector
  asset.
- `<Annotate>` — wraps a run of text and draws a mark round it. Pass `nowrap`
  for any non-enclosing mark: an underline drawn under a phrase that has
  wrapped spans the whole two-line box and lands nowhere near the words.

`tilt-card.tsx`, `rotating-highlight.tsx`, `rotating-phrase.tsx` and
`card-rail.tsx` are deleted.

### The shape layer — `logo-shapes.tsx`

v2's `shapes.tsx` was cut outright ("this random circle, this half a circle,
this little semicircle — it's not working here, remove it for now. **Maybe at
the last stage we can figure out how to integrate it.**"). This is that later
stage, briefed against the Kickstarter deck and against one follow-up ask:
*"pieces from the logo instead of the whole logo, and on scroll one part comes
in and they get assembled into a shape."*

Everything in the file is one primitive — a thick round-capped arc on a 100×100
box. Sweep 360 gives the ring, 180 the half, ~80 the deck's gold comma. The
`goalkeep` g *is* a broken ring of four coloured arcs, so nothing here is
invented geometry.

Four rules separate this from the version that got cut, and all four were
learned by getting them wrong first:

1. **`thickness` is a percentage of the shape's own box.** A 460px shape at the
   same percentage as a 200px one gets a 100px stroke and stops being an arc.
   Every piece is tuned to land near a 48px stroke whatever its size.
2. **The visible part must contain curvature and at least one round cap.**
   Anchor a shape so only the fat middle of the stroke is in frame and you have
   rebuilt the blob the review objected to.
3. **`start` is degrees clockwise from twelve.** A shape anchored to the
   top-right corner needs its arc drawn in the *bottom-left* of its own box —
   that is the part still on screen.
4. **One coloured piece per light band**, two tonal ones on the hero. The deck
   runs four shapes on a title slide carrying no content; a band with a
   heading, a tab row, two columns and a carousel gets one. The second piece
   tried in the audiences band landed behind the carousel's own controls.

`<MarkAssembly>` is the payoff: the mark's own pieces start scattered — pushed
out along their own radii, spun and faded — and the scroll pulls them back
together. Each fragment owns an overlapping slice of the scroll so they arrive
one at a time, and scatter is authored in the mark's own units so it scales
with the mark for free. It runs in the closing band, and it is the only place
on the site the whole mark is ever drawn from its parts.

**Every number in it was sampled out of `public/goalkeep-icon.png`, not
estimated.** The first build was estimated and it showed — four segments with a
gap at the top, in the site's muted palette, that never quite met. The real
mark is *five* segments in a **closed** ring plus the smile beneath, its stroke
is 13.8% of the diameter (about two-thirds the weight that had been guessed),
and its spans are 71.5° / 68° / 71° / 77.5° / 72°, which sum to 360 because
there is no gap. The colours are the logo's own and are deliberately louder
than the site palette — they are registered in `check-palette.mjs` as
`--mark-*` tokens with a note that they may only be used where the logo itself
is drawn. The mark's near-black segment becomes white on a dark ground, exactly
as `wordmark-white.webp` does.

Two geometry traps worth keeping written down:

- **`stroke-linecap: round` extends a dash by half the stroke width past each
  end.** Set the dash to a segment's angular span and every neighbour overlaps
  by about 12°, which is why the first ring read as a pile of lozenges.
  `arcDash()` subtracts that extension, so `start` and `sweep` describe what
  you actually see.
- **Two round caps meeting exactly still leave a sliver.** They only touch at
  the mid-radius, so a lens of background shows at the inner and outer edges.
  `JOIN_OVERLAP` runs each segment a few degrees past its neighbour, the way
  the icon does.

Every fragment's slice of the scroll finishes by 0.82 rather than at 1. The
last one used to complete only at the very end of the range, so a reader who
stopped short of it — or a range that never fully resolved because the band
sits near the foot of the page — was left with a mark that never closed.

Fragments are laid out in their *final* positions inside one square box and
scattered with a CSS transform on each wrapper — not by animating SVG
`transform` attributes. That gets the ring's centre as the transform origin for
free and lets motion drive it off a scroll MotionValue without a React render
per frame.

### Band map

| Band | Ground | Notes |
|---|---|---|
| Hero | navy | flat; no photography behind it; two tonal logo fragments |
| Partners | white | greyscale marks, colour on hover |
| What we do | white | one surface, three rows, the open one inverts to navy |
| Whom we do it for | pale blue | the one light-highlight band; the deck's coral arc |
| Proof | navy | four counters over the photography moved down from the hero |
| Case studies | white | lead + three-up + full-width post-mortem |
| FAQs | pale blue | the only band with no surfaces at all |
| Field notes | white | the deck's gold comma |
| Closing | navy | copy assembles one element at a time; the mark assembles from its own arcs on scroll |

### Pointer light — `spotlight.tsx`, `spotlight-card.tsx`

The two pointer-reactive effects on the hero, and the only two on the site.
Both are purely additive light: **nothing moves, scales or tilts.** That is the
constraint, not an accident — the review took the tilt and the magnetic button
pull off this page for being too casual, and a card that leans as you approach
it puts that straight back. What it did single out as working was "the hover
lighting up and the translucent background".

- `<Spotlight>` is the band-wide glow behind the hero. Deliberately faint: at
  its original 0.16 it read as a light being carried around behind the
  headline. You should not be able to say what it is, only that the ground is
  not flat.
- `<SpotlightCard>` lights the case-study card's rim where the pointer is. The
  trick worth knowing: a radial gradient is painted across the whole card and
  then masked down to its 1px rim by compositing two masks — one over the
  content box, one over the border box — and subtracting the first from the
  second. A second, wider, much fainter layer sheens the surface so the card
  reads as catching light rather than as an outline switching on.

Neither is constructed at all under reduced motion, both overlays are
`pointer-events-none` so the card's link stays clickable, and on a touch device
the pointer never enters so they simply never run.

### The highlighter — `marker.tsx`

Every highlighted phrase on the page used to be a flat rectangle of brand
colour behind a word. The brief: *"give a real highlighter effect, like
normally on paper when you highlight — a little bit diagonal, not very clear,
some dark and light spots."*

Four things separate a marker swipe from a rectangle, and it needs all four:

1. **Chisel ends.** A highlighter tip is a wedge, so both ends lean at the same
   angle. Square ends are the biggest tell.
2. **Wobbling edges.** Cut by a `mask-image` rather than drawn, so the text on
   top is untouched and stays crisp.
3. **Uneven ink.** It pools where the pen landed, where it stopped and along
   the bottom edge, and there is one lighter streak where the tip lifted.
4. **A degree off horizontal.**

The mask is on a pseudo-element, never on the element itself — masking the
element masks its text with it. `isolation: isolate` makes the span its own
stacking context so `z-index: -1` reliably lands the ink behind the text and in
front of the band, whatever the ancestors are doing. Two stroke shapes exist so
two markers near each other aren't the same stroke twice.

**The chisel is a CSS `skewX`, not a diagonal in the SVG.** The mask is a
stretched SVG (`preserveAspectRatio: none`), so anything authored as horizontal
distance inside it scales with the element's width. Drawing the chisel into the
path cost a couple of pixels on `decision` and became a wedge wide enough to
clip the first and last letters of `enable the adoption of`. A skew displaces x
by a factor of *height*, so the lean holds the same angle at any phrase length
— which is also how a real chisel tip behaves. The path now runs the full width
of its viewBox with vertical ends, and only the top and bottom wobble is left
in the SVG, where stretching does no harm.

**The stroke needs margin to overshoot into**, particularly on the left. The
marker paints after whatever precedes it, so an overshoot with no margin covers
it — the comma between two highlighted phrases disappeared underneath the
second one.

It runs in three places: the typed phrase in the hero (a white swipe on navy),
the three challenge phrases in the audiences band, and `decision` in the
closing headline.

**`check-contrast.mjs` had to learn about it.** The ink is painted by a
pseudo-element and the audit's DOM sweep cannot see pseudo-elements, so it
walked straight past the swipe to the band behind and would have reported
ink-on-navy for a word sitting on gold. An element carrying `data-marker="on"`
now declares its paint, and the audit reads the *resolved* `--marker-hue`
custom property rather than a hard-coded value, so there is no second place for
the hue to drift.

### Motion

`--ease-out` for everything on the page chrome. 140 / 240 / 520 / 900ms.

Under `prefers-reduced-motion`: the typewriter renders the sentence whole with
all three phrases marked, the Ken Burns holds one frame, the ticker renders as
a static grid, the phase sequences skip to their photographs, carousel autoplay
is never constructed, and scribbles render drawn. `useReducedMotion` starts
`true`, so nothing animates before we have actually asked the browser — use it
rather than motion's own hook, which returns `null` during SSR.

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
