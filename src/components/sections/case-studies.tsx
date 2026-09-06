import { Link } from '@tanstack/react-router'
import { caseStudies, caseStudySection } from '@/content/homepage'
import type { CaseStudy } from '@/content/types'
import { GkButton } from '@/components/primitives/gk-button'
import { Reveal } from '@/components/primitives/reveal'
import { cn } from '@/lib/utils'

/**
 * Case studies.
 *
 * "Use the 10x Impact Labs website as a reference for the case study section —
 * to avoid the current scrolling issues and improve the look and feel."
 *
 * The horizontal rail is therefore gone. It was the source of the scroll
 * problem reported live in the call ("what's happening is that scrolling is a
 * problem — there's a little scrolling problem"): a full-bleed
 * `overflow-x: auto` region under the pointer intercepts trackpad scrolling
 * that is even slightly off-axis, so the page stops moving while the rail
 * eats the gesture.
 *
 * A static grid has no such failure mode, shows five cards at once instead of
 * two and a half, and is the shape the reference site actually uses. The lead
 * card runs full width; the rest are a three-up row.
 *
 * "The read case study can be almost this type of effect. It doesn't have to
 * be a button" — so every card ends in a text link, not a button.
 */
export function CaseStudies() {
  /*
   * Three shapes, not one grid. The lead runs full width, the middle three sit
   * three-up, and the post-mortem — the one project where the answer was wrong
   * — takes the full width again at the bottom.
   *
   * It gets its own row because it is the page's credibility keystone and
   * because five cards in a three-column grid leaves it orphaned in a row of
   * one, which reads as a layout accident rather than an emphasis.
   */
  const postMortem = caseStudies.find((study) => study.inverse)
  const [lead, ...rest] = caseStudies.filter((study) => !study.inverse)

  return (
    <section
      className="ground-cream band accent-blue relative"
      aria-labelledby="case-studies-heading"
    >
      <div className="shell relative">
        <Reveal>
          <div className="mb-10 flex flex-col gap-5 md:mb-14 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="eyebrow mb-4">{caseStudySection.eyebrow}</p>
              <h2 id="case-studies-heading" className="h2 max-w-[22ch]">
                {caseStudySection.headline}{' '}
                <span className="font-medium text-[var(--fg-2)]">
                  {caseStudySection.headlineTail}
                </span>
              </h2>
            </div>
            <GkButton to={caseStudySection.cta.to} variant="secondary" withArrow>
              {caseStudySection.cta.label}
            </GkButton>
          </div>
        </Reveal>

        <Reveal>
          <LeadCard study={lead} />
        </Reveal>

        <ul className="mt-6 grid gap-6 md:grid-cols-3">
          {rest.map((study, index) => (
            <Reveal as="li" key={study.slug} delay={index * 0.07} className="h-full">
              <Card study={study} />
            </Reveal>
          ))}
        </ul>

        {postMortem && (
          <Reveal delay={0.1}>
            <PostMortemCard study={postMortem} />
          </Reveal>
        )}
      </div>
    </section>
  )
}

/** The lead case study: photograph left, the number and the claim right. */
function LeadCard({ study }: { study: CaseStudy }) {
  return (
    <article className="card-lift grid overflow-hidden rounded-[var(--r-lg)] border border-[var(--hairline)] bg-[var(--gk-white)] md:grid-cols-2">
      {study.image && (
        <img
          src={study.image}
          alt={study.imageAlt ?? ''}
          loading="lazy"
          decoding="async"
          className="h-full min-h-[16rem] w-full object-cover"
        />
      )}
      <div className="flex flex-col justify-center gap-4 p-8 md:p-12">
        <ul className="flex flex-wrap gap-2">
          {study.tags.map((tag) => (
            <li
              key={tag}
              className="chip bg-[var(--gk-cream-deep)] text-[length:var(--fs-xs)] text-[var(--gk-navy)]"
            >
              {tag}
            </li>
          ))}
        </ul>
        <p className="stat-figure text-[length:clamp(2rem,4vw,2.75rem)] text-[var(--gk-navy)]">
          {study.stat.value}
        </p>
        <h3 className="h3 max-w-[24ch]">{study.title}</h3>
        <Link to="/case-studies" className="link-cta mt-2 self-start">
          Read case study
        </Link>
      </div>
    </article>
  )
}

