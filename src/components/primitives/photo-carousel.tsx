import Autoplay from 'embla-carousel-autoplay'
import useEmblaCarousel from 'embla-carousel-react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { useReducedMotion } from '@/hooks/use-reduced-motion'

export type CarouselPhoto = {
  src: string
  alt: string
  /** Rendered on the chip over the image. */
  org: string
  location: string
}

/**
 * The looping photo strip asked for in the feedback: real partner sites,
 * captioned with who and where.
 *
 * The caption is the reason this exists rather than a decorative slider — an
 * unlabelled carousel of nice photographs says nothing, and a labelled one is
 * a list of the organisations we've worked with that happens to be visual.
 *
 * Autoplay is dropped entirely under reduced motion, and pauses on hover and
 * on keyboard focus so it can't run away from someone reading a caption.
 */
export function PhotoCarousel({
  photos,
  className,
}: {
  photos: Array<CarouselPhoto>
  className?: string
}) {
  const reduced = useReducedMotion()
  const [emblaRef, embla] = useEmblaCarousel(
    { loop: true, align: 'start', dragFree: false },
    reduced ? [] : [Autoplay({ delay: 3400, stopOnInteraction: false, stopOnMouseEnter: true })],
  )
  const [selected, setSelected] = useState(0)

  const onSelect = useCallback(() => {
    if (embla) setSelected(embla.selectedScrollSnap())
  }, [embla])

  useEffect(() => {
    if (!embla) return
    onSelect()
    embla.on('select', onSelect)
    return () => {
      embla.off('select', onSelect)
    }
  }, [embla, onSelect])

  return (
    <div className={cn('relative', className)}>
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-5">
          {photos.map((photo) => (
            <figure
              key={photo.src}
              className="relative min-w-0 shrink-0 basis-[86%] sm:basis-[52%] lg:basis-[34%]"
            >
              <div className="card-lift relative overflow-hidden rounded-[var(--r-lg)] border-2 border-[var(--gk-ink)]">
                <img
                  src={photo.src}
                  alt={photo.alt}
                  loading="lazy"
                  decoding="async"
                  className="aspect-[4/3] w-full object-cover"
                />
              </div>
              <figcaption className="chip absolute bottom-4 left-4 border-2 border-[var(--gk-ink)] bg-[var(--gk-cream)] text-[var(--gk-ink)]">
                <span className="font-extrabold">{photo.org}</span>
                <span aria-hidden="true" className="opacity-40">
                  ·
                </span>
                <span className="font-medium">{photo.location}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>

      <div className="mt-6 flex items-center gap-3">
        <CarouselButton label="Previous" onClick={() => embla?.scrollPrev()}>
          <ArrowLeft aria-hidden="true" strokeWidth={2.5} className="size-5" />
        </CarouselButton>
        <CarouselButton label="Next" onClick={() => embla?.scrollNext()}>
          <ArrowRight aria-hidden="true" strokeWidth={2.5} className="size-5" />
        </CarouselButton>

        <ol className="ml-2 flex gap-2" aria-hidden="true">
          {photos.map((photo, index) => (
            <li
              key={photo.src}
              className="h-[6px] rounded-full transition-all duration-[var(--dur-base)] ease-[var(--ease-out)]"
              style={{
                width: index === selected ? 30 : 12,
                background:
                  index === selected ? 'var(--band-accent)' : 'var(--band-hairline)',
              }}
            />
          ))}
        </ol>
      </div>
    </div>
  )
}

function CarouselButton({
  label,
  onClick,
  children,
}: {
  label: string
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="inline-flex size-11 items-center justify-center rounded-full border-2 border-[var(--gk-ink)] bg-[var(--gk-cream)] text-[var(--gk-ink)] shadow-[var(--shadow-pop-sm)] transition-[transform,box-shadow] duration-[var(--dur-base)] ease-[var(--ease-pop)] hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-[var(--shadow-pop)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
    >
      {children}
    </button>
  )
}
