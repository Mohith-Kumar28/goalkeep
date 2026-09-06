import { Link } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { hero } from '@/content/homepage'
import { GkButton } from '@/components/primitives/gk-button'
import { Spotlight } from '@/components/primitives/spotlight'
import { TypedPhrase } from '@/components/primitives/typed-phrase'
import { Annotate } from '@/components/primitives/doodles'
import { useReducedMotion } from '@/hooks/use-reduced-motion'

/**
 * The hero.
 *
 * Rebuilt after the review. What changed and why:
 *
 *   · The Ken Burns photography and its 0.84 navy wash are gone. "I'm just
 *     wondering if we should remove this — too much is happening over here."
 *     The ground is now flat navy, the colour the marketing creatives use.
 *     The photography moved down to the numbers band, which is where the
 *     "keep this video in some other component's background below" note sends
 *     it.
 *   · The arc lattice and the floating rings, arcs and half-discs are gone:
 *     "this random circle, this half a circle, this little semicircle — it's
 *     not working here, remove it for now."
 *   · The spotlight stays. It is the one effect the review singled out as
 *     working: "I like the little hover and style effect you've given."
 *   · The subheader types and backspaces instead of being swept by a marker.
 *   · The case-study card lost its 2px ink outline, its hard offset shadow and
 *     its tilt. The photograph now dissolves into the panel rather than
 *     sitting in a frame.
 */
export function Hero() {
  return (
    <section
      data-ground="navy"
      /* Pulled up under the sticky header so the navy runs to the top of the
         viewport and the header floats on it. 82px is the header's h-20 plus
         its 2px progress rule. */
      className="ground-navy accent-yellow relative isolate -mt-[82px] overflow-hidden"
      style={{ backgroundColor: 'var(--gk-navy)' }}
    >
      <Spotlight />

      <div className="shell relative z-10 grid items-center gap-14 pb-20 pt-[calc(82px+3rem)] md:pb-24 md:pt-[calc(82px+4.5rem)] lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-7">
          <p className="mb-6">
            <span className="eyebrow text-[var(--gk-yellow)]">{hero.eyebrow}</span>
          </p>

          <h1 className="display max-w-[23ch] text-white">
            {hero.headlineLead}{' '}
            <Annotate mark="underline" color="var(--gk-yellow)" delay={0.5} nowrap>
              {hero.headlineHighlight}
            </Annotate>
          </h1>

          {/* min-height reserves the tallest rendering of the typed sentence so
              the buttons below never move while it types. */}
          <p className="mt-8 max-w-[44ch] text-[length:clamp(1.0625rem,1.5vw,1.3125rem)] font-normal leading-[1.55] text-white/90 min-h-[4.7em] sm:min-h-[3.2em]">
            <TypedPhrase
              lead={hero.typed.lead}
              phrases={hero.typed.phrases}
              tail={hero.typed.tail}
              markBackground="var(--gk-white)"
              markColor="var(--gk-navy)"
            />
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <GkButton to={hero.primaryCta.to} variant="primary" onDark withArrow>
              {hero.primaryCta.label}
            </GkButton>
            <GkButton to={hero.secondaryCta.to} variant="secondary" onDark>
              {hero.secondaryCta.label}
            </GkButton>
          </div>

          {/* The margin note. Handwriting is the one informal device the review
              asked us to keep, so it survives — quieter, and no longer paired
              with a drawn arrow. */}
          <p
            aria-hidden="true"
            className="hand mt-8 hidden whitespace-pre-line leading-tight text-[var(--gk-yellow)]/90 xl:block"
          >
            {hero.marginalia}
          </p>
        </div>

        <div className="lg:col-span-5">
          <ProofCard />
        </div>
      </div>
    </section>
  )
}

/**
 * The rotating case-study card.
 *
 * "Case study boxing needs some work" — so the box went. The photograph is not
 * in a frame; it dissolves down into the panel colour, and the panel itself is
 * a translucent white on navy, which is the treatment the review liked
 * ("I like the translucent background").
 */
function ProofCard() {
  const reduced = useReducedMotion()
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (reduced || paused) return
    const id = window.setInterval(
      () => setIndex((i) => (i + 1) % hero.proofCards.length),
      4600,
    )
    return () => window.clearInterval(id)
  }, [reduced, paused])

  const card = hero.proofCards[index]

  return (
    <div
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      className="mx-auto max-w-[27rem]"
    >
      <article
        className="overflow-hidden rounded-[var(--r-lg)] border border-white/15 shadow-[var(--shadow-navy)] backdrop-blur-[2px]"
        style={{ background: 'rgb(255 255 255 / 0.07)' }}
      >
        <div
          className="photo-bleed photo-bleed-b relative aspect-[16/9]"
          /* The photograph fades into the panel rather than stopping at an
             edge. --fade-to has to be the *composited* colour of the panel
             over navy, not the panel's own translucent value. */
          style={{ ['--fade-to' as string]: '#39538f' }}
        >
          {hero.proofCards.map((item, i) => (
            <img
              key={item.image}
              src={item.image}
              alt={i === index ? item.imageAlt : ''}
              loading={i === 0 ? 'eager' : 'lazy'}
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover transition-opacity duration-[700ms] ease-[var(--ease-out)]"
              style={{ opacity: i === index ? 1 : 0 }}
            />
          ))}
        </div>

        <div className="-mt-8 px-7 pb-7">
          <p className="relative text-[length:var(--fs-sm)] font-bold uppercase tracking-[var(--tracking-label)] text-[var(--gk-yellow)]">
            {card.org}
          </p>
          <p className="stat-figure relative mt-3 text-[length:clamp(1.75rem,2.8vw,2.25rem)] text-white">
            {card.stat}
          </p>
          <p className="relative mt-2 text-[length:var(--fs-sm)] text-white/80">
            {card.line}
          </p>

          <div className="relative mt-6 flex items-center justify-between gap-4">
            <Link to={card.to} className="link-cta text-[length:var(--fs-sm)]">
              Read case study
            </Link>

            <ol className="flex gap-1.5" aria-hidden="true">
              {hero.proofCards.map((item, i) => (
                <li
                  key={item.org}
                  className="h-[3px] transition-all duration-[var(--dur-base)] ease-[var(--ease-out)]"
                  style={{
                    width: i === index ? 22 : 10,
                    background:
                      i === index ? 'var(--gk-yellow)' : 'rgb(255 255 255 / 0.3)',
                  }}
                />
              ))}
            </ol>
          </div>
        </div>
      </article>
    </div>
  )
}
