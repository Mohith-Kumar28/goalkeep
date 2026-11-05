import { motion } from 'motion/react'
import { useEffect, useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import { BOX_H, BOX_W, JOIN_OVERLAP, RING, SEGMENTS, arcDash } from '@/components/primitives/logo-shapes'
import type { Segment } from '@/components/primitives/logo-shapes'
import type { DomainId } from '@/content/quiz'
import { useReducedMotion } from '@/hooks/use-reduced-motion'
import { cn } from '@/lib/utils'

/**
 * The mark, scored.
 *
 * The quiz has four domains and the mark has four coloured segments, so each
 * domain owns one: Data is the blue, Technology the teal, Process the coral,
 * Strategy the yellow. A domain's segment is drawn to the length of its
 * score over a faint track of the full segment. The near-black segment and
 * the smile are not scored; they stay solid, white on navy, so the ring is
 * always closed and the mark is always the mark.
 *
 * Every number comes from `logo-shapes.tsx`, which sampled them out of the
 * icon. Nothing here is invented geometry.
 */

export const SEGMENT_OF: Record<DomainId, number> = {
  strategy: 0,
  data: 2,
  technology: 3,
  process: 4,
}

const STRUCTURE = [1, 5]

/* The order the quiz asks its domains, which is the order the hero draws them. */
const DRAW_ORDER: Array<DomainId> = ['data', 'technology', 'process', 'strategy']

const EASE = [0.22, 1, 0.36, 1] as const

export function ScoredMark({
  fills,
  onDark = true,
  size = 280,
  drawOnMount = false,
  className,
  children,
}: {
  /** 0..1 per domain: how much of its segment is drawn. */
  fills: Record<DomainId, number>
  onDark?: boolean
  /** Width in px. Height follows the mark's own proportions. */
  size?: number
  /** Start empty and draw each domain in turn once mounted, half a second
   *  each, as a preview of the scoring. Reduced motion renders it full. */
  drawOnMount?: boolean
  className?: string
  /** Sits in the ring's hole. */
  children?: ReactNode
}) {
  const reduced = useReducedMotion()
  const [mounted, setMounted] = useState(!drawOnMount)
  useEffect(() => setMounted(true), [])
  const track = onDark ? 'rgb(255 255 255 / 0.16)' : 'var(--gk-cream-deep)'
  const hole = RING.r - RING.t / 2

  return (
    <div className={cn('relative', className)} style={{ width: size, height: (size / BOX_W) * BOX_H }}>
      <svg viewBox={`0 0 ${BOX_W} ${BOX_H}`} className="h-full w-full overflow-visible" aria-hidden="true">
        {STRUCTURE.map((index) => {
          const segment = SEGMENTS[index]
          const { circle } = segment
          const { dash, circumference, rotate } = arcDash(segment.start, segment.sweep, circle.r, circle.t)
          return (
            <circle
              key={index}
              cx={circle.cx}
              cy={circle.cy}
              r={circle.r}
              fill="none"
              stroke={onDark ? (segment.hueOnDark ?? segment.hue) : segment.hue}
              strokeWidth={circle.t}
              strokeLinecap="round"
              strokeDasharray={`${dash} ${circumference}`}
              transform={`rotate(${rotate} ${circle.cx} ${circle.cy})`}
            />
          )
        })}
        {DRAW_ORDER.map((domain, order) => {
          const segment = SEGMENTS[SEGMENT_OF[domain]]
          const { circle } = segment
          const full = arcDash(segment.start, segment.sweep, circle.r, circle.t)
          const fill = mounted ? Math.min(Math.max(fills[domain], 0), 1) : 0
          const drawn = arcDash(segment.start, segment.sweep * fill, circle.r, circle.t)
          const transition = reduced
            ? { duration: 0 }
            : drawOnMount
              ? { duration: 0.5, delay: order * 0.5, ease: EASE }
              : { duration: 0.7, ease: EASE }
          const shared = {
            cx: circle.cx,
            cy: circle.cy,
            r: circle.r,
            fill: 'none',
            strokeWidth: circle.t,
            strokeLinecap: 'round' as const,
            transform: `rotate(${full.rotate} ${circle.cx} ${circle.cy})`,
          }
          return (
            <g key={domain}>
              <circle {...shared} stroke={track} strokeDasharray={`${full.dash} ${full.circumference}`} />
              <motion.circle
                {...shared}
                stroke={segment.hue}
                initial={false}
                animate={{ pathLength: drawn.dash / full.circumference, opacity: fill > 0 ? 1 : 0 }}
                transition={transition}
              />
            </g>
          )
        })}
      </svg>
      {children && (
        <div
          className="absolute grid place-items-center"
          style={{
            left: `${((RING.cx - hole) / BOX_W) * 100}%`,
            top: `${((RING.cy - hole) / BOX_H) * 100}%`,
            width: `${((hole * 2) / BOX_W) * 100}%`,
            height: `${((hole * 2) / BOX_H) * 100}%`,
          }}
        >
          {children}
        </div>
      )}
    </div>
  )
}

/**
 * The box one segment occupies in the mark's own units, round caps and the
 * join overlap included, so a segment can be shown on its own without the
 * rest of the ring around it.
 */
function segmentBox(segment: Segment) {
  const { circle } = segment
  const half = circle.t / 2
  const from = segment.start - JOIN_OVERLAP / 2
  const to = segment.start + segment.sweep + JOIN_OVERLAP / 2
  const at = (deg: number, radius: number) => {
    const a = (deg * Math.PI) / 180
    return { x: circle.cx + radius * Math.sin(a), y: circle.cy - radius * Math.cos(a) }
  }
  const points = []
  for (let deg = from; deg <= to; deg += 1) points.push(at(deg, circle.r - half), at(deg, circle.r + half))
  for (const deg of [from, to]) {
    const cap = at(deg, circle.r)
    points.push({ x: cap.x - half, y: cap.y - half }, { x: cap.x + half, y: cap.y + half })
  }
  const xs = points.map((p) => p.x)
  const ys = points.map((p) => p.y)
  const x = Math.min(...xs)
  const y = Math.min(...ys)
  return { x, y, w: Math.max(...xs) - x, h: Math.max(...ys) - y }
}

const BOXES = Object.fromEntries(
  (Object.keys(SEGMENT_OF) as Array<DomainId>).map((domain) => [domain, segmentBox(SEGMENTS[SEGMENT_OF[domain]])]),
) as Record<DomainId, ReturnType<typeof segmentBox>>

/**
 * One domain's segment on its own, at the same geometry the whole mark uses,
 * fitted into a square. With `fill` below 1 it is drawn to that share of its
 * length over a `track` of the full segment, the way the scored mark does.
 */
export function DomainArc({
  domain,
  size = 16,
  fill = 1,
  color,
  track,
  animate = false,
  className,
  style,
}: {
  domain: DomainId
  /** Width and height of the square it is fitted into, in px. */
  size?: number
  /** 0..1 of the segment's length. */
  fill?: number
  /** Defaults to the segment's own colour in the mark. */
  color?: string
  /** Colour of the full segment under a partial fill. */
  track?: string
  /** Draw the fill from nothing when it first renders. */
  animate?: boolean
  className?: string
  style?: CSSProperties
}) {
  const reduced = useReducedMotion()
  const segment = SEGMENTS[SEGMENT_OF[domain]]
  const { circle } = segment
  const box = BOXES[domain]
  const full = arcDash(segment.start, segment.sweep, circle.r, circle.t)
  const clamped = Math.min(Math.max(fill, 0), 1)
  const drawn = arcDash(segment.start, segment.sweep * clamped, circle.r, circle.t)
  const shared = {
    cx: circle.cx,
    cy: circle.cy,
    r: circle.r,
    fill: 'none',
    strokeWidth: circle.t,
    strokeLinecap: 'round' as const,
    transform: `rotate(${full.rotate} ${circle.cx} ${circle.cy})`,
  }

  return (
    <svg
      aria-hidden="true"
      viewBox={`${box.x} ${box.y} ${box.w} ${box.h}`}
      preserveAspectRatio="xMidYMid meet"
      className={cn('shrink-0 overflow-visible', className)}
      style={{ width: size, height: size, ...style }}
    >
      {track && <circle {...shared} stroke={track} strokeDasharray={`${full.dash} ${full.circumference}`} />}
      <motion.circle
        {...shared}
        stroke={color ?? segment.hue}
        initial={animate && !reduced ? { pathLength: 0 } : false}
        animate={{ pathLength: drawn.dash / full.circumference }}
        transition={reduced ? { duration: 0 } : { duration: 0.7, ease: EASE }}
      />
    </svg>
  )
}

/**
 * Where a domain's label sits around the mark: on the segment's mid-angle,
 * `gap` units past the outer edge of the ring, with the side of the label
 * that faces the ring touching that point. The tilt follows the label's
 * position round the ring, so every label obeys one rule.
 */
export function markLabelStyle(domain: DomainId, gap = 22): CSSProperties {
  const segment = SEGMENTS[SEGMENT_OF[domain]]
  const mid = ((segment.start + segment.sweep / 2) * Math.PI) / 180
  const sin = Math.sin(mid)
  const cos = Math.cos(mid)
  const radius = RING.r + RING.t / 2 + gap
  return {
    left: `${((RING.cx + radius * sin) / BOX_W) * 100}%`,
    top: `${((RING.cy - radius * cos) / BOX_H) * 100}%`,
    transform: `translate(${(sin - 1) * 50}%, ${(-cos - 1) * 50}%) rotate(${sin * 4}deg)`,
  }
}
