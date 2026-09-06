import { motion, useScroll, useTransform } from 'motion/react'
import { useRef } from 'react'
import type { CSSProperties } from 'react'
import { cn } from '@/lib/utils'
import { useReducedMotion } from '@/hooks/use-reduced-motion'

/**
 * The mark, taken apart.
 *
 * The `goalkeep` g is a ring broken into four thick round-capped arcs with a
 * gap at the top. Every shape in this file is one of those arcs at a different
 * sweep — a third of the ring, a half, a short lozenge, or the whole circle.
 * Nothing here is a generic blob; if a shape can't be traced back to the
 * wordmark it doesn't belong on the page.
 *
 * This layer was deleted in v3 because the review was blunt about the version
 * of it that shipped in v2: "this random circle over here, this half a circle,
 * this little semicircle — it's not working here, remove it for now. Maybe at
 * the last stage we can figure out how to integrate it."
 *
 * This is that later stage, and the brief for it is the Kickstarter deck:
 * fragments used the way the creatives use them, plus the behaviour asked for
 * on top — "on scroll, one part is coming in and they are getting assembled
 * and forming a shape. Pieces from the logo, instead of using the whole logo."
 *
 * Four rules separate this from the version that got cut:
 *
 *   1. **Large.** The deck's shapes are 200–400px, not confetti. A small
 *      floating semicircle reads as decoration that landed by accident; a
 *      quarter-circle the height of a heading reads as composition.
 *   2. **Anchored and bleeding.** Every shape is pinned to a corner and runs
 *      off the edge. A shape half out of frame is deliberate; the same shape
 *      floating in the middle of a band is the "random circle".
 *   3. **Two per band, maximum**, and never over text — the fields below only
 *      use corners the copy does not reach.
 *   4. **Muted.** The -lift values and the gold, which is the palette the
 *      creatives actually use for these.
 */

/* ── Geometry ──────────────────────────────────────────────────────────────
   One primitive underneath everything: a round-capped arc on a 100×100 box.
   `sweep` of 360 gives the ring, ~60 the lozenge, 180 the half. */

function ArcPiece({
  sweep = 120,
  /** Where the arc starts, degrees clockwise from twelve o'clock. */
  start = 0,
  thickness = 18,
  color,
  className,
  style,
}: {
  sweep?: number
  start?: number
  thickness?: number
  color: string
  className?: string
  style?: CSSProperties
}) {
  const r = 50 - thickness / 2
  const circumference = 2 * Math.PI * r
  const dash = (Math.min(sweep, 359.9) / 360) * circumference

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 100 100"
      className={cn('h-full w-full overflow-visible', className)}
      style={style}
    >
      <circle
        cx="50"
        cy="50"
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={thickness}
        strokeLinecap={sweep >= 359 ? 'butt' : 'round'}
        strokeDasharray={`${dash} ${circumference}`}
        transform={`rotate(${start - 90} 50 50)`}
      />
    </svg>
  )
}

/* ── Corner fields ─────────────────────────────────────────────────────────
   The deck's own composition: a big arc off one corner, a smaller counterpart
   off the opposite one, and at most one solid ring. Positions are given as
   inset values so each shape is anchored to an edge and runs past it. */

type Piece = {
  sweep: number
  start: number
  thickness?: number
  color: string
  size: number
  /** Corner anchor, in px, negative to bleed off the edge. */
  top?: number
  right?: number
  bottom?: number
  left?: number
  /** How far it travels against the scroll across the band, in px. */
  drift: number
}

/*
 * Sizing rule, and the one that matters most: `thickness` is a percentage of
 * the shape's own box, so a big shape at the same percentage gets a monstrous
 * stroke. Every piece below is tuned to land at roughly a 48px stroke however
 * large the shape is — the weight the deck's own arcs carry.
 *
 * Get this wrong and the shape stops reading as an arc and becomes a lump of
 * colour at the edge of the frame, which is precisely the "random semicircle"
 * the review cut. The visible part of a piece has to include real curvature
 * and at least one round cap.
 *
 * `start` is degrees clockwise from twelve o'clock, so a shape anchored to the
 * top-right corner needs its arc drawn in the *bottom-left* of its own box —
 * that is the part still in frame.
 */
