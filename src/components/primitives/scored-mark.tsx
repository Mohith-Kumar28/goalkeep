import { motion } from 'motion/react'
import type { CSSProperties, ReactNode } from 'react'
import { BOX_H, BOX_W, RING, SEGMENTS, arcDash } from '@/components/primitives/logo-shapes'
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

export function ScoredMark({
  fills,
  onDark = true,
  size = 280,
  className,
  children,
}: {
  /** 0..1 per domain: how much of its segment is drawn. */
  fills: Record<DomainId, number>
  onDark?: boolean
  /** Width in px. Height follows the mark's own proportions. */
  size?: number
  className?: string
  /** Sits in the ring's hole. */
  children?: ReactNode
}) {
  const reduced = useReducedMotion()
  const track = onDark ? 'rgb(255 255 255 / 0.16)' : 'var(--gk-cream-deep)'
  const transition = reduced ? { duration: 0 } : { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const }
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
        {(Object.keys(SEGMENT_OF) as Array<DomainId>).map((domain) => {
          const segment = SEGMENTS[SEGMENT_OF[domain]]
          const { circle } = segment
          const full = arcDash(segment.start, segment.sweep, circle.r, circle.t)
          const fill = Math.min(Math.max(fills[domain], 0), 1)
          const drawn = arcDash(segment.start, segment.sweep * fill, circle.r, circle.t)
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
