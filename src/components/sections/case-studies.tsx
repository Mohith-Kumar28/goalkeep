import { caseStudies, caseStudySection } from '@/content/homepage'
import type { CaseStudy } from '@/content/types'
import { GkButton } from '@/components/primitives/gk-button'
import { CardRail } from '@/components/primitives/card-rail'
import { TiltCard } from '@/components/primitives/tilt-card'
import { Scribble } from '@/components/primitives/doodles'
import { PatternField } from '@/components/primitives/shapes'
import { Reveal } from '@/components/primitives/reveal'
import { cn } from '@/lib/utils'

/**
 * A rail of sticker cards on navy.
 *
 * Cards carry one photograph and one number. Everything else that used to sit
 * on them — the second sentence, the third tag — went, because the number is
 * the only thing anyone reads on a card in a horizontal scroller.
 *
 * The last card is the honest one: no photograph, inverted, the project where
 * the answer was wrong. It is the reason the other four are believable.
 */
const CARD_HUES = [
  'var(--gk-yellow)',
  'var(--gk-teal)',
  'var(--gk-coral)',
  'var(--gk-yellow)',
]

export function CaseStudies() {
  return (
    <section
      data-ground="navy"
      className="ground-navy band accent-teal relative overflow-hidden"
      aria-labelledby="case-studies-heading"
    >
      <PatternField pattern="grid" color="#ffffff" opacity={0.05} scale={56} />

      <div className="shell relative">
        <Reveal>
          <div className="mb-10 flex flex-col gap-5 md:mb-14 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="eyebrow mb-3">{caseStudySection.eyebrow}</p>
              <h2 id="case-studies-heading" className="h2 max-w-[20ch]">
                {caseStudySection.headline}{' '}
                <span className="text-[var(--gk-yellow)]">
                  {caseStudySection.headlineTail}
                </span>
              </h2>
            </div>
            <GkButton to={caseStudySection.cta.to} variant="ghost" onDark withArrow>
              {caseStudySection.cta.label}
            </GkButton>
          </div>
        </Reveal>
      </div>

      {/* Bleeds off the right edge so the rail reads as continuing. */}
      <div className="shell relative !pr-0">
        <CardRail label="Case studies" controlsClassName="pr-4 md:pr-12 xl:pr-16">
          {caseStudies.map((study, index) => (
            <Card key={study.slug} study={study} hue={CARD_HUES[index % 4]} />
          ))}
        </CardRail>
      </div>
    </section>
  )
}

function Card({ study, hue }: { study: CaseStudy; hue: string }) {
  const tilt = study.inverse ? 1.2 : -1.2

  return (
    <TiltCard className="w-[19rem] shrink-0 md:w-[23rem]" max={7}>
      <article
        className={cn(
          'flex h-full flex-col overflow-hidden rounded-[var(--r-lg)] border-2 border-[var(--gk-ink)]',
          'shadow-[8px_8px_0_var(--gk-ink)]',
          study.inverse
            ? 'bg-[var(--gk-navy-deep)] text-white'
            : 'bg-[var(--gk-cream)] text-[var(--gk-ink)]',
        )}
        style={{ transform: `rotate(${tilt}deg)` }}
      >
        {study.image ? (
          <img
            src={study.image}
            alt={study.imageAlt ?? ''}
            loading="lazy"
            decoding="async"
            className="aspect-[3/2] w-full border-b-2 border-[var(--gk-ink)] object-cover"
          />
        ) : (
          <div className="grid aspect-[3/2] w-full place-items-center border-b-2 border-[var(--gk-ink)] bg-[var(--gk-navy)]">
            <Scribble name="cross" color="var(--gk-coral)" className="h-16 w-16" />
          </div>
        )}

        <div
          className="border-b-2 border-[var(--gk-ink)] px-6 py-4"
          style={{
            background: study.inverse ? 'var(--gk-coral)' : hue,
            color: 'var(--gk-ink)',
          }}
        >
          <p className="stat-figure text-[length:clamp(1.5rem,2.6vw,2rem)]">
            {study.stat.value}
          </p>
        </div>

        <div className="flex flex-1 flex-col gap-3 p-6">
          <ul className="flex flex-wrap gap-2">
            {study.tags.map((tag) => (
              <li
                key={tag}
                className={cn(
                  'chip border-2 text-[length:var(--fs-xs)]',
                  study.inverse
                    ? 'border-white/50 text-white'
                    : 'border-[var(--gk-ink)] text-[var(--gk-ink)]',
                )}
              >
                {tag}
              </li>
            ))}
          </ul>
          <h3 className="h3 text-[length:var(--fs-lg)]">{study.title}</h3>
          {study.body && (
            <p className="text-[length:var(--fs-sm)] text-white/80">{study.body}</p>
          )}
        </div>
      </article>
    </TiltCard>
  )
}