const FIELDS: Record<string, Array<Piece>> = {
  /* Hero. Tonal, not coloured: the hero ground is the one place the review
     asked to keep completely quiet, so these read as a lift in the navy
     rather than as shapes. */
  hero: [
    {
      sweep: 132,
      start: 150,
      thickness: 13,
      color: 'var(--gk-navy-lift)',
      size: 380,
      top: -110,
      right: -120,
      drift: 24,
    },
    {
      sweep: 360,
      start: 0,
      thickness: 22,
      color: 'var(--gk-navy-lift)',
      size: 220,
      bottom: -70,
      left: -70,
      drift: -18,
    },
  ],

  /* The pale blue band - the deck arrangement, at deck scale. */
  audiences: [
    {
      sweep: 124,
      start: 158,
      thickness: 17,
      color: 'var(--gk-coral-lift)',
      size: 300,
      top: -80,
      right: -80,
      drift: 30,
    },
    /* The deck puts four shapes on a title slide that carries almost no
       content. This band carries a heading, a tab row, two columns and a
       carousel, so it gets one. A second piece in the bottom-left landed
       behind the carousel's own controls, which is the failure mode the
       review named. */
  ],

  /* Field notes - one lozenge only, the gold comma from the deck.

     A short sweep at a heavy thickness stops reading as an arc and turns into
     a bean: at 56 degrees and a 49px stroke it had no straight run at all. A
     longer, thinner sweep is the deck's actual shape. */
  notes: [
    {
      sweep: 82,
      start: 196,
      thickness: 17,
      color: 'var(--gk-yellow)',
      size: 240,
      top: -58,
      right: -46,
      drift: 20,
    },
  ],
}

/**
 * A band's corner shapes, drifting gently against the scroll.
 *
 * Hidden below `lg`: at phone width there is no gutter for a shape to bleed
 * into, so the same composition lands on top of the copy.
 */
export function ShapeField({
  variant,
  className,
}: {
  variant: keyof typeof FIELDS
  className?: string
}) {
  const reduced = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={cn(
        'pointer-events-none absolute inset-0 hidden select-none overflow-hidden lg:block',
        className,
      )}
    >
      {FIELDS[variant].map((piece, index) => (
        <DriftingPiece
          key={index}
          piece={piece}
          progress={scrollYProgress}
          reduced={reduced}
        />
      ))}
    </div>
  )
}

function DriftingPiece({
  piece,
  progress,
  reduced,
}: {
  piece: Piece
  progress: ReturnType<typeof useScroll>['scrollYProgress']
  reduced: boolean
}) {
  const y = useTransform(progress, [0, 1], [piece.drift, -piece.drift])

  return (
    <motion.div
      className="absolute"
      style={{
        width: piece.size,
        height: piece.size,
        top: piece.top,
        right: piece.right,
        bottom: piece.bottom,
        left: piece.left,
        y: reduced ? 0 : y,
      }}
    >
      <ArcPiece
        sweep={piece.sweep}
        start={piece.start}
        thickness={piece.thickness}
        color={piece.color}
      />
    </motion.div>
  )
}

/* ── The assembly ──────────────────────────────────────────────────────────
   "One part is coming in and they are getting assembled and forming a shape."

   Every number below was sampled out of public/goalkeep-icon.png rather than
   estimated, because the first build of this was estimated and it showed: four
   segments with a gap at the top, in the site's muted palette, that never
   quite met. The real mark is five segments in a *closed* ring plus the smile,
   in the logo's own louder colours, and its stroke is 13.8% of the diameter —
   roughly two-thirds the weight that had been guessed at.

   The other thing the estimate got wrong: `stroke-linecap: round` extends a
   dash by half the stroke width beyond each end. Set the dash to the segment's
   angular span and every neighbour overlaps by about 12 degrees at each joint,
   which is why the ring read as a pile of overlapping lozenges. `arcDash`
   below subtracts that extension, so `start` and `sweep` describe what you
   actually see and adjacent segments meet exactly cap to cap.
   ────────────────────────────────────────────────────────────────────────── */

/* The mark's bounding box in its own units: ring on top, smile beneath. */
const BOX_W = 282
const BOX_H = 428

/** Degrees each segment runs past its neighbour, to close the cap slivers. */
const JOIN_OVERLAP = 5

const RING = { cx: 141, cy: 141, r: 121.5, t: 39 }
const SMILE = { cx: 142, cy: 283.8, r: 124.2, t: 39 }

/** Ring centre as a percentage of the box — the origin every piece spins about. */
const ORIGIN = `${(RING.cx / BOX_W) * 100}% ${(RING.cy / BOX_H) * 100}%`

/**
 * Dash geometry for one segment, compensated for its round caps.
 *
 * `start` and `sweep` are the visible extent, clockwise from twelve o'clock.
 */
function arcDash(start: number, sweep: number, r: number, t: number) {
  const circumference = 2 * Math.PI * r
  // Half a stroke width, expressed as the angle it subtends at radius r.
  const cap = (t / 2 / r) * (180 / Math.PI)
  /* Two round caps meeting exactly tangentially still leave a lens-shaped
     sliver of ground at the inner and outer edges of the joint, because they
     only touch at the mid-radius. The icon closes those by letting neighbours
     overlap a few degrees, so one cap sits over the next. */
  const dashSweep = Math.max(sweep - cap * 2 + JOIN_OVERLAP, 0.5)
  return {
    dash: (dashSweep / 360) * circumference,
    circumference,
    rotate: start + cap - JOIN_OVERLAP / 2 - 90,
  }
}

