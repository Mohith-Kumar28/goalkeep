import { AudienceSelector } from '@/components/primitives/audience-selector'
import { Reveal } from '@/components/primitives/reveal'
import { audienceSection, audiences } from '@/content/homepage'

/**
 * Band 4 — CORAL (people).
 *
 * The opener is charcoal-only and deliberately tall: it is the accent-free
 * buffer between the blue band above and the first coral pixel below.
 */
export function Audiences() {
  return (
    <section
      className="band band-coral relative overflow-hidden"
      style={{
        backgroundColor: 'var(--gk-coral-tint)',
        '--band-accent': 'var(--gk-coral)',
        '--band-accent-tint': '#fff',
        '--link-color': 'var(--gk-coral-ink)',
        '--link-color-hover': 'var(--gk-charcoal)',
      } as React.CSSProperties}
      aria-labelledby="audiences-heading"
    >
      <div className="shell relative">
        <Reveal className="flex flex-col gap-5 pb-8 md:pb-10">
          <p className="eyebrow-band">{audienceSection.eyebrow}</p>
          <div className="grid gap-4 md:grid-cols-12 md:items-end md:gap-8">
            <h2 id="audiences-heading" className="h2 text-[var(--fg-1)] md:col-span-7">
              {audienceSection.headline}
            </h2>
            <p className="lead text-[var(--fg-2)] md:col-span-5 md:pb-1">
              {audienceSection.lead}
            </p>
          </div>
        </Reveal>

        <div className="pt-6 md:pt-8">
          <AudienceSelector audiences={audiences} />
        </div>
      </div>
    </section>
  )
}
