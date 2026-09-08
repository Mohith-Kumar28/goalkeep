import { Fragment, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Marker } from './marker'

/**
 * A highlighter stroke over a run of prose long enough to wrap.
 *
 * `Marker` draws one stroke over one phrase. That is the right shape for a
 * phrase and the wrong shape for a sentence: the stroke is an
 * absolutely-positioned, masked pseudo-element behind an inline-block, so it
 * cannot break across lines, and `transform` — which is where the tilt and the
 * chisel skew come from — does not apply to a non-replaced inline box at all.
 * There is no flat-CSS version of the effect that survives a line break.
 *
 * What does survive is one stroke per line, which is also what somebody with a
 * highlighter actually leaves behind on a wrapped paragraph: separate passes,
 * each tilted slightly differently, not one rectangle.
 *
 * So this measures where the browser broke the run and then re-renders it as
 * one `Marker` per line:
 *
 *   1. First pass renders the words plain, each in its own span.
 *   2. A layout effect groups the spans by `offsetTop` — words sharing a top
 *      are on the same line — and stores the lines.
 *   3. Second pass renders one `.marker .marker-line` per line.
 *
 * The lines have to break in exactly the same places on the second pass or the
 * whole paragraph reflows under the strokes, which is why `.marker-line` zeroes
 * the inline padding and margin that `.marker` normally carries: a marked line
 * occupies precisely the width the plain words did.
 *
 * The first pass is also what the server renders, so hydration matches and the
 * strokes arrive a frame later — before paint on the client, since the
 * measurement runs in a layout effect.
 */
const useIsomorphicLayoutEffect =
  typeof window === 'undefined' ? useEffect : useLayoutEffect

export function MarkerText({
  children,
  hue,
}: {
  /** The run to mark. Plain text — it is split on whitespace to be measured. */
  children: string
  hue?: string
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const [lines, setLines] = useState<Array<string> | null>(null)

  const words = children.split(/\s+/).filter(Boolean)

  useIsomorphicLayoutEffect(() => {
    if (lines !== null) return
    const node = ref.current
    if (!node) return

    const spans = node.querySelectorAll<HTMLElement>('[data-word]')
    if (!spans.length) return

    const groups: Array<Array<string>> = []
    let top: number | null = null

    spans.forEach((span) => {
      /* A sub-pixel tolerance, because a line that contains a taller inline —
         punctuation in a different font, say — can report a fractionally
         different top for words that are visually on the same line. */
      if (top === null || Math.abs(span.offsetTop - top) > 1) {
        groups.push([])
        top = span.offsetTop
      }
      groups[groups.length - 1].push(span.textContent)
    })

    setLines(groups.map((group) => group.join(' ')))
  }, [lines, children])

  /*
   * Re-measure when the column changes width, and only then. Watching the
   * paragraph's height instead would loop: dropping back to the unmarked pass
   * can change the height, which would trigger another measurement.
   */
  useEffect(() => {
    const node = ref.current?.parentElement
    if (!node || typeof ResizeObserver === 'undefined') return

    let width = node.getBoundingClientRect().width
    const observer = new ResizeObserver(([entry]) => {
      const next = entry.contentRect.width
      if (Math.abs(next - width) < 1) return
      width = next
      setLines(null)
    })
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  if (lines === null) {
    return (
      <span ref={ref}>
        {words.map((word, index) => (
          /* The separator sits outside the span, so `textContent` is the word
             and nothing else when the lines are joined back together. */
          <Fragment key={`${word}-${index}`}>
            <span data-word="">{word}</span>
            {index < words.length - 1 ? ' ' : null}
          </Fragment>
        ))}
      </span>
    )
  }

  return (
    <span ref={ref}>
      {lines.map((line, index) => (
        <Fragment key={`${line}-${index}`}>
          {/* The two stroke shapes alternate so consecutive lines are not
              identical swipes — the same reason `.marker-b` exists at all. */}
          <Marker
            hue={hue}
            variant={index % 2 ? 'b' : 'a'}
            className="marker-line"
          >
            {line}
          </Marker>
          {/* A real space, so the run still breaks between the strokes and
              still reads as one sentence. It collapses at the end of a line,
              which is where every one of these lands. */}
          {index < lines.length - 1 ? ' ' : null}
        </Fragment>
      ))}
    </span>
  )
}
