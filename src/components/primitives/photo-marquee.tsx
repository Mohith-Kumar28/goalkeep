import { useReducedMotion } from "@/hooks/use-reduced-motion"
import { cn } from "@/lib/utils"

export type MarqueePhoto = {
  src: string
  alt: string
}

/**
 * A slow, full-bleed photo strip with nothing to click.
 *
 * It replaces the carousel in the audience section after the 23 Sep review:
 * "no need for left-right cards, nothing - it should just seem like a photo
 * gallery of work done and can occupy the full screen." Same marquee as the
 * partner logos. It never pauses ("the scroller should be continuous", 28 Sep
 * review); under reduced motion it is a static row that scrolls sideways by
 * hand. The org-and-location captions came off in the 30 Sep content doc:
 * "just plain image scroller is fine."
 */
export function PhotoMarquee({
  photos,
  durationSeconds = 60,
  compact = false,
  className,
}: {
  photos: Array<MarqueePhoto>
  durationSeconds?: number
  /** Shorter cards, for a band that has to fit one screen. */
  compact?: boolean
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
        "relative overflow-hidden",
        reduced && "overflow-x-auto",
        className
      )}
    >
      <ul
        className={cn(
          "flex w-max gap-5 md:gap-6",
          !reduced &&
            "animate-[gk-marquee_linear_infinite]"
        )}
        /* Reversed, so the strip travels left to right - "moving right across
           to the end of the page". */
        style={{ animationDuration: `${durationSeconds}s`, animationDirection: 'reverse' }}
      >
        {track.map((photo, index) => (
          <li
            key={`${photo.src}-${index}`}
            aria-hidden={index >= base.length}
            className={cn(
              "relative w-[78vw] shrink-0 overflow-hidden rounded-[var(--r-lg)] sm:w-[22rem]",
              compact ? "md:w-[24rem]" : "md:w-[26rem] lg:w-[28rem]"
            )}
          >
            <img
              src={photo.src}
              alt={index >= base.length ? "" : photo.alt}
              loading="lazy"
              decoding="async"
              className={cn("w-full object-cover", compact ? "aspect-[3/2]" : "aspect-[4/3]")}
            />
          </li>
        ))}
      </ul>
    </div>
  )
}