/**
 * The honest one. No photograph — there is nothing to show off — so it is
 * carried by the navy ground and the claim itself.
 */
function PostMortemCard({ study }: { study: CaseStudy }) {
  return (
    <article
      data-ground="navy"
      className="mt-6 grid gap-6 rounded-[var(--r-lg)] bg-[var(--gk-navy)] p-8 text-white md:grid-cols-12 md:items-center md:gap-10 md:p-12"
    >
      <div className="md:col-span-7">
        <ul className="flex flex-wrap gap-2">
          {study.tags.map((tag) => (
            <li key={tag} className="chip bg-white/12 text-[length:var(--fs-xs)] text-white">
              {tag}
            </li>
          ))}
        </ul>
        <h3 className="h3 mt-4 max-w-[28ch] text-[length:clamp(1.25rem,2vw,1.625rem)]">
          {study.title}
        </h3>
        {study.body && (
          <p className="mt-3 max-w-[56ch] text-[length:var(--fs-base)] text-white/80">
            {study.body}
          </p>
        )}
      </div>

      <div className="flex flex-col items-start gap-4 md:col-span-5 md:items-end md:text-right">
        <p className="stat-figure text-[length:clamp(1.5rem,2.4vw,2rem)] text-[var(--gk-yellow)]">
          {study.stat.value}
        </p>
        <Link to="/case-studies" className="link-cta text-[var(--gk-yellow)] hover:text-white">
          Read case study
        </Link>
      </div>
    </article>
  )
}

function Card({ study }: { study: CaseStudy }) {
  const inverse = Boolean(study.inverse)

  return (
    <article
      className={cn(
        'card-lift flex h-full flex-col overflow-hidden rounded-[var(--r-lg)] border',
        inverse
          ? 'border-transparent bg-[var(--gk-navy)] text-white'
          : 'border-[var(--hairline)] bg-[var(--gk-white)] text-[var(--gk-ink)]',
      )}
      data-ground={inverse ? 'navy' : undefined}
    >
      {study.image ? (
        <img
          src={study.image}
          alt={study.imageAlt ?? ''}
          loading="lazy"
          decoding="async"
          className="aspect-[16/10] w-full object-cover"
        />
      ) : null}

      <div className="flex flex-1 flex-col gap-3 p-7">
        <ul className="flex flex-wrap gap-2">
          {study.tags.map((tag) => (
            <li
              key={tag}
              className={cn(
                'chip text-[length:var(--fs-xs)]',
                inverse
                  ? 'bg-white/12 text-white'
                  : 'bg-[var(--gk-cream-deep)] text-[var(--gk-navy)]',
              )}
            >
              {tag}
            </li>
          ))}
        </ul>

        <p
          className={cn(
            'stat-figure text-[length:clamp(1.375rem,2.2vw,1.75rem)]',
            inverse ? 'text-[var(--gk-yellow)]' : 'text-[var(--gk-navy)]',
          )}
        >
          {study.stat.value}
        </p>

        <h3 className="h3 text-[length:var(--fs-lg)]">{study.title}</h3>

        {study.body && (
          <p
            className={cn(
              'text-[length:var(--fs-sm)]',
              inverse ? 'text-white/80' : 'text-[var(--fg-2)]',
            )}
          >
            {study.body}
          </p>
        )}

        <Link
          to="/case-studies"
          className={cn(
            'link-cta mt-auto self-start pt-4 text-[length:var(--fs-sm)]',
            inverse && 'text-[var(--gk-yellow)] hover:text-white',
          )}
        >
          Read case study
        </Link>
      </div>
    </article>
  )
}
