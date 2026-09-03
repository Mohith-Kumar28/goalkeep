import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { useReducedMotion } from '@/hooks/use-reduced-motion'

/**
 * A sentence in which the emphasis moves.
 *
 * The brief asked for "'design', 'build', and 'enable the adoption'… typed out
 * (highlighted) and rotate". The first build of this typed each phrase into a
 * shared slot, which meant either reserving width for the longest phrase — a
 * five-word gap sitting in the middle of the sentence while "build" was on
 * screen — or reflowing the paragraph on every keystroke.
 *
 * Highlighting instead of typing fixes both. The sentence is always whole and
 * always readable; a marker sweeps across one phrase at a time. That is also
 * closer to what the note actually asked for: the word "highlighted" is doing
 * the work in it, not "typed".
 *
 * Contrast is why the text flips to ink under the marker rather than staying
 * white: white on the yellow and teal fills is unreadable, ink on them clears
 * 8:1.
 */
export type HighlightSegment = {
  text: string
  /** Present on the three phrases that take a turn; absent on connective text. */
  hue?: string
}

const HOLD_MS = 2600

export function RotatingHighlight({
  segments,
  className,
}: {
  segments: Array<HighlightSegment>
  className?: string
}) {
  const reduced = useReducedMotion()
  const [active, setActive] = useState(0)

  const phraseIndexes = segments
    .map((segment, index) => (segment.hue ? index : -1))
    .filter((index) => index >= 0)

  useEffect(() => {
    if (reduced || phraseIndexes.length < 2) return
    const id = window.setInterval(
      () => setActive((i) => (i + 1) % phraseIndexes.length),
      HOLD_MS,
    )
    return () => window.clearInterval(id)
  }, [reduced, phraseIndexes.length])

  return (
    <span className={cn(className)}>
      {segments.map((segment, index) => {
        if (!segment.hue) {
          // The marker carries 0.16em of inline padding on each side, which
          // reads as a space when the next segment opens with punctuation.
          const leadsWithPunctuation = /^[,.;:!?]/.test(segment.text)
          return (
            <span key={index} className={leadsWithPunctuation ? '-ml-[0.16em]' : undefined}>
              {segment.text}
            </span>
          )
        }

        // Under reduced motion every phrase is marked at once — the emphasis
        // is still communicated, it just doesn't move.
        const on = reduced || phraseIndexes[active] === index

        /*
         * The fill is a real backgroundColor on the text itself, not a shape
         * sitting behind it. A sibling would look identical and let a
         * sweep-in animation clip nicely — but every automated contrast check,
         * ours included, resolves a background by walking ancestors, so it
         * would measure ink on navy at 2.2:1 and be right to fail it. The
         * cross-fade below is the honest version of the same effect.
         *
         * The horizontal padding is applied whether or not the phrase is
         * marked, so the sentence never reflows as the marker moves.
         */
        return (
          <span
            key={index}
            className="inline-block whitespace-nowrap rounded-[var(--r-sm)] px-[0.16em] font-black transition-[background-color,color] duration-[420ms] ease-[var(--ease-out)]"
            style={{
              backgroundColor: on ? segment.hue : 'transparent',
              color: on ? 'var(--gk-ink)' : 'inherit',
            }}
          >
            {segment.text}
          </span>
        )
      })}
    </span>
  )
}
