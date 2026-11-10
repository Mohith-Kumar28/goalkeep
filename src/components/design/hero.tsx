import { useRouterState } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import type { ReactNode, TouchEvent } from 'react'
import { themeForPath } from '@/content/site'
import type { PageTheme } from '@/content/site'
import { useReducedMotion } from '@/hooks/use-reduced-motion'
import { ChevronSideIcon } from './icons'

export type HeroPhoto = {
  src: string
  alt: string
  /** CSS object-position. The design uses "50% 45%" unless a crop needs help. */
  position?: string
}

const AUTOPLAY_MS = 5000
const SWIPE_PX = 40

export function HeroCarousel({ photos, label }: { photos: Array<HeroPhoto>; label: string }) {
  const [index, setIndex] = useState(0)
  const [autoplay, setAutoplay] = useState(true)
  const reduced = useReducedMotion()
  const count = photos.length

  useEffect(() => {
    if (!autoplay || reduced || count < 2) return
    const timer = setInterval(() => setIndex((current) => (current + 1) % count), AUTOPLAY_MS)
    return () => clearInterval(timer)
  }, [autoplay, reduced, count])

  /* Choosing a photo by hand ends autoplay for good, as in the export. */
  const go = (next: number) => {
    setAutoplay(false)
    setIndex((next + count) % count)
  }

  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null)
  const onTouchEnd = (event: TouchEvent<HTMLDivElement>) => {
    if (!touchStart) return
    const touch = event.changedTouches[0]
    const dx = touch.clientX - touchStart.x
    const dy = touch.clientY - touchStart.y
    setTouchStart(null)
    if (Math.abs(dx) > SWIPE_PX && Math.abs(dx) > Math.abs(dy)) go(index + (dx < 0 ? 1 : -1))
  }

  return (
    <div>
      <div
        role="region"
        aria-roledescription="carousel"
        aria-label={label}
        className="dc-carousel-frame"
        onTouchStart={(event) => setTouchStart({ x: event.touches[0].clientX, y: event.touches[0].clientY })}
        onTouchEnd={onTouchEnd}
      >
        <div className="dc-carousel-track" style={{ transform: `translateX(${-index * 100}%)` }}>
          {photos.map((photo, i) => (
            <img
              key={photo.src}
              src={photo.src}
              alt={photo.alt}
              aria-hidden={i === index ? undefined : true}
              style={{
                flex: '0 0 100%',
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: photo.position ?? '50% 45%',
                display: 'block',
              }}
            />
          ))}
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 16 }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {photos.map((photo, i) => (
            <button
              key={photo.src}
              type="button"
              className="dc-carousel-dot"
              aria-label={`Show photo ${i + 1} of ${count}`}
              aria-current={i === index}
              onClick={() => go(i)}
            >
              <span />
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button type="button" className="dc-carousel-ctl" aria-label="Previous photo" onClick={() => go(index - 1)}>
            <ChevronSideIcon direction="left" />
          </button>
          <button type="button" className="dc-carousel-ctl" aria-label="Next photo" onClick={() => go(index + 1)}>
            <ChevronSideIcon direction="right" />
          </button>
        </div>
      </div>
    </div>
  )
}

type DesignHeroProps = {
  /** Defaults to the colour the nav gives this page, so hero and header agree. */
  theme?: PageTheme
  /** Use <em> for the italic run and <br className="dc-br-d" /> for the desktop breaks. */
  headline: ReactNode
  lead: ReactNode
  /** The pill under the lead (a date, a format). */
  badge?: ReactNode
  /** <Cta> elements. */
  actions?: ReactNode
  photos: Array<HeroPhoto>
  carouselLabel?: string
  paddingTop?: number
  actionsMarginTop?: number
}

export function DesignHero({
  theme,
  headline,
  lead,
  badge,
  actions,
  photos,
  carouselLabel = 'Photos from Goalkeep engagements',
  paddingTop = 44,
  actionsMarginTop = 24,
}: DesignHeroProps) {
  const pathname = useRouterState({ select: (state) => state.location.pathname })
  return (
    <section className="dc-hero dc-on-navy" data-theme={theme ?? themeForPath(pathname)}>
      <div
        className="dc-shell dc-hero-split"
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0,1fr) minmax(0,520px)',
          gap: 40,
          alignItems: 'center',
          paddingTop,
          paddingBottom: 60,
        }}
      >
        <div>
          <h1
            className="dc-h1"
            style={{ fontSize: 52, fontWeight: 500, lineHeight: 1.08, letterSpacing: '-0.02em', margin: 0 }}
          >
            {headline}
          </h1>
          <p className="dc-hero-lead">{lead}</p>
          {badge && (
            <p style={{ margin: '24px 0 0' }}>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  fontSize: 15,
                  fontWeight: 700,
                  padding: '6px 12px',
                  borderRadius: 4,
                  background: 'rgba(255,255,255,0.12)',
                  color: '#FFFFFF',
                }}
              >
                {badge}
              </span>
            </p>
          )}
          {actions && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginTop: actionsMarginTop }}>{actions}</div>
          )}
        </div>
        <HeroCarousel photos={photos} label={carouselLabel} />
      </div>
    </section>
  )
}