type Segment = {
  /** Visible start, degrees clockwise from twelve. */
  start: number
  /** Visible sweep, degrees. */
  sweep: number
  hue: string
  /** On a dark ground the mark's near-black segment becomes white. */
  hueOnDark?: string
  circle: typeof RING
  /** How far out it starts, in the mark's own units, and how far it tumbles. */
  scatter: number
  spin: number
}

/* Spans measured off the icon: 71.5, 68, 71, 77.5, 72 — they sum to 360, which
   is the point. There is no gap in the mark. */
const SEGMENTS: Array<Segment> = [
  { start: 324.5, sweep: 71.5, hue: 'var(--mark-yellow)', circle: RING, scatter: 150, spin: -120 },
  {
    start: 36,
    sweep: 68,
    hue: 'var(--mark-ink)',
    hueOnDark: 'var(--gk-white)',
    circle: RING,
    scatter: 118,
    spin: 140,
  },
  { start: 104, sweep: 71, hue: 'var(--mark-blue)', circle: RING, scatter: 162, spin: -95 },
  { start: 175, sweep: 77.5, hue: 'var(--mark-teal)', circle: RING, scatter: 132, spin: 128 },
  { start: 252.5, sweep: 72, hue: 'var(--mark-coral)', circle: RING, scatter: 146, spin: -145 },
  {
    start: 122.3,
    sweep: 115.4,
    hue: 'var(--mark-ink)',
    hueOnDark: 'var(--gk-white)',
    circle: SMILE,
    scatter: 175,
    spin: 105,
  },
]

/**
 * The mark, coming back together on scroll.
 *
 * Each fragment owns an overlapping slice of the scroll so they land one at a
 * time. Every slice finishes by 0.82 rather than at 1: the last fragment used
 * to complete only at the very end of the range, so if the reader stopped
 * anywhere short of it — or the range never fully resolved because the band
 * sits near the foot of the page — the mark stayed permanently unfinished.
 * That was the "even after scrolling more it is not completely fulfilling".
 */
export function MarkAssembly({
  size = 300,
  onDark = true,
  className,
}: {
  /** Width of the mark. Height follows the real mark's proportions. */
  size?: number
  onDark?: boolean
  className?: string
}) {
  const reduced = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'center 0.55'],
  })

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={cn('relative', className)}
      style={{ width: size, height: (size / BOX_W) * BOX_H }}
    >
      {SEGMENTS.map((segment, index) => (
        <Fragment
          key={index}
          index={index}
          segment={segment}
          onDark={onDark}
          /* Scatter is authored in the mark's own units, so it scales with the
             mark for free — the 180px instance throws its pieces exactly as
             far, proportionally, as the 300px one. */
          scale={size / BOX_W}
          progress={scrollYProgress}
          reduced={reduced}
        />
      ))}
    </div>
  )
}

function Fragment({
  index,
  segment,
  onDark,
  scale,
  progress,
  reduced,
}: {
  index: number
  segment: Segment
  onDark: boolean
  scale: number
  progress: ReturnType<typeof useScroll>['scrollYProgress']
  reduced: boolean
}) {
  const { circle } = segment
  const { dash, circumference, rotate } = arcDash(
    segment.start,
    segment.sweep,
    circle.r,
    circle.t,
  )

  // Each piece flies out along its own mid-angle, so the mark bursts evenly.
  const mid = ((segment.start + segment.sweep / 2 - 90) * Math.PI) / 180
  const dx = Math.cos(mid) * segment.scatter * scale
  const dy = Math.sin(mid) * segment.scatter * scale

  const from = index * 0.088
  const to = from + 0.38

  const t = useTransform(progress, [from, to], [0, 1], { clamp: true })
  const x = useTransform(t, (v) => dx * (1 - v))
  const y = useTransform(t, (v) => dy * (1 - v))
  const rot = useTransform(t, (v) => segment.spin * (1 - v))
  /* Reaches full strength early in its travel. Fading across the whole
     journey left every fragment washed out for most of it — the yellow
     composited over navy at half opacity reads olive, not gold. */
  const opacity = useTransform(t, [0, 0.22, 0.55], [0, 0.75, 1])

  const stroke = onDark ? (segment.hueOnDark ?? segment.hue) : segment.hue

  const art = (
    <svg
      viewBox={`0 0 ${BOX_W} ${BOX_H}`}
      className="h-full w-full"
      aria-hidden="true"
    >
      <circle
        cx={circle.cx}
        cy={circle.cy}
        r={circle.r}
        fill="none"
        stroke={stroke}
        strokeWidth={circle.t}
        strokeLinecap="round"
        strokeDasharray={`${dash} ${circumference}`}
        transform={`rotate(${rotate} ${circle.cx} ${circle.cy})`}
      />
    </svg>
  )

  if (reduced) return <div className="absolute inset-0">{art}</div>

  return (
    <motion.div
      className="absolute inset-0"
      style={{ x, y, rotate: rot, opacity, transformOrigin: ORIGIN }}
    >
      {art}
    </motion.div>
  )
}
