import { useReducedMotion } from '@/hooks/use-reduced-motion'
import type { PartnerLogo } from '@/content/types'
import { cn } from '@/lib/utils'

export type LogoGroup = { label: string; logos: Array<PartnerLogo> }

/**
 * One labelled marquee rail per group. Runs continuously, pausing only on
 * focus-within so a keyboard user is not chasing a moving target. Under
 * reduced motion each group is a static wrapped grid.
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

function LogoTile({ logo, tabbable = true }: { logo: PartnerLogo; tabbable?: boolean }) {
  return (
    <img
      src={`/logos/${logo.file}`}
      alt={logo.name}
      loading="lazy"
      decoding="async"
      tabIndex={tabbable ? 0 : -1}
      width={228}
      height={112}
      className="h-20 w-[172px] object-contain md:h-28 md:w-[228px]"
    />
  )
}

export function LogoTicker({ groups }: { groups: Array<LogoGroup> }) {
  const reduced = useReducedMotion()

  return (
    <div className="flex flex-col gap-8 md:gap-10">
      {groups.map((group, index) => (
        <section key={group.label} aria-label={group.label} className="flex flex-col gap-3 md:gap-4">
          <h3 className="shell text-center text-[length:var(--fs-sm)] font-[var(--w-bold)] tracking-[var(--tracking-label)] text-[var(--fg-2)] uppercase">
            {group.label}
          </h3>
          {reduced ? (
            <ul className="shell grid grid-cols-3 items-center justify-items-center gap-x-6 gap-y-8 sm:grid-cols-4 md:grid-cols-6">
              {group.logos.map((logo) => (
                <li key={logo.file}>
                  <LogoTile logo={logo} />
                </li>
              ))}
            </ul>
          ) : (
            <Rail
              logos={group.logos}
              direction={index % 2 === 0 ? 'left' : 'right'}
              durationSeconds={index % 2 === 0 ? 68 : 82}
            />
          )}
        </section>
      ))}
    </div>
  )
}
