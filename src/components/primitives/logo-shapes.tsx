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

   Four arcs and the smile start scattered — pushed out along their own radius,
   spun, and faded back — and are pulled into the mark as the band scrolls
   through. Each fragment has its own slice of the scroll, so they arrive one
   at a time rather than snapping into place together.

   The pieces are laid out in their FINAL positions inside a single square box
   and the scatter is applied as a CSS transform on each fragment's wrapper.
   Doing it that way rather than animating SVG transform attributes means the
   transform origin is the ring's centre for free, and motion can drive it off
   a scroll MotionValue without a React render per frame. */

const GAP = 26
const PER = (360 - GAP) / 4

/* All four have to read on navy, which is why this is the -lift blue rather
   than --gk-blue: the pop blue is close enough in value to the ground that the
   fragment disappears into it.

   Scatter distances are kept under ~170px on purpose. Further out and the
   fragments cross into the copy column and over the margin note on their way
   in, which turns the assembly into clutter for the first half of its travel. */
const SEGMENTS = [
  { hue: 'var(--gk-yellow)', scatter: 152, spin: -120 },
  { hue: 'var(--gk-blue-lift)', scatter: 124, spin: 145 },
  { hue: 'var(--gk-teal-lift)', scatter: 166, spin: -95 },
  { hue: 'var(--gk-coral-lift)', scatter: 138, spin: 130 },
]

export function MarkAssembly({
  size = 300,
  className,
}: {
  size?: number
  className?: string
}) {
  const reduced = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    /* Complete well before the band leaves: the mark should be whole while
       the visitor is still reading the section, not as it exits. */
    offset: ['start 0.9', 'center 0.55'],
  })

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={cn('relative', className)}
      style={{ width: size, height: size }}
    >
      {SEGMENTS.map((segment, index) => (
        <Fragment
          key={index}
          index={index}
          segment={segment}
          /* Scatter is authored against a 260px mark and scaled from there.
             Left as a fixed pixel distance, the 180px mobile instance throws
             its fragments almost a full mark-width out, which reads as debris
             rather than as a thing coming apart. */
          scale={size / 260}
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
  scale,
  progress,
  reduced,
}: {
  index: number
  segment: (typeof SEGMENTS)[number]
  scale: number
  progress: ReturnType<typeof useScroll>['scrollYProgress']
  reduced: boolean
}) {
  // Where this arc sits on the finished ring, and therefore which way it flies
  // out: along its own mid-angle, so the mark bursts apart evenly.
  const start = GAP / 2 + index * PER
  const mid = ((start + PER / 2 - 90) * Math.PI) / 180
  const dx = Math.cos(mid) * segment.scatter * scale
  const dy = Math.sin(mid) * segment.scatter * scale

  /* Each fragment owns a quarter of the scroll, overlapping by half, so they
     land in sequence — first, second, third, fourth — rather than together. */
  const from = index * 0.16
  const to = from + 0.52

  const t = useTransform(progress, [from, to], [0, 1], { clamp: true })
  const x = useTransform(t, (v) => dx * (1 - v))
  const y = useTransform(t, (v) => dy * (1 - v))
  const rotate = useTransform(t, (v) => segment.spin * (1 - v))
  const opacity = useTransform(t, [0, 0.35, 1], [0, 0.55, 1])

  if (reduced) {
    return (
      <div className="absolute inset-0">
        <ArcPiece sweep={PER - 8} start={start} thickness={17} color={segment.hue} />
      </div>
    )
  }

  return (
    <motion.div className="absolute inset-0" style={{ x, y, rotate, opacity }}>
      <ArcPiece sweep={PER - 8} start={start} thickness={17} color={segment.hue} />
    </motion.div>
  )
}
