import { services, whatWeDo } from '@/content/homepage'
import { Reveal } from '@/components/primitives/reveal'

/**
 * What we do - the four services.
 *
 * New in the 21 Oct review. Design / Build / Adopt "reads more like an
 * approach", so it became "Our approach" further down, and this section says
 * plainly what Goalkeep can be engaged for.
 *
 * The layout follows the reference Rumit shared (the "what we bring" block on
 * Aditya's site): eyebrow and a large headline on the left, colour cards
 * on the right, each with a small numbered label. Four services rather
 * than three, so the cards sit two by two. "You take a call on how you want
 * to position it."
 *
 * No "Explore" links yet - each card will lead to its service page once the
 * services pages exist.
 */

/* One light tint per card with its own dark ink for the label - the same
   tints the "Who we do it for" band uses. 23 Oct: the yellow and navy cards
   went to tints too, "since the pink and the green are the light shades, make
   it the same for the yellow and the blue". Titles and body stay ink. */
const CARD_THEMES: Array<{ ground: string; label: string }> = [
  { ground: 'var(--gk-yellow-tint)', label: 'var(--gk-yellow-ink)' },
  { ground: 'var(--gk-blue-tint)', label: 'var(--gk-blue-deep)' },
  { ground: 'var(--gk-coral-tint)', label: 'var(--gk-coral-ink)' },
  { ground: 'var(--gk-teal-tint)', label: 'var(--gk-teal-ink)' },
]

export function WhatWeDo() {
  return (
    <section
      id="what-we-do"
      className="ground-cream band accent-blue relative scroll-mt-24"
      aria-labelledby="wwd-heading"
    >
      <div className="shell grid gap-10 lg:grid-cols-12 lg:gap-12">
        <Reveal className="lg:col-span-4">
          <div className="lg:sticky lg:top-32">
            <p className="eyebrow mb-4">{whatWeDo.eyebrow}</p>
            <h2 id="wwd-heading" className="h2">
              {whatWeDo.headline} <em>{whatWeDo.headlineTail}</em>
            </h2>
          </div>
        </Reveal>

        <ul className="grid gap-4 sm:grid-cols-2 md:gap-5 lg:col-span-8">
          {services.map((service, index) => {
            const theme = CARD_THEMES[index % CARD_THEMES.length]
            return (
              <Reveal as="li" key={service.title} delay={index * 0.08} className="h-full">
                <article
                  className="flex h-full flex-col rounded-[var(--r-lg)] p-7 text-[var(--gk-ink)] md:p-8"
                  style={{ background: theme.ground }}
                >
                  <p
                    className="text-[length:var(--fs-xs)] font-extrabold tracking-[var(--tracking-label)] uppercase"
                    style={{ color: theme.label }}
                  >
                    {String(index + 1).padStart(2, '0')} / {service.label}
                  </p>
                  <h3 className="mt-4 text-[length:clamp(1.375rem,2.2vw,1.75rem)] leading-tight font-extrabold">
                    {service.title}
                  </h3>
                  <p className="mt-4 text-[length:var(--fs-base)] leading-relaxed">
                    {service.body}
                  </p>
                </article>
              </Reveal>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
