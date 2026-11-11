import { Link } from '@tanstack/react-router'
import type { ReactNode } from 'react'
import { caseStudies, caseStudySection } from '@/content/homepage'
import { caseStudies as studyPages, caseStudyHref } from '@/content/design/case-studies'
import type { CaseStudy } from '@/content/types'
import { GkButton } from '@/components/primitives/gk-button'
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
 *
 * 21 Oct: the homepage launches on its own, so the cards are static - no
 * "Read case study" links and no "Read all case studies" button until the
 * case-study pages exist. Vanavil made way for Dasra and SVP India.
 *
 * 10 Nov: the pages exist now. A card whose organisation has one opens it,
 * and the section links to the full list.
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
      id="case-studies"
      className="ground-cream band accent-blue relative scroll-mt-24"
      aria-labelledby="case-studies-heading"
    >
      <div className="shell relative">
        <Reveal>
          <div className="mb-8 flex flex-col items-start gap-5 md:mb-10 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="eyebrow mb-4">{caseStudySection.eyebrow}</p>
              <h2 id="case-studies-heading" className="h2 max-w-[36ch]">
                {caseStudySection.headline} <em>{caseStudySection.headlineTail}</em>
              </h2>
            </div>
            <GkButton to="/case-studies" variant="secondary" withArrow className="shrink-0">
              All case studies
            </GkButton>
          </div>
        </Reveal>

        {/* 10 Nov: on phones the four cards are one swipe row instead of a
            tall stack. Touch scrolls it cleanly; the trackpad problem above
            was a desktop one, and from md up this is the grid again. */}
        <ul className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 [scrollbar-width:none] md:mx-0 md:grid md:grid-cols-3 md:gap-6 md:overflow-visible md:px-0 md:pb-0">
          <Reveal as="li" className="w-[85%] shrink-0 snap-center md:col-span-3 md:w-auto">
            <LeadCard study={lead} />
          </Reveal>
          {rest.map((study, index) => (
            <Reveal
              as="li"
              key={study.slug}
              delay={index * 0.07}
              className="w-[85%] shrink-0 snap-center md:w-auto"
            >
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
  'Theory of Change in practice': 'var(--gk-blue-tint)',
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

const pageFor = (study: CaseStudy) => studyPages.find((candidate) => candidate.org === study.org)

/**
 * The card opens the organisation's case-study page, when it has one. A
 * linked card cannot hold a Read more button, so its text is cut at four
 * lines on phones instead; the page has the rest.
 */
function StudyLink({ study, children }: { study: CaseStudy; children: ReactNode }) {
  const page = pageFor(study)
  if (!page) return children
  return (
    <Link
      to={caseStudyHref(page.slug)}
      aria-label={`${study.org} case study`}
      className="card-lift block h-full rounded-[var(--r-lg)]"
    >
      {children}
    </Link>
  )
}

/** The lead case study: photograph left, the story right. */
function LeadCard({ study }: { study: CaseStudy }) {
  return (
    <StudyLink study={study}>
      <article className="flex h-full flex-col overflow-hidden rounded-[var(--r-lg)] border border-[var(--hairline)] bg-[var(--gk-white)] md:grid md:grid-cols-2">
        {/* The photo fills the row the text sets rather than sizing it. Sized by
            its own aspect ratio, it grew the card ~100px when the lazy image
            arrived - in the middle of a scroll to the contact form, which then
            stopped short (23 Oct). */}
        <div className="relative aspect-[16/10] md:aspect-auto md:min-h-[16rem]">
          <img
            src={study.image}
            alt={study.imageAlt}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover"
          />
        </div>
        <div className="flex flex-col gap-3 p-5 md:justify-center md:gap-4 md:p-12">
          <Byline study={study} size="lg" />
          <p className="max-w-[46ch] text-[length:var(--fs-sm)] leading-relaxed text-[var(--fg-1)] md:text-[length:var(--fs-base)]">
            {study.body}
          </p>
        </div>
      </article>
    </StudyLink>
  )
}

function Card({ study }: { study: CaseStudy }) {
  return (
    <StudyLink study={study}>
      <article className="flex h-full flex-col overflow-hidden rounded-[var(--r-lg)] border border-[var(--hairline)] bg-[var(--gk-white)] text-[var(--gk-ink)]">
        <img
          src={study.image}
          alt={study.imageAlt}
          loading="lazy"
          decoding="async"
          className="aspect-[16/10] w-full object-cover"
        />

        <div className="flex flex-1 flex-col gap-3 p-5 md:p-7">
          <Byline study={study} />

          <p className="text-[length:var(--fs-sm)] leading-relaxed text-[var(--fg-1)]">{study.body}</p>
        </div>
      </article>
    </StudyLink>
  )
}
