import type { CSSProperties } from 'react'
import type { PartnerLogo } from '@/content/types'
import { cn } from '@/lib/utils'

export type LogoGroup = { label: string; logos: Array<PartnerLogo> }

/**
 * One labelled marquee rail per group. Runs continuously, pausing only on
 * focus-within so a keyboard user is not chasing a moving target. Under
 * reduced motion each group is a static wrapped grid instead.
 */
/* Pixels per second, the same for every row. 11 Nov: every rail moves at the
   pace the Funders & intermediaries row had. */
const RAIL_SPEED = { phone: 15.5, wide: 21.4 }

function Rail({
  logos,
  direction,
}: {
  logos: Array<PartnerLogo>
  direction: 'left' | 'right'
}) {
  // Duplicated once so the translation wraps seamlessly at -50%.
  const track = [...logos, ...logos]

  return (
    <div className="group/rail ticker-mask relative overflow-hidden max-md:[mask-image:linear-gradient(to_right,transparent,#000_20px,#000_calc(100%-20px),transparent)]">
      <ul
        className={cn(
          /* --pitch is a tile's width plus the gap, so the duration below
             holds the speed whatever the spacing. The trailing padding is
             the last tile's gap, so -50% is exactly one set of logos. */
          'flex w-max items-center gap-3 pr-3 [--pitch:108] [--speed:var(--speed-phone)] md:gap-16 md:pr-16 md:[--pitch:292] md:[--speed:var(--speed-wide)]',
          'motion-safe:animate-[gk-marquee_linear_infinite]',
          'group-focus-within/rail:[animation-play-state:paused]',
        )}
        style={
          {
            '--logos': logos.length,
            '--speed-phone': RAIL_SPEED.phone,
            '--speed-wide': RAIL_SPEED.wide,
            animationDuration: 'calc(var(--logos) * var(--pitch) / var(--speed) * 1s)',
            animationDirection: direction === 'right' ? 'reverse' : 'normal',
          } as CSSProperties
        }
      >
        {track.map((logo, index) => (
          <li key={`${logo.file}-${index}`} aria-hidden={index >= logos.length}>
            <LogoTile logo={logo} tabbable={index < logos.length} className="h-12 w-[96px] md:h-28 md:w-[228px]" />
          </li>
        ))}
      </ul>
    </div>
  )
}

function LogoTile({
  logo,
  tabbable = true,
  className,
}: {
  logo: PartnerLogo
  tabbable?: boolean
  className: string
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
      className={cn('object-contain', className)}
    />
  )
}

export function LogoTicker({ groups }: { groups: Array<LogoGroup> }) {
  return (
    <div className="flex flex-col gap-8 md:gap-10">
      {groups.map((group, index) => (
        <section key={group.label} aria-label={group.label} className="flex flex-col gap-3 md:gap-4">
          <h3 className="shell text-center text-[length:var(--fs-sm)] font-[var(--w-bold)] tracking-[var(--tracking-label)] text-[var(--fg-2)] uppercase">
            {group.label}
          </h3>
          {/* Both layouts render and CSS picks one, so the server render and
              first paint already have the final height. */}
          <ul className="shell hidden flex-wrap items-center justify-center gap-x-4 gap-y-3 motion-reduce:flex md:gap-x-6 md:gap-y-6">
            {group.logos.map((logo) => (
              <li key={logo.file}>
                <LogoTile logo={logo} className="h-16 w-[104px] md:h-24 md:w-[150px]" />
              </li>
            ))}
          </ul>
          <div className="motion-reduce:hidden">
            <Rail
              logos={group.logos}
              direction={index % 2 === 0 ? 'left' : 'right'}
            />
          </div>
        </section>
      ))}
    </div>
  )
}
