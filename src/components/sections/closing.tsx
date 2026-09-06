import { closing } from '@/content/homepage'
import { GkButton } from '@/components/primitives/gk-button'
import { Reveal } from '@/components/primitives/reveal'

/**
 * The bookend.
 *
 * "I think right now what's happening is that it's just seeming like a clunky
 * random thing going on with the circle" — so the 260px spinning four-segment
 * ring and the floating half-discs are gone.
 *
 * What replaces them is the effect the review asked for in their place:
 * "these things appearing over here, one by one — you come to the last section
 * and first this appears, then this, then this." Each element in this band is
 * its own Reveal on an increasing delay, so the close assembles itself as you
 * arrive at it rather than being decorated.
 */
export function Closing() {
  return (
    <section
      data-ground="navy"
      className="ground-navy accent-yellow relative overflow-hidden py-20 md:py-28"
      aria-labelledby="closing-heading"
      style={{ backgroundColor: 'var(--gk-navy)' }}
    >
      <div className="shell relative grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <Reveal>
            <p className="eyebrow mb-5 text-[var(--gk-yellow)]">{closing.eyebrow}</p>
          </Reveal>

          <Reveal delay={0.12}>
            <h2 id="closing-heading" className="display max-w-[17ch]">
              {closing.headlineLead}{' '}
              <span className="keyword-mark">{closing.headlineKeyword}</span>{' '}
              {closing.headlineTail}
            </h2>
          </Reveal>

          <Reveal delay={0.26}>
            <p className="mt-5 max-w-[30ch] text-[length:clamp(1.25rem,2.4vw,1.875rem)] font-bold leading-tight text-[var(--gk-yellow)]">
              {closing.headlineSecondLine}
            </p>
          </Reveal>

          <Reveal delay={0.4}>
            <div className="mt-11 flex flex-wrap items-center gap-4">
              <GkButton to={closing.primaryCta.to} variant="primary" onDark withArrow>
                {closing.primaryCta.label}
              </GkButton>
              <GkButton to={closing.secondaryCta.to} variant="secondary" onDark>
                {closing.secondaryCta.label}
              </GkButton>
            </div>
          </Reveal>
        </div>

        <div className="hidden lg:col-span-4 lg:block">
          <Reveal delay={0.54}>
            <p
              aria-hidden="true"
              className="hand mt-8 whitespace-pre-line leading-tight text-white/70"
            >
              {closing.marginalia.value}
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
