import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

const SEGMENTS = 5

/**
 * Horizontal card scroller shared by the case-study and field-note bands.
 *
 * Scrollability is communicated by the cut-off card at the right edge, not by
 * a decorative cue. Arrows are a convenience on desktop; on mobile the thumb
 * does the work and they're hidden.
 *
 * The position rail below is a derivation of the wordmark's five-segment
 * donut: always five segments regardless of card count, because it's a
 * position scale rather than a counter — and always monochrome, since the
 * five brand colours together would be four accents in one composition.
 */
export function CardRail({
  children,
  label,
  className,
  controlsClassName,
}: {
  children: React.ReactNode
  /** Names the rail for screen readers, e.g. "Case studies". */
  label: string
  className?: string
  /** The rail runs full-bleed, so the controls row carries its own padding. */
  controlsClassName?: string
}) {
  const railRef = useRef<HTMLDivElement>(null)
  const [progress, setProgress] = useState(0)
  const [atStart, setAtStart] = useState(true)
  const [atEnd, setAtEnd] = useState(false)

  const measure = useCallback(() => {
    const el = railRef.current
    if (!el) return

    const max = el.scrollWidth - el.clientWidth
    const ratio = max > 0 ? el.scrollLeft / max : 0

    setProgress(ratio)
    setAtStart(el.scrollLeft <= 1)
    setAtEnd(el.scrollLeft >= max - 1)
  }, [])

  useEffect(() => {
    measure()
    const el = railRef.current
    if (!el) return

    el.addEventListener('scroll', measure, { passive: true })
    window.addEventListener('resize', measure)
    return () => {
      el.removeEventListener('scroll', measure)
      window.removeEventListener('resize', measure)
    }
  }, [measure])

  const nudge = (direction: -1 | 1) => {
    const el = railRef.current
    if (!el) return
    // One card plus its gap, derived from the first child so the step
    // stays correct across breakpoints.
    const card = el.firstElementChild as HTMLElement | null
    const step = card ? card.offsetWidth + 24 : el.clientWidth * 0.8
    el.scrollBy({ left: direction * step, behavior: 'smooth' })
  }

  const filled = Math.round(progress * (SEGMENTS - 1))

  return (
    <div className={cn('flex flex-col gap-4', className)}>
      <div className={cn('hidden justify-end gap-3 md:flex', controlsClassName)}>
        <RailButton
          onClick={() => nudge(-1)}
          disabled={atStart}
          label={`Scroll ${label} left`}
        >
          <ArrowLeft aria-hidden="true" strokeWidth={1.75} className="size-5" />
        </RailButton>
        <RailButton
          onClick={() => nudge(1)}
          disabled={atEnd}
          label={`Scroll ${label} right`}
        >
          <ArrowRight aria-hidden="true" strokeWidth={1.75} className="size-5" />
        </RailButton>
      </div>

      <div
        ref={railRef}
        className="card-rail"
        role="region"
        aria-label={label}
        tabIndex={0}
      >
        {children}
      </div>

      {/* Five-segment position rail. */}
      <div aria-hidden="true" className="flex gap-[2px]">
        {Array.from({ length: SEGMENTS }).map((_, i) => (
          <span
            key={i}
            className="h-[3px] w-12 transition-colors duration-[var(--dur-base)] ease-[var(--ease-out)]"
            style={{
              backgroundColor:
                i <= filled ? 'var(--band-accent)' : 'var(--hairline)',
            }}
          />
        ))}
      </div>
    </div>
  )
}

function RailButton({
  onClick,
  disabled,
  label,
  children,
}: {
  onClick: () => void
  disabled: boolean
  label: string
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className={cn(
        'grid size-11 place-items-center rounded-[var(--r-md)]',
        'border-[1.5px] border-[var(--gk-ink)] text-[var(--gk-ink)]',
        'transition-colors duration-[var(--dur-fast)] ease-[var(--ease-out)]',
        'hover:bg-[var(--hairline)]',
        'disabled:border-[var(--hairline)] disabled:text-[var(--gk-ink)] disabled:hover:bg-transparent',
      )}
    >
      {children}
    </button>
  )
}
