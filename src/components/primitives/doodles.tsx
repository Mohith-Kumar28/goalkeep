import { motion } from 'motion/react'
import type { CSSProperties, ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { useReducedMotion } from '@/hooks/use-reduced-motion'

/**
 * The hand-drawn layer.
 *
 * Every path below was drawn deliberately imperfect — the circles do not close,
 * the underlines wobble, the arrows overshoot. That irregularity is the whole
 * point: a geometrically perfect "hand-drawn" mark reads as a vector asset,
 * which is exactly the machine-made quality the homepage feedback objected to.
 *
 * All doodles are decoration. They are `aria-hidden`, they never sit under text
 * that has to stay readable, and under reduced motion they render fully drawn
 * rather than disappearing.
 */

export type ScribbleName =
  | 'circle'
  | 'oval'
  | 'underline'
  | 'underline-double'
  | 'squiggle'
  | 'arrow-curve'
  | 'arrow-hook'
  | 'arrow-down'
  | 'bracket'
  | 'star'
  | 'spiral'
  | 'check'
  | 'zigzag'
  | 'cross'

type ScribblePath = {
  d: Array<string>
  viewBox: string
  /** Stroke width is authored per-shape; a star needs a finer line than a circle. */
  weight: number
}

const PATHS: Record<ScribbleName, ScribblePath> = {
  // Deliberately unclosed — the pen passes the start point and keeps going.
  circle: {
    viewBox: '0 0 220 90',
    weight: 4,
    d: [
      'M196 30C186 12 140 5 104 6C62 7 18 18 9 40c-9 22 26 40 78 43c48 3 106-6 122-25c11-13 2-27-14-34',
    ],
  },
  oval: {
    viewBox: '0 0 240 110',
    weight: 4,
    d: [
      'M170 12C138 3 76 6 42 24C10 41 4 72 30 89c28 18 106 17 152-3c40-17 48-52 16-68C176 6 140 4 116 8',
    ],
  },
  underline: {
    viewBox: '0 0 220 24',
    weight: 6,
    d: ['M6 15c38-7 74-9 108-8c30 1 61 5 100 11'],
  },
  'underline-double': {
    viewBox: '0 0 220 30',
    weight: 4,
    d: ['M5 10c40-6 80-8 116-7c28 1 56 4 94 9', 'M14 24c44-5 82-6 114-5c26 1 52 3 84 6'],
  },
  squiggle: {
    viewBox: '0 0 220 26',
    weight: 7,
    d: ['M5 16c18-13 34 8 52-1s30-14 48-4s34 12 52 2s38-10 58 1'],
  },
  // Long sweeping arrow, the kind you draw in a margin to point at something.
  'arrow-curve': {
    viewBox: '0 0 160 130',
    weight: 4,
    d: [
      'M12 10c34 6 62 26 78 54c9 16 13 34 12 52',
      'M84 100l18 20l22-16',
    ],
  },
  'arrow-hook': {
    viewBox: '0 0 150 90',
    weight: 4,
    d: ['M8 20c30-14 70-12 96 6c14 10 20 24 18 40', 'M104 46l20 22l18-24'],
  },
  'arrow-down': {
    viewBox: '0 0 70 130',
    weight: 4,
    d: ['M34 8c-6 34-4 66 2 100', 'M18 88l18 30l20-30'],
  },
  bracket: {
    viewBox: '0 0 40 160',
    weight: 4,
    d: ['M30 6C14 8 10 22 11 44c1 18 3 30-5 36c8 6 6 18 5 36c-1 22 3 36 19 38'],
  },
  star: {
    viewBox: '0 0 60 60',
    weight: 3.5,
    d: ['M30 6v48', 'M8 18l44 24', 'M52 18L8 42'],
  },
  spiral: {
    viewBox: '0 0 90 90',
    weight: 3.5,
    d: [
      'M45 45c0-5 6-7 10-4c6 5 4 15-4 19c-11 6-25-1-29-13C17 32 27 14 44 10c21-5 41 9 45 30',
    ],
  },
  check: {
    viewBox: '0 0 70 56',
    weight: 5,
    d: ['M6 30l20 20L64 6'],
  },
  zigzag: {
    viewBox: '0 0 200 30',
    weight: 4.5,
    d: ['M5 22l24-16l24 16l24-16l24 16l24-16l24 16l24-16l24 16'],
  },
  cross: {
    viewBox: '0 0 50 50',
    weight: 4,
    d: ['M8 8l34 34', 'M42 8L8 42'],
  },
}

/**
 * A single hand-drawn mark. Draws itself in with stroke-dashoffset when it
 * scrolls into view; renders already-drawn under reduced motion.
 */
export function Scribble({
  name,
  className,
  color = 'currentColor',
  weight,
  duration = 0.9,
  delay = 0,
  style,
}: {
  name: ScribbleName
  className?: string
  color?: string
  weight?: number
  duration?: number
  delay?: number
  style?: CSSProperties
}) {
  const reduced = useReducedMotion()
  const shape = PATHS[name]

  return (
    <svg
      aria-hidden="true"
      viewBox={shape.viewBox}
      fill="none"
      className={cn('pointer-events-none overflow-visible', className)}
      style={style}
      preserveAspectRatio="none"
    >
      {shape.d.map((d, index) => (
        <motion.path
          key={index}
          d={d}
          stroke={color}
          strokeWidth={weight ?? shape.weight}
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
          initial={reduced ? false : { pathLength: 0, opacity: 0 }}
          whileInView={reduced ? undefined : { pathLength: 1, opacity: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{
            duration,
            delay: delay + index * 0.18,
            ease: [0.22, 1, 0.36, 1],
          }}
        />
      ))}
    </svg>
  )
}

/**
 * Wraps a run of text and draws a mark around it. The wrapper is
 * `inline-block` with the SVG absolutely positioned outside the text box, so
 * the annotation never shifts the line it belongs to.
 *
 * `circle` and `oval` sit *behind* the text at low z; `underline`/`squiggle`
 * hang below the baseline. Nothing here changes the text's own colour, so the
 * contrast guarantee of the surrounding band still holds.
 */
export function Annotate({
  children,
  mark = 'circle',
  color = 'var(--gk-yellow)',
  className,
  delay = 0,
  inset = '-14%',
  nowrap = false,
}: {
  children: ReactNode
  mark?: ScribbleName
  color?: string
  className?: string
  delay?: number
  inset?: string
  /** Keeps the run on one line. An underline or squiggle drawn under a phrase
   *  that has wrapped spans the whole two-line box and lands nowhere near the
   *  words, so any non-enclosing mark on a long phrase wants this. */
  nowrap?: boolean
}) {
  const isEnclosing = mark === 'circle' || mark === 'oval'

  return (
    <span className={cn('relative inline-block', nowrap && 'whitespace-nowrap', className)}>
      <span className="relative z-10">{children}</span>
      <Scribble
        name={mark}
        color={color}
        delay={delay}
        className={cn(
          'absolute',
          isEnclosing
            ? 'left-0 top-0 h-full w-full'
            : 'left-0 top-full h-[0.42em] w-full translate-y-[-0.1em]',
        )}
        style={
          isEnclosing
            ? {
                left: inset,
                top: inset,
                width: `calc(100% - 2 * ${inset})`,
                height: `calc(100% - 2 * ${inset})`,
              }
            : undefined
        }
      />
    </span>
  )
}

/**
 * A margin note: hand type plus an arrow pointing back at whatever it annotates.
 * `direction` is where the arrow points, not where the note sits.
 */
export function MarginNote({
  children,
  direction = 'left',
  color = 'var(--band-accent-ink, currentColor)',
  className,
}: {
  children: ReactNode
  direction?: 'left' | 'right' | 'down'
  color?: string
  className?: string
}) {
  const arrow: ScribbleName =
    direction === 'down' ? 'arrow-down' : 'arrow-curve'

  return (
    <span
      aria-hidden="true"
      className={cn('pointer-events-none inline-flex items-start gap-2', className)}
      style={{ color }}
    >
      <span className="hand -rotate-3 whitespace-pre-line leading-tight">{children}</span>
      <Scribble
        name={arrow}
        color={color}
        className={cn(
          'mt-1 h-12 w-10 shrink-0',
          direction === 'left' && '-scale-x-100',
          direction === 'down' && 'h-14 w-6',
        )}
      />
    </span>
  )
}
