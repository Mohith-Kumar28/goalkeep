import type { CSSProperties, ReactNode } from 'react'
import { cn } from '@/lib/utils'

/**
 * A highlighter swipe behind a run of text.
 *
 * "Instead of just applying hard background colours using the brand colour,
 * use this highlight effect" — a real marker stroke: chisel-cut ends, wobbling
 * edges, ink that pools dark in places and thins in others, and a degree of
 * tilt. The drawing itself is in `styles.css` under `.marker`; this component
 * exists to carry the hue, the on/off state and the one thing the audit needs.
 *
 * `data-marker="on"` plus the resolved `--marker-hue` is how
 * `check-contrast.mjs` learns what colour is actually behind the text. The ink
 * is painted by a pseudo-element, and a pseudo-element is invisible to the
 * audit's DOM sweep — without this it would walk past the swipe to the band
 * behind it and report ink-on-navy for a word sitting on gold.
 */
export function Marker({
  children,
  /** Any brand token. Defaults to the gold. */
  hue,
  /** For swipes on a dark ground: lightens the mottling so it doesn't go grey. */
  onDark = false,
  /** Second stroke shape, so two markers near each other aren't identical. */
  variant = 'a',
  /** Lets the stroke arrive — used by the audiences band. */
  on = true,
  className,
  style,
}: {
  children: ReactNode
  hue?: string
  onDark?: boolean
  variant?: 'a' | 'b'
  on?: boolean
  className?: string
  style?: CSSProperties
}) {
  return (
    <span
      className={cn(
        'marker',
        variant === 'b' && 'marker-b',
        onDark && 'marker-light',
        className,
      )}
      data-marker={on ? 'on' : 'off'}
      style={
        {
          ...(hue ? { '--marker-hue': hue } : null),
          ...(onDark ? { color: 'var(--gk-navy)' } : null),
          '--marker-on': on ? 1 : 0,
          ...style,
        } as CSSProperties
      }
    >
      {children}
    </span>
  )
}
