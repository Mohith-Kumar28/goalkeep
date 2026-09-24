import { useReducedMotion } from "@/hooks/use-reduced-motion"
import { cn } from "@/lib/utils"

export type MarqueePhoto = {
  src: string
  alt: string
  org: string
  location: string
}

/*
 * The location chip cycles through the light brand colours - "more pop of
 * colour… keep the location with the light brand colour backgrounds: green,
 * coral and yellow."
 */
const CHIP_FILLS = [
  "var(--gk-yellow)",
  "var(--gk-teal-lift)",
  "var(--gk-coral-lift)",
]

/**
 * A slow, full-bleed photo strip with nothing to click.
 *
 * It replaces the carousel in the audience section after the 23 Sep review:
 * "no need for left-right cards, nothing - it should just seem like a photo
 * gallery of work done and can occupy the full screen." Same marquee as the
 * partner logos, and the same accessibility contract: pauses on hover, and
 * under reduced motion it is a static row that scrolls sideways by hand.
 */
export function PhotoMarquee({
  photos,
  durationSeconds = 60,
  className,
}: {
  photos: Array<MarqueePhoto>
  durationSeconds?: number
  className?: string
}) {
  const reduced = useReducedMotion()
  // Two copies, so the -50% translation wraps without a seam. A short set is
  // repeated first so one copy is always wider than the viewport.
  const base = photos.length < 6 ? [...photos, ...photos] : photos
  const track = reduced ? photos : [...base, ...base]

  return (
    <div
      className={cn(
        "group/marquee relative overflow-hidden",
        reduced && "overflow-x-auto",
        className
      )}
    >
      <ul
        className={cn(
          "flex w-max gap-5 md:gap-6",
          !reduced &&
            "animate-[gk-marquee_linear_infinite] group-hover/marquee:[animation-play-state:paused]"
        )}
        /* Reversed, so the strip travels left to right - "moving right across
           to the end of the page". */
        style={{ animationDuration: `${durationSeconds}s`, animationDirection: 'reverse' }}
      >
        {track.map((photo, index) => (
          <li
            key={`${photo.src}-${index}`}
            aria-hidden={index >= base.length}
            className="relative w-[78vw] shrink-0 overflow-hidden rounded-[var(--r-lg)] sm:w-[22rem] md:w-[26rem] lg:w-[28rem]"
          >
            <img
              src={photo.src}
              alt={index >= base.length ? "" : photo.alt}
              loading="lazy"
              decoding="async"
              className="aspect-[4/3] w-full object-cover"
            />
            <div
              data-ground="scrim"
              className="absolute inset-x-0 bottom-0 flex flex-wrap items-center gap-2 bg-gradient-to-t from-black/70 via-black/35 to-transparent p-4 pt-12"
            >
              <span className="text-[length:var(--fs-base)] font-extrabold text-white">
                {photo.org}
              </span>
              <span
                className="chip text-[length:var(--fs-xs)] text-[var(--gk-ink)]"
                style={{ background: CHIP_FILLS[index % CHIP_FILLS.length] }}
              >
                {photo.location}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
