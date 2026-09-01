import { GkButton } from '@/components/primitives/gk-button'
import { Reveal } from '@/components/primitives/reveal'
import { pillars, whatWeDo, whatWeDoStat } from '@/content/homepage'
import type { Pillar } from '@/content/types'

const HUE: Record<Pillar['hue'], { solid: string; deep: string; tint: string; on: string }> = {
  blue: {
    solid: 'var(--gk-blue)',
    deep: 'var(--gk-blue-ink)',
    tint: 'var(--gk-blue-tint)',
    on: '#fff',
  },
  teal: {
    solid: 'var(--gk-teal)',
    deep: 'var(--gk-teal-ink)',
    tint: 'var(--gk-teal-tint)',
    on: 'var(--gk-charcoal)',
  },
  coral: {
    solid: 'var(--gk-coral)',
    deep: 'var(--gk-coral-ink)',
    tint: 'var(--gk-coral-tint)',
    on: 'var(--gk-charcoal)',
  },
}

/** Design, build, adopt — as three colour-blocked stages rather than a menu. */
export function WhatWeDo() {
  return (
    <section
      className="band relative overflow-hidden"
      style={{ backgroundColor: 'var(--bg-1)' }}
      aria-labelledby="what-we-do-heading"
    >
      <div className="shell relative">
        <Reveal className="flex flex-col gap-5 pb-8 md:pb-12">
          <p className="eyebrow-band band-blue">{whatWeDo.eyebrow}</p>
          <div className="grid gap-4 md:grid-cols-12 md:items-end md:gap-8">
            <h2
              id="what-we-do-heading"
              className="h2 text-[var(--fg-1)] md:col-span-7"
            >
              {whatWeDo.headline}
            </h2>
            <p className="lead text-[var(--fg-2)] md:col-span-5 md:pb-1">
              {whatWeDo.lead}
            </p>
          </div>
        </Reveal>

        <ol className="grid gap-5 md:grid-cols-3">
          {pillars.map((pillar, i) => {
            const hue = HUE[pillar.hue]
            return (
              <Reveal as="li" key={pillar.index} delay={i * 0.06}>
                <article
                  className="card-tinted relative flex h-full flex-col gap-4 overflow-hidden p-7 md:p-8"
                  style={{ backgroundColor: hue.tint }}
                >
                  <span
                    className="relative grid size-11 place-items-center rounded-full text-[length:var(--fs-sm)] font-black"
                    style={{ backgroundColor: hue.solid, color: hue.on }}
                    data-mono
                  >
                    {pillar.index}
                  </span>

                  <h3 className="h3 relative text-[var(--fg-1)]">{pillar.title}</h3>
                  <p className="relative text-[var(--fg-1)]">{pillar.body}</p>

                  {pillar.marginalia && (
                    <p
                      className="relative mt-auto pt-2 text-[length:var(--fs-sm)]"
                      style={{ color: hue.deep }}
                      data-mono
                    >
                      {pillar.marginalia}
                    </p>
                  )}
                </article>
              </Reveal>
            )
          })}
        </ol>

        {/* The honest stat, as a full-width charcoal block that breaks the
            three-card rhythm rather than sitting inside it. */}
        <Reveal delay={0.12}>
          <div
            className="mt-5 flex flex-col items-start gap-6 overflow-hidden rounded-[var(--r-lg)] p-8 md:flex-row md:items-center md:justify-between md:p-10"
            style={{ backgroundColor: 'var(--gk-charcoal)' }}
          >
            <div className="flex items-center gap-6">
              <p
                className="stat-figure text-[clamp(2.75rem,6vw,4rem)] font-black text-[var(--gk-yellow)]"
              >
                {whatWeDoStat.value.figure}
              </p>
              <p className="max-w-[34ch] text-[length:var(--fs-lg)] leading-snug text-white">
                {whatWeDoStat.value.sentence}
              </p>
            </div>
            <GkButton to={whatWeDo.cta.to} variant="primary" onDark>
              {whatWeDo.cta.label}
            </GkButton>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
