import { Link } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'
import { CardRail } from '@/components/primitives/card-rail'
import { GkButton } from '@/components/primitives/gk-button'
import { Reveal } from '@/components/primitives/reveal'
import { caseStudies, caseStudySection } from '@/content/homepage'
import type { CaseStudy } from '@/content/types'
import { cn } from '@/lib/utils'

/**
 * Band 5 — TEAL (outcome).
 *
 * Accessibility catch worth stating: #6EBFAC fails contrast at small sizes on
 * cream, so the eyebrow and the position rail use teal-DEEP (#4A9C88). Pure
 * teal only ever appears as a tint fill. Teal never carries text under 24px.
 */
export function CaseStudies() {
  return (
    <section
      className="band"
      style={{
        backgroundColor: 'var(--bg-1)',
        '--band-accent': 'var(--gk-teal-deep)',
        '--band-accent-tint': 'var(--gk-teal-tint)',
        '--link-color': 'var(--gk-teal-ink)',
        '--link-color-hover': 'var(--gk-charcoal)',
      } as React.CSSProperties}
      aria-labelledby="case-studies-heading"
    >
      <div className="shell">
        <Reveal className="flex flex-col gap-5 pb-8 md:flex-row md:items-end md:gap-12 md:pb-6">
          <div className="flex max-w-[52ch] flex-col gap-4">
            <p className="eyebrow-band band-teal">{caseStudySection.eyebrow}</p>
            <h2 id="case-studies-heading" className="h2 text-[var(--fg-1)]">
              {caseStudySection.headline}
            </h2>
            <p className="lead text-[var(--fg-2)]">{caseStudySection.lead}</p>
          </div>
          <div className="shrink-0 md:ml-auto md:pb-1">
            <GkButton to={caseStudySection.cta.to} variant="tertiary" withArrow>
              {caseStudySection.cta.label}
            </GkButton>
          </div>
        </Reveal>
      </div>

      {/* Rail starts at the shell's left edge and runs off the right, so the
          cut-off card communicates scrollability without a decorative cue. */}
      <div className="shell !pr-0">
        <CardRail label="Case studies" controlsClassName="pr-4 md:pr-12 xl:pr-16">
          {caseStudies.map((study, i) => (
            <CaseStudyCard key={study.slug} study={study} index={i} />
          ))}
          <div className="w-4 shrink-0 md:w-8" aria-hidden="true" />
        </CardRail>
      </div>
    </section>
  )
}

const CARD_HUES = [
  { fill: 'var(--gk-teal-tint)', solid: 'var(--gk-teal)' },
  { fill: 'var(--gk-blue-tint)', solid: 'var(--gk-blue)' },
  { fill: 'var(--gk-coral-tint)', solid: 'var(--gk-coral)' },
  { fill: 'var(--gk-yellow-tint)', solid: 'var(--gk-yellow)' },
]

function CaseStudyCard({ study, index }: { study: CaseStudy; index: number }) {
  const inverse = study.inverse === true
  const hue = CARD_HUES[index % CARD_HUES.length]

  return (
    <Link
      to="/case-studies"
      className={cn(
        'group flex w-[85vw] flex-col overflow-hidden rounded-[var(--r-md)] sm:w-[360px]',
        'transition-shadow duration-[var(--dur-base)] ease-[var(--ease-out)]',
        'shadow-[var(--shadow-xs)] hover:shadow-[var(--shadow-sm)]',
        inverse
          ? 'bg-[var(--gk-charcoal)]'
          : 'border border-[var(--hairline)] bg-[var(--bg-1)]',
      )}
    >
      {!inverse && (
        <>
          {study.image && (
            <img
              src={study.image}
              alt={study.imageAlt ?? ''}
              loading="lazy"
              decoding="async"
              width={720}
              height={480}
              className="aspect-[3/2] w-full object-cover"
            />
          )}
          <div
            className="px-6 py-4"
            style={{ backgroundColor: hue.fill }}
          >
            <p className="stat-figure text-[length:var(--fs-base)] font-black text-[var(--gk-charcoal)]">
              {study.stat.value}
            </p>
          </div>
        </>
      )}

      <div className="flex flex-1 flex-col gap-4 p-6">
        <ul className="flex flex-wrap gap-2">
          {study.tags.map((tag) => (
            <li
              key={tag}
              className={cn(
                'rounded-[var(--r-pill)] px-3 py-1 text-[length:var(--fs-sm)] font-bold',
                inverse
                  ? 'border border-white/40 text-white'
                  : 'text-[var(--gk-charcoal)]',
              )}
              style={inverse ? undefined : { backgroundColor: hue.fill }}
            >
              {tag}
            </li>
          ))}
        </ul>

        <h3
          className={cn('h3', inverse ? 'text-white' : 'text-[var(--fg-1)]')}
        >
          {study.title}
        </h3>

        {study.body && (
          <p className="text-[length:var(--fs-base)] text-[var(--n-200)]">
            {study.body}
          </p>
        )}

        {inverse && (
          <p className="mt-auto text-[length:var(--fs-sm)] text-[var(--n-400)]" data-mono>
            {study.stat.value}
          </p>
        )}

        <span
          className={cn(
            'inline-flex items-center gap-2 text-[length:var(--fs-base)] font-bold',
            inverse ? 'text-white' : 'text-[var(--link-color)]',
          )}
        >
          Read the case study
          <ArrowRight
            aria-hidden="true"
            strokeWidth={1.75}
            className="size-4 transition-transform duration-[var(--dur-fast)] ease-[var(--ease-out)] group-hover:translate-x-[3px]"
          />
        </span>
      </div>
    </Link>
  )
}
