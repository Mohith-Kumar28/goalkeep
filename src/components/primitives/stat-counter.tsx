import NumberFlow from '@number-flow/react'
import { useEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import { cn } from '@/lib/utils'
import { useReducedMotion } from '@/hooks/use-reduced-motion'

/**
 * A number that counts up the first time it is scrolled into view.
 *
 * Split into prefix/value/suffix so "4 hrs" and "73%" animate the digits only
 * and leave the unit still — a unit that slides in with the number reads as a
 * glitch. Under reduced motion the final value renders immediately.
 */
export function StatCounter({
  value,
  prefix,
  suffix,
  className,
  style,
}: {
  value: number
  prefix?: string
  suffix?: string
  className?: string
  style?: CSSProperties
}) {
  const reduced = useReducedMotion()
  const ref = useRef<HTMLSpanElement>(null)
  const [shown, setShown] = useState(0)

  useEffect(() => {
    if (reduced) {
      setShown(value)
      return
    }
    const node = ref.current
    if (!node) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(value)
          observer.disconnect()
        }
      },
      { threshold: 0.5 },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [reduced, value])

  return (
    <span
      ref={ref}
      style={style}
      className={cn('stat-figure inline-flex items-baseline', className)}
    >
      {prefix}
      <NumberFlow
        value={shown}
        transformTiming={{ duration: 1100, easing: 'cubic-bezier(0.22,1,0.36,1)' }}
        willChange
      />
      {suffix}
    </span>
  )
}
