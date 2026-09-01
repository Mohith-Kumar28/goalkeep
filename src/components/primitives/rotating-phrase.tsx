import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from '@/hooks/use-reduced-motion'

const HOLD_MS = 3200
const FADE_MS = 220
const LOOPS = 2

/**
 * The hero's rotating word.
 *
 * The sentence frame never changes — only one word between a fixed lead-in
 * and a fixed tail — so grammar holds in every frame, including mid-transition.
 *
 * Three deliberate properties:
 *
 * 1. It RESOLVES. After two loops it stops permanently on the first phrase
 *    (the canonical brand line). An animation that ends reads as a sentence
 *    being written; one that loops forever reads as an ad.
 * 2. Zero layout shift. The slot is sized to the widest phrase by rendering
 *    all of them in a hidden measurement layer, so the tail never reflows.
 * 3. It yields. Pauses below 50% visibility and on hover or focus, and does
 *    not resume — if you're reading it, it stops moving.
 *
 * Under reduced motion no timer is ever created: the slot renders the first
 * phrase statically. The alternates are always available as plain text in the
 * marginalia beneath, so the animation is never the only route to them.
 */
export function RotatingPhrase({ phrases }: { phrases: Array<string> }) {
  const reduced = useReducedMotion()
  const [index, setIndex] = useState(0)
  const [visible, setVisible] = useState(true)
  const [settled, setSettled] = useState(false)
  const [paused, setPaused] = useState(false)
  const [inView, setInView] = useState(false)
  const ref = useRef<HTMLSpanElement>(null)
  const stepsRef = useRef(0)

  // Only animate while the headline is actually on screen.
  useEffect(() => {
    const node = ref.current
    if (!node || reduced) return

    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.5 },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [reduced])

  useEffect(() => {
    if (reduced || settled || paused || !inView) return

    const totalSteps = phrases.length * LOOPS
    const hold = window.setTimeout(() => {
      setVisible(false)

      const swap = window.setTimeout(() => {
        stepsRef.current += 1

        if (stepsRef.current >= totalSteps) {
          setIndex(0)
          setSettled(true)
        } else {
          setIndex((i) => (i + 1) % phrases.length)
        }

        setVisible(true)
      }, FADE_MS - 60)

      return () => window.clearTimeout(swap)
    }, HOLD_MS)

    return () => window.clearTimeout(hold)
  }, [index, reduced, settled, paused, inView, phrases.length])

  const stop = () => setPaused(true)

  return (
    <span
      ref={ref}
      className="relative inline-grid align-baseline"
      onPointerEnter={stop}
      onFocus={stop}
    >
      {/* Measurement layer: reserves the widest phrase's width so the slot
          never resizes and the tail never reflows. */}
      <span aria-hidden="true" className="invisible col-start-1 row-start-1">
        {phrases.reduce((a, b) => (a.length >= b.length ? a : b))}
      </span>

      <span className="keyword-mark col-start-1 row-start-1 text-center">
        <span
          className="inline-block transition-[opacity,transform] ease-[var(--ease-out)]"
          style={{
            transitionDuration: `${FADE_MS}ms`,
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(-4px)',
          }}
        >
          {phrases[index]}
        </span>
      </span>
    </span>
  )
}
