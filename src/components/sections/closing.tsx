import { closing } from '@/content/homepage'
import { GkButton } from '@/components/primitives/gk-button'
import { MarkAssembly } from '@/components/primitives/logo-shapes'
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
 *
 * 23 Sep: leaner. Less vertical space, a smaller mark, the headline bold with
 * only "clarity and certainty" set light, no highlighter, no margin note, and
 * the primary button in yellow.
 */
export function Closing() {
  return (
    <section
      data-ground="navy"
      className="ground-navy accent-yellow relative overflow-hidden py-14 md:py-16"
      aria-labelledby="closing-heading"
      style={{ backgroundColor: 'var(--gk-navy)' }}
    >
      <div className="shell relative grid items-center gap-10 lg:grid-cols-12">
        <div className="lg:col-span-8">
          {/* The eyebrow and the second headline line ("Sub: remove") both
              went in the copy replacement. One sentence, then the buttons. */}
          <Reveal delay={0.12}>
            <h2 id="closing-heading" className="display max-w-[22ch] font-extrabold">
              {closing.headlineLead}{' '}
              <span className="font-normal">{closing.headlineQuiet}</span>
            </h2>
          </Reveal>

          <Reveal delay={0.4}>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <GkButton to={closing.primaryCta.to} variant="accent" onDark withArrow>
                {closing.primaryCta.label}
              </GkButton>
              <GkButton to={closing.secondaryCta.to} variant="secondary" onDark>
                {closing.secondaryCta.label}
              </GkButton>
            </div>
          </Reveal>

          {/* The mark assembles on phones too, under the buttons — it is the
              page's last frame and worth having on every screen. */}
          <div className="mt-10 flex justify-center lg:hidden">
            <MarkAssembly size={120} />
          </div>
        </div>

        <div className="hidden lg:col-span-4 lg:flex lg:items-center lg:justify-center">
          <MarkAssembly size={150} />
        </div>
      </div>
    </section>
  )
}
