import { useEffect, useState } from 'react'
import { hero } from '@/content/homepage'
import { GkButton } from '@/components/primitives/gk-button'
import { KenBurns } from '@/components/primitives/ken-burns'
import { Spotlight } from '@/components/primitives/spotlight'
import { TiltCard } from '@/components/primitives/tilt-card'
import { RotatingHighlight } from '@/components/primitives/rotating-highlight'
import { Annotate, Scribble } from '@/components/primitives/doodles'
import { FloatingField, PatternField } from '@/components/primitives/shapes'
import { useReducedMotion } from '@/hooks/use-reduced-motion'

/**
 * The hero.
 *
 * Four layers, back to front: photography that slowly drifts, a navy wash that
 * holds it down to a readable ground, the arc lattice and floating marks off
 * the logo, then the copy. The photographs are the point — the feedback asked
 * for footage behind the headline the way 10x Impact Labs does it, and for the
 * community the work is for to actually be visible.
 *
 * The navy wash is 0.88 alpha, not a fill. At 0.95 the photograph stops
 * reading; below about 0.82 the white headline starts to fight the highlights
 * in the workshop frames.
 */
export function Hero() {
  return (
    <section
      data-ground="navy"
      /* Pulled up under the sticky header so the photography runs to the top
         of the viewport and the header floats on it. 82px is the header's
         h-20 plus its 2px progress rule. */
      className="ground-navy accent-yellow relative isolate -mt-[82px] overflow-hidden"
    >
      <KenBurns images={hero.backdrop} interval={7000} />

      {/* The wash. Alpha, not an opaque fill, so the photograph survives. */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{ backgroundColor: 'rgb(47 74 146 / 0.84)' }}
      />

      <PatternField pattern="arcs" color="#ffffff" opacity={0.07} scale={88} />
      <Spotlight />
      <FloatingField variant="a" />

      <div className="shell relative z-10 grid items-center gap-12 pb-20 pt-[calc(82px+3rem)] md:pb-28 md:pt-[calc(82px+5rem)] lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-7">
          <p className="mb-5 flex items-center gap-3">
            <span className="eyebrow text-[var(--gk-yellow)]">{hero.eyebrow}</span>
            <Scribble
              name="arrow-hook"
              color="var(--gk-yellow)"
              className="h-6 w-10 opacity-80"
            />
          </p>

          <h1 className="display max-w-[16ch] text-white">
            {hero.headlineLead}{' '}
            <Annotate mark="squiggle" color="var(--gk-yellow)" delay={0.5} nowrap>
              {hero.headlineHighlight}
            </Annotate>
          </h1>

          <p className="lead mt-8 max-w-[46ch] text-[length:clamp(1.125rem,1.7vw,1.5rem)] leading-snug text-white">
            <RotatingHighlight segments={hero.leadSegments} />
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <GkButton to={hero.primaryCta.to} variant="primary" onDark magnetic withArrow>
              {hero.primaryCta.label}
            </GkButton>
            <GkButton to={hero.secondaryCta.to} variant="ghost" onDark>
              {hero.secondaryCta.label}
            </GkButton>

            {/* The margin note points back at the primary. Desktop only —
                on a phone there is no margin for it to sit in. */}
            <span
              aria-hidden="true"
              className="hidden items-start gap-1 pl-2 text-[var(--gk-yellow)] xl:flex"
            >
              <Scribble name="arrow-curve" color="var(--gk-yellow)" className="h-14 w-10 -scale-x-100" />
              <span className="hand mt-4 -rotate-6 whitespace-pre-line leading-tight">
                {hero.marginalia}
              </span>
            </span>
          </div>
        </div>

        <div className="lg:col-span-5">
          <ProofCard />
        </div>
      </div>
    </section>
  )
}

/**
 * The rotating proof card. The feedback offered a choice between video and
 * "case study card rotations on the right, so that they can immediately get
 * tangible results of our work" — this is both: real footage behind, real
 * numbers in front.
 */
function ProofCard() {
  const reduced = useReducedMotion()
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (reduced || paused) return
    const id = window.setInterval(
      () => setIndex((i) => (i + 1) % hero.proofCards.length),
      4200,
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
    >
      <TiltCard className="mx-auto max-w-[26rem]">
        <article className="relative rotate-[-1.5deg] overflow-hidden rounded-[var(--r-lg)] border-2 border-[var(--gk-ink)] bg-[var(--gk-cream)] shadow-[10px_10px_0_var(--gk-ink)]">
          <div className="relative aspect-[3/2] overflow-hidden">
            {hero.proofCards.map((item, i) => (
              <img
                key={item.image}
                src={item.image}
                alt={i === index ? item.imageAlt : ''}
                loading={i === 0 ? 'eager' : 'lazy'}
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-[var(--ease-out)]"
                style={{ opacity: i === index ? 1 : 0 }}
              />
            ))}
          </div>

          <div className="p-6 text-[var(--gk-ink)]">
            <p className="hand text-[var(--gk-coral-ink)]">{card.org}</p>
            <p className="stat-figure mt-2 text-[length:clamp(1.75rem,3.2vw,2.5rem)]">
              {card.stat}
            </p>
            <p className="mt-2 text-[length:var(--fs-sm)] font-semibold">{card.line}</p>

            <ol className="mt-5 flex gap-2" aria-hidden="true">
              {hero.proofCards.map((item, i) => (
                <li
                  key={item.org}
                  className="h-[5px] rounded-full transition-all duration-[var(--dur-base)] ease-[var(--ease-out)]"
                  style={{
                    width: i === index ? 26 : 10,
                    background: i === index ? 'var(--gk-blue)' : 'var(--hairline)',
                  }}
                />
              ))}
            </ol>
          </div>
        </article>
      </TiltCard>
    </div>
  )
}
