import type { PartnerLogo } from '@/content/types'
import { cn } from '@/lib/utils'

export type LogoGroup = { label: string; logos: Array<PartnerLogo> }

/**
 * One labelled marquee rail per group. Runs continuously, pausing only on
 * focus-within so a keyboard user is not chasing a moving target. Under
 * reduced motion each group is a static wrapped grid instead.
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
    <div className="group/rail ticker-mask relative overflow-hidden">
      <ul
        className={cn(
          'flex w-max items-center gap-10 md:gap-16',
          'motion-safe:animate-[gk-marquee_linear_infinite]',
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
  className = 'h-20 w-[172px] md:h-28 md:w-[228px]',
}: {
  logo: PartnerLogo
  tabbable?: boolean
  className?: string
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
              durationSeconds={index % 2 === 0 ? 68 : 82}
            />
          </div>
        </section>
      ))}
    </div>
  )
}
