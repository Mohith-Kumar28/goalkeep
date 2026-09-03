import { cn } from '@/lib/utils'

/**
 * The real wordmark, from the brand Drive.
 *
 * This replaces the hand-drawn TSX stand-in that shipped in v0 — that version
 * was a faithful reconstruction from the brand book's *description*, and it
 * showed: the donut sat wrong inside the bowl and the letterforms were Nunito
 * pretending to be a logotype.
 *
 * Two files rather than one recolourable SVG, because the four ring segments
 * keep their own hues in both versions while only the letters change.
 */
export function Wordmark({
  className,
  inverse = false,
}: {
  className?: string
  inverse?: boolean
}) {
  return (
    <img
      src={inverse ? '/wordmark-white.webp' : '/wordmark-ink.webp'}
      alt="Goalkeep"
      width={673}
      height={160}
      className={cn('h-8 w-auto select-none md:h-9', className)}
    />
  )
}
