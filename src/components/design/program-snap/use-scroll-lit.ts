import { useCallback, useEffect, useRef, useState } from 'react'
import { useReducedMotion } from '@/hooks/use-reduced-motion'

/**
 * How many of `count` stacked items the reader has scrolled past. An item
 * counts once its centre crosses `line` (a fraction of the viewport height),
 * and uncounts when the reader scrolls back up. With reduced motion every
 * item counts, so the content is shown statically.
 */
export function useScrollLit(count: number, line = 0.62) {
  const reduced = useReducedMotion()
  const items = useRef<Array<HTMLElement | null>>([])
  const [lit, setLit] = useState(count)

  useEffect(() => {
    if (reduced) {
      setLit(count)
      return
    }
    let frame = 0
    const measure = () => {
      frame = 0
      const y = window.innerHeight * line
      let passed = 0
      items.current.forEach((el, i) => {
        if (el && el.getBoundingClientRect().top + el.offsetHeight / 2 < y) passed = i + 1
      })
      setLit(passed)
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(measure)
    }
    measure()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    return () => {
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [reduced, count, line])

  const register = useCallback(
    (i: number) => (el: HTMLElement | null) => {
      items.current[i] = el
    },
    [],
  )

  return { lit, register }
}
