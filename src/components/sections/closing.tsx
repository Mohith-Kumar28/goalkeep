import { closing } from '@/content/homepage'
import { GkButton } from '@/components/primitives/gk-button'
import { MarkAssembly } from '@/components/primitives/logo-shapes'
import { Marker } from '@/components/primitives/marker'
import { Reveal } from '@/components/primitives/reveal'

/**
 * The bookend.
 *
 * "I think right now what's happening is that it's just seeming like a clunky
 * random thing going on with the circle" — so the 260px spinning four-segment
 * ring is gone.
 *
 * Two things replace it, and both are the same instruction: "these things
 * appearing over here, one by one — you come to the last section and first
 * this appears, then this, then this," and "pieces from the logo, instead of
 * using the whole logo, getting assembled and forming a shape on scroll."
 *
 *   · Every element of the copy is its own Reveal on an increasing delay, so
 *     the close writes itself as you arrive at it.
 *   · The mark itself is scattered into its four arcs and pulled back together
 *     by the scroll — the fragments arrive one at a time and land as the
 *     wordmark's ring. It is the page's last frame, and the only place the
 *     whole mark is ever drawn from its parts.
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
              <Marker>{closing.headlineKeyword}</Marker>{' '}
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

          {/* The mark assembles on phones too, under the buttons — it is the
              page's last frame and worth having on every screen. */}
          <div className="mt-14 flex justify-center lg:hidden">
            <MarkAssembly size={150} />
          </div>
        </div>

        <div className="hidden lg:col-span-4 lg:flex lg:flex-col lg:items-center lg:justify-center lg:gap-12">
          <MarkAssembly size={200} />

          <Reveal delay={0.54}>
            <p
              aria-hidden="true"
              className="hand whitespace-pre-line text-center leading-tight text-white/70"
            >
              {closing.marginalia.value}
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
