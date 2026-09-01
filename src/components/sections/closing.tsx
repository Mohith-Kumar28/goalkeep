import { GkButton } from '@/components/primitives/gk-button'
import { Reveal } from '@/components/primitives/reveal'
import { Ring } from '@/components/primitives/shapes'
import { closing } from '@/content/homepage'

/**
 * Band 8 — charcoal full-bleed, no accent (one yellow keyword).
 *
 * The page's only dark surface, which is what makes it land as an ending —
 * the footer below deliberately does NOT reuse white-on-charcoal.
 *
 * Left-aligned, not centered. The empty right track is the point.
 *
 * The yellow keyword does not animate here. It animated once in the hero;
 * repeating the trick would cheapen the bookend.
 */
export function Closing() {
  return (
    <section
      className="relative overflow-hidden py-16 md:py-24"
      style={{ backgroundColor: 'var(--gk-charcoal)' }}
      aria-labelledby="closing-heading"
    >
      <Ring
        width={12}
        gap={10}
        spin={160}
        className="absolute right-[8%] top-1/2 hidden size-44 -translate-y-1/2 lg:block"
      />

      <div className="shell relative grid gap-10 md:grid-cols-12 md:gap-6">
        <Reveal className="md:col-span-8 lg:col-span-6">
          <div className="flex flex-col gap-6">
            <h2
              id="closing-heading"
              className="text-[2rem] font-extrabold leading-[1.08] tracking-[var(--tracking-display)] text-white md:text-[length:var(--fs-4xl)]"
            >
              {closing.headlineLead}{' '}
              <span className="keyword-mark">{closing.headlineKeyword}</span>{' '}
              {closing.headlineTail}
              <br />
              {closing.headlineSecondLine}
            </h2>

            <p className="pull-quote text-[var(--n-200)]">{closing.pullQuote}</p>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <GkButton to={closing.primaryCta.to} variant="primary" onDark>
                {closing.primaryCta.label}
              </GkButton>
              <GkButton
                to={closing.secondaryCta.to}
                variant="tertiary"
                onDark
                withArrow
              >
                {closing.secondaryCta.label}
              </GkButton>
            </div>
          </div>
        </Reveal>

        {/* The far rail carries one line and nothing else. */}
        <div className="md:col-span-4 md:col-start-9 lg:col-start-10 lg:col-span-3">
          <p className="text-[length:var(--fs-sm)] text-[var(--n-400)]" data-mono>
            {closing.marginalia.value}
          </p>
        </div>
      </div>
    </section>
  )
}
