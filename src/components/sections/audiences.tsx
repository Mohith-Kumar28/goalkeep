import { Building2, HandCoins, Network, Sprout } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { motion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { audienceSection, audiences } from '@/content/homepage'
import type { Audience, AudienceId } from '@/content/types'
import { ClampText } from '@/components/primitives/clamp-text'
import { GkButton } from '@/components/primitives/gk-button'
import { PhotoMarquee } from '@/components/primitives/photo-marquee'
import { useReducedMotion } from '@/hooks/use-reduced-motion'
import { cn } from '@/lib/utils'

/**
 * Who we do it for.
 *
 * The 23 Sep review called this the section most in need of a makeover: "too
 * text-centric… he read the headline, then went to the testimonial, then got
 * distracted by the highlight." What stayed is the one thing that worked: pick
 * your kind of organisation at the top and get the relevant story.
 *
 *   · The "We've worked with three kinds…" headline is gone; a "who we do
 *     it for" eyebrow sits over the tabs.
 *   · Each segment has its own colour. Picking one re-tints the band, moves
 *     the arc to another corner, and brings the header, paragraph and
 *     testimonial in one after another - "boom boom boom", so the switch is
 *     unmistakable.
 *   · One header, one paragraph in black, no highlighter.
 *   · The testimonial is a photograph with the quote on it.
 *   · Funders are a fourth segment.
 *   · The gallery is a full-width strip that moves on its own.
 *
 * 10 Nov, phones: a tap that changes text further down the screen goes
 * unnoticed, so below md the four options are a compact list (icon left,
 * label right) pinned with the pitch, and scrolling steps through them. The
 * label above them is black on every segment instead of the blue it was.
 */
type Theme = {
  /** The band's ground. */
  ground: string
  /** The selected tab. */
  tab: string
  tabInk: string
  /** The arc, and which corner it sits in. */
  arc: string
  corner: { x: string; y: string }
  /** The option's icon in the phone list. */
  icon: LucideIcon
}

const THEMES: Record<AudienceId, Theme> = {
  'early-stage': {
    ground: 'var(--gk-yellow-tint)',
    tab: 'var(--gk-yellow)',
    tabInk: 'var(--gk-ink)',
    arc: 'var(--gk-yellow)',
    corner: { x: '78%', y: '-38%' },
    icon: Sprout,
  },
  'data-mature': {
    ground: 'var(--gk-teal-tint)',
    tab: 'var(--gk-teal-ink)',
    tabInk: 'var(--gk-white)',
    arc: 'var(--gk-teal-lift)',
    corner: { x: '-22%', y: '52%' },
    icon: Building2,
  },
  intermediary: {
    ground: 'var(--gk-coral-tint)',
    tab: 'var(--gk-coral-ink)',
    tabInk: 'var(--gk-white)',
    arc: 'var(--gk-coral-lift)',
    corner: { x: '-20%', y: '-40%' },
    icon: Network,
  },
  funders: {
    ground: 'var(--gk-blue-tint)',
    tab: 'var(--gk-navy)',
    tabInk: 'var(--gk-white)',
    arc: 'var(--gk-blue-lift)',
    corner: { x: '80%', y: '50%' },
    icon: HandCoins,
  },
}

const EASE = [0.22, 1, 0.36, 1] as const

/** Phones only: how far the page scrolls per segment while the list is pinned. */
const STEP_PX = 120
const PIN_TOP_PX = 12
const PHONE = '(max-width: 767px)'

export function Audiences() {
  const reduced = useReducedMotion()
  const [active, setActive] = useState(0)
  const audience = audiences[active]
  const theme = THEMES[audience.id]
  const runway = useRef<HTMLDivElement>(null)

  /* The segment follows the scroll only when the scroll moves it to a new
     step, so a tap is not undone by the next pixel of scrolling. */
  useEffect(() => {
    const query = window.matchMedia(PHONE)
    let frame = 0
    let activeStep = -1
    const onScroll = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const node = runway.current
        if (!node || !query.matches) return
        const travelled = PIN_TOP_PX - node.getBoundingClientRect().top
        const next = Math.min(audiences.length - 1, Math.max(0, Math.floor(travelled / STEP_PX + 0.5)))
        if (next === activeStep) return
        activeStep = next
        setActive(next)
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  /* On a phone a tap scrolls to that segment's step, so the scroll position
     and the selection never disagree. */
  const select = (index: number) => {
    setActive(index)
    const node = runway.current
    if (!node || !window.matchMedia(PHONE).matches) return
    const top = window.scrollY + node.getBoundingClientRect().top - PIN_TOP_PX + index * STEP_PX
    window.scrollTo({ top, behavior: reduced ? 'auto' : 'smooth' })
  }

  // Deep links survive the category rename: /#early-stage still resolves.
  useEffect(() => {
    const hash = window.location.hash.replace('#', '')
    const found = audiences.findIndex((item) => item.id === hash)
    if (found >= 0) setActive(found)
  }, [])

  return (
    <section
      id="who-we-do-it-for"
      className="relative scroll-mt-24 overflow-clip py-10 transition-[background-color] duration-500 ease-[var(--ease-out)] md:py-14"
      style={{ background: theme.ground, color: 'var(--fg-1)' }}
      aria-labelledby="audiences-heading"
    >
      {/* The arc. One ring, off-frame, that swaps corner and colour with the
          segment. */}
      <motion.span
        aria-hidden="true"
        className="pointer-events-none absolute size-[34rem] rounded-full md:size-[44rem]"
        style={{ borderWidth: 'clamp(48px, 7vw, 96px)', borderStyle: 'solid' }}
        initial={false}
        animate={{
          left: theme.corner.x,
          top: theme.corner.y,
          borderColor: theme.arc,
          opacity: 0.55,
        }}
        transition={{ duration: reduced ? 0 : 0.9, ease: EASE }}
      />

      {/* 28 Sep: the band fits one screen. The four segments sit in two rows
          directly above the pitch they switch, so the tabs and the text read
          as one block instead of a row floating over a gap. 23 Oct: 8:5
          rather than 7:5 on the 12-column grid, so the headlines - now with a
          bold italic ending - stay within three lines. */}
      <div className="shell relative grid gap-6 md:gap-8 lg:grid-cols-[minmax(0,8fr)_minmax(0,5fr)] lg:items-center lg:gap-12">
        <div ref={runway} className="min-w-0">
          <div className="max-md:sticky" style={{ top: PIN_TOP_PX }}>
            {/* 30 Sep: the section's name is back on the page, as an eyebrow
                like "what we do" and "why we exist" - the segment questions
                below stay the headlines. */}
            <h2 id="audiences-heading" className="eyebrow mb-4 md:mb-5" style={{ color: 'var(--gk-ink)' }}>
              {audienceSection.eyebrow}
            </h2>
            <div
              role="tablist"
              aria-label="Kinds of organisation we work with"
              /* The longer labels need a wider row. */
              className="flex max-w-[36rem] flex-col gap-1.5 md:flex-row md:flex-wrap md:gap-2"
            >
              {audiences.map((item, index) => {
                const selected = index === active
                const itemTheme = THEMES[item.id]
                const Icon = itemTheme.icon
                return (
                  <button
                    key={item.id}
                    type="button"
                    role="tab"
                    id={`audience-tab-${item.id}`}
                    aria-selected={selected}
                    aria-controls={`audience-panel-${item.id}`}
                    tabIndex={selected ? 0 : -1}
                    onClick={() => select(index)}
                    onKeyDown={(event) => {
                      if (event.key === 'ArrowRight') select((active + 1) % audiences.length)
                      if (event.key === 'ArrowLeft') select((active - 1 + audiences.length) % audiences.length)
                    }}
                    className={cn(
                      'flex items-center gap-3 rounded-[var(--r-btn)] border px-3 py-2 text-left text-[length:var(--fs-sm)] font-bold md:px-5 md:py-2.5',
                      'transition-colors duration-[var(--dur-base)] ease-[var(--ease-out)]',
                      !selected &&
                        'border-[var(--hairline-strong)] bg-[var(--gk-white)] text-[var(--gk-ink)] hover:border-[var(--gk-ink)]',
                    )}
                    style={
                      selected
                        ? { background: itemTheme.tab, borderColor: itemTheme.tab, color: itemTheme.tabInk }
                        : undefined
                    }
                  >
                    <Icon aria-hidden="true" strokeWidth={2} className="size-5 shrink-0 md:hidden" />
                    {item.label}
                  </button>
                )
              })}
            </div>

            <div
              role="tabpanel"
              id={`audience-panel-${audience.id}`}
              aria-labelledby={`audience-tab-${audience.id}`}
              className="mt-5 md:mt-8"
            >
              <Pitch key={audience.id} audience={audience} theme={theme} reduced={reduced} />
            </div>
          </div>
          {/* The scroll the pinned list is held for, one step per segment. */}
          <div aria-hidden="true" className="md:hidden" style={{ height: (audiences.length - 1) * STEP_PX }} />
        </div>
        <div className="min-w-0">
          <Testimonial key={audience.id} audience={audience} reduced={reduced} />
        </div>
      </div>

      <PhotoMarquee key={audience.id} photos={audience.photos} compact className="mt-8 md:mt-10" />
    </section>
  )
}

/** Each block arrives a beat after the one before it. */
function step(reduced: boolean, index: number) {
  return reduced
    ? {}
    : {
        initial: { opacity: 0, y: 14 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.5, delay: 0.08 + index * 0.14, ease: EASE },
      }
}

function Pitch({ audience, theme, reduced }: { audience: Audience; theme: Theme; reduced: boolean }) {
  return (
    <div>
      <motion.h3
        {...step(reduced, 0)}
        /* 28 Sep: the shared h2 and lead styles, so this band's type matches
           every other section. 23 Oct: and the same lead + bold italic ending
           as the other headlines. */
        className="h2 max-w-[36ch] max-md:text-[1.5rem]"
      >
        {audience.header} <em>{audience.headerEm}</em>
      </motion.h3>

      <motion.div {...step(reduced, 1)} className="mt-3 max-w-[56ch] md:mt-4">
        <ClampText className="lead max-md:text-[length:var(--fs-base)]">{audience.body.value}</ClampText>
      </motion.div>

      <motion.div {...step(reduced, 2)} className="mt-5 flex flex-wrap gap-3 md:mt-6">
        {audience.ctas.map((cta, index) => (
          <GkButton
            key={cta.label}
            {...(cta.to.includes('#') ? { href: cta.to } : { to: cta.to })}
            variant={index === 0 ? 'primary' : 'secondary'}
            withArrow={index === 0}
            className="hover:brightness-95"
            style={
              index === 0
                ? { background: theme.tab, borderColor: theme.tab, color: theme.tabInk }
                : { color: 'var(--gk-ink)' }
            }
          >
            {cta.label}
          </GkButton>
        ))}
      </motion.div>
    </div>
  )
}

/**
 * The testimonial, image-first: a photograph with the quote set over its
 * lower edge. "It'll give a little bit of a text break to this entire thing."
 */
function Testimonial({ audience, reduced }: { audience: Audience; reduced: boolean }) {
  const { testimonial } = audience

  return (
    <motion.figure
      {...step(reduced, 3)}
      className="relative overflow-hidden rounded-[var(--r-lg)] shadow-[var(--shadow-md)]"
    >
      {/* Phones: a short photo with the quote under it on navy, rather than a
          portrait-shaped photo tall enough to carry the quote over it. */}
      <img
        src={testimonial.photo}
        alt=""
        loading="lazy"
        decoding="async"
        className="aspect-[16/9] w-full object-cover sm:aspect-[4/3] lg:aspect-[5/6]"
      />
      <div
        data-ground="scrim"
        className="bg-[var(--gk-navy)] p-5 text-white sm:absolute sm:inset-x-0 sm:bottom-0 sm:bg-transparent sm:bg-gradient-to-t sm:from-[rgb(12_20_44_/_0.92)] sm:via-[rgb(12_20_44_/_0.7)] sm:to-transparent sm:p-6 sm:pt-20">
        <blockquote className="text-[length:clamp(1rem,1.4vw,1.25rem)] leading-[1.45] font-semibold">
          <ClampText as="div">&ldquo;{testimonial.quote.value.text}&rdquo;</ClampText>
        </blockquote>
        <figcaption className="mt-3 text-[length:var(--fs-sm)] sm:mt-4">
          <span className="font-bold">{testimonial.name}</span>
          <span className="text-white/75"> · {testimonial.credentials}</span>
        </figcaption>
      </div>
    </motion.figure>
  )
}
