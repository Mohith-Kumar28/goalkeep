import { useEffect, useState } from 'react'
import { audienceSection, audiences } from '@/content/homepage'
import type { Audience } from '@/content/types'
import { GkButton } from '@/components/primitives/gk-button'
import { PhotoCarousel } from '@/components/primitives/photo-carousel'
import { MarkerText } from '@/components/primitives/marker-text'
import { ShapeField } from '@/components/primitives/logo-shapes'
import { Reveal } from '@/components/primitives/reveal'
import { cn } from '@/lib/utils'

/**
 * Whom we do it for.
 *
 * The tabbed structure survives — "what I liked here was the ease of the top
 * select of what is happening with whom" — but the copy replacement changed
 * what sits inside a panel.
 *
 *   · Each segment used to open with a fill-in-the-blanks sentence
 *     ("Early-stage NGOs often struggle with ___, ___, and ___") whose blanks
 *     were struck through with a highlighter one at a time. That device is
 *     gone: the segments now open with a question the visitor should recognise
 *     themselves in, and run as prose underneath it.
 *   · The client marked one run per segment with a highlighter in the copy
 *     doc — yellow, red and green. The shading in that document says *which*
 *     run to mark, not how; the how is the site's own highlighter, in the
 *     brand's three hues. Each run is a whole sentence, so it is split into one
 *     real stroke per rendered line rather than flattened into a tint. See
 *     MarkerText.
 *   · Two CTAs became one. Every "Read the ... case study" link was struck out
 *     in the doc, including the one under the testimonial.
 *   · The testimonials are now real, named people from real organisations. We
 *     have no portraits of them, and running a stock photograph of somebody
 *     else beside a named quote is not a thing to ship — so the portrait is a
 *     monogram until someone sends the actual photographs.
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
      {/* The Kickstarter deck's own composition: a coral arc off the top right
          and a teal one off the bottom left, at deck scale. */}
      <ShapeField variant="audiences" />

      <div className="shell relative">
        <Reveal>
          <p className="eyebrow mb-4">{audienceSection.eyebrow}</p>
          <h2 id="audiences-heading" className="h2 max-w-[30ch]">
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
              <Pitch audience={audience} />

              <div className="mt-10">
                <GkButton to={audience.cta.to} variant="primary" withArrow>
                  {audience.cta.label}
                </GkButton>
              </div>
            </div>

            {/* The space the review asked us to put to use. The card sizes to
                its quote rather than stretching to the height of the column
                beside it — the "read the case study" link that used to fill
                its bottom edge is gone, and a card stretched to match four
                paragraphs of prose is mostly empty white. */}
            <div className="lg:col-span-5 lg:self-start">
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
 * The question, then the answer.
 *
 * `highlight.text` is a verbatim substring of one of the body paragraphs, so
 * the split below is exact rather than fuzzy: whichever paragraph contains it
 * is cut into before / marked / after, and every other paragraph renders
 * plain. If the copy is edited and the substring stops matching, the paragraph
 * simply renders unmarked — no crash, no half-highlight.
 */
function Pitch({ audience }: { audience: Audience }) {
  const mark = audience.highlight

  return (
    <div>
      <h3 className="h2 max-w-[30ch] text-[length:clamp(1.375rem,2.2vw,1.875rem)] font-bold">
        {audience.header}
      </h3>

      <div className="mt-6 flex max-w-[58ch] flex-col gap-4">
        {audience.body.map((paragraph) => {
          const at = mark ? paragraph.indexOf(mark.text) : -1

          if (!mark || at < 0) {
            return (
              <p key={paragraph} className="lead">
                {paragraph}
              </p>
            )
          }

          return (
            <p key={paragraph} className="lead">
              {paragraph.slice(0, at)}
              <MarkerText hue={mark.hue}>{mark.text}</MarkerText>
              {paragraph.slice(at + mark.text.length)}
            </p>
          )
        })}
      </div>
    </div>
  )
}

/**
 * One testimonial per audience, in the right column.
 *
 * No ink outline, no hard shadow, and the portrait is not in a ring — the
 * three things the review named on this card specifically. The "read the case
 * study" link that used to close it was struck out in the copy replacement.
 */
function Testimonial({ audience }: { audience: Audience }) {
  const { testimonial } = audience
  const initials = testimonial.name
    .split(' ')
    .slice(0, 2)
    .map((word) => word[0])
    .join('')

  return (
    <figure className="rounded-[var(--r-lg)] border border-[var(--hairline)] bg-[var(--gk-white)] p-8 shadow-[var(--shadow-sm)]">
      <blockquote className="text-[length:clamp(1.0625rem,1.4vw,1.1875rem)] leading-[1.5] font-semibold text-[var(--fg-1)]">
        &ldquo;{testimonial.quote.value.text}&rdquo;
      </blockquote>

      <figcaption className="mt-7 flex items-center gap-4">
        {testimonial.photo ? (
          <img
            src={testimonial.photo}
            alt=""
            loading="lazy"
            decoding="async"
            className="size-14 rounded-full object-cover"
          />
        ) : (
          <span
            aria-hidden="true"
            className="grid size-14 shrink-0 place-items-center rounded-full bg-[var(--gk-cream-deep)] font-display text-[length:var(--fs-base)] font-extrabold text-[var(--gk-navy)]"
          >
            {initials}
          </span>
        )}
        <span>
          <span className="block text-[length:var(--fs-base)] font-bold text-[var(--fg-1)]">
            {testimonial.name}
          </span>
          <span className="block text-[length:var(--fs-sm)] text-[var(--fg-2)]">
            {testimonial.credentials}
          </span>
        </span>
      </figcaption>
    </figure>
  )
}
