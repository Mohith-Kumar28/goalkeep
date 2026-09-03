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
function Rail({
  logos,
  direction,
  durationSeconds,
}: {
  logos: Array<PartnerLogo>
  direction: 'left' | 'right'
  durationSeconds: number
}) {
  // Duplicated once so the translation wraps seamlessly at -50%.
  const track = [...logos, ...logos]

  return (
    <div className="group/rail relative overflow-hidden">
      <ul
        className={cn(
          'flex w-max items-center gap-10 md:gap-16',
          'motion-safe:animate-[gk-marquee_linear_infinite]',
          'group-hover/rail:[animation-play-state:paused]',
          'group-focus-within/rail:[animation-play-state:paused]',
        )}
        style={{
          animationDuration: `${durationSeconds}s`,
          animationDirection: direction === 'right' ? 'reverse' : 'normal',
        }}
      >
        {track.map((logo, index) => (
          <li key={`${logo.file}-${index}`} aria-hidden={index >= logos.length}>
            <LogoTile logo={logo} tabbable={index < logos.length} />
          </li>
        ))}
      </ul>
    </div>
  )
}

function LogoTile({
  logo,
  tabbable = true,
}: {
  logo: PartnerLogo
  tabbable?: boolean
}) {
  return (
    <img
      src={`/logos/${logo.file}`}
      alt={logo.name}
      loading="lazy"
      decoding="async"
      tabIndex={tabbable ? 0 : -1}
      width={220}
      height={112}
      className={cn(
        // A fixed box with object-contain normalises marks that each sit at
        // their own scale inside a square source file. Sized up per the
        // feedback ("make slightly bigger") — h-14/h-20 was reading timid.
        'h-20 w-[168px] object-contain md:h-28 md:w-[220px]',
        // Full colour by default. Greyscaling other organisations' marks to
        // protect our own palette was the wrong trade: these logos are the
        // credibility, and a wall of grey reads as a stock placeholder.
        'transition-transform duration-[var(--dur-base)] ease-[var(--ease-pop)]',
        'hover:scale-[1.06] focus-visible:scale-[1.06]',
      )}
    />
  )
}

export function LogoTicker({
  rowOne,
  rowTwo,
}: {
  rowOne: Array<PartnerLogo>
  rowTwo: Array<PartnerLogo>
}) {
  const reduced = useReducedMotion()

  // Under reduced motion the rails can't scroll, and stacking every mark
  // turns the band into the exhausting logo wall this design set out to
  // avoid. One representative grid says the same thing in a fraction of the
  // height — the count beside it already gives the real number.
  if (reduced) {
    return (
      <div className="shell">
        <ul className="grid grid-cols-3 items-center justify-items-center gap-x-6 gap-y-8 sm:grid-cols-4 md:grid-cols-6">
          {[...rowOne, ...rowTwo].slice(0, 12).map((logo) => (
            <li key={logo.file}>
              <LogoTile logo={logo} />
            </li>
          ))}
        </ul>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3 md:gap-4">
      {/* 68s and 82s: near-coprime, so the two rows never lock into sync. */}
      <Rail logos={rowOne} direction="left" durationSeconds={68} />
      <Rail logos={rowTwo} direction="right" durationSeconds={82} />
    </div>
  )
}
