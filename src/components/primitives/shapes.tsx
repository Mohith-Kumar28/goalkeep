import { cn } from '@/lib/utils'

/**
 * The shape language, derived from the wordmark's five-segment donut.
 *
 * The donut inside the "g" is the brand's one visual motif, so the page's
 * decoration is built from its geometry — arcs, rings and segments in the five
 * brand hues. These are abstractions of the mark, never reproductions of it:
 * the lockup itself still only ever appears in the header and footer.
 */

/** The wordmark's five segments, for the mark itself. */
const HUES = [
  'var(--gk-blue)',
  'var(--gk-teal)',
  'var(--gk-coral)',
  'var(--gk-yellow)',
  'var(--gk-charcoal)',
] as const

/** Decoration uses the four bright hues only — charcoal at low opacity on
 *  cream reads as dirty grey rather than as brand colour. */
const BRIGHT = [
  'var(--gk-blue)',
  'var(--gk-teal)',
  'var(--gk-coral)',
  'var(--gk-yellow)',
] as const

/** One arc of a ring — a single donut segment, blown up. */
export function Arc({
  color = 'var(--gk-teal)',
  from = -90,
  to = 90,
  width = 22,
  cap = 'butt',
  className,
  style,
}: {
  color?: string
  from?: number
  to?: number
  width?: number
  cap?: 'butt' | 'round'
  className?: string
  style?: React.CSSProperties
}) {
  const r = 50 - width / 2
  const rad = (d: number) => (d * Math.PI) / 180
  const x1 = 50 + r * Math.cos(rad(from))
  const y1 = 50 + r * Math.sin(rad(from))
  const x2 = 50 + r * Math.cos(rad(to))
  const y2 = 50 + r * Math.sin(rad(to))
  const large = Math.abs(to - from) > 180 ? 1 : 0

  return (
    <svg
      viewBox="0 0 100 100"
      aria-hidden="true"
      className={cn('pointer-events-none', className)}
      style={style}
    >
      <path
        d={`M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`}
        fill="none"
        stroke={color}
        strokeWidth={width}
        strokeLinecap={cap}
      />
    </svg>
  )
}

/**
 * The full five-segment ring. Used large and cropped as a backdrop, or small
 * as a section marker — the motif's geometry doing decorative work.
 */
export function Ring({
  className,
  width = 16,
  gap = 8,
  spin,
  style,
  segments = 4,
}: {
  className?: string
  width?: number
  gap?: number
  /** Seconds per rotation. Omit for a static ring. */
  spin?: number
  style?: React.CSSProperties
  /** 4 for decoration (bright hues), 5 to echo the mark exactly. */
  segments?: 4 | 5
}) {
  const palette = segments === 5 ? HUES : BRIGHT
  const r = 50 - width / 2
  const step = 360 / palette.length
  const rad = (d: number) => (d * Math.PI) / 180

  return (
    <svg
      viewBox="0 0 100 100"
      aria-hidden="true"
      className={cn('pointer-events-none', spin && 'motion-safe:animate-[gk-spin_linear_infinite]', className)}
      style={{ ...style, animationDuration: spin ? `${spin}s` : undefined }}
    >
      {palette.map((hue, i) => {
        const from = -90 + i * step + gap / 2
        const to = -90 + (i + 1) * step - gap / 2
        const x1 = 50 + r * Math.cos(rad(from))
        const y1 = 50 + r * Math.sin(rad(from))
        const x2 = 50 + r * Math.cos(rad(to))
        const y2 = 50 + r * Math.sin(rad(to))
        return (
          <path
            key={i}
            d={`M ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2}`}
            fill="none"
            stroke={hue}
            strokeWidth={width}
          />
        )
      })}
    </svg>
  )
}

/** A solid disc. The donut's counter, used as a colour block. */
export function Dot({
  color = 'var(--gk-coral)',
  className,
  style,
}: {
  color?: string
  className?: string
  style?: React.CSSProperties
}) {
  return (
    <span
      aria-hidden="true"
      className={cn('pointer-events-none block rounded-full', className)}
      style={{ backgroundColor: color, ...style }}
    />
  )
}

/** A half-ring: the segment shape at architectural scale. */
export function Half({
  color = 'var(--gk-yellow)',
  className,
  rotate = 0,
  style,
}: {
  color?: string
  className?: string
  rotate?: number
  style?: React.CSSProperties
}) {
  return (
    <svg
      viewBox="0 0 100 50"
      aria-hidden="true"
      className={cn('pointer-events-none', className)}
      style={{ transform: `rotate(${rotate}deg)`, ...style }}
    >
      <path d="M 0 50 A 50 50 0 0 1 100 50 Z" fill={color} />
    </svg>
  )
}

/** Floating backdrop shapes. Slow, silent, and off under reduced motion. */
export function FloatingShapes({
  variant = 'a',
}: {
  variant?: 'a' | 'b' | 'c'
}) {
  if (variant === 'a') {
    return (
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <Arc
          color="var(--gk-teal)"
          from={-140}
          to={40}
          width={20}
          className="absolute -left-24 top-10 size-64 opacity-90 motion-safe:animate-[gk-drift_18s_ease-in-out_infinite]"
        />
        <Dot
          color="var(--gk-yellow)"
          className="absolute right-[12%] top-8 size-10 motion-safe:animate-[gk-drift_14s_ease-in-out_infinite_reverse]"
        />
        <Arc
          color="var(--gk-coral)"
          from={60}
          to={220}
          width={18}
          className="absolute -bottom-16 right-[6%] size-48 motion-safe:animate-[gk-drift_22s_ease-in-out_infinite]"
        />
      </div>
    )
  }

  if (variant === 'b') {
    return (
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <Ring
          width={14}
          spin={90}
          className="absolute -right-20 -top-24 size-72 opacity-70"
        />
        <Dot
          color="var(--gk-blue)"
          className="absolute bottom-16 left-[8%] size-6 motion-safe:animate-[gk-drift_16s_ease-in-out_infinite]"
        />
      </div>
    )
  }

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <Half
        color="var(--gk-yellow)"
        rotate={180}
        className="absolute -left-10 bottom-0 h-24 w-48 opacity-80"
      />
      <Arc
        color="var(--gk-blue)"
        from={-90}
        to={90}
        width={16}
        className="absolute -right-12 top-1/3 size-40 motion-safe:animate-[gk-drift_20s_ease-in-out_infinite]"
      />
    </div>
  )
}

export { HUES, BRIGHT }
