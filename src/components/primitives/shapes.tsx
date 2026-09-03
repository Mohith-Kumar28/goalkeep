import { motion, useScroll, useTransform } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import { cn } from '@/lib/utils'
import { useReducedMotion } from '@/hooks/use-reduced-motion'

/**
 * Shapes taken straight off the mark.
 *
 * The `goalkeep` g is a ring broken into four coloured arcs with a gap at the
 * top, sitting above a smile. Everything in this file is that geometry taken
 * apart: an arc on its own, the full four-segment ring, a dot, a half disc.
 * Nothing here is a generic blob — if a shape can't be traced back to the
 * wordmark it doesn't belong on the page.
 */

/** The four arc colours, in the order they appear on the mark, clockwise from top. */
export const RING_HUES = [
  'var(--gk-yellow)',
  'var(--gk-blue)',
  'var(--gk-teal)',
  'var(--gk-coral)',
] as const

export function Ring({
  size = 120,
  thickness = 14,
  spin,
  gap = 18,
  className,
  style,
}: {
  size?: number
  thickness?: number
  /** Seconds per rotation. Omit for a static ring. */
  spin?: number
  /** Degrees of open gap at the top, the way the mark is drawn. */
  gap?: number
  className?: string
  style?: CSSProperties
}) {
  const r = 50 - thickness / 2
  const circumference = 2 * Math.PI * r
  const per = (360 - gap) / 4
  const segment = (per / 360) * circumference

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={cn('shrink-0', className)}
      style={{
        ...style,
        animation: spin ? `gk-spin ${spin}s linear infinite` : undefined,
      }}
    >
      {RING_HUES.map((hue, index) => (
        <circle
          key={hue}
          cx="50"
          cy="50"
          r={r}
          fill="none"
          stroke={hue}
          strokeWidth={thickness}
          strokeLinecap="round"
          strokeDasharray={`${segment - thickness} ${circumference}`}
          strokeDashoffset={-(index * (per / 360) * circumference) - gap / 720 * circumference}
          transform="rotate(-90 50 50)"
        />
      ))}
    </svg>
  )
}

export function Arc({
  size = 90,
  thickness = 14,
  color = 'var(--gk-teal)',
  sweep = 120,
  className,
  style,
}: {
  size?: number
  thickness?: number
  color?: string
  sweep?: number
  className?: string
  style?: CSSProperties
}) {
  const r = 50 - thickness / 2
  const circumference = 2 * Math.PI * r

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={cn('shrink-0', className)}
      style={style}
    >
      <circle
        cx="50"
        cy="50"
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={thickness}
        strokeLinecap="round"
        strokeDasharray={`${(sweep / 360) * circumference} ${circumference}`}
        transform="rotate(-90 50 50)"
      />
    </svg>
  )
}

export function Dot({
  size = 24,
  color = 'var(--gk-coral)',
  className,
  style,
}: {
  size?: number
  color?: string
  className?: string
  style?: CSSProperties
}) {
  return (
    <span
      aria-hidden="true"
      className={cn('block shrink-0 rounded-full', className)}
      style={{ width: size, height: size, background: color, ...style }}
    />
  )
}

/** The smile under the g. */
export function Half({
  size = 80,
  color = 'var(--gk-yellow)',
  thickness = 14,
  className,
  style,
}: {
  size?: number
  color?: string
  thickness?: number
  className?: string
  style?: CSSProperties
}) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 100 60"
      width={size}
      height={size * 0.6}
      className={cn('shrink-0', className)}
      style={style}
    >
      <path
        d="M8 8c0 24 19 44 42 44s42-20 42-44"
        fill="none"
        stroke={color}
        strokeWidth={thickness}
        strokeLinecap="round"
      />
    </svg>
  )
}

type FloatItem = {
  kind: 'ring' | 'arc' | 'dot' | 'half'
  top: string
  left: string
  size: number
  color?: string
  /** Parallax factor: how far it drifts against the scroll, in px over the band. */
  depth: number
  drift: number
  rotate?: number
}

/*
 * Positions are constrained to three safe zones: the strip below the sticky
 * header, the band's bottom padding, and just off the left and right edges.
 *
 * The shell is 1440px wide and the viewport often isn't much wider, so there
 * is frequently no side gutter at all — which is why several of these sit at a
 * negative offset and bleed off-canvas. A shape half out of frame reads as
 * deliberate; the same shape landing on a CTA reads as a bug. An earlier pass
 * scattered them across the full band and they did exactly that.
 */
const FIELDS: Record<'a' | 'b' | 'c', Array<FloatItem>> = {
  // Hero. Nothing above 15%: that band belongs to the header.
  a: [
    { kind: 'ring', top: '16%', left: '-2%', size: 96, depth: -70, drift: 16 },
    { kind: 'dot', top: '15%', left: '97%', size: 18, color: 'var(--gk-yellow)', depth: -40, drift: 10 },
    { kind: 'half', top: '86%', left: '94%', size: 104, color: 'var(--gk-teal)', depth: 62, drift: 15 },
    { kind: 'arc', top: '87%', left: '-1%', size: 96, color: 'var(--gk-coral)', depth: 50, drift: 13, rotate: 140 },
  ],
  // Mid-page — quieter, so it never competes with a photograph.
  b: [
    { kind: 'arc', top: '4%', left: '96%', size: 88, color: 'var(--gk-blue)', depth: -46, drift: 14, rotate: 200 },
    { kind: 'dot', top: '3%', left: '-0.5%', size: 16, color: 'var(--gk-coral)', depth: -32, drift: 11 },
    { kind: 'ring', top: '95%', left: '96%', size: 66, depth: 54, drift: 12 },
  ],
  // Closing. The big ring is placed by the section itself; these are edges.
  c: [
    { kind: 'half', top: '9%', left: '-1.5%', size: 88, color: 'var(--gk-coral)', depth: -44, drift: 13 },
    { kind: 'dot', top: '88%', left: '96.5%', size: 16, color: 'var(--gk-yellow)', depth: 34, drift: 9 },
    { kind: 'arc', top: '90%', left: '-1%', size: 72, color: 'var(--gk-teal)', depth: 40, drift: 11, rotate: 300 },
  ],
}

