import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import { useReducedMotion } from '@/hooks/use-reduced-motion'

/**
 * The hero's typewriter.
 *
 * "This part it's sort of collapsing and being typed out — design, then
 * someone doing backspace backspace backspace on design, and then build
 * getting typed out, then backspace on build, and then 'enable the adoption
 * of' getting typed out… and the part which is being typed, the entire
 * background can be some other colour, a white background and black being
 * typed, so that whatever word is being typed is automatically highlighted."
 *
 * That is this component, exactly. v2 answered the same note with a marker
 * that swept across a fixed sentence — a reasonable reading of the first
 * feedback doc, and not what was asked for in the review.
 *
 * Three things it has to get right:
 *
 * 1. Grammar holds at every frame. The frame is "We ___ data systems that…",
 *    and each of the three phrases completes it — including "enable the
 *    adoption of", which is why the "of" belongs to the phrase and not the tail.
 * 2. No vertical jump. The paragraph reserves the height of its longest
 *    rendering up front, so the buttons below it never move. The tail reflows
 *    horizontally as the phrase grows, which is the effect, not a bug.
 * 3. A screen reader gets the whole sentence, once, as prose. The animation is
 *    aria-hidden; the full sentence sits beside it in a visually hidden span.
 */
const TYPE_MS = 62
const DELETE_MS = 32
const HOLD_MS = 1700
const GAP_MS = 320

type Mode = 'typing' | 'holding' | 'deleting'

export function TypedPhrase({
  lead,
  phrases,
  tail,
  /** The highlight the typed phrase sits on. */
  markBackground = 'var(--gk-white)',
  markColor = 'var(--gk-navy)',
  className,
}: {
  lead: string
  phrases: Array<string>
  tail: string
  markBackground?: string
  markColor?: string
  className?: string
}) {
  const reduced = useReducedMotion()
  const [index, setIndex] = useState(0)
  const [count, setCount] = useState(0)
  const [mode, setMode] = useState<Mode>('typing')
  const timer = useRef<number | undefined>(undefined)

  const phrase = phrases[index] ?? ''

  useEffect(() => {
    if (reduced) return

    const step = () => {
      if (mode === 'typing') {
        if (count < phrase.length) {
          setCount((c) => c + 1)
        } else {
          setMode('holding')
        }
      } else if (mode === 'holding') {
        setMode('deleting')
      } else {
        if (count > 0) {
          setCount((c) => c - 1)
        } else {
          setIndex((i) => (i + 1) % phrases.length)
          setMode('typing')
        }
      }
    }

    const delay =
      mode === 'holding' ? HOLD_MS : mode === 'deleting' ? (count === 0 ? GAP_MS : DELETE_MS) : TYPE_MS

    timer.current = window.setTimeout(step, delay)
    return () => window.clearTimeout(timer.current)
  }, [reduced, mode, count, phrase.length, phrases.length])

  /* Reduced motion gets the sentence whole, with all three phrases joined and
     every one of them marked. The emphasis still reads; it just doesn't move. */
  if (reduced) {
    return (
      <span className={className}>
        {lead}{' '}
        {phrases.map((item, i) => (
          <span key={item}>
            <span
              className="rounded-[2px] px-[0.16em] font-bold"
              style={{ background: markBackground, color: markColor }}
            >
              {item}
            </span>
            {i < phrases.length - 2 ? ', ' : i === phrases.length - 2 ? ', and ' : ' '}
          </span>
        ))}
        {tail}
      </span>
    )
  }

  const spokenSentence = `${lead} ${phrases
    .map((item, i) =>
      i < phrases.length - 2 ? `${item}, ` : i === phrases.length - 2 ? `${item}, and ` : `${item} `,
    )
    .join('')}${tail}`

  return (
    <span className={className}>
      <span className="sr-only">{spokenSentence}</span>

      <span aria-hidden="true">
        {lead}{' '}
        <span
          className="inline-block rounded-[2px] px-[0.2em] font-bold"
          style={{ background: markBackground, color: markColor }}
        >
          {phrase.slice(0, count)}
          <span
            className={cn(
              'ml-[1px] inline-block w-[2px] translate-y-[0.12em] align-baseline',
              'motion-safe:animate-[gk-caret_1s_step-end_infinite]',
            )}
            style={{ height: '0.95em', background: markColor }}
          />
        </span>{' '}
        {tail}
      </span>
    </span>
  )
}
