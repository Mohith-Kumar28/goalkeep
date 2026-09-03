import { useEffect, useRef, useState } from 'react'
import { audienceSection, audiences } from '@/content/homepage'
import type { Audience } from '@/content/types'
import { GkButton } from '@/components/primitives/gk-button'
import { PhotoCarousel } from '@/components/primitives/photo-carousel'
import { Annotate, Scribble } from '@/components/primitives/doodles'
import { FloatingField } from '@/components/primitives/shapes'
import { Reveal } from '@/components/primitives/reveal'
import { cn } from '@/lib/utils'
import { useReducedMotion } from '@/hooks/use-reduced-motion'

/**
 * "Layout is looking clunky - we need a refresh for this one."
 *
 * Rebuilt to the shape the feedback lays out, in that order:
 *
 *   1. the challenge, in their words, before anything about us
 *   2. a looping carousel of five real photographs, captioned org · location
 *   3. a testimonial with a face and credentials
 *   4. two buttons — Kickstarter, and the case studies
 *
 * The old vertical tablist is gone. It asked the visitor to choose a category
 * before they'd been given a reason to care about any of them.
 */
export function Audiences() {
  const [active, setActive] = useState(0)
  const audience = audiences[active]

  // Deep links survive the category rename: /#early-stage still resolves.
  useEffect(() => {
    const hash = window.location.hash.replace('#', '')
    const found = audiences.findIndex((item) => item.id === hash)
    if (found >= 0) setActive(found)
  }, [])

  return (
    <section
      className="ground-cream band accent-coral relative"
      style={{ backgroundColor: 'var(--gk-coral-tint)' }}
      aria-labelledby="audiences-heading"
    >
      <FloatingField variant="b" />

      <div className="shell relative">
        <Reveal>
          <p className="eyebrow mb-3">{audienceSection.eyebrow}</p>
          <h2 id="audiences-heading" className="h2 max-w-[20ch]">
            {audienceSection.headline}{' '}
            <span className="text-[var(--gk-coral-ink)]">
              {audienceSection.headlineTail}
            </span>
          </h2>
        </Reveal>

        <div
          role="tablist"
          aria-label="Kinds of organisation we work with"
          className="mt-8 flex flex-wrap gap-3"
        >
          {audiences.map((item, index) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              id={`audience-tab-${item.id}`}
              aria-selected={index === active}
              aria-controls={`audience-panel-${item.id}`}
              tabIndex={index === active ? 0 : -1}
              onClick={() => setActive(index)}
              onKeyDown={(event) => {
                if (event.key === 'ArrowRight')
                  setActive((active + 1) % audiences.length)
                if (event.key === 'ArrowLeft')
                  setActive((active - 1 + audiences.length) % audiences.length)
              }}
              className={cn(
                'rounded-[var(--r-pill)] border-2 border-[var(--gk-ink)] px-5 py-3',
                'font-display text-[length:var(--fs-sm)] font-extrabold',
                'transition-[transform,background-color,box-shadow] duration-[var(--dur-base)] ease-[var(--ease-pop)]',
                index === active
                  ? 'bg-[var(--gk-ink)] text-[var(--gk-cream)] shadow-none'
                  : 'bg-[var(--gk-white)] text-[var(--gk-ink)] shadow-[var(--shadow-pop-sm)] hover:-translate-x-[2px] hover:-translate-y-[2px] hover:bg-[var(--gk-yellow)] hover:shadow-[var(--shadow-pop)]',
              )}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div
          role="tabpanel"
          id={`audience-panel-${audience.id}`}
          aria-labelledby={`audience-tab-${audience.id}`}
          key={audience.id}
          className="mt-12"
        >
          <ChallengeStatement audience={audience} />

          <div className="mt-14">
            <PhotoCarousel photos={audience.photos} />
          </div>

          <Testimonial audience={audience} />

          <div className="mt-10 flex flex-wrap gap-4">
            <GkButton to={audience.primaryCta.to} variant="primary" withArrow>
              {audience.primaryCta.label}
            </GkButton>
            <GkButton to={audience.secondaryCta.to} variant="secondary">
              {audience.secondaryCta.label}
            </GkButton>
          </div>
        </div>
      </div>
    </section>
  )
}

/**
 * The opener: "Early-stage NGOs often struggle with ___, ___, and ___."
 *
 * The underscores in the brief are the client leaving gaps for us to fill in
 * the copy, not a request for animated blanks — so the three phrases are
 * always present and always readable, and what arrives one at a time is the
 * marker under them.
 *
 * The first build did animate the words in from nothing, using transparent
 * text. That looked fine and was wrong twice over: a screen reader announced
 * three phrases a sighted visitor could not see, and the audit correctly
 * reported 1:1 contrast on all three.
 *
 * Ink on the yellow, teal and coral fills clears 7:1, which is why the marker
 * carries the hue and the text never does.
 */
const BLANK_FILL = ['var(--gk-yellow)', 'var(--gk-teal)', 'var(--gk-coral)']

function ChallengeStatement({ audience }: { audience: Audience }) {
  const reduced = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const [filled, setFilled] = useState(reduced ? audience.challengeBlanks.length : 0)

  useEffect(() => {
    setFilled(reduced ? audience.challengeBlanks.length : 0)
    if (reduced) return

    const node = ref.current
    if (!node) return

    let timers: Array<number> = []
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        observer.disconnect()
        timers = audience.challengeBlanks.map((_, index) =>
          window.setTimeout(() => setFilled(index + 1), 350 + index * 620),
        )
      },
      { threshold: 0.35 },
    )
    observer.observe(node)
    return () => {
      observer.disconnect()
      timers.forEach(window.clearTimeout)
    }
  }, [reduced, audience])

  const tailParts = audience.circled
    ? audience.challengeTail.split(audience.circled)
    : [audience.challengeTail]

  return (
    <div ref={ref} className="grid gap-8 lg:grid-cols-12">
      <p className="h2 lg:col-span-7">
        {audience.challengeLead}{' '}
        {audience.challengeBlanks.map((blank, index) => (
          <span key={blank}>
            <span
              className="inline-block rounded-[var(--r-sm)] px-[0.16em] transition-[background-color,box-shadow,transform] duration-[var(--dur-slow)] ease-[var(--ease-pop)]"
              style={{
                backgroundColor:
                  index < filled ? BLANK_FILL[index % 3] : 'transparent',
                // Before the marker lands, the phrase is underscored — the
                // blank from the brief, with the answer already written in.
                boxShadow:
                  index < filled ? 'none' : 'inset 0 -0.1em 0 0 var(--gk-ink)',
                transform: index < filled ? 'rotate(-1deg)' : 'none',
              }}
            >
              {blank}
            </span>
            {/* Pulled back against the fill: the marker carries 0.16em of
                inline padding, which otherwise reads as a space before the
                comma. */}
            <span className="-ml-[0.14em]">
              {index < audience.challengeBlanks.length - 2
                ? ', '
                : index === audience.challengeBlanks.length - 2
                  ? ', and '
                  : '.'}
            </span>
          </span>
        ))}
      </p>

      <p className="lead self-end lg:col-span-5">
        {tailParts[0]}
        {audience.circled && (
          <Annotate mark="circle" color="var(--gk-coral)" delay={0.4} inset="-16%">
            {audience.circled}
          </Annotate>
        )}
        {tailParts[1]}
      </p>
    </div>
  )
}

function Testimonial({ audience }: { audience: Audience }) {
  const { testimonial } = audience

  return (
    <figure className="card-pop mt-14 flex flex-col gap-8 rounded-[var(--r-lg)] bg-[var(--gk-white)] p-8 md:flex-row md:items-center md:p-10">
      <div className="relative shrink-0">
        <img
          src={testimonial.photo}
          alt={`${testimonial.name}, ${testimonial.credentials}`}
          loading="lazy"
          decoding="async"
          className="size-32 rounded-full border-2 border-[var(--gk-ink)] object-cover md:size-40"
        />
        <Scribble
          name="star"
          color="var(--gk-yellow)"
          className="absolute -right-3 -top-2 h-8 w-8"
        />
      </div>

      <div>
        <blockquote className="h3 max-w-[36ch] text-[length:clamp(1.35rem,2.4vw,1.9rem)] leading-snug">
          “{testimonial.quote.value.text}”
        </blockquote>
        <figcaption className="mt-5">
          <span className="hand text-[var(--gk-coral-ink)]">{testimonial.name}</span>
          <span className="block text-[length:var(--fs-sm)] font-semibold text-[var(--fg-2)]">
            {testimonial.credentials}
          </span>
        </figcaption>
      </div>
    </figure>
  )
}
