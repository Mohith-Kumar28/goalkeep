import { useCallback, useEffect, useState } from 'react'

/** Advances every `ms` until the visitor picks an item by hand, which ends autoplay for good. */
export function useCycle(count: number, ms: number) {
  const [index, setIndex] = useState(0)
  const [auto, setAuto] = useState(true)

  useEffect(() => {
    if (!auto) return
    const timer = setInterval(() => setIndex((current) => (current + 1) % count), ms)
    return () => clearInterval(timer)
  }, [auto, count, ms])

  const pick = useCallback((next: number) => {
    setAuto(false)
    setIndex(next)
  }, [])

  return [index, pick] as const
}