/**
 * The parallax background layer. Shapes drift on scroll and lean very slightly
 * toward the pointer, which is what stops a flat-colour band from reading as a
 * flat colour band.
 *
 * Hidden below `lg` — on a phone these would land on top of the copy, and the
 * band is short enough there that the parallax has no room to read anyway.
 */
export function FloatingField({
  variant = 'a',
  className,
}: {
  variant?: 'a' | 'b' | 'c'
  className?: string
}) {
  /* The project hook, not motion's. motion's returns null during SSR and a
     boolean after mount, so the drift animation was present in the server HTML
     and absent on the first client render — a hydration mismatch. Ours starts
     `true` on both sides, so nothing animates until we've actually asked. */
  const reduced = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const [pointer, setPointer] = useState({ x: 0, y: 0 })

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  useEffect(() => {
    if (reduced) return
    const onMove = (event: PointerEvent) => {
      const w = window.innerWidth
      const h = window.innerHeight
      setPointer({
        x: (event.clientX / w - 0.5) * 2,
        y: (event.clientY / h - 0.5) * 2,
      })
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [reduced])

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={cn(
        'pointer-events-none absolute inset-0 hidden select-none overflow-hidden xl:block',
        className,
      )}
    >
      {FIELDS[variant].map((item, index) => (
        <FloatShape
          key={index}
          item={item}
          progress={scrollYProgress}
          pointer={pointer}
          reduced={reduced}
        />
      ))}
    </div>
  )
}

function FloatShape({
  item,
  progress,
  pointer,
  reduced,
}: {
  item: FloatItem
  progress: ReturnType<typeof useScroll>['scrollYProgress']
  pointer: { x: number; y: number }
  reduced: boolean
}) {
  const y = useTransform(progress, [0, 1], [item.depth, -item.depth])

  const node =
    item.kind === 'ring' ? (
      <Ring size={item.size} thickness={item.size * 0.13} />
    ) : item.kind === 'arc' ? (
      <Arc size={item.size} thickness={item.size * 0.15} color={item.color} sweep={150} />
    ) : item.kind === 'dot' ? (
      <Dot size={item.size} color={item.color} />
    ) : (
      <Half size={item.size} color={item.color} thickness={item.size * 0.16} />
    )

  return (
    <motion.div
      className="absolute"
      style={{
        top: item.top,
        left: item.left,
        y: reduced ? 0 : y,
        x: reduced ? 0 : pointer.x * item.drift,
        rotate: item.rotate ?? 0,
        opacity: 0.85,
        transition: 'transform 400ms cubic-bezier(0.22,1,0.36,1)',
      }}
    >
      <div
        style={{
          // The delay is folded into the shorthand rather than set alongside
          // it: React warns when a shorthand and one of its longhands are both
          // written on a re-render, and the two can land in either order.
          animation: reduced
            ? undefined
            : `gk-drift ${9 + item.drift}s ease-in-out ${item.drift * -0.4}s infinite`,
        }}
      >
        {node}
      </div>
    </motion.div>
  )
}

/**
 * Background texture tiled from the mark's geometry. `arcs` is a lattice of
 * quarter-arcs, `dots` a plain dot grid, `rings` the four-segment donut at
 * small scale. All three sit under content at low opacity.
 */
export function PatternField({
  pattern = 'arcs',
  color = 'currentColor',
  opacity = 0.09,
  scale = 64,
  className,
}: {
  pattern?: 'arcs' | 'dots' | 'rings' | 'grid'
  color?: string
  opacity?: number
  scale?: number
  className?: string
}) {
  const id = `gk-pattern-${pattern}-${scale}`

  return (
    <svg
      aria-hidden="true"
      className={cn('pointer-events-none absolute inset-0 h-full w-full', className)}
      style={{ opacity }}
    >
      <defs>
        <pattern id={id} width={scale} height={scale} patternUnits="userSpaceOnUse">
          {pattern === 'arcs' && (
            <path
              d={`M0 ${scale} A ${scale} ${scale} 0 0 1 ${scale} 0`}
              fill="none"
              stroke={color}
              strokeWidth="1.5"
            />
          )}
          {pattern === 'dots' && (
            <circle cx={scale / 2} cy={scale / 2} r="2" fill={color} />
          )}
          {pattern === 'rings' && (
            <circle
              cx={scale / 2}
              cy={scale / 2}
              r={scale / 3}
              fill="none"
              stroke={color}
              strokeWidth="1.5"
              strokeDasharray="6 5"
            />
          )}
          {pattern === 'grid' && (
            <path
              d={`M${scale} 0 L0 0 0 ${scale}`}
              fill="none"
              stroke={color}
              strokeWidth="1"
            />
          )}
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  )
}
