import { motion } from 'motion/react'
import { useEffect, useState } from 'react'
import { audiences } from '@/content/homepage'
import type { Audience, AudienceId } from '@/content/types'
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
 *   · The eyebrow and the "We've worked with three kinds…" headline are gone;
 *     the tabs lead.
 *   · Each segment has its own colour. Picking one re-tints the band, moves
 *     the arc to another corner, and brings the header, paragraph and
 *     testimonial in one after another - "boom boom boom", so the switch is
 *     unmistakable.
 *   · One header, one paragraph in black, no highlighter.
 *   · The testimonial is a photograph with the quote on it.
 *   · Funders are a fourth segment.
 *   · The gallery is a full-width strip that moves on its own.
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
}

const THEMES: Record<AudienceId, Theme> = {
  'early-stage': {
    ground: 'var(--gk-yellow-tint)',
    tab: 'var(--gk-yellow)',
    tabInk: 'var(--gk-ink)',
    arc: 'var(--gk-yellow)',
    corner: { x: '78%', y: '-38%' },
  },
  'data-mature': {
    ground: 'var(--gk-teal-tint)',
    tab: 'var(--gk-teal-ink)',
    tabInk: 'var(--gk-white)',
    arc: 'var(--gk-teal-lift)',
    corner: { x: '-22%', y: '52%' },
  },
  intermediary: {
    ground: 'var(--gk-coral-tint)',
    tab: 'var(--gk-coral-ink)',
    tabInk: 'var(--gk-white)',
    arc: 'var(--gk-coral-lift)',
    corner: { x: '-20%', y: '-40%' },
  },
  funders: {
    ground: 'var(--gk-blue-tint)',
    tab: 'var(--gk-navy)',
    tabInk: 'var(--gk-white)',
    arc: 'var(--gk-blue-lift)',
    corner: { x: '80%', y: '50%' },
  },
}

const EASE = [0.22, 1, 0.36, 1] as const

export function Audiences() {
  const reduced = useReducedMotion()
  const [active, setActive] = useState(0)
  const audience = audiences[active]
  const theme = THEMES[audience.id]

  // Deep links survive the category rename: /#early-stage still resolves.
  useEffect(() => {
    const hash = window.location.hash.replace('#', '')
    const found = audiences.findIndex((item) => item.id === hash)
    if (found >= 0) setActive(found)
  }, [])

  return (
    <section
      className="band relative overflow-hidden transition-[background-color] duration-500 ease-[var(--ease-out)]"
      style={{ background: theme.ground, color: 'var(--fg-1)' }}
      aria-labelledby="audiences-heading"
    >
      {/* The visible headline was cut; the band keeps its name for anyone
          navigating by headings. */}
      <h2 id="audiences-heading" className="sr-only">
        Who we do it for
      </h2>
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

      <div className="shell relative">
        <div
          role="tablist"
          aria-label="Kinds of organisation we work with"
          className="flex flex-wrap gap-2"
        >
          {audiences.map((item, index) => {
            const selected = index === active
            const itemTheme = THEMES[item.id]
            return (
              <button
                key={item.id}
                type="button"
                role="tab"
                id={`audience-tab-${item.id}`}
                aria-selected={selected}
                aria-controls={`audience-panel-${item.id}`}
                tabIndex={selected ? 0 : -1}
                onClick={() => setActive(index)}
                onKeyDown={(event) => {
                  if (event.key === 'ArrowRight') setActive((active + 1) % audiences.length)
                  if (event.key === 'ArrowLeft')
                    setActive((active - 1 + audiences.length) % audiences.length)
                }}
                className={cn(
                  'rounded-[var(--r-btn)] border px-5 py-2.5 text-[length:var(--fs-base)] font-bold',
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
                {item.label}
              </button>
            )
          })}
        </div>

        <div
          role="tabpanel"
          id={`audience-panel-${audience.id}`}
          aria-labelledby={`audience-tab-${audience.id}`}
          className="mt-12 grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-14"
        >
          <Pitch key={audience.id} audience={audience} reduced={reduced} />
          <div className="lg:col-span-5">
            <Testimonial key={audience.id} audience={audience} reduced={reduced} />
          </div>
        </div>
      </div>

      <PhotoMarquee key={audience.id} photos={audience.photos} className="mt-16" />
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

function Pitch({ audience, reduced }: { audience: Audience; reduced: boolean }) {
  return (
    <div className="lg:col-span-7">
      <motion.h3
        {...step(reduced, 0)}
        className="max-w-[30ch] text-[length:clamp(1.875rem,3.4vw,2.75rem)] leading-[1.12] font-medium tracking-[var(--tracking-display)]"
      >
        {audience.header}
      </motion.h3>

      <motion.p
        {...step(reduced, 1)}
        className="mt-6 max-w-[56ch] text-[length:var(--fs-lg)] leading-relaxed text-[var(--fg-1)]"
      >
        {audience.body.value}
      </motion.p>

      <motion.div {...step(reduced, 2)} className="mt-9">
        {/* A router `to` can't carry a #section, so anchored CTAs are hrefs. */}
        <GkButton
          {...(audience.cta.to.includes('#') ? { href: audience.cta.to } : { to: audience.cta.to })}
          variant="primary"
          withArrow
        >
          {audience.cta.label}
        </GkButton>
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
      <img
        src={testimonial.photo}
        alt=""
        loading="lazy"
        decoding="async"
        className="aspect-[4/5] w-full object-cover sm:aspect-[4/3] lg:aspect-[4/5]"
      />
      <div
        data-ground="scrim"
        className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[rgb(12_20_44_/_0.92)] via-[rgb(12_20_44_/_0.7)] to-transparent p-7 pt-24 text-white">
        <blockquote className="text-[length:clamp(1.0625rem,1.4vw,1.25rem)] leading-[1.45] font-semibold">
          &ldquo;{testimonial.quote.value.text}&rdquo;
        </blockquote>
        <figcaption className="mt-4 text-[length:var(--fs-sm)]">
          <span className="font-bold">{testimonial.name}</span>
          <span className="text-white/75"> · {testimonial.credentials}</span>
        </figcaption>
      </div>
    </motion.figure>
  )
}
