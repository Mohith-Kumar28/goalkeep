import { useEffect, useRef, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { audienceSection, audiences } from '@/content/homepage'
import type { Audience } from '@/content/types'
import { GkButton } from '@/components/primitives/gk-button'
import { PhotoCarousel } from '@/components/primitives/photo-carousel'
import { Annotate } from '@/components/primitives/doodles'
import { Reveal } from '@/components/primitives/reveal'
import { cn } from '@/lib/utils'
import { useReducedMotion } from '@/hooks/use-reduced-motion'

/**
 * Whom we do it for.
 *
 * The structure the first feedback doc asked for is intact and was confirmed
 * in the review: "what I liked here was the ease of the top select of what is
 * happening with whom — that's good." What the review changed:
 *
 *   · "Again there's just too much bold and big stuff happening here" and
 *     "colours loud and popping too much". The band moved off coral tint onto
 *     the pale blue, the headline came down a step, and the three highlighter
 *     fills are now the muted values.
 *   · "How can we improve the spacing of this area? … Over here can we have an
 *     image and a testimonial block here only? So for each there'll be a
 *     different testimonial relevant to that particular audience." The
 *     testimonial moved out of its own full-width row into the empty right
 *     column beside the challenge statement — which is both the fix for the
 *     dead space and what was asked for.
 *   · "The read case study can be almost this type of effect — it doesn't have
 *     to be a button." It is a text link under the testimonial now.
 *   · Tabs are rectangles, not pills, and the sticker press is gone.
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
      className="ground-cream-deep band accent-blue relative"
      aria-labelledby="audiences-heading"
    >
      <div className="shell relative">
        <Reveal>
          <p className="eyebrow mb-4">{audienceSection.eyebrow}</p>
          <h2 id="audiences-heading" className="h2 max-w-[24ch]">
            {audienceSection.headline}{' '}
            <span className="font-medium text-[var(--fg-2)]">
              {audienceSection.headlineTail}
            </span>
          </h2>
        </Reveal>

        <div
          role="tablist"
          aria-label="Kinds of organisation we work with"
          className="mt-8 flex flex-wrap gap-2"
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
                'rounded-[var(--r-btn)] border px-5 py-3',
                'text-[length:var(--fs-sm)] font-bold',
                'transition-colors duration-[var(--dur-base)] ease-[var(--ease-out)]',
                index === active
                  ? 'border-[var(--gk-navy)] bg-[var(--gk-navy)] text-white'
                  : 'border-[var(--hairline-strong)] bg-[var(--gk-white)] text-[var(--gk-navy)] hover:border-[var(--gk-navy)]',
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
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-7">
              <ChallengeStatement audience={audience} />

              <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
                <GkButton to={audience.primaryCta.to} variant="primary" withArrow>
                  {audience.primaryCta.label}
                </GkButton>
                <GkButton to={audience.secondaryCta.to} variant="tertiary" withArrow>
                  {audience.secondaryCta.label}
                </GkButton>
              </div>
            </div>

            {/* The space the review asked us to put to use. */}
            <div className="lg:col-span-5">
              <Testimonial audience={audience} />
            </div>
          </div>

          <div className="mt-16">
            <PhotoCarousel photos={audience.photos} />
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
 * marker under them. "That's the way to bring in the informality — the
 * handwriting, the highlighter effect."
 *
 * Ink on all three fills clears 5:1, which is why the marker carries the hue
 * and the text never does.
 */
const BLANK_FILL = ['var(--gk-yellow)', 'var(--gk-teal-lift)', 'var(--gk-coral-lift)']

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
    <div ref={ref}>
      <p className="h2 text-[length:clamp(1.375rem,2.2vw,1.875rem)] font-bold">
        {audience.challengeLead}{' '}
        {audience.challengeBlanks.map((blank, index) => (
          <span key={blank}>
            <span
              className="inline-block rounded-[2px] px-[0.16em] transition-[background-color,box-shadow] duration-[var(--dur-slow)] ease-[var(--ease-out)]"
              style={{
                backgroundColor:
                  index < filled ? BLANK_FILL[index % 3] : 'transparent',
                // Before the marker lands, the phrase is underscored — the
                // blank from the brief, with the answer already written in.
                boxShadow:
                  index < filled ? 'none' : 'inset 0 -0.09em 0 0 var(--gk-ink)',
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

      <p className="lead mt-6 max-w-[58ch]">
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

/**
 * One testimonial per audience, in the right column.
 *
 * No ink outline, no hard shadow, and the portrait is not in a ring — the
 * three things the review named on this card specifically.
 */
function Testimonial({ audience }: { audience: Audience }) {
  const { testimonial } = audience

  return (
    <figure className="flex h-full flex-col rounded-[var(--r-lg)] border border-[var(--hairline)] bg-[var(--gk-white)] p-8 shadow-[var(--shadow-sm)]">
      <blockquote className="text-[length:clamp(1.125rem,1.6vw,1.3125rem)] font-semibold leading-[1.45] text-[var(--fg-1)]">
        &ldquo;{testimonial.quote.value.text}&rdquo;
      </blockquote>

      <figcaption className="mt-7 flex items-center gap-4">
        <img
          src={testimonial.photo}
          alt=""
          loading="lazy"
          decoding="async"
          className="size-14 rounded-full object-cover"
        />
        <span>
          <span className="block text-[length:var(--fs-base)] font-bold text-[var(--fg-1)]">
            {testimonial.name}
          </span>
          <span className="block text-[length:var(--fs-sm)] text-[var(--fg-2)]">
            {testimonial.credentials}
          </span>
        </span>
      </figcaption>

      {/* "Below the testimonial only it can be a read case study call to
          action." */}
      <Link
        to={audience.secondaryCta.to}
        className="link-cta mt-8 self-start text-[length:var(--fs-sm)]"
      >
        Read the case study
      </Link>
    </figure>
  )
}
