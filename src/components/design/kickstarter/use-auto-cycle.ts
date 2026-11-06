import { useEffect, useState } from 'react'
import { useReducedMotion } from '@/hooks/use-reduced-motion'

/**
 * An index that steps through `count` items every `ms` until the visitor
 * picks one by hand, which ends the cycle for good, as in the export.
 */
export function useAutoCycle(count: number, ms: number) {
  const [index, setIndex] = useState(0)
  const [auto, setAuto] = useState(true)
  const reduced = useReducedMotion()

  useEffect(() => {
    if (!auto || reduced) return
    const timer = setInterval(() => setIndex((current) => (current + 1) % count), ms)
    return () => clearInterval(timer)
  }, [auto, reduced, count, ms])

  const pick = (next: number) => {
    setAuto(false)
    setIndex(next)
  }
  return [index, pick] as const
}
