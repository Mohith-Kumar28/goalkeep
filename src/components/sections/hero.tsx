import { GkButton } from '@/components/primitives/gk-button'
import { RotatingPhrase } from '@/components/primitives/rotating-phrase'
import { hero } from '@/content/homepage'

const STAGE_HUE: Record<string, { bg: string; fg: string }> = {
  blue: { bg: 'var(--gk-blue)', fg: '#fff' },
  teal: { bg: 'var(--gk-teal)', fg: 'var(--gk-charcoal)' },
  coral: { bg: 'var(--gk-coral)', fg: 'var(--gk-charcoal)' },
}

export function Hero() {
  return (
    <section className="relative overflow-hidden pb-10 pt-10 md:pb-20 md:pt-16" style={{ backgroundColor: 'var(--bg-2)' }}>
      <div className="shell relative">
        <div className="grid items-center gap-12 md:grid-cols-12 md:gap-8">
          <div className="flex flex-col gap-6 pb-4 md:col-span-7 md:pb-6">
            <p className="eyebrow-band band-blue">{hero.eyebrow}</p>

            <h1 className="display max-w-[20ch] text-[clamp(2.25rem,5.2vw,3.5rem)] text-[var(--fg-1)]">
              {hero.headlineLead} {hero.headlineTail}{' '}
              <span className="whitespace-nowrap">
                <RotatingPhrase phrases={hero.rotatingPhrases} /> {hero.headlineEnd}
              </span>
            </h1>

            <p className="lead max-w-[52ch] text-[var(--fg-1)]">{hero.lead}</p>

            {/* Design → build → adopt, stated as a set before the page
                explains them one at a time. */}
            <ul className="flex flex-wrap items-center gap-2">
              {hero.stages.map((stage) => {
                const hue = STAGE_HUE[stage.hue]
                return (
                  <li
                    key={stage.label}
                    className="rounded-[var(--r-pill)] px-4 py-1.5 text-[length:var(--fs-sm)] font-extrabold"
                    style={{ backgroundColor: hue.bg, color: hue.fg }}
                  >
                    {stage.label}
                  </li>
                )
              })}
            </ul>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <GkButton to={hero.primaryCta.to} variant="primary">
                {hero.primaryCta.label}
              </GkButton>
              <GkButton to={hero.secondaryCta.to} variant="secondaryAccent">
                {hero.secondaryCta.label}
              </GkButton>
            </div>

            <p className="text-[length:var(--fs-sm)] text-[var(--fg-2)]" data-mono>
              {hero.marginalia}
            </p>
          </div>

          <div className="md:col-span-5">
            <HeroPanel />
          </div>
        </div>
      </div>
    </section>
  )
}

/**
 * A real photograph, with the stat sitting on it as a caption rather than
 * replacing it. The image carries the sector; the figure carries the argument.
 */
function HeroPanel() {
  return (
    <div className="relative">
      <figure className="relative overflow-hidden rounded-[var(--r-lg)]">
        <img
          src="/photos/field-meeting.jpg"
          alt="A women's group meeting outdoors, seated in a circle"
          width={800}
          height={600}
          fetchPriority="high"
          decoding="async"
          className="aspect-[4/3] w-full object-cover"
        />
      </figure>

      {/* The honest stat, tucked under the image where it reads as a note on
          the work rather than as the headline. */}
      <div
        className="relative -mt-10 ml-6 mr-10 rounded-[var(--r-md)] p-6 md:-mt-14 md:p-7"
        style={{ backgroundColor: 'var(--gk-charcoal)' }}
      >
        <p className="stat-figure text-[clamp(2.25rem,5vw,3rem)] font-black text-[var(--gk-yellow)]">
          {hero.panel.stat}
        </p>
        <p className="mt-2 max-w-[26ch] text-[length:var(--fs-base)] font-bold leading-snug text-white">
          {hero.panel.line}
        </p>
      </div>
    </div>
  )
}
