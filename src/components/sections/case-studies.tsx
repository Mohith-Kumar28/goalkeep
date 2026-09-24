import { Link } from '@tanstack/react-router'
import { caseStudies, caseStudySection } from '@/content/homepage'
import type { CaseStudy } from '@/content/types'
import { GkButton } from '@/components/primitives/gk-button'
import { Marker } from '@/components/primitives/marker'
import { Reveal } from '@/components/primitives/reveal'

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
 * "The read case study can be almost this type of effect. It doesn't have to
 * be a button" — so every card ends in a text link, not a button.
 *
 * What the copy replacement changed:
 *
 *   · The cards no longer lead on a before/after figure. "11 hrs → 40 min" and
 *     the four titles that went with them were replaced by one paragraph each
 *     about what changed and what it took, so the organisation's name is the
 *     card's headline and the prose carries the rest.
 *   · "Delete the post-mortem card." Gone, along with the navy inverse
 *     treatment it was the only user of.
 *   · Veruschka dropped out of the set; Peepul came in.
 *
 * 23 Sep: the programme name beside each organisation is replaced by two tags
 * - a neutral sector label and a tinted one for the work done.
 */
export function CaseStudies() {
  /*
   * Two shapes: the lead runs full width and the remaining three sit three-up.
   * Four cards is exactly the count this splits cleanly into, which is why
   * there is no third row any more.
   */
  const [lead, ...rest] = caseStudies

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
              <h2 id="case-studies-heading" className="h2 max-w-[36ch]">
                {caseStudySection.headline}{' '}
                <em>
                  {caseStudySection.headlineTail.split(caseStudySection.headlineMark)[0]}
                  <Marker>{caseStudySection.headlineMark}</Marker>
                  {caseStudySection.headlineTail.split(caseStudySection.headlineMark)[1]}
                </em>
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
      </div>
    </section>
  )
}

/*
 * The intervention tag takes a light brand tint, keyed to the kind of work so
 * the same intervention is always the same colour across the page.
 */
const INTERVENTION_TINTS: Record<string, string> = {
  'Data collection & visualisation': 'var(--gk-teal-tint)',
  'Theory of Change in practice': 'var(--gk-yellow-tint)',
  'Grant management systems': 'var(--gk-blue-tint)',
  'Capacity building': 'var(--gk-coral-tint)',
}

/** Two tags, then the organisation. */
function Byline({ study, size = 'sm' }: { study: CaseStudy; size?: 'sm' | 'lg' }) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-2">
        <span className="chip text-[length:var(--fs-xs)] text-[var(--gk-ink)]" style={{ background: 'var(--gk-beige-deep)' }}>
          {study.sector}
        </span>
        <span
          className="chip text-[length:var(--fs-xs)] text-[var(--gk-ink)]"
          style={{ background: INTERVENTION_TINTS[study.intervention] ?? 'var(--gk-teal-tint)' }}
        >
          {study.intervention}
        </span>
      </div>
      <h3
        className={
          size === 'lg'
            ? 'text-[length:clamp(1.375rem,2.2vw,1.75rem)] leading-tight font-extrabold'
            : 'text-[length:var(--fs-lg)] leading-tight font-extrabold'
        }
      >
        {study.org}
      </h3>
    </div>
  )
}

/** The lead case study: photograph left, the story right. */
function LeadCard({ study }: { study: CaseStudy }) {
  return (
    <article className="card-lift grid overflow-hidden rounded-[var(--r-lg)] border border-[var(--hairline)] bg-[var(--gk-white)] md:grid-cols-2">
      <img
        src={study.image}
        alt={study.imageAlt}
        loading="lazy"
        decoding="async"
        className="h-full min-h-[16rem] w-full object-cover"
      />
      <div className="flex flex-col justify-center gap-4 p-8 md:p-12">
        <Byline study={study} size="lg" />
        <p className="max-w-[46ch] text-[length:var(--fs-base)] leading-relaxed text-[var(--fg-1)]">
          {study.body}
        </p>
        <Link to="/case-studies" className="link-cta mt-2 self-start">
          Read case study
        </Link>
      </div>
    </article>
  )
}

function Card({ study }: { study: CaseStudy }) {
  return (
    <article className="card-lift flex h-full flex-col overflow-hidden rounded-[var(--r-lg)] border border-[var(--hairline)] bg-[var(--gk-white)] text-[var(--gk-ink)]">
      <img
        src={study.image}
        alt={study.imageAlt}
        loading="lazy"
        decoding="async"
        className="aspect-[16/10] w-full object-cover"
      />

      <div className="flex flex-1 flex-col gap-3 p-7">
        <Byline study={study} />

        <p className="text-[length:var(--fs-sm)] leading-relaxed text-[var(--fg-1)]">
          {study.body}
        </p>

        <Link
          to="/case-studies"
          className="link-cta mt-auto self-start pt-4 text-[length:var(--fs-sm)]"
        >
          Read case study
        </Link>
      </div>
    </article>
  )
}
