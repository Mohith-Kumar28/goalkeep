import { closing } from '@/content/homepage'
import { GkButton } from '@/components/primitives/gk-button'
import { Scribble } from '@/components/primitives/doodles'
import { FloatingField, PatternField, Ring } from '@/components/primitives/shapes'
import { Reveal } from '@/components/primitives/reveal'

/**
 * The bookend.
 *
 * Left-aligned, not centred — the empty right track is where the ring and the
 * margin note live, and a centred block here would close the page with the
 * same symmetry every landing page ends on.
 */
export function Closing() {
  return (
    <section
      data-ground="navy"
      className="ground-navy accent-yellow relative overflow-hidden py-20 md:py-32"
      aria-labelledby="closing-heading"
    >
      <PatternField pattern="arcs" color="#ffffff" opacity={0.06} scale={96} />
      <FloatingField variant="c" />

      <Ring
        size={260}
        thickness={20}
        spin={190}
        className="pointer-events-none absolute -right-20 top-1/2 hidden -translate-y-1/2 opacity-40 xl:block"
      />

      <div className="shell relative grid gap-8 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <Reveal>
            <p className="eyebrow mb-4">{closing.eyebrow}</p>
            <h2 id="closing-heading" className="display max-w-[15ch]">
              {closing.headlineLead}{' '}
              <span className="keyword-mark">{closing.headlineKeyword}</span>{' '}
              {closing.headlineTail}
              <span className="mt-4 block text-[var(--gk-yellow)]">
                {closing.headlineSecondLine}
              </span>
            </h2>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="mt-12 flex flex-wrap items-center gap-4">
              <GkButton
                to={closing.primaryCta.to}
                variant="primary"
                onDark
                magnetic
                withArrow
              >
                {closing.primaryCta.label}
              </GkButton>
              <GkButton to={closing.secondaryCta.to} variant="ghost" onDark>
                {closing.secondaryCta.label}
              </GkButton>
            </div>
          </Reveal>
        </div>

        <div className="hidden lg:col-span-4 lg:block">
          <span
            aria-hidden="true"
            className="mt-6 flex items-start gap-2 text-[var(--gk-yellow)]"
          >
            <Scribble name="arrow-curve" color="var(--gk-yellow)" className="h-16 w-12 -scale-x-100" />
            <span className="hand mt-6 -rotate-3 whitespace-pre-line leading-tight">
              {closing.marginalia.value}
            </span>
          </span>
        </div>
      </div>
    </section>
  )
}
