import { motion, useInView, useReducedMotion as useMotionReduced, useScroll, useTransform } from 'motion/react'
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

export function ArcPiece({
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
      sweep: 170,
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

  /* Field notes - the Kickstarter "When the Kickstarter stops" title slide,
     copied on request (28 Sep): a coral ring off the top corner, the yellow
     comma under it, a small blue ring with a tight hole, and a big teal ring
     off the left edge. The deck's own colours, sampled from the
     slide, rather than the site's muted -lift set. The band has more copy
     than the slide, so everything stays in the right-hand third and the
     teal ring peeks out of the left gutter. */
  notes: [
    {
      sweep: 360,
      start: 0,
      thickness: 12,
      color: '#E5A193',
      size: 400,
      top: -260,
      right: -150,
      drift: 22,
    },
    {
      sweep: 100,
      start: 68,
      thickness: 20,
      color: '#E6E85A',
      size: 220,
      top: 10,
      right: 210,
      drift: 34,
    },
    {
      sweep: 360,
      start: 0,
      thickness: 30,
      color: '#5B75BE',
      size: 100,
      top: 160,
      right: 30,
      drift: 16,
    },
    {
      sweep: 360,
      start: 0,
      thickness: 11,
      color: '#8CC4B7',
      size: 440,
      /* 28 Sep: off the centre-left edge rather than rising from the bottom. */
      top: 300,
      left: -330,
      drift: -20,
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

   Geometry fitted to public/goalkeep-icon.png by rendering this mark over it
   and minimising the pixels that differ. The ring is five segments with no
   gap. At every joint the later segment's round cap sits over the end of the
   one before, all the way round, so no stacking order of round-capped strokes
   can draw it: each segment is instead one filled outline with a round cap at
   its start and a matching round notch at its end, and the five tile the ring
   exactly. The smile is round at both ends.
   ────────────────────────────────────────────────────────────────────────── */

const BOX_W = 288.4
const BOX_H = 428.5
const STROKE = 40

type Circle = { cx: number; cy: number; r: number }

const RING: Circle = { cx: 143.2, cy: 141.5, r: 121.5 }
const SMILE: Circle = { cx: 144.2, cy: 284.3, r: 124.2 }

/** Where each ring segment starts (the centre of its cap), clockwise from twelve. */
const JOINS = [333.8, 45.5, 114, 184.3, 261.5]

const ORIGIN = `${(RING.cx / BOX_W) * 100}% ${(RING.cy / BOX_H) * 100}%`

type MarkPiece = {
  circle: Circle
  from: number
  to: number
  end: 'notch' | 'round'
  hue: string
  /** On a dark ground the mark's near-black pieces become white. */
  hueOnDark?: string
  /** Degrees it swings about the ring's centre on the way in. */
  spin: number
}

const RING_HUES = [
  { hue: 'var(--mark-yellow)' },
  { hue: 'var(--mark-ink)', hueOnDark: 'var(--gk-white)' },
  { hue: 'var(--mark-blue)' },
  { hue: 'var(--mark-teal)' },
  { hue: 'var(--mark-coral)' },
]

const PIECES: Array<MarkPiece> = [
  ...RING_HUES.map((hues, i) => {
    const from = JOINS[i]
    const next = JOINS[(i + 1) % JOINS.length]
    return { circle: RING, from, to: next > from ? next : next + 360, end: 'notch' as const, spin: i % 2 ? 14 : -14, ...hues }
  }),
  { circle: SMILE, from: 99.8, to: 260.2, end: 'round', hue: 'var(--mark-ink)', hueOnDark: 'var(--gk-white)', spin: 0 },
]

/** How far each piece starts out from where it lands, in the mark's own units. */
const SCATTER = 56

function outline({ circle, from, to, end }: MarkPiece) {
  const cap = STROKE / 2
  const outer = circle.r + cap
  const inner = circle.r - cap
  const at = (radius: number, angle: number) => {
    const a = (angle * Math.PI) / 180
    return `${(circle.cx + radius * Math.sin(a)).toFixed(2)} ${(circle.cy - radius * Math.cos(a)).toFixed(2)}`
  }
  const large = to - from > 180 ? 1 : 0
  return [
    `M${at(outer, from)}`,
    `A${outer} ${outer} 0 ${large} 1 ${at(outer, to)}`,
    `A${cap} ${cap} 0 0 ${end === 'round' ? 1 : 0} ${at(inner, to)}`,
    `A${inner} ${inner} 0 ${large} 0 ${at(inner, from)}`,
    `A${cap} ${cap} 0 0 1 ${at(outer, from)}Z`,
  ].join('')
}

/** The mark's outlines, for drawings that colour the pieces themselves: the
 *  ring clockwise from the yellow at twelve, then the smile. */
export const markOutlines = {
  viewBox: `0 0 ${BOX_W} ${BOX_H}`,
  origin: `${RING.cx}px ${RING.cy}px`,
  ring: PIECES.slice(0, 5).map(outline),
  smile: outline(PIECES[5]),
}

const hue = (piece: MarkPiece, onDark: boolean) => (onDark ? (piece.hueOnDark ?? piece.hue) : piece.hue)

const EASE = [0.22, 1, 0.36, 1] as const

/**
 * The mark, coming together once as it scrolls into view: each piece eases
 * in from just outside its place, one after another, with no overshoot.
 * With reduced motion it is simply there.
 */
export function MarkAssembly({
  size = 300,
  onDark = true,
  settleAt = 0.8,
  className,
}: {
  /** How far down the viewport (0 top, 1 bottom) the mark's top edge must
   *  come before it assembles. */
  settleAt?: number
  /** Width of the mark. Height follows the real mark's proportions. */
  size?: number
  onDark?: boolean
  className?: string
}) {
  const reduced = useMotionReduced() === true
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: `0px 0px ${-Math.round((1 - settleAt) * 100)}% 0px` })
  const assembled = inView || reduced

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={cn('relative', className)}
      style={{ width: size, height: (size / BOX_W) * BOX_H }}
    >
      {PIECES.map((piece, index) => {
        const mid = (((piece.from + piece.to) / 2) * Math.PI) / 180
        const away = { x: Math.sin(mid) * SCATTER * (size / BOX_W), y: -Math.cos(mid) * SCATTER * (size / BOX_W), rotate: piece.spin, opacity: 0 }
        const delay = index * 0.09
        return (
          <motion.svg
            key={index}
            viewBox={`0 0 ${BOX_W} ${BOX_H}`}
            className="absolute inset-0 h-full w-full overflow-visible"
            style={{ transformOrigin: ORIGIN }}
            initial={away}
            animate={assembled ? { x: 0, y: 0, rotate: 0, opacity: 1 } : away}
            transition={
              reduced
                ? { duration: 0 }
                : { duration: 1.1, delay, ease: EASE, opacity: { duration: 0.45, delay, ease: 'easeOut' } }
            }
          >
            {/* The hairline stroke closes the antialiased seam where two pieces meet. */}
            <path d={outline(piece)} fill={hue(piece, onDark)} stroke={hue(piece, onDark)} strokeWidth={0.8} strokeLinejoin="round" />
          </motion.svg>
        )
      })}
    </div>
  )
}

/*
 * A closing band's one shape: a long piece of the mark's ring, drawn in from
 * its one visible cap when it comes into view, running off the band's right
 * edge. Large and cropped, so it reads as a piece of the mark, never a
 * spinner or a broken ring.
 */
export function ClosingRing({ size, className }: { size: number; className?: string }) {
  const reduced = useReducedMotion()
  const ref = useRef<SVGSVGElement>(null)
  /* A ring cropped by its band's corner is never half on screen; a little of it is enough. */
  const inView = useInView(ref, { once: true, amount: 0.1 })
  const thickness = 13
  /* From a round cap low on the left, up over the top and off the band's
     right edge: one continuous piece of the ring, one cap in frame. */
  const start = 280
  const sweep = 150
  return (
    <svg ref={ref} aria-hidden="true" viewBox="0 0 100 100" width={size} height={size} className={cn('overflow-visible', className)}>
      <motion.circle
        cx="50"
        cy="50"
        r={50 - thickness / 2}
        fill="none"
        stroke="var(--gk-yellow)"
        strokeWidth={thickness}
        strokeLinecap="round"
        transform={`rotate(${start - 90} 50 50)`}
        initial={false}
        animate={{ pathLength: inView || reduced ? sweep / 360 : 0 }}
        transition={reduced ? { duration: 0 } : { duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
      />
    </svg>
  )
}
