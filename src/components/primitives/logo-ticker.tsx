import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from '@/hooks/use-reduced-motion'
import type { PartnerLogo } from '@/content/types'
import { cn } from '@/lib/utils'

/**
 * One marquee rail.
 *
 * Pauses on hover AND focus-within — a visitor who wants to read a partner's
 * name can stop it, which is the accessibility fix for marquees and the one
 * hover behaviour on this page that hands control to the user rather than
 * performing at them.
 *
 * Under reduced motion the rail renders as a static wrapped grid: same
 * information, no movement, no duplicated DOM.
 */
/**
 * `color` runs the marks in their own colours and never pauses - the 23 Sep
 * review's variant ("it doesn't have to be a stop effect… just make it a
 * coloured variation and it can keep going"). `mono` is the greyscale,
 * colour-on-hover rail the page shipped with. Both exist while the client
 * compares them. `reveal` is the third option from the doc - greyscale that
 * turns to colour as the band scrolls into view, then keeps running.
 */
export type TickerTone = 'color' | 'mono' | 'reveal'

function Rail({
  logos,
  direction,
  durationSeconds,
  tone,
  lit,
}: {
  logos: Array<PartnerLogo>
  direction: 'left' | 'right'
  durationSeconds: number
  tone: TickerTone
  lit: boolean
}) {
  // Duplicated once so the translation wraps seamlessly at -50%.
  const track = [...logos, ...logos]

  return (
    <div className="group/rail relative overflow-hidden">
      <ul
        className={cn(
          'flex w-max items-center gap-10 md:gap-16',
          'motion-safe:animate-[gk-marquee_linear_infinite]',
          tone === 'mono' && 'group-hover/rail:[animation-play-state:paused]',
          'group-focus-within/rail:[animation-play-state:paused]',
        )}
        style={{
          animationDuration: `${durationSeconds}s`,
          animationDirection: direction === 'right' ? 'reverse' : 'normal',
        }}
      >
        {track.map((logo, index) => (
          <li key={`${logo.file}-${index}`} aria-hidden={index >= logos.length}>
            <LogoTile logo={logo} tone={tone} lit={lit} tabbable={index < logos.length} />
          </li>
        ))}
      </ul>
    </div>
  )
}

function LogoTile({
  logo,
  tone,
  lit = true,
  tabbable = true,
}: {
  logo: PartnerLogo
  tone: TickerTone
  /** Only read by `reveal`: whether the band has scrolled into view yet. */
  lit?: boolean
  tabbable?: boolean
}) {
  return (
    <img
      src={`/logos/${logo.file}`}
      alt={logo.name}
      loading="lazy"
      decoding="async"
      tabIndex={tabbable ? 0 : -1}
      width={228}
      height={112}
      className={cn(
        // A fixed box with object-contain normalises marks that each sit at
        // their own scale inside a square source file. Sized up per the
        // feedback ("make slightly bigger").
        'h-20 w-[172px] object-contain md:h-28 md:w-[228px]',
        // "I kind of like the black and white thing and then it pops into
        // colour when you're hovering." v2 ran these at full colour; greyscale
        // is also what stops 27 other organisations' palettes from fighting
        // ours across the width of the band.
        tone === 'mono' && [
          'opacity-75 grayscale',
          'transition-[filter,opacity] duration-[var(--dur-base)] ease-[var(--ease-out)]',
          'hover:opacity-100 hover:grayscale-0',
          'focus-visible:opacity-100 focus-visible:grayscale-0',
        ],
        tone === 'reveal' && [
          'transition-[filter,opacity] duration-[1400ms] ease-[var(--ease-out)]',
          lit ? 'opacity-100 grayscale-0' : 'opacity-75 grayscale',
        ],
      )}
    />
  )
}

export function LogoTicker({
  rowOne,
  rowTwo,
  tone = 'mono',
}: {
  rowOne: Array<PartnerLogo>
  rowTwo: Array<PartnerLogo>
  tone?: TickerTone
}) {
  const reduced = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const [lit, setLit] = useState(false)

  useEffect(() => {
    if (tone !== 'reveal') return
    const node = ref.current
    if (!node) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setLit(true)
          observer.disconnect()
        }
      },
      { threshold: 0.6 },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [tone])

  // Under reduced motion the rails can't scroll, and stacking every mark
  // turns the band into the exhausting logo wall this design set out to
  // avoid. One representative grid says the same thing in a fraction of the
  // height.
  if (reduced) {
    return (
      <div className="shell" ref={ref}>
        <ul className="grid grid-cols-3 items-center justify-items-center gap-x-6 gap-y-8 sm:grid-cols-4 md:grid-cols-6">
          {[...rowOne, ...rowTwo].slice(0, 12).map((logo) => (
            <li key={logo.file}>
              <LogoTile logo={logo} tone={tone} lit={lit} />
            </li>
          ))}
        </ul>
      </div>
    )
  }

  return (
    <div ref={ref} className="flex flex-col gap-4 md:gap-6">
      {/* 68s and 82s: near-coprime, so the two rows never lock into sync. */}
      <Rail logos={rowOne} direction="left" durationSeconds={68} tone={tone} lit={lit} />
      <Rail logos={rowTwo} direction="right" durationSeconds={82} tone={tone} lit={lit} />
    </div>
  )
}
